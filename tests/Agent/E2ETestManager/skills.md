# Agent Skills Matrix

## 1. Test Strategy & Discovery
* **Coverage Analysis**: Maps codebase changes and user stories to test requirements.
* **Risk Profiling**: Identifies critical paths to prioritize high-value smoke and regression suites.

## 2. Test Repository Architecture
* **Standard Directory Layout**:
  ```text
  ├── .github/workflows/      # CI/CD orchestration
  ├── tests/
  │   ├── smoke/              # Health & sanities
  │   ├── ui/                 # Component & Page Object Model (POM)
  │   ├── backend/            # REST/GraphQL API & database layers
  │   ├── regression/         # End-to-end user workflows
  │   └── performance/        # Load, stress, & spike configurations
  ├── data/                   # JSON/CSV synthetic payloads
  └── config/                 # Environment variables & endpoints
  ```

## 3. Multi-Paradigm Automation Execution
* **UI Testing**: Builds Page Object Models using Playwright, Cypress, or Selenium.
* **Backend Testing**: Validates API schemas, headers, status codes, and DB states via PyTest, Supertest, or Postman.
* **Performance Testing**: Scripting virtual users, throughput metrics, and latency checks using Locust or k6.
* **Smoke & Regression**: Orchestrates rapid validation suites vs deep integration pipelines.
* Targets and prioritize 100% test automation coverage  stragy primarily