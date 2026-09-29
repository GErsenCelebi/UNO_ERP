using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Uno_API.Services
{
    public class OllamaLlmService : ILocalLlmService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<OllamaLlmService> _logger;
        private readonly string _baseUrl;
        private string _configuredModel;
        private DateTime _lastHealthCheck = DateTime.MinValue;
        private bool _lastHealthStatus = false;
        private static readonly TimeSpan HealthCheckInterval = TimeSpan.FromSeconds(30);

        public OllamaLlmService(HttpClient httpClient, IConfiguration configuration, ILogger<OllamaLlmService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _baseUrl = configuration["Ollama:BaseUrl"] ?? "http://localhost:11434";
            _configuredModel = configuration["Ollama:Model"] ?? "qwen2.5:7b";

            _httpClient.BaseAddress = new Uri(_baseUrl);
            _httpClient.Timeout = TimeSpan.FromSeconds(90);
        }

        public string GetConfiguredModelName() => _configuredModel;

        public async Task<bool> IsLlmAvailableAsync(CancellationToken cancellationToken = default)
        {
            if ((DateTime.UtcNow - _lastHealthCheck) < HealthCheckInterval)
            {
                return _lastHealthStatus;
            }

            try
            {
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                cts.CancelAfter(TimeSpan.FromSeconds(3));

                var response = await _httpClient.GetAsync("/api/tags", cts.Token);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync(cts.Token);
                    var tagsDoc = JsonSerializer.Deserialize<OllamaTagsResponse>(content);
                    
                    if (tagsDoc?.Models != null && tagsDoc.Models.Count > 0)
                    {
                        // If configured model not found but other models exist, adapt to first available
                        if (!tagsDoc.Models.Any(m => m.Name.Contains(_configuredModel, StringComparison.OrdinalIgnoreCase)))
                        {
                            var best = tagsDoc.Models.FirstOrDefault(m => m.Name.Contains("qwen", StringComparison.OrdinalIgnoreCase) || 
                                                                          m.Name.Contains("llama", StringComparison.OrdinalIgnoreCase) || 
                                                                          m.Name.Contains("mistral", StringComparison.OrdinalIgnoreCase)) ?? tagsDoc.Models[0];
                            _configuredModel = best.Name;
                        }
                    }

                    _lastHealthStatus = true;
                    _lastHealthCheck = DateTime.UtcNow;
                    return true;
                }
            }
            catch (Exception ex)
            {
                _logger.LogDebug("[OllamaLlmService] Health check failed: {Message}", ex.Message);
            }

            _lastHealthStatus = false;
            _lastHealthCheck = DateTime.UtcNow;
            return false;
        }

        public async Task<string?> GenerateChatResponseAsync(
            string systemPrompt, 
            string userPrompt, 
            List<LlmChatMessage>? history = null, 
            LlmGenerationOptions? options = null, 
            CancellationToken cancellationToken = default)
        {
            var isAvailable = await IsLlmAvailableAsync(cancellationToken);
            if (!isAvailable)
            {
                _logger.LogWarning("[OllamaLlmService] Local LLM is not accessible at {BaseUrl}", _baseUrl);
                return null;
            }

            var modelToUse = options?.Model ?? _configuredModel;
            var temperature = options?.Temperature ?? 0.2f;

            var messages = new List<object>();

            if (!string.IsNullOrWhiteSpace(systemPrompt))
            {
                messages.Add(new { role = "system", content = systemPrompt });
            }

            if (history != null && history.Count > 0)
            {
                foreach (var h in history)
                {
                    messages.Add(new { role = h.Role, content = h.Content });
                }
            }

            messages.Add(new { role = "user", content = userPrompt });

            var maxTokens = options?.MaxTokens ?? 600;
            var payload = new
            {
                model = modelToUse,
                messages = messages,
                stream = false,
                options = new
                {
                    temperature = temperature,
                    num_predict = maxTokens,
                    num_ctx = 4096
                }
            };

            try
            {
                var json = JsonSerializer.Serialize(payload);
                using var requestContent = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("/api/chat", requestContent, cancellationToken);
                if (!response.IsSuccessStatusCode)
                {
                    var errBody = await response.Content.ReadAsStringAsync(cancellationToken);
                    _logger.LogError("[OllamaLlmService] Chat request failed ({StatusCode}): {Body}", response.StatusCode, errBody);
                    return null;
                }

                var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
                var chatResp = JsonSerializer.Deserialize<OllamaChatResponse>(responseBody);

                return chatResp?.Message?.Content;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[OllamaLlmService] Error generating chat response from local LLM");
                return null;
            }
        }

        private class OllamaTagsResponse
        {
            [JsonPropertyName("models")]
            public List<OllamaModelItem>? Models { get; set; }
        }

        private class OllamaModelItem
        {
            [JsonPropertyName("name")]
            public string Name { get; set; } = string.Empty;
        }

        private class OllamaChatResponse
        {
            [JsonPropertyName("message")]
            public OllamaMessageItem? Message { get; set; }
        }

        private class OllamaMessageItem
        {
            [JsonPropertyName("role")]
            public string Role { get; set; } = string.Empty;

            [JsonPropertyName("content")]
            public string Content { get; set; } = string.Empty;
        }
    }
}
