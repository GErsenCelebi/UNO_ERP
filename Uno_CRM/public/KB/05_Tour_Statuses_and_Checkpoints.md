---
id: tours-statuses-checkpoints-guide
title: Tour Statuses, Gate Resolution & Checkpoint Specifications
category: Tours
subTopic: Statuses & Gates
targetUrl: /tours
actionLabel: Tour Status Kanban & Gates
applicableRoles: [Administrator, TourAdmin, Manager]
tags: [tour status, checkpoints, gate 1, gate 2, gate 3, gate 4, blockers, advance button, draft, proposal, confirmed, in progress, completed, pricing package fee not calculated]
triggerQueries:
  - "Tour status transition criteria"
  - "What are automated tour status checkpoints?"
  - "What are the mandatory tour status checkpoints and how to resolve blockers to advance status?"
  - "Why is my tour status blocked?"
  - "Pricing / package fee not calculated"
  - "How to advance to Confirmed?"
  - "How to close a tour?"
---

# 🚦 05. Tour Statuses, Transitions & Checkpoint Resolution Guide

> **Knowledge Base Category:** Tours / Operational Workflows & Gate Resolution  
> **Source Module:** `UserManuals/Tours/05_Tour_Statuses_and_Checkpoints.md`  
> **Target Audience:** Tour Planners, Operations Managers, AI Assistant Copilot, Support Team  
> **Applicable Systems:** `Uno_CRM` & `Uno_API` (Entity: `Tour`, `TourStatusCheckpoint`, `TourServices`)  

---

## 📌 1. Lifecycle Overview & State Transition Matrix

In **UNO_ERP**, all tours move sequentially across 5 core operational stages. Every status advancement is protected by an automated **Status Gate** (`TourStatusCheckpointsController` & `TourCheckpointWidget`). 

If any mandatory checkpoint is unsatisfied, the **Status Gate** blocks progression, displays `X BLOCKED` in amber/red, and disables the **"Advance to..."** action button.

| Status ID | Status Name | Kanban Stage | Primary Business Purpose | Next Target Status | Gate Key Checkpoints |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **`Draft`** | In Planning | Initial creation & itinerary draft | **Proposal (2)** | Project Code, Destination, Pax count, Date boundaries |
| **2** | **`Proposal`** | Quoting / B2B | Commercial offer sent to client | **Confirmed (3)** | Hotel, Guide, Transport, Base Package Fee (€) |
| **3** | **`Confirmed`** | Locked / Pre-Tour | Guaranteed departure, logistics ready | **In Progress (4)** | Arrival Date reached, Flight manifest verified |
| **4** | **`In Progress`** | Active on Ground | Tour executing, daily guide operations | **Completed (5)** | Return Date reached, Services logged, Accounting Closed |
| **5** | **`Completed`** | Archival / Audited | Finalized operations & locked accounting | *Terminal State* | All financial audits and remittances sealed |
| **6** | **`Cancelled`** | Exception | Cancelled departure & supplier penalties | *Terminal State* | Cancellation reason recorded in AuditLogs |

---

## 🧭 2. How to Read the Status Gate Widget (`TourCheckpointWidget`)

The widget appears at the top of the **Tour Detail Page** (`/projects/[id]/tours/[tourId]`):

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ Status Gate Readiness  [ 1 BLOCKED ]  Current: Proposal ➔ Target: Confirmed        │
│                                                   [ ➔ Advance to Confirmed (Disabled) ]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [✓] Hotel Reservations Confirmed       [✓] Guide Assignment Confirmed                  │
│     Hotel reservations confirmed           Primary guide assigned & contract locked    │
│                                                                                        │
│ [✓] Transportation & Coach Locked      [✕] Client Contract & Deposit Received REQUIRED │
│     Transport company/driver assigned      Pricing / package fee not calculated        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **`GATE READY` (Green Badge):** All mandatory checkpoints satisfied (`canAdvance: true`). The blue **"Advance to [Target]"** button is enabled and clickable.
- **`N BLOCKED` (Amber/Red Badge):** One or more mandatory checkpoints are failing (`canAdvance: false`). The **"Advance to..."** button is disabled.
- **Click to Expand/Collapse:** Clicking the header bar expands the checklist showing each checkpoint, its requirement status, and the exact failure reason.

