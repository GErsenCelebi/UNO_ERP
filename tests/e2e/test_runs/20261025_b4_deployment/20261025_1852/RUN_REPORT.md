# UNO ERP Production Test Automation Run Report

- **Run ID / Timestamp**: `20261025_1852`
- **Executed At**: 2026-10-25 18:53:05
- **Duration**: 59.9 seconds
- **Target Application**: [https://uno-dmc.cz](https://uno-dmc.cz)
- **Target API**: [https://uno-dmc.cz/api](https://uno-dmc.cz/api)
- **Overall Status**: 🟢 **ALL TESTS PASSED (100%)**

---

## 1. Executive Summary

| Test Fold | Scope | Passed | Failed | Status |
|:---|:---|:---:|:---:|:---:|
| **Fold 1: API Availability** | All Backend APIs | 23 | 0 | ✅ PASS |
| **Fold 2: Application UI** | Projects, Tours, Calendar, Master Data, AI KB, KPIs | 25 | 0 | ✅ PASS |

---

## 2. Fold 1 - Backend API Availability Details

| Status | Method | Endpoint Name | Code | Latency (ms) | Records |
|:---:|:---:|:---|:---:|---:|---:|
| ✅ | `GET` | Projects | `200` | 160.8 | 4 |
| ✅ | `GET` | Tours | `200` | 125.2 | 38 |
| ✅ | `GET` | Clients | `200` | 36.8 | 137 |
| ✅ | `GET` | Hotels | `200` | 62.1 | 23 |
| ✅ | `GET` | Guides | `200` | 53.5 | 7 |
| ✅ | `GET` | Drivers | `200` | 37.4 | 1 |
| ✅ | `GET` | Transport Companies | `200` | 50.8 | 6 |
| ✅ | `GET` | Vendors | `200` | 50.6 | 12 |
| ✅ | `GET` | Excursions | `200` | 43.2 | 32 |
| ✅ | `GET` | Service Categories | `200` | 35.3 | 22 |
| ✅ | `GET` | Project Statuses | `200` | 38.6 | 6 |
| ✅ | `GET` | Tour Statuses | `200` | 35.1 | 6 |
| ✅ | `GET` | Tour Status Checkpoints | `200` | 41.2 | 10 |
| ✅ | `GET` | Executive Summary | `200` | 35.2 | -1 |
| ✅ | `GET` | Dashboard Overview | `200` | 45.3 | -1 |
| ✅ | `GET` | Tour Calendar | `200` | 424.6 | 38 |
| ✅ | `GET` | Bookings | `200` | 46.3 | 117 |
| ✅ | `GET` | Invoices | `200` | 37.6 | 2 |
| ✅ | `GET` | Passengers | `200` | 235.1 | 807 |
| ✅ | `GET` | Audit Logs | `200` | 43.5 | 8 |
| ✅ | `GET` | Role Permissions | `200` | 44.4 | 27 |
| ✅ | `GET` | AI Knowledge Base Items | `200` | 264.5 | 222 |
| ✅ | `POST` | AI Chat Query | `200` | 83.2 | 4 |

---

## 3. Fold 2 - Visual Evidence Screenshots

| # | Screenshot | Workflow / Screen Verification | Status |
|:---:|:---|:---|:---:|
| 1 | [01_projects_board.png](./01_projects_board.png) | Projects Kanban Board with Status Columns | ✅ Captured |
| 2 | [01a_project_overview.png](./01a_project_overview.png) | Project Overview Screen | ✅ Captured |
| 3 | [01b_project_tours_tab.png](./01b_project_tours_tab.png) | Project Tours Kanban Tab | ✅ Captured |
| 4 | [01c_project_dashboard_tab.png](./01c_project_dashboard_tab.png) | Project Dashboard Tab | ✅ Captured |
| 5 | [01d_project_finance_tab.png](./01d_project_finance_tab.png) | Project Finance Tab | ✅ Captured |
| 6 | [02_tours_board_lanes.png](./02_tours_board_lanes.png) | Tours Board with Multiple Status Lanes | ✅ Captured |
| 7 | [02a_tour_info_tab.png](./02a_tour_info_tab.png) | Tour Info Tab | ✅ Captured |
| 8 | [02b_tour_services_tab.png](./02b_tour_services_tab.png) | Tour Services Tab | ✅ Captured |
| 9 | [02c_tour_bookings_tab.png](./02c_tour_bookings_tab.png) | Tour Bookings Tab | ✅ Captured |
| 10 | [02d_tour_invoice_tab.png](./02d_tour_invoice_tab.png) | Tour Invoice Tab | ✅ Captured |
| 11 | [03_tour_calendar.png](./03_tour_calendar.png) | Tour Calendar View | ✅ Captured |
| 12 | [03a_calendar_tour_info.png](./03a_calendar_tour_info.png) | Tour Info Reached From Calendar Event | ✅ Captured |
| 13 | [04a_master_project_statuses.png](./04a_master_project_statuses.png) | Project Statuses Table & Search | ✅ Captured |
| 14 | [04b_master_clients.png](./04b_master_clients.png) | Clients Master Data Table & Search | ✅ Captured |
| 15 | [04c_master_excel_import.png](./04c_master_excel_import.png) | Excel Import Dropzones & SOP | ✅ Captured |
| 16 | [04d_master_hotels.png](./04d_master_hotels.png) | Hotels Master Data Table & Search | ✅ Captured |
| 17 | [04e_master_guides.png](./04e_master_guides.png) | Guides Master Data Table & Search | ✅ Captured |
| 18 | [04f_master_transports.png](./04f_master_transports.png) | Transport Master Data Table & Search | ✅ Captured |
| 19 | [04g_master_drivers.png](./04g_master_drivers.png) | Drivers Master Data Table & Search | ✅ Captured |
| 20 | [04h_master_vendors.png](./04h_master_vendors.png) | Vendors Master Data Table & Search | ✅ Captured |
| 21 | [04i_master_excursions.png](./04i_master_excursions.png) | Excursions Master Data Table & Search | ✅ Captured |
| 22 | [04j_master_tour_statuses.png](./04j_master_tour_statuses.png) | Tour Statuses Master Data Table & Search | ✅ Captured |
| 23 | [04k_master_service_categories.png](./04k_master_service_categories.png) | Service Categories Master Data Table & Search | ✅ Captured |
| 24 | [05_ai_knowledge_sops.png](./05_ai_knowledge_sops.png) | AI Knowledge & SOPs with Live Search | ✅ Captured |
| 25 | [06_reports_kpis.png](./06_reports_kpis.png) | Reports & KPIs Cockpit View | ✅ Captured |

---

## 4. Run Artifacts Inventory

- Root Folder: `C:\Ersen\Projects_2025\Uno_ERP\tests\e2e\test_runs\20261025_1852`
- API Results JSON: [`api_results.json`](./api_results.json)
- API Report Markdown: [`api_availability_report.md`](./api_availability_report.md)
- UI Results JSON: [`ui_test_results.json`](./ui_test_results.json)
- UI Report Markdown: [`app_ui_test_report.md`](./app_ui_test_report.md)
- Consolidated Report: [`RUN_REPORT.md`](./RUN_REPORT.md)
