using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;
using Uno_API.Services;
using Uno_API.Services.ItineraryCopilot;
using System.Text;
using System.Globalization;
using System.Text.RegularExpressions;
using ClosedXML.Excel;
using System.IO;

namespace Uno_API.Controllers
{
    public class ExcelInconsistencyDto
    {
        public string Id { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // "HeadcountMismatch", "UnmappedRoomType", "DuplicatePassenger", "TourDiscrepancy"
        public string Severity { get; set; } = "Medium"; // "High", "Medium", "Low", "Info"
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string SuggestedFix { get; set; } = string.Empty;
        public string FixAction { get; set; } = string.Empty;
        public string FixValue { get; set; } = string.Empty;
        public bool IsResolved { get; set; } = false;
    }

    public class ExcelInspectionResultDto
    {
        public string FileName { get; set; } = string.Empty;
        public string NormalizedFileName { get; set; } = string.Empty;
        public string FileSize { get; set; } = string.Empty;
        public bool IsMetadataFile { get; set; } = false;
        public string? DetectedTourCode { get; set; }
        public string? ScreenTourCode { get; set; }
        public string? ScreenProjectCode { get; set; }
        public string? MatchedTourCode { get; set; }
        public string? MatchedProjectCode { get; set; }
        public bool RequiresTourConfirmation { get; set; } = false;
        public string ConfirmationMessage { get; set; } = string.Empty;
        public int PaxDetected { get; set; }
        public int PaxDeclared { get; set; }
        public List<string> Sheets { get; set; } = new();
        public List<ExcelInconsistencyDto> Inconsistencies { get; set; } = new();
        public bool CanCommit { get; set; } = true;
        public bool HasIncompleteHotelBookings { get; set; } = false;
        public int HotelBookingsCount { get; set; } = 0;
        public int? MatchedTourId { get; set; }
        public int? MatchedProjectId { get; set; }
        public string HotelBookingPrompt { get; set; } = string.Empty;
    }
    public class AIChatRequest
    {
        public string Query { get; set; } = string.Empty;
        public string? ContextUrl { get; set; }
        public string? Role { get; set; }
        public string? Category { get; set; }
    }

    public class GroundedDatapointDto
    {
        public string Field { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string? Entity { get; set; }
        public string Source { get; set; } = string.Empty;
        public bool Verified { get; set; } = true;
        public double Confidence { get; set; } = 1.0;
    }

    public class ConfidenceReportDto
    {
        public double Score { get; set; } = 1.0; // 0.0 - 1.0
        public string Level { get; set; } = "High"; // "High", "Moderate", "Low"
        public string GroundingType { get; set; } = "Live SQL Database"; // "Live SQL Database", "Authoritative SOP", "Inferred RAG", "General AI"
        public string VerificationSummary { get; set; } = string.Empty;
        public List<GroundedDatapointDto> Datapoints { get; set; } = new();
    }

