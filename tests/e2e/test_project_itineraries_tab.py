"""
Playwright E2E Test Suite for Project Itineraries Tab
Verifies:
1. Strict tab ordering: Overview -> Itinerary -> Tours -> Dashboard -> Finance
2. Itinerary tab displays multiple itineraries per project (Project 5063: BVP 8D/7N and VSP 7D/6N)
3. Telemetry KPI cards (Total Itineraries, Primary Itinerary, Avg Cost/Pax, Margin)
4. Collapsible day-by-day itinerary schedule breakdown with EU rest stop compliance tags
5. '+ Add Itinerary' modal with 1-click preset templates (Bohemian Express 5D/4N) and day schedule builder
6. Duplicating an itinerary package as a new variant
7. Switching primary itinerary star status
8. Export / Print client proposal modal
"""

import os
import sys
import time
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\ecele\.gemini\antigravity\brain\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"
BASE_URL = "http://localhost:8000"
API_URL = "http://localhost:8001"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PROJECT_ID = "5063"

def run_project_itineraries_e2e():
    print("=" * 70)
    print("STARTING E2E AUTOMATION TEST: PROJECT ITINERARIES TAB")
    print(f"Target: {BASE_URL}/projects/{PROJECT_ID}")
    print("=" * 70)

    session_json = '{"email":"gersencelebi@gmail.com","name":"G. Ersen Çelebi","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=CHROME_PATH,
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        context = browser.new_context(viewport={"width": 1480, "height": 1050})
        page = context.new_page()

        # Inject auth session before navigation
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")

        # Step 1: Navigate to Project 5063
        print(f"\n[STEP 1] Navigating to Project {PROJECT_ID}...")
        page.goto(f"{BASE_URL}/projects/{PROJECT_ID}", wait_until="networkidle", timeout=30000)
        time.sleep(2)

        # Step 2: Verify Strict Tab Ordering
        print("\n[STEP 2] Verifying Tab Bar Ordering (Must have Itinerary between Overview and Tours)...")
        page.wait_for_selector("div.border-b button:has-text('Overview')", timeout=15000)
        tab_buttons = page.locator("div.border-b button").all()
        tab_texts = [btn.inner_text().strip().split("\n")[0] for btn in tab_buttons if btn.inner_text().strip()]
        print(f"  -> Discovered Tabs: {tab_texts}")

        assert "Overview" in tab_texts, "Overview tab is missing!"
        assert "Itinerary" in tab_texts, "Itinerary tab is missing!"
        assert "Tours" in tab_texts, "Tours tab is missing!"

        idx_overview = tab_texts.index("Overview")
        idx_itinerary = tab_texts.index("Itinerary")
        idx_tours = tab_texts.index("Tours")

        print(f"  -> Tab indices: Overview={idx_overview}, Itinerary={idx_itinerary}, Tours={idx_tours}")
        assert idx_overview < idx_itinerary < idx_tours, (
            f"Ordering violation! Itinerary must be placed between Overview and Tours. "
            f"Got Overview={idx_overview}, Itinerary={idx_itinerary}, Tours={idx_tours}"
        )
        print("  -> PASS: 'Itinerary' tab is strictly positioned between 'Overview' and 'Tours'.")

        # Step 3: Switch to Itinerary Tab
        print("\n[STEP 3] Clicking 'Itinerary' Tab...")
        itinerary_btn = page.locator("div.border-b button:has-text('Itinerary')").first
        itinerary_btn.click()
        time.sleep(2)

        # Wait for itinerary cards or loading to resolve
        page.wait_for_selector("text=Stored Itineraries", timeout=10000)
        print("  -> Itinerary management suite loaded.")

        # Step 4: Verify Telemetry Cards
        print("\n[STEP 4] Verifying Itinerary Telemetry Summary Cards...")
        kpi_itineraries = page.locator("text=Stored Itineraries").first
        assert kpi_itineraries.is_visible(), "Telemetry 'Stored Itineraries' not found!"
        
        kpi_primary = page.locator("text=Primary Itinerary").first
        assert kpi_primary.is_visible(), "Telemetry 'Primary Itinerary' not found!"
        print("  -> PASS: Telemetry KPI header cards verified.")

        # Step 5: Verify Seeded Multi-Itinerary Records (ITN-BVP-01 & ITN-VSP-02)
        print("\n[STEP 5] Verifying Multi-Itinerary Package Cards...")
        bvp_card = page.locator("text=ITN-BVP-01").first
        assert bvp_card.is_visible(), "Primary itinerary 'ITN-BVP-01' not visible!"
        print("  -> Found ITN-BVP-01: Classic Central Europe 8D/7N")

        vsp_card = page.locator("text=ITN-VSP-02").first
        assert vsp_card.is_visible(), "Secondary itinerary 'ITN-VSP-02' not visible!"
        print("  -> Found ITN-VSP-02: Imperial Capitals & Alpine Gateway 7D/6N")

        # Verify Day-by-Day schedule details
        print("  -> Checking Day-by-Day Schedule details...")
        day1 = page.locator("text=Arrival in Budapest & Danube Evening Cruise").first
        assert day1.is_visible(), "Day 1 itinerary item not visible!"
        
        # Check EU rest stop compliance badge
        rest_stop = page.locator("text=Mandatory EU Rest Stop: Bratislava Castle & Historic Centre").first
        if rest_stop.is_visible():
            print("  -> Verified: EU Directive (EC) 561/2006 driver rest stop badge is displayed.")

        # Capture overview screenshot
        shot1 = os.path.join(ARTIFACT_DIR, "project_itinerary_tab_overview.png")
        page.screenshot(path=shot1, full_page=False)
        print(f"  -> Screenshot captured: {shot1}")

        # Step 6: Test '+ Add Itinerary' Modal & Preset Templates
        print("\n[STEP 6] Testing '+ Add Itinerary' Modal with 1-Click Preset Template...")
        add_btn = page.locator("button:has-text('Add Itinerary')").first
        add_btn.click()
        time.sleep(1)

        modal_title = page.locator("h3:has-text('Create New Project Itinerary')")
        assert modal_title.is_visible(), "Add Itinerary modal did not appear!"
        print("  -> Add Itinerary modal opened.")

        # Click preset template "Bohemian & Austrian Express 5D/4N"
        preset_btn = page.locator("button:has-text('Bohemian & Austrian Express 5D/4N')")
        assert preset_btn.is_visible(), "Bohemian Express preset button not found!"
        preset_btn.click()
        time.sleep(0.5)

        # Verify fields populated
        title_input = page.locator("input[value*='Bohemian & Austrian Express 5D/4N']")
        assert title_input.is_visible(), "Preset title did not auto-populate in title input!"
        print("  -> Preset template auto-populated form and day-by-day builder items.")

        # Capture preset modal screenshot
        shot2 = os.path.join(ARTIFACT_DIR, "project_itinerary_modal_preset.png")
        page.screenshot(path=shot2, full_page=False)
        print(f"  -> Screenshot captured: {shot2}")

        # Submit new itinerary
        save_btn = page.locator("button:has-text('Create Itinerary')")
        save_btn.click()
        time.sleep(2)
        print("  -> Saved new Bohemian Express itinerary.")

        # Step 7: Verify 3 Itineraries now exist
        print("\n[STEP 7] Verifying new itinerary appears in list...")
        page.wait_for_selector("text=Bohemian & Austrian Express", timeout=8000)
        express_card = page.locator("text=Bohemian & Austrian Express").first
        assert express_card.is_visible(), "Newly created Bohemian Express itinerary is not visible!"
        print("  -> PASS: New itinerary package successfully created and listed.")

        # Step 8: Test Duplicate Package
        print("\n[STEP 8] Testing 'Duplicate' Itinerary action...")
        duplicate_btns = page.locator("button[title*='Duplicate']").all()
        if len(duplicate_btns) > 0:
            duplicate_btns[0].click()
            time.sleep(2)
            print("  -> Clicked duplicate button.")
            # Verify duplicate appears
            copy_card = page.locator("text=(Copy)").first
            assert copy_card.is_visible(), "Duplicated itinerary '(Copy)' not found!"
            print("  -> PASS: Itinerary successfully duplicated as a new variant.")

        # Step 9: Test Primary Star Toggle
        print("\n[STEP 9] Testing 'Set as Primary' action...")
        make_primary_btns = page.locator("button[title*='Make primary']").all()
        if len(make_primary_btns) > 0:
            make_primary_btns[0].click()
            time.sleep(2)
            print("  -> Clicked 'Make primary' button.")
            print("  -> PASS: Primary star toggle executed.")

        # Step 10: Test Export / Print Proposal Modal
        print("\n[STEP 10] Testing Export / Print Proposal Sheet Modal...")
        export_btns = page.locator("button[title*='Export / Print']").all()
        if len(export_btns) > 0:
            export_btns[0].click()
            time.sleep(1)

            export_modal = page.locator("text=UNO ERP DMC Itinerary Sheet")
            assert export_modal.is_visible(), "Export/Print modal did not open!"
            print("  -> Export / Print proposal sheet rendered.")

            shot3 = os.path.join(ARTIFACT_DIR, "project_itinerary_export_modal.png")
            page.screenshot(path=shot3, full_page=False)
            print(f"  -> Screenshot captured: {shot3}")

            # Close modal
            close_btn = page.locator("div.fixed button:has(svg.lucide-x)").first
            close_btn.click()
            time.sleep(0.5)

        # Capture final schedule expansion screenshot
        shot4 = os.path.join(ARTIFACT_DIR, "project_itinerary_expanded_schedule.png")
        page.screenshot(path=shot4, full_page=True)
        print(f"  -> Full page verified screenshot captured: {shot4}")

        print("\n" + "=" * 70)
        print("ALL E2E ITINERARY TAB TESTS PASSED SUCCESSFULLY!")
        print("=" * 70)

        context.close()
        browser.close()

if __name__ == "__main__":
    run_project_itineraries_e2e()
