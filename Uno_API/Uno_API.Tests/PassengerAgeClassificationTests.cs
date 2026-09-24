using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Uno_API.Controllers;
using Uno_API.Data;
using Uno_API.Models;
using Uno_API.Services;
using Xunit;

namespace Uno_API.Tests
{
    public class PassengerAgeClassificationTests
    {
        private UnoDbContext GetInMemoryDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<UnoDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;
            return new UnoDbContext(options);
        }

        [Fact]
        public void CalculateAge_ExactCalendarBoundaries_CalculatesAccurately()
        {
            var arrivalDate = new DateTime(2026, 9, 17);

            // Exactly 12 years old on arrival date (born 2014-09-17)
            int ageExact12 = PassengerAgeHelper.CalculateAge(new DateTime(2014, 9, 17), arrivalDate);
            Assert.Equal(12, ageExact12);

            // One day before 12th birthday (born 2014-09-18) -> Age is 11
            int age11 = PassengerAgeHelper.CalculateAge(new DateTime(2014, 9, 18), arrivalDate);
            Assert.Equal(11, age11);

            // One day after 12th birthday (born 2014-09-16) -> Age is 12
            int ageOver12 = PassengerAgeHelper.CalculateAge(new DateTime(2014, 9, 16), arrivalDate);
            Assert.Equal(12, ageOver12);

            // 15 years old (born 2011-09-17) -> Age is 15
            int age15 = PassengerAgeHelper.CalculateAge(new DateTime(2011, 9, 17), arrivalDate);
            Assert.Equal(15, age15);
        }

        [Fact]
        public void IsChild_TwelveYearThreshold_ClassifiesCorrectly()
        {
            var arrivalDate = new DateTime(2026, 9, 17);

            // 11 years old -> IsChild is TRUE
            bool child11 = PassengerAgeHelper.IsChild(new DateTime(2014, 9, 18), null, arrivalDate);
            Assert.True(child11);

            // Exactly 12 years old -> IsChild is FALSE (Adult)
            bool adult12 = PassengerAgeHelper.IsChild(new DateTime(2014, 9, 17), null, arrivalDate);
            Assert.False(adult12);

            // 15 years old (previously child under legacy 18 rule) -> IsChild is now FALSE (Adult)
            bool adult15 = PassengerAgeHelper.IsChild(new DateTime(2011, 5, 20), null, arrivalDate);
            Assert.False(adult15);

            // Fallback when no DOB: check paxType keywords
            Assert.True(PassengerAgeHelper.IsChild(null, "Children", arrivalDate));
            Assert.True(PassengerAgeHelper.IsChild(null, "CHD", arrivalDate));
            Assert.True(PassengerAgeHelper.IsChild(null, "Çocuk", arrivalDate));
            Assert.False(PassengerAgeHelper.IsChild(null, "Adult", arrivalDate));
        }

        [Fact]
        public void DeterminePaxType_ReturnsCorrectClassification()
        {
            var arrivalDate = new DateTime(2026, 9, 17);

            Assert.Equal("Children", PassengerAgeHelper.DeterminePaxType(new DateTime(2017, 3, 10), null, arrivalDate)); // 9 yrs
            Assert.Equal("Children", PassengerAgeHelper.DeterminePaxType(new DateTime(2014, 9, 18), null, arrivalDate)); // 11 yrs 364 days
            Assert.Equal("Adult", PassengerAgeHelper.DeterminePaxType(new DateTime(2014, 9, 17), null, arrivalDate));    // 12 yrs 0 days
            Assert.Equal("Adult", PassengerAgeHelper.DeterminePaxType(new DateTime(2010, 1, 1), null, arrivalDate));     // 16 yrs
            Assert.Equal("Infant", PassengerAgeHelper.DeterminePaxType(new DateTime(2025, 12, 1), null, arrivalDate));   // < 2 yrs
        }