    public class InquiryExtractionDto
    {
        public bool Success { get; set; } = true;
        public string FileName { get; set; } = string.Empty;
        public string FileSize { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public string TextSnippet { get; set; } = string.Empty;
        public string DetectedCorridor { get; set; } = "Budapest-Vienna-Prague";
        public int DetectedDays { get; set; } = 7;
        public int DetectedPax { get; set; } = 36;
        public int DetectedRooms { get; set; } = 18;
        public string DetectedSeason { get; set; } = "Autumn 2026";
        public decimal? DetectedBudgetCeiling { get; set; }
        public decimal DetectedTargetMarginPct { get; set; } = 20.0m;
        public List<string> DetectedThemes { get; set; } = new();
        public string SuggestedPrompt { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class AIChatResponse
    {
        public string Answer { get; set; } = string.Empty;
        public List<QuickActionLink>? RecommendedLinks { get; set; }
        public List<string>? SuggestedPills { get; set; }
        public string Mode { get; set; } = "Local-Hybrid-RAG";
        public string? SourceDocument { get; set; }
        public string? Category { get; set; }
        public ConfidenceReportDto? Confidence { get; set; }
        public ItineraryCopilotPayloadDto? ItineraryProposal { get; set; }
        public string? InvokedToolName { get; set; }
        public InquiryExtractionDto? InquiryExtraction { get; set; }
    }

    public class QuickActionLink
    {
        public string Label { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
    }

    [Route("api/ai")]
    [ApiController]
    public class AIChatController : ControllerBase
    {
        private readonly UnoDbContext _context;
        private readonly IKnowledgeRetrievalService _retrievalService;
        private readonly ITourProjectLookupService _entityLookupService;
        private readonly ILocalLlmService _llmService;
        private readonly IItineraryCopilotAgentService _itineraryCopilotService;
        private readonly IItineraryToolDispatcher _itineraryToolDispatcher;

        public AIChatController(
            UnoDbContext context, 
            IKnowledgeRetrievalService retrievalService, 
            ITourProjectLookupService entityLookupService,
            ILocalLlmService llmService,
            IItineraryCopilotAgentService itineraryCopilotService,
            IItineraryToolDispatcher itineraryToolDispatcher)
        {
            _context = context;
            _retrievalService = retrievalService;
            _entityLookupService = entityLookupService;
            _llmService = llmService;
            _itineraryCopilotService = itineraryCopilotService;
            _itineraryToolDispatcher = itineraryToolDispatcher;
        }

        [HttpPost("chat")]
        public async Task<ActionResult<AIChatResponse>> ProcessChatQuery([FromBody] AIChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Query))
            {
                return BadRequest(new { error = "Query text is required." });
            }

            // Itinerary Co-pilot Category Routing & Autonomous Intent Detection
            var qLower = request.Query.ToLowerInvariant();
            var qUpper = request.Query.ToUpperInvariant();
            bool isItineraryIntent =
                string.Equals(request.Category, "Itinerary", StringComparison.OrdinalIgnoreCase) ||
                qLower.Contains("design") ||
                qLower.Contains("itinerary") ||
                qLower.Contains("create_itinerary") ||
                qLower.Contains("regenerate_itinerary") ||
                qLower.Contains("publish_itinerary") ||
                qLower.Contains("unpublish_itinerary") ||
                qLower.Contains("update_itinerary_day") ||
                qLower.Contains("remove_itinerary_day") ||
                qLower.Contains("list_itineraries") ||
                qLower.Contains("ratehawk") ||
                qLower.Contains("quote") ||
                qLower.Contains("dual-tier") ||
                qUpper.Contains("PVB") ||
                qUpper.Contains("BVP") ||
                qUpper.Contains("VPB") ||
                qLower.Contains("guide_report") ||
                qLower.Contains("guide report") ||
                qLower.Contains("rehber raporu") ||
                ((qLower.Contains("cancel") || qLower.Contains("iptal") || qLower.Contains("remove") || qLower.Contains("delete")) &&
                 (qLower.Contains("hotel") || qLower.Contains("hotels") || qLower.Contains("booking") || qLower.Contains("bookings") || qLower.Contains("otel"))) ||
                (qLower.Contains("tour") && (qLower.Contains("pax") || qLower.Contains("day") || qLower.Contains("margin") || qLower.Contains("budapest") || qLower.Contains("vienna") || qLower.Contains("prague")));

            if (isItineraryIntent)
            {
                try
                {
                    var itineraryResponse = await _itineraryCopilotService.ExecuteAsync(request);
                    return Ok(itineraryResponse);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[AIChatController] Error executing itinerary copilot: {ex}");
                }
            }

            // 0. Specific Entity Live Database Lookup (Specific Tour, Project, Current City, Guide, Hotel, Margin, Pax)
            AIChatResponse? specificEntityResponse = null;
            try
            {
                specificEntityResponse = await _entityLookupService.TryHandleSpecificEntityQueryAsync(request.Query, request.ContextUrl, request.Role);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AIChatController] Error during entity lookup: {ex}");
            }

            var q = request.Query.Trim().ToLower();
            bool isTurkish = DetectTurkishLanguageInQuery(request.Query);
            var isLlmAvailable = await _llmService.IsLlmAvailableAsync();

            if (specificEntityResponse != null)
            {
                if (isLlmAvailable)
                {
                    try
                    {
                        var langInstruction = isTurkish
                            ? "The user query is in Turkish. Formulate your complete answer concisely in natural, professional Turkish using markdown. Retain exact numbers, currencies, tour codes, and markdown comparison tables from the factual data."
                            : "The user query is in English. Formulate your complete answer concisely in clear, professional English using markdown. Retain exact numbers, currencies, tour codes, and markdown comparison tables from the factual data.";

                        var systemPrompt = "You are the AI Assistant Copilot for UNO ERP, a tour operating enterprise platform.\n" +
                                           "Your role is to explain workflows, tour rankings, and system financials based on verified live database facts.\n" +
                                           $"{langInstruction}\n" +
                                           "Preserve markdown tables and exact numbers. Do not alter financial figures.";

                        var userPrompt = $"Verified Database Facts & Calculations:\n\"\"\"\n{specificEntityResponse.Answer}\n\"\"\"\n\nUser Question: {request.Query}";

                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));
                        var llmAnswer = await _llmService.GenerateChatResponseAsync(
                            systemPrompt,
                            userPrompt,
                            options: new LlmGenerationOptions { MaxTokens = 450, Temperature = 0.2f },
                            cancellationToken: cts.Token);

                        if (!string.IsNullOrWhiteSpace(llmAnswer))
                        {
                            // If original answer contains a full structured table or HIL warning, preserve it
                            bool hasPreservedStructure = specificEntityResponse.Answer.Contains("| Room #") ||
                                                         specificEntityResponse.Answer.Contains("| Oda No") ||
                                                         specificEntityResponse.Answer.Contains("Human-in-the-Loop") ||
                                                         specificEntityResponse.Answer.Contains("HIL");

                            if (hasPreservedStructure)
                            {
                                int preserveIdx = -1;
                                if (specificEntityResponse.Answer.Contains("### ⚠️"))
                                    preserveIdx = specificEntityResponse.Answer.IndexOf("### ⚠️");
                                else if (specificEntityResponse.Answer.Contains("### ✅"))
                                    preserveIdx = specificEntityResponse.Answer.IndexOf("### ✅");
                                else if (specificEntityResponse.Answer.Contains("### 📋"))
                                    preserveIdx = specificEntityResponse.Answer.IndexOf("### 📋");

                                if (preserveIdx > 0)
                                {
                                    string cleanLlmIntro = llmAnswer.Trim();
                                    int llmHeaderIdx = cleanLlmIntro.IndexOf("###");
                                    if (llmHeaderIdx > 0)
                                    {
                                        cleanLlmIntro = cleanLlmIntro.Substring(0, llmHeaderIdx).Trim();
                                    }

                                    specificEntityResponse.Answer = cleanLlmIntro + "\n\n" + specificEntityResponse.Answer.Substring(preserveIdx);
                                }
                                else
                                {
                                    specificEntityResponse.Answer = specificEntityResponse.Answer;
                                }
                            }
                            else
                            {
                                specificEntityResponse.Answer = llmAnswer.Trim();
                            }
                            specificEntityResponse.Mode = $"Local-LLM ({_llmService.GetConfiguredModelName()})";
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[AIChatController] Ollama synthesis over SQL facts timed out or errored: {ex.Message}");
                    }
                }

                return Ok(SanitizeResponse(specificEntityResponse));
            }

            var response = new AIChatResponse();
            var links = new List<QuickActionLink>();

            // 1. Live AppDB Queries & Data Intelligence (Dynamic Stats)
            if (((q.Contains("tour") && (q.Contains("summar") || q.Contains("how many") || q.Contains("count") || q.Contains("overview") || q.Contains("statistics"))) || (q.Contains("active") && q.Contains("tour"))) && !q.Contains("import") && !q.Contains("excel") && !q.Contains("checkpoint") && !q.Contains("gate") && !q.Contains("transition"))
            {
                var tourCount = await _context.Tours.CountAsync();
                var confirmedTours = await _context.Tours.Where(t => t.TourStatusId == 3).CountAsync();
                var totalRev = await _context.Tours.SumAsync(t => (decimal?)t.TotalFee) ?? 0m;

                response.Answer = "👋 **Live Tour Operational Summary**:\n\n" +
                    $"• **Total Tours Registered**: `{tourCount}` departures\n" +
                    $"• **Confirmed Status Tours**: `{confirmedTours}` active groups\n" +
                    $"• **Combined Tour Package Revenue**: `€{totalRev:N2}`\n\n" +
                    "Would you like to inspect specific departures on the Tours board or verify upcoming status gate checkpoints?";

                response.Confidence = new ConfidenceReportDto
                {
                    Score = 1.0,
                    Level = "High",
                    GroundingType = "Live SQL Database",
                    VerificationSummary = "Tours and financial rollups queried directly from SQL Server table [Tours]. 0% hallucination risk.",
                    Datapoints = new List<GroundedDatapointDto>
                    {
                        new GroundedDatapointDto { Field = "Total Tours", Value = $"{tourCount} departures", Source = "SQL: Tours (Count)", Verified = true, Confidence = 1.0 },
                        new GroundedDatapointDto { Field = "Confirmed Status", Value = $"{confirmedTours} groups", Source = "SQL: Tours (TourStatusId = 3)", Verified = true, Confidence = 1.0 },
                        new GroundedDatapointDto { Field = "Combined Revenue", Value = $"€{totalRev:N2}", Source = "SQL: Tours (TotalFee)", Verified = true, Confidence = 1.0 }
                    }
                };

                links.Add(new QuickActionLink { Label = "Open Tours Board", Path = "/tours" });
                response.RecommendedLinks = links;
                response.SuggestedPills = new List<string> { "Tour status transition criteria", "How to advance to Confirmed?", "Rooming list import" };
                response.Category = "Tours";
                return Ok(SanitizeResponse(response));
            }
            else if (q.Contains("active project") || q.Contains("how many project") || (q.Contains("summarize") && q.Contains("project")))
            {
                var projectCount = await _context.Projects.CountAsync();
                var activeProjects = await _context.Projects.Where(p => p.ProjectStatusId == 3).CountAsync();
                var totalBudget = await _context.Projects.SumAsync(p => (decimal?)p.ApproxBudget) ?? 0m;

                response.Answer = "👋 **Live Commercial Projects Summary**:\n\n" +
                    $"• **Total Master Projects**: `{projectCount}` contracts\n" +
                    $"• **Active Operational Projects**: `{activeProjects}` contracts\n" +
                    $"• **Combined Approx Budget**: `€{totalBudget:N2}`\n\n" +
                    "All individual tour departures roll up their financial performance into these parent projects.";

                response.Confidence = new ConfidenceReportDto
                {
                    Score = 1.0,
                    Level = "High",
                    GroundingType = "Live SQL Database",
                    VerificationSummary = "Aggregated directly from SQL Server table [Projects]. 0% hallucination risk.",
                    Datapoints = new List<GroundedDatapointDto>
                    {
                        new GroundedDatapointDto { Field = "Master Projects", Value = $"{projectCount} contracts", Source = "SQL: Projects (Count)", Verified = true, Confidence = 1.0 },
                        new GroundedDatapointDto { Field = "Active Projects", Value = $"{activeProjects} active", Source = "SQL: Projects (Status = Active)", Verified = true, Confidence = 1.0 },
                        new GroundedDatapointDto { Field = "Approx Budget", Value = $"€{totalBudget:N2}", Source = "SQL: Projects (ApproxBudget)", Verified = true, Confidence = 1.0 }
                    }
                };

                links.Add(new QuickActionLink { Label = "Open Projects Dashboard", Path = "/projects" });
                response.RecommendedLinks = links;
                response.SuggestedPills = new List<string> { "Why are Projects needed?", "How to create a project?", "Executive KPI Dashboard" };
                response.Category = "Projects";
                return Ok(SanitizeResponse(response));
            }
            else if (q.Contains("recent change") || q.Contains("what happened") || q.Contains("latest log"))
            {
                var recentLogs = await _context.AuditLogs.OrderByDescending(a => a.Timestamp).Take(3).ToListAsync();
                if (recentLogs.Count > 0)
                {
                    var logSummaries = string.Join("\n", recentLogs.Select(l => $"• **[{l.Timestamp:HH:mm}]** `{l.UserEmail}`: {l.Summary}"));
                    response.Answer = $"👋 **Recent System Audit History**:\n\n{logSummaries}\n\nAll changes to rates, dates, and access permissions are logged with full traceability.";
                }
                else
                {
                    response.Answer = "👋 No recent audit logs found in the database.";
                }
                response.Confidence = new ConfidenceReportDto
                {
                    Score = 1.0,
                    Level = "High",
                    GroundingType = "Live SQL Database",
                    VerificationSummary = "Retrieved directly from [AuditLogs] table. Full chronological fidelity.",
                    Datapoints = recentLogs.Select(l => new GroundedDatapointDto
                    {
                        Field = l.Action,
                        Value = l.Summary,
                        Entity = l.EntityName,
                        Source = "SQL: AuditLogs",
                        Verified = true,
                        Confidence = 1.0
                    }).ToList()
                };

                links.Add(new QuickActionLink { Label = "View Full Audit Logs", Path = "/audit-logs" });
                response.RecommendedLinks = links;
                response.SuggestedPills = new List<string> { "How to configure role access?", "How to view user change logs?" };
                return Ok(SanitizeResponse(response));
            }

            // 2. Intelligent Hybrid Knowledge Base Search (Local RAG + Local LLM)
            var topMatches = await _retrievalService.SearchTopMatchesAsync(request.Query, request.Category, 3);
            var matchResult = topMatches.FirstOrDefault();

            if (matchResult != null && matchResult.Score >= 6.0)
            {
                // Attempt Local LLM inference over retrieved RAG chunks
                if (isLlmAvailable)
                {
                    try
                    {
                        var ragChunks = topMatches.Take(2).Select(m => {
                            var text = m.Item.AnswerMarkdown;
                            if (text.Length > 1800) text = text.Substring(0, 1800) + "...";
                            return $"[Topic: {m.Item.Category} > {m.Item.SubTopic}]\n{text}";
                        });
                        var ragContext = string.Join("\n\n---\n\n", ragChunks);

                        var langInstruction = isTurkish
                            ? "The user query is in Turkish. Formulate your complete answer concisely in natural, professional Turkish. Retain established ERP terms like Pax, Draft, Confirmed."
                            : "The user query is in English. Formulate your complete answer concisely in clear, professional English.";

                        var systemPrompt = "You are the AI Assistant Copilot for UNO ERP, a tour operating enterprise platform.\n" +
                                           "Your role is to explain workflows, SOPs, and system rules based on the provided UNO ERP User Manual context.\n" +
                                           $"{langInstruction}\n" +
                                           "Use concise markdown formatting with bold headers and bullet points. Maximum 3-4 key paragraphs.\n\n" +
                                           "STRICT SECURITY RULES (NEVER VIOLATE):\n" +
                                           "- NEVER mention database table names, SQL scripts, SQL filenames, or database connection details.\n" +
                                           "- NEVER mention internal source code filenames (.cs, .tsx, .csproj), server technologies (SSMS, Entity Framework, Kestrel, dotnet), or deployment tools.\n" +
                                           "- NEVER mention file system paths, repository locations, or production server hostnames.\n" +
                                           "- NEVER mention environment names like PRODUCTION, STAGING, or technical method names.\n" +
                                           "- NEVER reveal how the knowledge base is stored, seeded, or updated internally.\n" +
                                           "- Focus ONLY on business workflows, operational procedures, and user-facing features.\n" +
                                           "- If the context contains technical implementation details, ignore them and answer from a business/user perspective only.";

                        var userPrompt = $"Relevant User Manual Context:\n\"\"\"\n{ragContext}\n\"\"\"\n\nUser Question: {request.Query}";

                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(20));
                        var llmAnswer = await _llmService.GenerateChatResponseAsync(
                            systemPrompt, 
                            userPrompt, 
                            options: new LlmGenerationOptions { MaxTokens = 450, Temperature = 0.2f }, 
                            cancellationToken: cts.Token);
                        if (!string.IsNullOrWhiteSpace(llmAnswer))
                        {
                            response.Answer = llmAnswer.Trim();
                            response.Mode = $"Local-LLM ({_llmService.GetConfiguredModelName()})";
                            response.Category = matchResult.Item.Category;
                            var normScore = Math.Min(0.97, Math.Max(0.70, matchResult.Score / 25.0));
                            response.Confidence = new ConfidenceReportDto
                            {
                                Score = Math.Round(normScore, 2),
                                Level = normScore >= 0.85 ? "High" : "Moderate",
                                GroundingType = "Authoritative SOP Manual",
                                VerificationSummary = isTurkish
                                    ? $"Resmi SOP dökümanları ve iş kurallarıyla eşleştirilmiştir. (Eşleşme skoru: %{normScore * 100:0})"
                                    : $"Retrieved from authoritative SOP documentation with {normScore * 100:0}% relevance match.",
                                Datapoints = new List<GroundedDatapointDto>
                                {
                                    new GroundedDatapointDto
                                    {
                                        Field = "SOP Topic",
                                        Value = $"{matchResult.Item.Category} > {matchResult.Item.SubTopic ?? "Workflow"}",
                                        Source = matchResult.Item.SourceFile ?? "UserManuals",
                                        Verified = true,
                                        Confidence = Math.Round(normScore, 2)
                                    },
                                    new GroundedDatapointDto
                                    {
                                        Field = "Procedure Match",
                                        Value = matchResult.Item.QuestionPattern,
                                        Source = "SOP Gate Checkpoint Index",
                                        Verified = true,
                                        Confidence = Math.Round(normScore, 2)
                                    }
                                }
                            };

                            if (!string.IsNullOrEmpty(matchResult.Item.TargetUrl))
                            {
                                links.Add(new QuickActionLink
                                {
                                    Label = matchResult.Item.ActionLabel ?? "Open Link",
                                    Path = matchResult.Item.TargetUrl
                                });
                            }
                            response.RecommendedLinks = links;
                            response.SuggestedPills = GetCategoryDefaultPills(matchResult.Item.Category);
                            return Ok(SanitizeResponse(response));
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[AIChatController] Local LLM RAG inference exception: {ex.Message}");
                    }
                }

                var item = matchResult.Item;
                response.Answer = FormatAgenticResponse(item, request.Query);
                response.Mode = "Local-Hybrid-RAG";
                var ragScore = Math.Min(0.95, Math.Max(0.65, matchResult.Score / 25.0));
                response.Confidence = new ConfidenceReportDto
                {
                    Score = Math.Round(ragScore, 2),
                    Level = ragScore >= 0.85 ? "High" : "Moderate",
                    GroundingType = "Authoritative SOP Manual",
                    VerificationSummary = isTurkish
                        ? $"Resmi SOP dökümanları ve iş kurallarıyla eşleştirilmiştir. (Eşleşme skoru: %{ragScore * 100:0})"
                        : $"Retrieved from authoritative SOP documentation with {ragScore * 100:0}% relevance match.",
                    Datapoints = new List<GroundedDatapointDto>
                    {
                        new GroundedDatapointDto
                        {
                            Field = "SOP Section",
                            Value = $"{item.Category} > {item.SubTopic ?? "Workflow"}",
                            Source = item.SourceFile ?? "UserManuals",
                            Verified = true,
                            Confidence = Math.Round(ragScore, 2)
                        }
                    }
                };

                // Only cite actual external documents (PDF, Word, PowerPoint), never internal .md files
                if (!string.IsNullOrEmpty(item.SourceFile) &&
                    (item.SourceFile.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase) ||
                     item.SourceFile.EndsWith(".docx", StringComparison.OrdinalIgnoreCase) ||
                     item.SourceFile.EndsWith(".doc", StringComparison.OrdinalIgnoreCase) ||
                     item.SourceFile.EndsWith(".pptx", StringComparison.OrdinalIgnoreCase)))
                {
                    response.SourceDocument = item.SourceFile;
                }
                else
                {
                    response.SourceDocument = null;
                }

                response.Category = item.Category;

                if (!string.IsNullOrEmpty(item.TargetUrl))
                {
                    links.Add(new QuickActionLink
                    {
                        Label = item.ActionLabel ?? "Open Link",
                        Path = item.TargetUrl
                    });
                }

                // Dynamic Pills from Trigger Queries or SubTopics
                var pills = new List<string>();
                if (!string.IsNullOrEmpty(item.TriggerQueries))
                {
                    var trigList = item.TriggerQueries.Split(new[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(t => t.Trim())
                        .Where(t => !string.Equals(t, request.Query, StringComparison.OrdinalIgnoreCase))
                        .Take(4)
                        .ToList();
                    pills.AddRange(trigList);
                }

                if (pills.Count == 0)
                {
                    pills = GetCategoryDefaultPills(item.Category);
                }

                response.RecommendedLinks = links;
                response.SuggestedPills = pills;
                return Ok(SanitizeResponse(response));
            }

            // 3. Fallback Helpful Agent Guidance
            response.Confidence = new ConfidenceReportDto
            {
                Score = 0.50,
                Level = "Low",
                GroundingType = "General Guidance",
                VerificationSummary = isTurkish
                    ? "Veritabanında veya SOP dökümanlarında doğrudan bir kayıt bulunamadı; genel rehberlik sunuluyor."
                    : "General navigation guidance without direct database or SOP match.",
                Datapoints = new List<GroundedDatapointDto>()
            };

            response.Answer = $"👋 **I searched the UNO ERP Knowledge Base for \"{request.Query}\"**.\n\n" +
                "While I couldn't find an exact step-by-step match, here are the primary operational hubs you can explore:\n\n" +
                "• 🚌 **Tours & Departures**: Manage rooming manifests, status gates, and hotel costing at **[Tours](/tours)**.\n" +
                "• 📁 **Commercial Contracts**: Group departures and monitor gross budgets at **[Projects](/projects)**.\n" +
                "• ⚙️ **Master Data & Catalog**: Configure contracted hotels, guides, transport, and excursions at **[Master Data](/master-data)**.\n" +
                "• 🛡️ **Role Permissions & Security**: Manage user roles and screen access permissions at **[Settings](/settings)**.";

            links.Add(new QuickActionLink { Label = "Tours Board", Path = "/tours" });
            links.Add(new QuickActionLink { Label = "Master Data Hub", Path = "/master-data" });

            response.RecommendedLinks = links;
            response.SuggestedPills = new List<string>
            {
                "How to advance from Draft to Confirmed?",
                "Tour status transition criteria",
                "How is hotel cost calculated?",
                "What are the 5 Excel import scenarios?"
            };

            return Ok(SanitizeResponse(response));
        }

        private static string FormatAgenticResponse(AiKnowledgeItem item, string query)
        {
            var header = !string.IsNullOrWhiteSpace(item.SubTopic) && !item.SubTopic.Equals("User Manual", StringComparison.OrdinalIgnoreCase)
                ? item.SubTopic
                : item.Category;

            var cleanBody = item.AnswerMarkdown.Trim();

            // Check if AnswerMarkdown starts with a header
            if (cleanBody.StartsWith("#"))
            {
                // Remove redundant top markdown header if desired
                var firstLineEnd = cleanBody.IndexOf('\n');
                if (firstLineEnd > 0)
                {
                    cleanBody = cleanBody.Substring(firstLineEnd).Trim();
                }
            }

            var responseText = !string.IsNullOrWhiteSpace(header)
                ? $"👋 **Operational Guide: {header}**:\n\n{cleanBody}"
                : $"👋 **Operational Guidance**:\n\n{cleanBody}";

            // Only append source document reference if it is an external docx/pdf/pptx file (never .md files)
            if (!string.IsNullOrEmpty(item.SourceFile) &&
                (item.SourceFile.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase) ||
                 item.SourceFile.EndsWith(".docx", StringComparison.OrdinalIgnoreCase) ||
                 item.SourceFile.EndsWith(".pptx", StringComparison.OrdinalIgnoreCase)))
            {
                responseText += $"\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📄 **Document Reference**: `{item.SourceFile}`";
            }

            return responseText;
        }

