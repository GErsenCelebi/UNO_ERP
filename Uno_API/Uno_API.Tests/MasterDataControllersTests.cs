using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Uno_API;
using Uno_API.Controllers;
using Uno_API.Data;
using Uno_API.Models;
using Xunit;

namespace Uno_API.Tests
{
    public class MasterDataControllersTests
    {
        private UnoDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<UnoDbContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            return new UnoDbContext(options);
        }

        [Fact]
        [Trait("Suite", "ApiRegression")]
        public async Task Test_PBI10_GetHotels_ReturnsEmpty()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new HotelsController(context);

            // Act
            var result = await controller.GetHotels();

            // Assert
            Assert.Empty(result.Value);
        }

        [Fact]
        [Trait("Suite", "ApiRegression")]
        public async Task Test_PBI10_PostHotel_ReturnsSuccess()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new HotelsController(context);
            var newHotel = new Hotel { Name = "Test Hotel", Location = "Test Location", StarRating = 4, Email = "info@testhotel.com" };

            // Act
            var result = await controller.PostHotel(newHotel);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var hotel = Assert.IsType<Hotel>(actionResult.Value);
            Assert.Equal("Test Hotel", hotel.Name);
            Assert.Single(context.Hotels);
        }

        [Fact]
        [Trait("Suite", "ApiRegression")]
        public async Task Test_PBI10_PostGuide_ReturnsSuccess()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new GuidesController(context);
            var newGuide = new Guide { Name = "John Doe", Language = "English", PhoneNumber = "123-456", DailyRate = 100 };

            // Act
            var result = await controller.PostGuide(newGuide);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.IsType<Guide>(actionResult.Value);
            Assert.Single(context.Guides);
        }

        [Fact]
        [Trait("Suite", "ApiRegression")]
        public async Task Test_PBI10_PostTransportCompany_ReturnsSuccess()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new TransportCompaniesController(context);
            var company = new TransportCompany { Name = "Quick Transport", FleetSize = 50 };

            // Act
            var result = await controller.PostTransportCompany(company);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.IsType<TransportCompany>(actionResult.Value);
            Assert.Single(context.TransportCompanies);
        }

        [Fact]
        [Trait("Suite", "ApiRegression")]
        public async Task Test_PBI10_PostDriver_ReturnsSuccess()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new DriversController(context);
            var driver = new Driver { Name = "Alice", PhoneNumber = "555-0100" };

            // Act
            var result = await controller.PostDriver(driver);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.IsType<Driver>(actionResult.Value);
            Assert.Single(context.Drivers);
        }

        [Fact]
        [Trait("Suite", "ApiRegression")]
        public async Task Test_PBI10_PostExcursion_ReturnsSuccess()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new ExcursionsController(context);
            var excursion = new Excursion { Name = "City Tour", Type = "Sightseeing", Price = 50 };

            // Act
            var result = await controller.PostExcursion(excursion);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.IsType<Excursion>(actionResult.Value);
            Assert.Single(context.Excursions);
        }
    }
}
