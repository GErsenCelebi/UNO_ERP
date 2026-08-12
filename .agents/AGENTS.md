# Lessons Learned & Project Rules

## 1. Verify File Paths (Backend / API Generation)
**Rule:** Whenever an agent (especially Backend or Fullstack agents) generates code files, they MUST verify that the files are saved in the correct target directory within the main solution (e.g., C:\Ersen\Projects_2025\Uno_ERP\Uno_API\Uno_API\Controllers).
**Reason:** In Sprint 3.1, Master Data APIs were accidentally dumped into a temporary hidden scratch folder, causing the user to believe they were missing entirely.

## 2. GitHub Issue Status Verification
**Rule:** The Product Owner and Orchestrator must NEVER mark a GitHub issue as "Done" or "Closed" unless both the Frontend UI *and* Backend API are fully implemented, tested, and pushed to the repository.
**Reason:** Dashboard and Master Data issues were marked as done prematurely, even though the Backend API logic and Dashboard UI were missing.

## 3. Strict UI and API Issue Separation
**Rule:** User Stories and GitHub issues must be strictly separated into [Frontend] and [Backend] components.
**Reason:** Lumping UI and API tasks into single tickets causes confusion and leads to incomplete implementations being falsely marked as done.

## 4. End-to-End Test Automation Requirement
**Rule:** All completed functionality must be verified by the E2E Testing Manager. If an E2E test fails and is confirmed as a true bug, the agent must drag the related GitHub issue back to "Incomplete" and raise a bug linked to the issue.
