---
id: metadata-statuses-permissions-checkpoints
title: Master Data Configuration, Role Permissions Matrix & Access Control
category: Metadata
subTopic: Role Permissions
targetUrl: /settings
actionLabel: View User & Role Permissions
applicableRoles: [Administrator]
tags: [permissions, role matrix, administrator, touradmin, manager, guide, access rights, passwords, audit logs, security]
triggerQueries:
  - "What are the role permissions for Administrator, TourAdmin and Guides?"
  - "How to configure screen access rights?"
  - "How to configure role access?"
  - "How to add a new user?"
  - "What are password masking and viewing rules?"
  - "How does the Screen Access Rights Matrix work?"
---

# 🚦 Metadata - Statuses, Roles, Permissions & Access Control

## 💡 Executive Summary & Core Purpose
**Security & Access Control** in **UNO ERP** operates on a granular **Role-Based Access Control (RBAC)** architecture. 

System administrators can configure permissions per role across all system screens, enforce password visibility policies, and audit administrative actions.

---

## 🔒 1. Standard Role Definitions

* **`Administrator`**:
  - Unrestricted read, write, update, delete, status override, and user administration rights across all modules.
  - Exclusive access to unmask plain-text passwords (`👁`) and modify the Screen Access Rights Matrix.
* **`TourAdmin / Manager`**:
  - Operational control over Projects, Tours, Rooming manifests, Services & Costing, and Status Gate advancements.
  - Restricted from editing system roles or viewing employee credentials.
* **`Guide / Read-Only User`**:
  - Can view assigned tour itineraries, rooming lists, and mark optional excursion attendance.
  - Cannot modify vendor rates or advance checkpoint gates.

---

## 📋 2. Step-by-Step UI Actions

### 🔹 How to Add a New User Account
1. Navigate to **[User Accounts & Role Management](/settings)**.
2. Click the purple **`+ Add New User`** button at the top right.
3. Enter Full Name, Email, Password, and select Role (`Administrator`, `TourAdmin`, `Manager`).
4. Click **`Create Account`** to save.

### 🔹 Password Masking & Security Rules
* All user account passwords are strictly masked (`••••••••`) by default in the grid.
* **Administrators Only**: An eye icon button (`👁`) is rendered next to the password column to toggle plain text view.
* Non-admin users see bullets only with no toggle option.

### 🔹 How to Configure Screen Access Rights (Matrix)
1. Go to **[User & Role Access Management](/settings)**.
2. Click the **Screen Access Rights Matrix** tab.
3. Select the role (`Administrator`, `TourAdmin`, `Manager`, or custom role).
4. Check or uncheck **View, Entry (Create), Update (Edit), Delete** for each screen.
5. Click **Save Permissions Matrix**.

---

## 🏷️ 3. Tax Rates & Agency Discounts
* **City Tax & VAT**: Configurable percentage rates applied automatically during tour revenue & invoice generation.
* **Agency Discounts**: Special commercial discounts applied to gross base tour fees for partner tour operators.
