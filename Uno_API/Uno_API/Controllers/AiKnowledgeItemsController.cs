using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;
using Uno_API.Services;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiKnowledgeItemsController : ControllerBase
    {
        private readonly UnoDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AiKnowledgeItemsController(UnoDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/AiKnowledgeItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AiKnowledgeItem>>> GetAiKnowledgeItems()
        {
            return await _context.AiKnowledgeItems
                .OrderByDescending(k => k.UpdatedAt)
                .ToListAsync();
        }

        // GET: api/AiKnowledgeItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AiKnowledgeItem>> GetAiKnowledgeItem(int id)
        {
            var item = await _context.AiKnowledgeItems.FindAsync(id);
            if (item == null) return NotFound();
            return item;
        }

        // POST: api/AiKnowledgeItems
        [HttpPost]
        public async Task<ActionResult<AiKnowledgeItem>> CreateAiKnowledgeItem(AiKnowledgeItem item)
        {
            item.CreatedAt = DateTime.UtcNow;
            item.UpdatedAt = DateTime.UtcNow;
            _context.AiKnowledgeItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAiKnowledgeItem", new { id = item.Id }, item);
        }

        // PUT: api/AiKnowledgeItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAiKnowledgeItem(int id, AiKnowledgeItem item)
        {
            if (id != item.Id) return BadRequest();

            item.UpdatedAt = DateTime.UtcNow;
            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AiKnowledgeItemExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/AiKnowledgeItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAiKnowledgeItem(int id)
        {
            var item = await _context.AiKnowledgeItems.FindAsync(id);
            if (item == null) return NotFound();

            _context.AiKnowledgeItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/AiKnowledgeItems/sync-repository
        [HttpPost("sync-repository")]
        public async Task<ActionResult<FileRepositoryIndexerResult>> SyncDocumentationRepository()
        {
            var indexer = new FileRepositoryIndexer(_context);
            var result = await indexer.IndexWorkspaceMarkdownFilesAsync();
            return Ok(result);
        }

        // POST: api/AiKnowledgeItems/upload-md
        [HttpPost("upload-md")]
        public async Task<IActionResult> UploadMarkdownFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            if (!file.FileName.EndsWith(".md", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Only Markdown (.md) files are supported");

            // 1. Resolve production / webRoot KB folder
            var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var kbFolder = Path.Combine(webRoot, "KB");
            if (!Directory.Exists(kbFolder))
            {
                Directory.CreateDirectory(kbFolder);
            }

            // 2. Save uploaded .md file to disk in KB folder
            var savedPath = Path.Combine(kbFolder, Path.GetFileName(file.FileName));
            using (var stream = new FileStream(savedPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Also save dev copy in UserManuals/KB if running locally
            var devKbFolder = @"C:\Ersen\Projects_2025\Uno_ERP\UserManuals\KB";
            if (Directory.Exists(@"C:\Ersen\Projects_2025\Uno_ERP\UserManuals"))
            {
                if (!Directory.Exists(devKbFolder)) Directory.CreateDirectory(devKbFolder);
                var devSavedPath = Path.Combine(devKbFolder, Path.GetFileName(file.FileName));
                using var devStream = new FileStream(devSavedPath, FileMode.Create);
                file.OpenReadStream().Position = 0;
                await file.CopyToAsync(devStream);
            }

            // 3. Read content & parse sections into AiKnowledgeItems DB table
            file.OpenReadStream().Position = 0;
            using var reader = new StreamReader(file.OpenReadStream());
            var content = await reader.ReadToEndAsync();

            var indexer = new FileRepositoryIndexer(_context);
            var itemsCount = await indexer.ParseAndSaveMarkdownSectionsAsync(file.FileName, content);

            return Ok(new { Message = $"Successfully uploaded, saved to KB folder, and parsed '{file.FileName}'!", ItemsIngested = itemsCount });
        }

        private bool AiKnowledgeItemExists(int id)
        {
            return _context.AiKnowledgeItems.Any(e => e.Id == id);
        }
    }
}
