# 📁 Projects - Overview, Purpose & Core Fields

In UNO ERP, a **Project** represents a commercial umbrella contract or master agreement with a client agency (e.g. tour operator, travel agency, corporate client). Projects allow tour managers to group multiple individual tour operations under a single commercial contract.

---

## 🎯 **Why Projects Are Needed**

1. **Commercial Contract Grouping**: A single client agency may book 10 different departure dates for the "Prague-Vienna-Budapest" tour in a single season. Creating a Project allows you to track total contract revenue, total operational costs, and overall profitability across all 10 departures under one roof.
2. **Master Data & Pricing Consistency**: Projects bind tour departures to specific client pricing agreements, vendor rate sheets, and payment terms.
3. **Executive Dashboard Analytics**: Project-level dashboards aggregate performance KPIs (Pax volume, Gross Sales, Net Margin %, Unpaid Invoices) across all linked tours.

---

## 📋 **Most Important Project Fields**

When creating or viewing a Project in UNO ERP, the following key fields are required:

| Field Name | Description | Importance & Business Rule |
| :--- | :--- | :--- |
| **`ProjectCode`** | Unique commercial code (e.g. `PRJ-BVP1`, `TEST-20260829`). | **Primary Identifier**: Must be unique. Used as a prefix for tour codes and Excel import filenames. |
| **`ClientName`** | Name of the booking travel agency or tour operator (e.g. `Orta Avrupa BVP`, `BVP Travel`). | Links the project to the client for billing and invoice generation. |
| **`StartDate` & `EndDate`** | The overall contract validity window for all linked tour departures. | Ensures linked tour dates fall within the valid agreement period. |
| **`TotalBudget`** | Contracted budget or target gross revenue in Euros (€). | Used for contract progress tracking and budget variance alerts. |
| **`Currency`** | Operational currency (Default: `EUR`). | Base currency for revenue and expense calculations. |
| **`Status`** | Commercial status (`Active`, `Draft`, `Completed`, `Archived`). | Controls whether new tours can be assigned to the project. |
| **`Description`** | Commercial notes, contract reference numbers, special clauses. | Stores contractual terms and guide instruction highlights. |

---

## 🔗 **Relationship to Tours & Metadata**

* **Projects $\rightarrow$ Tours**: One Project contains many Tours (`1 : N` relationship).
* **Projects $\rightarrow$ Metadata**: Project status flows, status checkpoints, and role access permissions are governed by central **Metadata & Governance Rules**.
