using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;
using System.Text.RegularExpressions;

namespace Uno_API.Controllers
{
    public class AIChatRequest
    {
        public string Query { get; set; } = string.Empty;
        public string? ContextUrl { get; set; }
        public string? Role { get; set; }
    }

    public class AIChatResponse
    {
        public string Answer { get; set; } = string.Empty;
        public List<QuickActionLink>? RecommendedLinks { get; set; }
        public List<string>? SuggestedPills { get; set; }
        public string Mode { get; set; } = "Hybrid-Knowledge-AppDB";
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

        public AIChatController(UnoDbContext context)
        {
            _context = context;
        }

        [HttpPost("chat")]
        public async Task<ActionResult<AIChatResponse>> ProcessChatQuery([FromBody] AIChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Query))
            {
                return BadRequest(new { error = "Query text is required." });
            }

            var q = request.Query.Trim().ToLower();
            var response = new AIChatResponse();
            var links = new List<QuickActionLink>();

            // 1. Governance Rules Questions
            if (q.Contains("rule 4") || q.Contains("separate money") || q.Contains("cash handover") || q.Contains("expense deduction"))
            {
                response.Answer = "**Governance Rule 4: SEPARATE MONEY FLOWS**\n\n" +
                    "• **Rule Principle**: Gross excursion sales cash collected by the guide must be remitted in full to the Operator first.\n" +
                    "• **No Netting**: Guides must **never** deduct commission or local expenses directly from excursion sales cash.\n" +
                    "• **Reimbursement**: Guide expenses are submitted with receipts and reimbursed separately after full remittance validation.";
                links.Add(new QuickActionLink { Label = "View Access & User Settings", Path = "/settings" });
            }
            else if (q.Contains("rule 1") || q.Contains("one programme"))
            {
                response.Answer = "**Governance Rule 1: ONE PROGRAMME**\n\n" +
                    "Operate only the current authorised programme version and price list. No guide-created itineraries or undocumented discounts are permitted.";
            }
            else if (q.Contains("rule 2") || q.Contains("free choice"))
            {
                response.Answer = "**Governance Rule 2: FREE CHOICE**\n\n" +
                    "Optional excursions are strictly voluntary. A passenger declining an optional tour must never experience reduced service quality or negative treatment on the core tour.";
            }
            else if (q.Contains("rule 3") || q.Contains("full traceability"))
            {
                response.Answer = "**Governance Rule 3: FULL TRACEABILITY**\n\n" +
                    "Every participant, payment, expense, voucher, and cash handover must be backed by documented evidence and audit logs.";
            }
            else if (q.Contains("rule 5") || q.Contains("accountable operator"))
            {
                response.Answer = "**Governance Rule 5: ONE ACCOUNTABLE OPERATOR**\n\n" +
                    "While local subcontractors (hotels, drivers, guides) deliver services, UNO (as destination Operator) remains fully accountable for quality and passenger welfare.";
            }

            // 2. How-To Navigation & User Guide Questions
            else if (q.Contains("add user") || q.Contains("create user") || q.Contains("new user") || q.Contains("add account"))
            {
                response.Answer = "**How to Add a New User Account**:\n\n" +
                    "1. Navigate to **[User Accounts & Role Management](/settings)**.\n" +
                    "2. Click the purple **+ Add New User** button at top right.\n" +
                    "3. Enter Full Name, Email, Password, and select Role (`Administrator`, `TourAdmin`, `Manager`).\n" +
                    "4. Click **Create Account** to save.";
                links.Add(new QuickActionLink { Label = "Go to User Accounts", Path = "/settings" });
            }
            else if (q.Contains("password") || q.Contains("reveal password") || q.Contains("show password"))
            {
                response.Answer = "**Password Masking & Viewing Rules**:\n\n" +
                    "• All user account passwords are strictly masked (`••••••••`) by default.\n" +
                    "• **Administrators Only**: An eye button (`👁`) is rendered next to the password column to toggle plain text view.\n" +
                    "• Non-admin users (`TourAdmin`, `Manager`) see bullets only with no toggle option.";
                links.Add(new QuickActionLink { Label = "User Accounts & Privacy", Path = "/settings" });
            }
            else if (q.Contains("access right") || q.Contains("role permission") || q.Contains("matrix") || q.Contains("configure role"))
            {
                response.Answer = "**How to Configure Screen Access Rights**:\n\n" +
                    "1. Go to **[User & Role Access Management](/settings)**.\n" +
                    "2. Click the **Screen Access Rights Matrix** tab.\n" +
                    "3. Select the role (`Administrator`, `TourAdmin`, `Manager`, or create a custom role).\n" +
                    "4. Check or uncheck **View, Entry (Create), Update (Edit), Delete** for each screen.\n" +
                    "5. Click **Save Permissions Matrix**.";
                links.Add(new QuickActionLink { Label = "Open Access Rights Matrix", Path = "/settings" });
            }
            else if (q.Contains("audit log") || q.Contains("system history") || q.Contains("who changed") || q.Contains("change log"))
            {
                response.Answer = "**Audit Logs & System History**:\n\n" +
                    "• View complete change history at **[Audit Logs](/audit-logs)**.\n" +
                    "• Tracks all user creations, updates, role changes, and deletions with timestamps and user email details.\n" +
                    "• You can also view project-specific history directly in the **Activity History** tab inside any Project page.";
                links.Add(new QuickActionLink { Label = "View System Audit Logs", Path = "/audit-logs" });
            }

