using System;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Collections.Generic;
using ClosedXML.Excel;
using NUnit.Framework;
using System.IO;

namespace Uno_E2E_Tests
{
    public class TourDto
    {
        public int Id { get; set; }
        public string? TourCode { get; set; }
        public int? Pax { get; set; }
    }

    public class TourServiceDto
    {
        public int Id { get; set; }
        public int ServiceCategoryId { get; set; }
        public string? Description { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? TotalAmount { get; set; }
        public DateTime? ServiceDate { get; set; }
        public bool? IsRevenue { get; set; }
    }

    [TestFixture]
    public class TourImportValidationTests
    {
        private static readonly string API = "http://127.0.0.1:8001/api";
        private readonly HttpClient _http = new();
        private readonly JsonSerializerOptions _jsonOpts = new() { PropertyNameCaseInsensitive = true };

        [Test]
        public async Task Test_PBI6_TourImport_ValidateAndGenerateExcel_ReturnsSuccess()
        {
            var tourId = 6084;
            var expectedTourCode = "PVB01092026";
            var expectedPax = 48;

            // 1. Validate Tour Entity
            var tourRes = await _http.GetAsync($"{API}/tours/{tourId}");
            NUnit.Framework.Assert.That(tourRes.IsSuccessStatusCode, Is.True, $"Failed to fetch Tour. API returned {tourRes.StatusCode}. API might be down or Tour ID is wrong.");
            
            var tourJson = await tourRes.Content.ReadAsStringAsync();
            var tour = JsonSerializer.Deserialize<TourDto>(tourJson, _jsonOpts);

            NUnit.Framework.Assert.That(tour, Is.Not.Null);
            NUnit.Framework.Assert.That(tour!.TourCode, Is.EqualTo(expectedTourCode), "TourCode does not match expected value!");
            NUnit.Framework.Assert.That(tour.Pax, Is.EqualTo(expectedPax), "Pax does not match expected value!");

            // 2. Validate Services
            var svcRes = await _http.GetAsync($"{API}/tourservices?tourId={tourId}");
            NUnit.Framework.Assert.That(svcRes.IsSuccessStatusCode, Is.True, "Failed to fetch Tour Services.");
            
            var svcJson = await svcRes.Content.ReadAsStringAsync();
            var services = JsonSerializer.Deserialize<List<TourServiceDto>>(svcJson, _jsonOpts);

            NUnit.Framework.Assert.That(services, Is.Not.Null);
            NUnit.Framework.Assert.That(services!.Count, Is.GreaterThan(0), "No services were imported for this tour!");

            // 3. Generate Excel
            using var workbook = new XLWorkbook();
            var ws = workbook.Worksheets.Add("Import Validation");
            
            ws.Cell(1, 1).Value = "Id";
            ws.Cell(1, 2).Value = "CategoryId";
            ws.Cell(1, 3).Value = "Description";
            ws.Cell(1, 4).Value = "Quantity";
            ws.Cell(1, 5).Value = "UnitPrice";
            ws.Cell(1, 6).Value = "TotalAmount";
            ws.Cell(1, 7).Value = "ServiceDate";
            ws.Cell(1, 8).Value = "IsRevenue";

            var headerRow = ws.Range(1, 1, 1, 8);
            headerRow.Style.Font.Bold = true;
            headerRow.Style.Fill.BackgroundColor = XLColor.LightGray;

            decimal grandTotal = 0;
            int row = 2;

            foreach (var s in services)
            {
                ws.Cell(row, 1).Value = s.Id;
                ws.Cell(row, 2).Value = s.ServiceCategoryId;
                ws.Cell(row, 3).Value = s.Description ?? "";
                ws.Cell(row, 4).Value = s.Quantity ?? 0m;
                ws.Cell(row, 5).Value = s.UnitPrice ?? 0m;
                
                var total = s.TotalAmount ?? 0m;
                ws.Cell(row, 6).Value = total;
                ws.Cell(row, 7).Value = s.ServiceDate?.ToString("yyyy-MM-dd") ?? "";
                
                if (s.IsRevenue.HasValue)
                    ws.Cell(row, 8).Value = s.IsRevenue.Value ? "Yes" : "No";
                else
                    ws.Cell(row, 8).Value = "N/A";

                grandTotal += total;
                row++;
            }

            ws.Cell(row + 1, 5).Value = "GRAND TOTAL";
            ws.Cell(row + 1, 5).Style.Font.Bold = true;
            ws.Cell(row + 1, 6).Value = grandTotal;
            ws.Cell(row + 1, 6).Style.Font.Bold = true;

            ws.Columns().AdjustToContents();

            var outputDir = @"c:\Ersen\Projects_2025\Uno_ERP\Uno_E2E_Tests";
            var outPath = Path.Combine(outputDir, "Test20260801_TourImportReport.xlsx");
            workbook.SaveAs(outPath);

            NUnit.Framework.Assert.That(File.Exists(outPath), Is.True, "Excel report was not created successfully.");
        }
    }
}
