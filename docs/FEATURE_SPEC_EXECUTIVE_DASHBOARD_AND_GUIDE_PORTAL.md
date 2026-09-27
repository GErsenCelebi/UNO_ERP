# UNO ERP - Feature Specification & Implementation Guide

**Document:** Engineering Handover Specification  
**Version:** 1.0  
**Target Audience:** Frontend (Next.js/React) Engineers, Backend (.NET 10 / EF Core) Engineers, QA / Test Automation Engineers  
**Scope:**  
1. **Feature 1:** In-App & Mobile Guide Excursion Sales & Settlement Portal  
2. **Feature 2:** Database Test Data Sanitization & Cleansing  
3. **Feature 3:** C-Level Executive KPI Performance Dashboard (Target vs. Actual Tracking)

---

## 1. Feature 1: Guide Excursion Sales & Settlement Portal

### 1.1 Business Objective & Constraint
* **Objective:** Allow tour guides on the road to record passenger excursion sales and settle cash/card collections directly from mobile phones or in-app screens without requiring a laptop or Excel file manipulation.
* **Strict Constraint:** **Do NOT modify, delete, or break the existing Excel download/upload logic.** The `Download Sale File for Passenger List` button and the `/master-data` Excel import engine must remain 100% operational as an offline backup.

### 1.2 User Flow & Screens
1. **In-App Tour Tab:**
   * Route: `/projects/[id]/tours/[tourId]`
   * Add a 5th tab to the tour navigation bar:
     ```
     [ Tour Info ]   [ Services ]   [ Bookings ]   [ Invoice ]   [ 🧭 Guide Sales & Settlement ]
     ```
2. **Mobile Direct Route:**
   * Route: `/guide/tours/[tourId]`
   * Mobile-first responsive view without CRM sidebar/headers, allowing guides to log in or access via secure token.

### 1.3 UI/UX Specifications
* **Interactive Passenger $\times$ Excursion Matrix:**
  * **Rows:** All registered passengers from the tour rooming list (`passengers`), showing Name, Room Number, and `(CHD)` badge for children under 12.
  * **Columns:** Destination excursions catalog for this tour (e.g. *Danube River Cruise €35, Karlovy Vary €65, Hallstatt €85, Folklore Dinner €50*).
  * **Interaction:** Tapping any cell toggles participation (`Sold` vs. `Not Taken`).
* **Payment Mode Selector:**
  * Dropdown per passenger: `Cash EUR`, `Credit Card / POS`, `Pre-paid Agency`.
* **Real-time Sticky Calculation Footer:**
  * **Total Tickets Sold:** e.g., `28 tickets`
  * **Gross Excursion Revenue:** $\sum(\text{Excursion Unit Price} \times \text{Sold Count})$
  * **Guide Commission (10%):** $\text{Gross Revenue} \times (\text{Tour.GuideCommission} / 100)$
  * **Net Cash to Hand Over:** $\text{Gross Cash Collections} - \text{Guide Commission}$
* **One-Click Action:**
  * `[Submit Guide Settlement]` button: Sends bulk payload to API, sets status to `Settled`, and generates an audit log.

### 1.4 Technical Architecture & API Contract

#### Database Entity: `TourExcursionSale` (or map to existing `TourServices`)
```csharp
public class TourExcursionSale
{
    public int Id { get; set; }
    public int TourId { get; set; }
    public int PassengerId { get; set; }
    public int ExcursionId { get; set; }
    public decimal UnitPrice { get; set; }
    public string PaymentMethod { get; set; } = "Cash EUR"; // "Cash EUR", "Card POS", "Pre-paid"
    public bool IsSettled { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Tour Tour { get; set; } = null!;
    public Passenger Passenger { get; set; } = null!;
    public Excursion Excursion { get; set; } = null!;
}
```

#### API Endpoints (`Uno_API/Controllers/TourExcursionSalesController.cs`):
* `GET /api/tours/{tourId}/excursion-sales`
  * Returns: `{ tourId, guideName, commissionRate, passengers: [...], excursions: [...], sales: [...] }`
* `POST /api/tours/{tourId}/excursion-sales/bulk-settlement`
  * Payload:
    ```json
    {
      "tourId": 6128,
      "settledBy": "Guide Levent Orbay",
      "sales": [
        { "passengerId": 101, "excursionId": 5, "unitPrice": 35.0, "paymentMethod": "Cash EUR" },
        { "passengerId": 101, "excursionId": 8, "unitPrice": 65.0, "paymentMethod": "Cash EUR" }
      ],
      "totalGross": 1620.00,
      "guideCommission": 162.00,
      "netCashHandover": 1458.00
    }
    ```
  * Action: Upserts sales in a database transaction, logs audit history, updates tour financial totals.

---

## 2. Feature 2: Database Test Data Cleansing Specification

