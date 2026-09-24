using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Services
{
    public class LocalKnowledgeRetrievalService : IKnowledgeRetrievalService
    {
        private readonly UnoDbContext _context;
        private static List<AiKnowledgeItem>? _cachedItems;
        private static DateTime _lastCacheTime = DateTime.MinValue;
        private static readonly object _lock = new object();
        private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10);

        private static readonly HashSet<string> StopWords = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "what", "where", "when", "which", "who", "whom", "whose", "why", "how",
            "is", "are", "was", "were", "be", "been", "being",
            "have", "has", "had", "do", "does", "did",
            "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while",
            "of", "at", "by", "for", "with", "about", "against", "between", "into", "through",
            "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out",
            "on", "off", "over", "under", "again", "further", "then", "once", "here", "there",
            "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor",
            "not", "only", "own", "same", "so", "than", "too", "very", "can", "will", "just", "should", "now"
        };

        private static readonly Dictionary<string, List<string>> SynonymDict = new Dictionary<string, List<string>>(StringComparer.OrdinalIgnoreCase)
        {
            { "commission", new List<string> { "guide commission", "10%", "excursion sales", "remittance", "rule 4" } },
            { "rooming", new List<string> { "passenger list", "pax", "room list", "room numbers", "booking ref" } },
            { "checkpoint", new List<string> { "gate", "blocker", "status transition", "advance to", "proposal", "confirmed" } },
            { "gate", new List<string> { "checkpoint", "blocker", "status transition", "advance to", "proposal", "confirmed" } },
            { "pricing", new List<string> { "pax basis", "room basis", "hotel cost", "formula", "nightly rate" } },
            { "hotel", new List<string> { "hotels", "stay", "accommodation", "pricing basis", "nightly rate" } },
            { "import", new List<string> { "excel", "template", "scenario", "rooming.xlsx", "sales.xlsx", "upload" } },
            { "excel", new List<string> { "import", "template", "spreadsheet", "rooming.xlsx", "scenario" } },
            { "governance", new List<string> { "rule 4", "rule 1", "rule 2", "rule 3", "rule 5", "separate money", "cash handover" } },
            { "rule4", new List<string> { "separate money", "cash handover", "anti netting", "excursion cash", "reimbursement" } },
            { "kpi", new List<string> { "dashboard", "metric", "sla", "pass rate", "margin", "load factor", "executive" } }
        };

        public LocalKnowledgeRetrievalService(UnoDbContext context)
        {
            _context = context;
        }

        public void InvalidateCache()
        {
            lock (_lock)
            {
                _cachedItems = null;
                _lastCacheTime = DateTime.MinValue;
            }
        }

        private async Task<List<AiKnowledgeItem>> GetActiveItemsAsync()
        {
            if (_cachedItems != null && (DateTime.UtcNow - _lastCacheTime) < CacheDuration)
            {
                return _cachedItems;
            }

            var items = await _context.AiKnowledgeItems
                .Where(k => k.IsActive)
                .AsNoTracking()
                .ToListAsync();

            lock (_lock)
            {
                _cachedItems = items;
                _lastCacheTime = DateTime.UtcNow;
            }

            return items;
        }

        public async Task<KnowledgeSearchResult?> SearchBestMatchAsync(string query, string? category = null)
        {
            var top = await SearchTopMatchesAsync(query, category, 1);
            return top.FirstOrDefault();
        }

        public async Task<List<KnowledgeSearchResult>> SearchTopMatchesAsync(string query, string? category = null, int topK = 3)
        {
            if (string.IsNullOrWhiteSpace(query)) return new List<KnowledgeSearchResult>();

            var items = await GetActiveItemsAsync();
            if (items.Count == 0) return new List<KnowledgeSearchResult>();

            var cleanQuery = query.Trim().ToLower();
            var rawTokens = Regex.Replace(cleanQuery, @"[^\w\s]", " ")
                                 .Split(new[] { ' ', '\t', '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);

            var queryTerms = rawTokens
                .Where(t => t.Length >= 3 && !StopWords.Contains(t))
                .Distinct()
                .ToList();

            // Expand synonyms
            var expandedTerms = new HashSet<string>(queryTerms, StringComparer.OrdinalIgnoreCase);
            foreach (var term in queryTerms)
            {
                if (SynonymDict.TryGetValue(term, out var syns))
                {
                    foreach (var s in syns) expandedTerms.Add(s.ToLower());
                }
            }

            var scoredList = new List<KnowledgeSearchResult>();

            foreach (var item in items)
            {
                double score = 0;
                var matchedTerms = new List<string>();
                string matchType = "BM25-Hybrid";

                // Tier 1: Check Exact / Near-Exact Trigger Query Matches
                if (!string.IsNullOrEmpty(item.TriggerQueries))
                {
                    var triggers = item.TriggerQueries.Split(new[] { '\n', '\r', '|' }, StringSplitOptions.RemoveEmptyEntries);
                    foreach (var trigger in triggers)
                    {
                        var cleanTrig = trigger.Trim().ToLower();
                        if (cleanTrig.Length >= 5 && (cleanQuery.Contains(cleanTrig) || cleanTrig.Contains(cleanQuery)))
                        {
                            score += 45.0;
                            matchType = "ExactTrigger";
                            matchedTerms.Add($"Trigger:{trigger.Trim()}");
                            break;
                        }
                    }
                }

                // Check Question Pattern
                var qp = item.QuestionPattern.ToLower();
                if (qp.Length >= 5 && (cleanQuery.Contains(qp) || qp.Contains(cleanQuery)))
                {
                    score += 35.0;
                    matchType = "ExactQuestion";
                    matchedTerms.Add("QuestionPattern");
                }

                // Tier 2: Category Alignment Boost
                if (!string.IsNullOrEmpty(category) && !string.IsNullOrEmpty(item.Category))
                {
                    if (string.Equals(item.Category, category, StringComparison.OrdinalIgnoreCase) ||
                        item.Category.ToLower().Contains(category.ToLower()))
                    {
                        score += 10.0;
                    }
                }

                // Tier 3: Token Scoring across Fields
                var kwList = (item.Keywords ?? "").ToLower();
                var subTopic = (item.SubTopic ?? "").ToLower();
                var body = item.AnswerMarkdown.ToLower();

                foreach (var term in expandedTerms)
                {
                    bool termMatched = false;

                    if (qp.Contains(term))
                    {
                        score += 6.0;
                        termMatched = true;
                    }
                    if (!string.IsNullOrEmpty(subTopic) && subTopic.Contains(term))
                    {
                        score += 5.0;
                        termMatched = true;
                    }
                    if (kwList.Contains(term))
                    {
                        score += 4.0;
                        termMatched = true;
                    }
                    if (body.Contains(term))
                    {
                        score += 1.5;
                        termMatched = true;
                    }

                    if (termMatched)
                    {
                        matchedTerms.Add(term);
                    }
                }

                // Whole phrase bonus
                if (cleanQuery.Length > 8 && body.Contains(cleanQuery))
                {
                    score += 15.0;
                }

                // Minimum quality threshold: at least score >= 8 or an exact trigger/question
                if (score >= 8.0)
                {
                    scoredList.Add(new KnowledgeSearchResult
                    {
                        Item = item,
                        Score = score,
                        MatchType = matchType,
                        MatchedTerms = matchedTerms.Distinct().ToList()
                    });
                }
            }

            return scoredList
                .OrderByDescending(x => x.Score)
                .Take(topK)
                .ToList();
        }
    }
}
