using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Uno_API.Services
{
    public class StorageService : IStorageService
    {
        private readonly string _rootPath;

        public StorageService(IConfiguration configuration)
        {
            var configuredPath = configuration["StorageSettings:RootPath"];
            if (!string.IsNullOrWhiteSpace(configuredPath))
            {
                _rootPath = configuredPath.Trim();
            }
            else
            {
                // Fallback default if root path is blank
                _rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Storage");
            }
        }

        public string GetRootPath()
        {
            if (!Directory.Exists(_rootPath))
            {
                Directory.CreateDirectory(_rootPath);
            }
            return _rootPath;
        }

        public string SanitizeFolderName(string rawName)
        {
            if (string.IsNullOrWhiteSpace(rawName)) return "Unnamed";

            // 1. Replace illegal OS characters (/ \ : * ? " < > | & ( )) with hyphens
            string sanitized = Regex.Replace(rawName, @"[\\/:*?""<>|&()]", "-");

            // 2. Normalize spaces to hyphens or single spaces
            sanitized = Regex.Replace(sanitized, @"\s+", "-");

            // 3. Collapse multiple hyphens
            sanitized = Regex.Replace(sanitized, @"-+", "-").Trim('-');

            return string.IsNullOrWhiteSpace(sanitized) ? "Unnamed" : sanitized;
        }

        public string EnsureProjectFolder(string projectCode)
        {
            var root = GetRootPath();
            var sanitizedProject = SanitizeFolderName(projectCode);
            var projectDir = Path.Combine(root, sanitizedProject);

            if (!Directory.Exists(projectDir))
            {
                Directory.CreateDirectory(projectDir);
            }

            return projectDir;
        }

        public (string tourPath, string importPath, string invoicePath) EnsureTourFolders(string projectCode, string tourCode)
        {
            var projectDir = EnsureProjectFolder(projectCode);
            var sanitizedTour = SanitizeFolderName(tourCode);
            var tourDir = Path.Combine(projectDir, sanitizedTour);

            var importDir = Path.Combine(tourDir, "Import");
            var invoiceDir = Path.Combine(tourDir, "Invoice");

            if (!Directory.Exists(tourDir)) Directory.CreateDirectory(tourDir);
            if (!Directory.Exists(importDir)) Directory.CreateDirectory(importDir);
            if (!Directory.Exists(invoiceDir)) Directory.CreateDirectory(invoiceDir);

            return (tourDir, importDir, invoiceDir);
        }

        public async Task<string> SaveImportFileAsync(string projectCode, string tourCode, IFormFile file)
        {
            if (file == null || file.Length == 0) return string.Empty;

            var (_, importDir, _) = EnsureTourFolders(projectCode, tourCode);
            var safeFileName = Path.GetFileName(file.FileName);
            var targetPath = Path.Combine(importDir, safeFileName);

            using (var stream = new FileStream(targetPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return targetPath;
        }

        public async Task<string> SaveImportStreamAsync(string projectCode, string tourCode, string fileName, Stream fileStream)
        {
            if (fileStream == null) return string.Empty;

            var (_, importDir, _) = EnsureTourFolders(projectCode, tourCode);
            var safeFileName = Path.GetFileName(fileName);
            var targetPath = Path.Combine(importDir, safeFileName);

            fileStream.Position = 0;
            using (var stream = new FileStream(targetPath, FileMode.Create))
            {
                await fileStream.CopyToAsync(stream);
            }

            return targetPath;
        }

        public async Task<string> SaveInvoiceFileAsync(string projectCode, string tourCode, string fileName, byte[] pdfBytes)
        {
            if (pdfBytes == null || pdfBytes.Length == 0) return string.Empty;

            var (_, _, invoiceDir) = EnsureTourFolders(projectCode, tourCode);
            var safeFileName = Path.GetFileName(fileName);
            var targetPath = Path.Combine(invoiceDir, safeFileName);

            await File.WriteAllBytesAsync(targetPath, pdfBytes);
            return targetPath;
        }
    }
}
