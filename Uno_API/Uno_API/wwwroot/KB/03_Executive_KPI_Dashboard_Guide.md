---
id: projects-executive-kpi-dashboard-guide
title: Executive KPI Dashboard & Tour Operator Profit Optimization Guide
category: Projects
subTopic: Overview & Purpose
targetUrl: /projects
actionLabel: View Executive Dashboard
applicableRoles: [Administrator, Manager]
tags: [kpi, dashboard, metrics, profit margin, operational efficiency, compliance, risk, departure readiness, rooming lock accuracy, guide capacity, load factor, cash remittance lag]
triggerQueries:
  - "What KPIs are available on the Executive Dashboard?"
  - "What are the 24 High-Impact KPIs in UNO ERP?"
  - "How is Tour Gross Margin calculated?"
  - "What is the target SLA for Departure Readiness Gate Pass Rate?"
  - "How is Excursion Yield per Passenger calculated?"
  - "What is Guide Cash Remittance Lag and what is its target SLA?"
  - "How to monitor supplier confirmation velocity?"
  - "What is the Rooming List Lock Accuracy target?"
---

# 📊 Executive KPI Dashboard & Tour Operator Profit Optimization Guide

## 💡 Executive Summary & Core Purpose
The **UNO ERP Executive KPI Dashboard** provides executive leadership and owners with real-time operational visibility, tight risk governance, and financial margin tracking across Central European group tours. 

The dashboard tracks **24 High-Impact Key Performance Indicators (KPIs)** organized into **4 Strategic Categories**:
1. **Operational Efficiency** (KPIs 1–6)
2. **Financial & Profitability** (KPIs 7–12)
3. **Operational Integrity & Cash Compliance** (KPIs 13–18)
4. **Growth, Opportunities & AI Copilot** (KPIs 19–24)

---

## 📈 Strategic KPI Breakdown & Target SLAs

### 1. Operational Efficiency KPIs
* **KPI 1: Departure Readiness Gate Pass Rate (%)**
  - **Target SLA**: `100% within 72 hours of departure`
  - **Formula**: `(Ready Tours / Total Upcoming Tours) × 100`
  - **Impact**: Eliminates last-minute panics, unassigned guides, or missing hotel vouchers.
* **KPI 2: Rooming List Lock Accuracy (%)**
  - **Target SLA**: `> 98%`
  - **Formula**: `(Confirmed Roomings / Total Rooming Requests) × 100`
  - **Impact**: Avoids hotel rooming penalties, check-in delays, and single/double room mismatches.
* **KPI 3: Guide Capacity Utilization (%)**
  - **Target SLA**: `85% – 90%`
  - **Formula**: `(Assigned Tour Days / Contracted Available Days) × 100`
  - **Impact**: Maximizes guide productivity while preventing guide burnout.
* **KPI 4: Bus Seat Load Factor (%)**
  - **Target SLA**: `> 85%`
  - **Formula**: `(Total Passengers / Coach Seating Capacity) × 100`
  - **Impact**: Optimizes bus size allocation (e.g. 35-seat vs 50-seat coach) to minimize transport cost per pax.
* **KPI 5: Supplier Confirmation Velocity (Hours)**
  - **Target SLA**: `< 24 Hours`
  - **Formula**: `Average hours from booking request to supplier confirmation receipt`
  - **Impact**: Accelerates proposal turnaround to B2B agencies and secures competitive hotel allocations.
* **KPI 6: Automated Document Export Ratio (%)**
  - **Target SLA**: `> 95%`
  - **Formula**: `(System Vouchers & Manifests Exported / Total Operational Documents) × 100`
  - **Impact**: Eliminates manual document drafting, saving 15+ staff hours per week.

### 2. Financial & Profitability KPIs
* **KPI 7: Excursion Sales Penetration Rate (%)**
  - **Target SLA**: `> 75% Pax`
  - **Formula**: `(Passengers Purchasing Optional Excursions / Total Pax) × 100`
  - **Impact**: Gauges guide sales promotion effectiveness and passenger engagement.
* **KPI 8: Excursion Yield per Passenger (€)**
  - **Target SLA**: `> €120 / Pax`
  - **Formula**: `Total Excursion Revenue / Total Passengers`
  - **Impact**: Identifies highest revenue-generating itineraries and excursions.
