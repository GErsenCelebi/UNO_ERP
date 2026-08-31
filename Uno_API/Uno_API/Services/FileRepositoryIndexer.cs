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

            // Seed System Troubleshooting FAQs first
            await IngestTroubleshootingFaqsAsync();

            // 1. Fetch live markdown files from GitHub repository
            var githubIngested = await FetchFromGitHubRepoAsync(result);

            // 2. Local Candidate Paths Fallback
            var baseDir = AppDomain.CurrentDomain.BaseDirectory;
            var currentDir = Directory.GetCurrentDirectory();
            var candidatePaths = new[]
            {
                @"C:\Ersen\Projects_2025\Uno_ERP\UserManuals",
                @"C:\Ersen\Projects_2025\Uno_ERP\Publish\260829\importfiles",
                @"C:\Ersen\Projects_2025\Codex\UNO_ERP",
                @"C:\Ersen\Projects_2025\Codex\UNO_ERP\UserManuals",
                Path.Combine(currentDir, "..", "UserManuals"),
                Path.Combine(currentDir, "UserManuals"),
                Path.Combine(currentDir, "wwwroot", "UserManuals"),
                Path.Combine(currentDir, "wwwroot"),
                Path.Combine(baseDir, "wwwroot", "UserManuals"),
                Path.Combine(baseDir, "wwwroot")
            };

            var mdFiles = new List<string>();
            foreach (var dir in candidatePaths)
            {
                if (Directory.Exists(dir))
                {
                    var files = Directory.GetFiles(dir, "*.md", SearchOption.TopDirectoryOnly);
                    foreach (var f in files)
                    {
                        if (!mdFiles.Contains(f, StringComparer.OrdinalIgnoreCase))
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

        private async Task<int> FetchFromGitHubRepoAsync(FileRepositoryIndexerResult result)
        {
            int totalIngested = 0;
            try
            {
                using var http = new System.Net.Http.HttpClient();
                http.DefaultRequestHeaders.Add("User-Agent", "UNO_ERP-Indexer");

                // List of known repository markdown files
                var githubFiles = new[]
                {
                    "RELEASE_NOTES_2026_08_21.md",
                    "Uno_Tour_Status_Transition_Process_Flows.md",
                    "user_manual.md",
                    "01_Project_Charter_and_Scope.md",
                    "README.md"
                };

                foreach (var fileName in githubFiles)
                {
                    var url = $"https://raw.githubusercontent.com/GErsenCelebi/UNO_ERP/main/UserManuals/{fileName}";
                    var res = await http.GetAsync(url);
                    if (!res.IsSuccessStatusCode)
                    {
                        // Try root repo directory
                        url = $"https://raw.githubusercontent.com/GErsenCelebi/UNO_ERP/main/{fileName}";
                        res = await http.GetAsync(url);
                    }

                    if (res.IsSuccessStatusCode)
                    {
                        var content = await res.Content.ReadAsStringAsync();
                        if (!string.IsNullOrWhiteSpace(content))
                        {
                            result.ProcessedFiles.Add($"GitHub:{fileName}");
                            result.TotalFilesProcessed++;
                            var count = await ParseAndSaveMarkdownSectionsAsync(fileName, content);
                            totalIngested += count;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GitHub Indexer] Warning: {ex.Message}");
            }
            return totalIngested;
        }

        private async Task IngestTroubleshootingFaqsAsync()
        {
            var troubleshootingFaqs = new List<AiKnowledgeItem>
            {
                new AiKnowledgeItem
                {
                    SourceType = "SystemTroubleshooting",
                    SourceFile = "troubleshooting_guide.md",
                    Category = "Troubleshooting",
                    QuestionPattern = "Why added hotel expenses don't show under Services tab?",
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
                    Category = "Troubleshooting",
                    QuestionPattern = "How is hotel cost calculated or why hotel calculation is wrong?",
                    Keywords = "hotel, cost, calculation, calculate, wrong, price, rate, room price, fluctuate, total cost, formula",
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
                }
            };

            foreach (var item in troubleshootingFaqs)
            {
                var existing = await _context.AiKnowledgeItems
                    .FirstOrDefaultAsync(k => k.SourceFile == item.SourceFile && k.QuestionPattern == item.QuestionPattern);

                if (existing != null)
                {
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
            // Split content by Markdown headers (# or ##)
            var sections = Regex.Split(content, @"(?=^#{1,3}\s+)", RegexOptions.Multiline)
                                .Where(s => !string.IsNullOrWhiteSpace(s))
                                .ToList();

            foreach (var section in sections)
            {
                var lines = section.Trim().Split('\n');
                var headerLine = lines[0].Trim('#', ' ', '\r');
                if (string.IsNullOrWhiteSpace(headerLine)) continue;

                var bodyText = string.Join("\n", lines.Skip(1)).Trim();
                if (bodyText.Length < 20) continue; // Skip tiny sections

                // Extract keywords from header and body
                var rawKeywords = $"{headerLine} {fileName.Replace(".md", "")}"
                    .ToLower()
                    .Replace("#", "")
                    .Replace("—", " ")
                    .Replace("-", " ");

                var keywords = string.Join(", ", rawKeywords.Split(' ', StringSplitOptions.RemoveEmptyEntries).Distinct().Take(10));

                // Determine category and target URL
                string category = "User Manual";
                string? targetUrl = "/tours";
                string? actionLabel = "View Tours Grid";

                if (headerLine.Contains("Status", StringComparison.OrdinalIgnoreCase) || headerLine.Contains("Transition", StringComparison.OrdinalIgnoreCase))
                {
                    category = "Process Flow";
                    targetUrl = "/tours";
                    actionLabel = "Tour Status Kanban";
                }
                else if (headerLine.Contains("Master Data", StringComparison.OrdinalIgnoreCase) || headerLine.Contains("Hotel", StringComparison.OrdinalIgnoreCase) || headerLine.Contains("Guide", StringComparison.OrdinalIgnoreCase))
                {
                    category = "Master Data";
                    targetUrl = "/master-data";
                    actionLabel = "Open Master Data";
                }
                else if (headerLine.Contains("Governance", StringComparison.OrdinalIgnoreCase) || headerLine.Contains("Rule", StringComparison.OrdinalIgnoreCase))
                {
                    category = "Governance";
                    targetUrl = "/settings";
                    actionLabel = "Governance & Settings";
                }
                else if (headerLine.Contains("KPI", StringComparison.OrdinalIgnoreCase) || headerLine.Contains("Dashboard", StringComparison.OrdinalIgnoreCase))
                {
                    category = "KPI Proposal";
                    targetUrl = "/projects";
                    actionLabel = "Executive Dashboard";
                }

                // Check existing record to update or insert
                var questionPattern = $"How to {headerLine.ToLower()}?";
                var existing = await _context.AiKnowledgeItems
                    .FirstOrDefaultAsync(k => k.SourceFile == fileName && k.QuestionPattern == questionPattern);

                if (existing != null)
                {
                    existing.Category = category;
                    existing.Keywords = keywords;
                    existing.AnswerMarkdown = $"**{headerLine}** (Source: `{fileName}`)\n\n{bodyText}";
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
                        QuestionPattern = questionPattern,
                        Keywords = keywords,
                        AnswerMarkdown = $"**{headerLine}** (Source: `{fileName}`)\n\n{bodyText}",
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
    }
}