        private static bool DetectTurkishLanguageInQuery(string q)
        {
            var turkishChars = new[] { 'ç', 'ğ', 'ı', 'ö', 'ş', 'ü', 'Ç', 'Ğ', 'İ', 'Ö', 'Ş', 'Ü' };
            if (q.IndexOfAny(turkishChars) >= 0) return true;

            var qLower = q.ToLowerInvariant();
            var turkishWordPatterns = new[]
            {
                @"\bnas[iı]l\b", @"\bnedir\b", @"\bhangisi?\b", @"\bne\s+zaman\b", @"\bkim\b", @"\bnerede\b", 
                @"\botel\b", @"\brehber\b", @"\byolcu\b", @"\bturlar?\b", @"\bfiyat\b", @"\bmaliyet\b", 
                @"\bk[aâ]r\b", @"\bmarj\b", @"\bg[oö]ster\b", @"\byap[iı]l[iı]r\b", @"\bekle\b", @"\bsil\b", 
                @"\baktar\b", @"\by[uü]kle\b", @"\ben\s+az\b", @"\ben\s+[cç]ok\b", @"\ben\s+y[uü]ksek\b", @"\ben\s+d[uü][sş][uü]k\b"
            };

            return turkishWordPatterns.Any(pattern => Regex.IsMatch(qLower, pattern, RegexOptions.IgnoreCase));
        }

