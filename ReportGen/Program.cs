using System;
using System.Linq;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;
using ClosedXML.Excel;

namespace ReportGen
{
    class Program
    {
        static void Main(string[] args)
        {
            string file1 = @"C:\Ersen\Projects_2025\Uno_ERP\Uno_E2E_Tests\20260731_import\PRJ-BVP1_tourBVP01092026.xlsx";
            using var fs1 = new System.IO.FileStream(file1, System.IO.FileMode.Open, System.IO.FileAccess.Read, System.IO.FileShare.ReadWrite);
            using var wb1 = new ClosedXML.Excel.XLWorkbook(fs1);
            var wsRooming = wb1.Worksheet("Rooming");
            var headerRow = wsRooming.Row(1);
            for (int c = 1; c <= 25; c++) {
                Console.WriteLine($"Row1 Col{c}: {headerRow.Cell(c).GetString()}");
            }
            var row2 = wsRooming.Row(2);
            for (int c = 1; c <= 25; c++) {
                Console.WriteLine($"Row2 Col{c}: {row2.Cell(c).GetString()}");
            }
            return;
            // var json = System.IO.File.ReadAllText(@"C:\Ersen\Projects_2025\Uno_ERP\Uno_API\Uno_API\appsettings.Development.json");
            string connectionString = "";

            var optionsBuilder = new DbContextOptionsBuilder<UnoDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            using var context = new UnoDbContext(optionsBuilder.Options);

            var tour = context.Tours
                .Include(t => t.TourServices)
                .Include(t => t.Bookings)
                .Include(t => t.Passengers)
                .FirstOrDefault(t => t.TourCode == "BVP01092026");

            if (tour == null)
            {
                Console.WriteLine("Error: Tour BVP01092026 not found.");
                return;
            }

            Console.WriteLine($"Found tour {tour.TourCode} with {tour.Passengers.Count} passengers, {tour.Bookings.Count} bookings, and {tour.TourServices.Count} services.");

            using var workbook = new XLWorkbook();
            
            // Sheet 1: Passengers & Bookings
            var wsPax = workbook.Worksheets.Add("Passengers");
            wsPax.Cell(1, 1).Value = "FirstName";
            wsPax.Cell(1, 2).Value = "LastName";
            wsPax.Cell(1, 3).Value = "NationalId";
            wsPax.Cell(1, 4).Value = "Phone";
            wsPax.Cell(1, 5).Value = "Gender";
            
            int row = 2;
            foreach (var pax in tour.Passengers)
            {
                wsPax.Cell(row, 1).Value = pax.FirstName;
                wsPax.Cell(row, 2).Value = pax.LastName;
                wsPax.Cell(row, 3).Value = pax.NationalId;
                wsPax.Cell(row, 4).Value = pax.Phone;
                wsPax.Cell(row, 5).Value = pax.Gender;
                row++;
            }

            // Sheet 2: Services & Finances
            var wsServices = workbook.Worksheets.Add("Services");
            wsServices.Cell(1, 1).Value = "Category";
            wsServices.Cell(1, 2).Value = "Description";
            wsServices.Cell(1, 3).Value = "Quantity";
            wsServices.Cell(1, 4).Value = "UnitPrice";
            wsServices.Cell(1, 5).Value = "TotalAmount";
            
            int r2 = 2;
            decimal grandTotal = 0;
            foreach (var svc in tour.TourServices)
            {
                wsServices.Cell(r2, 1).Value = svc.ServiceCategoryId;
                wsServices.Cell(r2, 2).Value = svc.Description;
                wsServices.Cell(r2, 3).Value = svc.Quantity;
                wsServices.Cell(r2, 4).Value = svc.UnitPrice;
                wsServices.Cell(r2, 5).Value = svc.TotalAmount;
                grandTotal += svc.TotalAmount;
                r2++;
            }

            wsServices.Cell(r2 + 1, 4).Value = "Grand Total:";
            wsServices.Cell(r2 + 1, 5).Value = grandTotal;

            string path = @"C:\Ersen\Projects_2025\Uno_ERP\Uno_E2E_Tests\Test20260801_TourImportReport_v2.xlsx";
            workbook.SaveAs(path);
            Console.WriteLine($"Report successfully generated at: {path}");
        }
    }
}
