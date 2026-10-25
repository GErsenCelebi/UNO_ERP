# Production API Availability Test Report (Fold 1)

- **Execution Time**: 2026-10-25 18:52:07
- **Base URL**: `https://uno-dmc.cz/api`
- **Summary**: **23/23 Passed** (100%)

| Status | Method | Endpoint | HTTP Code | Latency (ms) | Payload Size | Records | Error |
|:---:|:---:|:---|:---:|---:|---:|---:|:---|
| ✅ PASS | `GET` | `/api/projects` (Projects) | `200` | 160.8 | 1,378 B | 4 | - |
| ✅ PASS | `GET` | `/api/tours` (Tours) | `200` | 125.2 | 73,770 B | 38 | - |
| ✅ PASS | `GET` | `/api/clients` (Clients) | `200` | 36.8 | 20,374 B | 137 | - |
| ✅ PASS | `GET` | `/api/hotels` (Hotels) | `200` | 62.1 | 11,337 B | 23 | - |
| ✅ PASS | `GET` | `/api/guides` (Guides) | `200` | 53.5 | 790 B | 7 | - |
| ✅ PASS | `GET` | `/api/drivers` (Drivers) | `200` | 37.4 | 104 B | 1 | - |
| ✅ PASS | `GET` | `/api/transportcompanies` (Transport Companies) | `200` | 50.8 | 919 B | 6 | - |
| ✅ PASS | `GET` | `/api/vendors` (Vendors) | `200` | 50.6 | 1,770 B | 12 | - |
| ✅ PASS | `GET` | `/api/excursions` (Excursions) | `200` | 43.2 | 6,280 B | 32 | - |
| ✅ PASS | `GET` | `/api/servicecategories` (Service Categories) | `200` | 35.3 | 3,850 B | 22 | - |
| ✅ PASS | `GET` | `/api/projectstatuses` (Project Statuses) | `200` | 38.6 | 249 B | 6 | - |
| ✅ PASS | `GET` | `/api/tourstatuses` (Tour Statuses) | `200` | 35.1 | 256 B | 6 | - |
| ✅ PASS | `GET` | `/api/tourstatuscheckpoints` (Tour Status Checkpoints) | `200` | 41.2 | 2,780 B | 10 | - |
| ✅ PASS | `GET` | `/api/dashboard/executive-summary` (Executive Summary) | `200` | 35.2 | 15,526 B | -1 | - |
| ✅ PASS | `GET` | `/api/dashboard/overview` (Dashboard Overview) | `200` | 45.3 | 15,526 B | -1 | - |
| ✅ PASS | `GET` | `/api/tourcalendar` (Tour Calendar) | `200` | 424.6 | 14,263 B | 38 | - |
| ✅ PASS | `GET` | `/api/bookings` (Bookings) | `200` | 46.3 | 18,668 B | 117 | - |
| ✅ PASS | `GET` | `/api/invoices` (Invoices) | `200` | 37.6 | 4,212 B | 2 | - |
| ✅ PASS | `GET` | `/api/passengers` (Passengers) | `200` | 235.1 | 232,618 B | 807 | - |
| ✅ PASS | `GET` | `/api/auditlogs` (Audit Logs) | `200` | 43.5 | 2,501 B | 8 | - |
| ✅ PASS | `GET` | `/api/rolepermissions` (Role Permissions) | `200` | 44.4 | 3,435 B | 27 | - |
| ✅ PASS | `GET` | `/api/aiknowledgeitems` (AI Knowledge Base Items) | `200` | 264.5 | 241,430 B | 222 | - |
| ✅ PASS | `POST` | `/api/ai/chat` (AI Chat Query) | `200` | 83.2 | 818 B | 4 | - |
