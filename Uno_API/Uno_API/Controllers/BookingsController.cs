using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public BookingsController(UnoDbContext context)
        {
            _context = context;
        }

        // GET: api/Bookings?tourId=1
        [HttpGet]
        public async Task<IActionResult> GetBookings([FromQuery] int? tourId)
        {
            var query = _context.Bookings
                .Include(b => b.Tour)
                .Include(b => b.Client)
                .AsQueryable();

            if (tourId.HasValue)
            {
                query = query.Where(b => b.TourId == tourId.Value);
            }

            return Ok(await query.ToListAsync());
        }

        // GET: api/Bookings/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Tour)
                .Include(b => b.Client)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null) return NotFound();
            return Ok(booking);
        }

        // POST: api/Bookings
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] Booking booking)
        {
            if (booking.BookingDate == default)
            {
                booking.BookingDate = DateTime.Now;
            }
            if (string.IsNullOrEmpty(booking.Status))
            {
                booking.Status = "Confirmed";
            }

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
        }

        // PUT: api/Bookings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, [FromBody] Booking booking)
        {
            if (id != booking.Id) return BadRequest();

            var dbB = await _context.Bookings.FindAsync(id);
            if (dbB == null) return NotFound();

            dbB.TourId = booking.TourId;
            dbB.ClientId = booking.ClientId;
            dbB.BookingDate = booking.BookingDate;
            dbB.Status = booking.Status;
            dbB.ServiceType = booking.ServiceType;
            dbB.TotalAmount = booking.TotalAmount;

            _context.Entry(dbB).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("sales-tracker")]
        public async Task<IActionResult> GetSalesTrackers()
        {
            return Ok(await _context.SalesTrackers.Include(s => s.Booking).ToListAsync());
        }
    }
}
