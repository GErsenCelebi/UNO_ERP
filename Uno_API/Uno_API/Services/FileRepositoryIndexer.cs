using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Services
{
    public class FileRepositoryIndexerResult
    {
        public int TotalFilesProcessed { get; set; }
        public int TotalKnowledgeItemsIngested { get; set; }
        public List<string> ProcessedFiles { get; set; } = new List<string>();
    }

    public class FileRepositoryIndexer
    {
        private readonly UnoDbContext _context;

        public FileRepositoryIndexer(UnoDbContext context)
        {
            _context = context;
        }

        public async Task<FileRepositoryIndexerResult> IndexWorkspaceMarkdownFilesAsync()
        {
            var result = new FileRepositoryIndexerResult();

            // Purge legacy Governance items and obsolete rules from database
            var obsoleteItems = await _context.AiKnowledgeItems
                .Where(k => k.Category == "Governance" || 
                            (k.SourceFile != null && k.SourceFile.Contains("Governance")) ||
                            k.QuestionPattern.Contains("Rule 4") ||
                            k.QuestionPattern.Contains("5 governance rules"))
                .ToListAsync();
            if (obsoleteItems.Count > 0)
            {
                _context.AiKnowledgeItems.RemoveRange(obsoleteItems);
                await _context.SaveChangesAsync();
            }

            // Seed System Troubleshooting FAQs first
            await IngestTroubleshootingFaqsAsync();

            // 1. Candidate paths in order of priority (structured AOM directories first)
            var baseDir = AppDomain.CurrentDomain.BaseDirectory;
            var currentDir = Directory.GetCurrentDirectory();

            var candidatePaths = new[]
            {
                @"C:\Ersen\Projects_2025\Uno_ERP\UserManuals\Tours",
                @"C:\Ersen\Projects_2025\Uno_ERP\UserManuals\Projects",
                @"C:\Ersen\Projects_2025\Uno_ERP\UserManuals\Metadata",
                @"C:\Ersen\Projects_2025\Uno_ERP\UserManuals",
                Path.Combine(currentDir, "wwwroot", "KB"),
                Path.Combine(baseDir, "wwwroot", "KB"),
                Path.Combine(currentDir, "..", "UserManuals"),
                Path.Combine(currentDir, "UserManuals")
            };

            var mdFiles = new List<string>();
            foreach (var dir in candidatePaths)
            {
                if (Directory.Exists(dir))
                {
                    var files = Directory.GetFiles(dir, "*.md", SearchOption.TopDirectoryOnly);
                    foreach (var f in files)
                    {
                        var fname = Path.GetFileName(f);
                        if (!mdFiles.Any(existing => string.Equals(Path.GetFileName(existing), fname, StringComparison.OrdinalIgnoreCase)))
                        {
                            mdFiles.Add(f);
                        }
                    }
                }
            }

            foreach (var filePath in mdFiles)
            {
                var fileName = Path.GetFileName(filePath);
                if (result.ProcessedFiles.Contains(fileName, StringComparer.OrdinalIgnoreCase)) continue;

                result.ProcessedFiles.Add(fileName);
                result.TotalFilesProcessed++;

                var content = await File.ReadAllTextAsync(filePath);
                var itemsIngested = await ParseAndSaveMarkdownSectionsAsync(fileName, content);
                result.TotalKnowledgeItemsIngested += itemsIngested;
            }

            return result;
        }

        private async Task IngestTroubleshootingFaqsAsync()
        {
            var troubleshootingFaqs = new List<AiKnowledgeItem>
            {
                new AiKnowledgeItem
                {
                    SourceType = "SystemTroubleshooting",
                    SourceFile = "excel_import_master_guide.md",
                    Category = "Tours",
                    SubTopic = "Excel Import",
                    QuestionPattern = "How to import a new tour, new project, or rooming list via Excel template?",
                    TriggerQueries = "How to import a new tour, new project, or rooming list via Excel template?\nWhat are the 5 Excel import scenarios?\nHow can I import sales excel file and rooming lists?",
                    Keywords = "import, excel, tour, project, rooming, template, new tour, new project, existing project, filename, notation, sheet, columns, step, steps, how to",
                    AnswerMarkdown = "### 📊 Complete Step-by-Step Excel Import Workflow Guide\n\n" +
                        "Follow these exact filename conventions, sheet rules, and step-by-step procedures to import projects, tours, rooming lists, or master data into UNO ERP:\n\n" +
                        "#### 📁 1. Filename Naming Conventions & Notation\n" +
                        "1. **New or Existing Project + New Tour**: Use `{ProjectName}_{TourCode}_rooming.xlsx`\n" +
                        "   * *Example*: `Project1_Tour1_rooming.xlsx` (or `Orta Avrupa BVP_BVP28082026_rooming.xlsx`)\n" +
                        "2. **Existing Tour Rooming List Update**: Use `{TourCode}_rooming.xlsx`\n" +
                        "   * *Example*: `Tour1_rooming.xlsx` (or `BVP28082026_rooming.xlsx`)\n" +
                        "3. **Excursion Sales & Base Fees**: Use `{ProjectName}_{TourCode}_importSales.xlsx`\n" +
                        "   * *Example*: `Project1_Tour1_importSales.xlsx`\n" +
                        "4. **Master Data Catalog**: Use `MasterData_Import_Template.xlsx`\n\n" +
                        "#### 📊 2. Required Sheet Names & Column Details\n" +
                        "• **Sheet 1 (`Tours` / `Tour`)**: Col A: `Tour Code` (`Tour1`), Col B: `Project` (`Project1`), Col C: `Destination`, Col D: `Arrival Date`, Col E: `End Date`, Cols F-I: `Pax Counts`.\n" +
                        "• **Sheet 2 (`Projects` / `Project`)**: Col A: `Project Code` (`Project1`), Col B: `Client Name` (`UNO DMC`).\n" +
                        "• **Sheet 3 (`Rooming` / `Rooms` / `Passengers`)**: Col A: `Passenger Name`, Col B: `Gender`, Col C: `Pax Type`, Col D: `Booking Ref` (`BKG-01`), Col E: `Room Number` (`101`), Col F: `Room Type` (`Single`/`Double`/`Twin`/`Triple`).\n" +
                        "• **Sheet 4 (`Hotels` - Master Data)**: Hotel Name, Location, Star Rating, Nightly Room & Pax Rates, Pricing Basis.\n\n" +
                        "#### 🛠️ 3. Step-by-Step Import Scenarios\n\n" +
                        "**Scenario 1: NEW Tour for a NEW Project**\n" +
                        "1. Name file `Project1_Tour1_rooming.xlsx`.\n" +
                        "2. In sheet `Projects`, set Col A = `Project1`, Col B = `Client Name`.\n" +
                        "3. In sheet `Tours`, set Col A = `Tour1`, Col B = `Project1`.\n" +
                        "4. Go to **Tours** or **Projects** screen → Click **Import Rooming List** → Upload file.\n" +
                        "5. *Result*: Creates `Project1` on the fly (`Active` status), creates `Tour1` in **`Draft`** status, and imports all rooming passengers.\n\n" +
                        "**Scenario 2: NEW Tour for an EXISTING Project**\n" +
                        "1. Name file `Project1_Tour2_rooming.xlsx` (or set `Tours` sheet Col B = `Project1`).\n" +
                        "2. Click **Import Rooming List** → Upload file.\n" +
                        "3. *Result*: Matches existing project `Project1`, creates `Tour2` in **`Draft`** status, and binds `Tour2` under `Project1`.\n\n" +
                        "**Scenario 3: EXISTING Tour Rooming Refresh**\n" +
                        "1. Name file `Tour1_rooming.xlsx`.\n" +
                        "2. Click **Import Rooming List** → Upload file.\n" +
                        "3. *Result*: Refreshes passenger rooming list and pax counts, preserving all existing hotel & guide service lines.\n\n" +
                        "**Scenario 4: Master Data Catalog (Hotels, Guides, Transport)**\n" +
                        "1. Go to **Master Data** screen → Click **Import Master Data** → Select `MasterData_Import_Template.xlsx`.\n" +
                        "2. *Result*: Ingests supplier records or updates existing contract rates without duplicating records.",
                    TargetUrl = "/master-data?tab=excelImport",
                    ActionLabel = "Open Excel Import Hub",
                    IsActive = true
                },
                new AiKnowledgeItem
                {
                    SourceType = "SystemTroubleshooting",
                    SourceFile = "troubleshooting_guide.md",
                    Category = "Tours",
                    SubTopic = "Hotels",
                    QuestionPattern = "Why added hotel expenses don't show under Services tab?",
                    TriggerQueries = "Why added hotel expenses don't show under Services tab?\nWhy are hotel expenses missing?\nHotel service line not visible in tour detail",
                    Keywords = "hotel, expense, expenses, services, missing, service tab, not showing, can't see, visibility, service, tab, issue",
                    AnswerMarkdown = "**Troubleshooting: Hotel Expenses Missing under Services Tab**\n\n" +
                        "If you added a hotel or hotel expenses but cannot see them under the Tour Services tab, check the following:\n\n" +
                        "1. **Tour-Level Service Entry vs. Master Data**: Creating a Hotel in *Master Data* only registers the supplier contract. To attach expenses to a tour, you must navigate to **[Projects > Tour Detail](/projects)** and click **+ Add Hotel Stay** under the **Services & Costing** tab.\n" +
                        "2. **Category Filter**: Ensure the Service Category dropdown filter is set to **\"All Categories\"** or **\"Hotel Stays\"**.\n" +
                        "3. **Tour Status Lockdown**: If the Tour status is marked as **\"Accounting Closed\"**, newly added service cost items are suppressed until an Administrator re-opens the tour.\n" +
                        "4. **Stay Dates Alignment**: Verify that the Hotel check-in and check-out dates fall within the Tour arrival and departure bounds.",
                    TargetUrl = "/tours",
                    ActionLabel = "Open Tours Grid",
                    IsActive = true
                },
                new AiKnowledgeItem
                {
                    SourceType = "SystemTroubleshooting",
                    SourceFile = "troubleshooting_guide.md",
                    Category = "Tours",
                    SubTopic = "Financial Logic",
                    QuestionPattern = "How is hotel cost calculated or why hotel calculation is wrong?",
                    TriggerQueries = "How is hotel cost calculated or why hotel calculation is wrong?\nWhat is the hotel pricing basis per pax vs per room?\nHotel calculation formula",
                    Keywords = "hotel, cost, calculation, calculate, wrong, price, rate, room price, fluctuate, total cost, formula, pax basis, room basis",
                    AnswerMarkdown = "**Troubleshooting & Explanation: Hotel Cost Calculation Formula**\n\n" +
                        "Hotel costs in UNO_ERP are calculated dynamically based on room type rates and stay duration:\n\n" +
                        "• **Editable Nightly Rates**: Master Data default rates (Single, Double, Twin, Triple) pre-fill upon hotel selection, but can be customized per tour entry to handle price fluctuations over time.\n" +
                        "• **Pricing Basis**: Calculation varies depending on whether the hotel operates on a **Per Room / Night** or **Per Pax / Night** basis.\n" +
                        "• **Calculation Formula**:\n" +
                        "  $$\\text{Total Hotel Cost} = \\sum (\\text{SingleRate} \\times \\text{SingleCount} + \\text{DoubleRate} \\times \\text{DoubleCount} + \\text{TwinRate} \\times \\text{TwinCount} + \\text{TripleRate} \\times \\text{TripleCount}) \\times \\text{Total Nights}$$\n" +
                        "• **Dynamic Preview**: The total cost live updates in real time as room counts or nightly rate entries are edited in the Add/Edit Hotel Service modal.",
                    TargetUrl = "/tours",
                    ActionLabel = "Open Tour Details",
                    IsActive = true
                },
                new AiKnowledgeItem
                {
                    SourceType = "ProcessFlow",
                    SourceFile = "05_Tour_Statuses_and_Checkpoints.md",
                    Category = "Tours",
                    SubTopic = "Statuses & Gates",
                    QuestionPattern = "What are the mandatory tour status checkpoints and how to resolve blockers to advance status?",
                    TriggerQueries = "Tour status transition criteria\nWhat are automated tour status checkpoints?\nWhat are the mandatory tour status checkpoints and how to resolve blockers to advance status?\nWhy is my tour status blocked?\nPricing / package fee not calculated\nHow to advance to Confirmed?\nHow to close a tour?",
                    Keywords = "status, statuses, gate, gates, blocked, checkpoint, checkpoints, transition, advance, draft, proposal, confirmed, in progress, completed, client_deposit_confirmed, pricing package fee not calculated, invoiced fee, base fee, hotel, guide, transport",
                    AnswerMarkdown = "**Tour Status Lifecycle & Checkpoint Resolution Guide**:\n\n" +
                        "Tours advance sequentially across 5 stages, protected by automated **Status Gates** (`TourCheckpointWidget`):\n\n" +
                        "1. **Draft ➔ Proposal (Gate 1)**:\n" +
                        "   • *Project & Destination Defined*: Ensure Destination is non-empty and dates are valid (`EndDate > ArrivalDate`). Completed in **Tour Info ➔ Edit**.\n\n" +
                        "2. **Proposal ➔ Confirmed (Gate 2)**:\n" +
                        "   • *Hotel Reservations Confirmed*: Assign at least 1 Hotel service in **Services** tab.\n" +
                        "   • *Guide Assignment Confirmed*: Assign Primary Guide in **Tour Info** or add Guide service in **Services** tab.\n" +
                        "   • *Transportation Locked*: Assign Transport Company or Driver in **Services** tab.\n" +
                        "   • *Client Contract & Deposit Received*: If blocked with *\"Pricing / package fee not calculated\"*, enter **Base Fee (€)** in **Tour Info ➔ Edit** or add an **Invoiced Fee** service under Services Revenue.\n\n" +
                        "3. **Confirmed ➔ In Progress (Gate 3)**:\n" +
                        "   • *Arrival Date Reached*: Automatically unlocks on the departure date.\n" +
                        "   • *Flight Manifest Verified*: Enter arrival flight number (e.g. `TK 1821`) under **Tour Info ➔ Edit ➔ Flight Information**.\n\n" +
                        "4. **In Progress ➔ Completed (Gate 4)**:\n" +
                        "   • *Return Date Reached*: Unlocks after the tour end date.\n" +
                        "   • *Revenue & Expense Reconciled*: Ensure services and supplier costs are recorded.\n" +
                        "   • *Accounting Closed*: Check **\"Accounting Closed / Locked\"** in **Tour Info ➔ Edit**.\n\n" +
                        "When all checks show green checkmarks, the badge changes to **`GATE READY`** and the blue **Advance to...** button activates.",
                    TargetUrl = "/tours",
                    ActionLabel = "Open Tours Grid",
                    IsActive = true
                }
            };

            foreach (var item in troubleshootingFaqs)
            {
                var existing = await _context.AiKnowledgeItems
                    .FirstOrDefaultAsync(k => k.SourceFile == item.SourceFile && k.QuestionPattern == item.QuestionPattern);

                if (existing != null)
                {
                    existing.Category = item.Category;
                    existing.SubTopic = item.SubTopic;
                    existing.TriggerQueries = item.TriggerQueries;
                    existing.Keywords = item.Keywords;
                    existing.AnswerMarkdown = item.AnswerMarkdown;
                    existing.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    item.CreatedAt = DateTime.UtcNow;
                    item.UpdatedAt = DateTime.UtcNow;
                    _context.AiKnowledgeItems.Add(item);
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<int> ParseAndSaveMarkdownSectionsAsync(string fileName, string content)
        {
            int count = 0;
            if (string.IsNullOrWhiteSpace(content)) return 0;

            // 1. Extract YAML Frontmatter if present
            string category = "General";
            string subTopic = "General";
            string targetUrl = "/tours";
            string actionLabel = "View Tours";
            string triggerQueries = string.Empty;
            string tags = string.Empty;
            string docTitle = string.Empty;

            var frontmatterMatch = Regex.Match(content, @"^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+");
            if (frontmatterMatch.Success)
            {
                var yaml = frontmatterMatch.Groups[1].Value;
                content = content.Substring(frontmatterMatch.Length);

                category = ExtractYamlField(yaml, "category") ?? category;
                subTopic = ExtractYamlField(yaml, "subTopic") ?? subTopic;
                targetUrl = ExtractYamlField(yaml, "targetUrl") ?? targetUrl;
                actionLabel = ExtractYamlField(yaml, "actionLabel") ?? actionLabel;
                docTitle = ExtractYamlField(yaml, "title") ?? string.Empty;
                tags = ExtractYamlArrayOrList(yaml, "tags");
                triggerQueries = ExtractYamlArrayOrList(yaml, "triggerQueries");
            }
            else
            {
                // Fallback category detection based on filename
                if (fileName.Contains("Project", StringComparison.OrdinalIgnoreCase)) category = "Projects";
                else if (fileName.Contains("Tour", StringComparison.OrdinalIgnoreCase) || fileName.Contains("Excel", StringComparison.OrdinalIgnoreCase) || fileName.Contains("Import", StringComparison.OrdinalIgnoreCase)) category = "Tours";
                else if (fileName.Contains("Metadata", StringComparison.OrdinalIgnoreCase) || fileName.Contains("Master", StringComparison.OrdinalIgnoreCase)) category = "Metadata";
            }

            // 2. Split content by Markdown headers (# or ##)
            var sections = Regex.Split(content, @"(?=^#{1,3}\s+)", RegexOptions.Multiline)
                                .Where(s => !string.IsNullOrWhiteSpace(s))
                                .ToList();

            foreach (var section in sections)
            {
                var lines = section.Trim().Split('\n');
                var rawHeader = lines[0].Trim('#', ' ', '\r');
                if (string.IsNullOrWhiteSpace(rawHeader)) continue;

                var cleanHeader = Regex.Replace(rawHeader, @"[\*#]", "").Trim();
                var bodyText = string.Join("\n", lines.Skip(1)).Trim();
                if (bodyText.Length < 25) continue; // Skip tiny sections

                // Build question pattern
                var questionPattern = cleanHeader.StartsWith("How", StringComparison.OrdinalIgnoreCase) || cleanHeader.StartsWith("What", StringComparison.OrdinalIgnoreCase)
                    ? cleanHeader
                    : $"How to {cleanHeader.ToLower()}?";

                // Extract keywords
                var rawKeywordsText = $"{cleanHeader} {docTitle} {tags} {fileName.Replace(".md", "")} {bodyText.Substring(0, Math.Min(bodyText.Length, 300))}".ToLower();
                var cleanedTerms = Regex.Replace(rawKeywordsText, @"[^\w\s]", " ")
                    .Split(new[] { ' ', '\t', '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                    .Where(w => w.Length >= 3 && !w.All(char.IsDigit))
                    .Distinct()
                    .Take(30);

                var keywords = string.Join(", ", cleanedTerms);

                // Upsert into DB
                var existing = await _context.AiKnowledgeItems
                    .FirstOrDefaultAsync(k => k.SourceFile == fileName && k.QuestionPattern == questionPattern);

                if (existing != null)
                {
                    existing.Category = category;
                    existing.SubTopic = subTopic;
                    existing.TriggerQueries = triggerQueries;
                    existing.Keywords = keywords;
                    existing.AnswerMarkdown = $"### {cleanHeader}\n\n{bodyText}";
                    existing.TargetUrl = targetUrl;
                    existing.ActionLabel = actionLabel;
                    existing.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    var newItem = new AiKnowledgeItem
                    {
                        SourceType = "DocumentationRepo",
                        SourceFile = fileName,
                        Category = category,
                        SubTopic = subTopic,
                        TriggerQueries = triggerQueries,
                        QuestionPattern = questionPattern,
                        Keywords = keywords,
                        AnswerMarkdown = $"### {cleanHeader}\n\n{bodyText}",
                        TargetUrl = targetUrl,
                        ActionLabel = actionLabel,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.AiKnowledgeItems.Add(newItem);
                }
                count++;
            }

            await _context.SaveChangesAsync();
            return count;
        }

        private static string? ExtractYamlField(string yaml, string fieldName)
        {
            var match = Regex.Match(yaml, $@"(?:^|\n){fieldName}\s*:\s*[""']?([^""'\r\n]+)[""']?", RegexOptions.IgnoreCase);
            return match.Success ? match.Groups[1].Value.Trim() : null;
        }

        private static string ExtractYamlArrayOrList(string yaml, string fieldName)
        {
            // Case 1: Inline array tags: [a, b, c]
            var inlineMatch = Regex.Match(yaml, $@"(?:^|\n){fieldName}\s*:\s*\[(.*?)\]", RegexOptions.IgnoreCase);
            if (inlineMatch.Success)
            {
                return string.Join(", ", inlineMatch.Groups[1].Value.Split(',').Select(x => x.Trim().Trim('"', '\'')));
            }

            // Case 2: Indented list:
            // fieldName:
            //   - "query 1"
            //   - "query 2"
            var listMatch = Regex.Match(yaml, $@"(?:^|\n){fieldName}\s*:\s*\n((?:\s*-\s*.*?\n)+)", RegexOptions.IgnoreCase);
            if (listMatch.Success)
            {
                var lines = listMatch.Groups[1].Value.Split('\n');
                var items = lines
                    .Select(l => Regex.Replace(l, @"^\s*-\s*[""']?", "").Trim().Trim('"', '\''))
                    .Where(l => !string.IsNullOrWhiteSpace(l));
                return string.Join("\n", items);
            }

            return string.Empty;
        }
    }
}
