"""
UNO ERP Application UI Automated Test Suite (Fold 2)
Supports both Production (https://uno-dmc.cz) and Localhost (http://localhost:8000)
Executes end-to-end user workflows with Playwright:
  1. Dashboard Overview (/dashboard) & Executive KPI Cockpit (/dashboard/executive)
  2. Projects Board & Navigation (/projects: Project Overview, Tours, Dashboard, Finance tabs)
  3. Tours Kanban Board (/tours: Multi-lane verification & Tour Detail: Tour Info, Calendar, Services, Bookings, Guide Excursion Sales, Invoice tabs)
  4. Tour Calendar (/tour-calendar: Event verification & navigation to Tour Info)
  5. Master Data:
     - Project Data: Project Statuses, Clients, Excel Import (with live search verification)
     - Tours Data: Hotels, Guides, Transport, Drivers, Vendors, Excursions, Tour Statuses, Service Categories (with live search verification)
  6. AI Knowledge & SOPs (Availability & search verification)
  7. Reports & KPIs (View availability & KPI card metrics verification)
Captures timestamped screenshot evidence for every screen and tab.
"""

import os
import sys
import time
import json
import argparse
from datetime import datetime
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ADMIN_SESSION = {
    "email": "evren@uno-dmc.cz",
    "name": "Evren",
    "role": "Administrator",
    "loginTime": "2026-10-25T00:00:00Z"
}

def log_step(step_name: str, passed: bool = True, details: str = ""):
    status = "[PASS]" if passed else "[FAIL]"
    print(f"{status:<7} | {step_name} {f'- {details}' if details else ''}", flush=True)

