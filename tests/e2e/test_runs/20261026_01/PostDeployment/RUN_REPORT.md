# UNO ERP Test Automation Run Report

- **Run ID / Folder**: `20261026_01\PostDeployment`
- **Executed At**: 2026-10-25 20:13:44
- **Duration**: 79.1 seconds
- **Target Application**: [https://uno-dmc.cz](https://uno-dmc.cz)
- **Target API**: [https://uno-dmc.cz/api](https://uno-dmc.cz/api)
- **Overall Status**: 🟢 **ALL TESTS PASSED (100%)**

---

## 1. Executive Summary

| Test Fold | Scope | Passed | Failed | Status |
|:---|:---|:---:|:---:|:---:|
| **Fold 1: API Availability** | All Backend APIs | 23 | 0 | ✅ PASS |
| **Fold 2: Application UI** | Dashboard, Executive KPI, Projects, Tours (Tabs: Info, Cal, Svc, Book, Guide Sales, Inv), Master Data, AI KB, KPIs | 29 | 0 | ✅ PASS |

---

## 2. Fold 1 - Backend API Availability Details

| Status | Method | Endpoint Name | Code | Latency (ms) | Records |
|:---:|:---:|:---|:---:|---:|---:|
| ✅ | `GET` | Projects | `200` | 2850.7 | 4 |
| ✅ | `GET` | Tours | `200` | 261.8 | 38 |
| ✅ | `GET` | Clients | `200` | 431.1 | 137 |
| ✅ | `GET` | Hotels | `200` | 70.1 | 23 |
| ✅ | `GET` | Guides | `200` | 57.5 | 7 |
| ✅ | `GET` | Drivers | `200` | 51.7 | 1 |
| ✅ | `GET` | Transport Companies | `200` | 60.0 | 6 |
| ✅ | `GET` | Vendors | `200` | 52.7 | 12 |
| ✅ | `GET` | Excursions | `200` | 66.0 | 32 |
| ✅ | `GET` | Service Categories | `200` | 53.5 | 22 |
| ✅ | `GET` | Project Statuses | `200` | 41.3 | 6 |
| ✅ | `GET` | Tour Statuses | `200` | 44.2 | 6 |
| ✅ | `GET` | Tour Status Checkpoints | `200` | 56.3 | 10 |
| ✅ | `GET` | Executive Summary | `200` | 70.9 | -1 |
| ✅ | `GET` | Dashboard Overview | `200` | 93.1 | -1 |
| ✅ | `GET` | Tour Calendar | `200` | 329.4 | 38 |
| ✅ | `GET` | Bookings | `200` | 93.7 | 117 |
| ✅ | `GET` | Invoices | `200` | 75.9 | 2 |
| ✅ | `GET` | Passengers | `200` | 241.6 | 807 |
| ✅ | `GET` | Audit Logs | `200` | 96.9 | 100 |
| ✅ | `GET` | Role Permissions | `200` | 56.5 | 27 |
| ✅ | `GET` | AI Knowledge Base Items | `200` | 731.0 | 495 |
| ✅ | `POST` | AI Chat Query | `200` | 3170.7 | 7 |

---

## 3. Fold 2 - Visual Evidence Screenshots

| # | Screenshot | Workflow / Screen Verification | Status |
|:---:|:---|:---|:---:|
| 1 | [00a_dashboard_overview.png](./00a_dashboard_overview.png) | Dashboard Overview Screen | ✅ Captured |
| 2 | [00b_executive_kpi_cockpit.png](./00b_executive_kpi_cockpit.png) | Executive KPI Cockpit (Target vs Actual) | ✅ Captured |
| 3 | [01_projects_board.png](./01_projects_board.png) | Projects Kanban Board with Status Columns | ✅ Captured |
| 4 | [01a_project_overview.png](./01a_project_overview.png) | Project Overview Screen | ✅ Captured |
| 5 | [01b_project_tours_tab.png](./01b_project_tours_tab.png) | Project Tours Kanban Tab | ✅ Captured |
| 6 | [01c_project_dashboard_tab.png](./01c_project_dashboard_tab.png) | Project Dashboard Tab | ✅ Captured |
| 7 | [01d_project_finance_tab.png](./01d_project_finance_tab.png) | Project Finance Tab | ✅ Captured |
| 8 | [02_tours_board_lanes.png](./02_tours_board_lanes.png) | Tours Board with Multiple Status Lanes | ✅ Captured |
| 9 | [02a_tour_info_tab.png](./02a_tour_info_tab.png) | Tour Info Tab | ✅ Captured |
| 10 | [02b_tour_calendar_tab.png](./02b_tour_calendar_tab.png) | Tour Itinerary Calendar Tab | ✅ Captured |
| 11 | [02c_tour_services_tab.png](./02c_tour_services_tab.png) | Tour Services Tab | ✅ Captured |
| 12 | [02d_tour_bookings_tab.png](./02d_tour_bookings_tab.png) | Tour Bookings Tab | ✅ Captured |
| 13 | [02e_tour_guide_excursion_sales_tab.png](./02e_tour_guide_excursion_sales_tab.png) | Tour Guide Excursion Sales Tab | ✅ Captured |
| 14 | [02f_tour_invoice_tab.png](./02f_tour_invoice_tab.png) | Tour Invoice Tab | ✅ Captured |
| 15 | [03_tour_calendar.png](./03_tour_calendar.png) | Tour Calendar View | ✅ Captured |
| 16 | [03a_calendar_tour_info.png](./03a_calendar_tour_info.png) | Tour Info Reached From Calendar Event | ✅ Captured |
| 17 | [04a_master_project_statuses.png](./04a_master_project_statuses.png) | Project Statuses Table & Search | ✅ Captured |
| 18 | [04b_master_clients.png](./04b_master_clients.png) | Clients Master Data Table & Search | ✅ Captured |
| 19 | [04c_master_excel_import.png](./04c_master_excel_import.png) | Excel Import Dropzones & SOP | ✅ Captured |
| 20 | [04d_master_hotels.png](./04d_master_hotels.png) | Hotels Master Data Table & Search | ✅ Captured |
| 21 | [04e_master_guides.png](./04e_master_guides.png) | Guides Master Data Table & Search | ✅ Captured |
| 22 | [04f_master_transports.png](./04f_master_transports.png) | Transport Master Data Table & Search | ✅ Captured |
| 23 | [04g_master_drivers.png](./04g_master_drivers.png) | Drivers Master Data Table & Search | ✅ Captured |
| 24 | [04h_master_vendors.png](./04h_master_vendors.png) | Vendors Master Data Table & Search | ✅ Captured |
| 25 | [04i_master_excursions.png](./04i_master_excursions.png) | Excursions Master Data Table & Search | ✅ Captured |
| 26 | [04j_master_tour_statuses.png](./04j_master_tour_statuses.png) | Tour Statuses Master Data Table & Search | ✅ Captured |
| 27 | [04k_master_service_categories.png](./04k_master_service_categories.png) | Service Categories Master Data Table & Search | ✅ Captured |
| 28 | [05_ai_knowledge_sops.png](./05_ai_knowledge_sops.png) | AI Knowledge & SOPs with Live Search | ✅ Captured |
| 29 | [06_reports_kpis.png](./06_reports_kpis.png) | Reports & KPIs Cockpit View | ✅ Captured |

---

## 4. Run Artifacts Inventory

- Root Folder: `C:\Ersen\Projects_2025\Uno_ERP\tests\e2e\test_runs\20261026_01\PostDeployment`
- API Results JSON: [`api_results.json`](./api_results.json)
- API Report Markdown: [`api_availability_report.md`](./api_availability_report.md)
- UI Results JSON: [`ui_test_results.json`](./ui_test_results.json)
- UI Report Markdown: [`app_ui_test_report.md`](./app_ui_test_report.md)
- Consolidated Report: [`RUN_REPORT.md`](./RUN_REPORT.md)
