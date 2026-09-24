---
id: tours-manual-vs-excel-import
title: Manual Web UI Entry vs Automated Excel Import Workflows
category: Tours
subTopic: Excel Import
targetUrl: /master-data?tab=excelImport
actionLabel: Open Excel Import Hub
applicableRoles: [Administrator, TourAdmin]
tags: [manual entry, excel import, rooming list, sales file, templates, download sale file button]
triggerQueries:
  - "When should I use manual entry vs Excel import?"
  - "Why is the Download Sale File button missing or disabled?"
  - "Where can I find the Excel import templates?"
  - "How do I download the sales template for an existing tour?"
---

# 🔄 Tours - Manual Entry vs Excel Import Guide

## 💡 Executive Summary & Core Purpose
**UNO ERP** supports two complementary ways to manage tour data:
1. **Manual Web UI Entry**: Ideal for single-item adjustments, urgent phone bookings, or ad-hoc service line additions.
2. **Automated Excel File Import**: Optimized for high-volume operations, bulk passenger manifests (30+ pax), and post-tour excursion sales settlements.

---

## 🆚 Operational Comparison: Manual Entry vs. Excel Import

| Operational Task | Manual Web UI Entry | Automated Excel Import | Best Recommended Use |
| :--- | :--- | :--- | :--- |
| **Tour Creation** | Fill modal form in Tours grid $\rightarrow$ Click `Save Tour`. | Upload `{Project}_{Tour}_rooming.xlsx`. | Automated import for full tour packages. |
| **Passenger Rooming** | Add passengers one by one in Bookings tab. | Upload rooming template sheet. | Automated import (saves 45+ minutes per departure). |
| **Excursion Sales** | Check passenger attendance boxes manually in Services tab. | Upload `{Project}_{Tour}_importSales.xlsx`. | Automated import for fast bus group settlement. |
| **Supplier Master Data** | Add suppliers one by one via Master Data modal. | Ingest `MasterData_Import_Template.xlsx`. | Automated import for seasonal contract loading. |

---

## 🟢 Critical Rule: The "Download Sale File" Button Prerequisite

> [!IMPORTANT]
> **Passenger Prerequisite Rule**: The green **`Download Sale File`** button on the Bookings tab will **ONLY** appear once the passenger rooming list has been uploaded (`allPassengers.length > 0`). 
> - If no passengers exist for the tour, the button is deliberately hidden.
> - Once rooming data is imported, the button activates, allowing you to download an Excel sheet pre-populated with passenger names and checkboxes ready for on-bus sales recording.

---

## 📂 Standardized Import File Locations & Templates
All standardized templates are located under: `UserManuals/ImportFiles/20260828/`
1. **`Rooming_import_template.xlsx`**: Tours and passenger rooming manifests.
2. **`Sales_import_template.xlsx`**: Pre-formatted excursion sales lines.
3. **`MasterData_Import_Template.xlsx`**: Hotels, Guides, Transport Companies, and Drivers.
