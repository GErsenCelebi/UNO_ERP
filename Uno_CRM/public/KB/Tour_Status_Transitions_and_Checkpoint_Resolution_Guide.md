# 🚦 UNO_ERP: Tour Status Transitions & Checkpoint Resolution Guide

> **Document Type:** AI Knowledge Base & Operational Workflow Guide  
> **Audience:** AI Smart Agents, Operations Managers, Tour Planners, Accounting Administrators  
> **System Scope:** `Uno_CRM` (Next.js Frontend) & `Uno_API` (ASP.NET Core / Entity Framework Core)  
> **Database Entity:** `Tour` (`Tours` table) & `TourStatusCheckpoint` (`TourStatusCheckpoints` table)  
> **Last Updated:** September 2026  

---

## 📌 Executive Summary

In **UNO_ERP**, all tours move sequentially across 5 core operational stages. Every status advancement is protected by an automated **Status Gate** (`TourStatusCheckpointsController` & `TourCheckpointWidget`). 

If any mandatory checkpoint is unsatisfied, the **Status Gate** blocks progression, displays `X BLOCKED` in amber/red, and disables the **"Advance to..."** action button.

### Lifecycle Status Overview Table

| Status ID | Status Name | Kanban Stage | Primary Business Purpose | Next Target Status | Gate Key Checkpoints |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **`Draft`** | In Planning | Initial creation & itinerary draft | **Proposal (2)** | Project Code, Destination, Pax count, Date boundaries |
| **2** | **`Proposal`** | Quoting / B2B | Commercial offer sent to client | **Confirmed (3)** | Hotel, Guide, Transport, Base Package Fee (€) |
| **3** | **`Confirmed`** | Locked / Pre-Tour | Guaranteed departure, logistics ready | **In Progress (4)** | Arrival Date reached, Flight manifest verified |
| **4** | **`In Progress`** | Active on Ground | Tour executing, daily guide operations | **Completed (5)** | Return Date reached, Services logged, Accounting Closed |
| **5** | **`Completed`** | Archival / Audited | Finalized operations & locked accounting | *Terminal State* | All financial audits and remittances sealed |
| **6** | **`Cancelled`** | Exception | Cancelled departure & supplier penalties | *Terminal State* | Cancellation reason recorded in AuditLogs |

---

## 🧭 How to Read the Status Gate Widget (`TourCheckpointWidget`)

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

## 🔍 Detailed Transition Guide: Step-by-Step

---

### 1️⃣ Transition 1: `Draft` ➔ `Proposal` (Gate 1)

* **Current Status:** `Draft` (ID: 1)  
* **Target Status:** `Proposal` (ID: 2)  
* **Goal:** Validate core itinerary structure and passenger counts before releasing quotation to client.

#### Evaluated Checkpoints

| Checkpoint Name | Key | Mandatory? | Backend Logic & Failure Reason |
| :--- | :--- | :---: | :--- |
| **Project & Destination Defined** | `PROJECT_DEFINED` | **YES** | `tour.ProjectId > 0 && !string.IsNullOrEmpty(tour.Destination)`<br>• *Pass:* `"Project and destination city routing defined"`<br>• *Fail:* `"Project or destination missing"` |
| **Itinerary Boundaries** | Internal validation | **YES** | `tour.ArrivalDate != default && tour.EndDate > tour.ArrivalDate`<br>• *Fail:* End date cannot be before Arrival date |
| **Pax Breakdown** | Internal validation | **YES** | `tour.Pax > 0 || (tour.Adults + tour.Children) > 0`<br>• *Fail:* At least 1 adult passenger required |

#### Where to Find & How to Complete in UI

1. **Navigate to:** `Projects` ➔ Select the Project ➔ Click on the Tour.
   - **URL:** `/projects/{projectId}/tours/{tourId}`
2. **Locate Control:** Under the **Overview** tab, find the **Tour Information** card.
3. **Action:**
   - Click the blue **"Edit"** button in the top right of the card header.
   - **Destination:** Enter the destination city or route (e.g. `Budapest, Vienna, Prague`).
   - **Dates:** Set valid **Arrival Date & Time** and **End Date & Time** (`EndDate > ArrivalDate`).
   - **Passengers:** Ensure **Adults** is set to at least `1`.
   - Click **Save Changes**.
4. **Advance:** The gate changes to `GATE READY`. Click **"Advance to Proposal"**.

---

### 2️⃣ Transition 2: `Proposal` ➔ `Confirmed` (Gate 2)

