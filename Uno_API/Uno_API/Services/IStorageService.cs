using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Uno_API.Services
{
    public interface IStorageService
    {
        string GetRootPath();
        string SanitizeFolderName(string rawName);
        string EnsureProjectFolder(string projectCode);
        (string tourPath, string importPath, string invoicePath) EnsureTourFolders(string projectCode, string tourCode);
        Task<string> SaveImportFileAsync(string projectCode, string tourCode, IFormFile file);
        Task<string> SaveImportStreamAsync(string projectCode, string tourCode, string fileName, System.IO.Stream fileStream);
        Task<string> SaveInvoiceFileAsync(string projectCode, string tourCode, string fileName, byte[] pdfBytes);
    }
}
