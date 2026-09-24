using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;
using Uno_API.Services;

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

            // Auto-calculate TotalNights if dates provided and TotalNights is null/0
            if ((!tourService.TotalNights.HasValue || tourService.TotalNights.Value <= 0) &&
                tourService.ServiceDate.HasValue && tourService.ServiceEndDate.HasValue)
            {
                var diff = (tourService.ServiceEndDate.Value.Date - tourService.ServiceDate.Value.Date).Days;
                if (diff > 0) tourService.TotalNights = diff;
            }

            // Auto-calculate TotalAmount if 0 or not provided
            if (tourService.TotalAmount == 0)
            {
                if (tourService.ServiceCategoryId == 1 && tourService.RoomCount.HasValue && tourService.RoomCount > 0)
                {
                    int paxPerRoom = tourService.PricingBasis == "Room" ? 1 :
                        (tourService.RoomType?.Contains("Triple", StringComparison.OrdinalIgnoreCase) == true ||
                         tourService.RoomType?.Contains("DBL+EB", StringComparison.OrdinalIgnoreCase) == true ? 3 :
                         (tourService.RoomType?.Contains("Single", StringComparison.OrdinalIgnoreCase) == true ? 1 : 2));

                    decimal nights = tourService.TotalNights.HasValue && tourService.TotalNights > 0
                        ? tourService.TotalNights.Value
                        : (tourService.Quantity > 0 ? tourService.Quantity : 1);

                    tourService.TotalAmount = tourService.RoomCount.Value * paxPerRoom * nights * tourService.UnitPrice;
                    if (tourService.DiscountAmount.HasValue && tourService.DiscountAmount.Value > 0)
                    {
                        tourService.TotalAmount = Math.Max(0, tourService.TotalAmount - tourService.DiscountAmount.Value);
                    }
                }
                else
                {
                    tourService.TotalAmount = tourService.Quantity * tourService.UnitPrice;
                }
            }

            // Default ServiceCategoryId if not supplied
            if (tourService.ServiceCategoryId == 0)
            {
                var category = await _context.ServiceCategories.FirstOrDefaultAsync();
                tourService.ServiceCategoryId = category?.Id ?? 1;
            }

            _context.TourServices.Add(tourService);
            await _context.SaveChangesAsync();

            // Synchronize parent Tour BaseFee flag if this is a Base Fee / Invoiced Fee revenue service
            var svcCat = await _context.ServiceCategories.FirstOrDefaultAsync(sc => sc.Id == tourService.ServiceCategoryId);
            bool isBaseFeeService = tourService.ServiceCategoryId == 8 ||
                (svcCat != null && svcCat.IsBase && svcCat.IsRevenue && !svcCat.IsOperational) ||
                (tourService.Description != null && tourService.Description.StartsWith("Base Tour Fee"));

            if (isBaseFeeService && tourService.IsRevenue == true)
            {
                var tour = await _context.Tours.FirstOrDefaultAsync(t => t.Id == tourService.TourId);
                if (tour != null)
                {
                    tour.BaseFee = tourService.UnitPrice;
                    tour.TotalFee = tourService.TotalAmount;
                    await _context.SaveChangesAsync();
                }
            }

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

            // Auto-calculate TotalNights if dates provided and TotalNights is null/0
            if ((!tourService.TotalNights.HasValue || tourService.TotalNights.Value <= 0) &&
                tourService.ServiceDate.HasValue && tourService.ServiceEndDate.HasValue)
            {
                var diff = (tourService.ServiceEndDate.Value.Date - tourService.ServiceDate.Value.Date).Days;
                if (diff > 0) tourService.TotalNights = diff;
            }

            // Recalculate TotalAmount if 0
            if (tourService.TotalAmount == 0)
            {
                if (tourService.ServiceCategoryId == 1 && tourService.RoomCount.HasValue && tourService.RoomCount > 0)
                {
                    int paxPerRoom = tourService.PricingBasis == "Room" ? 1 :
                        (tourService.RoomType?.Contains("Triple", StringComparison.OrdinalIgnoreCase) == true ||
                         tourService.RoomType?.Contains("DBL+EB", StringComparison.OrdinalIgnoreCase) == true ? 3 :
                         (tourService.RoomType?.Contains("Single", StringComparison.OrdinalIgnoreCase) == true ? 1 : 2));

                    decimal nights = tourService.TotalNights.HasValue && tourService.TotalNights > 0
                        ? tourService.TotalNights.Value
                        : (tourService.Quantity > 0 ? tourService.Quantity : 1);

                    tourService.TotalAmount = tourService.RoomCount.Value * paxPerRoom * nights * tourService.UnitPrice;
                    if (tourService.DiscountAmount.HasValue && tourService.DiscountAmount.Value > 0)
                    {
                        tourService.TotalAmount = Math.Max(0, tourService.TotalAmount - tourService.DiscountAmount.Value);
                    }
                }
                else
                {
                    tourService.TotalAmount = tourService.Quantity * tourService.UnitPrice;
                }
            }

            _context.Entry(tourService).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                // Synchronize parent Tour BaseFee flag if this is a Base Fee / Invoiced Fee revenue service
                var putSvcCat = await _context.ServiceCategories.FirstOrDefaultAsync(sc => sc.Id == tourService.ServiceCategoryId);
                bool isBaseFee = tourService.ServiceCategoryId == 8 ||
                    (putSvcCat != null && putSvcCat.IsBase && putSvcCat.IsRevenue && !putSvcCat.IsOperational) ||
                    (tourService.Description != null && tourService.Description.StartsWith("Base Tour Fee"));

                if (isBaseFee && tourService.IsRevenue == true)
                {
                    var tour = await _context.Tours.FirstOrDefaultAsync(t => t.Id == tourService.TourId);
                    if (tour != null)
                    {
                        tour.BaseFee = tourService.UnitPrice;
                        tour.TotalFee = tourService.TotalAmount;
                        await _context.SaveChangesAsync();
                    }
                }
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
            var tourService = await _context.TourServices
                .Include(ts => ts.ServiceCategory)
                .FirstOrDefaultAsync(ts => ts.Id == id);
            if (tourService == null)
            {
                return NotFound();
            }

            bool isBaseFeeService = tourService.ServiceCategoryId == 8 ||
                (tourService.ServiceCategory != null && tourService.ServiceCategory.IsBase && tourService.ServiceCategory.IsRevenue && !tourService.ServiceCategory.IsOperational) ||
                (tourService.Description != null && tourService.Description.StartsWith("Base Tour Fee"));

            int tourId = tourService.TourId;
            int deletedSvcId = tourService.Id;

            _context.TourServices.Remove(tourService);
            await _context.SaveChangesAsync();

            if (isBaseFeeService)
            {
                var remainingBaseSvc = await _context.TourServices
                    .AnyAsync(ts => ts.TourId == tourId && ts.Id != deletedSvcId &&
                        (ts.ServiceCategoryId == 8 || (ts.ServiceCategory != null && ts.ServiceCategory.IsBase && ts.ServiceCategory.IsRevenue && !ts.ServiceCategory.IsOperational)));
                if (!remainingBaseSvc)
                {
                    var tour = await _context.Tours.FirstOrDefaultAsync(t => t.Id == tourId);
                    if (tour != null)
                    {
                        tour.BaseFee = 0;
                        tour.TotalFee = 0;
                        await _context.SaveChangesAsync();
                    }
                }
            }

            return NoContent();
        }

        // POST: api/TourServices/auto-generate-hotels/5
        [HttpPost("auto-generate-hotels/{tourId}")]
        public async Task<IActionResult> AutoGenerateHotels(int tourId)
        {
            var tour = await _context.Tours.FindAsync(tourId);
            if (tour == null) return NotFound("Tour not found");

            var tourPassengers = await _context.Passengers
                .Where(p => p.TourId == tourId)
                .ToListAsync();

            if (!tourPassengers.Any())
            {
                return BadRequest("No passengers or room assignments found for this tour.");
            }

            // Correct Adults/Children/Pax from actual passengers using 12-year-old criteria
            DateTime refDate = tour.ArrivalDate != default ? tour.ArrivalDate : DateTime.Today;
            int pChildren = tourPassengers.Count(p => PassengerAgeHelper.IsChild(p.DateOfBirth, p.PaxType, refDate));
            int pAdults = tourPassengers.Count(p => !PassengerAgeHelper.IsChild(p.DateOfBirth, p.PaxType, refDate) && !(p.PaxType != null && (p.PaxType.ToUpper().Contains("INFANT") || p.PaxType.ToUpper().Contains("BEBEK"))));
            int pInfants = tourPassengers.Count(p => p.PaxType != null && (p.PaxType.ToUpper().Contains("INFANT") || p.PaxType.ToUpper().Contains("BEBEK") || p.PaxType.ToUpper().Contains("INF")));

            if (pAdults + pChildren + pInfants > 0)
            {
                tour.Adults = pAdults;
                tour.Children = pChildren;
                tour.Infants = pInfants;
                tour.Pax = pAdults + pChildren + pInfants;
                if (tour.BaseFee > 0)
                {
                    tour.TotalFee = (tour.Adults * tour.BaseFee) + (tour.Children * tour.BaseFee * 0.5m);
                }
            }

            // Calculate rooms needed from passengers
            int dblPax = tourPassengers.Count(p => p.RoomType != null && p.RoomType.ToUpper().Contains("DOUBLE"));
            int twnPax = tourPassengers.Count(p => p.RoomType != null && p.RoomType.ToUpper().Contains("TWIN"));
            int sglPax = tourPassengers.Count(p => p.RoomType != null && p.RoomType.ToUpper().Contains("SINGLE"));
            int trnPPax = tourPassengers.Count(p => p.RoomType != null && (p.RoomType.ToUpper().Contains("TRIPLE") || p.RoomType.ToUpper().Contains("TRP") || p.RoomType.ToUpper().Contains("DBL+CHLD") || p.RoomType.ToUpper().Contains("DBL+EB")));

            int doubleRooms = (int)Math.Ceiling(dblPax / 2.0);
            int twinRooms = (int)Math.Ceiling(twnPax / 2.0);
            int singleRooms = sglPax;
            int tripleRooms = (int)Math.Ceiling(trnPPax / 3.0);

            // Remove existing hotel services for this tour
            var oldHotels = await _context.TourServices
                .Where(ts => ts.TourId == tourId && ts.ServiceCategoryId == 1)
                .ToListAsync();
            if (oldHotels.Any())
            {
                _context.TourServices.RemoveRange(oldHotels);
            }

            int totalTourNights = Math.Max(1, (int)(tour.EndDate.Date - tour.ArrivalDate.Date).TotalDays);
            int city3Nights = Math.Max(1, totalTourNights - 4); // City 1: 2 nts, City 2: 2 nts, City 3: remainder (e.g. 3 nts)

            var itinerary = new List<(string HotelName, int Nights)>
            {
                ("Hotel Canada", 2),
                ("Hotel Allegro", 2),
                ("Hotel Olympik", city3Nights)
            };

            DateTime curDate = tour.ArrivalDate.Date;
            var createdServices = new List<TourService>();

            foreach (var item in itinerary)
            {
                var dbHotel = await _context.Hotels.FirstOrDefaultAsync(h => h.Name.ToLower() == item.HotelName.ToLower());
                if (dbHotel == null)
                {
                    dbHotel = new Hotel
                    {
                        Name = item.HotelName,
                        Location = "Budapest-Vienna-Prague",
                        StarRating = 4,
                        SingleRate = 60,
                        DoubleRate = 45,
                        TwinRate = 45,
                        TripleRate = 40
                    };
                    _context.Hotels.Add(dbHotel);
                    await _context.SaveChangesAsync();
                }

                DateTime sDate = curDate;
                DateTime eDate = curDate.AddDays(item.Nights);
                curDate = eDate;

                void AddHotelRoom(int count, string rType, decimal roomRate, decimal paxRate)
                {
                    if (count > 0)
                    {
                        int paxPerRoom = rType == "Single" ? 1 : (rType == "Triple" ? 3 : 2);
                        string hotelBasis = (dbHotel.PricingBasis ?? "Pax").Trim();
                        bool isRoomBasis = hotelBasis.Equals("Room", StringComparison.OrdinalIgnoreCase);

                        decimal unitPrice;
                        decimal totalCost;

                        if (isRoomBasis)
                        {
                            unitPrice = roomRate > 0 ? roomRate : (paxRate > 0 ? paxRate * paxPerRoom : (rType == "Single" ? dbHotel.SingleRate : (rType == "Triple" ? dbHotel.TripleRate * 3 : dbHotel.DoubleRate * 2)));
                            if (unitPrice <= 0) unitPrice = 90m;
                            totalCost = count * item.Nights * unitPrice;
                        }
                        else
                        {
                            unitPrice = paxRate > 0 ? paxRate : (roomRate > 0 ? roomRate / paxPerRoom : (rType == "Single" ? dbHotel.SingleRate : (rType == "Triple" ? dbHotel.TripleRate : dbHotel.DoubleRate)));
                            if (unitPrice <= 0) unitPrice = 45m;
                            totalCost = count * paxPerRoom * item.Nights * unitPrice;
                        }

                        var ts = new TourService
                        {
                            TourId = tour.Id,
                            ServiceCategoryId = 1, // Hotel
                            Description = $"{item.HotelName} ({rType} Room)",
                            StartDate = sDate,
                            EndDate = eDate,
                            ServiceDate = sDate,
                            ServiceEndDate = eDate,
                            TotalNights = item.Nights,
                            RoomCount = count,
                            RoomType = rType,
                            Quantity = item.Nights,
                            UnitPrice = unitPrice,
                            PricingBasis = isRoomBasis ? "Room" : "Pax",
                            TotalAmount = totalCost,
                            HotelId = dbHotel.Id,
                            IsRevenue = false
                        };
                        _context.TourServices.Add(ts);
                        createdServices.Add(ts);
                    }
                }

                AddHotelRoom(doubleRooms, "Double", dbHotel.DoubleRoomRate, dbHotel.DoublePaxRate);
                AddHotelRoom(singleRooms, "Single", dbHotel.SingleRoomRate, dbHotel.SinglePaxRate);
                AddHotelRoom(tripleRooms, "Triple", dbHotel.TripleRoomRate, dbHotel.TriplePaxRate);
                AddHotelRoom(twinRooms, "Twin", dbHotel.TwinRoomRate, dbHotel.TwinPaxRate);
            }

            await _context.SaveChangesAsync();

            return Ok(new { 
                Message = "Hotel services auto-generated successfully", 
                TourId = tour.Id, 
                Pax = tour.Pax,
                Adults = tour.Adults,
                Children = tour.Children,
                CreatedCount = createdServices.Count 
            });
        }

        private bool TourServiceExists(int id)
        {
            return _context.TourServices.Any(e => e.Id == id);
        }
    }
}