        private static List<string> GetCategoryDefaultPills(string category)
        {
            return category?.ToLower() switch
            {
                "projects" => new List<string> { "Why are Projects needed?", "How to create a project?", "Executive KPI Dashboard" },
                "tours" => new List<string> { "Tour status transition criteria", "How is hotel cost calculated?", "How to import Orta Avrupa excel?" },
                "metadata" => new List<string> { "Hotels Master Data", "Role access permissions", "How to add a user?" },
                _ => new List<string> { "How to advance to Confirmed?", "How to import Excel rooming list?", "Tour status transition criteria" }
            };
        }

        /// <summary>
        /// SECURITY: Sanitize all AI bot response text before sending to end users.
        /// Strips internal technical details: SQL filenames, DB table names, connection strings,
        /// file system paths, server hostnames, environment references, source code filenames,
        /// migration scripts, and any other infrastructure information that should never be
        /// exposed to end users through the chatbot interface.
        /// </summary>
        private static string SanitizeForEndUser(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return text;

            // 1. Remove SQL script filenames (e.g. seed_ai_knowledge_v2026_08_21.sql)
            text = Regex.Replace(text, @"`?[A-Za-z0-9_\-]+\.sql`?", "", RegexOptions.IgnoreCase);

            // 2. Remove database table names (AiKnowledgeItems, TourExcursionSales, TourServices, etc.)
            var dbTableNames = new[] {
                "AiKnowledgeItems", "TourExcursionSales", "TourServices", "TourAttachments",
                "AuditLogs", "ServiceCategories", "ProjectStatuses", "TourStatuses",
                "Passengers", "ExcursionVendors", "UnoDbContext", "DbContext"
            };
            foreach (var table in dbTableNames)
            {
                text = Regex.Replace(text, $@"`?{Regex.Escape(table)}`?", "the system", RegexOptions.IgnoreCase);
            }

            // 3. Remove connection strings and DB server references
            text = Regex.Replace(text, @"Server=\([^)]*\)\\[^;]+;[^""'\s]*", "[connection removed]", RegexOptions.IgnoreCase);
            text = Regex.Replace(text, @"(localdb|MSSQLLocalDB|databaseasp\.net|db\d+\.databaseasp\.net)", "", RegexOptions.IgnoreCase);

            // 4. Remove file system paths (Windows and Unix)
            text = Regex.Replace(text, @"(file:///)?[A-Z]:\\[^\s""'`\]>]+", "", RegexOptions.IgnoreCase);
            text = Regex.Replace(text, @"/[a-z]:/[^\s""'`\]>]+", "", RegexOptions.IgnoreCase);

            // 5. Remove source code filenames (.cs, .tsx, .ts, .csproj, .json config files)
            text = Regex.Replace(text, @"`?[A-Za-z0-9_\-]+\.(cs|tsx?|csproj|sln)`?", "", RegexOptions.IgnoreCase);
            text = Regex.Replace(text, @"`?appsettings(\.[A-Za-z]+)?\.json`?", "", RegexOptions.IgnoreCase);
            text = Regex.Replace(text, @"`?Program\.cs`?", "", RegexOptions.IgnoreCase);
            text = Regex.Replace(text, @"`?launchSettings\.json`?", "", RegexOptions.IgnoreCase);

            // 6. Remove technology stack references that are internal implementation details
            var techTerms = new[] {
                "SSMS", "SQL Server Management Studio", "Entity Framework", "EntityFrameworkCore",
                "EnableRetryOnFailure", "UseSqlServer", "EnsureCreated", "AddDbContext",
                "dotnet run", "dotnet build", "dotnet publish", "npm run build",
                "MSBuild", "StaticWebAssets", "WebDeploy", "Kestrel",
                "BeginTransaction", "SaveChangesAsync", "CommitAsync", "RollbackAsync"
            };
            foreach (var term in techTerms)
            {
                text = text.Replace(term, "", StringComparison.OrdinalIgnoreCase);
            }

            // 7. Remove environment/deployment references
            text = Regex.Replace(text, @"\b(PRODUCTION|STAGING|DEVELOPMENT)\s*(veritaban[ıi]|database|environment|server|ortam[ıi]?)\b", "the system", RegexOptions.IgnoreCase);
            text = Regex.Replace(text, @"\bPRODUCTION\b", "the live system", RegexOptions.IgnoreCase);

            // 8. Remove method names like "Method A", "Method B" when describing technical approaches
            text = Regex.Replace(text, @"""Method [A-Z]""", "the recommended approach", RegexOptions.IgnoreCase);

            // 9. Remove seed script references
            text = Regex.Replace(text, @"`?seed_[a-z0-9_]+`?", "", RegexOptions.IgnoreCase);

            // 10. Remove version tags with internal naming (v2026.08.21-PROD-RELEASE)
            text = Regex.Replace(text, @"v\d{4}\.\d{2}\.\d{2}-PROD-RELEASE", "the latest release", RegexOptions.IgnoreCase);

            // 11. Remove repository paths
            text = Regex.Replace(text, @"`?C:\\Ersen\\[^\s`""']+`?", "", RegexOptions.IgnoreCase);

            // 12. Remove Playwright / test script paths
            text = Regex.Replace(text, @"tests/e2e/[^\s""'`]+", "", RegexOptions.IgnoreCase);

            // 13. Remove migration class references (20260801101945_AddExcursionVendorFK, etc.)
            text = Regex.Replace(text, @"\d{14}_[A-Za-z]+", "", RegexOptions.IgnoreCase);

            // 14. Remove any remaining backtick-wrapped technical identifiers that look like code
            text = Regex.Replace(text, @"`(tour|project|service)\.(ProjectId|TourId|ServiceCategoryId)\s*=\s*[^`]+`", "", RegexOptions.IgnoreCase);

            // 15. Remove production URLs/hostnames that are internal
            text = Regex.Replace(text, @"https?://uno-dmc\.cz/?", "the application", RegexOptions.IgnoreCase);

            // 16. Clean up artifacts: double spaces, orphaned parentheses, empty backticks
            text = Regex.Replace(text, @"`\s*`", "");
            text = Regex.Replace(text, @"\(\s*\)", "");
            text = Regex.Replace(text, @"\s{2,}", " ");
            text = Regex.Replace(text, @"^\s*[\-•]\s*$", "", RegexOptions.Multiline); // empty bullet points
            text = Regex.Replace(text, @"\n{3,}", "\n\n"); // excessive blank lines

            return text.Trim();
        }