* **Current Status:** `Proposal` (ID: 2)  
* **Target Status:** `Confirmed` (ID: 3)  
* **Goal:** Lock all supplier bookings (Hotel, Guide, Bus) and secure financial commercial terms before committing to execution.

#### Evaluated Checkpoints

| Checkpoint Name | Key | Mandatory? | Backend Logic & Failure Reason |
| :--- | :--- | :---: | :--- |
| **Hotel Reservations Confirmed** | `HOTEL_RESERVATIONS_CONFIRMED` | **YES** | `tour.TourServices.Any(s => s.HotelId != null \|\| s.ServiceCategory.Name == "Hotel")`<br>• *Pass:* `"Hotel reservations confirmed"`<br>• *Fail:* `"No hotel service assigned to tour"` |
| **Guide Assignment Confirmed** | `GUIDE_ASSIGNED_CONFIRMED` | **YES** | `tour.TourServices.Any(s => s.GuideId != null \|\| s.ServiceCategory.Name == "Guide")`<br>• *Pass:* `"Primary guide assigned & contract locked"`<br>• *Fail:* `"No guide assigned to tour"` |
| **Transportation & Coach Locked** | `TRANSPORT_CONFIRMED` | **YES** | `tour.TourServices.Any(s => s.DriverId != null \|\| s.TransportCompanyId != null \|\| s.ServiceCategory.Name == "Transport" \|\| s.ServiceCategory.Name == "Driver")`<br>• *Pass:* `"Transport company / driver assigned"`<br>• *Fail:* `"No transport/driver service assigned"` |
| **Client Contract & Deposit Received** | `CLIENT_DEPOSIT_CONFIRMED` | **YES** | `tour.TotalFee > 0 \|\| tour.BaseFee > 0`<br>• *Pass:* `"Client contract active & package pricing locked"`<br>• *Fail:* `"Pricing / package fee not calculated"` |

#### Where to Find & How to Complete Each Control in UI

#### A. Resolving "Client Contract & Deposit Received" (`CLIENT_DEPOSIT_CONFIRMED`)
> ⚠️ **Common Blocker:** The header summary card may show a fallback like `€250 (Per adult fee)`, but the database record has `BaseFee = 0.00`.
- **Where:** Tour Detail Page (`/projects/{projectId}/tours/{tourId}`) ➔ **Tour Information** card.
- **How to Fix:**
  1. Click the **"Edit"** button on the **Tour Information** card.
  2. Locate the **"Base Fee (€)"** input.
  3. Enter your negotiated per-passenger base rate (e.g. `250` or `350`).
  4. Notice the system dynamically calculates:  
     $$\text{Total Fee} = (\text{Adults} \times \text{BaseFee}) + (\text{Children} \times \text{BaseFee} \times 0.5)$$
  5. Click **"Save Changes"**.
  6. The checkpoint immediately switches to green.

#### B. Resolving "Hotel Reservations Confirmed" (`HOTEL_RESERVATIONS_CONFIRMED`)
- **Where:** Tour Detail Page ➔ Click the **"Services"** tab (`tab=services`).
- **How to Fix:**
  1. Click **"+ Add Service"**.
  2. In the Category dropdown, select **"Hotel"**.
  3. Select a Hotel from Master Data (or enter Hotel name in description).
  4. Specify Room Nights / Quantity and Unit Price.
  5. Click **"Save Service"**.

#### C. Resolving "Guide Assignment Confirmed" (`GUIDE_ASSIGNED_CONFIRMED`)
- **Where:** Two places supported:
  1. **Option 1 (Fast):** Click **"Edit"** on the **Tour Information** card ➔ Select a Guide from the **"Primary Guide"** dropdown ➔ Save.
  2. **Option 2:** Go to the **"Services"** tab ➔ Click **"+ Add Service"** ➔ Category: **"Guide"** ➔ Select Guide ➔ Save.

#### D. Resolving "Transportation & Coach Locked" (`TRANSPORT_CONFIRMED`)
- **Where:** Tour Detail Page ➔ Click the **"Services"** tab (`tab=services`).
- **How to Fix:**
  1. Click **"+ Add Service"**.
  2. In Category, select **"Transport"** or **"Driver"**.
  3. Select a Transport Company or Driver.
  4. Specify the service dates / route and price.
  5. Click **"Save Service"**.

#### Advancing the Status
Once all 4 boxes turn green with checkmarks:
- The Status Gate badge turns green: **`GATE READY`**.
- Click the blue **"Advance to Confirmed"** button.

---

### 3️⃣ Transition 3: `Confirmed` ➔ `In Progress` (Gate 3)