---

## 🔍 3. Step-by-Step Transition & Checkpoint Control Guide

---

### 🔹 Gate 1: `Draft` ➔ `Proposal` (Target Status ID: 2)
* **Business Goal:** Validate core itinerary structure and passenger counts before releasing quotation to client.

#### Checkpoints & Rules:
1. **Project & Destination Defined (`PROJECT_DEFINED`) - [MANDATORY]**:
   - **Backend Check:** `tour.ProjectId > 0 && !string.IsNullOrEmpty(tour.Destination)`
   - **Where to Find in UI:** Tour Detail Page ➔ **Tour Information** card ➔ Click **Edit**.
   - **How to Complete:** Enter **Destination** (e.g. `Budapest, Vienna, Prague`), set **Arrival Date** and **End Date** (`EndDate > ArrivalDate`), ensure **Adults** $\ge 1$, and click **Save Changes**.
   - **Advance:** When green, click **"Advance to Proposal"**.

---

### 🔹 Gate 2: `Proposal` ➔ `Confirmed` (Target Status ID: 3)
* **Business Goal:** Lock all supplier bookings (Hotel, Guide, Bus) and secure financial commercial terms before committing to execution.

#### Checkpoints & Rules:
1. **Client Contract & Deposit Received (`CLIENT_DEPOSIT_CONFIRMED`) - [MANDATORY]**:
   - **Backend Check:** `tour.TotalFee > 0 || tour.BaseFee > 0 || hasInvoicedFeeService`
   - **Failure Reason:** `"Pricing / package fee not calculated"`
   - **Where to Find in UI:** 
     - Method A: **Tour Info** tab ➔ **Tour Information** card ➔ Click **Edit** ➔ **Base Fee (€)**.
     - Method B: **Services** tab ➔ **Services Revenue** ➔ Click **+ Invoiced Fee**.
   - **How to Complete:** Enter the agreed per-passenger package price (e.g. `€150` or `€250`). Save changes. The gate immediately switches to green (`"Client contract active & package pricing locked"`).
2. **Hotel Reservations Confirmed (`HOTEL_RESERVATIONS_CONFIRMED`) - [MANDATORY]**:
   - **Backend Check:** At least 1 Hotel service assigned (`tour.TourServices.Any(s => s.HotelId != null || s.ServiceCategory.Name == "Hotel")`).
   - **Where to Find in UI:** **Services** tab (`tab=services`).
   - **How to Complete:** Click **+ Add Service**, select Category **Hotel**, pick hotel, enter room nights/rate, click **Save Service**.
3. **Guide Assignment Confirmed (`GUIDE_ASSIGNED_CONFIRMED`) - [MANDATORY]**:
   - **Backend Check:** Primary guide assigned (`tour.TourServices.Any(s => s.GuideId != null || s.ServiceCategory.Name == "Guide")`).
   - **Where to Find in UI:** **Tour Information** card (Dropdown **Primary Guide**) OR **Services** tab ➔ **+ Add Service** ➔ Category **Guide**.
   - **How to Complete:** Assign a guide from master data and click Save.
4. **Transportation & Coach Locked (`TRANSPORT_CONFIRMED`) - [MANDATORY]**:
   - **Backend Check:** Transport company or driver assigned (`tour.TourServices.Any(s => s.DriverId != null || s.TransportCompanyId != null || s.ServiceCategory.Name == "Transport")`).
   - **Where to Find in UI:** **Services** tab (`tab=services`).
   - **How to Complete:** Click **+ Add Service**, select Category **Transport** or **Driver**, pick company/driver, click **Save Service**.
   - **Advance:** When all 4 show green checkmarks, click **"Advance to Confirmed"**.

---

### 🔹 Gate 3: `Confirmed` ➔ `In Progress` (Target Status ID: 4)
* **Business Goal:** Verify that the tour has landed on the ground and live operations have started.

