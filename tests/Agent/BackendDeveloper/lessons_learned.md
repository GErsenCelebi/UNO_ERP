# Lessons Learned

## Next.js / React SPA Integration with ASP.NET Core
When dealing with a Node.js SPA (like Next.js) built within an ASP.NET Core pipeline:
1. Building `ClientApp` using `npm run build` during `dotnet build` can dramatically increase local build times and hinder rapid backend iteration.
2. In scenarios where only the API needs to be compiled, explicitly omitting the SPA build target (e.g. `dotnet build /p:BuildUnoCrmOnBuild=false`) saves significant time.
3. Overriding `StaticWebAssetsEnabled` to `false` and managing the `wwwroot` items directly is essential to prevent MSBuild deployment errors.

## Tour Calendar Implementation
1. **Entity Framework Projections**: When returning a calendar schedule, it is important to include multiple complex nested lists (`TourServices`, `ServiceCategory`, `Guide`). Careful `Include()` and `ThenInclude()` usage combined with `AsNoTracking()` significantly improves read performance for read-only calendar endpoints.
2. **Conflict Detection**: Filtering out temporal overlaps requires verifying `TourA.ArrivalDate <= TourB.EndDate` and `TourA.EndDate >= TourB.ArrivalDate`. This calculation must account for the specific assigned resource (like a specific `Guide`).
3. **Role-Based Access Control (RBAC)**: In systems where explicit authentication middleware might not be configured, extracting Role and CurrentUserId from DTO filter requests allows clean testing. Managers should have unrestricted access, whereas assigned roles (e.g. Guide) must have their results pre-filtered by `CurrentUserId`.
4. **GitHub MCP Server**: Encountered network failures (`fetch failed`) when interacting with `search_issues` and `add_issue_comment`. Further network configuration or token injection might be necessary for the MCP tool to reach GitHub.
