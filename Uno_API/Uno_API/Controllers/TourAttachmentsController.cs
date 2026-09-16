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

        public TourAttachmentsController(UnoDbContext context, IWebHostEnvironment env, IStorageService storageService)
        {
            _context = context;
            _env = env;
            _storageService = storageService;
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

        // Helper to resolve full path from either UNO_storage or wwwroot
        private async Task<(TourAttachment attachment, string fullPath)?> ResolveAttachmentPath(int tourId, int id)
        {
            var attachment = await _context.TourAttachments.FirstOrDefaultAsync(a => a.Id == id && a.TourId == tourId);
            if (attachment == null) return null;

            string fullPath = attachment.FilePath;

            // 1. Direct path check
            if (System.IO.File.Exists(fullPath))
            {
                return (attachment, fullPath);
            }

            // 2. Check UNO_storage invoiceDir
            var tour = await _context.Tours.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == tourId);
            if (tour != null)
            {
                var projectCode = tour.Project?.ProjectCode ?? $"Project_{tour.ProjectId}";
                var tourCode = tour.TourCode ?? $"Tour_{tour.Id}";
                var (_, _, invoiceDir) = _storageService.EnsureTourFolders(projectCode, tourCode);
                var inStorage = Path.Combine(invoiceDir, attachment.FileName);
                if (System.IO.File.Exists(inStorage))
                {
                    return (attachment, inStorage);
                }
            }

            // 3. Check webRoot relative path (legacy uploads)
            var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var candidate = Path.Combine(webRoot, attachment.FilePath.TrimStart('/'));
            if (System.IO.File.Exists(candidate))
            {
                return (attachment, candidate);
            }

            // 4. Check webRoot uploads/tours/{tourId} directory for matching filename
            var fallbackTourDir = Path.Combine(webRoot, "uploads", "tours", tourId.ToString());
            if (Directory.Exists(fallbackTourDir))
            {
                var matchingFile = Directory.GetFiles(fallbackTourDir, $"*{attachment.FileName}").FirstOrDefault();
                if (matchingFile != null && System.IO.File.Exists(matchingFile))
                {
                    return (attachment, matchingFile);
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
