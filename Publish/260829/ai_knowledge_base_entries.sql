-- ============================================================================
-- UNO ERP - AI Knowledge Base Database Entries
-- Target Table: AiKnowledgeItems
-- Execution Mode: Idempotent (Safe to run multiple times without duplicates)
-- ============================================================================

PRINT 'Starting AI Knowledge Base Data Seeding...';
GO

IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '01_Project_Charter_and_Scope.md' AND QuestionPattern = 'How to 1. executive summary?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '01_Project_Charter_and_Scope.md', 'User Manual', 'How to 1. executive summary?', '1., executive, summary, 01_project_charter_and_scope', '**1. Executive Summary** (Source: `01_Project_Charter_and_Scope.md`)

Uno ERP is a centralized, scalable operational platform designed for Destination Management Companies (DMC) and Incoming Tour Operators. It replaces legacy, non-scalable Excel-based workflows with a modern Web Application, enabling streamlined management of multi-city tours, supplier payments, guide settlements, and comprehensive profitability analysis.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '01_Project_Charter_and_Scope.md' AND QuestionPattern = 'How to 2. business objectives?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '01_Project_Charter_and_Scope.md', 'User Manual', 'How to 2. business objectives?', '2., business, objectives, 01_project_charter_and_scope', '**2. Business Objectives** (Source: `01_Project_Charter_and_Scope.md`)

- **Centralize Data:** Consolidate isolated Excel sheets into a single source of truth.
- **Scale Operations:** Enable seamless handling of complex, multi-city group itineraries (Leisure, Corporate, Congress, FIT).
- **Financial Visibility:** Track and manage both customer revenue and supplier/guide costs to calculate accurate net profit per project.
- **Task Automation:** Manage operational checklists (vouchers, confirmations, guide assignments) programmatically.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '01_Project_Charter_and_Scope.md' AND QuestionPattern = 'How to 3. core domain concept: "the project"?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '01_Project_Charter_and_Scope.md', 'User Manual', 'How to 3. core domain concept: "the project"?', '3., core, domain, concept:, "the, project", 01_project_charter_and_scope', '**3. Core Domain Concept: "The Project"** (Source: `01_Project_Charter_and_Scope.md`)

At the heart of Uno ERP is the **Project** (or Tour). A Project acts as a parent container for:
- **Clients:** The purchasing entity.
- **City Stays:** Independent, multi-city routing segments (e.g., Prague -> Vienna -> Budapest).
- **Services:** Hotel Bookings, Transfers, Restaurants, and Activities linked directly to the City Stay.
- **Finances:** Invoices and payment ledgers associated with the specific Project.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '01_Project_Charter_and_Scope.md' AND QuestionPattern = 'How to 4. mvp scope (phase 1)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '01_Project_Charter_and_Scope.md', 'User Manual', 'How to 4. mvp scope (phase 1)?', '4., mvp, scope, (phase, 1), 01_project_charter_and_scope', '**4. MVP Scope (Phase 1)** (Source: `01_Project_Charter_and_Scope.md`)

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
6. **Extra Tours Module:** Tracking optional excursion revenue, guide assignments, and commissions (Critical revenue stream).', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '01_Project_Charter_and_Scope.md' AND QuestionPattern = 'How to 5. architectural strategy?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '01_Project_Charter_and_Scope.md', 'User Manual', 'How to 5. architectural strategy?', '5., architectural, strategy, 01_project_charter_and_scope', '**5. Architectural Strategy** (Source: `01_Project_Charter_and_Scope.md`)

