using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Uno_API.Controllers;
using Uno_API.Data;
using Uno_API.Models;
using Xunit;

namespace Uno_API.Tests.Controllers
{
    public class TourStatusesControllerTests
    {
        private UnoDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<UnoDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new UnoDbContext(options);
        }

        [Fact]
        [Trait("Suite", "ApiRegression")]
        public async Task Test_PBI12_GetTourStatuses_ReturnsOrderedList()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            context.TourStatuses.AddRange(
                new TourStatus { Id = 1, Name = "Completed", OrderIndex = 2 },
                new TourStatus { Id = 2, Name = "Planning", OrderIndex = 1 }
            );
            await context.SaveChangesAsync();

            var controller = new TourStatusesController(context);

            // Act
            var result = await controller.GetTourStatuses();

            // Assert
            var list = Assert.IsAssignableFrom<IEnumerable<TourStatus>>(result.Value);
            Assert.Equal(2, list.Count());
            Assert.Equal("Planning", list.First().Name);
        }

        [Fact]
        [Trait("Suite", "CurrentSprintApi")]
        public async Task Test_PBI12_PostTourStatus_ReturnsCreatedAt()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new TourStatusesController(context);
            var status = new TourStatus { Name = "Draft", OrderIndex = 0 };

            // Act
            var result = await controller.PostTourStatus(status);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var created = Assert.IsType<TourStatus>(actionResult.Value);
            Assert.Equal("Draft", created.Name);
            Assert.Single(context.TourStatuses);
        }

        [Fact]
        [Trait("Suite", "CurrentSprintApi")]
        public async Task Test_TourStatuses_WhenEmpty_AutoSeedsDefaultStatuses()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new TourStatusesController(context);

            // Act
            var result = await controller.GetTourStatuses();

            // Assert
            var list = Assert.IsAssignableFrom<IEnumerable<TourStatus>>(result.Value);
            Assert.Equal(6, list.Count());
            Assert.Contains(list, s => s.Name == "Draft");
            Assert.Contains(list, s => s.Name == "Proposal");
            Assert.Contains(list, s => s.Name == "Confirmed");
            Assert.Contains(list, s => s.Name == "In Progress");
            Assert.Contains(list, s => s.Name == "Completed");
            Assert.Contains(list, s => s.Name == "Cancelled");
        }

        [Fact]
        [Trait("Suite", "CurrentSprintApi")]
        public async Task Test_ProjectStatuses_WhenEmpty_AutoSeedsDefaultStatuses()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new ProjectStatusesController(context);

            // Act
            var result = await controller.GetProjectStatuses();

            // Assert
            var list = Assert.IsAssignableFrom<IEnumerable<ProjectStatus>>(result.Value);
            Assert.Equal(6, list.Count());
            Assert.Contains(list, s => s.Name == "Draft");
            Assert.Contains(list, s => s.Name == "Planning");
            Assert.Contains(list, s => s.Name == "Active");
            Assert.Contains(list, s => s.Name == "On Hold");
            Assert.Contains(list, s => s.Name == "Completed");
            Assert.Contains(list, s => s.Name == "Cancelled");
        }
    }
}
