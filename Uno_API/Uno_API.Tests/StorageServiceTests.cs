using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Uno_API.Services;
using Xunit;

namespace Uno_API.Tests
{
    public class StorageServiceTests
    {
        private StorageService CreateStorageService(string? customRoot = null)
        {
            var inMemorySettings = new Dictionary<string, string?>();
            if (!string.IsNullOrWhiteSpace(customRoot))
            {
                inMemorySettings["StorageSettings:RootPath"] = customRoot;
            }

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            return new StorageService(configuration);
        }

        [Theory]
        [Trait("Suite", "ApiRegression")]
        [InlineData("Project: 2026/Special*", "Project-2026-Special")]
        [InlineData("Tour? <Test> | #1", "Tour-Test-#1")]
        [InlineData("   Multiple   Spaces   ", "Multiple-Spaces")]
        [InlineData("", "Unnamed")]
        public void Test_PBI14_SanitizeFolderName_ProducesValidDirectoryName(string input, string expected)
        {
            var service = CreateStorageService();
            var sanitized = service.SanitizeFolderName(input);
            Assert.Equal(expected, sanitized);
        }

        [Fact]
        [Trait("Suite", "CurrentSprintApi")]
        public void Test_PBI14_EnsureTourFolders_CreatesRequiredSubdirectories()
        {
            var tempRoot = Path.Combine(Path.GetTempPath(), "UnoStorageTest_" + System.Guid.NewGuid().ToString("N"));
            try
            {
                var service = CreateStorageService(tempRoot);
                var (tourDir, importDir, invoiceDir) = service.EnsureTourFolders("PRJ-01", "TOUR-01");

                Assert.True(Directory.Exists(tourDir), "Tour directory should exist");
                Assert.True(Directory.Exists(importDir), "Import directory should exist");
                Assert.True(Directory.Exists(invoiceDir), "Invoice directory should exist");
            }
            finally
            {
                if (Directory.Exists(tempRoot))
                {
                    Directory.Delete(tempRoot, true);
                }
            }
        }

        [Fact]
        [Trait("Suite", "CurrentSprintApi")]
        public async Task Test_PBI14_SaveImportStreamAsync_WritesFileCorrectly()
        {
            var tempRoot = Path.Combine(Path.GetTempPath(), "UnoStorageTest_" + System.Guid.NewGuid().ToString("N"));
            try
            {
                var service = CreateStorageService(tempRoot);
                var content = "Col1,Col2\nVal1,Val2";
                using var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));

                var filePath = await service.SaveImportStreamAsync("PRJ-02", "TOUR-02", "data.csv", stream);

                Assert.True(File.Exists(filePath));
                var readContent = await File.ReadAllTextAsync(filePath);
                Assert.Equal(content, readContent);
            }
            finally
            {
                if (Directory.Exists(tempRoot))
                {
                    Directory.Delete(tempRoot, true);
                }
            }
        }
    }
}
