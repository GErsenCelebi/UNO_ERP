using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Threading.Tasks;
using Uno_API.Controllers;
using Uno_API.Data;
using Xunit;

namespace Uno_API.Tests.Controllers
{
    public class ExcelImportControllerTests
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
        public async Task Test_PBI13_UploadTours_NullFile_ReturnsBadRequest()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new ExcelImportController(context);

            // Act
            var result = await controller.UploadTours(null!);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("No file uploaded.", badRequest.Value);
        }

        [Fact]
        [Trait("Suite", "CurrentSprintApi")]
        public async Task Test_PBI13_UploadTours_EmptyFile_ReturnsBadRequest()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new ExcelImportController(context);
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.Length).Returns(0);

            // Act
            var result = await controller.UploadTours(fileMock.Object);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("No file uploaded.", badRequest.Value);
        }
    }
}
