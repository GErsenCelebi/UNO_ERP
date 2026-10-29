using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;
using Uno_API.Services;

namespace Uno_API.Controllers
{
    [Route("api/tours/{tourId}/attachments")]
    [ApiController]
    public class TourAttachmentsController : ControllerBase
    {
        private readonly UnoDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IStorageService _storageService;
        private readonly IGoogleDriveStorageService _driveStorage;
        private readonly ILogger<TourAttachmentsController> _logger;

        public TourAttachmentsController(
            UnoDbContext context,
            IWebHostEnvironment env,
            IStorageService storageService,
            IGoogleDriveStorageService driveStorage,
            ILogger<TourAttachmentsController> logger)
        {
            _context = context;
            _env = env;
            _storageService = storageService;
            _driveStorage = driveStorage;
            _logger = logger;
        }

        // GET: api/tours/5/attachments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TourAttachment>>> GetAttachments(int tourId)
        {
            return await _context.TourAttachments
                .Where(a => a.TourId == tourId)
                .OrderByDescending(a => a.UploadedAt)
                .ToListAsync();
        }

        // POST: api/tours/5/attachments
        [HttpPost]
        public async Task<ActionResult<TourAttachment>> UploadAttachment(int tourId, [FromForm] IFormFile file, [FromForm] string? description)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file was uploaded.");
            }