        /// <summary>
        /// Applies SanitizeForEndUser to all text fields in an AIChatResponse before returning to the client.
        /// </summary>
        private static AIChatResponse SanitizeResponse(AIChatResponse response)
        {
            response.Answer = SanitizeForEndUser(response.Answer);

            // Never expose internal mode details to end users
            response.Mode = "Smart Assistant";

            // Never expose source document references that contain internal filenames
            if (!string.IsNullOrEmpty(response.SourceDocument))
            {
                // Only allow user-facing document names (PDF, DOCX, PPTX) — strip paths
                if (response.SourceDocument.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase) ||
                    response.SourceDocument.EndsWith(".docx", StringComparison.OrdinalIgnoreCase) ||
                    response.SourceDocument.EndsWith(".pptx", StringComparison.OrdinalIgnoreCase))
                {
                    response.SourceDocument = Path.GetFileName(response.SourceDocument);
                }
                else
                {
                    response.SourceDocument = null;
                }
            }

            return response;
        }

        [HttpPost("upload-inquiry")]
        public async Task<ActionResult<InquiryExtractionDto>> UploadInquiry(
            [FromForm] IFormFile file,
            [FromForm] string? contextUrl = null)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { error = "No file was uploaded." });
            }

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            var result = new InquiryExtractionDto
            {
                FileName = file.FileName,
                FileSize = $"{(file.Length / 1024.0):F1} KB",
                FileType = ext.TrimStart('.')
            };

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            string extractedText = "";

            try
            {
                if (ext == ".docx")
                {
                    using var archive = new System.IO.Compression.ZipArchive(memoryStream, System.IO.Compression.ZipArchiveMode.Read);
                    var entry = archive.GetEntry("word/document.xml");
                    if (entry != null)
                    {
                        using var reader = new StreamReader(entry.Open(), Encoding.UTF8);
                        string xml = await reader.ReadToEndAsync();
                        var matches = Regex.Matches(xml, @"<w:t(?:\s+[^>]*)?>([^<]*)</w:t>");
                        var sb = new StringBuilder();
                        foreach (Match m in matches)
                        {
                            sb.Append(m.Groups[1].Value).Append(" ");
                        }
                        extractedText = sb.ToString();
                    }
                }
                else if (ext == ".pdf")
                {
                    byte[] bytes = memoryStream.ToArray();
                    string raw = Encoding.Latin1.GetString(bytes);
                    var sb = new StringBuilder();
                    var btMatches = Regex.Matches(raw, @"BT\s*(.*?)\s*ET", RegexOptions.Singleline);
                    foreach (Match m in btMatches)
                    {
                        var textParts = Regex.Matches(m.Groups[1].Value, @"\(([^)]+)\)");
                        foreach (Match tp in textParts)
                        {
                            sb.Append(tp.Groups[1].Value).Append(" ");
                        }
                    }
                    if (sb.Length < 30)
                    {
                        var strMatches = Regex.Matches(raw, @"\(([A-Za-z0-9\s,.\-!?:;/]{3,})\)");
                        foreach (Match sm in strMatches)
                        {
                            sb.Append(sm.Groups[1].Value).Append(" ");
                        }
                    }
                    extractedText = sb.ToString();
                }
                else if (ext == ".msg")
                {
                    byte[] bytes = memoryStream.ToArray();
                    string asUtf8 = Encoding.UTF8.GetString(bytes);
                    string asUnicode = Encoding.Unicode.GetString(bytes);
                    var sb = new StringBuilder();
                    var printableUtf8 = Regex.Matches(asUtf8, @"[A-Za-z0-9\s,.\-!?:;/@]{4,}");
                    foreach (Match m in printableUtf8) sb.Append(m.Value).Append(" ");
                    var printableUni = Regex.Matches(asUnicode, @"[A-Za-z0-9\s,.\-!?:;/@]{4,}");
                    foreach (Match m in printableUni) sb.Append(m.Value).Append(" ");
                    extractedText = sb.ToString();
                }
                else // .txt, .eml, .rtf, .csv, etc.
                {
                    using var reader = new StreamReader(memoryStream, Encoding.UTF8);
                    extractedText = await reader.ReadToEndAsync();
                }
            }
            catch (Exception ex)
            {
                result.TextSnippet = $"[Error reading file: {ex.Message}]";
            }

            // Extract Snippet
            string cleanSnippet = Regex.Replace(extractedText, @"\s+", " ").Trim();
            result.TextSnippet = cleanSnippet.Length > 400 ? cleanSnippet.Substring(0, 400) + "..." : cleanSnippet;

            string lowerText = cleanSnippet.ToLowerInvariant();

