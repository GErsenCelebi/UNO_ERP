using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Uno_API.Controllers;
using Uno_API.Data;
using Uno_API.Models;
using Uno_API.Services;
using Xunit;

namespace Uno_API.Tests
{
    public class ToursControllersTests
    {
        private UnoDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<UnoDbContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            return new UnoDbContext(options);
        }

        [Fact]
        [Trait("Suite", "CurrentSprintApi")]
        public async Task Test_PBI12_GetTours_ReturnsEmpty()
        {
            var context = GetInMemoryDbContext();
            var mockStorage = new Mock<IStorageService>();
            var controller = new ToursController(context, mockStorage.Object);

            var result = await controller.GetTours(null) as OkObjectResult;
            Assert.NotNull(result);
            var tours = Assert.IsAssignableFrom<IEnumerable>(result.Value);
            Assert.Empty(tours);
        }

        [Fact]
        [Trait("Suite", "CurrentSprintApi")]
        public async Task Test_PBI12_PostTour_ReturnsSuccess()
        {
            var context = GetInMemoryDbContext();
            var mockStorage = new Mock<IStorageService>();
            
            var proj = new Project { Id = 1, ClientId = 1, ProjectCode = "P1" };
            context.Projects.Add(proj);
            await context.SaveChangesAsync();

            var controller = new ToursController(context, mockStorage.Object);
            var tour = new Tour { ProjectId = 1, TourCode = "T001", Destination = "Sprint Tour", Pax = 20 };

            var result = await controller.PostTour(tour);

            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedTour = Assert.IsType<Tour>(actionResult.Value);
            Assert.Equal("Sprint Tour", returnedTour.Destination);
            mockStorage.Verify(s => s.EnsureTourFolders("P1", "T001"), Times.Once);
        }

        [Fact]
        [Trait("Suite", "ApiRegression")]
        public async Task Test_PBI12_GetTourById_NotFound_Returns404()
        {
            var context = GetInMemoryDbContext();
            var mockStorage = new Mock<IStorageService>();
            var controller = new ToursController(context, mockStorage.Object);

            var result = await controller.GetTour(999);

            Assert.IsType<NotFoundResult>(result.Result);
        }
    }
}