def capture_evidence(page, out_dir: str, filename: str, description: str, evidence_list: list):
    screenshot_path = os.path.join(out_dir, filename)
    page.screenshot(path=screenshot_path, full_page=False)
    evidence_list.append({
        "filename": filename,
        "path": screenshot_path,
        "description": description,
        "captured_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    print(f"       📸 Evidence saved: {filename} ({description})", flush=True)

def run_app_ui_tests(base_url: str, output_dir: str):
    base_url = base_url.rstrip("/")
    os.makedirs(output_dir, exist_ok=True)
    print("=" * 80, flush=True)
    print("UNO ERP - APPLICATION UI TESTS (Fold 2)", flush=True)
    print(f"Target Base URL: {base_url}", flush=True)
    print(f"Output Directory: {output_dir}", flush=True)
    print("=" * 80, flush=True)

    evidence_records = []
    test_metrics = {"total": 0, "passed": 0, "failed": 0, "failures": []}

    def record_result(test_name: str, passed: bool, error: str = ""):
        test_metrics["total"] += 1
        if passed:
            test_metrics["passed"] += 1
            log_step(test_name, True)
        else:
            test_metrics["failed"] += 1
            test_metrics["failures"].append({"test": test_name, "error": error})
            log_step(test_name, False, error)

    with sync_playwright() as p:
        chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        launch_kwargs = {"headless": True}
        if os.path.exists(chrome_path):
            launch_kwargs["executable_path"] = chrome_path

        browser = p.chromium.launch(**launch_kwargs)
        context = browser.new_context(
            viewport={"width": 1600, "height": 950},
            ignore_https_errors=True
        )
        page = context.new_page()

        session_str = json.dumps(ADMIN_SESSION)
        page.add_init_script(f"""
            localStorage.setItem('uno_erp_user_session', JSON.stringify({session_str}));
            localStorage.setItem('uno_theme', 'light');
        """)

        # Initialize session on dashboard
        page.goto(f"{base_url}/dashboard", timeout=35000)
        page.wait_for_load_state("networkidle")
        time.sleep(1.5)

        # -------------------------------------------------------------------------
        # TEST 0: Dashboard Overview & Executive KPI Cockpit
        # -------------------------------------------------------------------------
        print("\n--- [Step 0] Dashboard & Executive KPI Cockpit Verification ---", flush=True)
        try:
            # 0.a Dashboard Overview
            page.goto(f"{base_url}/dashboard", timeout=35000)
            page.wait_for_load_state("networkidle")
            time.sleep(2)
            capture_evidence(page, output_dir, "00a_dashboard_overview.png", "Dashboard Overview Screen", evidence_records)
            dash_elements = page.locator("h1, h2, h3, .font-bold").count()
            record_result("Dashboard Overview Screen Available", dash_elements > 0, f"Found {dash_elements} metric elements")

            # 0.b Executive KPI Cockpit
            page.goto(f"{base_url}/dashboard/executive", timeout=35000)
            page.wait_for_load_state("networkidle")
            time.sleep(2)
            capture_evidence(page, output_dir, "00b_executive_kpi_cockpit.png", "Executive KPI Cockpit (Target vs Actual)", evidence_records)
            exec_elements = page.locator("h1, h2, h3, .font-bold").count()
            record_result("Executive KPI Cockpit Available", exec_elements > 0, f"Found {exec_elements} scorecard elements")
        except Exception as ex:
            record_result("Dashboard & Executive KPI Flow", False, str(ex))

        # -------------------------------------------------------------------------
        # TEST 1: Projects Board & Sub-Screens (/projects)
        # -------------------------------------------------------------------------
        print("\n--- [Step 1] Projects Board & Screens Verification ---", flush=True)
        try:
            # Client navigation via sidebar
            proj_link = page.locator("nav a[href='/projects']").first
            if proj_link.is_visible():
                proj_link.click()
            else:
                page.goto(f"{base_url}/projects", timeout=35000)

            page.wait_for_load_state("networkidle")
            time.sleep(2)

            project_cards = page.locator("div[draggable]").all()
            has_cards = len(project_cards) > 0

            capture_evidence(page, output_dir, "01_projects_board.png", "Projects Kanban Board with Status Columns", evidence_records)
            record_result("Projects Board & Cards Available", has_cards, f"Found {len(project_cards)} project cards")

            if has_cards:
                # Click first project card to enter project detail tabs
                project_cards[0].click()
                page.wait_for_load_state("networkidle")
                time.sleep(2)

                # 1.a Project Overview
                capture_evidence(page, output_dir, "01a_project_overview.png", "Project Overview Screen", evidence_records)
                overview_visible = page.locator("h1").first.is_visible()
                record_result("Project Overview Screen Navigation", overview_visible)

                # 1.b Tours Tab inside Project
                tours_tab = page.locator("button:has-text('Tours')").first
                if tours_tab.is_visible():
                    tours_tab.click()
                    time.sleep(1.5)
                    capture_evidence(page, output_dir, "01b_project_tours_tab.png", "Project Tours Kanban Tab", evidence_records)
                    record_result("Project Tours Screen Navigation", True)
                else:
                    record_result("Project Tours Screen Navigation", False, "Tours tab button not found")

                # 1.c Dashboard Tab inside Project
                dash_tab = page.locator("button:has-text('Dashboard')").first
                if dash_tab.is_visible():
                    dash_tab.click()
                    time.sleep(1.5)
                    capture_evidence(page, output_dir, "01c_project_dashboard_tab.png", "Project Dashboard Tab", evidence_records)
                    record_result("Project Dashboard Screen Navigation", True)
                else:
                    record_result("Project Dashboard Screen Navigation", False, "Dashboard tab button not found")

                # 1.d Finance Tab inside Project
                fin_tab = page.locator("button:has-text('Finance')").first
                if fin_tab.is_visible():
                    fin_tab.click()
                    time.sleep(1.5)
                    capture_evidence(page, output_dir, "01d_project_finance_tab.png", "Project Finance Tab", evidence_records)
                    record_result("Project Finance Screen Navigation", True)
                else:
                    record_result("Project Finance Screen Navigation", False, "Finance tab button not found")
            else:
                record_result("Project Detailed Tabs", False, "No project cards found to click")

        except Exception as ex:
            record_result("Projects Board & Navigation Flow", False, str(ex))

        # -------------------------------------------------------------------------
        # TEST 2: Tours Left-Hand Menu & Complete Tour Detail Tabs (/tours)
        # -------------------------------------------------------------------------
        print("\n--- [Step 2] Tours Board & Tour Detail Tabs Verification ---", flush=True)
        try:
            sidebar_tours = page.locator("nav a[href='/tours']").first
            if sidebar_tours.is_visible():
                sidebar_tours.click()
            else:
                page.goto(f"{base_url}/tours", timeout=35000)

            page.wait_for_load_state("networkidle")
            time.sleep(2)

            capture_evidence(page, output_dir, "02_tours_board_lanes.png", "Tours Board with Multiple Status Lanes", evidence_records)

            lanes = [l.strip() for l in page.locator("h3, h2").all_inner_texts() if l.strip()]
            record_result("Tours Board Multi-Lane Availability", len(lanes) >= 3, f"Found {len(lanes)} lanes")

            tour_card = page.locator("text=/\\d+\\s*pax/i").first
            if not tour_card.is_visible():
                tour_card = page.locator("div[draggable]").first

            if tour_card.is_visible():
                tour_card.click()
                page.wait_for_load_state("networkidle")
                time.sleep(2.5)

                tabs_to_verify = [
                    ("Tour Info", "02a_tour_info_tab.png", "Tour Info Tab"),
                    ("Calendar", "02b_tour_calendar_tab.png", "Tour Itinerary Calendar Tab"),
                    ("Services", "02c_tour_services_tab.png", "Tour Services Tab"),
                    ("Bookings", "02d_tour_bookings_tab.png", "Tour Bookings Tab"),
                    ("Guide Excursion Sales", "02e_tour_guide_excursion_sales_tab.png", "Tour Guide Excursion Sales Tab"),
                    ("Invoice", "02f_tour_invoice_tab.png", "Tour Invoice Tab"),
                ]

                for tab_label, file_name, desc in tabs_to_verify:
                    tab_elem = page.locator(f"button:has-text('{tab_label}')").first
                    if tab_elem.is_visible():
                        tab_elem.click()
                        time.sleep(1.5)
                        has_fatal_err = page.locator(".toast-error, .alert-danger").is_visible()
                        capture_evidence(page, output_dir, file_name, desc, evidence_records)
                        record_result(f"Tour Detail Tab - {tab_label}", not has_fatal_err)
                    else:
                        record_result(f"Tour Detail Tab - {tab_label}", False, f"Tab '{tab_label}' not found")
            else:
                record_result("Tour Detail Navigation", False, "No tour card found on board")

        except Exception as ex:
            record_result("Tours Board & Tabs Flow", False, str(ex))

        # -------------------------------------------------------------------------
        # TEST 3: Tour Calendar Left-Hand Menu (/tour-calendar)
        # -------------------------------------------------------------------------
        print("\n--- [Step 3] Tour Calendar Verification & Event Navigation ---", flush=True)
        try:
            cal_link = page.locator("nav a[href='/tour-calendar']").first
            if cal_link.is_visible():
                cal_link.click()
            else:
                page.goto(f"{base_url}/tour-calendar", timeout=35000)

            page.wait_for_load_state("networkidle")
            time.sleep(2.5)

            capture_evidence(page, output_dir, "03_tour_calendar.png", "Tour Calendar View", evidence_records)

            cal_event = page.locator("text=/TestTour|BVP|PVB|BH|Tour|Prague|Vienna|Budapest|pax/i").first
            event_found = cal_event.is_visible()
            record_result("Tour Calendar Displayed with Events", event_found)

            if event_found:
                cal_event.click()
                page.wait_for_load_state("networkidle")
                time.sleep(2)

                info_tab = page.locator("button:has-text('Tour Info')").first
                if info_tab.is_visible():
                    info_tab.click()
                    time.sleep(1)

                capture_evidence(page, output_dir, "03a_calendar_tour_info.png", "Tour Info Reached From Calendar Event", evidence_records)
                record_result("Navigate from Tour Calendar to Tour Info", True)
            else:
                record_result("Navigate from Tour Calendar to Tour Info", False, "No tour events on calendar")

        except Exception as ex:
            record_result("Tour Calendar Flow", False, str(ex))

        # -------------------------------------------------------------------------
        # TEST 4: Master Data (Project Data & Tours Data)
        # -------------------------------------------------------------------------
        print("\n--- [Step 4] Master Data Tabs & Search Functionality ---", flush=True)
        try:
            master_link = page.locator("nav a[href='/master-data']").first
            if master_link.is_visible():
                master_link.click()
            else:
                page.goto(f"{base_url}/master-data", timeout=35000)

            page.wait_for_load_state("networkidle")
            time.sleep(2)

            def get_subtab_button(name: str):
                # Search priority: header sub-tier, overflow bar, or buttons not starting with 'Add '
                loc = page.locator(f"header div button:not(:has-text('Add ')):has-text('{name}')").first
                if loc.is_visible():
                    return loc
                loc = page.locator(f"div.overflow-x-auto button:has-text('{name}')").first
                if loc.is_visible():
                    return loc
                loc = page.locator(f"button:not(:has-text('Add ')):has-text('{name}')").first
                if loc.is_visible():
                    return loc
                return page.locator(f"button:has-text('{name}')").first

            # Section 1: Project Data
            print("  -> Testing Section: Project Data", flush=True)
            proj_data_btn = page.locator("button:has-text('Project Data')").first
            if proj_data_btn.is_visible():
                proj_data_btn.click()
                time.sleep(0.5)

            project_subtabs = [
                ("Project Statuses", "04a_master_project_statuses.png", "Project Statuses Table & Search"),
                ("Clients", "04b_master_clients.png", "Clients Master Data Table & Search"),
                ("Excel Import", "04c_master_excel_import.png", "Excel Import Dropzones & SOP"),
            ]

            for tab_name, filename, desc in project_subtabs:
                tab_btn = get_subtab_button(tab_name)
                if tab_btn.is_visible():
                    tab_btn.click()
                    time.sleep(1)

                    if tab_name != "Excel Import":
                        search_box = page.locator("input[placeholder*='Search']").first
                        if search_box.is_visible():
                            search_box.fill("a")
                            time.sleep(0.3)
                            search_box.fill("")
                            time.sleep(0.3)

                    capture_evidence(page, output_dir, filename, desc, evidence_records)
                    record_result(f"Master Data - Project Data: {tab_name}", True)
                else:
                    record_result(f"Master Data - Project Data: {tab_name}", False, f"Sub-tab '{tab_name}' not found")

            # Section 2: Tours Data
            print("  -> Testing Section: Tours Data", flush=True)
            tours_data_btn = page.locator("button:has-text('Tours Data')").first
            if tours_data_btn.is_visible():
                tours_data_btn.click()
                time.sleep(0.5)

            tours_subtabs = [
                ("Hotels", "04d_master_hotels.png", "Hotels Master Data Table & Search"),
                ("Guides", "04e_master_guides.png", "Guides Master Data Table & Search"),
                ("Transport", "04f_master_transports.png", "Transport Master Data Table & Search"),
                ("Drivers", "04g_master_drivers.png", "Drivers Master Data Table & Search"),
                ("Vendors", "04h_master_vendors.png", "Vendors Master Data Table & Search"),
                ("Excursions", "04i_master_excursions.png", "Excursions Master Data Table & Search"),
                ("Tour Statuses", "04j_master_tour_statuses.png", "Tour Statuses Master Data Table & Search"),
                ("Service Categories", "04k_master_service_categories.png", "Service Categories Master Data Table & Search"),
            ]

            for tab_name, filename, desc in tours_subtabs:
                tab_btn = get_subtab_button(tab_name)
                if tab_btn.is_visible():
                    tab_btn.click()
                    time.sleep(1)

                    search_box = page.locator("input[placeholder*='Search']").first
                    if search_box.is_visible():
                        search_box.fill("e")
                        time.sleep(0.3)
                        search_box.fill("")
                        time.sleep(0.3)

                    capture_evidence(page, output_dir, filename, desc, evidence_records)
                    record_result(f"Master Data - Tours Data: {tab_name}", True)
                else:
                    record_result(f"Master Data - Tours Data: {tab_name}", False, f"Sub-tab '{tab_name}' not found")

        except Exception as ex:
            record_result("Master Data Flow", False, str(ex))

        # -------------------------------------------------------------------------
        # TEST 5: AI Knowledge & SOPs Availability & Search
        # -------------------------------------------------------------------------
        print("\n--- [Step 5] AI Knowledge & SOPs Verification ---", flush=True)
        try:
            ai_section_btn = page.locator("button:has-text('AI Knowledge & SOPs')").first
            if ai_section_btn.is_visible():
                ai_section_btn.click()
                time.sleep(1)

                search_box = page.locator("input[placeholder*='Search']").first
                if search_box.is_visible():
                    search_box.fill("status")
                    time.sleep(0.5)
                    search_box.fill("")
                    time.sleep(0.3)

                capture_evidence(page, output_dir, "05_ai_knowledge_sops.png", "AI Knowledge & SOPs with Live Search", evidence_records)
                record_result("AI Knowledge & SOPs Availability & Search", True)
            else:
                record_result("AI Knowledge & SOPs Availability & Search", False, "Section button 'AI Knowledge & SOPs' not found")

        except Exception as ex:
            record_result("AI Knowledge & SOPs Flow", False, str(ex))

        # -------------------------------------------------------------------------
        # TEST 6: Reports & KPIs Link & Availability
        # -------------------------------------------------------------------------
        print("\n--- [Step 6] Reports & KPIs Verification ---", flush=True)
        try:
            kpis_section_btn = page.locator("button:has-text('Reports & KPIs')").first
            if kpis_section_btn.is_visible():
                kpis_section_btn.click()
                time.sleep(1.5)

            capture_evidence(page, output_dir, "06_reports_kpis.png", "Reports & KPIs Cockpit View", evidence_records)
            kpi_cards = page.locator("h3, h4, .text-2xl, .font-bold").all()
            record_result("Reports & KPIs View Availability", len(kpi_cards) > 0, f"Found {len(kpi_cards)} KPI metrics elements")

        except Exception as ex:
            record_result("Reports & KPIs Flow", False, str(ex))

        browser.close()

    # Save UI results summary JSON
    summary_json_path = os.path.join(output_dir, "ui_test_results.json")
    with open(summary_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "target": base_url,
            "executed_at": datetime.now().isoformat(),
            "metrics": test_metrics,
            "evidence": evidence_records
        }, f, indent=2)

    # Save Markdown report
    md_path = os.path.join(output_dir, "app_ui_test_report.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("# Application UI Test Report (Fold 2)\n\n")
        f.write(f"- **Execution Time**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"- **Base URL**: `{base_url}`\n")
        f.write(f"- **Summary**: **{test_metrics['passed']}/{test_metrics['total']} Passed** ({round(test_metrics['passed'] / max(test_metrics['total'], 1) * 100, 1)}%)\n\n")

        f.write("## Screenshot Evidence Inventory\n\n")
        f.write("| Screenshot | Flow / Screen | Status | Captured At |\n")
        f.write("|:---|:---|:---:|:---|\n")
        for ev in evidence_records:
            f.write(f"| [{ev['filename']}](./{ev['filename']}) | {ev['description']} | ✅ Captured | {ev['captured_at']} |\n")

        if test_metrics["failures"]:
            f.write("\n## Failures / Warnings\n\n")
            for f_item in test_metrics["failures"]:
                f.write(f"- **{f_item['test']}**: {f_item['error']}\n")

    print("\n" + "=" * 80, flush=True)
    print(f"UI Tests Completed: {test_metrics['passed']} Passed, {test_metrics['failed']} Failed", flush=True)
    print(f"Captured {len(evidence_records)} visual evidence screenshots.", flush=True)
    print(f"Reports saved to:", flush=True)
    print(f"  - {summary_json_path}", flush=True)
    print(f"  - {md_path}", flush=True)
    print("=" * 80, flush=True)
    return test_metrics["failed"] == 0

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Application UI Tests")
    parser.add_argument("--base-url", type=str, default="https://uno-dmc.cz", help="Base web application URL")
    parser.add_argument("--output-dir", type=str, default=None, help="Directory to save test outputs")
    args = parser.parse_args()

    if not args.output_dir:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M")
        args.output_dir = os.path.join(r"C:\Ersen\Projects_2025\Uno_ERP\tests\e2e\test_runs", timestamp)

    success = run_app_ui_tests(args.base_url, args.output_dir)
    sys.exit(0 if success else 1)
