---
id: tours-excel-import-master-guide
title: Comprehensive Excel Import Master Guide (Scenarios 1-5, Naming Conventions & Column Specifications)
category: Tours
subTopic: Excel Import
targetUrl: /master-data?tab=excelImport
actionLabel: Open Excel Import Hub
applicableRoles: [Administrator, TourAdmin]
tags: [excel import, scenario 1, scenario 2, scenario 3, scenario 4, scenario 5, filename conventions, notation, rooming list, sales import, master data template]
triggerQueries:
  - "How can I import sales excel file and rooming lists?"
  - "How to import a new tour, new project, or rooming list via Excel template?"
  - "What are the 5 Excel import scenarios?"
  - "What is Scenario 1: New Tour & New Project?"
  - "What is Scenario 2: New Tour for Existing Project?"
  - "What is Scenario 3: Refresh Rooming Data?"
  - "What is Scenario 4: Import Master Data?"
  - "What is Scenario 5: Import Excursion Sales?"
  - "What filename conventions are required for Excel import?"
  - "What worksheets and columns are required in the Excel import file?"
---

# 📊 Excel Import Master Guide: Scenarios, Conventions & Specifications

## 💡 Executive Summary & Core Purpose
**UNO ERP** features an intelligent Excel ingestion pipeline that parses multi-sheet workbooks to instantiate projects, configure departures, populate passenger manifests, and reconcile optional excursion sales.

Following exact **filename notations** and **sheet structures** guarantees zero import errors and seamless data linkage.

---

## 📁 1. Filename Conventions & Naming Notation

The backend indexer and Excel parser use filename patterns to automatically detect the import context:

| Import Operational Case | Filename Template | Concrete Example |
| :--- | :--- | :--- |
| **Scenario 1: New Project + New Tour** | `{ProjectName}_{TourCode}_rooming.xlsx` | **`Project1_Tour1_rooming.xlsx`** *(or `Orta Avrupa BVP_BVP28082026_rooming.xlsx`)* |
| **Scenario 2: Existing Project + New Tour** | `{ProjectName}_{TourCode}_rooming.xlsx` | **`Project1_Tour2_rooming.xlsx`** |
| **Scenario 3: Existing Tour Rooming Refresh** | `{TourCode}_rooming.xlsx` | **`Tour1_rooming.xlsx`** *(or `BVP28082026_rooming.xlsx`)* |
| **Scenario 4: Master Data Catalog** | `MasterData_Import_Template.xlsx` | **`MasterData_Import_Template.xlsx`** |
| **Scenario 5: Excursion Sales File** | `{ProjectName}_{TourCode}_importSales.xlsx` | **`Project1_Tour1_importSales.xlsx`** |

---

## 📊 2. Worksheet Names & Required Column Specifications

### 🔹 Sheet 1: `Tours` (or `Tour`, `TourData`)
* **Col A**: `Tour Code` (e.g. `Tour1` or `BVP28082026`) *[Required]*
* **Col B**: `Project Code / Name` (e.g. `Project1` or `Orta Avrupa BVP`)
* **Col C**: `Destination` (e.g. `Prague-Vienna-Budapest`)
* **Col D**: `Arrival Date` (Format: `dd/mm/yyyy` or `dd.mm.yyyy`)
* **Col E**: `End Date` (Format: `dd/mm/yyyy` or `dd.mm.yyyy`)
* **Cols F-I**: `Adults`, `Children`, `Infants`, `Pax`

### 🔹 Sheet 2: `Projects` (or `Project`)
* **Col A**: `Project Code / Name` (e.g. `Project1`)
* **Col B**: `Client Name` (e.g. `UNO DMC`, `Orta Avrupa BVP`)

### 🔹 Sheet 3: `Rooming` (or `Rooms`, `Passengers`)
* **Col A**: `Passenger Full Name` (e.g. `John Doe`)
* **Col B**: `Gender` (`M` / `F`)
* **Col C**: `Pax Type` (`Adult` [12+ yrs], `Child` [<12 yrs], `Infant`)
* **Col D**: `Booking Ref` (e.g. `BKG-01`, `BKG-02`)
* **Col E**: `Room Number` (e.g. `101`, `102`)
* **Col F**: `Room Type` (`Single`, `Double`, `Twin`, `Triple`)

### 🔹 Sheet 4: `Hotels` (Master Data File)
* Hotel Name, Location, Star Rating, Contact Email/Phone, Nightly Room & Pax Rates, Pricing Basis (`Pax` vs `Room`).

---

## 🛠️ 3. Step-by-Step Import Scenarios

### 🔹 Scenario 1: Import a NEW Tour for a NEW Project
1. Name file: `{ProjectName}_{TourCode}_rooming.xlsx` (e.g. `Project1_Tour1_rooming.xlsx`).
2. Set `Projects` sheet Col A = `Project1`, Col B = `Client Name`.
3. Set `Tours` sheet Col A = `Tour1`, Col B = `Project1`, Col C = destination, Col D = arrival date.
4. List passenger names and room numbers in `Rooming` sheet.
5. Go to **Tours** or **Projects** $\rightarrow$ Click **Import Rooming List** $\rightarrow$ Upload file.
6. **Result**: Creates `Project1` (`Active`), creates `Tour1` in **`Draft`** status, and attaches all passenger bookings.

### 🔹 Scenario 2: Import a NEW Tour for an EXISTING Project
1. Name file: `Project1_Tour2_rooming.xlsx` (matching existing project name `Project1`).
2. Click **Import Rooming List** $\rightarrow$ Upload file.
3. **Result**: Reuses existing `Project1`, instantiates `Tour2` in **`Draft`** status, and binds it under `Project1`.

### 🔹 Scenario 3: Refresh Rooming Data for an EXISTING Tour
1. Name file: `{TourCode}_rooming.xlsx` (e.g. `Tour1_rooming.xlsx`).
2. Update passenger names, room numbers (`101`, `102`), or booking codes in `Rooming` sheet.
3. Click **Import Rooming List** $\rightarrow$ Upload file.
4. **Result**: Refreshes passenger rooming list and pax counts, while **preserving all existing hotel accommodations, guide assignments, and transport services**.

### 🔹 Scenario 4: Import Master Data (Hotels, Guides, Transport, Drivers)
1. Use `MasterData_Import_Template.xlsx`.
2. Navigate to **[Master Data](/master-data)** $\rightarrow$ Click **Import Master Data** $\rightarrow$ Upload file.
3. **Result**: Ingests new supplier records and contract rates without creating duplicate supplier entries.

### 🔹 Scenario 5: Import Excursion Sales for an EXISTING Tour
1. Download template `{ProjectName}_{TourCode}_importSales.xlsx` from Tour Detail page.
2. Mark excursion participation checkboxes (`☑`) for passengers and upload.
3. **Result**: Creates optional excursion sales lines, calculates 10% guide commission, and updates net tour profitability.
