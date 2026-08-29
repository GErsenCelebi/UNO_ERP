using Microsoft.AspNetCore.Mvc;
using ClosedXML.Excel;
using System.IO;
using System.Linq;
using System;
using System.Globalization;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TourImportController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public TourImportController(UnoDbContext context)
        {
            _context = context;
        }

        [HttpPost("import")]
        public async Task<IActionResult> Import([FromForm] IFormFile? roomingFile = null, [FromForm] IFormFile? salesFile = null, [FromForm] IFormFile? masterdataFile = null)
        {
            if (roomingFile == null && salesFile == null && masterdataFile == null)
            {
                return BadRequest("No file was uploaded. Please select a Rooming, Sales, or MasterData file to import.");
            }

            var client = await _context.Clients.FirstOrDefaultAsync();
            if (client == null)
            {
                client = new Client { Name = "Default Client" };
                _context.Clients.Add(client);
                await _context.SaveChangesAsync();
            }

            // 1. Determine primary workbook to extract Tour & Project metadata
            Stream? primaryStream = roomingFile?.OpenReadStream() ?? salesFile?.OpenReadStream() ?? masterdataFile?.OpenReadStream();
            string primaryFileName = Path.GetFileNameWithoutExtension(roomingFile?.FileName ?? salesFile?.FileName ?? masterdataFile?.FileName ?? "");

            if (primaryStream == null)
            {
                return BadRequest("Could not open uploaded file stream.");
            }

            using var primaryWb = new XLWorkbook(primaryStream);

            string tourCode = "";
            string projectName = "";
            string destination = "";
            DateTime? arrivalDate = null;
            DateTime? endDate = null;
            int adults = 0, children = 0, infants = 0, pax = 0;

            // Strategy A: Inspect "Tours" sheet if present
            var wsTours = primaryWb.Worksheets.FirstOrDefault(w => w.Name.Equals("Tours", StringComparison.OrdinalIgnoreCase));
            if (wsTours != null && wsTours.RangeUsed() != null && wsTours.RowsUsed().Count() >= 2)
            {
                var row2 = wsTours.Row(2);
                var tCodeVal = row2.Cell(1).GetString().Trim();
                var pCodeVal = row2.Cell(2).GetString().Trim();
                var destVal = row2.Cell(3).GetString().Trim();
                var arrDateVal = row2.Cell(4).GetString().Trim();
                var endDateVal = row2.Cell(5).GetString().Trim();

                if (!string.IsNullOrEmpty(tCodeVal)) tourCode = tCodeVal;
                if (!string.IsNullOrEmpty(pCodeVal)) projectName = pCodeVal;
                if (!string.IsNullOrEmpty(destVal)) destination = destVal;

                arrivalDate = ParseExcelDate(row2.Cell(4));
                endDate = ParseExcelDate(row2.Cell(5));

                int.TryParse(row2.Cell(6).GetString().Trim(), out adults);
                int.TryParse(row2.Cell(7).GetString().Trim(), out children);
                int.TryParse(row2.Cell(8).GetString().Trim(), out infants);
                int.TryParse(row2.Cell(9).GetString().Trim(), out pax);
            }

            // Strategy B: Inspect "Projects" sheet if present
            var wsProjects = primaryWb.Worksheets.FirstOrDefault(w => w.Name.Equals("Projects", StringComparison.OrdinalIgnoreCase));
            if (wsProjects != null && wsProjects.RangeUsed() != null && wsProjects.RowsUsed().Count() >= 2)
            {
                var pCodeVal = wsProjects.Row(2).Cell(1).GetString().Trim();
                if (!string.IsNullOrEmpty(pCodeVal)) projectName = pCodeVal;
            }

            // Strategy C: Inspect filename parts (e.g. "Orta Avrupa -BVP_PVB05072026_importSales" or "PRJ-BVP_PVB05072026_rooming")
            if (!string.IsNullOrEmpty(primaryFileName))
            {
                var parts = primaryFileName.Split('_');
                if (parts.Length >= 2)
                {
                    if (string.IsNullOrEmpty(projectName)) projectName = parts[0];
                    if (string.IsNullOrEmpty(tourCode))
                    {
                        tourCode = parts[1].Replace("tour", "", StringComparison.OrdinalIgnoreCase)
                                           .Replace("rooming", "", StringComparison.OrdinalIgnoreCase)
                                           .Replace("importMetadata", "", StringComparison.OrdinalIgnoreCase)
                                           .Replace("importrooming", "", StringComparison.OrdinalIgnoreCase)
                                           .Replace("importSales", "", StringComparison.OrdinalIgnoreCase)
                                           .Replace("sales", "", StringComparison.OrdinalIgnoreCase)
                                           .Trim();
                    }
                }
                else if (string.IsNullOrEmpty(tourCode))
                {
                    tourCode = primaryFileName.Trim();
                }
            }

            if (string.IsNullOrEmpty(tourCode))
            {
                return BadRequest("Could not identify Tour Code from uploaded file.");
            }

            // 2. Resolve Project robustly (by Code or Description)
            Project? project = null;
            if (!string.IsNullOrEmpty(projectName))
            {
                project = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectCode.ToLower() == projectName.ToLower() || p.Description.ToLower() == projectName.ToLower());
                if (project == null)
                {
                    project = await _context.Projects.FirstOrDefaultAsync(p => p.Description.ToLower().Contains(projectName.ToLower()) || projectName.ToLower().Contains(p.Description.ToLower()));
                }
            }

            if (project == null)
            {
                project = await _context.Projects.FirstOrDefaultAsync();
                if (project == null)
                {
                    project = new Project { ProjectCode = "PRJ-DEFAULT", Description = "Default Project", ProjectStatusId = 3, ClientId = client.Id };
                    _context.Projects.Add(project);
                    await _context.SaveChangesAsync();
                }
            }

            // 3. Resolve or Upsert Tour
            var tour = await _context.Tours
                .Include(t => t.Passengers)
                .Include(t => t.Bookings)
                .Include(t => t.TourServices)
                .FirstOrDefaultAsync(t => t.TourCode.ToLower() == tourCode.ToLower());

            if (!arrivalDate.HasValue && !string.IsNullOrEmpty(tourCode))
            {
                string digits = new string(tourCode.Where(char.IsDigit).ToArray());
                if (digits.Length == 8 && DateTime.TryParseExact(digits, "ddMMyyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedTourDate))
                {
                    arrivalDate = parsedTourDate;
                    endDate = parsedTourDate.AddDays(7);
                }
            }

            if (tour == null)
            {
                tour = new Tour
                {
                    TourCode = tourCode,
                    ProjectId = project.Id,
                    Destination = !string.IsNullOrEmpty(destination) ? destination : "Budapest-Vienna-Prague",
                    ArrivalDate = arrivalDate ?? DateTime.Now,
                    EndDate = endDate ?? DateTime.Now.AddDays(7),
                    Adults = adults,
                    Children = children,
                    Infants = infants,
                    Pax = pax > 0 ? pax : (adults + children + infants),
                    TourStatusId = 1
                };
                _context.Tours.Add(tour);
                await _context.SaveChangesAsync();
            }
            else
            {
                // Update existing tour metadata safely without erasing children
                if (!string.IsNullOrEmpty(destination) && destination != "Imported Tour") tour.Destination = destination;
                if (arrivalDate.HasValue) tour.ArrivalDate = arrivalDate.Value;
                if (endDate.HasValue) tour.EndDate = endDate.Value;
                if (pax > 0) tour.Pax = pax;
                if (adults > 0) tour.Adults = adults;
                if (children > 0) tour.Children = children;
                if (infants > 0) tour.Infants = infants;
                await _context.SaveChangesAsync();
            }

            // 3.5 Process MasterData File (if provided or present in rooming file)
            var masterDataStreamFile = masterdataFile ?? roomingFile;
            if (masterDataStreamFile != null)
            {
                using var masterStream = masterDataStreamFile.OpenReadStream();
                using var wbMaster = new XLWorkbook(masterStream);

                // Hotels Sheet in MasterData
                var wsMHotels = wbMaster.Worksheets.FirstOrDefault(w => w.Name.Equals("Hotels", StringComparison.OrdinalIgnoreCase));
                if (wsMHotels != null && wsMHotels.RangeUsed() != null && wsMHotels.RowsUsed().Count() >= 2)
                {
                    for (int r = 2; r <= wsMHotels.LastRowUsed()!.RowNumber(); r++)
                    {
                        var row = wsMHotels.Row(r);
                        string hName = row.Cell(1).GetString().Trim();
                        if (string.IsNullOrEmpty(hName)) continue;

                        string location = "";
                        int starRating = 4;
                        string contactName = "Reservations";
                        string contactRole = "Manager";
                        string email = "";
                        string phone = "";

                        bool is16Col = wsMHotels.Row(1).LastCellUsed()?.Address.ColumnNumber >= 16;
                        decimal sglRoomRate = 0, sglPaxRate = 0, dblRoomRate = 0, dblPaxRate = 0;
                        decimal twnRoomRate = 0, twnPaxRate = 0, trpRoomRate = 0, trpPaxRate = 0;
                        string pricingBasis = "Pax";

                        if (is16Col)
                        {
                            location = row.Cell(2).GetString().Trim();
                            int.TryParse(row.Cell(3).GetString().Trim(), out starRating);
                            contactName = row.Cell(4).GetString().Trim();
                            contactRole = row.Cell(5).GetString().Trim();
                            email = row.Cell(6).GetString().Trim();
                            phone = row.Cell(7).GetString().Trim();

                            decimal.TryParse(row.Cell(8).GetString().Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out sglRoomRate);
                            decimal.TryParse(row.Cell(9).GetString().Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out sglPaxRate);
                            decimal.TryParse(row.Cell(10).GetString().Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out dblRoomRate);
                            decimal.TryParse(row.Cell(11).GetString().Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out dblPaxRate);
                            decimal.TryParse(row.Cell(12).GetString().Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out twnRoomRate);
                            decimal.TryParse(row.Cell(13).GetString().Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out twnPaxRate);
                            decimal.TryParse(row.Cell(14).GetString().Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out trpRoomRate);
                            decimal.TryParse(row.Cell(15).GetString().Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out trpPaxRate);
                            pricingBasis = row.Cell(16).GetString().Trim();
                        }
                        else
                        {
                            location = row.Cell(2).GetString().Trim();
                            int.TryParse(row.Cell(3).GetString().Trim(), out starRating);
                            decimal.TryParse(row.Cell(4).GetString().Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out sglPaxRate);
                            decimal.TryParse(row.Cell(5).GetString().Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out dblPaxRate);
                            decimal.TryParse(row.Cell(6).GetString().Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out twnPaxRate);
                            decimal.TryParse(row.Cell(7).GetString().Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out trpPaxRate);
                            pricingBasis = row.Cell(8).GetString().Trim();
                        }

                        if (sglRoomRate == 0 && sglPaxRate > 0) sglRoomRate = sglPaxRate;
                        if (sglPaxRate == 0 && sglRoomRate > 0) sglPaxRate = sglRoomRate;

                        if (dblRoomRate == 0 && dblPaxRate > 0) dblRoomRate = dblPaxRate * 2;
                        if (dblPaxRate == 0 && dblRoomRate > 0) dblPaxRate = dblRoomRate / 2;

                        if (twnRoomRate == 0 && twnPaxRate > 0) twnRoomRate = twnPaxRate * 2;
                        if (twnPaxRate == 0 && twnRoomRate > 0) twnPaxRate = twnRoomRate / 2;

                        if (trpRoomRate == 0 && trpPaxRate > 0) trpRoomRate = trpPaxRate * 3;
                        if (trpPaxRate == 0 && trpRoomRate > 0) trpPaxRate = trpRoomRate / 3;

                        var dbH = await _context.Hotels.FirstOrDefaultAsync(h => h.Name.ToLower() == hName.ToLower());
                        if (dbH == null)
                        {
                            dbH = new Hotel
                            {
                                Name = hName,
                                Location = !string.IsNullOrEmpty(location) ? location : "Budapest-Vienna-Prague",
                                StarRating = starRating > 0 ? starRating : 4,
                                ContactName = contactName,
                                ContactRole = contactRole,
                                Email = email,
                                Phone = phone,
                                SingleRoomRate = sglRoomRate > 0 ? sglRoomRate : sglPaxRate,
                                SinglePaxRate = sglPaxRate > 0 ? sglPaxRate : sglRoomRate,
                                DoubleRoomRate = dblRoomRate > 0 ? dblRoomRate : dblPaxRate * 2,
                                DoublePaxRate = dblPaxRate > 0 ? dblPaxRate : dblRoomRate / 2,
                                TwinRoomRate = twnRoomRate > 0 ? twnRoomRate : twnPaxRate * 2,
                                TwinPaxRate = twnPaxRate > 0 ? twnPaxRate : twnRoomRate / 2,
                                TripleRoomRate = trpRoomRate > 0 ? trpRoomRate : trpPaxRate * 3,
                                TriplePaxRate = trpPaxRate > 0 ? trpPaxRate : trpRoomRate / 3,
                                PricingBasis = !string.IsNullOrEmpty(pricingBasis) ? pricingBasis : "Pax"
                            };
                            _context.Hotels.Add(dbH);
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(location)) dbH.Location = location;
                            if (starRating > 0) dbH.StarRating = starRating;
                            if (!string.IsNullOrEmpty(email)) dbH.Email = email;
                            if (!string.IsNullOrEmpty(phone)) dbH.Phone = phone;
                            dbH.SingleRoomRate = sglRoomRate > 0 ? sglRoomRate : (sglPaxRate > 0 ? sglPaxRate : dbH.SingleRoomRate);
                            dbH.SinglePaxRate = sglPaxRate > 0 ? sglPaxRate : (sglRoomRate > 0 ? sglRoomRate : dbH.SinglePaxRate);
                            dbH.DoubleRoomRate = dblRoomRate > 0 ? dblRoomRate : (dblPaxRate > 0 ? dblPaxRate * 2 : dbH.DoubleRoomRate);
                            dbH.DoublePaxRate = dblPaxRate > 0 ? dblPaxRate : (dblRoomRate > 0 ? dblRoomRate / 2 : dbH.DoublePaxRate);
                            dbH.TwinRoomRate = twnRoomRate > 0 ? twnRoomRate : (twnPaxRate > 0 ? twnPaxRate * 2 : dbH.TwinRoomRate);
                            dbH.TwinPaxRate = twnPaxRate > 0 ? twnPaxRate : (twnRoomRate > 0 ? twnRoomRate / 2 : dbH.TwinPaxRate);
                            dbH.TripleRoomRate = trpRoomRate > 0 ? trpRoomRate : (trpPaxRate > 0 ? trpPaxRate * 3 : dbH.TripleRoomRate);
                            dbH.TriplePaxRate = trpPaxRate > 0 ? trpPaxRate : (trpRoomRate > 0 ? trpRoomRate / 3 : dbH.TriplePaxRate);
                            if (!string.IsNullOrEmpty(pricingBasis)) dbH.PricingBasis = pricingBasis;
                        }
                    }
                    await _context.SaveChangesAsync();
                }

                // Guides Sheet in MasterData
                var wsMGuides = wbMaster.Worksheets.FirstOrDefault(w => w.Name.Equals("Guides", StringComparison.OrdinalIgnoreCase));
                if (wsMGuides != null && wsMGuides.RangeUsed() != null && wsMGuides.RowsUsed().Count() >= 2)
                {
                    for (int r = 2; r <= wsMGuides.LastRowUsed()!.RowNumber(); r++)
                    {
                        var row = wsMGuides.Row(r);
                        string gName = row.Cell(1).GetString().Trim();
                        if (string.IsNullOrEmpty(gName)) continue;

                        string lang = row.Cell(2).GetString().Trim();
                        string phone = row.Cell(3).GetString().Trim();
                        decimal.TryParse(row.Cell(4).GetString().Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out decimal dailyRate);

                        var dbG = await _context.Guides.FirstOrDefaultAsync(g => g.Name.ToLower() == gName.ToLower());
                        if (dbG == null)
                        {
                            dbG = new Guide { Name = gName, Language = lang, PhoneNumber = phone, DailyRate = dailyRate };
                            _context.Guides.Add(dbG);
                            await _context.SaveChangesAsync();
                        }

                        // Automatically create Guide TourService line for this tour if not present
                        var existingGuideSvc = await _context.TourServices.FirstOrDefaultAsync(ts => ts.TourId == tour.Id && (ts.ServiceCategoryId == 2 || ts.GuideId == dbG.Id));
                        if (existingGuideSvc == null)
                        {
                            int tourDays = 1;
                            if (tour.ArrivalDate != default && tour.EndDate != default)
                            {
                                tourDays = (int)(tour.EndDate.Date - tour.ArrivalDate.Date).TotalDays + 1;
                                if (tourDays < 1) tourDays = 1;
                            }
                            decimal gRate = dbG.DailyRate > 0 ? dbG.DailyRate : (dailyRate > 0 ? dailyRate : 150m);
                            var guideSvc = new TourService
                            {
                                TourId = tour.Id,
                                ServiceCategoryId = 4, // Guide
                                Description = $"Guide - {dbG.Name}",
                                GuideId = dbG.Id,
                                StartDate = tour.ArrivalDate,
                                EndDate = tour.EndDate,
                                ServiceDate = tour.ArrivalDate,
                                ServiceEndDate = tour.EndDate,
                                TotalNights = tourDays > 1 ? tourDays - 1 : 1,
                                Quantity = tourDays,
                                UnitPrice = gRate,
                                TotalAmount = tourDays * gRate,
                                IsRevenue = false
                            };
                            _context.TourServices.Add(guideSvc);
                        }
                    }
                    await _context.SaveChangesAsync();
                }
            }

            // 4. Process Rooming File (if provided)
            if (roomingFile != null)
            {
                using var roomingStream = roomingFile.OpenReadStream();
                using var wbRooming = new XLWorkbook(roomingStream);

                // Flights
                var wsFlights = wbRooming.Worksheets.FirstOrDefault(w => w.Name.Equals("Flights", StringComparison.OrdinalIgnoreCase));
                if (wsFlights != null && wsFlights.RangeUsed() != null && wsFlights.RowsUsed().Count() >= 2)
                {
                    var arrRow = wsFlights.Row(2);
                    if (!arrRow.Cell(1).IsEmpty()) tour.ArrivalFlight = arrRow.Cell(1).GetString().Trim();
                    if (!arrRow.Cell(3).IsEmpty()) tour.ArrivalAirport = arrRow.Cell(3).GetString().Trim();
                    string arrDateStr = arrRow.Cell(4).GetString().Trim();
                    if (arrDateStr.Length >= 10 && DateTime.TryParseExact(arrDateStr.Substring(0, 10), "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var aDate))
                        tour.ArrivalDate = aDate;

                    if (wsFlights.RowsUsed().Count() >= 3)
                    {
                        var depRow = wsFlights.Row(3);
                        if (!depRow.Cell(1).IsEmpty()) tour.DepartureFlight = depRow.Cell(1).GetString().Trim();
                        if (!depRow.Cell(2).IsEmpty()) tour.DepartureAirport = depRow.Cell(2).GetString().Trim();
                        string depDateStr = depRow.Cell(4).GetString().Trim();
                        if (depDateStr.Length >= 10 && DateTime.TryParseExact(depDateStr.Substring(0, 10), "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var eDate))
                            tour.EndDate = eDate;
                    }
                }

                // Rooming Passengers
                var wsRooming = wbRooming.Worksheets.FirstOrDefault(w => w.Name.Equals("Rooming", StringComparison.OrdinalIgnoreCase));
                if (wsRooming != null && wsRooming.RangeUsed() != null && wsRooming.RowsUsed().Count() >= 2)
                {
                    // Clear existing Passengers and Bookings for this tour
                    if (tour.Passengers != null && tour.Passengers.Any()) _context.Passengers.RemoveRange(tour.Passengers);
                    if (tour.Bookings != null && tour.Bookings.Any()) _context.Bookings.RemoveRange(tour.Bookings);
                    await _context.SaveChangesAsync();

                    // Load ExcelMapping.json
                    string jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "Config", "ExcelMapping.json");
                    Dictionary<string, Dictionary<string, System.Text.Json.JsonElement>>? mappings = null;
                    if (System.IO.File.Exists(jsonPath))
                    {
                        var mappingJson = System.IO.File.ReadAllText(jsonPath);
                        mappings = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, System.Text.Json.JsonElement>>>(mappingJson);
                    }

                    var roomingHeaders = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                    var headerRow = wsRooming.Row(1);
                    int lastCol = headerRow.LastCellUsed()?.Address.ColumnNumber ?? 20;
                    for (int c = 1; c <= lastCol; c++)
                    {
                        string hName = headerRow.Cell(c).GetString().Trim();
                        if (!string.IsNullOrEmpty(hName) && !roomingHeaders.ContainsKey(hName))
                        {
                            roomingHeaders[hName] = c;
                            if (mappings != null && mappings.ContainsKey("Rooming"))
                            {
                                foreach (var kvp in mappings["Rooming"])
                                {
                                    if (kvp.Value.ValueKind == System.Text.Json.JsonValueKind.Array)
                                    {
                                        foreach (var alias in kvp.Value.EnumerateArray())
                                        {
                                            if (alias.GetString()?.Equals(hName, StringComparison.OrdinalIgnoreCase) == true)
                                            {
                                                if (!roomingHeaders.ContainsKey(kvp.Key)) roomingHeaders[kvp.Key] = c;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    string NormalizeHeader(string h)
                    {
                        if (string.IsNullOrEmpty(h)) return string.Empty;
                        return new string(h.ToLowerInvariant().Where(char.IsLetterOrDigit).ToArray());
                    }

                    int GetCol(params string[] headerNames)
                    {
                        foreach (var name in headerNames)
                        {
                            if (roomingHeaders.ContainsKey(name)) return roomingHeaders[name];
                        }

                        // Fuzzy/normalized fallback for truncated headers (e.g., 'Doğum Tar' -> 'Doğum Tarihi', 'Pasaport N' -> 'Pasaport No')
                        foreach (var name in headerNames)
                        {
                            string normSearch = NormalizeHeader(name);
                            if (string.IsNullOrEmpty(normSearch)) continue;
                            foreach (var kvp in roomingHeaders)
                            {
                                string normKey = NormalizeHeader(kvp.Key);
                                if (string.IsNullOrEmpty(normKey)) continue;
                                if (normKey.Contains(normSearch) || normSearch.Contains(normKey)) return kvp.Value;
                            }
                        }
                        return -1;
                    }

                    string GetVal(IXLRow r, params string[] headerNames)
                    {
                        int c = GetCol(headerNames);
                        if (c != -1)
                        {
                            var cellVal = r.Cell(c).GetString().Trim();
                            if (!string.IsNullOrEmpty(cellVal)) return cellVal;
                        }
                        return string.Empty;
                    }

                    int pAdults = 0, pChildren = 0, pInfants = 0;
                    Booking? currentBooking = null;
                    int lastRow = wsRooming.LastRowUsed()!.RowNumber();

                    var refToRoomMap = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                    int nextRoomNum = 1;

                    for (int r = 2; r <= lastRow; r++)
                    {
                        var row = wsRooming.Row(r);
                        string col1 = row.Cell(1).GetString().Trim();
                        string bookingRef = GetVal(row, "BookingRef");

                        if (!string.IsNullOrEmpty(bookingRef) || (!string.IsNullOrEmpty(col1) && col1.Contains("-") && GetCol("Yolcu Adı") != 1))
                        {
                            string finalRef = !string.IsNullOrEmpty(bookingRef) ? bookingRef : col1;
                            currentBooking = new Booking
                            {
                                TourId = tour.Id,
                                ClientId = client.Id,
                                ServiceType = finalRef,
                                BookingDate = tour.ArrivalDate,
                                Status = "Confirmed"
                            };
                            _context.Bookings.Add(currentBooking);
                            await _context.SaveChangesAsync();
                        }

                        string firstName = GetVal(row, "FirstName", "Yolcu Adı", "Name", "Adı", "First Name", "PassengerName");
                        string lastName = GetVal(row, "LastName", "Yolcu Soyadı", "Soyadı", "Surname", "Last Name");

                        if (string.IsNullOrEmpty(firstName))
                        {
                            if (!string.IsNullOrEmpty(col1) && !col1.Contains("-")) firstName = col1;
                        }

                        if (string.IsNullOrEmpty(lastName) && firstName.Contains(" "))
                        {
                            int lastSpace = firstName.LastIndexOf(' ');
                            lastName = firstName.Substring(lastSpace + 1);
                            firstName = firstName.Substring(0, lastSpace);
                        }

                        if (string.IsNullOrEmpty(firstName)) continue;

                        string gender = GetVal(row, "Gender", "Cinsiyet", "Sex");
                        string tc = GetVal(row, "NationalId", "T.C. Kimlik", "T.C. Kimlik No", "TC", "IdentityNo");
                        string roomType = GetVal(row, "RoomType", "Oda Tipi", "Room Tipi");
                        string phone = GetVal(row, "Phone", "Telefon", "Tel", "Mobile");
                        string passportNo = GetVal(row, "PassportNo", "Pasaport N", "Pasaport No", "Passport");
                        string passportType = GetVal(row, "PassportType", "Pasaport ty", "Pasaport Type", "Passport Tipi");
                        string visaNo = GetVal(row, "VisaNo", "Vize No", "Visa Number");
                        string paxType = GetVal(row, "PaxType", "Pax Type", "Yolcu Tipi");

                        int dobCol = GetCol("DateOfBirth", "Doğum Tar", "Doğum Tarihi", "DOB", "Birth Date");
                        DateTime? dob = dobCol != -1 ? ParseExcelDate(row.Cell(dobCol)) : null;

                        int.TryParse(GetVal(row, "PaxNo"), out int paxIndex);

                        int? assignedRoomNumber = null;
                        string keyRef = !string.IsNullOrEmpty(bookingRef) ? bookingRef : (!string.IsNullOrEmpty(col1) && col1.Contains("-") ? col1 : "");
                        if (!string.IsNullOrEmpty(keyRef))
                        {
                            if (!refToRoomMap.TryGetValue(keyRef, out int rm))
                            {
                                rm = nextRoomNum++;
                                refToRoomMap[keyRef] = rm;
                            }
                            assignedRoomNumber = rm;
                        }

                        var passenger = new Passenger
                        {
                            TourId = tour.Id,
                            FirstName = firstName,
                            LastName = lastName,
                            Gender = gender,
                            NationalId = tc,
                            RoomType = roomType,
                            RoomNumber = assignedRoomNumber,
                            PaxType = !string.IsNullOrEmpty(paxType) ? paxType : "Adult",
                            DateOfBirth = dob,
                            Phone = phone,
                            PassportNo = passportNo,
                            PassportType = passportType,
                            VisaNo = visaNo,
                            Pax = paxIndex
                        };
                        _context.Passengers.Add(passenger);

                        bool isStaff = firstName.Equals("DRIVER", StringComparison.OrdinalIgnoreCase) 
                                    || firstName.Equals("GUIDE", StringComparison.OrdinalIgnoreCase)
                                    || firstName.Equals("REHBER", StringComparison.OrdinalIgnoreCase)
                                    || firstName.Equals("KAPTAN", StringComparison.OrdinalIgnoreCase)
                                    || firstName.Equals("SOFOR", StringComparison.OrdinalIgnoreCase)
                                    || firstName.Equals("SOFÖR", StringComparison.OrdinalIgnoreCase)
                                    || firstName.Equals("ŞÖFÖR", StringComparison.OrdinalIgnoreCase)
                                    || (lastName != null && (lastName.Equals("DRIVER", StringComparison.OrdinalIgnoreCase) || lastName.Equals("GUIDE", StringComparison.OrdinalIgnoreCase) || lastName.Equals("REHBER", StringComparison.OrdinalIgnoreCase)));

                        if (!isStaff && !string.IsNullOrEmpty(paxType))
                        {
                            if (paxType.Equals("Adult", StringComparison.OrdinalIgnoreCase)) pAdults++;
                            else if (paxType.Equals("Children", StringComparison.OrdinalIgnoreCase) || paxType.Equals("CHD", StringComparison.OrdinalIgnoreCase)) pChildren++;
                            else if (paxType.Equals("Infant", StringComparison.OrdinalIgnoreCase)) pInfants++;
                        }
                    }

                    var insertedPassengersCount = await _context.Passengers.CountAsync(p => p.TourId == tour.Id 
                        && !p.FirstName.ToUpper().Contains("DRIVER") 
                        && !p.FirstName.ToUpper().Contains("GUIDE")
                        && !p.FirstName.ToUpper().Contains("REHBER")
                        && !p.FirstName.ToUpper().Contains("KAPTAN")
                        && !p.FirstName.ToUpper().Contains("SOFOR")
                        && !p.FirstName.ToUpper().Contains("SOFÖR")
                        && !p.FirstName.ToUpper().Contains("ŞÖFÖR"));

                    if (pAdults + pChildren + pInfants > 0)
                    {
                        tour.Adults = pAdults;
                        tour.Children = pChildren;
                        tour.Infants = pInfants;
                        tour.Pax = pAdults + pChildren + pInfants;
                    }
                    else if (insertedPassengersCount > 0)
                    {
                        tour.Adults = insertedPassengersCount;
                        tour.Pax = insertedPassengersCount;
                    }
                    await _context.SaveChangesAsync();
                }

                // Hotels Sheet in Rooming File -> Create TourServices
                var wsHotels = wbRooming.Worksheets.FirstOrDefault(w => w.Name.Equals("Hotels", StringComparison.OrdinalIgnoreCase));
                if (wsHotels != null && wsHotels.RangeUsed() != null && wsHotels.RowsUsed().Count() >= 2)
                {
                    // Clear existing Hotel services (ServiceCategoryId == 1) for this tour
                    var oldHotels = await _context.TourServices.Where(ts => ts.TourId == tour.Id && ts.ServiceCategoryId == 1).ToListAsync();
                    if (oldHotels.Any()) _context.TourServices.RemoveRange(oldHotels);

                    for (int r = 2; r <= wsHotels.LastRowUsed()!.RowNumber(); r++)
                    {
                        var hRow = wsHotels.Row(r);
                        string hName = hRow.Cell(1).GetString().Trim();
                        if (string.IsNullOrEmpty(hName)) continue;

                        DateTime sDate = ParseExcelDate(hRow.Cell(4)) ?? tour.ArrivalDate;
                        DateTime eDate = ParseExcelDate(hRow.Cell(5)) ?? tour.EndDate;
                        int nights = (int)(eDate - sDate).TotalDays;
                        if (nights <= 0) nights = 1;

                        int d = hRow.Cell(6).TryGetValue(out int dv) ? dv : 0;
                        int s = hRow.Cell(7).TryGetValue(out int sv) ? sv : 0;
                        int t = hRow.Cell(8).TryGetValue(out int tv) ? tv : 0;
                        int tw = hRow.Cell(9).TryGetValue(out int twv) ? twv : 0;

                        var dbHotel = await _context.Hotels.FirstOrDefaultAsync(h => h.Name.ToLower() == hName.ToLower());
                        if (dbHotel == null)
                        {
                            dbHotel = new Hotel
                            {
                                Name = hName,
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

                        void AddHotelRoom(int count, string rType, decimal roomRate, decimal paxRate)
                        {
                            if (count > 0)
                            {
                                int paxPerRoom = rType == "Single" ? 1 : (rType == "Triple" ? 3 : 2);
                                decimal effectivePaxRate = paxRate > 0 ? paxRate : (roomRate > 0 ? roomRate / paxPerRoom : (rType == "Single" ? dbHotel.SingleRate : (rType == "Triple" ? dbHotel.TripleRate : dbHotel.DoubleRate)));
                                if (effectivePaxRate <= 0) effectivePaxRate = 45m;
                                
                                int totalNights = nights > 0 ? nights : 1;
                                int totalRoomNights = totalNights * count;
                                decimal totalCost = totalRoomNights * paxPerRoom * effectivePaxRate;

                                var ts = new TourService
                                {
                                    TourId = tour.Id,
                                    ServiceCategoryId = 1, // Hotel
                                    Description = $"{hName} ({rType} Room)",
                                    StartDate = sDate,
                                    EndDate = eDate,
                                    ServiceDate = sDate,
                                    ServiceEndDate = eDate,
                                    TotalNights = totalNights,
                                    RoomCount = count,
                                    RoomType = rType,
                                    Quantity = totalRoomNights,
                                    UnitPrice = effectivePaxRate * paxPerRoom,
                                    TotalAmount = totalCost,
                                    HotelId = dbHotel.Id,
                                    IsRevenue = false
                                };
                                _context.TourServices.Add(ts);
                            }
                        }

                        AddHotelRoom(d, "Double", dbHotel.DoubleRoomRate, dbHotel.DoublePaxRate);
                        AddHotelRoom(s, "Single", dbHotel.SingleRoomRate, dbHotel.SinglePaxRate);
                        AddHotelRoom(t, "Triple", dbHotel.TripleRoomRate, dbHotel.TriplePaxRate);
                        AddHotelRoom(tw, "Twin", dbHotel.TwinRoomRate, dbHotel.TwinPaxRate);
                    }
                    await _context.SaveChangesAsync();
                }
            }

            // 5. Process Sales File (if provided)
            if (salesFile != null)
            {
                using var salesStream = salesFile.OpenReadStream();
                using var wbSales = new XLWorkbook(salesStream);

                var otherCat = await _context.ServiceCategories.FirstOrDefaultAsync(c => !c.IsBase && !c.IsOperational && c.IsRevenue);
                if (otherCat == null)
                {
                    otherCat = new ServiceCategory { Name = "Other Revenue", IsBase = false, IsOperational = false, IsRevenue = true, IsCost = false };
                    _context.ServiceCategories.Add(otherCat);
                    await _context.SaveChangesAsync();
                }

                // Clear existing Excursions (6), Invoiced Fee (8), and Other Revenue categories for this tour to avoid duplicate appending
                var oldSalesServices = await _context.TourServices
                    .Where(ts => ts.TourId == tour.Id && (ts.ServiceCategoryId == 6 || ts.ServiceCategoryId == 8 || ts.ServiceCategoryId == otherCat.Id))
                    .ToListAsync();
                if (oldSalesServices.Any())
                {
                    _context.TourServices.RemoveRange(oldSalesServices);
                    await _context.SaveChangesAsync();
                }

                // Excursions
                var wsExc = wbSales.Worksheets.FirstOrDefault(w => w.Name.Equals("ExcusionSales", StringComparison.OrdinalIgnoreCase) || w.Name.Equals("ExcursionSales", StringComparison.OrdinalIgnoreCase));
                if (wsExc != null && wsExc.RangeUsed() != null)
                {
                    var dateRow = wsExc.Row(1);
                    var priceRow = wsExc.Row(2);
                    var headerRow = wsExc.Row(3);

                    int excLastCol = wsExc.LastColumnUsed()?.ColumnNumber() ?? 20;
                    for (int c = 2; c <= excLastCol; c++)
                    {
                        string excHeader = headerRow.Cell(c).GetString().Trim();
                        if (string.IsNullOrEmpty(excHeader) || excHeader.StartsWith("SUM") || excHeader.StartsWith("Child")) continue;

                        priceRow.Cell(c).TryGetValue(out decimal price);

                        string dateStr = dateRow.Cell(c).GetString().Trim();
                        DateTime? eDate = null;
                        if (dateStr.Length >= 10 && DateTime.TryParseExact(dateStr.Substring(0, 10), "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsed))
                        {
                            eDate = parsed;
                        }

                        int qty = 0;
                        int dataStartRow = 4;
                        string row4Label = wsExc.Cell(4, 1).GetString().Trim();
                        if (row4Label.Equals("Excursion Name", StringComparison.OrdinalIgnoreCase) || row4Label.Equals("Passenger Name", StringComparison.OrdinalIgnoreCase))
                        {
                            dataStartRow = 5;
                        }

                        for (int r = dataStartRow; r <= wsExc.LastRowUsed()!.RowNumber(); r++)
                        {
                            string val = wsExc.Cell(r, c).GetString().Trim();
                            if (val.Equals("True", StringComparison.OrdinalIgnoreCase) || val.Equals("TRUE", StringComparison.Ordinal) || val == "1" || val == "✓" || val == "☑")
                            {
                                qty++;
                            }
                        }

                        if (qty > 0)
                        {
                            var dbEx = await _context.Excursions.FirstOrDefaultAsync(e => e.TourCode != null && e.TourCode.ToLower() == excHeader.ToLower());
                            if (dbEx == null)
                            {
                                dbEx = await _context.Excursions.FirstOrDefaultAsync(e => e.Name.ToLower() == excHeader.ToLower());
                            }

                            string displayName = dbEx?.Name ?? excHeader;

                            // Revenue Line
                            var tsRev = new TourService
                            {
                                TourId = tour.Id,
                                ServiceCategoryId = 6, // Excursion
                                Description = displayName,
                                UnitPrice = price,
                                Quantity = qty,
                                TotalAmount = price * qty,
                                StartDate = eDate,
                                EndDate = eDate,
                                ServiceDate = eDate,
                                ServiceEndDate = eDate,
                                IsRevenue = true,
                                ExcursionId = dbEx?.Id
                            };
                            _context.TourServices.Add(tsRev);

                            // Expense Line
                            var tsCost = new TourService
                            {
                                TourId = tour.Id,
                                ServiceCategoryId = 6, // Excursion
                                Description = displayName,
                                UnitPrice = dbEx?.Price ?? 0,
                                Quantity = qty,
                                TotalAmount = (dbEx?.Price ?? 0) * qty,
                                StartDate = eDate,
                                EndDate = eDate,
                                ServiceDate = eDate,
                                ServiceEndDate = eDate,
                                IsRevenue = false,
                                ExcursionId = dbEx?.Id
                            };
                            _context.TourServices.Add(tsCost);
                        }
                    }
                }

                // Base Services
                var wsBase = wbSales.Worksheets.FirstOrDefault(w => w.Name.Equals("BaseServices", StringComparison.OrdinalIgnoreCase));
                if (wsBase != null && wsBase.RangeUsed() != null)
                {
                    for (int r = 2; r <= wsBase.LastRowUsed()!.RowNumber(); r++)
                    {
                        var row = wsBase.Row(r);
                        string name = row.Cell(1).GetString().Trim();
                        if (string.IsNullOrEmpty(name)) continue;

                        string revVal = row.Cell(2).GetString().Trim();
                        string expVal = row.Cell(3).GetString().Trim();
                        string othVal = row.Cell(4).GetString().Trim();
                        string paxVal = row.Cell(5).GetString().Trim();

                        bool isRevenue = revVal.Equals("TRUE", StringComparison.OrdinalIgnoreCase) || revVal == "1" || revVal == "✓" || revVal == "☑" || revVal.Equals("x", StringComparison.OrdinalIgnoreCase);
                        bool isExpense = expVal.Equals("TRUE", StringComparison.OrdinalIgnoreCase) || expVal == "1" || expVal == "✓" || expVal == "☑" || expVal.Equals("x", StringComparison.OrdinalIgnoreCase);
                        bool isOther = othVal.Equals("TRUE", StringComparison.OrdinalIgnoreCase) || othVal == "1" || othVal == "✓" || othVal == "☑" || othVal.Equals("x", StringComparison.OrdinalIgnoreCase);
                        bool isPerPax = paxVal.Equals("TRUE", StringComparison.OrdinalIgnoreCase) || paxVal == "1" || paxVal == "✓" || paxVal == "☑" || paxVal.Equals("x", StringComparison.OrdinalIgnoreCase);

                        row.Cell(6).TryGetValue(out decimal unitPrice);
                        row.Cell(7).TryGetValue(out int adultCount);
                        row.Cell(8).TryGetValue(out int childCount);
                        row.Cell(9).TryGetValue(out int infantCount);
                        row.Cell(10).TryGetValue(out decimal total);

                        int totalPaxCount = (adultCount + childCount + infantCount) > 0 ? (adultCount + childCount + infantCount) : tour.Pax;
                        if (total <= 0)
                        {
                            total = isPerPax ? unitPrice * totalPaxCount : unitPrice;
                        }

                        var baseCat = await _context.ServiceCategories.FirstOrDefaultAsync(c => c.Id == 8); // Invoiced Fee

                        int catId = isOther ? otherCat.Id : (baseCat?.Id ?? 8);
                        bool finalIsRevenue = !isExpense;

                        var ts = new TourService
                        {
                            TourId = tour.Id,
                            ServiceCategoryId = catId,
                            Description = name,
                            UnitPrice = unitPrice,
                            Quantity = isPerPax ? totalPaxCount : 1,
                            TotalAmount = total,
                            IsRevenue = finalIsRevenue
                        };
                        _context.TourServices.Add(ts);

                        if (name.Contains("Agency Fee", StringComparison.OrdinalIgnoreCase) || name.Contains("Agengy Fee", StringComparison.OrdinalIgnoreCase))
                        {
                            tour.BaseFee = unitPrice;
                            tour.TotalFee = total;
                        }
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Import Successful", TourId = tour.Id, TourCode = tour.TourCode, Pax = tour.Pax });
        }

        private static DateTime? ParseExcelDate(IXLCell? cell)
        {
            if (cell == null || cell.IsEmpty()) return null;
            if (cell.DataType == XLDataType.DateTime) return cell.GetDateTime();
            string str = cell.GetString().Trim();
            if (string.IsNullOrEmpty(str)) return null;

            string[] formats = new[] { "dd.MM.yyyy", "yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "d.M.yyyy", "d/M/yyyy" };
            if (DateTime.TryParseExact(str, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedExact))
                return parsedExact;
            if (DateTime.TryParse(str, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedAny))
                return parsedAny;
            return null;
        }
    }
}
