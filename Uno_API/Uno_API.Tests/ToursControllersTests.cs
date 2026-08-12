using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Uno_API.Controllers;
using Uno_API.Data;
using Uno_API.Models;
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
            var controller = new ToursController(context);

            var result = await controller.GetTours(null) as Microsoft.AspNetCore.Mvc.OkObjectResult;
            Assert.NotNull(result);
            var tours = result.Value as System.Collections.IEnumerable;
            Assert.Empty(tours);
        }

        [Fact]
        [Trait("Suite", "CurrentSprintApi")]
        public async Task Test_PBI12_PostTour_ReturnsSuccess()
        {
            var context = GetInMemoryDbContext();
            
            var proj = new Project { Id = 1, ClientId = 1, ProjectCode = "P1" };
            context.Projects.Add(proj);
            await context.SaveChangesAsync();

            var controller = new ToursController(context);
            var tour = new Tour { ProjectId = 1, Destination = "Sprint Tour", Pax = 20 };

            var result = await controller.PostTour(tour);

            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedTour = Assert.IsType<Tour>(actionResult.Value);
            Assert.Equal("Sprint Tour", returnedTour.Destination);
        }
    }
}
