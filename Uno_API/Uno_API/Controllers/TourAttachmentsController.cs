using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [Route("api/tours/{tourId}/attachments")]
    [ApiController]
    public class TourAttachmentsController : ControllerBase
    {
        private readonly UnoDbContext _context;
        private readonly IWebHostEnvironment _env;

        public TourAttachmentsController(UnoDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
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

            var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var uploadsDir = Path.Combine(webRoot, "uploads", "tours", tourId.ToString());

            if (!Directory.Exists(uploadsDir))
            {
                Directory.CreateDirectory(uploadsDir);
            }

            var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(uploadsDir, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = $"/uploads/tours/{tourId}/{uniqueFileName}";

            var attachment = new TourAttachment
            {
                TourId = tourId,
                FileName = file.FileName,
                FilePath = relativePath,
                FileType = file.ContentType,
                FileSize = file.Length,
                Description = description,
                UploadedAt = DateTime.UtcNow
            };

            _context.TourAttachments.Add(attachment);
            await _context.SaveChangesAsync();

            return Ok(attachment);
        }

        // GET: api/tours/5/attachments/10/view
        [HttpGet("{id}/view")]
        public async Task<IActionResult> ViewAttachment(int tourId, int id)
        {
            var attachment = await _context.TourAttachments.FirstOrDefaultAsync(a => a.Id == id && a.TourId == tourId);
            if (attachment == null) return NotFound();

            var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var fullPath = Path.Combine(webRoot, attachment.FilePath.TrimStart('/'));
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
            var attachment = await _context.TourAttachments.FirstOrDefaultAsync(a => a.Id == id && a.TourId == tourId);
            if (attachment == null) return NotFound();

            var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var fullPath = Path.Combine(webRoot, attachment.FilePath.TrimStart('/'));
            if (!System.IO.File.Exists(fullPath)) return NotFound("File not found on server.");

            var contentType = string.IsNullOrEmpty(attachment.FileType) ? "application/octet-stream" : attachment.FileType;
            var bytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            return File(bytes, contentType, attachment.FileName);
        }

        // DELETE: api/tours/5/attachments/10
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttachment(int tourId, int id)
        {
            var attachment = await _context.TourAttachments.FirstOrDefaultAsync(a => a.Id == id && a.TourId == tourId);
            if (attachment == null)
            {
                return NotFound();
            }

            // Remove file from disk if exists
            var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var fullPath = Path.Combine(webRoot, attachment.FilePath.TrimStart('/'));
            if (System.IO.File.Exists(fullPath))
            {
                try
                {
                    System.IO.File.Delete(fullPath);
                }
                catch { }
            }

            _context.TourAttachments.Remove(attachment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
