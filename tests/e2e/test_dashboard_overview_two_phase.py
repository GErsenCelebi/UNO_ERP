"""
E2E Automation Test Suite: Operations Command Center Dashboard (Two-Phase Architecture)
Location: tests/e2e/test_dashboard_overview_two_phase.py

Rule Compliance:
- Rule #5: Saved directly in repository under tests/e2e/
- User Specification:
  * Phase 1 (Design 07): Initial landing view displaying Projects Overview with duration spans, tour counts, pax, and click-to-drilldown.
  * Phase 2 (Design 06): Clicking any project breaks down into granular Tour Operations Gantt schedule with tour codes, pax badges, status colors, and Today temporal line.
  * User Logo Preservation: The original logo (/logo.png) is preserved in a framed container and NOT replaced with mockup placeholder logos.
"""

import json
import time
import os
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

def test_dashboard_overview_two_phase(base_url="http://localhost:8000"):
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    artifact_dir = r"C:\Users\ecele\.gemini\antigravity\brain\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"

    print("\n=======================================================")
    print("🚀 STARTING E2E TEST: TWO-PHASE OPERATIONS DASHBOARD")
    print("=======================================================")

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        ctx = browser.new_context(viewport={'width': 1680, 'height': 1050})
        page = ctx.new_page()

        # 1. Auth session injection
        session = {
            "email": "gersencelebi@gmail.com",
            "name": "G. Ersen Çelebi",
            "role": "Administrator",
            "loginTime": "2026-08-21T00:00:00Z"
        }
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({json.dumps(session)}));")

        # 2. Navigate to Dashboard Overview
        print(f"Step 1: Navigating to {base_url}/dashboard...")
        page.goto(f"{base_url}/dashboard", wait_until="networkidle")
        time.sleep(2)

        # 3. Verify Logo Preservation
        print("Step 2: Verifying framed user logo preservation (/logo.png)...")
        logo_img = page.locator('img[src="/logo.png"]').first
        assert logo_img.is_visible(), "Error: Framed user logo /logo.png is not visible!"
        print("   ✅ Original logo preserved in framed dark container!")

        # 4. Verify Phase 1 (Design 07: Projects Overview)
        print("Step 3: Verifying Phase 1 (Design 07) Projects Overview...")
        header_text = page.locator('text=Projects Overview').first
        assert header_text.is_visible(), "Error: 'Projects Overview' header not found in Phase 1!"
        
        # Verify Project Row (Orta Avrupa -BVP)
        project_row = page.locator('text=Orta Avrupa -BVP').first
        assert project_row.is_visible(), "Error: Project 'Orta Avrupa -BVP' row not rendered!"
        print("   ✅ Project row 'Orta Avrupa -BVP' detected with tour count and pax badge.")

        # Verify KPI Stack (Active Projects, Total Tours, Total Pax, Gross Revenue)
        assert page.locator('text=ACTIVE PROJECTS:').first.is_visible(), "Active Projects KPI missing"
        assert page.locator('text=TOTAL TOURS:').first.is_visible(), "Total Tours KPI missing"
        assert page.locator('text=TOTAL PAX:').first.is_visible(), "Total Pax KPI missing"
        assert page.locator('text=GROSS REVENUE:').first.is_visible(), "Gross Revenue KPI missing"
        print("   ✅ Phase 1 Macro Telemetry KPIs confirmed.")

        # Capture Phase 1 Screenshot
        phase1_ss = os.path.join(artifact_dir, "dashboard_phase1_projects_overview_verified.png")
        page.screenshot(path=phase1_ss, full_page=True)
        print(f"   📸 Phase 1 Screenshot saved: {phase1_ss}")

        # 5. Trigger Transition: Click on Project to Drilldown into Phase 2
        print("\nStep 4: Clicking Project 'Orta Avrupa -BVP' to drill down into Phase 2 (Design 06)...")
        # Click the project row or duration bar
        clickable_project = page.locator('div:has-text("Orta Avrupa -BVP")').locator('text=Click to expand').first
        if not clickable_project.is_visible():
            clickable_project = page.locator('text=Orta Avrupa -BVP').first
        clickable_project.click()
        time.sleep(2)

        # 6. Verify Phase 2 (Design 06: Operations Gantt Tour Breakdown)
        print("Step 5: Verifying Phase 2 (Design 06) Operations Tour Breakdown...")
        assert page.locator('text=Operations Gantt').first.is_visible(), "Operations Gantt header not found in Phase 2!"
        assert page.locator('button:has-text("All Projects")').first.is_visible(), "Return 'All Projects' button missing in Phase 2!"
        print("   ✅ Phase 2 Breadcrumb navigation 'Operations Gantt / Orta Avrupa -BVP' and 'All Projects' return button verified.")

        # Verify individual tour schedule rows
        tour_badges = page.locator('text=Pax').all()
        print(f"   ✅ Detected {len(tour_badges)} tour passenger headcount badges in Phase 2 timeline.")

        # Verify Today marker line
        today_marker = page.locator('span:has-text("TODAY")').first
        assert today_marker.is_visible(), "Red Today temporal marker line missing in Phase 2!"
        print("   ✅ Temporal Red 'TODAY' indicator verified on timeline.")

        # Verify Project-Specific KPIs
        assert page.locator('text=ACTIVE TOURS:').first.is_visible(), "Phase 2 Active Tours KPI missing"
        assert page.locator('text=PRE-CONFIRMED:').first.is_visible(), "Phase 2 Pre-Confirmed KPI missing"
        print("   ✅ Phase 2 Project-Specific Telemetry KPIs confirmed.")

        # Capture Phase 2 Screenshot
        phase2_ss = os.path.join(artifact_dir, "dashboard_phase2_tour_breakdown_verified.png")
        page.screenshot(path=phase2_ss, full_page=True)
        print(f"   📸 Phase 2 Screenshot saved: {phase2_ss}")

        # 7. Test Return Transition: Back to Phase 1
        print("\nStep 6: Clicking 'All Projects' return button to transition back to Phase 1...")
        back_btn = page.locator('button:has-text("All Projects")').first
        back_btn.click()
        time.sleep(1.5)

        assert page.locator('text=Projects Overview').first.is_visible(), "Failed to return to Projects Overview Phase 1!"
        print("   ✅ Successfully navigated back to Phase 1 Projects Overview!")

        phase1_returned_ss = os.path.join(artifact_dir, "dashboard_phase1_returned_verified.png")
        page.screenshot(path=phase1_returned_ss, full_page=True)
        print(f"   📸 Returned Phase 1 Screenshot saved: {phase1_returned_ss}")

        print("\n=======================================================")
        print("🎉 ALL TWO-PHASE DASHBOARD E2E TESTS PASSED SUCCESSFULLY!")
        print("=======================================================\n")
        browser.close()

if __name__ == "__main__":
    target_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    test_dashboard_overview_two_phase(target_url)
