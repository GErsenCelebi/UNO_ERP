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
    public class ExcursionsController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public ExcursionsController(UnoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Excursion>>> GetExcursions()
        {
            return await _context.Excursions.Include(e => e.Vendor).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Excursion>> GetExcursion(int id)
        {
            var excursion = await _context.Excursions.Include(e => e.Vendor).FirstOrDefaultAsync(e => e.Id == id);
            if (excursion == null) return NotFound();
            return excursion;
        }

        [HttpPost]
        public async Task<ActionResult<Excursion>> PostExcursion(Excursion excursion)
        {
            _context.Excursions.Add(excursion);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetExcursion), new { id = excursion.Id }, excursion);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutExcursion(int id, Excursion excursion)
        {
            if (id != excursion.Id) return BadRequest();
            _context.Entry(excursion).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExcursionExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExcursion(int id)
        {
            var excursion = await _context.Excursions.FindAsync(id);
            if (excursion == null) return NotFound();
            _context.Excursions.Remove(excursion);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ExcursionExists(int id)
        {
            return _context.Excursions.Any(e => e.Id == id);
        }
    }
}
