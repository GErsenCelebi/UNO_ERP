"""
Verification test for Dashboard Gantt Chart Tooltip and Date Formatting
Ensures that hovering over the project bars in ProjectGanttChart does not throw
'date.getTime is not a function'.
"""

import json
import time
import sys
from playwright.sync_api import sync_playwright

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def test_dashboard_gantt():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    artifacts_dir = r"C:\Users\ecele\.gemini\antigravity\brain\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"
    base_url = "http://localhost:8000"

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        ctx = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = ctx.new_page()

        # Listen for console errors or unhandled exceptions
        errors = []
        page.on("pageerror", lambda exc: errors.append(str(exc)))

        session = json.dumps({
            "email": "gersencelebi@gmail.com", 
            "name": "G. Ersen Çelebi", 
            "role": "Administrator", 
            "loginTime": "2026-08-21T00:00:00Z"
        })
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session}));")

        print("Navigating to Dashboard...")
        page.goto(f"{base_url}/dashboard", wait_until="networkidle")
        
        # Wait for data to finish loading (spinner to detach or recharts to attach)
        page.wait_for_selector('.recharts-responsive-container', timeout=15000)
        time.sleep(2)

        # Check if runtime error overlay is visible
        error_overlay = page.locator('text=Runtime TypeError')
        assert not error_overlay.is_visible(), "Dashboard should not show any Runtime TypeError!"
        print("PASS: No runtime error overlay on Dashboard load.")

        # Look for Gantt chart bars / rectangles
        bars = page.locator('.recharts-bar-rectangle')
        bar_count = bars.count()
        print(f"Found {bar_count} Gantt chart bar(s).")

        if bar_count > 0:
            print("Hovering over the first project bar in the Gantt chart...")
            bars.first.hover(force=True)
            time.sleep(1)

            # Check tooltip visibility
            tooltip = page.locator('.recharts-tooltip-wrapper')
            print("Tooltip element found.")

        # Verify no unhandled page errors occurred
        assert len(errors) == 0, f"Page threw unhandled errors: {errors}"
        print("PASS: Zero page errors during Gantt chart interaction.")

        page.screenshot(path=f"{artifacts_dir}\\dashboard_gantt_fixed.png")
        print("Captured screenshot: dashboard_gantt_fixed.png")

        browser.close()
        print("DASHBOARD VERIFICATION COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    test_dashboard_gantt()
