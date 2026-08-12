# UNO ERP - End-to-End Comprehensive User Manual & Data Import Guide

**System:** UNO ERP (Travel Operations ERP & DMC Management Platform)  
**Version:** 2.0  
**Target Audience:** System Administrators, Tour Operators, Operation Managers, Guides, and Financial Analysts.

---

## Table of Contents
1. [Overview & System Architecture](#1-overview--system-architecture)
2. [Master Data Management & Batch Upload](#2-master-data-management--batch-upload)
3. [Project Creation & Life Cycle Management](#3-project-creation--life-cycle-management)
4. [Tour Header & Rooming File Upload](#4-tour-header--rooming-file-upload)
5. [Guide Excursion & Base Sales Workflow](#5-guide-excursion--base-sales-workflow)
   - 5.1 [Downloading the Passenger Sales File](#51-downloading-the-passenger-sales-file)
   - 5.2 [ExcursionSales Sheet Structure & Interactive Checkboxes](#52-excursionsales-sheet-structure--interactive-checkboxes)
   - 5.3 [BaseServices 10-Column Sheet Structure](#53-baseservices-10-column-sheet-structure)
   - 5.4 [Re-uploading Completed Sales Files](#54-re-uploading-completed-sales-files)
6. [Application Screen Field Mappings](#6-application-screen-field-mappings)
7. [Troubleshooting & Import Best Practices](#7-troubleshooting--import-best-practices)

---

## 1. Overview & System Architecture

UNO ERP handles complete Travel & DMC operations through a 5-level relational entity hierarchy:
```
1. CLIENT (Root Corporate Customer / Agency)
   └── 2. PROJECT (Group Account / Project Code, e.g. PRJ-BVP2)
        └── 3. TOUR (Group Operation / Tour Code, e.g. PVB05072026)
             ├── 4. PASSENGERS & ROOMING (Pax Manifest, Room Allocations)
             └── 5. TOUR SERVICES & FINANCIALS (Hotels, Transfers, Excursions, Invoices)
```

The system provides a **Dual Operations Engine**:
- **Manual Form Entry:** Interactive UI screens (`/master-data`, `/projects`, `/projects/[id]/tours/[tourId]`) for manual creation and instant validation.
- **Batch Excel Stream Processing:** 3-Section Import Engine on `/master-data` with automatic temporary lock file (`~$`) skipping, header normalization, and transaction safety.

---

## 2. Master Data Management & Batch Upload

Master Data forms the foundation of all ERP operations. Master records can be managed manually or batch uploaded via Section 1 of the `/master-data` import page.

### 2.1 Excel Master Data File Format
- **File Name:** `MasterData_Import_Template.xlsx` (or any `.xlsx` file containing standard sheets).
- **Supported Sheets:**
  1. `Clients`: Corporate customer accounts (`Name`, `TaxNo`, `ContactEmail`, `Phone`, `Address`, `BaseCurrency`).
  2. `Hotels`: Hotel partners (`Name`, `City`, `StarRating`, `SingleRate`, `DoubleRate`, `ContactPerson`).
  3. `Guides`: Tour guides (`FirstName`, `LastName`, `Languages`, `DailyRate`, `Phone`).
  4. `Drivers`: Vehicle drivers (`FirstName`, `LastName`, `LicenseType`, `Phone`, `TransportCompany`).
  5. `TransportCompanies`: Logistics vendors (`Name`, `FleetSize`, `ContactEmail`, `Phone`).
  6. `Vendors`: Third-party suppliers (`Name`, `ServiceType`, `ContactName`, `Email`, `Phone`).
  7. `Excursions`: Activity catalog (`Name`, `TourCode` / Excursion Code e.g. `PRG-KV`, `Price`, `SalePrice`, `Vendor`).

### 2.2 Upload Workflow
1. Navigate to `/master-data` in the application header menu.
2. Scroll to **Section 1: Master Data Import**.
3. Drag and drop `MasterData_Import_Template.xlsx` or click **Browse File**.
4. Click **Import Master Data**.
5. The API parses each sheet, creates database entries, and populates drop-down selectors across the entire system.

---

## 3. Project Creation & Life Cycle Management

A **Project** groups individual tour operations under a single client contract (e.g. `PRJ-BVP2` for Central Europe Summer 2026).

### 3.1 Manual Project Creation
1. Navigate to `/projects`.
2. Click the **+ New Project** button in the top-right toolbar.
3. Fill in the required fields:
   - **Client:** Select existing Client (e.g. `Bonavita Travel`).
   - **Project Code:** Unique alphanumeric code (e.g. `PRJ-BVP2`).
   - **Start & End Dates:** Contract execution period.
   - **Approx. Budget:** Overall project revenue target.
   - **Status:** Initial status (`Planning`, `Active`, `Closed`).
4. Click **Save Project**.

### 3.2 Automatic Project Creation via File Import
When importing Tour Rooming files (`TourImportTemplate.xlsx`), if the file header references a `ProjectCode` (e.g. `PRJ-BVP2`) that does not yet exist in the system, the import engine automatically creates the Project record under the specified Client!

---

## 4. Tour Header & Rooming File Upload

Tour rooming files import tour operational parameters, hotel room allocations, and the complete passenger manifest.

### 4.1 File Name & Format Requirements
- **File Name Example:** `5-12_Temmuz_Levent_importrooming.xlsx` or `PRJ-BVP2_PVB05072026_rooming.xlsx`.
- **Required Sheets:**
  1. `Booking` (or `Tours`): Contains tour parameters (`TourCode`, `ArrivalDate`, `EndDate`, `FlightNo`, `Pax`, `Adults`, `Children`, `Infants`).
  2. `Rooming`: Contains passenger and rooming details (`Yolcu Soyadı`, `Yolcu Adı`, `DateOfBirth`, `PassportNo`, `Gender`, `NationalId`, `RoomType`, `Pax`).

### 4.2 Field Extraction & Normalization
The import engine handles truncated or Turkish Excel headers automatically:
| Excel Column Header | Target Field | System Logic |
| :--- | :--- | :--- |
| `Yolcu Soyadı` / `Soyadı` | `LastName` | Extracted into dedicated Surname field |
| `Yolcu Adı` / `Adı` | `FirstName` | Extracted into First Name field |
| `Doğum Tar` / `Doğum Tarihi` | `DateOfBirth` | Parsed to DateTime (`dd.MM.yyyy`) |
| `Pasaport N` / `Pasaport No` | `PassportNo` | String passport identification |
| `Cinsiyet` | `Gender` | `M` / `F` / `Male` / `Female` |
| `T.C. Kimlik` / `TC No` | `NationalId` | National Identity Number |
| `Oda Tipi` / `RoomType` | `RoomType` | Single, Double, Triple |

### 4.3 UI Screen Mapping
Once imported, tour rooming data appears on the **Tour Details Page** (`/projects/[id]/tours/[tourId]`):
- **Tour Header Banner:** Displays Tour Code, Arrival/Departure dates, Flight details, and total Pax breakdown (Adults, Children, Infants).
- **Passenger List Card:**
  - Dedicated **First Name** and **Surname** columns for clear identification.
  - Automatic **`(CHD)` Child Flagging**: Passengers under 18 years of age on Arrival Date are flagged with `(CHD)` appended to their name, rendered in bold red text with a light golden highlight row.

---

## 5. Guide Excursion & Base Sales Workflow

In real-world DMC operations, rooming files are imported first. On-tour excursion sales and base service costs are collected by tour guides during execution and imported later.

### 5.1 Downloading the Passenger Sales File
To generate a pre-populated sales report template for a tour:
1. Open the target tour page (`/projects/[id]/tours/[tourId]`).
2. Navigate to **Tab 3: Bookings & Manifest**.
3. In the top-right header of the **Passenger List** card, click **Download Sale File for Passenger List**.
4. The browser downloads a custom Excel file formatted as `{ProjectCode}_{TourCode}_importSales.xlsx` (e.g. `PRJ-BVP2_PVB05072026_importSales.xlsx`).

### 5.2 ExcursionSales Sheet Structure & Interactive Checkboxes
The generated `ExcusionSales` worksheet contains:
- **Header Rows:**
  - **Row 1 (`Dates`):** Excursion execution dates.
  - **Row 2 (`Prices`):** Excursion unit prices (e.g. `65`, `35`, `120`).
  - **Row 3 (`Code`):** Official Excursion Codes (e.g. `PRG-KV`, `PRG-Folklor`, `BDP-Boat`, `VN-Hallstat`, `BDP-VDP`, `PRG-Dresden`, `PromoNightPack`, `PromoDayPack`).
  - **Row 4 (`Passenger Name`):** Passenger full names, with `(CHD)` appended and styled in Red for child passengers.
- **Interactive Checkboxes:**
  - All passenger $\times$ excursion grid cells default to **`☐`** (*Unchecked Ballot Box*).
  - Excel Data Validation list `"☐,☑"` is applied to all cells. Selecting a cell presents a dropdown to toggle between **`☐`** (*Unchecked*) and **`☑`** (*Checked*).
- **Dynamic Excel Calculation Formulas (Bottom Rows):**
  - **Row `lastPax + 2` (`Count`):** Formula `=COUNTIF(B5:B49, "☑") + COUNTIF(B5:B49, TRUE)` dynamically counts total checked passengers per excursion based on actual Pax count.
  - **Row `lastPax + 3` (`Total Amount`):** Formula `=B51*B2` multiplies the total count by the excursion price in Row 2.

### 5.3 BaseServices 10-Column Sheet Structure
The `BaseServices` worksheet controls core tour operational fees:
- **Columns:** `Base Service`, `Revenue`, `Expense`, `Other`, `per/Pax`, `UnitPrice`, `Adult`, `Children`, `Infant`, `Total`.
- **Default Rows:** `Agency Fee`, `CityTax`.
- **Checkboxes:** Columns B, C, D, E contain interactive `☐` / `☑` checkboxes.

### 5.4 Re-uploading Completed Sales Files
After the tour guide checks off sold excursions and base services in Excel:
1. Save the updated `{ProjectCode}_{TourCode}_importSales.xlsx` file.
2. Navigate to `/master-data`.
3. Scroll to **Section 3: Tour Sales & Base Services Import**.
4. Upload the completed sales file.
5. The API parses all checked `☑` cells, calculates financial revenues and costs, updates tour total revenue/expenses, and attaches sold excursions to individual passenger records!

---

## 6. Application Screen Field Mappings

| Application Screen | Tab / Section | Excel Source Field | Field Description |
| :--- | :--- | :--- | :--- |
| `/master-data` | Section 1 | `MasterData_Import_Template.xlsx` | Seeds Clients, Hotels, Guides, Drivers, Transport Co, Vendors, Excursions |
| `/projects/[id]` | Header | `TourImportTemplate.xlsx` | Project Code, Project Description, Client association |
| `/projects/[id]/tours/[tourId]` | Tab 1: Tour Info | `Booking` / `Tours` Sheet | Tour Code, Arrival/Departure Dates, Flights, Airport Codes, Pax Counts |
| `/projects/[id]/tours/[tourId]` | Tab 3: Passengers | `Rooming` Sheet | Passenger First Name, Surname, Date of Birth, Passport No, Gender, Room Type |
| `/projects/[id]/tours/[tourId]` | Tab 3: Card Header | System Generator | **Download Sale File for Passenger List** button |
| `/projects/[id]/tours/[tourId]` | Tab 2 & Tab 4 | `SalesImportTemplate.xlsx` | Base Services, Excursion Sales, Total Revenues, Operating Expenses & Profit Margin |

---

## 7. Troubleshooting & Import Best Practices

1. **Excel Lock Files (`~$`):** If an Excel file is open in Microsoft Excel, temporary files starting with `~$` are automatically ignored by the UNO ERP import engine.
2. **Date Format:** Ensure dates in Excel use standard `dd.MM.yyyy` or `yyyy-MM-dd` format.
3. **Child Passenger Flagging:** Passengers under 18 years old on the tour arrival date are automatically detected, flagged with `(CHD)` in sales exports, and styled with red text.
4. **Duplicate Excursions:** When uploading sales files, re-uploading an updated sales file cleanly recalculates tour services without creating duplicate entries.
