using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PassengersController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public PassengersController(UnoDbContext context)
        {
            _context = context;
        }

        // GET: api/Passengers?tourId=1
        [HttpGet]
        public async Task<IActionResult> GetPassengers([FromQuery] int? tourId)
        {
            var query = _context.Passengers.AsQueryable();
            if (tourId.HasValue)
            {
                query = query.Where(p => p.TourId == tourId.Value);
            }
            return Ok(await query.ToListAsync());
        }

        // GET: api/Passengers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPassenger(int id)
        {
            var passenger = await _context.Passengers.FindAsync(id);
            if (passenger == null) return NotFound();
            return Ok(passenger);
        }

        // POST: api/Passengers
        [HttpPost]
        public async Task<IActionResult> CreatePassenger([FromBody] Passenger passenger)
        {
            if (!await _context.Tours.AnyAsync(t => t.Id == passenger.TourId))
            {
                return BadRequest("Invalid TourId.");
            }

            _context.Passengers.Add(passenger);
            await _context.SaveChangesAsync();

            // Recalculate tour pax
            await RecalculateTourPax(passenger.TourId);

            return CreatedAtAction(nameof(GetPassenger), new { id = passenger.Id }, passenger);
        }

        // PUT: api/Passengers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePassenger(int id, [FromBody] Passenger passenger)
        {
            if (id != passenger.Id) return BadRequest();

            var dbP = await _context.Passengers.FindAsync(id);
            if (dbP == null) return NotFound();

            dbP.FirstName = passenger.FirstName;
            dbP.LastName = passenger.LastName;
            dbP.Gender = passenger.Gender;
            dbP.NationalId = passenger.NationalId;
            dbP.DateOfBirth = passenger.DateOfBirth;
            dbP.Phone = passenger.Phone;
            dbP.PassportNo = passenger.PassportNo;
            dbP.PassportType = passenger.PassportType;
            dbP.VisaNo = passenger.VisaNo;
            dbP.RoomType = passenger.RoomType;
            dbP.Address = passenger.Address;
            dbP.Pax = passenger.Pax > 0 ? passenger.Pax : 1;

            _context.Entry(dbP).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // Recalculate tour pax
            await RecalculateTourPax(dbP.TourId);

            return NoContent();
        }

        // DELETE: api/Passengers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePassenger(int id)
        {
            var passenger = await _context.Passengers.FindAsync(id);
            if (passenger == null) return NotFound();

            int tourId = passenger.TourId;
            _context.Passengers.Remove(passenger);
            await _context.SaveChangesAsync();

            // Recalculate tour pax
            await RecalculateTourPax(tourId);

            return NoContent();
        }

        private async Task RecalculateTourPax(int tourId)
        {
            var tour = await _context.Tours.FindAsync(tourId);
            if (tour == null) return;

            var passengers = await _context.Passengers
                .Where(p => p.TourId == tourId)
                .ToListAsync();

            var staffKeywords = new[] { "driver", "guide", "rehber", "kaptan", "sofor", "şöför" };
            var payingPassengers = passengers.Where(p =>
            {
                var fullName = $"{p.FirstName} {p.LastName}".ToLower();
                return !staffKeywords.Any(kw => fullName.Contains(kw));
            }).ToList();

            int adultCount = 0;
            int childCount = 0;
            int infantCount = 0;

            foreach (var p in payingPassengers)
            {
                int paxVal = p.Pax > 0 ? p.Pax : 1;
                if (p.DateOfBirth.HasValue)
                {
                    var age = (DateTime.Now - p.DateOfBirth.Value).TotalDays / 365.25;
                    if (age < 2) infantCount += paxVal;
                    else if (age < 12) childCount += paxVal;
                    else adultCount += paxVal;
                }
                else
                {
                    adultCount += paxVal;
                }
            }

            if (tour.BaseFee == 0) tour.BaseFee = 250m;
            tour.Adults = adultCount;
            tour.Children = childCount;
            tour.Infants = infantCount;
            tour.Pax = adultCount + childCount;
            tour.TotalFee = (adultCount * tour.BaseFee) + (childCount * tour.BaseFee * 0.5m);

            await _context.SaveChangesAsync();
        }
    }
}
