# Best Practices (Successes to Repeat)
Unless the opposite specification given use REST APIs for each entity defined in the docs. Follow the structure below
In case Admin site is required use React-Admin by default.

src/
├── api/          # API client instances (e.g., axiosConfig.ts)
├── components/   # Reusable UI components
├── features/     # Feature-based modules (e.g., users, todos)
│   ├── components/
│   ├── services/ # API calls specific to this feature
│   ├── types/    # TypeScript interfaces (Domain/DTO)
│   └── hooks/    # Custom hooks (e.g., useUsers.ts)
├── hooks/        # Global hooks
├── types/        # Global types
└── utils/        # Utility functions

## MSBuild and IIS Deployment Rules
- **ASP.NET Core SPA Deployments**: To prevent `MSB4006` circular dependency and missing files during WebDeploy with a Next.js/React SPA:
  1. Add `<StaticWebAssetsEnabled>false</StaticWebAssetsEnabled>`.
  2. Map npm build to a single `BeforeBuild;ComputeFilesToPublish` target.
  3. Ensure it runs once via `<SpaHasBuilt>true</SpaHasBuilt>`.
  4. Manually refresh MSBuild content via `<Content Include="wwwroot\**" CopyToPublishDirectory="PreserveNewest" />`.
- **IIS Shared Hosting (WebDeploy)**: 
  1. Set `<AllowUntrustedCertificate>true</AllowUntrustedCertificate>` in `.pubxml` to avoid silent validation failures.
  2. Set `<DeployIisAppPath>site_name</DeployIisAppPath>` exactly to the site root; NEVER append `/wwwroot` to avoid nested subdirectories.