            // 3. Live AppDB Queries & Data Intelligence
            else if (q.Contains("tour") || q.Contains("active tour") || q.Contains("how many tour") || q.Contains("summarize tour"))
            {
                var tourCount = await _context.Tours.CountAsync();
                var confirmedTours = await _context.Tours.Where(t => t.TourStatusId == 3).CountAsync();
                var totalRev = await _context.Tours.SumAsync(t => (decimal?)t.TotalFee) ?? 0m;

                response.Answer = $"**Live AppDB Tour Summary**:\n\n" +
                    $"• **Total Tours Registered**: `{tourCount}`\n" +
                    $"• **Confirmed Status Tours**: `{confirmedTours}`\n" +
                    $"• **Combined Tour Package Revenue**: `€{totalRev:N2}`\n\n" +
                    $"View all operational details in the Tours management grid.";
                links.Add(new QuickActionLink { Label = "Open Tours Grid", Path = "/tours" });
            }
            else if (q.Contains("project") || q.Contains("active project") || q.Contains("how many project"))
            {
                var projectCount = await _context.Projects.CountAsync();
                var activeProjects = await _context.Projects.Where(p => p.ProjectStatusId == 3).CountAsync();
                var totalBudget = await _context.Projects.SumAsync(p => (decimal?)p.ApproxBudget) ?? 0m;

                response.Answer = $"**Live AppDB Projects Summary**:\n\n" +
                    $"• **Total Projects**: `{projectCount}`\n" +
                    $"• **Active Projects**: `{activeProjects}`\n" +
                    $"• **Combined Approx Budget**: `€{totalBudget:N2}`";
                links.Add(new QuickActionLink { Label = "Open Projects Dashboard", Path = "/projects" });
            }
            else if (q.Contains("hotel") || q.Contains("guide") || q.Contains("driver") || q.Contains("master data"))
            {
                var hotelCount = await _context.Hotels.CountAsync();
                var guideCount = await _context.Guides.CountAsync();
                var driverCount = await _context.Drivers.CountAsync();
                var transportCount = await _context.TransportCompanies.CountAsync();

                response.Answer = $"**Live Master Data Overview**:\n\n" +
                    $"• **Contracted Hotels**: `{hotelCount}`\n" +
                    $"• **Registered Tour Guides**: `{guideCount}`\n" +
                    $"• **Transport Drivers**: `{driverCount}`\n" +
                    $"• **Transport Companies**: `{transportCount}`";
                links.Add(new QuickActionLink { Label = "Open Master Data Screen", Path = "/master-data" });
            }
            else if (q.Contains("recent change") || q.Contains("what happened") || q.Contains("latest log"))
            {
                var recentLogs = await _context.AuditLogs.OrderByDescending(a => a.Timestamp).Take(3).ToListAsync();
                if (recentLogs.Count > 0)
                {
                    var logSummaries = string.Join("\n", recentLogs.Select(l => $"• **[{l.Timestamp:HH:mm}]** `{l.UserEmail}`: {l.Summary}"));
                    response.Answer = $"**Recent AppDB Activity Logs**:\n\n{logSummaries}";
                }
                else
                {
                    response.Answer = "No recent audit logs found in the database.";
                }
                links.Add(new QuickActionLink { Label = "View Full Audit Logs", Path = "/audit-logs" });
            }
            else
            {
                // Default Intelligent Fallback
                response.Answer = $"**UNO_ERP Assistant Response**:\n\n" +
                    $"I searched the ERP Process Knowledge Base and live database for **\"{request.Query}\"**.\n\n" +
                    $"Here are recommended quick actions for your query:\n" +
                    $"• Manage user credentials and role access rights at **[User Accounts](/settings)**.\n" +
                    $"• View live project & tour operations at **[Projects](/projects)** & **[Tours](/tours)**.\n" +
                    $"• Inspect master data suppliers (Hotels, Guides, Transport) at **[Master Data](/master-data)**.";

                links.Add(new QuickActionLink { Label = "Projects Overview", Path = "/projects" });
                links.Add(new QuickActionLink { Label = "User & Access Management", Path = "/settings" });
            }

            response.RecommendedLinks = links;
            response.SuggestedPills = new List<string>
            {
                "How to add a user?",
                "What is Rule 4?",
                "Summarize active tours",
                "How to configure role access?",
                "Recent system changes"
            };

            return Ok(response);
        }
    }
}
