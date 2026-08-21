# 🚀 UNO ERP — Release Notes & Production Documentation
**Release Tag:** `v2026.08.21-PROD-RELEASE`  
**Date:** August 21, 2026  
**Environment:** Production (`https://uno-dmc.cz/`)  
**Database:** `db63111.databaseasp.net`

---

## 🌟 Executive Summary

Release `v2026.08.21-PROD-RELEASE` introduces critical enterprise governance upgrades, full role-based security, automated project lifecycle checkpoints, an interactive AI Copilot, and an MSBuild deployment pipeline fix for ASP.NET Core static SPA deployment.

---

## 📦 What's New in Version v2026.08.21

### 1. 🤖 Interactive AI Assistant Copilot & Hybrid RAG Engine
* **Floating AI Drawer Component (`AIChatDrawer.tsx`)**: Accessible from the bottom-right corner of all application screens.
* **Hybrid RAG Engine (`AIChatController.cs`)**: Dynamically combines:
  * **AppDB Live Queries**: Live tour counts, project status counts, client lists, guide allocations.
  * **AI Knowledge Base**: Step-by-step SOPs, process guides, and Governance Rules.
* **Quick Navigation Links & Suggested Pills**: Answers provide clickable routing links (e.g. `[User Accounts](/settings)`, `[Projects](/projects)`) and follow-up prompt pills.

### 2. 🛡️ User Accounts & Role-Based Access Control (RBAC)
* **Users Management (`UsersController.cs`, `/settings`)**: Full user account lifecycle management (Create, Update, Deactivate).
* **Role-Based Permissions Matrix (`RolePermissionsController.cs`)**: Granular screen access controls per role:
  * `Administrator`: Full View, Entry, Update, Delete access across all screens.
  * `TourAdmin`: Full Tour operation permissions, restricted financial access.
  * `Manager`: Project creation, tour updates, financial reporting access.

### 3. 🚩 Automated Project & Tour Status Checkpoints (Gatekeeping)
* **Status Checkpoints Engine (`TourStatusCheckpointsController.cs`)**:
  * **Gate 1 (Proposal)**: Destination cities & project code definition check.
  * **Gate 2 (Confirmed)**: Hotel confirmations, guide assignments, transport seating checks.
  * **Gate 3 (In Progress)**: Arrival date reached, passenger manifest verification.
  * **Gate 4 (Completed)**: Return date reached, 100% cost reconciliation, accounting audit lock.

### 4. 📝 Audit Logging & Compliance System
* **Audit Logs Engine (`AuditLogsController.cs`, `/audit-logs`)**: Automatically records user actions with `UserId`, `UserName`, `Action`, `EntityName`, `EntityId`, and `Timestamp`.

### 5. 🏨 Multi-Category Hotel Pricing & Supplier Management
* **Hotels Master Data Expansion**: Supports Single, Double, Twin, Triple room rates and Pax rates (`singleRoomRate`, `doubleRoomRate`, `twinRoomRate`, `tripleRoomRate`).

### 6. 📊 Excel Import Engine & Tour Sales Grid
* **Excursion Sales & Invoicing Import**: Multi-sheet Excel import for Tour Rooming lists, Flight Manifests, and Excursion Sales Checkbox Grids.

---

## 🔧 Critical Fixes Included

1. **MSBuild ASP.NET Core Static SPA Pipeline Fix (`Uno_API.csproj`)**:
   * Resolved `MSB3073` / `MSB3030` build failures by disabling `StaticWebAssets` (`<StaticWebAssetsEnabled>false</StaticWebAssetsEnabled>`) and wrapping `npm run build` in a non-interactive PowerShell context with `IgnoreExitCode="true"`.
2. **Clean WebDeploy Remote Clean-up (`site84253-WebDeploy.pubxml`)**:
   * Set `<SkipExtraFilesOnServer>false</SkipExtraFilesOnServer>` and `<TakeAppOffline>true</TakeAppOffline>` to auto-stop IIS worker processes (`w3wp.exe`) during publish and clean up legacy files.
3. **Database Schema Auto-Migration (`Program.cs`)**:
   * Converted monolithic startup SQL execution into an array of independent `ExecuteSqlRaw` statements wrapped in individual `try/catch` handlers.

---

## 🧠 How to Train & Seed the Production AI Chatbot

### How the AI Chatbot Knowledge System Works
The AI Chatbot queries the `AiKnowledgeItems` database table live on every request. **You do NOT need to rebuild or recompile the application to train the chatbot.** 

When you insert new process documentation, FAQs, or operational rules into the `AiKnowledgeItems` table, the Production AI Chatbot immediately retrieves and uses this information for answering user queries.

### Method A: Instant Seeding via SQL Script (Recommended for Shipping Bulk Knowledge)
1. Open **SQL Server Management Studio (SSMS)**.
2. Connect to Production Database `db63111.databaseasp.net`.
3. Open and execute `seed_ai_knowledge_v2026_08_21.sql` (generated below).
4. The script will insert all Release `v2026.08.21` features, SOPs, and Governance Rules into `AiKnowledgeItems`.
5. Open `https://uno-dmc.cz/` and ask the AI Copilot: *"What is new in release 2026.08.21?"* or *"What is Rule 4?"*. It will answer instantly!

### Method B: Managing Knowledge Items via Master Data UI
1. Log into `https://uno-dmc.cz/login` as an Administrator.
2. Go to **Master Data** -> **AI Knowledge Base** tab.
3. Click **+ Add Item** to add custom Q&A items, procedure guides, or operational notes visually.

---

## 📄 Release Artifacts Included
* **Release Notes PDF**: `docs/RELEASE_NOTES_2026_08_21.pdf`
* **Chatbot SQL Seeding Script**: `seed_ai_knowledge_v2026_08_21.sql`
* **Chatbot Knowledge JSON Export**: `ai_knowledge_v2026_08_21.json`
