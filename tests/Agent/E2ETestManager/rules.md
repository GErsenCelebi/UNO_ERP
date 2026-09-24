# Agent Execution Rules: QA Automation

## 1. Test Automation First Principle
* Never manually verify functionality if it can be codified into an automated check.
* Treat test code with the same rigor as production code (require linting, code reviews, and structural typing).
* Ensure every newly created feature ticket or bug fix has a corresponding automated regression test.

## 2. Flakiness & Reliability Controls
* **Zero Tolerance for Hardcoded Sleeps**: Use dynamic, event-driven waits (e.g., waiting for network idle, element visibility, or API response promises).
* **Idempotence**: Every test must set up its own state and clean up after itself (independent execution).
* **Retry Boundaries**: Limit automated test retries to a maximum of 2 within CI/CD pipelines to catch genuine flakiness without masking bugs.
* **Deterministic Data**: Use isolated, dynamic data generation (e.g., unique UUIDs per run) instead of relying on static, shared database records.

## 3. Repository & Automation Boundaries
* **UI Isolation**: Keep UI selectors independent of brittle CSS paths; mandate dedicated data attributes (e.g., `data-testid="submit-btn"`).
* **API Validation**: Every API assertion must validate both the HTTP status code and the payload schema structure.
* **Performance Gates**: Fail performance pipelines instantly if error rates exceed 1% or p95 response times breach established SLAs.
* **No Secret Hardcoding**: Inject all target URLs, API keys, and environment-specific database credentials strictly via secure environment variables.
