using Microsoft.AspNetCore.Mvc;
using ClosedXML.Excel;
using Uno_API.Models;
using Uno_API.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.IO;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourTemplatesController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public TourTemplatesController(UnoDbContext context)
        {
            _context = context;
        }

        [HttpGet("tour-import")]
        public async Task<IActionResult> GetTourImportTemplate()
        {
            using var wb = new XLWorkbook();
            
            // 1. Rooming Sheet
            var wsRooming = wb.Worksheets.Add("Rooming");
            string jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "Config", "ExcelMapping.json");
            if (System.IO.File.Exists(jsonPath))
            {
                var mappingJson = await System.IO.File.ReadAllTextAsync(jsonPath);
                var mappings = JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, JsonElement>>>(mappingJson);
                
                if (mappings != null && mappings.TryGetValue("Rooming", out var roomingMapping))
                {
                    int col = 1;
                    foreach (var key in roomingMapping.Keys)
                    {
                        wsRooming.Cell(1, col).Value = key;
                        wsRooming.Cell(1, col).Style.Font.Bold = true;
                        
                        // Add Validation if applicable
                        if (key.Equals("Cinsiyet", StringComparison.OrdinalIgnoreCase))
                        {
                            var dv = wsRooming.Range(2, col, 1000, col).CreateDataValidation();
                            dv.AllowedValues = XLAllowedValues.List;
                            dv.List("Male,Female,Other");
                        }
                        else if (key.Equals("RoomType", StringComparison.OrdinalIgnoreCase))
                        {
                            var dv = wsRooming.Range(2, col, 1000, col).CreateDataValidation();
                            dv.AllowedValues = XLAllowedValues.List;
                            dv.List("Double,Single,Triple,Twin");
                        }
                        else if (key.Equals("Pax Type", StringComparison.OrdinalIgnoreCase))
                        {
                            var dv = wsRooming.Range(2, col, 1000, col).CreateDataValidation();
                            dv.AllowedValues = XLAllowedValues.List;
                            dv.List("Adult,Child,Infant");
                        }
                        col++;
                    }
                }
            }

            // 2. Hotels Sheet
            var wsHotels = wb.Worksheets.Add("Hotels");
            var hotelHeaders = new[] { "Hotel Name", "Status", "Contact", "Check-in", "Check-out", "Double", "Single", "Triple", "Twin" };
            for (int i = 0; i < hotelHeaders.Length; i++)
            {
                wsHotels.Cell(1, i + 1).Value = hotelHeaders[i];
                wsHotels.Cell(1, i + 1).Style.Font.Bold = true;
            }

            // Master Data for Hotels
            var hotels = await _context.Hotels.ToListAsync();
            var wsMasterHotels = wb.Worksheets.Add("_Master_Hotels");
            wsMasterHotels.Visibility = XLWorksheetVisibility.Hidden;
            for (int i = 0; i < hotels.Count; i++)
            {
                // Escape apostrophes for validation lists just in case
                wsMasterHotels.Cell(i + 1, 1).Value = hotels[i].Name;
            }
            if (hotels.Count > 0)
            {
                var dv = wsHotels.Range(2, 1, 1000, 1).CreateDataValidation();
                dv.AllowedValues = XLAllowedValues.List;
                // Referencing hidden sheet with single quotes ensures spaces in sheet name are handled, though _Master_Hotels has no spaces.
                dv.List($"='_Master_Hotels'!$A$1:$A${hotels.Count}");
            }

            // 3. Flights Sheet
            var wsFlights = wb.Worksheets.Add("Flights");
            wsFlights.Cell(1, 1).Value = "Flight No";
            wsFlights.Cell(1, 2).Value = "Origin";
            wsFlights.Cell(1, 3).Value = "Destination";
            wsFlights.Cell(1, 4).Value = "Date (dd.MM.yyyy)";
            wsFlights.Cell(1, 5).Value = "Time";
            wsFlights.Range("A1:E1").Style.Font.Bold = true;

            wsFlights.Cell(2, 1).Value = "TK1001";
            wsFlights.Cell(3, 1).Value = "TK1002"; // Example data rows

            wsRooming.Columns().AdjustToContents();
            wsHotels.Columns().AdjustToContents();
            wsFlights.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            var content = stream.ToArray();

            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "TourImportTemplate.xlsx");
        }

        [HttpGet("sales-import")]
        public async Task<IActionResult> GetSalesImportTemplate()
        {
            using var wb = new XLWorkbook();
            
            // 1. Excursions Sheet
            var wsExc = wb.Worksheets.Add("ExcusionSales");
            var excursions = await _context.Excursions.ToListAsync();

            wsExc.Cell(1, 1).Value = "Dates";
            wsExc.Cell(2, 1).Value = "Prices";
            wsExc.Cell(3, 1).Value = "Code";
            wsExc.Cell(4, 1).Value = "Excursion Name";
            wsExc.Cell(4, 1).Style.Font.Italic = true;
            wsExc.Cell(4, 1).Style.Font.FontColor = XLColor.Gray;

            int col = 2;
            foreach (var ex in excursions)
            {
                wsExc.Cell(2, col).Value = ex.SalePrice;
                // Row 3: TourCode as the primary identifier
                wsExc.Cell(3, col).Value = !string.IsNullOrEmpty(ex.TourCode) ? ex.TourCode : ex.Name;
                // Row 4: Full name for user reference (italic, gray)
                wsExc.Cell(4, col).Value = ex.Name;
                wsExc.Cell(4, col).Style.Font.Italic = true;
                wsExc.Cell(4, col).Style.Font.FontColor = XLColor.Gray;
                col++;
            }
            if (col > 2)
            {
                wsExc.Range(3, 1, 3, col - 1).Style.Font.Bold = true;
            }

            // Passenger data starts at row 5 — add checkbox-style data validation
            wsExc.Cell(5, 1).Value = "Passenger Name";
            if (col > 2)
            {
                // Add TRUE/FALSE dropdown validation for the passenger grid (rows 5-500, columns 2+)
                var dvRange = wsExc.Range(5, 2, 500, col - 1);
                var dv = dvRange.CreateDataValidation();
                dv.AllowedValues = XLAllowedValues.List;
                dv.List("TRUE,FALSE");
            }

            // 2. Base Services Sheet
            var wsBase = wb.Worksheets.Add("BaseServices");
            var baseHeaders = new[] { "Base Service", "Revenue", "Expense", "Other", "per/Pax", "UnitPrice", "Adult", "Children", "Infant", "Total" };
            for (int i = 0; i < baseHeaders.Length; i++)
            {
                wsBase.Cell(1, i + 1).Value = baseHeaders[i];
                wsBase.Cell(1, i + 1).Style.Font.Bold = true;
            }

            // Checkbox validations for Revenue, Expense, Other, per/Pax (Cols 2-5)
            var baseDvRange = wsBase.Range(2, 2, 100, 5);
            var baseDv = baseDvRange.CreateDataValidation();
            baseDv.AllowedValues = XLAllowedValues.List;
            baseDv.List("TRUE,FALSE");

            // Sample Row 1: Agency Fee
            wsBase.Cell(2, 1).Value = "Agency Fee";
            wsBase.Cell(2, 2).Value = "TRUE";  // Revenue
            wsBase.Cell(2, 3).Value = "FALSE"; // Expense
            wsBase.Cell(2, 4).Value = "FALSE"; // Other
            wsBase.Cell(2, 5).Value = "TRUE";  // per/Pax
            wsBase.Cell(2, 6).Value = 200;     // UnitPrice
            wsBase.Cell(2, 7).Value = 36;      // Adult
            wsBase.Cell(2, 8).Value = 9;       // Children
            wsBase.Cell(2, 9).Value = 3;       // Infant
            wsBase.Cell(2, 10).Value = 8100;   // Total

            // Sample Row 2: CityTax
            wsBase.Cell(3, 1).Value = "CityTax";
            wsBase.Cell(3, 2).Value = "TRUE";  // Revenue
            wsBase.Cell(3, 3).Value = "FALSE"; // Expense
            wsBase.Cell(3, 4).Value = "FALSE"; // Other
            wsBase.Cell(3, 5).Value = "TRUE";  // per/Pax
            wsBase.Cell(3, 6).Value = 30;      // UnitPrice
            wsBase.Cell(3, 7).Value = 36;      // Adult
            wsBase.Cell(3, 8).Value = 9;       // Children
            wsBase.Cell(3, 9).Value = 3;       // Infant
            wsBase.Cell(3, 10).Value = 1080;   // Total

            wsExc.Columns().AdjustToContents();
            wsBase.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            var content = stream.ToArray();

            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SalesImportTemplate.xlsx");
        }
    }
}
