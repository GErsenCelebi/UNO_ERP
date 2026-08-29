# 🚀 UNO ERP - Implemented Features & Technical Summary Walkthrough

This document provides a technical walkthrough of all changes implemented, tested, and pushed to the repository during this session.

---

## 1. 💶 Guide Commission Calculation Logic

> [!IMPORTANT]
> **Rule Enforced**: Guide commission is now calculated **strictly based on Excursion Sales**. If no excursion sales exist for a tour (or Excursion Sales total $= 0$), **Guide Commission is always €0.00** and no guide commission line item is generated in Base Services / Services Cost.

### Summary of Changes:
* **Frontend (`page.client.tsx`)**: Updated guide commission subtotal calculation to derive commission strictly from total excursion sales.
* **Backend (`ToursController.cs`)**: Prevented baseline fee percentage fallback when excursion sales are zero.

---

## 2. 🏨 Hotel Tax (City Tax) — 4 Editable Input Fields & Manual Override Priority

> [!NOTE]
> All 4 Hotel Tax calculation metrics are rendered as explicit, styled `<input>` fields inside the **HOTEL TAX (CITY TAX)** modal box:
> 1. **Tax Rate (€ / pax / night)**: `<input type="number" step="0.10" />`
> 2. **Total Pax**: `<input type="number" />` (Defaults to tour pax, fully editable)
> 3. **Nightly Tax (€)**: `<input type="number" step="0.01" />` (Defaults to `Pax × Rate`, fully editable)
> 4. **Total Stay Tax (€)**: `<input type="number" step="0.01" />` (Defaults to `Nightly Tax × Nights`, **final manual override priority**)

### Guarantee:
* Whatever manual value is entered in **Total Stay Tax (€)** is strictly preserved and saved as the final service cost amount (`totalAmount`), overriding any auto-calculated values.
* Added quick-action support for **`+ City Tax`** and **`+ Hotel Tax`** buttons to automatically launch the Hotel Tax modal box with all inputs pre-selected.

---

## 3. 🏁 Default Tour Workflow Status (First Dashboard Status)

> [!IMPORTANT]
> All newly created or imported tours now start from the **First Status on the Dashboard (`TourStatusId = 1` / Draft)**.

### Implementation Details:
* **`TourImportController.cs`**: Replaced hardcoded `TourStatusId = 3` (Confirmed) with `TourStatusId = 1` (Draft) for all Excel rooming imports.
* **`ToursController.cs`**: Updated default tour initialization fallback to `TourStatusId = 1`.
* **Frontend (`page.client.tsx` & `projects/[id]/page.client.tsx`)**: Ensured all tour creation forms default to `tourStatusId = 1`.

---

## 4. 🗄️ Database Connection & Idempotent Delta Upgrade Script

### Local Database Switch:
* Switched active local connection string in [`appsettings.Development.json`](file:///C:/Ersen/Projects_2025/Uno_ERP/Uno_API/Uno_API/appsettings.Development.json) to **`UnoErpDb`**:
  ```json
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=UnoErpDb;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;Encrypt=False"
  ```

### Delta Upgrade SQL Script (`delta_schema_update_today.sql`):
* Generated and committed an idempotent SQL schema upgrade script:
  * **File Location**: [`Publish/260829/delta_schema_update_today.sql`](file:///C:/Ersen/Projects_2025/Uno_ERP/Publish/260829/delta_schema_update_today.sql)
  * **Function**: Safe to run on any previous database release to upgrade schema and seed default data (`Users`, `AuditLogs`, `RolePermissions`, `TourStatusCheckpoints`, `AiKnowledgeItems`, `GuideCommission`, `RoomNumber`, `PaxType`, etc.).

---

## 5. 🤖 E2E Automation Test Suite (All 12 Test Tours Population)

> [!TIP]
> The E2E Test Suite ([`tests/e2e/test_20260829.js`](file:///C:/Ersen/Projects_2025/Uno_ERP/tests/e2e/test_20260829.js)) was executed directly against `http://localhost:8000/api` on the active `UnoErpDb` database.

### Generated Test Data:
* **Project**: `Tests 20260829` (`TEST-20260829`)
* **Tours**: **12 Test Tours (`TestTour1` through `TestTour12`)**
* **Passengers**: 30 Pax per tour (**27 Adults, 2 Children, 1 Infant**) with rooming lists, family groups, room numbers, and child badges.
* **Pricing Modes**:
  * **`Pax/Night` Pricing**: `TestTour1`, `TestTour3`, `TestTour5`, `TestTour7`, `TestTour9`, `TestTour11`
  * **`Room/Night` Pricing**: `TestTour2`, `TestTour4`, `TestTour6`, `TestTour8`, `TestTour10`, `TestTour12`
* **Workflow Status**: Every tour was created starting cleanly at **Draft (`Status ID = 1`)**.

---

## 📄 Git Repository Log

| Commit Hash | Branch | Description |
| :--- | :--- | :--- |
| `f751917` | `main` | `test(e2e): Update E2E automation test script to generate all 12 Test Tours via API into active database` |
| `a4c2581` | `main` | `config(db): Switch local database connection string in appsettings.Development.json to UnoErpDb` |
| `0022c1a` | `main` | `docs(db): Add idempotent SQL delta upgrade script delta_schema_update_today.sql` |
| `73bd189` | `main` | `feat(tours): Default newly created/imported tours to first dashboard status and enhance hotel stay tax override in quick buttons` |
| `9a59ae9` | `main` | `feat(ui): Ensure manual override on all 4 Hotel Tax fields is strictly preserved as final saved service value` |
