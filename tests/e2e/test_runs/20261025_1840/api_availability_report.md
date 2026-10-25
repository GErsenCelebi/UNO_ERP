# Production API Availability Test Report (Fold 1)

- **Execution Time**: 2026-10-25 18:40:36
- **Base URL**: `https://uno-dmc.cz/api`
- **Summary**: **23/23 Passed** (100%)

| Status | Method | Endpoint | HTTP Code | Latency (ms) | Payload Size | Records | Error |
|:---:|:---:|:---|:---:|---:|---:|---:|:---|
| ✅ PASS | `GET` | `/api/projects` (Projects) | `200` | 376.2 | 1,378 B | 4 | - |
| ✅ PASS | `GET` | `/api/tours` (Tours) | `200` | 175.5 | 73,770 B | 38 | - |
| ✅ PASS | `GET` | `/api/clients` (Clients) | `200` | 44.1 | 20,374 B | 137 | - |
| ✅ PASS | `GET` | `/api/hotels` (Hotels) | `200` | 36.3 | 11,337 B | 23 | - |
| ✅ PASS | `GET` | `/api/guides` (Guides) | `200` | 37.8 | 790 B | 7 | - |
| ✅ PASS | `GET` | `/api/drivers` (Drivers) | `200` | 43.8 | 104 B | 1 | - |
| ✅ PASS | `GET` | `/api/transportcompanies` (Transport Companies) | `200` | 35.4 | 919 B | 6 | - |
| ✅ PASS | `GET` | `/api/vendors` (Vendors) | `200` | 46.7 | 1,770 B | 12 | - |
| ✅ PASS | `GET` | `/api/excursions` (Excursions) | `200` | 41.2 | 6,280 B | 32 | - |
| ✅ PASS | `GET` | `/api/servicecategories` (Service Categories) | `200` | 44.6 | 3,850 B | 22 | - |
| ✅ PASS | `GET` | `/api/projectstatuses` (Project Statuses) | `200` | 41.6 | 249 B | 6 | - |
| ✅ PASS | `GET` | `/api/tourstatuses` (Tour Statuses) | `200` | 40.9 | 256 B | 6 | - |
| ✅ PASS | `GET` | `/api/tourstatuscheckpoints` (Tour Status Checkpoints) | `200` | 39.9 | 2,780 B | 10 | - |
| ✅ PASS | `GET` | `/api/dashboard/executive-summary` (Executive Summary) | `200` | 63.0 | 15,526 B | -1 | - |
| ✅ PASS | `GET` | `/api/dashboard/overview` (Dashboard Overview) | `200` | 35.6 | 15,526 B | -1 | - |
| ✅ PASS | `GET` | `/api/tourcalendar` (Tour Calendar) | `200` | 59.0 | 14,263 B | 38 | - |
| ✅ PASS | `GET` | `/api/bookings` (Bookings) | `200` | 36.9 | 18,668 B | 117 | - |
| ✅ PASS | `GET` | `/api/invoices` (Invoices) | `200` | 37.2 | 4,212 B | 2 | - |
| ✅ PASS | `GET` | `/api/passengers` (Passengers) | `200` | 230.9 | 232,618 B | 807 | - |
| ✅ PASS | `GET` | `/api/auditlogs` (Audit Logs) | `200` | 40.7 | 2,501 B | 8 | - |
| ✅ PASS | `GET` | `/api/rolepermissions` (Role Permissions) | `200` | 39.4 | 3,435 B | 27 | - |
| ✅ PASS | `GET` | `/api/aiknowledgeitems` (AI Knowledge Base Items) | `200` | 488.2 | 241,430 B | 222 | - |
| ✅ PASS | `POST` | `/api/ai/chat` (AI Chat Query) | `200` | 49.1 | 818 B | 4 | - |
