using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Uno_API.Models;
using Uno_API.Data;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuidesController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public GuidesController(UnoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Guide>>> GetGuides()
        {
            return await _context.Guides.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Guide>> GetGuide(int id)
        {
            var guide = await _context.Guides.FindAsync(id);
            if (guide == null) return NotFound();
            return guide;
        }

        [HttpPost]
        public async Task<ActionResult<Guide>> PostGuide(Guide guide)
        {
            _context.Guides.Add(guide);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetGuide), new { id = guide.Id }, guide);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutGuide(int id, Guide guide)
        {
            if (id != guide.Id) return BadRequest();
            _context.Entry(guide).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GuideExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGuide(int id)
        {
            var guide = await _context.Guides.FindAsync(id);
            if (guide == null) return NotFound();
            _context.Guides.Remove(guide);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool GuideExists(int id)
        {
            return _context.Guides.Any(e => e.Id == id);
        }
    }
}