#### Checkpoints & Rules:
1. **Arrival Date Reached (`ARRIVAL_DATE_REACHED`) - [MANDATORY]**:
   - **Backend Check:** `DateTime.UtcNow >= tour.ArrivalDate`
   - **Failure Reason:** `"Arrival date is in the future (DD MMM YYYY)"`
   - **Where to Find & How to Complete:** Unlocks automatically on departure day. *(For UAT simulation: click **Edit** on Tour Info and set Arrival Date to today or a past date).*
2. **Flight Manifest Verified (`FLIGHT_MANIFEST_VERIFIED`) - [MANDATORY]**:
   - **Backend Check:** `!string.IsNullOrEmpty(tour.ArrivalFlight)`
   - **Failure Reason:** `"Arrival flight number missing"`
   - **Where to Find in UI:** **Tour Information** card ➔ **Edit** ➔ **Flight Information** section.
   - **How to Complete:** Enter inbound flight number in **Arrival Flight** (e.g. `TK 1821`), and click **Save Changes**.
   - **Advance:** When both checkmarks are green, click **"Advance to In Progress"**.

---

### 🔹 Gate 4: `In Progress` ➔ `Completed` (Target Status ID: 5)
* **Business Goal:** Conclude tour operations, verify guest departure, reconcile supplier invoices, and audit the tour ledger.

#### Checkpoints & Rules:
1. **Return Date Reached (`RETURN_DATE_REACHED`) - [MANDATORY]**:
   - **Backend Check:** `DateTime.UtcNow >= tour.EndDate`
   - **Failure Reason:** `"Departure date is in the future (DD MMM YYYY)"`
   - **Where to Find & How to Complete:** Unlocks automatically when tour finishes. *(For UAT simulation: adjust End Date to today/past in Edit Tour).*
2. **Revenue & Expense Reconciled (`REVENUE_EXPENSE_RECONCILED`) - [MANDATORY]**:
   - **Backend Check:** `tour.TourServices.Any()`
   - **Failure Reason:** `"No services or invoice entries found"`
   - **Where to Find & How to Complete:** Ensure at least 1 service entry exists in the tour under **Services** tab.
3. **Accounting Closed (`ACCOUNTING_CLOSED`) - [MANDATORY]**:
   - **Backend Check:** `tour.AccountingClosed == true`
   - **Failure Reason:** `"Accounting audit flag is unset (Accounting Open)"`
   - **Where to Find in UI:** **Tour Information** card ➔ **Edit** OR **Finance** tab.
   - **How to Complete:** Check the checkbox **"Accounting Closed / Locked"** and click **Save Changes**.
   - **Advance:** When all 3 pass, click **"Advance to Completed"** to archive and seal accounts.

---

## ⏰ 4. Automated SLA Warnings Windows

The system continuously scans departures:
- **7 Days Prior:** Missing Hotel or Transport (`⚠️ WARNING ALERT: Missing Hotel/Bus 7d`)
- **3 Days Prior:** Missing Guide assignment (`⚠️ WARNING ALERT: Missing Guide 3d`)
- **24 Hours Prior:** Missing Flight Manifest (`🚨 CRITICAL ALERT: Incomplete Manifest 24h`)
- **7 Days Post-Tour:** Unclosed Accounting (`⚠️ ACCOUNTING ALERT: Unclosed Accounting 7d`)

---

## 🤖 5. AI Copilot Agent Diagnostic Queries

| User Prompt | AI Copilot Action & Guidance |
| :--- | :--- |
| *"Why is my tour status blocked?"* | Query `GET /api/TourStatusCheckpoints/evaluate/{tourId}`, list failed checks, and guide user step-by-step. |
| *"Pricing / package fee not calculated"* | Direct user to enter **Base Fee (€)** in **Tour Info ➔ Edit** or add an **Invoiced Fee** service. |
| *"How to advance to Confirmed?"* | Remind user to verify Hotel, Guide, Transport, and Base Package Fee. |
| *"How to close a tour?"* | Guide user to reconcile invoices, check **Accounting Closed**, and advance to **Completed**. |
