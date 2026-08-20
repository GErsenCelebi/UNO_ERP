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

        public AiKnowledgeItemsController(UnoDbContext context)
        {
            _context = context;
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

            return CreatedAtAction(nameof(GetAiKnowledgeItem), new { id = item.Id }, item);
        }

        // PUT: api/AiKnowledgeItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAiKnowledgeItem(int id, AiKnowledgeItem item)
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
                if (!_context.AiKnowledgeItems.Any(e => e.Id == id)) return NotFound();
                throw;
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
    }
}
