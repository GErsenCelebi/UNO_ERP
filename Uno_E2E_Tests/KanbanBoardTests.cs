using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Uno_E2E_Tests
{
    [NonParallelizable]
    [TestFixture]
    public class KanbanBoardTests : PageTest
    {
        private static readonly string API = "http://127.0.0.1:8001/api";
        private static readonly string FRONTEND = "http://127.0.0.1:8000";
        private readonly HttpClient _http = new();

        private int _clientId;
        private int _projectId;

        [SetUp]
        public async Task SetupTestData()
        {
            // Create a Client via API
            var clientPayload = new { name = $"Kanban Test Client {Guid.NewGuid().ToString()[..6]}", location = "Test City" };
            var clientRes = await _http.PostAsync($"{API}/clients",
                new StringContent(JsonSerializer.Serialize(clientPayload), Encoding.UTF8, "application/json"));
            clientRes.EnsureSuccessStatusCode();
            var clientJson = JsonDocument.Parse(await clientRes.Content.ReadAsStringAsync());
            _clientId = clientJson.RootElement.GetProperty("id").GetInt32();

            // Create a Project via API
            var projectPayload = new
            {
                projectCode = $"KAN-{Guid.NewGuid().ToString()[..4]}",
                clientId = _clientId,
                startDate = "2025-01-01",
                endDate = "2025-12-31",
                description = "Kanban Test Project",
                approxBudget = 50000
            };
            var projRes = await _http.PostAsync($"{API}/projects",
                new StringContent(JsonSerializer.Serialize(projectPayload), Encoding.UTF8, "application/json"));
            projRes.EnsureSuccessStatusCode();
            var projJson = JsonDocument.Parse(await projRes.Content.ReadAsStringAsync());
            _projectId = projJson.RootElement.GetProperty("id").GetInt32();
        }

        [Test]
        public async Task ShouldLoadTourKanbanColumnsOnProjectDetailPage()
        {
            // Navigate to Project detail page
            await Page.GotoAsync($"{FRONTEND}/projects/{_projectId}");


            // Click the "Tours" tab
            await Page.Locator("button:has-text('Tours')").ClickAsync();


            // Verify Kanban columns are loaded (seeded TourStatuses)
            // The tour statuses are seeded — check that at least one .kanban-column exists
            var columns = Page.Locator(".kanban-column");
            await Expect(columns.First).ToBeVisibleAsync();

            // Verify the "Tour Pipeline" heading is visible
            await Expect(Page.Locator("h2:has-text('Tour Pipeline')")).ToBeVisibleAsync();

            // Verify the "New Tour" button is present
            await Expect(Page.Locator("button:has-text('New Tour')")).ToBeVisibleAsync();
        }

        [Test]
        public async Task ShouldDisplayTourCardInKanbanAfterCreatingTour()
        {
            // Create a Tour via API
            var tourPayload = new
            {
                projectId = _projectId,
                tourCode = $"TOUR-{Guid.NewGuid().ToString()[..4]}",
                destination = "Paris",
                arrivalDate = "2025-06-01",
                endDate = "2025-06-07",
                pax = 25,
                tourStatusId = 1
            };
            var tourRes = await _http.PostAsync($"{API}/tours",
                new StringContent(JsonSerializer.Serialize(tourPayload), Encoding.UTF8, "application/json"));
            tourRes.EnsureSuccessStatusCode();
            var tourJson = JsonDocument.Parse(await tourRes.Content.ReadAsStringAsync());
            var tourCode = tourJson.RootElement.GetProperty("tourCode").GetString();

            // Navigate to Project detail page
            await Page.GotoAsync($"{FRONTEND}/projects/{_projectId}");


            // Click the "Tours" tab
            await Page.Locator("button:has-text('Tours')").ClickAsync();


            // Verify the tour card appears in the Kanban
            await Expect(Page.Locator($"text={tourCode}")).ToBeVisibleAsync();

            // Verify destination is shown
            await Expect(Page.Locator("text=Paris")).ToBeVisibleAsync();

            // Verify pax is shown
            await Expect(Page.Locator("text=25 Pax")).ToBeVisibleAsync();
        }

        [Test]
        public async Task ShouldCreateTourViaUIModal()
        {
            // Navigate to Project detail page
            await Page.GotoAsync($"{FRONTEND}/projects/{_projectId}");


            // Click the "Tours" tab
            await Page.Locator("button:has-text('Tours')").ClickAsync();


            // Click "New Tour" button
            await Page.Locator("button:has-text('New Tour')").ClickAsync();

            // Verify modal opens
            await Expect(Page.Locator("h2:has-text('Create New Tour')")).ToBeVisibleAsync();

            // Fill in the tour form — labels lack htmlFor, use placeholder-based locators
            var uniqueCode = $"UI-TR-{Guid.NewGuid().ToString()[..4]}";
            await Page.GetByPlaceholder("e.g. TR-001").FillAsync(uniqueCode);
            await Page.GetByPlaceholder("e.g. Istanbul").FillAsync("Istanbul");

            // Date inputs within the modal form
            var dateInputs = Page.Locator("form input[type='date']");
            await dateInputs.Nth(0).FillAsync("2025-07-01");
            await dateInputs.Nth(1).FillAsync("2025-07-10");

            // Pax input
            var paxInput = Page.Locator("form input[type='number']").First;
            await paxInput.FillAsync("30");

            // Submit
            await Page.Locator("button:has-text('Create Tour')").ClickAsync();


            // Verify the new tour card appears in Kanban
            await Expect(Page.Locator($"text={uniqueCode}")).ToBeVisibleAsync();
            await Expect(Page.Locator("text=Istanbul")).ToBeVisibleAsync();
            
            // Routing Regression Verification
            // Click the Kanban tour card to open tour details page
            await Page.Locator($"text={uniqueCode}").ClickAsync();
            
            // Verify URL changed to dynamic route
            await Page.WaitForURLAsync(new System.Text.RegularExpressions.Regex(".*\\/projects\\/\\d+\\/tours\\/\\d+"));
            
            // Assert 404 is NOT visible
            await Expect(Page.Locator("text=This page could not be found")).Not.ToBeVisibleAsync();
            
            // Assert the heading loaded on the details page
            await Expect(Page.Locator($"h1:has-text('{uniqueCode}')")).ToBeVisibleAsync();
        }
    }
}
