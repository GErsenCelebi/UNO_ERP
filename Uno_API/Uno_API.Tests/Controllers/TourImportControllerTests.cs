using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.IO;
using System.Threading.Tasks;
using Uno_API.Controllers;
using Uno_API.Data;
using Uno_API.Services;
using Xunit;

namespace Uno_API.Tests.Controllers
{
    public class TourImportControllerTests
    {
        private UnoDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<UnoDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new UnoDbContext(options);
        }

        [Fact]
        public async Task Test_Import_OrtaAvrupa_ReturnsPax()
        {
            var context = GetInMemoryDbContext();
            var mockStorage = new Mock<IStorageService>();
            var mockLookup = new Mock<ITourProjectLookupService>();
            var controller = new TourImportController(context, mockStorage.Object, mockLookup.Object);

            string filePath = @"C:\Users\ecele\Downloads\Orta Avrupa BVP_BVP06092926_rooming.xlsx";
            if (!File.Exists(filePath))
            {
                Assert.Fail("File does not exist: " + filePath);
                return;
            }

            using var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            var memoryStream = new MemoryStream();
            await stream.CopyToAsync(memoryStream);
            memoryStream.Position = 0;
            var fileMock = new FormFile(memoryStream, 0, memoryStream.Length, "roomingFile", Path.GetFileName(filePath));

            var actionResult = await controller.Import(roomingFile: fileMock);
            var okResult = Assert.IsType<OkObjectResult>(actionResult);
            
            // Serialize value to inspect
            string json = System.Text.Json.JsonSerializer.Serialize(okResult.Value);
            Console.WriteLine("Import Result: " + json);
            
            var tour = await context.Tours.Include(t => t.Passengers).FirstOrDefaultAsync();
            Assert.NotNull(tour);
            Console.WriteLine($"Tour Code: {tour.TourCode}, Pax: {tour.Pax}, Adults: {tour.Adults}, Children: {tour.Children}, Passengers Count: {tour.Passengers?.Count}");
            Assert.True(tour.Pax > 0, $"Expected Pax > 0 but got {tour.Pax}. Passengers count in db: {tour.Passengers?.Count}");
        }

        [Fact]
        public async Task Test_Import_PVB16082026_Rooming()
        {
            var context = GetInMemoryDbContext();
            var mockStorage = new Mock<IStorageService>();
            var mockLookup = new Mock<ITourProjectLookupService>();
            var controller = new TourImportController(context, mockStorage.Object, mockLookup.Object);

            string filePath = @"C:\Users\ecele\Downloads\Orta Avrupa BVP_PVB16082026_rooming.xlsx";
            if (!File.Exists(filePath))
            {
                Assert.Fail("File does not exist: " + filePath);
                return;
            }

            using var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            var memoryStream = new MemoryStream();
            await stream.CopyToAsync(memoryStream);
            memoryStream.Position = 0;
            var fileMock = new FormFile(memoryStream, 0, memoryStream.Length, "roomingFile", Path.GetFileName(filePath));

            var actionResult = await controller.Import(roomingFile: fileMock);
            var okResult = Assert.IsType<OkObjectResult>(actionResult);

            var tour = await context.Tours.Include(t => t.Passengers).FirstOrDefaultAsync();
            Assert.NotNull(tour);
            Assert.Equal("PVB16082026", tour.TourCode);
            Assert.Equal(46, tour.Pax);
            Assert.Equal(40, tour.Adults);
            Assert.Equal(6, tour.Children);
            Assert.Equal(0, tour.Infants);
            Assert.Equal(46, tour.Passengers?.Count);
            
            int childCount = tour.Passengers?.Count(p => p.PaxType == "Children") ?? 0;
            Assert.Equal(6, childCount);
        }

        [Fact]
        public async Task Test_Import_RejectsRooming_WhenBothDoBAndPaxTypeBlank()
        {
            var context = GetInMemoryDbContext();
            var mockStorage = new Mock<IStorageService>();
            var mockLookup = new Mock<ITourProjectLookupService>();
            var controller = new TourImportController(context, mockStorage.Object, mockLookup.Object);

            using var wb = new ClosedXML.Excel.XLWorkbook();
            var ws = wb.Worksheets.Add("Rooming");
            ws.Cell(1, 1).Value = "BookingRef";
            ws.Cell(1, 2).Value = "FirstName";
            ws.Cell(1, 3).Value = "LastName";
            ws.Cell(1, 4).Value = "DateOfBirth";
            ws.Cell(1, 5).Value = "PaxType";

            // Row 2: Valid passenger with DoB
            ws.Cell(2, 1).Value = "BK-001";
            ws.Cell(2, 2).Value = "Alice";
            ws.Cell(2, 3).Value = "Smith";
            ws.Cell(2, 4).Value = "15.03.1990";
            ws.Cell(2, 5).Value = "";

            // Row 3: Invalid passenger: BOTH DoB and PaxType are BLANK!
            ws.Cell(3, 1).Value = "BK-002";
            ws.Cell(3, 2).Value = "Bob";
            ws.Cell(3, 3).Value = "Jones";
            ws.Cell(3, 4).Value = "";
            ws.Cell(3, 5).Value = "";

            using var ms = new MemoryStream();
            wb.SaveAs(ms);
            ms.Position = 0;

            var fileMock = new FormFile(ms, 0, ms.Length, "roomingFile", "Orta_Avrupa_BVP_TESTBLANK_rooming.xlsx");

            var actionResult = await controller.Import(roomingFile: fileMock);
            var badRequest = Assert.IsType<BadRequestObjectResult>(actionResult);

            string json = System.Text.Json.JsonSerializer.Serialize(badRequest.Value);
            Assert.Contains("Both DoB and PaxType fields are blank please fill one at least of them", json);

            // Verify NO data was imported into the database
            Assert.Empty(context.Tours);
            Assert.Empty(context.Passengers);
        }
    }
}
