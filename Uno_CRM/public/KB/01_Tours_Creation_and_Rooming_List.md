---
id: tours-creation-rooming-list
title: Tour Creation, Rooming List Ingestion & Passenger Pax Types
category: Tours
subTopic: Rooming List
targetUrl: /tours
actionLabel: View Tours & Rooming
applicableRoles: [Administrator, TourAdmin]
tags: [tours, tour creation, rooming list, adult, child, infant, chd badge, booking ref, room numbers, family groups]
triggerQueries:
  - "How to import passenger rooming lists, booking codes and pax types?"
  - "How to create a new tour manually?"
  - "How does rooming list import work?"
  - "What are the rules for Adult, Child, and Infant pax types?"
  - "How are family booking groups assigned to rooms?"
  - "What is the initial status of an imported tour?"
---

# 🚌 Tours - Creation, Status Rules & Rooming List Import

## 💡 Executive Summary & Core Purpose
Tours are the fundamental operational departures in **UNO ERP**. Each Tour represents a specific departure date, itinerary route, and passenger group (e.g. `PVB05072026` departing July 5, 2026 for Prague-Vienna-Budapest).

Every tour is bound to a parent **Project** and begins its operational life cycle in **`Draft`** status.

---

## 🛠️ Step-by-Step UI Guide: Tour Creation

### 🔹 1. Manual Creation via Web UI
1. Navigate to **[Tours](/tours)** in the left sidebar.
2. Click the blue **`+ Add Tour`** button at the top right.
3. Fill in:
   - **Tour Code**: Unique identifier (e.g. `Tour1`, `BVP28082026`).
   - **Destination**: Itinerary route (e.g. `Prague-Vienna-Budapest`).
   - **Arrival & End Dates**: Must satisfy `EndDate > ArrivalDate`.
   - **Parent Project**: Select an active project from the dropdown.
   - **Flight Information**: Optional arrival/departure flights.
4. Click **`Save Tour`**. Upon creation, the tour is automatically assigned `TourStatusId = 1` (**`Draft`**).

### 🔹 2. Automated Ingestion via Rooming List Import (`Rooming_import_template.xlsx`)
1. Format your file according to filename conventions: `{ProjectName}_{TourCode}_rooming.xlsx` (or `{TourCode}_rooming.xlsx`).
2. Navigate to **Tours** $\rightarrow$ Click **`Import Rooming List`**.
3. Select and upload your `.xlsx` file.
4. The system executes dual ingestion:
   - **Tours Sheet**: Instantiates the tour record with `Status = Draft`.
   - **Rooming Sheet**: Ingests all passenger records, booking codes (`BKG-01` to `BKG-15`), room numbers (`101`, `102`), and pax types.

---

## 👥 Passenger Rooming List Management & Pax Types

* **Pax Type Definitions & Billing Rules**:
  * **`Adult`**: Full-fare passenger ($12+$ years of age). Incur standard hotel rates and full excursion prices.
  * **`Child (CHD)`**: Passengers under $12$ years of age. Highlighted in **red text with a `(CHD)` badge** in rooming lists and excursion sales grids. Receive discounted excursion ticket rates.
  * **`Infant`**: Children under $2$ years of age. Handled with zero excursion ticket cost and no extra hotel bed charge.
* **Family Booking Groups**:
  - Passengers sharing the same booking reference (e.g. `BKG-01`) are automatically grouped into shared hotel room configurations (Single, Double, Twin, Triple).

---

## 🚦 Initial Tour Status Rule

> [!IMPORTANT]
> **Draft Default Rule**: Every newly created or imported tour strictly starts in **`Draft` (`TourStatusId = 1`)**. It cannot jump directly to `Confirmed` or `Completed` without passing through mandatory **Status Checkpoints** (such as guide assignment, hotel confirmation, and pricing validation).
