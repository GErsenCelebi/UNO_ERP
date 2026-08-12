using Microsoft.Playwright;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace Uno_E2E_Tests
{
    public class TourCalendarE2ETests : IAsyncLifetime
    {
        private IPlaywright _playwright;
        private IBrowser _browser;
        private IPage Page;
        private readonly HttpClient _http = new();
        private static readonly string API = "http://127.0.0.1:8001/api";

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
        public async Task Test_TourCalendar_WithGuideConflict_ShowsConflict()
        {
            // 1. Setup Backend Data
            // Create Client
            var clientPayload = new { name = $"Cal Client {Guid.NewGuid().ToString()[..6]}", location = "Paris" };
            var clientRes = await _http.PostAsync($"{API}/clients",
                new StringContent(JsonSerializer.Serialize(clientPayload), Encoding.UTF8, "application/json"));
            clientRes.EnsureSuccessStatusCode();
            int clientId = JsonDocument.Parse(await clientRes.Content.ReadAsStringAsync())
                .RootElement.GetProperty("id").GetInt32();

            // Create Project
            var projectPayload = new
            {
                projectCode = $"CAL-{Guid.NewGuid().ToString()[..4]}",
                clientId = clientId,
                startDate = "2025-01-01",
                endDate = "2025-12-31",
                description = "Calendar Test Project",
                approxBudget = 100000
            };
            var projRes = await _http.PostAsync($"{API}/projects",
                new StringContent(JsonSerializer.Serialize(projectPayload), Encoding.UTF8, "application/json"));
            projRes.EnsureSuccessStatusCode();
            int projectId = JsonDocument.Parse(await projRes.Content.ReadAsStringAsync())
                .RootElement.GetProperty("id").GetInt32();

            // Create Guide
            var guidePayload = new { name = $"Guide {Guid.NewGuid().ToString()[..4]}", language = "FR", dailyRate = 200 };
            var guideRes = await _http.PostAsync($"{API}/guides",
                new StringContent(JsonSerializer.Serialize(guidePayload), Encoding.UTF8, "application/json"));
            guideRes.EnsureSuccessStatusCode();
            int guideId = JsonDocument.Parse(await guideRes.Content.ReadAsStringAsync())
                .RootElement.GetProperty("id").GetInt32();

            // Create Tour 1
            var tour1Payload = new
            {
                projectId = projectId,
                tourCode = $"T1-{Guid.NewGuid().ToString()[..4]}",
                arrivalDate = "2026-07-12",
                endDate = "2026-07-17",
                pax = 20,
                destination = "Paris"
            };
            var t1Res = await _http.PostAsync($"{API}/tours",
                new StringContent(JsonSerializer.Serialize(tour1Payload), Encoding.UTF8, "application/json"));
            t1Res.EnsureSuccessStatusCode();
            int tour1Id = JsonDocument.Parse(await t1Res.Content.ReadAsStringAsync())
                .RootElement.GetProperty("id").GetInt32();

            // Create Tour 2 (Overlapping)
            var tour2Payload = new
            {
                projectId = projectId,
                tourCode = $"T2-{Guid.NewGuid().ToString()[..4]}",
                arrivalDate = "2026-07-14",
                endDate = "2026-07-20",
                pax = 15,
                destination = "Lyon"
            };
            var t2Res = await _http.PostAsync($"{API}/tours",
                new StringContent(JsonSerializer.Serialize(tour2Payload), Encoding.UTF8, "application/json"));
            t2Res.EnsureSuccessStatusCode();
            int tour2Id = JsonDocument.Parse(await t2Res.Content.ReadAsStringAsync())
                .RootElement.GetProperty("id").GetInt32();

            // Assign Guide to Tour 1
            var ts1Payload = new { tourId = tour1Id, serviceCategoryId = 4, guideId = guideId, name = "Guide Services T1" };
            var ts1Res = await _http.PostAsync($"{API}/tourservices",
                new StringContent(JsonSerializer.Serialize(ts1Payload), Encoding.UTF8, "application/json"));
            ts1Res.EnsureSuccessStatusCode();

            // Assign Guide to Tour 2
            var ts2Payload = new { tourId = tour2Id, serviceCategoryId = 4, guideId = guideId, name = "Guide Services T2" };
            var ts2Res = await _http.PostAsync($"{API}/tourservices",
                new StringContent(JsonSerializer.Serialize(ts2Payload), Encoding.UTF8, "application/json"));
            ts2Res.EnsureSuccessStatusCode();

            // 2. Perform E2E UI Test
            await Page.GotoAsync("http://127.0.0.1:8000/tour-calendar");

            try 
            {
                // Click the "Guides" dropdown button
                await Page.Locator("button:has-text('Guides')").ClickAsync();
                
                // Click the specific guide option
                await Page.Locator($"text={guidePayload.name}").First.ClickAsync();

                // Assert the calendar loads both tours
                await Assertions.Expect(Page.Locator($"text={tour1Payload.destination}").First).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions { Timeout = 10000 });
                await Assertions.Expect(Page.Locator($"text={tour2Payload.destination}").First).ToBeVisibleAsync();

                // 3. Routing Regression Verification
                // Click on the Tour 1 card to navigate to its details page
                await Page.Locator($"text={tour1Payload.destination}").First.ClickAsync();
                
                // Assert no 404 is present and the correct page loaded
                await Page.WaitForURLAsync($"**/projects/0/tours/{tour1Id}");
                await Assertions.Expect(Page.Locator("text=This page could not be found")).Not.ToBeVisibleAsync();
                
                // Assert the destination page successfully fetched and rendered the tour
                await Assertions.Expect(Page.Locator($"h1:has-text('{tour1Payload.tourCode}')")).ToBeVisibleAsync();
            }
            catch (Exception ex)
            {
                await Page.ScreenshotAsync(new PageScreenshotOptions { Path = "error_screenshot.png" });
                throw;
            }
        }
    }
}
