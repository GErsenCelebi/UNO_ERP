using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    public class ItineraryDayScheduleItem
    {
        public int DayNumber { get; set; }
        public string Title { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string OvernightCity { get; set; } = string.Empty;
        public string MealsIncluded { get; set; } = "Breakfast";
        public string TransitLeg { get; set; } = string.Empty;
        public double DrivingHours { get; set; }
        public bool MandatoryRestStopInserted { get; set; } = false;
        public string? RestStopLocation { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    [Route("api/[controller]")]
    [ApiController]
    public class ProjectItinerariesController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public ProjectItinerariesController(UnoDbContext context)
        {
            _context = context;
        }

        // GET: api/projectitineraries?projectId=5063
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectItinerary>>> GetProjectItineraries([FromQuery] int? projectId)
        {
            var query = _context.ProjectItineraries.AsQueryable();

            if (projectId.HasValue)
            {
                query = query.Where(i => i.ProjectId == projectId.Value);

                // Auto-seed sample itineraries for Project 5063 (Orta Avrupa -BVP) if empty
                if (projectId.Value == 5063 && !await _context.ProjectItineraries.AnyAsync(i => i.ProjectId == 5063))
                {
                    await SeedInitialBvpItinerariesAsync(5063);
                    query = _context.ProjectItineraries.Where(i => i.ProjectId == projectId.Value);
                }
            }

            var list = await query
                .OrderByDescending(i => i.IsPrimary)
                .ThenByDescending(i => i.UpdatedAt)
                .ToListAsync();

            return Ok(list);
        }

        // GET: api/projectitineraries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectItinerary>> GetProjectItinerary(int id)
        {
            var item = await _context.ProjectItineraries.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        // POST: api/projectitineraries
        [HttpPost]
        public async Task<ActionResult<ProjectItinerary>> CreateProjectItinerary([FromBody] ProjectItinerary item)
        {
            if (item == null) return BadRequest("Itinerary payload is required.");

            var projectExists = await _context.Projects.AnyAsync(p => p.Id == item.ProjectId);
            if (!projectExists)
            {
                return BadRequest($"Project with ID {item.ProjectId} does not exist.");
            }

            if (string.IsNullOrWhiteSpace(item.ItineraryCode))
            {
                var count = await _context.ProjectItineraries.CountAsync(i => i.ProjectId == item.ProjectId);
                item.ItineraryCode = $"ITN-PRJ{item.ProjectId}-{(count + 1):D2}";
            }

            item.CreatedAt = DateTime.UtcNow;
            item.UpdatedAt = DateTime.UtcNow;

            if (item.IsPrimary)
            {
                var others = await _context.ProjectItineraries
                    .Where(i => i.ProjectId == item.ProjectId && i.IsPrimary)
                    .ToListAsync();
                foreach (var o in others)
                {
                    o.IsPrimary = false;
                }
            }
            else
            {
                // If it's the very first itinerary for the project, automatically make it primary
                var existingCount = await _context.ProjectItineraries.CountAsync(i => i.ProjectId == item.ProjectId);
                if (existingCount == 0)
                {
                    item.IsPrimary = true;
                }
            }

            _context.ProjectItineraries.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectItinerary), new { id = item.Id }, item);
        }

        // PUT: api/projectitineraries/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProjectItinerary(int id, [FromBody] ProjectItinerary item)
        {
            if (id != item.Id)
            {
                return BadRequest("ID mismatch between route and payload.");
            }

            var existing = await _context.ProjectItineraries.FindAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            existing.Title = item.Title;
            existing.ItineraryCode = item.ItineraryCode;
            existing.Destination = item.Destination;
            existing.DurationDays = item.DurationDays;
            existing.DurationNights = item.DurationNights;
            existing.Season = item.Season;
            existing.TargetPax = item.TargetPax;
            existing.EstimatedCostPerPax = item.EstimatedCostPerPax;
            existing.EstimatedSellPricePerPax = item.EstimatedSellPricePerPax;
            existing.TargetMarginPct = item.TargetMarginPct;
            existing.Status = item.Status;
            existing.Description = item.Description;
            existing.DaysJson = item.DaysJson;
            existing.UpdatedAt = DateTime.UtcNow;

            if (item.IsPrimary && !existing.IsPrimary)
            {
                var others = await _context.ProjectItineraries
                    .Where(i => i.ProjectId == existing.ProjectId && i.Id != id && i.IsPrimary)
                    .ToListAsync();
                foreach (var o in others)
                {
                    o.IsPrimary = false;
                }
                existing.IsPrimary = true;
            }
            else if (!item.IsPrimary && existing.IsPrimary)
            {
                existing.IsPrimary = false;
            }

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: api/projectitineraries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectItinerary(int id)
        {
            var item = await _context.ProjectItineraries.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.ProjectItineraries.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/projectitineraries/5/duplicate
        [HttpPost("{id}/duplicate")]
        public async Task<ActionResult<ProjectItinerary>> DuplicateProjectItinerary(int id)
        {
            var existing = await _context.ProjectItineraries.FindAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            var count = await _context.ProjectItineraries.CountAsync(i => i.ProjectId == existing.ProjectId);
            var clone = new ProjectItinerary
            {
                ProjectId = existing.ProjectId,
                Title = $"{existing.Title} (Copy)",
                ItineraryCode = $"{existing.ItineraryCode}-V{(count + 1)}",
                Destination = existing.Destination,
                DurationDays = existing.DurationDays,
                DurationNights = existing.DurationNights,
                Season = existing.Season,
                TargetPax = existing.TargetPax,
                EstimatedCostPerPax = existing.EstimatedCostPerPax,
                EstimatedSellPricePerPax = existing.EstimatedSellPricePerPax,
                TargetMarginPct = existing.TargetMarginPct,
                Status = "Draft",
                IsPrimary = false,
                Description = existing.Description,
                DaysJson = existing.DaysJson,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.ProjectItineraries.Add(clone);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectItinerary), new { id = clone.Id }, clone);
        }

        // POST: api/projectitineraries/5/set-primary
        [HttpPost("{id}/set-primary")]
        public async Task<IActionResult> SetPrimary(int id)
        {
            var item = await _context.ProjectItineraries.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            var others = await _context.ProjectItineraries
                .Where(i => i.ProjectId == item.ProjectId && i.Id != id && i.IsPrimary)
                .ToListAsync();

            foreach (var o in others)
            {
                o.IsPrimary = false;
            }

            item.IsPrimary = true;
            item.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(item);
        }

        private async Task SeedInitialBvpItinerariesAsync(int projectId)
        {
            var bvpDays = new List<ItineraryDayScheduleItem>
            {
                new ItineraryDayScheduleItem { DayNumber = 1, Title = "Arrival in Budapest & Danube Evening Cruise", City = "Budapest", OvernightCity = "Budapest", MealsIncluded = "Dinner", TransitLeg = "Inbound Flight to BUD Airport", DrivingHours = 0.5, Description = "Group arrival at Budapest Ferenc Liszt Airport. Meet & greet with licensed guide and private coach transfer to 4★ hotel. Evening panoramic sightseeing Danube river cruise with welcome drink." },
                new ItineraryDayScheduleItem { DayNumber = 2, Title = "Grand Budapest City Sightseeing & Castle District", City = "Budapest", OvernightCity = "Budapest", MealsIncluded = "Breakfast", TransitLeg = "Budapest Local Circuit", DrivingHours = 1.0, Description = "Full-day guided tour covering Buda Castle, Fisherman's Bastion, Matthias Church, and Heroes' Square. Afternoon visit to Széchenyi Thermal Baths or optional folklore dinner." },
                new ItineraryDayScheduleItem { DayNumber = 3, Title = "Budapest to Vienna via Bratislava Old Town", City = "Bratislava & Vienna", OvernightCity = "Vienna", MealsIncluded = "Breakfast, Lunch", TransitLeg = "Budapest → Bratislava (200 km) → Vienna (80 km)", DrivingHours = 3.5, MandatoryRestStopInserted = true, RestStopLocation = "Bratislava Castle & Historic Centre", Description = "Depart Budapest towards Vienna with a scenic stop in Slovakia's capital, Bratislava. Walking tour of St. Martin's Cathedral and Old Town Square. Afternoon arrival in Vienna." },
                new ItineraryDayScheduleItem { DayNumber = 4, Title = "Imperial Vienna: Schönbrunn Palace & Ringstraße", City = "Vienna", OvernightCity = "Vienna", MealsIncluded = "Breakfast", TransitLeg = "Vienna City Circuit", DrivingHours = 1.0, Description = "Morning guided tour of the Habsburg dynasty's summer residence, Schönbrunn Palace and Gardens. Afternoon drive along Ringstraße viewing State Opera, Parliament, and Hofburg." },
                new ItineraryDayScheduleItem { DayNumber = 5, Title = "Vienna to Prague via Český Krumlov UNESCO Heritage", City = "Český Krumlov & Prague", OvernightCity = "Prague", MealsIncluded = "Breakfast", TransitLeg = "Vienna → Český Krumlov (210 km) → Prague (175 km)", DrivingHours = 4.2, MandatoryRestStopInserted = true, RestStopLocation = "Český Krumlov Historic Center", Description = "Cross into Southern Bohemia. Guided walking tour through the fairy-tale UNESCO town of Český Krumlov. Continue north to Prague, check in to central accommodation." },
                new ItineraryDayScheduleItem { DayNumber = 6, Title = "Prague Castle & Historic Charles Bridge", City = "Prague", OvernightCity = "Prague", MealsIncluded = "Breakfast", TransitLeg = "Prague Walking & Coach Transfer", DrivingHours = 0.5, Description = "Explore Hradčany Prague Castle complex, St. Vitus Cathedral, Golden Lane, Lesser Town (Malá Strana), and stroll across the historic 14th-century Charles Bridge." },
                new ItineraryDayScheduleItem { DayNumber = 7, Title = "Old Town Square, Astronomical Clock & Vltava Cruise", City = "Prague", OvernightCity = "Prague", MealsIncluded = "Breakfast, Dinner", TransitLeg = "Prague City Core", DrivingHours = 0.5, Description = "Discover Prague's Old Town Square (Staroměstské náměstí) and the medieval Astronomical Clock. Afternoon at leisure for shopping. Farewell Czech traditional dinner." },
                new ItineraryDayScheduleItem { DayNumber = 8, Title = "Prague Departure & Outbound Flight", City = "Prague", OvernightCity = "-", MealsIncluded = "Breakfast", TransitLeg = "Hotel → Prague Václav Havel Airport (PRG)", DrivingHours = 0.5, Description = "Breakfast at hotel. Private coach transfer to Prague Airport for outbound flight departure. End of DMC Central Europe services." }
            };

            var vspDays = new List<ItineraryDayScheduleItem>
            {
                new ItineraryDayScheduleItem { DayNumber = 1, Title = "Arrival in Vienna & Imperial Orientation", City = "Vienna", OvernightCity = "Vienna", MealsIncluded = "Dinner", TransitLeg = "Inbound Flight to VIE Airport", DrivingHours = 0.5, Description = "Arrival at Vienna International Airport. Private coach transfer to hotel. Evening welcome dinner in traditional Grinzing wine tavern." },
                new ItineraryDayScheduleItem { DayNumber = 2, Title = "Vienna Classical Heritage & Hofburg Palace", City = "Vienna", OvernightCity = "Vienna", MealsIncluded = "Breakfast", TransitLeg = "Vienna City Tour", DrivingHours = 1.0, Description = "Guided tour of St. Stephen's Cathedral, Hofburg Imperial Apartments, and Belvedere Palace art gallery featuring Gustav Klimt's 'The Kiss'." },
                new ItineraryDayScheduleItem { DayNumber = 3, Title = "Vienna to Salzburg via Wachau Valley & Melk Abbey", City = "Salzburg", OvernightCity = "Salzburg", MealsIncluded = "Breakfast", TransitLeg = "Vienna → Melk (90 km) → Salzburg (215 km)", DrivingHours = 3.5, MandatoryRestStopInserted = true, RestStopLocation = "Melk Benedictine Abbey overlooking Danube", Description = "Scenic drive through UNESCO Wachau wine valley with a visit to the baroque Melk Abbey. Arrive in Mozart's birthplace Salzburg in late afternoon." },
                new ItineraryDayScheduleItem { DayNumber = 4, Title = "Salzburg: Sound of Music & Hohensalzburg Fortress", City = "Salzburg", OvernightCity = "Salzburg", MealsIncluded = "Breakfast", TransitLeg = "Salzburg Walking Tour", DrivingHours = 0.5, Description = "Mirabell Gardens, Getreidegasse, Mozart's birthplace, and funicular ascent to Hohensalzburg Fortress with sweeping Alpine vistas." },
                new ItineraryDayScheduleItem { DayNumber = 5, Title = "Salzburg to Prague via Plzeň Brewery", City = "Plzeň & Prague", OvernightCity = "Prague", MealsIncluded = "Breakfast, Lunch", TransitLeg = "Salzburg → Plzeň (250 km) → Prague (95 km)", DrivingHours = 4.0, MandatoryRestStopInserted = true, RestStopLocation = "Pilsner Urquell Historic Brewery", Description = "Cross the Czech border into Western Bohemia. VIP tour and traditional lunch at Pilsner Urquell Brewery. Early evening arrival in golden Prague." },
                new ItineraryDayScheduleItem { DayNumber = 6, Title = "Prague Royal Circuit & Charles Bridge", City = "Prague", OvernightCity = "Prague", MealsIncluded = "Breakfast, Dinner", TransitLeg = "Prague City Core", DrivingHours = 0.5, Description = "Full-day guided exploration of Prague Castle, Golden Lane, Charles Bridge, Old Town Square, and evening gala cruise on the Vltava River." },
                new ItineraryDayScheduleItem { DayNumber = 7, Title = "Prague Outbound Flight Departure", City = "Prague", OvernightCity = "-", MealsIncluded = "Breakfast", TransitLeg = "Hotel → PRG Airport", DrivingHours = 0.5, Description = "Morning breakfast and souvenir shopping. Private coach transfer to Václav Havel Airport for outbound flight." }
            };

            var itn1 = new ProjectItinerary
            {
                ProjectId = projectId,
                Title = "Classic Central Europe 8D/7N - Budapest, Vienna, Prague",
                ItineraryCode = "ITN-BVP-01",
                Destination = "Budapest → Bratislava → Vienna → Český Krumlov → Prague",
                DurationDays = 8,
                DurationNights = 7,
                Season = "Summer 2026",
                TargetPax = 35,
                EstimatedCostPerPax = 460.00m,
                EstimatedSellPricePerPax = 590.00m,
                TargetMarginPct = 22.03m,
                Status = "Active",
                IsPrimary = true,
                Description = "The flagship Central Europe tripartite capital circuit. Perfectly balanced 8-day flow covering Hungary, Slovakia, Austria, and the Czech Republic with minimal transit deadhead and verified 4★ properties.",
                DaysJson = JsonSerializer.Serialize(bvpDays),
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            };

            var itn2 = new ProjectItinerary
            {
                ProjectId = projectId,
                Title = "Imperial Capitals & Alpine Gateway 7D/6N - Vienna, Salzburg, Prague",
                ItineraryCode = "ITN-VSP-02",
                Destination = "Vienna → Wachau → Salzburg → Plzeň → Prague",
                DurationDays = 7,
                DurationNights = 6,
                Season = "Summer 2026",
                TargetPax = 30,
                EstimatedCostPerPax = 540.00m,
                EstimatedSellPricePerPax = 720.00m,
                TargetMarginPct = 25.00m,
                Status = "Proposed",
                IsPrimary = false,
                Description = "Premium cultural and Alpine itinerary featuring Austria's Wachau wine valley, Mozart's Salzburg, Bohemian brewery heritage, and medieval Prague.",
                DaysJson = JsonSerializer.Serialize(vspDays),
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            };

            _context.ProjectItineraries.AddRange(itn1, itn2);
            await _context.SaveChangesAsync();
        }
    }
}
