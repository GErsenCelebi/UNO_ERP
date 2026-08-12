using Microsoft.Playwright;
using System.Threading.Tasks;
using Xunit;

namespace Uno_E2E_Tests
{
    public class MasterDataTests : IAsyncLifetime
    {
        private IPlaywright _playwright;
        private IBrowser _browser;
        private IPage Page;

        public async Task InitializeAsync()
        {
            _playwright = await Playwright.CreateAsync();
            _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = true });
            Page = await _browser.NewPageAsync();
        }

        public async Task DisposeAsync()
        {
            await _browser.CloseAsync();
            _playwright.Dispose();
        }

        [Fact]
        [Trait("Suite", "UiRegression")]
        public async Task Test_PBI10_CreateHotel_ReturnsSuccess()
        {
            string uniqueHotelName = $"Automated Test Hotel {System.Guid.NewGuid().ToString().Substring(0, 8)}";

            await Page.GotoAsync("http://127.0.0.1:8000/master-data");

            await Page.GetByRole(AriaRole.Button, new() { NameString = "Tours Data" }).ClickAsync();
            await Page.GetByRole(AriaRole.Button, new() { NameString = "Hotels", Exact = true }).ClickAsync();

            // Click the 'Add Hotels' button
            await Page.GetByRole(AriaRole.Button, new() { Name = "Add Hotels" }).ClickAsync();

            // Fill out the hotel creation modal
            await Page.GetByLabel("Name").FillAsync(uniqueHotelName);
            await Page.GetByLabel("Location").FillAsync("Test Location");
            await Page.GetByLabel("Star Rating (1-5)").FillAsync("5");
            await Page.GetByLabel("Contact Info").FillAsync("12345");
            await Page.GetByLabel("Single Rate (€)").FillAsync("120");

            // Submit the form
            await Page.GetByRole(AriaRole.Button, new() { Name = "Create Record" }).ClickAsync();

            // Note: Since backend isn't up, this test might fail.
            // We will expect it to fail and output a bug report.
            await Assertions.Expect(Page.Locator($"text={uniqueHotelName}")).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions { Timeout = 3000 });
        }
    }
}
