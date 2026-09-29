using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;
using Uno_API.Services;
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
    }
    public class AIChatRequest
    {
        public string Query { get; set; } = string.Empty;
        public string? ContextUrl { get; set; }
        public string? Role { get; set; }
        public string? Category { get; set; }
    }

    public class AIChatResponse
    {
        public string Answer { get; set; } = string.Empty;
        public List<QuickActionLink>? RecommendedLinks { get; set; }
        public List<string>? SuggestedPills { get; set; }
        public string Mode { get; set; } = "Local-Hybrid-RAG";
        public string? SourceDocument { get; set; }
        public string? Category { get; set; }
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

        public AIChatController(
            UnoDbContext context, 
            IKnowledgeRetrievalService retrievalService, 
            ITourProjectLookupService entityLookupService,
            ILocalLlmService llmService)
        {
            _context = context;
            _retrievalService = retrievalService;
            _entityLookupService = entityLookupService;
            _llmService = llmService;
        }

        [HttpPost("chat")]
        public async Task<ActionResult<AIChatResponse>> ProcessChatQuery([FromBody] AIChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Query))
            {
                return BadRequest(new { error = "Query text is required." });
            }

            // 0. Specific Entity Live Database Lookup (Specific Tour, Project, Current City, Guide, Hotel, Margin, Pax)
            try
            {
                var specificEntityResponse = await _entityLookupService.TryHandleSpecificEntityQueryAsync(request.Query, request.ContextUrl, request.Role);
                if (specificEntityResponse != null)
                {
                    return Ok(specificEntityResponse);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AIChatController] Error during entity lookup: {ex}");
            }

            var q = request.Query.Trim().ToLower();
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

                links.Add(new QuickActionLink { Label = "Open Tours Board", Path = "/tours" });
                response.RecommendedLinks = links;
                response.SuggestedPills = new List<string> { "Tour status transition criteria", "How to advance to Confirmed?", "Rooming list import" };
                response.Category = "Tours";
                return Ok(response);
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

                links.Add(new QuickActionLink { Label = "Open Projects Dashboard", Path = "/projects" });
                response.RecommendedLinks = links;
                response.SuggestedPills = new List<string> { "Why are Projects needed?", "How to create a project?", "Executive KPI Dashboard" };
                response.Category = "Projects";
                return Ok(response);
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
                links.Add(new QuickActionLink { Label = "View Full Audit Logs", Path = "/audit-logs" });
                response.RecommendedLinks = links;
                response.SuggestedPills = new List<string> { "How to configure role access?", "How to view user change logs?" };
                return Ok(response);
            }

            // 2. Intelligent Hybrid Knowledge Base Search (Local RAG + Local LLM)
            var topMatches = await _retrievalService.SearchTopMatchesAsync(request.Query, request.Category, 3);
            var matchResult = topMatches.FirstOrDefault();

            if (matchResult != null && matchResult.Score >= 6.0)
            {
                // Attempt Local LLM inference over retrieved RAG chunks
                var isLlmAvailable = await _llmService.IsLlmAvailableAsync();
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

                        bool isTurkish = DetectTurkishLanguageInQuery(request.Query);
                        var langInstruction = isTurkish
                            ? "The user query is in Turkish. Formulate your complete answer concisely in natural, professional Turkish. Retain established ERP terms like Pax, Draft, Confirmed."
                            : "The user query is in English. Formulate your complete answer concisely in clear, professional English.";

                        var systemPrompt = "You are the AI Assistant Copilot for UNO ERP, a tour operating enterprise platform.\n" +
                                           "Your role is to explain workflows, SOPs, and system rules based on the provided UNO ERP User Manual context.\n" +
                                           $"{langInstruction}\n" +
                                           "Use concise markdown formatting with bold headers and bullet points. Maximum 3-4 key paragraphs.";

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
                            return Ok(response);
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
                return Ok(response);
            }

            // 3. Fallback Helpful Agent Guidance
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

            return Ok(response);
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
            }
            else
            {
                result.PaxDetected = 0;
            }

            return Ok(result);
        }
    }
}
