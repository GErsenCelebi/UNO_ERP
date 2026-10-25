# API Availability Test Report

- **Execution Time**: 2026-10-25 19:30:55
- **Base API URL**: `https://uno-dmc.cz/api`
- **Summary**: **23/23 Passed** (100%)

| Status | Method | Endpoint | HTTP Code | Latency (ms) | Payload Size | Records | Error |
|:---:|:---:|:---|:---:|---:|---:|---:|:---|
| ✅ PASS | `GET` | `/projects` (Projects) | `200` | 312.8 | 1,378 B | 4 | - |
| ✅ PASS | `GET` | `/tours` (Tours) | `200` | 188.8 | 73,770 B | 38 | - |
| ✅ PASS | `GET` | `/clients` (Clients) | `200` | 320.7 | 20,374 B | 137 | - |
| ✅ PASS | `GET` | `/hotels` (Hotels) | `200` | 45.7 | 11,337 B | 23 | - |
| ✅ PASS | `GET` | `/guides` (Guides) | `200` | 40.2 | 790 B | 7 | - |
| ✅ PASS | `GET` | `/drivers` (Drivers) | `200` | 37.0 | 104 B | 1 | - |
| ✅ PASS | `GET` | `/transportcompanies` (Transport Companies) | `200` | 41.1 | 919 B | 6 | - |
| ✅ PASS | `GET` | `/vendors` (Vendors) | `200` | 44.3 | 1,770 B | 12 | - |
| ✅ PASS | `GET` | `/excursions` (Excursions) | `200` | 47.1 | 6,280 B | 32 | - |
| ✅ PASS | `GET` | `/servicecategories` (Service Categories) | `200` | 43.4 | 3,850 B | 22 | - |
| ✅ PASS | `GET` | `/projectstatuses` (Project Statuses) | `200` | 71.5 | 249 B | 6 | - |
| ✅ PASS | `GET` | `/tourstatuses` (Tour Statuses) | `200` | 47.0 | 256 B | 6 | - |
| ✅ PASS | `GET` | `/tourstatuscheckpoints` (Tour Status Checkpoints) | `200` | 61.0 | 2,780 B | 10 | - |
| ✅ PASS | `GET` | `/dashboard/executive-summary` (Executive Summary) | `200` | 69.6 | 15,526 B | -1 | - |
| ✅ PASS | `GET` | `/dashboard/overview` (Dashboard Overview) | `200` | 43.3 | 15,526 B | -1 | - |
| ✅ PASS | `GET` | `/tourcalendar` (Tour Calendar) | `200` | 128.0 | 14,263 B | 38 | - |
| ✅ PASS | `GET` | `/bookings` (Bookings) | `200` | 52.2 | 18,668 B | 117 | - |
| ✅ PASS | `GET` | `/invoices` (Invoices) | `200` | 40.5 | 4,212 B | 2 | - |
| ✅ PASS | `GET` | `/passengers` (Passengers) | `200` | 304.5 | 232,618 B | 807 | - |
| ✅ PASS | `GET` | `/auditlogs` (Audit Logs) | `200` | 31.9 | 2,501 B | 8 | - |
| ✅ PASS | `GET` | `/rolepermissions` (Role Permissions) | `200` | 35.7 | 3,435 B | 27 | - |
| ✅ PASS | `GET` | `/aiknowledgeitems` (AI Knowledge Base Items) | `200` | 263.0 | 241,430 B | 222 | - |
| ✅ PASS | `POST` | `/ai/chat` (AI Chat Query) | `200` | 91.7 | 818 B | 4 | - |