### 2.1 Problem Statement
Previous automated integration test runs created dummy test records directly in the primary database:
* ~85 Client records matching `Kanban Test Client %`, `CRUD Client %`, `Cal Client %`, `Sprint1 Client %`, `Svc Client %`, `Mock Agency %`.
* 12 dummy Tours matching `TestTour1` through `TestTour12`, `UI-TR-b510`, `TOUR-3163`.
* Dummy Projects matching `TEST-20260829`, `KAN-f5b4`, `KAN-32d4`.

### 2.2 Strict Safety Rules
1. **Never delete** real clients: `WTATIL Seyahat Tur Acentaligi Ltd. Sti.`, `Bonavita Travel`, etc.
2. **Never delete** real operational tours: `BVP1907`, `PVB05072026`, `ABCDTEST`, `PVB12072026`, etc.
3. Clean children in relational order: (Tour Services $\to$ Passengers $\to$ Tours $\to$ Projects $\to$ Clients).

### 2.3 SQL Execution Script for Database Administrator
```sql
BEGIN TRANSACTION;

-- 1. Identify Test Tours
DECLARE @TestTourIds TABLE (Id INT);
INSERT INTO @TestTourIds
SELECT Id FROM Tours 
WHERE TourCode LIKE 'TestTour%' 
   OR TourCode LIKE 'UI-TR-%' 
   OR TourCode LIKE 'TOUR-%';

-- 2. Delete child records for test tours
DELETE FROM TourServices WHERE TourId IN (SELECT Id FROM @TestTourIds);
DELETE FROM Passengers WHERE TourId IN (SELECT Id FROM @TestTourIds);
DELETE FROM Invoices WHERE TourId IN (SELECT Id FROM @TestTourIds);
DELETE FROM Tours WHERE Id IN (SELECT Id FROM @TestTourIds);

-- 3. Delete dummy test projects with no remaining tours
DELETE FROM Projects 
WHERE (ProjectCode LIKE 'TEST-%' OR ProjectCode LIKE 'KAN-%')
  AND NOT EXISTS (SELECT 1 FROM Tours WHERE Tours.ProjectId = Projects.Id);

-- 4. Delete orphan test clients that have no active tours or projects
DELETE FROM Clients 
WHERE (Name LIKE 'Kanban Test Client%' 
    OR Name LIKE 'CRUD Client%' 
    OR Name LIKE 'Cal Client%' 
    OR Name LIKE 'Sprint1 Client%' 
    OR Name LIKE 'Svc Client%' 
    OR Name LIKE 'Mock Agency%')
  AND NOT EXISTS (SELECT 1 FROM Projects WHERE Projects.ClientId = Clients.Id);

COMMIT TRANSACTION;
```

---

## 3. Feature 3: C-Level Executive KPI Performance Dashboard (Target vs. Actual)

### 3.1 Business Purpose
Provide C-Suite executives (CEO, CFO, Head of Operations) with strategic visibility to track **Budget Targets vs. Realized Actuals**, detect **rate slippages / margin leakage**, and review **AI Copilot operational recommendations**.

### 3.2 Location in Application
* Add route: `/dashboard/executive`
* Add navigation link in the main left sidebar under `Dashboard`:
  * `Overview` (`/dashboard`)
  * `Executive KPI Cockpit` (`/dashboard/executive`)

---

### 3.3 The 8 Smart Strategic KPIs (Data Definitions & Formulas)

| KPI # | Metric Name | Category | Formula / Definition | Target Baseline (Q3) | Actual Performance | Status (RAG) |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **1** | **Gross Booking Value (GBV)** | Commercial Scale | $\sum(\text{Tour Base Fees} + \text{Base Svc Rev} + \text{Excursion Sales})$ | €220,000 | **€242,580** | 🟢 (+10.3%) |
| **2** | **Net Realized Margin %** | Profitability | $\frac{\text{Gross Revenue} - \text{Total Supplier Cost}}{\text{Gross Revenue}} \times 100$ | 20.0% | **23.8%** (€57.7k) | 🟢 (+3.8% pts) |
| **3** | **Average Revenue / Pax** | Guest Monetization | $\frac{\text{Total Tour Revenue}}{\text{Total Registered Pax}}$ | €240.00 / pax | **€257.01 / pax** | 🟢 (+€17.01) |
| **4** | **Excursion Take Rate %** | Ancillary Revenue | $\frac{\text{Total Excursion Tickets Sold}}{\text{Total Pax} \times \text{Available Excursions}} \times 100$ | 48.0% | **64.2%** (€35.6k) | 🟢 (+16.2% pts) |
| **5** | **Operating Cost / Pax** | Cost Discipline | $\frac{\text{Total Supplier Expenses}}{\text{Total Registered Pax}}$ | €200.00 / pax | **€195.81 / pax** | 🟢 (-€4.19 savings) |
| **6** | **Hotel Cost / Pax Night** | Supplier Rates | $\frac{\text{Total Hotel Room + Tax Cost}}{\text{Total Pax} \times \text{Total Tour Nights}}$ | €95.00 / pax / nt | **€102.50 / pax / nt** | 🟡 **AMBER (+7.9%)** |
| **7** | **Departure Readiness %** | Operational Risk | $\frac{\text{Tours with Guide + Driver + Hotel confirmed 14d before start}}{\text{Total Active Tours}} \times 100$ | 95.0% | **87.5%** (2 at risk) | 🟡 **AMBER (Risk)** |
| **8** | **Cash Collection Velocity**| Liquidity & AR | $\frac{\text{Agency Invoiced Fees Paid Prior to Departure}}{\text{Total Invoiced Fees}} \times 100$ | 85.0% | **92.0%** (€0 overdue) | 🟢 (+7.0% pts) |