* **Current Status:** `Confirmed` (ID: 3)  
* **Target Status:** `In Progress` (ID: 4)  
* **Goal:** Verify that the tour has landed on the ground and live operations have started.

#### Evaluated Checkpoints

| Checkpoint Name | Key | Mandatory? | Backend Logic & Failure Reason |
| :--- | :--- | :---: | :--- |
| **Arrival Date Reached** | `ARRIVAL_DATE_REACHED` | **YES** | `DateTime.UtcNow >= tour.ArrivalDate`<br>• *Pass:* `"Arrival date reached"`<br>• *Fail:* `"Arrival date is in the future (DD MMM YYYY)"` |
| **Flight Manifest Verified** | `FLIGHT_MANIFEST_VERIFIED` | **YES** | `!string.IsNullOrEmpty(tour.ArrivalFlight)`<br>• *Pass:* `"Arrival flight verified ({tour.ArrivalFlight})"`<br>• *Fail:* `"Arrival flight number missing"` |

#### Where to Find & How to Complete Each Control in UI

#### A. Resolving "Flight Manifest Verified" (`FLIGHT_MANIFEST_VERIFIED`)
- **Where:** Tour Detail Page ➔ **Tour Information** card ➔ **Edit** modal.
- **How to Fix:**
  1. Click the **"Edit"** button on the **Tour Information** card.
  2. Scroll to the **Flight Information** sub-section.
  3. Fill in **"Arrival Flight"** (e.g. `TK 1821`, `LH 1234`).
  4. (Optional but recommended) Fill in **"Arrival Airport"** (e.g. `IST` or `VIE`).
  5. Click **"Save Changes"**.

#### B. Resolving "Arrival Date Reached" (`ARRIVAL_DATE_REACHED`)
- **Nature:** Temporal milestone gate.
- **How to Complete:**
  - **In Real Operations:** The checkpoint unlocks automatically on the morning of the tour's scheduled arrival date.
  - **In Testing / UAT Simulation:** Click **"Edit"** on **Tour Information**, adjust **Arrival Date** to today or yesterday's date, and click **Save Changes**.

#### Advancing the Status
When both checks are green:
- Click **"Advance to In Progress"**.

---

### 4️⃣ Transition 4: `In Progress` ➔ `Completed` (Gate 4)

* **Current Status:** `In Progress` (ID: 4)  
* **Target Status:** `Completed` (ID: 5)  
* **Goal:** Conclude tour operations, verify that guests departed, reconcile supplier invoices, and audit the tour ledger.

#### Evaluated Checkpoints

| Checkpoint Name | Key | Mandatory? | Backend Logic & Failure Reason |
| :--- | :--- | :---: | :--- |
| **Return Date Reached** | `RETURN_DATE_REACHED` | **YES** | `DateTime.UtcNow >= tour.EndDate`<br>• *Pass:* `"Return date reached (passengers departed)"`<br>• *Fail:* `"Departure date is in the future (DD MMM YYYY)"` |
| **Revenue & Expense Reconciled** | `REVENUE_EXPENSE_RECONCILED` | **YES** | `tour.TourServices.Any()`<br>• *Pass:* `"Supplier costs & client sales reconciled"`<br>• *Fail:* `"No services or invoice entries found"` |
| **Accounting Closed** | `ACCOUNTING_CLOSED` | **YES** | `tour.AccountingClosed == true`<br>• *Pass:* `"Accounting audit closed"`<br>• *Fail:* `"Accounting audit flag is unset (Accounting Open)"` |

#### Where to Find & How to Complete Each Control in UI

#### A. Resolving "Accounting Closed" (`ACCOUNTING_CLOSED`)
- **Where:** Tour Detail Page ➔ **Finance** tab OR **Tour Information** card.
- **How to Fix:**
  1. Navigate to the **Finance / Invoices** tab to verify all supplier expenses (Hotels, Bus, Guide daily rates) and client package invoices have been reconciled.
  2. Click **"Edit"** on the **Tour Information** card.
  3. Check the checkbox: **"Accounting Closed / Locked"** (`AccountingClosed: true`).
  4. Click **"Save Changes"**.
  5. The checkpoint turns green (`"Accounting audit closed"`).

#### B. Resolving "Return Date Reached" (`RETURN_DATE_REACHED`)
- **Nature:** Temporal milestone gate.
- **How to Complete:**
  - **In Real Operations:** Unlocks automatically when system date $\ge$ `EndDate`.
  - **In Testing / UAT Simulation:** Set **End Date** to today or a past date via **Edit Tour**.

