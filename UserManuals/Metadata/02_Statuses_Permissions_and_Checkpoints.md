# 🚦 Metadata - Statuses, Order, Checkpoints, Roles, Taxes & Discounts

This document details the central metadata governance rules in UNO ERP, including tour status lifecycles, mandatory checkpoints, role access permissions, tax rates, and discount structures.

---

## 🔁 **1. Tour Statuses & Lifecycle Order**

Tours transition sequentially across 5 ordered status stages:

| Order Index | Status Name | System Behavior & Business Rule |
| :---: | :--- | :--- |
| **1** | **`Draft`** | Initial status upon creation/import. Editable rooming and service lines. |
| **2** | **`Confirmed`** | Requires Guide + Bus assignment and verified rooming list. |
| **3** | **`In Progress`** | Tour is currently departing/active on location. |
| **4** | **`Completed`** | Passengers returned; excursion sales and guide commissions finalized. |
| **5** | **`Accounting Closed`** | Invoices issued, operator remittance verified. Locks financial edits. |

---

## ✅ **2. Mandatory Status Checkpoints**

Before a tour can advance to the next status on the Kanban Dashboard, all **Checkpoints** for the current status must pass:
* **Draft → Confirmed**: Guide assigned (`GuideId != null`), Transport assigned (`BusCompanyId != null`), Passenger count $> 0$.
* **In Progress → Completed**: Excursion sales check boxes recorded, Guide commission calculated.
* **Completed → Accounting Closed**: Invoice generated, cash remittance verified.

---

## 🔒 **3. Role Access Permissions**

* **`Administrator`**: Full read, write, update, delete, status override, and user management privileges.
* **`TourAdmin / Manager`**: Can create tours, import rooming/sales files, edit tour services, and advance tour statuses.
* **`Read-Only User / Guide`**: Can view tour itineraries, rooming lists, and mark excursion attendance.

---

## 🏷️ **4. Tax Rates & Agency Discounts**

* **Tax Settings**: Configurable VAT / City Tax percentage rates applied during invoice generation.
* **Agency Discounts**: Special agency discount percentages applied to gross base tour fees for partner operators.
