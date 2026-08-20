# UNO ERP - End-to-End (E2E) Test Suite

This directory contains automated Playwright test scripts for verifying key business workflows, UI components, and API integration in UNO ERP.

---

## 📁 Test Scripts

| Test File | Description | Features Covered |
| :--- | :--- | :--- |
| [`test_hotel_tax.py`](file:///C:/Ersen/Projects_2025/Uno_ERP/tests/e2e/test_hotel_tax.py) | Verifies Hotel Service creation with City Tax enabled | Modal calculation (`Pax × Rate × Nights`), Operational Services table QTY formatting (`2 N`) |
| [`test_invoice_total_amount.py`](file:///C:/Ersen/Projects_2025/Uno_ERP/tests/e2e/test_invoice_total_amount.py) | Verifies Tour Invoice Total Amount auto-sum calculation | Line item auto-summing, `⚡ Auto-Sum From Line Items` button |
| [`test_tour_calendar_navigation.py`](file:///C:/Ersen/Projects_2025/Uno_ERP/tests/e2e/test_tour_calendar_navigation.py) | Verifies Tour Calendar event links and Back Arrow navigation | `TourCalendarEventDTO` ProjectId, Referrer navigation to Calendar/Project |

---

## 🚀 Running E2E Tests

### Requirements
- Python 3.10+
- `playwright` (`pip install playwright` & `playwright install chromium`)
- UNO ERP API (`http://localhost:8001`) and CRM (`http://localhost:8000`) running locally.

### Execute All Tests
```bash
python -m pytest tests/e2e/
# or run individually:
python tests/e2e/test_hotel_tax.py
python tests/e2e/test_invoice_total_amount.py
python tests/e2e/test_tour_calendar_navigation.py
```

---

## 🤖 Instructions for AI Agents & Copilots
- **Rule Alignment**: In accordance with `.agents/AGENTS.md` (Rule 5), all new UI and API feature implementations MUST include corresponding E2E Playwright test scripts saved inside this directory.
- **Workflow Discovery**: Read these test files to understand page routes, component selectors, modal states, and expected calculation output before refactoring or implementing features.
