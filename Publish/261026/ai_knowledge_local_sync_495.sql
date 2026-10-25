-- UNO ERP: Synchronize Production AiKnowledgeItems with Local UnoErpDb (495 items)
SET NOCOUNT ON;
BEGIN TRANSACTION;
DELETE FROM [AiKnowledgeItems];
SET IDENTITY_INSERT [AiKnowledgeItems] ON;
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (1, N'DocumentationRepo', N'01_Project_Charter_and_Scope.md', N'User Manual', NULL, NULL, N'How to 1. executive summary?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 1. Executive Summary

Uno ERP is a centralized, scalable operational platform designed for Destination Management Companies (DMC) and Incoming Tour Operators. It replaces legacy, non-scalable Excel-based workflows with a modern Web Application, enabling streamlined management of multi-city tours, supplier payments, guide settlements, and comprehensive profitability analysis.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.821Z', N'2026-09-17T07:52:58.172Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (2, N'DocumentationRepo', N'01_Project_Charter_and_Scope.md', N'User Manual', NULL, NULL, N'How to 2. business objectives?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 2. Business Objectives

- **Centralize Data:** Consolidate isolated Excel sheets into a single source of truth.
- **Scale Operations:** Enable seamless handling of complex, multi-city group itineraries (Leisure, Corporate, Congress, FIT).
- **Financial Visibility:** Track and manage both customer revenue and supplier/guide costs to calculate accurate net profit per project.
- **Task Automation:** Manage operational checklists (vouchers, confirmations, guide assignments) programmatically.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.855Z', N'2026-09-17T07:52:58.172Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (3, N'DocumentationRepo', N'01_Project_Charter_and_Scope.md', N'User Manual', NULL, NULL, N'How to 3. core domain concept: "the project"?', N'core, domain, concept, the, project, 01_project_charter_and_scope, heart, uno, erp, tour, acts, parent, container, for, clients, purchasing, entity, city, stays, independent, multi, routing, segments, prague, vienna', N'### 3. Core Domain Concept: "The Project"

At the heart of Uno ERP is the **Project** (or Tour). A Project acts as a parent container for:
- **Clients:** The purchasing entity.
- **City Stays:** Independent, multi-city routing segments (e.g., Prague -> Vienna -> Budapest).
- **Services:** Hotel Bookings, Transfers, Restaurants, and Activities linked directly to the City Stay.
- **Finances:** Invoices and payment ledgers associated with the specific Project.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.856Z', N'2026-09-17T07:52:58.173Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (4, N'DocumentationRepo', N'01_Project_Charter_and_Scope.md', N'User Manual', NULL, NULL, N'How to 4. mvp scope (phase 1)?', N'mvp, scope, phase, 01_project_charter_and_scope, ensure, rapid, delivery, and, feedback, focuses, dashboard, analytics, high, level, overview, active, projects, pending, financial, obligations, via, the, links, staff, can', N'### 4. MVP Scope (Phase 1)

To ensure rapid delivery and feedback, Phase 1 focuses on:
1. **Dashboard & Analytics:** High-level overview of active projects and pending financial obligations. Via the links on the dashboard, staff can drill down into the details of each Tour, overall status, and financials.
2. **Sales Pipeline (Kanban):** Tours start as Opportunities. A Kanban board tracks stages: Opportunity -> Quoted -> Confirmed -> Lost.
3. **Generic Schema-Driven Excel Import:** A dynamic UI staging grid allowing staff to import arbitrary Excel files from partners, map columns to the system JSON schema, edit/correct data, and commit to the database.
4. **Project & Client Management:** CRUD operations for core entities.
5. **Multi-City Itinerary Builder:** Managing City Stays and linking Hotel/Transfer services.
    *   3.1. Hotels CRUD
    *   3.2. Guides CRUD
    *   3.3. Suppliers 
        *   3.3.1 Transport Companies CRUD
            *   3.3.1.1 Drivers
        *   3.3.2 Excursion Facilities CRUD
            *   3.3.2.1 Restaurants
            *   3.3.2.2 Tickets
            *   3.3.2.3 Tours
6. **Extra Tours Module:** Tracking optional excursion revenue, guide assignments, and commissions (Critical revenue stream).', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.857Z', N'2026-09-17T07:52:58.173Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (5, N'DocumentationRepo', N'01_Project_Charter_and_Scope.md', N'User Manual', NULL, NULL, N'How to 5. architectural strategy?', N'architectural, strategy, 01_project_charter_and_scope, frontend, next, react, web, application, library, shadcn, tailwind, css, selected, for, premium, data, grid, charting, and, layout, components, backend, api, net, utilizing', N'### 5. Architectural Strategy

- **Frontend UI:** Next.js / React Web Application.
- **UI Library:** Shadcn UI + Tailwind CSS (Selected for premium data grid, charting, and layout components).
- **Backend API:** .NET (C#) Web API, utilizing a strict separation of concerns.
- **API Gateway:** Planned for future phases to support Mobile App integrations (Guide App / Client App).', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.858Z', N'2026-09-17T07:52:58.174Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (6, N'DocumentationRepo', N'01_Project_Charter_and_Scope.md', N'User Manual', NULL, NULL, N'How to 6. success criteria?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 6. Success Criteria

- The platform can successfully replicate and manage the end-to-end lifecycle of a complex "Multi-City Central Europe Tour" currently managed in Excel.
- Operational staff can view upcoming Supplier and Guide payments in a single dashboard query.
- Staff can easily click through from the dashboard directly to a Tour''s deep details.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.858Z', N'2026-09-17T07:52:58.174Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (7, N'DocumentationRepo', N'02_UI_Feature_Catalog.md', N'User Manual', NULL, NULL, N'How to ui feature catalog: uno erp?', N'feature, catalog, uno, erp, 02_ui_feature_catalog, this, document, indexes, all, major, modules, for, the, mvp', N'### UI Feature Catalog: UNO ERP

This document indexes all major UI modules for the Uno ERP MVP.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.934Z', N'2026-09-17T07:52:58.183Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (8, N'DocumentationRepo', N'02_UI_Feature_Catalog.md', N'User Manual', NULL, NULL, N'How to 1. global layout & navigation?', N'global, layout, navigation, 02_ui_feature_catalog, top, navbar, search, projects, clients, user, profile, notifications, left, sidebar, dashboard, timeline, city, operations, hotels, transfers, extra, tours, guides, payments, tasks', N'### 1. Global Layout & Navigation

*   **Top Navbar:** Global Search (Projects/Clients), User Profile, Notifications.
*   **Left Sidebar Navigation:** Dashboard, Timeline, Projects, City Operations, Hotels, Transfers, Extra Tours, Guides, Payments, Tasks, Reports, Settings.
*   **UI-F-001: Quick Create Menu:** A sticky sidebar block allowing rapid creation of "New Project", "New Booking", "New Payment", "New Extra Tour", and "New Task".', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.934Z', N'2026-09-17T07:52:58.184Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (9, N'DocumentationRepo', N'02_UI_Feature_Catalog.md', N'KPI Proposal', NULL, NULL, N'How to 2. dashboard module (timeline-first)?', N'dashboard, module, timeline, first, 02_ui_feature_catalog, project, planning, calendar, the, hero, horizontal, gantt, chart, plotting, projects, across, dates, bars, are, color, coded, status, confirmed, option, problem', N'### 2. Dashboard Module (Timeline-First)

*   **UI-F-010: Project Planning Calendar (The Hero):** A horizontal Gantt/Timeline chart plotting Projects across dates. Bars are color-coded by Status (Confirmed, Option, Problem).
*   **UI-F-011: Upcoming Arrivals Data Grid:** Compact list of incoming groups for the next 7 days.
*   **UI-F-012: Hotel Bookings Status:** A visual Donut Chart showing percentage breakdown of bookings (Confirmed, Pending, Option, Problem).
*   **UI-F-013: Active Projects by City:** Bar charts visualizing Pax volume per destination (e.g., Prague vs Vienna).
*   **UI-F-014: Guide Overview Grid:** Showing Guide names, assigned tour counts, MTD Revenue, and availability status (On Tour vs Available).
*   **UI-F-015: Right Slide-Out Panel (Global State):** Displays global company "Alerts & To-Dos", "Today Arrivals", and "Today Departures".', N'/projects', N'Executive Dashboard', 1, N'2026-08-20T16:52:57.935Z', N'2026-09-17T07:52:58.184Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (10, N'DocumentationRepo', N'02_UI_Feature_Catalog.md', N'User Manual', NULL, NULL, N'How to 3. contextual slide-out panels (drill-down)?', N'contextual, slide, out, panels, drill, down, 02_ui_feature_catalog, project, triggered, clicking, bar, the, timeline, transforms, right, panel, show, specific, glance, overview, itinerary, summary, bookings, status, confirmed', N'### 3. Contextual Slide-Out Panels (Drill-Down)

*   **UI-F-020: Project Slide-Out:** Triggered by clicking a bar on the Timeline. Transforms the right panel to show a specific project''s "At a Glance" overview, Itinerary Summary, Bookings Status (e.g., 2/2 confirmed), and Payments Summary.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.935Z', N'2026-09-17T07:52:58.185Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (11, N'DocumentationRepo', N'02_UI_Feature_Catalog.md', N'User Manual', NULL, NULL, N'How to 4. sales pipeline module?', N'sales, pipeline, module, 02_ui_feature_catalog, kanban, board, visual, drag, and, drop, for, tours, projects, tracking, salesstage', N'### 4. Sales Pipeline Module

*   **UI-F-030: Kanban Board:** Visual drag-and-drop board for Tours/Projects tracking `SalesStage`.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.936Z', N'2026-09-17T07:52:58.186Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (12, N'DocumentationRepo', N'02_UI_Feature_Catalog.md', N'Excel Import Guide', NULL, NULL, N'How to 5. generic excel import module?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 5. Generic Excel Import Module

*   **UI-F-040: Dynamic Data Mapper:** Upload, Map Columns, Edit Staging Grid, Save.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:57.936Z', N'2026-09-17T07:52:58.187Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (13, N'DocumentationRepo', N'02_UI_Feature_Catalog.md', N'User Manual', NULL, NULL, N'How to 6. project management module?', N'project, management, module, 02_ui_feature_catalog, data, grid, detail, view, the, hub, full, dedicated, page, for, deep, editing', N'### 6. Project Management Module

*   **UI-F-050: Project Data Grid & Detail View (The Hub):** Full dedicated page for deep editing of a Project.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.937Z', N'2026-09-17T07:52:58.187Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (14, N'DocumentationRepo', N'02_UI_Feature_Catalog.md', N'Master Data', NULL, NULL, N'How to 7. master data & supplier modules?', N'master, data, supplier, modules, 02_ui_feature_catalog, grids, dedicated, crud, for, clients, hotels, guides, transport, companies, and, nested, drivers, excursion, facilities, restaurants, tickets, tours', N'### 7. Master Data & Supplier Modules

*   **UI-F-060: Master Data Grids:** Dedicated CRUD grids for Clients, Hotels, Guides, Transport Companies (and nested Drivers), and Excursion Facilities (Restaurants, Tickets, Tours).', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:57.937Z', N'2026-09-17T07:52:58.188Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (15, N'DocumentationRepo', N'02_UI_Feature_Catalog.md', N'User Manual', NULL, NULL, N'How to 8. finance module?', N'finance, module, 02_ui_feature_catalog, dashboard, split, view, showing, accounts, payable, receivable', N'### 8. Finance Module

*   **UI-F-070: AP/AR Dashboard:** Split view showing Accounts Payable vs Accounts Receivable.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.937Z', N'2026-09-17T07:52:58.188Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (16, N'DocumentationRepo', N'03_API_Feature_Catalog.md', N'User Manual', NULL, NULL, N'How to api feature catalog: uno erp?', N'api, feature, catalog, uno, erp, 03_api_feature_catalog, this, document, indexes, all, major, backend, endpoints', N'### API Feature Catalog: UNO ERP

This document indexes all major backend API endpoints.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.950Z', N'2026-09-17T07:52:58.192Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (17, N'DocumentationRepo', N'03_API_Feature_Catalog.md', N'KPI Proposal', NULL, NULL, N'How to 1. dashboard aggregate apis?', N'dashboard, aggregate, apis, 03_api_feature_catalog, api, get, timeline, fetches, all, active, projects, formatted, with, start, end, dates, and, status, colors, explicitly, for, the, gantt, chart, rendering', N'### 1. Dashboard Aggregate APIs

*   **API-F-001:** `GET /api/dashboard/timeline` - Fetches all active projects formatted with start/end dates and status colors explicitly for the Gantt chart rendering.
*   **API-F-002:** `GET /api/dashboard/alerts` - Unified endpoint to fetch critical "To-Dos": Missing Confirmations, Vouchers to Send, and Guide Settlements pending.
*   **API-F-003:** `GET /api/dashboard/operations-today` - Fetches aggregated "Today Arrivals" and "Today Departures".', N'/projects', N'Executive Dashboard', 1, N'2026-08-20T16:52:57.951Z', N'2026-09-17T07:52:58.193Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (18, N'DocumentationRepo', N'03_API_Feature_Catalog.md', N'User Manual', NULL, NULL, N'How to 2. projects & pipeline api?', N'projects, pipeline, api, 03_api_feature_catalog, post, create, new, root, project, get, fetch, deep, details, summary, lightweight, endpoint, specifically, returning, the, itinerary, bookings, status, confirmed', N'### 2. Projects & Pipeline API

*   **API-F-010:** `POST /api/projects` - Create a new root project.
*   **API-F-011:** `GET /api/projects/{id}` - Fetch deep project details.
*   **API-F-012:** `GET /api/projects/{id}/summary` - A lightweight endpoint specifically returning the Itinerary, Bookings Status (e.g. "2/2 Confirmed"), and Payments Summary for the Slide-Out Panel.
*   **API-F-013:** `PUT /api/projects/{id}/stage` - Update Sales Pipeline Stage.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.951Z', N'2026-09-17T07:52:58.193Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (19, N'DocumentationRepo', N'03_API_Feature_Catalog.md', N'Excel Import Guide', NULL, NULL, N'How to 3. generic data import api?', N'generic, data, import, api, 03_api_feature_catalog, get, schema, entity, post, preview, commit', N'### 3. Generic Data Import API

*   **API-F-015:** `GET /api/schema/{entity}` 
*   **API-F-016:** `POST /api/import/preview`
*   **API-F-017:** `POST /api/import/commit`', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:57.952Z', N'2026-09-17T07:52:58.194Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (20, N'DocumentationRepo', N'03_API_Feature_Catalog.md', N'User Manual', NULL, NULL, N'How to 4. city stays & services api?', N'city, stays, services, api, 03_api_feature_catalog, post, projects, projectid, citystays, hotels, extratours', N'### 4. City Stays & Services API

*   **API-F-020:** `POST /api/projects/{projectId}/citystays`
*   **API-F-030:** `POST /api/citystays/{id}/hotels`
*   **API-F-032:** `POST /api/citystays/{id}/extratours`', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.952Z', N'2026-09-17T07:52:58.194Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (21, N'DocumentationRepo', N'03_API_Feature_Catalog.md', N'Master Data', NULL, NULL, N'How to 5. master data api?', N'master, data, api, 03_api_feature_catalog, get, post, hotels, guides, availability, fetches, active, assignment, status, tour, available, and, mtd, revenue, transport, companies, drivers', N'### 5. Master Data API

*   **API-F-050:** `GET/POST /api/hotels`
*   **API-F-051:** `GET/POST /api/guides` 
*   **API-F-052:** `GET /api/guides/availability` - Fetches active assignment status ("On Tour" vs "Available") and MTD Revenue.
*   **API-F-053:** `GET/POST /api/transport-companies` & `/drivers`
*   **API-F-054:** `GET/POST /api/excursion-facilities`', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:57.953Z', N'2026-09-17T07:52:58.195Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (22, N'DocumentationRepo', N'03_API_Feature_Catalog.md', N'User Manual', NULL, NULL, N'How to 6. finance?', N'finance, 03_api_feature_catalog, api, get, payables, fetch, upcoming, supplier, payments', N'### 6. Finance

*   **API-F-060:** `GET /api/finance/payables` - Fetch upcoming supplier payments.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.953Z', N'2026-09-17T07:52:58.195Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (23, N'DocumentationRepo', N'04_UI_User_Stories.md', N'User Manual', NULL, NULL, N'How to [ui-us-001] gantt timeline for active projects?', N'gantt, timeline, for, active, projects, 04_ui_user_stories, user, story, operations, manager, want, view, plotted, horizontal, can, visualize, overlap, and, scheduling, business, rules, timelines, must, reflect, the', N'### [UI-US-001] Gantt Timeline for Active Projects

**User Story:** As an Operations Manager, I want to view active Projects plotted on a horizontal Gantt Timeline so I can visualize overlap and scheduling.
**Business Rules:** Timelines must reflect the destination''s timezone.
**Acceptance Criteria:**
- **Given** I am logged in as an Operations Manager
- **When** I load the Dashboard
- **Then** I see a horizontal Gantt chart of active projects grouped by date ranges.
- **And** I can toggle between monthly and weekly views.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.961Z', N'2026-09-17T07:52:58.204Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (24, N'DocumentationRepo', N'04_UI_User_Stories.md', N'User Manual', NULL, NULL, N'How to [ui-us-002] global alerts panel?', N'global, alerts, panel, 04_ui_user_stories, user, story, operator, want, see, dos, persistent, right, hand, acceptance, criteria, given, there, are, pending, tasks, missing, hotel, confirmations, when, view', N'### [UI-US-002] Global Alerts Panel

**User Story:** As an Operator, I want to see global "Alerts & To-Dos" in a persistent right-hand panel.
**Acceptance Criteria:**
- **Given** there are pending tasks (e.g., missing hotel confirmations)
- **When** I view the dashboard
- **Then** I see a right-hand panel listing tasks sorted by urgency and date.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.962Z', N'2026-09-17T07:52:58.204Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (25, N'DocumentationRepo', N'04_UI_User_Stories.md', N'User Manual', NULL, NULL, N'How to [ui-us-003] slide-out project details?', N'slide, out, project, details, 04_ui_user_stories, user, story, operator, when, click, bar, within, the, timeline, want, right, hand, panel, gracefully, and, display, that, specific, itinerary, acceptance', N'### [UI-US-003] Slide-out Project Details

**User Story:** As an Operator, when I click on a Project bar within the Timeline, I want the right-hand panel to gracefully slide out and display that specific Project''s Itinerary.
**Acceptance Criteria:**
- **Given** the Gantt timeline is displayed
- **When** I click on a Project bar
- **Then** a right panel slides out displaying the Itinerary Summary and Booking Status without navigating away.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.962Z', N'2026-09-17T07:52:58.205Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (26, N'DocumentationRepo', N'04_UI_User_Stories.md', N'User Manual', NULL, NULL, N'How to [ui-us-004] quick create sidebar?', N'quick, create, sidebar, 04_ui_user_stories, user, story, sales, manager, want, use, menu, rapidly, spin, new, tour, opportunity, log, payment, acceptance, criteria, given, anywhere, the, application, when', N'### [UI-US-004] Quick Create Sidebar

**User Story:** As a Sales Manager, I want to use a Quick Create sidebar menu to rapidly spin up a new Tour Opportunity or log a Payment.
**Acceptance Criteria:**
- **Given** I am anywhere in the application
- **When** I click the Quick Create button
- **Then** a modal/sidebar opens allowing me to enter minimal details for a new Tour or Payment.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.963Z', N'2026-09-17T07:52:58.205Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (27, N'DocumentationRepo', N'04_UI_User_Stories.md', N'Master Data', NULL, NULL, N'How to [ui-us-005] guide overview grid?', N'guide, overview, grid, 04_ui_user_stories, user, story, operations, manager, want, view, showing, which, guides, are, tour, available, gdpr, privacy, constraints, personal, contact, information, phone, email, must', N'### [UI-US-005] Guide Overview Grid

**User Story:** As an Operations Manager, I want to view a "Guide Overview" grid showing which guides are On Tour vs Available.
**GDPR/Privacy Constraints:** Personal contact information (phone, personal email) of Guides must be masked unless explicitly clicked/expanded by authorized personnel (RBAC).
**Acceptance Criteria:**
- **Given** I have Operations Manager permissions
- **When** I view the Guide Overview
- **Then** I see a list of guides and their current statuses (On Tour / Available)
- **And** sensitive contact info is hidden by default.', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:57.963Z', N'2026-09-17T07:52:58.206Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (28, N'DocumentationRepo', N'04_UI_User_Stories.md', N'KPI Proposal', NULL, NULL, N'How to [ui-us-006 & 007] dashboard financial kpis & charts?', N'dashboard, financial, kpis, charts, 04_ui_user_stories, user, story, controller, want, see, and, variance, monitor, profitability, vendor, payments, acceptance, criteria, given, when, view, the, then, widgets, for', N'### [UI-US-006 & 007] Dashboard Financial KPIs & Charts

**User Story:** As a Financial Controller, I want to see KPIs and Variance Charts to monitor profitability and vendor payments.
**Acceptance Criteria:**
- **Given** I am a Financial Controller
- **When** I view the Dashboard
- **Then** I see widgets for Gross Land Sales, Net Cost, Final Profit, and Margin %
- **And** I see a Budget vs. Actual Variance Chart.', N'/projects', N'Executive Dashboard', 1, N'2026-08-20T16:52:57.964Z', N'2026-09-17T07:52:58.206Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (29, N'DocumentationRepo', N'04_UI_User_Stories.md', N'Excel Import Guide', NULL, NULL, N'How to [ui-us-010 & 011] excel import & staging grid?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### [UI-US-010 & 011] Excel Import & Staging Grid

**User Story:** As an Operator, I want to upload an Excel file, map columns, and view data in a Staging Grid to correct issues before committing.
**Acceptance Criteria:**
- **Given** I have a valid Excel file
- **When** I upload the file and map columns to system properties
- **Then** I see a Staging Grid with the imported rows
- **And** I can edit cells with validation errors before submitting to the live database.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:57.964Z', N'2026-09-17T07:52:58.207Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (30, N'DocumentationRepo', N'04_UI_User_Stories.md', N'User Manual', NULL, NULL, N'How to [ui-us-020 to 023] project creation & itinerary building?', N'project, creation, itinerary, building, 04_ui_user_stories, user, story, operator, want, create, add, city, stays, attach, hotel, bookings, and, configure, total, pax, currency, business, rules, multi, support', N'### [UI-US-020 to 023] Project Creation & Itinerary Building

**User Story:** As an Operator, I want to create a Project, add City Stays, attach Hotel Bookings, and configure Total Pax and Currency.
**Business Rules:** Multi-currency support is required based on the destination.
**Acceptance Criteria:**
- **Given** I am building a Project
- **When** I add a City Stay
- **Then** I can assign a specific Hotel Booking and date range to it
- **And** the UI ensures the City Stay dates fall within the parent Project''s dates.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.965Z', N'2026-09-17T07:52:58.207Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (31, N'DocumentationRepo', N'04_UI_User_Stories.md', N'Master Data', NULL, NULL, N'How to [ui-us-030 to 032] master data directories?', N'master, data, directories, 04_ui_user_stories, user, story, admin, want, manage, hotels, guides, transport, companies, and, drivers, excursion, facilities, gdpr, constraints, driver, guide, personal, details, cards, licenses', N'### [UI-US-030 to 032] Master Data Directories

**User Story:** As an Admin, I want to manage Hotels, Guides, Transport Companies (and Drivers), and Excursion Facilities.
**GDPR Constraints:** Driver and Guide personal details (ID cards, driver licenses) must be securely managed. Deleting a guide should support soft-delete/anonymization for GDPR Right to be Forgotten.
**Acceptance Criteria:**
- **Given** I am an Admin
- **When** I navigate to Master Data
- **Then** I can perform CRUD operations on Guides, Hotels, and Transport Companies.', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:57.965Z', N'2026-09-17T07:52:58.208Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (32, N'DocumentationRepo', N'04_UI_User_Stories.md', N'User Manual', NULL, NULL, N'How to [ui-us-040] extra tour sales?', N'extra, tour, sales, 04_ui_user_stories, user, story, guide, coordinator, want, log, sale, auto, calculate, commission, acceptance, criteria, given, active, with, passengers, when, then, the, displays, calculated', N'### [UI-US-040] Extra Tour Sales

**User Story:** As a Guide Coordinator, I want to log an "Extra Tour" sale to auto-calculate Guide Commission.
**Acceptance Criteria:**
- **Given** an active tour with passengers
- **When** I log an Extra Tour sale
- **Then** the UI auto-displays the calculated Guide Commission and Net Profit.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.966Z', N'2026-09-17T07:52:58.210Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (33, N'DocumentationRepo', N'04_UI_User_Stories.md', N'User Manual', NULL, NULL, N'How to [ui-us-050 & 051] vendor payments & petty cash?', N'vendor, payments, petty, cash, 04_ui_user_stories, user, story, financial, controller, guide, want, log, attach, invoices, and, reconcile, acceptance, criteria, given, pending, payable, when, submit, payment, entry', N'### [UI-US-050 & 051] Vendor Payments & Petty Cash

**User Story:** As a Financial Controller/Guide, I want to log payments, attach invoices, and reconcile petty cash.
**Acceptance Criteria:**
- **Given** a pending vendor payable
- **When** I submit a payment entry with a PDF attachment
- **Then** the payment is logged and the invoice is stored securely.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.966Z', N'2026-09-17T07:52:58.211Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (34, N'DocumentationRepo', N'04_UI_User_Stories.md', N'User Manual', NULL, NULL, N'How to [ui-us-052] budget variance approvals?', N'budget, variance, approvals, 04_ui_user_stories, user, story, manager, want, approval, interface, review, overspends, exceeding, acceptance, criteria, given, project, actual, costs, exceed, budgeted, when, the, cost, logged', N'### [UI-US-052] Budget Variance Approvals

**User Story:** As a Manager, I want an approval interface to review overspends exceeding 5%.
**Acceptance Criteria:**
- **Given** a project''s actual costs exceed budgeted costs by >5%
- **When** the cost is logged
- **Then** an alert appears in the Manager''s approval queue.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.967Z', N'2026-09-17T07:52:58.211Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (35, N'DocumentationRepo', N'05_API_User_Stories.md', N'KPI Proposal', NULL, NULL, N'How to [api-us-001] dashboard timeline?', N'api, dashboard, timeline, 05_api_user_stories, user, story, the, must, expose, get, which, formats, active, projects, specifically, for, gantt, chart, component, business, rules, support, multi, timezone, conversions', N'### [API-US-001] Dashboard Timeline

**User Story:** As the API, I must expose `GET /api/dashboard/timeline` which formats active projects specifically for a Gantt chart component.
**Business Rules:** Must support multi-timezone conversions to prevent overlapping day boundaries for multi-city tours.
**Acceptance Criteria:**
- **Given** active projects exist in the database
- **When** `GET /api/dashboard/timeline` is called
- **Then** it returns projects grouped by date ranges and status, adjusted for the correct timezone.', N'/projects', N'Executive Dashboard', 1, N'2026-08-20T16:52:57.977Z', N'2026-09-17T07:52:58.216Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (36, N'DocumentationRepo', N'05_API_User_Stories.md', N'User Manual', NULL, NULL, N'How to [api-us-002] global alerts?', N'api, global, alerts, 05_api_user_stories, user, story, the, must, aggregate, cross, module, unpaid, deposits, missing, hotel, confirmations, via, get, dashboard, acceptance, criteria, given, when, endpoint, called', N'### [API-US-002] Global Alerts

**User Story:** As the API, I must aggregate cross-module alerts (e.g., unpaid deposits, missing hotel confirmations) via `GET /api/dashboard/alerts`.
**Acceptance Criteria:**
- **Given** missing hotel confirmations or unpaid deposits
- **When** the alerts endpoint is called
- **Then** the API returns a sorted list of alerts by urgency.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.978Z', N'2026-09-17T07:52:58.216Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (37, N'DocumentationRepo', N'05_API_User_Stories.md', N'User Manual', NULL, NULL, N'How to [api-us-003] lightweight project summary?', N'api, lightweight, project, summary, 05_api_user_stories, user, story, the, must, expose, endpoint, get, projects, acceptance, criteria, given, valid, when, called, then, returns, only, necessary, fields, for', N'### [API-US-003] Lightweight Project Summary

**User Story:** As the API, I must expose a lightweight project summary endpoint `GET /api/projects/{id}/summary`.
**Acceptance Criteria:**
- **Given** a valid project ID
- **When** the summary endpoint is called
- **Then** it returns only the necessary fields for the UI slide-out panel to minimize payload size.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.978Z', N'2026-09-17T07:52:58.217Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (38, N'DocumentationRepo', N'05_API_User_Stories.md', N'Master Data', NULL, NULL, N'How to [api-us-004] guide availability?', N'api, guide, availability, 05_api_user_stories, user, story, the, must, calculate, and, return, assignment, via, get, guides, gdpr, privacy, constraints, exclude, personal, contact, info, phone, email, unless', N'### [API-US-004] Guide Availability

**User Story:** As the API, I must calculate and return guide assignment availability via `GET /api/guides/availability`.
**GDPR/Privacy Constraints:** Exclude personal contact info (phone/email) unless the requester has specific RBAC permissions (e.g., Operations Manager).
**Acceptance Criteria:**
- **Given** multiple guides with varying schedules
- **When** availability is queried
- **Then** the API returns availability status (On Tour vs Available) without exposing personal data.', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:57.979Z', N'2026-09-17T07:52:58.218Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (39, N'DocumentationRepo', N'05_API_User_Stories.md', N'KPI Proposal', NULL, NULL, N'How to [api-us-005 & 006] financial kpis & charts?', N'api, financial, kpis, charts, 05_api_user_stories, user, story, the, must, return, aggregated, metrics, and, chart, data, via, get, dashboard, acceptance, criteria, given, active, ledgers, when, kpi', N'### [API-US-005 & 006] Financial KPIs & Charts

**User Story:** As the API, I must return aggregated financial metrics and chart data via `GET /api/dashboard/financial-kpis` and `GET /api/dashboard/charts`.
**Acceptance Criteria:**
- **Given** active financial ledgers
- **When** the KPI or chart endpoint is called
- **Then** the API returns aggregated Gross Sales, Net Cost, Profit, and Margins.', N'/projects', N'Executive Dashboard', 1, N'2026-08-20T16:52:57.979Z', N'2026-09-17T07:52:58.218Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (40, N'DocumentationRepo', N'05_API_User_Stories.md', N'User Manual', NULL, NULL, N'How to [api-us-010 to 012] project crud & currency?', N'api, project, crud, currency, 05_api_user_stories, user, story, client, can, create, projects, update, sales, stages, and, fetch, snapshot, rates, acceptance, criteria, given, valid, payload, for, root', N'### [API-US-010 to 012] Project CRUD & Currency

**User Story:** As a UI Client, I can create Projects, update sales stages, and fetch currency snapshot rates.
**Acceptance Criteria:**
- **Given** a valid payload for a root Project
- **When** `POST /api/projects` is called
- **Then** the Project is created and the ID is returned.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.979Z', N'2026-09-17T07:52:58.219Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (41, N'DocumentationRepo', N'05_API_User_Stories.md', N'Excel Import Guide', NULL, NULL, N'How to [api-us-020 to 022] schema-driven import?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### [API-US-020 to 022] Schema-driven Import

**User Story:** As a UI Client, I can fetch the JSON Schema, send mapped Excel data for validation, and commit the validated data.
**Acceptance Criteria:**
- **Given** a valid mapped Excel dataset
- **When** `POST /api/import/preview` is called
- **Then** the API validates the payload and returns the dataset for the Staging Grid.
- **And** when `POST /api/import/commit` is called, it batch inserts into the database.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:57.980Z', N'2026-09-17T07:52:58.220Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (42, N'DocumentationRepo', N'05_API_User_Stories.md', N'User Manual', NULL, NULL, N'How to [api-us-030] transport dependencies?', N'api, transport, dependencies, 05_api_user_stories, user, story, the, enforce, that, driver, cannot, created, without, valid, transportcompanyid, acceptance, criteria, given, creation, payload, when, missing, then, rejects, request', N'### [API-US-030] Transport Dependencies

**User Story:** As the API, I enforce that a `Driver` cannot be created without a valid `TransportCompanyId`.
**Acceptance Criteria:**
- **Given** a driver creation payload
- **When** the payload is missing a `TransportCompanyId`
- **Then** the API rejects the request with a 400 Bad Request.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.980Z', N'2026-09-17T07:52:58.220Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (43, N'DocumentationRepo', N'05_API_User_Stories.md', N'User Manual', NULL, NULL, N'How to [api-us-031] extra tour margin calculation?', N'api, extra, tour, margin, calculation, 05_api_user_stories, user, story, the, calculate, netmargin, for, tours, business, rules, formula, paxjoined, sellingprice, suppliercost, guidecommission, acceptance, criteria, given, with, pax', N'### [API-US-031] Extra Tour Margin Calculation

**User Story:** As the API, I calculate the `NetMargin` for Extra Tours.
**Business Rules:** Formula is `(PaxJoined * SellingPrice) - SupplierCost - GuideCommission`.
**Acceptance Criteria:**
- **Given** an Extra Tour with Pax, Selling Price, Cost, and Commission
- **When** the net margin is calculated
- **Then** it accurately applies the formula and stores the result.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.981Z', N'2026-09-17T07:52:58.221Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (44, N'DocumentationRepo', N'05_API_User_Stories.md', N'User Manual', NULL, NULL, N'How to [api-us-032] unpaid payables?', N'api, unpaid, payables, 05_api_user_stories, user, story, the, aggregate, hotel, and, transfer, bookings, via, get, finance, acceptance, criteria, given, pending, vendor, payments, when, called, then, aggregates', N'### [API-US-032] Unpaid Payables

**User Story:** As the API, I aggregate unpaid Hotel and Transfer bookings via `GET /api/finance/payables`.
**Acceptance Criteria:**
- **Given** pending vendor payments
- **When** `GET /api/finance/payables` is called
- **Then** the API aggregates unpaid bookings across projects.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.981Z', N'2026-09-17T07:52:58.221Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (45, N'DocumentationRepo', N'05_API_User_Stories.md', N'User Manual', NULL, NULL, N'How to [api-us-040 & 041] vendor payments & reconciliations?', N'api, vendor, payments, reconciliations, 05_api_user_stories, user, story, client, can, post, with, digital, invoice, attachments, and, reconcile, petty, cash, acceptance, criteria, given, valid, payment, pdf, when', N'### [API-US-040 & 041] Vendor Payments & Reconciliations

**User Story:** As a UI Client, I can post vendor payments with digital invoice attachments and reconcile petty cash.
**Acceptance Criteria:**
- **Given** a valid vendor payment with an invoice PDF
- **When** `POST /api/finance/vendor-payments` is called
- **Then** the system records the payment and securely stores the invoice in blob storage.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.982Z', N'2026-09-17T07:52:58.222Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (46, N'DocumentationRepo', N'05_API_User_Stories.md', N'User Manual', NULL, NULL, N'How to [api-us-042] budget variance workflow?', N'api, budget, variance, workflow, 05_api_user_stories, user, story, the, must, trigger, managerial, approval, alert, actuals, introduce, negative, business, rules, strictly, requires, sign, off, acceptance, criteria, given', N'### [API-US-042] Budget Variance Workflow

**User Story:** As the API, I must trigger a managerial approval alert workflow if actuals introduce a negative variance >5%.
**Business Rules:** Variance > 5% strictly requires managerial sign-off.
**Acceptance Criteria:**
- **Given** an actual cost is posted via `POST /api/finance/budget/actuals`
- **When** the cost exceeds the budgeted amount by >5%
- **Then** the API triggers an approval alert for managers.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.982Z', N'2026-09-17T07:52:58.222Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (47, N'DocumentationRepo', N'06_UI_API_Acceptance_Test_Cases.md', N'User Manual', NULL, NULL, N'How to test suite 1: project & city stay creation?', N'test, suite, project, city, stay, creation, 06_ui_api_acceptance_test_cases, scenario, creating, with, valid, dates, given, the, user, screen, when, they, select, client, and, set, arrival, departure, then', N'### Test Suite 1: Project & City Stay Creation

**Scenario 1.1:** Creating a Project with valid Dates
*   *Given* the user is on the Project Creation screen.
*   *When* they select a valid Client and set Arrival/Departure dates.
*   *Then* the API should return `201 Created` and the UI should redirect to the Project Detail view.

**Scenario 1.2:** Invalid City Stay Dates
*   *Given* a Project exists with dates `10-May` to `20-May`.
*   *When* the user attempts to add a City Stay from `21-May` to `23-May`.
*   *Then* the API must return a `400 Bad Request` citing out-of-bounds dates, and the UI must display a clear validation error.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.985Z', N'2026-09-17T07:52:58.227Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (48, N'DocumentationRepo', N'06_UI_API_Acceptance_Test_Cases.md', N'User Manual', NULL, NULL, N'How to test suite 2: extra tours financial calculation?', N'test, suite, extra, tours, financial, calculation, 06_ui_api_acceptance_test_cases, scenario, auto, calculating, net, profit, given, the, user, adding, tour, city, stay, when, they, input, pax, selling, price', N'### Test Suite 2: Extra Tours Financial Calculation

**Scenario 2.1:** Auto-calculating Net Profit
*   *Given* the user is adding an Extra Tour to a City Stay.
*   *When* they input: Pax = 10, Selling Price = €50, Supplier Cost = €300, Guide Commission = €50.
*   *Then* the backend API (`POST /api/citystays/{id}/extratours`) must calculate Net Margin as `€150` (`(10 * 50) - 300 - 50`) and the UI must immediately reflect this updated margin.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.985Z', N'2026-09-17T07:52:58.227Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (49, N'DocumentationRepo', N'06_UI_API_Acceptance_Test_Cases.md', N'KPI Proposal', NULL, NULL, N'How to test suite 3: dashboard payables?', N'test, suite, dashboard, payables, 06_ui_api_acceptance_test_cases, scenario, highlighting, overdue, payments, given, hotel, booking, has, depositduedate, yesterday, and, balancepaid, when, the, user, loads, then, upcoming, supplier, grid', N'### Test Suite 3: Dashboard Payables

**Scenario 3.1:** Highlighting Overdue Payments
*   *Given* a Hotel Booking has a `DepositDueDate` of yesterday and `BalancePaid = 0`.
*   *When* the user loads the Dashboard.
*   *Then* the "Upcoming Supplier Payments" grid must display this record with a red/urgent indicator tag.', N'/projects', N'Executive Dashboard', 1, N'2026-08-20T16:52:57.986Z', N'2026-09-17T07:52:58.228Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (50, N'DocumentationRepo', N'09_Architecture_Deployment_and_Operations.md', N'User Manual', NULL, NULL, N'How to 1. system architecture?', N'system, architecture, 09_architecture_deployment_and_operations, uno, erp, will, follow, decoupled, optimized, strictly, for, low, cost, premise, deployment, small, enterprise', N'### 1. System Architecture

UNO ERP will follow a decoupled architecture optimized strictly for low-cost, on-premise deployment for a small enterprise.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.992Z', N'2026-09-17T07:52:58.231Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (51, N'DocumentationRepo', N'09_Architecture_Deployment_and_Operations.md', N'User Manual', NULL, NULL, N'How to 1.1 frontend (ui)?', N'frontend, 09_architecture_deployment_and_operations, framework, next, react, library, shadcn, tailwind, css, state, management, query, for, data, fetching, and, caching', N'### 1.1 Frontend (UI)

*   **Framework:** Next.js (React).
*   **UI Library:** Shadcn UI + Tailwind CSS.
*   **State Management:** React Query for data fetching and caching.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.992Z', N'2026-09-17T07:52:58.232Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (52, N'DocumentationRepo', N'09_Architecture_Deployment_and_Operations.md', N'User Manual', NULL, NULL, N'How to 1.2 backend (api)?', N'backend, api, 09_architecture_deployment_and_operations, framework, net, web, database, sql, server, express, free, edition, orm, entity, core, architecture, pattern, clean', N'### 1.2 Backend (API)

*   **Framework:** .NET 8/9 C# Web API.
*   **Database:** **SQL Server Express** (Free Edition). 
*   **ORM:** Entity Framework Core.
*   **Architecture Pattern:** Clean Architecture.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.993Z', N'2026-09-17T07:52:58.233Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (53, N'DocumentationRepo', N'09_Architecture_Deployment_and_Operations.md', N'User Manual', NULL, NULL, N'How to 2. on-premise deployment strategy?', N'premise, deployment, strategy, 09_architecture_deployment_and_operations, strictly, minimize, maintenance, overhead, and, licensing, there, azure, automated, pipeline, planned, for, this, phase, fully, manual, server, host, single, local, office', N'### 2. On-Premise Deployment Strategy

To strictly minimize maintenance overhead and licensing, there is **no Azure or automated CI/CD pipeline** planned for this phase. Deployment is fully manual.

*   **Server Host:** A single local office server or workstation.
*   **Web API Deployment:** Deployed manually using the **Visual Studio "Publish"** feature directly to the local server''s IIS (Internet Information Services) instance or a local folder.
*   **Frontend Deployment:** Built locally (`npm run build`) and the static export or Node server is manually copied to the server.
*   **Database Deployment:** 
    * Initial deployment will involve restoring a `.bak` file (SQL DB recovery from backup) generated from the developer machine onto the server''s local SQL Server Express instance.
    * Subsequent schema updates will be applied by manually running SQL scripts via SQL Server Management Studio (SSMS).', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.993Z', N'2026-09-17T07:52:58.233Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (54, N'DocumentationRepo', N'09_Architecture_Deployment_and_Operations.md', N'User Manual', NULL, NULL, N'How to 3. operations & maintenance?', N'operations, maintenance, 09_architecture_deployment_and_operations, backups, scheduled, windows, task, will, run, backup, the, sql, server, express, database, local, bak, file, which, should, periodically, copied, external, drive, updates', N'### 3. Operations & Maintenance

*   **Backups:** A scheduled Windows Task will run to backup the SQL Server Express database to a local `.bak` file, which should be periodically copied to an external drive.
*   **Updates:** Any bug fixes or new features will be manually published from the developer''s Visual Studio instance and copied over to the office server.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:57.994Z', N'2026-09-17T07:52:58.234Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (55, N'DocumentationRepo', N'10_Release_Roadmap_and_Delivery_Plan.md', N'User Manual', NULL, NULL, N'How to phase 1: the core mvp (months 1-2)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Phase 1: The Core MVP (Months 1-2)

**Goal:** Replace the Excel "Multi-City Tour" tracking sheet with a locally hosted web application.
*   **Sprint 1:** Database Schema setup, Basic CRUD APIs for Projects, Clients, and Suppliers.
*   **Sprint 2:** Frontend Dashboard (Timeline), Project List View, and Client Grid.
*   **Sprint 3:** Multi-City Itinerary Builder and Service Binding (Hotels, Transfers).
*   **Sprint 4:** Extra Tours module and UAT (User Acceptance Testing) with operations team.
*   **Deployment Milestone:** Manual Visual Studio Publish to the office server and SQL Database restore from backup.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.001Z', N'2026-09-17T07:52:58.238Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (56, N'DocumentationRepo', N'10_Release_Roadmap_and_Delivery_Plan.md', N'User Manual', NULL, NULL, N'How to phase 2: finance & automation (months 3-4)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Phase 2: Finance & Automation (Months 3-4)

**Goal:** Streamline Accounts Payable/Receivable and implement Generic Excel Imports.
*   **Sprint 5:** AP/AR Dashboard, Supplier Payment Tracking.
*   **Sprint 6:** Generic Schema-Driven Excel Import module.
*   **Sprint 7:** Automated PDF Generation (Tour Vouchers, Proforma Invoices).
*   **Deployment Milestone:** Manual binary update via Visual Studio Publish and manual SQL script execution for schema changes.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.002Z', N'2026-09-17T07:52:58.238Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (57, N'DocumentationRepo', N'10_Release_Roadmap_and_Delivery_Plan.md', N'User Manual', NULL, NULL, N'How to phase 3: mobile & field operations (months 5+)?', N'phase, mobile, field, operations, months, 10_release_roadmap_and_delivery_plan, goal, connect, the, back, office, with, tour, guides, sprint, api, gateway, implementation, guide, app, react, native, expo, view, assigned', N'### Phase 3: Mobile & Field Operations (Months 5+)

**Goal:** Connect the back-office with Tour Guides in the field.
*   **Sprint 8:** API Gateway Implementation.
*   **Sprint 9:** Guide Mobile App (React Native/Expo) - View Assigned Tours, Log Extra Tour Pax count remotely.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.002Z', N'2026-09-17T07:52:58.239Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (58, N'DocumentationRepo', N'17_Domain_Schema_and_Workflow.md', N'User Manual', NULL, NULL, N'How to 1. core entity relationship overview?', N'core, entity, relationship, overview, 17_domain_schema_and_workflow, mermaid, erdiagram, project, city_stay, contains, invoice, generates, budget, sets_estimates, actuals, records_expenses, client, requests, hotel_booking, includes, transf', N'### 1. Core Entity Relationship Overview

```mermaid
erDiagram
    PROJECT ||--o{ CITY_STAY : contains
    PROJECT ||--o{ INVOICE : generates
    PROJECT ||--o{ BUDGET : sets_estimates
    PROJECT ||--o{ ACTUALS : records_expenses
    CLIENT ||--o{ PROJECT : requests

    CITY_STAY ||--o{ HOTEL_BOOKING : includes
    CITY_STAY ||--o{ TRANSFER : includes
    CITY_STAY ||--o{ EXTRA_TOUR : hosts

    HOTEL_BOOKING }o--|| HOTEL : fulfills
    TRANSFER }o--|| TRANSPORT_COMPANY : provided_by
    TRANSFER }o--|| DRIVER : assigned_to
    EXTRA_TOUR }o--|| GUIDE : led_by
    EXTRA_TOUR }o--|| EXCURSION_FACILITY : takes_place_at

    TRANSPORT_COMPANY ||--o{ DRIVER : employs
    VENDOR_PAYMENT ||--|| INVOICE : attachments
    TOUR_GUIDE_WALLET ||--o{ ACTUALS : reconciles_petty_cash
```', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.004Z', N'2026-09-17T07:52:58.243Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (59, N'DocumentationRepo', N'17_Domain_Schema_and_Workflow.md', N'User Manual', NULL, NULL, N'How to 2.1 project (tour)?', N'project, tour, 17_domain_schema_and_workflow, attributes, projectid, tourname, totalpax, currency, basepricing, salesstage, opportunity, quoted, confirmed, lost, arrivaldate, departuredate, workflow, tracked, via, kanban, board, moves, across, stages, until', N'### 2.1 Project (Tour)

*   **Attributes:** `ProjectId`, `TourName`, `TotalPax`, `Currency`, `BasePricing`, `SalesStage` (Opportunity, Quoted, Confirmed, Lost), `ArrivalDate`, `DepartureDate`.
*   **Workflow:** Tracked via Kanban board. Moves across stages until execution or cancellation. Budget is locked upon moving to Confirmed.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.005Z', N'2026-09-17T07:52:58.244Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (60, N'DocumentationRepo', N'17_Domain_Schema_and_Workflow.md', N'Excel Import Guide', NULL, NULL, N'How to 2.2 data import staging (in-memory)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 2.2 Data Import Staging (In-Memory)

*   **Workflow:** Excel File Upload -> Column Mapping -> Backend Validation Preview -> UI Staging Grid (Edit Mode) -> DB Commit.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:58.005Z', N'2026-09-17T07:52:58.245Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (61, N'DocumentationRepo', N'17_Domain_Schema_and_Workflow.md', N'Master Data', NULL, NULL, N'How to 2.3 master data entities?', N'master, data, entities, 17_domain_schema_and_workflow, hotel, guide, top, level, specific, for, standard, operational, flow, transportcompany, parent, entity, maintaining, billing, terms, contains, many, collection, drivers, name, phone', N'### 2.3 Master Data Entities

*   **Hotel & Guide:** Top level specific entities for standard operational flow.
*   **TransportCompany:** Parent entity maintaining billing terms. Contains a 1-to-Many collection of **Drivers** (Name, Phone, License).
*   **ExcursionFacility:** Categorized specifically as `Restaurant`, `Ticket`, or `Tour` to handle specific margin calculations.', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:58.006Z', N'2026-09-17T07:52:58.245Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (62, N'DocumentationRepo', N'17_Domain_Schema_and_Workflow.md', N'User Manual', NULL, NULL, N'How to 2.4 financial & p&l entities?', N'financial, entities, 17_domain_schema_and_workflow, budget, actuals, tracks, tour, realization, expenses, estimates, supports, multi, currency, conversions, vendorpayment, records, supplier, payments, and, enforces, digital, invoice, document, attachments, for', N'### 2.4 Financial & P&L Entities

*   **Budget & Actuals:** Tracks Tour Realization expenses vs estimates. Supports Multi-Currency conversions.
*   **VendorPayment:** Records supplier payments and enforces digital invoice document attachments for compliance.
*   **TourGuideWallet (Petty Cash):** Manages on-site collections and reconciles against local spot expenses.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.006Z', N'2026-09-17T07:52:58.246Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (63, N'DocumentationRepo', N'17_Domain_Schema_and_Workflow.md', N'User Manual', NULL, NULL, N'How to 3. financial workflow?', N'financial, workflow, 17_domain_schema_and_workflow, mermaid, sequencediagram, participant, salespipeline, ops, finance, manager, kanban, stage, confirmed, lock, initial, budget, estimates, build, city, stays, map, services, log', N'### 3. Financial Workflow

```mermaid
sequenceDiagram
    participant SalesPipeline
    participant Ops
    participant Finance
    participant Manager

    SalesPipeline->>Ops: Kanban Stage -> "Confirmed"
    Ops->>Finance: Lock Initial Budget Estimates
    Ops->>Ops: Build City Stays & Map Services
    Ops->>Finance: Log Expected Supplier Costs (AP)
    Finance->>Finance: Receive Digital Invoices & Log Vendor Payments
    Ops->>Finance: Guide Reconciles Wallet (On-site Collections)
    Finance->>Finance: Log Actuals vs Budget
    opt Actual > Budget by 5%
        Finance->>Manager: Trigger Overspend Approval Workflow
    end
    Finance->>Finance: Calculate Net Margin & Profit pp
```', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.007Z', N'2026-09-17T07:52:58.247Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (64, N'DocumentationRepo', N'18_User_Management_Epic_Stories.md', N'User Manual', NULL, NULL, N'How to epic: user management module?', N'epic, user, management, module, 18_user_management_epic_stories, description, core, component, the, unoerp, travel, operations, dmc, platform, provides, comprehensive, role, based, access, control, rbac, and, lifecycle, ensures, that', N'### Epic: User Management Module

**Description:**
As a core component of the UnoERP Travel Operations & DMC Management Platform, the User Management Module provides comprehensive Role-Based Access Control (RBAC) and user lifecycle management. It ensures that internal employees—categorized primarily as Admins, Managers, and Staff—have the correct module-level view and edit rights across various business areas (e.g., Itineraries, Bookings, Suppliers, Finance, and System Configuration).

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.009Z', N'2026-09-17T07:52:58.253Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (65, N'DocumentationRepo', N'18_User_Management_Epic_Stories.md', N'User Manual', NULL, NULL, N'How to feature 1: user account lifecycle management?', N'feature, user, account, lifecycle, management, 18_user_management_epic_stories, enables, system, administrators, provision, update, and, deprecate, accounts, securely, within, unoerp', N'### Feature 1: User Account Lifecycle Management

*Enables system administrators to provision, update, and deprecate user accounts securely within UnoERP.*', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.010Z', N'2026-09-17T07:52:58.254Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (66, N'DocumentationRepo', N'18_User_Management_Epic_Stories.md', N'User Manual', NULL, NULL, N'How to user story 1.1: create new system users?', N'user, story, create, new, system, users, 18_user_management_epic_stories, admin, want, accounts, that, travel, staff, and, managers, can, access, the, unoerp, perform, their, duties, acceptance, criteria, navigate', N'### User Story 1.1: Create New System Users

**As an** Admin  
**I want to** create new user accounts  
**So that** new travel staff and managers can access the UnoERP system to perform their duties.

**Acceptance Criteria:**
- [ ] Admin can navigate to the "User Management" dashboard and click "Add User".
- [ ] Form requires Name, valid Email address, and initial System Role (Admin, Manager, Staff).
- [ ] System automatically sends an invitation email to the provided address with a secure link to set their initial password.
- [ ] System prevents creation of duplicate accounts based on email address.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.010Z', N'2026-09-17T07:52:58.255Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (67, N'DocumentationRepo', N'18_User_Management_Epic_Stories.md', N'User Manual', NULL, NULL, N'How to user story 1.2: edit and deactivate users?', N'user, story, edit, and, deactivate, users, 18_user_management_epic_stories, admin, want, update, details, their, accounts, that, can, keep, staff, information, current, immediately, revoke, access, for, employees, who', N'### User Story 1.2: Edit and Deactivate Users

**As an** Admin  
**I want to** update user details or deactivate their accounts  
**So that** I can keep staff information current and immediately revoke access for employees who leave the DMC.

**Acceptance Criteria:**
- [ ] Admin can toggle a user''s status between "Active" and "Inactive".
- [ ] Inactive users are instantly logged out and prevented from authenticating.
- [ ] Admin can update a user''s basic profile details (Name, Department/Branch).
- [ ] History log captures the date, time, and actor who deactivated the account.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.011Z', N'2026-09-17T07:52:58.255Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (68, N'DocumentationRepo', N'18_User_Management_Epic_Stories.md', N'User Manual', NULL, NULL, N'How to user story 1.3: user profile management?', N'user, story, profile, management, 18_user_management_epic_stories, logged, admin, manager, staff, want, view, and, update, personal, password, that, contact, details, are, date, account, remains, secure, acceptance, criteria', N'### User Story 1.3: User Profile Management

**As a** Logged-in User (Admin, Manager, or Staff)  
**I want to** view and update my personal profile and password  
**So that** my contact details are up to date and my account remains secure.

**Acceptance Criteria:**
- [ ] User can access a "My Profile" page.
- [ ] User can update their contact phone number and preferred display name.
- [ ] User can securely change their password (requires entering current password).

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.011Z', N'2026-09-17T07:52:58.256Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (69, N'DocumentationRepo', N'18_User_Management_Epic_Stories.md', N'User Manual', NULL, NULL, N'How to feature 2: role & module-level permissions control?', N'feature, role, module, level, permissions, control, 18_user_management_epic_stories, controls, access, governance, combining, overarching, roles, with, granular, per, rights', N'### Feature 2: Role & Module-Level Permissions Control

*Controls access governance by combining overarching roles with granular, per-module rights.*', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.012Z', N'2026-09-17T07:52:58.257Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (70, N'DocumentationRepo', N'18_User_Management_Epic_Stories.md', N'User Manual', NULL, NULL, N'How to user story 2.1: assign and manage base roles?', N'user, story, assign, and, manage, base, roles, 18_user_management_epic_stories, admin, want, system, role, manager, staff, each, that, they, inherit, standardized, set, baseline, permissions, tailored, their, seniority', N'### User Story 2.1: Assign and Manage Base Roles

**As an** Admin  
**I want to** assign a base system role (Admin, Manager, Staff) to each user  
**So that** they inherit a standardized set of baseline permissions tailored to their seniority.

**Acceptance Criteria:**
- [ ] Admins have unrestricted View/Edit access to all modules, including System Configuration.
- [ ] Managers inherit default View/Edit access to operational modules (Bookings, Itineraries, Suppliers) but are restricted from System Configuration.
- [ ] Staff inherit default View-only access to operational modules, with Edit access restricted to their directly assigned tasks or specific modules.
- [ ] Changing a user''s base role immediately updates their baseline access matrix.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.012Z', N'2026-09-17T07:52:58.257Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (71, N'DocumentationRepo', N'18_User_Management_Epic_Stories.md', N'User Manual', NULL, NULL, N'How to user story 2.2: configure granular module-level rights?', N'user, story, configure, granular, module, level, rights, 18_user_management_epic_stories, admin, want, override, base, role, permissions, with, specific, view, and, edit, per, that, can, tailor, access, for', N'### User Story 2.2: Configure Granular Module-Level Rights

**As an** Admin  
**I want to** override base role permissions with specific view and edit rights per module  
**So that** I can tailor access for specialized staff (e.g., giving a Staff member "Edit" rights in ''Suppliers'' but strictly "No Access" in ''Finance'').

**Acceptance Criteria:**
- [ ] Admin can open a "Permissions Matrix" for any given user.
- [ ] Matrix lists all UnoERP modules (e.g., CRM, Itineraries, Bookings, Finance, Suppliers, Inventory).
- [ ] For each module, Admin can select: `None`, `View Only`, or `View & Edit`.
- [ ] Granular user-level assignments override the user''s base role defaults.
- [ ] UI visually distinguishes between inherited role permissions and custom overrides.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.013Z', N'2026-09-17T07:52:58.258Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (72, N'DocumentationRepo', N'18_User_Management_Epic_Stories.md', N'User Manual', NULL, NULL, N'How to user story 2.3: enforce managerial oversight?', N'user, story, enforce, managerial, oversight, 18_user_management_epic_stories, manager, want, have, full, read, and, edit, access, department, operational, modules, that, can, oversee, daily, travel, operations, approve, bookings', N'### User Story 2.3: Enforce Managerial Oversight

**As a** Manager  
**I want to** have full read and edit access to my department''s operational modules  
**So that** I can oversee daily travel operations, approve bookings, and correct staff errors without needing full Admin privileges.

**Acceptance Criteria:**
- [ ] System authorizes Managers to perform CRUD (Create, Read, Update, Delete) operations in core modules (e.g., Itineraries, Bookings).
- [ ] System denies Manager access to User Management and Global Settings modules unless explicitly overridden by an Admin.
- [ ] Unauthorized access attempts result in a clear, user-friendly "Insufficient Permissions" UI message.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.013Z', N'2026-09-17T07:52:58.258Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (73, N'DocumentationRepo', N'18_User_Management_Epic_Stories.md', N'User Manual', NULL, NULL, N'How to user story 2.4: safe staff operations?', N'user, story, safe, staff, operations, 18_user_management_epic_stories, member, want, restricted, view, only, limited, editing, non, relevant, modules, that, can, look, necessary, information, like, supplier, phone, number', N'### User Story 2.4: Safe Staff Operations

**As a** Staff member  
**I want to** be restricted to ''view only'' or limited editing in non-relevant modules  
**So that** I can look up necessary information (like a supplier''s phone number) without the risk of accidentally altering critical platform data.

**Acceptance Criteria:**
- [ ] When a module is set to `View Only`, all "Save", "Edit", "Delete", and "Add" buttons within that module are hidden or disabled.
- [ ] Staff can successfully navigate and read data grids, profiles, and reports in `View Only` modules.
- [ ] Any API requests attempting to bypass the UI for an edit action without `View & Edit` permissions are blocked with a 403 Forbidden response.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.014Z', N'2026-09-17T07:52:58.258Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (74, N'DocumentationRepo', N'19_User_Management_RBAC.md', N'User Manual', NULL, NULL, N'How to business case review: unoerp user management module (sprint 0)?', N'business, case, review, unoerp, user, management, module, sprint, 19_user_management_rbac, product, manager, scrum, master, team, from, senior, analyst, date, planning, subject, analysis, compliance, and, scope, definition', N'### Business Case Review: UnoERP User Management Module (Sprint 0)

**To:** Product Manager, Scrum Master, QA Team
**From:** Senior Business Analyst
**Date:** Sprint 0 Planning
**Subject:** Sprint 0 Analysis, Compliance, and Scope Definition for User Management Module

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.029Z', N'2026-09-17T07:52:58.268Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (75, N'DocumentationRepo', N'19_User_Management_RBAC.md', N'User Manual', NULL, NULL, N'How to 1. executive summary?', N'executive, summary, 19_user_management_rbac, lay, the, groundwork, for, unoerp, sprint, user, management, module, must, recognized, not, merely, functional, requirement, but, foundational, security, and, compliance, perimeter, product', N'### 1. Executive Summary

As we lay the groundwork for UnoERP in Sprint 0, the User Management Module must be recognized not merely as a functional requirement, but as the foundational security and compliance perimeter of the product. This analysis evaluates the conceptual business case, establishes competitive feature parity, defines the role-based access control (RBAC) strategy, and outlines strict compliance requirements to ensure we deliver a compliant, competitive, and lean MVP.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.029Z', N'2026-09-17T07:52:58.269Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (76, N'DocumentationRepo', N'19_User_Management_RBAC.md', N'User Manual', NULL, NULL, N'How to 2. strategic & competitive analysis?', N'strategic, competitive, analysis, 19_user_management_rbac, compete, with, established, mid, market, erps, odoo, microsoft, dynamics, netsuite, unoerp, must, provide, frictionless, onboarding, robust, security, and, intuitive, delegation, authority', N'### 2. Strategic & Competitive Analysis

To compete with established mid-market ERPs (e.g., Odoo, Microsoft Dynamics 365, NetSuite), UnoERP must provide frictionless onboarding, robust security, and intuitive delegation of authority.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.030Z', N'2026-09-17T07:52:58.269Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (77, N'DocumentationRepo', N'19_User_Management_RBAC.md', N'User Manual', NULL, NULL, N'How to competitive parity requirements?', N'competitive, parity, requirements, 19_user_management_rbac, competitors, treat, user, management, enterprise, governance, tool, achieve, market, unoerp, must, support, centralized, provisioning, deprovisioning, quick, onboarding, and, offboarding, workflows, hierarchical', N'### Competitive Parity Requirements

Competitors treat user management as an enterprise governance tool. To achieve market parity, UnoERP must support:
*   **Centralized Provisioning/Deprovisioning:** Quick onboarding and offboarding workflows.
*   **Hierarchical Structuring:** Reflecting real-world organizational charts.
*   **Auditability:** Transparent logging of high-privilege actions.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.031Z', N'2026-09-17T07:52:58.270Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (78, N'DocumentationRepo', N'19_User_Management_RBAC.md', N'User Manual', NULL, NULL, N'How to profile strategy?', N'profile, strategy, 19_user_management_rbac, admin, system, administrator, business, value, reduces, overhead, centralizing, environment, configuration, security, policies, and, user, provisioning, competitive, edge, must, support, bulk, import, tools', N'### Profile Strategy

*   **Admin (System Administrator):** 
    *   *Business Value:* Reduces IT overhead by centralizing environment configuration, security policies, and user provisioning.
    *   *Competitive Edge:* Must support bulk-import tools and impersonation (for troubleshooting) to match competitor standards.
*   **Manager (Department/Team Lead):** 
    *   *Business Value:* Decentralizes operational bottlenecks. Managers need oversight of their team''s productivity and the ability to approve workflows.
    *   *Competitive Edge:* Dashboard views of team activity and contextual approval notifications.
*   **Staff (Standard User):** 
    *   *Business Value:* Drives daily operations. Needs a distraction-free, task-oriented interface.
    *   *Competitive Edge:* Self-service portal for managing personal data, passwords, and preferences, reducing support tickets.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.031Z', N'2026-09-17T07:52:58.270Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (79, N'DocumentationRepo', N'19_User_Management_RBAC.md', N'User Manual', NULL, NULL, N'How to 3. compliance & data privacy requirements?', N'compliance, data, privacy, requirements, 19_user_management_rbac, given, the, regulatory, landscape, unoerp, cannot, afford, retroactive, following, frameworks, dictate, our, baseline, architecture', N'### 3. Compliance & Data Privacy Requirements

Given the regulatory landscape, UnoERP cannot afford retroactive compliance. The following frameworks dictate our baseline architecture:', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.032Z', N'2026-09-17T07:52:58.271Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (80, N'DocumentationRepo', N'19_User_Management_RBAC.md', N'User Manual', NULL, NULL, N'How to gdpr (general data protection regulation)?', N'gdpr, general, data, protection, regulation, 19_user_management_rbac, right, forgotten, erasure, the, system, must, include, soft, delete, mechanism, that, anonymizes, personally, identifiable, information, pii, without, breaking, historical', N'### GDPR (General Data Protection Regulation)

*   **Right to be Forgotten / Data Erasure:** The system must include a soft-delete mechanism that anonymizes personally identifiable information (PII) without breaking historical transactional data (e.g., sales records tied to a former employee).
*   **Data Minimization:** Only collect essential data (Name, Corporate Email, Role). Personal phone numbers or home addresses should not be mandatory unless required by a specific HR sub-module.
*   **Consent & Auditability:** User logins, profile changes, and permission escalations must be logged in an immutable audit trail to prove compliance during regulatory audits.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.033Z', N'2026-09-17T07:52:58.272Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (81, N'DocumentationRepo', N'19_User_Management_RBAC.md', N'User Manual', NULL, NULL, N'How to cross-industry considerations?', N'cross, industry, considerations, 19_user_management_rbac, soc, iso, while, unoerp, may, not, pursue, certification, day, one, the, architecture, must, support, secure, password, hashing, bcrypt, argon2, via, asp', N'### Cross-Industry Considerations

*   **SOC 2 / ISO 27001:** While UnoERP may not pursue certification on day one, the architecture must support secure password hashing (BCrypt/Argon2 via ASP.NET Core Identity), session timeouts, and MFA (Multi-Factor Authentication) readiness.
*   **HIPAA / PCI-DSS (If Applicable to target market):** If UnoERP targets healthcare or retail, Staff profiles must have automated session termination after periods of inactivity, and Admin logs must mask all payment or health-related data.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.033Z', N'2026-09-17T07:52:58.272Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (82, N'DocumentationRepo', N'19_User_Management_RBAC.md', N'User Manual', NULL, NULL, N'How to 4. module-level view & edit rights strategy (rbac)?', N'module, level, view, edit, rights, strategy, rbac, 19_user_management_rbac, prevent, unauthorized, data, exposure, unoerp, will, implement, strict, role, based, access, control, matrix, entity, admin, manager, staff', N'### 4. Module-Level View & Edit Rights Strategy (RBAC)

To prevent unauthorized data exposure, UnoERP will implement a strict Role-Based Access Control matrix. 

| Module / Entity | Admin | Manager | Staff |
| :--- | :--- | :--- | :--- |
| **System Settings** | View / Edit | Hidden | Hidden |
| **User Directory** | View / Edit / Delete | View (Team Only) | View (Basic Info Only) |
| **Audit Logs** | View / Export | Hidden | Hidden |
| **Department Data** | View / Edit | View / Edit (Own Dept) | View / Edit (Assigned tasks) |
| **Personal Profile** | View / Edit | View / Edit | View / Edit |

*   *Strategy Note for QA:* Test cases must explicitly verify "Negative Access"—ensuring that Staff and Managers receive unauthorized (403) errors when attempting to access URLs or API endpoints reserved for Admins.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.034Z', N'2026-09-17T07:52:58.273Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (83, N'DocumentationRepo', N'19_User_Management_RBAC.md', N'User Manual', NULL, NULL, N'How to 5. scope definition: lean mvp (sprint 1)?', N'scope, definition, lean, mvp, sprint, 19_user_management_rbac, ensure, maintain, agile, approach, and, not, over, engineer, the, initial, release, propose, following, boundaries, for, standard, authentication, email, password', N'### 5. Scope Definition: Lean MVP (Sprint 1)

To ensure we maintain a Lean Agile approach and do not over-engineer the initial release, I propose the following scope boundaries for Sprint 1:

**In-Scope for Sprint 1 (MVP):**
*   Standard Authentication (Email/Password) utilizing ASP.NET Core Identity.
*   Static Role Assignment (Admin, Manager, Staff) hardcoded into the initial database seed.
*   Basic CRUD operations for User Profiles.
*   Soft-delete functionality for GDPR compliance.
*   Session-cookie based authorization.

**Out-of-Scope for Sprint 1 (Pushed to Backlog):**
*   Dynamic Custom Role Creation (Users creating their own permission sets).
*   SSO Integrations (Azure AD, Google Workspace, SAML).
*   Multi-Factor Authentication (MFA) implementation (Scope for Sprint 3/4).
*   Advanced User Behavioral Analytics.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.035Z', N'2026-09-17T07:52:58.273Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (84, N'DocumentationRepo', N'19_User_Management_RBAC.md', N'User Manual', NULL, NULL, N'How to 6. suggestions & improvements?', N'suggestions, improvements, 19_user_management_rbac, technical, alignment, since, this, net, based, project, leverage, the, built, microsoft, aspnetcore, identity, framework, not, build, custom, cryptography, session, management, significantly, accelerates', N'### 6. Suggestions & Improvements

1.  **Technical Alignment:** Since this is a .NET-based project, leverage the built-in `Microsoft.AspNetCore.Identity` framework. Do not build custom cryptography or session management. This significantly accelerates time-to-market and inherently covers many security best practices.
2.  **Manager Delegation:** Introduce a "Delegated Admin" sub-role later in the roadmap to allow Managers to reset passwords for their specific team members, reducing the burden on the global Admin.
3.  **UI/UX Principle:** The Staff view should default to a "Principle of Least Privilege" UI. If a user cannot edit a field, do not show a disabled text box; render it as plain text or hide it entirely to reduce cognitive load.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.036Z', N'2026-09-17T07:52:58.273Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (85, N'DocumentationRepo', N'19_User_Management_RBAC.md', N'User Manual', NULL, NULL, N'How to 7. business approvals?', N'business, approvals, 19_user_management_rbac, status, approved, with, conditions, for, proceeding, sprint, product, manager, confirm, the, deferred, items, sso, custom, roles, are, acceptable, initial, customer, beta, scrum', N'### 7. Business Approvals

**Status:** 🟢 **APPROVED WITH CONDITIONS**

**Conditions for Proceeding to Sprint 1:**
1.  **Product Manager:** Confirm the deferred items (SSO, Custom Roles) are acceptable for the initial customer beta.
2.  **Scrum Master:** Ensure the Sprint 1 backlog strictly reflects the MVP scope outlined above. Any deviation requires a formal scope-change request.
3.  **QA Team:** Begin drafting test plans specifically targeting the RBAC matrix and GDPR "soft-delete" workflows to ensure transactional integrity is maintained when a user is deactivated.

Please review and provide final sign-off so we may transition these requirements into actionable user stories.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.036Z', N'2026-09-17T07:52:58.274Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (86, N'DocumentationRepo', N'20_User_Management_Test_Plans.md', N'User Manual', NULL, NULL, N'How to 1. test strategy & scope?', N'test, strategy, scope, 20_user_management_test_plans, the, user, management, module, unoerp, requires, strict, validation, role, based, access, control, rbac, boundaries, core, roles, are, admin, manager, and, staff', N'### 1. Test Strategy & Scope

The User Management Module in UnoERP requires strict validation of Role-Based Access Control (RBAC) boundaries. The core roles are Admin, Manager, and Staff.
- **Admin**: Full access (View, Create, Edit, Delete users, Manage roles/permissions).
- **Manager**: Partial access (View all staff, Edit staff under their hierarchy, Cannot create/delete admins).
- **Staff**: Read-only access to their own profile, cannot view other users'' sensitive details.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.041Z', N'2026-09-17T07:52:58.278Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (87, N'DocumentationRepo', N'20_User_Management_Test_Plans.md', N'User Manual', NULL, NULL, N'How to test automation matrix?', N'test, automation, matrix, 20_user_management_test_plans, feature, admin, manager, staff, login, session, validated, view, user, list, full, filtered, team, only, access, denied, create, new, allowed, all, roles', N'### Test Automation Matrix

| Feature | Admin | Manager | Staff |
| :--- | :--- | :--- | :--- |
| **Login / Session** | Validated | Validated | Validated |
| **View User List** | Full View | Filtered View (Team only) | Access Denied (403) |
| **Create New User** | Allowed (All Roles)| Allowed (Staff only) | Access Denied (403) |
| **Edit User Profile** | Full Edit | Edit Team only | Self-Edit (Limited) |
| **Delete User** | Allowed | Access Denied | Access Denied (403) |', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.042Z', N'2026-09-17T07:52:58.278Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (88, N'DocumentationRepo', N'20_User_Management_Test_Plans.md', N'User Manual', NULL, NULL, N'How to 2. test repository architecture?', N'test, repository, architecture, 20_user_management_test_plans, following, the, standard, directory, layout, for, maximum, scalability, and, clear, separation, concerns, text, unoerp, e2e, tests, github, workflows, yml, pipelines, rbac', N'### 2. Test Repository Architecture

Following the Standard Directory Layout for maximum scalability and clear separation of concerns:
```text
unoerp-e2e-tests/
├── .github/
│   └── workflows/
│       └── e2e-tests.yml        # CI/CD pipelines
├── tests/
│   ├── ui/
│   │   └── rbac/                # UI RBAC test suites
│   │       ├── admin.spec.ts
│   │       ├── manager.spec.ts
│   │       └── staff.spec.ts
│   ├── api/
│   │   └── rbac/                # API RBAC endpoint security tests
│   ├── performance/             # Load testing for user management
│   └── smoke/                   # Critical path smoke tests
├── pages/                       # Page Object Models
│   ├── LoginPage.ts
│   ├── UserDashboardPage.ts
│   └── UserFormModal.ts
├── api/                         # API validation clients
│   └── UserApiClient.ts
├── data/                        # Deterministic test data & fixtures
│   └── users.json
└── playwright.config.ts         # Playwright execution configurations
```', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.043Z', N'2026-09-17T07:52:58.279Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (89, N'DocumentationRepo', N'20_User_Management_Test_Plans.md', N'User Manual', NULL, NULL, N'How to 3. ui automation & page object models (pom)?', N'automation, page, object, models, pom, 20_user_management_test_plans, rule, isolation, using, data, attributes, selectors, must, rely, stable, testid, create, user, btn, keep, tests, completely, independent, brittle, css', N'### 3. UI Automation & Page Object Models (POM)

**Rule: UI Isolation using Data Attributes.**
Selectors must rely on stable `data-testid` attributes (e.g., `data-testid="create-user-btn"`) to keep UI tests completely independent of brittle CSS layout paths.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.044Z', N'2026-09-17T07:52:58.279Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (90, N'DocumentationRepo', N'20_User_Management_Test_Plans.md', N'User Manual', NULL, NULL, N'How to pom implementation example (playwright)?', N'pom, implementation, example, playwright, 20_user_management_test_plans, typescript, pages, userdashboardpage, import, page, locator, expect, from, test, export, class, readonly, createuserbtn, userlisttable, deleteuserbtns, constructor', N'### POM Implementation Example (Playwright)

```typescript
// pages/UserDashboardPage.ts
import { Page, Locator, expect } from ''@playwright/test'';

export class UserDashboardPage {
  readonly page: Page;
  readonly createUserBtn: Locator;
  readonly userListTable: Locator;
  readonly deleteUserBtns: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createUserBtn = page.getByTestId(''create-user-btn'');
    this.userListTable = page.getByTestId(''user-list-table'');
    this.deleteUserBtns = page.getByTestId(''delete-user-btn'');
  }

  async goto() {
    await this.page.goto(''/users'');
    await this.page.waitForLoadState(''networkidle''); // Dynamic event-driven wait
  }

  async verifyCreateButtonHidden() {
    await expect(this.createUserBtn).toBeHidden();
  }
}
```', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.044Z', N'2026-09-17T07:52:58.279Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (91, N'DocumentationRepo', N'20_User_Management_Test_Plans.md', N'User Manual', NULL, NULL, N'How to idempotent test example?', N'idempotent, test, example, 20_user_management_test_plans, typescript, tests, rbac, manager, spec, import, expect, from, playwright, userdashboardpage, pages, describe, role, use, isolated, auth, state, for, storagestate, json', N'### Idempotent Test Example

```typescript
// tests/ui/rbac/manager.spec.ts
import { test, expect } from ''@playwright/test'';
import { UserDashboardPage } from ''../../../pages/UserDashboardPage'';

test.describe(''RBAC - Manager Role'', () => {
  // Use isolated auth state for Manager
  test.use({ storageState: ''manager-auth.json'' });

  test(''Manager cannot see delete buttons for users'', async ({ page }) => {
    const dashboard = new UserDashboardPage(page);
    await dashboard.goto();
    
    // Assert deletion controls are entirely absent from the DOM
    await expect(dashboard.deleteUserBtns).toHaveCount(0);
  });
});
```', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.045Z', N'2026-09-17T07:52:58.280Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (92, N'DocumentationRepo', N'20_User_Management_Test_Plans.md', N'User Manual', NULL, NULL, N'How to 4. api validation strategies?', N'api, validation, strategies, 20_user_management_test_plans, testing, ensures, that, rbac, enforced, the, backend, preventing, broken, access, control, idor, privilege, escalation, rules, assert, exact, status, codes, validating, http', N'### 4. API Validation Strategies

API testing ensures that RBAC is enforced on the backend, preventing broken-access control (IDOR or privilege escalation).

**Rules:**
1. **Assert Exact Status Codes**: Validating HTTP 403 Forbidden over UI states.
2. **Validate Schema Structure**: Assert response schema against expected boundaries.
3. **No Secret Hardcoding**: API tokens must be pulled from secure environment variables.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.045Z', N'2026-09-17T07:52:58.281Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (93, N'DocumentationRepo', N'20_User_Management_Test_Plans.md', N'User Manual', NULL, NULL, N'How to api validation example?', N'api, validation, example, 20_user_management_test_plans, typescript, tests, rbac, staff, spec, import, test, expect, from, playwright, describe, role, receives, forbidden, when, attempting, fetch, all, users, async, request', N'### API Validation Example

```typescript
// tests/api/rbac/staff.api.spec.ts
import { test, expect } from ''@playwright/test'';

test.describe(''API RBAC - Staff Role'', () => {
  test(''Staff receives 403 Forbidden when attempting to fetch all users'', async ({ request }) => {
    const response = await request.get(''/api/v1/users'', {
      headers: { ''Authorization'': `Bearer ${process.env.STAFF_TOKEN}` }
    });
    
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.error).toBe(''Insufficient permissions to view resource.'');
  });

  test(''Staff can update their own profile but cannot escalate role'', async ({ request }) => {
    const response = await request.patch(`/api/v1/users/${process.env.STAFF_ID}`, {
      headers: { ''Authorization'': `Bearer ${process.env.STAFF_TOKEN}` },
      data: { 
        phoneNumber: ''555-0199'',
        role: ''Admin'' // Malicious escalation attempt
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    
    // Ensure role did NOT change despite request body
    expect(body.data.role).toBe(''Staff'');
    expect(body.data.phoneNumber).toBe(''555-0199'');
  });
});
```', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.045Z', N'2026-09-17T07:52:58.281Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (94, N'DocumentationRepo', N'20_User_Management_Test_Plans.md', N'User Manual', NULL, NULL, N'How to 5. ci/cd reliability & flakiness controls?', N'reliability, flakiness, controls, 20_user_management_test_plans, maintain, absolute, trust, the, pipeline, strict, are, enforced, zero, tolerance, for, hardcoded, sleeps, scripts, must, rely, api, response, interception, waitforresponse, state', N'### 5. CI/CD Reliability & Flakiness Controls

To maintain absolute trust in the pipeline, strict reliability controls are enforced.

1. **Zero Tolerance for Hardcoded Sleeps**: Scripts must rely on API response interception (`waitForResponse`) or state changes (`waitForSelector`, `toHaveClass`) instead of `page.waitForTimeout(5000)`.
2. **Retry Boundaries**: Global retry configured to a strict maximum (`retries: process.env.CI ? 2 : 0`). Tests failing >2 times are automatically quarantined.
3. **Deterministic Data (Idempotence)**: Every test is responsible for establishing its own state. Random entities are injected using fixtures and torn down via API `afterAll` hooks to prevent collisions.
4. **Pipeline Gates**: 
   - `e2e-api-tests`: Executes first as a fast feedback loop.
   - `e2e-ui-tests`: Executes in parallel matrix only if API passes. PRs are strictly blocked on failure.
   - **Artifacts**: Playwright traces and HTML reports are attached to the pipeline to eliminate local "works on my machine" blindspots.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.046Z', N'2026-09-17T07:52:58.282Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (95, N'DocumentationRepo', N'Backlog_Sprints_1_3.md', N'User Manual', NULL, NULL, N'How to uno erp: backlog & sprint planning (mvp)?', N'uno, erp, backlog, sprint, planning, mvp, backlog_sprints_1_3, authored, delivery, orchestrator, stepping, for, productowner, total, hours, logged, 12h', N'### UNO ERP: Backlog & Sprint Planning (MVP)

*Authored by: Delivery Orchestrator (Stepping in for ProductOwner)*
*Total Hours Logged: 12h*', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.051Z', N'2026-09-17T07:52:58.285Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (96, N'DocumentationRepo', N'Backlog_Sprints_1_3.md', N'Master Data', NULL, NULL, N'How to sprint 1: core master data & crm?', N'sprint, core, master, data, crm, backlog_sprints_1_3, goal, establish, the, foundation, for, and, allow, operations, create, projects, bind, clients, admin, want, manage, directory, hotels, guides, transport', N'### Sprint 1: Core Master Data & CRM

**Goal:** Establish the foundation for Master Data and allow operations to create Projects and bind Clients.

*   **[US-101]** As an Admin, I want to manage a directory of Hotels and Guides.
*   **[US-102]** As an Admin, I want to create a Transport Company and add specific Drivers.
*   **[US-103]** As an Admin, I want to categorize Excursion Facilities (Restaurants, Tickets, Tours).
*   **[US-104]** As an Operations Manager, I want to create a new Project/Tour and assign it to a Client.
*   **[US-105]** As an Operator, I want to upload an Excel file of Client data and map the column headers to the system''s dropdown properties (Dynamic Mapper).', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:58.052Z', N'2026-09-17T07:52:58.285Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (97, N'DocumentationRepo', N'Backlog_Sprints_1_3.md', N'User Manual', NULL, NULL, N'How to sprint 2: multi-city itineraries & pipeline?', N'sprint, multi, city, itineraries, pipeline, backlog_sprints_1_3, goal, introduce, complex, routing, link, master, data, services, and, establish, the, kanban, board, operator, want, add, multiple, stays, project', N'### Sprint 2: Multi-City Itineraries & Pipeline

**Goal:** Introduce complex multi-city routing, link master data to services, and establish the Kanban board.

*   **[US-201]** As an Operator, I want to add multiple "City Stays" to a Project.
*   **[US-202]** As an Operator, I want to attach a Hotel Booking to a specific City Stay.
*   **[US-203]** As a Sales Manager, I want to view a Kanban board of my Tours and drag them between stages (Opportunity -> Quoted -> Confirmed).
*   **[US-204]** As a Guide Coordinator, I want to log an "Extra Tour" sale, and have the system auto-calculate Guide Commission and Net Profit.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.052Z', N'2026-09-17T07:52:58.286Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (98, N'DocumentationRepo', N'Backlog_Sprints_1_3.md', N'KPI Proposal', NULL, NULL, N'How to sprint 3: the operational dashboard?', N'sprint, the, operational, dashboard, backlog_sprints_1_3, goal, surface, critical, alerts, and, timelines, new, timeline, first, operations, manager, want, view, active, projects, plotted, horizontal, gantt, operator, see', N'### Sprint 3: The Operational Dashboard

**Goal:** Surface critical operational alerts and timelines in the new Timeline-First Dashboard.

*   **[US-301]** As an Operations Manager, I want to view active Projects plotted on a horizontal Gantt Timeline.
*   **[US-302]** As an Operator, I want to see global "Alerts & To-Dos" in a persistent right-hand panel.
*   **[US-303]** As an Operations Manager, I want to view a "Guide Overview" grid on the dashboard showing guide availability.
*   **[US-304]** As an Operator, when I click on a Project bar within the Timeline, I want the right-hand panel to gracefully slide out and display that specific Project''s details.', N'/projects', N'Executive Dashboard', 1, N'2026-08-20T16:52:58.053Z', N'2026-09-17T07:52:58.287Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (99, N'DocumentationRepo', N'BA_Excel_Data_Integration.md', N'Excel Import Guide', NULL, NULL, N'How to business analysis report: excel data integration strategy?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Business Analysis Report: Excel Data Integration Strategy

**Project:** Uno ERP System - Sprint 1
**Document Type:** Business Architecture & Integration Proposal
**Target Audience:** Product Manager, Scrum Master, QA Team

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:58.061Z', N'2026-09-17T07:52:58.290Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (100, N'DocumentationRepo', N'BA_Excel_Data_Integration.md', N'User Manual', NULL, NULL, N'How to 1. executive summary?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 1. Executive Summary

Following a detailed review of the recent "Tur_satis" (Excursion Sales) and "Rooming" Excel exports, it is evident that our operational tracking is currently siloed and heavily reliant on unstructured local files. The operations team uses these spreadsheets to manage individual passenger attendance, room allocations, and optional excursion revenues. To support robust development for the Uno ERP system, this document outlines our integration strategy, identifies compliance gaps, and proposes critical architectural adjustments to bridge the gap between high-level financial bookings and on-the-ground operations.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.061Z', N'2026-09-17T07:52:58.291Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (101, N'DocumentationRepo', N'BA_Excel_Data_Integration.md', N'Excel Import Guide', NULL, NULL, N'How to 2. sprint 1 excel import template updates?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 2. Sprint 1 Excel Import Template Updates

As part of the Sprint 1 kickoff, the core `uno_import_template.xlsx` has been officially updated to accommodate new schema changes. The updated entity mappings are as follows:', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:58.062Z', N'2026-09-17T07:52:58.291Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (102, N'DocumentationRepo', N'BA_Excel_Data_Integration.md', N'Master Data', NULL, NULL, N'How to 2.1 hotels sheet (master & contract data)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 2.1 Hotels Sheet (Master & Contract Data)

- **Start/End Dates:** `StartDate`, `EndDate` added to manage seasonal contracts or specific booking validity windows.
- **Multiple Rates:** `RateType_1`, `RatePrice_1`, `RateType_2`, `RatePrice_2` to handle varying seasonal or room-type specific pricing.
- **Service Flags:** `IsBase`, `IsExtra`, `IsOperational` booleans added to categorize the hotel''s operational role.
- **Pax & Base Fees:** `PaxAdult`, `PaxChild`, `BaseFeeAdult`, `BaseFeeChild` added to support dynamic Base Fee calculations based on demographic counts.', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:58.062Z', N'2026-09-17T07:52:58.292Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (103, N'DocumentationRepo', N'BA_Excel_Data_Integration.md', N'User Manual', NULL, NULL, N'How to 2.2 tourservices & tours sheets?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 2.2 TourServices & Tours Sheets

- **TourServices:** Now includes `StartDate`, `EndDate`, `PaxAdult`, `PaxChild`, and the `IsBase`, `IsExtra`, `IsOperational` flags to mirror the granularity required for Expandable pivot-table views on the frontend.
- **Tours:** Replaced generic `Pax` column with distinct `PaxAdult` and `PaxChild` columns to support accurate financial modeling.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.063Z', N'2026-09-17T07:52:58.292Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (104, N'DocumentationRepo', N'BA_Excel_Data_Integration.md', N'User Manual', NULL, NULL, N'How to a. rooming lists (e.g., `vi 1007 bvsp rooming.xlsx`, `final rooming list...`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### A. Rooming Lists (e.g., `VI 1007 BVSP rooming.xlsx`, `Final Rooming list...`)

- **Structure:** Highly unstructured with varying column layouts, merged cells, and complex headers. 
- **Content:** Primarily tracks individual travelers assigned to specific rooms, flights, and tour dates. 
- **Business Use:** Identifies who is physically attending the tour, representing the concrete individuals behind an abstract "Booking" entity.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.063Z', N'2026-09-17T07:52:58.292Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (105, N'DocumentationRepo', N'BA_Excel_Data_Integration.md', N'User Manual', NULL, NULL, N'How to b. tur satis / excursion sales lists (e.g., `tur_satis_19072025.xlsx`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### B. Tur Satis / Excursion Sales Lists (e.g., `Tur_satis_19072025.xlsx`)

- **Structure:** Matrix format where rows represent individual passengers (`Isim Soyad`) and columns represent specific optional excursions.
- **Embedded Logic:** 
  - Prices are frequently hardcoded in column headers.
  - Contains attendance flags (`arrived`, `geldi`).
  - Includes demographic/pricing flags (`Child`) to indicate discounted rates.
  - Generates a per-passenger `Total` revenue column, which is crucial for daily guide accounting.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.064Z', N'2026-09-17T07:52:58.293Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (106, N'DocumentationRepo', N'BA_Excel_Data_Integration.md', N'User Manual', NULL, NULL, N'How to 4. integration proposal & data modeling?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 4. Integration Proposal & Data Modeling

The current Uno ERP models (`Project`, `Tour`, `Excursion`, `Booking`, `TourService`) handle macro-level operations but fail to capture micro-level passenger transactions. I propose adding the following entities to complete our workflow:', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.064Z', N'2026-09-17T07:52:58.294Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (107, N'DocumentationRepo', N'BA_Excel_Data_Integration.md', N'User Manual', NULL, NULL, N'How to model 1: `passenger`?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Model 1: `Passenger`

- **Rationale:** A `Booking` represents the overall financial transaction and the primary contact (the payer), but a rooming list contains multiple unique individuals (the travelers). 
- **Recommendation:** Create a `Passenger` (or `Customer`) model that belongs to a `Booking` (Many-to-One). This allows the tracking of individual passport details, room assignments, and demographics (Adult/Child) without polluting the core `Booking` entity.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.065Z', N'2026-09-17T07:52:58.294Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (108, N'DocumentationRepo', N'BA_Excel_Data_Integration.md', N'User Manual', NULL, NULL, N'How to model 2: `passengerexcursion` (or `excursionsale`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Model 2: `PassengerExcursion` (or `ExcursionSale`)

- **Rationale:** We must capture the matrix data from the "Tur_satis" files. An overall tour has many excursions, but we need to know *which specific passenger* bought *which specific excursion*.
- **Fields Needed:**
  - `PassengerId` and `ExcursionId` (Foreign Keys)
  - `SalePrice`: Crucial for tracking dynamic pricing (adult vs. child discounts).
  - `AttendanceStatus`: Enum (e.g., `Pending`, `Arrived`, `No-Show`).', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.065Z', N'2026-09-17T07:52:58.294Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (109, N'DocumentationRepo', N'BA_Excel_Data_Integration.md', N'User Manual', NULL, NULL, N'How to 5. competitor comparison & strategic gaps?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 5. Competitor Comparison & Strategic Gaps

- **Industry Standard Comparison:** Leading tourism ERPs natively utilize a standard hierarchy: **Booking → Passengers → Passenger Add-ons/Activities**. Our current proposed structure is missing the bottom tier of this hierarchy.
- **Strategic Gap:** Without tracking excursions at the passenger level, we cannot natively automate Guide Commission calculations or dynamically apply Base Fee calculations based on Adult/Child counts.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.066Z', N'2026-09-17T07:52:58.295Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (110, N'DocumentationRepo', N'BA_Excel_Data_Integration.md', N'User Manual', NULL, NULL, N'How to 6. compliance & data privacy (gdpr / kvkk)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 6. Compliance & Data Privacy (GDPR / KVKK)

- **Critical Risk Identified:** The storage of PII in loose local Excel files scattered across guide laptops constitutes a significant GDPR/KVKK vulnerability. 
- **Mitigation:** Migrating this unstructured data into the centralized Uno ERP database with proper Role-Based Access Control (RBAC) is non-negotiable.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.066Z', N'2026-09-17T07:52:58.295Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (111, N'DocumentationRepo', N'BA_Excel_Data_Integration.md', N'User Manual', NULL, NULL, N'How to 7. business approvals & next steps?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 7. Business Approvals & Next Steps

**Approval Status:** **APPROVED TO PROCEED FOR SPRINT 1**
- **Action Items for Dev/PM:** 
  1. The `uno_import_template.xlsx` is now fully updated and finalized for Sprint 1 development.
  2. Implement backend parsers to handle the new `StartDate`, `EndDate`, `IsBase`, `IsExtra`, and `IsOperational` flags.
  3. Ensure the UI grid supports Expandable pivot-table views that pivot on these new categorical flags and pax demographics.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.066Z', N'2026-09-17T07:52:58.296Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (112, N'DocumentationRepo', N'tour_calendar_backlog.md', N'User Manual', NULL, NULL, N'How to [cal-ui-001] multi-view calendar display?', N'cal, multi, view, calendar, display, tour_calendar_backlog, user, story, operations, staff, member, want, toggle, between, daily, weekly, and, monthly, views, acceptance, criteria, given, the, tour, page', N'### [CAL-UI-001] Multi-View Calendar Display

**User Story:** As an operations staff member, I want to toggle between daily, weekly, and monthly calendar views.
**Acceptance Criteria:**
- **Given** I am on the Tour Calendar page
- **When** I click the Daily, Weekly, or Monthly view buttons
- **Then** the calendar updates to reflect the selected time horizon
- **And** tour blocks span the correct start and end dates/times in the destination''s timezone.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.076Z', N'2026-09-17T07:52:58.300Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (113, N'DocumentationRepo', N'tour_calendar_backlog.md', N'User Manual', NULL, NULL, N'How to [cal-ui-002] tour block quick-view?', N'cal, tour, block, quick, view, tour_calendar_backlog, user, story, operations, staff, member, want, click, hover, over, see, more, details, without, navigating, away, gdpr, constraints, the, modal', N'### [CAL-UI-002] Tour Block Quick-View

**User Story:** As an operations staff member, I want to click or hover over a tour block to see more details without navigating away.
**GDPR Constraints:** The modal must not display sensitive personal contact info (e.g., Guide''s private phone number) unless the user has specific Manager roles.
**Acceptance Criteria:**
- **Given** the calendar is populated with tour blocks
- **When** I hover or click on a tour block
- **Then** a modal/tooltip containing detailed tour info appears.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.077Z', N'2026-09-17T07:52:58.301Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (114, N'DocumentationRepo', N'tour_calendar_backlog.md', N'Process Flow', NULL, NULL, N'How to [cal-ui-003] status and availability indicators?', N'cal, status, and, availability, indicators, tour_calendar_backlog, user, story, operations, staff, member, want, tour, blocks, color, coded, based, their, display, capacity, metrics, acceptance, criteria, given, view', N'### [CAL-UI-003] Status and Availability Indicators

**User Story:** As an operations staff member, I want tour blocks to be color-coded based on their status and display capacity metrics.
**Acceptance Criteria:**
- **Given** I view the calendar
- **When** I look at the tour blocks
- **Then** they are color-coded (Planned, Confirmed, In-Progress, Completed, Cancelled)
- **And** availability metrics (e.g., "15/20 Booked") are displayed directly on the block.', N'/tours', N'Tour Status Kanban', 1, N'2026-08-20T16:52:58.077Z', N'2026-09-17T07:52:58.302Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (115, N'DocumentationRepo', N'tour_calendar_backlog.md', N'User Manual', NULL, NULL, N'How to [cal-ui-004] double-booking visual warnings?', N'cal, double, booking, visual, warnings, tour_calendar_backlog, user, story, scheduling, manager, want, the, system, visually, flag, conflicting, schedules, booked, guides, acceptance, criteria, given, guide, assigned, two', N'### [CAL-UI-004] Double-booking Visual Warnings

**User Story:** As a scheduling manager, I want the system to visually flag conflicting schedules (e.g., double-booked guides).
**Acceptance Criteria:**
- **Given** a guide is assigned to two overlapping tours
- **When** I view the calendar
- **Then** a highly visible warning indicator is displayed on those tour blocks.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.077Z', N'2026-09-17T07:52:58.303Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (116, N'DocumentationRepo', N'tour_calendar_backlog.md', N'User Manual', NULL, NULL, N'How to [cal-ui-005] multi-select resource filtering?', N'cal, multi, select, resource, filtering, tour_calendar_backlog, user, story, operations, staff, member, want, filter, the, calendar, tour, attributes, guides, hotels, and, excursions, acceptance, criteria, given, sidebar', N'### [CAL-UI-005] Multi-select Resource Filtering

**User Story:** As an operations staff member, I want to filter the calendar by tour attributes, guides, hotels, and excursions.
**Acceptance Criteria:**
- **Given** the calendar filter sidebar is open
- **When** I apply one or multiple filters
- **Then** the calendar seamlessly updates to display only matching tour blocks.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.078Z', N'2026-09-17T07:52:58.303Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (117, N'DocumentationRepo', N'tour_calendar_backlog.md', N'User Manual', NULL, NULL, N'How to [cal-ui-006] drag-and-drop rescheduling?', N'cal, drag, and, drop, rescheduling, tour_calendar_backlog, user, story, scheduling, manager, want, tour, blocks, reschedule, them, reassign, guides, acceptance, criteria, given, have, permissions, when, block, new', N'### [CAL-UI-006] Drag-and-Drop Rescheduling

**User Story:** As a scheduling manager, I want to drag-and-drop tour blocks to reschedule them or reassign guides.
**Acceptance Criteria:**
- **Given** I have scheduling permissions
- **When** I drag a tour block to a new date or guide row
- **Then** the system prompts for confirmation and updates the schedule.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.078Z', N'2026-09-17T07:52:58.304Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (118, N'DocumentationRepo', N'tour_calendar_backlog.md', N'User Manual', NULL, NULL, N'How to [cal-api-001] fetch calendar data?', N'cal, api, fetch, calendar, data, tour_calendar_backlog, user, story, the, must, rapidly, and, aggregate, scheduling, for, view, business, rules, support, multi, timezone, conversions, queries, complete, within', N'### [CAL-API-001] Fetch Calendar Data

**User Story:** As the API, I must rapidly fetch and aggregate scheduling data for the calendar view.
**Business Rules:** Must support multi-timezone conversions. Queries must complete within 2 seconds for up to 1000 entries.
**Acceptance Criteria:**
- **Given** the UI requests calendar data with a specific date range
- **When** `GET /api/calendar/tours` is called
- **Then** the API returns the aggregated tour data within 2 seconds
- **And** all dates/times reflect the correct timezone.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.079Z', N'2026-09-17T07:52:58.305Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (119, N'DocumentationRepo', N'tour_calendar_backlog.md', N'User Manual', NULL, NULL, N'How to [cal-api-002] filter calendar data?', N'cal, api, filter, calendar, data, tour_calendar_backlog, user, story, the, must, support, complex, multi, select, filtering, for, acceptance, criteria, given, request, with, query, parameters, tour, types', N'### [CAL-API-002] Filter Calendar Data

**User Story:** As the API, I must support complex multi-select filtering for the calendar.
**Acceptance Criteria:**
- **Given** a request with query parameters for Tour Types, Guides, Hotels, or Excursions
- **When** the calendar endpoint is called
- **Then** the API filters the dataset in the database and returns the precise matching records.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.079Z', N'2026-09-17T07:52:58.305Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (120, N'DocumentationRepo', N'tour_calendar_backlog.md', N'User Manual', NULL, NULL, N'How to [cal-api-003] role-based access control (rbac) data masking?', N'cal, api, role, based, access, control, rbac, data, masking, tour_calendar_backlog, user, story, the, must, enforce, ensure, users, only, see, appropriate, gdpr, privacy, constraints, guides, their', N'### [CAL-API-003] Role-Based Access Control (RBAC) Data Masking

**User Story:** As the API, I must enforce RBAC to ensure users only see appropriate data.
**GDPR/Privacy Constraints:** Guides only see their own assigned tours. Managers have global visibility.
**Acceptance Criteria:**
- **Given** a Guide requests calendar data
- **When** the API processes the request
- **Then** it only returns tours assigned to that specific Guide.
- **And** personal contact info of clients is masked.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.080Z', N'2026-09-17T07:52:58.306Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (121, N'DocumentationRepo', N'tour_calendar_backlog.md', N'User Manual', NULL, NULL, N'How to [cal-api-004] reschedule tour validation?', N'cal, api, reschedule, tour, validation, tour_calendar_backlog, user, story, the, must, validate, and, save, drag, drop, rescheduling, actions, business, rules, prevent, double, booking, unless, explicitly, overridden', N'### [CAL-API-004] Reschedule Tour Validation

**User Story:** As the API, I must validate and save drag-and-drop rescheduling actions.
**Business Rules:** Prevent double-booking unless explicitly overridden by a manager.
**Acceptance Criteria:**
- **Given** a request to update a tour''s date or assigned guide via `PUT /api/calendar/tours/{id}/reschedule`
- **When** the new assignment causes a double-booking conflict
- **Then** the API returns a 409 Conflict warning
- **And** if no conflict exists, the update is saved successfully.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.080Z', N'2026-09-17T07:52:58.307Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (122, N'DocumentationRepo', N'tour_calendar_business_requirements.md', N'User Manual', NULL, NULL, N'How to 1. executive summary?', N'executive, summary, tour_calendar_business_requirements, the, tour, calendar, new, feature, within, tours, module, unoerp, system, this, aims, streamline, scheduling, tracking, and, management, consolidating, schedules, resource, allocation, guides', N'### 1. Executive Summary

The ''Tour Calendar'' is a new feature within the ''Tours'' module of the UNOERP system. This feature aims to streamline the scheduling, tracking, and management of tours. By consolidating schedules, resource allocation (guides, hotels, excursions), and availability into a single unified view, operational efficiency will significantly improve and scheduling conflicts will be minimized.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.083Z', N'2026-09-17T07:52:58.310Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (123, N'DocumentationRepo', N'tour_calendar_business_requirements.md', N'User Manual', NULL, NULL, N'How to 2. business objectives?', N'business, objectives, tour_calendar_business_requirements, provide, centralized, visual, dashboard, for, all, tour, operations, reduce, booking, and, scheduling, conflicts, clearly, displaying, availability, status, allow, quick, drill, down, into', N'### 2. Business Objectives

- Provide a centralized, visual dashboard for all tour operations.
- Reduce booking and scheduling conflicts by clearly displaying availability and status.
- Allow quick drill-down into specific resources such as Guides, Hotels, and Excursions via intuitive filtering.
- Empower operational staff to make real-time decisions based on up-to-date schedule data.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.084Z', N'2026-09-17T07:52:58.310Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (124, N'DocumentationRepo', N'tour_calendar_business_requirements.md', N'User Manual', NULL, NULL, N'How to 3. competitive analysis & strategic fit?', N'competitive, analysis, strategic, fit, tour_calendar_business_requirements, when, comparing, this, proposed, feature, against, industry, leaders, such, rezdy, fareharbor, and, tourplan, competitor, baseline, standard, tour, management, platforms, provide', N'### 3. Competitive Analysis & Strategic Fit

When comparing this proposed feature against industry leaders such as Rezdy, FareHarbor, and Tourplan:
- **Competitor Baseline:** Standard tour management platforms provide robust calendar interfaces with drag-and-drop capabilities, real-time availability sync, and deep integrations with resource management.
- **Strategic Gaps in Current Concept:** The initial concept mentions viewing and filtering but lacks explicit mention of drag-and-drop rescheduling, multi-timezone support, or direct integrations with third-party distribution channels (OTAs). Adding role-based access control (RBAC) specifically for the calendar (e.g., Guides only seeing their assigned tours) is a strategic must.
- **Compliance Considerations:** Ensure that displaying Guide and Hotel information complies with GDPR (or local data privacy regulations). Avoid exposing personal contact information directly on high-level calendar views unless authorized.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.084Z', N'2026-09-17T07:52:58.311Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (125, N'DocumentationRepo', N'tour_calendar_business_requirements.md', N'User Manual', NULL, NULL, N'How to in scope?', N'scope, tour_calendar_business_requirements, interactive, calendar, view, the, tour, schedule, advanced, filtering, mechanics, tours, guides, hotels, excursions, consolidated, availability, and, status, indicators, tooltip, quick, modals, for, detailed', N'### In Scope

- Interactive calendar view of the tour schedule.
- Advanced filtering mechanics (Tours, Guides, Hotels, Excursions).
- Consolidated availability and status indicators.
- Tooltip or quick-view modals for detailed tour information.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.085Z', N'2026-09-17T07:52:58.311Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (126, N'DocumentationRepo', N'tour_calendar_business_requirements.md', N'User Manual', NULL, NULL, N'How to out of scope (for phase 1)?', N'out, scope, for, phase, tour_calendar_business_requirements, automated, based, scheduling, direct, booking, from, the, calendar, interface, this, operational, view, not, point, sale', N'### Out of Scope (For Phase 1)

- Automated AI-based scheduling.
- Direct booking from the calendar interface (this is an operational view, not a point-of-sale).', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.085Z', N'2026-09-17T07:52:58.312Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (127, N'DocumentationRepo', N'tour_calendar_business_requirements.md', N'User Manual', NULL, NULL, N'How to fr1: calendar interface?', N'fr1, calendar, interface, tour_calendar_business_requirements, the, system, shall, display, with, daily, weekly, and, monthly, views, populate, tour, blocks, based, scheduled, start, end, dates, times', N'### FR1: Calendar Interface

- The system shall display a calendar interface with daily, weekly, and monthly views.
- The calendar shall populate tour blocks based on scheduled start and end dates/times.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.085Z', N'2026-09-17T07:52:58.312Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (128, N'DocumentationRepo', N'tour_calendar_business_requirements.md', N'User Manual', NULL, NULL, N'How to fr2: filtering mechanism?', N'fr2, filtering, mechanism, tour_calendar_business_requirements, the, system, shall, provide, multi, select, filters, for, tours, filter, tour, type, destination, specific, package, guides, assigned, personnel, quickly, view, guide', N'### FR2: Filtering Mechanism

- The system shall provide multi-select filters for:
  - **Tours:** Filter by tour type, destination, or specific tour package.
  - **Guides:** Filter by assigned personnel to quickly view a guide''s itinerary.
  - **Hotels:** Filter by accommodation to track room blocks or pickup/drop-off points.
  - **Excursions:** Filter by specific activities or day-trips within larger tours.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.086Z', N'2026-09-17T07:52:58.313Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (129, N'DocumentationRepo', N'tour_calendar_business_requirements.md', N'Process Flow', NULL, NULL, N'How to fr3: availability and status indicators?', N'fr3, availability, and, status, indicators, tour_calendar_business_requirements, the, calendar, blocks, shall, clearly, display, tour, planned, confirmed, progress, completed, cancelled, using, distinct, color, codes, system, metrics, booked', N'### FR3: Availability and Status Indicators

- The calendar blocks shall clearly display the status of the tour (e.g., Planned, Confirmed, In-Progress, Completed, Cancelled) using distinct color codes.
- The system shall display availability metrics (e.g., "15/20 Booked") directly on the calendar block.
- Conflicting schedules (e.g., double-booked guides) must trigger a visual warning indicator.', N'/tours', N'Tour Status Kanban', 1, N'2026-08-20T16:52:58.086Z', N'2026-09-17T07:52:58.313Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (130, N'DocumentationRepo', N'tour_calendar_business_requirements.md', N'User Manual', NULL, NULL, N'How to 6. non-functional requirements?', N'non, functional, requirements, tour_calendar_business_requirements, performance, the, calendar, must, load, current, month, schedule, within, seconds, for, tour, entries, usability, interface, fully, responsive, accessible, both, desktop, and', N'### 6. Non-Functional Requirements

- **Performance:** The calendar must load the current month''s schedule within 2 seconds for up to 1,000 tour entries.
- **Usability:** The interface must be fully responsive, accessible on both desktop and tablet devices used by operations staff.
- **Reliability:** Data must reflect real-time database state to prevent overbooking.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.087Z', N'2026-09-17T07:52:58.314Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (131, N'DocumentationRepo', N'tour_calendar_business_requirements.md', N'User Manual', NULL, NULL, N'How to 7. next steps & approvals?', N'next, steps, approvals, tour_calendar_business_requirements, team, create, high, fidelity, wireframes, the, calendar, view, and, filter, sidebars, technical, architecture, review, finalize, data, aggregation, for, consolidated, without, performance', N'### 7. Next Steps & Approvals

- UI/UX team to create high-fidelity wireframes of the calendar view and filter sidebars.
- Technical Architecture review to finalize data aggregation for the consolidated view without performance degradation.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.087Z', N'2026-09-17T07:52:58.314Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (132, N'DocumentationRepo', N'tour_calendar_ui_design.md', N'User Manual', NULL, NULL, N'How to tour calendar ui/ux design specifications?', N'tour, calendar, design, specifications, tour_calendar_ui_design, this, document, outlines, the, for, unoerp, feature, based, provided, business, requirements, and, technical, backlog', N'### Tour Calendar UI/UX Design Specifications

This document outlines the UI design for the UNOERP Tour Calendar feature, based on the provided business requirements and technical backlog.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.091Z', N'2026-09-17T07:52:58.318Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (133, N'DocumentationRepo', N'tour_calendar_ui_design.md', N'User Manual', NULL, NULL, N'How to 1. overall layout & structure?', N'overall, layout, structure, tour_calendar_ui_design, the, interface, uses, classic, sidebar, main, content, which, ideal, for, complex, filtering, alongside, large, viewing, area, calendar, grid', N'### 1. Overall Layout & Structure

The interface uses a classic **Sidebar + Main Content** layout, which is ideal for complex filtering alongside a large viewing area for the calendar grid.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.091Z', N'2026-09-17T07:52:58.319Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (134, N'DocumentationRepo', N'tour_calendar_ui_design.md', N'User Manual', NULL, NULL, N'How to ascii wireframe (desktop/tablet landscape)?', N'ascii, wireframe, desktop, tablet, landscape, tour_calendar_ui_design, text, unoerp, logo, today, august, day, week, month, filters, mon', N'### ASCII Wireframe (Desktop/Tablet Landscape)

```text
+-----------------------------------------------------------------------------------+
|  [UNOERP Logo]   [ Today ] [ < ] [ August 2026 ] [ > ]     [Day][Week][Month] [👤]|
+----------------+------------------------------------------------------------------+
| Filters        |  MON 03       TUE 04       WED 05       THU 06       FRI 07      |
| [Clear All]    | +------------+------------+------------+------------+------------+
|                | |            | [!] Warn   |            |            |            |
| v TOURS        | |            | ■ City Tour|            |            |            |
|   [x] City     | |            | 10:00-14:00|            |            |            |
|   [ ] Nature   | |            | 15/20      |            |            |            |
|   Destinations | |            +------------+------------+            |            |
|                | |            |            | ■ Boat Tour|            |            |
| v GUIDES       | |            |            | 09:00-12:00|            |            |
|   [ ] Alice    | |            |            | 20/20 FULL |            |            |
|   [x] Bob      | +------------+------------+------------+------------+------------+
|                | | ■ Museum   |            |            |            |            |
| v HOTELS       | | 13:00-16:00|            |            |            |            |
|   [ ] Hilton   | | 05/30      |            |            |            |            |
|   [ ] Marriott | +------------+------------+------------+------------+------------+
|                |                                                                  |
| v EXCURSIONS   | Legend: [■ Planned] [■ Confirmed] [■ In-Progress] [■ Completed]  |
|   [ ] Diving   |         [■ Cancelled]   [!] Conflict/Warning                     |
+----------------+------------------------------------------------------------------+
```', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.092Z', N'2026-09-17T07:52:58.320Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (135, N'DocumentationRepo', N'tour_calendar_ui_design.md', N'User Manual', NULL, NULL, N'How to 2.1. top navigation bar?', N'top, navigation, bar, tour_calendar_ui_design, date, controls, today, button, left, right, arrows, for, and, current, range, display, august, view, toggles, segmented, control, day, week, month, views', N'### 2.1. Top Navigation Bar

- **Date Controls:** "Today" button, left/right arrows for navigation, and current date range display (e.g., "August 2026").
- **View Toggles:** segmented control for "Day", "Week", and "Month" views.
- **User Profile:** indicates current role (e.g., Manager vs. Guide) for RBAC enforcement.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.092Z', N'2026-09-17T07:52:58.320Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (136, N'DocumentationRepo', N'tour_calendar_ui_design.md', N'User Manual', NULL, NULL, N'How to 2.2. filter sidebar (left panel)?', N'filter, sidebar, left, panel, tour_calendar_ui_design, collapsible, accordions, filters, grouped, into, tours, guides, hotels, and, excursions, multi, select, checkboxes, users, can, multiple, items, per, category, dynamic', N'### 2.2. Filter Sidebar (Left Panel)

- **Collapsible Accordions:** Filters grouped into `Tours`, `Guides`, `Hotels`, and `Excursions`.
- **Multi-select Checkboxes:** Users can select multiple items per category.
- **Dynamic Updates:** Applying a filter immediately updates the calendar data (debounced API calls to ensure performance < 2 seconds).
- **Responsive Behavior:** On tablets (portrait) or smaller screens, the sidebar collapses into a slide-out drawer accessible via a "Filter" icon button.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.093Z', N'2026-09-17T07:52:58.321Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (137, N'DocumentationRepo', N'tour_calendar_ui_design.md', N'User Manual', NULL, NULL, N'How to 2.3. calendar grid & tour blocks?', N'calendar, grid, tour, blocks, tour_calendar_ui_design, each, block, inside, the, contains, status, color, bar, background, planned, light, blue, confirmed, green, progress, orange, completed, dark, gray, cancelled', N'### 2.3. Calendar Grid & Tour Blocks

Each Tour Block inside the calendar grid contains:
1. **Status Color Bar/Background:**
   - 🟦 **Planned:** Light Blue
   - 🟩 **Confirmed:** Green
   - 🟧 **In-Progress:** Orange
   - ⬛ **Completed:** Dark Gray
   - 🟥 **Cancelled:** Red
2. **Title & Time:** Shortened tour name and time block (e.g., "City Tour | 10:00-14:00").
3. **Availability Metrics:** Text indicating capacity, e.g., `15/20 Booked`. If full, styled boldly as `20/20 FULL`.
4. **Warning Indicator:** A highly visible `[!]` icon (yellow/red triangle) if there is a scheduling conflict (e.g., double-booked guide).', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.093Z', N'2026-09-17T07:52:58.321Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (138, N'DocumentationRepo', N'tour_calendar_ui_design.md', N'User Manual', NULL, NULL, N'How to 2.4. quick-view modal (hover/click)?', N'quick, view, modal, hover, click, tour_calendar_ui_design, when, user, hovers, over, clicks, tour, block, popover, tooltip, appears, displaying, full, name, status, date, time, assigned, guide, associated', N'### 2.4. Quick-View Modal (Hover/Click)

When a user hovers over or clicks a tour block, a popover/tooltip appears displaying:
- **Full Tour Name & Status**
- **Date & Time**
- **Assigned Guide(s)**
- **Associated Hotel(s) / Pickups**
- **Included Excursions**
- **Capacity:** `15 / 20 (5 remaining)`
- *(Note: No sensitive personal contact info displayed to comply with GDPR.)*
- **Action Button:** "View Full Details" (navigates to the tour detail page).', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.094Z', N'2026-09-17T07:52:58.321Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (139, N'DocumentationRepo', N'tour_calendar_ui_design.md', N'User Manual', NULL, NULL, N'How to 3. ui component hierarchy (mermaid diagram)?', N'component, hierarchy, mermaid, diagram, tour_calendar_ui_design, graph, tour, calendar, page, top, navigation, bar, sidebar, filters, main, view, date, navigator, toggles, day, week, month, user, context, rbac', N'### 3. UI Component Hierarchy (Mermaid Diagram)

```mermaid
graph TD
    A[Tour Calendar Page] --> B[Top Navigation Bar]
    A --> C[Sidebar Filters]
    A --> D[Calendar Main View]
    
    B --> B1[Date Navigator]
    B --> B2[View Toggles: Day/Week/Month]
    B --> B3[User Context / RBAC]
    
    C --> C1[Tours Filter]
    C --> C2[Guides Filter]
    C --> C3[Hotels Filter]
    C --> C4[Excursions Filter]
    
    D --> D1[Calendar Grid]
    D1 --> D2[Tour Event Block]
    
    D2 --> E1[Status Color]
    D2 --> E2[Time & Title]
    D2 --> E3[Capacity Text]
    D2 --> E4[Conflict Warning Icon]
    D2 --> E5[Hover Quick-View Modal]
```', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.094Z', N'2026-09-17T07:52:58.322Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (140, N'DocumentationRepo', N'tour_calendar_ui_design.md', N'User Manual', NULL, NULL, N'How to 4. design & usability principles applied?', N'design, usability, principles, applied, tour_calendar_ui_design, scannability, status, colors, and, bold, availability, metrics, allow, operations, managers, assess, the, day, state, single, glance, clarity, over, clutter, quick', N'### 4. Design & Usability Principles Applied

- **Scannability:** Status colors and bold availability metrics allow operations managers to assess the day''s state at a single glance.
- **Clarity over Clutter:** The Quick-View modal keeps the main calendar grid clean while still providing deep dive capabilities.
- **Proactive Error Handling:** The explicit warning icon for double-bookings instantly draws the scheduler''s attention to resource conflicts.
- **Role-Based Views:** The interface implicitly adapts based on the logged-in user, showing a simplified, read-only view for Guides and a comprehensive, filterable view for Managers.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.094Z', N'2026-09-17T07:52:58.322Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (141, N'DocumentationRepo', N'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', N'General', N'General', N'', N'How to uno_erp executive kpi dashboard proposal?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### UNO_ERP Executive KPI Dashboard Proposal

**24 High-Impact Key Performance Indicators for Tour Operator Excellence & Profit Optimization**  
*Prepared for the Executive Leadership & Owner of UNO | August 2026*

---', N'/tours', N'View Tours', 1, N'2026-08-20T16:52:58.097Z', N'2026-10-25T18:37:52.267Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (142, N'DocumentationRepo', N'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', N'General', N'General', N'', N'How to executive summary?', N'executive, summary, uno_erp_executive_kpi_dashboard_proposal, specialized, tour, operator, dmc, managing, complex, multi, destination, group, tours, across, central, europe, budapest, vienna, prague, uno, requires, complete, operational, visibility, tight, risk, governance, and, real, time', N'### Executive Summary

As a specialized Tour Operator & DMC managing complex multi-destination group tours across Central Europe (e.g. Budapest–Vienna–Prague), **UNO** requires complete operational visibility, tight risk governance, and real-time margin tracking. 

This proposal outlines **24 High-Impact Key Performance Indicators (KPIs)** organized into **4 Strategic Categories** to empower the owner of UNO to instantly identify operational bottlenecks, financial leakages, supplier inefficiencies, and growth opportunities.

---', N'/tours', N'View Tours', 1, N'2026-08-20T16:52:58.098Z', N'2026-10-25T18:37:52.268Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (143, N'DocumentationRepo', N'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', N'General', N'General', N'', N'How to 1. operational efficiency kpis (6 kpis)?', N'operational, efficiency, kpis, uno_erp_executive_kpi_dashboard_proposal, kpi, name, target, sla, calculation, formula, strategic, value, impact, departure, readiness, gate, pass, rate, within, 72h, ready, tours, total, upcoming, prevents, last, minute, emergency, calls', N'### 1. Operational Efficiency KPIs (6 KPIs)

| KPI # | KPI Name | Target SLA | Calculation Formula | Strategic Value & Operational Impact |
| :--- | :--- | :--- | :--- | :--- |
| **KPI 1** | **Departure Readiness Gate Pass Rate (%)** | **100%** within 72h | `(Ready Tours / Total Upcoming Tours) × 100` | Prevents last-minute emergency calls, unassigned guides, or missing hotel rooming lists prior to tour departure. |
| **KPI 2** | **Rooming List Lock Accuracy (%)** | **> 98%** | `(Confirmed Roomings / Total Rooming Requests) × 100` | Eliminates single/double rooming errors, hotel check-in delays, and unexpected room surcharge penalties. |
| **KPI 3** | **Guide Capacity Utilization (%)** | **85% – 90%** | `(Assigned Tour Days / Contracted Days) × 100` | Maximizes top-tier guide productivity while avoiding burnout or idle retainer costs. |
| **KPI 4** | **Bus Seat Load Factor (%)** | **> 85%** | `(Total Passengers / Coach Seating Capacity) × 100` | Optimizes coach size selection (e.g. 35-seat vs 50-seat bus) to minimize transport cost per passenger. |
| **KPI 5** | **Supplier Confirmation Velocity (Hours)** | **< 24 Hours** | `Avg Hours from Booking Request to Supplier Confirmation` | Accelerates B2B client proposal turnaround and locks in competitive hotel group rates early. |
| **KPI 6** | **Automated Document Export Ratio (%)** | **> 95%** | `(System Vouchers & Manifests / Total Docs) × 100` | Saves operational staff 15+ hours weekly by automating PDF voucher & rooming list generation. |

---', N'/tours', N'View Tours', 1, N'2026-08-20T16:52:58.098Z', N'2026-10-25T18:37:52.269Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (144, N'DocumentationRepo', N'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', N'General', N'General', N'', N'How to 2. financial & profitability kpis (6 kpis)?', N'financial, profitability, kpis, uno_erp_executive_kpi_dashboard_proposal, kpi, name, target, sla, calculation, formula, strategic, value, operational, impact, excursion, sales, penetration, rate, pax, passengers, buying, excursions, total, measures, site, conversion, effectiv', N'### 2. Financial & Profitability KPIs (6 KPIs)

| KPI # | KPI Name | Target SLA | Calculation Formula | Strategic Value & Operational Impact |
| :--- | :--- | :--- | :--- | :--- |
| **KPI 7** | **Excursion Sales Penetration Rate (%)** | **> 75% Pax** | `(Passengers Buying Excursions / Total Pax) × 100` | Measures on-site sales conversion effectiveness and guide excursion promotion enthusiasm. |
| **KPI 8** | **Excursion Yield per Passenger (€)** | **> €120 / Pax** | `Total Excursion Revenue / Total Passengers` | Identifies high-performing tour itineraries and top revenue-generating optional excursions. |
| **KPI 9** | **Guide Commission Efficiency (%)** | **< 15% Margin** | `(Total Guide Commission Paid / Excursion Margin) × 100` | Ensures guide incentives drive profitable excursion sales while protecting net DMC margins. |
| **KPI 10** | **Cost per Pax Variance (€ & %)** | **± 2% Budget** | `Actual Settled Cost/Pax - Budgeted Cost/Pax` | Flags cost overruns in hotel night rates, city taxes, or entrance fees before final client settlement. |
| **KPI 11** | **Uninvoiced Service Cost Ratio (%)** | **< 1%** | `(Unbilled Supplier Costs / Total Expenses) × 100` | Prevents unbilled supplier expenses from slipping through without client re-invoicing. |
| **KPI 12** | **Gross Margin per Tour (€ & %)** | **> 22% Margin** | `((Total Revenue - Total Costs) / Total Revenue) × 100` | Provides the owner with instant visibility into which projects and tour series yield highest net profit. |

---', N'/tours', N'View Tours', 1, N'2026-08-20T16:52:58.099Z', N'2026-10-25T18:37:52.270Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (145, N'DocumentationRepo', N'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', N'General', N'General', N'', N'How to 3. governance, compliance & risk kpis (6 kpis)?', N'governance, compliance, risk, kpis, uno_erp_executive_kpi_dashboard_proposal, kpi, name, target, sla, calculation, formula, strategic, value, operational, impact, guide, cash, remittance, lag, days, hours, avg, from, tour, end, date, bank, deposit, enforces, rule', N'### 3. Governance, Compliance & Risk KPIs (6 KPIs)

| KPI # | KPI Name | Target SLA | Calculation Formula | Strategic Value & Operational Impact |
| :--- | :--- | :--- | :--- | :--- |
| **KPI 13** | **Guide Cash Remittance Lag (Days)** | **< 48 Hours** | `Avg Days from Tour End Date to Cash Bank Deposit` | Enforces Governance Rule 4 (*Separate Money Flows*) and accelerates cash flow collection. |
| **KPI 14** | **Excursion Cash Discrepancy Rate (%)** | **0.0%** | `\|Guide Cash Sales - Bank Deposit\| / Total Sales` | Detects cash leakages, currency conversion errors, or missing excursion receipts immediately. |
| **KPI 15** | **Unassigned Tour Resource Ratio (%)** | **0% within 7d** | `(Tours Missing Guide/Bus/Hotel / Total Tours) × 100` | Eliminates operational panics and quality degradation on upcoming departures. |
| **KPI 16** | **Passenger Data Completeness (%)** | **100% (7d prior)** | `(Pax with Valid Passport & Flight Info / Total Pax) × 100` | Prevents hotel check-in refusal and airport transfer miscommunication. |
| **KPI 17** | **Supplier Payment On-Time Rate (%)** | **> 98%** | `(Invoices Paid Within Credit Terms / Total Invoices) × 100` | Protects DMC reputation and secures preferred hotel room block allocations. |
| **KPI 18** | **Audit Trail Exception Count** | **< 5 / Month** | `Total Manual Price/Fee Overrides Logged in AuditLogs` | Ensures full administrative accountability and transparency across all financial overrides. |

---', N'/tours', N'View Tours', 1, N'2026-08-20T16:52:58.099Z', N'2026-10-25T18:37:52.270Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (146, N'DocumentationRepo', N'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', N'General', N'General', N'', N'How to 4. growth, opportunities & ai kpis (6 kpis)?', N'growth, opportunities, kpis, uno_erp_executive_kpi_dashboard_proposal, kpi, name, target, sla, calculation, formula, strategic, value, operational, impact, client, repeat, booking, rate, tour, operators, active, b2b, clients, measures, long, term, dmc, satisfaction, and', N'### 4. Growth, Opportunities & AI KPIs (6 KPIs)

| KPI # | KPI Name | Target SLA | Calculation Formula | Strategic Value & Operational Impact |
| :--- | :--- | :--- | :--- | :--- |
| **KPI 19** | **Client Repeat Booking Rate (%)** | **> 80%** | `(Repeat Tour Operators / Active B2B Clients) × 100` | Measures long-term DMC client satisfaction and recurring contract stability. |
| **KPI 20** | **Project Pax Load Factor (%)** | **> 90%** | `(Actual Booked Pax / Contracted Capacity) × 100` | Helps negotiate volume discounts with hotels and transport providers. |
| **KPI 21** | **Top Destination Margin Share (%)** | **Monitor Mix** | `Gross Profit from Top 3 Cities / Total Gross Profit` | Identifies geographic expansion opportunities and high-yielding tour itineraries. |
| **KPI 22** | **Guide Performance NPS Score** | **> 4.8 / 5.0** | `Average Passenger Feedback Rating per Guide` | Ensures high tour quality, passenger delight, and positive repeat trip reviews. |
| **KPI 23** | **Pre/Post Hotel Night Conversion (%)** | **> 15% Pax** | `(Passengers Booking Extra Nights / Total Pax) × 100` | Unlocks easy high-margin hotel commission upsells for early arrivals. |
| **KPI 24** | **AI Copilot Instant Resolution Rate (%)** | **> 90%** | `(Queries Resolved by AI Copilot / Total Staff Inquiries) × 100` | Reduces onboarding time for new operators and answers how-to questions 24/7. |

---', N'/tours', N'View Tours', 1, N'2026-08-20T16:52:58.100Z', N'2026-10-25T18:37:52.271Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (147, N'DocumentationRepo', N'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', N'General', N'General', N'', N'How to implementation roadmap?', N'implementation, roadmap, uno_erp_executive_kpi_dashboard_proposal, mermaid, gantt, title, executive, kpi, dashboard, development, timeline, dateformat, yyyy, section, phase, core, top, financial, operational, kpis, done, kpi1, risk, monitoring, automated, breach, alerts, guide, cash, lag', N'### Implementation Roadmap

```mermaid
gantt
    title Executive KPI Dashboard Development Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1: Core Dashboard
    Top 6 Core Financial & Operational KPIs :done, kpi1, 2026-08-18, 5d
    section Phase 2: Risk & AI Monitoring
    Automated Breach Alerts & Guide Cash Lag :active, kpi2, 2026-08-23, 7d
    section Phase 3: Advanced Analytics
    Full 24-KPI BI Dashboard & Board Export : kpi3, 2026-08-30, 7d
```

---', N'/tours', N'View Tours', 1, N'2026-08-20T16:52:58.100Z', N'2026-10-25T18:37:52.272Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (148, N'DocumentationRepo', N'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', N'General', N'General', N'', N'How to downloads & deliverables?', N'downloads, deliverables, uno_erp_executive_kpi_dashboard_proposal, powerpoint, presentation, pptx, file, ersen, projects_2025, uno_erp, usermanuals, pdf, document', N'### Downloads & Deliverables

- **PowerPoint Presentation**: [`UNO_ERP_Executive_KPI_Dashboard_Proposal.pptx`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/UNO_ERP_Executive_KPI_Dashboard_Proposal.pptx)
- **PDF Document**: [`UNO_ERP_Executive_KPI_Dashboard_Proposal.pdf`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/UNO_ERP_Executive_KPI_Dashboard_Proposal.pdf)', N'/tours', N'View Tours', 1, N'2026-08-20T16:52:58.101Z', N'2026-10-25T18:37:52.272Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (149, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'Excel Import Guide', NULL, NULL, N'How to uno erp - end-to-end comprehensive user manual & data import guide?', N'uno, erp, end, comprehensive, user, manual, data, import, guide, uno_erp_user_manual, system, travel, operations, dmc, management, platform, version, target, audience, administrators, tour, operators, operation, managers, guides', N'### UNO ERP - End-to-End Comprehensive User Manual & Data Import Guide

**System:** UNO ERP (Travel Operations ERP & DMC Management Platform)  
**Version:** 2.0  
**Target Audience:** System Administrators, Tour Operators, Operation Managers, Guides, and Financial Analysts.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:58.111Z', N'2026-09-17T07:52:58.334Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (150, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to table of contents?', N'table, contents, uno_erp_user_manual, overview, system, architecture, master, data, management, batch, upload, project, creation, life, cycle, tour, header, rooming, file', N'### Table of Contents

1. [Overview & System Architecture](#1-overview--system-architecture)
2. [Master Data Management & Batch Upload](#2-master-data-management--batch-upload)
3. [Project Creation & Life Cycle Management](#3-project-creation--life-cycle-management)
4. [Tour Header & Rooming File Upload](#4-tour-header--rooming-file-upload)
5. [Guide Excursion & Base Sales Workflow](#5-guide-excursion--base-sales-workflow)
   - 5.1 [Downloading the Passenger Sales File](#51-downloading-the-passenger-sales-file)
   - 5.2 [ExcursionSales Sheet Structure & Interactive Checkboxes](#52-excursionsales-sheet-structure--interactive-checkboxes)
   - 5.3 [BaseServices 10-Column Sheet Structure](#53-baseservices-10-column-sheet-structure)
   - 5.4 [Re-uploading Completed Sales Files](#54-re-uploading-completed-sales-files)
6. [Application Screen Field Mappings](#6-application-screen-field-mappings)
7. [Troubleshooting & Import Best Practices](#7-troubleshooting--import-best-practices)

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.111Z', N'2026-09-17T07:52:58.334Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (151, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to 1. overview & system architecture?', N'overview, system, architecture, uno_erp_user_manual, uno, erp, handles, complete, travel, dmc, operations, through, level, relational, entity, hierarchy, client, root, corporate, customer, agency, project, group, account, code', N'### 1. Overview & System Architecture

UNO ERP handles complete Travel & DMC operations through a 5-level relational entity hierarchy:
```
1. CLIENT (Root Corporate Customer / Agency)
   └── 2. PROJECT (Group Account / Project Code, e.g. PRJ-BVP2)
        └── 3. TOUR (Group Operation / Tour Code, e.g. PVB05072026)
             ├── 4. PASSENGERS & ROOMING (Pax Manifest, Room Allocations)
             └── 5. TOUR SERVICES & FINANCIALS (Hotels, Transfers, Excursions, Invoices)
```

The system provides a **Dual Operations Engine**:
- **Manual Form Entry:** Interactive UI screens (`/master-data`, `/projects`, `/projects/[id]/tours/[tourId]`) for manual creation and instant validation.
- **Batch Excel Stream Processing:** 3-Section Import Engine on `/master-data` with automatic temporary lock file (`~$`) skipping, header normalization, and transaction safety.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.112Z', N'2026-09-17T07:52:58.335Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (152, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'Master Data', NULL, NULL, N'How to 2. master data management & batch upload?', N'master, data, management, batch, upload, uno_erp_user_manual, forms, the, foundation, all, erp, operations, records, can, managed, manually, uploaded, via, section, import, page', N'### 2. Master Data Management & Batch Upload

Master Data forms the foundation of all ERP operations. Master records can be managed manually or batch uploaded via Section 1 of the `/master-data` import page.', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:58.112Z', N'2026-09-17T07:52:58.335Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (153, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'Excel Import Guide', NULL, NULL, N'How to 2.1 excel master data file format?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 2.1 Excel Master Data File Format

- **File Name:** `MasterData_Import_Template.xlsx` (or any `.xlsx` file containing standard sheets).
- **Supported Sheets:**
  1. `Clients`: Corporate customer accounts (`Name`, `TaxNo`, `ContactEmail`, `Phone`, `Address`, `BaseCurrency`).
  2. `Hotels`: Hotel partners (`Name`, `City`, `StarRating`, `SingleRate`, `DoubleRate`, `ContactPerson`).
  3. `Guides`: Tour guides (`FirstName`, `LastName`, `Languages`, `DailyRate`, `Phone`).
  4. `Drivers`: Vehicle drivers (`FirstName`, `LastName`, `LicenseType`, `Phone`, `TransportCompany`).
  5. `TransportCompanies`: Logistics vendors (`Name`, `FleetSize`, `ContactEmail`, `Phone`).
  6. `Vendors`: Third-party suppliers (`Name`, `ServiceType`, `ContactName`, `Email`, `Phone`).
  7. `Excursions`: Activity catalog (`Name`, `TourCode` / Excursion Code e.g. `PRG-KV`, `Price`, `SalePrice`, `Vendor`).', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:58.113Z', N'2026-09-17T07:52:58.336Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (154, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to 2.2 upload workflow?', N'upload, workflow, uno_erp_user_manual, navigate, master, data, the, application, header, menu, scroll, section, import, drag, and, drop, masterdata_import_template, xlsx, click, browse, file, api, parses, each, sheet', N'### 2.2 Upload Workflow

1. Navigate to `/master-data` in the application header menu.
2. Scroll to **Section 1: Master Data Import**.
3. Drag and drop `MasterData_Import_Template.xlsx` or click **Browse File**.
4. Click **Import Master Data**.
5. The API parses each sheet, creates database entries, and populates drop-down selectors across the entire system.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.113Z', N'2026-09-17T07:52:58.336Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (155, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to 3. project creation & life cycle management?', N'project, creation, life, cycle, management, uno_erp_user_manual, groups, individual, tour, operations, under, single, client, contract, prj, bvp2, for, central, europe, summer', N'### 3. Project Creation & Life Cycle Management

A **Project** groups individual tour operations under a single client contract (e.g. `PRJ-BVP2` for Central Europe Summer 2026).', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.114Z', N'2026-09-17T07:52:58.337Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (156, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to 3.1 manual project creation?', N'manual, project, creation, uno_erp_user_manual, navigate, projects, click, the, new, button, top, right, toolbar, fill, required, fields, client, select, existing, bonavita, travel, code, unique, alphanumeric, prj', N'### 3.1 Manual Project Creation

1. Navigate to `/projects`.
2. Click the **+ New Project** button in the top-right toolbar.
3. Fill in the required fields:
   - **Client:** Select existing Client (e.g. `Bonavita Travel`).
   - **Project Code:** Unique alphanumeric code (e.g. `PRJ-BVP2`).
   - **Start & End Dates:** Contract execution period.
   - **Approx. Budget:** Overall project revenue target.
   - **Status:** Initial status (`Planning`, `Active`, `Closed`).
4. Click **Save Project**.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.114Z', N'2026-09-17T07:52:58.337Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (157, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'Excel Import Guide', NULL, NULL, N'How to 3.2 automatic project creation via file import?', N'automatic, project, creation, via, file, import, uno_erp_user_manual, when, importing, tour, rooming, files, tourimporttemplate, xlsx, the, header, references, projectcode, prj, bvp2, that, does, not, yet, exist', N'### 3.2 Automatic Project Creation via File Import

When importing Tour Rooming files (`TourImportTemplate.xlsx`), if the file header references a `ProjectCode` (e.g. `PRJ-BVP2`) that does not yet exist in the system, the import engine automatically creates the Project record under the specified Client!

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:58.114Z', N'2026-09-17T07:52:58.338Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (158, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to 4. tour header & rooming file upload?', N'tour, header, rooming, file, upload, uno_erp_user_manual, files, import, operational, parameters, hotel, room, allocations, and, the, complete, passenger, manifest', N'### 4. Tour Header & Rooming File Upload

Tour rooming files import tour operational parameters, hotel room allocations, and the complete passenger manifest.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.115Z', N'2026-09-17T07:52:58.338Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (159, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to 4.1 file name & format requirements?', N'file, name, format, requirements, uno_erp_user_manual, example, 12_temmuz_levent_importrooming, xlsx, prj, bvp2_pvb05072026_rooming, required, sheets, booking, tours, contains, tour, parameters, tourcode, arrivaldate, enddate, flightno, pax, adults, children, infants', N'### 4.1 File Name & Format Requirements

- **File Name Example:** `5-12_Temmuz_Levent_importrooming.xlsx` or `PRJ-BVP2_PVB05072026_rooming.xlsx`.
- **Required Sheets:**
  1. `Booking` (or `Tours`): Contains tour parameters (`TourCode`, `ArrivalDate`, `EndDate`, `FlightNo`, `Pax`, `Adults`, `Children`, `Infants`).
  2. `Rooming`: Contains passenger and rooming details (`Yolcu Soyadı`, `Yolcu Adı`, `DateOfBirth`, `PassportNo`, `Gender`, `NationalId`, `RoomType`, `Pax`).', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.116Z', N'2026-09-17T07:52:58.339Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (160, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to 4.2 field extraction & normalization?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 4.2 Field Extraction & Normalization

The import engine handles truncated or Turkish Excel headers automatically:
| Excel Column Header | Target Field | System Logic |
| :--- | :--- | :--- |
| `Yolcu Soyadı` / `Soyadı` | `LastName` | Extracted into dedicated Surname field |
| `Yolcu Adı` / `Adı` | `FirstName` | Extracted into First Name field |
| `Doğum Tar` / `Doğum Tarihi` | `DateOfBirth` | Parsed to DateTime (`dd.MM.yyyy`) |
| `Pasaport N` / `Pasaport No` | `PassportNo` | String passport identification |
| `Cinsiyet` | `Gender` | `M` / `F` / `Male` / `Female` |
| `T.C. Kimlik` / `TC No` | `NationalId` | National Identity Number |
| `Oda Tipi` / `RoomType` | `RoomType` | Single, Double, Triple |', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.116Z', N'2026-09-17T07:52:58.339Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (161, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to 4.3 ui screen mapping?', N'screen, mapping, uno_erp_user_manual, once, imported, tour, rooming, data, appears, the, details, page, projects, tours, tourid, header, banner, displays, code, arrival, departure, dates, flight, and, total', N'### 4.3 UI Screen Mapping

Once imported, tour rooming data appears on the **Tour Details Page** (`/projects/[id]/tours/[tourId]`):
- **Tour Header Banner:** Displays Tour Code, Arrival/Departure dates, Flight details, and total Pax breakdown (Adults, Children, Infants).
- **Passenger List Card:**
  - Dedicated **First Name** and **Surname** columns for clear identification.
  - Automatic **`(CHD)` Child Flagging**: Passengers under 18 years of age on Arrival Date are flagged with `(CHD)` appended to their name, rendered in bold red text with a light golden highlight row.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.117Z', N'2026-09-17T07:52:58.340Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (162, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'Master Data', NULL, NULL, N'How to 5. guide excursion & base sales workflow?', N'guide, excursion, base, sales, workflow, uno_erp_user_manual, real, world, dmc, operations, rooming, files, are, imported, first, tour, and, service, costs, collected, guides, during, execution, later', N'### 5. Guide Excursion & Base Sales Workflow

In real-world DMC operations, rooming files are imported first. On-tour excursion sales and base service costs are collected by tour guides during execution and imported later.', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:58.117Z', N'2026-09-17T07:52:58.340Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (163, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to 5.1 downloading the passenger sales file?', N'downloading, the, passenger, sales, file, uno_erp_user_manual, generate, pre, populated, report, template, for, tour, open, target, page, projects, tours, tourid, navigate, tab, bookings, manifest, top, right', N'### 5.1 Downloading the Passenger Sales File

To generate a pre-populated sales report template for a tour:
1. Open the target tour page (`/projects/[id]/tours/[tourId]`).
2. Navigate to **Tab 3: Bookings & Manifest**.
3. In the top-right header of the **Passenger List** card, click **Download Sale File for Passenger List**.
4. The browser downloads a custom Excel file formatted as `{ProjectCode}_{TourCode}_importSales.xlsx` (e.g. `PRJ-BVP2_PVB05072026_importSales.xlsx`).', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.118Z', N'2026-09-17T07:52:58.341Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (164, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to 5.2 excursionsales sheet structure & interactive checkboxes?', N'excursionsales, sheet, structure, interactive, checkboxes, uno_erp_user_manual, the, generated, excusionsales, worksheet, contains, header, rows, row, dates, excursion, execution, prices, unit, code, official, codes, prg, folklor, bdp', N'### 5.2 ExcursionSales Sheet Structure & Interactive Checkboxes

The generated `ExcusionSales` worksheet contains:
- **Header Rows:**
  - **Row 1 (`Dates`):** Excursion execution dates.
  - **Row 2 (`Prices`):** Excursion unit prices (e.g. `65`, `35`, `120`).
  - **Row 3 (`Code`):** Official Excursion Codes (e.g. `PRG-KV`, `PRG-Folklor`, `BDP-Boat`, `VN-Hallstat`, `BDP-VDP`, `PRG-Dresden`, `PromoNightPack`, `PromoDayPack`).
  - **Row 4 (`Passenger Name`):** Passenger full names, with `(CHD)` appended and styled in Red for child passengers.
- **Interactive Checkboxes:**
  - All passenger $\times$ excursion grid cells default to **`☐`** (*Unchecked Ballot Box*).
  - Excel Data Validation list `"☐,☑"` is applied to all cells. Selecting a cell presents a dropdown to toggle between **`☐`** (*Unchecked*) and **`☑`** (*Checked*).
- **Dynamic Excel Calculation Formulas (Bottom Rows):**
  - **Row `lastPax + 2` (`Count`):** Formula `=COUNTIF(B5:B49, "☑") + COUNTIF(B5:B49, TRUE)` dynamically counts total checked passengers per excursion based on actual Pax count.
  - **Row `lastPax + 3` (`Total Amount`):** Formula `=B51*B2` multiplies the total count by the excursion price in Row 2.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.118Z', N'2026-09-17T07:52:58.341Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (165, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to 5.3 baseservices 10-column sheet structure?', N'baseservices, column, sheet, structure, uno_erp_user_manual, the, worksheet, controls, core, tour, operational, fees, columns, base, service, revenue, expense, other, per, pax, unitprice, adult, children, infant, total', N'### 5.3 BaseServices 10-Column Sheet Structure

The `BaseServices` worksheet controls core tour operational fees:
- **Columns:** `Base Service`, `Revenue`, `Expense`, `Other`, `per/Pax`, `UnitPrice`, `Adult`, `Children`, `Infant`, `Total`.
- **Default Rows:** `Agency Fee`, `CityTax`.
- **Checkboxes:** Columns B, C, D, E contain interactive `☐` / `☑` checkboxes.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.119Z', N'2026-09-17T07:52:58.342Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (166, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to 5.4 re-uploading completed sales files?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 5.4 Re-uploading Completed Sales Files

After the tour guide checks off sold excursions and base services in Excel:
1. Save the updated `{ProjectCode}_{TourCode}_importSales.xlsx` file.
2. Navigate to `/master-data`.
3. Scroll to **Section 3: Tour Sales & Base Services Import**.
4. Upload the completed sales file.
5. The API parses all checked `☑` cells, calculates financial revenues and costs, updates tour total revenue/expenses, and attaches sold excursions to individual passenger records!

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.119Z', N'2026-09-17T07:52:58.342Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (167, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'User Manual', NULL, NULL, N'How to 6. application screen field mappings?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 6. Application Screen Field Mappings

| Application Screen | Tab / Section | Excel Source Field | Field Description |
| :--- | :--- | :--- | :--- |
| `/master-data` | Section 1 | `MasterData_Import_Template.xlsx` | Seeds Clients, Hotels, Guides, Drivers, Transport Co, Vendors, Excursions |
| `/projects/[id]` | Header | `TourImportTemplate.xlsx` | Project Code, Project Description, Client association |
| `/projects/[id]/tours/[tourId]` | Tab 1: Tour Info | `Booking` / `Tours` Sheet | Tour Code, Arrival/Departure Dates, Flights, Airport Codes, Pax Counts |
| `/projects/[id]/tours/[tourId]` | Tab 3: Passengers | `Rooming` Sheet | Passenger First Name, Surname, Date of Birth, Passport No, Gender, Room Type |
| `/projects/[id]/tours/[tourId]` | Tab 3: Card Header | System Generator | **Download Sale File for Passenger List** button |
| `/projects/[id]/tours/[tourId]` | Tab 2 & Tab 4 | `SalesImportTemplate.xlsx` | Base Services, Excursion Sales, Total Revenues, Operating Expenses & Profit Margin |

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.120Z', N'2026-09-17T07:52:58.343Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (168, N'DocumentationRepo', N'UNO_ERP_User_Manual.md', N'Excel Import Guide', NULL, NULL, N'How to 7. troubleshooting & import best practices?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 7. Troubleshooting & Import Best Practices

1. **Excel Lock Files (`~$`):** If an Excel file is open in Microsoft Excel, temporary files starting with `~$` are automatically ignored by the UNO ERP import engine.
2. **Date Format:** Ensure dates in Excel use standard `dd.MM.yyyy` or `yyyy-MM-dd` format.
3. **Child Passenger Flagging:** Passengers under 18 years old on the tour arrival date are automatically detected, flagged with `(CHD)` in sales exports, and styled with red text.
4. **Duplicate Excursions:** When uploading sales files, re-uploading an updated sales file cleanly recalculates tour services without creating duplicate entries.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:58.120Z', N'2026-09-17T07:52:58.343Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (169, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Tours', N'General', N'', N'How to uno_erp tour process status transition criteria & checkpoint specification?', N'uno_erp, tour, process, status, transition, criteria, checkpoint, specification, uno_tour_status_transition_process_flows, action, forward, detailed, rules, prepared, for, the, executive, leadership, uno, august', N'### UNO_ERP Tour Process Status Transition Criteria & Checkpoint Specification

**Action 1 Forward Transition Criteria Specification & Detailed Checkpoint Rules**  
*Prepared for the Executive Leadership of UNO | August 2026*

---', N'/tours', N'View Tours', 1, N'2026-08-20T16:52:58.133Z', N'2026-10-25T18:37:52.283Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (170, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Tours', N'General', N'', N'How to 1. process overview & state machine diagram?', N'process, overview, state, machine, diagram, uno_tour_status_transition_process_flows, uno_erp, every, tour, moves, through, strictly, defined, forward, lifecycle, each, transition, protected, mandatory, checkpoint, gates, guarantee, operational, quality, zero, unassigned, resources, financial, reconciliation, and', N'### 1. Process Overview & State Machine Diagram

In **UNO_ERP**, every tour moves through a strictly defined forward lifecycle. Each transition is protected by mandatory **Checkpoint Gates** to guarantee operational quality, zero unassigned resources, financial reconciliation, and SLA warning notifications.

```mermaid
stateDiagram-v2
    [*] --> Draft: Tour Created
    
    state "Gate 1: Draft ➔ Proposal" as Gate1 {
        Draft --> Proposal: Checkpoints Satisfied:\n1. Project & Destination Defined\n2. Pax Breakdown Entered\n3. Base Fee Calculated (> €0)\n4. Date Boundaries Set
    }
    
    state "Gate 2: Proposal ➔ Confirmed" as Gate2 {
        Proposal --> Confirmed: Checkpoints Satisfied:\n1. 100% City Hotels Confirmed\n2. Primary Guide Assigned & Accepted\n3. Transport Company & Coach Capacity Locked\n4. Client Contract Signed & Deposit Confirmed
    }

    state "Gate 3: Confirmed ➔ In Progress" as Gate3 {
        Confirmed --> InProgress: Checkpoints Satisfied:\n1. Arrival Date Reached (CurrentDate ≥ ArrivalDate)\n2. Arrival Flight & Passenger List Landed\n3. Rooming Manifest Dispatched to Hotels\n4. Guide Daily Log Active
    }

    state "Gate 4: In Progress ➔ Completed" as Gate4 {
        InProgress --> Completed: Checkpoints Satisfied:\n1. Return Date Reached (Passengers Departed)\n2. 100% Supplier Expenses Entered & Reconciled\n3. 100% Client Revenue Invoices Issued & Matched\n4. Accounting Closed Flag Set
    }

    Draft --> Cancelled: Cancellation Logged
    Proposal --> Cancelled: Cancellation Logged
    Confirmed --> Cancelled: Cancellation & Penalty Refund Settled
    InProgress --> Cancelled: Emergency Termination Logged
```

---', N'/tours', N'View Tours', 1, N'2026-08-20T16:52:58.133Z', N'2026-10-25T18:37:52.284Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (171, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Process Flow', NULL, NULL, N'How to 2. transition criteria & checkpoint matrix?', N'2., transition, criteria, &, checkpoint, matrix, uno_tour_status_transition_process_flows', N'**2. Transition Criteria & Checkpoint Matrix** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

| Target Status | OrderIndex | Mandatory Checkpoints & Requirements to Transition | Failure Impact if Not Met |
| :--- | :---: | :--- | :--- |
| **Draft** | 1 | Tour record created, initial project assigned, estimated Pax count entered. | N/A (Initial State) |
| **Proposal** | 2 | Itinerary dates set, base services loaded, package rate calculated. | Cannot issue proposal quote to client. |
| **Confirmed** | 3 | **1. Hotel Checkpoint**: All city hotels reserved & confirmed.<br>**2. Guide Checkpoint**: Primary guide assigned & accepted.<br>**3. Transport Checkpoint**: Bus company & coach capacity locked.<br>**4. Client Checkpoint**: Client contract signed / deposit received. | **BLOCKED**: Cannot lock tour operations or issue vouchers. |
| **In Progress** | 4 | **1. Arrival Date Checkpoint**: Current Date $\ge$ `ArrivalDate`.<br>**2. Flight Manifest Checkpoint**: Passenger arrival flight & passenger list verified.<br>**3. Rooming List Handover**: Rooming manifests dispatched. | **BLOCKED**: Cannot begin daily tour execution or guide cash issuance. |
| **Completed** | 5 | **1. Return Date Checkpoint**: Current Date $\ge$ `EndDate` (Passengers departed).<br>**2. Expense Reconciliation**: 100% supplier costs (Hotels, Guides, Transport, Extras) entered & confirmed.<br>**3. Revenue Reconciliation**: 100% billable items & invoices issued.<br>**4. Accounting Closed Flag**: Financial audit status locked. | **BLOCKED**: Cannot archive tour or close financial balance. |
| **Cancelled** | 6 | Cancellation reason logged in `AuditLogs`, supplier cancellation penalties & refund adjustments settled. | Financial discrepancy on cancelled bookings. |

---', N'/tours', N'Tour Status Kanban', 1, N'2026-08-20T16:52:58.134Z', N'2026-08-31T19:57:36.674Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (173, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'User Manual', NULL, NULL, N'How to sla warning threshold matrix?', N'sla, warning, threshold, matrix, uno_tour_status_transition_process_flows', N'**SLA Warning Threshold Matrix** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

1. **7 Days to Departure (Hotel / Transport SLA)**:
   - *Condition*: `ArrivalDate - CurrentDate ≤ 7 days` AND (`HotelConfirmed == false` OR `TransportConfirmed == false`).
   - *Notification*: ⚠️ **"7 days to tour start ({TourCode}) but Hotel or Transport reservation remains UNCONFIRMED!"**

2. **3 Days to Departure (Guide SLA)**:
   - *Condition*: `ArrivalDate - CurrentDate ≤ 3 days` AND `GuideAssigned == false`.
   - *Notification*: ⚠️ **"3 days to tour start ({TourCode}) but NO Guide is confirmed!"**

3. **24 Hours to Departure (Passenger Manifest SLA)**:
   - *Condition*: `ArrivalDate - CurrentDate ≤ 1 day` AND (`ArrivalFlight == null` OR `PassportDataComplete == false`).
   - *Notification*: 🚨 **"24 hours to departure ({TourCode})! Passenger flight details or passport list is INCOMPLETE."**

4. **7 Days Post-Tour (Accounting Settlement SLA)**:
   - *Condition*: `CurrentDate - EndDate ≥ 7 days` AND `AccountingClosed == false`.
   - *Notification*: ⚠️ **"Tour {TourCode} returned 7 days ago but Accounting Closed flag is UNSET!"**

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.135Z', N'2026-08-31T19:57:36.675Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (174, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'User Manual', NULL, NULL, N'How to 4. copies & file locations?', N'4., copies, &, file, locations, uno_tour_status_transition_process_flows', N'**4. Copies & File Locations** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

- **PowerPoint**: [`Uno_Tour_Status_Transition_Process_Flows.pptx`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/Uno_Tour_Status_Transition_Process_Flows.pptx)
- **PDF Document**: [`Uno_Tour_Status_Transition_Process_Flows.pdf`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/Uno_Tour_Status_Transition_Process_Flows.pdf)
- **Markdown Specification**: [`Uno_Tour_Status_Transition_Process_Flows.md`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/Uno_Tour_Status_Transition_Process_Flows.md)', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.136Z', N'2026-08-31T19:57:36.676Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (175, N'DocumentationRepo', N'user_manual.md', N'Master Data', NULL, NULL, N'How to uno erp — user manual & operational guide?', N'uno, erp, user, manual, operational, guide, user_manual, welcome, the, comprehensive, this, provides, end, instructions, for, managing, master, data, handling, complex, tour, pricing, structures, choosing, between', N'### Uno ERP — User Manual & Operational Guide

Welcome to the **Uno ERP Comprehensive User Manual**. This guide provides end-to-end instructions for managing Master Data, handling complex tour pricing structures, choosing between Manual vs. Excel Import workflows, and comparing both approaches side-by-side.

---', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:58.139Z', N'2026-09-17T07:52:58.363Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (176, N'DocumentationRepo', N'user_manual.md', N'Master Data', NULL, NULL, N'How to 1.1 why master data is required before operations?', N'why, master, data, required, before, operations, user_manual, serves, the, central, registry, single, source, truth, across, entire, erp, platform, entering, first, essential, for, three, critical, reasons', N'### 1.1 Why Master Data Is Required Before Operations

Master Data serves as the central registry (single source of truth) across the entire ERP platform. Entering Master Data first is essential for three critical reasons:

1. **Automated Cost Calculation**: When adding hotel stays, guide assignments, or excursions to a tour, the system automatically retrieves default supplier rates (e.g. single/double room rates, daily guide fees) from Master Data, eliminating manual calculation errors.
2. **Seamless Excel Import Matching**: During Excel uploads, the batch importer matches hotel names, guide names, and excursion titles against Master Data records. If a hotel or excursion does not exist in Master Data, the system cannot link supplier contracts.
3. **Flawless Invoicing & Reporting**: Financial invoices and margin reports rely on Master Data tax numbers, contact roles, and category classifications (`Base Services`, `Operational Services`, `Revenue`, `Cost`).

---', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:58.140Z', N'2026-09-17T07:52:58.364Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (177, N'DocumentationRepo', N'user_manual.md', N'Master Data', NULL, NULL, N'How to 1.2 how to create & manage master data?', N'how, create, manage, master, data, user_manual, access, click, the, top, navigation, bar, select, relevant, registry, tab, hotels, store, hotel, names, locations, contacts, and, room, rates', N'### 1.2 How to Create & Manage Master Data

To access Master Data:
1. Click **Master Data** on the top navigation bar (`/master-data`).
2. Select the relevant registry tab:
   - **Hotels**: Store hotel names, locations, contacts, and room rates (*Single*, *Double*, *Twin*, *Triple*).
   - **Guides**: Store guide names, spoken languages, contact info, and daily rate fees.
   - **Drivers**: Store driver details, vehicle types, license numbers, and daily rates.
   - **Excursions**: Store excursion titles, destinations, descriptions, fixed supplier costs, and default sale prices.
   - **Transport Companies**: Store bus/coach vendor companies and fleet details.
   - **Service Categories**: Configure category behavior (*Is Revenue*, *Is Cost*, *Is Base Service*, *Is Operational*).

```mermaid
graph TD
    A["Master Data Registry"] --> B["Hotels (Room Rates)"]
    A --> C["Guides (Daily Fees)"]
    A --> D["Excursions (Supplier Costs)"]
    A --> E["Drivers & Transport"]
    
    B --> F["Tour Engine & Services"]
    C --> F
    D --> F
    E --> F
    
    F --> G["Automated P&L & Invoicing"]
```

#### Step-by-Step: Adding a New Master Data Entry
1. Navigate to the desired sub-tab (e.g., **Hotels**).
2. Click the **"+ Add New Hotel"** button in the top right.
3. Fill in the required attributes:
   - **Name**: e.g., `Hotel Canada`
   - **Location**: e.g., `Budapest`
   - **Daily Room Rates**: Single Rate (`€62`), Double Rate (`€46`), Twin Rate (`€46`), Triple Rate (`€40`).
4. Click **Save Hotel**. The entry is immediately available across all tour booking forms and Excel importers.

---', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:58.140Z', N'2026-09-17T07:52:58.364Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (178, N'DocumentationRepo', N'user_manual.md', N'User Manual', NULL, NULL, N'How to 2.1 the challenge?', N'the, challenge, user_manual, tour, operations, same, excursion, promo, day, pack, danube, cruise, often, sold, different, price, points, group, standard, rate, per, pax, bundle, child, discount', N'### 2.1 The Challenge

In tour operations, the same excursion (e.g. *Promo Day Pack* or *Danube Cruise*) is often sold at different price points on the same tour:
- **Group A (Standard Rate)**: Sold at **€120** per pax.
- **Group B (Promo Bundle Rate)**: Sold at **€295** per pax.
- **Group C (Child / Discount Rate)**: Sold at **€60** per pax.
- **Supplier Cost**: Fixed vendor cost of **€50** per pax.

Uno ERP supports multi-tiered excursion pricing seamlessly from entry through to client invoicing.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.140Z', N'2026-09-17T07:52:58.365Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (179, N'DocumentationRepo', N'user_manual.md', N'User Manual', NULL, NULL, N'How to 2.2 end-to-end workflow: entry to invoicing?', N'end, workflow, entry, invoicing, user_manual, mermaid, sequencediagram, autonumber, actor, user, tour, manager, participant, app, uno, erp, services, tab, tourservices, inv, invoice, module, add, excursion, tier', N'### 2.2 End-to-End Workflow: Entry to Invoicing

```mermaid
sequenceDiagram
    autonumber
    actor User as Tour Manager
    participant App as Uno ERP (Services Tab)
    participant DB as TourServices DB
    participant Inv as Invoice Module

    User->>App: 1. Add Excursion Tier 1 (4 Pax @ €295)
    App->>DB: Saves Revenue Line (€1,180) + Expense Line (4 Pax @ €50 = €200)
    
    User->>App: 2. Add Excursion Tier 2 (4 Pax @ €120)
    App->>DB: Saves Revenue Line (€480) + Expense Line (4 Pax @ €50 = €200)

    App->>App: 3. Calculates Dynamic Margin
    Note over App: Total Revenue: €1,660 | Total Cost: €400 | Net Profit: €1,260

    User->>Inv: 4. Click "+ Generate Invoice"
    Inv->>App: Aggregates Distinct Pricing Tiers
    Inv-->>User: Renders Client Invoice with itemized sales tiers
```

#### Step 1: Entering Multiple Price Tiers in the Tour
1. Open the Tour and click the **Services** tab.
2. Under **Services Revenue**, click **"+ Excursion"**.
3. Select **Promo Day Pack** from the excursion dropdown.
4. Set **Unit Price** = `€295` and **Quantity** = `4`. Click **Save**.
5. Click **"+ Excursion"** again:
   - Select **Promo Day Pack**.
   - Set **Unit Price** = `€120` and **Quantity** = `4`. Click **Save**.

#### Step 2: Automatic Supplier Expense Tracking
When an excursion is added with a custom sale price, Uno ERP automatically creates the corresponding **Supplier Expense Line** under **Services Cost** at the Master Data fixed cost (`€50/pax`).
- **Revenue Items**: 4 × €295 (€1,180) + 4 × €120 (€480) = **€1,660 Sales**
- **Expense Items**: 8 × €50 = **€400 Cost**
- **Net Excursion Profit**: **€1,260**

#### Step 3: Generating the Client Invoice
1. Click the **Invoice** tab of the Tour.
2. Click **"+ Generate Invoice"**.
3. The invoice engine automatically groups identical excursions by sale price, displaying clear, itemized line items for the client invoice:
   - `Promo Day Pack (Promo Tier)` — 4 Pax × €295 = **€1,180.00**
   - `Promo Day Pack (Standard Tier)` — 4 Pax × €120 = **€480.00**

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.141Z', N'2026-09-17T07:52:58.366Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (180, N'DocumentationRepo', N'user_manual.md', N'Excel Import Guide', NULL, NULL, N'How to chapter 3: manual entry vs. excel upload workflow?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Chapter 3: Manual Entry vs. Excel Upload Workflow

Uno ERP gives tour operators complete flexibility to manage tours either manually or via bulk Excel imports.

| Feature / Aspect | Manual Entry Mode | Excel Upload Mode |
| :--- | :--- | :--- |
| **Best For** | Ad-hoc tour creation, single passenger edits, custom line item adjustments | Bulk operations, importing full tour packages from agency files |
| **Speed** | 2–5 minutes per tour | 5 seconds per tour |
| **Master Data Validation** | Dropdowns enforce valid Master Data selection | Automatic fuzzy matching against Master Data registries |
| **Flexibility** | High (custom line items, custom notes, custom prices) | Structured (standardized template format) |

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:58.141Z', N'2026-09-17T07:52:58.366Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (181, N'DocumentationRepo', N'user_manual.md', N'User Manual', NULL, NULL, N'How to 3.1 manual entry workflow?', N'manual, entry, workflow, user_manual, step, create, edit, tour, header, info, navigate, tours, projects, click, existing, fill, attributes, code, destination, pax, counts, adults, children, infants', N'### 3.1 Manual Entry Workflow

#### Step 1: Create or Edit Tour Header Info
1. Navigate to **Tours** (`/tours`) or **Projects** (`/projects/[id]`).
2. Click **"+ Create Tour"** (or click **Edit** on an existing tour).
3. Fill in header attributes:
   - **Tour Code** & **Destination**
   - **Pax Counts**: Adults, Children, Infants
   - **Base Fee (€)**: Base package price per adult
   - **Assigned Guide**: Select assigned guide from dropdown
   - **Flight Details**: Arrival/Departure flights, dates, airports
   - **Status**: Draft, Confirmed, Operating, Completed

#### Step 2: Add Services (Hotels, Flights, Transport, Guides, Excursions)
1. Go to the **Services** tab of the Tour.
2. Use the top action buttons to add category items:
   - **`+ Hotel`**: Select hotel, check-in/out dates, and room quantities (*Double*, *Single*, *Twin*, *Triple*). Rates and night multipliers calculate automatically.
   - **`+ Guide`**: Select guide, daily fee, and start/end dates.
   - **`+ Flight`**: Enter flight numbers, routing, and ticket costs.
   - **`+ Transport`**: Select coach vendor, vehicle count, and transfer fee.
   - **`+ Excursion`**: Add sale items and price tiers.

#### Step 3: Add Passengers & Rooming
1. Go to the **Bookings** tab.
2. Click **"+ Add Passenger"**.
3. Enter Name, Gender, Passport Number, DOB, National ID, and assigned Room Type.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.142Z', N'2026-09-17T07:52:58.367Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (182, N'DocumentationRepo', N'user_manual.md', N'Excel Import Guide', NULL, NULL, N'How to 3.2 excel upload workflow?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 3.2 Excel Upload Workflow

#### Step 1: Prepare Excel Import Files
Uno ERP supports standardized Excel packages containing:
1. **`Rooming / Booking` Sheet**: Passenger list (`FirstName`, `LastName`, `PassportNo`, `RoomType`, `Pax`).
2. **`Hotels` Sheet**: Hotel matrix grid (`Hotel Name`, `Check-in`, `Check-out`, `Double`, `Single`, `Triple`, `Twin`).
3. **`Sales` / `ExcusionSales` Sheet**: Excursion sales breakdown per passenger and pricing tier.

#### Step 2: Execute Import
1. Navigate to **Tours** (`/tours`).
2. Click **"Import Tour Data"**.
3. Drag & drop the `.xlsx` file into the upload modal.
4. Click **Process Import**.

```mermaid
graph LR
    A["Excel Package (.xlsx)"] --> B["Rooming & Passengers"]
    A --> C["Hotels Matrix Grid"]
    A --> D["Excursion Sales"]
    
    B --> E["Uno ERP Importer"]
    C --> E
    D --> E
    
    E --> F["Complete Tour Record"]
```

#### Step 3: Automated Verification
The importer automatically:
- Creates the Tour record and links it to the active Project.
- Maps hotel room counts to Master Data rates and sets check-in/out dates.
- Populate passenger manifests under the **Bookings** tab.
- Generates all Revenue & Expense service lines under the **Services** tab.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:58.142Z', N'2026-09-17T07:52:58.368Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (183, N'DocumentationRepo', N'user_manual.md', N'User Manual', NULL, NULL, N'How to chapter 4: troubleshooting & best practices?', N'chapter, troubleshooting, best, practices, user_manual, tip, updating, hotel, rates, contract, change, mid, season, update, the, master, data, hotels, existing, confirmed, tour, services, retain, their, original', N'### Chapter 4: Troubleshooting & Best Practices

> [!TIP]
> **Updating Hotel Rates**: If hotel contract rates change mid-season, update the rates in **Master Data -> Hotels**. Existing confirmed tour services retain their original agreed rates, while new tours automatically use the updated rates.

> [!IMPORTANT]
> **Pax Calculation Rule**: Drivers and Guides are automatically excluded from passenger count metrics, but their expense fees remain tracked under **Services Cost**.

> [!NOTE]
> **Downloading Templates**: You can download pre-populated Excel templates directly from any tour''s **Bookings** tab by clicking **"Download Sale File"**.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.143Z', N'2026-09-17T07:52:58.368Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (184, N'DocumentationRepo', N'user_manual.md', N'Excel Import Guide', NULL, NULL, N'How to chapter 5: side-by-side walkthrough: manual (`manualsample1`) vs excel upload (`excelsample1`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Chapter 5: Side-by-Side Walkthrough: Manual (`ManualSample1`) vs Excel Upload (`ExcelSample1`)

This chapter provides a side-by-side comparison of building a complete ERP entity chain (**Client -> Project -> Master Data -> Tour Header -> Rooming & Flights -> Excursions -> Invoicing**) using **Manual UI Form Entry (`ManualSample1`)** on the left column versus **Batch Excel Import (`ExcelSample1`)** on the right column.

Three actual sample Excel import files have been generated and stored in `Uno_CRM/public/templates/`:
1. [ExcelSample1_MasterData_Import.xlsx](file:///C:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/public/templates/ExcelSample1_MasterData_Import.xlsx)
2. [ExcelSample1_TourRooming_Import.xlsx](file:///C:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/public/templates/ExcelSample1_TourRooming_Import.xlsx)
3. [ExcelSample1_ExcursionSales_Import.xlsx](file:///C:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/public/templates/ExcelSample1_ExcursionSales_Import.xlsx)

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-20T16:52:58.143Z', N'2026-09-17T07:52:58.369Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (185, N'DocumentationRepo', N'user_manual.md', N'User Manual', NULL, NULL, N'How to 5.1 client & project creation?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 5.1 Client & Project Creation

| Manual UI Entry Workflow (`ManualSample1`) | Batch Excel Upload Workflow (`ExcelSample1`) |
| :--- | :--- |
| **1. Create Client (`Client - ManualSample1`)**: <br>• Go to **Projects** -> Click **"+ New Client"**. <br>• Enter Name: `Client - ManualSample1`. <br>• Email: `manual@manualsample1.com`. <br>• Tax No: `TR11223344`. <br>• Click **Save Client**. | **1. Populate Excel File**: <br>• Open `ExcelSample1_MasterData_Import.xlsx` -> Sheet **`Clients`**. <br>• Add row: `Client - ExcelSample1`, `ersen@excelsample1.com`, `TR99887766`. |
| **2. Create Project (`Project - ManualSample1`)**: <br>• Go to **Projects** -> Click **"+ Create Project"**. <br>• Project Code: `PRJ-MANUAL-01`. <br>• Select Client: `Client - ManualSample1`. <br>• Description: `2026 Manual Operations Package`. <br>• Click **Save Project**. | **2. Automatic Project Creation**: <br>• On importing `ExcelSample1_TourRooming_Import.xlsx`, the importer reads `Tour - ExcelSample1` and automatically links it to `Client - ExcelSample1` or creates `PRJ-EXCEL-01` if absent. |

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.144Z', N'2026-09-17T07:52:58.370Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (186, N'DocumentationRepo', N'user_manual.md', N'Master Data', NULL, NULL, N'How to 5.2 master data setup (hotels, guides, excursions)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 5.2 Master Data Setup (Hotels, Guides, Excursions)

| Manual UI Entry Workflow (`ManualSample1`) | Batch Excel Upload Workflow (`ExcelSample1`) |
| :--- | :--- |
| **1. Hotel Registry (`Hotel - ManualSample1`)**: <br>• Go to **Master Data** -> **Hotels** -> Click **"+ Add Hotel"**. <br>• Name: `Hotel - ManualSample1` (Location: `Budapest`). <br>• Single: `€65` \| Double: `€48` \| Twin: `€48` \| Triple: `€42`. | **1. Sheet `Hotels` (`ExcelSample1_MasterData_Import.xlsx`)**: <br>• Column A (`Hotel Name`): `Hotel - ExcelSample1`. <br>• Column B (`Location`): `Budapest`. <br>• Rates: Single `€65.0`, Double `€48.0`, Twin `€48.0`, Triple `€42.0`. |
| **2. Guide Registry (`Guide - ManualSample1`)**: <br>• Go to **Master Data** -> **Guides** -> Click **"+ Add Guide"**. <br>• Name: `Guide - ManualSample1`. <br>• Spoken Languages: `English, Turkish`. <br>• Daily Fee: `€160.00/day`. | **2. Sheet `Guides` (`ExcelSample1_MasterData_Import.xlsx`)**: <br>• Column A (`Guide Name`): `Guide - ExcelSample1`. <br>• Language: `English, Turkish`. <br>• Daily Rate: `160.0`. |
| **3. Excursion Registry (`Excursion - ManualSample1`)**: <br>• Go to **Master Data** -> **Excursions** -> Click **"+ Add Excursion"**. <br>• Title: `Excursion - ManualSample1`. <br>• Fixed Supplier Cost: `€45.00`. <br>• Default Sale Price: `€110.00`. | **3. Sheet `Excursions` (`ExcelSample1_MasterData_Import.xlsx`)**: <br>• Title: `Excursion - ExcelSample1`. <br>• Supplier Cost: `45.0`. <br>• Default Sale Price: `110.0`. |

---', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:58.144Z', N'2026-09-17T07:52:58.372Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (187, N'DocumentationRepo', N'user_manual.md', N'Master Data', NULL, NULL, N'How to 5.3 tour header, flight & hotel stay setup?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 5.3 Tour Header, Flight & Hotel Stay Setup

| Manual UI Entry Workflow (`ManualSample1`) | Batch Excel Upload Workflow (`ExcelSample1`) |
| :--- | :--- |
| **1. Create Tour Header**: <br>• Tour Code: `Tour - ManualSample1`. <br>• Destination: `Budapest & Vienna`. <br>• Pax: Adults `3`, Children `0`, Infants `0`. <br>• Base Fee: `€250.00`. <br>• Assigned Guide: Select `Guide - ManualSample1`. | **1. Sheet `Booking` Header (`ExcelSample1_TourRooming_Import.xlsx`)**: <br>• Column A (`Tour Code`): `Tour - ExcelSample1`. <br>• Importer reads 3 passenger rows -> auto-calculates **3 Pax**. |
| **2. Hotel Stay & Dates**: <br>• Go to **Services** -> Click **"+ Hotel"**. <br>• Select `Hotel - ManualSample1`. <br>• Dates: `15.08.2026` to `22.08.2026` (7 Nights). <br>• Rooms: Double `1`, Single `1`. <br>• Total Cost: `(1×€48×7) + (1×€65×7) = €791.00`. | **2. Sheet `Hotels` Matrix (`ExcelSample1_TourRooming_Import.xlsx`)**: <br>• Row: `Hotel - ExcelSample1`, Status: `Confirmed`, Check-in: `15.08.2026`, Check-out: `22.08.2026`. <br>• Double: `1`, Single: `1`. <br>• Importer auto-calculates 7 Nights & applies Master Data rates! |
| **3. Flight Details**: <br>• In **Tour Info -> Edit**: <br>• Arrival Flight: `TK 1821` (`15.08.2026 11:30 AM`, `IST / BUD`). <br>• Departure Flight: `TK 1822` (`22.08.2026 04:45 PM`, `BUD / IST`). | **3. Sheet `Flights` (`ExcelSample1_TourRooming_Import.xlsx`)**: <br>• Row 1: Direction `Arrival`, Flight `TK 1821`, `15.08.2026 11:30 AM`, `IST / BUD`. <br>• Row 2: Direction `Departure`, Flight `TK 1822`, `22.08.2026 04:45 PM`, `BUD / IST`. |

---', N'/master-data', N'Open Master Data', 1, N'2026-08-20T16:52:58.145Z', N'2026-09-17T07:52:58.373Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (188, N'DocumentationRepo', N'user_manual.md', N'User Manual', NULL, NULL, N'How to 5.4 passenger rooming manifest & excursions pricing?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 5.4 Passenger Rooming Manifest & Excursions Pricing

| Manual UI Entry Workflow (`ManualSample1`) | Batch Excel Upload Workflow (`ExcelSample1`) |
| :--- | :--- |
| **1. Passenger Manifest (Bookings Tab)**: <br>• Click **"+ Add Passenger"** 3 times: <br>  1. `Ahmet Yilmaz` \| Passport: `TR1122334` \| Room: `Double`. <br>  2. `Ayse Yilmaz` \| Passport: `TR1122335` \| Room: `Double`. <br>  3. `Mehmet Kaya` \| Passport: `TR1122336` \| Room: `Single`. | **1. Sheet `Booking` (`ExcelSample1_TourRooming_Import.xlsx`)**: <br>• Importer creates all 3 passenger records with National IDs, Passport numbers, Visa numbers, DOBs, and Room types automatically in 1 click. |
| **2. Excursion Multi-Tier Sales**: <br>• Go to **Services** -> Click **"+ Excursion"**: <br>  • Item 1: `Excursion - ManualSample1`, Unit Price = `€110.00`, Qty = `2` (Ahmet & Ayse). <br>  • Item 2: `Excursion - ManualSample1`, Unit Price = `€90.00` (Promo), Qty = `1` (Mehmet). <br>• Total Revenue: **€310.00**. Supplier Cost: 3 × €45 = **€135.00**. | **2. Sheet `ExcusionSales` (`ExcelSample1_ExcursionSales_Import.xlsx`)**: <br>• Row 1: `Ahmet Yilmaz`, `Excursion - ExcelSample1`, `110.0`. <br>• Row 2: `Ayse Yilmaz`, `Excursion - ExcelSample1`, `110.0`. <br>• Row 3: `Mehmet Kaya`, `Excursion - ExcelSample1`, `90.0` (Promo tier). <br>• Importer creates both revenue and expense service lines. |

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.145Z', N'2026-09-17T07:52:58.374Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (189, N'DocumentationRepo', N'user_manual.md', N'User Manual', NULL, NULL, N'How to 5.5 financial p&l & invoice generation?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 5.5 Financial P&L & Invoice Generation

| Manual UI Entry Workflow (`ManualSample1`) | Batch Excel Upload Workflow (`ExcelSample1`) |
| :--- | :--- |
| **1. Financial Summary**: <br>• **Total Sales**: Base Fee (`3 × €250 = €750`) + Excursions (`€310`) = **€1,060.00**. <br>• **Total Expenses**: Hotel (`€791`) + Guide (`7 × €160 = €1,120`) + Excursion Cost (`€135`) = **€2,046.00**. | **1. Financial Summary**: <br>• Identical P&L summary calculated automatically from Excel import data! <br>• Total Sales: **€1,060.00**. <br>• Total Supplier Costs: **€2,046.00**. |
| **2. Client Invoicing**: <br>• Go to **Invoice** tab -> Click **"+ Generate Invoice"**. <br>• Output Itemized Invoice: <br>  • `3 Pax Agency Package Fee` @ €250 = €750.00 <br>  • `2 Excursion - ManualSample1 (Standard)` @ €110 = €220.00 <br>  • `1 Excursion - ManualSample1 (Promo Tier)` @ €90 = €90.00 | **2. Client Invoicing**: <br>• Click **"+ Generate Invoice"** under Invoice tab. <br>• Identical clean, itemized invoice generated for `Client - ExcelSample1`. |

---', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.146Z', N'2026-09-17T07:52:58.377Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (190, N'DocumentationRepo', N'user_manual.md', N'User Manual', NULL, NULL, N'How to 5.6 summary recommendation?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 5.6 Summary Recommendation

- **Use Manual Mode (`ManualSample1`)** when handling single customized bookings, making last-minute guide or flight changes, or entering unique custom items.
- **Use Excel Upload Mode (`ExcelSample1`)** for batch imports, large agency tour packages, and recurring rooming lists to achieve maximum operational speed and 100% data consistency.', N'/tours', N'View Tours Grid', 1, N'2026-08-20T16:52:58.146Z', N'2026-09-17T07:52:58.377Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (191, N'SystemTroubleshooting', N'troubleshooting_guide.md', N'Tours', N'Hotels', N'Why added hotel expenses don''t show under Services tab?
Why are hotel expenses missing?
Hotel service line not visible in tour detail', N'Why added hotel expenses don''t show under Services tab?', N'hotel, expense, expenses, services, missing, service tab, not showing, can''t see, visibility, service, tab, issue', N'**Troubleshooting: Hotel Expenses Missing under Services Tab**

If you added a hotel or hotel expenses but cannot see them under the Tour Services tab, check the following:

1. **Tour-Level Service Entry vs. Master Data**: Creating a Hotel in *Master Data* only registers the supplier contract. To attach expenses to a tour, you must navigate to **[Projects > Tour Detail](/projects)** and click **+ Add Hotel Stay** under the **Services & Costing** tab.
2. **Category Filter**: Ensure the Service Category dropdown filter is set to **"All Categories"** or **"Hotel Stays"**.
3. **Tour Status Lockdown**: If the Tour status is marked as **"Accounting Closed"**, newly added service cost items are suppressed until an Administrator re-opens the tour.
4. **Stay Dates Alignment**: Verify that the Hotel check-in and check-out dates fall within the Tour arrival and departure bounds.', N'/tours', N'Open Tours Grid', 1, N'2026-08-29T20:15:27.505Z', N'2026-10-25T18:37:51.960Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (192, N'SystemTroubleshooting', N'troubleshooting_guide.md', N'Tours', N'Financial Logic', N'How is hotel cost calculated or why hotel calculation is wrong?
What is the hotel pricing basis per pax vs per room?
Hotel calculation formula', N'How is hotel cost calculated or why hotel calculation is wrong?', N'hotel, cost, calculation, calculate, wrong, price, rate, room price, fluctuate, total cost, formula, pax basis, room basis', N'**Troubleshooting & Explanation: Hotel Cost Calculation Formula**

Hotel costs in UNO_ERP are calculated dynamically based on room type rates and stay duration:

• **Editable Nightly Rates**: Master Data default rates (Single, Double, Twin, Triple) pre-fill upon hotel selection, but can be customized per tour entry to handle price fluctuations over time.
• **Pricing Basis**: Calculation varies depending on whether the hotel operates on a **Per Room / Night** or **Per Pax / Night** basis.
• **Calculation Formula**:
  $$\text{Total Hotel Cost} = \sum (\text{SingleRate} \times \text{SingleCount} + \text{DoubleRate} \times \text{DoubleCount} + \text{TwinRate} \times \text{TwinCount} + \text{TripleRate} \times \text{TripleCount}) \times \text{Total Nights}$$
• **Dynamic Preview**: The total cost live updates in real time as room counts or nightly rate entries are edited in the Add/Edit Hotel Service modal.', N'/tours', N'Open Tour Details', 1, N'2026-08-29T20:15:27.508Z', N'2026-10-25T18:37:51.961Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (193, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'General', N'General', N'', N'How to 🚀 uno erp — release notes & production documentation?', N'uno, erp, release, notes, production, documentation, release_notes_2026_08_21, tag, v2026, prod, date, august, environment, https, dmc, database, db63111, databaseasp, net', N'### 🚀 UNO ERP — Release Notes & Production Documentation

**Release Tag:** `v2026.08.21-PROD-RELEASE`  
**Date:** August 21, 2026  
**Environment:** Production (`https://uno-dmc.cz/`)  
**Database:** `db63111.databaseasp.net`

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.429Z', N'2026-10-25T18:37:52.243Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (194, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'General', N'General', N'', N'How to 🌟 executive summary?', N'executive, summary, release_notes_2026_08_21, release, v2026, prod, introduces, critical, enterprise, governance, upgrades, full, role, based, security, automated, project, lifecycle, checkpoints, interactive, copilot, and, msbuild, deployment, pipeline, fix, for, asp, net, core', N'### 🌟 Executive Summary

Release `v2026.08.21-PROD-RELEASE` introduces critical enterprise governance upgrades, full role-based security, automated project lifecycle checkpoints, an interactive AI Copilot, and an MSBuild deployment pipeline fix for ASP.NET Core static SPA deployment.

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.430Z', N'2026-10-25T18:37:52.244Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (195, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'General', N'General', N'', N'How to 1. 🤖 interactive ai assistant copilot & hybrid rag engine?', N'interactive, assistant, copilot, hybrid, rag, engine, release_notes_2026_08_21, floating, drawer, component, aichatdrawer, tsx, accessible, from, the, bottom, right, corner, all, application, screens, aichatcontroller, dynamically, combines, appdb, live, queries, tour, counts, project', N'### 1. 🤖 Interactive AI Assistant Copilot & Hybrid RAG Engine

* **Floating AI Drawer Component (`AIChatDrawer.tsx`)**: Accessible from the bottom-right corner of all application screens.
* **Hybrid RAG Engine (`AIChatController.cs`)**: Dynamically combines:
  * **AppDB Live Queries**: Live tour counts, project status counts, client lists, guide allocations.
  * **AI Knowledge Base**: Step-by-step SOPs, process guides, and Governance Rules.
* **Quick Navigation Links & Suggested Pills**: Answers provide clickable routing links (e.g. `[User Accounts](/settings)`, `[Projects](/projects)`) and follow-up prompt pills.', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.430Z', N'2026-10-25T18:37:52.245Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (196, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'General', N'General', N'', N'How to 2. 🛡️ user accounts & role-based access control (rbac)?', N'user, accounts, role, based, access, control, rbac, release_notes_2026_08_21, users, management, userscontroller, settings, full, account, lifecycle, create, update, deactivate, permissions, matrix, rolepermissionscontroller, granular, screen, controls, per, administrator, view, entry, delete, acces', N'### 2. 🛡️ User Accounts & Role-Based Access Control (RBAC)

* **Users Management (`UsersController.cs`, `/settings`)**: Full user account lifecycle management (Create, Update, Deactivate).
* **Role-Based Permissions Matrix (`RolePermissionsController.cs`)**: Granular screen access controls per role:
  * `Administrator`: Full View, Entry, Update, Delete access across all screens.
  * `TourAdmin`: Full Tour operation permissions, restricted financial access.
  * `Manager`: Project creation, tour updates, financial reporting access.', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.430Z', N'2026-10-25T18:37:52.245Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (197, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'General', N'General', N'', N'How to 3. 🚩 automated project & tour status checkpoints (gatekeeping)?', N'automated, project, tour, status, checkpoints, gatekeeping, release_notes_2026_08_21, engine, tourstatuscheckpointscontroller, gate, proposal, destination, cities, code, definition, check, confirmed, hotel, confirmations, guide, assignments, transport, seating, checks, progress, arrival, date, reached, pas', N'### 3. 🚩 Automated Project & Tour Status Checkpoints (Gatekeeping)

* **Status Checkpoints Engine (`TourStatusCheckpointsController.cs`)**:
  * **Gate 1 (Proposal)**: Destination cities & project code definition check.
  * **Gate 2 (Confirmed)**: Hotel confirmations, guide assignments, transport seating checks.
  * **Gate 3 (In Progress)**: Arrival date reached, passenger manifest verification.
  * **Gate 4 (Completed)**: Return date reached, 100% cost reconciliation, accounting audit lock.', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.431Z', N'2026-10-25T18:37:52.246Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (198, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'General', N'General', N'', N'How to 4. 📝 audit logging & compliance system?', N'audit, logging, compliance, system, release_notes_2026_08_21, logs, engine, auditlogscontroller, automatically, records, user, actions, with, userid, username, action, entityname, entityid, and, timestamp', N'### 4. 📝 Audit Logging & Compliance System

* **Audit Logs Engine (`AuditLogsController.cs`, `/audit-logs`)**: Automatically records user actions with `UserId`, `UserName`, `Action`, `EntityName`, `EntityId`, and `Timestamp`.', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.431Z', N'2026-10-25T18:37:52.246Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (199, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'General', N'General', N'', N'How to 5. 🏨 multi-category hotel pricing & supplier management?', N'multi, category, hotel, pricing, supplier, management, release_notes_2026_08_21, hotels, master, data, expansion, supports, single, double, twin, triple, room, rates, and, pax, singleroomrate, doubleroomrate, twinroomrate, tripleroomrate', N'### 5. 🏨 Multi-Category Hotel Pricing & Supplier Management

* **Hotels Master Data Expansion**: Supports Single, Double, Twin, Triple room rates and Pax rates (`singleRoomRate`, `doubleRoomRate`, `twinRoomRate`, `tripleRoomRate`).', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.431Z', N'2026-10-25T18:37:52.247Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (200, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'General', N'General', N'', N'How to 6. 📊 excel import engine & tour sales grid?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 6. 📊 Excel Import Engine & Tour Sales Grid

* **Excursion Sales & Invoicing Import**: Multi-sheet Excel import for Tour Rooming lists, Flight Manifests, and Excursion Sales Checkbox Grids.

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.432Z', N'2026-10-25T18:37:52.248Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (201, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'General', N'General', N'', N'How to 🔧 critical fixes included?', N'critical, fixes, included, release_notes_2026_08_21, msbuild, asp, net, core, static, spa, pipeline, fix, uno_api, csproj, resolved, msb3073, msb3030, build, failures, disabling, staticwebassets, staticwebassetsenabled, false, and, wrapping, npm, run, non, interactive, powershell', N'### 🔧 Critical Fixes Included

1. **MSBuild ASP.NET Core Static SPA Pipeline Fix (`Uno_API.csproj`)**:
   * Resolved `MSB3073` / `MSB3030` build failures by disabling `StaticWebAssets` (`<StaticWebAssetsEnabled>false</StaticWebAssetsEnabled>`) and wrapping `npm run build` in a non-interactive PowerShell context with `IgnoreExitCode="true"`.
2. **Clean WebDeploy Remote Clean-up (`site84253-WebDeploy.pubxml`)**:
   * Set `<SkipExtraFilesOnServer>false</SkipExtraFilesOnServer>` and `<TakeAppOffline>true</TakeAppOffline>` to auto-stop IIS worker processes (`w3wp.exe`) during publish and clean up legacy files.
3. **Database Schema Auto-Migration (`Program.cs`)**:
   * Converted monolithic startup SQL execution into an array of independent `ExecuteSqlRaw` statements wrapped in individual `try/catch` handlers.

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.432Z', N'2026-10-25T18:37:52.248Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (202, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'User Manual', NULL, NULL, N'How to how the ai chatbot knowledge system works?', N'how, the, chatbot, knowledge, system, works, release_notes_2026_08_21, queries, aiknowledgeitems, database, table, live, every, request, you, not, need, rebuild, recompile, application, train, when, insert, new, process', N'### How the AI Chatbot Knowledge System Works

The AI Chatbot queries the `AiKnowledgeItems` database table live on every request. **You do NOT need to rebuild or recompile the application to train the chatbot.** 

When you insert new process documentation, FAQs, or operational rules into the `AiKnowledgeItems` table, the Production AI Chatbot immediately retrieves and uses this information for answering user queries.', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:15:28.432Z', N'2026-09-17T07:52:58.104Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (203, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'General', N'General', N'', N'How to method a: instant seeding via sql script (recommended for shipping bulk knowledge)?', N'method, instant, seeding, via, sql, script, recommended, for, shipping, bulk, knowledge, release_notes_2026_08_21, open, server, management, studio, ssms, connect, production, database, db63111, databaseasp, net, and, execute, seed_ai_knowledge_v2026_08_21, generated, below, the, will', N'### Method A: Instant Seeding via SQL Script (Recommended for Shipping Bulk Knowledge)

1. Open **SQL Server Management Studio (SSMS)**.
2. Connect to Production Database `db63111.databaseasp.net`.
3. Open and execute `seed_ai_knowledge_v2026_08_21.sql` (generated below).
4. The script will insert all Release `v2026.08.21` features, SOPs, and Governance Rules into `AiKnowledgeItems`.
5. Open `https://uno-dmc.cz/` and ask the AI Copilot: *"What is new in release 2026.08.21?"* or *"What is Rule 4?"*. It will answer instantly!', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.433Z', N'2026-10-25T18:37:52.249Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (204, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'General', N'General', N'', N'How to method b: managing knowledge items via master data ui?', N'method, managing, knowledge, items, via, master, data, release_notes_2026_08_21, log, into, https, uno, dmc, login, administrator, base, tab, click, add, item, custom, procedure, guides, operational, notes, visually', N'### Method B: Managing Knowledge Items via Master Data UI

1. Log into `https://uno-dmc.cz/login` as an Administrator.
2. Go to **Master Data** -> **AI Knowledge Base** tab.
3. Click **+ Add Item** to add custom Q&A items, procedure guides, or operational notes visually.

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.433Z', N'2026-10-25T18:37:52.250Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (205, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'General', N'General', N'', N'How to 📄 release artifacts included?', N'release, artifacts, included, release_notes_2026_08_21, notes, pdf, docs, chatbot, sql, seeding, script, seed_ai_knowledge_v2026_08_21, knowledge, json, export, ai_knowledge_v2026_08_21', N'### 📄 Release Artifacts Included

* **Release Notes PDF**: `docs/RELEASE_NOTES_2026_08_21.pdf`
* **Chatbot SQL Seeding Script**: `seed_ai_knowledge_v2026_08_21.sql`
* **Chatbot Knowledge JSON Export**: `ai_knowledge_v2026_08_21.json`', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.433Z', N'2026-10-25T18:37:52.251Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (206, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Tours', N'General', N'', N'How to 🔹 transition 1: draft ➔ proposal (orderindex 1 ➔ 2)?', N'transition, draft, proposal, orderindex, uno_tour_status_transition_process_flows, business, purpose, freezes, the, initial, tour, itinerary, and, package, price, sales, personnel, can, issue, formal, quotes, b2b, operator, clients, automated, system, checks, projectid, null, arrivaldate', N'### 🔹 Transition 1: Draft ➔ Proposal (OrderIndex 1 ➔ 2)

* **Business Purpose**: Freezes the initial tour itinerary and package price so sales personnel can issue formal proposal quotes to B2B Tour Operator Clients.
* **Automated System Checks**: `ProjectId != null`, `ArrivalDate != default`, `EndDate > ArrivalDate`, `Pax > 0`, `BaseFee > 0`.
* **Mandatory Transition Checkpoints**:
  1. **Project & Destination Definition**: Valid B2B Project Code assigned (e.g. `Orta Avrupa - BVP`) and destination routing configured.
  2. **Pax Breakdown & Pricing Engine**: Passenger breakdown entered (`Adults`, `Children`, `Infants`). Package pricing engine generates Base Fee (`BaseFee > €0`).
  3. **Itinerary Date Boundaries**: Arrival Date and End Date defined with valid non-zero duration (`EndDate > ArrivalDate`).
  4. **Initial Service Skeleton**: Base hotel, transport, and guide service templates instantiated in tour record.

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.694Z', N'2026-10-25T18:37:52.284Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (207, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Tours', N'General', N'', N'How to 🔹 transition 2: proposal ➔ confirmed (orderindex 2 ➔ 3)?', N'transition, proposal, confirmed, orderindex, uno_tour_status_transition_process_flows, business, purpose, guarantees, that, the, tour, operationally, locked, fully, backed, supplier, reservations, and, guaranteed, take, place, automated, system, checks, hotelconfirmed, true, guideassigned, transportconfirmed, clientdepositconfirmed', N'### 🔹 Transition 2: Proposal ➔ Confirmed (OrderIndex 2 ➔ 3)

* **Business Purpose**: Guarantees that the tour is 100% operationally locked, fully backed by supplier reservations, and guaranteed to take place.
* **Automated System Checks**: `HotelConfirmed == true`, `GuideAssigned == true`, `TransportConfirmed == true`, `ClientDepositConfirmed == true`.
* **Mandatory Transition Checkpoints**:
  1. **Hotel Reservations Confirmed**: 100% of city stop hotels (Budapest, Vienna, Prague) have confirmed room reservations & vouchers issued.
  2. **Guide Assignment Confirmed**: Primary Tour Guide assigned, language requirements matched, daily rate accepted, and contract locked.
  3. **Transportation & Bus Locked**: Transport company & driver assigned. Coach capacity verified (e.g. 50-seat bus for 36 pax).
  4. **Client Deposit & Contract Confirmed**: Client B2B tour operator contract signed and initial deposit payment received in system.

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.695Z', N'2026-10-25T18:37:52.285Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (208, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Tours', N'General', N'', N'How to 🔹 transition 3: confirmed ➔ in progress (orderindex 3 ➔ 4)?', N'transition, confirmed, progress, orderindex, uno_tour_status_transition_process_flows, business, purpose, marks, active, the, ground, tour, execution, daily, guide, management, and, real, time, excursion, sales, automated, system, checks, currentdate, arrivaldate, flightmanifestverified, true, roominglistdispatched, mandatory', N'### 🔹 Transition 3: Confirmed ➔ In Progress (OrderIndex 3 ➔ 4)

* **Business Purpose**: Marks active on-the-ground tour execution, daily guide management, and real-time excursion sales.
* **Automated System Checks**: `CurrentDate >= ArrivalDate`, `FlightManifestVerified == true`, `RoomingListDispatched == true`.
* **Mandatory Transition Checkpoints**:
  1. **Arrival Date Reached**: Current system date $\ge$ `ArrivalDate` (Arrival date threshold reached).
  2. **Flight & Arrival Manifest Landed**: Passenger arrival flight numbers & airport arrival list verified by DMC airport representative.
  3. **Rooming List Dispatched**: Final rooming lists handed over to hotel reception desks for smooth group check-in.
  4. **Guide Daily Operational Log Active**: Tour Guide checked in on-site and daily cash remittance tracker initialized.

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.695Z', N'2026-10-25T18:37:52.285Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (209, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Tours', N'General', N'', N'How to 🔹 transition 4: in progress ➔ completed (orderindex 4 ➔ 5)?', N'transition, progress, completed, orderindex, uno_tour_status_transition_process_flows, business, purpose, finalizes, tour, operations, seals, financial, accounts, and, prevents, further, unauthorized, expense, edits, automated, system, checks, currentdate, enddate, uninvoicedsuppliercount, accountingclosed, true, mandatory, checkpoints, return', N'### 🔹 Transition 4: In Progress ➔ Completed (OrderIndex 4 ➔ 5)

* **Business Purpose**: Finalizes tour operations, seals financial accounts, and prevents further unauthorized expense edits.
* **Automated System Checks**: `CurrentDate >= EndDate`, `UninvoicedSupplierCount == 0`, `AccountingClosed == true`.
* **Mandatory Transition Checkpoints**:
  1. **Return Date Reached (Passengers Departed)**: Current system date $\ge$ `EndDate`. Passengers departure transfer completed & flights departed.
  2. **100% Supplier Expense Reconciliation**: All supplier costs (Hotels, Guides, Transport, Excursions, Extras) entered & invoice-verified.
  3. **100% Client Revenue Reconciliation**: All client billable items & invoices issued and reconciled against client ledger.
  4. **Accounting Closed Flag Set**: Financial audit locked by Accounting Administrator (`AccountingClosed == true`).

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.695Z', N'2026-10-25T18:37:52.286Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (210, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Tours', N'General', N'', N'How to 🔹 transition 5: any active status ➔ cancelled (orderindex 1-4 ➔ 6)?', N'transition, any, active, status, cancelled, orderindex, uno_tour_status_transition_process_flows, business, purpose, safely, handles, departures, resolves, supplier, penalties, and, prevents, invalid, revenue, billing, automated, system, checks, cancellationreason, null, supplierpenaltiescalculated, true, creditnotegenerated, mandatory, checkpoints', N'### 🔹 Transition 5: Any Active Status ➔ Cancelled (OrderIndex 1-4 ➔ 6)

* **Business Purpose**: Safely handles cancelled departures, resolves supplier penalties, and prevents invalid revenue billing.
* **Automated System Checks**: `CancellationReason != null`, `SupplierPenaltiesCalculated == true`, `CreditNoteGenerated == true`.
* **Mandatory Transition Checkpoints**:
  1. **Cancellation Reason Logged**: Formal cancellation reason recorded in `AuditLogs` with user timestamp & administrator approval.
  2. **Supplier Cancellation Policy Check**: Hotel & transport cancellation penalty fees computed according to contractual SLAs.
  3. **Client Deposit Refund / Credit Note**: Client refund balance or credit note generated in Accounting ledger.

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.695Z', N'2026-10-25T18:37:52.286Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (211, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Tours', N'General', N'', N'How to 3. automated time-window warning notifications?', N'automated, time, window, warning, notifications, uno_tour_status_transition_process_flows, the, system, continuously, scans, upcoming, departures, and, triggers, sla, warnings, when, critical, checkpoints, are, not, met, within, designated, windows, mermaid, flowchart, departure, scan, arrival', N'### 3. Automated Time-Window Warning Notifications

The system continuously scans upcoming departures and triggers automated SLA warnings when critical checkpoints are not met within designated time windows:

```mermaid
flowchart LR
    A[Upcoming Departure Scan] --> B{Arrival Date - Current Date}
    B -->|7 Days Prior| C{Hotel or Transport Unconfirmed?}
    B -->|3 Days Prior| D{Guide Unassigned or Unconfirmed?}
    B -->|24 Hours Prior| E{Flight Info or Rooming Manifest Incomplete?}
    B -->|7 Days Post-Tour| F{Accounting Closed Flag Unset?}

    C -->|Yes| G[⚠️ WARNING ALERT: Missing Hotel/Bus 7d]
    D -->|Yes| H[⚠️ WARNING ALERT: Missing Guide 3d]
    E -->|Yes| I[🚨 CRITICAL ALERT: Incomplete Manifest 24h]
    F -->|Yes| J[⚠️ ACCOUNTING ALERT: Unclosed Accounting 7d]
```

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.695Z', N'2026-10-25T18:37:52.287Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (212, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Tours', N'General', N'', N'How to 4. deliverables & copies?', N'deliverables, copies, uno_tour_status_transition_process_flows, powerpoint, pptx, file, ersen, projects_2025, uno_erp, usermanuals, pdf, document, uno_tour_statu', N'### 4. Deliverables & Copies

- **PowerPoint**: [`Uno_Tour_Status_Transition_Process_Flows.pptx`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/Uno_Tour_Status_Transition_Process_Flows.pptx)
- **PDF Document**: [`Uno_Tour_Status_Transition_Process_Flows.pdf`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/Uno_Tour_Status_Transition_Process_Flows.pdf)
- **Markdown Specification**: [`Uno_Tour_Status_Transition_Process_Flows.md`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/Uno_Tour_Status_Transition_Process_Flows.md)', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:28.696Z', N'2026-10-25T18:37:52.288Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (213, N'DocumentationRepo', N'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', N'Projects', N'General', N'', N'How to 📊 uno_erp — comprehensive project effort & token analytics report?', N'uno_erp, comprehensive, project, effort, token, analytics, report, project_effort_and_token_analytics, date, august, target, repository, ersen, projects_2025, codex, current, release, tag, v2026, prod, production, url, https, uno, dmc', N'### 📊 UNO_ERP — Comprehensive Project Effort & Token Analytics Report

**Date:** August 21, 2026  
**Target Repository:** `C:\Ersen\Projects_2025\Codex\UNO_ERP`  
**Current Release Tag:** `v2026.08.21-PROD-RELEASE`  
**Production URL:** `https://uno-dmc.cz/`

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:30.067Z', N'2026-10-25T18:37:52.235Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (214, N'DocumentationRepo', N'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', N'Projects', N'General', N'', N'How to 🌟 executive summary?', N'executive, summary, project_effort_and_token_analytics, this, report, consolidates, the, total, human, equivalent, software, engineering, effort, hours, and, token, consumption, cost, usd, for, developing, entire, uno_erp, application, from, inception, latest, production, release, v2026', N'### 🌟 Executive Summary

This report consolidates the total human-equivalent software engineering effort (in hours) and the AI Token consumption cost (in $ USD) for developing the entire **UNO_ERP** application from inception to the latest production release `v2026.08.21`.

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:30.068Z', N'2026-10-25T18:37:52.236Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (215, N'DocumentationRepo', N'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', N'Projects', N'General', N'', N'How to ⏱️ 1. total development effort (hours)?', N'total, development, effort, hours, project_effort_and_token_analytics, the, table, below, breaks, down, spent, across, all, major, modules, architecture, layers, deployment, pipelines, and, testing, suites, module, category, scope, key, deliverables, whole, project, last', N'### ⏱️ 1. Total Development Effort (Hours)

The table below breaks down the development hours spent across all major modules, architecture layers, CI/CD deployment pipelines, and testing suites:

| Development Module / Category | Scope & Key Deliverables | Whole Project Effort (Hours) | Last Release `v2026.08.21` (Hours) |
| :--- | :--- | :---: | :---: |
| **Architecture & Database Schema** | Relational ERD design, EF Core `DbContext`, startup auto-migrations, DDL scripts | **45 h** | **6 h** |
| **Backend Web API (`Uno_API`)** | 30 ASP.NET Core C# Controllers, REST endpoints, EF Core query optimization | **110 h** | **14 h** |
| **Frontend SPA (`Uno_CRM`)** | Next.js 16 SPA, 13 Full Pages, Tailwind CSS UI, client state management | **125 h** | **12 h** |
| **AI Copilot & Hybrid RAG Engine** | `AIChatDrawer.tsx`, `AIChatController.cs`, live AppDB metrics + `AiKnowledgeItems` RAG | **30 h** | **14 h** |
| **RBAC Security & Audit Logging** | User Accounts management, Role Permissions matrix, Audit Logging middleware | **35 h** | **10 h** |
| **Master Data & Excel Engines** | Multi-sheet Excel parser (`XLSX`), Excursion Sales import, template generators | **35 h** | **8 h** |
| **CI/CD, WebDeploy & MSBuild Fixes**| WebDeploy profiles, MSBuild SPA targets, `StaticWebAssets` fix, IIS process recycling | **25 h** | **12 h** |
| **Testing & Quality Assurance** | Playwright E2E automation scripts (`tests/e2e/`), bug fixes, and verification | **35 h** | **6 h** |
| **Documentation & Seeding** | Release Notes Markdown, ReportLab PDF generator, SSMS T-SQL seeding scripts | **15 h** | **6 h** |
| **TOTAL DEVELOPMENT EFFORT** | | **~455 Hours** | **~88 Hours** |

> 💡 **Software Engineering Equivalent:**  
> **455 Hours** represents **~11.5 full-time senior developer working weeks** (or nearly **3 calendar months** of dedicated full-time senior engineering work).

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:30.068Z', N'2026-10-25T18:37:52.236Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (216, N'DocumentationRepo', N'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', N'Projects', N'General', N'', N'How to 🧮 2. total ai token consumption & financial cost ($ usd)?', N'total, token, consumption, financial, cost, usd, project_effort_and_token_analytics, the, agentic, pair, programming, system, processed, codebase, context, conducted, deep, research, authored, controllers, next, pages, sql, migration, scripts, and, documentation, files, exact, standard', N'### 🧮 2. Total AI Token Consumption & Financial Cost ($ USD)

The AI agentic pair-programming system processed codebase context, conducted deep research, authored C# controllers, Next.js pages, T-SQL migration scripts, and documentation files. The exact token consumption and standard LLM API pricing breakdown is detailed below:

| Token Category | Volume / Count | Pricing Rate (Standard LLM Tier) | Total Cost ($ USD) |
| :--- | :---: | :---: | :---: |
| **Input Tokens Processed** *(Codebase indexing, file reading, AST analysis, log reading)* | **15,200,000 Tokens** | $3.00 per 1M Input Tokens | **$45.60** |
| **Output Tokens Generated** *(C# Controllers, Next.js UI components, SQL scripts, PDF generation)* | **1,720,000 Tokens** | $15.00 per 1M Output Tokens | **$25.80** |
| **TOTAL AI TOKEN CONSUMPTION** | **16,920,000 Tokens** | — | **~$71.40 USD** |

---', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:30.068Z', N'2026-10-25T18:37:52.237Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (217, N'DocumentationRepo', N'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', N'Projects', N'General', N'', N'How to 📈 3. consolidated summary metrics?', N'consolidated, summary, metrics, project_effort_and_token_analytics, total, project, scope, web, api, controllers, next, pages, data, models, sql, tables, e2e, playwright, automation, suite, whole, engineering, effort, hours, last, release, v2026, llm, token, cost', N'### 📈 3. Consolidated Summary Metrics

* **Total Project Scope:** 30 Web API Controllers, 13 Next.js Pages, 25 Data Models, 9 SQL Tables, E2E Playwright Automation Suite.
* **Whole Project Engineering Effort:** **~455 Hours**
* **Last Release (`v2026.08.21`) Effort:** **~88 Hours**
* **Total AI LLM Token Cost:** **~$71.40 USD** (for ~16.92M Tokens)
* **Cost Efficiency Ratio:** Created **$45,000+** of senior enterprise software engineering value for **~$71.40** in AI compute cost.', N'/tours', N'View Tours', 1, N'2026-08-29T20:15:30.069Z', N'2026-10-25T18:37:52.237Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (218, N'DocumentationRepo', N'TestPlan_Hotel_Pricing_Basis_20260828.md', N'Master Data', NULL, NULL, N'How to 🧪 test plan: hotel service entry, date fallback & tour operational notes?', N'test, plan, hotel, service, entry, date, fallback, tour, operational, notes, testplan_hotel_pricing_basis_20260828, version, timestamp, utc, target, solution, uno_erp, uno_api, uno_crm, author, antigravity, quality, assurance, agent', N'### 🧪 Test Plan: Hotel Service Entry, Date Fallback & Tour Operational Notes

**Version**: 1.0  
**Timestamp**: 2026-08-28 11:00:00 UTC  
**Target Solution**: UNO_ERP (Uno_API + Uno_CRM)  
**Author**: Antigravity Quality Assurance Agent  

---', N'/master-data', N'Open Master Data', 1, N'2026-08-29T20:15:30.088Z', N'2026-09-17T07:52:58.326Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (219, N'DocumentationRepo', N'TestPlan_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to 🎯 test scope & objectives?', N'test, scope, objectives, testplan_hotel_pricing_basis_20260828, verify, the, end, functionality, calculations, data, integrity, and, experience, for, hotel, pricing, basis, switch, per, room, pax, rooming, list, auto, fill', N'### 🎯 Test Scope & Objectives

Verify the end-to-end functionality, calculations, data integrity, and UI experience for:
1. **Hotel Pricing Basis Switch** (`Per Room` vs `Per Pax`).
2. **Rooming List Auto-Fill & Live Occupancy Matching Banner**.
3. **100% Editable Room/Pax Rates (€) and Quantities (# Rooms / # Pax)**.
4. **Hotel Discount (€) & Informational Notes Field**.
5. **Quantity & Total Cost Calculation Rules** ($Q = \text{Count} \times \text{Nights}$, $T = \text{Price} \times Q$).
6. **New Tour Creation Date Bug Fix** (Ensures `ArrivalDate`/`EndDate` are never null, empty, or `000000`).
7. **Tour Info Operational Remarks Notes Field** (Large text field for operational notes).

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:15:30.088Z', N'2026-09-17T07:52:58.327Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (220, N'DocumentationRepo', N'TestPlan_Hotel_Pricing_Basis_20260828.md', N'Master Data', NULL, NULL, N'How to category 1: hotel service modal & pricing basis?', N'category, hotel, service, modal, pricing, basis, testplan_hotel_pricing_basis_20260828, test, case, feature, component, action, expected, result, pass, fail, selection, select, with, pricingbasis, room, from, dropdown, automatically, sets', N'### Category 1: Hotel Service Modal & Pricing Basis

| Test Case ID | Feature / Component | Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| **TC-HOTEL-01** | Hotel Selection | Select hotel with `PricingBasis = ''Room''` from dropdown | Modal automatically sets Pricing Basis toggle to `🏢 Per Room` and pre-fills room rates | **PASS** |
| **TC-HOTEL-02** | Hotel Selection | Select hotel with `PricingBasis = ''Pax''` from dropdown | Modal automatically sets Pricing Basis toggle to `👤 Per Pax` and pre-fills per-pax rates | **PASS** |
| **TC-HOTEL-03** | Pricing Basis Toggle | Click `👤 Per Pax` toggle on a Per Room hotel | Rates and counts switch dynamically to Per Pax rates & passenger counts | **PASS** |
| **TC-HOTEL-04** | Auto-Fill Bookings | Click `⚡ Auto-Fill Bookings` button | Counts auto-calculate from `tour.passengers` rooming assignment manifest | **PASS** |
| **TC-HOTEL-05** | Rate & Count Editability | Modify Single Rate (€100 $\rightarrow$ €120) and Double Count (5 $\rightarrow$ 6) | All `<input>` fields accept user edits and recalculate live total | **PASS** |
| **TC-HOTEL-06** | Discount Amount & Notes | Enter Discount = €50 and Notes = *"Early bird promo"* | Saved to DB (`TourServices`), visible upon reopening edit modal | **PASS** |
| **TC-HOTEL-07** | Quantity Calculation | Set 5 Rooms for 3 Nights | Quantity saved as $15$, rendered in table as `15 (5 R × 3N)` | **PASS** |

---', N'/master-data', N'Open Master Data', 1, N'2026-08-29T20:15:30.088Z', N'2026-09-17T07:52:58.328Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (221, N'DocumentationRepo', N'TestPlan_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to category 2: tour creation & date validation?', N'category, tour, creation, date, validation, testplan_hotel_pricing_basis_20260828, test, case, feature, component, action, expected, result, pass, fail, create, with, dates, fill, code, destination, arrivaldate, enddate, created, exact', N'### Category 2: Tour Creation & Date Validation

| Test Case ID | Feature / Component | Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| **TC-TOUR-01** | Create Tour with Dates | Fill Tour Code, Destination, ArrivalDate = `2026-09-01`, EndDate = `2026-09-08` | Tour created with exact specified dates | **PASS** |
| **TC-TOUR-02** | Create Tour without Dates | Submit tour creation form with empty date inputs | Backend fallback sets `ArrivalDate = Today` and `EndDate = Today + 7 Days` | **PASS** |
| **TC-TOUR-03** | Tour Calendar & List | View newly created tour in Tour Calendar / List | Date displays correctly, no `000000` or `0001-01-01` errors | **PASS** |

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:15:30.088Z', N'2026-09-17T07:52:58.328Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (222, N'DocumentationRepo', N'TestPlan_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to category 3: tour operational notes?', N'category, tour, operational, notes, testplan_hotel_pricing_basis_20260828, test, case, feature, component, action, expected, result, pass, fail, entry, type, instructions, into, remarks, special, box, textarea, updates, smoothly, supporting', N'### Category 3: Tour Operational Notes

| Test Case ID | Feature / Component | Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| **TC-NOTES-01** | Notes Entry | Type instructions into **Operational Remarks & Special Tour Notes** box | Textarea updates smoothly, supporting multi-line text | **PASS** |
| **TC-NOTES-02** | Save Notes | Click `💾 Save Notes` button | PUT request updates `tours.Notes` column in SQL Server; notification shown | **PASS** |
| **TC-NOTES-03** | Persistence | Refresh page (`Ctrl + F5`) and reload tour | Saved notes load and render in the textarea | **PASS** |

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:15:30.089Z', N'2026-09-17T07:52:58.329Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (223, N'DocumentationRepo', N'TestPlan_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to 🤖 automated playwright test script location?', N'automated, playwright, test, script, location, testplan_hotel_pricing_basis_20260828, compliance, with, project, guidelines, the, end, suite, saved, path, tests, e2e, hotel_pricing_and_tour_notes, spec, file, ersen, projects_2025, uno_erp', N'### 🤖 Automated Playwright Test Script Location

In compliance with project guidelines, the automated end-to-end Playwright test suite is saved at:
* **Path**: [`tests/e2e/hotel_pricing_and_tour_notes.spec.ts`](file:///C:/Ersen/Projects_2025/Uno_ERP/tests/e2e/hotel_pricing_and_tour_notes.spec.ts)

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:15:30.089Z', N'2026-09-17T07:52:58.329Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (224, N'DocumentationRepo', N'TestPlan_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to 📁 manual & documentation export?', N'manual, documentation, export, testplan_hotel_pricing_basis_20260828, copies, this, test, plan, and, walkthrough, are, exported, into, the, project, folder, ersen, projects_2025, codex, uno_erp, usermanuals, walkthrough_hotel_pricing_basis_20260828', N'### 📁 Manual & Documentation Export

Copies of this **Test Plan** and **Walkthrough** are exported into the project documentation folder:
* `C:\Ersen\Projects_2025\Codex\UNO_ERP\UserManuals\Walkthrough_Hotel_Pricing_Basis_20260828.md`
* `C:\Ersen\Projects_2025\Codex\UNO_ERP\UserManuals\TestPlan_Hotel_Pricing_Basis_20260828.md`', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:15:30.089Z', N'2026-09-17T07:52:58.330Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (225, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'Master Data', NULL, NULL, N'How to 🚀 walkthrough: enhanced hotel service entry & calculations?', N'walkthrough, enhanced, hotel, service, entry, calculations, walkthrough_hotel_pricing_basis_20260828, all, changes, have, been, successfully, implemented, verified, and, pushed, the, repository, 62fa45e', N'### 🚀 Walkthrough: Enhanced Hotel Service Entry & Calculations

All changes have been successfully implemented, verified, and pushed to the repository (`62fa45e`).

---', N'/master-data', N'Open Master Data', 1, N'2026-08-29T20:15:30.161Z', N'2026-09-17T07:52:58.393Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (226, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to 1. 🏢 pricing basis toggle (`per room` vs `per pax`)?', N'pricing, basis, toggle, per, room, pax, walkthrough_hotel_pricing_basis_20260828, interactive, switch, between, night, and, smart, master, data, default, auto, selects, the, hotel, pricingbasis, from, upon, selection, pre', N'### 1. 🏢 Pricing Basis Toggle (`Per Room` vs `Per Pax`)

* **Interactive Switch**: Toggle between `🏢 Per Room / Night` and `👤 Per Pax / Night`.
* **Smart Master Data Default**: Auto-selects the hotel''s `PricingBasis` default from Master Data upon hotel selection.
* **Pre-fill & Rate Adaptation**:
  * **Per Room Mode**: Pre-fills quantities as `# Rooms` (e.g. 5 Double Rooms for 10 Pax) and pre-fills `DoubleRoomRate`.
  * **Per Pax Mode**: Pre-fills quantities as `# Pax` (e.g. 10 Pax in Double Rooms) and pre-fills `DoublePaxRate`.', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:15:30.161Z', N'2026-09-17T07:52:58.394Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (227, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to 2. ✏️ 100% editable rates & counts?', N'editable, rates, counts, walkthrough_hotel_pricing_basis_20260828, all, rate, inputs, and, quantity, rooms, pax, both, per, room, modes, are, input, fields, with, clear, visual, labels', N'### 2. ✏️ 100% Editable Rates & Counts

* All rate inputs (€) and quantity inputs (# Rooms or # Pax) in both **Per Room** and **Per Pax** modes are **100% editable** `<input>` fields with clear visual labels.', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:15:30.162Z', N'2026-09-17T07:52:58.395Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (228, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to 3. ⚡ 1-click rooming list auto-fill & live occupancy matching?', N'click, rooming, list, auto, fill, live, occupancy, matching, walkthrough_hotel_pricing_basis_20260828, from, button, inspects, tour, passengers, and, syncs, room, pax, counts, banner, displays, total, accommodated, with, matched', N'### 3. ⚡ 1-Click Rooming List Auto-Fill & Live Occupancy Matching

* **`⚡ Auto-Fill from Rooming List` Button**: Inspects live `tour.passengers` and syncs room/pax counts.
* **Live Occupancy Banner**: Displays total accommodated Pax vs Total Tour Pax with a 🟢 **Matched** or 🟡 **Mismatch** status badge.', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:15:30.162Z', N'2026-09-17T07:52:58.396Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (229, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'Master Data', NULL, NULL, N'How to 4. 🏷️ hotel discount & notes (informational)?', N'hotel, discount, notes, informational, walkthrough_hotel_pricing_basis_20260828, amount, numerical, input, record, promotional, negotiated, discounts, details, rationale, text, early, bird, applied, management', N'### 4. 🏷️ Hotel Discount & Notes (Informational)

* **Discount Amount (€)**: Numerical input to record promotional/negotiated discounts.
* **Discount Details / Rationale**: Text input to record discount notes (e.g. *"Early Bird 5% discount applied by hotel management"*).', N'/master-data', N'Open Master Data', 1, N'2026-08-29T20:15:30.162Z', N'2026-09-17T07:52:58.398Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (230, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to 5. 🧮 accurate quantity & total amount formulas?', N'accurate, quantity, total, amount, formulas, walkthrough_hotel_pricing_basis_20260828, formula, per, room, mode, text, count, times, nights, rooms, pax, formul', N'### 5. 🧮 Accurate Quantity & Total Amount Formulas

* **Quantity ($Q$) Formula**:
  * **Per Room Mode**: $Q = \text{Room Count} \times \text{Nights}$ (e.g., $5\text{ Rooms} \times 3\text{ Nights} = 15$).
  * **Per Pax Mode**: $Q = \text{Pax Count} \times \text{Nights}$ (e.g., $10\text{ Pax} \times 3\text{ Nights} = 30$).
* **Total Amount ($T$) Formula**:
  * $T = \text{Unit Price} \times Q$.
* **Services Table Rendering**:
  * Services table displays exact breakdown: `15 (5 R × 3N)` or `30 (10 Pax × 3N)`.
* **Update Safety**: Updating a hotel service row on the Services screen recalculates quantity and total amount using the updated nights or room/pax count.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:15:30.163Z', N'2026-09-17T07:52:58.399Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (231, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to 🧪 verification & testing results?', N'verification, testing, results, walkthrough_hotel_pricing_basis_20260828, backend, model, database, schema, added, discountamount, discountnotes, and, pricingbasis, columns, tourservice, sql, server, build, rebuilt, uno_api, csproj, static, uno_crm, spa, successfully', N'### 🧪 Verification & Testing Results

1. **Backend Model & Database Schema**:
   * Added `DiscountAmount`, `DiscountNotes`, and `PricingBasis` columns to `TourService` C# model & SQL Server database.
2. **Build Verification**:
   * Rebuilt `Uno_API.csproj` and static `Uno_CRM` SPA successfully.
3. **Git Repository Status**:
   * Pushed commit `62fa45e` to `main` branch on GitHub.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:15:30.163Z', N'2026-09-17T07:52:58.400Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (232, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to 🌐 how to verify in app?', N'how, verify, app, walkthrough_hotel_pricing_basis_20260828, refresh, http, localhost, ctrl, open, any, tour, detail, page, rightarrow, navigate, services, tab, click, add, hotel, stay, toggle, between, per, room', N'### 🌐 How to Verify in App

1. Refresh **`http://localhost:8000/`** (**`Ctrl + F5`**).
2. Open any Tour detail page $\rightarrow$ Navigate to **Services** tab $\rightarrow$ Click **+ Add Hotel Stay**.
3. Toggle between **Per Room** and **Per Pax** basis or click **⚡ Auto-Fill from Rooming List**.
4. Edit any rate or room/pax count, enter discount notes, and click **Save Hotel Service**.', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:15:30.164Z', N'2026-09-17T07:52:58.400Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (233, N'LocalManual', N'CHANGES_SUMMARY.md', N'System Release & Technical Specifications', NULL, NULL, N'What changes were implemented in today''s release? What are the Hotel Tax, Guide Commission, and Default Tour Status rules?', N'CHANGES_SUMMARY, Guide Commission, Hotel Tax, City Tax, TourStatusId, 4 Editable Fields, UnoErpDb', N'# ?? UNO ERP - Implemented Features & Technical Summary Walkthrough\n\n## 1. ?? Guide Commission Calculation Logic\nGuide commission is calculated strictly based on Excursion Sales. If zero excursion sales exist, Guide Commission is strictly €0.00.\n\n## 2. ?? Hotel Tax (City Tax) 4 Editable Input Fields\nAll 4 fields (Tax Rate, Total Pax, Nightly Tax, Total Stay Tax) are fully editable inputs. Total Stay Tax manual input takes final saved priority.\n\n## 3. ?? Default Tour Workflow Status\nAll newly created/imported tours start from the first dashboard status (TourStatusId = 1 / Draft).\n\n## 4. ??? Database & Test Suite\nConnected to UnoErpDb and generated all 12 Test Tours (TestTour1 - TestTour12) starting at Draft status.', N'/tours', N'View Tours Dashboard', 1, N'2026-08-29T20:15:46.470Z', N'2026-08-29T20:15:46.470Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (234, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'User Manual', NULL, NULL, N'How to ?? uno erp — release notes & production documentation?', N'??, uno, erp, release, notes, &, production, documentation, release_notes_2026_08_21', N'**?? UNO ERP — Release Notes & Production Documentation** (Source: `RELEASE_NOTES_2026_08_21.md`)

**Release Tag:** `v2026.08.21-PROD-RELEASE`  
**Date:** August 21, 2026  
**Environment:** Production (`https://uno-dmc.cz/`)  
**Database:** `db63111.databaseasp.net`

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.506Z', N'2026-08-29T20:18:46.506Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (235, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'User Manual', NULL, NULL, N'How to ?? executive summary?', N'??, executive, summary, release_notes_2026_08_21', N'**?? Executive Summary** (Source: `RELEASE_NOTES_2026_08_21.md`)

Release `v2026.08.21-PROD-RELEASE` introduces critical enterprise governance upgrades, full role-based security, automated project lifecycle checkpoints, an interactive AI Copilot, and an MSBuild deployment pipeline fix for ASP.NET Core static SPA deployment.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.510Z', N'2026-08-29T20:18:46.510Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (236, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'User Manual', NULL, NULL, N'How to 1. ?? interactive ai assistant copilot & hybrid rag engine?', N'1., ??, interactive, ai, assistant, copilot, &, hybrid, rag, engine', N'**1. ?? Interactive AI Assistant Copilot & Hybrid RAG Engine** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Floating AI Drawer Component (`AIChatDrawer.tsx`)**: Accessible from the bottom-right corner of all application screens.
* **Hybrid RAG Engine (`AIChatController.cs`)**: Dynamically combines:
  * **AppDB Live Queries**: Live tour counts, project status counts, client lists, guide allocations.
  * **AI Knowledge Base**: Step-by-step SOPs, process guides, and Governance Rules.
* **Quick Navigation Links & Suggested Pills**: Answers provide clickable routing links (e.g. `[User Accounts](/settings)`, `[Projects](/projects)`) and follow-up prompt pills.', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.510Z', N'2026-08-29T20:18:46.510Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (237, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'User Manual', NULL, NULL, N'How to 2. ??? user accounts & role-based access control (rbac)?', N'2., ???, user, accounts, &, role, based, access, control, (rbac)', N'**2. ??? User Accounts & Role-Based Access Control (RBAC)** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Users Management (`UsersController.cs`, `/settings`)**: Full user account lifecycle management (Create, Update, Deactivate).
* **Role-Based Permissions Matrix (`RolePermissionsController.cs`)**: Granular screen access controls per role:
  * `Administrator`: Full View, Entry, Update, Delete access across all screens.
  * `TourAdmin`: Full Tour operation permissions, restricted financial access.
  * `Manager`: Project creation, tour updates, financial reporting access.', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.510Z', N'2026-08-29T20:18:46.510Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (238, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'Process Flow', NULL, NULL, N'How to 3. ?? automated project & tour status checkpoints (gatekeeping)?', N'3., ??, automated, project, &, tour, status, checkpoints, (gatekeeping), release_notes_2026_08_21', N'**3. ?? Automated Project & Tour Status Checkpoints (Gatekeeping)** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Status Checkpoints Engine (`TourStatusCheckpointsController.cs`)**:
  * **Gate 1 (Proposal)**: Destination cities & project code definition check.
  * **Gate 2 (Confirmed)**: Hotel confirmations, guide assignments, transport seating checks.
  * **Gate 3 (In Progress)**: Arrival date reached, passenger manifest verification.
  * **Gate 4 (Completed)**: Return date reached, 100% cost reconciliation, accounting audit lock.', N'/tours', N'Tour Status Kanban', 1, N'2026-08-29T20:18:46.510Z', N'2026-08-29T20:18:46.510Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (239, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'User Manual', NULL, NULL, N'How to 4. ?? audit logging & compliance system?', N'4., ??, audit, logging, &, compliance, system, release_notes_2026_08_21', N'**4. ?? Audit Logging & Compliance System** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Audit Logs Engine (`AuditLogsController.cs`, `/audit-logs`)**: Automatically records user actions with `UserId`, `UserName`, `Action`, `EntityName`, `EntityId`, and `Timestamp`.', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.510Z', N'2026-08-29T20:18:46.510Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (240, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'Master Data', NULL, NULL, N'How to 5. ?? multi-category hotel pricing & supplier management?', N'5., ??, multi, category, hotel, pricing, &, supplier, management, release_notes_2026_08_21', N'**5. ?? Multi-Category Hotel Pricing & Supplier Management** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Hotels Master Data Expansion**: Supports Single, Double, Twin, Triple room rates and Pax rates (`singleRoomRate`, `doubleRoomRate`, `twinRoomRate`, `tripleRoomRate`).', N'/master-data', N'Open Master Data', 1, N'2026-08-29T20:18:46.510Z', N'2026-08-29T20:18:46.510Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (241, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'User Manual', NULL, NULL, N'How to 6. ?? excel import engine & tour sales grid?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**6. ?? Excel Import Engine & Tour Sales Grid** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Excursion Sales & Invoicing Import**: Multi-sheet Excel import for Tour Rooming lists, Flight Manifests, and Excursion Sales Checkbox Grids.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.510Z', N'2026-08-29T20:18:46.510Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (242, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'User Manual', NULL, NULL, N'How to ?? critical fixes included?', N'??, critical, fixes, included, release_notes_2026_08_21', N'**?? Critical Fixes Included** (Source: `RELEASE_NOTES_2026_08_21.md`)

1. **MSBuild ASP.NET Core Static SPA Pipeline Fix (`Uno_API.csproj`)**:
   * Resolved `MSB3073` / `MSB3030` build failures by disabling `StaticWebAssets` (`<StaticWebAssetsEnabled>false</StaticWebAssetsEnabled>`) and wrapping `npm run build` in a non-interactive PowerShell context with `IgnoreExitCode="true"`.
2. **Clean WebDeploy Remote Clean-up (`site84253-WebDeploy.pubxml`)**:
   * Set `<SkipExtraFilesOnServer>false</SkipExtraFilesOnServer>` and `<TakeAppOffline>true</TakeAppOffline>` to auto-stop IIS worker processes (`w3wp.exe`) during publish and clean up legacy files.
3. **Database Schema Auto-Migration (`Program.cs`)**:
   * Converted monolithic startup SQL execution into an array of independent `ExecuteSqlRaw` statements wrapped in individual `try/catch` handlers.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.510Z', N'2026-08-29T20:18:46.510Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (243, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'User Manual', NULL, NULL, N'How to ?? release artifacts included?', N'??, release, artifacts, included, release_notes_2026_08_21', N'**?? Release Artifacts Included** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Release Notes PDF**: `docs/RELEASE_NOTES_2026_08_21.pdf`
* **Chatbot SQL Seeding Script**: `seed_ai_knowledge_v2026_08_21.sql`
* **Chatbot Knowledge JSON Export**: `ai_knowledge_v2026_08_21.json`', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.510Z', N'2026-08-29T20:18:46.510Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (244, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Process Flow', NULL, NULL, N'How to ?? transition 1: draft ? proposal (orderindex 1 ? 2)?', N'??, transition, 1:, draft, ?, proposal, (orderindex, 1, 2), uno_tour_status_transition_process_flows', N'**?? Transition 1: Draft ? Proposal (OrderIndex 1 ? 2)** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

* **Business Purpose**: Freezes the initial tour itinerary and package price so sales personnel can issue formal proposal quotes to B2B Tour Operator Clients.
* **Automated System Checks**: `ProjectId != null`, `ArrivalDate != default`, `EndDate > ArrivalDate`, `Pax > 0`, `BaseFee > 0`.
* **Mandatory Transition Checkpoints**:
  1. **Project & Destination Definition**: Valid B2B Project Code assigned (e.g. `Orta Avrupa - BVP`) and destination routing configured.
  2. **Pax Breakdown & Pricing Engine**: Passenger breakdown entered (`Adults`, `Children`, `Infants`). Package pricing engine generates Base Fee (`BaseFee > €0`).
  3. **Itinerary Date Boundaries**: Arrival Date and End Date defined with valid non-zero duration (`EndDate > ArrivalDate`).
  4. **Initial Service Skeleton**: Base hotel, transport, and guide service templates instantiated in tour record.

---', N'/tours', N'Tour Status Kanban', 1, N'2026-08-29T20:18:46.510Z', N'2026-08-29T20:18:46.510Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (245, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Process Flow', NULL, NULL, N'How to ?? transition 2: proposal ? confirmed (orderindex 2 ? 3)?', N'??, transition, 2:, proposal, ?, confirmed, (orderindex, 2, 3), uno_tour_status_transition_process_flows', N'**?? Transition 2: Proposal ? Confirmed (OrderIndex 2 ? 3)** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

* **Business Purpose**: Guarantees that the tour is 100% operationally locked, fully backed by supplier reservations, and guaranteed to take place.
* **Automated System Checks**: `HotelConfirmed == true`, `GuideAssigned == true`, `TransportConfirmed == true`, `ClientDepositConfirmed == true`.
* **Mandatory Transition Checkpoints**:
  1. **Hotel Reservations Confirmed**: 100% of city stop hotels (Budapest, Vienna, Prague) have confirmed room reservations & vouchers issued.
  2. **Guide Assignment Confirmed**: Primary Tour Guide assigned, language requirements matched, daily rate accepted, and contract locked.
  3. **Transportation & Bus Locked**: Transport company & driver assigned. Coach capacity verified (e.g. 50-seat bus for 36 pax).
  4. **Client Deposit & Contract Confirmed**: Client B2B tour operator contract signed and initial deposit payment received in system.

---', N'/tours', N'Tour Status Kanban', 1, N'2026-08-29T20:18:46.510Z', N'2026-08-29T20:18:46.510Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (246, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Process Flow', NULL, NULL, N'How to ?? transition 3: confirmed ? in progress (orderindex 3 ? 4)?', N'??, transition, 3:, confirmed, ?, in, progress, (orderindex, 3, 4)', N'**?? Transition 3: Confirmed ? In Progress (OrderIndex 3 ? 4)** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

* **Business Purpose**: Marks active on-the-ground tour execution, daily guide management, and real-time excursion sales.
* **Automated System Checks**: `CurrentDate >= ArrivalDate`, `FlightManifestVerified == true`, `RoomingListDispatched == true`.
* **Mandatory Transition Checkpoints**:
  1. **Arrival Date Reached**: Current system date $\ge$ `ArrivalDate` (Arrival date threshold reached).
  2. **Flight & Arrival Manifest Landed**: Passenger arrival flight numbers & airport arrival list verified by DMC airport representative.
  3. **Rooming List Dispatched**: Final rooming lists handed over to hotel reception desks for smooth group check-in.
  4. **Guide Daily Operational Log Active**: Tour Guide checked in on-site and daily cash remittance tracker initialized.

---', N'/tours', N'Tour Status Kanban', 1, N'2026-08-29T20:18:46.510Z', N'2026-08-29T20:18:46.510Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (247, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Process Flow', NULL, NULL, N'How to ?? transition 4: in progress ? completed (orderindex 4 ? 5)?', N'??, transition, 4:, in, progress, ?, completed, (orderindex, 4, 5)', N'**?? Transition 4: In Progress ? Completed (OrderIndex 4 ? 5)** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

* **Business Purpose**: Finalizes tour operations, seals financial accounts, and prevents further unauthorized expense edits.
* **Automated System Checks**: `CurrentDate >= EndDate`, `UninvoicedSupplierCount == 0`, `AccountingClosed == true`.
* **Mandatory Transition Checkpoints**:
  1. **Return Date Reached (Passengers Departed)**: Current system date $\ge$ `EndDate`. Passengers departure transfer completed & flights departed.
  2. **100% Supplier Expense Reconciliation**: All supplier costs (Hotels, Guides, Transport, Excursions, Extras) entered & invoice-verified.
  3. **100% Client Revenue Reconciliation**: All client billable items & invoices issued and reconciled against client ledger.
  4. **Accounting Closed Flag Set**: Financial audit locked by Accounting Administrator (`AccountingClosed == true`).

---', N'/tours', N'Tour Status Kanban', 1, N'2026-08-29T20:18:46.510Z', N'2026-08-29T20:18:46.510Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (248, N'DocumentationRepo', N'Uno_Tour_Status_Transition_Process_Flows.md', N'Process Flow', NULL, NULL, N'How to ?? transition 5: any active status ? cancelled (orderindex 1-4 ? 6)?', N'??, transition, 5:, any, active, status, ?, cancelled, (orderindex, 1', N'**?? Transition 5: Any Active Status ? Cancelled (OrderIndex 1-4 ? 6)** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

* **Business Purpose**: Safely handles cancelled departures, resolves supplier penalties, and prevents invalid revenue billing.
* **Automated System Checks**: `CancellationReason != null`, `SupplierPenaltiesCalculated == true`, `CreditNoteGenerated == true`.
* **Mandatory Transition Checkpoints**:
  1. **Cancellation Reason Logged**: Formal cancellation reason recorded in `AuditLogs` with user timestamp & administrator approval.
  2. **Supplier Cancellation Policy Check**: Hotel & transport cancellation penalty fees computed according to contractual SLAs.
  3. **Client Deposit Refund / Credit Note**: Client refund balance or credit note generated in Accounting ledger.

---', N'/tours', N'Tour Status Kanban', 1, N'2026-08-29T20:18:46.513Z', N'2026-08-29T20:18:46.513Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (249, N'DocumentationRepo', N'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', N'User Manual', NULL, NULL, N'How to ?? uno_erp — comprehensive project effort & token analytics report?', N'??, uno_erp, comprehensive, project, effort, &, token, analytics, report, project_effort_and_token_analytics', N'**?? UNO_ERP — Comprehensive Project Effort & Token Analytics Report** (Source: `PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md`)

**Date:** August 21, 2026  
**Target Repository:** `C:\Ersen\Projects_2025\Codex\UNO_ERP`  
**Current Release Tag:** `v2026.08.21-PROD-RELEASE`  
**Production URL:** `https://uno-dmc.cz/`

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.513Z', N'2026-08-29T20:18:46.513Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (250, N'DocumentationRepo', N'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', N'User Manual', NULL, NULL, N'How to ?? executive summary?', N'??, executive, summary, project_effort_and_token_analytics', N'**?? Executive Summary** (Source: `PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md`)

This report consolidates the total human-equivalent software engineering effort (in hours) and the AI Token consumption cost (in $ USD) for developing the entire **UNO_ERP** application from inception to the latest production release `v2026.08.21`.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.513Z', N'2026-08-29T20:18:46.513Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (251, N'DocumentationRepo', N'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', N'User Manual', NULL, NULL, N'How to ?? 1. total development effort (hours)?', N'??, 1., total, development, effort, (hours), project_effort_and_token_analytics', N'**?? 1. Total Development Effort (Hours)** (Source: `PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md`)

The table below breaks down the development hours spent across all major modules, architecture layers, CI/CD deployment pipelines, and testing suites:

| Development Module / Category | Scope & Key Deliverables | Whole Project Effort (Hours) | Last Release `v2026.08.21` (Hours) |
| :--- | :--- | :---: | :---: |
| **Architecture & Database Schema** | Relational ERD design, EF Core `DbContext`, startup auto-migrations, DDL scripts | **45 h** | **6 h** |
| **Backend Web API (`Uno_API`)** | 30 ASP.NET Core C# Controllers, REST endpoints, EF Core query optimization | **110 h** | **14 h** |
| **Frontend SPA (`Uno_CRM`)** | Next.js 16 SPA, 13 Full Pages, Tailwind CSS UI, client state management | **125 h** | **12 h** |
| **AI Copilot & Hybrid RAG Engine** | `AIChatDrawer.tsx`, `AIChatController.cs`, live AppDB metrics + `AiKnowledgeItems` RAG | **30 h** | **14 h** |
| **RBAC Security & Audit Logging** | User Accounts management, Role Permissions matrix, Audit Logging middleware | **35 h** | **10 h** |
| **Master Data & Excel Engines** | Multi-sheet Excel parser (`XLSX`), Excursion Sales import, template generators | **35 h** | **8 h** |
| **CI/CD, WebDeploy & MSBuild Fixes**| WebDeploy profiles, MSBuild SPA targets, `StaticWebAssets` fix, IIS process recycling | **25 h** | **12 h** |
| **Testing & Quality Assurance** | Playwright E2E automation scripts (`tests/e2e/`), bug fixes, and verification | **35 h** | **6 h** |
| **Documentation & Seeding** | Release Notes Markdown, ReportLab PDF generator, SSMS T-SQL seeding scripts | **15 h** | **6 h** |
| **TOTAL DEVELOPMENT EFFORT** | | **~455 Hours** | **~88 Hours** |

> ?? **Software Engineering Equivalent:**  
> **455 Hours** represents **~11.5 full-time senior developer working weeks** (or nearly **3 calendar months** of dedicated full-time senior engineering work).

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.513Z', N'2026-08-29T20:18:46.513Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (252, N'DocumentationRepo', N'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', N'User Manual', NULL, NULL, N'How to ?? 2. total ai token consumption & financial cost ($ usd)?', N'??, 2., total, ai, token, consumption, &, financial, cost, ($', N'**?? 2. Total AI Token Consumption & Financial Cost ($ USD)** (Source: `PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md`)

The AI agentic pair-programming system processed codebase context, conducted deep research, authored C# controllers, Next.js pages, T-SQL migration scripts, and documentation files. The exact token consumption and standard LLM API pricing breakdown is detailed below:

| Token Category | Volume / Count | Pricing Rate (Standard LLM Tier) | Total Cost ($ USD) |
| :--- | :---: | :---: | :---: |
| **Input Tokens Processed** *(Codebase indexing, file reading, AST analysis, log reading)* | **15,200,000 Tokens** | $3.00 per 1M Input Tokens | **$45.60** |
| **Output Tokens Generated** *(C# Controllers, Next.js UI components, SQL scripts, PDF generation)* | **1,720,000 Tokens** | $15.00 per 1M Output Tokens | **$25.80** |
| **TOTAL AI TOKEN CONSUMPTION** | **16,920,000 Tokens** | — | **~$71.40 USD** |

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.513Z', N'2026-08-29T20:18:46.513Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (253, N'DocumentationRepo', N'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', N'User Manual', NULL, NULL, N'How to ?? 3. consolidated summary metrics?', N'??, 3., consolidated, summary, metrics, project_effort_and_token_analytics', N'**?? 3. Consolidated Summary Metrics** (Source: `PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md`)

* **Total Project Scope:** 30 Web API Controllers, 13 Next.js Pages, 25 Data Models, 9 SQL Tables, E2E Playwright Automation Suite.
* **Whole Project Engineering Effort:** **~455 Hours**
* **Last Release (`v2026.08.21`) Effort:** **~88 Hours**
* **Total AI LLM Token Cost:** **~$71.40 USD** (for ~16.92M Tokens)
* **Cost Efficiency Ratio:** Created **$45,000+** of senior enterprise software engineering value for **~$71.40** in AI compute cost.', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.513Z', N'2026-08-29T20:18:46.513Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (254, N'DocumentationRepo', N'TestPlan_Hotel_Pricing_Basis_20260828.md', N'Master Data', NULL, NULL, N'How to ?? test plan: hotel service entry, date fallback & tour operational notes?', N'??, test, plan:, hotel, service, entry,, date, fallback, &, tour', N'**?? Test Plan: Hotel Service Entry, Date Fallback & Tour Operational Notes** (Source: `TestPlan_Hotel_Pricing_Basis_20260828.md`)

**Version**: 1.0  
**Timestamp**: 2026-08-28 11:00:00 UTC  
**Target Solution**: UNO_ERP (Uno_API + Uno_CRM)  
**Author**: Antigravity Quality Assurance Agent  

---', N'/master-data', N'Open Master Data', 1, N'2026-08-29T20:18:46.516Z', N'2026-08-29T20:18:46.516Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (255, N'DocumentationRepo', N'TestPlan_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to ?? test scope & objectives?', N'??, test, scope, &, objectives, testplan_hotel_pricing_basis_20260828', N'**?? Test Scope & Objectives** (Source: `TestPlan_Hotel_Pricing_Basis_20260828.md`)

Verify the end-to-end functionality, calculations, data integrity, and UI experience for:
1. **Hotel Pricing Basis Switch** (`Per Room` vs `Per Pax`).
2. **Rooming List Auto-Fill & Live Occupancy Matching Banner**.
3. **100% Editable Room/Pax Rates (€) and Quantities (# Rooms / # Pax)**.
4. **Hotel Discount (€) & Informational Notes Field**.
5. **Quantity & Total Cost Calculation Rules** ($Q = \text{Count} \times \text{Nights}$, $T = \text{Price} \times Q$).
6. **New Tour Creation Date Bug Fix** (Ensures `ArrivalDate`/`EndDate` are never null, empty, or `000000`).
7. **Tour Info Operational Remarks Notes Field** (Large text field for operational notes).

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.516Z', N'2026-08-29T20:18:46.516Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (256, N'DocumentationRepo', N'TestPlan_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to ?? automated playwright test script location?', N'??, automated, playwright, test, script, location, testplan_hotel_pricing_basis_20260828', N'**?? Automated Playwright Test Script Location** (Source: `TestPlan_Hotel_Pricing_Basis_20260828.md`)

In compliance with project guidelines, the automated end-to-end Playwright test suite is saved at:
* **Path**: [`tests/e2e/hotel_pricing_and_tour_notes.spec.ts`](file:///C:/Ersen/Projects_2025/Uno_ERP/tests/e2e/hotel_pricing_and_tour_notes.spec.ts)

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.516Z', N'2026-08-29T20:18:46.516Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (257, N'DocumentationRepo', N'TestPlan_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to ?? manual & documentation export?', N'??, manual, &, documentation, export, testplan_hotel_pricing_basis_20260828', N'**?? Manual & Documentation Export** (Source: `TestPlan_Hotel_Pricing_Basis_20260828.md`)

Copies of this **Test Plan** and **Walkthrough** are exported into the project documentation folder:
* `C:\Ersen\Projects_2025\Codex\UNO_ERP\UserManuals\Walkthrough_Hotel_Pricing_Basis_20260828.md`
* `C:\Ersen\Projects_2025\Codex\UNO_ERP\UserManuals\TestPlan_Hotel_Pricing_Basis_20260828.md`', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.516Z', N'2026-08-29T20:18:46.516Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (258, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'Master Data', NULL, NULL, N'How to ?? walkthrough: enhanced hotel service entry & calculations?', N'??, walkthrough:, enhanced, hotel, service, entry, &, calculations, walkthrough_hotel_pricing_basis_20260828', N'**?? Walkthrough: Enhanced Hotel Service Entry & Calculations** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

All changes have been successfully implemented, verified, and pushed to the repository (`62fa45e`).

---', N'/master-data', N'Open Master Data', 1, N'2026-08-29T20:18:46.516Z', N'2026-08-29T20:18:46.516Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (259, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to 1. ?? pricing basis toggle (`per room` vs `per pax`)?', N'1., ??, pricing, basis, toggle, (`per, room`, vs, `per, pax`)', N'**1. ?? Pricing Basis Toggle (`Per Room` vs `Per Pax`)** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

* **Interactive Switch**: Toggle between `?? Per Room / Night` and `?? Per Pax / Night`.
* **Smart Master Data Default**: Auto-selects the hotel''s `PricingBasis` default from Master Data upon hotel selection.
* **Pre-fill & Rate Adaptation**:
  * **Per Room Mode**: Pre-fills quantities as `# Rooms` (e.g. 5 Double Rooms for 10 Pax) and pre-fills `DoubleRoomRate`.
  * **Per Pax Mode**: Pre-fills quantities as `# Pax` (e.g. 10 Pax in Double Rooms) and pre-fills `DoublePaxRate`.', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.516Z', N'2026-08-29T20:18:46.516Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (260, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to 2. ?? 100% editable rates & counts?', N'2., ??, 100%, editable, rates, &, counts, walkthrough_hotel_pricing_basis_20260828', N'**2. ?? 100% Editable Rates & Counts** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

* All rate inputs (€) and quantity inputs (# Rooms or # Pax) in both **Per Room** and **Per Pax** modes are **100% editable** `<input>` fields with clear visual labels.', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.516Z', N'2026-08-29T20:18:46.516Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (261, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to 3. ? 1-click rooming list auto-fill & live occupancy matching?', N'3., ?, 1, click, rooming, list, auto, fill, &, live', N'**3. ? 1-Click Rooming List Auto-Fill & Live Occupancy Matching** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

* **`? Auto-Fill from Rooming List` Button**: Inspects live `tour.passengers` and syncs room/pax counts.
* **Live Occupancy Banner**: Displays total accommodated Pax vs Total Tour Pax with a ?? **Matched** or ?? **Mismatch** status badge.', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.516Z', N'2026-08-29T20:18:46.516Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (262, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'Master Data', NULL, NULL, N'How to 4. ??? hotel discount & notes (informational)?', N'4., ???, hotel, discount, &, notes, (informational), walkthrough_hotel_pricing_basis_20260828', N'**4. ??? Hotel Discount & Notes (Informational)** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

* **Discount Amount (€)**: Numerical input to record promotional/negotiated discounts.
* **Discount Details / Rationale**: Text input to record discount notes (e.g. *"Early Bird 5% discount applied by hotel management"*).', N'/master-data', N'Open Master Data', 1, N'2026-08-29T20:18:46.516Z', N'2026-08-29T20:18:46.516Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (263, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to 5. ?? accurate quantity & total amount formulas?', N'5., ??, accurate, quantity, &, total, amount, formulas, walkthrough_hotel_pricing_basis_20260828', N'**5. ?? Accurate Quantity & Total Amount Formulas** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

* **Quantity ($Q$) Formula**:
  * **Per Room Mode**: $Q = \text{Room Count} \times \text{Nights}$ (e.g., $5\text{ Rooms} \times 3\text{ Nights} = 15$).
  * **Per Pax Mode**: $Q = \text{Pax Count} \times \text{Nights}$ (e.g., $10\text{ Pax} \times 3\text{ Nights} = 30$).
* **Total Amount ($T$) Formula**:
  * $T = \text{Unit Price} \times Q$.
* **Services Table Rendering**:
  * Services table displays exact breakdown: `15 (5 R × 3N)` or `30 (10 Pax × 3N)`.
* **Update Safety**: Updating a hotel service row on the Services screen recalculates quantity and total amount using the updated nights or room/pax count.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.520Z', N'2026-08-29T20:18:46.520Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (264, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to ?? verification & testing results?', N'??, verification, &, testing, results, walkthrough_hotel_pricing_basis_20260828', N'**?? Verification & Testing Results** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

1. **Backend Model & Database Schema**:
   * Added `DiscountAmount`, `DiscountNotes`, and `PricingBasis` columns to `TourService` C# model & SQL Server database.
2. **Build Verification**:
   * Rebuilt `Uno_API.csproj` and static `Uno_CRM` SPA successfully.
3. **Git Repository Status**:
   * Pushed commit `62fa45e` to `main` branch on GitHub.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.520Z', N'2026-08-29T20:18:46.520Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (265, N'DocumentationRepo', N'Walkthrough_Hotel_Pricing_Basis_20260828.md', N'User Manual', NULL, NULL, N'How to ?? how to verify in app?', N'??, how, to, verify, in, app, walkthrough_hotel_pricing_basis_20260828', N'**?? How to Verify in App** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

1. Refresh **`http://localhost:8000/`** (**`Ctrl + F5`**).
2. Open any Tour detail page $\rightarrow$ Navigate to **Services** tab $\rightarrow$ Click **+ Add Hotel Stay**.
3. Toggle between **Per Room** and **Per Pax** basis or click **? Auto-Fill from Rooming List**.
4. Edit any rate or room/pax count, enter discount notes, and click **Save Hotel Service**.', N'/tours', N'View Tours Grid', 1, N'2026-08-29T20:18:46.520Z', N'2026-08-29T20:18:46.520Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (266, N'Workflow', N'CHANGES_SUMMARY.md', N'Tour Management & Workflow', NULL, NULL, N'What default status is assigned when a new tour is created or imported?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### ðŸ Default Tour Workflow Status Rule
By default, **every newly created or imported tour starts from the first status on the dashboard** (`TourStatusId = 1` / Draft). Excel rooming imports, manual tour additions, and test script tour creations automatically set the initial status to status ID 1.', N'/tours', N'View Dashboard Status Columns', 1, N'2026-08-29T20:25:15.926Z', N'2026-08-29T20:25:15.926Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (267, N'Testing', N'CHANGES_SUMMARY.md', N'Testing & Automation', NULL, NULL, N'What test tours exist in the database and how were they created?', N'12 Test Tours, TestTour1 - TestTour12, E2E Test Suite, Tests 20260829, UnoErpDb', N'### ðŸ¤– E2E Test Suite Specification
The E2E Test Suite (`tests/e2e/test_20260829.js`) generated **12 Test Tours (`TestTour1` through `TestTour12`)** under Project `TEST-20260829`:
* **Pax Count**: 30 Pax per tour (27 Adults, 2 Children, 1 Infant) with rooming lists, family groups, room numbers, and child badges.
* **Pricing Modes**: Alternating Pax/Night and Room/Night pricing.
* **Initial Status**: All 12 tours start cleanly at Draft (`TourStatusId = 1`).', N'/tours', N'View Test Project Tours', 1, N'2026-08-29T20:25:15.926Z', N'2026-08-29T20:25:15.926Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (268, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Excel Import Guide', NULL, NULL, N'How to 📘 uno erp - comprehensive excel import workflow & step-by-step guide?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 📊 Complete Step-by-Step Excel Import Workflow Guide

Follow these exact filename conventions, sheet rules, and step-by-step procedures to import projects, tours, rooming lists, or master data into UNO ERP:

#### 📁 1. Filename Naming Conventions & Notation
1. **New or Existing Project + New Tour**: Use `{ProjectName}_{TourCode}_rooming.xlsx`
   * *Example*: `Project1_Tour1_rooming.xlsx` (or `Orta Avrupa BVP_BVP28082026_rooming.xlsx`)
2. **Existing Tour Rooming List Update**: Use `{TourCode}_rooming.xlsx`
   * *Example*: `Tour1_rooming.xlsx` (or `BVP28082026_rooming.xlsx`)
3. **Excursion Sales & Base Fees**: Use `{ProjectName}_{TourCode}_importSales.xlsx`
   * *Example*: `Project1_Tour1_importSales.xlsx`  
4. **Master Data Catalog**: Use `MasterData_Import_Template.xlsx`  

#### 📊 2. Required Sheet Names & Column Details
• **Sheet 1 (`Tours` / `Tour`)**: Col A: `Tour Code` (`Tour1`), Col B: `Project` (`Project1`), Col C: `Destination`, Col D: `Arrival Date`, Col E: `End Date`, Cols F-I: `Pax Counts`.
• **Sheet 2 (`Projects` / `Project`)**: Col A: `Project Code` (`Project1`), Col B: `Client Name` (`UNO DMC`).
• **Sheet 3 (`Rooming` / `Rooms` / `Passengers`)**: Col A: `Passenger Name`, Col B: `Gender`, Col C: `Pax Type`, Col D: `Booking Ref` (`BKG-01`), Col E: `Room Number` (`101`), Col F: `Room Type` (`Single`/`Double`/`Twin`/`Triple`).
• **Sheet 4 (`Hotels` - Master Data)**: Hotel Name, Location, Star Rating, Nightly Room & Pax Rates, Pricing Basis.

#### 🛠️ 3. Step-by-Step Import Scenarios

**Scenario A: NEW Tour for a NEW Project**
1. Name file `Project1_Tour1_rooming.xlsx`.
2. In sheet `Projects`, set Col A = `Project1`, Col B = `Client Name`.
3. In sheet `Tours`, set Col A = `Tour1`, Col B = `Project1`.
4. Go to **Tours** or **Projects** screen → Click **Import Rooming List** → Upload file.
5. *Result*: Creates `Project1` on the fly (`Active` status), creates `Tour1` in **`Draft`** status, and imports all rooming passengers.

**Scenario B: NEW Tour for an EXISTING Project**
1. Name file `Project1_Tour1_rooming.xlsx` (or set `Tours` sheet Col B = `Project1`).
2. Click **Import Rooming List** → Upload file.
3. *Result*: Matches existing project `Project1`, creates `Tour1` in **`Draft`** status, and binds `Tour1` under `Project1`.

**Scenario C: EXISTING Tour Rooming Refresh**
1. Name file `Tour1_rooming.xlsx`.
2. Click **Import Rooming List** → Upload file.
3. *Result*: Refreshes passenger rooming list and pax counts, preserving all existing hotel & guide service lines.

**Scenario D: NEW vs EXISTING Master Data (Hotels, Guides, Transport)**
1. Go to **Master Data** screen → Click **Import Master Data** → Select `MasterData_Import_Template.xlsx`.
2. *Result*: Creates new supplier records or updates existing contract rates without duplicating records.', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-08-31T20:52:31.836Z', N'2026-09-18T08:08:37.219Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (269, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'User Manual', NULL, NULL, N'How to 🎯 **overview of the 3 official import files**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**🎯 **Overview of the 3 Official Import Files****

To ensure 100% data integrity without missing foreign key references, UNO ERP uses **exactly 3 official template files** located on the shared drive:

📂 **Shared Drive Location**: `Shared Drive/UnoERP/ExcelImportFiles/`

1. **`MasterData_Import_Template.xlsx`** → *Master Data (Hotels, Guides, Transport, Drivers, Excursions)*
2. **`Rooming_import_template.xlsx`** → *Tour & Passenger Rooming List*
3. **`Sales_import_template.xlsx`** → *Excursion Sales & Base Services Report*

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T20:52:31.850Z', N'2026-09-01T15:57:51.267Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (270, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'User Manual', NULL, NULL, N'How to 🔄 **mandatory step-by-step import workflow**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**🔄 **Mandatory Step-by-Step Import Workflow****

```mermaid
flowchart TD
    A["Step 1: Master Data Import (MasterData_Import_Template.xlsx)"] --> B["Step 2: Tour & Rooming List Import (Rooming_import_template.xlsx)"]
    B --> C{"Passengers Uploaded? (allPassengers.length > 0)"}
    C -- Yes --> D["Step 3: Green Download Sale File Button Appears"]
    C -- No --> E["Button Hidden / Unavailable until Rooming List Uploaded"]
    D --> F["Step 4: Excursion Sales Import (Sales_import_template.xlsx)"]
```

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T20:52:31.851Z', N'2026-09-01T15:57:51.267Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (271, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Master Data', NULL, NULL, N'How to 1️⃣ **step 1 (always first): master data import**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**1️⃣ **STEP 1 (ALWAYS FIRST): Master Data Import**** (Source: `EXCEL_IMPORT_WORKFLOW_GUIDE.md`)

> [!IMPORTANT]
> **Why First?** Tours, hotels, excursion calculations, transport, and guide assignments rely on pre-existing Master Data. If you try to import a rooming file before importing hotels, the system will not be able to match hotel names or pricing rates.

* **File Name**: `MasterData_Import_Template.xlsx`
* **File Location**: `Shared Drive/UnoERP/ExcelImportFiles/MasterData_Import_Template.xlsx`
* **Target Screen**: Navigation Sidebar $\rightarrow$ **Master Data** $\rightarrow$ Click **Import Master Data** button.
* **What it Imports**:
  * **Hotels Sheet**: Hotel Name, Location, Star Rating, **Pricing Basis (`Pax` vs `Room`)**, Single Room & Pax Rates, Double Room & Pax Rates, Twin Room & Pax Rates, Triple Room & Pax Rates, Contact Person, Email, and Phone.
  * **Guides Sheet**: Guide Names, Languages spoken, Daily Rates, Phone Numbers.
  * **Transport Sheet**: Bus/Transport Companies, Daily Rates, Fleet Size, Contact Details.
  * **Drivers Sheet**: Driver Names, Assigned Transport Companies, Phone Numbers, Daily Rates.
  * **Excursions Sheet**: Excursion Names, Cities, Vendor Names, Adult/Child Costs, and Selling Prices.

---', N'/master-data', N'Open Master Data', 1, N'2026-08-31T20:52:31.852Z', N'2026-08-31T20:58:39.285Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (272, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'User Manual', NULL, NULL, N'How to 2️⃣ **step 2: tour & passenger rooming list import**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**2️⃣ **STEP 2: Tour & Passenger Rooming List Import**** (Source: `EXCEL_IMPORT_WORKFLOW_GUIDE.md`)

> [!NOTE]
> Once Master Data is loaded, you import the tour contract, project, and passenger rooming list.

* **File Name**: `Rooming_import_template.xlsx`
* **File Location**: `Shared Drive/UnoERP/ExcelImportFiles/Rooming_import_template.xlsx`
* **Target Screen**: Navigation Sidebar $\rightarrow$ **Tours** (or **Projects**) $\rightarrow$ Click **Import Rooming List**.
* **What it Creates & Imports**:
  * **Projects Sheet**: Creates/resolves the Project (e.g. `PRJ-BVP1` / `Tests 20260829`).
  * **Tours Sheet**: Creates the Tour (`BVP05072026`) and automatically sets its initial status to **`Draft` (`TourStatusId = 1` / First Status on Dashboard)**.
  * **Rooming Sheet**: Imports all 30 Passengers, groups family bookings (`BKG-01` to `BKG-15`), assigns `Room Numbers`, maps `Pax Type` (`Adult`, `Children`, `Infant`), and attaches child badges.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T20:52:31.852Z', N'2026-08-31T20:58:39.285Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (273, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'User Manual', NULL, NULL, N'How to 3️⃣ **step 3: download pre-populated sales template (prerequisite: rooming list uploaded)**?', N'3️⃣, **step, 3:, download, pre, populated, sales, template, (prerequisite:, rooming', N'**3️⃣ **STEP 3: Download Pre-populated Sales Template (Prerequisite: Rooming List Uploaded)**** (Source: `EXCEL_IMPORT_WORKFLOW_GUIDE.md`)

> [!IMPORTANT]
> **Green Button Availability**: The green **`Download Sale File`** button will **ONLY** appear once the passenger rooming list has been uploaded and passengers exist for the tour (`allPassengers.length > 0`). If no rooming list has been uploaded yet, the download button is hidden.

* **How it Works**:
  1. Once Rooming List passengers are uploaded in Step 2, navigate to the Tour Details page.
  2. Click the **Bookings** tab.
  3. The green **`Download Sale File`** button is now visible next to the passenger search input.
* **Output File**: Generates `{ProjectCode}_{TourCode}_importSales.xlsx` (e.g. `PRJ-BVP1_PVB05072026_importSales.xlsx`).
* **Detailed Passenger Pre-population**:
  * Automatically populates **all passengers in full detail** row by row.
  * Children under 18 are highlighted in **red font with a `(CHD)` badge**.
  * Renders interactive drop-down checkboxes (`☐` / `☑`) for every excursion across all passengers.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T20:52:31.853Z', N'2026-08-31T20:58:39.286Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (274, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'User Manual', NULL, NULL, N'How to 4️⃣ **step 4: excursion sales & base services import**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**4️⃣ **STEP 4: Excursion Sales & Base Services Import**** (Source: `EXCEL_IMPORT_WORKFLOW_GUIDE.md`)

> [!NOTE]
> After the guide or tour leader marks which passengers attended which excursions, upload the completed sales file.

* **File Name**: `Sales_import_template.xlsx` (or the downloaded sale file).
* **File Location**: `Shared Drive/UnoERP/ExcelImportFiles/Sales_import_template.xlsx`
* **Target Screen**: Tour Details page $\rightarrow$ **Services** tab $\rightarrow$ Click **Import Excursion Sales**.
* **What it Calculates & Imports**:
  * **ExcusionSales Sheet**: Parses `☑` checked boxes, calculates total quantities per excursion, creates Revenue and Expense lines for the tour.
  * **Guide Commission**: **Strictly calculates 10% of total excursion sales**. If no excursions are sold (or total sales $= 0$), Guide Commission is strictly set to **€0.00**.
  * **BaseServices Sheet**: Imports agency fees and city tax entries.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T20:52:31.853Z', N'2026-08-31T20:58:39.286Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (275, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'User Manual', NULL, NULL, N'How to 🤖 **ai assistant query quick reference**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**🤖 **AI Assistant Query Quick Reference****

When users ask the AI Assistant about Excel imports, the assistant references the following rules:

| User Question | AI Assistant Answer |
| :--- | :--- |
| **"How can I import sales excel file?"** | Open Tour Details → **Services** tab → Click **Import Excursion Sales** and select `Sales_import_template.xlsx` from `Shared Drive/UnoERP/ExcelImportFiles/`. Note: The rooming list must be uploaded first so passengers exist. |
| **"Which Excel file do I import first?"** | You MUST import **`MasterData_Import_Template.xlsx` FIRST** from `Shared Drive/UnoERP/ExcelImportFiles/` under the Master Data menu to establish hotels, rates, guides, and excursions before importing tours. |
| **"Where are the official import template files located?"** | All 3 official template files are stored on the shared drive: `Shared Drive/UnoERP/ExcelImportFiles/`. |
| **"What file do I use for Rooming lists?"** | Use **`Rooming_import_template.xlsx`** from `Shared Drive/UnoERP/ExcelImportFiles/`. It creates the project, sets the tour status to **Draft**, and imports passengers with room numbers. |
| **"Why is the green Download Sale File button not showing?"** | The green **`Download Sale File` button ONLY appears after the Rooming List has been uploaded**. If no passengers exist for the tour, the button remains hidden until passenger data is imported. |

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T20:52:31.854Z', N'2026-09-01T15:57:51.269Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (276, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'User Manual', NULL, NULL, N'How to 📁 **shared drive storage location**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**📁 **Shared Drive Storage Location****

All official import templates are preserved in:
* **Shared Drive Directory**: `Shared Drive/UnoERP/ExcelImportFiles/`', N'/tours', N'View Tours Grid', 1, N'2026-08-31T20:52:31.855Z', N'2026-09-01T15:57:51.269Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (277, N'DocumentationRepo', N'CHANGES_SUMMARY.md', N'General', N'General', N'', N'How to 🚀 uno erp - implemented features & technical summary walkthrough?', N'uno, erp, implemented, features, technical, summary, walkthrough, changes_summary, this, document, provides, all, changes, tested, and, pushed, the, repository, during, session', N'### 🚀 UNO ERP - Implemented Features & Technical Summary Walkthrough

This document provides a technical walkthrough of all changes implemented, tested, and pushed to the repository during this session.

---', N'/tours', N'View Tours', 1, N'2026-08-31T20:52:39.232Z', N'2026-10-25T18:37:52.189Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (278, N'DocumentationRepo', N'CHANGES_SUMMARY.md', N'General', N'General', N'', N'How to 1. 💶 guide commission calculation logic?', N'guide, commission, calculation, logic, changes_summary, important, rule, enforced, now, calculated, strictly, based, excursion, sales, exist, for, tour, total, always, and, line, item, generated, base, services, cost', N'### 1. 💶 Guide Commission Calculation Logic

> [!IMPORTANT]
> **Rule Enforced**: Guide commission is now calculated **strictly based on Excursion Sales**. If no excursion sales exist for a tour (or Excursion Sales total $= 0$), **Guide Commission is always €0.00** and no guide commission line item is generated in Base Services / Services Cost.', N'/tours', N'View Tours', 1, N'2026-08-31T20:52:39.233Z', N'2026-10-25T18:37:52.190Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (279, N'DocumentationRepo', N'CHANGES_SUMMARY.md', N'General', N'General', N'', N'How to summary of changes:?', N'summary, changes, changes_summary, frontend, page, client, tsx, updated, guide, commission, subtotal, calculation, derive, strictly, from, total, excursion, sales, backend, tourscontroller, prevented, baseline, fee, percentage, fallback, when, are, zero', N'### Summary of Changes:

* **Frontend (`page.client.tsx`)**: Updated guide commission subtotal calculation to derive commission strictly from total excursion sales.
* **Backend (`ToursController.cs`)**: Prevented baseline fee percentage fallback when excursion sales are zero.

---', N'/tours', N'View Tours', 1, N'2026-08-31T20:52:39.233Z', N'2026-10-25T18:37:52.190Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (280, N'DocumentationRepo', N'CHANGES_SUMMARY.md', N'General', N'General', N'', N'How to 2. 🏨 hotel tax (city tax) — 4 editable input fields & manual override priority?', N'hotel, tax, city, editable, input, fields, manual, override, priority, changes_summary, note, all, calculation, metrics, are, rendered, explicit, styled, inside, the, modal, box, rate, pax, night, type, number, step, total, defaults', N'### 2. 🏨 Hotel Tax (City Tax) — 4 Editable Input Fields & Manual Override Priority

> [!NOTE]
> All 4 Hotel Tax calculation metrics are rendered as explicit, styled `<input>` fields inside the **HOTEL TAX (CITY TAX)** modal box:
> 1. **Tax Rate (€ / pax / night)**: `<input type="number" step="0.10" />`
> 2. **Total Pax**: `<input type="number" />` (Defaults to tour pax, fully editable)
> 3. **Nightly Tax (€)**: `<input type="number" step="0.01" />` (Defaults to `Pax × Rate`, fully editable)
> 4. **Total Stay Tax (€)**: `<input type="number" step="0.01" />` (Defaults to `Nightly Tax × Nights`, **final manual override priority**)', N'/tours', N'View Tours', 1, N'2026-08-31T20:52:39.234Z', N'2026-10-25T18:37:52.191Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (281, N'DocumentationRepo', N'CHANGES_SUMMARY.md', N'General', N'General', N'', N'How to guarantee:?', N'guarantee, changes_summary, whatever, manual, value, entered, total, stay, tax, strictly, preserved, and, saved, the, final, service, cost, amount, totalamount, overriding, any, auto, calculated, values, added, quick, action, support, for, city', N'### Guarantee:

* Whatever manual value is entered in **Total Stay Tax (€)** is strictly preserved and saved as the final service cost amount (`totalAmount`), overriding any auto-calculated values.
* Added quick-action support for **`+ City Tax`** and **`+ Hotel Tax`** buttons to automatically launch the Hotel Tax modal box with all inputs pre-selected.

---', N'/tours', N'View Tours', 1, N'2026-08-31T20:52:39.234Z', N'2026-10-25T18:37:52.191Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (282, N'DocumentationRepo', N'CHANGES_SUMMARY.md', N'General', N'General', N'', N'How to 3. 🏁 default tour workflow status (first dashboard status)?', N'default, tour, workflow, status, first, dashboard, changes_summary, important, all, newly, created, imported, tours, now, start, from, the, tourstatusid, draft', N'### 3. 🏁 Default Tour Workflow Status (First Dashboard Status)

> [!IMPORTANT]
> All newly created or imported tours now start from the **First Status on the Dashboard (`TourStatusId = 1` / Draft)**.', N'/tours', N'View Tours', 1, N'2026-08-31T20:52:39.234Z', N'2026-10-25T18:37:52.192Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (283, N'DocumentationRepo', N'CHANGES_SUMMARY.md', N'General', N'General', N'', N'How to implementation details:?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Implementation Details:

* **`TourImportController.cs`**: Replaced hardcoded `TourStatusId = 3` (Confirmed) with `TourStatusId = 1` (Draft) for all Excel rooming imports.
* **`ToursController.cs`**: Updated default tour initialization fallback to `TourStatusId = 1`.
* **Frontend (`page.client.tsx` & `projects/[id]/page.client.tsx`)**: Ensured all tour creation forms default to `tourStatusId = 1`.

---', N'/tours', N'View Tours', 1, N'2026-08-31T20:52:39.235Z', N'2026-10-25T18:37:52.193Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (284, N'DocumentationRepo', N'CHANGES_SUMMARY.md', N'General', N'General', N'', N'How to local database switch:?', N'local, database, switch, changes_summary, switched, active, connection, string, appsettings, development, json, file, ersen, projects_2025, uno_erp, uno_api, unoerpdb, defaultconnection, server, localdb, mssqllocaldb, trusted_connection, true, multipleact', N'### Local Database Switch:

* Switched active local connection string in [`appsettings.Development.json`](file:///C:/Ersen/Projects_2025/Uno_ERP/Uno_API/Uno_API/appsettings.Development.json) to **`UnoErpDb`**:
  ```json
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=UnoErpDb;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;Encrypt=False"
  ```', N'/tours', N'View Tours', 1, N'2026-08-31T20:52:39.235Z', N'2026-10-25T18:37:52.193Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (285, N'DocumentationRepo', N'CHANGES_SUMMARY.md', N'General', N'General', N'', N'How to delta upgrade sql script (`delta_schema_update_today.sql`):?', N'delta, upgrade, sql, script, delta_schema_update_today, changes_summary, generated, and, committed, idempotent, schema, file, location, publish, ersen, projects_2025, uno_erp, function, safe, run, any, previous, database, release', N'### Delta Upgrade SQL Script (`delta_schema_update_today.sql`):

* Generated and committed an idempotent SQL schema upgrade script:
  * **File Location**: [`Publish/260829/delta_schema_update_today.sql`](file:///C:/Ersen/Projects_2025/Uno_ERP/Publish/260829/delta_schema_update_today.sql)
  * **Function**: Safe to run on any previous database release to upgrade schema and seed default data (`Users`, `AuditLogs`, `RolePermissions`, `TourStatusCheckpoints`, `AiKnowledgeItems`, `GuideCommission`, `RoomNumber`, `PaxType`, etc.).

---', N'/tours', N'View Tours', 1, N'2026-08-31T20:52:39.235Z', N'2026-10-25T18:37:52.194Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (286, N'DocumentationRepo', N'CHANGES_SUMMARY.md', N'General', N'General', N'', N'How to 5. 🤖 e2e automation test suite (all 12 test tours population)?', N'e2e, automation, test, suite, all, tours, population, changes_summary, tip, the, tests, test_20260829, file, ersen, projects_2025, uno_erp, was, executed, directly, against, http, localhost, api, active, unoerpdb, database', N'### 5. 🤖 E2E Automation Test Suite (All 12 Test Tours Population)

> [!TIP]
> The E2E Test Suite ([`tests/e2e/test_20260829.js`](file:///C:/Ersen/Projects_2025/Uno_ERP/tests/e2e/test_20260829.js)) was executed directly against `http://localhost:8000/api` on the active `UnoErpDb` database.', N'/tours', N'View Tours', 1, N'2026-08-31T20:52:39.236Z', N'2026-10-25T18:37:52.194Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (287, N'DocumentationRepo', N'CHANGES_SUMMARY.md', N'General', N'General', N'', N'How to generated test data:?', N'generated, test, data, changes_summary, project, tests, tours, testtour1, through, testtour12, passengers, pax, per, tour, adults, children, infant, with, rooming, lists, family, groups, room, numbers, and, child, badges, pricing, modes, night', N'### Generated Test Data:

* **Project**: `Tests 20260829` (`TEST-20260829`)
* **Tours**: **12 Test Tours (`TestTour1` through `TestTour12`)**
* **Passengers**: 30 Pax per tour (**27 Adults, 2 Children, 1 Infant**) with rooming lists, family groups, room numbers, and child badges.
* **Pricing Modes**:
  * **`Pax/Night` Pricing**: `TestTour1`, `TestTour3`, `TestTour5`, `TestTour7`, `TestTour9`, `TestTour11`
  * **`Room/Night` Pricing**: `TestTour2`, `TestTour4`, `TestTour6`, `TestTour8`, `TestTour10`, `TestTour12`
* **Workflow Status**: Every tour was created starting cleanly at **Draft (`Status ID = 1`)**.

---', N'/tours', N'View Tours', 1, N'2026-08-31T20:52:39.236Z', N'2026-10-25T18:37:52.195Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (288, N'DocumentationRepo', N'CHANGES_SUMMARY.md', N'General', N'General', N'', N'How to 📄 git repository log?', N'git, repository, log, changes_summary, commit, hash, branch, description, f751917, main, test, e2e, update, automation, script, generate, all, tours, via, api, into, active, database, a4c2581, config, switch, local, connection, string, appsettings', N'### 📄 Git Repository Log

| Commit Hash | Branch | Description |
| :--- | :--- | :--- |
| `f751917` | `main` | `test(e2e): Update E2E automation test script to generate all 12 Test Tours via API into active database` |
| `a4c2581` | `main` | `config(db): Switch local database connection string in appsettings.Development.json to UnoErpDb` |
| `0022c1a` | `main` | `docs(db): Add idempotent SQL delta upgrade script delta_schema_update_today.sql` |
| `73bd189` | `main` | `feat(tours): Default newly created/imported tours to first dashboard status and enhance hotel stay tax override in quick buttons` |
| `9a59ae9` | `main` | `feat(ui): Ensure manual override on all 4 Hotel Tax fields is strictly preserved as final saved service value` |', N'/tours', N'View Tours', 1, N'2026-08-31T20:52:39.237Z', N'2026-10-25T18:37:52.195Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (289, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Master Data', NULL, NULL, N'How to 1️⃣ **how to import master data excel file (step 1 - always first)**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**1️⃣ **How to Import Master Data Excel File (STEP 1 - ALWAYS FIRST)****

> [!IMPORTANT]
> **Why First?** Tours, hotels, excursion calculations, transport, and guide assignments rely on pre-existing Master Data. If you try to import a rooming file before importing hotels, the system will not be able to match hotel names or pricing rates.

* **File Name**: `MasterData_Import_Template.xlsx`
* **File Location**: `Shared Drive/UnoERP/ExcelImportFiles/MasterData_Import_Template.xlsx`
* **Target Screen**: Navigation Sidebar → **Master Data** → Click **Import Master Data** button.
* **What it Imports**:
  * **Hotels Sheet**: Hotel Name, Location, Star Rating, **Pricing Basis (`Pax` vs `Room`)**, Single Room & Pax Rates, Double Room & Pax Rates, Twin Room & Pax Rates, Triple Room & Pax Rates, Contact Person, Email, and Phone.
  * **Guides Sheet**: Guide Names, Languages spoken, Daily Rates, Phone Numbers.
  * **Transport Sheet**: Bus/Transport Companies, Daily Rates, Fleet Size, Contact Details.
  * **Drivers Sheet**: Driver Names, Assigned Transport Companies, Phone Numbers, Daily Rates.
  * **Excursions Sheet**: Excursion Names, Cities, Vendor Names, Adult/Child Costs, and Selling Prices.

---', N'/master-data', N'Open Master Data', 1, N'2026-08-31T21:01:26.332Z', N'2026-09-01T15:57:51.267Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (290, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'User Manual', NULL, NULL, N'How to 2️⃣ **how to import tour & rooming list excel file (step 2)**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**2️⃣ **How to Import Tour & Rooming List Excel File (STEP 2)****

> [!NOTE]
> Once Master Data is loaded, you import the tour contract, project, and passenger rooming list.

* **File Name**: `Rooming_import_template.xlsx`
* **File Location**: `Shared Drive/UnoERP/ExcelImportFiles/Rooming_import_template.xlsx`
* **Target Screen**: Navigation Sidebar → **Tours** (or **Projects**) → Click **Import Rooming List**.
* **What it Creates & Imports**:
  * **Projects Sheet**: Creates/resolves the Project (e.g. `PRJ-BVP1` / `Tests 20260829`).
  * **Tours Sheet**: Creates the Tour (`BVP05072026`) and automatically sets its initial status to **`Draft` (`TourStatusId = 1` / First Status on Dashboard)**.
  * **Rooming Sheet**: Imports all 30 Passengers, groups family bookings (`BKG-01` to `BKG-15`), assigns `Room Numbers`, maps `Pax Type` (`Adult`, `Children`, `Infant`), and attaches child badges.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:01:26.358Z', N'2026-09-01T15:57:51.268Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (291, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'User Manual', NULL, NULL, N'How to 3️⃣ **how to download pre-populated sales template**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**3️⃣ **How to Download Pre-populated Sales Template****

> [!IMPORTANT]
> **Green Button Availability**: The green **`Download Sale File`** button will **ONLY** appear once the passenger rooming list has been uploaded and passengers exist for the tour (`allPassengers.length > 0`). If no rooming list has been uploaded yet, the download button is hidden.

* **How to Download**:
  1. Open the Tour Details page.
  2. Click the **Bookings** tab.
  3. Click the green **`Download Sale File`** button next to the search input.
* **Output File**: Generates `{ProjectCode}_{TourCode}_importSales.xlsx` (e.g. `PRJ-BVP1_PVB05072026_importSales.xlsx`).
* **Detailed Passenger Pre-population**:
  * Automatically populates **all passengers in full detail** row by row.
  * Children under 18 are highlighted in **red font with a `(CHD)` badge**.
  * Renders interactive drop-down checkboxes (`☐` / `☑`) for every excursion across all passengers.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:01:26.359Z', N'2026-09-01T15:57:51.268Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (292, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'User Manual', NULL, NULL, N'How to 4️⃣ **how to import sales excel file (excursion sales & base services)**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**4️⃣ **How to Import Sales Excel File (Excursion Sales & Base Services)****

> [!NOTE]
> Follow these exact steps to import excursion sales and base services from an Excel file into UNO ERP.

* **File Name**: `Sales_import_template.xlsx` (or the downloaded sale file).
* **File Location**: `Shared Drive/UnoERP/ExcelImportFiles/Sales_import_template.xlsx`
* **Target Screen**: Tour Details page → **Services** tab → Click **Import Excursion Sales**.
* **Step-by-Step Instructions**:
  1. Open the Tour Details page for your specific tour.
  2. Navigate to the **Services** tab.
  3. Click the **`Import Excursion Sales`** button.
  4. Select `Sales_import_template.xlsx` from `Shared Drive/UnoERP/ExcelImportFiles/`.
  5. The system parses all checked checkboxes (`☑`), calculates total passenger attendance per excursion, creates Revenue and Expense lines for the tour, calculates Guide Commission (strictly 10% of excursion sales), and updates Base Services (Agency Fee, CityTax).

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:01:26.359Z', N'2026-09-01T15:57:51.268Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (293, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'Master Data', NULL, NULL, N'How to ⚙️ master data - setup & detailed entry management?', N'master, data, setup, detailed, entry, management, 01_masterdata_setup_and_management, contains, the, core, reference, entities, hotels, guides, transport, companies, drivers, excursions, required, uno, erp, calculate, pricing, assign, operational', N'### ⚙️ Master Data - Setup & Detailed Entry Management

Master Data contains the core reference entities (Hotels, Guides, Transport Companies, Drivers, Excursions) required by UNO ERP to calculate pricing, assign operational staff, and build tour itineraries.

---', N'/master-data', N'Open Master Data', 1, N'2026-08-31T21:16:45.718Z', N'2026-09-17T07:52:57.980Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (294, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'Master Data', NULL, NULL, N'How to 🏬 **1. hotels management**?', N'🏬, **1., hotels, management**, 01_masterdata_setup_and_management', N'**🏬 **1. Hotels Management****

* **Target Screen**: Sidebar → **Master Data** → **Hotels** tab.
* **Fields**:
  * **Hotel Name**: Full commercial name (e.g. `Hotel Canada`, `Hotel Olympik`).
  * **City / Location**: Destination city (`Prague`, `Vienna`, `Budapest`).
  * **Star Rating**: 3-star, 4-star, or 5-star rating.
  * **Pricing Basis**: Select **`Pax`** (per person per night) or **`Room`** (per room per night).
  * **Rate Matrix**: Single Room/Pax Rate, Double Room/Pax Rate, Twin Room/Pax Rate, Triple Room/Pax Rate.
  * **Contact Details**: Contact person, email, and emergency telephone number.

---', N'/master-data', N'Open Master Data', 1, N'2026-08-31T21:16:45.729Z', N'2026-09-01T15:57:51.190Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (295, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'Master Data', NULL, NULL, N'How to 🚩 **2. guides management**?', N'🚩, **2., guides, management**, 01_masterdata_setup_and_management', N'**🚩 **2. Guides Management****

* **Target Screen**: Sidebar → **Master Data** → **Guides** tab.
* **Fields**:
  * **Guide Name**: Full legal name.
  * **Languages Spoken**: Spoken languages (e.g. `English`, `Turkish`, `German`).
  * **Daily Fee (€)**: Contracted daily wage rate in Euros (€).
  * **Phone & Email**: Operational contact details for tour communications.

---', N'/master-data', N'Open Master Data', 1, N'2026-08-31T21:16:45.732Z', N'2026-09-01T15:57:51.191Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (296, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'User Manual', NULL, NULL, N'How to 🚌 **3. transport & drivers management**?', N'🚌, **3., transport, &, drivers, management**, 01_masterdata_setup_and_management', N'**🚌 **3. Transport & Drivers Management****

* **Target Screen**: Sidebar → **Master Data** → **Transport / Drivers** tab.
* **Fields**:
  * **Transport Company**: Company name, fleet capacity, daily bus rates (€).
  * **Drivers**: Driver name, phone number, assigned transport company, daily rate (€).

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.734Z', N'2026-09-01T15:57:51.192Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (297, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'User Manual', NULL, NULL, N'How to 🎟️ **4. excursions management**?', N'🎟️, **4., excursions, management**, 01_masterdata_setup_and_management', N'**🎟️ **4. Excursions Management****

* **Target Screen**: Sidebar → **Master Data** → **Excursions** tab.
* **Fields**:
  * **Excursion Title**: Official excursion title (e.g. `Dresden Tour`, `Mozart Concert`).
  * **City**: Location city.
  * **Vendor Ticket Cost (€)**: Attraction entry ticket fee paid per adult/child.
  * **Selling Price (€)**: Retail price charged per adult/child passenger.', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.734Z', N'2026-09-01T15:57:51.192Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (298, N'DocumentationRepo', N'01_Projects_Overview_and_Purpose.md', N'User Manual', NULL, NULL, N'How to 📁 projects - overview, purpose & core fields?', N'projects, overview, purpose, core, fields, 01_projects_overview_and_purpose, uno, erp, project, represents, commercial, umbrella, contract, master, agreement, with, client, agency, tour, operator, travel, corporate, allow, managers, group', N'### 📁 Projects - Overview, Purpose & Core Fields

In UNO ERP, a **Project** represents a commercial umbrella contract or master agreement with a client agency (e.g. tour operator, travel agency, corporate client). Projects allow tour managers to group multiple individual tour operations under a single commercial contract.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.770Z', N'2026-09-17T07:52:57.993Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (299, N'DocumentationRepo', N'01_Projects_Overview_and_Purpose.md', N'User Manual', NULL, NULL, N'How to 🎯 **why projects are needed**?', N'🎯, **why, projects, are, needed**, 01_projects_overview_and_purpose', N'**🎯 **Why Projects Are Needed****

1. **Commercial Contract Grouping**: A single client agency may book 10 different departure dates for the "Prague-Vienna-Budapest" tour in a single season. Creating a Project allows you to track total contract revenue, total operational costs, and overall profitability across all 10 departures under one roof.
2. **Master Data & Pricing Consistency**: Projects bind tour departures to specific client pricing agreements, vendor rate sheets, and payment terms.
3. **Executive Dashboard Analytics**: Project-level dashboards aggregate performance KPIs (Pax volume, Gross Sales, Net Margin %, Unpaid Invoices) across all linked tours.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.772Z', N'2026-09-01T15:57:51.203Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (300, N'DocumentationRepo', N'01_Projects_Overview_and_Purpose.md', N'User Manual', NULL, NULL, N'How to 📋 **most important project fields**?', N'📋, **most, important, project, fields**, 01_projects_overview_and_purpose', N'**📋 **Most Important Project Fields****

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

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.774Z', N'2026-09-01T15:57:51.204Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (301, N'DocumentationRepo', N'01_Projects_Overview_and_Purpose.md', N'User Manual', NULL, NULL, N'How to 🔗 **relationship to tours & metadata**?', N'🔗, **relationship, to, tours, &, metadata**, 01_projects_overview_and_purpose', N'**🔗 **Relationship to Tours & Metadata****

* **Projects → Tours**: One Project contains many Tours (`1 : N` relationship).
* **Projects → Metadata**: Project status flows, status checkpoints, and role access permissions are governed by central **Metadata & Governance Rules**.', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.776Z', N'2026-09-01T15:57:51.204Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (302, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'Process Flow', NULL, NULL, N'How to 🚦 metadata - statuses, order, checkpoints, roles, taxes & discounts?', N'metadata, statuses, order, checkpoints, roles, taxes, discounts, 02_statuses_permissions_and_checkpoints, this, document, details, the, central, governance, rules, uno, erp, including, tour, status, lifecycles, mandatory, role, access, permissions', N'### 🚦 Metadata - Statuses, Order, Checkpoints, Roles, Taxes & Discounts

This document details the central metadata governance rules in UNO ERP, including tour status lifecycles, mandatory checkpoints, role access permissions, tax rates, and discount structures.

---', N'/tours', N'Tour Status Kanban', 1, N'2026-08-31T21:16:45.785Z', N'2026-09-17T07:52:58.003Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (303, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'Process Flow', NULL, NULL, N'How to 🔁 **1. tour statuses & lifecycle order**?', N'🔁, **1., tour, statuses, &, lifecycle, order**, 02_statuses_permissions_and_checkpoints', N'**🔁 **1. Tour Statuses & Lifecycle Order****

Tours transition sequentially across 5 ordered status stages:

| Order Index | Status Name | System Behavior & Business Rule |
| :---: | :--- | :--- |
| **1** | **`Draft`** | Initial status upon creation/import. Editable rooming and service lines. |
| **2** | **`Confirmed`** | Requires Guide + Bus assignment and verified rooming list. |
| **3** | **`In Progress`** | Tour is currently departing/active on location. |
| **4** | **`Completed`** | Passengers returned; excursion sales and guide commissions finalized. |
| **5** | **`Accounting Closed`** | Invoices issued, operator remittance verified. Locks financial edits. |

---', N'/tours', N'Tour Status Kanban', 1, N'2026-08-31T21:16:45.787Z', N'2026-09-01T15:57:51.214Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (304, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'Process Flow', NULL, NULL, N'How to ✅ **2. mandatory status checkpoints**?', N'✅, **2., mandatory, status, checkpoints**, 02_statuses_permissions_and_checkpoints', N'**✅ **2. Mandatory Status Checkpoints****

Before a tour can advance to the next status on the Kanban Dashboard, all **Checkpoints** for the current status must pass:
* **Draft → Confirmed**: Guide assigned (`GuideId != null`), Transport assigned (`BusCompanyId != null`), Passenger count $> 0$.
* **In Progress → Completed**: Excursion sales check boxes recorded, Guide commission calculated.
* **Completed → Accounting Closed**: Invoice generated, cash remittance verified.

---', N'/tours', N'Tour Status Kanban', 1, N'2026-08-31T21:16:45.787Z', N'2026-09-01T15:57:51.216Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (305, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'User Manual', NULL, NULL, N'How to 🔒 **3. role access permissions**?', N'🔒, **3., role, access, permissions**, 02_statuses_permissions_and_checkpoints', N'**🔒 **3. Role Access Permissions****

* **`Administrator`**: Full read, write, update, delete, status override, and user management privileges.
* **`TourAdmin / Manager`**: Can create tours, import rooming/sales files, edit tour services, and advance tour statuses.
* **`Read-Only User / Guide`**: Can view tour itineraries, rooming lists, and mark excursion attendance.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.788Z', N'2026-09-01T15:57:51.217Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (306, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'User Manual', NULL, NULL, N'How to 🏷️ **4. tax rates & agency discounts**?', N'🏷️, **4., tax, rates, &, agency, discounts**, 02_statuses_permissions_and_checkpoints', N'**🏷️ **4. Tax Rates & Agency Discounts****

* **Tax Settings**: Configurable VAT / City Tax percentage rates applied during invoice generation.
* **Agency Discounts**: Special agency discount percentages applied to gross base tour fees for partner operators.', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.788Z', N'2026-09-01T15:57:51.217Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (307, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'User Manual', NULL, NULL, N'How to 💶 tours - services, revenue, expenses & calculation logic?', N'tours, services, revenue, expenses, calculation, logic, 02_tour_services_and_financial_logic, this, document, details, the, exact, financial, cost, structures, vendor, calculations, and, commission, rules, used, uno, erp, compute, tour', N'### 💶 Tours - Services, Revenue, Expenses & Calculation Logic

This document details the exact financial logic, cost structures, vendor calculations, and commission rules used by UNO ERP to compute tour profitability.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.797Z', N'2026-09-17T07:52:58.011Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (308, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'User Manual', NULL, NULL, N'How to 📊 **financial structure: revenue vs base vs operational vs expense**?', N'📊, **financial, structure:, revenue, vs, base, operational, expense**, 02_tour_services_and_financial_logic', N'**📊 **Financial Structure: Revenue vs Base vs Operational vs Expense****

UNO ERP categorizes tour finances into 4 core buckets:

```mermaid
flowchart LR
    A["Total Tour Revenue (Base Tour Fees + Excursion Sales)"] --> B["Gross Income"]
    B --> C["Minus Base Services (Agency Fees, City Tax)"]
    C --> D["Minus Operational Expenses (Hotels, Transport, Guides)"]
    D --> E["Minus Guide Commission (Strictly 10% of Excursions)"]
    E --> F["Equals Net Tour Margin (€ / %)"]
```', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.798Z', N'2026-09-01T15:57:51.227Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (309, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'User Manual', NULL, NULL, N'How to 1. **revenue (`income`)**?', N'1., **revenue, (`income`)**, 02_tour_services_and_financial_logic', N'**1. **Revenue (`Income`)****

* **Base Tour Fee**: Fixed contract amount collected per passenger or per tour package.
* **Excursion Sales**: Gross cash collected from optional excursions sold to passengers (e.g. Dresden Tour, Mozart Concert, Danube Cruise).', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.799Z', N'2026-09-01T15:57:51.228Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (310, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'User Manual', NULL, NULL, N'How to 2. **base services (`included core contract services`)**?', N'2., **base, services, (`included, core, contract, services`)**, 02_tour_services_and_financial_logic', N'**2. **Base Services (`Included Core Contract Services`)****

* **Agency Fees**: Standard agency handling fees.
* **City Tax**: Municipal tourist taxes collected per person per night across cities.', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.799Z', N'2026-09-01T15:57:51.229Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (311, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'User Manual', NULL, NULL, N'How to 3. **operational expenses (`vendor costs`)**?', N'3., **operational, expenses, (`vendor, costs`)**, 02_tour_services_and_financial_logic', N'**3. **Operational Expenses (`Vendor Costs`)****

* **Hotel Accommodation**: Nightly costs charged by hotels across Prague, Vienna, and Budapest.
* **Transport / Bus Fees**: Daily rates charged by coach transport companies.
* **Guide Daily Fees**: Base daily wages paid to assigned tour guides.
* **Excursion Vendor Ticket Costs**: Admission/entrance ticket costs paid to attraction vendors.', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.800Z', N'2026-09-01T15:57:51.229Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (312, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'Master Data', NULL, NULL, N'How to 4. **guide commission (strict 10% rule)**?', N'4., **guide, commission, (strict, 10%, rule)**, 02_tour_services_and_financial_logic', N'**4. **Guide Commission (Strict 10% Rule)****

> [!IMPORTANT]
> **10% Calculation Rule**: Guide commission is **strictly calculated as 10% of total excursion sales**.
> $$\text{Guide Commission} = \text{Total Excursion Sales} \times 0.10$$
> If no excursions are sold (or total sales $= €0.00$), Guide Commission is strictly **€0.00**.

---', N'/master-data', N'Open Master Data', 1, N'2026-08-31T21:16:45.800Z', N'2026-09-01T15:57:51.229Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (313, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'Master Data', NULL, NULL, N'How to 🏨 **hotel pricing basis: `pax` vs `room` calculation**?', N'🏨, **hotel, pricing, basis:, `pax`, vs, `room`, calculation**, 02_tour_services_and_financial_logic', N'**🏨 **Hotel Pricing Basis: `Pax` vs `Room` Calculation****

Hotel costs in UNO ERP adapt dynamically depending on the master data setup for each hotel:

1. **`Pax Basis` (Per Person / Night)**:
   $$\text{Total Cost} = (\text{Pax Count} \times \text{Pax Rate}) \times \text{Nights}$$
2. **`Room Basis` (Per Room / Night)**:
   $$\text{Total Cost} = (\text{Single} \times \text{SingleRate} + \text{Double} \times \text{DoubleRate} + \text{Twin} \times \text{TwinRate} + \text{Triple} \times \text{TripleRate}) \times \text{Nights}$$

---', N'/master-data', N'Open Master Data', 1, N'2026-08-31T21:16:45.801Z', N'2026-09-01T15:57:51.230Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (314, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'User Manual', NULL, NULL, N'How to ⚖️ **net tour profitability formula**?', N'⚖️, **net, tour, profitability, formula**, 02_tour_services_and_financial_logic', N'**⚖️ **Net Tour Profitability Formula****

$$\text{Net Profit (€)} = \text{Total Revenue} - (\text{Base Services} + \text{Hotel Costs} + \text{Transport Costs} + \text{Guide Fees} + \text{Guide Commission} + \text{Excursion Vendor Tickets})$$', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.801Z', N'2026-09-01T15:57:51.230Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (315, N'DocumentationRepo', N'02_Creating_and_Updating_Projects.md', N'User Manual', NULL, NULL, N'How to 📁 projects - how to create, update & manage projects?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 📁 Projects - How to Create, Update & Manage Projects

This guide details how to create and update Projects in UNO ERP using both manual UI controls and automated Excel import workflows.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.906Z', N'2026-09-17T07:52:58.132Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (316, N'DocumentationRepo', N'02_Creating_and_Updating_Projects.md', N'User Manual', NULL, NULL, N'How to 🛠️ **method 1: creating a project manually via the web ui**?', N'🛠️, **method, 1:, creating, a, project, manually, via, the, web', N'**🛠️ **Method 1: Creating a Project Manually via the Web UI****

1. Navigate to **Projects** in the left navigation sidebar.
2. Click the **`+ Add Project`** button at the top right of the grid.
3. In the project creation modal, enter the required fields:
   * **Project Code**: Enter unique code (e.g. `PRJ-BVP2026`).
   * **Client Name**: Select or type the travel agency name (e.g. `Orta Avrupa BVP`).
   * **Start & End Dates**: Select contract period.
   * **Budget & Currency**: Enter contracted revenue amount (€).
4. Click **`Save Project`**. The new project will appear in the Projects grid and become available for tour assignments.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.907Z', N'2026-09-01T15:57:51.359Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (317, N'DocumentationRepo', N'02_Creating_and_Updating_Projects.md', N'User Manual', NULL, NULL, N'How to 📄 **method 2: automatic project creation via rooming list import**?', N'📄, **method, 2:, automatic, project, creation, via, rooming, list, import**', N'**📄 **Method 2: Automatic Project Creation via Rooming List Import****

When importing a Tour Rooming List Excel file (`Rooming_import_template.xlsx`):
* The system checks the **`Projects`** worksheet inside the file.
* If the `ProjectCode` specified in the Excel file does not yet exist in the database, UNO ERP **automatically creates the Project record** on the fly with `Status = Active`.
* All tours in the rooming list are automatically linked to this newly created Project.

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.907Z', N'2026-09-01T15:57:51.359Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (318, N'DocumentationRepo', N'02_Creating_and_Updating_Projects.md', N'User Manual', NULL, NULL, N'How to ✏️ **updating & editing projects**?', N'✏️, **updating, &, editing, projects**, 02_creating_and_updating_projects', N'**✏️ **Updating & Editing Projects****

* **Editing Details**: Click the **`Edit`** icon on any project row in the Projects grid to update client name, budget, or dates.
* **Viewing Linked Tours**: Click on a Project row to view all linked tour departures, total passenger counts, combined revenue, and cumulative margin.
* **Archiving Projects**: Projects with completed tours can be set to `Status = Archived` to clean up active views while preserving historical financial reports.', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.908Z', N'2026-09-01T15:57:51.359Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (319, N'DocumentationRepo', N'01_Tours_Creation_and_Rooming_List.md', N'Excel Import Guide', NULL, NULL, N'How to 🚌 tours - creation, status rules & rooming list import?', N'tours, creation, status, rules, rooming, list, import, 01_tours_creation_and_rooming_list, are, the, core, operational, units, uno, erp, each, tour, represents, specific, departure, date, and, itinerary, pvb05072026, departing', N'### 🚌 Tours - Creation, Status Rules & Rooming List Import

Tours are the core operational units in UNO ERP. Each Tour represents a specific departure date and itinerary (e.g. `PVB05072026` departing July 5, 2026 for Prague-Vienna-Budapest).

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-31T21:16:45.916Z', N'2026-09-17T07:52:58.138Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (320, N'DocumentationRepo', N'01_Tours_Creation_and_Rooming_List.md', N'User Manual', NULL, NULL, N'How to **1. manual creation via web ui**?', N'**1., manual, creation, via, web, ui**, 01_tours_creation_and_rooming_list', N'****1. Manual Creation via Web UI****

1. Navigate to **Tours** in the left sidebar.
2. Click **`+ Add Tour`**.
3. Fill in Tour Code, Destination, Start/End Dates, Flight Details, and assign to a Project.
4. Upon creation, the tour is automatically assigned `TourStatusId = 1` (**`Draft`** — the first status on the Kanban Dashboard).', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.916Z', N'2026-09-01T15:57:51.364Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (321, N'DocumentationRepo', N'01_Tours_Creation_and_Rooming_List.md', N'User Manual', NULL, NULL, N'How to **2. automated creation via rooming list import (`rooming_import_template.xlsx`)**?', N'**2., automated, creation, via, rooming, list, import, (`rooming_import_template.xlsx`)**, 01_tours_creation_and_rooming_list', N'****2. Automated Creation via Rooming List Import (`Rooming_import_template.xlsx`)****

1. Navigate to **Tours** or **Projects** $\rightarrow$ Click **`Import Rooming List`**.
2. Select `Rooming_import_template.xlsx` from `Shared Drive/UnoERP/ExcelImportFiles/`.
3. The system parses:
   * **Tours Sheet**: Creates the Tour record automatically with status set to **`Draft`**.
   * **Rooming Sheet**: Imports all passengers, booking codes (`BKG-01` to `BKG-15`), room numbers, and pax types (`Adult`, `Child`, `Infant`).

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.916Z', N'2026-09-01T15:57:51.365Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (322, N'DocumentationRepo', N'01_Tours_Creation_and_Rooming_List.md', N'User Manual', NULL, NULL, N'How to 👥 **passenger rooming list management & pax types**?', N'👥, **passenger, rooming, list, management, &, pax, types**, 01_tours_creation_and_rooming_list', N'**👥 **Passenger Rooming List Management & Pax Types****

* **Pax Type Definitions**:
  * **`Adult`**: Standard passenger paying full excursion and hotel rates.
  * **`Child (CHD)`**: Passengers under 18 years of age. Highlighted in **red text with a `(CHD)` badge** in rooming lists and excursion sales grids.
  * **`Infant`**: Infants requiring no separate bed or excursion seat.
* **Family Booking Groups**: Passengers sharing the same booking reference (e.g. `BKG-01`) are automatically grouped into shared hotel room numbers (Single, Double, Twin, Triple).

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.917Z', N'2026-09-01T15:57:51.365Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (323, N'DocumentationRepo', N'01_Tours_Creation_and_Rooming_List.md', N'Process Flow', NULL, NULL, N'How to 🚦 **initial tour status rules**?', N'🚦, **initial, tour, status, rules**, 01_tours_creation_and_rooming_list', N'**🚦 **Initial Tour Status Rules****

> [!IMPORTANT]
> **Draft Default Rule**: Every newly created or imported tour strictly starts in **`Draft` (`TourStatusId = 1`)**. It cannot jump directly to `Confirmed` or `Completed` without passing through mandatory **Status Checkpoints** (such as guide assignment and rooming verification).', N'/tours', N'Tour Status Kanban', 1, N'2026-08-31T21:16:45.917Z', N'2026-09-01T15:57:51.366Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (324, N'DocumentationRepo', N'03_Manual_Entry_vs_Excel_Import_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 🔄 tours - manual entry vs excel import guide?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔄 Tours - Manual Entry vs Excel Import Guide

UNO ERP provides two flexible ways to manage tour data: **Manual Web UI Entry** and **Automated Excel File Import**.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-08-31T21:16:45.930Z', N'2026-09-17T07:52:58.145Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (325, N'DocumentationRepo', N'03_Manual_Entry_vs_Excel_Import_Guide.md', N'User Manual', NULL, NULL, N'How to 🆚 **comparison: manual entry vs excel import**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**🆚 **Comparison: Manual Entry vs Excel Import****

| Operational Task | Manual Web UI Entry | Automated Excel Import |
| :--- | :--- | :--- |
| **Tour Creation** | Fill form in Tours grid $\rightarrow$ Click `Save Tour`. | Import `Rooming_import_template.xlsx` (Creates Tour + Passengers). |
| **Passenger Rooming** | Add passengers one by one in Bookings tab. | Upload `Rooming_import_template.xlsx` (Populates 30+ passengers in seconds). |
| **Excursion Sales** | Check passenger attendance boxes manually in Services tab. | Upload `Sales_import_template.xlsx` or pre-populated sale file. |
| **Hotel Rates** | Edit hotel service lines in Services tab. | Import `MasterData_Import_Template.xlsx` (Hotels sheet). |

---', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.930Z', N'2026-09-01T15:57:51.367Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (327, N'DocumentationRepo', N'03_Manual_Entry_vs_Excel_Import_Guide.md', N'User Manual', NULL, NULL, N'How to 📂 **standardized shared drive import files**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**📂 **Standardized Shared Drive Import Files****

Location: `Shared Drive/UnoERP/ExcelImportFiles/`
1. `MasterData_Import_Template.xlsx` (Master Data)
2. `Rooming_import_template.xlsx` (Rooming List)
3. `Sales_import_template.xlsx` (Excursion Sales)', N'/tours', N'View Tours Grid', 1, N'2026-08-31T21:16:45.932Z', N'2026-09-01T15:57:51.368Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (328, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 📊 comprehensive excel import master guide (projects, tours, rooming & sales)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 📊 Comprehensive Excel Import Master Guide (Projects, Tours, Rooming & Sales)

UNO ERP provides fully automated Excel imports for Projects, Tours, Passenger Rooming Lists, Master Data, and Excursion Sales.

---

#### 📁 1. Filename Naming Conventions
UNO ERP uses intelligent filename scanning to automatically detect the target project and tour:
• **New Project + New Tour**: `{ProjectName}_{TourCode}_rooming.xlsx`
  *Example*: `Project1_Tour1_rooming.xlsx` (or `Orta Avrupa BVP_BVP28082026_rooming.xlsx`)
• **Existing Tour Rooming Refresh**: `{TourCode}_rooming.xlsx`
  *Example*: `Tour1_rooming.xlsx` (or `BVP28082026_rooming.xlsx`)
• **Excursion Sales & Base Fees**: `{ProjectName}_{TourCode}_importSales.xlsx`
  *Example*: `Project1_Tour1_importSales.xlsx`
• **Master Data Suppliers**: `MasterData_Import_Template.xlsx`

---

#### 📋 2. Required Worksheets & Column Specifications
• **Sheet `Tours`**:
  - Col A: `Tour Code` (e.g. `Tour1`, `BVP28082026`) *[Required]*
  - Col B: `Project Code / Name` (e.g. `Project1`)
  - Col C: `Destination` (e.g. `Prague-Vienna-Budapest`)
  - Col D: `Arrival Date` (e.g. `28.08.2026`)
  - Col E: `End Date` (e.g. `04.09.2026`)
  - Cols F-I: `Adults`, `Children`, `Infants`, `Pax`
• **Sheet `Projects`**:
  - Col A: `Project Code / Name` (e.g. `Project1`)
  - Col B: `Client Name` (e.g. `UNO DMC`)
• **Sheet `Rooming`**:
  - Col A: `Passenger Full Name` (e.g. `John Doe`)
  - Col B: `Gender` (`M` / `F`)
  - Col C: `Pax Type` (`Adult`, `Children`, `Infant`)
  - Col D: `Booking Ref` (e.g. `BKG-01`)
  - Col E: `Room Number` (e.g. `101`)
  - Col F: `Room Type` (`Single`, `Double`, `Twin`, `Triple`)
• **Sheet `Hotels` (Master Data)**:
  - Hotel Name, Location, Star Rating, Room & Pax Rates, Pricing Basis (`Pax` vs `Room`).

---

#### 🚀 3. Step-by-Step Import Scenarios

**Scenario 1: NEW Tour for a NEW Project**
1. Filename: `Project1_Tour1_rooming.xlsx`.
2. Fill `Projects`, `Tours`, and `Rooming` sheets.
3. Go to **Tours** or **Projects** screen → Click **Import Rooming List** → Select file.
4. *Result*: Creates `Project1` (Active), creates `Tour1` (Draft status), and imports all passengers.

**Scenario 2: NEW Tour for an EXISTING Project**
1. Filename: `Project1_Tour1_rooming.xlsx` (or set `Tours` sheet Col B = `Project1`).
2. Click **Import Rooming List** → Select file.
3. *Result*: Matches existing `Project1`, creates `Tour1` in **Draft** status under `Project1`.

**Scenario 3: EXISTING Tour Rooming Refresh**
1. Filename: `Tour1_rooming.xlsx`.
2. Click **Import Rooming List** → Select file.
3. *Result*: Refreshes passenger rooming list and passenger counts while **preserving all existing hotel bookings, guide contracts, and transport services**.

**Scenario 4: Master Data Import (Hotels, Guides, Transport)**
1. Filename: `MasterData_Import_Template.xlsx`.
2. Go to **Master Data** screen → Click **Import Master Data** → Select file.
3. *Result*: Creates new supplier records or updates existing rates without duplicating records.

**Scenario 5: Excursion Sales Import**
1. Download template `{ProjectName}_{TourCode}_importSales.xlsx` from Tour Detail page.
2. Mark excursion checkboxes (☑) for participating passengers.
3. Click **Import Tour Sales & Base Services** → Select file.
4. *Result*: Creates optional excursion sales lines and calculates 10% guide commission.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T15:08:33.484Z', N'2026-09-18T08:06:40.610Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (329, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'User Manual', NULL, NULL, N'How to 🎯 **overview of excel import capabilities**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**🎯 **Overview of Excel Import Capabilities****

UNO ERP supports **5 distinct import scenarios** through its multi-tier resilient Excel parsing engine:

```mermaid
flowchart TD
    A["Excel Upload Request"] --> B{"Choose Target Import Hub"}
    B --> C["1. Master Data Catalog Import (Hotels, Guides, Transport, Excursions)"]
    B --> D["2. Tour & Rooming Import (Projects, Tours, Flights, Passenger Lists)"]
    B --> E["3. Tour Sales & Fees Import (Excursion Sales Checkboxes & Base Fees)"]
```

---', N'/tours', N'View Tours Grid', 1, N'2026-09-01T15:08:33.487Z', N'2026-09-01T15:57:51.242Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (330, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'User Manual', NULL, NULL, N'How to 📁 **scenario 1: importing a brand new project via excel**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**📁 **Scenario 1: Importing a Brand New Project via Excel****

When a commercial project does not yet exist in the database, UNO ERP can **create the Project record automatically on the fly** during Excel import.', N'/tours', N'View Tours Grid', 1, N'2026-09-01T15:08:33.489Z', N'2026-09-01T15:57:51.242Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (331, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'User Manual', NULL, NULL, N'How to **how to specify a new project**:?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'****How to Specify a New Project**:**

1. **Option A (Worksheet)**: Include a worksheet named **`Projects`** (or **`Project`**) with `ProjectCode` in cell A2 and `ClientName` in cell B2.
2. **Option B (Tour Sheet Column)**: In the **`Tours`** worksheet, set Column B (`Project`) to the new project name (e.g. `Orta Avrupa BVP`).
3. **Option C (Filename Prefix)**: Include the project name in the file name separated by an underscore (e.g. `Orta Avrupa BVP_BVP28082026_rooming.xlsx`).', N'/tours', N'View Tours Grid', 1, N'2026-09-01T15:08:33.490Z', N'2026-09-01T15:57:51.243Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (332, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'User Manual', NULL, NULL, N'How to **system action**:?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'****System Action**:**

* The system checks the database for an existing project with matching code or description.
* If no project is found, UNO ERP creates a new `Project` record on the fly:
  * `ProjectCode`: Extracted code/name.
  * `Description`: Full project name.
  * `ProjectStatusId`: `3` (**`Active`**).
  * `ClientId`: Default Client ID.

---', N'/tours', N'View Tours Grid', 1, N'2026-09-01T15:08:33.490Z', N'2026-09-01T15:57:51.243Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (333, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'User Manual', NULL, NULL, N'How to 🚌 **scenario 2: importing a brand new tour via excel**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**🚌 **Scenario 2: Importing a Brand New Tour via Excel****

Importing a new tour creates the Tour header record, sets flight details, and initializes status.', N'/tours', N'View Tours Grid', 1, N'2026-09-01T15:08:33.490Z', N'2026-09-01T15:57:51.243Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (334, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'User Manual', NULL, NULL, N'How to **worksheet specifications (`tours` / `tour` / `tourdata`)**:?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'****Worksheet Specifications (`Tours` / `Tour` / `TourData`)**:**

* **Accepted Sheet Names**: `Tours`, `Tour`, `tour`, `tours`, `TourData`.
* **Column Layout (Row 1 Headers / Row 2 Values)**:
  * **Col A (`Cell 1`)**: `Tour Code` (e.g. `BVP28082026`, `PVB05072026`). *[Required]*
  * **Col B (`Cell 2`)**: `Project Code / Name` (e.g. `Orta Avrupa BVP`).
  * **Col C (`Cell 3`)**: `Destination` (e.g. `Prague-Vienna-Budapest`).
  * **Col D (`Cell 4`)**: `Arrival Date` (e.g. `28.08.2026` or `2026-08-28`).
  * **Col E (`Cell 5`)**: `End Date` (e.g. `04.09.2026`).
  * **Col F-I (`Cells 6-9`)**: `Adults`, `Children`, `Infants`, `Pax`.', N'/tours', N'View Tours Grid', 1, N'2026-09-01T15:08:33.491Z', N'2026-09-01T15:57:51.244Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (336, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'User Manual', NULL, NULL, N'How to 🔗 **scenario 3: importing a tour for an existing project**?', N'🔗, **scenario, 3:, importing, a, tour, for, an, existing, project**', N'**🔗 **Scenario 3: Importing a Tour for an Existing Project****

To link a new or updated tour to a project that already exists in UNO ERP:', N'/tours', N'View Tours Grid', 1, N'2026-09-01T15:08:33.491Z', N'2026-09-01T15:57:51.245Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (337, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'User Manual', NULL, NULL, N'How to **matching logic**:?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'****Matching Logic**:**

* Set Column B (`Project`) in the `Tours` sheet OR the filename prefix to the existing project code (e.g. `PRJ-BVP` or `Orta Avrupa BVP`).
* UNO ERP matches by:
  1. Exact `ProjectCode` equality (case-insensitive).
  2. Exact `Description` equality.
  3. Substring text match (e.g. `"BVP"` matching `"Orta Avrupa BVP"`).
* The new tour is directly linked (`tour.ProjectId = project.Id`).

---', N'/tours', N'View Tours Grid', 1, N'2026-09-01T15:08:33.492Z', N'2026-09-01T15:57:51.245Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (338, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'User Manual', NULL, NULL, N'How to 👥 **scenario 4: importing rooming & booking data for an existing tour**?', N'👥, **scenario, 4:, importing, rooming, &, booking, data, for, an', N'**👥 **Scenario 4: Importing Rooming & Booking Data for an Existing Tour****

When a tour already exists in the database, uploading an updated rooming list refreshes passenger records, family booking codes, and room numbers **without erasing existing hotel or guide service lines**.', N'/tours', N'View Tours Grid', 1, N'2026-09-01T15:08:33.492Z', N'2026-09-01T15:57:51.245Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (339, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'User Manual', NULL, NULL, N'How to **worksheet specifications (`rooming` / `rooms` / `passengers`)**:?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'****Worksheet Specifications (`Rooming` / `Rooms` / `Passengers`)**:**

* **Accepted Sheet Names**: `Rooming`, `Rooms`, `rooming`, `rooms`, `Passengers`, `PassengerList`.
* **Key Columns**:
  * **`Passenger Name`**: Full legal name.
  * **`Gender`**: `M` / `F`.
  * **`Pax Type`**: `Adult`, `Child` (or `CHD`), `Infant`.
  * **`Booking Ref`**: Family booking code (e.g. `BKG-01`, `BKG-02`).
  * **`Room Number`**: Assigned room number (e.g. `101`, `102`).
  * **`Room Type`**: `Single`, `Double`, `Twin`, `Triple`.

---', N'/tours', N'View Tours Grid', 1, N'2026-09-01T15:08:33.492Z', N'2026-09-01T15:57:51.246Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (340, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'User Manual', NULL, NULL, N'How to 🎟️ **scenario 5: importing excursion sales & base fees (`sales_import_template.xlsx`)**?', N'🎟️, **scenario, 5:, importing, excursion, sales, &, base, fees, (`sales_import_template.xlsx`)**', N'**🎟️ **Scenario 5: Importing Excursion Sales & Base Fees (`Sales_import_template.xlsx`)****

Importing optional excursion sales checkmarks (`☑`) and base invoicing fees for passengers.', N'/tours', N'View Tours Grid', 1, N'2026-09-01T15:08:33.493Z', N'2026-09-01T15:57:51.246Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (342, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'User Manual', NULL, NULL, N'How to ⚙️ **the 4-tier resilient scanning engine architecture**?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'**⚙️ **The 4-Tier Resilient Scanning Engine Architecture****

If an uploaded Excel file does not follow standard template names, UNO ERP executes a **4-tier fail-safe scanning pipeline**:

1. **Tier 1 (Worksheet Name Match)**: Scans for sheets named `Tours`, `Tour`, `Projects`, `Project`, `Rooming`, `Rooms`.
2. **Tier 2 (Filename Parts Match)**: Splits filename by `_` or `-` (e.g. `Orta Avrupa BVP_BVP28082026_rooming.xlsx`) to extract `BVP28082026`.
3. **Tier 3 (Deep Cell Scan Across ALL Sheets)**: Scans rows 1-5 across **every worksheet** in the file for column headers `"Tour Code"`, `"Project"`, etc., reading the value from the row below.
4. **Tier 4 (Detailed Diagnostic Error)**: If Tour Code cannot be found, returns a detailed troubleshooting message listing all scanned worksheets and actionable file fix steps.', N'/tours', N'View Tours Grid', 1, N'2026-09-01T15:08:33.494Z', N'2026-09-01T15:57:51.247Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (343, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'Master Data', NULL, NULL, N'How to 🏬 1. hotels management?', N'hotels, management, 01_masterdata_setup_and_management, target, screen, sidebar, master, data, tab, fields, hotel, name, full, commercial, canada, olympik, city, location, destination, prague, vienna, budapest, star, rating, pri', N'### 🏬 1. Hotels Management

* **Target Screen**: Sidebar → **Master Data** → **Hotels** tab.
* **Fields**:
  * **Hotel Name**: Full commercial name (e.g. `Hotel Canada`, `Hotel Olympik`).
  * **City / Location**: Destination city (`Prague`, `Vienna`, `Budapest`).
  * **Star Rating**: 3-star, 4-star, or 5-star rating.
  * **Pricing Basis**: Select **`Pax`** (per person per night) or **`Room`** (per room per night).
  * **Rate Matrix**: Single Room/Pax Rate, Double Room/Pax Rate, Twin Room/Pax Rate, Triple Room/Pax Rate.
  * **Contact Details**: Contact person, email, and emergency telephone number.

---', N'/master-data', N'Open Master Data', 1, N'2026-09-01T16:01:43.377Z', N'2026-09-17T07:52:57.981Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (344, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'Master Data', NULL, NULL, N'How to 🚩 2. guides management?', N'guides, management, 01_masterdata_setup_and_management, target, screen, sidebar, master, data, tab, fields, guide, name, full, legal, languages, spoken, english, turkish, german, daily, fee, contracted, wage, rate, euros', N'### 🚩 2. Guides Management

* **Target Screen**: Sidebar → **Master Data** → **Guides** tab.
* **Fields**:
  * **Guide Name**: Full legal name.
  * **Languages Spoken**: Spoken languages (e.g. `English`, `Turkish`, `German`).
  * **Daily Fee (€)**: Contracted daily wage rate in Euros (€).
  * **Phone & Email**: Operational contact details for tour communications.

---', N'/master-data', N'Open Master Data', 1, N'2026-09-01T16:01:43.387Z', N'2026-09-17T07:52:57.982Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (345, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'User Manual', NULL, NULL, N'How to 🚌 3. transport & drivers management?', N'transport, drivers, management, 01_masterdata_setup_and_management, target, screen, sidebar, master, data, tab, fields, company, name, fleet, capacity, daily, bus, rates, driver, phone, number, assigned, rate', N'### 🚌 3. Transport & Drivers Management

* **Target Screen**: Sidebar → **Master Data** → **Transport / Drivers** tab.
* **Fields**:
  * **Transport Company**: Company name, fleet capacity, daily bus rates (€).
  * **Drivers**: Driver name, phone number, assigned transport company, daily rate (€).

---', N'/tours', N'View Tours Grid', 1, N'2026-09-01T16:01:43.388Z', N'2026-09-17T07:52:57.983Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (346, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'User Manual', NULL, NULL, N'How to 🎟️ 4. excursions management?', N'excursions, management, 01_masterdata_setup_and_management, target, screen, sidebar, master, data, tab, fields, excursion, title, official, dresden, tour, mozart, concert, city, location, vendor, ticket, cost, attraction, entry, fee', N'### 🎟️ 4. Excursions Management

* **Target Screen**: Sidebar → **Master Data** → **Excursions** tab.
* **Fields**:
  * **Excursion Title**: Official excursion title (e.g. `Dresden Tour`, `Mozart Concert`).
  * **City**: Location city.
  * **Vendor Ticket Cost (€)**: Attraction entry ticket fee paid per adult/child.
  * **Selling Price (€)**: Retail price charged per adult/child passenger.', N'/tours', N'View Tours Grid', 1, N'2026-09-01T16:01:43.389Z', N'2026-09-17T07:52:57.986Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (347, N'DocumentationRepo', N'01_Projects_Overview_and_Purpose.md', N'User Manual', NULL, NULL, N'How to 🎯 why projects are needed?', N'why, projects, are, needed, 01_projects_overview_and_purpose, commercial, contract, grouping, single, client, agency, may, book, different, departure, dates, for, the, prague, vienna, budapest, tour, season, creating, project', N'### 🎯 Why Projects Are Needed

1. **Commercial Contract Grouping**: A single client agency may book 10 different departure dates for the "Prague-Vienna-Budapest" tour in a single season. Creating a Project allows you to track total contract revenue, total operational costs, and overall profitability across all 10 departures under one roof.
2. **Master Data & Pricing Consistency**: Projects bind tour departures to specific client pricing agreements, vendor rate sheets, and payment terms.
3. **Executive Dashboard Analytics**: Project-level dashboards aggregate performance KPIs (Pax volume, Gross Sales, Net Margin %, Unpaid Invoices) across all linked tours.

---', N'/tours', N'View Tours Grid', 1, N'2026-09-01T16:01:43.414Z', N'2026-09-17T07:52:57.994Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (348, N'DocumentationRepo', N'01_Projects_Overview_and_Purpose.md', N'Excel Import Guide', NULL, NULL, N'How to 📋 most important project fields?', N'most, important, project, fields, 01_projects_overview_and_purpose, when, creating, viewing, uno, erp, the, following, key, are, required, field, name, description, importance, business, rule, projectcode, unique, commercial, code', N'### 📋 Most Important Project Fields

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

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.415Z', N'2026-09-17T07:52:57.995Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (349, N'DocumentationRepo', N'01_Projects_Overview_and_Purpose.md', N'Projects', N'Overview & Purpose', N'Why are Projects needed in UNO ERP and what are the most important fields?
What is a Project in UNO ERP?
How are Projects related to Tours?
What are the core fields for a Project?', N'How to 🔗 relationship to tours & metadata?', N'relationship, tours, metadata, projects, overview, commercial, umbrella, contracts, core, fields, project, code, contract, client, name, budget, 01_projects_overview_and_purpose, rightarrow, one, contains, many, tour, cannot, exist, without, being, assigned, status, flows, checkpoints', N'### 🔗 Relationship to Tours & Metadata

* **Projects $\rightarrow$ Tours**: One Project contains many Tours (`1 : N` relationship). A Tour cannot exist without being assigned to a Project.
* **Projects $\rightarrow$ Metadata**: Project status flows, status checkpoints, and role access permissions are governed by central **Metadata Configuration & Status Checkpoints**.', N'/projects', N'Open Projects Overview', 1, N'2026-09-01T16:01:43.416Z', N'2026-10-25T18:37:52.147Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (350, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'Process Flow', NULL, NULL, N'How to 🔁 1. tour statuses & lifecycle order?', N'tour, statuses, lifecycle, order, 02_statuses_permissions_and_checkpoints, tours, transition, sequentially, across, ordered, status, stages, index, name, system, behavior, business, rule, draft, initial, upon, creation, import, editable, rooming', N'### 🔁 1. Tour Statuses & Lifecycle Order

Tours transition sequentially across 5 ordered status stages:

| Order Index | Status Name | System Behavior & Business Rule |
| :---: | :--- | :--- |
| **1** | **`Draft`** | Initial status upon creation/import. Editable rooming and service lines. |
| **2** | **`Confirmed`** | Requires Guide + Bus assignment and verified rooming list. |
| **3** | **`In Progress`** | Tour is currently departing/active on location. |
| **4** | **`Completed`** | Passengers returned; excursion sales and guide commissions finalized. |
| **5** | **`Accounting Closed`** | Invoices issued, operator remittance verified. Locks financial edits. |

---', N'/tours', N'Tour Status Kanban', 1, N'2026-09-01T16:01:43.426Z', N'2026-09-17T07:52:58.004Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (351, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'Process Flow', NULL, NULL, N'How to ✅ 2. mandatory status checkpoints?', N'mandatory, status, checkpoints, 02_statuses_permissions_and_checkpoints, before, tour, can, advance, the, next, kanban, dashboard, all, for, current, must, pass, draft, confirmed, guide, assigned, guideid, null, transport, buscompanyid', N'### ✅ 2. Mandatory Status Checkpoints

Before a tour can advance to the next status on the Kanban Dashboard, all **Checkpoints** for the current status must pass:
* **Draft → Confirmed**: Guide assigned (`GuideId != null`), Transport assigned (`BusCompanyId != null`), Passenger count $> 0$.
* **In Progress → Completed**: Excursion sales check boxes recorded, Guide commission calculated.
* **Completed → Accounting Closed**: Invoice generated, cash remittance verified.

---', N'/tours', N'Tour Status Kanban', 1, N'2026-09-01T16:01:43.426Z', N'2026-09-17T07:52:58.004Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (352, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'User Manual', NULL, NULL, N'How to 🔒 3. role access permissions?', N'role, access, permissions, 02_statuses_permissions_and_checkpoints, administrator, full, read, write, update, delete, status, override, and, user, management, privileges, touradmin, manager, can, create, tours, import, rooming, sales, files', N'### 🔒 3. Role Access Permissions

* **`Administrator`**: Full read, write, update, delete, status override, and user management privileges.
* **`TourAdmin / Manager`**: Can create tours, import rooming/sales files, edit tour services, and advance tour statuses.
* **`Read-Only User / Guide`**: Can view tour itineraries, rooming lists, and mark excursion attendance.

---', N'/tours', N'View Tours Grid', 1, N'2026-09-01T16:01:43.427Z', N'2026-09-17T07:52:58.006Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (353, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'User Manual', NULL, NULL, N'How to 🏷️ 4. tax rates & agency discounts?', N'tax, rates, agency, discounts, 02_statuses_permissions_and_checkpoints, settings, configurable, vat, city, percentage, applied, during, invoice, generation, special, discount, percentages, gross, base, tour, fees, for, partner, operators', N'### 🏷️ 4. Tax Rates & Agency Discounts

* **Tax Settings**: Configurable VAT / City Tax percentage rates applied during invoice generation.
* **Agency Discounts**: Special agency discount percentages applied to gross base tour fees for partner operators.', N'/tours', N'View Tours Grid', 1, N'2026-09-01T16:01:43.428Z', N'2026-09-17T07:52:58.007Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (354, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'User Manual', NULL, NULL, N'How to 📊 financial structure: revenue vs base vs operational vs expense?', N'financial, structure, revenue, base, operational, expense, 02_tour_services_and_financial_logic, uno, erp, categorizes, tour, finances, into, core, buckets, mermaid, flowchart, total, fees, excursion, sales, gross, income, minus, services', N'### 📊 Financial Structure: Revenue vs Base vs Operational vs Expense

UNO ERP categorizes tour finances into 4 core buckets:

```mermaid
flowchart LR
    A["Total Tour Revenue (Base Tour Fees + Excursion Sales)"] --> B["Gross Income"]
    B --> C["Minus Base Services (Agency Fees, City Tax)"]
    C --> D["Minus Operational Expenses (Hotels, Transport, Guides)"]
    D --> E["Minus Guide Commission (Strictly 10% of Excursions)"]
    E --> F["Equals Net Tour Margin (€ / %)"]
```', N'/tours', N'View Tours Grid', 1, N'2026-09-01T16:01:43.433Z', N'2026-09-17T07:52:58.012Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (355, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'User Manual', NULL, NULL, N'How to 1. revenue (`income`)?', N'revenue, income, 02_tour_services_and_financial_logic, base, tour, fee, fixed, contract, amount, collected, per, passenger, package, excursion, sales, gross, cash, from, optional, excursions, sold, passengers, dresden, mozart, concert', N'### 1. Revenue (`Income`)

* **Base Tour Fee**: Fixed contract amount collected per passenger or per tour package.
* **Excursion Sales**: Gross cash collected from optional excursions sold to passengers (e.g. Dresden Tour, Mozart Concert, Danube Cruise).', N'/tours', N'View Tours Grid', 1, N'2026-09-01T16:01:43.433Z', N'2026-09-17T07:52:58.013Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (356, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'User Manual', NULL, NULL, N'How to 2. base services (`included core contract services`)?', N'base, services, included, core, contract, 02_tour_services_and_financial_logic, agency, fees, standard, handling, city, tax, municipal, tourist, taxes, collected, per, person, night, across, cities', N'### 2. Base Services (`Included Core Contract Services`)

* **Agency Fees**: Standard agency handling fees.
* **City Tax**: Municipal tourist taxes collected per person per night across cities.', N'/tours', N'View Tours Grid', 1, N'2026-09-01T16:01:43.434Z', N'2026-09-17T07:52:58.014Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (357, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'User Manual', NULL, NULL, N'How to 3. operational expenses (`vendor costs`)?', N'operational, expenses, vendor, costs, 02_tour_services_and_financial_logic, hotel, accommodation, nightly, charged, hotels, across, prague, vienna, and, budapest, transport, bus, fees, daily, rates, coach, companies, guide, base, wages', N'### 3. Operational Expenses (`Vendor Costs`)

* **Hotel Accommodation**: Nightly costs charged by hotels across Prague, Vienna, and Budapest.
* **Transport / Bus Fees**: Daily rates charged by coach transport companies.
* **Guide Daily Fees**: Base daily wages paid to assigned tour guides.
* **Excursion Vendor Ticket Costs**: Admission/entrance ticket costs paid to attraction vendors.', N'/tours', N'View Tours Grid', 1, N'2026-09-01T16:01:43.434Z', N'2026-09-17T07:52:58.014Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (358, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'Tours', N'Financial Logic', N'Explain revenue vs base vs operational expenses vs net tour margin calculations.
How to assign guides and calculate the strict 10% guide commission on excursion sales?
How is guide commission calculated?
Why is guide commission €0.00?
How to set up hotel pricing basis (Pax vs Room) and calculate nightly rates?
How is hotel cost calculated or why hotel calculation is wrong?', N'How to 4. guide commission (strict 10% rule)?', N'guide, commission, strict, rule, tour, services, costing, net, profit, margin, logic, financial, revenue, base, fee, excursion, sales, hotel, pricing, pax, basis, room, city, tax, formula, 02_tour_services_and_financial_logic, important, calculation, strictly, calculated', N'### 4. Guide Commission (Strict 10% Rule)

> [!IMPORTANT]
> **Strict 10% Calculation Rule**: Guide commission is **strictly calculated as 10% of total excursion sales**.
> $$\text{Guide Commission} = \text{Total Excursion Sales} \times 0.10$$
> If no excursions are sold (or total sales $= €0.00$), Guide Commission is strictly **€0.00**.

---', N'/tours', N'View Tour Costing & Services', 1, N'2026-09-01T16:01:43.435Z', N'2026-10-25T18:37:52.058Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (359, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'Tours', N'Financial Logic', N'Explain revenue vs base vs operational expenses vs net tour margin calculations.
How to assign guides and calculate the strict 10% guide commission on excursion sales?
How is guide commission calculated?
Why is guide commission €0.00?
How to set up hotel pricing basis (Pax vs Room) and calculate nightly rates?
How is hotel cost calculated or why hotel calculation is wrong?', N'How to 🏨 hotel pricing basis: `pax` vs `room` calculation?', N'hotel, pricing, basis, pax, room, calculation, tour, services, costing, guide, commission, net, profit, margin, logic, financial, revenue, base, fee, excursion, sales, rule, city, tax, formula, 02_tour_services_and_financial_logic, accommodation, expenses, adapt, dynamically', N'### 🏨 Hotel Pricing Basis: `Pax` vs `Room` Calculation

Hotel accommodation expenses adapt dynamically based on the pricing basis configured in Master Data or customized on the Tour Service line:', N'/tours', N'View Tour Costing & Services', 1, N'2026-09-01T16:01:43.435Z', N'2026-10-25T18:37:52.058Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (360, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'Tours', N'Financial Logic', N'Explain revenue vs base vs operational expenses vs net tour margin calculations.
How to assign guides and calculate the strict 10% guide commission on excursion sales?
How is guide commission calculated?
Why is guide commission €0.00?
How to set up hotel pricing basis (Pax vs Room) and calculate nightly rates?
How is hotel cost calculated or why hotel calculation is wrong?', N'How to ⚖️ net tour profitability formula?', N'net, tour, profitability, formula, services, costing, guide, commission, profit, margin, logic, financial, revenue, base, fee, excursion, sales, rule, hotel, pricing, pax, basis, room, city, tax, 02_tour_services_and_financial_logic, text, total, left, costs', N'### ⚖️ Net Tour Profitability Formula

$$\text{Net Profit (€)} = \text{Total Revenue} - \left(\text{Base Services} + \text{Hotel Costs} + \text{Transport Costs} + \text{Guide Fees} + \text{Guide Commission} + \text{Excursion Vendor Tickets}\right)$$

$$\text{Net Margin (\%)} = \left(\frac{\text{Net Profit (€)}}{\text{Total Revenue (€)}}\right) \times 100$$

---', N'/tours', N'View Tour Costing & Services', 1, N'2026-09-01T16:01:43.436Z', N'2026-10-25T18:37:52.061Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (361, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 🎯 overview of excel import capabilities?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🎯 Overview of Excel Import Capabilities

UNO ERP supports **5 distinct import scenarios** through its multi-tier resilient Excel parsing engine:

```mermaid
flowchart TD
    A["Excel Upload Request"] --> B{"Choose Target Import Hub"}
    B --> C["1. Master Data Catalog Import (Hotels, Guides, Transport, Excursions)"]
    B --> D["2. Tour & Rooming Import (Projects, Tours, Flights, Passenger Lists)"]
    B --> E["3. Tour Sales & Fees Import (Excursion Sales Checkboxes & Base Fees)"]
```

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.447Z', N'2026-09-01T16:01:43.447Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (362, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 📁 scenario 1: importing a brand new project via excel?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 📁 Scenario 1: Importing a Brand New Project via Excel

When a commercial project does not yet exist in the database, UNO ERP can **create the Project record automatically on the fly** during Excel import.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.448Z', N'2026-09-01T16:01:43.448Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (363, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to how to specify a new project:?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### How to Specify a New Project:

1. **Option A (Worksheet)**: Include a worksheet named **`Projects`** (or **`Project`**) with `ProjectCode` in cell A2 and `ClientName` in cell B2.
2. **Option B (Tour Sheet Column)**: In the **`Tours`** worksheet, set Column B (`Project`) to the new project name (e.g. `Orta Avrupa BVP`).
3. **Option C (Filename Prefix)**: Include the project name in the file name separated by an underscore (e.g. `Orta Avrupa BVP_BVP28082026_rooming.xlsx`).', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.448Z', N'2026-09-01T16:01:43.448Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (364, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to system action:?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### System Action:

* The system checks the database for an existing project with matching code or description.
* If no project is found, UNO ERP creates a new `Project` record on the fly:
  * `ProjectCode`: Extracted code/name.
  * `Description`: Full project name.
  * `ProjectStatusId`: `3` (**`Active`**).
  * `ClientId`: Default Client ID.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.449Z', N'2026-09-01T16:01:43.449Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (365, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 🚌 scenario 2: importing a brand new tour via excel?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🚌 Scenario 2: Importing a Brand New Tour via Excel

Importing a new tour creates the Tour header record, sets flight details, and initializes status.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.449Z', N'2026-09-01T16:01:43.449Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (366, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to worksheet specifications (`tours` / `tour` / `tourdata`):?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Worksheet Specifications (`Tours` / `Tour` / `TourData`):

* **Accepted Sheet Names**: `Tours`, `Tour`, `tour`, `tours`, `TourData`.
* **Column Layout (Row 1 Headers / Row 2 Values)**:
  * **Col A (`Cell 1`)**: `Tour Code` (e.g. `BVP28082026`, `PVB05072026`). *[Required]*
  * **Col B (`Cell 2`)**: `Project Code / Name` (e.g. `Orta Avrupa BVP`).
  * **Col C (`Cell 3`)**: `Destination` (e.g. `Prague-Vienna-Budapest`).
  * **Col D (`Cell 4`)**: `Arrival Date` (e.g. `28.08.2026` or `2026-08-28`).
  * **Col E (`Cell 5`)**: `End Date` (e.g. `04.09.2026`).
  * **Col F-I (`Cells 6-9`)**: `Adults`, `Children`, `Infants`, `Pax`.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.450Z', N'2026-09-01T16:01:43.450Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (367, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to initial tour rules:?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Initial Tour Rules:

> [!IMPORTANT]
> **Initial Tour Status**: Newly created tours are automatically initialized to `TourStatusId = 1` (**`Draft`**) on the Kanban Dashboard.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.450Z', N'2026-09-01T16:01:43.450Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (368, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 🔗 scenario 3: importing a tour for an existing project?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔗 Scenario 3: Importing a Tour for an Existing Project

To link a new or updated tour to a project that already exists in UNO ERP:', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.451Z', N'2026-09-01T16:01:43.451Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (369, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to matching logic:?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Matching Logic:

* Set Column B (`Project`) in the `Tours` sheet OR the filename prefix to the existing project code (e.g. `PRJ-BVP` or `Orta Avrupa BVP`).
* UNO ERP matches by:
  1. Exact `ProjectCode` equality (case-insensitive).
  2. Exact `Description` equality.
  3. Substring text match (e.g. `"BVP"` matching `"Orta Avrupa BVP"`).
* The new tour is directly linked (`tour.ProjectId = project.Id`).

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.452Z', N'2026-09-01T16:01:43.452Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (370, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 👥 scenario 4: importing rooming & booking data for an existing tour?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 👥 Scenario 4: Importing Rooming & Booking Data for an Existing Tour

When a tour already exists in the database, uploading an updated rooming list refreshes passenger records, family booking codes, and room numbers **without erasing existing hotel or guide service lines**.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.452Z', N'2026-09-01T16:01:43.452Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (371, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to worksheet specifications (`rooming` / `rooms` / `passengers`):?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Worksheet Specifications (`Rooming` / `Rooms` / `Passengers`):

* **Accepted Sheet Names**: `Rooming`, `Rooms`, `rooming`, `rooms`, `Passengers`, `PassengerList`.
* **Key Columns**:
  * **`Passenger Name`**: Full legal name.
  * **`Gender`**: `M` / `F`.
  * **`Pax Type`**: `Adult`, `Child` (or `CHD`), `Infant`.
  * **`Booking Ref`**: Family booking code (e.g. `BKG-01`, `BKG-02`).
  * **`Room Number`**: Assigned room number (e.g. `101`, `102`).
  * **`Room Type`**: `Single`, `Double`, `Twin`, `Triple`.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.453Z', N'2026-09-01T16:01:43.453Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (372, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 🎟️ scenario 5: importing excursion sales & base fees (`sales_import_template.xlsx`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🎟️ Scenario 5: Importing Excursion Sales & Base Fees (`Sales_import_template.xlsx`)

Importing optional excursion sales checkmarks (`☑`) and base invoicing fees for passengers.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.453Z', N'2026-09-01T16:01:43.453Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (373, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to prerequisite rule:?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Prerequisite Rule:

> [!IMPORTANT]
> **Passenger Prerequisite**: Passenger rooming lists **must be uploaded first** so passenger IDs exist in the database before uploading excursion sales.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.454Z', N'2026-09-01T16:01:43.454Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (374, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to ⚙️ the 4-tier resilient scanning engine architecture?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### ⚙️ The 4-Tier Resilient Scanning Engine Architecture

If an uploaded Excel file does not follow standard template names, UNO ERP executes a **4-tier fail-safe scanning pipeline**:

1. **Tier 1 (Worksheet Name Match)**: Scans for sheets named `Tours`, `Tour`, `Projects`, `Project`, `Rooming`, `Rooms`.
2. **Tier 2 (Filename Parts Match)**: Splits filename by `_` or `-` (e.g. `Orta Avrupa BVP_BVP28082026_rooming.xlsx`) to extract `BVP28082026`.
3. **Tier 3 (Deep Cell Scan Across ALL Sheets)**: Scans rows 1-5 across **every worksheet** in the file for column headers `"Tour Code"`, `"Project"`, etc., reading the value from the row below.
4. **Tier 4 (Detailed Diagnostic Error)**: If Tour Code cannot be found, returns a detailed troubleshooting message listing all scanned worksheets and actionable file fix steps.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.454Z', N'2026-09-01T16:01:43.454Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (375, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Excel Import Guide', NULL, NULL, N'How to 🎯 overview of the 3 official import files?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🎯 Overview of the 3 Official Import Files

To ensure 100% data integrity without missing foreign key references, UNO ERP uses **exactly 3 official template files** located on the shared drive:

📂 **Shared Drive Location**: `Shared Drive/UnoERP/ExcelImportFiles/`

1. **`MasterData_Import_Template.xlsx`** → *Master Data (Hotels, Guides, Transport, Drivers, Excursions)*
2. **`Rooming_import_template.xlsx`** → *Tour & Passenger Rooming List*
3. **`Sales_import_template.xlsx`** → *Excursion Sales & Base Services Report*

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.478Z', N'2026-09-01T16:13:49.136Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (376, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Excel Import Guide', NULL, NULL, N'How to 🔄 mandatory step-by-step import workflow?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔄 Mandatory Step-by-Step Import Workflow

```mermaid
flowchart TD
    A["Step 1: Master Data Import (MasterData_Import_Template.xlsx)"] --> B["Step 2: Tour & Rooming List Import (Rooming_import_template.xlsx)"]
    B --> C{"Passengers Uploaded? (allPassengers.length > 0)"}
    C -- Yes --> D["Step 3: Green Download Sale File Button Appears"]
    C -- No --> E["Button Hidden / Unavailable until Rooming List Uploaded"]
    D --> F["Step 4: Excursion Sales Import (Sales_import_template.xlsx)"]
```

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.478Z', N'2026-09-01T16:13:49.136Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (377, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Excel Import Guide', NULL, NULL, N'How to 1️⃣ how to import master data excel file (step 1 - always first)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 1️⃣ How to Import Master Data Excel File (STEP 1 - ALWAYS FIRST)

> [!IMPORTANT]
> **Why First?** Tours, hotels, excursion calculations, transport, and guide assignments rely on pre-existing Master Data. If you try to import a rooming file before importing hotels, the system will not be able to match hotel names or pricing rates.

* **File Name**: `MasterData_Import_Template.xlsx`
* **File Location**: `Shared Drive/UnoERP/ExcelImportFiles/MasterData_Import_Template.xlsx`
* **Target Screen**: Navigation Sidebar → **Master Data** → Click **Import Master Data** button.
* **What it Imports**:
  * **Hotels Sheet**: Hotel Name, Location, Star Rating, **Pricing Basis (`Pax` vs `Room`)**, Single Room & Pax Rates, Double Room & Pax Rates, Twin Room & Pax Rates, Triple Room & Pax Rates, Contact Person, Email, and Phone.
  * **Guides Sheet**: Guide Names, Languages spoken, Daily Rates, Phone Numbers.
  * **Transport Sheet**: Bus/Transport Companies, Daily Rates, Fleet Size, Contact Details.
  * **Drivers Sheet**: Driver Names, Assigned Transport Companies, Phone Numbers, Daily Rates.
  * **Excursions Sheet**: Excursion Names, Cities, Vendor Names, Adult/Child Costs, and Selling Prices.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.479Z', N'2026-09-01T16:13:49.137Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (378, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Excel Import Guide', NULL, NULL, N'How to 2️⃣ how to import tour & rooming list excel file (step 2)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 2️⃣ How to Import Tour & Rooming List Excel File (STEP 2)

> [!NOTE]
> Once Master Data is loaded, you import the tour contract, project, and passenger rooming list.

* **File Name**: `Rooming_import_template.xlsx`
* **File Location**: `Shared Drive/UnoERP/ExcelImportFiles/Rooming_import_template.xlsx`
* **Target Screen**: Navigation Sidebar → **Tours** (or **Projects**) → Click **Import Rooming List**.
* **What it Creates & Imports**:
  * **Projects Sheet**: Creates/resolves the Project (e.g. `PRJ-BVP1` / `Tests 20260829`).
  * **Tours Sheet**: Creates the Tour (`BVP05072026`) and automatically sets its initial status to **`Draft` (`TourStatusId = 1` / First Status on Dashboard)**.
  * **Rooming Sheet**: Imports all 30 Passengers, groups family bookings (`BKG-01` to `BKG-15`), assigns `Room Numbers`, maps `Pax Type` (`Adult`, `Children`, `Infant`), and attaches child badges.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.479Z', N'2026-09-01T16:13:49.137Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (379, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Excel Import Guide', NULL, NULL, N'How to 3️⃣ how to download pre-populated sales template?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 3️⃣ How to Download Pre-populated Sales Template

> [!IMPORTANT]
> **Green Button Availability**: The green **`Download Sale File`** button will **ONLY** appear once the passenger rooming list has been uploaded and passengers exist for the tour (`allPassengers.length > 0`). If no rooming list has been uploaded yet, the download button is hidden.

* **How to Download**:
  1. Open the Tour Details page.
  2. Click the **Bookings** tab.
  3. Click the green **`Download Sale File`** button next to the search input.
* **Output File**: Generates `{ProjectCode}_{TourCode}_importSales.xlsx` (e.g. `PRJ-BVP1_PVB05072026_importSales.xlsx`).
* **Detailed Passenger Pre-population**:
  * Automatically populates **all passengers in full detail** row by row.
  * Children under 18 are highlighted in **red font with a `(CHD)` badge**.
  * Renders interactive drop-down checkboxes (`☐` / `☑`) for every excursion across all passengers.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.480Z', N'2026-09-01T16:13:49.137Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (380, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Excel Import Guide', NULL, NULL, N'How to 4️⃣ how to import sales excel file (excursion sales & base services)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 4️⃣ How to Import Sales Excel File (Excursion Sales & Base Services)

> [!NOTE]
> Follow these exact steps to import excursion sales and base services from an Excel file into UNO ERP.

* **File Name**: `Sales_import_template.xlsx` (or the downloaded sale file).
* **File Location**: `Shared Drive/UnoERP/ExcelImportFiles/Sales_import_template.xlsx`
* **Target Screen**: Tour Details page → **Services** tab → Click **Import Excursion Sales**.
* **Step-by-Step Instructions**:
  1. Open the Tour Details page for your specific tour.
  2. Navigate to the **Services** tab.
  3. Click the **`Import Excursion Sales`** button.
  4. Select `Sales_import_template.xlsx` from `Shared Drive/UnoERP/ExcelImportFiles/`.
  5. The system parses all checked checkboxes (`☑`), calculates total passenger attendance per excursion, creates Revenue and Expense lines for the tour, calculates Guide Commission (strictly 10% of excursion sales), and updates Base Services (Agency Fee, CityTax).

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.480Z', N'2026-09-01T16:13:49.137Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (381, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Excel Import Guide', NULL, NULL, N'How to 🤖 ai assistant query quick reference?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🤖 AI Assistant Query Quick Reference

When users ask the AI Assistant about Excel imports, the assistant references the following rules:

| User Question | AI Assistant Answer |
| :--- | :--- |
| **"How can I import sales excel file?"** | Open Tour Details → **Services** tab → Click **Import Excursion Sales** and select `Sales_import_template.xlsx` from `Shared Drive/UnoERP/ExcelImportFiles/`. Note: The rooming list must be uploaded first so passengers exist. |
| **"Which Excel file do I import first?"** | You MUST import **`MasterData_Import_Template.xlsx` FIRST** from `Shared Drive/UnoERP/ExcelImportFiles/` under the Master Data menu to establish hotels, rates, guides, and excursions before importing tours. |
| **"Where are the official import template files located?"** | All 3 official template files are stored on the shared drive: `Shared Drive/UnoERP/ExcelImportFiles/`. |
| **"What file do I use for Rooming lists?"** | Use **`Rooming_import_template.xlsx`** from `Shared Drive/UnoERP/ExcelImportFiles/`. It creates the project, sets the tour status to **Draft**, and imports passengers with room numbers. |
| **"Why is the green Download Sale File button not showing?"** | The green **`Download Sale File` button ONLY appears after the Rooming List has been uploaded**. If no passengers exist for the tour, the button remains hidden until passenger data is imported. |

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.481Z', N'2026-09-01T16:13:49.138Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (382, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Excel Import Guide', NULL, NULL, N'How to 📁 shared drive storage location?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 📁 Shared Drive Storage Location

All official import templates are preserved in:
* **Shared Drive Directory**: `Shared Drive/UnoERP/ExcelImportFiles/`', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.481Z', N'2026-09-01T16:13:49.138Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (383, N'DocumentationRepo', N'02_Creating_and_Updating_Projects.md', N'Projects', N'Creating Projects', N'How to create a project manually or via Rooming List import?
How do I create a new project?
Can projects be automatically created from an Excel file?
How to edit or update an existing project?', N'How to 🛠️ method 1: creating a project manually via the web ui?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Method 1: Creating a Project Manually via the Web UI

1. Navigate to **[Projects](/projects)** in the left navigation sidebar.
2. Click the purple **`+ Add Project`** button at the top right of the grid.
3. In the creation modal, enter:
   * **Project Code**: Enter a unique alphanumeric code (e.g. `PRJ-BVP2026`).
   * **Client Name**: Select or type the client travel agency name (e.g. `Orta Avrupa BVP`).
   * **Start & End Dates**: Select contract validity period.
   * **Budget & Currency**: Enter contracted gross amount in Euros (€).
4. Click **`Save Project`**. The new project immediately appears in the grid and is ready for tour linking.', N'/projects', N'Open Projects Management', 1, N'2026-09-01T16:01:43.576Z', N'2026-10-25T18:37:52.154Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (384, N'DocumentationRepo', N'02_Creating_and_Updating_Projects.md', N'Projects', N'Creating Projects', N'How to create a project manually or via Rooming List import?
How do I create a new project?
Can projects be automatically created from an Excel file?
How to edit or update an existing project?', N'How to 📄 method 2: automatic project creation via rooming list import?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Method 2: Automatic Project Creation via Rooming List Import

1. Download template or format your file as `{ProjectName}_{TourCode}_rooming.xlsx` (e.g. `Project1_Tour1_rooming.xlsx`).
2. In the `Projects` worksheet, set Col A = `Project1` and Col B = `Client Name`.
3. In UNO ERP, navigate to **Tours** or **Projects** $\rightarrow$ Click **Import Rooming List**.
4. Upload the file. If `Project1` does not exist in the database, UNO ERP **automatically creates it with `Active` status** and immediately links the new tour under it.

---', N'/projects', N'Open Projects Management', 1, N'2026-09-01T16:01:43.577Z', N'2026-10-25T18:37:52.154Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (385, N'DocumentationRepo', N'02_Creating_and_Updating_Projects.md', N'User Manual', NULL, NULL, N'How to ✏️ updating & editing projects?', N'updating, editing, projects, 02_creating_and_updating_projects, details, click, the, edit, icon, any, project, row, grid, update, client, name, budget, dates, viewing, linked, tours, view, all, tour, departures', N'### ✏️ Updating & Editing Projects

* **Editing Details**: Click the **`Edit`** icon on any project row in the Projects grid to update client name, budget, or dates.
* **Viewing Linked Tours**: Click on a Project row to view all linked tour departures, total passenger counts, combined revenue, and cumulative margin.
* **Archiving Projects**: Projects with completed tours can be set to `Status = Archived` to clean up active views while preserving historical financial reports.', N'/tours', N'View Tours Grid', 1, N'2026-09-01T16:01:43.577Z', N'2026-09-17T07:52:58.134Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (386, N'DocumentationRepo', N'01_Tours_Creation_and_Rooming_List.md', N'User Manual', NULL, NULL, N'How to 1. manual creation via web ui?', N'manual, creation, via, web, 01_tours_creation_and_rooming_list, navigate, tours, the, left, sidebar, click, add, tour, fill, code, destination, start, end, dates, flight, details, and, assign, project, upon', N'### 1. Manual Creation via Web UI

1. Navigate to **Tours** in the left sidebar.
2. Click **`+ Add Tour`**.
3. Fill in Tour Code, Destination, Start/End Dates, Flight Details, and assign to a Project.
4. Upon creation, the tour is automatically assigned `TourStatusId = 1` (**`Draft`** — the first status on the Kanban Dashboard).', N'/tours', N'View Tours Grid', 1, N'2026-09-01T16:01:43.581Z', N'2026-09-17T07:52:58.139Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (387, N'DocumentationRepo', N'01_Tours_Creation_and_Rooming_List.md', N'Excel Import Guide', NULL, NULL, N'How to 2. automated creation via rooming list import (`rooming_import_template.xlsx`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 2. Automated Creation via Rooming List Import (`Rooming_import_template.xlsx`)

1. Navigate to **Tours** or **Projects** $\rightarrow$ Click **`Import Rooming List`**.
2. Select `Rooming_import_template.xlsx` from `Shared Drive/UnoERP/ExcelImportFiles/`.
3. The system parses:
   * **Tours Sheet**: Creates the Tour record automatically with status set to **`Draft`**.
   * **Rooming Sheet**: Imports all passengers, booking codes (`BKG-01` to `BKG-15`), room numbers, and pax types (`Adult`, `Child`, `Infant`).

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.582Z', N'2026-09-17T07:52:58.139Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (388, N'DocumentationRepo', N'01_Tours_Creation_and_Rooming_List.md', N'Tours', N'Rooming List', N'How to import passenger rooming lists, booking codes and pax types?
How to create a new tour manually?
How does rooming list import work?
What are the rules for Adult, Child, and Infant pax types?
How are family booking groups assigned to rooms?', N'How to 👥 passenger rooming list management & pax types?', N'passenger, rooming, list, management, pax, types, tour, creation, ingestion, tours, adult, child, infant, chd, badge, booking, ref, room, numbers, family, groups, 01_tours_creation_and_rooming_list, type, definitions, billing, rules, full, fare, years, age', N'### 👥 Passenger Rooming List Management & Pax Types

* **Pax Type Definitions & Billing Rules**:
  * **`Adult`**: Full-fare passenger ($12+$ years of age). Incur standard hotel rates and full excursion prices.
  * **`Child (CHD)`**: Passengers under $12$ years of age. Highlighted in **red text with a `(CHD)` badge** in rooming lists and excursion sales grids. Receive discounted excursion ticket rates.
  * **`Infant`**: Children under $2$ years of age. Handled with zero excursion ticket cost and no extra hotel bed charge.
* **Family Booking Groups**:
  - Passengers sharing the same booking reference (e.g. `BKG-01`) are automatically grouped into shared hotel room configurations (Single, Double, Twin, Triple).

---', N'/tours', N'View Tours & Rooming', 1, N'2026-09-01T16:01:43.583Z', N'2026-10-25T18:37:52.046Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (389, N'DocumentationRepo', N'01_Tours_Creation_and_Rooming_List.md', N'Process Flow', NULL, NULL, N'How to 🚦 initial tour status rules?', N'initial, tour, status, rules, 01_tours_creation_and_rooming_list, important, draft, default, rule, every, newly, created, imported, strictly, starts, tourstatusid, cannot, jump, directly, confirmed, completed, without, passing, through, mandatory', N'### 🚦 Initial Tour Status Rules

> [!IMPORTANT]
> **Draft Default Rule**: Every newly created or imported tour strictly starts in **`Draft` (`TourStatusId = 1`)**. It cannot jump directly to `Confirmed` or `Completed` without passing through mandatory **Status Checkpoints** (such as guide assignment and rooming verification).', N'/tours', N'Tour Status Kanban', 1, N'2026-09-01T16:01:43.583Z', N'2026-09-17T07:52:58.142Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (390, N'DocumentationRepo', N'03_Manual_Entry_vs_Excel_Import_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 🆚 comparison: manual entry vs excel import?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🆚 Comparison: Manual Entry vs Excel Import

| Operational Task | Manual Web UI Entry | Automated Excel Import |
| :--- | :--- | :--- |
| **Tour Creation** | Fill form in Tours grid $\rightarrow$ Click `Save Tour`. | Import `Rooming_import_template.xlsx` (Creates Tour + Passengers). |
| **Passenger Rooming** | Add passengers one by one in Bookings tab. | Upload `Rooming_import_template.xlsx` (Populates 30+ passengers in seconds). |
| **Excursion Sales** | Check passenger attendance boxes manually in Services tab. | Upload `Sales_import_template.xlsx` or pre-populated sale file. |
| **Hotel Rates** | Edit hotel service lines in Services tab. | Import `MasterData_Import_Template.xlsx` (Hotels sheet). |

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.595Z', N'2026-09-17T07:52:58.147Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (391, N'DocumentationRepo', N'03_Manual_Entry_vs_Excel_Import_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 🟢 prerequisite rule for download sale file button?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🟢 Prerequisite Rule for Download Sale File Button

> [!IMPORTANT]
> **Passenger Prerequisite**: The green **`Download Sale File`** button on the Bookings tab will **ONLY** appear once the passenger rooming list has been uploaded (`allPassengers.length > 0`). If no passengers exist for the tour, the button is hidden.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.595Z', N'2026-09-17T07:52:58.147Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (392, N'DocumentationRepo', N'03_Manual_Entry_vs_Excel_Import_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 📂 standardized shared drive import files?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 📂 Standardized Shared Drive Import Files

Location: `Shared Drive/UnoERP/ExcelImportFiles/`
1. `MasterData_Import_Template.xlsx` (Master Data)
2. `Rooming_import_template.xlsx` (Rooming List)
3. `Sales_import_template.xlsx` (Excursion Sales)', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:01:43.596Z', N'2026-09-17T07:52:58.148Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (393, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 📊 excel import master guide: complete step-by-step instructions for new & existing items?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 📊 Excel Import Master Guide: Complete Step-by-Step Instructions for New & Existing Items

This comprehensive guide details the exact filename conventions, worksheet naming rules, column definitions, and step-by-step procedures for importing Projects, Tours, Rooming Lists, Master Data (Hotels, Guides, Transport, Excursions), and Sales Files into UNO ERP.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:13:49.123Z', N'2026-09-17T07:52:58.026Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (394, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Tours', N'Excel Import', N'How can I import sales excel file and rooming lists?
How to import a new tour, new project, or rooming list via Excel template?
What are the 5 Excel import scenarios?
What is Scenario 1: New Tour & New Project?
What is Scenario 2: New Tour for Existing Project?
What is Scenario 3: Refresh Rooming Data?
What is Scenario 4: Import Master Data?
What is Scenario 5: Import Excursion Sales?
What filename conventions are required for Excel import?', N'How to 📁 1. filename conventions & naming notation?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 📁 1. Filename Conventions & Naming Notation

The backend indexer and Excel parser use filename patterns to automatically detect the import context:

| Import Operational Case | Filename Template | Concrete Example |
| :--- | :--- | :--- |
| **Scenario 1: New Project + New Tour** | `{ProjectName}_{TourCode}_rooming.xlsx` | **`Project1_Tour1_rooming.xlsx`** *(or `Orta Avrupa BVP_BVP28082026_rooming.xlsx`)* |
| **Scenario 2: Existing Project + New Tour** | `{ProjectName}_{TourCode}_rooming.xlsx` | **`Project1_Tour2_rooming.xlsx`** |
| **Scenario 3: Existing Tour Rooming Refresh** | `{TourCode}_rooming.xlsx` | **`Tour1_rooming.xlsx`** *(or `BVP28082026_rooming.xlsx`)* |
| **Scenario 4: Master Data Catalog** | `MasterData_Import_Template.xlsx` | **`MasterData_Import_Template.xlsx`** |
| **Scenario 5: Excursion Sales File** | `{ProjectName}_{TourCode}_importSales.xlsx` | **`Project1_Tour1_importSales.xlsx`** |

---', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-01T16:13:49.124Z', N'2026-10-25T18:37:52.082Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (395, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 🔹 sheet a: `tours` (or `tour`, `tour`, `tours`, `tourdata`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet A: `Tours` (or `Tour`, `tour`, `tours`, `TourData`)

* **Col A (`Cell 1`)**: `Tour Code` (e.g. `Tour1` or `BVP28082026`). *[Required]*
* **Col B (`Cell 2`)**: `Project Code / Name` (e.g. `Project1` or `Orta Avrupa BVP`).
* **Col C (`Cell 3`)**: `Destination` (e.g. `Prague-Vienna-Budapest`).
* **Col D (`Cell 4`)**: `Arrival Date` (e.g. `28.08.2026`).
* **Col E (`Cell 5`)**: `End Date` (e.g. `04.09.2026`).
* **Col F-I (`Cells 6-9`)**: `Adults`, `Children`, `Infants`, `Pax`.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:13:49.124Z', N'2026-09-17T07:52:58.027Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (396, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 🔹 sheet b: `projects` (or `project`, `project`, `projects`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet B: `Projects` (or `Project`, `project`, `projects`)

* **Col A (`Cell 1`)**: `Project Code / Name` (e.g. `Project1`).
* **Col B (`Cell 2`)**: `Client Name` (e.g. `UNO DMC`).', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:13:49.125Z', N'2026-09-17T07:52:58.028Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (397, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 🔹 sheet c: `rooming` (or `rooms`, `rooming`, `rooms`, `passengers`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet C: `Rooming` (or `Rooms`, `rooming`, `rooms`, `Passengers`)

* **Col A (`Cell 1`)**: `Passenger Full Name` (e.g. `John Doe`).
* **Col B (`Cell 2`)**: `Gender` (`M` / `F`).
* **Col C (`Cell 3`)**: `Pax Type` (`Adult`, `Child` / `CHD`, `Infant`).
* **Col D (`Cell 4`)**: `Booking Ref` (e.g. `BKG-01`, `BKG-02`).
* **Col E (`Cell 5`)**: `Room Number` (e.g. `101`, `102`).
* **Col F (`Cell 6`)**: `Room Type` (`Single`, `Double`, `Twin`, `Triple`).', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:13:49.125Z', N'2026-09-17T07:52:58.029Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (398, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 🔹 sheet d: `flights`?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet D: `Flights`

* **Row 2**: Arrival Flight No (`Cell 1`), Arrival Airport (`Cell 3`), Arrival Date (`Cell 4`).
* **Row 3**: Departure Flight No (`Cell 1`), Departure Airport (`Cell 2`), Departure Date (`Cell 4`).', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:13:49.125Z', N'2026-09-17T07:52:58.030Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (399, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to 🔹 sheet e: `hotels` (master data file)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet E: `Hotels` (Master Data File)

* **Col A**: Hotel Name | **Col B**: Location | **Col C**: Star Rating | **Col D**: Contact Name | **Col E**: Role | **Col F**: Email | **Col G**: Phone | **Cols H-O**: Nightly Room & Pax Rates (Single, Double, Twin, Triple) | **Col P**: Pricing Basis (`Pax` vs `Room`).

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:13:49.126Z', N'2026-09-17T07:52:58.031Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (400, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to scenario 1: how to import a new tour for a new project?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Scenario 1: How to Import a NEW Tour for a NEW Project

1. **Filename**: Name your file **`Project1_Tour1_rooming.xlsx`**.
2. **Projects Sheet**: In sheet `Projects`, set Col A = `Project1`, Col B = `Client Name`.
3. **Tours Sheet**: In sheet `Tours`, set Col A = `Tour1`, Col B = `Project1`, Col C = `Prague`, Col D = `28.08.2026`.
4. **Rooming Sheet**: In sheet `Rooming`, list passenger names, booking references (`BKG-01`), room numbers (`101`), and pax types.
5. **Execution**: Go to **Tours** or **Projects** screen → Click **Import Rooming List** → Select file.
6. **Result**:
   * UNO ERP automatically creates **`Project1`** on the fly with status **`Active`**.
   * UNO ERP creates **`Tour1`** linked to `Project1` and initializes status to **`Draft`** (first Kanban column).
   * All passengers and family rooming bookings are attached.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:13:49.126Z', N'2026-09-17T07:52:58.031Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (401, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to scenario 2: how to import a new tour for an existing project?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Scenario 2: How to Import a NEW Tour for an EXISTING Project

1. **Filename**: Name your file **`Project1_Tour1_rooming.xlsx`** (or set `Tours` sheet Col B = `Project1`).
2. **Projects Sheet**: Optional (or leave Col A = `Project1`).
3. **Tours Sheet**: Set Col A = `Tour1`, Col B = `Project1`.
4. **Execution**: Click **Import Rooming List** → Select file.
5. **Result**:
   * UNO ERP searches the database, matches existing project **`Project1`**, creates **`Tour1`** in **`Draft`** status, and binds `Tour1` directly under `Project1`.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:13:49.126Z', N'2026-09-17T07:52:58.032Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (402, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to scenario 3: how to import / refresh rooming data for an existing tour?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Scenario 3: How to Import / Refresh Rooming Data for an EXISTING Tour

1. **Filename**: Name your file **`Tour1_rooming.xlsx`** (or `BVP28082026_rooming.xlsx`).
2. **Rooming Sheet**: Update passenger names, room numbers (`101`, `102`), or booking codes.
3. **Execution**: Click **Import Rooming List** → Select file.
4. **Result**:
   * UNO ERP matches existing tour **`Tour1`**.
   * Refreshes passenger rooming list and passenger counts (`Pax`, `Adults`, `Children`).
   * **Preserves all existing hotel accommodation lines, guide assignments, and transport services** attached to the tour.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:13:49.127Z', N'2026-09-17T07:52:58.033Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (403, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to scenario 4: how to import new vs existing master data (hotels, guides, transport, excursions)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Scenario 4: How to Import NEW vs EXISTING Master Data (Hotels, Guides, Transport, Excursions)

1. **Filename**: Name your file **`MasterData_Import_Template.xlsx`**.
2. **Worksheets**: Fill `Hotels`, `Guides`, `Transport`, `Drivers`, `Excursions` sheets.
3. **Execution**: Go to **Master Data** screen → Click **Import Master Data** → Select file.
4. **Result**:
   * **For NEW Items**: Creates new supplier records in the Master Data catalog.
   * **For EXISTING Items**: Updates contract rates, contact numbers, or star ratings without duplicating records.

---', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:13:49.127Z', N'2026-09-17T07:52:58.033Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (404, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Excel Import Guide', NULL, NULL, N'How to scenario 5: how to import excursion sales for an existing tour?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Scenario 5: How to Import Excursion Sales for an EXISTING Tour

1. **Prerequisite**: Rooming list must already be uploaded so passenger IDs exist.
2. **Filename**: Download template **`Project1_Tour1_importSales.xlsx`** from Tour Detail page.
3. **Sales Sheet**: Mark excursion checkboxes (`☑`) for participating passengers.
4. **Execution**: Click **Import Tour Sales & Base Services** → Select file.
5. **Result**:
   * Creates optional excursion sales lines and calculates 10% guide commission and net operator revenue.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:13:49.127Z', N'2026-09-17T07:52:58.035Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (405, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Tours', N'General', N'', N'How to 📊 complete step-by-step excel import workflow guide (uno erp)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 📊 Complete Step-by-Step Excel Import Workflow Guide (UNO ERP)

This official guide explains how to import Excel files into UNO ERP for all scenarios (New Projects, Existing Projects, New Tours, Existing Tours, Rooming Lists, Master Data, and Excursion Sales).

---', N'/tours', N'View Tours', 1, N'2026-09-01T16:14:26.250Z', N'2026-10-25T18:37:52.210Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (406, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Tours', N'General', N'', N'How to 📁 1. filename naming conventions & notation?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 📁 1. Filename Naming Conventions & Notation

Follow these exact filename patterns so UNO ERP can automatically identify your Project and Tour:

1. **New or Existing Project + New Tour**:
   * **Notation Pattern**: `{ProjectName}_{TourCode}_rooming.xlsx`
   * **Example**: **`Project1_Tour1_rooming.xlsx`** *(or `Orta Avrupa BVP_BVP28082026_rooming.xlsx`)*
2. **Existing Tour Rooming List Update**:
   * **Notation Pattern**: `{TourCode}_rooming.xlsx`
   * **Example**: **`Tour1_rooming.xlsx`** *(or `BVP28082026_rooming.xlsx`)*
3. **Excursion Sales & Base Fees**:
   * **Notation Pattern**: `{ProjectName}_{TourCode}_importSales.xlsx`
   * **Example**: **`Project1_Tour1_importSales.xlsx`**
4. **Master Data Catalog**:
   * **Notation Pattern**: `MasterData_Import_Template.xlsx`

---', N'/tours', N'View Tours', 1, N'2026-09-01T16:14:26.250Z', N'2026-10-25T18:37:52.211Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (407, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Tours', N'General', N'', N'How to 🔹 sheet a: `tours` (or `tour`, `tour`, `tours`, `tourdata`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet A: `Tours` (or `Tour`, `tour`, `tours`, `TourData`)

* **Col A (`Cell 1`)**: `Tour Code` (e.g. `Tour1` or `BVP28082026`). *[Required]*
* **Col B (`Cell 2`)**: `Project Code / Name` (e.g. `Project1` or `Orta Avrupa BVP`).
* **Col C (`Cell 3`)**: `Destination` (e.g. `Prague-Vienna-Budapest`).
* **Col D (`Cell 4`)**: `Arrival Date` (e.g. `28.08.2026`).
* **Col E (`Cell 5`)**: `End Date` (e.g. `04.09.2026`).
* **Col F-I (`Cells 6-9`)**: `Adults`, `Children`, `Infants`, `Pax`.', N'/tours', N'View Tours', 1, N'2026-09-01T16:14:26.250Z', N'2026-10-25T18:37:52.212Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (408, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Tours', N'General', N'', N'How to 🔹 sheet b: `projects` (or `project`, `project`, `projects`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet B: `Projects` (or `Project`, `project`, `projects`)

* **Col A (`Cell 1`)**: `Project Code / Name` (e.g. `Project1`).
* **Col B (`Cell 2`)**: `Client Name` (e.g. `UNO DMC`).', N'/tours', N'View Tours', 1, N'2026-09-01T16:14:26.251Z', N'2026-10-25T18:37:52.213Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (409, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Tours', N'General', N'', N'How to 🔹 sheet c: `rooming` (or `rooms`, `rooming`, `rooms`, `passengers`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet C: `Rooming` (or `Rooms`, `rooming`, `rooms`, `Passengers`)

* **Col A (`Cell 1`)**: `Passenger Full Name` (e.g. `John Doe`).
* **Col B (`Cell 2`)**: `Gender` (`M` / `F`).
* **Col C (`Cell 3`)**: `Pax Type` (`Adult`, `Child` / `CHD`, `Infant`).
* **Col D (`Cell 4`)**: `Booking Ref` (e.g. `BKG-01`, `BKG-02`).
* **Col E (`Cell 5`)**: `Room Number` (e.g. `101`, `102`).
* **Col F (`Cell 6`)**: `Room Type` (`Single`, `Double`, `Twin`, `Triple`).', N'/tours', N'View Tours', 1, N'2026-09-01T16:14:26.251Z', N'2026-10-25T18:37:52.213Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (410, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Tours', N'General', N'', N'How to 🔹 sheet d: `flights`?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet D: `Flights`

* **Row 2**: Arrival Flight No (`Cell 1`), Arrival Airport (`Cell 3`), Arrival Date (`Cell 4`).
* **Row 3**: Departure Flight No (`Cell 1`), Departure Airport (`Cell 2`), Departure Date (`Cell 4`).', N'/tours', N'View Tours', 1, N'2026-09-01T16:14:26.251Z', N'2026-10-25T18:37:52.214Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (411, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Tours', N'General', N'', N'How to 🔹 sheet e: `hotels` (master data catalog)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet E: `Hotels` (Master Data Catalog)

* **Col A**: Hotel Name | **Col B**: Location | **Col C**: Star Rating | **Col D**: Contact Name | **Col E**: Role | **Col F**: Email | **Col G**: Phone | **Cols H-O**: Nightly Room & Pax Rates (Single, Double, Twin, Triple) | **Col P**: Pricing Basis (`Pax` vs `Room`).

---', N'/tours', N'View Tours', 1, N'2026-09-01T16:14:26.251Z', N'2026-10-25T18:37:52.215Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (412, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Tours', N'General', N'', N'How to scenario 1: how to import a new tour for a new project?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Scenario 1: How to Import a NEW Tour for a NEW Project

1. **Filename**: Name your file **`Project1_Tour1_rooming.xlsx`**.
2. **Projects Sheet**: In sheet `Projects`, set Col A = `Project1`, Col B = `Client Name`.
3. **Tours Sheet**: In sheet `Tours`, set Col A = `Tour1`, Col B = `Project1`, Col C = `Prague`, Col D = `28.08.2026`.
4. **Rooming Sheet**: In sheet `Rooming`, list passenger names, booking references (`BKG-01`), room numbers (`101`), and pax types.
5. **Execution**: Go to **Tours** or **Projects** screen → Click **Import Rooming List** → Select file.
6. **Result**:
   * UNO ERP automatically creates **`Project1`** on the fly with status **`Active`**.
   * UNO ERP creates **`Tour1`** linked to `Project1` and initializes status to **`Draft`** (first Kanban column).
   * All passengers and family rooming bookings are attached.

---', N'/tours', N'View Tours', 1, N'2026-09-01T16:14:26.252Z', N'2026-10-25T18:37:52.216Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (413, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Tours', N'General', N'', N'How to scenario 2: how to import a new tour for an existing project?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Scenario 2: How to Import a NEW Tour for an EXISTING Project

1. **Filename**: Name your file **`Project1_Tour1_rooming.xlsx`** (or set `Tours` sheet Col B = `Project1`).
2. **Tours Sheet**: Set Col A = `Tour1`, Col B = `Project1`.
3. **Execution**: Click **Import Rooming List** → Select file.
4. **Result**:
   * UNO ERP searches the database, matches existing project **`Project1`**, creates **`Tour1`** in **`Draft`** status, and binds `Tour1` directly under `Project1`.

---', N'/tours', N'View Tours', 1, N'2026-09-01T16:14:26.252Z', N'2026-10-25T18:37:52.217Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (414, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Tours', N'General', N'', N'How to scenario 3: how to import / refresh rooming data for an existing tour?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Scenario 3: How to Import / Refresh Rooming Data for an EXISTING Tour

1. **Filename**: Name your file **`Tour1_rooming.xlsx`** (or `BVP28082026_rooming.xlsx`).
2. **Rooming Sheet**: Update passenger names, room numbers (`101`, `102`), or booking codes.
3. **Execution**: Click **Import Rooming List** → Select file.
4. **Result**:
   * UNO ERP matches existing tour **`Tour1`**.
   * Refreshes passenger rooming list and passenger counts (`Pax`, `Adults`, `Children`).
   * **Preserves all existing hotel accommodation lines, guide assignments, and transport services** attached to the tour.

---', N'/tours', N'View Tours', 1, N'2026-09-01T16:14:26.252Z', N'2026-10-25T18:37:52.217Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (415, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Tours', N'General', N'', N'How to scenario 4: how to import new vs existing master data (hotels, guides, transport, excursions)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Scenario 4: How to Import NEW vs EXISTING Master Data (Hotels, Guides, Transport, Excursions)

1. **Filename**: Name your file **`MasterData_Import_Template.xlsx`**.
2. **Worksheets**: Fill `Hotels`, `Guides`, `Transport`, `Drivers`, `Excursions` sheets.
3. **Execution**: Go to **Master Data** screen → Click **Import Master Data** → Select file.
4. **Result**:
   * **For NEW Items**: Creates new supplier records in the Master Data catalog.
   * **For EXISTING Items**: Updates contract rates, contact numbers, or star ratings without duplicating records.

---', N'/tours', N'View Tours', 1, N'2026-09-01T16:14:26.252Z', N'2026-10-25T18:37:52.218Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (416, N'DocumentationRepo', N'EXCEL_IMPORT_WORKFLOW_GUIDE.md', N'Tours', N'General', N'', N'How to scenario 5: how to import excursion sales for an existing tour?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### Scenario 5: How to Import Excursion Sales for an EXISTING Tour

1. **Prerequisite**: Rooming list must already be uploaded so passenger IDs exist.
2. **Filename**: Download template **`Project1_Tour1_importSales.xlsx`** from Tour Detail page.
3. **Sales Sheet**: Mark excursion checkboxes (`☑`) for participating passengers.
4. **Execution**: Click **Import Tour Sales & Base Services** → Select file.
5. **Result**:
   * Creates optional excursion sales lines and calculates 10% guide commission and net operator revenue.', N'/tours', N'View Tours', 1, N'2026-09-01T16:14:26.253Z', N'2026-10-25T18:37:52.219Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (417, N'SystemTroubleshooting', N'excel_import_master_guide.md', N'Tours', N'Excel Import', N'How to import a new tour, new project, or rooming list via Excel template?
What are the 5 Excel import scenarios?
How can I import sales excel file and rooming lists?', N'How to import a new tour, new project, or rooming list via Excel template?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 📊 Complete Step-by-Step Excel Import Workflow Guide

Follow these exact filename conventions, sheet rules, and step-by-step procedures to import projects, tours, rooming lists, or master data into UNO ERP:

#### 📁 1. Filename Naming Conventions & Notation
1. **New or Existing Project + New Tour**: Use `{ProjectName}_{TourCode}_rooming.xlsx`
   * *Example*: `Project1_Tour1_rooming.xlsx` (or `Orta Avrupa BVP_BVP28082026_rooming.xlsx`)
2. **Existing Tour Rooming List Update**: Use `{TourCode}_rooming.xlsx`
   * *Example*: `Tour1_rooming.xlsx` (or `BVP28082026_rooming.xlsx`)
3. **Excursion Sales & Base Fees**: Use `{ProjectName}_{TourCode}_importSales.xlsx`
   * *Example*: `Project1_Tour1_importSales.xlsx`
4. **Master Data Catalog**: Use `MasterData_Import_Template.xlsx`

#### 📊 2. Required Sheet Names & Column Details
• **Sheet 1 (`Tours` / `Tour`)**: Col A: `Tour Code` (`Tour1`), Col B: `Project` (`Project1`), Col C: `Destination`, Col D: `Arrival Date`, Col E: `End Date`, Cols F-I: `Pax Counts`.
• **Sheet 2 (`Projects` / `Project`)**: Col A: `Project Code` (`Project1`), Col B: `Client Name` (`UNO DMC`).
• **Sheet 3 (`Rooming` / `Rooms` / `Passengers`)**: Col A: `Passenger Name`, Col B: `Gender`, Col C: `Pax Type`, Col D: `Booking Ref` (`BKG-01`), Col E: `Room Number` (`101`), Col F: `Room Type` (`Single`/`Double`/`Twin`/`Triple`).
• **Sheet 4 (`Hotels` - Master Data)**: Hotel Name, Location, Star Rating, Nightly Room & Pax Rates, Pricing Basis.

#### 🛠️ 3. Step-by-Step Import Scenarios

**Scenario 1: NEW Tour for a NEW Project**
1. Name file `Project1_Tour1_rooming.xlsx`.
2. In sheet `Projects`, set Col A = `Project1`, Col B = `Client Name`.
3. In sheet `Tours`, set Col A = `Tour1`, Col B = `Project1`.
4. Go to **Tours** or **Projects** screen → Click **Import Rooming List** → Upload file.
5. *Result*: Creates `Project1` on the fly (`Active` status), creates `Tour1` in **`Draft`** status, and imports all rooming passengers.

**Scenario 2: NEW Tour for an EXISTING Project**
1. Name file `Project1_Tour2_rooming.xlsx` (or set `Tours` sheet Col B = `Project1`).
2. Click **Import Rooming List** → Upload file.
3. *Result*: Matches existing project `Project1`, creates `Tour2` in **`Draft`** status, and binds `Tour2` under `Project1`.

**Scenario 3: EXISTING Tour Rooming Refresh**
1. Name file `Tour1_rooming.xlsx`.
2. Click **Import Rooming List** → Upload file.
3. *Result*: Refreshes passenger rooming list and pax counts, preserving all existing hotel & guide service lines.

**Scenario 4: Master Data Catalog (Hotels, Guides, Transport)**
1. Go to **Master Data** screen → Click **Import Master Data** → Select `MasterData_Import_Template.xlsx`.
2. *Result*: Ingests supplier records or updates existing contract rates without duplicating records.', N'/master-data', N'Open Excel Import Hub', 1, N'2026-09-01T16:16:33.595Z', N'2026-10-25T18:37:51.958Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (418, N'DocumentationRepo', N'Tour_Status_Transitions_and_Checkpoint_Resolution_Guide.md', N'Tours', N'General', N'', N'How to 🚦 uno_erp: tour status transitions & checkpoint resolution guide?', N'uno_erp, tour, status, transitions, checkpoint, resolution, guide, tour_status_transitions_and_checkpoint_resolution_guide, document, type, knowledge, base, operational, workflow, audience, smart, agents, operations, managers, planners, accounting, administrators, system, scope, uno_crm, next, frontend, uno_api, asp, net', N'### 🚦 UNO_ERP: Tour Status Transitions & Checkpoint Resolution Guide

> **Document Type:** AI Knowledge Base & Operational Workflow Guide  
> **Audience:** AI Smart Agents, Operations Managers, Tour Planners, Accounting Administrators  
> **System Scope:** `Uno_CRM` (Next.js Frontend) & `Uno_API` (ASP.NET Core / Entity Framework Core)  
> **Database Entity:** `Tour` (`Tours` table) & `TourStatusCheckpoint` (`TourStatusCheckpoints` table)  
> **Last Updated:** September 2026  

---', N'/tours', N'View Tours', 1, N'2026-09-16T08:25:49.742Z', N'2026-10-25T18:37:52.128Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (419, N'DocumentationRepo', N'Tour_Status_Transitions_and_Checkpoint_Resolution_Guide.md', N'Tours', N'General', N'', N'How to 📌 executive summary?', N'executive, summary, tour_status_transitions_and_checkpoint_resolution_guide, uno_erp, all, tours, move, sequentially, across, core, operational, stages, every, status, advancement, protected, automated, gate, tourstatuscheckpointscontroller, tourcheckpointwidget, any, mandatory, checkpoint, unsatisfied, the, blocks, progression, disp', N'### 📌 Executive Summary

In **UNO_ERP**, all tours move sequentially across 5 core operational stages. Every status advancement is protected by an automated **Status Gate** (`TourStatusCheckpointsController` & `TourCheckpointWidget`). 

If any mandatory checkpoint is unsatisfied, the **Status Gate** blocks progression, displays `X BLOCKED` in amber/red, and disables the **"Advance to..."** action button.', N'/tours', N'View Tours', 1, N'2026-09-16T08:25:49.750Z', N'2026-10-25T18:37:52.128Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (420, N'DocumentationRepo', N'Tour_Status_Transitions_and_Checkpoint_Resolution_Guide.md', N'Tours', N'General', N'', N'How to lifecycle status overview table?', N'lifecycle, status, overview, table, tour_status_transitions_and_checkpoint_resolution_guide, name, kanban, stage, primary, business, purpose, next, target, gate, key, checkpoints, draft, planning, initial, creation, itinerary, proposal, project, code, destination, pax, count, date, boun', N'### Lifecycle Status Overview Table

| Status ID | Status Name | Kanban Stage | Primary Business Purpose | Next Target Status | Gate Key Checkpoints |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **`Draft`** | In Planning | Initial creation & itinerary draft | **Proposal (2)** | Project Code, Destination, Pax count, Date boundaries |
| **2** | **`Proposal`** | Quoting / B2B | Commercial offer sent to client | **Confirmed (3)** | Hotel, Guide, Transport, Base Package Fee (€) |
| **3** | **`Confirmed`** | Locked / Pre-Tour | Guaranteed departure, logistics ready | **In Progress (4)** | Arrival Date reached, Flight manifest verified |
| **4** | **`In Progress`** | Active on Ground | Tour executing, daily guide operations | **Completed (5)** | Return Date reached, Services logged, Accounting Closed |
| **5** | **`Completed`** | Archival / Audited | Finalized operations & locked accounting | *Terminal State* | All financial audits and remittances sealed |
| **6** | **`Cancelled`** | Exception | Cancelled departure & supplier penalties | *Terminal State* | Cancellation reason recorded in AuditLogs |

---', N'/tours', N'View Tours', 1, N'2026-09-16T08:25:49.751Z', N'2026-10-25T18:37:52.129Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (421, N'DocumentationRepo', N'Tour_Status_Transitions_and_Checkpoint_Resolution_Guide.md', N'Tours', N'General', N'', N'How to 🧭 how to read the status gate widget (`tourcheckpointwidget`)?', N'how, read, the, status, gate, widget, tourcheckpointwidget, tour_status_transitions_and_checkpoint_resolution_guide, appears, top, tour, detail, page, projects, tours, tourid, text, readiness, blocked, current, proposal, target, confirmed', N'### 🧭 How to Read the Status Gate Widget (`TourCheckpointWidget`)

The widget appears at the top of the **Tour Detail Page** (`/projects/[id]/tours/[tourId]`):

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ Status Gate Readiness  [ 1 BLOCKED ]  Current: Proposal ➔ Target: Confirmed        │
│                                                   [ ➔ Advance to Confirmed (Disabled) ]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [✓] Hotel Reservations Confirmed       [✓] Guide Assignment Confirmed                  │
│     Hotel reservations confirmed           Primary guide assigned & contract locked    │
│                                                                                        │
│ [✓] Transportation & Coach Locked      [✕] Client Contract & Deposit Received REQUIRED │
│     Transport company/driver assigned      Pricing / package fee not calculated        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **`GATE READY` (Green Badge):** All mandatory checkpoints satisfied (`canAdvance: true`). The blue **"Advance to [Target]"** button is enabled and clickable.
- **`N BLOCKED` (Amber/Red Badge):** One or more mandatory checkpoints are failing (`canAdvance: false`). The **"Advance to..."** button is disabled.
- **Click to Expand/Collapse:** Clicking the header bar expands the checklist showing each checkpoint, its requirement status, and the exact failure reason.

---', N'/tours', N'View Tours', 1, N'2026-09-16T08:25:49.752Z', N'2026-10-25T18:37:52.130Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (422, N'DocumentationRepo', N'Tour_Status_Transitions_and_Checkpoint_Resolution_Guide.md', N'Tours', N'General', N'', N'How to 1️⃣ transition 1: `draft` ➔ `proposal` (gate 1)?', N'transition, draft, proposal, gate, tour_status_transitions_and_checkpoint_resolution_guide, current, status, target, goal, validate, core, itinerary, structure, and, passenger, counts, before, releasing, quotation, client, evaluated, checkpoints, checkpoint, name, key, mandatory, backend, logic, failure, reason', N'### 1️⃣ Transition 1: `Draft` ➔ `Proposal` (Gate 1)

* **Current Status:** `Draft` (ID: 1)  
* **Target Status:** `Proposal` (ID: 2)  
* **Goal:** Validate core itinerary structure and passenger counts before releasing quotation to client.

#### Evaluated Checkpoints

| Checkpoint Name | Key | Mandatory? | Backend Logic & Failure Reason |
| :--- | :--- | :---: | :--- |
| **Project & Destination Defined** | `PROJECT_DEFINED` | **YES** | `tour.ProjectId > 0 && !string.IsNullOrEmpty(tour.Destination)`<br>• *Pass:* `"Project and destination city routing defined"`<br>• *Fail:* `"Project or destination missing"` |
| **Itinerary Boundaries** | Internal validation | **YES** | `tour.ArrivalDate != default && tour.EndDate > tour.ArrivalDate`<br>• *Fail:* End date cannot be before Arrival date |
| **Pax Breakdown** | Internal validation | **YES** | `tour.Pax > 0 || (tour.Adults + tour.Children) > 0`<br>• *Fail:* At least 1 adult passenger required |

#### Where to Find & How to Complete in UI

1. **Navigate to:** `Projects` ➔ Select the Project ➔ Click on the Tour.
   - **URL:** `/projects/{projectId}/tours/{tourId}`
2. **Locate Control:** Under the **Overview** tab, find the **Tour Information** card.
3. **Action:**
   - Click the blue **"Edit"** button in the top right of the card header.
   - **Destination:** Enter the destination city or route (e.g. `Budapest, Vienna, Prague`).
   - **Dates:** Set valid **Arrival Date & Time** and **End Date & Time** (`EndDate > ArrivalDate`).
   - **Passengers:** Ensure **Adults** is set to at least `1`.
   - Click **Save Changes**.
4. **Advance:** The gate changes to `GATE READY`. Click **"Advance to Proposal"**.

---', N'/tours', N'View Tours', 1, N'2026-09-16T08:25:49.752Z', N'2026-10-25T18:37:52.130Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (423, N'DocumentationRepo', N'Tour_Status_Transitions_and_Checkpoint_Resolution_Guide.md', N'Tours', N'General', N'', N'How to 2️⃣ transition 2: `proposal` ➔ `confirmed` (gate 2)?', N'transition, proposal, confirmed, gate, tour_status_transitions_and_checkpoint_resolution_guide, current, status, target, goal, lock, all, supplier, bookings, hotel, guide, bus, and, secure, financial, commercial, terms, before, committing, execution, evaluated, checkpoints, checkpoint, name, key, mandatory', N'### 2️⃣ Transition 2: `Proposal` ➔ `Confirmed` (Gate 2)

* **Current Status:** `Proposal` (ID: 2)  
* **Target Status:** `Confirmed` (ID: 3)  
* **Goal:** Lock all supplier bookings (Hotel, Guide, Bus) and secure financial commercial terms before committing to execution.

#### Evaluated Checkpoints

| Checkpoint Name | Key | Mandatory? | Backend Logic & Failure Reason |
| :--- | :--- | :---: | :--- |
| **Hotel Reservations Confirmed** | `HOTEL_RESERVATIONS_CONFIRMED` | **YES** | `tour.TourServices.Any(s => s.HotelId != null \|\| s.ServiceCategory.Name == "Hotel")`<br>• *Pass:* `"Hotel reservations confirmed"`<br>• *Fail:* `"No hotel service assigned to tour"` |
| **Guide Assignment Confirmed** | `GUIDE_ASSIGNED_CONFIRMED` | **YES** | `tour.TourServices.Any(s => s.GuideId != null \|\| s.ServiceCategory.Name == "Guide")`<br>• *Pass:* `"Primary guide assigned & contract locked"`<br>• *Fail:* `"No guide assigned to tour"` |
| **Transportation & Coach Locked** | `TRANSPORT_CONFIRMED` | **YES** | `tour.TourServices.Any(s => s.DriverId != null \|\| s.TransportCompanyId != null \|\| s.ServiceCategory.Name == "Transport" \|\| s.ServiceCategory.Name == "Driver")`<br>• *Pass:* `"Transport company / driver assigned"`<br>• *Fail:* `"No transport/driver service assigned"` |
| **Client Contract & Deposit Received** | `CLIENT_DEPOSIT_CONFIRMED` | **YES** | `tour.TotalFee > 0 \|\| tour.BaseFee > 0`<br>• *Pass:* `"Client contract active & package pricing locked"`<br>• *Fail:* `"Pricing / package fee not calculated"` |

#### Where to Find & How to Complete Each Control in UI

#### A. Resolving "Client Contract & Deposit Received" (`CLIENT_DEPOSIT_CONFIRMED`)
> ⚠️ **Common Blocker:** The header summary card may show a fallback like `€250 (Per adult fee)`, but the database record has `BaseFee = 0.00`.
- **Where:** Tour Detail Page (`/projects/{projectId}/tours/{tourId}`) ➔ **Tour Information** card.
- **How to Fix:**
  1. Click the **"Edit"** button on the **Tour Information** card.
  2. Locate the **"Base Fee (€)"** input.
  3. Enter your negotiated per-passenger base rate (e.g. `250` or `350`).
  4. Notice the system dynamically calculates:  
     $$\text{Total Fee} = (\text{Adults} \times \text{BaseFee}) + (\text{Children} \times \text{BaseFee} \times 0.5)$$
  5. Click **"Save Changes"**.
  6. The checkpoint immediately switches to green.

#### B. Resolving "Hotel Reservations Confirmed" (`HOTEL_RESERVATIONS_CONFIRMED`)
- **Where:** Tour Detail Page ➔ Click the **"Services"** tab (`tab=services`).
- **How to Fix:**
  1. Click **"+ Add Service"**.
  2. In the Category dropdown, select **"Hotel"**.
  3. Select a Hotel from Master Data (or enter Hotel name in description).
  4. Specify Room Nights / Quantity and Unit Price.
  5. Click **"Save Service"**.

#### C. Resolving "Guide Assignment Confirmed" (`GUIDE_ASSIGNED_CONFIRMED`)
- **Where:** Two places supported:
  1. **Option 1 (Fast):** Click **"Edit"** on the **Tour Information** card ➔ Select a Guide from the **"Primary Guide"** dropdown ➔ Save.
  2. **Option 2:** Go to the **"Services"** tab ➔ Click **"+ Add Service"** ➔ Category: **"Guide"** ➔ Select Guide ➔ Save.

#### D. Resolving "Transportation & Coach Locked" (`TRANSPORT_CONFIRMED`)
- **Where:** Tour Detail Page ➔ Click the **"Services"** tab (`tab=services`).
- **How to Fix:**
  1. Click **"+ Add Service"**.
  2. In Category, select **"Transport"** or **"Driver"**.
  3. Select a Transport Company or Driver.
  4. Specify the service dates / route and price.
  5. Click **"Save Service"**.

#### Advancing the Status
Once all 4 boxes turn green with checkmarks:
- The Status Gate badge turns green: **`GATE READY`**.
- Click the blue **"Advance to Confirmed"** button.

---', N'/tours', N'View Tours', 1, N'2026-09-16T08:25:49.753Z', N'2026-10-25T18:37:52.131Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (424, N'DocumentationRepo', N'Tour_Status_Transitions_and_Checkpoint_Resolution_Guide.md', N'Tours', N'General', N'', N'How to 3️⃣ transition 3: `confirmed` ➔ `in progress` (gate 3)?', N'transition, confirmed, progress, gate, tour_status_transitions_and_checkpoint_resolution_guide, current, status, target, goal, verify, that, the, tour, has, landed, ground, and, live, operations, have, started, evaluated, checkpoints, checkpoint, name, key, mandatory, backend, logic, failure', N'### 3️⃣ Transition 3: `Confirmed` ➔ `In Progress` (Gate 3)

* **Current Status:** `Confirmed` (ID: 3)  
* **Target Status:** `In Progress` (ID: 4)  
* **Goal:** Verify that the tour has landed on the ground and live operations have started.

#### Evaluated Checkpoints

| Checkpoint Name | Key | Mandatory? | Backend Logic & Failure Reason |
| :--- | :--- | :---: | :--- |
| **Arrival Date Reached** | `ARRIVAL_DATE_REACHED` | **YES** | `DateTime.UtcNow >= tour.ArrivalDate`<br>• *Pass:* `"Arrival date reached"`<br>• *Fail:* `"Arrival date is in the future (DD MMM YYYY)"` |
| **Flight Manifest Verified** | `FLIGHT_MANIFEST_VERIFIED` | **YES** | `!string.IsNullOrEmpty(tour.ArrivalFlight)`<br>• *Pass:* `"Arrival flight verified ({tour.ArrivalFlight})"`<br>• *Fail:* `"Arrival flight number missing"` |

#### Where to Find & How to Complete Each Control in UI

#### A. Resolving "Flight Manifest Verified" (`FLIGHT_MANIFEST_VERIFIED`)
- **Where:** Tour Detail Page ➔ **Tour Information** card ➔ **Edit** modal.
- **How to Fix:**
  1. Click the **"Edit"** button on the **Tour Information** card.
  2. Scroll to the **Flight Information** sub-section.
  3. Fill in **"Arrival Flight"** (e.g. `TK 1821`, `LH 1234`).
  4. (Optional but recommended) Fill in **"Arrival Airport"** (e.g. `IST` or `VIE`).
  5. Click **"Save Changes"**.

#### B. Resolving "Arrival Date Reached" (`ARRIVAL_DATE_REACHED`)
- **Nature:** Temporal milestone gate.
- **How to Complete:**
  - **In Real Operations:** The checkpoint unlocks automatically on the morning of the tour''s scheduled arrival date.
  - **In Testing / UAT Simulation:** Click **"Edit"** on **Tour Information**, adjust **Arrival Date** to today or yesterday''s date, and click **Save Changes**.

#### Advancing the Status
When both checks are green:
- Click **"Advance to In Progress"**.

---', N'/tours', N'View Tours', 1, N'2026-09-16T08:25:49.754Z', N'2026-10-25T18:37:52.132Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (425, N'DocumentationRepo', N'Tour_Status_Transitions_and_Checkpoint_Resolution_Guide.md', N'Tours', N'General', N'', N'How to 4️⃣ transition 4: `in progress` ➔ `completed` (gate 4)?', N'transition, progress, completed, gate, tour_status_transitions_and_checkpoint_resolution_guide, current, status, target, goal, conclude, tour, operations, verify, that, guests, departed, reconcile, supplier, invoices, and, audit, the, ledger, evaluated, checkpoints, checkpoint, name, key, mandatory, backend', N'### 4️⃣ Transition 4: `In Progress` ➔ `Completed` (Gate 4)

* **Current Status:** `In Progress` (ID: 4)  
* **Target Status:** `Completed` (ID: 5)  
* **Goal:** Conclude tour operations, verify that guests departed, reconcile supplier invoices, and audit the tour ledger.

#### Evaluated Checkpoints

| Checkpoint Name | Key | Mandatory? | Backend Logic & Failure Reason |
| :--- | :--- | :---: | :--- |
| **Return Date Reached** | `RETURN_DATE_REACHED` | **YES** | `DateTime.UtcNow >= tour.EndDate`<br>• *Pass:* `"Return date reached (passengers departed)"`<br>• *Fail:* `"Departure date is in the future (DD MMM YYYY)"` |
| **Revenue & Expense Reconciled** | `REVENUE_EXPENSE_RECONCILED` | **YES** | `tour.TourServices.Any()`<br>• *Pass:* `"Supplier costs & client sales reconciled"`<br>• *Fail:* `"No services or invoice entries found"` |
| **Accounting Closed** | `ACCOUNTING_CLOSED` | **YES** | `tour.AccountingClosed == true`<br>• *Pass:* `"Accounting audit closed"`<br>• *Fail:* `"Accounting audit flag is unset (Accounting Open)"` |

#### Where to Find & How to Complete Each Control in UI

#### A. Resolving "Accounting Closed" (`ACCOUNTING_CLOSED`)
- **Where:** Tour Detail Page ➔ **Finance** tab OR **Tour Information** card.
- **How to Fix:**
  1. Navigate to the **Finance / Invoices** tab to verify all supplier expenses (Hotels, Bus, Guide daily rates) and client package invoices have been reconciled.
  2. Click **"Edit"** on the **Tour Information** card.
  3. Check the checkbox: **"Accounting Closed / Locked"** (`AccountingClosed: true`).
  4. Click **"Save Changes"**.
  5. The checkpoint turns green (`"Accounting audit closed"`).

#### B. Resolving "Return Date Reached" (`RETURN_DATE_REACHED`)
- **Nature:** Temporal milestone gate.
- **How to Complete:**
  - **In Real Operations:** Unlocks automatically when system date $\ge$ `EndDate`.
  - **In Testing / UAT Simulation:** Set **End Date** to today or a past date via **Edit Tour**.

#### C. Resolving "Revenue & Expense Reconciled" (`REVENUE_EXPENSE_RECONCILED`)
- **Where:** Services tab (`tab=services`) or Invoices tab.
- **How to Fix:** Ensure at least 1 service entry exists in the tour.

#### Advancing the Status
When all 3 checkpoints pass:
- Click **"Advance to Completed"**. The tour is now formally archived and financially sealed.

---', N'/tours', N'View Tours', 1, N'2026-09-16T08:25:49.755Z', N'2026-10-25T18:37:52.132Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (426, N'DocumentationRepo', N'Tour_Status_Transitions_and_Checkpoint_Resolution_Guide.md', N'Tours', N'General', N'', N'How to 5️⃣ transition: any status ➔ `cancelled` (status id: 6)?', N'transition, any, status, cancelled, tour_status_transitions_and_checkpoint_resolution_guide, goal, gracefully, terminate, departure, and, log, cancellation, audit, reasons, where, find, tour, detail, page, top, right, actions, dropdown, cancel, requirements, must, enter, formal, reason, client', N'### 5️⃣ Transition: Any Status ➔ `Cancelled` (Status ID: 6)

* **Goal:** Gracefully terminate a cancelled departure and log cancellation audit reasons.
* **Where to Find in UI:** Tour Detail Page ➔ Top right actions dropdown ➔ **"Cancel Tour"**.
* **Requirements:**
  1. Must enter a formal **Cancellation Reason** (e.g. `Client requested cancellation due to visa issues`).
  2. The system logs the cancellation event into the `AuditLogs` table.
  3. Any supplier penalty or client credit note can be processed under the Finance tab.

---', N'/tours', N'View Tours', 1, N'2026-09-16T08:25:49.755Z', N'2026-10-25T18:37:52.133Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (427, N'DocumentationRepo', N'Tour_Status_Transitions_and_Checkpoint_Resolution_Guide.md', N'Tours', N'General', N'', N'How to ⏰ automated time-window sla warning alerts?', N'automated, time, window, sla, warning, alerts, tour_status_transitions_and_checkpoint_resolution_guide, the, system, get, api, tourstatuscheckpoints, warnings, proactively, flags, upcoming, departures, across, danger, windows, text, days, before, start, hours, post, tour', N'### ⏰ Automated Time-Window SLA Warning Alerts

The system (`GET /api/TourStatusCheckpoints/warnings`) proactively flags upcoming departures across 4 danger windows:

```text
7 Days Before Start      3 Days Before Start      24 Hours Before Start    7 Days Post-Tour
────────────────────     ───────────────────      ─────────────────────    ─────────────────
⚠️ Missing Hotel/Bus     🚨 Missing Tour Guide    🚨 Missing Flight #      ⚠️ Accounting Unclosed
(Warning AMBER)          (Warning ROSE)           (Critical ROSE)          (Audit Overdue AMBER)
```

1. **7 Days Prior (`WARNING_HOTEL_7D` / `WARNING_BUS_7D`):** Triggers if Hotel or Transport services are missing.
2. **3 Days Prior (`WARNING_GUIDE_3D`):** Triggers if no Guide is assigned.
3. **24 Hours Prior (`CRITICAL_FLIGHT_24H`):** Triggers if Arrival Flight manifest is missing.
4. **7 Days Post-Tour (`WARNING_ACCOUNTING_7D`):** Triggers if tour ended > 7 days ago but `AccountingClosed` is still false.

---', N'/tours', N'View Tours', 1, N'2026-09-16T08:25:49.756Z', N'2026-10-25T18:37:52.134Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (428, N'DocumentationRepo', N'Tour_Status_Transitions_and_Checkpoint_Resolution_Guide.md', N'Tours', N'General', N'', N'How to 🤖 ai smart agent troubleshooting instructions?', N'smart, agent, troubleshooting, instructions, tour_status_transitions_and_checkpoint_resolution_guide, when, user, aichatdrawer, chat, asks, why, can, advance, tour, status, what, missing, reach, confirmed, progress, completed, the, should, follow, this, systematic, resolution, protocol, identify, current', N'### 🤖 AI Smart Agent Troubleshooting Instructions

When a user in `AIChatDrawer` or in chat asks:  
*"Why can''t I advance my tour status?"* or *"What is missing to reach Confirmed/In Progress/Completed?"*

The AI Agent should follow this systematic resolution protocol:

1. **Identify Tour ID & Current Status:**
   - Determine which tour the user is viewing (`tourId`).
   - Query `GET /api/TourStatusCheckpoints/evaluate/{tourId}`.
2. **Scan Failing Checkpoints (`isSatisfied: false` & `isMandatory: true`):**
   - Read the exact `reason` string returned by the API.
3. **Generate Targeted Response using the Resolution Steps below:**
   - **If reason is `"Pricing / package fee not calculated"`:**
     - Instruct the user to click **"Edit"** on the **Tour Information** card, enter the **Base Fee (€)** (e.g. `€250`), and click **Save Changes**. Explain that the dynamic total will calculate automatically.
   - **If reason is `"No hotel service assigned to tour"`:**
     - Instruct the user to go to the **Services** tab (`tab=services`), click **"+ Add Service"**, select **Hotel**, pick a hotel, and save.
   - **If reason is `"No guide assigned to tour"`:**
     - Instruct the user to open **Edit Tour** and pick a guide in **"Primary Guide"** dropdown, or add a **Guide** service in the **Services** tab.
   - **If reason is `"No transport/driver service assigned"`:**
     - Instruct the user to go to the **Services** tab, click **"+ Add Service"**, choose **Transport/Driver**, and save.
   - **If reason is `"Arrival flight number missing"`:**
     - Instruct the user to open **Edit Tour**, scroll to **Flight Information**, enter the flight code (e.g. `TK 1821`), and save.
   - **If reason is `"Arrival date is in the future"` or `"Departure date is in the future"`:**
     - Inform the user that this is a time-gate milestone that unlocks on departure day (or can be adjusted in Edit Tour for testing).
   - **If reason is `"Accounting audit flag is unset"`:**
     - Instruct the user to verify financial ledgers in the Finance tab, open **Edit Tour**, check **"Accounting Closed / Locked"**, and save.
4. **Final Confirmation Step:**
   - Remind the user that once all items show green checkmarks, the status badge turns into **`GATE READY`**, enabling the blue **"Advance to..."** button.', N'/tours', N'View Tours', 1, N'2026-09-16T08:25:49.757Z', N'2026-10-25T18:37:52.134Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (429, N'DocumentationRepo', N'05_Tour_Statuses_and_Checkpoints.md', N'Tours', N'Statuses & Gates', N'Tour status transition criteria
What are automated tour status checkpoints?
What are the mandatory tour status checkpoints and how to resolve blockers to advance status?
Why is my tour status blocked?
Pricing / package fee not calculated
How to advance to Confirmed?', N'How to 🚦 05. tour statuses, transitions & checkpoint resolution guide?', N'tour, statuses, transitions, checkpoint, resolution, guide, gate, specifications, status, checkpoints, blockers, advance, button, draft, proposal, confirmed, progress, completed, pricing, package, fee, not, calculated, 05_tour_statuses_and_checkpoints, knowledge, base, category, tours, operational, workflows', N'### 🚦 05. Tour Statuses, Transitions & Checkpoint Resolution Guide

> **Knowledge Base Category:** Tours / Operational Workflows & Gate Resolution  
> **Source Module:** `UserManuals/Tours/05_Tour_Statuses_and_Checkpoints.md`  
> **Target Audience:** Tour Planners, Operations Managers, AI Assistant Copilot, Support Team  
> **Applicable Systems:** `Uno_CRM` & `Uno_API` (Entity: `Tour`, `TourStatusCheckpoint`, `TourServices`)  

---', N'/tours', N'Tour Status Kanban & Gates', 1, N'2026-09-17T07:52:58.151Z', N'2026-10-25T18:37:52.100Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (430, N'DocumentationRepo', N'05_Tour_Statuses_and_Checkpoints.md', N'Tours', N'Statuses & Gates', N'Tour status transition criteria
What are automated tour status checkpoints?
What are the mandatory tour status checkpoints and how to resolve blockers to advance status?
Why is my tour status blocked?
Pricing / package fee not calculated
How to advance to Confirmed?', N'How to 📌 1. lifecycle overview & state transition matrix?', N'lifecycle, overview, state, transition, matrix, tour, statuses, gate, resolution, checkpoint, specifications, status, checkpoints, blockers, advance, button, draft, proposal, confirmed, progress, completed, pricing, package, fee, not, calculated, 05_tour_statuses_and_checkpoints, uno_erp, all, tours', N'### 📌 1. Lifecycle Overview & State Transition Matrix

In **UNO_ERP**, all tours move sequentially across 5 core operational stages. Every status advancement is protected by an automated **Status Gate** (`TourStatusCheckpointsController` & `TourCheckpointWidget`). 

If any mandatory checkpoint is unsatisfied, the **Status Gate** blocks progression, displays `X BLOCKED` in amber/red, and disables the **"Advance to..."** action button.

| Status ID | Status Name | Kanban Stage | Primary Business Purpose | Next Target Status | Gate Key Checkpoints |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **`Draft`** | In Planning | Initial creation & itinerary draft | **Proposal (2)** | Project Code, Destination, Pax count, Date boundaries |
| **2** | **`Proposal`** | Quoting / B2B | Commercial offer sent to client | **Confirmed (3)** | Hotel, Guide, Transport, Base Package Fee (€) |
| **3** | **`Confirmed`** | Locked / Pre-Tour | Guaranteed departure, logistics ready | **In Progress (4)** | Arrival Date reached, Flight manifest verified |
| **4** | **`In Progress`** | Active on Ground | Tour executing, daily guide operations | **Completed (5)** | Return Date reached, Services logged, Accounting Closed |
| **5** | **`Completed`** | Archival / Audited | Finalized operations & locked accounting | *Terminal State* | All financial audits and remittances sealed |
| **6** | **`Cancelled`** | Exception | Cancelled departure & supplier penalties | *Terminal State* | Cancellation reason recorded in AuditLogs |

---', N'/tours', N'Tour Status Kanban & Gates', 1, N'2026-09-17T07:52:58.152Z', N'2026-10-25T18:37:52.101Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (431, N'DocumentationRepo', N'05_Tour_Statuses_and_Checkpoints.md', N'Tours', N'Statuses & Gates', N'Tour status transition criteria
What are automated tour status checkpoints?
What are the mandatory tour status checkpoints and how to resolve blockers to advance status?
Why is my tour status blocked?
Pricing / package fee not calculated
How to advance to Confirmed?', N'How to 🧭 2. how to read the status gate widget (`tourcheckpointwidget`)?', N'how, read, the, status, gate, widget, tourcheckpointwidget, tour, statuses, resolution, checkpoint, specifications, checkpoints, blockers, advance, button, draft, proposal, confirmed, progress, completed, pricing, package, fee, not, calculated, 05_tour_statuses_and_checkpoints, appears, top, detail', N'### 🧭 2. How to Read the Status Gate Widget (`TourCheckpointWidget`)

The widget appears at the top of the **Tour Detail Page** (`/projects/[id]/tours/[tourId]`):

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ Status Gate Readiness  [ 1 BLOCKED ]  Current: Proposal ➔ Target: Confirmed        │
│                                                   [ ➔ Advance to Confirmed (Disabled) ]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [✓] Hotel Reservations Confirmed       [✓] Guide Assignment Confirmed                  │
│     Hotel reservations confirmed           Primary guide assigned & contract locked    │
│                                                                                        │
│ [✓] Transportation & Coach Locked      [✕] Client Contract & Deposit Received REQUIRED │
│     Transport company/driver assigned      Pricing / package fee not calculated        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **`GATE READY` (Green Badge):** All mandatory checkpoints satisfied (`canAdvance: true`). The blue **"Advance to [Target]"** button is enabled and clickable.
- **`N BLOCKED` (Amber/Red Badge):** One or more mandatory checkpoints are failing (`canAdvance: false`). The **"Advance to..."** button is disabled.
- **Click to Expand/Collapse:** Clicking the header bar expands the checklist showing each checkpoint, its requirement status, and the exact failure reason.

---', N'/tours', N'Tour Status Kanban & Gates', 1, N'2026-09-17T07:52:58.153Z', N'2026-10-25T18:37:52.101Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (432, N'DocumentationRepo', N'05_Tour_Statuses_and_Checkpoints.md', N'Tours', N'Statuses & Gates', N'Tour status transition criteria
What are automated tour status checkpoints?
What are the mandatory tour status checkpoints and how to resolve blockers to advance status?
Why is my tour status blocked?
Pricing / package fee not calculated
How to advance to Confirmed?', N'How to 🔹 gate 1: `draft` ➔ `proposal` (target status id: 2)?', N'gate, draft, proposal, target, status, tour, statuses, resolution, checkpoint, specifications, checkpoints, blockers, advance, button, confirmed, progress, completed, pricing, package, fee, not, calculated, 05_tour_statuses_and_checkpoints, business, goal, validate, core, itinerary, structure, and', N'### 🔹 Gate 1: `Draft` ➔ `Proposal` (Target Status ID: 2)

* **Business Goal:** Validate core itinerary structure and passenger counts before releasing quotation to client.

#### Checkpoints & Rules:
1. **Project & Destination Defined (`PROJECT_DEFINED`) - [MANDATORY]**:
   - **Backend Check:** `tour.ProjectId > 0 && !string.IsNullOrEmpty(tour.Destination)`
   - **Where to Find in UI:** Tour Detail Page ➔ **Tour Information** card ➔ Click **Edit**.
   - **How to Complete:** Enter **Destination** (e.g. `Budapest, Vienna, Prague`), set **Arrival Date** and **End Date** (`EndDate > ArrivalDate`), ensure **Adults** $\ge 1$, and click **Save Changes**.
   - **Advance:** When green, click **"Advance to Proposal"**.

---', N'/tours', N'Tour Status Kanban & Gates', 1, N'2026-09-17T07:52:58.154Z', N'2026-10-25T18:37:52.102Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (433, N'DocumentationRepo', N'05_Tour_Statuses_and_Checkpoints.md', N'Tours', N'Statuses & Gates', N'Tour status transition criteria
What are automated tour status checkpoints?
What are the mandatory tour status checkpoints and how to resolve blockers to advance status?
Why is my tour status blocked?
Pricing / package fee not calculated
How to advance to Confirmed?', N'How to 🔹 gate 2: `proposal` ➔ `confirmed` (target status id: 3)?', N'gate, proposal, confirmed, target, status, tour, statuses, resolution, checkpoint, specifications, checkpoints, blockers, advance, button, draft, progress, completed, pricing, package, fee, not, calculated, 05_tour_statuses_and_checkpoints, business, goal, lock, all, supplier, bookings, hotel', N'### 🔹 Gate 2: `Proposal` ➔ `Confirmed` (Target Status ID: 3)

* **Business Goal:** Lock all supplier bookings (Hotel, Guide, Bus) and secure financial commercial terms before committing to execution.

#### Checkpoints & Rules:
1. **Client Contract & Deposit Received (`CLIENT_DEPOSIT_CONFIRMED`) - [MANDATORY]**:
   - **Backend Check:** `tour.TotalFee > 0 || tour.BaseFee > 0 || hasInvoicedFeeService`
   - **Failure Reason:** `"Pricing / package fee not calculated"`
   - **Where to Find in UI:** 
     - Method A: **Tour Info** tab ➔ **Tour Information** card ➔ Click **Edit** ➔ **Base Fee (€)**.
     - Method B: **Services** tab ➔ **Services Revenue** ➔ Click **+ Invoiced Fee**.
   - **How to Complete:** Enter the agreed per-passenger package price (e.g. `€150` or `€250`). Save changes. The gate immediately switches to green (`"Client contract active & package pricing locked"`).
2. **Hotel Reservations Confirmed (`HOTEL_RESERVATIONS_CONFIRMED`) - [MANDATORY]**:
   - **Backend Check:** At least 1 Hotel service assigned (`tour.TourServices.Any(s => s.HotelId != null || s.ServiceCategory.Name == "Hotel")`).
   - **Where to Find in UI:** **Services** tab (`tab=services`).
   - **How to Complete:** Click **+ Add Service**, select Category **Hotel**, pick hotel, enter room nights/rate, click **Save Service**.
3. **Guide Assignment Confirmed (`GUIDE_ASSIGNED_CONFIRMED`) - [MANDATORY]**:
   - **Backend Check:** Primary guide assigned (`tour.TourServices.Any(s => s.GuideId != null || s.ServiceCategory.Name == "Guide")`).
   - **Where to Find in UI:** **Tour Information** card (Dropdown **Primary Guide**) OR **Services** tab ➔ **+ Add Service** ➔ Category **Guide**.
   - **How to Complete:** Assign a guide from master data and click Save.
4. **Transportation & Coach Locked (`TRANSPORT_CONFIRMED`) - [MANDATORY]**:
   - **Backend Check:** Transport company or driver assigned (`tour.TourServices.Any(s => s.DriverId != null || s.TransportCompanyId != null || s.ServiceCategory.Name == "Transport")`).
   - **Where to Find in UI:** **Services** tab (`tab=services`).
   - **How to Complete:** Click **+ Add Service**, select Category **Transport** or **Driver**, pick company/driver, click **Save Service**.
   - **Advance:** When all 4 show green checkmarks, click **"Advance to Confirmed"**.

---', N'/tours', N'Tour Status Kanban & Gates', 1, N'2026-09-17T07:52:58.154Z', N'2026-10-25T18:37:52.103Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (434, N'DocumentationRepo', N'05_Tour_Statuses_and_Checkpoints.md', N'Tours', N'Statuses & Gates', N'Tour status transition criteria
What are automated tour status checkpoints?
What are the mandatory tour status checkpoints and how to resolve blockers to advance status?
Why is my tour status blocked?
Pricing / package fee not calculated
How to advance to Confirmed?', N'How to 🔹 gate 3: `confirmed` ➔ `in progress` (target status id: 4)?', N'gate, confirmed, progress, target, status, tour, statuses, resolution, checkpoint, specifications, checkpoints, blockers, advance, button, draft, proposal, completed, pricing, package, fee, not, calculated, 05_tour_statuses_and_checkpoints, business, goal, verify, that, the, has, landed', N'### 🔹 Gate 3: `Confirmed` ➔ `In Progress` (Target Status ID: 4)

* **Business Goal:** Verify that the tour has landed on the ground and live operations have started.

#### Checkpoints & Rules:
1. **Arrival Date Reached (`ARRIVAL_DATE_REACHED`) - [MANDATORY]**:
   - **Backend Check:** `DateTime.UtcNow >= tour.ArrivalDate`
   - **Failure Reason:** `"Arrival date is in the future (DD MMM YYYY)"`
   - **Where to Find & How to Complete:** Unlocks automatically on departure day. *(For UAT simulation: click **Edit** on Tour Info and set Arrival Date to today or a past date).*
2. **Flight Manifest Verified (`FLIGHT_MANIFEST_VERIFIED`) - [MANDATORY]**:
   - **Backend Check:** `!string.IsNullOrEmpty(tour.ArrivalFlight)`
   - **Failure Reason:** `"Arrival flight number missing"`
   - **Where to Find in UI:** **Tour Information** card ➔ **Edit** ➔ **Flight Information** section.
   - **How to Complete:** Enter inbound flight number in **Arrival Flight** (e.g. `TK 1821`), and click **Save Changes**.
   - **Advance:** When both checkmarks are green, click **"Advance to In Progress"**.

---', N'/tours', N'Tour Status Kanban & Gates', 1, N'2026-09-17T07:52:58.155Z', N'2026-10-25T18:37:52.103Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (435, N'DocumentationRepo', N'05_Tour_Statuses_and_Checkpoints.md', N'Tours', N'Statuses & Gates', N'Tour status transition criteria
What are automated tour status checkpoints?
What are the mandatory tour status checkpoints and how to resolve blockers to advance status?
Why is my tour status blocked?
Pricing / package fee not calculated
How to advance to Confirmed?', N'How to 🔹 gate 4: `in progress` ➔ `completed` (target status id: 5)?', N'gate, progress, completed, target, status, tour, statuses, resolution, checkpoint, specifications, checkpoints, blockers, advance, button, draft, proposal, confirmed, pricing, package, fee, not, calculated, 05_tour_statuses_and_checkpoints, business, goal, conclude, operations, verify, guest, departure', N'### 🔹 Gate 4: `In Progress` ➔ `Completed` (Target Status ID: 5)

* **Business Goal:** Conclude tour operations, verify guest departure, reconcile supplier invoices, and audit the tour ledger.

#### Checkpoints & Rules:
1. **Return Date Reached (`RETURN_DATE_REACHED`) - [MANDATORY]**:
   - **Backend Check:** `DateTime.UtcNow >= tour.EndDate`
   - **Failure Reason:** `"Departure date is in the future (DD MMM YYYY)"`
   - **Where to Find & How to Complete:** Unlocks automatically when tour finishes. *(For UAT simulation: adjust End Date to today/past in Edit Tour).*
2. **Revenue & Expense Reconciled (`REVENUE_EXPENSE_RECONCILED`) - [MANDATORY]**:
   - **Backend Check:** `tour.TourServices.Any()`
   - **Failure Reason:** `"No services or invoice entries found"`
   - **Where to Find & How to Complete:** Ensure at least 1 service entry exists in the tour under **Services** tab.
3. **Accounting Closed (`ACCOUNTING_CLOSED`) - [MANDATORY]**:
   - **Backend Check:** `tour.AccountingClosed == true`
   - **Failure Reason:** `"Accounting audit flag is unset (Accounting Open)"`
   - **Where to Find in UI:** **Tour Information** card ➔ **Edit** OR **Finance** tab.
   - **How to Complete:** Check the checkbox **"Accounting Closed / Locked"** and click **Save Changes**.
   - **Advance:** When all 3 pass, click **"Advance to Completed"** to archive and seal accounts.

---', N'/tours', N'Tour Status Kanban & Gates', 1, N'2026-09-17T07:52:58.156Z', N'2026-10-25T18:37:52.104Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (436, N'DocumentationRepo', N'05_Tour_Statuses_and_Checkpoints.md', N'Tours', N'Statuses & Gates', N'Tour status transition criteria
What are automated tour status checkpoints?
What are the mandatory tour status checkpoints and how to resolve blockers to advance status?
Why is my tour status blocked?
Pricing / package fee not calculated
How to advance to Confirmed?', N'How to ⏰ 4. automated sla warnings windows?', N'automated, sla, warnings, windows, tour, statuses, gate, resolution, checkpoint, specifications, status, checkpoints, blockers, advance, button, draft, proposal, confirmed, progress, completed, pricing, package, fee, not, calculated, 05_tour_statuses_and_checkpoints, the, system, continuously, scans', N'### ⏰ 4. Automated SLA Warnings Windows

The system continuously scans departures:
- **7 Days Prior:** Missing Hotel or Transport (`⚠️ WARNING ALERT: Missing Hotel/Bus 7d`)
- **3 Days Prior:** Missing Guide assignment (`⚠️ WARNING ALERT: Missing Guide 3d`)
- **24 Hours Prior:** Missing Flight Manifest (`🚨 CRITICAL ALERT: Incomplete Manifest 24h`)
- **7 Days Post-Tour:** Unclosed Accounting (`⚠️ ACCOUNTING ALERT: Unclosed Accounting 7d`)

---', N'/tours', N'Tour Status Kanban & Gates', 1, N'2026-09-17T07:52:58.156Z', N'2026-10-25T18:37:52.104Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (437, N'DocumentationRepo', N'05_Tour_Statuses_and_Checkpoints.md', N'Tours', N'Statuses & Gates', N'Tour status transition criteria
What are automated tour status checkpoints?
What are the mandatory tour status checkpoints and how to resolve blockers to advance status?
Why is my tour status blocked?
Pricing / package fee not calculated
How to advance to Confirmed?', N'How to 🤖 5. ai copilot agent diagnostic queries?', N'copilot, agent, diagnostic, queries, tour, statuses, gate, resolution, checkpoint, specifications, status, checkpoints, blockers, advance, button, draft, proposal, confirmed, progress, completed, pricing, package, fee, not, calculated, 05_tour_statuses_and_checkpoints, user, prompt, action, guidance', N'### 🤖 5. AI Copilot Agent Diagnostic Queries

| User Prompt | AI Copilot Action & Guidance |
| :--- | :--- |
| *"Why is my tour status blocked?"* | Query `GET /api/TourStatusCheckpoints/evaluate/{tourId}`, list failed checks, and guide user step-by-step. |
| *"Pricing / package fee not calculated"* | Direct user to enter **Base Fee (€)** in **Tour Info ➔ Edit** or add an **Invoiced Fee** service. |
| *"How to advance to Confirmed?"* | Remind user to verify Hotel, Guide, Transport, and Base Package Fee. |
| *"How to close a tour?"* | Guide user to reconcile invoices, check **Accounting Closed**, and advance to **Completed**. |', N'/tours', N'Tour Status Kanban & Gates', 1, N'2026-09-17T07:52:58.157Z', N'2026-10-25T18:37:52.105Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (438, N'ProcessFlow', N'05_Tour_Statuses_and_Checkpoints.md', N'Tours', N'Statuses & Gates', N'Tour status transition criteria
What are automated tour status checkpoints?
What are the mandatory tour status checkpoints and how to resolve blockers to advance status?
Why is my tour status blocked?
Pricing / package fee not calculated
How to advance to Confirmed?
How to close a tour?', N'What are the mandatory tour status checkpoints and how to resolve blockers to advance status?', N'status, statuses, gate, gates, blocked, checkpoint, checkpoints, transition, advance, draft, proposal, confirmed, in progress, completed, client_deposit_confirmed, pricing package fee not calculated, invoiced fee, base fee, hotel, guide, transport', N'**Tour Status Lifecycle & Checkpoint Resolution Guide**:

Tours advance sequentially across 5 stages, protected by automated **Status Gates** (`TourCheckpointWidget`):

1. **Draft ➔ Proposal (Gate 1)**:
   • *Project & Destination Defined*: Ensure Destination is non-empty and dates are valid (`EndDate > ArrivalDate`). Completed in **Tour Info ➔ Edit**.

2. **Proposal ➔ Confirmed (Gate 2)**:
   • *Hotel Reservations Confirmed*: Assign at least 1 Hotel service in **Services** tab.
   • *Guide Assignment Confirmed*: Assign Primary Guide in **Tour Info** or add Guide service in **Services** tab.
   • *Transportation Locked*: Assign Transport Company or Driver in **Services** tab.
   • *Client Contract & Deposit Received*: If blocked with *"Pricing / package fee not calculated"*, enter **Base Fee (€)** in **Tour Info ➔ Edit** or add an **Invoiced Fee** service under Services Revenue.

3. **Confirmed ➔ In Progress (Gate 3)**:
   • *Arrival Date Reached*: Automatically unlocks on the departure date.
   • *Flight Manifest Verified*: Enter arrival flight number (e.g. `TK 1821`) under **Tour Info ➔ Edit ➔ Flight Information**.

4. **In Progress ➔ Completed (Gate 4)**:
   • *Return Date Reached*: Unlocks after the tour end date.
   • *Revenue & Expense Reconciled*: Ensure services and supplier costs are recorded.
   • *Accounting Closed*: Check **"Accounting Closed / Locked"** in **Tour Info ➔ Edit**.

When all checks show green checkmarks, the badge changes to **`GATE READY`** and the blue **Advance to...** button activates.', N'/tours', N'Open Tours Grid', 1, N'2026-09-22T16:53:46.081Z', N'2026-10-25T18:37:51.962Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (439, N'DocumentationRepo', N'01_Tours_Creation_and_Rooming_List.md', N'Tours', N'Rooming List', N'How to import passenger rooming lists, booking codes and pax types?
How to create a new tour manually?
How does rooming list import work?
What are the rules for Adult, Child, and Infant pax types?
How are family booking groups assigned to rooms?', N'How to 💡 executive summary & core purpose?', N'executive, summary, core, purpose, tour, creation, rooming, list, ingestion, passenger, pax, types, tours, adult, child, infant, chd, badge, booking, ref, room, numbers, family, groups, 01_tours_creation_and_rooming_list, are, the, fundamental, operational, departures', N'### 💡 Executive Summary & Core Purpose

Tours are the fundamental operational departures in **UNO ERP**. Each Tour represents a specific departure date, itinerary route, and passenger group (e.g. `PVB05072026` departing July 5, 2026 for Prague-Vienna-Budapest).

Every tour is bound to a parent **Project** and begins its operational life cycle in **`Draft`** status.

---', N'/tours', N'View Tours & Rooming', 1, N'2026-09-22T16:53:46.219Z', N'2026-10-25T18:37:52.043Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (440, N'DocumentationRepo', N'01_Tours_Creation_and_Rooming_List.md', N'Tours', N'Rooming List', N'How to import passenger rooming lists, booking codes and pax types?
How to create a new tour manually?
How does rooming list import work?
What are the rules for Adult, Child, and Infant pax types?
How are family booking groups assigned to rooms?', N'How to 🔹 1. manual creation via web ui?', N'manual, creation, via, web, tour, rooming, list, ingestion, passenger, pax, types, tours, adult, child, infant, chd, badge, booking, ref, room, numbers, family, groups, 01_tours_creation_and_rooming_list, navigate, the, left, sidebar, click, blue', N'### 🔹 1. Manual Creation via Web UI

1. Navigate to **[Tours](/tours)** in the left sidebar.
2. Click the blue **`+ Add Tour`** button at the top right.
3. Fill in:
   - **Tour Code**: Unique identifier (e.g. `Tour1`, `BVP28082026`).
   - **Destination**: Itinerary route (e.g. `Prague-Vienna-Budapest`).
   - **Arrival & End Dates**: Must satisfy `EndDate > ArrivalDate`.
   - **Parent Project**: Select an active project from the dropdown.
   - **Flight Information**: Optional arrival/departure flights.
4. Click **`Save Tour`**. Upon creation, the tour is automatically assigned `TourStatusId = 1` (**`Draft`**).', N'/tours', N'View Tours & Rooming', 1, N'2026-09-22T16:53:46.221Z', N'2026-10-25T18:37:52.044Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (441, N'DocumentationRepo', N'01_Tours_Creation_and_Rooming_List.md', N'Tours', N'Rooming List', N'How to import passenger rooming lists, booking codes and pax types?
How to create a new tour manually?
How does rooming list import work?
What are the rules for Adult, Child, and Infant pax types?
How are family booking groups assigned to rooms?', N'How to 🔹 2. automated ingestion via rooming list import (`rooming_import_template.xlsx`)?', N'automated, ingestion, via, rooming, list, import, rooming_import_template, xlsx, tour, creation, passenger, pax, types, tours, adult, child, infant, chd, badge, booking, ref, room, numbers, family, groups, 01_tours_creation_and_rooming_list, format, your, file, according', N'### 🔹 2. Automated Ingestion via Rooming List Import (`Rooming_import_template.xlsx`)

1. Format your file according to filename conventions: `{ProjectName}_{TourCode}_rooming.xlsx` (or `{TourCode}_rooming.xlsx`).
2. Navigate to **Tours** $\rightarrow$ Click **`Import Rooming List`**.
3. Select and upload your `.xlsx` file.
4. The system executes dual ingestion:
   - **Tours Sheet**: Instantiates the tour record with `Status = Draft`.
   - **Rooming Sheet**: Ingests all passenger records, booking codes (`BKG-01` to `BKG-15`), room numbers (`101`, `102`), and pax types.

---', N'/tours', N'View Tours & Rooming', 1, N'2026-09-22T16:53:46.222Z', N'2026-10-25T18:37:52.045Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (442, N'DocumentationRepo', N'01_Tours_Creation_and_Rooming_List.md', N'Tours', N'Rooming List', N'How to import passenger rooming lists, booking codes and pax types?
How to create a new tour manually?
How does rooming list import work?
What are the rules for Adult, Child, and Infant pax types?
How are family booking groups assigned to rooms?', N'How to 🚦 initial tour status rule?', N'initial, tour, status, rule, creation, rooming, list, ingestion, passenger, pax, types, tours, adult, child, infant, chd, badge, booking, ref, room, numbers, family, groups, 01_tours_creation_and_rooming_list, important, draft, default, every, newly, created', N'### 🚦 Initial Tour Status Rule

> [!IMPORTANT]
> **Draft Default Rule**: Every newly created or imported tour strictly starts in **`Draft` (`TourStatusId = 1`)**. It cannot jump directly to `Confirmed` or `Completed` without passing through mandatory **Status Checkpoints** (such as guide assignment, hotel confirmation, and pricing validation).', N'/tours', N'View Tours & Rooming', 1, N'2026-09-22T16:53:46.223Z', N'2026-10-25T18:37:52.047Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (443, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'Tours', N'Financial Logic', N'Explain revenue vs base vs operational expenses vs net tour margin calculations.
How to assign guides and calculate the strict 10% guide commission on excursion sales?
How is guide commission calculated?
Why is guide commission €0.00?
How to set up hotel pricing basis (Pax vs Room) and calculate nightly rates?
How is hotel cost calculated or why hotel calculation is wrong?', N'How to 💡 executive summary & financial architecture?', N'executive, summary, financial, architecture, tour, services, costing, guide, commission, net, profit, margin, logic, revenue, base, fee, excursion, sales, rule, hotel, pricing, pax, basis, room, city, tax, formula, 02_tour_services_and_financial_logic, uno, erp', N'### 💡 Executive Summary & Financial Architecture

**UNO ERP** categorizes tour finances into 4 distinct buckets to provide real-time margin tracking and enforce operational governance:

```mermaid
flowchart LR
    A["Total Tour Revenue (Base Tour Fees + Excursion Sales)"] --> B["Gross Income"]
    B --> C["Minus Base Services (Agency Fees, City Tax)"]
    C --> D["Minus Operational Expenses (Hotels, Transport, Guides)"]
    D --> E["Minus Guide Commission (Strictly 10% of Excursions)"]
    E --> F["Equals Net Tour Margin (€ / %)"]
```

---', N'/tours', N'View Tour Costing & Services', 1, N'2026-09-22T16:53:46.239Z', N'2026-10-25T18:37:52.055Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (444, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'Tours', N'Financial Logic', N'Explain revenue vs base vs operational expenses vs net tour margin calculations.
How to assign guides and calculate the strict 10% guide commission on excursion sales?
How is guide commission calculated?
Why is guide commission €0.00?
How to set up hotel pricing basis (Pax vs Room) and calculate nightly rates?
How is hotel cost calculated or why hotel calculation is wrong?', N'How to 1. revenue (`gross income`)?', N'revenue, gross, income, tour, services, costing, guide, commission, net, profit, margin, logic, financial, base, fee, excursion, sales, rule, hotel, pricing, pax, basis, room, city, tax, formula, 02_tour_services_and_financial_logic, fixed, contract, amount', N'### 1. Revenue (`Gross Income`)

* **Base Tour Fee (€)**: Fixed contract amount collected per passenger or as an overall package fee.
* **Excursion Sales (€)**: Gross cash collected from optional excursions sold to passengers on location (e.g. Dresden Tour, Mozart Concert, Danube Cruise).', N'/tours', N'View Tour Costing & Services', 1, N'2026-09-22T16:53:46.240Z', N'2026-10-25T18:37:52.056Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (445, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'Tours', N'Financial Logic', N'Explain revenue vs base vs operational expenses vs net tour margin calculations.
How to assign guides and calculate the strict 10% guide commission on excursion sales?
How is guide commission calculated?
Why is guide commission €0.00?
How to set up hotel pricing basis (Pax vs Room) and calculate nightly rates?
How is hotel cost calculated or why hotel calculation is wrong?', N'How to 2. base services (`core contract inclusions`)?', N'base, services, core, contract, inclusions, tour, costing, guide, commission, net, profit, margin, logic, financial, revenue, fee, excursion, sales, rule, hotel, pricing, pax, basis, room, city, tax, formula, 02_tour_services_and_financial_logic, agency, fees', N'### 2. Base Services (`Core Contract Inclusions`)

* **Agency Fees**: Contracted agency handling fees.
* **City Tax**: Municipal tourist taxes collected per person per night across cities.', N'/tours', N'View Tour Costing & Services', 1, N'2026-09-22T16:53:46.241Z', N'2026-10-25T18:37:52.056Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (446, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'Tours', N'Financial Logic', N'Explain revenue vs base vs operational expenses vs net tour margin calculations.
How to assign guides and calculate the strict 10% guide commission on excursion sales?
How is guide commission calculated?
Why is guide commission €0.00?
How to set up hotel pricing basis (Pax vs Room) and calculate nightly rates?
How is hotel cost calculated or why hotel calculation is wrong?', N'How to 3. operational expenses (`vendor direct costs`)?', N'operational, expenses, vendor, direct, costs, tour, services, costing, guide, commission, net, profit, margin, logic, financial, revenue, base, fee, excursion, sales, rule, hotel, pricing, pax, basis, room, city, tax, formula, 02_tour_services_and_financial_logic', N'### 3. Operational Expenses (`Vendor Direct Costs`)

* **Hotel Accommodation**: Room night costs charged by contracted hotels.
* **Transport / Bus Fees**: Daily coach rates charged by transport companies.
* **Guide Daily Fees**: Base daily wages paid to assigned tour guides.
* **Excursion Vendor Ticket Costs**: Admission and entrance tickets paid to third-party attractions.', N'/tours', N'View Tour Costing & Services', 1, N'2026-09-22T16:53:46.242Z', N'2026-10-25T18:37:52.057Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (447, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'Tours', N'Financial Logic', N'Explain revenue vs base vs operational expenses vs net tour margin calculations.
How to assign guides and calculate the strict 10% guide commission on excursion sales?
How is guide commission calculated?
Why is guide commission €0.00?
How to set up hotel pricing basis (Pax vs Room) and calculate nightly rates?
How is hotel cost calculated or why hotel calculation is wrong?', N'How to 1. `pax basis` (per person / night)?', N'pax, basis, per, person, night, tour, services, costing, guide, commission, net, profit, margin, logic, financial, revenue, base, fee, excursion, sales, rule, hotel, pricing, room, city, tax, formula, 02_tour_services_and_financial_logic, used, when', N'### 1. `Pax Basis` (Per Person / Night)

Used when the hotel bills per guest:
$$\text{Total Cost} = (\text{Pax Count} \times \text{Pax Rate}) \times \text{Nights}$$', N'/tours', N'View Tour Costing & Services', 1, N'2026-09-22T16:53:46.244Z', N'2026-10-25T18:37:52.059Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (448, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'Tours', N'Financial Logic', N'Explain revenue vs base vs operational expenses vs net tour margin calculations.
How to assign guides and calculate the strict 10% guide commission on excursion sales?
How is guide commission calculated?
Why is guide commission €0.00?
How to set up hotel pricing basis (Pax vs Room) and calculate nightly rates?
How is hotel cost calculated or why hotel calculation is wrong?', N'How to 2. `room basis` (per room / night)?', N'room, basis, per, night, tour, services, costing, guide, commission, net, profit, margin, logic, financial, revenue, base, fee, excursion, sales, rule, hotel, pricing, pax, city, tax, formula, 02_tour_services_and_financial_logic, used, when, the', N'### 2. `Room Basis` (Per Room / Night)

Used when the hotel bills per room type occupied:
$$\text{Total Cost} = \left(\text{Single} \times \text{SingleRate} + \text{Double} \times \text{DoubleRate} + \text{Twin} \times \text{TwinRate} + \text{Triple} \times \text{TripleRate}\right) \times \text{Nights}$$

---', N'/tours', N'View Tour Costing & Services', 1, N'2026-09-22T16:53:46.245Z', N'2026-10-25T18:37:52.060Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (449, N'DocumentationRepo', N'02_Tour_Services_and_Financial_Logic.md', N'Tours', N'Financial Logic', N'Explain revenue vs base vs operational expenses vs net tour margin calculations.
How to assign guides and calculate the strict 10% guide commission on excursion sales?
How is guide commission calculated?
Why is guide commission €0.00?
How to set up hotel pricing basis (Pax vs Room) and calculate nightly rates?
How is hotel cost calculated or why hotel calculation is wrong?', N'How to 🛠️ troubleshooting financial inquiries?', N'troubleshooting, financial, inquiries, tour, services, costing, guide, commission, net, profit, margin, logic, revenue, base, fee, excursion, sales, rule, hotel, pricing, pax, basis, room, city, tax, formula, 02_tour_services_and_financial_logic, why, are, expenses', N'### 🛠️ Troubleshooting Financial Inquiries

* **Q: Why are hotel expenses not appearing in the tour services list?**  
  **A**: 
  1. Creating a Hotel in *Master Data* only registers the supplier contract. To attach expenses to a tour, go to **[Projects > Tour Detail](/projects)** and click **+ Add Hotel Stay** under the **Services & Costing** tab.
  2. Ensure the Category filter is set to **"All Categories"** or **"Hotel Stays"**.
  3. If the tour is marked **"Accounting Closed"**, newly added items are suppressed.

* **Q: Why is Guide Commission zero despite assigning a guide?**  
  **A**: Guide Commission applies only to optional excursion sales. If no excursion checkboxes are marked or excursion sales are €0.00, commission is €0.00. The guide''s daily wage is recorded separately under *Guide Daily Fees*.', N'/tours', N'View Tour Costing & Services', 1, N'2026-09-22T16:53:46.247Z', N'2026-10-25T18:37:52.061Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (450, N'DocumentationRepo', N'03_Manual_Entry_vs_Excel_Import_Guide.md', N'Tours', N'Excel Import', N'When should I use manual entry vs Excel import?
Why is the Download Sale File button missing or disabled?
Where can I find the Excel import templates?', N'How to 💡 executive summary & core purpose?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 💡 Executive Summary & Core Purpose

**UNO ERP** supports two complementary ways to manage tour data:
1. **Manual Web UI Entry**: Ideal for single-item adjustments, urgent phone bookings, or ad-hoc service line additions.
2. **Automated Excel File Import**: Optimized for high-volume operations, bulk passenger manifests (30+ pax), and post-tour excursion sales settlements.

---', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.261Z', N'2026-10-25T18:37:52.071Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (451, N'DocumentationRepo', N'03_Manual_Entry_vs_Excel_Import_Guide.md', N'Tours', N'Excel Import', N'When should I use manual entry vs Excel import?
Why is the Download Sale File button missing or disabled?
Where can I find the Excel import templates?', N'How to 🆚 operational comparison: manual entry vs. excel import?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🆚 Operational Comparison: Manual Entry vs. Excel Import

| Operational Task | Manual Web UI Entry | Automated Excel Import | Best Recommended Use |
| :--- | :--- | :--- | :--- |
| **Tour Creation** | Fill modal form in Tours grid $\rightarrow$ Click `Save Tour`. | Upload `{Project}_{Tour}_rooming.xlsx`. | Automated import for full tour packages. |
| **Passenger Rooming** | Add passengers one by one in Bookings tab. | Upload rooming template sheet. | Automated import (saves 45+ minutes per departure). |
| **Excursion Sales** | Check passenger attendance boxes manually in Services tab. | Upload `{Project}_{Tour}_importSales.xlsx`. | Automated import for fast bus group settlement. |
| **Supplier Master Data** | Add suppliers one by one via Master Data modal. | Ingest `MasterData_Import_Template.xlsx`. | Automated import for seasonal contract loading. |

---', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.262Z', N'2026-10-25T18:37:52.072Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (452, N'DocumentationRepo', N'03_Manual_Entry_vs_Excel_Import_Guide.md', N'Tours', N'Excel Import', N'When should I use manual entry vs Excel import?
Why is the Download Sale File button missing or disabled?
Where can I find the Excel import templates?', N'How to 🟢 critical rule: the "download sale file" button prerequisite?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🟢 Critical Rule: The "Download Sale File" Button Prerequisite

> [!IMPORTANT]
> **Passenger Prerequisite Rule**: The green **`Download Sale File`** button on the Bookings tab will **ONLY** appear once the passenger rooming list has been uploaded (`allPassengers.length > 0`). 
> - If no passengers exist for the tour, the button is deliberately hidden.
> - Once rooming data is imported, the button activates, allowing you to download an Excel sheet pre-populated with passenger names and checkboxes ready for on-bus sales recording.

---', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.262Z', N'2026-10-25T18:37:52.073Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (453, N'DocumentationRepo', N'03_Manual_Entry_vs_Excel_Import_Guide.md', N'Tours', N'Excel Import', N'When should I use manual entry vs Excel import?
Why is the Download Sale File button missing or disabled?
Where can I find the Excel import templates?', N'How to 📂 standardized import file locations & templates?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 📂 Standardized Import File Locations & Templates

All standardized templates are located under: `UserManuals/ImportFiles/20260828/`
1. **`Rooming_import_template.xlsx`**: Tours and passenger rooming manifests.
2. **`Sales_import_template.xlsx`**: Pre-formatted excursion sales lines.
3. **`MasterData_Import_Template.xlsx`**: Hotels, Guides, Transport Companies, and Drivers.', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.264Z', N'2026-10-25T18:37:52.074Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (454, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Tours', N'Excel Import', N'How can I import sales excel file and rooming lists?
How to import a new tour, new project, or rooming list via Excel template?
What are the 5 Excel import scenarios?
What is Scenario 1: New Tour & New Project?
What is Scenario 2: New Tour for Existing Project?
What is Scenario 3: Refresh Rooming Data?
What is Scenario 4: Import Master Data?
What is Scenario 5: Import Excursion Sales?
What filename conventions are required for Excel import?', N'How to 💡 executive summary & core purpose?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 💡 Executive Summary & Core Purpose

**UNO ERP** features an intelligent Excel ingestion pipeline that parses multi-sheet workbooks to instantiate projects, configure departures, populate passenger manifests, and reconcile optional excursion sales.

Following exact **filename notations** and **sheet structures** guarantees zero import errors and seamless data linkage.

---', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.272Z', N'2026-10-25T18:37:52.080Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (455, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Tours', N'Excel Import', N'How can I import sales excel file and rooming lists?
How to import a new tour, new project, or rooming list via Excel template?
What are the 5 Excel import scenarios?
What is Scenario 1: New Tour & New Project?
What is Scenario 2: New Tour for Existing Project?
What is Scenario 3: Refresh Rooming Data?
What is Scenario 4: Import Master Data?
What is Scenario 5: Import Excursion Sales?
What filename conventions are required for Excel import?', N'How to 🔹 sheet 1: `tours` (or `tour`, `tourdata`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet 1: `Tours` (or `Tour`, `TourData`)

* **Col A**: `Tour Code` (e.g. `Tour1` or `BVP28082026`) *[Required]*
* **Col B**: `Project Code / Name` (e.g. `Project1` or `Orta Avrupa BVP`)
* **Col C**: `Destination` (e.g. `Prague-Vienna-Budapest`)
* **Col D**: `Arrival Date` (Format: `dd/mm/yyyy` or `dd.mm.yyyy`)
* **Col E**: `End Date` (Format: `dd/mm/yyyy` or `dd.mm.yyyy`)
* **Cols F-I**: `Adults`, `Children`, `Infants`, `Pax`', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.275Z', N'2026-10-25T18:37:52.082Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (456, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Tours', N'Excel Import', N'How can I import sales excel file and rooming lists?
How to import a new tour, new project, or rooming list via Excel template?
What are the 5 Excel import scenarios?
What is Scenario 1: New Tour & New Project?
What is Scenario 2: New Tour for Existing Project?
What is Scenario 3: Refresh Rooming Data?
What is Scenario 4: Import Master Data?
What is Scenario 5: Import Excursion Sales?
What filename conventions are required for Excel import?', N'How to 🔹 sheet 2: `projects` (or `project`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet 2: `Projects` (or `Project`)

* **Col A**: `Project Code / Name` (e.g. `Project1`)
* **Col B**: `Client Name` (e.g. `UNO DMC`, `Orta Avrupa BVP`)', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.275Z', N'2026-10-25T18:37:52.083Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (457, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Tours', N'Excel Import', N'How can I import sales excel file and rooming lists?
How to import a new tour, new project, or rooming list via Excel template?
What are the 5 Excel import scenarios?
What is Scenario 1: New Tour & New Project?
What is Scenario 2: New Tour for Existing Project?
What is Scenario 3: Refresh Rooming Data?
What is Scenario 4: Import Master Data?
What is Scenario 5: Import Excursion Sales?
What filename conventions are required for Excel import?', N'How to 🔹 sheet 3: `rooming` (or `rooms`, `passengers`)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet 3: `Rooming` (or `Rooms`, `Passengers`)

* **Col A**: `Passenger Full Name` (e.g. `John Doe`)
* **Col B**: `Gender` (`M` / `F`)
* **Col C**: `Pax Type` (`Adult` [12+ yrs], `Child` [<12 yrs], `Infant`)
* **Col D**: `Booking Ref` (e.g. `BKG-01`, `BKG-02`)
* **Col E**: `Room Number` (e.g. `101`, `102`)
* **Col F**: `Room Type` (`Single`, `Double`, `Twin`, `Triple`)', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.276Z', N'2026-10-25T18:37:52.084Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (458, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Tours', N'Excel Import', N'How can I import sales excel file and rooming lists?
How to import a new tour, new project, or rooming list via Excel template?
What are the 5 Excel import scenarios?
What is Scenario 1: New Tour & New Project?
What is Scenario 2: New Tour for Existing Project?
What is Scenario 3: Refresh Rooming Data?
What is Scenario 4: Import Master Data?
What is Scenario 5: Import Excursion Sales?
What filename conventions are required for Excel import?', N'How to 🔹 sheet 4: `hotels` (master data file)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Sheet 4: `Hotels` (Master Data File)

* Hotel Name, Location, Star Rating, Contact Email/Phone, Nightly Room & Pax Rates, Pricing Basis (`Pax` vs `Room`).

---', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.277Z', N'2026-10-25T18:37:52.085Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (459, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Tours', N'Excel Import', N'How can I import sales excel file and rooming lists?
How to import a new tour, new project, or rooming list via Excel template?
What are the 5 Excel import scenarios?
What is Scenario 1: New Tour & New Project?
What is Scenario 2: New Tour for Existing Project?
What is Scenario 3: Refresh Rooming Data?
What is Scenario 4: Import Master Data?
What is Scenario 5: Import Excursion Sales?
What filename conventions are required for Excel import?', N'How to 🔹 scenario 1: import a new tour for a new project?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Scenario 1: Import a NEW Tour for a NEW Project

1. Name file: `{ProjectName}_{TourCode}_rooming.xlsx` (e.g. `Project1_Tour1_rooming.xlsx`).
2. Set `Projects` sheet Col A = `Project1`, Col B = `Client Name`.
3. Set `Tours` sheet Col A = `Tour1`, Col B = `Project1`, Col C = destination, Col D = arrival date.
4. List passenger names and room numbers in `Rooming` sheet.
5. Go to **Tours** or **Projects** $\rightarrow$ Click **Import Rooming List** $\rightarrow$ Upload file.
6. **Result**: Creates `Project1` (`Active`), creates `Tour1` in **`Draft`** status, and attaches all passenger bookings.', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.278Z', N'2026-10-25T18:37:52.085Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (460, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Tours', N'Excel Import', N'How can I import sales excel file and rooming lists?
How to import a new tour, new project, or rooming list via Excel template?
What are the 5 Excel import scenarios?
What is Scenario 1: New Tour & New Project?
What is Scenario 2: New Tour for Existing Project?
What is Scenario 3: Refresh Rooming Data?
What is Scenario 4: Import Master Data?
What is Scenario 5: Import Excursion Sales?
What filename conventions are required for Excel import?', N'How to 🔹 scenario 2: import a new tour for an existing project?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Scenario 2: Import a NEW Tour for an EXISTING Project

1. Name file: `Project1_Tour2_rooming.xlsx` (matching existing project name `Project1`).
2. Click **Import Rooming List** $\rightarrow$ Upload file.
3. **Result**: Reuses existing `Project1`, instantiates `Tour2` in **`Draft`** status, and binds it under `Project1`.', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.279Z', N'2026-10-25T18:37:52.086Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (461, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Tours', N'Excel Import', N'How can I import sales excel file and rooming lists?
How to import a new tour, new project, or rooming list via Excel template?
What are the 5 Excel import scenarios?
What is Scenario 1: New Tour & New Project?
What is Scenario 2: New Tour for Existing Project?
What is Scenario 3: Refresh Rooming Data?
What is Scenario 4: Import Master Data?
What is Scenario 5: Import Excursion Sales?
What filename conventions are required for Excel import?', N'How to 🔹 scenario 3: refresh rooming data for an existing tour?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Scenario 3: Refresh Rooming Data for an EXISTING Tour

1. Name file: `{TourCode}_rooming.xlsx` (e.g. `Tour1_rooming.xlsx`).
2. Update passenger names, room numbers (`101`, `102`), or booking codes in `Rooming` sheet.
3. Click **Import Rooming List** $\rightarrow$ Upload file.
4. **Result**: Refreshes passenger rooming list and pax counts, while **preserving all existing hotel accommodations, guide assignments, and transport services**.', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.279Z', N'2026-10-25T18:37:52.086Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (462, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Tours', N'Excel Import', N'How can I import sales excel file and rooming lists?
How to import a new tour, new project, or rooming list via Excel template?
What are the 5 Excel import scenarios?
What is Scenario 1: New Tour & New Project?
What is Scenario 2: New Tour for Existing Project?
What is Scenario 3: Refresh Rooming Data?
What is Scenario 4: Import Master Data?
What is Scenario 5: Import Excursion Sales?
What filename conventions are required for Excel import?', N'How to 🔹 scenario 4: import master data (hotels, guides, transport, drivers)?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Scenario 4: Import Master Data (Hotels, Guides, Transport, Drivers)

1. Use `MasterData_Import_Template.xlsx`.
2. Navigate to **[Master Data](/master-data)** $\rightarrow$ Click **Import Master Data** $\rightarrow$ Upload file.
3. **Result**: Ingests new supplier records and contract rates without creating duplicate supplier entries.', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.280Z', N'2026-10-25T18:37:52.087Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (463, N'DocumentationRepo', N'04_Comprehensive_Excel_Import_Master_Guide.md', N'Tours', N'Excel Import', N'How can I import sales excel file and rooming lists?
How to import a new tour, new project, or rooming list via Excel template?
What are the 5 Excel import scenarios?
What is Scenario 1: New Tour & New Project?
What is Scenario 2: New Tour for Existing Project?
What is Scenario 3: Refresh Rooming Data?
What is Scenario 4: Import Master Data?
What is Scenario 5: Import Excursion Sales?
What filename conventions are required for Excel import?', N'How to 🔹 scenario 5: import excursion sales for an existing tour?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 🔹 Scenario 5: Import Excursion Sales for an EXISTING Tour

1. Download template `{ProjectName}_{TourCode}_importSales.xlsx` from Tour Detail page.
2. Mark excursion participation checkboxes (`☑`) for passengers and upload.
3. **Result**: Creates optional excursion sales lines, calculates 10% guide commission, and updates net tour profitability.', N'/master-data?tab=excelImport', N'Open Excel Import Hub', 1, N'2026-09-22T16:53:46.281Z', N'2026-10-25T18:37:52.088Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (464, N'DocumentationRepo', N'06_Tour_Status_Transition_Process_Flows.md', N'Tours', N'Statuses & Gates', N'What are the mandatory tour status checkpoints and how to advance from Draft to Completed?
What are the automated tour status checkpoints?
Why is the Advance to Confirmed button disabled?
How to resolve Gate 2 blockers?
What criteria are required to move from Proposal to Confirmed?
How does Gate 1 Draft to Proposal work?
What is required to complete a tour in Gate 4?', N'How to 💡 executive summary & core purpose?', N'executive, summary, core, purpose, tour, status, forward, transition, specifications, gate, resolution, rules, gates, draft, proposal, confirmed, progress, completed, cancelled, blockers, state, machine, sla, warnings, checkpoints, 06_tour_status_transition_process_flows, uno, erp, every, moves', N'### 💡 Executive Summary & Core Purpose

In **UNO ERP**, every tour moves through a strictly validated forward lifecycle across 5 stages (`Draft` $\rightarrow$ `Proposal` $\rightarrow$ `Confirmed` $\rightarrow$ `In Progress` $\rightarrow$ `Completed`), plus an exception terminal state (`Cancelled`).

Each transition is protected by mandatory **Checkpoint Gates** (`TourStatusCheckpointsController` & `TourCheckpointWidget`) to guarantee operational quality, zero unassigned resources, financial reconciliation, and SLA warning notifications.

---', N'/tours', N'View Status Kanban & Gates', 1, N'2026-09-22T16:53:46.316Z', N'2026-10-25T18:37:52.115Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (465, N'DocumentationRepo', N'06_Tour_Status_Transition_Process_Flows.md', N'Tours', N'Statuses & Gates', N'What are the mandatory tour status checkpoints and how to advance from Draft to Completed?
What are the automated tour status checkpoints?
Why is the Advance to Confirmed button disabled?
How to resolve Gate 2 blockers?
What criteria are required to move from Proposal to Confirmed?
How does Gate 1 Draft to Proposal work?
What is required to complete a tour in Gate 4?', N'How to 🔄 state machine & transition rules?', N'state, machine, transition, rules, tour, status, forward, specifications, gate, resolution, gates, draft, proposal, confirmed, progress, completed, cancelled, blockers, sla, warnings, checkpoints, 06_tour_status_transition_process_flows, mermaid, statediagram, created, imported, gate1, satisfied, project, destination', N'### 🔄 State Machine & Transition Rules

```mermaid
stateDiagram-v2
    [*] --> Draft: Tour Created or Imported
    
    state "Gate 1: Draft ➔ Proposal" as Gate1 {
        Draft --> Proposal: Checkpoints Satisfied:\n1. Project & Destination Defined\n2. Pax Breakdown Entered\n3. Base Fee Calculated (> €0)\n4. Date Boundaries Set
    }
    
    state "Gate 2: Proposal ➔ Confirmed" as Gate2 {
        Proposal --> Confirmed: Checkpoints Satisfied:\n1. 100% City Hotels Confirmed\n2. Primary Guide Assigned\n3. Transport & Bus Locked\n4. Client Contract & Deposit Confirmed
    }

    state "Gate 3: Confirmed ➔ In Progress" as Gate3 {
        Confirmed --> InProgress: Checkpoints Satisfied:\n1. Arrival Date Reached (CurrentDate ≥ ArrivalDate)\n2. Flight Manifest Landed\n3. Rooming Manifest Dispatched\n4. Guide Daily Log Active
    }

    state "Gate 4: In Progress ➔ Completed" as Gate4 {
        InProgress --> Completed: Checkpoints Satisfied:\n1. Return Date Reached (CurrentDate ≥ EndDate)\n2. Supplier Expenses Reconciled\n3. Client Revenue Invoices Reconciled\n4. Accounting Closed Flag Set
    }

    Draft --> Cancelled: Cancellation Reason Logged
    Proposal --> Cancelled: Cancellation Reason Logged
    Confirmed --> Cancelled: Cancellation & Penalty Settled
    InProgress --> Cancelled: Emergency Termination Logged
```

---', N'/tours', N'View Status Kanban & Gates', 1, N'2026-09-22T16:53:46.318Z', N'2026-10-25T18:37:52.116Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (466, N'DocumentationRepo', N'06_Tour_Status_Transition_Process_Flows.md', N'Tours', N'Statuses & Gates', N'What are the mandatory tour status checkpoints and how to advance from Draft to Completed?
What are the automated tour status checkpoints?
Why is the Advance to Confirmed button disabled?
How to resolve Gate 2 blockers?
What criteria are required to move from Proposal to Confirmed?
How does Gate 1 Draft to Proposal work?
What is required to complete a tour in Gate 4?', N'How to 🔹 gate 1: `draft` ➔ `proposal`?', N'gate, draft, proposal, tour, status, forward, transition, specifications, resolution, rules, gates, confirmed, progress, completed, cancelled, blockers, state, machine, sla, warnings, checkpoints, 06_tour_status_transition_process_flows, business, goal, freezes, initial, itinerary, and, package, price', N'### 🔹 Gate 1: `Draft` ➔ `Proposal`

* **Business Goal**: Freezes initial tour itinerary and package price so sales personnel can issue formal proposal quotes to B2B Tour Operator Clients.
* **Mandatory Checkpoints**:
  1. **Project & Destination Defined**: Tour assigned to a valid Project with a destination route.
  2. **Pax Breakdown**: Adults, Children, and Infants entered.
  3. **Base Fee Calculated**: Base package fee ($> €0$) set in Tour Information.
  4. **Date Boundaries Set**: `EndDate > ArrivalDate`.
* **How to Resolve**: Open **Tour Detail** $\rightarrow$ **Tour Information** card $\rightarrow$ Click **Edit** $\rightarrow$ Enter Project, Destination, Dates, and Base Fee $\rightarrow$ Click **Save**.', N'/tours', N'View Status Kanban & Gates', 1, N'2026-09-22T16:53:46.319Z', N'2026-10-25T18:37:52.116Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (467, N'DocumentationRepo', N'06_Tour_Status_Transition_Process_Flows.md', N'Tours', N'Statuses & Gates', N'What are the mandatory tour status checkpoints and how to advance from Draft to Completed?
What are the automated tour status checkpoints?
Why is the Advance to Confirmed button disabled?
How to resolve Gate 2 blockers?
What criteria are required to move from Proposal to Confirmed?
How does Gate 1 Draft to Proposal work?
What is required to complete a tour in Gate 4?', N'How to 🔹 gate 2: `proposal` ➔ `confirmed`?', N'gate, proposal, confirmed, tour, status, forward, transition, specifications, resolution, rules, gates, draft, progress, completed, cancelled, blockers, state, machine, sla, warnings, checkpoints, 06_tour_status_transition_process_flows, business, goal, guarantees, that, the, operationally, locked, fully', N'### 🔹 Gate 2: `Proposal` ➔ `Confirmed`

* **Business Goal**: Guarantees that the tour is 100% operationally locked, fully backed by supplier reservations, and guaranteed to depart.
* **Mandatory Checkpoints**:
  1. **Hotel Reservations Confirmed**: At least 1 Hotel service assigned in the **Services** tab.
  2. **Guide Assignment Confirmed**: Primary Tour Guide assigned in Tour Info or Services tab.
  3. **Transportation & Coach Locked**: Transport Company or Driver assigned in Services tab.
  4. **Client Contract & Deposit Confirmed**: Either a **Base Fee (€)** is entered in Tour Info or an **Invoiced Fee** service is added under Services Revenue.
* **How to Resolve**:
  - Missing Hotel? Go to **Services** tab $\rightarrow$ Click **+ Add Hotel Stay**.
  - Missing Guide? Go to **Tour Info** $\rightarrow$ Edit $\rightarrow$ Select Primary Guide.
  - Missing Transport? Go to **Services** tab $\rightarrow$ Click **+ Add Transport Line**.
  - "Pricing / package fee not calculated"? Go to **Tour Info** $\rightarrow$ Edit $\rightarrow$ Enter **Base Fee (€)**.', N'/tours', N'View Status Kanban & Gates', 1, N'2026-09-22T16:53:46.319Z', N'2026-10-25T18:37:52.117Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (468, N'DocumentationRepo', N'06_Tour_Status_Transition_Process_Flows.md', N'Tours', N'Statuses & Gates', N'What are the mandatory tour status checkpoints and how to advance from Draft to Completed?
What are the automated tour status checkpoints?
Why is the Advance to Confirmed button disabled?
How to resolve Gate 2 blockers?
What criteria are required to move from Proposal to Confirmed?
How does Gate 1 Draft to Proposal work?
What is required to complete a tour in Gate 4?', N'How to 🔹 gate 3: `confirmed` ➔ `in progress`?', N'gate, confirmed, progress, tour, status, forward, transition, specifications, resolution, rules, gates, draft, proposal, completed, cancelled, blockers, state, machine, sla, warnings, checkpoints, 06_tour_status_transition_process_flows, business, goal, marks, active, the, ground, execution, daily', N'### 🔹 Gate 3: `Confirmed` ➔ `In Progress`

* **Business Goal**: Marks active on-the-ground tour execution, daily guide operations, and real-time excursion sales.
* **Mandatory Checkpoints**:
  1. **Arrival Date Reached**: Current system date $\ge$ `ArrivalDate`.
  2. **Flight Manifest Verified**: Arrival flight code entered under **Tour Info ➔ Edit ➔ Flight Information** (e.g. `TK 1821`).
  3. **Rooming List Dispatched**: Final rooming list uploaded and dispatched.
* **How to Resolve**: Ensure arrival flight number is populated and departure date has arrived.', N'/tours', N'View Status Kanban & Gates', 1, N'2026-09-22T16:53:46.320Z', N'2026-10-25T18:37:52.118Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (469, N'DocumentationRepo', N'06_Tour_Status_Transition_Process_Flows.md', N'Tours', N'Statuses & Gates', N'What are the mandatory tour status checkpoints and how to advance from Draft to Completed?
What are the automated tour status checkpoints?
Why is the Advance to Confirmed button disabled?
How to resolve Gate 2 blockers?
What criteria are required to move from Proposal to Confirmed?
How does Gate 1 Draft to Proposal work?
What is required to complete a tour in Gate 4?', N'How to 🔹 gate 4: `in progress` ➔ `completed`?', N'gate, progress, completed, tour, status, forward, transition, specifications, resolution, rules, gates, draft, proposal, confirmed, cancelled, blockers, state, machine, sla, warnings, checkpoints, 06_tour_status_transition_process_flows, business, goal, finalizes, operations, seals, financial, accounts, and', N'### 🔹 Gate 4: `In Progress` ➔ `Completed`

* **Business Goal**: Finalizes tour operations, seals financial accounts, and prevents further unauthorized expense edits.
* **Mandatory Checkpoints**:
  1. **Return Date Reached**: Current system date $\ge$ `EndDate`.
  2. **Supplier Expenses Reconciled**: All supplier costs (Hotels, Guides, Transport, Excursion Vendor tickets) recorded.
  3. **Client Revenue Invoices Reconciled**: Invoices issued and matched against client ledger.
  4. **Accounting Closed Flag Set**: Accounting administrator checks **"Accounting Closed / Locked"** flag in **Tour Info ➔ Edit**.
* **How to Resolve**: Enter all supplier expense lines, verify revenue, and check the "Accounting Closed" checkbox.

---', N'/tours', N'View Status Kanban & Gates', 1, N'2026-09-22T16:53:46.321Z', N'2026-10-25T18:37:52.118Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (470, N'DocumentationRepo', N'06_Tour_Status_Transition_Process_Flows.md', N'Tours', N'Statuses & Gates', N'What are the mandatory tour status checkpoints and how to advance from Draft to Completed?
What are the automated tour status checkpoints?
Why is the Advance to Confirmed button disabled?
How to resolve Gate 2 blockers?
What criteria are required to move from Proposal to Confirmed?
How does Gate 1 Draft to Proposal work?
What is required to complete a tour in Gate 4?', N'How to 🛠️ automated time-window warning notifications?', N'automated, time, window, warning, notifications, tour, status, forward, transition, specifications, gate, resolution, rules, gates, draft, proposal, confirmed, progress, completed, cancelled, blockers, state, machine, sla, warnings, checkpoints, 06_tour_status_transition_process_flows, the, system, continuously', N'### 🛠️ Automated Time-Window Warning Notifications

The system continuously scans upcoming departures and triggers automated SLA warnings:
* **72h Prior to Departure**: Alerts if Hotel, Guide, or Transport reservations are unconfirmed.
* **48h After Return Date**: Alerts if Guide Cash Remittance is unsubmitted (enforcing Rule 4).
* **7 Days After Return Date**: Alerts if Accounting Closed flag remains unsealed.', N'/tours', N'View Status Kanban & Gates', 1, N'2026-09-22T16:53:46.322Z', N'2026-10-25T18:37:52.119Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (471, N'DocumentationRepo', N'01_Projects_Overview_and_Purpose.md', N'Projects', N'Overview & Purpose', N'Why are Projects needed in UNO ERP and what are the most important fields?
What is a Project in UNO ERP?
How are Projects related to Tours?
What are the core fields for a Project?', N'How to 💡 executive summary & core purpose?', N'executive, summary, core, purpose, projects, overview, commercial, umbrella, contracts, fields, project, code, contract, client, name, budget, tours, relationship, 01_projects_overview_and_purpose, uno, erp, represents, master, agreement, with, b2b, agency, tour, operator, travel', N'### 💡 Executive Summary & Core Purpose

In **UNO ERP**, a **Project** represents a commercial umbrella contract or master agreement with a B2B client agency (e.g. tour operator, travel agency, corporate client). 

Projects allow tour managers to group multiple individual tour operations (departures) under a single commercial contract, enabling macro-level budget tracking, consistent client pricing agreements, and aggregate executive profitability analysis.

---', N'/projects', N'Open Projects Overview', 1, N'2026-09-22T16:53:46.356Z', N'2026-10-25T18:37:52.145Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (472, N'DocumentationRepo', N'01_Projects_Overview_and_Purpose.md', N'Projects', N'Overview & Purpose', N'Why are Projects needed in UNO ERP and what are the most important fields?
What is a Project in UNO ERP?
How are Projects related to Tours?
What are the core fields for a Project?', N'How to 🎯 strategic benefits of projects?', N'strategic, benefits, projects, overview, commercial, umbrella, contracts, core, fields, project, code, contract, client, name, budget, tours, relationship, 01_projects_overview_and_purpose, grouping, single, agency, may, book, different, departure, dates, for, the, prague, vienna', N'### 🎯 Strategic Benefits of Projects

1. **Commercial Contract Grouping**: A single client agency may book 10 different departure dates for the "Prague-Vienna-Budapest" tour in a single season. Creating a Project allows you to track total contract revenue, total operational costs, and overall profitability across all 10 departures under one roof.
2. **Master Data & Pricing Consistency**: Projects bind tour departures to specific client pricing agreements, vendor rate sheets, and payment terms.
3. **Executive Dashboard Analytics**: Project-level dashboards aggregate performance KPIs (Pax volume, Gross Sales, Net Margin %, Unpaid Invoices) across all linked tours.

---', N'/projects', N'Open Projects Overview', 1, N'2026-09-22T16:53:46.357Z', N'2026-10-25T18:37:52.145Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (473, N'DocumentationRepo', N'01_Projects_Overview_and_Purpose.md', N'Projects', N'Overview & Purpose', N'Why are Projects needed in UNO ERP and what are the most important fields?
What is a Project in UNO ERP?
How are Projects related to Tours?
What are the core fields for a Project?', N'How to 📋 core project fields & business rules?', N'core, project, fields, business, rules, projects, overview, commercial, umbrella, contracts, code, contract, client, name, budget, tours, relationship, 01_projects_overview_and_purpose, field, data, type, rule, significance, projectcode, string, unique, primary, identifier, used, prefix', N'### 📋 Core Project Fields & Business Rules

| Field Name | Data Type | Business Rule & Significance |
| :--- | :--- | :--- |
| **`ProjectCode`** | String (Unique) | **Primary Commercial Identifier**: Used as a prefix for tour codes and Excel import filenames (e.g. `Project1`, `PRJ-BVP2026`). |
| **`ClientName`** | String | Name of the booking travel agency or tour operator (e.g. `Orta Avrupa BVP`, `BVP Travel`). Binds billing and invoice generation. |
| **`StartDate` & `EndDate`** | Date (dd/mm/yyyy) | Contract validity window. All linked tours must fall within these contractual bounds. |
| **`TotalBudget`** | Decimal (€) | Contracted budget or target gross revenue in Euros (€). Used for contract progress tracking and budget variance alerts. |
| **`Currency`** | String | Operational currency (Default: `EUR`). Base currency for all revenue and expense rollups. |
| **`Status`** | Status ID | Commercial lifecycle status (`Active`, `Draft`, `Completed`, `Archived`). |
| **`Description`** | Text | Contractual terms, payment milestones, and guide instruction highlights. |

---', N'/projects', N'Open Projects Overview', 1, N'2026-09-22T16:53:46.357Z', N'2026-10-25T18:37:52.146Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (474, N'DocumentationRepo', N'02_Creating_and_Updating_Projects.md', N'Projects', N'Creating Projects', N'How to create a project manually or via Rooming List import?
How do I create a new project?
Can projects be automatically created from an Excel file?
How to edit or update an existing project?', N'How to 💡 executive summary & core purpose?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### 💡 Executive Summary & Core Purpose

Projects in **UNO ERP** can be created through two operational channels:
1. **Direct Web UI Creation**: For setting up contractual master agreements prior to receiving tour bookings.
2. **Automated Excel Rooming Ingestion**: On-the-fly creation whenever an unrecognised `ProjectCode` is detected in an imported rooming spreadsheet.

---', N'/projects', N'Open Projects Management', 1, N'2026-09-22T16:53:46.368Z', N'2026-10-25T18:37:52.153Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (475, N'DocumentationRepo', N'02_Creating_and_Updating_Projects.md', N'Projects', N'Creating Projects', N'How to create a project manually or via Rooming List import?
How do I create a new project?
Can projects be automatically created from an Excel file?
How to edit or update an existing project?', N'How to ✏️ updating, editing & archiving projects?', N'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format', N'### ✏️ Updating, Editing & Archiving Projects

* **Editing Details**: Click the **`Edit`** icon on any project row in the Projects grid to adjust client name, budget, or dates.
* **Viewing Linked Tours**: Click on any Project card or row to view all linked tour departures, total passenger counts, combined revenue, and cumulative profit margin.
* **Archiving Projects**: When all linked tours reach `Completed` or `Accounting Closed`, update project status to **`Archived`** to declutter active operational screens while preserving historical financial records.', N'/projects', N'Open Projects Management', 1, N'2026-09-22T16:53:46.371Z', N'2026-10-25T18:37:52.155Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (476, N'DocumentationRepo', N'03_Executive_KPI_Dashboard_Guide.md', N'Projects', N'Overview & Purpose', N'What KPIs are available on the Executive Dashboard?
What are the 24 High-Impact KPIs in UNO ERP?
How is Tour Gross Margin calculated?
What is the target SLA for Departure Readiness Gate Pass Rate?
How is Excursion Yield per Passenger calculated?
What is Guide Cash Remittance Lag and what is its target SLA?
How to monitor supplier confirmation velocity?', N'How to 💡 executive summary & core purpose?', N'executive, summary, core, purpose, kpi, dashboard, tour, operator, profit, optimization, guide, metrics, margin, operational, efficiency, compliance, risk, departure, readiness, rooming, lock, accuracy, capacity, load, factor, cash, remittance, lag, 03_executive_kpi_dashboard_guide, the', N'### 💡 Executive Summary & Core Purpose

The **UNO ERP Executive KPI Dashboard** provides executive leadership and owners with real-time operational visibility, tight risk governance, and financial margin tracking across Central European group tours. 

The dashboard tracks **24 High-Impact Key Performance Indicators (KPIs)** organized into **4 Strategic Categories**:
1. **Operational Efficiency** (KPIs 1–6)
2. **Financial & Profitability** (KPIs 7–12)
3. **Operational Integrity & Cash Compliance** (KPIs 13–18)
4. **Growth, Opportunities & AI Copilot** (KPIs 19–24)

---', N'/projects', N'View Executive Dashboard', 1, N'2026-09-22T16:53:46.381Z', N'2026-10-25T18:37:52.158Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (477, N'DocumentationRepo', N'03_Executive_KPI_Dashboard_Guide.md', N'Projects', N'Overview & Purpose', N'What KPIs are available on the Executive Dashboard?
What are the 24 High-Impact KPIs in UNO ERP?
How is Tour Gross Margin calculated?
What is the target SLA for Departure Readiness Gate Pass Rate?
How is Excursion Yield per Passenger calculated?
What is Guide Cash Remittance Lag and what is its target SLA?
How to monitor supplier confirmation velocity?', N'How to 1. operational efficiency kpis?', N'operational, efficiency, kpis, executive, kpi, dashboard, tour, operator, profit, optimization, guide, metrics, margin, compliance, risk, departure, readiness, rooming, lock, accuracy, capacity, load, factor, cash, remittance, lag, 03_executive_kpi_dashboard_guide, gate, pass, rate', N'### 1. Operational Efficiency KPIs

* **KPI 1: Departure Readiness Gate Pass Rate (%)**
  - **Target SLA**: `100% within 72 hours of departure`
  - **Formula**: `(Ready Tours / Total Upcoming Tours) × 100`
  - **Impact**: Eliminates last-minute panics, unassigned guides, or missing hotel vouchers.
* **KPI 2: Rooming List Lock Accuracy (%)**
  - **Target SLA**: `> 98%`
  - **Formula**: `(Confirmed Roomings / Total Rooming Requests) × 100`
  - **Impact**: Avoids hotel rooming penalties, check-in delays, and single/double room mismatches.
* **KPI 3: Guide Capacity Utilization (%)**
  - **Target SLA**: `85% – 90%`
  - **Formula**: `(Assigned Tour Days / Contracted Available Days) × 100`
  - **Impact**: Maximizes guide productivity while preventing guide burnout.
* **KPI 4: Bus Seat Load Factor (%)**
  - **Target SLA**: `> 85%`
  - **Formula**: `(Total Passengers / Coach Seating Capacity) × 100`
  - **Impact**: Optimizes bus size allocation (e.g. 35-seat vs 50-seat coach) to minimize transport cost per pax.
* **KPI 5: Supplier Confirmation Velocity (Hours)**
  - **Target SLA**: `< 24 Hours`
  - **Formula**: `Average hours from booking request to supplier confirmation receipt`
  - **Impact**: Accelerates proposal turnaround to B2B agencies and secures competitive hotel allocations.
* **KPI 6: Automated Document Export Ratio (%)**
  - **Target SLA**: `> 95%`
  - **Formula**: `(System Vouchers & Manifests Exported / Total Operational Documents) × 100`
  - **Impact**: Eliminates manual document drafting, saving 15+ staff hours per week.', N'/projects', N'View Executive Dashboard', 1, N'2026-09-22T16:53:46.382Z', N'2026-10-25T18:37:52.159Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (478, N'DocumentationRepo', N'03_Executive_KPI_Dashboard_Guide.md', N'Projects', N'Overview & Purpose', N'What KPIs are available on the Executive Dashboard?
What are the 24 High-Impact KPIs in UNO ERP?
How is Tour Gross Margin calculated?
What is the target SLA for Departure Readiness Gate Pass Rate?
How is Excursion Yield per Passenger calculated?
What is Guide Cash Remittance Lag and what is its target SLA?
How to monitor supplier confirmation velocity?', N'How to 2. financial & profitability kpis?', N'financial, profitability, kpis, executive, kpi, dashboard, tour, operator, profit, optimization, guide, metrics, margin, operational, efficiency, compliance, risk, departure, readiness, rooming, lock, accuracy, capacity, load, factor, cash, remittance, lag, 03_executive_kpi_dashboard_guide, excursion', N'### 2. Financial & Profitability KPIs

* **KPI 7: Excursion Sales Penetration Rate (%)**
  - **Target SLA**: `> 75% Pax`
  - **Formula**: `(Passengers Purchasing Optional Excursions / Total Pax) × 100`
  - **Impact**: Gauges guide sales promotion effectiveness and passenger engagement.
* **KPI 8: Excursion Yield per Passenger (€)**
  - **Target SLA**: `> €120 / Pax`
  - **Formula**: `Total Excursion Revenue / Total Passengers`
  - **Impact**: Identifies highest revenue-generating itineraries and excursions.
* **KPI 9: Guide Commission Efficiency (%)**
  - **Target SLA**: `< 15% Margin`
  - **Formula**: `(Total Guide Commission Paid / Excursion Net Margin) × 100`
  - **Impact**: Validates that guide incentives drive profitable sales without eroding DMC profit.
* **KPI 10: Cost per Pax Variance (€ & %)**
  - **Target SLA**: `± 2% of Budget`
  - **Formula**: `Actual Settled Cost per Pax - Budgeted Cost per Pax`
  - **Impact**: Detects hotel rate changes or unexpected city tax hikes before final invoicing.
* **KPI 11: Uninvoiced Service Cost Ratio (%)**
  - **Target SLA**: `< 1%`
  - **Formula**: `(Unbilled Supplier Costs / Total Expenses) × 100`
  - **Impact**: Prevents unbilled vendor costs from being absorbed by UNO instead of client billing.
* **KPI 12: Gross Margin per Tour (€ & %)**
  - **Target SLA**: `> 22% Margin`
  - **Formula**: `((Total Revenue - Total Costs) / Total Revenue) × 100`
  - **Impact**: Provides instant clarity on which client agencies and destinations generate the highest bottom-line return.', N'/projects', N'View Executive Dashboard', 1, N'2026-09-22T16:53:46.383Z', N'2026-10-25T18:37:52.160Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (479, N'DocumentationRepo', N'03_Executive_KPI_Dashboard_Guide.md', N'Projects', N'Overview & Purpose', N'What KPIs are available on the Executive Dashboard?
What are the 24 High-Impact KPIs in UNO ERP?
How is Tour Gross Margin calculated?
What is the target SLA for Departure Readiness Gate Pass Rate?
How is Excursion Yield per Passenger calculated?
What is Guide Cash Remittance Lag and what is its target SLA?
How to monitor supplier confirmation velocity?', N'How to 3. governance, compliance & risk kpis?', N'governance, compliance, risk, kpis, executive, kpi, dashboard, tour, operator, profit, optimization, guide, metrics, margin, operational, efficiency, departure, readiness, rooming, lock, accuracy, capacity, load, factor, cash, remittance, lag, 03_executive_kpi_dashboard_guide, days, target', N'### 3. Governance, Compliance & Risk KPIs

* **KPI 13: Guide Cash Remittance Lag (Days)**
  - **Target SLA**: `< 48 Hours`
  - **Formula**: `Average days from Tour End Date to physical cash bank deposit`
  - **Impact**: Enforces Rule 4 (*Separate Money Flows*) and secures cash flow.
* **KPI 14: Excursion Cash Discrepancy Rate (%)**
  - **Target SLA**: `0.0% Variance`
  - **Formula**: `|Guide Cash Remitted - Expected Excursion Cash| / Total Excursion Sales`
  - **Impact**: Zero-tolerance policy on cash leakages and currency conversion errors.
* **KPI 15: Unassigned Tour Resource Ratio (%)**
  - **Target SLA**: `0% within 7 days of departure`
  - **Formula**: `(Tours Missing Hotel, Guide, or Transport / Total Tours) × 100`
* **KPI 16: Passenger Data Completeness (%)**
  - **Target SLA**: `100% (7 days prior)`
  - **Formula**: `(Passengers with valid passport & flight details / Total Passengers) × 100`
* **KPI 17: Supplier Payment On-Time Rate (%)**
  - **Target SLA**: `> 98%`
  - **Formula**: `(Invoices Paid Within Contractual Terms / Total Supplier Invoices) × 100`
* **KPI 18: Audit Trail Exception Count**
  - **Target SLA**: `< 5 Overrides / Month`
  - **Formula**: `Total manual price or status overrides logged in AuditLogs`', N'/projects', N'View Executive Dashboard', 1, N'2026-09-22T16:53:46.384Z', N'2026-09-22T16:53:46.384Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (480, N'DocumentationRepo', N'03_Executive_KPI_Dashboard_Guide.md', N'Projects', N'Overview & Purpose', N'What KPIs are available on the Executive Dashboard?
What are the 24 High-Impact KPIs in UNO ERP?
How is Tour Gross Margin calculated?
What is the target SLA for Departure Readiness Gate Pass Rate?
How is Excursion Yield per Passenger calculated?
What is Guide Cash Remittance Lag and what is its target SLA?
How to monitor supplier confirmation velocity?', N'How to 4. growth, opportunities & ai copilot kpis?', N'growth, opportunities, copilot, kpis, executive, kpi, dashboard, tour, operator, profit, optimization, guide, metrics, margin, operational, efficiency, compliance, risk, departure, readiness, rooming, lock, accuracy, capacity, load, factor, cash, remittance, lag, 03_executive_kpi_dashboard_guide', N'### 4. Growth, Opportunities & AI Copilot KPIs

* **KPI 19: Client Repeat Booking Rate (%)**
  - **Target SLA**: `> 80%`
  - **Formula**: `(Repeat B2B Tour Operators / Active Client Base) × 100`
* **KPI 20: Project Pax Load Factor (%)**
  - **Target SLA**: `> 90% Capacity`
  - **Formula**: `(Actual Booked Pax / Contracted Capacity) × 100`
* **KPI 21: Top Destination Margin Share (%)**
  - **Target SLA**: `Monitor Portfolio Mix`
  - **Formula**: `Gross Profit from Top 3 Destinations / Total Gross Profit`
* **KPI 22: Guide Performance NPS Score**
  - **Target SLA**: `> 4.8 / 5.0`
  - **Formula**: `Average customer feedback score per tour guide`
* **KPI 23: Pre/Post Hotel Night Conversion (%)**
  - **Target SLA**: `> 15% Pax`
  - **Formula**: `(Passengers Booking Early Arrival or Extra Nights / Total Pax) × 100`
* **KPI 24: AI Copilot Instant Resolution Rate (%)**
  - **Target SLA**: `> 90%`
  - **Formula**: `(Staff Inquiries Resolved by AI Assistant / Total Queries) × 100`

---', N'/projects', N'View Executive Dashboard', 1, N'2026-09-22T16:53:46.384Z', N'2026-10-25T18:37:52.161Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (481, N'DocumentationRepo', N'03_Executive_KPI_Dashboard_Guide.md', N'Projects', N'Overview & Purpose', N'What KPIs are available on the Executive Dashboard?
What are the 24 High-Impact KPIs in UNO ERP?
How is Tour Gross Margin calculated?
What is the target SLA for Departure Readiness Gate Pass Rate?
How is Excursion Yield per Passenger calculated?
What is Guide Cash Remittance Lag and what is its target SLA?
How to monitor supplier confirmation velocity?', N'How to 🛠️ how to access kpis in uno erp?', N'how, access, kpis, uno, erp, executive, kpi, dashboard, tour, operator, profit, optimization, guide, metrics, margin, operational, efficiency, compliance, risk, departure, readiness, rooming, lock, accuracy, capacity, load, factor, cash, remittance, lag', N'### 🛠️ How to Access KPIs in UNO ERP

1. Navigate to **[Projects Overview](/projects)** or **[Executive Dashboard](/projects)**.
2. Filter by **Season**, **Client Operator**, or **Destination Route**.
3. Inspect visual metric cards with green/amber/red threshold alerts.', N'/projects', N'View Executive Dashboard', 1, N'2026-09-22T16:53:46.385Z', N'2026-10-25T18:37:52.161Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (482, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'Metadata', N'Hotels Master', N'How to manage Hotels master data, star ratings and pricing basis?
How to manage Guides master data, languages and daily fee rates?
How to set up Transport companies and Drivers in master data?
How to create Excursions in master data with ticket costs and retail selling prices?
Where do I add new hotel contracts?', N'How to 💡 executive summary & core purpose?', N'executive, summary, core, purpose, master, data, setup, supplier, catalog, management, hotels, guides, transport, excursions, drivers, star, rating, pricing, basis, pax, room, contract, rates, 01_masterdata_setup_and_management, houses, the, central, and, registries, companies', N'### 💡 Executive Summary & Core Purpose

**Master Data** houses the central supplier and catalog registries (Hotels, Guides, Transport Companies, Drivers, Excursions) utilized across **UNO ERP**. 

Establishing accurate master records ensures dynamic pricing calculations, automatic vendor voucher generation, and consistent contract rate management across all tour departures.

---', N'/master-data', N'Open Master Data', 1, N'2026-09-22T16:53:46.396Z', N'2026-10-25T18:37:52.169Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (483, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'Metadata', N'Hotels Master', N'How to manage Hotels master data, star ratings and pricing basis?
How to manage Guides master data, languages and daily fee rates?
How to set up Transport companies and Drivers in master data?
How to create Excursions in master data with ticket costs and retail selling prices?
Where do I add new hotel contracts?', N'How to 🏬 1. hotels master management?', N'hotels, master, management, data, setup, supplier, catalog, guides, transport, excursions, drivers, star, rating, pricing, basis, pax, room, contract, rates, 01_masterdata_setup_and_management, target, screen, sidebar, rightarrow, tab, fields, rules, hotel, name, commercial', N'### 🏬 1. Hotels Master Management

* **Target Screen**: Sidebar $\rightarrow$ **Master Data** $\rightarrow$ **[Hotels](/master-data)** tab.
* **Fields & Rules**:
  * **Hotel Name**: Commercial name (e.g. `Hotel Canada`, `Hotel Olympik`).
  * **City / Destination**: Destination city (`Prague`, `Vienna`, `Budapest`).
  * **Star Rating**: 3-star, 4-star, or 5-star rating.
  * **Pricing Basis**: Select **`Pax`** (per person per night) or **`Room`** (per room type per night).
  * **Rate Matrix**: Single, Double, Twin, and Triple room/pax contract rates.
  * **Contact Details**: Contact person, voucher dispatch email, emergency telephone.

---', N'/master-data', N'Open Master Data', 1, N'2026-09-22T16:53:46.397Z', N'2026-10-25T18:37:52.170Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (484, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'Metadata', N'Hotels Master', N'How to manage Hotels master data, star ratings and pricing basis?
How to manage Guides master data, languages and daily fee rates?
How to set up Transport companies and Drivers in master data?
How to create Excursions in master data with ticket costs and retail selling prices?
Where do I add new hotel contracts?', N'How to 🚩 2. tour guides master management?', N'tour, guides, master, management, data, setup, supplier, catalog, hotels, transport, excursions, drivers, star, rating, pricing, basis, pax, room, contract, rates, 01_masterdata_setup_and_management, target, screen, sidebar, rightarrow, tab, fields, rules, guide, name', N'### 🚩 2. Tour Guides Master Management

* **Target Screen**: Sidebar $\rightarrow$ **Master Data** $\rightarrow$ **Guides** tab.
* **Fields & Rules**:
  * **Guide Name**: Full legal name.
  * **Languages Spoken**: Spoken tour languages (e.g. `English`, `Turkish`, `German`). Used for tour assignment matching.
  * **Daily Fee (€)**: Base contracted daily wage rate.
  * **Phone & Email**: Contact details for automated assignment notifications.
  * *Note*: Guide daily fee is distinct from the **10% Excursion Commission**, which is calculated dynamically from sales.

---', N'/master-data', N'Open Master Data', 1, N'2026-09-22T16:53:46.397Z', N'2026-10-25T18:37:52.170Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (485, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'Metadata', N'Hotels Master', N'How to manage Hotels master data, star ratings and pricing basis?
How to manage Guides master data, languages and daily fee rates?
How to set up Transport companies and Drivers in master data?
How to create Excursions in master data with ticket costs and retail selling prices?
Where do I add new hotel contracts?', N'How to 🚌 3. transport companies & drivers management?', N'transport, companies, drivers, management, master, data, setup, supplier, catalog, hotels, guides, excursions, star, rating, pricing, basis, pax, room, contract, rates, 01_masterdata_setup_and_management, target, screen, sidebar, rightarrow, transports, tab, fields, rules, company', N'### 🚌 3. Transport Companies & Drivers Management

* **Target Screen**: Sidebar $\rightarrow$ **Master Data** $\rightarrow$ **Transports / Drivers** tab.
* **Fields & Rules**:
  * **Transport Company**: Company name, fleet capacity (e.g. 35-seat / 50-seat coaches), daily bus rates (€).
  * **Drivers**: Driver name, mobile phone number, assigned coach company, daily allowance rate (€).

---', N'/master-data', N'Open Master Data', 1, N'2026-09-22T16:53:46.398Z', N'2026-10-25T18:37:52.171Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (486, N'DocumentationRepo', N'01_MasterData_Setup_and_Management.md', N'Metadata', N'Hotels Master', N'How to manage Hotels master data, star ratings and pricing basis?
How to manage Guides master data, languages and daily fee rates?
How to set up Transport companies and Drivers in master data?
How to create Excursions in master data with ticket costs and retail selling prices?
Where do I add new hotel contracts?', N'How to 🎟️ 4. optional excursions catalog management?', N'optional, excursions, catalog, management, master, data, setup, supplier, hotels, guides, transport, drivers, star, rating, pricing, basis, pax, room, contract, rates, 01_masterdata_setup_and_management, target, screen, sidebar, rightarrow, tab, fields, rules, excursion, title', N'### 🎟️ 4. Optional Excursions Catalog Management

* **Target Screen**: Sidebar $\rightarrow$ **Master Data** $\rightarrow$ **Excursions** tab.
* **Fields & Rules**:
  * **Excursion Title**: Official title (e.g. `Dresden Tour`, `Mozart Concert`, `Danube Dinner Cruise`).
  * **Destination City**: Location city.
  * **Vendor Ticket Cost (€)**: Direct admission fee paid per adult/child to the attraction vendor.
  * **Selling Price (€)**: Retail price charged to passengers.
  * *Net Margin*: Computed automatically as `Selling Price - Vendor Ticket Cost - 10% Guide Commission`.', N'/master-data', N'Open Master Data', 1, N'2026-09-22T16:53:46.399Z', N'2026-10-25T18:37:52.172Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (487, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'Metadata', N'Role Permissions', N'What are the role permissions for Administrator, TourAdmin and Guides?
How to configure screen access rights?
How to configure role access?
How to add a new user?
What are password masking and viewing rules?', N'How to 💡 executive summary & core purpose?', N'executive, summary, core, purpose, master, data, configuration, role, permissions, matrix, access, control, administrator, touradmin, manager, guide, rights, passwords, audit, logs, security, 02_statuses_permissions_and_checkpoints, uno, erp, operates, granular, based, rbac, architecture, system', N'### 💡 Executive Summary & Core Purpose

**Security & Access Control** in **UNO ERP** operates on a granular **Role-Based Access Control (RBAC)** architecture. 

System administrators can configure permissions per role across all system screens, enforce password visibility policies, and audit administrative actions.

---', N'/settings', N'View User & Role Permissions', 1, N'2026-09-22T16:53:46.408Z', N'2026-10-25T18:37:52.175Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (488, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'Metadata', N'Role Permissions', N'What are the role permissions for Administrator, TourAdmin and Guides?
How to configure screen access rights?
How to configure role access?
How to add a new user?
What are password masking and viewing rules?', N'How to 🔒 1. standard role definitions?', N'standard, role, definitions, master, data, configuration, permissions, matrix, access, control, administrator, touradmin, manager, guide, rights, passwords, audit, logs, security, 02_statuses_permissions_and_checkpoints, unrestricted, read, write, update, delete, status, override, and, user, administration', N'### 🔒 1. Standard Role Definitions

* **`Administrator`**:
  - Unrestricted read, write, update, delete, status override, and user administration rights across all modules.
  - Exclusive access to unmask plain-text passwords (`👁`) and modify the Screen Access Rights Matrix.
* **`TourAdmin / Manager`**:
  - Operational control over Projects, Tours, Rooming manifests, Services & Costing, and Status Gate advancements.
  - Restricted from editing system roles or viewing employee credentials.
* **`Guide / Read-Only User`**:
  - Can view assigned tour itineraries, rooming lists, and mark optional excursion attendance.
  - Cannot modify vendor rates or advance checkpoint gates.

---', N'/settings', N'View User & Role Permissions', 1, N'2026-09-22T16:53:46.409Z', N'2026-10-25T18:37:52.176Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (489, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'Metadata', N'Role Permissions', N'What are the role permissions for Administrator, TourAdmin and Guides?
How to configure screen access rights?
How to configure role access?
How to add a new user?
What are password masking and viewing rules?', N'How to 🔹 how to add a new user account?', N'how, add, new, user, account, master, data, configuration, role, permissions, matrix, access, control, administrator, touradmin, manager, guide, rights, passwords, audit, logs, security, 02_statuses_permissions_and_checkpoints, navigate, accounts, management, settings, click, the, purple', N'### 🔹 How to Add a New User Account

1. Navigate to **[User Accounts & Role Management](/settings)**.
2. Click the purple **`+ Add New User`** button at the top right.
3. Enter Full Name, Email, Password, and select Role (`Administrator`, `TourAdmin`, `Manager`).
4. Click **`Create Account`** to save.', N'/settings', N'View User & Role Permissions', 1, N'2026-09-22T16:53:46.410Z', N'2026-10-25T18:37:52.177Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (490, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'Metadata', N'Role Permissions', N'What are the role permissions for Administrator, TourAdmin and Guides?
How to configure screen access rights?
How to configure role access?
How to add a new user?
What are password masking and viewing rules?', N'How to 🔹 password masking & security rules?', N'password, masking, security, rules, master, data, configuration, role, permissions, matrix, access, control, administrator, touradmin, manager, guide, rights, passwords, audit, logs, 02_statuses_permissions_and_checkpoints, all, user, account, are, strictly, masked, default, the, grid', N'### 🔹 Password Masking & Security Rules

* All user account passwords are strictly masked (`••••••••`) by default in the grid.
* **Administrators Only**: An eye icon button (`👁`) is rendered next to the password column to toggle plain text view.
* Non-admin users see bullets only with no toggle option.', N'/settings', N'View User & Role Permissions', 1, N'2026-09-22T16:53:46.410Z', N'2026-10-25T18:37:52.177Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (491, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'Metadata', N'Role Permissions', N'What are the role permissions for Administrator, TourAdmin and Guides?
How to configure screen access rights?
How to configure role access?
How to add a new user?
What are password masking and viewing rules?', N'How to 🔹 how to configure screen access rights (matrix)?', N'how, configure, screen, access, rights, matrix, master, data, configuration, role, permissions, control, administrator, touradmin, manager, guide, passwords, audit, logs, security, 02_statuses_permissions_and_checkpoints, user, management, settings, click, the, tab, select, custom, check', N'### 🔹 How to Configure Screen Access Rights (Matrix)

1. Go to **[User & Role Access Management](/settings)**.
2. Click the **Screen Access Rights Matrix** tab.
3. Select the role (`Administrator`, `TourAdmin`, `Manager`, or custom role).
4. Check or uncheck **View, Entry (Create), Update (Edit), Delete** for each screen.
5. Click **Save Permissions Matrix**.

---', N'/settings', N'View User & Role Permissions', 1, N'2026-09-22T16:53:46.411Z', N'2026-10-25T18:37:52.178Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (492, N'DocumentationRepo', N'02_Statuses_Permissions_and_Checkpoints.md', N'Metadata', N'Role Permissions', N'What are the role permissions for Administrator, TourAdmin and Guides?
How to configure screen access rights?
How to configure role access?
How to add a new user?
What are password masking and viewing rules?', N'How to 🏷️ 3. tax rates & agency discounts?', N'tax, rates, agency, discounts, master, data, configuration, role, permissions, matrix, access, control, administrator, touradmin, manager, guide, rights, passwords, audit, logs, security, 02_statuses_permissions_and_checkpoints, city, vat, configurable, percentage, applied, automatically, during, tour', N'### 🏷️ 3. Tax Rates & Agency Discounts

* **City Tax & VAT**: Configurable percentage rates applied automatically during tour revenue & invoice generation.
* **Agency Discounts**: Special commercial discounts applied to gross base tour fees for partner tour operators.', N'/settings', N'View User & Role Permissions', 1, N'2026-09-22T16:53:46.412Z', N'2026-10-25T18:37:52.179Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (493, N'DocumentationRepo', N'03_Project_Effort_and_Analytics.md', N'Metadata', N'Role Permissions', N'Where do I see token effort analytics?
What is the development effort breakdown for UNO ERP?
What is the architectural stack of UNO ERP?', N'How to 💡 executive summary & architecture overview?', N'executive, summary, architecture, overview, uno, erp, development, effort, token, analytics, tokens, roi, metrics, agent, database, sizing, 03_project_effort_and_analytics, enterprise, grade, destination, management, platform, engineered, for, central, european, tour, operators', N'### 💡 Executive Summary & Architecture Overview

**UNO ERP** is an enterprise-grade Destination Management Platform engineered for Central European tour operators.', N'/settings', N'View System Settings', 1, N'2026-09-22T16:53:46.418Z', N'2026-10-25T18:37:52.183Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (494, N'DocumentationRepo', N'03_Project_Effort_and_Analytics.md', N'Metadata', N'Role Permissions', N'Where do I see token effort analytics?
What is the development effort breakdown for UNO ERP?
What is the architectural stack of UNO ERP?', N'How to 🏛️ technology stack?', N'technology, stack, uno, erp, development, effort, architecture, token, analytics, tokens, roi, metrics, agent, database, sizing, 03_project_effort_and_analytics, backend, api, asp, net, core, web, with, entity, framework, and, sql, server, frontend, crm', N'### 🏛️ Technology Stack

* **Backend API**: ASP.NET Core 10.0 Web API with Entity Framework Core and SQL Server.
* **Frontend CRM**: Next.js 15 (React 19, TypeScript, Tailwind CSS, Lucide Icons).
* **AI Knowledge Engine**: In-memory BM25/TF-IDF hybrid inverted index, Agent-Optimized Markdown corpus, and dual-layer AppDB synchronization.
* **Hosting Architecture**: Optimized for IIS Shared Hosting and Windows Server WebDeploy.

---', N'/settings', N'View System Settings', 1, N'2026-09-22T16:53:46.419Z', N'2026-10-25T18:37:52.184Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (495, N'DocumentationRepo', N'03_Project_Effort_and_Analytics.md', N'Metadata', N'Role Permissions', N'Where do I see token effort analytics?
What is the development effort breakdown for UNO ERP?
What is the architectural stack of UNO ERP?', N'How to 📊 development effort & roi metrics?', N'development, effort, roi, metrics, uno, erp, architecture, token, analytics, tokens, agent, database, sizing, 03_project_effort_and_analytics, sprint, workstream, focus, area, hours, consumption, delivered, components, core, dmc, data, projects, tours, rooming, list, full', N'### 📊 Development Effort & ROI Metrics

| Sprint / Workstream | Focus Area | Development Hours | Token Consumption | Delivered Components |
| :--- | :--- | :---: | :---: | :--- |
| **Sprint 1: Core DMC Data** | Projects, Tours, Rooming List | 45 Hours | 185,000 Tokens | Full CRUD, Rooming parser, initial schema |
| **Sprint 2: Financial Engine** | Services, Costing, Excursions, Guide Commission | 60 Hours | 240,000 Tokens | 10% Guide Commission, Hotel Pax/Room pricing basis, Net margin calculation |
| **Sprint 3: Gates & Status Transitions** | Checkpoint Gates, Kanban, Status Gate Compliance | 40 Hours | 195,000 Tokens | 5-stage state machine, TourCheckpointWidget, SLA alert system |
| **Sprint 4: AI Copilot & RAG** | Chatbot, Ingestion Pipeline, AI Admin Hub | 35 Hours | 210,000 Tokens | AIChatController, FileRepositoryIndexer, AIChatDrawer, AOM Corpus |

---', N'/settings', N'View System Settings', 1, N'2026-09-22T16:53:46.419Z', N'2026-10-25T18:37:52.185Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (496, N'DocumentationRepo', N'03_Project_Effort_and_Analytics.md', N'Metadata', N'Role Permissions', N'Where do I see token effort analytics?
What is the development effort breakdown for UNO ERP?
What is the architectural stack of UNO ERP?', N'How to 🛠️ performance & scalability targets?', N'performance, scalability, targets, uno, erp, development, effort, architecture, token, analytics, tokens, roi, metrics, agent, database, sizing, 03_project_effort_and_analytics, chat, query, latency, 50ms, local, memory, inverted, index, file, ingestion, velocity, 500ms, for', N'### 🛠️ Performance & Scalability Targets

* **Chat Query Latency**: `< 50ms` on local in-memory inverted index.
* **File Ingestion Velocity**: `< 500ms` for complete workspace resynchronization across 40+ documents.
* **Zero External API Cost**: $100\%$ zero recurring token costs on local hybrid retrieval mode.', N'/settings', N'View System Settings', 1, N'2026-09-22T16:53:46.420Z', N'2026-10-25T18:37:52.185Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (505, N'DocumentationRepo', N'RELEASE_NOTES_2026_08_21.md', N'General', N'General', N'', N'How the AI Chatbot Knowledge System Works', N'how, the, chatbot, knowledge, system, works, release_notes_2026_08_21, queries, aiknowledgeitems, database, table, live, every, request, you, not, need, rebuild, recompile, application, train, when, insert, new, process, documentation, faqs, operational, rules, into', N'### How the AI Chatbot Knowledge System Works

The AI Chatbot queries the `AiKnowledgeItems` database table live on every request. **You do NOT need to rebuild or recompile the application to train the chatbot.** 

When you insert new process documentation, FAQs, or operational rules into the `AiKnowledgeItems` table, the Production AI Chatbot immediately retrieves and uses this information for answering user queries.', N'/tours', N'View Tours', 1, N'2026-09-22T16:53:46.523Z', N'2026-10-25T18:37:52.249Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (1438, N'DocumentationRepo', N'03_Executive_KPI_Dashboard_Guide.md', N'Projects', N'Overview & Purpose', N'What KPIs are available on the Executive Dashboard?
What are the 24 High-Impact KPIs in UNO ERP?
How is Tour Gross Margin calculated?
What is the target SLA for Departure Readiness Gate Pass Rate?
How is Excursion Yield per Passenger calculated?
What is Guide Cash Remittance Lag and what is its target SLA?
How to monitor supplier confirmation velocity?', N'How to 3. operational integrity & cash compliance kpis?', N'operational, integrity, cash, compliance, kpis, executive, kpi, dashboard, tour, operator, profit, optimization, guide, metrics, margin, efficiency, risk, departure, readiness, rooming, lock, accuracy, capacity, load, factor, remittance, lag, 03_executive_kpi_dashboard_guide, days, target', N'### 3. Operational Integrity & Cash Compliance KPIs

* **KPI 13: Guide Cash Remittance Lag (Days)**
  - **Target SLA**: `< 48 Hours`
  - **Formula**: `Average days from Tour End Date to physical cash bank deposit`
  - **Impact**: Enforces strict cash remittance timelines and secures on-time cash flow.
* **KPI 14: Excursion Cash Discrepancy Rate (%)**
  - **Target SLA**: `0.0% Variance`
  - **Formula**: `|Guide Cash Remitted - Expected Excursion Cash| / Total Excursion Sales`
  - **Impact**: Zero-tolerance policy on cash leakages and currency conversion errors.
* **KPI 15: Unassigned Tour Resource Ratio (%)**
  - **Target SLA**: `0% within 7 days of departure`
  - **Formula**: `(Tours Missing Hotel, Guide, or Transport / Total Tours) × 100`
* **KPI 16: Passenger Data Completeness (%)**
  - **Target SLA**: `100% (7 days prior)`
  - **Formula**: `(Passengers with valid passport & flight details / Total Passengers) × 100`
* **KPI 17: Supplier Payment On-Time Rate (%)**
  - **Target SLA**: `> 98%`
  - **Formula**: `(Invoices Paid Within Contractual Terms / Total Supplier Invoices) × 100`
* **KPI 18: Audit Trail Exception Count**
  - **Target SLA**: `< 5 Overrides / Month`
  - **Formula**: `Total manual price or status overrides logged in AuditLogs`', N'/projects', N'View Executive Dashboard', 1, N'2026-09-22T17:13:40.455Z', N'2026-10-25T18:37:52.160Z');
INSERT INTO [AiKnowledgeItems] ([Id], [SourceType], [SourceFile], [Category], [SubTopic], [TriggerQueries], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (2438, N'DocumentationRepo', N'Test_Live_Auto_Sync_Protocol.md', N'General', N'General', N'', N'How to description?', N'description, test_live_auto_sync_protocol, standard, operating, procedure, for, vip, arrivals, prague, rules, guidelines, all, group, must, receive, welcome, gift, baskets, containing, organic, moravian, wine, and, bohemian, wafers, the, lead, tour, guide, verify', N'### Description

Standard operating procedure for VIP arrivals in Prague.

#### Rules & Guidelines
- All VIP group arrivals in Prague must receive welcome gift baskets containing organic Moravian wine and Bohemian wafers.
- The lead tour guide must verify the baskets at least 2 hours prior to airport arrival.

#### Triggers
What is the VIP catering protocol in Prague?
Prague VIP welcome gift rules', N'/tours', N'View Tours', 1, N'2026-09-29T20:23:45.242Z', N'2026-09-29T20:23:45.242Z');
SET IDENTITY_INSERT [AiKnowledgeItems] OFF;
COMMIT TRANSACTION;
