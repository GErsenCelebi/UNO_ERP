---
id: projects-creating-updating
title: How to Create, Update & Manage Projects (Manual & Excel Workflows)
category: Projects
subTopic: Creating Projects
targetUrl: /projects
actionLabel: Open Projects Management
applicableRoles: [Administrator, TourAdmin]
tags: [create project, new project, edit project, rooming list import, auto create project, archive project]
triggerQueries:
  - "How to create a project manually or via Rooming List import?"
  - "How do I create a new project?"
  - "Can projects be automatically created from an Excel file?"
  - "How to edit or update an existing project?"
  - "How to archive completed projects?"
---

# 📁 Projects - How to Create, Update & Manage Projects

## 💡 Executive Summary & Core Purpose
Projects in **UNO ERP** can be created through two operational channels:
1. **Direct Web UI Creation**: For setting up contractual master agreements prior to receiving tour bookings.
2. **Automated Excel Rooming Ingestion**: On-the-fly creation whenever an unrecognised `ProjectCode` is detected in an imported rooming spreadsheet.

---

## 📋 Step-by-Step UI Guide

### 🔹 Method 1: Creating a Project Manually via the Web UI
1. Navigate to **[Projects](/projects)** in the left navigation sidebar.
2. Click the purple **`+ Add Project`** button at the top right of the grid.
3. In the creation modal, enter:
   * **Project Code**: Enter a unique alphanumeric code (e.g. `PRJ-BVP2026`).
   * **Client Name**: Select or type the client travel agency name (e.g. `Orta Avrupa BVP`).
   * **Start & End Dates**: Select contract validity period.
   * **Budget & Currency**: Enter contracted gross amount in Euros (€).
4. Click **`Save Project`**. The new project immediately appears in the grid and is ready for tour linking.

### 🔹 Method 2: Automatic Project Creation via Rooming List Import
1. Download template or format your file as `{ProjectName}_{TourCode}_rooming.xlsx` (e.g. `Project1_Tour1_rooming.xlsx`).
2. In the `Projects` worksheet, set Col A = `Project1` and Col B = `Client Name`.
3. In UNO ERP, navigate to **Tours** or **Projects** $\rightarrow$ Click **Import Rooming List**.
4. Upload the file. If `Project1` does not exist in the database, UNO ERP **automatically creates it with `Active` status** and immediately links the new tour under it.

---

## ✏️ Updating, Editing & Archiving Projects

* **Editing Details**: Click the **`Edit`** icon on any project row in the Projects grid to adjust client name, budget, or dates.
* **Viewing Linked Tours**: Click on any Project card or row to view all linked tour departures, total passenger counts, combined revenue, and cumulative profit margin.
* **Archiving Projects**: When all linked tours reach `Completed` or `Accounting Closed`, update project status to **`Archived`** to declutter active operational screens while preserving historical financial records.
