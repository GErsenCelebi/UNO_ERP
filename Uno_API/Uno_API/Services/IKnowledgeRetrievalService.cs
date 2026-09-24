using Uno_API.Models;

namespace Uno_API.Services
{
    public class KnowledgeSearchResult
    {
        public AiKnowledgeItem Item { get; set; } = null!;
        public double Score { get; set; }
        public string MatchType { get; set; } = "Keyword"; // "ExactTrigger", "CategoryMatch", "BM25-Hybrid", "LiveQuery"
        public List<string> MatchedTerms { get; set; } = new List<string>();
    }

    public interface IKnowledgeRetrievalService
    {
        Task<KnowledgeSearchResult?> SearchBestMatchAsync(string query, string? category = null);
        Task<List<KnowledgeSearchResult>> SearchTopMatchesAsync(string query, string? category = null, int topK = 3);
        void InvalidateCache();
    }
}
