---
id: projects-overview-purpose
title: Projects Overview, Commercial Umbrella Contracts & Core Fields
category: Projects
subTopic: Overview & Purpose
targetUrl: /projects
actionLabel: Open Projects Overview
applicableRoles: [Administrator, TourAdmin, Manager]
tags: [projects, project code, commercial contract, client name, budget, umbrella, tours relationship]
triggerQueries:
  - "Why are Projects needed in UNO ERP and what are the most important fields?"
  - "What is a Project in UNO ERP?"
  - "How are Projects related to Tours?"
  - "What are the core fields for a Project?"
  - "What does Project Code mean?"
---

# 📁 Projects - Overview, Purpose & Core Fields

## 💡 Executive Summary & Core Purpose
In **UNO ERP**, a **Project** represents a commercial umbrella contract or master agreement with a B2B client agency (e.g. tour operator, travel agency, corporate client). 

Projects allow tour managers to group multiple individual tour operations (departures) under a single commercial contract, enabling macro-level budget tracking, consistent client pricing agreements, and aggregate executive profitability analysis.

---

## 🎯 Strategic Benefits of Projects

1. **Commercial Contract Grouping**: A single client agency may book 10 different departure dates for the "Prague-Vienna-Budapest" tour in a single season. Creating a Project allows you to track total contract revenue, total operational costs, and overall profitability across all 10 departures under one roof.
2. **Master Data & Pricing Consistency**: Projects bind tour departures to specific client pricing agreements, vendor rate sheets, and payment terms.
3. **Executive Dashboard Analytics**: Project-level dashboards aggregate performance KPIs (Pax volume, Gross Sales, Net Margin %, Unpaid Invoices) across all linked tours.

---

## 📋 Core Project Fields & Business Rules

| Field Name | Data Type | Business Rule & Significance |
| :--- | :--- | :--- |
| **`ProjectCode`** | String (Unique) | **Primary Commercial Identifier**: Used as a prefix for tour codes and Excel import filenames (e.g. `Project1`, `PRJ-BVP2026`). |
| **`ClientName`** | String | Name of the booking travel agency or tour operator (e.g. `Orta Avrupa BVP`, `BVP Travel`). Binds billing and invoice generation. |
| **`StartDate` & `EndDate`** | Date (dd/mm/yyyy) | Contract validity window. All linked tours must fall within these contractual bounds. |
| **`TotalBudget`** | Decimal (€) | Contracted budget or target gross revenue in Euros (€). Used for contract progress tracking and budget variance alerts. |
| **`Currency`** | String | Operational currency (Default: `EUR`). Base currency for all revenue and expense rollups. |
| **`Status`** | Status ID | Commercial lifecycle status (`Active`, `Draft`, `Completed`, `Archived`). |
| **`Description`** | Text | Contractual terms, payment milestones, and guide instruction highlights. |

---

## 🔗 Relationship to Tours & Metadata

* **Projects $\rightarrow$ Tours**: One Project contains many Tours (`1 : N` relationship). A Tour cannot exist without being assigned to a Project.
* **Projects $\rightarrow$ Metadata**: Project status flows, status checkpoints, and role access permissions are governed by central **Metadata Configuration & Status Checkpoints**.
