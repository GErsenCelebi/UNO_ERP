using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;
using Uno_API.Services;
using System.Text.RegularExpressions;

namespace Uno_API.Controllers
{
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

        public AIChatController(UnoDbContext context, IKnowledgeRetrievalService retrievalService, ITourProjectLookupService entityLookupService)
        {
            _context = context;
            _retrievalService = retrievalService;
            _entityLookupService = entityLookupService;
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

            // 2. Intelligent Hybrid Knowledge Base Search (Local RAG)
            var matchResult = await _retrievalService.SearchBestMatchAsync(request.Query, request.Category);

            if (matchResult != null && matchResult.Score >= 8.0)
            {
                var item = matchResult.Item;
                response.Answer = FormatAgenticResponse(item, request.Query);

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
    }
}
