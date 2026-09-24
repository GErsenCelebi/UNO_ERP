# End-to-End (E2E) Automation & Playwright Verification Report

**Owner:** E2E Test Manager (Quality Engineering Architect)  
**Location:** `tests/e2e/` & `Uno_E2E_Tests/`  
**Standard Adherence:** Enterprise Testing Standards (`testing-standards.md`) & Agent Rule 5 (`.agents/AGENTS.md`)  

---

## 🎯 Scope & Purpose
This report documents the health, structure, and reliability controls of the End-to-End (E2E) automation suites in UNO ERP. All automated UI test scripts must be committed directly under `tests/e2e/` to ensure full visibility for both CI/CD and AI agent pairs.

---

## 📁 Repository Test Inventory

### 1. Python / Playwright Test Scripts (`tests/e2e/`)

| Script Name | Target Workflow | Dynamic Wait Strategy | Idempotency & Clean Up |
| :--- | :--- | :--- | :--- |
| `test_hotel_tax.py` | City Tax calculation (`Pax × Rate × Nights`), modal calculations, operational services table quantity formatting (`2 N`). | Waits for modal visibility and DOM quantity text change; zero arbitrary sleeps. | Unique test hotel created or isolated context. |
| `test_invoice_total_amount.py` | Auto-sum calculation for Tour Invoices via `⚡ Auto-Sum From Line Items` button. | Waits for network idle and response event on total recalculation. | Creates transient test line items. |
| `test_tour_calendar_navigation.py` | Tour Calendar event card click-through, ProjectId routing, back-navigation. | Uses explicit click-through verification, URL change promises, and primary header assertion. | Read-only verification of seeded calendar items. |
| `test_tour_base_fee_sync.py` | Base fee synchronization between tour header and operational services table. | Listens for API `PATCH /tours/{id}` and UI total fee reactive updates. | Idempotent tour update and tear-down. |

### 2. .NET C# Playwright / MSTest Suite (`Uno_E2E_Tests/`)

| Test File | Target Workflow | Key Assertions |
| :--- | :--- | :--- |
| `MasterDataTests.cs` | Master data creation and UI table rendering. | Grid contains newly added Hotel, Guide, and Supplier entities. |
| `KanbanBoardTests.cs` | Project Kanban column movement, state persistence. | Drag-and-drop status persistence to backend. |
| `ProjectCrudTests.cs` | End-to-end creation, modification, and archiving of Projects. | Status codes, UI feedback toasts, table row presence. |
| `TourImportValidationTests.cs` | Tour rooming and excursion Excel parsing and validation. | Sheet structure, pax matching, and service generation. |

---

## 🛡️ Flakiness Controls & Best Practices Applied

1. **Zero Hardcoded Sleeps (`page.waitForTimeout`)**:
   - Explicitly prohibited in all test scripts. All assertions rely on dynamic state triggers:
     - `page.wait_for_selector(selector, state="visible")`
     - `expect(locator).to_have_text(...)`
     - `page.wait_for_load_state("domcontentloaded")`
2. **Next.js Dev Server WebSocket Guard**:
   - `page.wait_for_load_state("networkidle")` is guarded against Next.js HMR WebSockets, which can keep connections open indefinitely in dev mode.
3. **Click-Through Routing Verification**:
   - Verifying the presence of an anchor tag or button is strictly insufficient. Tests must actively click the element, await route navigation, and verify primary view render without 404 fallbacks.
