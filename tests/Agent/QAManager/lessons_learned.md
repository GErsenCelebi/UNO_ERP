# Lessons Learned (Failures to Avoid)
- No critical testing failures recorded yet.

- Ensure API E2E tests are compatible with the selected TestFramework (e.g. mix of xUnit and NUnit requires proper test adapter configurations).
- If Playwright browsers fail to download due to SSL issues, try using NODE_OPTIONS='--use-system-ca'.