            // 1. Detect Corridor
            if (lowerText.Contains("salzburg") && (lowerText.Contains("vienna") || lowerText.Contains("wien")))
            {
                result.DetectedCorridor = "Vienna-Salzburg-Prague";
            }
            else if (lowerText.Contains("prague") && lowerText.Contains("budapest") && lowerText.Contains("vienna"))
            {
                result.DetectedCorridor = (lowerText.IndexOf("prague") < lowerText.IndexOf("budapest"))
                    ? "Prague-Vienna-Budapest"
                    : "Budapest-Vienna-Prague";
            }
            else if (lowerText.Contains("prague") && lowerText.Contains("vienna"))
            {
                result.DetectedCorridor = "Prague-Vienna-Budapest";
            }
            else if (lowerText.Contains("budapest") || lowerText.Contains("danube"))
            {
                result.DetectedCorridor = "Budapest-Vienna-Prague";
            }
            else
            {
                result.DetectedCorridor = "Budapest-Vienna-Prague";
            }

            // 2. Detect Pax
            var paxMatch = Regex.Match(lowerText, @"(\d+)\s*(?:pax|passengers|guests|people|persons|travellers|yolcu)");
            if (paxMatch.Success && int.TryParse(paxMatch.Groups[1].Value, out int p) && p > 0 && p <= 200)
            {
                result.DetectedPax = p;
            }

            // 3. Detect Rooms
            var roomsMatch = Regex.Match(lowerText, @"(\d+)\s*(?:rooms|doubles|twins|dbl|twn|oda)");
            if (roomsMatch.Success && int.TryParse(roomsMatch.Groups[1].Value, out int r) && r > 0 && r <= 100)
            {
                result.DetectedRooms = r;
            }
            else
            {
                result.DetectedRooms = (result.DetectedPax + 1) / 2;
            }

            // 4. Detect Duration Days
            var daysMatch = Regex.Match(lowerText, @"(\d+)\s*-?\s*(?:days?|gün|nights?|gece)");
            if (daysMatch.Success && int.TryParse(daysMatch.Groups[1].Value, out int d) && d >= 3 && d <= 30)
            {
                result.DetectedDays = d;
            }

            // 5. Detect Season / Month
            if (lowerText.Contains("october") || lowerText.Contains("oct") || lowerText.Contains("ekim")) result.DetectedSeason = "October 2026";
            else if (lowerText.Contains("november") || lowerText.Contains("nov") || lowerText.Contains("kasım")) result.DetectedSeason = "November 2026";
            else if (lowerText.Contains("september") || lowerText.Contains("sep") || lowerText.Contains("eylül")) result.DetectedSeason = "September 2026";
            else if (lowerText.Contains("spring") || lowerText.Contains("april") || lowerText.Contains("may")) result.DetectedSeason = "Spring 2027";
            else if (lowerText.Contains("summer") || lowerText.Contains("july") || lowerText.Contains("august")) result.DetectedSeason = "Summer 2026";

            // 6. Detect Budget Ceiling
            var ceilMatch = Regex.Match(lowerText, @"(?:budget|ceiling|max(?:imum)?\s*price|price\s*ceiling|max)\s*(?:of|is|:)?\s*€?\s*([\d,]+(?:\.\d+)?)");
            if (ceilMatch.Success)
            {
                string rawVal = ceilMatch.Groups[1].Value.Replace(",", "");
                if (decimal.TryParse(rawVal, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal ceilVal))
                {
                    result.DetectedBudgetCeiling = ceilVal;
                }
            }

            // 7. Detect Margin
            var marginMatch = Regex.Match(lowerText, @"(\d+(?:\.\d+)?)\s*%\s*(?:margin|target|marj)");
            if (marginMatch.Success && decimal.TryParse(marginMatch.Groups[1].Value, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal mVal))
            {
                result.DetectedTargetMarginPct = mVal;
            }

            // 8. Detect Themes
            if (lowerText.Contains("danube") || lowerText.Contains("cruise") || lowerText.Contains("boat")) result.DetectedThemes.Add("Danube Scenic Cruise");
            if (lowerText.Contains("concert") || lowerText.Contains("mozart") || lowerText.Contains("classical")) result.DetectedThemes.Add("Classical Concerts");
            if (lowerText.Contains("castle") || lowerText.Contains("palace") || lowerText.Contains("schonbrunn")) result.DetectedThemes.Add("Imperial Palaces & Castles");
            if (lowerText.Contains("wine") || lowerText.Contains("folklore") || lowerText.Contains("dinner")) result.DetectedThemes.Add("Folklore Dinner & Wine Tasting");
            if (result.DetectedThemes.Count == 0)
            {
                result.DetectedThemes.AddRange(new[] { "Imperial Architecture", "Old Town Heritage", "Danube Cruise" });
            }

            // Formulate Suggested Prompt
            string themeStr = string.Join(", ", result.DetectedThemes);
            string budgetStr = result.DetectedBudgetCeiling.HasValue ? $", max sell price ceiling of €{result.DetectedBudgetCeiling.Value:N0}/pax" : "";
            result.SuggestedPrompt = $"Design a new {result.DetectedDays}-day {result.DetectedCorridor} tour for {result.DetectedPax} pax ({result.DetectedRooms} doubles) in {result.DetectedSeason} with {result.DetectedTargetMarginPct:F0}% target margin{budgetStr}, based on brief in {result.FileName}. Themes: {themeStr}";

