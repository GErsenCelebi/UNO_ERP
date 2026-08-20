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

            // Root workspace directory and UserManuals directory
            var candidatePaths = new[]
            {
                @"C:\Ersen\Projects_2025\Codex\UNO_ERP",
                @"C:\Ersen\Projects_2025\Codex\UNO_ERP\UserManuals",
                Path.Combine(Directory.GetCurrentDirectory(), "..", "UserManuals"),
                Path.Combine(Directory.GetCurrentDirectory(), "UserManuals")
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
                result.ProcessedFiles.Add(fileName);
                result.TotalFilesProcessed++;

                var content = await File.ReadAllTextAsync(filePath);
                var itemsIngested = await ParseAndSaveMarkdownSectionsAsync(fileName, content);
                result.TotalKnowledgeItemsIngested += itemsIngested;
            }

            return result;
        }

        private async Task<int> ParseAndSaveMarkdownSectionsAsync(string fileName, string content)
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
