# 📁 Projects - How to Create, Update & Manage Projects

This guide details how to create and update Projects in UNO ERP using both manual UI controls and automated Excel import workflows.

---

## 🛠️ **Method 1: Creating a Project Manually via the Web UI**

1. Navigate to **Projects** in the left navigation sidebar.
2. Click the **`+ Add Project`** button at the top right of the grid.
3. In the project creation modal, enter the required fields:
   * **Project Code**: Enter unique code (e.g. `PRJ-BVP2026`).
   * **Client Name**: Select or type the travel agency name (e.g. `Orta Avrupa BVP`).
   * **Start & End Dates**: Select contract period.
   * **Budget & Currency**: Enter contracted revenue amount (€).
4. Click **`Save Project`**. The new project will appear in the Projects grid and become available for tour assignments.

---

## 📄 **Method 2: Automatic Project Creation via Rooming List Import**

When importing a Tour Rooming List Excel file (`Rooming_import_template.xlsx`):
* The system checks the **`Projects`** worksheet inside the file.
* If the `ProjectCode` specified in the Excel file does not yet exist in the database, UNO ERP **automatically creates the Project record** on the fly with `Status = Active`.
* All tours in the rooming list are automatically linked to this newly created Project.

---

## ✏️ **Updating & Editing Projects**

* **Editing Details**: Click the **`Edit`** icon on any project row in the Projects grid to update client name, budget, or dates.
* **Viewing Linked Tours**: Click on a Project row to view all linked tour departures, total passenger counts, combined revenue, and cumulative margin.
* **Archiving Projects**: Projects with completed tours can be set to `Status = Archived` to clean up active views while preserving historical financial reports.
