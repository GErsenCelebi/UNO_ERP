using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Uno_API.Services
{
    public class LlmChatMessage
    {
        public string Role { get; set; } = "user"; // "system", "user", "assistant"
        public string Content { get; set; } = string.Empty;
    }

    public class LlmGenerationOptions
    {
        public float Temperature { get; set; } = 0.2f;
        public int MaxTokens { get; set; } = 2048;
        public string? Model { get; set; }
    }

    public interface ILocalLlmService
    {
        /// <summary>
        /// Checks whether the local LLM server (e.g. Ollama) is running and responsive.
        /// </summary>
        Task<bool> IsLlmAvailableAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns the name of the currently active model or default configured model.
        /// </summary>
        string GetConfiguredModelName();

        /// <summary>
        /// Generates an AI completion using the local LLM given a system prompt and user query.
        /// </summary>
        Task<string?> GenerateChatResponseAsync(
            string systemPrompt, 
            string userPrompt, 
            List<LlmChatMessage>? history = null, 
            LlmGenerationOptions? options = null, 
            CancellationToken cancellationToken = default);
    }
}