        [Fact]
        public async Task PassengersController_RecalculatesTourPax_WithTwelveYearCriteria()
        {
            var db = GetInMemoryDbContext("Test_TwelveYear_Recalculate");
            var tour = new Tour
            {
                Id = 1,
                TourCode = "TR-AGE-12",
                Destination = "Central Europe",
                ArrivalDate = new DateTime(2026, 9, 17),
                EndDate = new DateTime(2026, 9, 24),
                BaseFee = 400m
            };
            db.Tours.Add(tour);
            await db.SaveChangesAsync();

            var controller = new PassengersController(db);

            // Passenger 1: Adult (born 1990-01-01, age 36)
            await controller.CreatePassenger(new Passenger
            {
                TourId = 1,
                FirstName = "John",
                LastName = "Doe",
                DateOfBirth = new DateTime(1990, 1, 1),
                Pax = 1
            });

            // Passenger 2: Teenager (born 2012-05-10, age 14 -> must be Adult, NOT Children!)
            await controller.CreatePassenger(new Passenger
            {
                TourId = 1,
                FirstName = "Timmy",
                LastName = "Doe",
                DateOfBirth = new DateTime(2012, 5, 10),
                Pax = 1
            });

            // Passenger 3: Child (born 2016-08-15, age 10 -> must be Children)
            await controller.CreatePassenger(new Passenger
            {
                TourId = 1,
                FirstName = "Lily",
                LastName = "Doe",
                DateOfBirth = new DateTime(2016, 8, 15),
                Pax = 1
            });

            var updatedTour = await db.Tours.FindAsync(1);
            Assert.NotNull(updatedTour);
            Assert.Equal(2, updatedTour.Adults);   // John (36) + Timmy (14)
            Assert.Equal(1, updatedTour.Children); // Lily (10)
            Assert.Equal(3, updatedTour.Pax);

            // TotalFee = (2 * 400) + (1 * 400 * 0.5) = 800 + 200 = 1000
            Assert.Equal(1000m, updatedTour.TotalFee);
        }

        [Fact]
        public async Task ToursController_DownloadSalesTemplate_AppendsChdOnlyForUnderTwelve()
        {
            var db = GetInMemoryDbContext("Test_TwelveYear_SalesTemplate");
            
            var project = new Project { Id = 10, ProjectCode = "PRJ-TEST", ClientId = 1 };
            db.Projects.Add(project);

            var tour = new Tour
            {
                Id = 2,
                ProjectId = 10,
                TourCode = "TR-SALES-12",
                Destination = "Prague",
                ArrivalDate = new DateTime(2026, 9, 17),
                EndDate = new DateTime(2026, 9, 24)
            };
            db.Tours.Add(tour);

            // Passenger A: 14 years old (Adult)
            db.Passengers.Add(new Passenger
            {
                TourId = 2,
                FirstName = "Mark",
                LastName = "Teen",
                DateOfBirth = new DateTime(2012, 1, 1)
            });

            // Passenger B: 10 years old (Children)
            db.Passengers.Add(new Passenger
            {
                TourId = 2,
                FirstName = "Leo",
                LastName = "Kid",
                DateOfBirth = new DateTime(2016, 1, 1)
            });

            await db.SaveChangesAsync();

            var mockStorage = new Mock<IStorageService>();
            var controller = new ToursController(db, mockStorage.Object);

            var actionResult = await controller.DownloadSalesTemplate(2);
            var fileResult = Assert.IsType<FileContentResult>(actionResult);
            Assert.NotNull(fileResult.FileContents);

            using var ms = new MemoryStream(fileResult.FileContents);
            using var workbook = new XLWorkbook(ms);
            var worksheet = workbook.Worksheet(1);

            // Row 5 is first passenger (Mark Teen) -> should NOT have (CHD)
            string p1Name = worksheet.Cell(5, 1).GetString();
            Assert.Equal("Mark Teen", p1Name);
            Assert.DoesNotContain("(CHD)", p1Name);

            // Row 6 is second passenger (Leo Kid) -> SHOULD have (CHD)
            string p2Name = worksheet.Cell(6, 1).GetString();
            Assert.Equal("Leo Kid (CHD)", p2Name);
            Assert.Contains("(CHD)", p2Name);
        }
    }
}
