using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Uno_API.Controllers;
using Uno_API.Data;
using Uno_API.DTOs;
using Uno_API.Models;
using Xunit;

namespace Uno_API.Tests
{
    public class TourCalendarControllerTests
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
        public async Task GetCalendarEvents_ExactSameDayOverlap_SetsHasGuideConflictTrue()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            
            var guide = new Guide { Name = "Test Guide", Language = "EN" };
            context.Guides.Add(guide);
            await context.SaveChangesAsync();

            var proj = new Project { ClientId = 1, ProjectCode = "P1" };
            context.Projects.Add(proj);
            await context.SaveChangesAsync();

            var tour1 = new Tour
            {
                ProjectId = proj.Id,
                ArrivalDate = new DateTime(2025, 10, 10),
                EndDate = new DateTime(2025, 10, 15),
                TourServices = new List<TourService> { new TourService { GuideId = guide.Id } }
            };
            
            var tour2 = new Tour
            {
                ProjectId = proj.Id,
                ArrivalDate = new DateTime(2025, 10, 10),
                EndDate = new DateTime(2025, 10, 15),
                TourServices = new List<TourService> { new TourService { GuideId = guide.Id } }
            };

            context.Tours.Add(tour1);
            context.Tours.Add(tour2);
            await context.SaveChangesAsync();

            var controller = new TourCalendarController(context);
            var filter = new TourCalendarFilterRequest();

            // Act
            var actionResult = await controller.GetCalendarEvents(filter);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var dtos = Assert.IsAssignableFrom<IEnumerable<TourCalendarEventDTO>>(okResult.Value).ToList();
            
            Assert.Equal(2, dtos.Count);
            Assert.True(dtos.First(t => t.TourId == tour1.Id).HasGuideConflict);
            Assert.True(dtos.First(t => t.TourId == tour2.Id).HasGuideConflict);
        }

        [Fact]
        [Trait("Suite", "ApiRegression")]
        public async Task GetCalendarEvents_PartialOverlap_SetsHasGuideConflictTrue()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            
            var guide = new Guide { Id = 2, Name = "Test Guide 2", Language = "EN" };
            context.Guides.Add(guide);

            var tour1 = new Tour
            {
                Id = 3,
                ProjectId = 1,
                ArrivalDate = new DateTime(2025, 10, 10),
                EndDate = new DateTime(2025, 10, 15),
                TourServices = new List<TourService> { new TourService { Id = 3, GuideId = 2 } }
            };
            
            var tour2 = new Tour
            {
                Id = 4,
                ProjectId = 1,
                ArrivalDate = new DateTime(2025, 10, 14), // Overlaps on 14th and 15th
                EndDate = new DateTime(2025, 10, 20),
                TourServices = new List<TourService> { new TourService { Id = 4, GuideId = 2 } }
            };

            context.Tours.Add(tour1);
            context.Tours.Add(tour2);
            await context.SaveChangesAsync();

            var controller = new TourCalendarController(context);
            var filter = new TourCalendarFilterRequest();

            // Act
            var actionResult = await controller.GetCalendarEvents(filter);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var dtos = Assert.IsAssignableFrom<IEnumerable<TourCalendarEventDTO>>(okResult.Value).ToList();
            
            Assert.Equal(2, dtos.Count);
            Assert.True(dtos.First(t => t.TourId == 3).HasGuideConflict);
            Assert.True(dtos.First(t => t.TourId == 4).HasGuideConflict);
        }

        [Fact]
        [Trait("Suite", "ApiRegression")]
        public async Task GetCalendarEvents_NoOverlap_SetsHasGuideConflictFalse()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            
            var guide = new Guide { Id = 3, Name = "Test Guide 3", Language = "EN" };
            context.Guides.Add(guide);

            var tour1 = new Tour
            {
                Id = 5,
                ProjectId = 1,
                ArrivalDate = new DateTime(2025, 10, 10),
                EndDate = new DateTime(2025, 10, 15),
                TourServices = new List<TourService> { new TourService { Id = 5, GuideId = 3 } }
            };
            
            var tour2 = new Tour
            {
                Id = 6,
                ProjectId = 1,
                ArrivalDate = new DateTime(2025, 10, 16), // Starts after tour1 ends
                EndDate = new DateTime(2025, 10, 20),
                TourServices = new List<TourService> { new TourService { Id = 6, GuideId = 3 } }
            };

            context.Tours.Add(tour1);
            context.Tours.Add(tour2);
            await context.SaveChangesAsync();

            var controller = new TourCalendarController(context);
            var filter = new TourCalendarFilterRequest();

            // Act
            var actionResult = await controller.GetCalendarEvents(filter);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var dtos = Assert.IsAssignableFrom<IEnumerable<TourCalendarEventDTO>>(okResult.Value).ToList();
            
            Assert.Equal(2, dtos.Count);
            Assert.False(dtos.First(t => t.TourId == 5).HasGuideConflict);
            Assert.False(dtos.First(t => t.TourId == 6).HasGuideConflict);
        }
    }
}
