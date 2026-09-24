# Frontend Lead Developer - Lessons Learned & Best Practices

## Architectural Decisions
1. **Separation of Concerns:** Features are kept in their own domain folders (`src/features/...`) to ensure Next.js `app` router stays clean and is only responsible for routing. For the `TourCalendar` module, `CalendarGrid`, `CalendarFilterSidebar`, `TourBlock`, and `TourQuickViewModal` were created within `src/features/tourCalendar`.
2. **Debouncing API Calls:** When filtering via search queries, it is vital to apply debouncing (e.g., using `setTimeout` inside a `useEffect` hook) to prevent flooding the backend with calls for every keystroke.
3. **Data Fetching:** Standardized mocking strategy for endpoints (`GET /api/TourCalendar`) that are pending from backend developers. A centralized `api.ts` handles the API calls so UI components remain agnostic to the mocking strategy.

## Deployment & Integration
1. **SPA in ASP.NET Core (`wwwroot`):**
   - Ensure `<StaticWebAssetsEnabled>false</StaticWebAssetsEnabled>` is in the `.csproj` file.
   - Use `BeforeBuild;ComputeFilesToPublish` to generate Next.js static files and copy them using MSBuild items (`<Content Remove="wwwroot\**" />` followed by `Include` and `CopyToPublishDirectory="PreserveNewest"`).
2. **Visual Studio Web Deploy to IIS:** Always append `<AllowUntrustedCertificate>true</AllowUntrustedCertificate>` to MSDeploy profiles to prevent silent validation errors. Also ensure that `<DeployIisAppPath>` does not unnecessarily contain `\wwwroot`.

## Component Design
1. **Calendar Grids:** Custom lightweight calendar grids can be more performant and easier to style with Tailwind compared to bulky full-calendar libraries. Using native `Date` functions (`getFullYear`, `getMonth`) alongside simple flex/grid structures achieves the required layout (Month View).
2. **Tour Blocks:** For rich data representation inside small grid squares, visual clues (e.g. `lucide-react` icons and distinct background colors) scale better than plain text when dealing with long schedules and conflict resolution (`[!]`).

*Updated: 2026-07-12*
