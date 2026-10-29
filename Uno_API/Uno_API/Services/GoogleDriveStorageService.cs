using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Uno_API.Services
{
    public class GoogleDriveStorageService : IGoogleDriveStorageService
    {
        private const string RootStorageFolderId = "10GUJsUS5rKHbEgM5Le1XuwPUqrbtwoRZ"; // UNOERP_Storage
        private const string SharedDriveId = "0AP2cGWeBGQIAUk9PVA";

        private readonly DriveService? _driveService;
        private readonly ILogger<GoogleDriveStorageService> _logger;

        public bool IsConfigured => _driveService != null;

        public GoogleDriveStorageService(IConfiguration configuration, ILogger<GoogleDriveStorageService> logger)
        {
            _logger = logger;

            try
            {
                var candidatePaths = new[]
                {
                    Path.Combine(AppContext.BaseDirectory, "unoerp-storage-9c49eccb2ea7.json"),
                    Path.Combine(Directory.GetCurrentDirectory(), "unoerp-storage-9c49eccb2ea7.json"),
                    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "unoerp-storage-9c49eccb2ea7.json"),
                    @"C:\Ersen\Projects_2025\Uno_ERP\Publish\unoerp-storage-9c49eccb2ea7.json"
                };

                string? keyPath = candidatePaths.FirstOrDefault(File.Exists);

                if (keyPath != null)
                {
                    _logger.LogInformation("Loading Google Drive Service Account key from: {KeyPath}", keyPath);
                    using var stream = new FileStream(keyPath, FileMode.Open, FileAccess.Read);
                    var credential = GoogleCredential.FromStream(stream).CreateScoped(DriveService.Scope.Drive);

                    _driveService = new DriveService(new BaseClientService.Initializer
                    {
                        HttpClientInitializer = credential,
                        ApplicationName = "UNO_ERP"
                    });
                }
                else
                {
                    _logger.LogWarning("Google Drive Service Account key 'unoerp-storage-9c49eccb2ea7.json' not found.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize Google Drive service: {Message}", ex.Message);
            }
        }

        private async Task<string> FindOrCreateFolderAsync(string folderName, string parentId)
        {
            if (_driveService == null) throw new InvalidOperationException("Google Drive service is not configured.");

            var listReq = _driveService.Files.List();
            listReq.Q = $"mimeType = 'application/vnd.google-apps.folder' and name = '{folderName.Replace("'", "\\'")}' and '{parentId}' in parents and trashed = false";
            listReq.Fields = "files(id, name)";
            listReq.SupportsAllDrives = true;
            listReq.IncludeItemsFromAllDrives = true;
            listReq.Corpora = "allDrives";

            var result = await listReq.ExecuteAsync();
            var existing = result.Files?.FirstOrDefault();
            if (existing != null)
            {
                return existing.Id;
            }

            var folderMeta = new Google.Apis.Drive.v3.Data.File
            {
                Name = folderName,
                MimeType = "application/vnd.google-apps.folder",
                Parents = new List<string> { parentId }
            };

            var createReq = _driveService.Files.Create(folderMeta);
            createReq.SupportsAllDrives = true;
            createReq.Fields = "id";
            var created = await createReq.ExecuteAsync();
            return created.Id;
        }

        public async Task<(string projectFolderId, string tourFolderId, string importFolderId, string invoiceFolderId)> EnsureTourFoldersAsync(string projectCode, string tourCode)
        {
            if (_driveService == null) return (string.Empty, string.Empty, string.Empty, string.Empty);

            var projectFolderId = await FindOrCreateFolderAsync(projectCode, RootStorageFolderId);
            var tourFolderId = await FindOrCreateFolderAsync(tourCode, projectFolderId);
            var importFolderId = await FindOrCreateFolderAsync("Import", tourFolderId);
            var invoiceFolderId = await FindOrCreateFolderAsync("Invoice", tourFolderId);

            return (projectFolderId, tourFolderId, importFolderId, invoiceFolderId);
        }

        public async Task<string> UploadFileAsync(string parentFolderId, string fileName, string contentType, Stream fileStream)
        {
            if (_driveService == null) return string.Empty;

            var fileMeta = new Google.Apis.Drive.v3.Data.File
            {
                Name = fileName,
                Parents = new List<string> { parentFolderId }
            };

            var req = _driveService.Files.Create(fileMeta, fileStream, contentType);
            req.SupportsAllDrives = true;
            req.Fields = "id, name, size";
            var progress = await req.UploadAsync();

            if (progress.Status == Google.Apis.Upload.UploadStatus.Completed)
            {
                return req.ResponseBody?.Id ?? string.Empty;
            }

            _logger.LogError("Drive upload failed with exception: {Exception}", progress.Exception);
            return string.Empty;
        }

        public async Task<bool> DownloadFileAsync(string fileId, Stream outputStream)
        {
            if (_driveService == null) return false;

            var req = _driveService.Files.Get(fileId);
            req.SupportsAllDrives = true;
            var progress = await req.DownloadAsync(outputStream);
            return progress.Status == Google.Apis.Download.DownloadStatus.Completed;
        }

        public async Task<bool> DownloadFileByNameAsync(string folderId, string fileName, Stream outputStream)
        {
            if (_driveService == null) return false;

            var listReq = _driveService.Files.List();
            listReq.Q = $"name = '{fileName.Replace("'", "\\'")}' and '{folderId}' in parents and trashed = false";
            listReq.Fields = "files(id, name, mimeType)";
            listReq.SupportsAllDrives = true;
            listReq.IncludeItemsFromAllDrives = true;

            var res = await listReq.ExecuteAsync();
            var file = res.Files?.FirstOrDefault();
            if (file == null) return false;

            return await DownloadFileAsync(file.Id, outputStream);
        }

        public async Task<List<GoogleDriveFileInfo>> ListFilesInFolderAsync(string folderId)
        {
            var list = new List<GoogleDriveFileInfo>();
            if (_driveService == null) return list;

            var listReq = _driveService.Files.List();
            listReq.Q = $"'{folderId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'";
            listReq.Fields = "files(id, name, mimeType, size)";
            listReq.SupportsAllDrives = true;
            listReq.IncludeItemsFromAllDrives = true;

            var res = await listReq.ExecuteAsync();
            if (res.Files != null)
            {
                foreach (var f in res.Files)
                {
                    list.Add(new GoogleDriveFileInfo
                    {
                        Id = f.Id,
                        Name = f.Name,
                        MimeType = f.MimeType,
                        Size = f.Size
                    });
                }
            }

            return list;
        }

        public async Task<TourSyncResult> SyncTourInvoicesAsync(int tourId, string projectCode, string tourCode, string localInvoiceDir, string localUploadsDir)
        {
            var result = new TourSyncResult
            {
                TourId = tourId,
                TourCode = tourCode
            };

            if (_driveService == null)
            {
                result.Message = "Google Drive service is not configured.";
                return result;
            }

            try
            {
                var (_, _, _, invoiceFolderId) = await EnsureTourFoldersAsync(projectCode, tourCode);
                result.InvoiceFolderId = invoiceFolderId;

                if (!Directory.Exists(localInvoiceDir)) Directory.CreateDirectory(localInvoiceDir);
                if (!Directory.Exists(localUploadsDir)) Directory.CreateDirectory(localUploadsDir);

                // 1. Files in Drive -> Sync to Local
                var driveFiles = await ListFilesInFolderAsync(invoiceFolderId);
                foreach (var dFile in driveFiles)
                {
                    var localStoragePath = Path.Combine(localInvoiceDir, dFile.Name);
                    var localUploadsPath = Path.Combine(localUploadsDir, dFile.Name);

                    bool needsDownload = !File.Exists(localStoragePath) || new FileInfo(localStoragePath).Length == 0;
                    if (needsDownload)
                    {
                        using var memStream = new MemoryStream();
                        bool success = await DownloadFileAsync(dFile.Id, memStream);
                        if (success)
                        {
                            memStream.Position = 0;
                            using (var fileStream = new FileStream(localStoragePath, FileMode.Create, FileAccess.Write))
                            {
                                await memStream.CopyToAsync(fileStream);
                            }

                            // Keep copy in uploads fallback as well
                            try
                            {
                                File.Copy(localStoragePath, localUploadsPath, true);
                            }
                            catch { }

                            result.DownloadedToLocal.Add(dFile.Name);
                        }
                    }
                    else
                    {
                        // ensure it's also present in fallback uploads
                        if (!File.Exists(localUploadsPath))
                        {
                            try { File.Copy(localStoragePath, localUploadsPath, true); } catch { }
                        }
                    }

                    result.SyncedFiles.Add(dFile.Name);
                }

                // 2. Files in Local -> Sync to Drive
                var localFiles = Directory.GetFiles(localInvoiceDir);
                foreach (var lFile in localFiles)
                {
                    var fName = Path.GetFileName(lFile);
                    if (!driveFiles.Any(df => string.Equals(df.Name, fName, StringComparison.OrdinalIgnoreCase)))
                    {
                        using var fStream = new FileStream(lFile, FileMode.Open, FileAccess.Read);
                        var uploadedId = await UploadFileAsync(invoiceFolderId, fName, "application/octet-stream", fStream);
                        if (!string.IsNullOrEmpty(uploadedId))
                        {
                            result.UploadedToDrive.Add(fName);
                            result.SyncedFiles.Add(fName);
                        }
                    }
                }

                result.Message = $"Synchronization complete. {result.SyncedFiles.Count} files synced.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error syncing invoices for tour {TourCode}: {Message}", tourCode, ex.Message);
                result.Message = $"Error: {ex.Message}";
            }

            return result;
        }
    }
}