            var tour = await _context.Tours.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == tourId);
            string targetPath;

            if (tour != null)
            {
                var projectCode = tour.Project?.ProjectCode ?? $"Project_{tour.ProjectId}";
                var tourCode = tour.TourCode ?? $"Tour_{tour.Id}";
                var (_, _, invoiceDir) = _storageService.EnsureTourFolders(projectCode, tourCode);

                var safeFileName = Path.GetFileName(file.FileName);
                targetPath = Path.Combine(invoiceDir, safeFileName);

                using (var stream = new FileStream(targetPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Also keep a copy in wwwroot/uploads/tours/{tourId} for local web fallback
                try
                {
                    var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
                    var uploadsDir = Path.Combine(webRoot, "uploads", "tours", tourId.ToString());
                    if (!Directory.Exists(uploadsDir)) Directory.CreateDirectory(uploadsDir);
                    var fallbackPath = Path.Combine(uploadsDir, safeFileName);
                    System.IO.File.Copy(targetPath, fallbackPath, true);
                }
                catch { }

                // Stream directly to Google Drive per original plan
                try
                {
                    if (_driveStorage.IsConfigured)
                    {
                        var (_, _, _, invoiceFolderId) = await _driveStorage.EnsureTourFoldersAsync(projectCode, tourCode);
                        if (!string.IsNullOrEmpty(invoiceFolderId))
                        {
                            using var uploadStream = new FileStream(targetPath, FileMode.Open, FileAccess.Read);
                            await _driveStorage.UploadFileAsync(invoiceFolderId, safeFileName, file.ContentType ?? "application/octet-stream", uploadStream);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to stream uploaded file to Google Drive: {Message}", ex.Message);
                }
            }
            else
            {
                var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
                var uploadsDir = Path.Combine(webRoot, "uploads", "tours", tourId.ToString());

                if (!Directory.Exists(uploadsDir))
                {
                    Directory.CreateDirectory(uploadsDir);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                targetPath = Path.Combine(uploadsDir, uniqueFileName);

                using (var stream = new FileStream(targetPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
            }

            var attachment = new TourAttachment
            {
                TourId = tourId,
                FileName = file.FileName,
                FilePath = targetPath,
                FileType = file.ContentType,
                FileSize = file.Length,
                Description = description,
                UploadedAt = DateTime.UtcNow
            };

            _context.TourAttachments.Add(attachment);
            await _context.SaveChangesAsync();

            return Ok(attachment);
        }

        // Helper to resolve full path from either UNO_storage, wwwroot, or Google Drive on-demand
        private async Task<(TourAttachment attachment, string fullPath)?> ResolveAttachmentPath(int tourId, int id)
        {
            var attachment = await _context.TourAttachments.FirstOrDefaultAsync(a => a.Id == id && a.TourId == tourId);
            if (attachment == null) return null;

            string fullPath = attachment.FilePath;

            // 1. Direct path check
            if (System.IO.File.Exists(fullPath) && new FileInfo(fullPath).Length > 0)
            {
                return (attachment, fullPath);
            }

            var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var contentRoot = _env.ContentRootPath;
            var fileName = attachment.FileName;
            var cleanPath = attachment.FilePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var justName = Path.GetFileName(attachment.FilePath);

            // 2. Candidate paths in webRoot and contentRoot
            var candidatePaths = new List<string>
            {
                Path.Combine(webRoot, cleanPath),
                Path.Combine(contentRoot, cleanPath),
                Path.Combine(webRoot, "uploads", "tours", tourId.ToString(), fileName),
                Path.Combine(contentRoot, "uploads", "tours", tourId.ToString(), fileName),
                Path.Combine(webRoot, "uploads", "tours", tourId.ToString(), justName),
                Path.Combine(contentRoot, "uploads", "tours", tourId.ToString(), justName)
            };

            var tour = await _context.Tours.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == tourId);
            string projectCode = tour?.Project?.ProjectCode ?? $"Project_{tour?.ProjectId ?? 0}";
            string tourCode = tour?.TourCode ?? $"Tour_{tourId}";
            string invoiceDir = "";

            if (tour != null)
            {
                var (_, _, invDir) = _storageService.EnsureTourFolders(projectCode, tourCode);
                invoiceDir = invDir;
                candidatePaths.Add(Path.Combine(invoiceDir, fileName));
                candidatePaths.Add(Path.Combine(invoiceDir, justName));

                var altStorage = Path.Combine(contentRoot, "Storage", _storageService.SanitizeFolderName(projectCode), _storageService.SanitizeFolderName(tourCode), "Invoice");
                candidatePaths.Add(Path.Combine(altStorage, fileName));
                candidatePaths.Add(Path.Combine(altStorage, justName));
            }

            foreach (var cand in candidatePaths)
            {
                if (System.IO.File.Exists(cand) && new FileInfo(cand).Length > 0)
                {
                    return (attachment, cand);
                }
            }

            // 3. Scan directories
            var dirsToScan = new List<string>
            {
                Path.Combine(webRoot, "uploads", "tours", tourId.ToString()),
                Path.Combine(contentRoot, "uploads", "tours", tourId.ToString())
            };
            if (!string.IsNullOrEmpty(invoiceDir)) dirsToScan.Add(invoiceDir);

            foreach (var dir in dirsToScan)
            {
                if (Directory.Exists(dir))
                {
                    var found = Directory.GetFiles(dir, $"*{fileName}*").FirstOrDefault();
                    if (found != null && System.IO.File.Exists(found) && new FileInfo(found).Length > 0)
                    {
                        return (attachment, found);
                    }
                }
            }

            // 4. Fallback to Google Drive: download on-demand!
            if (_driveStorage.IsConfigured && tour != null)
            {
                try
                {
                    var (_, _, _, invoiceFolderId) = await _driveStorage.EnsureTourFoldersAsync(projectCode, tourCode);
                    if (!string.IsNullOrEmpty(invoiceFolderId))
                    {
                        if (string.IsNullOrEmpty(invoiceDir))
                        {
                            var (_, _, invDir) = _storageService.EnsureTourFolders(projectCode, tourCode);
                            invoiceDir = invDir;
                        }

                        var destPath = Path.Combine(invoiceDir, fileName);
                        using var memStream = new MemoryStream();
                        bool downloaded = await _driveStorage.DownloadFileByNameAsync(invoiceFolderId, fileName, memStream);
                        if (downloaded)
                        {
                            memStream.Position = 0;
                            using (var fileStream = new FileStream(destPath, FileMode.Create, FileAccess.Write))
                            {
                                await memStream.CopyToAsync(fileStream);
                            }

                            try
                            {
                                var uploadsDir = Path.Combine(webRoot, "uploads", "tours", tourId.ToString());
                                if (!Directory.Exists(uploadsDir)) Directory.CreateDirectory(uploadsDir);
                                System.IO.File.Copy(destPath, Path.Combine(uploadsDir, fileName), true);
                            }
                            catch { }

                            return (attachment, destPath);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to download attachment {FileName} on demand from Google Drive: {Message}", fileName, ex.Message);
                }
            }

            return (attachment, fullPath);
        }

        // GET: api/tours/5/attachments/10/view
        [HttpGet("{id}/view")]
        public async Task<IActionResult> ViewAttachment(int tourId, int id)
        {
            var resolved = await ResolveAttachmentPath(tourId, id);
            if (resolved == null) return NotFound();

            var (attachment, fullPath) = resolved.Value;
            if (!System.IO.File.Exists(fullPath)) return NotFound("File not found on server.");

            var contentType = string.IsNullOrEmpty(attachment.FileType) ? "application/octet-stream" : attachment.FileType;
            var bytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            Response.Headers.Append("Content-Disposition", $"inline; filename=\"{attachment.FileName}\"");
            return File(bytes, contentType);
        }

        // GET: api/tours/5/attachments/10/download
        [HttpGet("{id}/download")]
        public async Task<IActionResult> DownloadAttachment(int tourId, int id)
        {
            var resolved = await ResolveAttachmentPath(tourId, id);
            if (resolved == null) return NotFound();

            var (attachment, fullPath) = resolved.Value;
            if (!System.IO.File.Exists(fullPath)) return NotFound("File not found on server.");

            var contentType = string.IsNullOrEmpty(attachment.FileType) ? "application/octet-stream" : attachment.FileType;
            var bytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            return File(bytes, contentType, attachment.FileName);
        }

        // POST: api/tours/5/attachments/sync-drive
        [HttpPost("sync-drive")]
        [HttpGet("sync-drive")]
        public async Task<ActionResult<TourSyncResult>> SyncTourWithGoogleDrive(int tourId)
        {
            var tour = await _context.Tours.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == tourId);
            if (tour == null) return NotFound($"Tour with ID {tourId} not found.");

            var projectCode = tour.Project?.ProjectCode ?? $"Project_{tour.ProjectId}";
            var tourCode = tour.TourCode ?? $"Tour_{tour.Id}";
            var (_, _, invoiceDir) = _storageService.EnsureTourFolders(projectCode, tourCode);

            var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var uploadsDir = Path.Combine(webRoot, "uploads", "tours", tourId.ToString());

            var result = await _driveStorage.SyncTourInvoicesAsync(tourId, projectCode, tourCode, invoiceDir, uploadsDir);

            // Update database attachment records with valid paths and sizes
            var attachments = await _context.TourAttachments.Where(a => a.TourId == tourId).ToListAsync();
            foreach (var att in attachments)
            {
                var localFile = Path.Combine(invoiceDir, att.FileName);
                if (System.IO.File.Exists(localFile))
                {
                    att.FilePath = localFile;
                    var len = new FileInfo(localFile).Length;
                    if (att.FileSize == 0 && len > 0) att.FileSize = len;
                }
            }
            await _context.SaveChangesAsync();

            return Ok(result);
        }

        // DELETE: api/tours/5/attachments/10
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttachment(int tourId, int id)
        {
            var resolved = await ResolveAttachmentPath(tourId, id);
            if (resolved == null)
            {
                return NotFound();
            }

            var (attachment, fullPath) = resolved.Value;

            if (System.IO.File.Exists(fullPath))
            {
                try
                {
                    System.IO.File.Delete(fullPath);
                }
                catch { }
            }

            // Also cleanup from webRoot if a copy exists
            var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var candidate = Path.Combine(webRoot, attachment.FilePath.TrimStart('/'));
            if (System.IO.File.Exists(candidate))
            {
                try { System.IO.File.Delete(candidate); } catch { }
            }

            _context.TourAttachments.Remove(attachment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
