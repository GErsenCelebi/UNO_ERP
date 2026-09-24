# Best Practices (Successes to Repeat)
- No optimal practices recorded yet.

- For Next.js projects published to ASP.NET Core wwwroot, disable MSBuild StaticWebAssets to avoid MSB4006 circular dependencies or missing file errors. Ensure Single Execution Target in .csproj.
- E2E Testing with Next.js in dev mode: NEVER use wait Page.WaitForLoadStateAsync(LoadState.NetworkIdle);. The Webpack dev server keeps a WebSocket connection open, causing Playwright to timeout INFINITELY.
- Always verify the API port constant in test files carefully. A mismatch will cause setup steps to throw 404 Not Found.
- In MSBuild projects, MSBuild tasks (like StopUnoApiProcessesBeforeBuild) may maliciously kill your manually started dotnet run instances if you run dotnet build while an API is running! Run tests with --no-build if the API must stay up, or manage the lifecycle carefully.
- Ensure NODE_OPTIONS="--use-system-ca" when testing Next.js on Windows with locally generated dev certificates to avoid etch failed (unable to get local issuer certificate) errors during SSR!

- E2E Testing / Local Dev with Next.js: Ensure 
ext.config.js has a ewrites() function configured to proxy /api/* routes to the ASP.NET Core API backend (e.g. 127.0.0.1:8001). If this is missing, frontend components utilizing client-side fetches to /api will receive 404s, leading to empty dropdowns or silent UI failures that will cause timeouts in Playwright locators.

- Click-through routing verification: Always mandate 'Click-through routing verification' as a standard part of all future UI E2E tests to catch dead links, regression in dynamic routing (e.g. Next.js App Router changes), and 404s. Verifying a button/link is present is not enough; E2E tests must explicitly click the element, await the target URL, and assert that the destination page successfully fetched and rendered its primary content (and explicitly assert that no 404 fallback is displayed).
