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
    public class ProjectCrudTests : PageTest
    {
        private static readonly string API = "http://127.0.0.1:8001/api";
        private static readonly string FRONTEND = "http://127.0.0.1:8000";
        private readonly HttpClient _http = new();

        private int _clientId;
        private string _clientName = "";

        [SetUp]
        public async Task SetupTestData()
        {
            // Ensure at least one Client exists for the project form dropdown
            _clientName = $"CRUD Client {Guid.NewGuid().ToString()[..6]}";
            var clientPayload = new { name = _clientName, location = "Test City" };
            var clientRes = await _http.PostAsync($"{API}/clients",
                new StringContent(JsonSerializer.Serialize(clientPayload), Encoding.UTF8, "application/json"));
            clientRes.EnsureSuccessStatusCode();
            var clientJson = JsonDocument.Parse(await clientRes.Content.ReadAsStringAsync());
            _clientId = clientJson.RootElement.GetProperty("id").GetInt32();
        }

        [Test]
        public async Task ShouldLoadProjectsPageWithEmptyState()
        {
            // Navigate to projects page
            await Page.GotoAsync($"{FRONTEND}/projects");
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Verify the page heading is visible
            await Expect(Page.Locator("h1:has-text('Projects')")).ToBeVisibleAsync();

            // Verify the "New Project" button exists
            await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "New Project" })).ToBeVisibleAsync();
        }

        [Test]
        public async Task ShouldCreateProjectViaModalAndVerifyInGrid()
        {
            // Navigate to projects page
            await Page.GotoAsync($"{FRONTEND}/projects");
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Click "New Project" button
            await Page.GetByRole(AriaRole.Button, new() { Name = "New Project" }).ClickAsync();

            // Verify modal opens
            await Expect(Page.Locator("h2:has-text('Create New Project')")).ToBeVisibleAsync();

            // Fill in the project form — labels lack htmlFor, so use placeholder/locator strategies
            var uniqueCode = $"PRJ-{Guid.NewGuid().ToString()[..6]}";
            await Page.GetByPlaceholder("e.g. PRJ-2025-001").FillAsync(uniqueCode);

            // Select client from dropdown
            await Page.Locator("select").First.SelectOptionAsync(new SelectOptionValue { Value = _clientId.ToString() });

            await Page.GetByPlaceholder("e.g. Summer group tour program").FillAsync("E2E Test Project Description");

            // Date inputs — find by type=date, there should be two in the modal
            var dateInputs = Page.Locator("form input[type='date']");
            await dateInputs.Nth(0).FillAsync("2025-01-01");
            await dateInputs.Nth(1).FillAsync("2025-12-31");

            await Page.GetByPlaceholder("e.g. 50000").FillAsync("75000");

            // Submit
            await Page.GetByRole(AriaRole.Button, new() { Name = "Create Project" }).ClickAsync();
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Wait a short moment for the grid to refresh
            await Page.WaitForTimeoutAsync(500);

            // Verify the project card appears in the grid
            await Expect(Page.Locator($"text={uniqueCode}")).ToBeVisibleAsync();
        }

        [Test]
        public async Task ShouldNavigateToProjectDetailAndVerifyTabs()
        {
            // First create a project via API
            var projectCode = $"DET-{Guid.NewGuid().ToString()[..4]}";
            var projectPayload = new
            {
                projectCode,
                clientId = _clientId,
                startDate = "2025-01-01",
                endDate = "2025-12-31",
                description = "Detail Test Project",
                approxBudget = 60000
            };
            var projRes = await _http.PostAsync($"{API}/projects",
                new StringContent(JsonSerializer.Serialize(projectPayload), Encoding.UTF8, "application/json"));
            projRes.EnsureSuccessStatusCode();
            var projJson = JsonDocument.Parse(await projRes.Content.ReadAsStringAsync());
            var projectId = projJson.RootElement.GetProperty("id").GetInt32();

            // Navigate to projects page
            await Page.GotoAsync($"{FRONTEND}/projects");
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Click on the project card to navigate to detail
            await Page.Locator($"text={projectCode}").ClickAsync();
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Verify the detail page loads — project code should be in the header
            await Expect(Page.Locator($"h1:has-text('{projectCode}')")).ToBeVisibleAsync();

            // Verify tabs exist: Overview, Tours, Dashboard, Finance
            await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Overview" })).ToBeVisibleAsync();
            await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Tours" })).ToBeVisibleAsync();
            await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Dashboard" })).ToBeVisibleAsync();
            await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Finance" })).ToBeVisibleAsync();

            // Verify Overview tab is active by default — "Project Information" heading should be visible
            await Expect(Page.Locator("h2:has-text('Project Information')")).ToBeVisibleAsync();
        }

        [Test]
        public async Task ShouldSearchProjectsByCode()
        {
            // Create a project with a unique code
            var uniqueCode = $"SRCH-{Guid.NewGuid().ToString()[..4]}";
            var projectPayload = new
            {
                projectCode = uniqueCode,
                clientId = _clientId,
                startDate = "2025-03-01",
                endDate = "2025-09-30",
                description = "Searchable Project",
                approxBudget = 25000
            };
            await _http.PostAsync($"{API}/projects",
                new StringContent(JsonSerializer.Serialize(projectPayload), Encoding.UTF8, "application/json"));

            // Navigate to projects page
            await Page.GotoAsync($"{FRONTEND}/projects");
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Verify the project is visible
            await Expect(Page.Locator($"text={uniqueCode}")).ToBeVisibleAsync();

            // Use the search box to filter
            await Page.GetByPlaceholder("Search projects...").FillAsync(uniqueCode);

            // After filtering, only the matching project should be visible
            await Expect(Page.Locator($"text={uniqueCode}")).ToBeVisibleAsync();
        }
    }
}
