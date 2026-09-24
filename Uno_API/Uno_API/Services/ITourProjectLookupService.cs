using System.Threading.Tasks;
using Uno_API.Controllers;

namespace Uno_API.Services
{
    public interface ITourProjectLookupService
    {
        Task<AIChatResponse?> TryHandleSpecificEntityQueryAsync(string query, string? contextUrl, string? role);
    }
}
