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
    public class TourServiceTests : PageTest
    {
        private static readonly string API = "http://127.0.0.1:8001/api";
        private static readonly string FRONTEND = "http://127.0.0.1:8000";
        private readonly HttpClient _http = new();

        private int _clientId;
        private int _projectId;
        private int _tourId;
        private int _hotelId;
        private string _hotelName = "";

        [SetUp]
        public async Task SetupTestData()
        {
            // Create Client
            var clientPayload = new { name = $"Svc Client {Guid.NewGuid().ToString()[..6]}", location = "Berlin" };
            var clientRes = await _http.PostAsync($"{API}/clients",
                new StringContent(JsonSerializer.Serialize(clientPayload), Encoding.UTF8, "application/json"));
            clientRes.EnsureSuccessStatusCode();
            _clientId = JsonDocument.Parse(await clientRes.Content.ReadAsStringAsync())
                .RootElement.GetProperty("id").GetInt32();

            // Create Project
            var projectPayload = new
            {
                projectCode = $"SVC-{Guid.NewGuid().ToString()[..4]}",
                clientId = _clientId,
                startDate = "2025-01-01",
                endDate = "2025-12-31",
                description = "Service Test Project",
                approxBudget = 100000
            };
            var projRes = await _http.PostAsync($"{API}/projects",
                new StringContent(JsonSerializer.Serialize(projectPayload), Encoding.UTF8, "application/json"));
            projRes.EnsureSuccessStatusCode();
            _projectId = JsonDocument.Parse(await projRes.Content.ReadAsStringAsync())
                .RootElement.GetProperty("id").GetInt32();

            // Create Tour
            var tourPayload = new
            {
                projectId = _projectId,
                tourCode = $"TR-{Guid.NewGuid().ToString()[..4]}",
                destination = "Rome",
                arrivalDate = "2025-05-10",
                endDate = "2025-05-15",
                pax = 20,
                tourStatusId = 1
            };
            var tourRes = await _http.PostAsync($"{API}/tours",
                new StringContent(JsonSerializer.Serialize(tourPayload), Encoding.UTF8, "application/json"));
            tourRes.EnsureSuccessStatusCode();
            _tourId = JsonDocument.Parse(await tourRes.Content.ReadAsStringAsync())
                .RootElement.GetProperty("id").GetInt32();

            // Create Hotel via master data API
            _hotelName = $"Test Hotel {Guid.NewGuid().ToString()[..6]}";
            var hotelPayload = new
            {
                name = _hotelName,
                location = "Rome",
                starRating = 4,
                contactInfo = "hotel@test.com",
                nightlyRate = 120.00
            };
            var hotelRes = await _http.PostAsync($"{API}/hotels",
                new StringContent(JsonSerializer.Serialize(hotelPayload), Encoding.UTF8, "application/json"));
            hotelRes.EnsureSuccessStatusCode();
            _hotelId = JsonDocument.Parse(await hotelRes.Content.ReadAsStringAsync())
                .RootElement.GetProperty("id").GetInt32();
        }

        [Test]
        public async Task ShouldLoadTourDetailPageWithServicesTabs()
        {
            // Navigate to tour detail page
            await Page.GotoAsync($"{FRONTEND}/projects/{_projectId}/tours/{_tourId}");
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Wait for the loading spinner to disappear and content to render
            await Page.WaitForSelectorAsync("h2:has-text('Tour Information')", new() { Timeout = 15000 });

            // Verify Tour Info tab is visible by default
            await Expect(Page.Locator("h2:has-text('Tour Information')")).ToBeVisibleAsync();

            // Verify tabs: Tour Info, Services, Bookings
            await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Tour Info" })).ToBeVisibleAsync();
            await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Services" })).ToBeVisibleAsync();
            await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Bookings" })).ToBeVisibleAsync();
        }

        [Test]
        public async Task ShouldNavigateToServicesTabAndSeeEmptyState()
        {
            // Navigate to tour detail page
            await Page.GotoAsync($"{FRONTEND}/projects/{_projectId}/tours/{_tourId}");
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Wait for the page content to fully load
            await Page.WaitForSelectorAsync("h2:has-text('Tour Information')", new() { Timeout = 15000 });

            // Click the "Services" tab
            await Page.GetByRole(AriaRole.Button, new() { Name = "Services" }).ClickAsync();
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Verify the Base Services section is visible
            await Expect(Page.Locator("h3:has-text('Base Services')")).ToBeVisibleAsync();

            // Verify the Operational Services section is visible
            await Expect(Page.Locator("h3:has-text('Operational Services')")).ToBeVisibleAsync();

            // Verify empty state message
            await Expect(Page.Locator("text=No services yet")).ToBeVisibleAsync();
        }

        [Test]
        public async Task ShouldAddHotelServiceViaModal()
        {
            // Navigate to tour detail page
            await Page.GotoAsync($"{FRONTEND}/projects/{_projectId}/tours/{_tourId}");
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Wait for the page content to fully load
            await Page.WaitForSelectorAsync("h2:has-text('Tour Information')", new() { Timeout = 15000 });

            // Click the "Services" tab
            await Page.GetByRole(AriaRole.Button, new() { Name = "Services" }).ClickAsync();
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Click the "+ Hotel" button to open Add Service modal
            await Page.Locator("button:has-text('Hotel')").First.ClickAsync();

            // Verify the modal opens
            await Expect(Page.Locator("h2:has-text('Add Hotel Service')")).ToBeVisibleAsync();

            // Select the hotel from the dropdown — labels lack htmlFor, use select locator
            // The first <select> in the modal is "Select Hotel"
            var hotelSelect = Page.Locator("form select").First;
            await hotelSelect.SelectOptionAsync(new SelectOptionValue { Value = _hotelId.ToString() });

            // Wait a moment for the form to auto-populate price
            await Page.WaitForTimeoutAsync(300);

            // Set nights (quantity) — the first number input in the form with min=1
            // In the Hotel form, the order is: RoomType (select), Rooms (number), Nights (number), Rate (number)
            var nightsInput = Page.Locator("form input[type='number']").Nth(0);
            await nightsInput.FillAsync("5");

            // Submit the service
            await Page.GetByRole(AriaRole.Button, new() { Name = "Add Service" }).ClickAsync();
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Wait for the service table to update
            await Page.WaitForTimeoutAsync(500);

            // Verify the service now appears in the Base Services table
            // The hotel name should be in the description column
            await Expect(Page.Locator($"text={_hotelName}")).ToBeVisibleAsync();

            // Verify "Hotel" category badge appears
            await Expect(Page.Locator("text=Hotel").First).ToBeVisibleAsync();
        }

        [Test]
        public async Task ShouldAddServiceViaAPIAndVerifyOnPage()
        {
            // Create a service directly via API
            var servicePayload = new
            {
                tourId = _tourId,
                serviceCategoryId = 1, // First seeded category
                description = "API-Created Flight Service",
                quantity = 20,
                unitPrice = 350.00,
                totalAmount = 0 // Server calculates
            };
            var svcRes = await _http.PostAsync($"{API}/tourservices",
                new StringContent(JsonSerializer.Serialize(servicePayload), Encoding.UTF8, "application/json"));
            svcRes.EnsureSuccessStatusCode();

            // Navigate to tour detail page
            await Page.GotoAsync($"{FRONTEND}/projects/{_projectId}/tours/{_tourId}");
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Wait for the page content to fully load
            await Page.WaitForSelectorAsync("h2:has-text('Tour Information')", new() { Timeout = 15000 });

            // Click the "Services" tab
            await Page.GetByRole(AriaRole.Button, new() { Name = "Services" }).ClickAsync();
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Verify the API-created service is shown
            await Expect(Page.Locator("text=API-Created Flight Service")).ToBeVisibleAsync();
        }
    }
}
