using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Uno_API.Services
{
    public interface IGoogleDriveStorageService
    {
        bool IsConfigured { get; }
        Task<string> EnsureProjectFolderAsync(string projectCode);
        Task<(string projectFolderId, string tourFolderId, string importFolderId, string invoiceFolderId)> EnsureTourFoldersAsync(string projectCode, string tourCode);
        Task<string> UploadFileAsync(string parentFolderId, string fileName, string contentType, Stream fileStream);
        Task<bool> DownloadFileAsync(string fileId, Stream outputStream);
        Task<bool> DownloadFileByNameAsync(string folderId, string fileName, Stream outputStream);
        Task<List<GoogleDriveFileInfo>> ListFilesInFolderAsync(string folderId);
        Task<TourSyncResult> SyncTourInvoicesAsync(int tourId, string projectCode, string tourCode, string localInvoiceDir, string localUploadsDir);
    }

    public class GoogleDriveFileInfo
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string MimeType { get; set; } = string.Empty;
        public long? Size { get; set; }
    }

    public class TourSyncResult
    {
        public int TourId { get; set; }
        public string TourCode { get; set; } = string.Empty;
        public string InvoiceFolderId { get; set; } = string.Empty;
        public List<string> UploadedToDrive { get; set; } = new();
        public List<string> DownloadedToLocal { get; set; } = new();
        public List<string> SyncedFiles { get; set; } = new();
        public string Message { get; set; } = string.Empty;
    }
}
