using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourServicesController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public TourServicesController(UnoDbContext context)
        {
            _context = context;
        }

        // GET: api/TourServices?tourId=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TourService>>> GetTourServices([FromQuery] int? tourId)
        {
            var query = _context.TourServices
                .Include(ts => ts.ServiceCategory)
                .AsQueryable();

            if (tourId.HasValue)
            {
                query = query.Where(ts => ts.TourId == tourId.Value);
            }

            return await query.ToListAsync();
        }

        // GET: api/TourServices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TourService>> GetTourService(int id)
        {
            var tourService = await _context.TourServices
                .Include(ts => ts.ServiceCategory)
                .FirstOrDefaultAsync(ts => ts.Id == id);

            if (tourService == null)
            {
                return NotFound();
            }

            return tourService;
        }

        // POST: api/TourServices
        [HttpPost]
        public async Task<ActionResult<TourService>> PostTourService(TourService tourService)
        {
            // Validate TourId exists
            if (!await _context.Tours.AnyAsync(t => t.Id == tourService.TourId))
            {
                return BadRequest("Invalid TourId. Tour does not exist.");
            }

            // Auto-calculate TotalAmount if 0 or not provided
            if (tourService.TotalAmount == 0)
            {
                tourService.TotalAmount = tourService.Quantity * tourService.UnitPrice;
            }

            // Default ServiceCategoryId if not supplied
            if (tourService.ServiceCategoryId == 0)
            {
                var category = await _context.ServiceCategories.FirstOrDefaultAsync();
                tourService.ServiceCategoryId = category?.Id ?? 1;
            }

            _context.TourServices.Add(tourService);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTourService), new { id = tourService.Id }, tourService);
        }

        // PUT: api/TourServices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTourService(int id, TourService tourService)
        {
            if (id != tourService.Id)
            {
                return BadRequest();
            }

            // Auto-calculate TotalNights
            // Recalculate TotalAmount if 0
            if (tourService.TotalAmount == 0)
            {
                tourService.TotalAmount = tourService.Quantity * tourService.UnitPrice;
            }

            _context.Entry(tourService).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TourServiceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/TourServices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTourService(int id)
        {
            var tourService = await _context.TourServices.FindAsync(id);
            if (tourService == null)
            {
                return NotFound();
            }

            _context.TourServices.Remove(tourService);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TourServiceExists(int id)
        {
            return _context.TourServices.Any(e => e.Id == id);
        }
    }
}
