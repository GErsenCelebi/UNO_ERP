using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourStatusesController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public TourStatusesController(UnoDbContext context)
        {
            _context = context;
        }

        // GET: api/TourStatuses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TourStatus>>> GetTourStatuses()
        {
            return await _context.TourStatuses.OrderBy(s => s.OrderIndex).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TourStatus>> GetTourStatus(int id)
        {
            var status = await _context.TourStatuses.FindAsync(id);
            if (status == null) return NotFound();
            return status;
        }

        [HttpPost]
        public async Task<ActionResult<TourStatus>> PostTourStatus(TourStatus status)
        {
            _context.TourStatuses.Add(status);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTourStatus), new { id = status.Id }, status);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTourStatus(int id, TourStatus status)
        {
            if (id != status.Id) return BadRequest();
            _context.Entry(status).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TourStatusExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTourStatus(int id)
        {
            var status = await _context.TourStatuses.FindAsync(id);
            if (status == null) return NotFound();
            _context.TourStatuses.Remove(status);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool TourStatusExists(int id)
        {
            return _context.TourStatuses.Any(e => e.Id == id);
        }
    }
}
