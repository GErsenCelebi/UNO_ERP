using System;
using System.Threading;
using System.Threading.Tasks;
using Uno_API.Controllers;

namespace Uno_API.Services.ItineraryCopilot
{
    public interface IItineraryCopilotAgentService
    {
        Task<AIChatResponse> ExecuteAsync(AIChatRequest request, CancellationToken cancellationToken = default);
    }
}
