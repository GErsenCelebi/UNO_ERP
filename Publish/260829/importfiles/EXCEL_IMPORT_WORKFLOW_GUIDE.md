# 📘 UNO ERP - Comprehensive Excel Import Workflow & Step-by-Step Guide

This guide details the complete Excel Import workflow in UNO ERP. It explains **which file must be imported first**, the mandatory sequence of steps, data dependencies, passenger list prerequisites, and how the AI Assistant helps users navigate the import process.

---

## 🎯 **Overview of the 3 Official Import Files**

To ensure 100% data integrity without missing foreign key references, UNO ERP uses **3 official template files** stored in `C:\Ersen\Projects_2025\Uno_ERP\Publish\260829\importfiles\`:

1. **`MasterData_Import_Template_v2.xlsx`** $\rightarrow$ *Master Data (Hotels, Guides, Transport, Drivers, Excursions)*
2. **`Orta Avrupa -BVP_PVB05072026_importroomingV4.xlsx`** $\rightarrow$ *Tour & Passenger Rooming List*
3. **`Orta Avrupa -BVP_PVB05072026_importSalesV4.xlsx`** $\rightarrow$ *Excursion Sales & Base Services Report*

---

## 🔄 **Mandatory Step-by-Step Import Workflow**

```mermaid
flowchart TD
    A["Step 1: Master Data Import (MasterData_Import_Template_v2.xlsx)"] --> B["Step 2: Tour & Rooming List Import (importroomingV4.xlsx)"]
    B --> C{"Passengers Uploaded? (allPassengers.length > 0)"}
    C -- Yes --> D["Step 3: Green Download Sale File Button Appears"]
    C -- No --> E["Button Hidden / Unavailable until Rooming List Uploaded"]
    D --> F["Step 4: Excursion Sales Import (importSalesV4.xlsx)"]
