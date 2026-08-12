using ClosedXML.Excel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExcelImportController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public ExcelImportController(UnoDbContext context)
        {
            _context = context;
        }

        [HttpPost("upload-tours")]
        public async Task<IActionResult> UploadTours(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                using var stream = new MemoryStream();
                await file.CopyToAsync(stream);
                stream.Position = 0;
                using var workbook = new XLWorkbook(stream);
                
                var worksheet = workbook.Worksheets.FirstOrDefault(w => w.Name.Equals("Tours", StringComparison.OrdinalIgnoreCase)) 
                                ?? workbook.Worksheets.First();

                var usedRange = worksheet.RangeUsed();
                if (usedRange == null)
                    return BadRequest("The uploaded Excel file is empty.");

                var rows = usedRange.RowsUsed().ToList();
                if (rows.Count < 2)
                    return BadRequest("The uploaded Excel file does not contain enough data rows.");

                var headerRow = rows.First();
                var columnMap = new Dictionary<string, int>();

                foreach (var cell in headerRow.CellsUsed())
                {
                    string header = cell.GetString().ToLower().Replace(" ", "").Trim();
                    if (!string.IsNullOrEmpty(header))
                    {
                        columnMap[header] = cell.Address.ColumnNumber;
                    }
                }

                var defaultClient = await _context.Clients.FirstOrDefaultAsync();
                var defaultProject = await _context.Projects.FirstOrDefaultAsync();

                if (defaultClient == null || defaultProject == null)
                {
                    return BadRequest("System must have at least one Client and one Project before importing tours.");
                }

                var defaultTourStatus = await _context.TourStatuses.FirstOrDefaultAsync(s => s.Name == "Draft");
                int statusId = defaultTourStatus?.Id ?? 1;

                var importedTours = new List<Tour>();

                foreach (var row in rows.Skip(1))
                {
                    var tour = new Tour
                    {
                        ProjectId = defaultProject.Id,
                        TourStatusId = statusId,
                        ArrivalDate = DateTime.Now,
                        EndDate = DateTime.Now.AddDays(7)
                    };

                    if (columnMap.TryGetValue("tourcode", out int codeCol))
                        tour.TourCode = row.Cell(codeCol).GetString().Trim();
                    
                    if (columnMap.TryGetValue("destination", out int destCol))
                        tour.Destination = row.Cell(destCol).GetString().Trim();

                    if (columnMap.TryGetValue("pax", out int paxCol))
                    {
                        if (int.TryParse(row.Cell(paxCol).GetString().Trim(), out int pax))
                            tour.Pax = pax;
                    }
                    if (columnMap.TryGetValue("adults", out int adCol))
                    {
                        if (int.TryParse(row.Cell(adCol).GetString().Trim(), out int ad))
                            tour.Adults = ad;
                    }
                    if (columnMap.TryGetValue("children", out int chCol))
                    {
                        if (int.TryParse(row.Cell(chCol).GetString().Trim(), out int ch))
                            tour.Children = ch;
                    }
                    if (columnMap.TryGetValue("infants", out int infCol))
                    {
                        if (int.TryParse(row.Cell(infCol).GetString().Trim(), out int inf))
                            tour.Infants = inf;
                    }
                    
                    if (tour.Pax == 0 && tour.Adults > 0)
                    {
                        tour.Pax = tour.Adults + tour.Children;
                    }
                    else if (tour.Pax > 0 && tour.Adults == 0)
                    {
                        tour.Adults = tour.Pax;
                    }

                    if (columnMap.TryGetValue("arrivaldate", out int arrDateCol))
                    {
                        if (DateTime.TryParse(row.Cell(arrDateCol).GetString().Trim(), out var date))
                            tour.ArrivalDate = date;
                    }
                    if (columnMap.TryGetValue("enddate", out int endDateCol))
                    {
                        if (DateTime.TryParse(row.Cell(endDateCol).GetString().Trim(), out var date))
                            tour.EndDate = date;
                    }
                    if (columnMap.TryGetValue("arrivalflight", out int arrFlightCol))
                    {
                        tour.ArrivalFlight = row.Cell(arrFlightCol).GetString().Trim();
                    }
                    if (columnMap.TryGetValue("departureflight", out int depFlightCol))
                    {
                        tour.DepartureFlight = row.Cell(depFlightCol).GetString().Trim();
                    }

                    if (!string.IsNullOrEmpty(tour.Destination) && tour.Destination != "Imported Destination" || 
                        !string.IsNullOrEmpty(tour.TourCode) && !tour.TourCode.StartsWith("IMP-"))
                    {
                        importedTours.Add(tour);
                    }
                }

                if (importedTours.Any())
                {
                    _context.Tours.AddRange(importedTours);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = $"Successfully imported {importedTours.Count} tours.", importedCount = importedTours.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("upload-passengers")]
        public async Task<IActionResult> UploadPassengers(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                using var stream = new MemoryStream();
                await file.CopyToAsync(stream);
                stream.Position = 0;
                using var workbook = new XLWorkbook(stream);
                
                var worksheet = workbook.Worksheets.FirstOrDefault(w => w.Name.Equals("Bookings", StringComparison.OrdinalIgnoreCase)) 
                                ?? workbook.Worksheets.First();

                var usedRange = worksheet.RangeUsed();
                if (usedRange == null)
                    return BadRequest("The uploaded Excel file is empty.");

                var rows = usedRange.RowsUsed().ToList();
                if (rows.Count < 2)
                    return BadRequest("The uploaded Excel file does not contain enough data rows.");

                var importedPassengers = new List<Passenger>();
                var tours = await _context.Tours.ToListAsync();
                
                string currentTourCode = "";
                Tour? currentTour = null;

                foreach (var row in rows)
                {
                    // Check if this is a header row by looking for "Oda" or "Yolcu"
                    string col1 = row.Cell(1).GetString().Trim();
                    string col2 = row.Cell(2).GetString().Trim().ToLower();
                    string col3 = row.Cell(3).GetString().Trim().ToLower();
                    string col4 = row.Cell(4).GetString().Trim().ToLower();

                    if (col2.Contains("oda") || col4.Contains("yolcu"))
                    {
                        // It's a header row! Column 1 contains the Tour Code (e.g. ATES-000015)
                        if (!string.IsNullOrEmpty(col1))
                        {
                            currentTourCode = col1;
                            currentTour = tours.FirstOrDefault(t => t.TourCode.Equals(currentTourCode, StringComparison.OrdinalIgnoreCase));
                        }
                        continue;
                    }

                    // If it's not a header row, and we have a current tour, parse passenger
                    if (currentTour != null)
                    {
                        string roomType = row.Cell(2).GetString().Trim();
                        string firstName = row.Cell(4).GetString().Trim();
                        string lastName = row.Cell(5).GetString().Trim();
                        
                        if (string.IsNullOrEmpty(firstName) && string.IsNullOrEmpty(lastName))
                        {
                            continue; // Skip empty rows
                        }
                        
                        int pax = 1;
                        if (int.TryParse(row.Cell(3).GetString().Trim(), out int p))
                        {
                            pax = p;
                        }

                        string gender = row.Cell(6).GetString().Trim();
                        string nationalId = row.Cell(8).GetString().Trim();
                        
                        DateTime? dob = null;
                        if (DateTime.TryParse(row.Cell(9).GetString().Trim(), out var d))
                        {
                            dob = d;
                        }
                        
                        string phone = row.Cell(10).GetString().Trim();
                        string passportNo = row.Cell(11).GetString().Trim();
                        string passportType = row.Cell(12).GetString().Trim();
                        string visaNo = row.Cell(13).GetString().Trim();
                        string address = row.Cell(14).GetString().Trim();

                        importedPassengers.Add(new Passenger
                        {
                            FirstName = firstName,
                            LastName = lastName,
                            Gender = gender,
                            NationalId = nationalId,
                            DateOfBirth = dob,
                            Phone = phone,
                            PassportNo = passportNo,
                            PassportType = passportType,
                            VisaNo = visaNo,
                            RoomType = roomType,
                            Address = address,
                            Pax = pax,
                            TourId = currentTour.Id
                        });
                    }
                }

                if (importedPassengers.Any())
                {
                    _context.Passengers.AddRange(importedPassengers);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = $"Successfully imported {importedPassengers.Count} passengers.", importedCount = importedPassengers.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
