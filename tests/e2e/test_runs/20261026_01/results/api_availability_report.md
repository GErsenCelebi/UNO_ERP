# API Availability Test Report

- **Execution Time**: 2026-10-25 19:11:08
- **Base API URL**: `http://localhost:8001/api`
- **Summary**: **23/23 Passed** (100%)

| Status | Method | Endpoint | HTTP Code | Latency (ms) | Payload Size | Records | Error |
|:---:|:---:|:---|:---:|---:|---:|---:|:---|
| ✅ PASS | `GET` | `/projects` (Projects) | `200` | 14.4 | 1,787 B | 6 | - |
| ✅ PASS | `GET` | `/tours` (Tours) | `200` | 28.8 | 57,639 B | 32 | - |
| ✅ PASS | `GET` | `/clients` (Clients) | `200` | 13.9 | 21,135 B | 142 | - |
| ✅ PASS | `GET` | `/hotels` (Hotels) | `200` | 25.8 | 20,859 B | 45 | - |
| ✅ PASS | `GET` | `/guides` (Guides) | `200` | 21.1 | 3,230 B | 36 | - |
| ✅ PASS | `GET` | `/drivers` (Drivers) | `200` | 14.2 | 104 B | 1 | - |
| ✅ PASS | `GET` | `/transportcompanies` (Transport Companies) | `200` | 12.2 | 307 B | 2 | - |
| ✅ PASS | `GET` | `/vendors` (Vendors) | `200` | 17.7 | 1,401 B | 9 | - |
| ✅ PASS | `GET` | `/excursions` (Excursions) | `200` | 16.8 | 6,760 B | 35 | - |
| ✅ PASS | `GET` | `/servicecategories` (Service Categories) | `200` | 6.2 | 2,234 B | 13 | - |
| ✅ PASS | `GET` | `/projectstatuses` (Project Statuses) | `200` | 6.6 | 249 B | 6 | - |
| ✅ PASS | `GET` | `/tourstatuses` (Tour Statuses) | `200` | 4.4 | 256 B | 6 | - |
| ✅ PASS | `GET` | `/tourstatuscheckpoints` (Tour Status Checkpoints) | `200` | 4.3 | 2,780 B | 10 | - |
| ✅ PASS | `GET` | `/dashboard/executive-summary` (Executive Summary) | `200` | 6.7 | 17,875 B | -1 | - |
| ✅ PASS | `GET` | `/dashboard/overview` (Dashboard Overview) | `200` | 4.9 | 17,875 B | -1 | - |
| ✅ PASS | `GET` | `/tourcalendar` (Tour Calendar) | `200` | 150.0 | 25,910 B | 32 | - |
| ✅ PASS | `GET` | `/bookings` (Bookings) | `200` | 16.5 | 65,846 B | 398 | - |
| ✅ PASS | `GET` | `/invoices` (Invoices) | `200` | 7.1 | 2,425 B | 1 | - |
| ✅ PASS | `GET` | `/passengers` (Passengers) | `200` | 18.4 | 289,567 B | 966 | - |
| ✅ PASS | `GET` | `/auditlogs` (Audit Logs) | `200` | 9.8 | 38,523 B | 100 | - |
| ✅ PASS | `GET` | `/rolepermissions` (Role Permissions) | `200` | 7.0 | 3,435 B | 27 | - |
| ✅ PASS | `GET` | `/aiknowledgeitems` (AI Knowledge Base Items) | `200` | 72.4 | 627,597 B | 495 | - |
| ✅ PASS | `POST` | `/ai/chat` (AI Chat Query) | `200` | 3044.0 | 2,326 B | 7 | - |
