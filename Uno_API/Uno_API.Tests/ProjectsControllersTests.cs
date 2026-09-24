using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections;
using System.Linq;
using System.Threading.Tasks;
using Uno_API.Controllers;
using Uno_API.Data;
using Uno_API.Models;
using Uno_API.Services;
using Xunit;

namespace Uno_API.Tests
{
    public class ProjectsControllersTests
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
        public async Task Test_PBI11_GetProjects_ReturnsEmpty()
        {
            var context = GetInMemoryDbContext();
            var mockStorage = new Mock<IStorageService>();
            var controller = new ProjectsController(context, mockStorage.Object);

            var result = await controller.GetProjects();
            var okResult = Assert.IsType<OkObjectResult>(result);
            var list = Assert.IsAssignableFrom<IEnumerable>(okResult.Value);
            Assert.Empty(list);
        }

        [Fact]
        [Trait("Suite", "ApiRegression")]
        public async Task Test_PBI11_PostProject_ReturnsSuccess()
        {
            var context = GetInMemoryDbContext();
            var mockStorage = new Mock<IStorageService>();
            var controller = new ProjectsController(context, mockStorage.Object);
            var project = new Project { ProjectCode = "P001", Description = "Test Project" };

            var result = await controller.PostProject(project);

            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedProj = Assert.IsType<Project>(actionResult.Value);
            Assert.Equal("P001", returnedProj.ProjectCode);
            Assert.Single(context.Projects);
        }

        [Fact]
        [Trait("Suite", "CurrentSprintApi")]
        public async Task Test_PBI11_PostProject_CreatesFolderViaStorageService()
        {
            var context = GetInMemoryDbContext();
            var mockStorage = new Mock<IStorageService>();
            var controller = new ProjectsController(context, mockStorage.Object);
            var project = new Project { ProjectCode = "P002", Description = "Storage Test Project" };

            var result = await controller.PostProject(project);

            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.NotNull(actionResult.Value);
            mockStorage.Verify(s => s.EnsureProjectFolder("P002"), Times.Once);
        }

        [Fact]
        [Trait("Suite", "ApiRegression")]
        public async Task Test_PBI11_GetProjectById_NotFound_Returns404()
        {
            var context = GetInMemoryDbContext();
            var mockStorage = new Mock<IStorageService>();
            var controller = new ProjectsController(context, mockStorage.Object);

            var result = await controller.GetProject(999);

            Assert.IsType<NotFoundResult>(result.Result);
        }
    }
}
