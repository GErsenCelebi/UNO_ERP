import os
import sys
from playwright.sync_api import sync_playwright

def test_executive_kpi_dashboard():
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    artifact_dir = "C:/Users/ecele/.gemini/antigravity/brain/9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"
    screenshot_path = os.path.join(artifact_dir, "executive_kpi_dashboard.png")

    session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=chrome_path if os.path.exists(chrome_path) else None,
            headless=True
        )
        context = browser.new_context(viewport={"width": 1400, "height": 1050})
        page = context.new_page()
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")

        # 1. Check Sidebar for Executive KPI Cockpit
        print("[1] Navigating to /dashboard and verifying sidebar navigation...")
        page.goto("http://localhost:8001/dashboard", wait_until="networkidle")
        page.wait_for_timeout(1000)
        
        exec_link = page.locator('a[href="/dashboard/executive"]')
        assert exec_link.count() > 0, "Executive KPI Cockpit link not found in sidebar!"
        print("    -> Sidebar sub-menu contains 'Executive KPI Cockpit'")

        # 3. Navigate to /dashboard/executive
        print("[3] Navigating to Executive KPI Cockpit...")
        exec_link.first.click()
        page.wait_for_timeout(1500)
        assert "/dashboard/executive" in page.url, f"Expected URL to contain /dashboard/executive, got {page.url}"

        # 4. Verify Control Header
        print("[4] Verifying Control Header...")
        header_title = page.locator('h1:has-text("Executive KPI Cockpit")')
        assert header_title.count() > 0, "Header title 'Executive KPI Cockpit' missing!"
        board_btn = page.locator('button:has-text("Board Deck PDF")')
        assert board_btn.count() > 0, "'Board Deck PDF' button missing!"

        # 5. Verify AI Flash Briefing
        print("[5] Verifying AI Flash Briefing Card...")
        ai_card = page.locator('text=AI Copilot Executive Summary')
        assert ai_card.count() > 0, "AI Flash Briefing card missing!"

        # 6. Verify 8 Strategic KPI Cards
        print("[6] Verifying 8 Strategic KPI cards...")
        kpi_names = [
            "Gross Booking Value",
            "Net Realized Margin",
            "Average Revenue / Pax",
            "Excursion Take Rate",
            "Operating Cost / Pax",
            "Hotel Cost / Pax Night",
            "Departure Readiness",
            "Cash Collection Velocity"
        ]
        for name in kpi_names:
            loc = page.locator(f'h3:has-text("{name}")')
            assert loc.count() > 0, f"KPI Card '{name}' not found!"
            print(f"    -> Verified KPI Card: {name}")

        # 7. Verify Variance Radar and Action Cards
        print("[7] Verifying Variance Radar and Recommended Actions...")
        radar_header = page.locator('text=Strategic KPI Variance Radar')
        assert radar_header.count() > 0, "Strategic KPI Variance Radar missing!"
        
        actions_header = page.locator('text=C-Suite Recommended Actions')
        assert actions_header.count() > 0, "C-Suite Recommended Actions missing!"

        # 8. Verify Visual Analytics Charts (Margin vs Target & Cost Share)
        print("[8] Verifying Visual Analytics Charts...")
        bar_chart = page.locator('text=Tour Margin % vs. 20.0% Board Target Baseline')
        assert bar_chart.count() > 0, "Tour Margin % Bar Chart missing!"
        cost_share = page.locator('text=Operating Cost Share Breakdown')
        assert cost_share.count() > 0, "Operating Cost Share Breakdown missing!"
        print("    -> Verified Bar Chart and Cost Share Donut/Bar sections")

        # 9. Verify Tour League Table with Sortable Columns
        print("[9] Verifying Tour-by-Tour Performance League Table...")
        table_header = page.locator('text=Tour Performance League: Budget Target vs. Actual')
        assert table_header.count() > 0, "Tour League Table missing!"
        
        # Verify sortable headers
        sort_pax = page.locator('th:has-text("Pax")')
        assert sort_pax.count() > 0, "Sortable Pax header missing!"
        sort_margin = page.locator('th:has-text("Margin %")')
        assert sort_margin.count() > 0, "Sortable Margin % header missing!"
        print("    -> Verified Interactive Column Headers")

        # Test sorting interaction
        sort_pax.first.click()
        page.wait_for_timeout(300)
        print("    -> Tested sorting on Pax column")

        # 10. Verify Row Expansion & Level 2 Contracted Services Breakdown
        print("[10] Testing Hierarchical Row Expansion (Level 2 Services)...")
        breakdown_btn = page.locator('button:has-text("Breakdown")').first
        assert breakdown_btn.count() > 0, "Tour Breakdown button missing!"
        breakdown_btn.click()
        page.wait_for_timeout(500)

        level2_header = page.locator('text=Level 2 Supplier Breakdown')
        assert level2_header.count() > 0, "Level 2 Supplier Breakdown sub-table missing!"
        print("    -> Successfully expanded tour row and revealed Level 2 Contracted Services")

        # 11. Verify Global Expand All / Collapse All
        print("[11] Testing Global [Expand All] / [Collapse All]...")
        expand_all_btn = page.locator('button:has-text("Expand All"), button:has-text("Collapse All")').first
        assert expand_all_btn.count() > 0, "Global Expand All button missing!"
        expand_all_btn.click()
        page.wait_for_timeout(500)
        print("    -> Toggled global hierarchical expansion")

        # 12. Test Search Filter
        print("[12] Testing League table search filter...")
        search_input = page.locator('input[placeholder*="Search tour code"]')
        assert search_input.count() > 0, "League table search box missing!"
        search_input.fill("ABCD")
        page.wait_for_timeout(300)
        assert page.locator('text=ABCDTEST').count() > 0, "Search result for ABCDTEST missing!"
        search_input.fill("")

        # 13. Test Period Selection Pill
        print("[13] Testing Period Pills...")
        jul_btn = page.locator('button:has-text("Month: Jul"), button:has-text("Jul")')
        if jul_btn.count() > 0:
            jul_btn.first.click()
            page.wait_for_timeout(500)
            print("    -> Selected Period 'Jul'")

        # Reset back to Q3 2026 for screenshot
        q3_btn = page.locator('button:has-text("Q3 2026")')
        if q3_btn.count() > 0:
            q3_btn.first.click()
            page.wait_for_timeout(600)

        # 14. Capture Screenshots
        print("[14] Capturing verification screenshots...")
        artifact_dir = "C:/Users/ecele/.gemini/antigravity/brain/da3d7774-c465-41fb-9db4-d75aebe21ab7"
        screenshot_path = os.path.join(artifact_dir, "executive_kpi_dashboard_interactive.png")
        page.screenshot(path=screenshot_path)
        print(f"[+] Saved overview screenshot to: {screenshot_path}")

        # Scroll to Charts and Table
        chart_loc = page.locator('text=Tour Margin % vs. 20.0% Board Target Baseline')
        if chart_loc.count() > 0:
            chart_loc.scroll_into_view_if_needed()
            page.wait_for_timeout(500)
            charts_path = os.path.join(artifact_dir, "executive_kpi_visual_charts.png")
            page.screenshot(path=charts_path)
            print(f"[+] Saved visual charts screenshot to: {charts_path}")

        # Expand breakdown and scroll down to capture hierarchical drilldown
        breakdown_btn = page.locator('button:has-text("Breakdown")').first
        if breakdown_btn.count() > 0:
            breakdown_btn.click()
            page.wait_for_timeout(400)
            
        drilldown_target = page.locator('text=Level 2 Supplier Breakdown').first
        if drilldown_target.count() > 0:
            drilldown_target.scroll_into_view_if_needed()
            page.wait_for_timeout(500)
        else:
            league_loc = page.locator('text=Tour Performance League: Budget Target vs. Actual')
            league_loc.scroll_into_view_if_needed()
            page.wait_for_timeout(500)
            
        table_path = os.path.join(artifact_dir, "executive_kpi_league_table_drilldown.png")
        page.screenshot(path=table_path)
        print(f"[+] Saved league table drilldown screenshot to: {table_path}")

        browser.close()
        print("\n[SUCCESS] Executive KPI Dashboard E2E automated verification passed 100%!")

if __name__ == "__main__":
    test_executive_kpi_dashboard()