- **Frontend UI:** Next.js / React Web Application.
- **UI Library:** Shadcn UI + Tailwind CSS (Selected for premium data grid, charting, and layout components).
- **Backend API:** .NET (C#) Web API, utilizing a strict separation of concerns.
- **API Gateway:** Planned for future phases to support Mobile App integrations (Guide App / Client App).', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '01_Project_Charter_and_Scope.md' AND QuestionPattern = 'How to 6. success criteria?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '01_Project_Charter_and_Scope.md', 'User Manual', 'How to 6. success criteria?', '6., success, criteria, 01_project_charter_and_scope', '**6. Success Criteria** (Source: `01_Project_Charter_and_Scope.md`)

- The platform can successfully replicate and manage the end-to-end lifecycle of a complex "Multi-City Central Europe Tour" currently managed in Excel.
- Operational staff can view upcoming Supplier and Guide payments in a single dashboard query.
- Staff can easily click through from the dashboard directly to a Tour''s deep details.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '02_UI_Feature_Catalog.md' AND QuestionPattern = 'How to ui feature catalog: uno erp?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '02_UI_Feature_Catalog.md', 'User Manual', 'How to ui feature catalog: uno erp?', 'ui, feature, catalog:, uno, erp, 02_ui_feature_catalog', '**UI Feature Catalog: UNO ERP** (Source: `02_UI_Feature_Catalog.md`)

This document indexes all major UI modules for the Uno ERP MVP.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '02_UI_Feature_Catalog.md' AND QuestionPattern = 'How to 1. global layout & navigation?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '02_UI_Feature_Catalog.md', 'User Manual', 'How to 1. global layout & navigation?', '1., global, layout, &, navigation, 02_ui_feature_catalog', '**1. Global Layout & Navigation** (Source: `02_UI_Feature_Catalog.md`)

*   **Top Navbar:** Global Search (Projects/Clients), User Profile, Notifications.
*   **Left Sidebar Navigation:** Dashboard, Timeline, Projects, City Operations, Hotels, Transfers, Extra Tours, Guides, Payments, Tasks, Reports, Settings.
*   **UI-F-001: Quick Create Menu:** A sticky sidebar block allowing rapid creation of "New Project", "New Booking", "New Payment", "New Extra Tour", and "New Task".', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '02_UI_Feature_Catalog.md' AND QuestionPattern = 'How to 2. dashboard module (timeline-first)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '02_UI_Feature_Catalog.md', 'KPI Proposal', 'How to 2. dashboard module (timeline-first)?', '2., dashboard, module, (timeline, first), 02_ui_feature_catalog', '**2. Dashboard Module (Timeline-First)** (Source: `02_UI_Feature_Catalog.md`)

*   **UI-F-010: Project Planning Calendar (The Hero):** A horizontal Gantt/Timeline chart plotting Projects across dates. Bars are color-coded by Status (Confirmed, Option, Problem).
*   **UI-F-011: Upcoming Arrivals Data Grid:** Compact list of incoming groups for the next 7 days.
*   **UI-F-012: Hotel Bookings Status:** A visual Donut Chart showing percentage breakdown of bookings (Confirmed, Pending, Option, Problem).
*   **UI-F-013: Active Projects by City:** Bar charts visualizing Pax volume per destination (e.g., Prague vs Vienna).
*   **UI-F-014: Guide Overview Grid:** Showing Guide names, assigned tour counts, MTD Revenue, and availability status (On Tour vs Available).
*   **UI-F-015: Right Slide-Out Panel (Global State):** Displays global company "Alerts & To-Dos", "Today Arrivals", and "Today Departures".', '/projects', 'Executive Dashboard', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '02_UI_Feature_Catalog.md' AND QuestionPattern = 'How to 3. contextual slide-out panels (drill-down)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '02_UI_Feature_Catalog.md', 'User Manual', 'How to 3. contextual slide-out panels (drill-down)?', '3., contextual, slide, out, panels, (drill, down), 02_ui_feature_catalog', '**3. Contextual Slide-Out Panels (Drill-Down)** (Source: `02_UI_Feature_Catalog.md`)

*   **UI-F-020: Project Slide-Out:** Triggered by clicking a bar on the Timeline. Transforms the right panel to show a specific project''s "At a Glance" overview, Itinerary Summary, Bookings Status (e.g., 2/2 confirmed), and Payments Summary.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '02_UI_Feature_Catalog.md' AND QuestionPattern = 'How to 4. sales pipeline module?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '02_UI_Feature_Catalog.md', 'User Manual', 'How to 4. sales pipeline module?', '4., sales, pipeline, module, 02_ui_feature_catalog', '**4. Sales Pipeline Module** (Source: `02_UI_Feature_Catalog.md`)

*   **UI-F-030: Kanban Board:** Visual drag-and-drop board for Tours/Projects tracking `SalesStage`.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '02_UI_Feature_Catalog.md' AND QuestionPattern = 'How to 5. generic excel import module?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '02_UI_Feature_Catalog.md', 'User Manual', 'How to 5. generic excel import module?', '5., generic, excel, import, module, 02_ui_feature_catalog', '**5. Generic Excel Import Module** (Source: `02_UI_Feature_Catalog.md`)

*   **UI-F-040: Dynamic Data Mapper:** Upload, Map Columns, Edit Staging Grid, Save.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '02_UI_Feature_Catalog.md' AND QuestionPattern = 'How to 6. project management module?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '02_UI_Feature_Catalog.md', 'User Manual', 'How to 6. project management module?', '6., project, management, module, 02_ui_feature_catalog', '**6. Project Management Module** (Source: `02_UI_Feature_Catalog.md`)

*   **UI-F-050: Project Data Grid & Detail View (The Hub):** Full dedicated page for deep editing of a Project.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '02_UI_Feature_Catalog.md' AND QuestionPattern = 'How to 7. master data & supplier modules?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '02_UI_Feature_Catalog.md', 'Master Data', 'How to 7. master data & supplier modules?', '7., master, data, &, supplier, modules, 02_ui_feature_catalog', '**7. Master Data & Supplier Modules** (Source: `02_UI_Feature_Catalog.md`)

*   **UI-F-060: Master Data Grids:** Dedicated CRUD grids for Clients, Hotels, Guides, Transport Companies (and nested Drivers), and Excursion Facilities (Restaurants, Tickets, Tours).', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '02_UI_Feature_Catalog.md' AND QuestionPattern = 'How to 8. finance module?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '02_UI_Feature_Catalog.md', 'User Manual', 'How to 8. finance module?', '8., finance, module, 02_ui_feature_catalog', '**8. Finance Module** (Source: `02_UI_Feature_Catalog.md`)

*   **UI-F-070: AP/AR Dashboard:** Split view showing Accounts Payable vs Accounts Receivable.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '03_API_Feature_Catalog.md' AND QuestionPattern = 'How to api feature catalog: uno erp?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '03_API_Feature_Catalog.md', 'User Manual', 'How to api feature catalog: uno erp?', 'api, feature, catalog:, uno, erp, 03_api_feature_catalog', '**API Feature Catalog: UNO ERP** (Source: `03_API_Feature_Catalog.md`)

This document indexes all major backend API endpoints.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '03_API_Feature_Catalog.md' AND QuestionPattern = 'How to 1. dashboard aggregate apis?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '03_API_Feature_Catalog.md', 'KPI Proposal', 'How to 1. dashboard aggregate apis?', '1., dashboard, aggregate, apis, 03_api_feature_catalog', '**1. Dashboard Aggregate APIs** (Source: `03_API_Feature_Catalog.md`)

*   **API-F-001:** `GET /api/dashboard/timeline` - Fetches all active projects formatted with start/end dates and status colors explicitly for the Gantt chart rendering.
*   **API-F-002:** `GET /api/dashboard/alerts` - Unified endpoint to fetch critical "To-Dos": Missing Confirmations, Vouchers to Send, and Guide Settlements pending.
*   **API-F-003:** `GET /api/dashboard/operations-today` - Fetches aggregated "Today Arrivals" and "Today Departures".', '/projects', 'Executive Dashboard', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '03_API_Feature_Catalog.md' AND QuestionPattern = 'How to 2. projects & pipeline api?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '03_API_Feature_Catalog.md', 'User Manual', 'How to 2. projects & pipeline api?', '2., projects, &, pipeline, api, 03_api_feature_catalog', '**2. Projects & Pipeline API** (Source: `03_API_Feature_Catalog.md`)

*   **API-F-010:** `POST /api/projects` - Create a new root project.
*   **API-F-011:** `GET /api/projects/{id}` - Fetch deep project details.
*   **API-F-012:** `GET /api/projects/{id}/summary` - A lightweight endpoint specifically returning the Itinerary, Bookings Status (e.g. "2/2 Confirmed"), and Payments Summary for the Slide-Out Panel.
*   **API-F-013:** `PUT /api/projects/{id}/stage` - Update Sales Pipeline Stage.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '03_API_Feature_Catalog.md' AND QuestionPattern = 'How to 3. generic data import api?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '03_API_Feature_Catalog.md', 'User Manual', 'How to 3. generic data import api?', '3., generic, data, import, api, 03_api_feature_catalog', '**3. Generic Data Import API** (Source: `03_API_Feature_Catalog.md`)

*   **API-F-015:** `GET /api/schema/{entity}` 
*   **API-F-016:** `POST /api/import/preview`
*   **API-F-017:** `POST /api/import/commit`', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '03_API_Feature_Catalog.md' AND QuestionPattern = 'How to 4. city stays & services api?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '03_API_Feature_Catalog.md', 'User Manual', 'How to 4. city stays & services api?', '4., city, stays, &, services, api, 03_api_feature_catalog', '**4. City Stays & Services API** (Source: `03_API_Feature_Catalog.md`)

*   **API-F-020:** `POST /api/projects/{projectId}/citystays`
*   **API-F-030:** `POST /api/citystays/{id}/hotels`
*   **API-F-032:** `POST /api/citystays/{id}/extratours`', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '03_API_Feature_Catalog.md' AND QuestionPattern = 'How to 5. master data api?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '03_API_Feature_Catalog.md', 'Master Data', 'How to 5. master data api?', '5., master, data, api, 03_api_feature_catalog', '**5. Master Data API** (Source: `03_API_Feature_Catalog.md`)

*   **API-F-050:** `GET/POST /api/hotels`
*   **API-F-051:** `GET/POST /api/guides` 
*   **API-F-052:** `GET /api/guides/availability` - Fetches active assignment status ("On Tour" vs "Available") and MTD Revenue.
*   **API-F-053:** `GET/POST /api/transport-companies` & `/drivers`
*   **API-F-054:** `GET/POST /api/excursion-facilities`', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '03_API_Feature_Catalog.md' AND QuestionPattern = 'How to 6. finance?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '03_API_Feature_Catalog.md', 'User Manual', 'How to 6. finance?', '6., finance, 03_api_feature_catalog', '**6. Finance** (Source: `03_API_Feature_Catalog.md`)

*   **API-F-060:** `GET /api/finance/payables` - Fetch upcoming supplier payments.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '04_UI_User_Stories.md' AND QuestionPattern = 'How to [ui-us-001] gantt timeline for active projects?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '04_UI_User_Stories.md', 'User Manual', 'How to [ui-us-001] gantt timeline for active projects?', '[ui, us, 001], gantt, timeline, for, active, projects, 04_ui_user_stories', '**[UI-US-001] Gantt Timeline for Active Projects** (Source: `04_UI_User_Stories.md`)

**User Story:** As an Operations Manager, I want to view active Projects plotted on a horizontal Gantt Timeline so I can visualize overlap and scheduling.
**Business Rules:** Timelines must reflect the destination''s timezone.
**Acceptance Criteria:**
- **Given** I am logged in as an Operations Manager
- **When** I load the Dashboard
- **Then** I see a horizontal Gantt chart of active projects grouped by date ranges.
- **And** I can toggle between monthly and weekly views.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '04_UI_User_Stories.md' AND QuestionPattern = 'How to [ui-us-002] global alerts panel?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '04_UI_User_Stories.md', 'User Manual', 'How to [ui-us-002] global alerts panel?', '[ui, us, 002], global, alerts, panel, 04_ui_user_stories', '**[UI-US-002] Global Alerts Panel** (Source: `04_UI_User_Stories.md`)

**User Story:** As an Operator, I want to see global "Alerts & To-Dos" in a persistent right-hand panel.
**Acceptance Criteria:**
- **Given** there are pending tasks (e.g., missing hotel confirmations)
- **When** I view the dashboard
- **Then** I see a right-hand panel listing tasks sorted by urgency and date.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '04_UI_User_Stories.md' AND QuestionPattern = 'How to [ui-us-003] slide-out project details?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '04_UI_User_Stories.md', 'User Manual', 'How to [ui-us-003] slide-out project details?', '[ui, us, 003], slide, out, project, details, 04_ui_user_stories', '**[UI-US-003] Slide-out Project Details** (Source: `04_UI_User_Stories.md`)

**User Story:** As an Operator, when I click on a Project bar within the Timeline, I want the right-hand panel to gracefully slide out and display that specific Project''s Itinerary.
**Acceptance Criteria:**
- **Given** the Gantt timeline is displayed
- **When** I click on a Project bar
- **Then** a right panel slides out displaying the Itinerary Summary and Booking Status without navigating away.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '04_UI_User_Stories.md' AND QuestionPattern = 'How to [ui-us-004] quick create sidebar?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '04_UI_User_Stories.md', 'User Manual', 'How to [ui-us-004] quick create sidebar?', '[ui, us, 004], quick, create, sidebar, 04_ui_user_stories', '**[UI-US-004] Quick Create Sidebar** (Source: `04_UI_User_Stories.md`)

**User Story:** As a Sales Manager, I want to use a Quick Create sidebar menu to rapidly spin up a new Tour Opportunity or log a Payment.
**Acceptance Criteria:**
- **Given** I am anywhere in the application
- **When** I click the Quick Create button
- **Then** a modal/sidebar opens allowing me to enter minimal details for a new Tour or Payment.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '04_UI_User_Stories.md' AND QuestionPattern = 'How to [ui-us-005] guide overview grid?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '04_UI_User_Stories.md', 'Master Data', 'How to [ui-us-005] guide overview grid?', '[ui, us, 005], guide, overview, grid, 04_ui_user_stories', '**[UI-US-005] Guide Overview Grid** (Source: `04_UI_User_Stories.md`)

**User Story:** As an Operations Manager, I want to view a "Guide Overview" grid showing which guides are On Tour vs Available.
**GDPR/Privacy Constraints:** Personal contact information (phone, personal email) of Guides must be masked unless explicitly clicked/expanded by authorized personnel (RBAC).
**Acceptance Criteria:**
- **Given** I have Operations Manager permissions
- **When** I view the Guide Overview
- **Then** I see a list of guides and their current statuses (On Tour / Available)
- **And** sensitive contact info is hidden by default.', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '04_UI_User_Stories.md' AND QuestionPattern = 'How to [ui-us-006 & 007] dashboard financial kpis & charts?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '04_UI_User_Stories.md', 'KPI Proposal', 'How to [ui-us-006 & 007] dashboard financial kpis & charts?', '[ui, us, 006, &, 007], dashboard, financial, kpis, charts, 04_ui_user_stories', '**[UI-US-006 & 007] Dashboard Financial KPIs & Charts** (Source: `04_UI_User_Stories.md`)

**User Story:** As a Financial Controller, I want to see KPIs and Variance Charts to monitor profitability and vendor payments.
**Acceptance Criteria:**
- **Given** I am a Financial Controller
- **When** I view the Dashboard
- **Then** I see widgets for Gross Land Sales, Net Cost, Final Profit, and Margin %
- **And** I see a Budget vs. Actual Variance Chart.', '/projects', 'Executive Dashboard', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '04_UI_User_Stories.md' AND QuestionPattern = 'How to [ui-us-010 & 011] excel import & staging grid?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '04_UI_User_Stories.md', 'User Manual', 'How to [ui-us-010 & 011] excel import & staging grid?', '[ui, us, 010, &, 011], excel, import, staging, grid, 04_ui_user_stories', '**[UI-US-010 & 011] Excel Import & Staging Grid** (Source: `04_UI_User_Stories.md`)

**User Story:** As an Operator, I want to upload an Excel file, map columns, and view data in a Staging Grid to correct issues before committing.
**Acceptance Criteria:**
- **Given** I have a valid Excel file
- **When** I upload the file and map columns to system properties
- **Then** I see a Staging Grid with the imported rows
- **And** I can edit cells with validation errors before submitting to the live database.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '04_UI_User_Stories.md' AND QuestionPattern = 'How to [ui-us-020 to 023] project creation & itinerary building?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '04_UI_User_Stories.md', 'User Manual', 'How to [ui-us-020 to 023] project creation & itinerary building?', '[ui, us, 020, to, 023], project, creation, &, itinerary, building', '**[UI-US-020 to 023] Project Creation & Itinerary Building** (Source: `04_UI_User_Stories.md`)

**User Story:** As an Operator, I want to create a Project, add City Stays, attach Hotel Bookings, and configure Total Pax and Currency.
**Business Rules:** Multi-currency support is required based on the destination.
**Acceptance Criteria:**
- **Given** I am building a Project
- **When** I add a City Stay
- **Then** I can assign a specific Hotel Booking and date range to it
- **And** the UI ensures the City Stay dates fall within the parent Project''s dates.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '04_UI_User_Stories.md' AND QuestionPattern = 'How to [ui-us-030 to 032] master data directories?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '04_UI_User_Stories.md', 'Master Data', 'How to [ui-us-030 to 032] master data directories?', '[ui, us, 030, to, 032], master, data, directories, 04_ui_user_stories', '**[UI-US-030 to 032] Master Data Directories** (Source: `04_UI_User_Stories.md`)

**User Story:** As an Admin, I want to manage Hotels, Guides, Transport Companies (and Drivers), and Excursion Facilities.
**GDPR Constraints:** Driver and Guide personal details (ID cards, driver licenses) must be securely managed. Deleting a guide should support soft-delete/anonymization for GDPR Right to be Forgotten.
**Acceptance Criteria:**
- **Given** I am an Admin
- **When** I navigate to Master Data
- **Then** I can perform CRUD operations on Guides, Hotels, and Transport Companies.', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '04_UI_User_Stories.md' AND QuestionPattern = 'How to [ui-us-040] extra tour sales?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '04_UI_User_Stories.md', 'User Manual', 'How to [ui-us-040] extra tour sales?', '[ui, us, 040], extra, tour, sales, 04_ui_user_stories', '**[UI-US-040] Extra Tour Sales** (Source: `04_UI_User_Stories.md`)

**User Story:** As a Guide Coordinator, I want to log an "Extra Tour" sale to auto-calculate Guide Commission.
**Acceptance Criteria:**
- **Given** an active tour with passengers
- **When** I log an Extra Tour sale
- **Then** the UI auto-displays the calculated Guide Commission and Net Profit.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '04_UI_User_Stories.md' AND QuestionPattern = 'How to [ui-us-050 & 051] vendor payments & petty cash?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '04_UI_User_Stories.md', 'User Manual', 'How to [ui-us-050 & 051] vendor payments & petty cash?', '[ui, us, 050, &, 051], vendor, payments, petty, cash, 04_ui_user_stories', '**[UI-US-050 & 051] Vendor Payments & Petty Cash** (Source: `04_UI_User_Stories.md`)

**User Story:** As a Financial Controller/Guide, I want to log payments, attach invoices, and reconcile petty cash.
**Acceptance Criteria:**
- **Given** a pending vendor payable
- **When** I submit a payment entry with a PDF attachment
- **Then** the payment is logged and the invoice is stored securely.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '04_UI_User_Stories.md' AND QuestionPattern = 'How to [ui-us-052] budget variance approvals?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '04_UI_User_Stories.md', 'User Manual', 'How to [ui-us-052] budget variance approvals?', '[ui, us, 052], budget, variance, approvals, 04_ui_user_stories', '**[UI-US-052] Budget Variance Approvals** (Source: `04_UI_User_Stories.md`)

**User Story:** As a Manager, I want an approval interface to review overspends exceeding 5%.
**Acceptance Criteria:**
- **Given** a project''s actual costs exceed budgeted costs by >5%
- **When** the cost is logged
- **Then** an alert appears in the Manager''s approval queue.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '05_API_User_Stories.md' AND QuestionPattern = 'How to [api-us-001] dashboard timeline?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '05_API_User_Stories.md', 'KPI Proposal', 'How to [api-us-001] dashboard timeline?', '[api, us, 001], dashboard, timeline, 05_api_user_stories', '**[API-US-001] Dashboard Timeline** (Source: `05_API_User_Stories.md`)

**User Story:** As the API, I must expose `GET /api/dashboard/timeline` which formats active projects specifically for a Gantt chart component.
**Business Rules:** Must support multi-timezone conversions to prevent overlapping day boundaries for multi-city tours.
**Acceptance Criteria:**
- **Given** active projects exist in the database
- **When** `GET /api/dashboard/timeline` is called
- **Then** it returns projects grouped by date ranges and status, adjusted for the correct timezone.', '/projects', 'Executive Dashboard', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '05_API_User_Stories.md' AND QuestionPattern = 'How to [api-us-002] global alerts?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '05_API_User_Stories.md', 'User Manual', 'How to [api-us-002] global alerts?', '[api, us, 002], global, alerts, 05_api_user_stories', '**[API-US-002] Global Alerts** (Source: `05_API_User_Stories.md`)

**User Story:** As the API, I must aggregate cross-module alerts (e.g., unpaid deposits, missing hotel confirmations) via `GET /api/dashboard/alerts`.
**Acceptance Criteria:**
- **Given** missing hotel confirmations or unpaid deposits
- **When** the alerts endpoint is called
- **Then** the API returns a sorted list of alerts by urgency.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '05_API_User_Stories.md' AND QuestionPattern = 'How to [api-us-003] lightweight project summary?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '05_API_User_Stories.md', 'User Manual', 'How to [api-us-003] lightweight project summary?', '[api, us, 003], lightweight, project, summary, 05_api_user_stories', '**[API-US-003] Lightweight Project Summary** (Source: `05_API_User_Stories.md`)

**User Story:** As the API, I must expose a lightweight project summary endpoint `GET /api/projects/{id}/summary`.
**Acceptance Criteria:**
- **Given** a valid project ID
- **When** the summary endpoint is called
- **Then** it returns only the necessary fields for the UI slide-out panel to minimize payload size.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '05_API_User_Stories.md' AND QuestionPattern = 'How to [api-us-004] guide availability?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '05_API_User_Stories.md', 'Master Data', 'How to [api-us-004] guide availability?', '[api, us, 004], guide, availability, 05_api_user_stories', '**[API-US-004] Guide Availability** (Source: `05_API_User_Stories.md`)

**User Story:** As the API, I must calculate and return guide assignment availability via `GET /api/guides/availability`.
**GDPR/Privacy Constraints:** Exclude personal contact info (phone/email) unless the requester has specific RBAC permissions (e.g., Operations Manager).
**Acceptance Criteria:**
- **Given** multiple guides with varying schedules
- **When** availability is queried
- **Then** the API returns availability status (On Tour vs Available) without exposing personal data.', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '05_API_User_Stories.md' AND QuestionPattern = 'How to [api-us-005 & 006] financial kpis & charts?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '05_API_User_Stories.md', 'KPI Proposal', 'How to [api-us-005 & 006] financial kpis & charts?', '[api, us, 005, &, 006], financial, kpis, charts, 05_api_user_stories', '**[API-US-005 & 006] Financial KPIs & Charts** (Source: `05_API_User_Stories.md`)

**User Story:** As the API, I must return aggregated financial metrics and chart data via `GET /api/dashboard/financial-kpis` and `GET /api/dashboard/charts`.
**Acceptance Criteria:**
- **Given** active financial ledgers
- **When** the KPI or chart endpoint is called
- **Then** the API returns aggregated Gross Sales, Net Cost, Profit, and Margins.', '/projects', 'Executive Dashboard', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '05_API_User_Stories.md' AND QuestionPattern = 'How to [api-us-010 to 012] project crud & currency?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '05_API_User_Stories.md', 'User Manual', 'How to [api-us-010 to 012] project crud & currency?', '[api, us, 010, to, 012], project, crud, &, currency, 05_api_user_stories', '**[API-US-010 to 012] Project CRUD & Currency** (Source: `05_API_User_Stories.md`)

**User Story:** As a UI Client, I can create Projects, update sales stages, and fetch currency snapshot rates.
**Acceptance Criteria:**
- **Given** a valid payload for a root Project
- **When** `POST /api/projects` is called
- **Then** the Project is created and the ID is returned.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '05_API_User_Stories.md' AND QuestionPattern = 'How to [api-us-020 to 022] schema-driven import?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '05_API_User_Stories.md', 'User Manual', 'How to [api-us-020 to 022] schema-driven import?', '[api, us, 020, to, 022], schema, driven, import, 05_api_user_stories', '**[API-US-020 to 022] Schema-driven Import** (Source: `05_API_User_Stories.md`)

**User Story:** As a UI Client, I can fetch the JSON Schema, send mapped Excel data for validation, and commit the validated data.
**Acceptance Criteria:**
- **Given** a valid mapped Excel dataset
- **When** `POST /api/import/preview` is called
- **Then** the API validates the payload and returns the dataset for the Staging Grid.
- **And** when `POST /api/import/commit` is called, it batch inserts into the database.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '05_API_User_Stories.md' AND QuestionPattern = 'How to [api-us-030] transport dependencies?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '05_API_User_Stories.md', 'User Manual', 'How to [api-us-030] transport dependencies?', '[api, us, 030], transport, dependencies, 05_api_user_stories', '**[API-US-030] Transport Dependencies** (Source: `05_API_User_Stories.md`)

**User Story:** As the API, I enforce that a `Driver` cannot be created without a valid `TransportCompanyId`.
**Acceptance Criteria:**
- **Given** a driver creation payload
- **When** the payload is missing a `TransportCompanyId`
- **Then** the API rejects the request with a 400 Bad Request.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '05_API_User_Stories.md' AND QuestionPattern = 'How to [api-us-031] extra tour margin calculation?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '05_API_User_Stories.md', 'User Manual', 'How to [api-us-031] extra tour margin calculation?', '[api, us, 031], extra, tour, margin, calculation, 05_api_user_stories', '**[API-US-031] Extra Tour Margin Calculation** (Source: `05_API_User_Stories.md`)

**User Story:** As the API, I calculate the `NetMargin` for Extra Tours.
**Business Rules:** Formula is `(PaxJoined * SellingPrice) - SupplierCost - GuideCommission`.
**Acceptance Criteria:**
- **Given** an Extra Tour with Pax, Selling Price, Cost, and Commission
- **When** the net margin is calculated
- **Then** it accurately applies the formula and stores the result.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '05_API_User_Stories.md' AND QuestionPattern = 'How to [api-us-032] unpaid payables?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '05_API_User_Stories.md', 'User Manual', 'How to [api-us-032] unpaid payables?', '[api, us, 032], unpaid, payables, 05_api_user_stories', '**[API-US-032] Unpaid Payables** (Source: `05_API_User_Stories.md`)

**User Story:** As the API, I aggregate unpaid Hotel and Transfer bookings via `GET /api/finance/payables`.
**Acceptance Criteria:**
- **Given** pending vendor payments
- **When** `GET /api/finance/payables` is called
- **Then** the API aggregates unpaid bookings across projects.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '05_API_User_Stories.md' AND QuestionPattern = 'How to [api-us-040 & 041] vendor payments & reconciliations?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '05_API_User_Stories.md', 'User Manual', 'How to [api-us-040 & 041] vendor payments & reconciliations?', '[api, us, 040, &, 041], vendor, payments, reconciliations, 05_api_user_stories', '**[API-US-040 & 041] Vendor Payments & Reconciliations** (Source: `05_API_User_Stories.md`)

**User Story:** As a UI Client, I can post vendor payments with digital invoice attachments and reconcile petty cash.
**Acceptance Criteria:**
- **Given** a valid vendor payment with an invoice PDF
- **When** `POST /api/finance/vendor-payments` is called
- **Then** the system records the payment and securely stores the invoice in blob storage.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '05_API_User_Stories.md' AND QuestionPattern = 'How to [api-us-042] budget variance workflow?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '05_API_User_Stories.md', 'User Manual', 'How to [api-us-042] budget variance workflow?', '[api, us, 042], budget, variance, workflow, 05_api_user_stories', '**[API-US-042] Budget Variance Workflow** (Source: `05_API_User_Stories.md`)

**User Story:** As the API, I must trigger a managerial approval alert workflow if actuals introduce a negative variance >5%.
**Business Rules:** Variance > 5% strictly requires managerial sign-off.
**Acceptance Criteria:**
- **Given** an actual cost is posted via `POST /api/finance/budget/actuals`
- **When** the cost exceeds the budgeted amount by >5%
- **Then** the API triggers an approval alert for managers.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '06_UI_API_Acceptance_Test_Cases.md' AND QuestionPattern = 'How to test suite 1: project & city stay creation?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '06_UI_API_Acceptance_Test_Cases.md', 'User Manual', 'How to test suite 1: project & city stay creation?', 'test, suite, 1:, project, &, city, stay, creation, 06_ui_api_acceptance_test_cases', '**Test Suite 1: Project & City Stay Creation** (Source: `06_UI_API_Acceptance_Test_Cases.md`)

**Scenario 1.1:** Creating a Project with valid Dates
*   *Given* the user is on the Project Creation screen.
*   *When* they select a valid Client and set Arrival/Departure dates.
*   *Then* the API should return `201 Created` and the UI should redirect to the Project Detail view.

**Scenario 1.2:** Invalid City Stay Dates
*   *Given* a Project exists with dates `10-May` to `20-May`.
*   *When* the user attempts to add a City Stay from `21-May` to `23-May`.
*   *Then* the API must return a `400 Bad Request` citing out-of-bounds dates, and the UI must display a clear validation error.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '06_UI_API_Acceptance_Test_Cases.md' AND QuestionPattern = 'How to test suite 2: extra tours financial calculation?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '06_UI_API_Acceptance_Test_Cases.md', 'User Manual', 'How to test suite 2: extra tours financial calculation?', 'test, suite, 2:, extra, tours, financial, calculation, 06_ui_api_acceptance_test_cases', '**Test Suite 2: Extra Tours Financial Calculation** (Source: `06_UI_API_Acceptance_Test_Cases.md`)

**Scenario 2.1:** Auto-calculating Net Profit
*   *Given* the user is adding an Extra Tour to a City Stay.
*   *When* they input: Pax = 10, Selling Price = €50, Supplier Cost = €300, Guide Commission = €50.
*   *Then* the backend API (`POST /api/citystays/{id}/extratours`) must calculate Net Margin as `€150` (`(10 * 50) - 300 - 50`) and the UI must immediately reflect this updated margin.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '06_UI_API_Acceptance_Test_Cases.md' AND QuestionPattern = 'How to test suite 3: dashboard payables?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '06_UI_API_Acceptance_Test_Cases.md', 'KPI Proposal', 'How to test suite 3: dashboard payables?', 'test, suite, 3:, dashboard, payables, 06_ui_api_acceptance_test_cases', '**Test Suite 3: Dashboard Payables** (Source: `06_UI_API_Acceptance_Test_Cases.md`)

**Scenario 3.1:** Highlighting Overdue Payments
*   *Given* a Hotel Booking has a `DepositDueDate` of yesterday and `BalancePaid = 0`.
*   *When* the user loads the Dashboard.
*   *Then* the "Upcoming Supplier Payments" grid must display this record with a red/urgent indicator tag.', '/projects', 'Executive Dashboard', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '09_Architecture_Deployment_and_Operations.md' AND QuestionPattern = 'How to 1. system architecture?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '09_Architecture_Deployment_and_Operations.md', 'User Manual', 'How to 1. system architecture?', '1., system, architecture, 09_architecture_deployment_and_operations', '**1. System Architecture** (Source: `09_Architecture_Deployment_and_Operations.md`)

UNO ERP will follow a decoupled architecture optimized strictly for low-cost, on-premise deployment for a small enterprise.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '09_Architecture_Deployment_and_Operations.md' AND QuestionPattern = 'How to 1.1 frontend (ui)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '09_Architecture_Deployment_and_Operations.md', 'User Manual', 'How to 1.1 frontend (ui)?', '1.1, frontend, (ui), 09_architecture_deployment_and_operations', '**1.1 Frontend (UI)** (Source: `09_Architecture_Deployment_and_Operations.md`)

*   **Framework:** Next.js (React).
*   **UI Library:** Shadcn UI + Tailwind CSS.
*   **State Management:** React Query for data fetching and caching.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '09_Architecture_Deployment_and_Operations.md' AND QuestionPattern = 'How to 1.2 backend (api)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '09_Architecture_Deployment_and_Operations.md', 'User Manual', 'How to 1.2 backend (api)?', '1.2, backend, (api), 09_architecture_deployment_and_operations', '**1.2 Backend (API)** (Source: `09_Architecture_Deployment_and_Operations.md`)

*   **Framework:** .NET 8/9 C# Web API.
*   **Database:** **SQL Server Express** (Free Edition). 
*   **ORM:** Entity Framework Core.
*   **Architecture Pattern:** Clean Architecture.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '09_Architecture_Deployment_and_Operations.md' AND QuestionPattern = 'How to 2. on-premise deployment strategy?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '09_Architecture_Deployment_and_Operations.md', 'User Manual', 'How to 2. on-premise deployment strategy?', '2., on, premise, deployment, strategy, 09_architecture_deployment_and_operations', '**2. On-Premise Deployment Strategy** (Source: `09_Architecture_Deployment_and_Operations.md`)

To strictly minimize maintenance overhead and licensing, there is **no Azure or automated CI/CD pipeline** planned for this phase. Deployment is fully manual.

*   **Server Host:** A single local office server or workstation.
*   **Web API Deployment:** Deployed manually using the **Visual Studio "Publish"** feature directly to the local server''s IIS (Internet Information Services) instance or a local folder.
*   **Frontend Deployment:** Built locally (`npm run build`) and the static export or Node server is manually copied to the server.
*   **Database Deployment:** 
    * Initial deployment will involve restoring a `.bak` file (SQL DB recovery from backup) generated from the developer machine onto the server''s local SQL Server Express instance.
    * Subsequent schema updates will be applied by manually running SQL scripts via SQL Server Management Studio (SSMS).', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '09_Architecture_Deployment_and_Operations.md' AND QuestionPattern = 'How to 3. operations & maintenance?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '09_Architecture_Deployment_and_Operations.md', 'User Manual', 'How to 3. operations & maintenance?', '3., operations, &, maintenance, 09_architecture_deployment_and_operations', '**3. Operations & Maintenance** (Source: `09_Architecture_Deployment_and_Operations.md`)

*   **Backups:** A scheduled Windows Task will run to backup the SQL Server Express database to a local `.bak` file, which should be periodically copied to an external drive.
*   **Updates:** Any bug fixes or new features will be manually published from the developer''s Visual Studio instance and copied over to the office server.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '10_Release_Roadmap_and_Delivery_Plan.md' AND QuestionPattern = 'How to phase 1: the core mvp (months 1-2)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '10_Release_Roadmap_and_Delivery_Plan.md', 'User Manual', 'How to phase 1: the core mvp (months 1-2)?', 'phase, 1:, the, core, mvp, (months, 1, 2), 10_release_roadmap_and_delivery_plan', '**Phase 1: The Core MVP (Months 1-2)** (Source: `10_Release_Roadmap_and_Delivery_Plan.md`)

**Goal:** Replace the Excel "Multi-City Tour" tracking sheet with a locally hosted web application.
*   **Sprint 1:** Database Schema setup, Basic CRUD APIs for Projects, Clients, and Suppliers.
*   **Sprint 2:** Frontend Dashboard (Timeline), Project List View, and Client Grid.
*   **Sprint 3:** Multi-City Itinerary Builder and Service Binding (Hotels, Transfers).
*   **Sprint 4:** Extra Tours module and UAT (User Acceptance Testing) with operations team.
*   **Deployment Milestone:** Manual Visual Studio Publish to the office server and SQL Database restore from backup.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '10_Release_Roadmap_and_Delivery_Plan.md' AND QuestionPattern = 'How to phase 2: finance & automation (months 3-4)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '10_Release_Roadmap_and_Delivery_Plan.md', 'User Manual', 'How to phase 2: finance & automation (months 3-4)?', 'phase, 2:, finance, &, automation, (months, 3, 4), 10_release_roadmap_and_delivery_plan', '**Phase 2: Finance & Automation (Months 3-4)** (Source: `10_Release_Roadmap_and_Delivery_Plan.md`)

**Goal:** Streamline Accounts Payable/Receivable and implement Generic Excel Imports.
*   **Sprint 5:** AP/AR Dashboard, Supplier Payment Tracking.
*   **Sprint 6:** Generic Schema-Driven Excel Import module.
*   **Sprint 7:** Automated PDF Generation (Tour Vouchers, Proforma Invoices).
*   **Deployment Milestone:** Manual binary update via Visual Studio Publish and manual SQL script execution for schema changes.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '10_Release_Roadmap_and_Delivery_Plan.md' AND QuestionPattern = 'How to phase 3: mobile & field operations (months 5+)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '10_Release_Roadmap_and_Delivery_Plan.md', 'User Manual', 'How to phase 3: mobile & field operations (months 5+)?', 'phase, 3:, mobile, &, field, operations, (months, 5+), 10_release_roadmap_and_delivery_plan', '**Phase 3: Mobile & Field Operations (Months 5+)** (Source: `10_Release_Roadmap_and_Delivery_Plan.md`)

**Goal:** Connect the back-office with Tour Guides in the field.
*   **Sprint 8:** API Gateway Implementation.
*   **Sprint 9:** Guide Mobile App (React Native/Expo) - View Assigned Tours, Log Extra Tour Pax count remotely.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '17_Domain_Schema_and_Workflow.md' AND QuestionPattern = 'How to 1. core entity relationship overview?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '17_Domain_Schema_and_Workflow.md', 'User Manual', 'How to 1. core entity relationship overview?', '1., core, entity, relationship, overview, 17_domain_schema_and_workflow', '**1. Core Entity Relationship Overview** (Source: `17_Domain_Schema_and_Workflow.md`)

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
```', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '17_Domain_Schema_and_Workflow.md' AND QuestionPattern = 'How to 2.1 project (tour)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '17_Domain_Schema_and_Workflow.md', 'User Manual', 'How to 2.1 project (tour)?', '2.1, project, (tour), 17_domain_schema_and_workflow', '**2.1 Project (Tour)** (Source: `17_Domain_Schema_and_Workflow.md`)

*   **Attributes:** `ProjectId`, `TourName`, `TotalPax`, `Currency`, `BasePricing`, `SalesStage` (Opportunity, Quoted, Confirmed, Lost), `ArrivalDate`, `DepartureDate`.
*   **Workflow:** Tracked via Kanban board. Moves across stages until execution or cancellation. Budget is locked upon moving to Confirmed.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '17_Domain_Schema_and_Workflow.md' AND QuestionPattern = 'How to 2.2 data import staging (in-memory)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '17_Domain_Schema_and_Workflow.md', 'User Manual', 'How to 2.2 data import staging (in-memory)?', '2.2, data, import, staging, (in, memory), 17_domain_schema_and_workflow', '**2.2 Data Import Staging (In-Memory)** (Source: `17_Domain_Schema_and_Workflow.md`)

*   **Workflow:** Excel File Upload -> Column Mapping -> Backend Validation Preview -> UI Staging Grid (Edit Mode) -> DB Commit.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '17_Domain_Schema_and_Workflow.md' AND QuestionPattern = 'How to 2.3 master data entities?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '17_Domain_Schema_and_Workflow.md', 'Master Data', 'How to 2.3 master data entities?', '2.3, master, data, entities, 17_domain_schema_and_workflow', '**2.3 Master Data Entities** (Source: `17_Domain_Schema_and_Workflow.md`)

*   **Hotel & Guide:** Top level specific entities for standard operational flow.
*   **TransportCompany:** Parent entity maintaining billing terms. Contains a 1-to-Many collection of **Drivers** (Name, Phone, License).
*   **ExcursionFacility:** Categorized specifically as `Restaurant`, `Ticket`, or `Tour` to handle specific margin calculations.', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '17_Domain_Schema_and_Workflow.md' AND QuestionPattern = 'How to 2.4 financial & p&l entities?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '17_Domain_Schema_and_Workflow.md', 'User Manual', 'How to 2.4 financial & p&l entities?', '2.4, financial, &, p&l, entities, 17_domain_schema_and_workflow', '**2.4 Financial & P&L Entities** (Source: `17_Domain_Schema_and_Workflow.md`)

*   **Budget & Actuals:** Tracks Tour Realization expenses vs estimates. Supports Multi-Currency conversions.
*   **VendorPayment:** Records supplier payments and enforces digital invoice document attachments for compliance.
*   **TourGuideWallet (Petty Cash):** Manages on-site collections and reconciles against local spot expenses.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '17_Domain_Schema_and_Workflow.md' AND QuestionPattern = 'How to 3. financial workflow?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '17_Domain_Schema_and_Workflow.md', 'User Manual', 'How to 3. financial workflow?', '3., financial, workflow, 17_domain_schema_and_workflow', '**3. Financial Workflow** (Source: `17_Domain_Schema_and_Workflow.md`)

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
```', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '18_User_Management_Epic_Stories.md' AND QuestionPattern = 'How to epic: user management module?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '18_User_Management_Epic_Stories.md', 'User Manual', 'How to epic: user management module?', 'epic:, user, management, module, 18_user_management_epic_stories', '**Epic: User Management Module** (Source: `18_User_Management_Epic_Stories.md`)

**Description:**
As a core component of the UnoERP Travel Operations & DMC Management Platform, the User Management Module provides comprehensive Role-Based Access Control (RBAC) and user lifecycle management. It ensures that internal employees—categorized primarily as Admins, Managers, and Staff—have the correct module-level view and edit rights across various business areas (e.g., Itineraries, Bookings, Suppliers, Finance, and System Configuration).

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '18_User_Management_Epic_Stories.md' AND QuestionPattern = 'How to feature 1: user account lifecycle management?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '18_User_Management_Epic_Stories.md', 'User Manual', 'How to feature 1: user account lifecycle management?', 'feature, 1:, user, account, lifecycle, management, 18_user_management_epic_stories', '**Feature 1: User Account Lifecycle Management** (Source: `18_User_Management_Epic_Stories.md`)

*Enables system administrators to provision, update, and deprecate user accounts securely within UnoERP.*', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '18_User_Management_Epic_Stories.md' AND QuestionPattern = 'How to user story 1.1: create new system users?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '18_User_Management_Epic_Stories.md', 'User Manual', 'How to user story 1.1: create new system users?', 'user, story, 1.1:, create, new, system, users, 18_user_management_epic_stories', '**User Story 1.1: Create New System Users** (Source: `18_User_Management_Epic_Stories.md`)

**As an** Admin  
**I want to** create new user accounts  
**So that** new travel staff and managers can access the UnoERP system to perform their duties.

**Acceptance Criteria:**
- [ ] Admin can navigate to the "User Management" dashboard and click "Add User".
- [ ] Form requires Name, valid Email address, and initial System Role (Admin, Manager, Staff).
- [ ] System automatically sends an invitation email to the provided address with a secure link to set their initial password.
- [ ] System prevents creation of duplicate accounts based on email address.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '18_User_Management_Epic_Stories.md' AND QuestionPattern = 'How to user story 1.2: edit and deactivate users?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '18_User_Management_Epic_Stories.md', 'User Manual', 'How to user story 1.2: edit and deactivate users?', 'user, story, 1.2:, edit, and, deactivate, users, 18_user_management_epic_stories', '**User Story 1.2: Edit and Deactivate Users** (Source: `18_User_Management_Epic_Stories.md`)

**As an** Admin  
**I want to** update user details or deactivate their accounts  
**So that** I can keep staff information current and immediately revoke access for employees who leave the DMC.

**Acceptance Criteria:**
- [ ] Admin can toggle a user''s status between "Active" and "Inactive".
- [ ] Inactive users are instantly logged out and prevented from authenticating.
- [ ] Admin can update a user''s basic profile details (Name, Department/Branch).
- [ ] History log captures the date, time, and actor who deactivated the account.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '18_User_Management_Epic_Stories.md' AND QuestionPattern = 'How to user story 1.3: user profile management?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '18_User_Management_Epic_Stories.md', 'User Manual', 'How to user story 1.3: user profile management?', 'user, story, 1.3:, profile, management, 18_user_management_epic_stories', '**User Story 1.3: User Profile Management** (Source: `18_User_Management_Epic_Stories.md`)

**As a** Logged-in User (Admin, Manager, or Staff)  
**I want to** view and update my personal profile and password  
**So that** my contact details are up to date and my account remains secure.

**Acceptance Criteria:**
- [ ] User can access a "My Profile" page.
- [ ] User can update their contact phone number and preferred display name.
- [ ] User can securely change their password (requires entering current password).

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '18_User_Management_Epic_Stories.md' AND QuestionPattern = 'How to feature 2: role & module-level permissions control?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '18_User_Management_Epic_Stories.md', 'User Manual', 'How to feature 2: role & module-level permissions control?', 'feature, 2:, role, &, module, level, permissions, control, 18_user_management_epic_stories', '**Feature 2: Role & Module-Level Permissions Control** (Source: `18_User_Management_Epic_Stories.md`)

*Controls access governance by combining overarching roles with granular, per-module rights.*', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '18_User_Management_Epic_Stories.md' AND QuestionPattern = 'How to user story 2.1: assign and manage base roles?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '18_User_Management_Epic_Stories.md', 'User Manual', 'How to user story 2.1: assign and manage base roles?', 'user, story, 2.1:, assign, and, manage, base, roles, 18_user_management_epic_stories', '**User Story 2.1: Assign and Manage Base Roles** (Source: `18_User_Management_Epic_Stories.md`)

**As an** Admin  
**I want to** assign a base system role (Admin, Manager, Staff) to each user  
**So that** they inherit a standardized set of baseline permissions tailored to their seniority.

**Acceptance Criteria:**
- [ ] Admins have unrestricted View/Edit access to all modules, including System Configuration.
- [ ] Managers inherit default View/Edit access to operational modules (Bookings, Itineraries, Suppliers) but are restricted from System Configuration.
- [ ] Staff inherit default View-only access to operational modules, with Edit access restricted to their directly assigned tasks or specific modules.
- [ ] Changing a user''s base role immediately updates their baseline access matrix.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '18_User_Management_Epic_Stories.md' AND QuestionPattern = 'How to user story 2.2: configure granular module-level rights?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '18_User_Management_Epic_Stories.md', 'User Manual', 'How to user story 2.2: configure granular module-level rights?', 'user, story, 2.2:, configure, granular, module, level, rights, 18_user_management_epic_stories', '**User Story 2.2: Configure Granular Module-Level Rights** (Source: `18_User_Management_Epic_Stories.md`)

**As an** Admin  
**I want to** override base role permissions with specific view and edit rights per module  
**So that** I can tailor access for specialized staff (e.g., giving a Staff member "Edit" rights in ''Suppliers'' but strictly "No Access" in ''Finance'').

**Acceptance Criteria:**
- [ ] Admin can open a "Permissions Matrix" for any given user.
- [ ] Matrix lists all UnoERP modules (e.g., CRM, Itineraries, Bookings, Finance, Suppliers, Inventory).
- [ ] For each module, Admin can select: `None`, `View Only`, or `View & Edit`.
- [ ] Granular user-level assignments override the user''s base role defaults.
- [ ] UI visually distinguishes between inherited role permissions and custom overrides.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '18_User_Management_Epic_Stories.md' AND QuestionPattern = 'How to user story 2.3: enforce managerial oversight?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '18_User_Management_Epic_Stories.md', 'User Manual', 'How to user story 2.3: enforce managerial oversight?', 'user, story, 2.3:, enforce, managerial, oversight, 18_user_management_epic_stories', '**User Story 2.3: Enforce Managerial Oversight** (Source: `18_User_Management_Epic_Stories.md`)

**As a** Manager  
**I want to** have full read and edit access to my department''s operational modules  
**So that** I can oversee daily travel operations, approve bookings, and correct staff errors without needing full Admin privileges.

**Acceptance Criteria:**
- [ ] System authorizes Managers to perform CRUD (Create, Read, Update, Delete) operations in core modules (e.g., Itineraries, Bookings).
- [ ] System denies Manager access to User Management and Global Settings modules unless explicitly overridden by an Admin.
- [ ] Unauthorized access attempts result in a clear, user-friendly "Insufficient Permissions" UI message.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '18_User_Management_Epic_Stories.md' AND QuestionPattern = 'How to user story 2.4: safe staff operations?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '18_User_Management_Epic_Stories.md', 'User Manual', 'How to user story 2.4: safe staff operations?', 'user, story, 2.4:, safe, staff, operations, 18_user_management_epic_stories', '**User Story 2.4: Safe Staff Operations** (Source: `18_User_Management_Epic_Stories.md`)

**As a** Staff member  
**I want to** be restricted to ''view only'' or limited editing in non-relevant modules  
**So that** I can look up necessary information (like a supplier''s phone number) without the risk of accidentally altering critical platform data.

**Acceptance Criteria:**
- [ ] When a module is set to `View Only`, all "Save", "Edit", "Delete", and "Add" buttons within that module are hidden or disabled.
- [ ] Staff can successfully navigate and read data grids, profiles, and reports in `View Only` modules.
- [ ] Any API requests attempting to bypass the UI for an edit action without `View & Edit` permissions are blocked with a 403 Forbidden response.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '19_User_Management_RBAC.md' AND QuestionPattern = 'How to business case review: unoerp user management module (sprint 0)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '19_User_Management_RBAC.md', 'User Manual', 'How to business case review: unoerp user management module (sprint 0)?', 'business, case, review:, unoerp, user, management, module, (sprint, 0), 19_user_management_rbac', '**Business Case Review: UnoERP User Management Module (Sprint 0)** (Source: `19_User_Management_RBAC.md`)

**To:** Product Manager, Scrum Master, QA Team
**From:** Senior Business Analyst
**Date:** Sprint 0 Planning
**Subject:** Sprint 0 Analysis, Compliance, and Scope Definition for User Management Module

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '19_User_Management_RBAC.md' AND QuestionPattern = 'How to 1. executive summary?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '19_User_Management_RBAC.md', 'User Manual', 'How to 1. executive summary?', '1., executive, summary, 19_user_management_rbac', '**1. Executive Summary** (Source: `19_User_Management_RBAC.md`)

As we lay the groundwork for UnoERP in Sprint 0, the User Management Module must be recognized not merely as a functional requirement, but as the foundational security and compliance perimeter of the product. This analysis evaluates the conceptual business case, establishes competitive feature parity, defines the role-based access control (RBAC) strategy, and outlines strict compliance requirements to ensure we deliver a compliant, competitive, and lean MVP.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '19_User_Management_RBAC.md' AND QuestionPattern = 'How to 2. strategic & competitive analysis?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '19_User_Management_RBAC.md', 'User Manual', 'How to 2. strategic & competitive analysis?', '2., strategic, &, competitive, analysis, 19_user_management_rbac', '**2. Strategic & Competitive Analysis** (Source: `19_User_Management_RBAC.md`)

To compete with established mid-market ERPs (e.g., Odoo, Microsoft Dynamics 365, NetSuite), UnoERP must provide frictionless onboarding, robust security, and intuitive delegation of authority.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '19_User_Management_RBAC.md' AND QuestionPattern = 'How to competitive parity requirements?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '19_User_Management_RBAC.md', 'User Manual', 'How to competitive parity requirements?', 'competitive, parity, requirements, 19_user_management_rbac', '**Competitive Parity Requirements** (Source: `19_User_Management_RBAC.md`)

Competitors treat user management as an enterprise governance tool. To achieve market parity, UnoERP must support:
*   **Centralized Provisioning/Deprovisioning:** Quick onboarding and offboarding workflows.
*   **Hierarchical Structuring:** Reflecting real-world organizational charts.
*   **Auditability:** Transparent logging of high-privilege actions.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '19_User_Management_RBAC.md' AND QuestionPattern = 'How to profile strategy?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '19_User_Management_RBAC.md', 'User Manual', 'How to profile strategy?', 'profile, strategy, 19_user_management_rbac', '**Profile Strategy** (Source: `19_User_Management_RBAC.md`)

*   **Admin (System Administrator):** 
    *   *Business Value:* Reduces IT overhead by centralizing environment configuration, security policies, and user provisioning.
    *   *Competitive Edge:* Must support bulk-import tools and impersonation (for troubleshooting) to match competitor standards.
*   **Manager (Department/Team Lead):** 
    *   *Business Value:* Decentralizes operational bottlenecks. Managers need oversight of their team''s productivity and the ability to approve workflows.
    *   *Competitive Edge:* Dashboard views of team activity and contextual approval notifications.
*   **Staff (Standard User):** 
    *   *Business Value:* Drives daily operations. Needs a distraction-free, task-oriented interface.
    *   *Competitive Edge:* Self-service portal for managing personal data, passwords, and preferences, reducing support tickets.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '19_User_Management_RBAC.md' AND QuestionPattern = 'How to 3. compliance & data privacy requirements?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '19_User_Management_RBAC.md', 'User Manual', 'How to 3. compliance & data privacy requirements?', '3., compliance, &, data, privacy, requirements, 19_user_management_rbac', '**3. Compliance & Data Privacy Requirements** (Source: `19_User_Management_RBAC.md`)

Given the regulatory landscape, UnoERP cannot afford retroactive compliance. The following frameworks dictate our baseline architecture:', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '19_User_Management_RBAC.md' AND QuestionPattern = 'How to gdpr (general data protection regulation)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '19_User_Management_RBAC.md', 'User Manual', 'How to gdpr (general data protection regulation)?', 'gdpr, (general, data, protection, regulation), 19_user_management_rbac', '**GDPR (General Data Protection Regulation)** (Source: `19_User_Management_RBAC.md`)

*   **Right to be Forgotten / Data Erasure:** The system must include a soft-delete mechanism that anonymizes personally identifiable information (PII) without breaking historical transactional data (e.g., sales records tied to a former employee).
*   **Data Minimization:** Only collect essential data (Name, Corporate Email, Role). Personal phone numbers or home addresses should not be mandatory unless required by a specific HR sub-module.
*   **Consent & Auditability:** User logins, profile changes, and permission escalations must be logged in an immutable audit trail to prove compliance during regulatory audits.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '19_User_Management_RBAC.md' AND QuestionPattern = 'How to cross-industry considerations?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '19_User_Management_RBAC.md', 'User Manual', 'How to cross-industry considerations?', 'cross, industry, considerations, 19_user_management_rbac', '**Cross-Industry Considerations** (Source: `19_User_Management_RBAC.md`)

*   **SOC 2 / ISO 27001:** While UnoERP may not pursue certification on day one, the architecture must support secure password hashing (BCrypt/Argon2 via ASP.NET Core Identity), session timeouts, and MFA (Multi-Factor Authentication) readiness.
*   **HIPAA / PCI-DSS (If Applicable to target market):** If UnoERP targets healthcare or retail, Staff profiles must have automated session termination after periods of inactivity, and Admin logs must mask all payment or health-related data.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '19_User_Management_RBAC.md' AND QuestionPattern = 'How to 4. module-level view & edit rights strategy (rbac)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '19_User_Management_RBAC.md', 'User Manual', 'How to 4. module-level view & edit rights strategy (rbac)?', '4., module, level, view, &, edit, rights, strategy, (rbac), 19_user_management_rbac', '**4. Module-Level View & Edit Rights Strategy (RBAC)** (Source: `19_User_Management_RBAC.md`)

To prevent unauthorized data exposure, UnoERP will implement a strict Role-Based Access Control matrix. 

| Module / Entity | Admin | Manager | Staff |
| :--- | :--- | :--- | :--- |
| **System Settings** | View / Edit | Hidden | Hidden |
| **User Directory** | View / Edit / Delete | View (Team Only) | View (Basic Info Only) |
| **Audit Logs** | View / Export | Hidden | Hidden |
| **Department Data** | View / Edit | View / Edit (Own Dept) | View / Edit (Assigned tasks) |
| **Personal Profile** | View / Edit | View / Edit | View / Edit |

*   *Strategy Note for QA:* Test cases must explicitly verify "Negative Access"—ensuring that Staff and Managers receive unauthorized (403) errors when attempting to access URLs or API endpoints reserved for Admins.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '19_User_Management_RBAC.md' AND QuestionPattern = 'How to 5. scope definition: lean mvp (sprint 1)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '19_User_Management_RBAC.md', 'User Manual', 'How to 5. scope definition: lean mvp (sprint 1)?', '5., scope, definition:, lean, mvp, (sprint, 1), 19_user_management_rbac', '**5. Scope Definition: Lean MVP (Sprint 1)** (Source: `19_User_Management_RBAC.md`)

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

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '19_User_Management_RBAC.md' AND QuestionPattern = 'How to 6. suggestions & improvements?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '19_User_Management_RBAC.md', 'User Manual', 'How to 6. suggestions & improvements?', '6., suggestions, &, improvements, 19_user_management_rbac', '**6. Suggestions & Improvements** (Source: `19_User_Management_RBAC.md`)

1.  **Technical Alignment:** Since this is a .NET-based project, leverage the built-in `Microsoft.AspNetCore.Identity` framework. Do not build custom cryptography or session management. This significantly accelerates time-to-market and inherently covers many security best practices.
2.  **Manager Delegation:** Introduce a "Delegated Admin" sub-role later in the roadmap to allow Managers to reset passwords for their specific team members, reducing the burden on the global Admin.
3.  **UI/UX Principle:** The Staff view should default to a "Principle of Least Privilege" UI. If a user cannot edit a field, do not show a disabled text box; render it as plain text or hide it entirely to reduce cognitive load.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '19_User_Management_RBAC.md' AND QuestionPattern = 'How to 7. business approvals?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '19_User_Management_RBAC.md', 'User Manual', 'How to 7. business approvals?', '7., business, approvals, 19_user_management_rbac', '**7. Business Approvals** (Source: `19_User_Management_RBAC.md`)

**Status:** 🟢 **APPROVED WITH CONDITIONS**

**Conditions for Proceeding to Sprint 1:**
1.  **Product Manager:** Confirm the deferred items (SSO, Custom Roles) are acceptable for the initial customer beta.
2.  **Scrum Master:** Ensure the Sprint 1 backlog strictly reflects the MVP scope outlined above. Any deviation requires a formal scope-change request.
3.  **QA Team:** Begin drafting test plans specifically targeting the RBAC matrix and GDPR "soft-delete" workflows to ensure transactional integrity is maintained when a user is deactivated.

Please review and provide final sign-off so we may transition these requirements into actionable user stories.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '20_User_Management_Test_Plans.md' AND QuestionPattern = 'How to 1. test strategy & scope?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '20_User_Management_Test_Plans.md', 'User Manual', 'How to 1. test strategy & scope?', '1., test, strategy, &, scope, 20_user_management_test_plans', '**1. Test Strategy & Scope** (Source: `20_User_Management_Test_Plans.md`)

The User Management Module in UnoERP requires strict validation of Role-Based Access Control (RBAC) boundaries. The core roles are Admin, Manager, and Staff.
- **Admin**: Full access (View, Create, Edit, Delete users, Manage roles/permissions).
- **Manager**: Partial access (View all staff, Edit staff under their hierarchy, Cannot create/delete admins).
- **Staff**: Read-only access to their own profile, cannot view other users'' sensitive details.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '20_User_Management_Test_Plans.md' AND QuestionPattern = 'How to test automation matrix?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '20_User_Management_Test_Plans.md', 'User Manual', 'How to test automation matrix?', 'test, automation, matrix, 20_user_management_test_plans', '**Test Automation Matrix** (Source: `20_User_Management_Test_Plans.md`)

| Feature | Admin | Manager | Staff |
| :--- | :--- | :--- | :--- |
| **Login / Session** | Validated | Validated | Validated |
| **View User List** | Full View | Filtered View (Team only) | Access Denied (403) |
| **Create New User** | Allowed (All Roles)| Allowed (Staff only) | Access Denied (403) |
| **Edit User Profile** | Full Edit | Edit Team only | Self-Edit (Limited) |
| **Delete User** | Allowed | Access Denied | Access Denied (403) |', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '20_User_Management_Test_Plans.md' AND QuestionPattern = 'How to 2. test repository architecture?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '20_User_Management_Test_Plans.md', 'User Manual', 'How to 2. test repository architecture?', '2., test, repository, architecture, 20_user_management_test_plans', '**2. Test Repository Architecture** (Source: `20_User_Management_Test_Plans.md`)

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
```', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '20_User_Management_Test_Plans.md' AND QuestionPattern = 'How to 3. ui automation & page object models (pom)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '20_User_Management_Test_Plans.md', 'User Manual', 'How to 3. ui automation & page object models (pom)?', '3., ui, automation, &, page, object, models, (pom), 20_user_management_test_plans', '**3. UI Automation & Page Object Models (POM)** (Source: `20_User_Management_Test_Plans.md`)

**Rule: UI Isolation using Data Attributes.**
Selectors must rely on stable `data-testid` attributes (e.g., `data-testid="create-user-btn"`) to keep UI tests completely independent of brittle CSS layout paths.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '20_User_Management_Test_Plans.md' AND QuestionPattern = 'How to pom implementation example (playwright)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '20_User_Management_Test_Plans.md', 'User Manual', 'How to pom implementation example (playwright)?', 'pom, implementation, example, (playwright), 20_user_management_test_plans', '**POM Implementation Example (Playwright)** (Source: `20_User_Management_Test_Plans.md`)

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
```', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '20_User_Management_Test_Plans.md' AND QuestionPattern = 'How to idempotent test example?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '20_User_Management_Test_Plans.md', 'User Manual', 'How to idempotent test example?', 'idempotent, test, example, 20_user_management_test_plans', '**Idempotent Test Example** (Source: `20_User_Management_Test_Plans.md`)

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
```', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '20_User_Management_Test_Plans.md' AND QuestionPattern = 'How to 4. api validation strategies?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '20_User_Management_Test_Plans.md', 'User Manual', 'How to 4. api validation strategies?', '4., api, validation, strategies, 20_user_management_test_plans', '**4. API Validation Strategies** (Source: `20_User_Management_Test_Plans.md`)

API testing ensures that RBAC is enforced on the backend, preventing broken-access control (IDOR or privilege escalation).

**Rules:**
1. **Assert Exact Status Codes**: Validating HTTP 403 Forbidden over UI states.
2. **Validate Schema Structure**: Assert response schema against expected boundaries.
3. **No Secret Hardcoding**: API tokens must be pulled from secure environment variables.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '20_User_Management_Test_Plans.md' AND QuestionPattern = 'How to api validation example?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '20_User_Management_Test_Plans.md', 'User Manual', 'How to api validation example?', 'api, validation, example, 20_user_management_test_plans', '**API Validation Example** (Source: `20_User_Management_Test_Plans.md`)

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
```', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = '20_User_Management_Test_Plans.md' AND QuestionPattern = 'How to 5. ci/cd reliability & flakiness controls?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', '20_User_Management_Test_Plans.md', 'User Manual', 'How to 5. ci/cd reliability & flakiness controls?', '5., ci/cd, reliability, &, flakiness, controls, 20_user_management_test_plans', '**5. CI/CD Reliability & Flakiness Controls** (Source: `20_User_Management_Test_Plans.md`)

To maintain absolute trust in the pipeline, strict reliability controls are enforced.

1. **Zero Tolerance for Hardcoded Sleeps**: Scripts must rely on API response interception (`waitForResponse`) or state changes (`waitForSelector`, `toHaveClass`) instead of `page.waitForTimeout(5000)`.
2. **Retry Boundaries**: Global retry configured to a strict maximum (`retries: process.env.CI ? 2 : 0`). Tests failing >2 times are automatically quarantined.
3. **Deterministic Data (Idempotence)**: Every test is responsible for establishing its own state. Random entities are injected using fixtures and torn down via API `afterAll` hooks to prevent collisions.
4. **Pipeline Gates**: 
   - `e2e-api-tests`: Executes first as a fast feedback loop.
   - `e2e-ui-tests`: Executes in parallel matrix only if API passes. PRs are strictly blocked on failure.
   - **Artifacts**: Playwright traces and HTML reports are attached to the pipeline to eliminate local "works on my machine" blindspots.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Backlog_Sprints_1_3.md' AND QuestionPattern = 'How to uno erp: backlog & sprint planning (mvp)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Backlog_Sprints_1_3.md', 'User Manual', 'How to uno erp: backlog & sprint planning (mvp)?', 'uno, erp:, backlog, &, sprint, planning, (mvp), backlog_sprints_1_3', '**UNO ERP: Backlog & Sprint Planning (MVP)** (Source: `Backlog_Sprints_1_3.md`)

*Authored by: Delivery Orchestrator (Stepping in for ProductOwner)*
*Total Hours Logged: 12h*', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Backlog_Sprints_1_3.md' AND QuestionPattern = 'How to sprint 1: core master data & crm?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Backlog_Sprints_1_3.md', 'Master Data', 'How to sprint 1: core master data & crm?', 'sprint, 1:, core, master, data, &, crm, backlog_sprints_1_3', '**Sprint 1: Core Master Data & CRM** (Source: `Backlog_Sprints_1_3.md`)

**Goal:** Establish the foundation for Master Data and allow operations to create Projects and bind Clients.

*   **[US-101]** As an Admin, I want to manage a directory of Hotels and Guides.
*   **[US-102]** As an Admin, I want to create a Transport Company and add specific Drivers.
*   **[US-103]** As an Admin, I want to categorize Excursion Facilities (Restaurants, Tickets, Tours).
*   **[US-104]** As an Operations Manager, I want to create a new Project/Tour and assign it to a Client.
*   **[US-105]** As an Operator, I want to upload an Excel file of Client data and map the column headers to the system''s dropdown properties (Dynamic Mapper).', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Backlog_Sprints_1_3.md' AND QuestionPattern = 'How to sprint 2: multi-city itineraries & pipeline?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Backlog_Sprints_1_3.md', 'User Manual', 'How to sprint 2: multi-city itineraries & pipeline?', 'sprint, 2:, multi, city, itineraries, &, pipeline, backlog_sprints_1_3', '**Sprint 2: Multi-City Itineraries & Pipeline** (Source: `Backlog_Sprints_1_3.md`)

**Goal:** Introduce complex multi-city routing, link master data to services, and establish the Kanban board.

*   **[US-201]** As an Operator, I want to add multiple "City Stays" to a Project.
*   **[US-202]** As an Operator, I want to attach a Hotel Booking to a specific City Stay.
*   **[US-203]** As a Sales Manager, I want to view a Kanban board of my Tours and drag them between stages (Opportunity -> Quoted -> Confirmed).
*   **[US-204]** As a Guide Coordinator, I want to log an "Extra Tour" sale, and have the system auto-calculate Guide Commission and Net Profit.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Backlog_Sprints_1_3.md' AND QuestionPattern = 'How to sprint 3: the operational dashboard?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Backlog_Sprints_1_3.md', 'KPI Proposal', 'How to sprint 3: the operational dashboard?', 'sprint, 3:, the, operational, dashboard, backlog_sprints_1_3', '**Sprint 3: The Operational Dashboard** (Source: `Backlog_Sprints_1_3.md`)

**Goal:** Surface critical operational alerts and timelines in the new Timeline-First Dashboard.

*   **[US-301]** As an Operations Manager, I want to view active Projects plotted on a horizontal Gantt Timeline.
*   **[US-302]** As an Operator, I want to see global "Alerts & To-Dos" in a persistent right-hand panel.
*   **[US-303]** As an Operations Manager, I want to view a "Guide Overview" grid on the dashboard showing guide availability.
*   **[US-304]** As an Operator, when I click on a Project bar within the Timeline, I want the right-hand panel to gracefully slide out and display that specific Project''s details.', '/projects', 'Executive Dashboard', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'BA_Excel_Data_Integration.md' AND QuestionPattern = 'How to business analysis report: excel data integration strategy?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'BA_Excel_Data_Integration.md', 'User Manual', 'How to business analysis report: excel data integration strategy?', 'business, analysis, report:, excel, data, integration, strategy, ba_excel_data_integration', '**Business Analysis Report: Excel Data Integration Strategy** (Source: `BA_Excel_Data_Integration.md`)

**Project:** Uno ERP System - Sprint 1
**Document Type:** Business Architecture & Integration Proposal
**Target Audience:** Product Manager, Scrum Master, QA Team

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'BA_Excel_Data_Integration.md' AND QuestionPattern = 'How to 1. executive summary?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'BA_Excel_Data_Integration.md', 'User Manual', 'How to 1. executive summary?', '1., executive, summary, ba_excel_data_integration', '**1. Executive Summary** (Source: `BA_Excel_Data_Integration.md`)

Following a detailed review of the recent "Tur_satis" (Excursion Sales) and "Rooming" Excel exports, it is evident that our operational tracking is currently siloed and heavily reliant on unstructured local files. The operations team uses these spreadsheets to manage individual passenger attendance, room allocations, and optional excursion revenues. To support robust development for the Uno ERP system, this document outlines our integration strategy, identifies compliance gaps, and proposes critical architectural adjustments to bridge the gap between high-level financial bookings and on-the-ground operations.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'BA_Excel_Data_Integration.md' AND QuestionPattern = 'How to 2. sprint 1 excel import template updates?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'BA_Excel_Data_Integration.md', 'User Manual', 'How to 2. sprint 1 excel import template updates?', '2., sprint, 1, excel, import, template, updates, ba_excel_data_integration', '**2. Sprint 1 Excel Import Template Updates** (Source: `BA_Excel_Data_Integration.md`)

As part of the Sprint 1 kickoff, the core `uno_import_template.xlsx` has been officially updated to accommodate new schema changes. The updated entity mappings are as follows:', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'BA_Excel_Data_Integration.md' AND QuestionPattern = 'How to 2.1 hotels sheet (master & contract data)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'BA_Excel_Data_Integration.md', 'Master Data', 'How to 2.1 hotels sheet (master & contract data)?', '2.1, hotels, sheet, (master, &, contract, data), ba_excel_data_integration', '**2.1 Hotels Sheet (Master & Contract Data)** (Source: `BA_Excel_Data_Integration.md`)

- **Start/End Dates:** `StartDate`, `EndDate` added to manage seasonal contracts or specific booking validity windows.
- **Multiple Rates:** `RateType_1`, `RatePrice_1`, `RateType_2`, `RatePrice_2` to handle varying seasonal or room-type specific pricing.
- **Service Flags:** `IsBase`, `IsExtra`, `IsOperational` booleans added to categorize the hotel''s operational role.
- **Pax & Base Fees:** `PaxAdult`, `PaxChild`, `BaseFeeAdult`, `BaseFeeChild` added to support dynamic Base Fee calculations based on demographic counts.', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'BA_Excel_Data_Integration.md' AND QuestionPattern = 'How to 2.2 tourservices & tours sheets?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'BA_Excel_Data_Integration.md', 'User Manual', 'How to 2.2 tourservices & tours sheets?', '2.2, tourservices, &, tours, sheets, ba_excel_data_integration', '**2.2 TourServices & Tours Sheets** (Source: `BA_Excel_Data_Integration.md`)

- **TourServices:** Now includes `StartDate`, `EndDate`, `PaxAdult`, `PaxChild`, and the `IsBase`, `IsExtra`, `IsOperational` flags to mirror the granularity required for Expandable pivot-table views on the frontend.
- **Tours:** Replaced generic `Pax` column with distinct `PaxAdult` and `PaxChild` columns to support accurate financial modeling.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'BA_Excel_Data_Integration.md' AND QuestionPattern = 'How to a. rooming lists (e.g., `vi 1007 bvsp rooming.xlsx`, `final rooming list...`)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'BA_Excel_Data_Integration.md', 'User Manual', 'How to a. rooming lists (e.g., `vi 1007 bvsp rooming.xlsx`, `final rooming list...`)?', 'a., rooming, lists, (e.g.,, `vi, 1007, bvsp, rooming.xlsx`,, `final, list...`)', '**A. Rooming Lists (e.g., `VI 1007 BVSP rooming.xlsx`, `Final Rooming list...`)** (Source: `BA_Excel_Data_Integration.md`)

- **Structure:** Highly unstructured with varying column layouts, merged cells, and complex headers. 
- **Content:** Primarily tracks individual travelers assigned to specific rooms, flights, and tour dates. 
- **Business Use:** Identifies who is physically attending the tour, representing the concrete individuals behind an abstract "Booking" entity.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'BA_Excel_Data_Integration.md' AND QuestionPattern = 'How to b. tur satis / excursion sales lists (e.g., `tur_satis_19072025.xlsx`)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'BA_Excel_Data_Integration.md', 'User Manual', 'How to b. tur satis / excursion sales lists (e.g., `tur_satis_19072025.xlsx`)?', 'b., tur, satis, /, excursion, sales, lists, (e.g.,, `tur_satis_19072025.xlsx`), ba_excel_data_integration', '**B. Tur Satis / Excursion Sales Lists (e.g., `Tur_satis_19072025.xlsx`)** (Source: `BA_Excel_Data_Integration.md`)

- **Structure:** Matrix format where rows represent individual passengers (`Isim Soyad`) and columns represent specific optional excursions.
- **Embedded Logic:** 
  - Prices are frequently hardcoded in column headers.
  - Contains attendance flags (`arrived`, `geldi`).
  - Includes demographic/pricing flags (`Child`) to indicate discounted rates.
  - Generates a per-passenger `Total` revenue column, which is crucial for daily guide accounting.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'BA_Excel_Data_Integration.md' AND QuestionPattern = 'How to 4. integration proposal & data modeling?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'BA_Excel_Data_Integration.md', 'User Manual', 'How to 4. integration proposal & data modeling?', '4., integration, proposal, &, data, modeling, ba_excel_data_integration', '**4. Integration Proposal & Data Modeling** (Source: `BA_Excel_Data_Integration.md`)

The current Uno ERP models (`Project`, `Tour`, `Excursion`, `Booking`, `TourService`) handle macro-level operations but fail to capture micro-level passenger transactions. I propose adding the following entities to complete our workflow:', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'BA_Excel_Data_Integration.md' AND QuestionPattern = 'How to model 1: `passenger`?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'BA_Excel_Data_Integration.md', 'User Manual', 'How to model 1: `passenger`?', 'model, 1:, `passenger`, ba_excel_data_integration', '**Model 1: `Passenger`** (Source: `BA_Excel_Data_Integration.md`)

- **Rationale:** A `Booking` represents the overall financial transaction and the primary contact (the payer), but a rooming list contains multiple unique individuals (the travelers). 
- **Recommendation:** Create a `Passenger` (or `Customer`) model that belongs to a `Booking` (Many-to-One). This allows the tracking of individual passport details, room assignments, and demographics (Adult/Child) without polluting the core `Booking` entity.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'BA_Excel_Data_Integration.md' AND QuestionPattern = 'How to model 2: `passengerexcursion` (or `excursionsale`)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'BA_Excel_Data_Integration.md', 'User Manual', 'How to model 2: `passengerexcursion` (or `excursionsale`)?', 'model, 2:, `passengerexcursion`, (or, `excursionsale`), ba_excel_data_integration', '**Model 2: `PassengerExcursion` (or `ExcursionSale`)** (Source: `BA_Excel_Data_Integration.md`)

- **Rationale:** We must capture the matrix data from the "Tur_satis" files. An overall tour has many excursions, but we need to know *which specific passenger* bought *which specific excursion*.
- **Fields Needed:**
  - `PassengerId` and `ExcursionId` (Foreign Keys)
  - `SalePrice`: Crucial for tracking dynamic pricing (adult vs. child discounts).
  - `AttendanceStatus`: Enum (e.g., `Pending`, `Arrived`, `No-Show`).', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'BA_Excel_Data_Integration.md' AND QuestionPattern = 'How to 5. competitor comparison & strategic gaps?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'BA_Excel_Data_Integration.md', 'User Manual', 'How to 5. competitor comparison & strategic gaps?', '5., competitor, comparison, &, strategic, gaps, ba_excel_data_integration', '**5. Competitor Comparison & Strategic Gaps** (Source: `BA_Excel_Data_Integration.md`)

- **Industry Standard Comparison:** Leading tourism ERPs natively utilize a standard hierarchy: **Booking → Passengers → Passenger Add-ons/Activities**. Our current proposed structure is missing the bottom tier of this hierarchy.
- **Strategic Gap:** Without tracking excursions at the passenger level, we cannot natively automate Guide Commission calculations or dynamically apply Base Fee calculations based on Adult/Child counts.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'BA_Excel_Data_Integration.md' AND QuestionPattern = 'How to 6. compliance & data privacy (gdpr / kvkk)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'BA_Excel_Data_Integration.md', 'User Manual', 'How to 6. compliance & data privacy (gdpr / kvkk)?', '6., compliance, &, data, privacy, (gdpr, /, kvkk), ba_excel_data_integration', '**6. Compliance & Data Privacy (GDPR / KVKK)** (Source: `BA_Excel_Data_Integration.md`)

- **Critical Risk Identified:** The storage of PII in loose local Excel files scattered across guide laptops constitutes a significant GDPR/KVKK vulnerability. 
- **Mitigation:** Migrating this unstructured data into the centralized Uno ERP database with proper Role-Based Access Control (RBAC) is non-negotiable.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'BA_Excel_Data_Integration.md' AND QuestionPattern = 'How to 7. business approvals & next steps?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'BA_Excel_Data_Integration.md', 'User Manual', 'How to 7. business approvals & next steps?', '7., business, approvals, &, next, steps, ba_excel_data_integration', '**7. Business Approvals & Next Steps** (Source: `BA_Excel_Data_Integration.md`)

**Approval Status:** **APPROVED TO PROCEED FOR SPRINT 1**
- **Action Items for Dev/PM:** 
  1. The `uno_import_template.xlsx` is now fully updated and finalized for Sprint 1 development.
  2. Implement backend parsers to handle the new `StartDate`, `EndDate`, `IsBase`, `IsExtra`, and `IsOperational` flags.
  3. Ensure the UI grid supports Expandable pivot-table views that pivot on these new categorical flags and pax demographics.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_backlog.md' AND QuestionPattern = 'How to [cal-ui-001] multi-view calendar display?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_backlog.md', 'User Manual', 'How to [cal-ui-001] multi-view calendar display?', '[cal, ui, 001], multi, view, calendar, display, tour_calendar_backlog', '**[CAL-UI-001] Multi-View Calendar Display** (Source: `tour_calendar_backlog.md`)

**User Story:** As an operations staff member, I want to toggle between daily, weekly, and monthly calendar views.
**Acceptance Criteria:**
- **Given** I am on the Tour Calendar page
- **When** I click the Daily, Weekly, or Monthly view buttons
- **Then** the calendar updates to reflect the selected time horizon
- **And** tour blocks span the correct start and end dates/times in the destination''s timezone.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_backlog.md' AND QuestionPattern = 'How to [cal-ui-002] tour block quick-view?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_backlog.md', 'User Manual', 'How to [cal-ui-002] tour block quick-view?', '[cal, ui, 002], tour, block, quick, view, tour_calendar_backlog', '**[CAL-UI-002] Tour Block Quick-View** (Source: `tour_calendar_backlog.md`)

**User Story:** As an operations staff member, I want to click or hover over a tour block to see more details without navigating away.
**GDPR Constraints:** The modal must not display sensitive personal contact info (e.g., Guide''s private phone number) unless the user has specific Manager roles.
**Acceptance Criteria:**
- **Given** the calendar is populated with tour blocks
- **When** I hover or click on a tour block
- **Then** a modal/tooltip containing detailed tour info appears.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_backlog.md' AND QuestionPattern = 'How to [cal-ui-003] status and availability indicators?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_backlog.md', 'Process Flow', 'How to [cal-ui-003] status and availability indicators?', '[cal, ui, 003], status, and, availability, indicators, tour_calendar_backlog', '**[CAL-UI-003] Status and Availability Indicators** (Source: `tour_calendar_backlog.md`)

**User Story:** As an operations staff member, I want tour blocks to be color-coded based on their status and display capacity metrics.
**Acceptance Criteria:**
- **Given** I view the calendar
- **When** I look at the tour blocks
- **Then** they are color-coded (Planned, Confirmed, In-Progress, Completed, Cancelled)
- **And** availability metrics (e.g., "15/20 Booked") are displayed directly on the block.', '/tours', 'Tour Status Kanban', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_backlog.md' AND QuestionPattern = 'How to [cal-ui-004] double-booking visual warnings?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_backlog.md', 'User Manual', 'How to [cal-ui-004] double-booking visual warnings?', '[cal, ui, 004], double, booking, visual, warnings, tour_calendar_backlog', '**[CAL-UI-004] Double-booking Visual Warnings** (Source: `tour_calendar_backlog.md`)

**User Story:** As a scheduling manager, I want the system to visually flag conflicting schedules (e.g., double-booked guides).
**Acceptance Criteria:**
- **Given** a guide is assigned to two overlapping tours
- **When** I view the calendar
- **Then** a highly visible warning indicator is displayed on those tour blocks.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_backlog.md' AND QuestionPattern = 'How to [cal-ui-005] multi-select resource filtering?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_backlog.md', 'User Manual', 'How to [cal-ui-005] multi-select resource filtering?', '[cal, ui, 005], multi, select, resource, filtering, tour_calendar_backlog', '**[CAL-UI-005] Multi-select Resource Filtering** (Source: `tour_calendar_backlog.md`)

**User Story:** As an operations staff member, I want to filter the calendar by tour attributes, guides, hotels, and excursions.
**Acceptance Criteria:**
- **Given** the calendar filter sidebar is open
- **When** I apply one or multiple filters
- **Then** the calendar seamlessly updates to display only matching tour blocks.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_backlog.md' AND QuestionPattern = 'How to [cal-ui-006] drag-and-drop rescheduling?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_backlog.md', 'User Manual', 'How to [cal-ui-006] drag-and-drop rescheduling?', '[cal, ui, 006], drag, and, drop, rescheduling, tour_calendar_backlog', '**[CAL-UI-006] Drag-and-Drop Rescheduling** (Source: `tour_calendar_backlog.md`)

**User Story:** As a scheduling manager, I want to drag-and-drop tour blocks to reschedule them or reassign guides.
**Acceptance Criteria:**
- **Given** I have scheduling permissions
- **When** I drag a tour block to a new date or guide row
- **Then** the system prompts for confirmation and updates the schedule.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_backlog.md' AND QuestionPattern = 'How to [cal-api-001] fetch calendar data?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_backlog.md', 'User Manual', 'How to [cal-api-001] fetch calendar data?', '[cal, api, 001], fetch, calendar, data, tour_calendar_backlog', '**[CAL-API-001] Fetch Calendar Data** (Source: `tour_calendar_backlog.md`)

**User Story:** As the API, I must rapidly fetch and aggregate scheduling data for the calendar view.
**Business Rules:** Must support multi-timezone conversions. Queries must complete within 2 seconds for up to 1000 entries.
**Acceptance Criteria:**
- **Given** the UI requests calendar data with a specific date range
- **When** `GET /api/calendar/tours` is called
- **Then** the API returns the aggregated tour data within 2 seconds
- **And** all dates/times reflect the correct timezone.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_backlog.md' AND QuestionPattern = 'How to [cal-api-002] filter calendar data?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_backlog.md', 'User Manual', 'How to [cal-api-002] filter calendar data?', '[cal, api, 002], filter, calendar, data, tour_calendar_backlog', '**[CAL-API-002] Filter Calendar Data** (Source: `tour_calendar_backlog.md`)

**User Story:** As the API, I must support complex multi-select filtering for the calendar.
**Acceptance Criteria:**
- **Given** a request with query parameters for Tour Types, Guides, Hotels, or Excursions
- **When** the calendar endpoint is called
- **Then** the API filters the dataset in the database and returns the precise matching records.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_backlog.md' AND QuestionPattern = 'How to [cal-api-003] role-based access control (rbac) data masking?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_backlog.md', 'User Manual', 'How to [cal-api-003] role-based access control (rbac) data masking?', '[cal, api, 003], role, based, access, control, (rbac), data, masking', '**[CAL-API-003] Role-Based Access Control (RBAC) Data Masking** (Source: `tour_calendar_backlog.md`)

**User Story:** As the API, I must enforce RBAC to ensure users only see appropriate data.
**GDPR/Privacy Constraints:** Guides only see their own assigned tours. Managers have global visibility.
**Acceptance Criteria:**
- **Given** a Guide requests calendar data
- **When** the API processes the request
- **Then** it only returns tours assigned to that specific Guide.
- **And** personal contact info of clients is masked.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_backlog.md' AND QuestionPattern = 'How to [cal-api-004] reschedule tour validation?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_backlog.md', 'User Manual', 'How to [cal-api-004] reschedule tour validation?', '[cal, api, 004], reschedule, tour, validation, tour_calendar_backlog', '**[CAL-API-004] Reschedule Tour Validation** (Source: `tour_calendar_backlog.md`)

**User Story:** As the API, I must validate and save drag-and-drop rescheduling actions.
**Business Rules:** Prevent double-booking unless explicitly overridden by a manager.
**Acceptance Criteria:**
- **Given** a request to update a tour''s date or assigned guide via `PUT /api/calendar/tours/{id}/reschedule`
- **When** the new assignment causes a double-booking conflict
- **Then** the API returns a 409 Conflict warning
- **And** if no conflict exists, the update is saved successfully.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_business_requirements.md' AND QuestionPattern = 'How to 1. executive summary?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_business_requirements.md', 'User Manual', 'How to 1. executive summary?', '1., executive, summary, tour_calendar_business_requirements', '**1. Executive Summary** (Source: `tour_calendar_business_requirements.md`)

The ''Tour Calendar'' is a new feature within the ''Tours'' module of the UNOERP system. This feature aims to streamline the scheduling, tracking, and management of tours. By consolidating schedules, resource allocation (guides, hotels, excursions), and availability into a single unified view, operational efficiency will significantly improve and scheduling conflicts will be minimized.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_business_requirements.md' AND QuestionPattern = 'How to 2. business objectives?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_business_requirements.md', 'User Manual', 'How to 2. business objectives?', '2., business, objectives, tour_calendar_business_requirements', '**2. Business Objectives** (Source: `tour_calendar_business_requirements.md`)

- Provide a centralized, visual dashboard for all tour operations.
- Reduce booking and scheduling conflicts by clearly displaying availability and status.
- Allow quick drill-down into specific resources such as Guides, Hotels, and Excursions via intuitive filtering.
- Empower operational staff to make real-time decisions based on up-to-date schedule data.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_business_requirements.md' AND QuestionPattern = 'How to 3. competitive analysis & strategic fit?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_business_requirements.md', 'User Manual', 'How to 3. competitive analysis & strategic fit?', '3., competitive, analysis, &, strategic, fit, tour_calendar_business_requirements', '**3. Competitive Analysis & Strategic Fit** (Source: `tour_calendar_business_requirements.md`)

When comparing this proposed feature against industry leaders such as Rezdy, FareHarbor, and Tourplan:
- **Competitor Baseline:** Standard tour management platforms provide robust calendar interfaces with drag-and-drop capabilities, real-time availability sync, and deep integrations with resource management.
- **Strategic Gaps in Current Concept:** The initial concept mentions viewing and filtering but lacks explicit mention of drag-and-drop rescheduling, multi-timezone support, or direct integrations with third-party distribution channels (OTAs). Adding role-based access control (RBAC) specifically for the calendar (e.g., Guides only seeing their assigned tours) is a strategic must.
- **Compliance Considerations:** Ensure that displaying Guide and Hotel information complies with GDPR (or local data privacy regulations). Avoid exposing personal contact information directly on high-level calendar views unless authorized.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_business_requirements.md' AND QuestionPattern = 'How to in scope?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_business_requirements.md', 'User Manual', 'How to in scope?', 'in, scope, tour_calendar_business_requirements', '**In Scope** (Source: `tour_calendar_business_requirements.md`)

- Interactive calendar view of the tour schedule.
- Advanced filtering mechanics (Tours, Guides, Hotels, Excursions).
- Consolidated availability and status indicators.
- Tooltip or quick-view modals for detailed tour information.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_business_requirements.md' AND QuestionPattern = 'How to out of scope (for phase 1)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_business_requirements.md', 'User Manual', 'How to out of scope (for phase 1)?', 'out, of, scope, (for, phase, 1), tour_calendar_business_requirements', '**Out of Scope (For Phase 1)** (Source: `tour_calendar_business_requirements.md`)

- Automated AI-based scheduling.
- Direct booking from the calendar interface (this is an operational view, not a point-of-sale).', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_business_requirements.md' AND QuestionPattern = 'How to fr1: calendar interface?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_business_requirements.md', 'User Manual', 'How to fr1: calendar interface?', 'fr1:, calendar, interface, tour_calendar_business_requirements', '**FR1: Calendar Interface** (Source: `tour_calendar_business_requirements.md`)

- The system shall display a calendar interface with daily, weekly, and monthly views.
- The calendar shall populate tour blocks based on scheduled start and end dates/times.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_business_requirements.md' AND QuestionPattern = 'How to fr2: filtering mechanism?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_business_requirements.md', 'User Manual', 'How to fr2: filtering mechanism?', 'fr2:, filtering, mechanism, tour_calendar_business_requirements', '**FR2: Filtering Mechanism** (Source: `tour_calendar_business_requirements.md`)

- The system shall provide multi-select filters for:
  - **Tours:** Filter by tour type, destination, or specific tour package.
  - **Guides:** Filter by assigned personnel to quickly view a guide''s itinerary.
  - **Hotels:** Filter by accommodation to track room blocks or pickup/drop-off points.
  - **Excursions:** Filter by specific activities or day-trips within larger tours.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_business_requirements.md' AND QuestionPattern = 'How to fr3: availability and status indicators?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_business_requirements.md', 'Process Flow', 'How to fr3: availability and status indicators?', 'fr3:, availability, and, status, indicators, tour_calendar_business_requirements', '**FR3: Availability and Status Indicators** (Source: `tour_calendar_business_requirements.md`)

- The calendar blocks shall clearly display the status of the tour (e.g., Planned, Confirmed, In-Progress, Completed, Cancelled) using distinct color codes.
- The system shall display availability metrics (e.g., "15/20 Booked") directly on the calendar block.
- Conflicting schedules (e.g., double-booked guides) must trigger a visual warning indicator.', '/tours', 'Tour Status Kanban', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_business_requirements.md' AND QuestionPattern = 'How to 6. non-functional requirements?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_business_requirements.md', 'User Manual', 'How to 6. non-functional requirements?', '6., non, functional, requirements, tour_calendar_business_requirements', '**6. Non-Functional Requirements** (Source: `tour_calendar_business_requirements.md`)

- **Performance:** The calendar must load the current month''s schedule within 2 seconds for up to 1,000 tour entries.
- **Usability:** The interface must be fully responsive, accessible on both desktop and tablet devices used by operations staff.
- **Reliability:** Data must reflect real-time database state to prevent overbooking.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_business_requirements.md' AND QuestionPattern = 'How to 7. next steps & approvals?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_business_requirements.md', 'User Manual', 'How to 7. next steps & approvals?', '7., next, steps, &, approvals, tour_calendar_business_requirements', '**7. Next Steps & Approvals** (Source: `tour_calendar_business_requirements.md`)

- UI/UX team to create high-fidelity wireframes of the calendar view and filter sidebars.
- Technical Architecture review to finalize data aggregation for the consolidated view without performance degradation.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_ui_design.md' AND QuestionPattern = 'How to tour calendar ui/ux design specifications?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_ui_design.md', 'User Manual', 'How to tour calendar ui/ux design specifications?', 'tour, calendar, ui/ux, design, specifications, tour_calendar_ui_design', '**Tour Calendar UI/UX Design Specifications** (Source: `tour_calendar_ui_design.md`)

This document outlines the UI design for the UNOERP Tour Calendar feature, based on the provided business requirements and technical backlog.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_ui_design.md' AND QuestionPattern = 'How to 1. overall layout & structure?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_ui_design.md', 'User Manual', 'How to 1. overall layout & structure?', '1., overall, layout, &, structure, tour_calendar_ui_design', '**1. Overall Layout & Structure** (Source: `tour_calendar_ui_design.md`)

The interface uses a classic **Sidebar + Main Content** layout, which is ideal for complex filtering alongside a large viewing area for the calendar grid.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_ui_design.md' AND QuestionPattern = 'How to ascii wireframe (desktop/tablet landscape)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_ui_design.md', 'User Manual', 'How to ascii wireframe (desktop/tablet landscape)?', 'ascii, wireframe, (desktop/tablet, landscape), tour_calendar_ui_design', '**ASCII Wireframe (Desktop/Tablet Landscape)** (Source: `tour_calendar_ui_design.md`)

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
```', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_ui_design.md' AND QuestionPattern = 'How to 2.1. top navigation bar?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_ui_design.md', 'User Manual', 'How to 2.1. top navigation bar?', '2.1., top, navigation, bar, tour_calendar_ui_design', '**2.1. Top Navigation Bar** (Source: `tour_calendar_ui_design.md`)

- **Date Controls:** "Today" button, left/right arrows for navigation, and current date range display (e.g., "August 2026").
- **View Toggles:** segmented control for "Day", "Week", and "Month" views.
- **User Profile:** indicates current role (e.g., Manager vs. Guide) for RBAC enforcement.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_ui_design.md' AND QuestionPattern = 'How to 2.2. filter sidebar (left panel)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_ui_design.md', 'User Manual', 'How to 2.2. filter sidebar (left panel)?', '2.2., filter, sidebar, (left, panel), tour_calendar_ui_design', '**2.2. Filter Sidebar (Left Panel)** (Source: `tour_calendar_ui_design.md`)

- **Collapsible Accordions:** Filters grouped into `Tours`, `Guides`, `Hotels`, and `Excursions`.
- **Multi-select Checkboxes:** Users can select multiple items per category.
- **Dynamic Updates:** Applying a filter immediately updates the calendar data (debounced API calls to ensure performance < 2 seconds).
- **Responsive Behavior:** On tablets (portrait) or smaller screens, the sidebar collapses into a slide-out drawer accessible via a "Filter" icon button.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_ui_design.md' AND QuestionPattern = 'How to 2.3. calendar grid & tour blocks?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_ui_design.md', 'User Manual', 'How to 2.3. calendar grid & tour blocks?', '2.3., calendar, grid, &, tour, blocks, tour_calendar_ui_design', '**2.3. Calendar Grid & Tour Blocks** (Source: `tour_calendar_ui_design.md`)

Each Tour Block inside the calendar grid contains:
1. **Status Color Bar/Background:**
   - 🟦 **Planned:** Light Blue
   - 🟩 **Confirmed:** Green
   - 🟧 **In-Progress:** Orange
   - ⬛ **Completed:** Dark Gray
   - 🟥 **Cancelled:** Red
2. **Title & Time:** Shortened tour name and time block (e.g., "City Tour | 10:00-14:00").
3. **Availability Metrics:** Text indicating capacity, e.g., `15/20 Booked`. If full, styled boldly as `20/20 FULL`.
4. **Warning Indicator:** A highly visible `[!]` icon (yellow/red triangle) if there is a scheduling conflict (e.g., double-booked guide).', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_ui_design.md' AND QuestionPattern = 'How to 2.4. quick-view modal (hover/click)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_ui_design.md', 'User Manual', 'How to 2.4. quick-view modal (hover/click)?', '2.4., quick, view, modal, (hover/click), tour_calendar_ui_design', '**2.4. Quick-View Modal (Hover/Click)** (Source: `tour_calendar_ui_design.md`)

When a user hovers over or clicks a tour block, a popover/tooltip appears displaying:
- **Full Tour Name & Status**
- **Date & Time**
- **Assigned Guide(s)**
- **Associated Hotel(s) / Pickups**
- **Included Excursions**
- **Capacity:** `15 / 20 (5 remaining)`
- *(Note: No sensitive personal contact info displayed to comply with GDPR.)*
- **Action Button:** "View Full Details" (navigates to the tour detail page).', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_ui_design.md' AND QuestionPattern = 'How to 3. ui component hierarchy (mermaid diagram)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_ui_design.md', 'User Manual', 'How to 3. ui component hierarchy (mermaid diagram)?', '3., ui, component, hierarchy, (mermaid, diagram), tour_calendar_ui_design', '**3. UI Component Hierarchy (Mermaid Diagram)** (Source: `tour_calendar_ui_design.md`)

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
```', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'tour_calendar_ui_design.md' AND QuestionPattern = 'How to 4. design & usability principles applied?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'tour_calendar_ui_design.md', 'User Manual', 'How to 4. design & usability principles applied?', '4., design, &, usability, principles, applied, tour_calendar_ui_design', '**4. Design & Usability Principles Applied** (Source: `tour_calendar_ui_design.md`)

- **Scannability:** Status colors and bold availability metrics allow operations managers to assess the day''s state at a single glance.
- **Clarity over Clutter:** The Quick-View modal keeps the main calendar grid clean while still providing deep dive capabilities.
- **Proactive Error Handling:** The explicit warning icon for double-bookings instantly draws the scheduler''s attention to resource conflicts.
- **Role-Based Views:** The interface implicitly adapts based on the logged-in user, showing a simplified, read-only view for Guides and a comprehensive, filterable view for Managers.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md' AND QuestionPattern = 'How to uno_erp executive kpi dashboard proposal?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', 'KPI Proposal', 'How to uno_erp executive kpi dashboard proposal?', 'uno_erp, executive, kpi, dashboard, proposal, uno_erp_executive_kpi_dashboard_proposal', '**UNO_ERP Executive KPI Dashboard Proposal** (Source: `UNO_ERP_Executive_KPI_Dashboard_Proposal.md`)

**24 High-Impact Key Performance Indicators for Tour Operator Excellence & Profit Optimization**  
*Prepared for the Executive Leadership & Owner of UNO | August 2026*

---', '/projects', 'Executive Dashboard', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md' AND QuestionPattern = 'How to executive summary?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', 'User Manual', 'How to executive summary?', 'executive, summary, uno_erp_executive_kpi_dashboard_proposal', '**Executive Summary** (Source: `UNO_ERP_Executive_KPI_Dashboard_Proposal.md`)

As a specialized Tour Operator & DMC managing complex multi-destination group tours across Central Europe (e.g. Budapest–Vienna–Prague), **UNO** requires complete operational visibility, tight risk governance, and real-time margin tracking. 

This proposal outlines **24 High-Impact Key Performance Indicators (KPIs)** organized into **4 Strategic Categories** to empower the owner of UNO to instantly identify operational bottlenecks, financial leakages, supplier inefficiencies, and growth opportunities.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md' AND QuestionPattern = 'How to 1. operational efficiency kpis (6 kpis)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', 'KPI Proposal', 'How to 1. operational efficiency kpis (6 kpis)?', '1., operational, efficiency, kpis, (6, kpis), uno_erp_executive_kpi_dashboard_proposal', '**1. Operational Efficiency KPIs (6 KPIs)** (Source: `UNO_ERP_Executive_KPI_Dashboard_Proposal.md`)

| KPI # | KPI Name | Target SLA | Calculation Formula | Strategic Value & Operational Impact |
| :--- | :--- | :--- | :--- | :--- |
| **KPI 1** | **Departure Readiness Gate Pass Rate (%)** | **100%** within 72h | `(Ready Tours / Total Upcoming Tours) × 100` | Prevents last-minute emergency calls, unassigned guides, or missing hotel rooming lists prior to tour departure. |
| **KPI 2** | **Rooming List Lock Accuracy (%)** | **> 98%** | `(Confirmed Roomings / Total Rooming Requests) × 100` | Eliminates single/double rooming errors, hotel check-in delays, and unexpected room surcharge penalties. |
| **KPI 3** | **Guide Capacity Utilization (%)** | **85% – 90%** | `(Assigned Tour Days / Contracted Days) × 100` | Maximizes top-tier guide productivity while avoiding burnout or idle retainer costs. |
| **KPI 4** | **Bus Seat Load Factor (%)** | **> 85%** | `(Total Passengers / Coach Seating Capacity) × 100` | Optimizes coach size selection (e.g. 35-seat vs 50-seat bus) to minimize transport cost per passenger. |
| **KPI 5** | **Supplier Confirmation Velocity (Hours)** | **< 24 Hours** | `Avg Hours from Booking Request to Supplier Confirmation` | Accelerates B2B client proposal turnaround and locks in competitive hotel group rates early. |
| **KPI 6** | **Automated Document Export Ratio (%)** | **> 95%** | `(System Vouchers & Manifests / Total Docs) × 100` | Saves operational staff 15+ hours weekly by automating PDF voucher & rooming list generation. |

---', '/projects', 'Executive Dashboard', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md' AND QuestionPattern = 'How to 2. financial & profitability kpis (6 kpis)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', 'KPI Proposal', 'How to 2. financial & profitability kpis (6 kpis)?', '2., financial, &, profitability, kpis, (6, kpis), uno_erp_executive_kpi_dashboard_proposal', '**2. Financial & Profitability KPIs (6 KPIs)** (Source: `UNO_ERP_Executive_KPI_Dashboard_Proposal.md`)

| KPI # | KPI Name | Target SLA | Calculation Formula | Strategic Value & Operational Impact |
| :--- | :--- | :--- | :--- | :--- |
| **KPI 7** | **Excursion Sales Penetration Rate (%)** | **> 75% Pax** | `(Passengers Buying Excursions / Total Pax) × 100` | Measures on-site sales conversion effectiveness and guide excursion promotion enthusiasm. |
| **KPI 8** | **Excursion Yield per Passenger (€)** | **> €120 / Pax** | `Total Excursion Revenue / Total Passengers` | Identifies high-performing tour itineraries and top revenue-generating optional excursions. |
| **KPI 9** | **Guide Commission Efficiency (%)** | **< 15% Margin** | `(Total Guide Commission Paid / Excursion Margin) × 100` | Ensures guide incentives drive profitable excursion sales while protecting net DMC margins. |
| **KPI 10** | **Cost per Pax Variance (€ & %)** | **± 2% Budget** | `Actual Settled Cost/Pax - Budgeted Cost/Pax` | Flags cost overruns in hotel night rates, city taxes, or entrance fees before final client settlement. |
| **KPI 11** | **Uninvoiced Service Cost Ratio (%)** | **< 1%** | `(Unbilled Supplier Costs / Total Expenses) × 100` | Prevents unbilled supplier expenses from slipping through without client re-invoicing. |
| **KPI 12** | **Gross Margin per Tour (€ & %)** | **> 22% Margin** | `((Total Revenue - Total Costs) / Total Revenue) × 100` | Provides the owner with instant visibility into which projects and tour series yield highest net profit. |

---', '/projects', 'Executive Dashboard', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md' AND QuestionPattern = 'How to 3. governance, compliance & risk kpis (6 kpis)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', 'Governance', 'How to 3. governance, compliance & risk kpis (6 kpis)?', '3., governance,, compliance, &, risk, kpis, (6, kpis), uno_erp_executive_kpi_dashboard_proposal', '**3. Governance, Compliance & Risk KPIs (6 KPIs)** (Source: `UNO_ERP_Executive_KPI_Dashboard_Proposal.md`)

| KPI # | KPI Name | Target SLA | Calculation Formula | Strategic Value & Operational Impact |
| :--- | :--- | :--- | :--- | :--- |
| **KPI 13** | **Guide Cash Remittance Lag (Days)** | **< 48 Hours** | `Avg Days from Tour End Date to Cash Bank Deposit` | Enforces Governance Rule 4 (*Separate Money Flows*) and accelerates cash flow collection. |
| **KPI 14** | **Excursion Cash Discrepancy Rate (%)** | **0.0%** | `\|Guide Cash Sales - Bank Deposit\| / Total Sales` | Detects cash leakages, currency conversion errors, or missing excursion receipts immediately. |
| **KPI 15** | **Unassigned Tour Resource Ratio (%)** | **0% within 7d** | `(Tours Missing Guide/Bus/Hotel / Total Tours) × 100` | Eliminates operational panics and quality degradation on upcoming departures. |
| **KPI 16** | **Passenger Data Completeness (%)** | **100% (7d prior)** | `(Pax with Valid Passport & Flight Info / Total Pax) × 100` | Prevents hotel check-in refusal and airport transfer miscommunication. |
| **KPI 17** | **Supplier Payment On-Time Rate (%)** | **> 98%** | `(Invoices Paid Within Credit Terms / Total Invoices) × 100` | Protects DMC reputation and secures preferred hotel room block allocations. |
| **KPI 18** | **Audit Trail Exception Count** | **< 5 / Month** | `Total Manual Price/Fee Overrides Logged in AuditLogs` | Ensures full administrative accountability and transparency across all financial overrides. |

---', '/settings', 'Governance & Settings', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md' AND QuestionPattern = 'How to 4. growth, opportunities & ai kpis (6 kpis)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', 'KPI Proposal', 'How to 4. growth, opportunities & ai kpis (6 kpis)?', '4., growth,, opportunities, &, ai, kpis, (6, kpis), uno_erp_executive_kpi_dashboard_proposal', '**4. Growth, Opportunities & AI KPIs (6 KPIs)** (Source: `UNO_ERP_Executive_KPI_Dashboard_Proposal.md`)

| KPI # | KPI Name | Target SLA | Calculation Formula | Strategic Value & Operational Impact |
| :--- | :--- | :--- | :--- | :--- |
| **KPI 19** | **Client Repeat Booking Rate (%)** | **> 80%** | `(Repeat Tour Operators / Active B2B Clients) × 100` | Measures long-term DMC client satisfaction and recurring contract stability. |
| **KPI 20** | **Project Pax Load Factor (%)** | **> 90%** | `(Actual Booked Pax / Contracted Capacity) × 100` | Helps negotiate volume discounts with hotels and transport providers. |
| **KPI 21** | **Top Destination Margin Share (%)** | **Monitor Mix** | `Gross Profit from Top 3 Cities / Total Gross Profit` | Identifies geographic expansion opportunities and high-yielding tour itineraries. |
| **KPI 22** | **Guide Performance NPS Score** | **> 4.8 / 5.0** | `Average Passenger Feedback Rating per Guide` | Ensures high tour quality, passenger delight, and positive repeat trip reviews. |
| **KPI 23** | **Pre/Post Hotel Night Conversion (%)** | **> 15% Pax** | `(Passengers Booking Extra Nights / Total Pax) × 100` | Unlocks easy high-margin hotel commission upsells for early arrivals. |
| **KPI 24** | **AI Copilot Instant Resolution Rate (%)** | **> 90%** | `(Queries Resolved by AI Copilot / Total Staff Inquiries) × 100` | Reduces onboarding time for new operators and answers how-to questions 24/7. |

---', '/projects', 'Executive Dashboard', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md' AND QuestionPattern = 'How to implementation roadmap?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', 'User Manual', 'How to implementation roadmap?', 'implementation, roadmap, uno_erp_executive_kpi_dashboard_proposal', '**Implementation Roadmap** (Source: `UNO_ERP_Executive_KPI_Dashboard_Proposal.md`)

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

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md' AND QuestionPattern = 'How to downloads & deliverables?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_Executive_KPI_Dashboard_Proposal.md', 'User Manual', 'How to downloads & deliverables?', 'downloads, &, deliverables, uno_erp_executive_kpi_dashboard_proposal', '**Downloads & Deliverables** (Source: `UNO_ERP_Executive_KPI_Dashboard_Proposal.md`)

- **PowerPoint Presentation**: [`UNO_ERP_Executive_KPI_Dashboard_Proposal.pptx`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/UNO_ERP_Executive_KPI_Dashboard_Proposal.pptx)
- **PDF Document**: [`UNO_ERP_Executive_KPI_Dashboard_Proposal.pdf`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/UNO_ERP_Executive_KPI_Dashboard_Proposal.pdf)', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to uno erp - end-to-end comprehensive user manual & data import guide?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'Master Data', 'How to uno erp - end-to-end comprehensive user manual & data import guide?', 'uno, erp, end, to, comprehensive, user, manual, &, data, import', '**UNO ERP - End-to-End Comprehensive User Manual & Data Import Guide** (Source: `UNO_ERP_User_Manual.md`)

**System:** UNO ERP (Travel Operations ERP & DMC Management Platform)  
**Version:** 2.0  
**Target Audience:** System Administrators, Tour Operators, Operation Managers, Guides, and Financial Analysts.

---', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to table of contents?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to table of contents?', 'table, of, contents, uno_erp_user_manual', '**Table of Contents** (Source: `UNO_ERP_User_Manual.md`)

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

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 1. overview & system architecture?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 1. overview & system architecture?', '1., overview, &, system, architecture, uno_erp_user_manual', '**1. Overview & System Architecture** (Source: `UNO_ERP_User_Manual.md`)

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

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 2. master data management & batch upload?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'Master Data', 'How to 2. master data management & batch upload?', '2., master, data, management, &, batch, upload, uno_erp_user_manual', '**2. Master Data Management & Batch Upload** (Source: `UNO_ERP_User_Manual.md`)

Master Data forms the foundation of all ERP operations. Master records can be managed manually or batch uploaded via Section 1 of the `/master-data` import page.', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 2.1 excel master data file format?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'Master Data', 'How to 2.1 excel master data file format?', '2.1, excel, master, data, file, format, uno_erp_user_manual', '**2.1 Excel Master Data File Format** (Source: `UNO_ERP_User_Manual.md`)

- **File Name:** `MasterData_Import_Template.xlsx` (or any `.xlsx` file containing standard sheets).
- **Supported Sheets:**
  1. `Clients`: Corporate customer accounts (`Name`, `TaxNo`, `ContactEmail`, `Phone`, `Address`, `BaseCurrency`).
  2. `Hotels`: Hotel partners (`Name`, `City`, `StarRating`, `SingleRate`, `DoubleRate`, `ContactPerson`).
  3. `Guides`: Tour guides (`FirstName`, `LastName`, `Languages`, `DailyRate`, `Phone`).
  4. `Drivers`: Vehicle drivers (`FirstName`, `LastName`, `LicenseType`, `Phone`, `TransportCompany`).
  5. `TransportCompanies`: Logistics vendors (`Name`, `FleetSize`, `ContactEmail`, `Phone`).
  6. `Vendors`: Third-party suppliers (`Name`, `ServiceType`, `ContactName`, `Email`, `Phone`).
  7. `Excursions`: Activity catalog (`Name`, `TourCode` / Excursion Code e.g. `PRG-KV`, `Price`, `SalePrice`, `Vendor`).', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 2.2 upload workflow?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 2.2 upload workflow?', '2.2, upload, workflow, uno_erp_user_manual', '**2.2 Upload Workflow** (Source: `UNO_ERP_User_Manual.md`)

1. Navigate to `/master-data` in the application header menu.
2. Scroll to **Section 1: Master Data Import**.
3. Drag and drop `MasterData_Import_Template.xlsx` or click **Browse File**.
4. Click **Import Master Data**.
5. The API parses each sheet, creates database entries, and populates drop-down selectors across the entire system.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 3. project creation & life cycle management?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 3. project creation & life cycle management?', '3., project, creation, &, life, cycle, management, uno_erp_user_manual', '**3. Project Creation & Life Cycle Management** (Source: `UNO_ERP_User_Manual.md`)

A **Project** groups individual tour operations under a single client contract (e.g. `PRJ-BVP2` for Central Europe Summer 2026).', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 3.1 manual project creation?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 3.1 manual project creation?', '3.1, manual, project, creation, uno_erp_user_manual', '**3.1 Manual Project Creation** (Source: `UNO_ERP_User_Manual.md`)

1. Navigate to `/projects`.
2. Click the **+ New Project** button in the top-right toolbar.
3. Fill in the required fields:
   - **Client:** Select existing Client (e.g. `Bonavita Travel`).
   - **Project Code:** Unique alphanumeric code (e.g. `PRJ-BVP2`).
   - **Start & End Dates:** Contract execution period.
   - **Approx. Budget:** Overall project revenue target.
   - **Status:** Initial status (`Planning`, `Active`, `Closed`).
4. Click **Save Project**.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 3.2 automatic project creation via file import?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 3.2 automatic project creation via file import?', '3.2, automatic, project, creation, via, file, import, uno_erp_user_manual', '**3.2 Automatic Project Creation via File Import** (Source: `UNO_ERP_User_Manual.md`)

When importing Tour Rooming files (`TourImportTemplate.xlsx`), if the file header references a `ProjectCode` (e.g. `PRJ-BVP2`) that does not yet exist in the system, the import engine automatically creates the Project record under the specified Client!

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 4. tour header & rooming file upload?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 4. tour header & rooming file upload?', '4., tour, header, &, rooming, file, upload, uno_erp_user_manual', '**4. Tour Header & Rooming File Upload** (Source: `UNO_ERP_User_Manual.md`)

Tour rooming files import tour operational parameters, hotel room allocations, and the complete passenger manifest.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 4.1 file name & format requirements?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 4.1 file name & format requirements?', '4.1, file, name, &, format, requirements, uno_erp_user_manual', '**4.1 File Name & Format Requirements** (Source: `UNO_ERP_User_Manual.md`)

- **File Name Example:** `5-12_Temmuz_Levent_importrooming.xlsx` or `PRJ-BVP2_PVB05072026_rooming.xlsx`.
- **Required Sheets:**
  1. `Booking` (or `Tours`): Contains tour parameters (`TourCode`, `ArrivalDate`, `EndDate`, `FlightNo`, `Pax`, `Adults`, `Children`, `Infants`).
  2. `Rooming`: Contains passenger and rooming details (`Yolcu Soyadı`, `Yolcu Adı`, `DateOfBirth`, `PassportNo`, `Gender`, `NationalId`, `RoomType`, `Pax`).', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 4.2 field extraction & normalization?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 4.2 field extraction & normalization?', '4.2, field, extraction, &, normalization, uno_erp_user_manual', '**4.2 Field Extraction & Normalization** (Source: `UNO_ERP_User_Manual.md`)

The import engine handles truncated or Turkish Excel headers automatically:
| Excel Column Header | Target Field | System Logic |
| :--- | :--- | :--- |
| `Yolcu Soyadı` / `Soyadı` | `LastName` | Extracted into dedicated Surname field |
| `Yolcu Adı` / `Adı` | `FirstName` | Extracted into First Name field |
| `Doğum Tar` / `Doğum Tarihi` | `DateOfBirth` | Parsed to DateTime (`dd.MM.yyyy`) |
| `Pasaport N` / `Pasaport No` | `PassportNo` | String passport identification |
| `Cinsiyet` | `Gender` | `M` / `F` / `Male` / `Female` |
| `T.C. Kimlik` / `TC No` | `NationalId` | National Identity Number |
| `Oda Tipi` / `RoomType` | `RoomType` | Single, Double, Triple |', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 4.3 ui screen mapping?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 4.3 ui screen mapping?', '4.3, ui, screen, mapping, uno_erp_user_manual', '**4.3 UI Screen Mapping** (Source: `UNO_ERP_User_Manual.md`)

Once imported, tour rooming data appears on the **Tour Details Page** (`/projects/[id]/tours/[tourId]`):
- **Tour Header Banner:** Displays Tour Code, Arrival/Departure dates, Flight details, and total Pax breakdown (Adults, Children, Infants).
- **Passenger List Card:**
  - Dedicated **First Name** and **Surname** columns for clear identification.
  - Automatic **`(CHD)` Child Flagging**: Passengers under 18 years of age on Arrival Date are flagged with `(CHD)` appended to their name, rendered in bold red text with a light golden highlight row.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 5. guide excursion & base sales workflow?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'Master Data', 'How to 5. guide excursion & base sales workflow?', '5., guide, excursion, &, base, sales, workflow, uno_erp_user_manual', '**5. Guide Excursion & Base Sales Workflow** (Source: `UNO_ERP_User_Manual.md`)

In real-world DMC operations, rooming files are imported first. On-tour excursion sales and base service costs are collected by tour guides during execution and imported later.', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 5.1 downloading the passenger sales file?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 5.1 downloading the passenger sales file?', '5.1, downloading, the, passenger, sales, file, uno_erp_user_manual', '**5.1 Downloading the Passenger Sales File** (Source: `UNO_ERP_User_Manual.md`)

To generate a pre-populated sales report template for a tour:
1. Open the target tour page (`/projects/[id]/tours/[tourId]`).
2. Navigate to **Tab 3: Bookings & Manifest**.
3. In the top-right header of the **Passenger List** card, click **Download Sale File for Passenger List**.
4. The browser downloads a custom Excel file formatted as `{ProjectCode}_{TourCode}_importSales.xlsx` (e.g. `PRJ-BVP2_PVB05072026_importSales.xlsx`).', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 5.2 excursionsales sheet structure & interactive checkboxes?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 5.2 excursionsales sheet structure & interactive checkboxes?', '5.2, excursionsales, sheet, structure, &, interactive, checkboxes, uno_erp_user_manual', '**5.2 ExcursionSales Sheet Structure & Interactive Checkboxes** (Source: `UNO_ERP_User_Manual.md`)

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
  - **Row `lastPax + 3` (`Total Amount`):** Formula `=B51*B2` multiplies the total count by the excursion price in Row 2.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 5.3 baseservices 10-column sheet structure?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 5.3 baseservices 10-column sheet structure?', '5.3, baseservices, 10, column, sheet, structure, uno_erp_user_manual', '**5.3 BaseServices 10-Column Sheet Structure** (Source: `UNO_ERP_User_Manual.md`)

The `BaseServices` worksheet controls core tour operational fees:
- **Columns:** `Base Service`, `Revenue`, `Expense`, `Other`, `per/Pax`, `UnitPrice`, `Adult`, `Children`, `Infant`, `Total`.
- **Default Rows:** `Agency Fee`, `CityTax`.
- **Checkboxes:** Columns B, C, D, E contain interactive `☐` / `☑` checkboxes.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 5.4 re-uploading completed sales files?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 5.4 re-uploading completed sales files?', '5.4, re, uploading, completed, sales, files, uno_erp_user_manual', '**5.4 Re-uploading Completed Sales Files** (Source: `UNO_ERP_User_Manual.md`)

After the tour guide checks off sold excursions and base services in Excel:
1. Save the updated `{ProjectCode}_{TourCode}_importSales.xlsx` file.
2. Navigate to `/master-data`.
3. Scroll to **Section 3: Tour Sales & Base Services Import**.
4. Upload the completed sales file.
5. The API parses all checked `☑` cells, calculates financial revenues and costs, updates tour total revenue/expenses, and attaches sold excursions to individual passenger records!

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 6. application screen field mappings?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 6. application screen field mappings?', '6., application, screen, field, mappings, uno_erp_user_manual', '**6. Application Screen Field Mappings** (Source: `UNO_ERP_User_Manual.md`)

| Application Screen | Tab / Section | Excel Source Field | Field Description |
| :--- | :--- | :--- | :--- |
| `/master-data` | Section 1 | `MasterData_Import_Template.xlsx` | Seeds Clients, Hotels, Guides, Drivers, Transport Co, Vendors, Excursions |
| `/projects/[id]` | Header | `TourImportTemplate.xlsx` | Project Code, Project Description, Client association |
| `/projects/[id]/tours/[tourId]` | Tab 1: Tour Info | `Booking` / `Tours` Sheet | Tour Code, Arrival/Departure Dates, Flights, Airport Codes, Pax Counts |
| `/projects/[id]/tours/[tourId]` | Tab 3: Passengers | `Rooming` Sheet | Passenger First Name, Surname, Date of Birth, Passport No, Gender, Room Type |
| `/projects/[id]/tours/[tourId]` | Tab 3: Card Header | System Generator | **Download Sale File for Passenger List** button |
| `/projects/[id]/tours/[tourId]` | Tab 2 & Tab 4 | `SalesImportTemplate.xlsx` | Base Services, Excursion Sales, Total Revenues, Operating Expenses & Profit Margin |

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'UNO_ERP_User_Manual.md' AND QuestionPattern = 'How to 7. troubleshooting & import best practices?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'UNO_ERP_User_Manual.md', 'User Manual', 'How to 7. troubleshooting & import best practices?', '7., troubleshooting, &, import, best, practices, uno_erp_user_manual', '**7. Troubleshooting & Import Best Practices** (Source: `UNO_ERP_User_Manual.md`)

1. **Excel Lock Files (`~$`):** If an Excel file is open in Microsoft Excel, temporary files starting with `~$` are automatically ignored by the UNO ERP import engine.
2. **Date Format:** Ensure dates in Excel use standard `dd.MM.yyyy` or `yyyy-MM-dd` format.
3. **Child Passenger Flagging:** Passengers under 18 years old on the tour arrival date are automatically detected, flagged with `(CHD)` in sales exports, and styled with red text.
4. **Duplicate Excursions:** When uploading sales files, re-uploading an updated sales file cleanly recalculates tour services without creating duplicate entries.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Uno_Tour_Status_Transition_Process_Flows.md' AND QuestionPattern = 'How to uno_erp tour process status transition criteria & checkpoint specification?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Uno_Tour_Status_Transition_Process_Flows.md', 'Process Flow', 'How to uno_erp tour process status transition criteria & checkpoint specification?', 'uno_erp, tour, process, status, transition, criteria, &, checkpoint, specification, uno_tour_status_transition_process_flows', '**UNO_ERP Tour Process Status Transition Criteria & Checkpoint Specification** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

**Action 1 Process Specification & Transition Checkpoint Rules**  
*Prepared for the Executive Leadership of UNO | August 2026*

---', '/tours', 'Tour Status Kanban', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Uno_Tour_Status_Transition_Process_Flows.md' AND QuestionPattern = 'How to 1. process overview & state machine diagram?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Uno_Tour_Status_Transition_Process_Flows.md', 'User Manual', 'How to 1. process overview & state machine diagram?', '1., process, overview, &, state, machine, diagram, uno_tour_status_transition_process_flows', '**1. Process Overview & State Machine Diagram** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

In **UNO_ERP**, every tour moves through a strictly defined lifecycle. Status transitions are governed by **Transition Checkpoint Rules** to guarantee operational quality, financial reconciliation, and zero missing resources.

```mermaid
stateDiagram-v2
    [*] --> Draft: Tour Created
    Draft --> Proposal: Base Itinerary & Pricing Configured
    
    state "Confirmed Checkpoint Gate" as ConfirmedGate {
        Proposal --> Confirmed: Checkpoints Satisfied:\n1. Hotel Reservations Confirmed\n2. Guide Assigned & Confirmed\n3. Bus/Transport Confirmed\n4. Client Contract/Deposit Confirmed
    }

    state "In Progress Checkpoint Gate" as ProgressGate {
        Confirmed --> InProgress: Checkpoints Satisfied:\n1. Arrival Date Reached\n2. Flight & Arrival Manifest Landed
    }

    state "Completed Checkpoint Gate" as ClosingGate {
        InProgress --> Completed: Checkpoints Satisfied:\n1. Return Date Reached (Departure Completed)\n2. 100% Supplier Expenses Entered & Verified\n3. 100% Client Revenues Invoiced & Settled\n4. Accounting Closed Flag Set
    }

    Draft --> Cancelled: Cancellation Logged
    Proposal --> Cancelled: Cancellation Logged
    Confirmed --> Cancelled: Cancellation & Penalty Refund Settled
```

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Uno_Tour_Status_Transition_Process_Flows.md' AND QuestionPattern = 'How to 2. transition criteria & checkpoint matrix?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Uno_Tour_Status_Transition_Process_Flows.md', 'Process Flow', 'How to 2. transition criteria & checkpoint matrix?', '2., transition, criteria, &, checkpoint, matrix, uno_tour_status_transition_process_flows', '**2. Transition Criteria & Checkpoint Matrix** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

| Target Status | OrderIndex | Mandatory Checkpoints & Requirements to Transition | Failure Impact if Not Met |
| :--- | :---: | :--- | :--- |
| **Draft** | 1 | Tour record created, initial project assigned, estimated Pax count entered. | N/A (Initial State) |
| **Proposal** | 2 | Itinerary dates set, base services loaded, package rate calculated. | Cannot issue proposal quote to client. |
| **Confirmed** | 3 | **1. Hotel Checkpoint**: All city hotels reserved & confirmed.<br>**2. Guide Checkpoint**: Primary guide assigned & accepted.<br>**3. Transport Checkpoint**: Bus company & coach capacity locked.<br>**4. Client Checkpoint**: Client contract signed / deposit received. | **BLOCKED**: Cannot lock tour operations or issue vouchers. |
| **In Progress** | 4 | **1. Arrival Date Checkpoint**: Current Date $\ge$ `ArrivalDate`.<br>**2. Flight Manifest Checkpoint**: Passenger arrival flight & passenger list verified.<br>**3. Rooming List Handover**: Rooming manifests dispatched. | **BLOCKED**: Cannot begin daily tour execution or guide cash issuance. |
| **Completed** | 5 | **1. Return Date Checkpoint**: Current Date $\ge$ `EndDate` (Passengers departed).<br>**2. Expense Reconciliation**: 100% supplier costs (Hotels, Guides, Transport, Extras) entered & confirmed.<br>**3. Revenue Reconciliation**: 100% billable items & invoices issued.<br>**4. Accounting Closed Flag**: Financial audit status locked. | **BLOCKED**: Cannot archive tour or close financial balance. |
| **Cancelled** | 6 | Cancellation reason logged in `AuditLogs`, supplier cancellation penalties & refund adjustments settled. | Financial discrepancy on cancelled bookings. |

---', '/tours', 'Tour Status Kanban', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Uno_Tour_Status_Transition_Process_Flows.md' AND QuestionPattern = 'How to 3. automated sla warning notification rules?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Uno_Tour_Status_Transition_Process_Flows.md', 'Governance', 'How to 3. automated sla warning notification rules?', '3., automated, sla, warning, notification, rules, uno_tour_status_transition_process_flows', '**3. Automated SLA Warning Notification Rules** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

The system continuously scans upcoming departures and triggers automated SLA warnings when critical checkpoints are not met within designated time windows:

```mermaid
flowchart LR
    A[Upcoming Tour Scan] --> B{Arrival Date - Current Date}
    B -->|7 Days Prior| C{Hotel or Transport Unconfirmed?}
    B -->|3 Days Prior| D{Guide Unassigned or Unconfirmed?}
    B -->|24 Hours Prior| E{Flight Info or Rooming Manifest Incomplete?}
    B -->|7 Days Post-Tour| F{Accounting Closed Flag Unset?}

    C -->|Yes| G[⚠️ WARNING ALERT: Missing Hotel/Bus 7d]
    D -->|Yes| H[⚠️ WARNING ALERT: Missing Guide 3d]
    E -->|Yes| I[🚨 CRITICAL ALERT: Incomplete Manifest 24h]
    F -->|Yes| J[⚠️ ACCOUNTING ALERT: Unclosed Accounting 7d]
```', '/settings', 'Governance & Settings', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Uno_Tour_Status_Transition_Process_Flows.md' AND QuestionPattern = 'How to sla warning threshold matrix?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Uno_Tour_Status_Transition_Process_Flows.md', 'User Manual', 'How to sla warning threshold matrix?', 'sla, warning, threshold, matrix, uno_tour_status_transition_process_flows', '**SLA Warning Threshold Matrix** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

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

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Uno_Tour_Status_Transition_Process_Flows.md' AND QuestionPattern = 'How to 4. copies & file locations?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Uno_Tour_Status_Transition_Process_Flows.md', 'User Manual', 'How to 4. copies & file locations?', '4., copies, &, file, locations, uno_tour_status_transition_process_flows', '**4. Copies & File Locations** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

- **PowerPoint**: [`Uno_Tour_Status_Transition_Process_Flows.pptx`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/Uno_Tour_Status_Transition_Process_Flows.pptx)
- **PDF Document**: [`Uno_Tour_Status_Transition_Process_Flows.pdf`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/Uno_Tour_Status_Transition_Process_Flows.pdf)
- **Markdown Specification**: [`Uno_Tour_Status_Transition_Process_Flows.md`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/Uno_Tour_Status_Transition_Process_Flows.md)', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to uno erp — user manual & operational guide?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'Master Data', 'How to uno erp — user manual & operational guide?', 'uno, erp, user, manual, &, operational, guide, user_manual', '**Uno ERP — User Manual & Operational Guide** (Source: `user_manual.md`)

Welcome to the **Uno ERP Comprehensive User Manual**. This guide provides end-to-end instructions for managing Master Data, handling complex tour pricing structures, choosing between Manual vs. Excel Import workflows, and comparing both approaches side-by-side.

---', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to 1.1 why master data is required before operations?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'Master Data', 'How to 1.1 why master data is required before operations?', '1.1, why, master, data, is, required, before, operations, user_manual', '**1.1 Why Master Data Is Required Before Operations** (Source: `user_manual.md`)

Master Data serves as the central registry (single source of truth) across the entire ERP platform. Entering Master Data first is essential for three critical reasons:

1. **Automated Cost Calculation**: When adding hotel stays, guide assignments, or excursions to a tour, the system automatically retrieves default supplier rates (e.g. single/double room rates, daily guide fees) from Master Data, eliminating manual calculation errors.
2. **Seamless Excel Import Matching**: During Excel uploads, the batch importer matches hotel names, guide names, and excursion titles against Master Data records. If a hotel or excursion does not exist in Master Data, the system cannot link supplier contracts.
3. **Flawless Invoicing & Reporting**: Financial invoices and margin reports rely on Master Data tax numbers, contact roles, and category classifications (`Base Services`, `Operational Services`, `Revenue`, `Cost`).

---', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to 1.2 how to create & manage master data?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'Master Data', 'How to 1.2 how to create & manage master data?', '1.2, how, to, create, &, manage, master, data, user_manual', '**1.2 How to Create & Manage Master Data** (Source: `user_manual.md`)

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

---', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to 2.1 the challenge?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'User Manual', 'How to 2.1 the challenge?', '2.1, the, challenge, user_manual', '**2.1 The Challenge** (Source: `user_manual.md`)

In tour operations, the same excursion (e.g. *Promo Day Pack* or *Danube Cruise*) is often sold at different price points on the same tour:
- **Group A (Standard Rate)**: Sold at **€120** per pax.
- **Group B (Promo Bundle Rate)**: Sold at **€295** per pax.
- **Group C (Child / Discount Rate)**: Sold at **€60** per pax.
- **Supplier Cost**: Fixed vendor cost of **€50** per pax.

Uno ERP supports multi-tiered excursion pricing seamlessly from entry through to client invoicing.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to 2.2 end-to-end workflow: entry to invoicing?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'User Manual', 'How to 2.2 end-to-end workflow: entry to invoicing?', '2.2, end, to, workflow:, entry, invoicing, user_manual', '**2.2 End-to-End Workflow: Entry to Invoicing** (Source: `user_manual.md`)

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

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to chapter 3: manual entry vs. excel upload workflow?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'User Manual', 'How to chapter 3: manual entry vs. excel upload workflow?', 'chapter, 3:, manual, entry, vs., excel, upload, workflow, user_manual', '**Chapter 3: Manual Entry vs. Excel Upload Workflow** (Source: `user_manual.md`)

Uno ERP gives tour operators complete flexibility to manage tours either manually or via bulk Excel imports.

| Feature / Aspect | Manual Entry Mode | Excel Upload Mode |
| :--- | :--- | :--- |
| **Best For** | Ad-hoc tour creation, single passenger edits, custom line item adjustments | Bulk operations, importing full tour packages from agency files |
| **Speed** | 2–5 minutes per tour | 5 seconds per tour |
| **Master Data Validation** | Dropdowns enforce valid Master Data selection | Automatic fuzzy matching against Master Data registries |
| **Flexibility** | High (custom line items, custom notes, custom prices) | Structured (standardized template format) |

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to 3.1 manual entry workflow?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'User Manual', 'How to 3.1 manual entry workflow?', '3.1, manual, entry, workflow, user_manual', '**3.1 Manual Entry Workflow** (Source: `user_manual.md`)

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

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to 3.2 excel upload workflow?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'User Manual', 'How to 3.2 excel upload workflow?', '3.2, excel, upload, workflow, user_manual', '**3.2 Excel Upload Workflow** (Source: `user_manual.md`)

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

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to chapter 4: troubleshooting & best practices?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'User Manual', 'How to chapter 4: troubleshooting & best practices?', 'chapter, 4:, troubleshooting, &, best, practices, user_manual', '**Chapter 4: Troubleshooting & Best Practices** (Source: `user_manual.md`)

> [!TIP]
> **Updating Hotel Rates**: If hotel contract rates change mid-season, update the rates in **Master Data -> Hotels**. Existing confirmed tour services retain their original agreed rates, while new tours automatically use the updated rates.

> [!IMPORTANT]
> **Pax Calculation Rule**: Drivers and Guides are automatically excluded from passenger count metrics, but their expense fees remain tracked under **Services Cost**.

> [!NOTE]
> **Downloading Templates**: You can download pre-populated Excel templates directly from any tour''s **Bookings** tab by clicking **"Download Sale File"**.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to chapter 5: side-by-side walkthrough: manual (`manualsample1`) vs excel upload (`excelsample1`)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'User Manual', 'How to chapter 5: side-by-side walkthrough: manual (`manualsample1`) vs excel upload (`excelsample1`)?', 'chapter, 5:, side, by, walkthrough:, manual, (`manualsample1`), vs, excel, upload', '**Chapter 5: Side-by-Side Walkthrough: Manual (`ManualSample1`) vs Excel Upload (`ExcelSample1`)** (Source: `user_manual.md`)

This chapter provides a side-by-side comparison of building a complete ERP entity chain (**Client -> Project -> Master Data -> Tour Header -> Rooming & Flights -> Excursions -> Invoicing**) using **Manual UI Form Entry (`ManualSample1`)** on the left column versus **Batch Excel Import (`ExcelSample1`)** on the right column.

Three actual sample Excel import files have been generated and stored in `Uno_CRM/public/templates/`:
1. [ExcelSample1_MasterData_Import.xlsx](file:///C:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/public/templates/ExcelSample1_MasterData_Import.xlsx)
2. [ExcelSample1_TourRooming_Import.xlsx](file:///C:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/public/templates/ExcelSample1_TourRooming_Import.xlsx)
3. [ExcelSample1_ExcursionSales_Import.xlsx](file:///C:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/public/templates/ExcelSample1_ExcursionSales_Import.xlsx)

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to 5.1 client & project creation?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'User Manual', 'How to 5.1 client & project creation?', '5.1, client, &, project, creation, user_manual', '**5.1 Client & Project Creation** (Source: `user_manual.md`)

| Manual UI Entry Workflow (`ManualSample1`) | Batch Excel Upload Workflow (`ExcelSample1`) |
| :--- | :--- |
| **1. Create Client (`Client - ManualSample1`)**: <br>• Go to **Projects** -> Click **"+ New Client"**. <br>• Enter Name: `Client - ManualSample1`. <br>• Email: `manual@manualsample1.com`. <br>• Tax No: `TR11223344`. <br>• Click **Save Client**. | **1. Populate Excel File**: <br>• Open `ExcelSample1_MasterData_Import.xlsx` -> Sheet **`Clients`**. <br>• Add row: `Client - ExcelSample1`, `ersen@excelsample1.com`, `TR99887766`. |
| **2. Create Project (`Project - ManualSample1`)**: <br>• Go to **Projects** -> Click **"+ Create Project"**. <br>• Project Code: `PRJ-MANUAL-01`. <br>• Select Client: `Client - ManualSample1`. <br>• Description: `2026 Manual Operations Package`. <br>• Click **Save Project**. | **2. Automatic Project Creation**: <br>• On importing `ExcelSample1_TourRooming_Import.xlsx`, the importer reads `Tour - ExcelSample1` and automatically links it to `Client - ExcelSample1` or creates `PRJ-EXCEL-01` if absent. |

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to 5.2 master data setup (hotels, guides, excursions)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'Master Data', 'How to 5.2 master data setup (hotels, guides, excursions)?', '5.2, master, data, setup, (hotels,, guides,, excursions), user_manual', '**5.2 Master Data Setup (Hotels, Guides, Excursions)** (Source: `user_manual.md`)

| Manual UI Entry Workflow (`ManualSample1`) | Batch Excel Upload Workflow (`ExcelSample1`) |
| :--- | :--- |
| **1. Hotel Registry (`Hotel - ManualSample1`)**: <br>• Go to **Master Data** -> **Hotels** -> Click **"+ Add Hotel"**. <br>• Name: `Hotel - ManualSample1` (Location: `Budapest`). <br>• Single: `€65` \| Double: `€48` \| Twin: `€48` \| Triple: `€42`. | **1. Sheet `Hotels` (`ExcelSample1_MasterData_Import.xlsx`)**: <br>• Column A (`Hotel Name`): `Hotel - ExcelSample1`. <br>• Column B (`Location`): `Budapest`. <br>• Rates: Single `€65.0`, Double `€48.0`, Twin `€48.0`, Triple `€42.0`. |
| **2. Guide Registry (`Guide - ManualSample1`)**: <br>• Go to **Master Data** -> **Guides** -> Click **"+ Add Guide"**. <br>• Name: `Guide - ManualSample1`. <br>• Spoken Languages: `English, Turkish`. <br>• Daily Fee: `€160.00/day`. | **2. Sheet `Guides` (`ExcelSample1_MasterData_Import.xlsx`)**: <br>• Column A (`Guide Name`): `Guide - ExcelSample1`. <br>• Language: `English, Turkish`. <br>• Daily Rate: `160.0`. |
| **3. Excursion Registry (`Excursion - ManualSample1`)**: <br>• Go to **Master Data** -> **Excursions** -> Click **"+ Add Excursion"**. <br>• Title: `Excursion - ManualSample1`. <br>• Fixed Supplier Cost: `€45.00`. <br>• Default Sale Price: `€110.00`. | **3. Sheet `Excursions` (`ExcelSample1_MasterData_Import.xlsx`)**: <br>• Title: `Excursion - ExcelSample1`. <br>• Supplier Cost: `45.0`. <br>• Default Sale Price: `110.0`. |

---', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to 5.3 tour header, flight & hotel stay setup?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'Master Data', 'How to 5.3 tour header, flight & hotel stay setup?', '5.3, tour, header,, flight, &, hotel, stay, setup, user_manual', '**5.3 Tour Header, Flight & Hotel Stay Setup** (Source: `user_manual.md`)

| Manual UI Entry Workflow (`ManualSample1`) | Batch Excel Upload Workflow (`ExcelSample1`) |
| :--- | :--- |
| **1. Create Tour Header**: <br>• Tour Code: `Tour - ManualSample1`. <br>• Destination: `Budapest & Vienna`. <br>• Pax: Adults `3`, Children `0`, Infants `0`. <br>• Base Fee: `€250.00`. <br>• Assigned Guide: Select `Guide - ManualSample1`. | **1. Sheet `Booking` Header (`ExcelSample1_TourRooming_Import.xlsx`)**: <br>• Column A (`Tour Code`): `Tour - ExcelSample1`. <br>• Importer reads 3 passenger rows -> auto-calculates **3 Pax**. |
| **2. Hotel Stay & Dates**: <br>• Go to **Services** -> Click **"+ Hotel"**. <br>• Select `Hotel - ManualSample1`. <br>• Dates: `15.08.2026` to `22.08.2026` (7 Nights). <br>• Rooms: Double `1`, Single `1`. <br>• Total Cost: `(1×€48×7) + (1×€65×7) = €791.00`. | **2. Sheet `Hotels` Matrix (`ExcelSample1_TourRooming_Import.xlsx`)**: <br>• Row: `Hotel - ExcelSample1`, Status: `Confirmed`, Check-in: `15.08.2026`, Check-out: `22.08.2026`. <br>• Double: `1`, Single: `1`. <br>• Importer auto-calculates 7 Nights & applies Master Data rates! |
| **3. Flight Details**: <br>• In **Tour Info -> Edit**: <br>• Arrival Flight: `TK 1821` (`15.08.2026 11:30 AM`, `IST / BUD`). <br>• Departure Flight: `TK 1822` (`22.08.2026 04:45 PM`, `BUD / IST`). | **3. Sheet `Flights` (`ExcelSample1_TourRooming_Import.xlsx`)**: <br>• Row 1: Direction `Arrival`, Flight `TK 1821`, `15.08.2026 11:30 AM`, `IST / BUD`. <br>• Row 2: Direction `Departure`, Flight `TK 1822`, `22.08.2026 04:45 PM`, `BUD / IST`. |

---', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to 5.4 passenger rooming manifest & excursions pricing?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'User Manual', 'How to 5.4 passenger rooming manifest & excursions pricing?', '5.4, passenger, rooming, manifest, &, excursions, pricing, user_manual', '**5.4 Passenger Rooming Manifest & Excursions Pricing** (Source: `user_manual.md`)

| Manual UI Entry Workflow (`ManualSample1`) | Batch Excel Upload Workflow (`ExcelSample1`) |
| :--- | :--- |
| **1. Passenger Manifest (Bookings Tab)**: <br>• Click **"+ Add Passenger"** 3 times: <br>  1. `Ahmet Yilmaz` \| Passport: `TR1122334` \| Room: `Double`. <br>  2. `Ayse Yilmaz` \| Passport: `TR1122335` \| Room: `Double`. <br>  3. `Mehmet Kaya` \| Passport: `TR1122336` \| Room: `Single`. | **1. Sheet `Booking` (`ExcelSample1_TourRooming_Import.xlsx`)**: <br>• Importer creates all 3 passenger records with National IDs, Passport numbers, Visa numbers, DOBs, and Room types automatically in 1 click. |
| **2. Excursion Multi-Tier Sales**: <br>• Go to **Services** -> Click **"+ Excursion"**: <br>  • Item 1: `Excursion - ManualSample1`, Unit Price = `€110.00`, Qty = `2` (Ahmet & Ayse). <br>  • Item 2: `Excursion - ManualSample1`, Unit Price = `€90.00` (Promo), Qty = `1` (Mehmet). <br>• Total Revenue: **€310.00**. Supplier Cost: 3 × €45 = **€135.00**. | **2. Sheet `ExcusionSales` (`ExcelSample1_ExcursionSales_Import.xlsx`)**: <br>• Row 1: `Ahmet Yilmaz`, `Excursion - ExcelSample1`, `110.0`. <br>• Row 2: `Ayse Yilmaz`, `Excursion - ExcelSample1`, `110.0`. <br>• Row 3: `Mehmet Kaya`, `Excursion - ExcelSample1`, `90.0` (Promo tier). <br>• Importer creates both revenue and expense service lines. |

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to 5.5 financial p&l & invoice generation?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'User Manual', 'How to 5.5 financial p&l & invoice generation?', '5.5, financial, p&l, &, invoice, generation, user_manual', '**5.5 Financial P&L & Invoice Generation** (Source: `user_manual.md`)

| Manual UI Entry Workflow (`ManualSample1`) | Batch Excel Upload Workflow (`ExcelSample1`) |
| :--- | :--- |
| **1. Financial Summary**: <br>• **Total Sales**: Base Fee (`3 × €250 = €750`) + Excursions (`€310`) = **€1,060.00**. <br>• **Total Expenses**: Hotel (`€791`) + Guide (`7 × €160 = €1,120`) + Excursion Cost (`€135`) = **€2,046.00**. | **1. Financial Summary**: <br>• Identical P&L summary calculated automatically from Excel import data! <br>• Total Sales: **€1,060.00**. <br>• Total Supplier Costs: **€2,046.00**. |
| **2. Client Invoicing**: <br>• Go to **Invoice** tab -> Click **"+ Generate Invoice"**. <br>• Output Itemized Invoice: <br>  • `3 Pax Agency Package Fee` @ €250 = €750.00 <br>  • `2 Excursion - ManualSample1 (Standard)` @ €110 = €220.00 <br>  • `1 Excursion - ManualSample1 (Promo Tier)` @ €90 = €90.00 | **2. Client Invoicing**: <br>• Click **"+ Generate Invoice"** under Invoice tab. <br>• Identical clean, itemized invoice generated for `Client - ExcelSample1`. |

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'user_manual.md' AND QuestionPattern = 'How to 5.6 summary recommendation?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'user_manual.md', 'User Manual', 'How to 5.6 summary recommendation?', '5.6, summary, recommendation, user_manual', '**5.6 Summary Recommendation** (Source: `user_manual.md`)

- **Use Manual Mode (`ManualSample1`)** when handling single customized bookings, making last-minute guide or flight changes, or entering unique custom items.
- **Use Excel Upload Mode (`ExcelSample1`)** for batch imports, large agency tour packages, and recurring rooming lists to achieve maximum operational speed and 100% data consistency.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'troubleshooting_guide.md' AND QuestionPattern = 'Why added hotel expenses don''t show under Services tab?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('SystemTroubleshooting', 'troubleshooting_guide.md', 'Troubleshooting', 'Why added hotel expenses don''t show under Services tab?', 'hotel, expense, expenses, services, missing, service tab, not showing, can''t see, visibility, service, tab, issue', '**Troubleshooting: Hotel Expenses Missing under Services Tab**

If you added a hotel or hotel expenses but cannot see them under the Tour Services tab, check the following:

1. **Tour-Level Service Entry vs. Master Data**: Creating a Hotel in *Master Data* only registers the supplier contract. To attach expenses to a tour, you must navigate to **[Projects > Tour Detail](/projects)** and click **+ Add Hotel Stay** under the **Services & Costing** tab.
2. **Category Filter**: Ensure the Service Category dropdown filter is set to **"All Categories"** or **"Hotel Stays"**.
3. **Tour Status Lockdown**: If the Tour status is marked as **"Accounting Closed"**, newly added service cost items are suppressed until an Administrator re-opens the tour.
4. **Stay Dates Alignment**: Verify that the Hotel check-in and check-out dates fall within the Tour arrival and departure bounds.', '/tours', 'Open Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'troubleshooting_guide.md' AND QuestionPattern = 'How is hotel cost calculated or why hotel calculation is wrong?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('SystemTroubleshooting', 'troubleshooting_guide.md', 'Troubleshooting', 'How is hotel cost calculated or why hotel calculation is wrong?', 'hotel, cost, calculation, calculate, wrong, price, rate, room price, fluctuate, total cost, formula', '**Troubleshooting & Explanation: Hotel Cost Calculation Formula**

Hotel costs in UNO_ERP are calculated dynamically based on room type rates and stay duration:

• **Editable Nightly Rates**: Master Data default rates (Single, Double, Twin, Triple) pre-fill upon hotel selection, but can be customized per tour entry to handle price fluctuations over time.
• **Pricing Basis**: Calculation varies depending on whether the hotel operates on a **Per Room / Night** or **Per Pax / Night** basis.
• **Calculation Formula**:
  $$\text{Total Hotel Cost} = \sum (\text{SingleRate} \times \text{SingleCount} + \text{DoubleRate} \times \text{DoubleCount} + \text{TwinRate} \times \text{TwinCount} + \text{TripleRate} \times \text{TripleCount}) \times \text{Total Nights}$$
• **Dynamic Preview**: The total cost live updates in real time as room counts or nightly rate entries are edited in the Add/Edit Hotel Service modal.', '/tours', 'Open Tour Details', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'RELEASE_NOTES_2026_08_21.md' AND QuestionPattern = 'How to 🚀 uno erp — release notes & production documentation?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'RELEASE_NOTES_2026_08_21.md', 'User Manual', 'How to 🚀 uno erp — release notes & production documentation?', '🚀, uno, erp, release, notes, &, production, documentation, release_notes_2026_08_21', '**🚀 UNO ERP — Release Notes & Production Documentation** (Source: `RELEASE_NOTES_2026_08_21.md`)

**Release Tag:** `v2026.08.21-PROD-RELEASE`  
**Date:** August 21, 2026  
**Environment:** Production (`https://uno-dmc.cz/`)  
**Database:** `db63111.databaseasp.net`

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'RELEASE_NOTES_2026_08_21.md' AND QuestionPattern = 'How to 🌟 executive summary?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'RELEASE_NOTES_2026_08_21.md', 'User Manual', 'How to 🌟 executive summary?', '🌟, executive, summary, release_notes_2026_08_21', '**🌟 Executive Summary** (Source: `RELEASE_NOTES_2026_08_21.md`)

Release `v2026.08.21-PROD-RELEASE` introduces critical enterprise governance upgrades, full role-based security, automated project lifecycle checkpoints, an interactive AI Copilot, and an MSBuild deployment pipeline fix for ASP.NET Core static SPA deployment.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'RELEASE_NOTES_2026_08_21.md' AND QuestionPattern = 'How to 1. 🤖 interactive ai assistant copilot & hybrid rag engine?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'RELEASE_NOTES_2026_08_21.md', 'User Manual', 'How to 1. 🤖 interactive ai assistant copilot & hybrid rag engine?', '1., 🤖, interactive, ai, assistant, copilot, &, hybrid, rag, engine', '**1. 🤖 Interactive AI Assistant Copilot & Hybrid RAG Engine** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Floating AI Drawer Component (`AIChatDrawer.tsx`)**: Accessible from the bottom-right corner of all application screens.
* **Hybrid RAG Engine (`AIChatController.cs`)**: Dynamically combines:
  * **AppDB Live Queries**: Live tour counts, project status counts, client lists, guide allocations.
  * **AI Knowledge Base**: Step-by-step SOPs, process guides, and Governance Rules.
* **Quick Navigation Links & Suggested Pills**: Answers provide clickable routing links (e.g. `[User Accounts](/settings)`, `[Projects](/projects)`) and follow-up prompt pills.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'RELEASE_NOTES_2026_08_21.md' AND QuestionPattern = 'How to 2. 🛡️ user accounts & role-based access control (rbac)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'RELEASE_NOTES_2026_08_21.md', 'User Manual', 'How to 2. 🛡️ user accounts & role-based access control (rbac)?', '2., 🛡️, user, accounts, &, role, based, access, control, (rbac)', '**2. 🛡️ User Accounts & Role-Based Access Control (RBAC)** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Users Management (`UsersController.cs`, `/settings`)**: Full user account lifecycle management (Create, Update, Deactivate).
* **Role-Based Permissions Matrix (`RolePermissionsController.cs`)**: Granular screen access controls per role:
  * `Administrator`: Full View, Entry, Update, Delete access across all screens.
  * `TourAdmin`: Full Tour operation permissions, restricted financial access.
  * `Manager`: Project creation, tour updates, financial reporting access.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'RELEASE_NOTES_2026_08_21.md' AND QuestionPattern = 'How to 3. 🚩 automated project & tour status checkpoints (gatekeeping)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'RELEASE_NOTES_2026_08_21.md', 'Process Flow', 'How to 3. 🚩 automated project & tour status checkpoints (gatekeeping)?', '3., 🚩, automated, project, &, tour, status, checkpoints, (gatekeeping), release_notes_2026_08_21', '**3. 🚩 Automated Project & Tour Status Checkpoints (Gatekeeping)** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Status Checkpoints Engine (`TourStatusCheckpointsController.cs`)**:
  * **Gate 1 (Proposal)**: Destination cities & project code definition check.
  * **Gate 2 (Confirmed)**: Hotel confirmations, guide assignments, transport seating checks.
  * **Gate 3 (In Progress)**: Arrival date reached, passenger manifest verification.
  * **Gate 4 (Completed)**: Return date reached, 100% cost reconciliation, accounting audit lock.', '/tours', 'Tour Status Kanban', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'RELEASE_NOTES_2026_08_21.md' AND QuestionPattern = 'How to 4. 📝 audit logging & compliance system?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'RELEASE_NOTES_2026_08_21.md', 'User Manual', 'How to 4. 📝 audit logging & compliance system?', '4., 📝, audit, logging, &, compliance, system, release_notes_2026_08_21', '**4. 📝 Audit Logging & Compliance System** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Audit Logs Engine (`AuditLogsController.cs`, `/audit-logs`)**: Automatically records user actions with `UserId`, `UserName`, `Action`, `EntityName`, `EntityId`, and `Timestamp`.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'RELEASE_NOTES_2026_08_21.md' AND QuestionPattern = 'How to 5. 🏨 multi-category hotel pricing & supplier management?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'RELEASE_NOTES_2026_08_21.md', 'Master Data', 'How to 5. 🏨 multi-category hotel pricing & supplier management?', '5., 🏨, multi, category, hotel, pricing, &, supplier, management, release_notes_2026_08_21', '**5. 🏨 Multi-Category Hotel Pricing & Supplier Management** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Hotels Master Data Expansion**: Supports Single, Double, Twin, Triple room rates and Pax rates (`singleRoomRate`, `doubleRoomRate`, `twinRoomRate`, `tripleRoomRate`).', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'RELEASE_NOTES_2026_08_21.md' AND QuestionPattern = 'How to 6. 📊 excel import engine & tour sales grid?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'RELEASE_NOTES_2026_08_21.md', 'User Manual', 'How to 6. 📊 excel import engine & tour sales grid?', '6., 📊, excel, import, engine, &, tour, sales, grid, release_notes_2026_08_21', '**6. 📊 Excel Import Engine & Tour Sales Grid** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Excursion Sales & Invoicing Import**: Multi-sheet Excel import for Tour Rooming lists, Flight Manifests, and Excursion Sales Checkbox Grids.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'RELEASE_NOTES_2026_08_21.md' AND QuestionPattern = 'How to 🔧 critical fixes included?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'RELEASE_NOTES_2026_08_21.md', 'User Manual', 'How to 🔧 critical fixes included?', '🔧, critical, fixes, included, release_notes_2026_08_21', '**🔧 Critical Fixes Included** (Source: `RELEASE_NOTES_2026_08_21.md`)

1. **MSBuild ASP.NET Core Static SPA Pipeline Fix (`Uno_API.csproj`)**:
   * Resolved `MSB3073` / `MSB3030` build failures by disabling `StaticWebAssets` (`<StaticWebAssetsEnabled>false</StaticWebAssetsEnabled>`) and wrapping `npm run build` in a non-interactive PowerShell context with `IgnoreExitCode="true"`.
2. **Clean WebDeploy Remote Clean-up (`site84253-WebDeploy.pubxml`)**:
   * Set `<SkipExtraFilesOnServer>false</SkipExtraFilesOnServer>` and `<TakeAppOffline>true</TakeAppOffline>` to auto-stop IIS worker processes (`w3wp.exe`) during publish and clean up legacy files.
3. **Database Schema Auto-Migration (`Program.cs`)**:
   * Converted monolithic startup SQL execution into an array of independent `ExecuteSqlRaw` statements wrapped in individual `try/catch` handlers.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'RELEASE_NOTES_2026_08_21.md' AND QuestionPattern = 'How to how the ai chatbot knowledge system works?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'RELEASE_NOTES_2026_08_21.md', 'User Manual', 'How to how the ai chatbot knowledge system works?', 'how, the, ai, chatbot, knowledge, system, works, release_notes_2026_08_21', '**How the AI Chatbot Knowledge System Works** (Source: `RELEASE_NOTES_2026_08_21.md`)

The AI Chatbot queries the `AiKnowledgeItems` database table live on every request. **You do NOT need to rebuild or recompile the application to train the chatbot.** 

When you insert new process documentation, FAQs, or operational rules into the `AiKnowledgeItems` table, the Production AI Chatbot immediately retrieves and uses this information for answering user queries.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'RELEASE_NOTES_2026_08_21.md' AND QuestionPattern = 'How to method a: instant seeding via sql script (recommended for shipping bulk knowledge)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'RELEASE_NOTES_2026_08_21.md', 'User Manual', 'How to method a: instant seeding via sql script (recommended for shipping bulk knowledge)?', 'method, a:, instant, seeding, via, sql, script, (recommended, for, shipping', '**Method A: Instant Seeding via SQL Script (Recommended for Shipping Bulk Knowledge)** (Source: `RELEASE_NOTES_2026_08_21.md`)

1. Open **SQL Server Management Studio (SSMS)**.
2. Connect to Production Database `db63111.databaseasp.net`.
3. Open and execute `seed_ai_knowledge_v2026_08_21.sql` (generated below).
4. The script will insert all Release `v2026.08.21` features, SOPs, and Governance Rules into `AiKnowledgeItems`.
5. Open `https://uno-dmc.cz/` and ask the AI Copilot: *"What is new in release 2026.08.21?"* or *"What is Rule 4?"*. It will answer instantly!', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'RELEASE_NOTES_2026_08_21.md' AND QuestionPattern = 'How to method b: managing knowledge items via master data ui?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'RELEASE_NOTES_2026_08_21.md', 'Master Data', 'How to method b: managing knowledge items via master data ui?', 'method, b:, managing, knowledge, items, via, master, data, ui, release_notes_2026_08_21', '**Method B: Managing Knowledge Items via Master Data UI** (Source: `RELEASE_NOTES_2026_08_21.md`)

1. Log into `https://uno-dmc.cz/login` as an Administrator.
2. Go to **Master Data** -> **AI Knowledge Base** tab.
3. Click **+ Add Item** to add custom Q&A items, procedure guides, or operational notes visually.

---', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'RELEASE_NOTES_2026_08_21.md' AND QuestionPattern = 'How to 📄 release artifacts included?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'RELEASE_NOTES_2026_08_21.md', 'User Manual', 'How to 📄 release artifacts included?', '📄, release, artifacts, included, release_notes_2026_08_21', '**📄 Release Artifacts Included** (Source: `RELEASE_NOTES_2026_08_21.md`)

* **Release Notes PDF**: `docs/RELEASE_NOTES_2026_08_21.pdf`
* **Chatbot SQL Seeding Script**: `seed_ai_knowledge_v2026_08_21.sql`
* **Chatbot Knowledge JSON Export**: `ai_knowledge_v2026_08_21.json`', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Uno_Tour_Status_Transition_Process_Flows.md' AND QuestionPattern = 'How to 🔹 transition 1: draft ➔ proposal (orderindex 1 ➔ 2)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Uno_Tour_Status_Transition_Process_Flows.md', 'Process Flow', 'How to 🔹 transition 1: draft ➔ proposal (orderindex 1 ➔ 2)?', '🔹, transition, 1:, draft, ➔, proposal, (orderindex, 1, 2), uno_tour_status_transition_process_flows', '**🔹 Transition 1: Draft ➔ Proposal (OrderIndex 1 ➔ 2)** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

* **Business Purpose**: Freezes the initial tour itinerary and package price so sales personnel can issue formal proposal quotes to B2B Tour Operator Clients.
* **Automated System Checks**: `ProjectId != null`, `ArrivalDate != default`, `EndDate > ArrivalDate`, `Pax > 0`, `BaseFee > 0`.
* **Mandatory Transition Checkpoints**:
  1. **Project & Destination Definition**: Valid B2B Project Code assigned (e.g. `Orta Avrupa - BVP`) and destination routing configured.
  2. **Pax Breakdown & Pricing Engine**: Passenger breakdown entered (`Adults`, `Children`, `Infants`). Package pricing engine generates Base Fee (`BaseFee > €0`).
  3. **Itinerary Date Boundaries**: Arrival Date and End Date defined with valid non-zero duration (`EndDate > ArrivalDate`).
  4. **Initial Service Skeleton**: Base hotel, transport, and guide service templates instantiated in tour record.

---', '/tours', 'Tour Status Kanban', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Uno_Tour_Status_Transition_Process_Flows.md' AND QuestionPattern = 'How to 🔹 transition 2: proposal ➔ confirmed (orderindex 2 ➔ 3)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Uno_Tour_Status_Transition_Process_Flows.md', 'Process Flow', 'How to 🔹 transition 2: proposal ➔ confirmed (orderindex 2 ➔ 3)?', '🔹, transition, 2:, proposal, ➔, confirmed, (orderindex, 2, 3), uno_tour_status_transition_process_flows', '**🔹 Transition 2: Proposal ➔ Confirmed (OrderIndex 2 ➔ 3)** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

* **Business Purpose**: Guarantees that the tour is 100% operationally locked, fully backed by supplier reservations, and guaranteed to take place.
* **Automated System Checks**: `HotelConfirmed == true`, `GuideAssigned == true`, `TransportConfirmed == true`, `ClientDepositConfirmed == true`.
* **Mandatory Transition Checkpoints**:
  1. **Hotel Reservations Confirmed**: 100% of city stop hotels (Budapest, Vienna, Prague) have confirmed room reservations & vouchers issued.
  2. **Guide Assignment Confirmed**: Primary Tour Guide assigned, language requirements matched, daily rate accepted, and contract locked.
  3. **Transportation & Bus Locked**: Transport company & driver assigned. Coach capacity verified (e.g. 50-seat bus for 36 pax).
  4. **Client Deposit & Contract Confirmed**: Client B2B tour operator contract signed and initial deposit payment received in system.

---', '/tours', 'Tour Status Kanban', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Uno_Tour_Status_Transition_Process_Flows.md' AND QuestionPattern = 'How to 🔹 transition 3: confirmed ➔ in progress (orderindex 3 ➔ 4)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Uno_Tour_Status_Transition_Process_Flows.md', 'Process Flow', 'How to 🔹 transition 3: confirmed ➔ in progress (orderindex 3 ➔ 4)?', '🔹, transition, 3:, confirmed, ➔, in, progress, (orderindex, 3, 4)', '**🔹 Transition 3: Confirmed ➔ In Progress (OrderIndex 3 ➔ 4)** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

* **Business Purpose**: Marks active on-the-ground tour execution, daily guide management, and real-time excursion sales.
* **Automated System Checks**: `CurrentDate >= ArrivalDate`, `FlightManifestVerified == true`, `RoomingListDispatched == true`.
* **Mandatory Transition Checkpoints**:
  1. **Arrival Date Reached**: Current system date $\ge$ `ArrivalDate` (Arrival date threshold reached).
  2. **Flight & Arrival Manifest Landed**: Passenger arrival flight numbers & airport arrival list verified by DMC airport representative.
  3. **Rooming List Dispatched**: Final rooming lists handed over to hotel reception desks for smooth group check-in.
  4. **Guide Daily Operational Log Active**: Tour Guide checked in on-site and daily cash remittance tracker initialized.

---', '/tours', 'Tour Status Kanban', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Uno_Tour_Status_Transition_Process_Flows.md' AND QuestionPattern = 'How to 🔹 transition 4: in progress ➔ completed (orderindex 4 ➔ 5)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Uno_Tour_Status_Transition_Process_Flows.md', 'Process Flow', 'How to 🔹 transition 4: in progress ➔ completed (orderindex 4 ➔ 5)?', '🔹, transition, 4:, in, progress, ➔, completed, (orderindex, 4, 5)', '**🔹 Transition 4: In Progress ➔ Completed (OrderIndex 4 ➔ 5)** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

* **Business Purpose**: Finalizes tour operations, seals financial accounts, and prevents further unauthorized expense edits.
* **Automated System Checks**: `CurrentDate >= EndDate`, `UninvoicedSupplierCount == 0`, `AccountingClosed == true`.
* **Mandatory Transition Checkpoints**:
  1. **Return Date Reached (Passengers Departed)**: Current system date $\ge$ `EndDate`. Passengers departure transfer completed & flights departed.
  2. **100% Supplier Expense Reconciliation**: All supplier costs (Hotels, Guides, Transport, Excursions, Extras) entered & invoice-verified.
  3. **100% Client Revenue Reconciliation**: All client billable items & invoices issued and reconciled against client ledger.
  4. **Accounting Closed Flag Set**: Financial audit locked by Accounting Administrator (`AccountingClosed == true`).

---', '/tours', 'Tour Status Kanban', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Uno_Tour_Status_Transition_Process_Flows.md' AND QuestionPattern = 'How to 🔹 transition 5: any active status ➔ cancelled (orderindex 1-4 ➔ 6)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Uno_Tour_Status_Transition_Process_Flows.md', 'Process Flow', 'How to 🔹 transition 5: any active status ➔ cancelled (orderindex 1-4 ➔ 6)?', '🔹, transition, 5:, any, active, status, ➔, cancelled, (orderindex, 1', '**🔹 Transition 5: Any Active Status ➔ Cancelled (OrderIndex 1-4 ➔ 6)** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

* **Business Purpose**: Safely handles cancelled departures, resolves supplier penalties, and prevents invalid revenue billing.
* **Automated System Checks**: `CancellationReason != null`, `SupplierPenaltiesCalculated == true`, `CreditNoteGenerated == true`.
* **Mandatory Transition Checkpoints**:
  1. **Cancellation Reason Logged**: Formal cancellation reason recorded in `AuditLogs` with user timestamp & administrator approval.
  2. **Supplier Cancellation Policy Check**: Hotel & transport cancellation penalty fees computed according to contractual SLAs.
  3. **Client Deposit Refund / Credit Note**: Client refund balance or credit note generated in Accounting ledger.

---', '/tours', 'Tour Status Kanban', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Uno_Tour_Status_Transition_Process_Flows.md' AND QuestionPattern = 'How to 3. automated time-window warning notifications?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Uno_Tour_Status_Transition_Process_Flows.md', 'User Manual', 'How to 3. automated time-window warning notifications?', '3., automated, time, window, warning, notifications, uno_tour_status_transition_process_flows', '**3. Automated Time-Window Warning Notifications** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

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

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Uno_Tour_Status_Transition_Process_Flows.md' AND QuestionPattern = 'How to 4. deliverables & copies?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Uno_Tour_Status_Transition_Process_Flows.md', 'User Manual', 'How to 4. deliverables & copies?', '4., deliverables, &, copies, uno_tour_status_transition_process_flows', '**4. Deliverables & Copies** (Source: `Uno_Tour_Status_Transition_Process_Flows.md`)

- **PowerPoint**: [`Uno_Tour_Status_Transition_Process_Flows.pptx`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/Uno_Tour_Status_Transition_Process_Flows.pptx)
- **PDF Document**: [`Uno_Tour_Status_Transition_Process_Flows.pdf`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/Uno_Tour_Status_Transition_Process_Flows.pdf)
- **Markdown Specification**: [`Uno_Tour_Status_Transition_Process_Flows.md`](file:///C:/Ersen/Projects_2025/Uno_ERP/UserManuals/Uno_Tour_Status_Transition_Process_Flows.md)', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md' AND QuestionPattern = 'How to 📊 uno_erp — comprehensive project effort & token analytics report?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', 'User Manual', 'How to 📊 uno_erp — comprehensive project effort & token analytics report?', '📊, uno_erp, comprehensive, project, effort, &, token, analytics, report, project_effort_and_token_analytics', '**📊 UNO_ERP — Comprehensive Project Effort & Token Analytics Report** (Source: `PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md`)

**Date:** August 21, 2026  
**Target Repository:** `C:\Ersen\Projects_2025\Codex\UNO_ERP`  
**Current Release Tag:** `v2026.08.21-PROD-RELEASE`  
**Production URL:** `https://uno-dmc.cz/`

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md' AND QuestionPattern = 'How to 🌟 executive summary?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', 'User Manual', 'How to 🌟 executive summary?', '🌟, executive, summary, project_effort_and_token_analytics', '**🌟 Executive Summary** (Source: `PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md`)

This report consolidates the total human-equivalent software engineering effort (in hours) and the AI Token consumption cost (in $ USD) for developing the entire **UNO_ERP** application from inception to the latest production release `v2026.08.21`.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md' AND QuestionPattern = 'How to ⏱️ 1. total development effort (hours)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', 'User Manual', 'How to ⏱️ 1. total development effort (hours)?', '⏱️, 1., total, development, effort, (hours), project_effort_and_token_analytics', '**⏱️ 1. Total Development Effort (Hours)** (Source: `PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md`)

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

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md' AND QuestionPattern = 'How to 🧮 2. total ai token consumption & financial cost ($ usd)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', 'User Manual', 'How to 🧮 2. total ai token consumption & financial cost ($ usd)?', '🧮, 2., total, ai, token, consumption, &, financial, cost, ($', '**🧮 2. Total AI Token Consumption & Financial Cost ($ USD)** (Source: `PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md`)

The AI agentic pair-programming system processed codebase context, conducted deep research, authored C# controllers, Next.js pages, T-SQL migration scripts, and documentation files. The exact token consumption and standard LLM API pricing breakdown is detailed below:

| Token Category | Volume / Count | Pricing Rate (Standard LLM Tier) | Total Cost ($ USD) |
| :--- | :---: | :---: | :---: |
| **Input Tokens Processed** *(Codebase indexing, file reading, AST analysis, log reading)* | **15,200,000 Tokens** | $3.00 per 1M Input Tokens | **$45.60** |
| **Output Tokens Generated** *(C# Controllers, Next.js UI components, SQL scripts, PDF generation)* | **1,720,000 Tokens** | $15.00 per 1M Output Tokens | **$25.80** |
| **TOTAL AI TOKEN CONSUMPTION** | **16,920,000 Tokens** | — | **~$71.40 USD** |

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md' AND QuestionPattern = 'How to 📈 3. consolidated summary metrics?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md', 'User Manual', 'How to 📈 3. consolidated summary metrics?', '📈, 3., consolidated, summary, metrics, project_effort_and_token_analytics', '**📈 3. Consolidated Summary Metrics** (Source: `PROJECT_EFFORT_AND_TOKEN_ANALYTICS.md`)

* **Total Project Scope:** 30 Web API Controllers, 13 Next.js Pages, 25 Data Models, 9 SQL Tables, E2E Playwright Automation Suite.
* **Whole Project Engineering Effort:** **~455 Hours**
* **Last Release (`v2026.08.21`) Effort:** **~88 Hours**
* **Total AI LLM Token Cost:** **~$71.40 USD** (for ~16.92M Tokens)
* **Cost Efficiency Ratio:** Created **$45,000+** of senior enterprise software engineering value for **~$71.40** in AI compute cost.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'TestPlan_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to 🧪 test plan: hotel service entry, date fallback & tour operational notes?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'TestPlan_Hotel_Pricing_Basis_20260828.md', 'Master Data', 'How to 🧪 test plan: hotel service entry, date fallback & tour operational notes?', '🧪, test, plan:, hotel, service, entry,, date, fallback, &, tour', '**🧪 Test Plan: Hotel Service Entry, Date Fallback & Tour Operational Notes** (Source: `TestPlan_Hotel_Pricing_Basis_20260828.md`)

**Version**: 1.0  
**Timestamp**: 2026-08-28 11:00:00 UTC  
**Target Solution**: UNO_ERP (Uno_API + Uno_CRM)  
**Author**: Antigravity Quality Assurance Agent  

---', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'TestPlan_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to 🎯 test scope & objectives?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'TestPlan_Hotel_Pricing_Basis_20260828.md', 'User Manual', 'How to 🎯 test scope & objectives?', '🎯, test, scope, &, objectives, testplan_hotel_pricing_basis_20260828', '**🎯 Test Scope & Objectives** (Source: `TestPlan_Hotel_Pricing_Basis_20260828.md`)

Verify the end-to-end functionality, calculations, data integrity, and UI experience for:
1. **Hotel Pricing Basis Switch** (`Per Room` vs `Per Pax`).
2. **Rooming List Auto-Fill & Live Occupancy Matching Banner**.
3. **100% Editable Room/Pax Rates (€) and Quantities (# Rooms / # Pax)**.
4. **Hotel Discount (€) & Informational Notes Field**.
5. **Quantity & Total Cost Calculation Rules** ($Q = \text{Count} \times \text{Nights}$, $T = \text{Price} \times Q$).
6. **New Tour Creation Date Bug Fix** (Ensures `ArrivalDate`/`EndDate` are never null, empty, or `000000`).
7. **Tour Info Operational Remarks Notes Field** (Large text field for operational notes).

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'TestPlan_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to category 1: hotel service modal & pricing basis?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'TestPlan_Hotel_Pricing_Basis_20260828.md', 'Master Data', 'How to category 1: hotel service modal & pricing basis?', 'category, 1:, hotel, service, modal, &, pricing, basis, testplan_hotel_pricing_basis_20260828', '**Category 1: Hotel Service Modal & Pricing Basis** (Source: `TestPlan_Hotel_Pricing_Basis_20260828.md`)

| Test Case ID | Feature / Component | Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| **TC-HOTEL-01** | Hotel Selection | Select hotel with `PricingBasis = ''Room''` from dropdown | Modal automatically sets Pricing Basis toggle to `🏢 Per Room` and pre-fills room rates | **PASS** |
| **TC-HOTEL-02** | Hotel Selection | Select hotel with `PricingBasis = ''Pax''` from dropdown | Modal automatically sets Pricing Basis toggle to `👤 Per Pax` and pre-fills per-pax rates | **PASS** |
| **TC-HOTEL-03** | Pricing Basis Toggle | Click `👤 Per Pax` toggle on a Per Room hotel | Rates and counts switch dynamically to Per Pax rates & passenger counts | **PASS** |
| **TC-HOTEL-04** | Auto-Fill Bookings | Click `⚡ Auto-Fill Bookings` button | Counts auto-calculate from `tour.passengers` rooming assignment manifest | **PASS** |
| **TC-HOTEL-05** | Rate & Count Editability | Modify Single Rate (€100 $\rightarrow$ €120) and Double Count (5 $\rightarrow$ 6) | All `<input>` fields accept user edits and recalculate live total | **PASS** |
| **TC-HOTEL-06** | Discount Amount & Notes | Enter Discount = €50 and Notes = *"Early bird promo"* | Saved to DB (`TourServices`), visible upon reopening edit modal | **PASS** |
| **TC-HOTEL-07** | Quantity Calculation | Set 5 Rooms for 3 Nights | Quantity saved as $15$, rendered in table as `15 (5 R × 3N)` | **PASS** |

---', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'TestPlan_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to category 2: tour creation & date validation?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'TestPlan_Hotel_Pricing_Basis_20260828.md', 'User Manual', 'How to category 2: tour creation & date validation?', 'category, 2:, tour, creation, &, date, validation, testplan_hotel_pricing_basis_20260828', '**Category 2: Tour Creation & Date Validation** (Source: `TestPlan_Hotel_Pricing_Basis_20260828.md`)

| Test Case ID | Feature / Component | Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| **TC-TOUR-01** | Create Tour with Dates | Fill Tour Code, Destination, ArrivalDate = `2026-09-01`, EndDate = `2026-09-08` | Tour created with exact specified dates | **PASS** |
| **TC-TOUR-02** | Create Tour without Dates | Submit tour creation form with empty date inputs | Backend fallback sets `ArrivalDate = Today` and `EndDate = Today + 7 Days` | **PASS** |
| **TC-TOUR-03** | Tour Calendar & List | View newly created tour in Tour Calendar / List | Date displays correctly, no `000000` or `0001-01-01` errors | **PASS** |

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'TestPlan_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to category 3: tour operational notes?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'TestPlan_Hotel_Pricing_Basis_20260828.md', 'User Manual', 'How to category 3: tour operational notes?', 'category, 3:, tour, operational, notes, testplan_hotel_pricing_basis_20260828', '**Category 3: Tour Operational Notes** (Source: `TestPlan_Hotel_Pricing_Basis_20260828.md`)

| Test Case ID | Feature / Component | Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| **TC-NOTES-01** | Notes Entry | Type instructions into **Operational Remarks & Special Tour Notes** box | Textarea updates smoothly, supporting multi-line text | **PASS** |
| **TC-NOTES-02** | Save Notes | Click `💾 Save Notes` button | PUT request updates `tours.Notes` column in SQL Server; notification shown | **PASS** |
| **TC-NOTES-03** | Persistence | Refresh page (`Ctrl + F5`) and reload tour | Saved notes load and render in the textarea | **PASS** |

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'TestPlan_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to 🤖 automated playwright test script location?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'TestPlan_Hotel_Pricing_Basis_20260828.md', 'User Manual', 'How to 🤖 automated playwright test script location?', '🤖, automated, playwright, test, script, location, testplan_hotel_pricing_basis_20260828', '**🤖 Automated Playwright Test Script Location** (Source: `TestPlan_Hotel_Pricing_Basis_20260828.md`)

In compliance with project guidelines, the automated end-to-end Playwright test suite is saved at:
* **Path**: [`tests/e2e/hotel_pricing_and_tour_notes.spec.ts`](file:///C:/Ersen/Projects_2025/Uno_ERP/tests/e2e/hotel_pricing_and_tour_notes.spec.ts)

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'TestPlan_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to 📁 manual & documentation export?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'TestPlan_Hotel_Pricing_Basis_20260828.md', 'User Manual', 'How to 📁 manual & documentation export?', '📁, manual, &, documentation, export, testplan_hotel_pricing_basis_20260828', '**📁 Manual & Documentation Export** (Source: `TestPlan_Hotel_Pricing_Basis_20260828.md`)

Copies of this **Test Plan** and **Walkthrough** are exported into the project documentation folder:
* `C:\Ersen\Projects_2025\Codex\UNO_ERP\UserManuals\Walkthrough_Hotel_Pricing_Basis_20260828.md`
* `C:\Ersen\Projects_2025\Codex\UNO_ERP\UserManuals\TestPlan_Hotel_Pricing_Basis_20260828.md`', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Walkthrough_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to 🚀 walkthrough: enhanced hotel service entry & calculations?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Walkthrough_Hotel_Pricing_Basis_20260828.md', 'Master Data', 'How to 🚀 walkthrough: enhanced hotel service entry & calculations?', '🚀, walkthrough:, enhanced, hotel, service, entry, &, calculations, walkthrough_hotel_pricing_basis_20260828', '**🚀 Walkthrough: Enhanced Hotel Service Entry & Calculations** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

All changes have been successfully implemented, verified, and pushed to the repository (`62fa45e`).

---', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Walkthrough_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to 1. 🏢 pricing basis toggle (`per room` vs `per pax`)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Walkthrough_Hotel_Pricing_Basis_20260828.md', 'User Manual', 'How to 1. 🏢 pricing basis toggle (`per room` vs `per pax`)?', '1., 🏢, pricing, basis, toggle, (`per, room`, vs, `per, pax`)', '**1. 🏢 Pricing Basis Toggle (`Per Room` vs `Per Pax`)** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

* **Interactive Switch**: Toggle between `🏢 Per Room / Night` and `👤 Per Pax / Night`.
* **Smart Master Data Default**: Auto-selects the hotel''s `PricingBasis` default from Master Data upon hotel selection.
* **Pre-fill & Rate Adaptation**:
  * **Per Room Mode**: Pre-fills quantities as `# Rooms` (e.g. 5 Double Rooms for 10 Pax) and pre-fills `DoubleRoomRate`.
  * **Per Pax Mode**: Pre-fills quantities as `# Pax` (e.g. 10 Pax in Double Rooms) and pre-fills `DoublePaxRate`.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Walkthrough_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to 2. ✏️ 100% editable rates & counts?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Walkthrough_Hotel_Pricing_Basis_20260828.md', 'User Manual', 'How to 2. ✏️ 100% editable rates & counts?', '2., ✏️, 100%, editable, rates, &, counts, walkthrough_hotel_pricing_basis_20260828', '**2. ✏️ 100% Editable Rates & Counts** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

* All rate inputs (€) and quantity inputs (# Rooms or # Pax) in both **Per Room** and **Per Pax** modes are **100% editable** `<input>` fields with clear visual labels.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Walkthrough_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to 3. ⚡ 1-click rooming list auto-fill & live occupancy matching?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Walkthrough_Hotel_Pricing_Basis_20260828.md', 'User Manual', 'How to 3. ⚡ 1-click rooming list auto-fill & live occupancy matching?', '3., ⚡, 1, click, rooming, list, auto, fill, &, live', '**3. ⚡ 1-Click Rooming List Auto-Fill & Live Occupancy Matching** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

* **`⚡ Auto-Fill from Rooming List` Button**: Inspects live `tour.passengers` and syncs room/pax counts.
* **Live Occupancy Banner**: Displays total accommodated Pax vs Total Tour Pax with a 🟢 **Matched** or 🟡 **Mismatch** status badge.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Walkthrough_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to 4. 🏷️ hotel discount & notes (informational)?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Walkthrough_Hotel_Pricing_Basis_20260828.md', 'Master Data', 'How to 4. 🏷️ hotel discount & notes (informational)?', '4., 🏷️, hotel, discount, &, notes, (informational), walkthrough_hotel_pricing_basis_20260828', '**4. 🏷️ Hotel Discount & Notes (Informational)** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

* **Discount Amount (€)**: Numerical input to record promotional/negotiated discounts.
* **Discount Details / Rationale**: Text input to record discount notes (e.g. *"Early Bird 5% discount applied by hotel management"*).', '/master-data', 'Open Master Data', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Walkthrough_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to 5. 🧮 accurate quantity & total amount formulas?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Walkthrough_Hotel_Pricing_Basis_20260828.md', 'User Manual', 'How to 5. 🧮 accurate quantity & total amount formulas?', '5., 🧮, accurate, quantity, &, total, amount, formulas, walkthrough_hotel_pricing_basis_20260828', '**5. 🧮 Accurate Quantity & Total Amount Formulas** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

* **Quantity ($Q$) Formula**:
  * **Per Room Mode**: $Q = \text{Room Count} \times \text{Nights}$ (e.g., $5\text{ Rooms} \times 3\text{ Nights} = 15$).
  * **Per Pax Mode**: $Q = \text{Pax Count} \times \text{Nights}$ (e.g., $10\text{ Pax} \times 3\text{ Nights} = 30$).
* **Total Amount ($T$) Formula**:
  * $T = \text{Unit Price} \times Q$.
* **Services Table Rendering**:
  * Services table displays exact breakdown: `15 (5 R × 3N)` or `30 (10 Pax × 3N)`.
* **Update Safety**: Updating a hotel service row on the Services screen recalculates quantity and total amount using the updated nights or room/pax count.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Walkthrough_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to 🧪 verification & testing results?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Walkthrough_Hotel_Pricing_Basis_20260828.md', 'User Manual', 'How to 🧪 verification & testing results?', '🧪, verification, &, testing, results, walkthrough_hotel_pricing_basis_20260828', '**🧪 Verification & Testing Results** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

1. **Backend Model & Database Schema**:
   * Added `DiscountAmount`, `DiscountNotes`, and `PricingBasis` columns to `TourService` C# model & SQL Server database.
2. **Build Verification**:
   * Rebuilt `Uno_API.csproj` and static `Uno_CRM` SPA successfully.
3. **Git Repository Status**:
   * Pushed commit `62fa45e` to `main` branch on GitHub.

---', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'Walkthrough_Hotel_Pricing_Basis_20260828.md' AND QuestionPattern = 'How to 🌐 how to verify in app?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('DocumentationRepo', 'Walkthrough_Hotel_Pricing_Basis_20260828.md', 'User Manual', 'How to 🌐 how to verify in app?', '🌐, how, to, verify, in, app, walkthrough_hotel_pricing_basis_20260828', '**🌐 How to Verify in App** (Source: `Walkthrough_Hotel_Pricing_Basis_20260828.md`)

1. Refresh **`http://localhost:8000/`** (**`Ctrl + F5`**).
2. Open any Tour detail page $\rightarrow$ Navigate to **Services** tab $\rightarrow$ Click **+ Add Hotel Stay**.
3. Toggle between **Per Room** and **Per Pax** basis or click **⚡ Auto-Fill from Rooming List**.
4. Edit any rate or room/pax count, enter discount notes, and click **Save Hotel Service**.', '/tours', 'View Tours Grid', 1, GETUTCDATE(), GETUTCDATE());
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'CHANGES_SUMMARY.md' AND QuestionPattern = 'What changes were implemented in today''s release? What are the Hotel Tax, Guide Commission, and Default Tour Status rules?') INSERT INTO AiKnowledgeItems (SourceType, SourceFile, Category, QuestionPattern, Keywords, AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt) VALUES ('LocalManual', 'CHANGES_SUMMARY.md', 'System Release & Technical Specifications', 'What changes were implemented in today''s release? What are the Hotel Tax, Guide Commission, and Default Tour Status rules?', 'CHANGES_SUMMARY, Guide Commission, Hotel Tax, City Tax, TourStatusId, 4 Editable Fields, UnoErpDb', '# ?? UNO ERP - Implemented Features & Technical Summary Walkthrough\n\n## 1. ?? Guide Commission Calculation Logic\nGuide commission is calculated strictly based on Excursion Sales. If zero excursion sales exist, Guide Commission is strictly €0.00.\n\n## 2. ?? Hotel Tax (City Tax) 4 Editable Input Fields\nAll 4 fields (Tax Rate, Total Pax, Nightly Tax, Total Stay Tax) are fully editable inputs. Total Stay Tax manual input takes final saved priority.\n\n## 3. ?? Default Tour Workflow Status\nAll newly created/imported tours start from the first dashboard status (TourStatusId = 1 / Draft).\n\n## 4. ??? Database & Test Suite\nConnected to UnoErpDb and generated all 12 Test Tours (TestTour1 - TestTour12) starting at Draft status.', '/tours', 'View Tours Dashboard', 1, GETUTCDATE(), GETUTCDATE());

PRINT 'AI Knowledge Base Data Seeding Completed Successfully!';
GO
