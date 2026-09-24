# Best Practices (Successes to Repeat)
Use the following projects as Best Practice template, Project Structure to start a new project.
C:\Ersen\Projects_2025\IstanbulApart2026
C:\Ersen\Projects_2025\PFD_Royalty
But try to optimize next projects as following structure where possible vith VS 2026:

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


## Deployment Best Practices
### SPA Deployment in ASP.NET Core (Next.js / React)
When dealing with a Node.js SPA that outputs static files directly to the `wwwroot` directory of an ASP.NET Core API project:
1. **Disable StaticWebAssets**: Add `<StaticWebAssetsEnabled>false</StaticWebAssetsEnabled>` to a PropertyGroup.
2. **Single Execution Target**: Create a single `BeforeBuild;ComputeFilesToPublish` target that runs the npm build script. Do NOT use `BeforePublish`.
3. **Prevent Double Build**: Use `<SpaHasBuilt>true</SpaHasBuilt>` property to run the script exactly once.
4. **Dynamic Item Refresh**: `Remove` and `Include` `wwwroot\**` with `CopyToPublishDirectory="PreserveNewest"`.

```xml
  <PropertyGroup>
    <StaticWebAssetsEnabled>false</StaticWebAssetsEnabled>
  </PropertyGroup>

  <Target Name="BuildSpaTarget" BeforeTargets="BeforeBuild;ComputeFilesToPublish" Condition="('$(BuildSpa)' == 'true') and '$(SpaHasBuilt)' != 'true' and Exists('$(SpaProjectDir)\package.json')">
    <Message Text="Building SPA for API..." Importance="high" />
    <Exec WorkingDirectory="$(SpaProjectDir)" Command="npm run build" />
    <PropertyGroup>
      <SpaHasBuilt>true</SpaHasBuilt>
    </PropertyGroup>
    <ItemGroup>
      <Content Remove="wwwroot\**" />
      <Content Remove="wwwroot\**\*" />
      <Content Include="wwwroot\**" CopyToPublishDirectory="PreserveNewest" />
    </ItemGroup>
  </Target>
```

### WebDeploy to IIS Shared Hosting
1. **Untrusted SSL Certificates**: Inject `<AllowUntrustedCertificate>true</AllowUntrustedCertificate>` into the `.pubxml` file.
2. **Site Root vs Virtual Directory Deployment**: Ensure the `<DeployIisAppPath>` points to the exact site root (e.g. `<DeployIisAppPath>site12345</DeployIisAppPath>`). Do **NOT** append `/wwwroot`.