#### C. Resolving "Revenue & Expense Reconciled" (`REVENUE_EXPENSE_RECONCILED`)
- **Where:** Services tab (`tab=services`) or Invoices tab.
- **How to Fix:** Ensure at least 1 service entry exists in the tour.

#### Advancing the Status
When all 3 checkpoints pass:
- Click **"Advance to Completed"**. The tour is now formally archived and financially sealed.

---

### 5️⃣ Transition: Any Status ➔ `Cancelled` (Status ID: 6)

* **Goal:** Gracefully terminate a cancelled departure and log cancellation audit reasons.
* **Where to Find in UI:** Tour Detail Page ➔ Top right actions dropdown ➔ **"Cancel Tour"**.
* **Requirements:**
  1. Must enter a formal **Cancellation Reason** (e.g. `Client requested cancellation due to visa issues`).
  2. The system logs the cancellation event into the `AuditLogs` table.
  3. Any supplier penalty or client credit note can be processed under the Finance tab.

---

## ⏰ Automated Time-Window SLA Warning Alerts

The system (`GET /api/TourStatusCheckpoints/warnings`) proactively flags upcoming departures across 4 danger windows:

```text
7 Days Before Start      3 Days Before Start      24 Hours Before Start    7 Days Post-Tour
────────────────────     ───────────────────      ─────────────────────    ─────────────────
⚠️ Missing Hotel/Bus     🚨 Missing Tour Guide    🚨 Missing Flight #      ⚠️ Accounting Unclosed
(Warning AMBER)          (Warning ROSE)           (Critical ROSE)          (Audit Overdue AMBER)
```

1. **7 Days Prior (`WARNING_HOTEL_7D` / `WARNING_BUS_7D`):** Triggers if Hotel or Transport services are missing.
2. **3 Days Prior (`WARNING_GUIDE_3D`):** Triggers if no Guide is assigned.
3. **24 Hours Prior (`CRITICAL_FLIGHT_24H`):** Triggers if Arrival Flight manifest is missing.
4. **7 Days Post-Tour (`WARNING_ACCOUNTING_7D`):** Triggers if tour ended > 7 days ago but `AccountingClosed` is still false.

---

## 🤖 AI Smart Agent Troubleshooting Instructions

When a user in `AIChatDrawer` or in chat asks:  
*"Why can't I advance my tour status?"* or *"What is missing to reach Confirmed/In Progress/Completed?"*

The AI Agent should follow this systematic resolution protocol:

1. **Identify Tour ID & Current Status:**
   - Determine which tour the user is viewing (`tourId`).
   - Query `GET /api/TourStatusCheckpoints/evaluate/{tourId}`.
2. **Scan Failing Checkpoints (`isSatisfied: false` & `isMandatory: true`):**
   - Read the exact `reason` string returned by the API.
3. **Generate Targeted Response using the Resolution Steps below:**
   - **If reason is `"Pricing / package fee not calculated"`:**
     - Instruct the user to click **"Edit"** on the **Tour Information** card, enter the **Base Fee (€)** (e.g. `€250`), and click **Save Changes**. Explain that the dynamic total will calculate automatically.
   - **If reason is `"No hotel service assigned to tour"`:**
     - Instruct the user to go to the **Services** tab (`tab=services`), click **"+ Add Service"**, select **Hotel**, pick a hotel, and save.
   - **If reason is `"No guide assigned to tour"`:**
     - Instruct the user to open **Edit Tour** and pick a guide in **"Primary Guide"** dropdown, or add a **Guide** service in the **Services** tab.
   - **If reason is `"No transport/driver service assigned"`:**
     - Instruct the user to go to the **Services** tab, click **"+ Add Service"**, choose **Transport/Driver**, and save.
   - **If reason is `"Arrival flight number missing"`:**
     - Instruct the user to open **Edit Tour**, scroll to **Flight Information**, enter the flight code (e.g. `TK 1821`), and save.
   - **If reason is `"Arrival date is in the future"` or `"Departure date is in the future"`:**
     - Inform the user that this is a time-gate milestone that unlocks on departure day (or can be adjusted in Edit Tour for testing).
   - **If reason is `"Accounting audit flag is unset"`:**
     - Instruct the user to verify financial ledgers in the Finance tab, open **Edit Tour**, check **"Accounting Closed / Locked"**, and save.
4. **Final Confirmation Step:**
   - Remind the user that once all items show green checkmarks, the status badge turns into **`GATE READY`**, enabling the blue **"Advance to..."** button.