```

---

### 1️⃣ **STEP 1 (ALWAYS FIRST): Master Data Import**
> [!IMPORTANT]
> **Why First?** Tours, hotels, excursion calculations, transport, and guide assignments rely on pre-existing Master Data. If you try to import a rooming file before importing hotels, the system will not be able to match hotel names or pricing rates.

* **File Name**: `MasterData_Import_Template_v2.xlsx`
* **Target Screen**: Navigation Sidebar $\rightarrow$ **Master Data** $\rightarrow$ Click **Import Master Data** button.
* **What it Imports**:
  * **Hotels Sheet**: Hotel Name, Location, Star Rating, **Pricing Basis (`Pax` vs `Room`)**, Single Room & Pax Rates, Double Room & Pax Rates, Twin Room & Pax Rates, Triple Room & Pax Rates, Contact Person, Email, and Phone.
  * **Guides Sheet**: Guide Names, Languages spoken, Daily Rates, Phone Numbers.
  * **Transport Sheet**: Bus/Transport Companies, Daily Rates, Fleet Size, Contact Details.
  * **Drivers Sheet**: Driver Names, Assigned Transport Companies, Phone Numbers, Daily Rates.
  * **Excursions Sheet**: Excursion Names, Cities, Vendor Names, Adult/Child Costs, and Selling Prices.

---

### 2️⃣ **STEP 2: Tour & Passenger Rooming List Import**
> [!NOTE]
> Once Master Data is loaded, you import the tour contract, project, and passenger rooming list.

* **File Name**: `Orta Avrupa -BVP_PVB05072026_importroomingV4.xlsx`
* **Target Screen**: Navigation Sidebar $\rightarrow$ **Tours** (or **Projects**) $\rightarrow$ Click **Import Rooming List**.
* **What it Creates & Imports**:
  * **Projects Sheet**: Creates/resolves the Project (e.g. `PRJ-BVP1` / `Tests 20260829`).
  * **Tours Sheet**: Creates the Tour (`BVP05072026`) and automatically sets its initial status to **`Draft` (`TourStatusId = 1` / First Status on Dashboard)**.
  * **Rooming Sheet**: Imports all 30 Passengers, groups family bookings (`BKG-01` to `BKG-15`), assigns `Room Numbers`, maps `Pax Type` (`Adult`, `Children`, `Infant`), and attaches child badges.

---

### 3️⃣ **STEP 3: Download Pre-populated Sales Template (Prerequisite: Rooming List Uploaded)**
> [!IMPORTANT]
> **Green Button Availability**: The green **`Download Sale File`** button will **ONLY** appear once the passenger rooming list has been uploaded and passengers exist for the tour (`allPassengers.length > 0`). If no rooming list has been uploaded yet, the download button is hidden.

* **How it Works**:
  1. Once Rooming List passengers are uploaded in Step 2, navigate to the Tour Details page.
  2. Click the **Bookings** tab.
  3. The green **`Download Sale File`** button is now visible next to the passenger search input.
* **Output File**: Generates `{ProjectCode}_{TourCode}_importSales.xlsx` (e.g. `PRJ-BVP1_PVB05072026_importSales.xlsx`).
* **Detailed Passenger Pre-population**:
  * Automatically populates **all passengers in full detail** row by row.
  * Children under 18 are highlighted in **red font with a `(CHD)` badge**.
  * Renders interactive drop-down checkboxes (`☐` / `☑`) for every excursion across all passengers.

---

### 4️⃣ **STEP 4: Excursion Sales & Base Services Import**
> [!NOTE]
> After the guide or tour leader marks which passengers attended which excursions, upload the completed sales file.

* **File Name**: `Orta Avrupa -BVP_PVB05072026_importSalesV4.xlsx` (or the downloaded sale file).
* **Target Screen**: Tour Details page $\rightarrow$ **Services** tab $\rightarrow$ Click **Import Excursion Sales**.
* **What it Calculates & Imports**:
  * **ExcusionSales Sheet**: Parses `☑` checked boxes, calculates total quantities per excursion, creates Revenue and Expense lines for the tour.
  * **Guide Commission**: **Strictly calculates 10% of total excursion sales**. If no excursions are sold (or total sales $= 0$), Guide Commission is strictly set to **€0.00**.
  * **BaseServices Sheet**: Imports agency fees and city tax entries.

---

## 🤖 **AI Assistant Query Quick Reference**

When users ask the AI Assistant about Excel imports, the assistant references the following rules:

| User Question | AI Assistant Answer |
| :--- | :--- |
| **"Which Excel file do I import first?"** | You MUST import **`MasterData_Import_Template_v2.xlsx` FIRST** under the Master Data menu to establish hotels, rates, guides, and excursions before importing tours. |
| **"Why is the green Download Sale File button not showing?"** | The green **`Download Sale File` button ONLY appears after the Rooming List has been uploaded**. If no passengers exist for the tour, the button remains hidden until passenger data is imported. |
| **"What happens when I click Download Sale File?"** | Once rooming list passengers are uploaded, clicking the green button generates an Excel file pre-populated with **all passengers in full detail** (with `(CHD)` badges for children) and interactive excursion checkboxes (`☐`/`☑`). |
| **"What status will my imported tour have?"** | All imported tours automatically start at the **first dashboard status (`TourStatusId = 1` / Draft)**. |

---

## 📁 **File Storage Locations**

All official import templates and documentation are preserved in:
* **Import Templates Directory**: [`C:\Ersen\Projects_2025\Uno_ERP\Publish\260829\importfiles\`](file:///C:/Ersen/Projects_2025/Uno_ERP/Publish/260829/importfiles/)
* **AI Knowledge User Manuals Directory**: [`C:\Ersen\Projects_2025\Uno_ERP\UserManuals\EXCEL_IMPORT_WORKFLOW_GUIDE.md`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/EXCEL_IMPORT_WORKFLOW_GUIDE.md)
