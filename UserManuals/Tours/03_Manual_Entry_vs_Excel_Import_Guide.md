# 🔄 Tours - Manual Entry vs Excel Import Guide

UNO ERP provides two flexible ways to manage tour data: **Manual Web UI Entry** and **Automated Excel File Import**.

---

## 🆚 **Comparison: Manual Entry vs Excel Import**

| Operational Task | Manual Web UI Entry | Automated Excel Import |
| :--- | :--- | :--- |
| **Tour Creation** | Fill form in Tours grid $\rightarrow$ Click `Save Tour`. | Import `Rooming_import_template.xlsx` (Creates Tour + Passengers). |
| **Passenger Rooming** | Add passengers one by one in Bookings tab. | Upload `Rooming_import_template.xlsx` (Populates 30+ passengers in seconds). |
| **Excursion Sales** | Check passenger attendance boxes manually in Services tab. | Upload `Sales_import_template.xlsx` or pre-populated sale file. |
| **Hotel Rates** | Edit hotel service lines in Services tab. | Import `MasterData_Import_Template.xlsx` (Hotels sheet). |

---

## 🟢 **Prerequisite Rule for Download Sale File Button**

> [!IMPORTANT]
> **Passenger Prerequisite**: The green **`Download Sale File`** button on the Bookings tab will **ONLY** appear once the passenger rooming list has been uploaded (`allPassengers.length > 0`). If no passengers exist for the tour, the button is hidden.

---

## 📂 **Standardized Shared Drive Import Files**

Location: `Shared Drive/UnoERP/ExcelImportFiles/`
1. `MasterData_Import_Template.xlsx` (Master Data)
2. `Rooming_import_template.xlsx` (Rooming List)
3. `Sales_import_template.xlsx` (Excursion Sales)