            result.Message = $"Successfully extracted tour requirements from '{result.FileName}'.";
            return Ok(result);
        }

        [HttpPost("inspect-excel")]
        public async Task<ActionResult<ExcelInspectionResultDto>> InspectExcel(
            [FromForm] IFormFile file,
            [FromForm] string? contextUrl = null,
            [FromForm] string? screenTourCode = null,
            [FromForm] string? screenProjectCode = null,
            [FromForm] string? confirmedTourCode = null)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file was uploaded.");
            }

            var result = new ExcelInspectionResultDto
            {
                FileName = file.FileName,
                FileSize = $"{(file.Length / 1024.0):F1} KB"
            };

            // 1. Resolve Screen Tour & Project Context from ContextUrl if not passed explicitly
            if (!string.IsNullOrWhiteSpace(contextUrl))
            {
                var tourMatch = Regex.Match(contextUrl, @"/tours/(\d+)", RegexOptions.IgnoreCase);
                if (tourMatch.Success && int.TryParse(tourMatch.Groups[1].Value, out int activeTourId))
                {
                    var screenTour = await _context.Tours
                        .Include(t => t.Project)
                        .FirstOrDefaultAsync(t => t.Id == activeTourId);
                    if (screenTour != null)
                    {
                        screenTourCode ??= screenTour.TourCode;
                        screenProjectCode ??= screenTour.Project?.ProjectCode;
                        result.PaxDeclared = screenTour.Pax;
                    }
                }
            }

            result.ScreenTourCode = screenTourCode;
            result.ScreenProjectCode = screenProjectCode;

            // 2. Open Workbook with ClosedXML
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            using var wb = new XLWorkbook(memoryStream);
            result.Sheets = wb.Worksheets.Select(w => w.Name).ToList();

            // Check if MasterData only
            if (result.Sheets.All(s => s.Equals("MasterData", StringComparison.OrdinalIgnoreCase) || 
                                       s.Equals("Hotels", StringComparison.OrdinalIgnoreCase) || 
                                       s.Equals("Guides", StringComparison.OrdinalIgnoreCase) ||
                                       s.Equals("Excursions", StringComparison.OrdinalIgnoreCase)))
            {
                result.IsMetadataFile = true;
            }

            // 3. Detect Tour Code from Filename or Sheets
            string? detectedTour = null;
            string? detectedProject = null;

            // Filename detection (e.g. PRJ-BVP2_PVB05072026_rooming.xlsx)
            var baseFileName = Path.GetFileNameWithoutExtension(file.FileName);
            var parts = baseFileName.Split(new[] { '_', '-', ' ' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var part in parts)
            {
                var cleaned = part.Trim();
                if (cleaned.Length >= 4 && cleaned.Any(char.IsDigit) && !cleaned.StartsWith("rooming", StringComparison.OrdinalIgnoreCase))
                {
                    var dbTour = await _context.Tours.Include(t => t.Project).FirstOrDefaultAsync(t => t.TourCode.ToLower() == cleaned.ToLower());
                    if (dbTour != null)
                    {
                        detectedTour = dbTour.TourCode;
                        detectedProject = dbTour.Project?.ProjectCode;
                        break;
                    }
                    else if (detectedTour == null)
                    {
                        detectedTour = cleaned;
                    }
                }
            }

            // If not found in filename, check Tours sheet
            if (string.IsNullOrEmpty(detectedTour))
            {
                var wsTours = wb.Worksheets.FirstOrDefault(w => w.Name.Equals("Tours", StringComparison.OrdinalIgnoreCase) || w.Name.Equals("Tour", StringComparison.OrdinalIgnoreCase));
                if (wsTours != null && wsTours.RowsUsed().Count() >= 2)
                {
                    var val = wsTours.Row(2).Cell(1).GetString().Trim();
                    if (!string.IsNullOrEmpty(val)) detectedTour = val;
                }
            }

            result.DetectedTourCode = detectedTour;

            // 4. Tour Reconciliation & Discrepancy Evaluation (User Feedback Rule)
            if (!result.IsMetadataFile)
            {
                if (!string.IsNullOrEmpty(confirmedTourCode))
                {
                    result.MatchedTourCode = confirmedTourCode;
                    var cTour = await _context.Tours.Include(t => t.Project).FirstOrDefaultAsync(t => t.TourCode.ToLower() == confirmedTourCode.ToLower());
                    if (cTour != null)
                    {
                        result.MatchedProjectCode = cTour.Project?.ProjectCode ?? screenProjectCode;
                        result.PaxDeclared = cTour.Pax;
                    }
                    result.RequiresTourConfirmation = false;
                }
                else if (!string.IsNullOrEmpty(screenTourCode) && !string.IsNullOrEmpty(detectedTour) && 
                         !screenTourCode.Equals(detectedTour, StringComparison.OrdinalIgnoreCase))
                {
                    result.RequiresTourConfirmation = true;
                    result.MatchedTourCode = screenTourCode; // Propose screen tour as default
                    result.MatchedProjectCode = screenProjectCode;
                    result.ConfirmationMessage = $"You are viewing Tour '{screenTourCode}' on screen, but the uploaded file indicates '{detectedTour}'. Please confirm which Tour to associate with.";
                    
                    result.Inconsistencies.Add(new ExcelInconsistencyDto
                    {
                        Id = "inc-tour-discrepancy",
                        Category = "TourDiscrepancy",
                        Severity = "High",
                        Title = $"Target Tour Discrepancy: Screen ({screenTourCode}) vs File ({detectedTour})",
                        Description = result.ConfirmationMessage,
                        SuggestedFix = $"Associate manifest with active screen tour '{screenTourCode}'",
                        FixAction = "set_tour",
                        FixValue = screenTourCode
                    });
                }
                else if (string.IsNullOrEmpty(detectedTour) && !string.IsNullOrEmpty(screenTourCode))
                {
                    result.RequiresTourConfirmation = true;
                    result.MatchedTourCode = screenTourCode;
                    result.MatchedProjectCode = screenProjectCode;
                    result.ConfirmationMessage = $"The file '{file.FileName}' has a generic name with no Tour Code. Associate with current screen tour '{screenTourCode}'?";

                    result.Inconsistencies.Add(new ExcelInconsistencyDto
                    {
                        Id = "inc-generic-tour",
                        Category = "TourDiscrepancy",
                        Severity = "Medium",
                        Title = $"Generic Filename: No Tour Code in '{file.FileName}'",
                        Description = result.ConfirmationMessage,
                        SuggestedFix = $"Associate with active screen tour '{screenTourCode}'",
                        FixAction = "set_tour",
                        FixValue = screenTourCode
                    });
                }
                else
                {
                    result.MatchedTourCode = detectedTour ?? screenTourCode ?? "UNKNOWN";
                    result.MatchedProjectCode = detectedProject ?? screenProjectCode ?? "PRJ-DEFAULT";
                }
            }

            // Check Hotel Bookings / Services for target tour
            if (!result.IsMetadataFile && !string.IsNullOrEmpty(result.MatchedTourCode))
            {
                var tourObj = await _context.Tours
                    .Include(t => t.Project)
                    .FirstOrDefaultAsync(t => t.TourCode.ToLower() == result.MatchedTourCode.ToLower());

                if (tourObj != null)
                {
                    result.MatchedTourId = tourObj.Id;
                    result.MatchedProjectId = tourObj.ProjectId;

                    var hotelServices = await _context.TourServices
                        .Where(s => s.TourId == tourObj.Id && (s.HotelId != null || s.ServiceCategoryId == 1))
                        .ToListAsync();

                    var guestHotelServices = hotelServices.Where(s =>
                    {
                        var desc = (s.Description ?? "").ToLowerInvariant();
                        var rt = (s.RoomType ?? "").ToLowerInvariant();
                        if (desc.Contains("tax") || desc.Contains("discount") || rt.Contains("tax") || rt.Contains("discount")) return false;
                        if (rt.Contains("guide") || rt.Contains("driver") || desc.Contains("guide room") || desc.Contains("driver room")) return false;
                        if (rt.Contains("single") || rt.Contains("double") || rt.Contains("twin") || rt.Contains("triple") ||
                            desc.Contains("single") || desc.Contains("double") || desc.Contains("twin") || desc.Contains("triple")) return true;
                        return s.RoomCount.HasValue && s.RoomCount.Value > 0;
                    }).ToList();

                    int totalContractedRooms = guestHotelServices.Sum(s => s.RoomCount ?? (s.Quantity > 0 ? (int)s.Quantity : 0));
                    result.HotelBookingsCount = totalContractedRooms;

                    if (guestHotelServices.Count == 0 || totalContractedRooms == 0)
                    {
                        result.HasIncompleteHotelBookings = true;
                        result.HotelBookingPrompt = $"Tur '{tourObj.TourCode}' için otel rezervasyonları henüz tamamlanmamış (0 Sözleşmeli Oda). Akıllı oda eşleştirmesini yapmadan önce otel rezervasyonlarını tamamlamak ister misiniz?";

                        result.Inconsistencies.Add(new ExcelInconsistencyDto
                        {
                            Id = "inc-hotel-incomplete",
                            Category = "HotelBookingIncomplete",
                            Severity = "High",
                            Title = $"Otel Rezervasyonları Henüz Tamamlanmamış (Tur: {tourObj.TourCode})",
                            Description = $"Tur '{tourObj.TourCode}' için sistemde henüz otel rezervasyonu / hizmet girişi bulunmuyor (0 Sözleşmeli Oda). Akıllı oda eşleştirmesinin otel sözleşmesine göre (Double, Twin, Single, İlave Yatak) yapılabilmesi için, önce otel rezervasyonlarını tamamlamak ister misiniz?",
                            SuggestedFix = "Otel Rezervasyonlarını Tamamla",
                            FixAction = "navigate_services",
                            FixValue = $"/projects/{tourObj.ProjectId}/tours/{tourObj.Id}"
                        });
                    }
                }
            }

            // Set normalized filename syntax: {projectCode}_{tourCode}_rooming.xlsx
            var ext = Path.GetExtension(file.FileName);
            if (string.IsNullOrEmpty(ext)) ext = ".xlsx";
            result.NormalizedFileName = !string.IsNullOrEmpty(result.MatchedTourCode) && !string.IsNullOrEmpty(result.MatchedProjectCode)
                ? $"{result.MatchedProjectCode}_{result.MatchedTourCode}_rooming{ext}"
                : file.FileName;

            // 5. Inspect Rooming Sheet (Headcount & Room Type mapping & duplicates)
            var wsRooming = wb.Worksheets.FirstOrDefault(w => w.Name.Equals("Rooming", StringComparison.OrdinalIgnoreCase) || w.Name.Equals("Guests", StringComparison.OrdinalIgnoreCase) || w.Name.Equals("Pax", StringComparison.OrdinalIgnoreCase));
            if (wsRooming != null && wsRooming.RowsUsed().Any())
            {
                var rows = wsRooming.RowsUsed().ToList();
                int nameCol = -1, roomTypeCol = -1, passportCol = -1;
                var hRow = rows.First();
                foreach (var cell in hRow.CellsUsed())
                {
                    var h = cell.GetString().Trim().ToLower();
                    if (h.Contains("name") || h.Contains("passenger") || h.Contains("ad soyad")) nameCol = cell.Address.ColumnNumber;
                    if (h.Contains("room") || h.Contains("oda") || h.Contains("type")) roomTypeCol = cell.Address.ColumnNumber;
                    if (h.Contains("passport") || h.Contains("pasaport") || h.Contains("id")) passportCol = cell.Address.ColumnNumber;
                }

                if (nameCol == -1) nameCol = 2;

                var paxRows = rows.Skip(1).Where(r => !string.IsNullOrWhiteSpace(r.Cell(nameCol).GetString())).ToList();
                result.PaxDetected = paxRows.Count;

                if (result.PaxDeclared == 0)
                {
                    result.PaxDeclared = result.PaxDetected > 0 ? result.PaxDetected : 44;
                }

                // Check 1: Headcount Mismatch
                if (result.PaxDeclared > 0 && result.PaxDetected > 0 && result.PaxDeclared != result.PaxDetected)
                {
                    result.Inconsistencies.Add(new ExcelInconsistencyDto
                    {
                        Id = "inc-headcount",
                        Category = "HeadcountMismatch",
                        Severity = "High",
                        Title = $"Headcount Mismatch: Tour requires {result.PaxDeclared} Pax, but Rooming Sheet contains {result.PaxDetected} Rows",
                        Description = $"Tour Header/Master specifies {result.PaxDeclared} passengers, but only {result.PaxDetected} valid manifest rows were counted.",
                        SuggestedFix = $"Auto-adjust declared Tour capacity to {result.PaxDetected} Pax",
                        FixAction = "adjust_pax",
                        FixValue = result.PaxDetected.ToString()
                    });
                }

                // Check 2: Unmapped Room Types
                if (roomTypeCol > 0)
                {
                    var recognizedTypes = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "Single", "Double", "Twin", "Triple", "Quad", "SGL", "DBL", "TWN", "TRP" };
                    var seenUnmapped = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                    foreach (var r in paxRows)
                    {
                        var rType = r.Cell(roomTypeCol).GetString().Trim();
                        if (!string.IsNullOrEmpty(rType) && !recognizedTypes.Contains(rType) && !seenUnmapped.Contains(rType))
                        {
                            seenUnmapped.Add(rType);
                            string suggested = rType.ToLower().Contains("trip") ? "Triple" : (rType.ToLower().Contains("sing") ? "Single" : "Double");
                            result.Inconsistencies.Add(new ExcelInconsistencyDto
                            {
                                Id = $"inc-room-{seenUnmapped.Count}",
                                Category = "UnmappedRoomType",
                                Severity = "Medium",
                                Title = $"Unrecognized Room Type '{rType}' found in manifest",
                                Description = $"Master Data supports Single, Double, Twin, and Triple rooms. '{rType}' is not mapped.",
                                SuggestedFix = $"Map '{rType}' to standard '{suggested} Room'",
                                FixAction = "map_room_type",
                                FixValue = suggested
                            });
                        }
                    }
                }

                // Check 3: Duplicate Passports
                if (passportCol > 0)
                {
                    var passportCounts = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                    foreach (var r in paxRows)
                    {
                        var pass = r.Cell(passportCol).GetString().Trim();
                        if (!string.IsNullOrEmpty(pass) && pass.Length >= 6)
                        {
                            passportCounts[pass] = passportCounts.GetValueOrDefault(pass) + 1;
                        }
                    }

                    foreach (var kvp in passportCounts.Where(x => x.Value > 1))
                    {
                        result.Inconsistencies.Add(new ExcelInconsistencyDto
                        {
                            Id = $"inc-pass-{kvp.Key}",
                            Category = "DuplicatePassenger",
                            Severity = "Medium",
                            Title = $"Duplicate Passport Number Detected: {kvp.Key}",
                            Description = $"Passport {kvp.Key} appears {kvp.Value} times in the rooming list.",
                            SuggestedFix = "Review and verify passenger identity in Rooming manifest",
                            FixAction = "verify_passenger",
                            FixValue = kvp.Key
                        });
                    }
                }

                // Check 4: Both DoB and PaxType Blank
                int dobCol = -1, paxTypeCol = -1;
                foreach (var cell in hRow.CellsUsed())
                {
                    var h = cell.GetString().Trim().ToLower();
                    if (h.Contains("doğum") || h.Contains("dogum") || h.Contains("dob") || h.Contains("birth")) dobCol = cell.Address.ColumnNumber;
                    if (h.Contains("paxtype") || h.Contains("pax type") || h.Contains("yolcu tipi") || h.Contains("tipi")) paxTypeCol = cell.Address.ColumnNumber;
                }

                int bothBlankCount = 0;
                foreach (var r in paxRows)
                {
                    string fName = r.Cell(nameCol).GetString().Trim();
                    bool isStaff = fName.Equals("DRIVER", StringComparison.OrdinalIgnoreCase)
                                || fName.Equals("GUIDE", StringComparison.OrdinalIgnoreCase)
                                || fName.Equals("REHBER", StringComparison.OrdinalIgnoreCase)
                                || fName.Equals("KAPTAN", StringComparison.OrdinalIgnoreCase)
                                || fName.Equals("SOFOR", StringComparison.OrdinalIgnoreCase)
                                || fName.Equals("SOFÖR", StringComparison.OrdinalIgnoreCase)
                                || fName.Equals("ŞÖFÖR", StringComparison.OrdinalIgnoreCase);
                    if (isStaff) continue;

                    string pDob = dobCol > 0 ? r.Cell(dobCol).GetString().Trim() : "";
                    string pPaxType = paxTypeCol > 0 ? r.Cell(paxTypeCol).GetString().Trim() : "";

                    if (string.IsNullOrEmpty(pDob) && string.IsNullOrEmpty(pPaxType))
                    {
                        bothBlankCount++;
                    }
                }

                if (bothBlankCount > 0)
                {
                    result.CanCommit = false;
                    result.Inconsistencies.Add(new ExcelInconsistencyDto
                    {
                        Id = "inc-dob-paxtype-blank",
                        Category = "MissingPassengerAgeOrType",
                        Severity = "High",
                        Title = "Both DoB and PaxType fields are blank",
                        Description = PassengerAgeHelper.BothBlankErrorMessage,
                        SuggestedFix = "Fill at least Date of Birth (DoB) or PaxType for all passengers before importing.",
                        FixAction = "fix_dob_paxtype",
                        FixValue = "Required"
                    });
                }
            }
            else
            {
                result.PaxDetected = 0;
            }

            return Ok(result);
        }

        [HttpPost("itinerary/apply-variant")]
        public async Task<ActionResult<ApplyItineraryVariantResponseDto>> ApplyItineraryVariant([FromBody] ApplyItineraryVariantRequestDto request)
        {
            if (request == null || request.Variant == null)
            {
                return BadRequest(new { error = "Invalid itinerary variant payload." });
            }

            try
            {
                var result = await _itineraryToolDispatcher.ApplyItineraryVariantToUnoErpAsync(
                    tourId: request.TourId,
                    variantPayload: request.Variant,
                    destination: request.Destination,
                    arrivalDate: request.ArrivalDate,
                    endDate: request.EndDate,
                    pax: request.Pax);

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AIChatController] Error applying variant to ERP: {ex}");
                return StatusCode(500, new { error = $"Failed to commit variant to Uno_ERP: {ex.Message}" });
            }
        }

        [HttpPost("itinerary/save-to-project")]
        public async Task<ActionResult<SaveProjectItineraryResponseDto>> SaveItineraryToProject([FromBody] SaveItineraryToProjectRequestDto request)
        {
            if (request == null || request.Variant.ValueKind == System.Text.Json.JsonValueKind.Undefined || request.ProjectId <= 0)
            {
                return BadRequest(new { error = "Valid ProjectId and Itinerary Variant payload are required." });
            }

            try
            {
                var result = await _itineraryToolDispatcher.SaveItineraryVariantToProjectAsync(
                    projectId: request.ProjectId,
                    variantPayload: request.Variant,
                    destination: request.Destination,
                    arrivalDate: request.ArrivalDate,
                    endDate: request.EndDate,
                    pax: request.Pax,
                    customTitle: request.CustomTitle,
                    makePrimary: request.MakePrimary);

                return Ok(result);
            }
            catch (ArgumentException aex)
            {
                return NotFound(new { error = aex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AIChatController] Error saving itinerary to project: {ex}");
                return StatusCode(500, new { error = $"Failed to save itinerary under Project: {ex.Message}" });
            }
        }
    }
}
