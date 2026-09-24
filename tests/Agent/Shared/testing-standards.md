---
title: Enterprise Testing Standards
document: testing-standards.md
version: 1.0
status: Approved
owner: TechLead (Architect) / QE-Architect
reviewers:
  - Software Team Orchestrator
  - QA Manager
---

# Enterprise Testing Standards

## Purpose
This document defines the automated testing standards for the Agentic AI Software Delivery Team. It ensures that all software delivered maintains a high level of reliability, performance, and prevents regressions in active codebases.

---

## 1. The Testing Pyramid
All projects must aim for a balanced testing pyramid:
*   **Unit Tests (~60%):** Fast, isolated tests for backend business logic and frontend utility functions.
*   **Integration/Component Tests (~30%):** Validating database repositories, API endpoints, and isolated React components.
*   **E2E / UI Tests (~10%):** High-value, critical-path business flows tested via browser automation.

---

## 2. Backend Testing Standards
**Frameworks:** `xUnit` + `FluentAssertions` + `Moq` (or `NSubstitute`)

*   **Test Naming Convention:** `MethodName_StateUnderTest_ExpectedBehavior` (e.g., `CalculateTax_NegativeAmount_ThrowsArgumentException`).
*   **AAA Pattern:** Every test must be structured using the Arrange, Act, Assert pattern.
*   **Isolation:** Unit tests must execute entirely in memory. Any test that touches the database, file system, or network is an *Integration Test* and belongs in a separate project (e.g., `Backend.IntegrationTests`).
*   **Dependency Injection:** Inject mocked dependencies to test isolated business logic inside Services. Never mock the system under test itself.

---

## 3. Frontend Testing Standards
**Frameworks:** `React Testing Library` + `Jest`

*   **Behavior-Driven Verification:** Test the component from the user's perspective. Assert on what the user sees (text, roles, labels) rather than the internal component state or implementation details.
*   **Data Attributes:** Use `data-testid` for element selection when standard ARIA roles or text labels are insufficient or prone to translation changes.
*   **Mocking:** Mock API calls using `MSW` (Mock Service Worker) to ensure tests don't rely on live backend availability.

---

## 4. End-to-End (E2E) Testing Standards
**Framework:** `Playwright`

### Page Object Model (POM)
All E2E tests must utilize the Page Object Model design pattern. Test scripts must not contain raw CSS or XPath selectors. All locators and page-specific actions must be encapsulated in Page Classes.

### Flakiness Controls
*   **Zero Hardcoded Sleeps:** Never use `page.waitForTimeout()`. Rely strictly on dynamic waits (e.g., `waitForSelector`, `waitForLoadState('networkidle')`, or API interception).
*   **Idempotency:** Every test must be completely independent. It must set up its own state (via API seeding) and clean up after itself. Never rely on the database state left behind by a previous test.
*   **Retries:** Limit CI/CD retries to a maximum of 2. Tests failing more than twice are classified as flaky and must be quarantined.

---

## 5. CI/CD Pipeline Gates
Automated tests are the absolute gatekeepers for code merges.
*   **Pre-Merge:** Pull Requests are strictly blocked if Unit Tests or Playwright Smoke Tests fail.
*   **Performance:** Code coverage must not drop below the established baseline (target: 80% for domain logic).
*   **Artifacts:** Failed Playwright tests must output trace viewers, HTML reports, and screenshots/video to the CI pipeline to eliminate "works on my machine" debugging issues.