---

### 3.4 Dashboard Visual Components & Layout

#### Component 1: Top Control Header
* **Time Period Selector:** `[ Q3 2026 ] [ Month: Jul | Aug | Sep ] [ YTD ]`
* **Circuit / Project Filter:** Dropdown filtering Central Europe, Balkans, etc.
* **Export Action:** `[ Download Board Report PDF ]`

#### Component 2: AI Copilot Executive Flash Briefing
* Dynamic summary card powered by local API aggregation:
  * Flags margin surges (e.g. *Excursions +€14,820 above budget*).
  * Flags supplier inflation (e.g. *Vienna hotel rates averaging €102.50 vs €95 target*).
  * Highlights departure risks (&lt;14 days to start).

#### Component 3: 8 KPI Target vs. Actual Cards
* Each card includes:
  * Metric Title & Category badge.
  * Big Actual figure with Target comparison.
  * Linear progress/attainment bar.
  * Color-coded RAG indicator (`🟢 Green`, `🟡 Amber`, `🔴 Red`).
  * Absolute $\Delta$ variance text (e.g. *+€22,580 Ahead*).

#### Component 4: Variance Divergence Chart
* Horizontal divergence meters showing percentage variance from budget target ($0.0\%$ baseline).

#### Component 5: Recommended C-Suite Interventions
* Prioritized action cards:
  1. *Cost Containment:* Re-negotiate Vienna August hotel room allotment (Potential savings: €3,400).
  2. *Revenue Upsell:* Expand Hallstatt excursion package to 4 upcoming PVB tours.
  3. *Liquidity:* Auto-generate cash settlement voucher for guide collections on Tour #6128.

#### Component 6: Tour Performance League Table
* Ranked table with columns:
  * `Tour Code & Itinerary`
  * `Pax`
  * `Target GBV vs. Actual GBV`
  * `Target Margin % vs. Actual Margin %`
  * `Net Profit Realized (€)`
  * `RAG Status Badge` (e.g. `🟢 Outperforming (+7.9%)`, `🟡 Lagging (-3.0%)`)

---

### 3.5 API Specification for C-Level Dashboard

#### Endpoint: `GET /api/dashboard/executive-kpis?period=Q3-2026&projectId=`
**Response DTO (`ExecutiveKpiDashboardDto.cs`):**
```json
{
  "period": "Q3 2026",
  "generatedAt": "2026-09-27T13:00:00Z",
  "aiSummary": {
    "healthStatus": "Healthy",
    "bulletPoints": [
      "Operating Profit is outperforming budget by +€11,734 (+25.5%).",
      "Excursion Take Rate reached 64.2% vs 48.0% KPI target.",
      "Hotel Cost per Pax Night in Vienna reached €102.50 (+7.9% over benchmark)."
    ]
  },
  "kpis": [
    {
      "id": "gbv",
      "name": "Gross Booking Value (GBV)",
      "category": "Commercial Scale",
      "actual": 242580.0,
      "target": 220000.0,
      "variancePct": 10.26,
      "varianceAbs": 22580.0,
      "ragStatus": "Green",
      "unit": "EUR"
    },
    {
      "id": "net-margin",
      "name": "Net Realized Margin %",
      "category": "Profitability",
      "actual": 23.80,
      "target": 20.00,
      "variancePct": 19.00,
      "varianceAbs": 3.80,
      "ragStatus": "Green",
      "unit": "Percentage"
    }
  ],
  "tourLeague": [
    {
      "tourId": 6128,
      "tourCode": "ABCDTEST",
      "destination": "Budapest-Vienna-Prague",
      "pax": 44,
      "actualRevenue": 15480.0,
      "targetRevenue": 13500.0,
      "actualMarginPct": 29.9,
      "targetMarginPct": 22.0,
      "netProfit": 4642.0,
      "ragStatus": "Green"
    }
  ]
}
```

---

## 4. Visual Prototypes for Developer Reference
Developers can open and inspect the pre-built interactive HTML/Tailwind prototypes directly in the browser:
* **Guide Excursion Portal:** `C:/Users/ecele/.gemini/antigravity/brain/da3d7774-c465-41fb-9db4-d75aebe21ab7/guide_excursion_sales_portal.html`
* **C-Level Executive KPI Dashboard:** `C:/Users/ecele/.gemini/antigravity/brain/da3d7774-c465-41fb-9db4-d75aebe21ab7/c_level_kpi_dashboard_prototype.html`
