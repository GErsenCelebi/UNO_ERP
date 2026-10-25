# 📊 Complete Step-by-Step Excel Import Workflow Guide (UNO ERP)

This official guide explains how to import Excel files into UNO ERP for all scenarios (New Projects, Existing Projects, New Tours, Existing Tours, Rooming Lists, Master Data, and Excursion Sales).

---

## 📁 1. Filename Naming Conventions & Notation

Follow these exact filename patterns so UNO ERP can automatically identify your Project and Tour:

1. **New or Existing Project + New Tour**:
   * **Notation Pattern**: `{ProjectName}_{TourCode}_rooming.xlsx`
   * **Example**: **`Project1_Tour1_rooming.xlsx`** *(or `Orta Avrupa BVP_BVP28082026_rooming.xlsx`)*
2. **Existing Tour Rooming List Update**:
   * **Notation Pattern**: `{TourCode}_rooming.xlsx`
   * **Example**: **`Tour1_rooming.xlsx`** *(or `BVP28082026_rooming.xlsx`)*
3. **Excursion Sales & Base Fees**:
   * **Notation Pattern**: `{ProjectName}_{TourCode}_importSales.xlsx`
   * **Example**: **`Project1_Tour1_importSales.xlsx`**
4. **Master Data Catalog**:
   * **Notation Pattern**: `MasterData_Import_Template.xlsx`

---

## 📊 2. Required Worksheet Names & Column Details

### 🔹 **Sheet A: `Tours` (or `Tour`, `tour`, `tours`, `TourData`)**
* **Col A (`Cell 1`)**: `Tour Code` (e.g. `Tour1` or `BVP28082026`). *[Required]*
* **Col B (`Cell 2`)**: `Project Code / Name` (e.g. `Project1` or `Orta Avrupa BVP`).
* **Col C (`Cell 3`)**: `Destination` (e.g. `Prague-Vienna-Budapest`).
* **Col D (`Cell 4`)**: `Arrival Date` (e.g. `28.08.2026`).
* **Col E (`Cell 5`)**: `End Date` (e.g. `04.09.2026`).
* **Col F-I (`Cells 6-9`)**: `Adults`, `Children`, `Infants`, `Pax`.

### 🔹 **Sheet B: `Projects` (or `Project`, `project`, `projects`)**
* **Col A (`Cell 1`)**: `Project Code / Name` (e.g. `Project1`).
* **Col B (`Cell 2`)**: `Client Name` (e.g. `UNO DMC`).

### 🔹 **Sheet C: `Rooming` (or `Rooms`, `rooming`, `rooms`, `Passengers`)**
* **Col A (`Cell 1`)**: `Passenger Full Name` (e.g. `John Doe`).
* **Col B (`Cell 2`)**: `Gender` (`M` / `F`).
* **Col C (`Cell 3`)**: `Pax Type` (`Adult`, `Child` / `CHD`, `Infant`).
* **Col D (`Cell 4`)**: `Booking Ref` (e.g. `BKG-01`, `BKG-02`).
* **Col E (`Cell 5`)**: `Room Number` (e.g. `101`, `102`).
* **Col F (`Cell 6`)**: `Room Type` (`Single`, `Double`, `Twin`, `Triple`).

### 🔹 **Sheet D: `Flights`**
* **Row 2**: Arrival Flight No (`Cell 1`), Arrival Airport (`Cell 3`), Arrival Date (`Cell 4`).
* **Row 3**: Departure Flight No (`Cell 1`), Departure Airport (`Cell 2`), Departure Date (`Cell 4`).

### 🔹 **Sheet E: `Hotels` (Master Data Catalog)**
* **Col A**: Hotel Name | **Col B**: Location | **Col C**: Star Rating | **Col D**: Contact Name | **Col E**: Role | **Col F**: Email | **Col G**: Phone | **Cols H-O**: Nightly Room & Pax Rates (Single, Double, Twin, Triple) | **Col P**: Pricing Basis (`Pax` vs `Room`).

---

## 🛠️ 3. Detailed Step-by-Step Import Scenarios

### **Scenario 1: How to Import a NEW Tour for a NEW Project**
1. **Filename**: Name your file **`Project1_Tour1_rooming.xlsx`**.
2. **Projects Sheet**: In sheet `Projects`, set Col A = `Project1`, Col B = `Client Name`.
3. **Tours Sheet**: In sheet `Tours`, set Col A = `Tour1`, Col B = `Project1`, Col C = `Prague`, Col D = `28.08.2026`.
4. **Rooming Sheet**: In sheet `Rooming`, list passenger names, booking references (`BKG-01`), room numbers (`101`), and pax types.
5. **Execution**: Go to **Tours** or **Projects** screen → Click **Import Rooming List** → Select file.
6. **Result**:
   * UNO ERP automatically creates **`Project1`** on the fly with status **`Active`**.
   * UNO ERP creates **`Tour1`** linked to `Project1` and initializes status to **`Draft`** (first Kanban column).
   * All passengers and family rooming bookings are attached.

---

### **Scenario 2: How to Import a NEW Tour for an EXISTING Project**
1. **Filename**: Name your file **`Project1_Tour1_rooming.xlsx`** (or set `Tours` sheet Col B = `Project1`).
2. **Tours Sheet**: Set Col A = `Tour1`, Col B = `Project1`.
3. **Execution**: Click **Import Rooming List** → Select file.
4. **Result**:
   * UNO ERP searches the database, matches existing project **`Project1`**, creates **`Tour1`** in **`Draft`** status, and binds `Tour1` directly under `Project1`.

---

### **Scenario 3: How to Import / Refresh Rooming Data for an EXISTING Tour**
1. **Filename**: Name your file **`Tour1_rooming.xlsx`** (or `BVP28082026_rooming.xlsx`).
2. **Rooming Sheet**: Update passenger names, room numbers (`101`, `102`), or booking codes.
3. **Execution**: Click **Import Rooming List** → Select file.
4. **Result**:
   * UNO ERP matches existing tour **`Tour1`**.
   * Refreshes passenger rooming list and passenger counts (`Pax`, `Adults`, `Children`).
   * **Preserves all existing hotel accommodation lines, guide assignments, and transport services** attached to the tour.

---

### **Scenario 4: How to Import NEW vs EXISTING Master Data (Hotels, Guides, Transport, Excursions)**
1. **Filename**: Name your file **`MasterData_Import_Template.xlsx`**.
2. **Worksheets**: Fill `Hotels`, `Guides`, `Transport`, `Drivers`, `Excursions` sheets.
3. **Execution**: Go to **Master Data** screen → Click **Import Master Data** → Select file.
4. **Result**:
   * **For NEW Items**: Creates new supplier records in the Master Data catalog.
   * **For EXISTING Items**: Updates contract rates, contact numbers, or star ratings without duplicating records.

---

### **Scenario 5: How to Import Excursion Sales for an EXISTING Tour**
1. **Prerequisite**: Rooming list must already be uploaded so passenger IDs exist.
2. **Filename**: Download template **`Project1_Tour1_importSales.xlsx`** from Tour Detail page.
3. **Sales Sheet**: Mark excursion checkboxes (`☑`) for participating passengers.
4. **Execution**: Click **Import Tour Sales & Base Services** → Select file.
5. **Result**:
   * Creates optional excursion sales lines and calculates 10% guide commission and net operator revenue.
