# 🚌 Tours - Creation, Status Rules & Rooming List Import

Tours are the core operational units in UNO ERP. Each Tour represents a specific departure date and itinerary (e.g. `PVB05072026` departing July 5, 2026 for Prague-Vienna-Budapest).

---

## 🛠️ **How to Create a Tour**

### **1. Manual Creation via Web UI**
1. Navigate to **Tours** in the left sidebar.
2. Click **`+ Add Tour`**.
3. Fill in Tour Code, Destination, Start/End Dates, Flight Details, and assign to a Project.
4. Upon creation, the tour is automatically assigned `TourStatusId = 1` (**`Draft`** — the first status on the Kanban Dashboard).

### **2. Automated Creation via Rooming List Import (`Rooming_import_template.xlsx`)**
1. Navigate to **Tours** or **Projects** $\rightarrow$ Click **`Import Rooming List`**.
2. Select `Rooming_import_template.xlsx` from `Shared Drive/UnoERP/ExcelImportFiles/`.
3. The system parses:
   * **Tours Sheet**: Creates the Tour record automatically with status set to **`Draft`**.
   * **Rooming Sheet**: Imports all passengers, booking codes (`BKG-01` to `BKG-15`), room numbers, and pax types (`Adult`, `Child`, `Infant`).

---

## 👥 **Passenger Rooming List Management & Pax Types**

* **Pax Type Definitions**:
  * **`Adult`**: Standard passenger paying full excursion and hotel rates.
  * **`Child (CHD)`**: Passengers under 18 years of age. Highlighted in **red text with a `(CHD)` badge** in rooming lists and excursion sales grids.
  * **`Infant`**: Infants requiring no separate bed or excursion seat.
* **Family Booking Groups**: Passengers sharing the same booking reference (e.g. `BKG-01`) are automatically grouped into shared hotel room numbers (Single, Double, Twin, Triple).

---

## 🚦 **Initial Tour Status Rules**

> [!IMPORTANT]
> **Draft Default Rule**: Every newly created or imported tour strictly starts in **`Draft` (`TourStatusId = 1`)**. It cannot jump directly to `Confirmed` or `Completed` without passing through mandatory **Status Checkpoints** (such as guide assignment and rooming verification).