* **KPI 9: Guide Commission Efficiency (%)**
  - **Target SLA**: `< 15% Margin`
  - **Formula**: `(Total Guide Commission Paid / Excursion Net Margin) × 100`
  - **Impact**: Validates that guide incentives drive profitable sales without eroding DMC profit.
* **KPI 10: Cost per Pax Variance (€ & %)**
  - **Target SLA**: `± 2% of Budget`
  - **Formula**: `Actual Settled Cost per Pax - Budgeted Cost per Pax`
  - **Impact**: Detects hotel rate changes or unexpected city tax hikes before final invoicing.
* **KPI 11: Uninvoiced Service Cost Ratio (%)**
  - **Target SLA**: `< 1%`
  - **Formula**: `(Unbilled Supplier Costs / Total Expenses) × 100`
  - **Impact**: Prevents unbilled vendor costs from being absorbed by UNO instead of client billing.
* **KPI 12: Gross Margin per Tour (€ & %)**
  - **Target SLA**: `> 22% Margin`
  - **Formula**: `((Total Revenue - Total Costs) / Total Revenue) × 100`
  - **Impact**: Provides instant clarity on which client agencies and destinations generate the highest bottom-line return.

### 3. Operational Integrity & Cash Compliance KPIs
* **KPI 13: Guide Cash Remittance Lag (Days)**
  - **Target SLA**: `< 48 Hours`
  - **Formula**: `Average days from Tour End Date to physical cash bank deposit`
  - **Impact**: Enforces strict cash remittance timelines and secures on-time cash flow.
* **KPI 14: Excursion Cash Discrepancy Rate (%)**
  - **Target SLA**: `0.0% Variance`
  - **Formula**: `|Guide Cash Remitted - Expected Excursion Cash| / Total Excursion Sales`
  - **Impact**: Zero-tolerance policy on cash leakages and currency conversion errors.
* **KPI 15: Unassigned Tour Resource Ratio (%)**
  - **Target SLA**: `0% within 7 days of departure`
  - **Formula**: `(Tours Missing Hotel, Guide, or Transport / Total Tours) × 100`
* **KPI 16: Passenger Data Completeness (%)**
  - **Target SLA**: `100% (7 days prior)`
  - **Formula**: `(Passengers with valid passport & flight details / Total Passengers) × 100`
* **KPI 17: Supplier Payment On-Time Rate (%)**
  - **Target SLA**: `> 98%`
  - **Formula**: `(Invoices Paid Within Contractual Terms / Total Supplier Invoices) × 100`
* **KPI 18: Audit Trail Exception Count**
  - **Target SLA**: `< 5 Overrides / Month`
  - **Formula**: `Total manual price or status overrides logged in AuditLogs`

### 4. Growth, Opportunities & AI Copilot KPIs
* **KPI 19: Client Repeat Booking Rate (%)**
  - **Target SLA**: `> 80%`
  - **Formula**: `(Repeat B2B Tour Operators / Active Client Base) × 100`
* **KPI 20: Project Pax Load Factor (%)**
  - **Target SLA**: `> 90% Capacity`
  - **Formula**: `(Actual Booked Pax / Contracted Capacity) × 100`
* **KPI 21: Top Destination Margin Share (%)**
  - **Target SLA**: `Monitor Portfolio Mix`
  - **Formula**: `Gross Profit from Top 3 Destinations / Total Gross Profit`
* **KPI 22: Guide Performance NPS Score**
  - **Target SLA**: `> 4.8 / 5.0`
  - **Formula**: `Average customer feedback score per tour guide`
* **KPI 23: Pre/Post Hotel Night Conversion (%)**
  - **Target SLA**: `> 15% Pax`
  - **Formula**: `(Passengers Booking Early Arrival or Extra Nights / Total Pax) × 100`
* **KPI 24: AI Copilot Instant Resolution Rate (%)**
  - **Target SLA**: `> 90%`
  - **Formula**: `(Staff Inquiries Resolved by AI Assistant / Total Queries) × 100`

---

## 🛠️ How to Access KPIs in UNO ERP

1. Navigate to **[Projects Overview](/projects)** or **[Executive Dashboard](/projects)**.
2. Filter by **Season**, **Client Operator**, or **Destination Route**.
3. Inspect visual metric cards with green/amber/red threshold alerts.
