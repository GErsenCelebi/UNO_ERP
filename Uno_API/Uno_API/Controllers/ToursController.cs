using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;
using System.IO;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToursController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public ToursController(UnoDbContext context)
        {
            _context = context;
        }

        // GET: api/Tours?projectId=1
        [HttpGet]
        public async Task<IActionResult> GetTours([FromQuery] int? projectId)
        {
            try
            {
                var query = _context.Tours
                    .Include(t => t.TourStatus)
                    .Include(t => t.Project)
                        .ThenInclude(p => p!.Client)
                    .Include(t => t.TourServices)
                    .AsNoTracking()
                    .AsQueryable();

                if (projectId.HasValue)
                {
                    query = query.Where(t => t.ProjectId == projectId.Value);
                }

                var tours = await query.ToListAsync();

                var result = tours.Select(t => new
                {
                    t.Id,
                    t.TourCode,
                    t.Destination,
                    t.ArrivalDate,
                    StartDate = t.ArrivalDate,
                    t.EndDate,
                    t.Pax,
                    t.Adults,
                    t.Children,
                    t.Infants,
                    BaseFee = t.BaseFee > 0 ? t.BaseFee : 250m,
                    t.TotalFee,
                    GuideCommission = t.GuideCommission > 0 ? t.GuideCommission : 10m,
                    t.TourStatusId,
                    t.ProjectId,
                    t.ArrivalFlight,
                    t.DepartureFlight,
                    t.ArrivalAirport,
                    t.DepartureAirport,
                    TourStatus = t.TourStatus != null ? new { t.TourStatus.Id, t.TourStatus.Name, t.TourStatus.OrderIndex } : null,
                    Project = t.Project != null ? new { t.Project.Id, t.Project.ProjectCode, Client = t.Project.Client != null ? new { t.Project.Client.Id, t.Project.Client.Name } : null } : null,
                    TourServices = (t.TourServices ?? new List<TourService>()).Select(ts => new
                    {
                        ts.Id,
                        ts.ServiceCategoryId,
                        ts.GuideId,
                        ts.Description
                    })
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {
                    error = ex.Message,
                    innerError = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        // GET: api/Tours/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tour>> GetTour(int id)
        {
            var tour = await _context.Tours
                .Include(t => t.TourStatus)
                .Include(t => t.Project)
                .Include(t => t.TourServices!)
                    .ThenInclude(ts => ts.ServiceCategory)
                .Include(t => t.Bookings)
                .Include(t => t.Passengers)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tour == null)
            {
                return NotFound();
            }

            return tour;
        }

        // POST: api/Tours
        [HttpPost]
        public async Task<ActionResult<Tour>> PostTour(Tour tour)
        {
            // Validate ProjectId exists
            if (!await _context.Projects.AnyAsync(p => p.Id == tour.ProjectId))
            {
                return BadRequest("Invalid ProjectId. Project does not exist.");
            }

            // Default TourStatus to Draft if not specified
            if (tour.TourStatusId == 0)
            {
                tour.TourStatusId = 1; // Draft
            }

            // Ensure valid dates
            if (tour.ArrivalDate == default || tour.ArrivalDate.Year < 2000)
            {
                tour.ArrivalDate = DateTime.Today;
            }
            if (tour.EndDate == default || tour.EndDate < tour.ArrivalDate)
            {
                tour.EndDate = tour.ArrivalDate.AddDays(7);
            }

            // Compute BaseFee
            tour.BaseFee = (tour.Adults * tour.AdultRate) + (tour.Children * tour.ChildRate) + (tour.Infants * tour.InfantRate);
            if (tour.GuideCommission <= 0) tour.GuideCommission = 10.00m;

            _context.Tours.Add(tour);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTour), new { id = tour.Id }, tour);
        }

        // PUT: api/Tours/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTour(int id, Tour tour)
        {
            if (id != tour.Id)
            {
                return BadRequest("Tour ID mismatch");
            }

            var existingTour = await _context.Tours.FirstOrDefaultAsync(t => t.Id == id);
            if (existingTour == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(tour.TourCode)) existingTour.TourCode = tour.TourCode;
            if (!string.IsNullOrEmpty(tour.Destination)) existingTour.Destination = tour.Destination;
            if (tour.ArrivalDate != default) existingTour.ArrivalDate = tour.ArrivalDate;
            if (tour.EndDate != default) existingTour.EndDate = tour.EndDate;
            if (tour.Pax > 0) existingTour.Pax = tour.Pax;
            if (tour.Adults > 0) existingTour.Adults = tour.Adults;
            if (tour.Children > 0) existingTour.Children = tour.Children;
            if (tour.Infants > 0) existingTour.Infants = tour.Infants;
            if (tour.AdultRate > 0) existingTour.AdultRate = tour.AdultRate;
            if (tour.GuideCommission >= 0) existingTour.GuideCommission = tour.GuideCommission > 0 ? tour.GuideCommission : 10.00m;
            if (tour.ChildRate > 0) existingTour.ChildRate = tour.ChildRate;
            if (tour.InfantRate > 0) existingTour.InfantRate = tour.InfantRate;
            if (!string.IsNullOrEmpty(tour.ArrivalFlight)) existingTour.ArrivalFlight = tour.ArrivalFlight;
            if (!string.IsNullOrEmpty(tour.DepartureFlight)) existingTour.DepartureFlight = tour.DepartureFlight;
            if (!string.IsNullOrEmpty(tour.ArrivalAirport)) existingTour.ArrivalAirport = tour.ArrivalAirport;
            if (!string.IsNullOrEmpty(tour.DepartureAirport)) existingTour.DepartureAirport = tour.DepartureAirport;
            if (tour.TourStatusId > 0) existingTour.TourStatusId = tour.TourStatusId;
            if (tour.ProjectId > 0) existingTour.ProjectId = tour.ProjectId;
            if (tour.TotalFee > 0) existingTour.TotalFee = tour.TotalFee;

            existingTour.BaseFee = (existingTour.Adults * existingTour.AdultRate) + (existingTour.Children * existingTour.ChildRate) + (existingTour.Infants * existingTour.InfantRate);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TourExists(id))
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

        // DELETE: api/Tours/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTour(int id)
        {
            var tour = await _context.Tours
                .Include(t => t.TourServices)
                .Include(t => t.Bookings)
                .Include(t => t.Passengers)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tour == null)
            {
                return NotFound();
            }

            if (tour.TourServices != null && tour.TourServices.Any()) _context.TourServices.RemoveRange(tour.TourServices);
            if (tour.Bookings != null && tour.Bookings.Any()) _context.Bookings.RemoveRange(tour.Bookings);
            if (tour.Passengers != null && tour.Passengers.Any()) _context.Passengers.RemoveRange(tour.Passengers);

            var invoices = await _context.Invoices.Where(i => i.TourId == id).ToListAsync();
            if (invoices.Any()) _context.Invoices.RemoveRange(invoices);

            _context.Tours.Remove(tour);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Tours/bulk-complete-2025-drafts
        [HttpPost("bulk-complete-2025-drafts")]
        public async Task<IActionResult> BulkComplete2025Drafts()
        {
            var rowsAffected = await _context.Database.ExecuteSqlRawAsync(
                "UPDATE Tours SET TourStatusId = 5 WHERE TourStatusId = 1 AND (YEAR(ArrivalDate) = 2025 OR YEAR(EndDate) = 2025)"
            );
            return Ok(new { updatedCount = rowsAffected });
        }

        // POST: api/Tours/clean-db-keep-5063-5051
        [HttpPost("clean-db-keep-5063-5051")]
        public async Task<IActionResult> CleanDbKeep5063And5051()
        {
            var delServices = await _context.Database.ExecuteSqlRawAsync("DELETE FROM TourServices WHERE TourId != 5051 OR TourId IS NULL");
            var delBookings = await _context.Database.ExecuteSqlRawAsync("DELETE FROM Bookings WHERE TourId != 5051 OR TourId IS NULL");
            var delPassengers = await _context.Database.ExecuteSqlRawAsync("DELETE FROM Passengers WHERE TourId != 5051 OR TourId IS NULL");
            var delInvoices = await _context.Database.ExecuteSqlRawAsync("DELETE FROM Invoices WHERE TourId != 5051 OR TourId IS NULL");
            var delTours = await _context.Database.ExecuteSqlRawAsync("DELETE FROM Tours WHERE Id != 5051");
            var delProjects = await _context.Database.ExecuteSqlRawAsync("DELETE FROM Projects WHERE Id != 5063");

            return Ok(new
            {
                message = "Database cleaned successfully. Kept Project 5063 and Tour 5051.",
                deletedServices = delServices,
                deletedBookings = delBookings,
                deletedPassengers = delPassengers,
                deletedInvoices = delInvoices,
                deletedTours = delTours,
                deletedProjects = delProjects
            });
        }

        // GET: api/Tours/5/download-sales-template
        [HttpGet("{id}/download-sales-template")]
        public async Task<IActionResult> DownloadSalesTemplate(int id)
        {
            var tour = await _context.Tours
                .Include(t => t.Project)
                .Include(t => t.Passengers)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tour == null) return NotFound("Tour not found");

            // Load ALL excursions without restricting/truncating
            var tourExcursions = await _context.Excursions
                .OrderBy(e => e.Id)
                .ToListAsync();

            using var workbook = new XLWorkbook();

            // Sheet 1: ExcusionSales
            var wsExc = workbook.Worksheets.Add("ExcusionSales");
            wsExc.Cell(1, 1).Value = "Dates";
            wsExc.Cell(2, 1).Value = "Prices";
            wsExc.Cell(3, 1).Value = "Code";
            wsExc.Cell(4, 1).Value = "Passenger Name";

            wsExc.Row(1).Style.Font.Bold = true;
            wsExc.Row(2).Style.Font.Bold = true;
            wsExc.Row(3).Style.Font.Bold = true;
            wsExc.Row(4).Style.Font.Bold = true;

            for (int i = 0; i < tourExcursions.Count; i++)
            {
                var exc = tourExcursions[i];
                int col = i + 2;
                wsExc.Cell(1, col).Value = ""; // Keep dates blank

                if (exc.SalePrice > 0 || exc.Price > 0)
                {
                    wsExc.Cell(2, col).Value = exc.SalePrice > 0 ? exc.SalePrice : exc.Price;
                }
                else
                {
                    wsExc.Cell(2, col).Value = "";
                }

                // Output Excursion Code (stored in TourCode property) instead of Name
                string codeVal = !string.IsNullOrEmpty(exc.TourCode) ? exc.TourCode.Trim() : exc.Name.Trim();
                wsExc.Cell(3, col).Value = codeVal;
            }

            int rowIdx = 5;
            var sortedPassengers = tour.Passengers != null
                ? tour.Passengers.OrderBy(p => p.Id).ToList()
                : new List<Passenger>();

            foreach (var p in sortedPassengers)
            {
                string pName = $"{p.FirstName} {p.LastName}".Trim();
                bool isChild = p.DateOfBirth.HasValue && (tour.ArrivalDate - p.DateOfBirth.Value).TotalDays < 18 * 365.25;

                if (isChild)
                {
                    pName += " (CHD)";
                }

                var nameCell = wsExc.Cell(rowIdx, 1);
                nameCell.Value = pName;

                if (isChild)
                {
                    var rowRange = wsExc.Range(rowIdx, 1, rowIdx, tourExcursions.Count + 1);
                    rowRange.Style.Font.FontColor = XLColor.Red;
                    rowRange.Style.Font.Bold = true;
                    rowRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#FFFBEB");
                }

                for (int i = 0; i < tourExcursions.Count; i++)
                {
                    var cell = wsExc.Cell(rowIdx, i + 2);
                    cell.Value = "☐"; // Unchecked checkbox symbol
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                }

                rowIdx++;
            }

            if (sortedPassengers.Count > 0 && tourExcursions.Count > 0)
            {
                var excCheckRange = wsExc.Range(5, 2, rowIdx - 1, tourExcursions.Count + 1);
                var dvExc = excCheckRange.CreateDataValidation();
                dvExc.List("\"☐,☑\"");

                int lastPaxRow = rowIdx - 1;
                int countRowIdx = lastPaxRow + 2; // Blank row at lastPaxRow + 1
                int totalRowIdx = lastPaxRow + 3;

                wsExc.Cell(countRowIdx, 1).Value = "Count";
                wsExc.Cell(countRowIdx, 1).Style.Font.Bold = true;

                wsExc.Cell(totalRowIdx, 1).Value = "Total Amount";
                wsExc.Cell(totalRowIdx, 1).Style.Font.Bold = true;

                for (int i = 0; i < tourExcursions.Count; i++)
                {
                    int col = i + 2;
                    string colLetter = wsExc.Column(col).ColumnLetter();

                    // Row countRowIdx: =COUNTIF(B5:B38,"☑") + COUNTIF(B5:B38,TRUE)
                    var countCell = wsExc.Cell(countRowIdx, col);
                    countCell.FormulaA1 = $"COUNTIF({colLetter}5:{colLetter}{lastPaxRow}, \"☑\") + COUNTIF({colLetter}5:{colLetter}{lastPaxRow}, TRUE)";
                    countCell.Style.Font.Bold = true;
                    countCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                    // Row totalRowIdx: ={colLetter}{countRowIdx}*{colLetter}2
                    var totalCell = wsExc.Cell(totalRowIdx, col);
                    totalCell.FormulaA1 = $"{colLetter}{countRowIdx}*{colLetter}2";
                    totalCell.Style.Font.Bold = true;
                    totalCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                }
            }

            wsExc.Columns().AdjustToContents();

            // Sheet 2: BaseServices
            var wsBase = workbook.Worksheets.Add("BaseServices");
            string[] baseHeaders = new string[] { "Base Service", "Revenue", "Expense", "Other", "per/Pax", "UnitPrice", "Adult", "Children", "Infant", "Total" };
            for (int c = 0; c < baseHeaders.Length; c++)
            {
                wsBase.Cell(1, c + 1).Value = baseHeaders[c];
            }
            wsBase.Row(1).Style.Font.Bold = true;

            string[] defaultServices = new string[] { "Agency Fee", "CityTax" };
            for (int r = 0; r < defaultServices.Length; r++)
            {
                int rNum = r + 2;
                wsBase.Cell(rNum, 1).Value = defaultServices[r];
                for (int col = 2; col <= 5; col++)
                {
                    var cell = wsBase.Cell(rNum, col);
                    cell.Value = "☐"; // Unchecked checkbox symbol
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                }
            }

            var dvBase = wsBase.Range(2, 2, defaultServices.Length + 1, 5).CreateDataValidation();
            dvBase.List("\"☐,☑\"");

            wsBase.Columns().AdjustToContents();

            string projectCode = tour.Project?.ProjectCode ?? tour.Project?.Description ?? "PRJ";
            if (projectCode.Contains(" ")) projectCode = projectCode.Trim();
            string tourCode = tour.TourCode ?? "TOUR";
            string fileName = $"{projectCode}_{tourCode}_importSales.xlsx";

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);

            return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }

        private bool TourExists(int id)
        {
            return _context.Tours.Any(e => e.Id == id);
        }
    }
}
