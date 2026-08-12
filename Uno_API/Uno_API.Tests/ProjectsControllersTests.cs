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
            var controller = new ProjectsController(context);

            var result = await controller.GetProjects();
            Assert.Empty(result.Value);
        }

        [Fact]
        [Trait("Suite", "ApiRegression")]
        public async Task Test_PBI11_PostProject_ReturnsSuccess()
        {
            var context = GetInMemoryDbContext();
            var controller = new ProjectsController(context);
            var project = new Project { ProjectCode = "P001", Description = "Test Project" };

            var result = await controller.PostProject(project);

            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedProj = Assert.IsType<Project>(actionResult.Value);
            Assert.Equal("P001", returnedProj.ProjectCode);
            Assert.Single(context.Projects);
        }
    }
}
