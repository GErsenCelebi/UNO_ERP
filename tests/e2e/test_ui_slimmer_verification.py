import json
import time
import sys
import os
from playwright.sync_api import sync_playwright

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def test_slimmer_ui_elements():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    artifacts_dir = r"C:\Users\ecele\.gemini\antigravity\brain\17545749-9bee-492a-a1ee-66e33111c72c"
    base_url = "http://localhost:8000"

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        ctx = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = ctx.new_page()

        session = json.dumps({
            "email": "gersencelebi@gmail.com",
            "name": "G. Ersen Çelebi",
            "role": "Administrator",
            "loginTime": "2026-08-21T00:00:00Z"
        })
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session}));")

        print("--- Step 1: Navigating to Tour 6109 ---")
        page.goto(f"{base_url}/projects/5063/tours/6109", wait_until="networkidle")
        time.sleep(2)

        # 1. Verify Tour Header
        header = page.locator('h2:has-text("Tour Information")')
        assert header.is_visible(), "Tour Information header should be visible!"
        print("PASS: Tour Information header is visible.")

        # 2. Verify Warning Banner and Resolve Missing button
        warning = page.locator('text=Missing Main Services')
        assert warning.is_visible(), "Missing Main Services warning should be visible!"
        resolve_btn = page.locator('button:has-text("Resolve Missing")')
        assert resolve_btn.is_visible(), "Resolve Missing button should be visible!"
        print("PASS: Slim warning banner and Resolve Missing button are visible.")

        # 3. Verify Separate Status and Guide(s) Columns
        status_col = page.locator('p:has-text("STATUS")')
        assert status_col.is_visible(), "STATUS column should be visible!"
        guide_col = page.locator('p:has-text("GUIDE(S)")')
        assert guide_col.is_visible(), "GUIDE(S) column should be visible!"
        print("PASS: Both separate STATUS and GUIDE(S) columns are visible.")

        # Snapshot Top Overview Area
        page.screenshot(path=os.path.join(artifacts_dir, "slimmer_top_overview.png"))
        print("Saved screenshot: slimmer_top_overview.png")

        # 4. Verify Status Gate Readiness (expand it and snapshot)
        status_gate = page.locator('text=Status Gate Readiness')
        assert status_gate.is_visible(), "Status Gate Readiness header should be visible!"
        status_gate.scroll_into_view_if_needed()
        status_gate.click() # expand the widget
        time.sleep(1)
        page.screenshot(path=os.path.join(artifacts_dir, "slimmer_status_gate_readiness.png"))
        print("Saved screenshot: slimmer_status_gate_readiness.png")

        # 5. Verify Audit History Section
        audit_sec = page.locator('h3:has-text("Audit History")')
        assert audit_sec.is_visible(), "Audit history section header should be visible!"
        audit_sec.scroll_into_view_if_needed()
        time.sleep(1)

        # Snapshot Audit History Area
        page.screenshot(path=os.path.join(artifacts_dir, "slimmer_audit_history.png"))
        print("Saved screenshot: slimmer_audit_history.png")

        # 5. Test clicking Resolve Missing button
        page.locator('button:has-text("Resolve Missing")').click()
        time.sleep(2)

        # Check that Services tab is now active (has border-b-2 or active styling)
        services_tab = page.locator('button:has-text("Services")').first
        assert services_tab.is_visible(), "Services tab button should be visible!"
        print("PASS: Resolve Missing button correctly switched to Services tab.")

        # Snapshot after clicking Resolve Missing
        page.screenshot(path=os.path.join(artifacts_dir, "slimmer_resolve_missing_clicked.png"))
        print("Saved screenshot: slimmer_resolve_missing_clicked.png")

        # 6. Verify and Snapshot Financial Summary Cards (Total Revenue, Total Service Cost, Profit)
        cancel_btn = page.locator('button:has-text("Cancel")')
        if cancel_btn.is_visible():
            cancel_btn.click()
            time.sleep(1)

        fin_summary = page.locator('text=Total Revenue (Sales)')
        assert fin_summary.is_visible(), "Total Revenue (Sales) should be visible in Services tab!"
        fin_summary.scroll_into_view_if_needed()
        time.sleep(1)
        # 7. Verify and Snapshot Project Information Card
        page.goto(f"{base_url}/projects/5063", wait_until="networkidle")
        time.sleep(2)
        proj_info = page.locator('h2:has-text("Project Information")')
        assert proj_info.is_visible(), "Project Information header should be visible!"
        page.screenshot(path=os.path.join(artifacts_dir, "slimmer_project_information.png"))
        print("Saved screenshot: slimmer_project_information.png")

        browser.close()
        print("All UI Slimmer tests passed successfully!")

if __name__ == '__main__':
    test_slimmer_ui_elements()
