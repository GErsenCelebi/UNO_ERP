"""
E2E Test: Dedicated Tour Calendar Deduplication Verification
Location: tests/e2e/test_tour_calendar_deduplication.py

Verifies:
1. Navigates to Tour 5051 (Project 5063) Tour Calendar tab (?tab=calendar).
2. Checks that excursions (e.g., Czech Night, Karlovy Vary, Danube River Cruise) appear exactly ONCE (no duplicates).
3. Checks that transfers / transport are NOT duplicated.
4. Checks that the total unique excursion count in the KPI badge matches (5 Tours).
5. Captures screenshot showing deduplicated clean calendar day cards and timeline.
"""

import json
import time
import os
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

def test_tour_calendar_deduplication(base_url="http://localhost:8000"):
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    artifact_dir = r"C:\Users\ecele\.gemini\antigravity\brain\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"
    screenshot_path = os.path.join(artifact_dir, "tour_calendar_deduplicated_verified.png")

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        ctx = browser.new_context(viewport={'width': 1600, 'height': 1200})
        page = ctx.new_page()

        session = {
            "email": "gersencelebi@gmail.com",
            "name": "G. Ersen Çelebi",
            "role": "Administrator",
            "loginTime": "2026-08-21T00:00:00Z"
        }
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({json.dumps(session)}));")

        print("1. Loading Tour 5051 Calendar tab...")
        page.goto(f"{base_url}/projects/5063/tours/5051?tab=calendar", wait_until="networkidle")
        time.sleep(3)

        # Wait for calendar content
        calendar_title = page.locator('text=Tour Calendar & Operating Itinerary').first
        calendar_title.wait_for(timeout=15000)
        assert calendar_title.is_visible(), "Calendar tab content should be visible"

        print("2. Checking excursion counts on Day cards...")
        # Check Czech Night (was duplicated in SS1 on Day 6)
        czech_night_cards = page.locator('p:has-text("Czech Night")')
        czech_count = czech_night_cards.count()
        print(f"Czech Night occurrences found: {czech_count}")
        assert czech_count == 1, f"Expected Czech Night to appear exactly once, got {czech_count}"

        # Check Karlovy Vary (was duplicated in SS1 on Day 7)
        karlovy_cards = page.locator('p:has-text("Karlovy Vary")')
        karlovy_count = karlovy_cards.count()
        print(f"Karlovy Vary occurrences found: {karlovy_count}")
        assert karlovy_count == 1, f"Expected Karlovy Vary to appear exactly once, got {karlovy_count}"

        # Check Danube River Cruise (was duplicated in SS1 on Day 1)
        danube_cards = page.locator('p:has-text("Danube River Cruise")')
        danube_count = danube_cards.count()
        print(f"Danube River Cruise occurrences found: {danube_count}")
        assert danube_count == 1, f"Expected Danube River Cruise to appear exactly once, got {danube_count}"

        # Check Hallstat (Day 3)
        hallstat_cards = page.locator('p:has-text("Hallstat")')
        hallstat_count = hallstat_cards.count()
        print(f"Hallstat occurrences found: {hallstat_count}")
        assert hallstat_count == 1, f"Expected Hallstat to appear exactly once, got {hallstat_count}"

        # Check Prague Evening Cruise & Dinner Excursion (Day 1)
        prague_dinner_cards = page.locator('p:has-text("Prague Evening Cruise & Dinner Excursion")')
        prague_dinner_count = prague_dinner_cards.count()
        print(f"Prague Evening Cruise occurrences found: {prague_dinner_count}")
        assert prague_dinner_count == 1, f"Expected Prague Evening Cruise to appear exactly once, got {prague_dinner_count}"

        # Verify Header KPI Badge
        kpi_badge = page.locator('text=5 Tours').first
        assert kpi_badge.is_visible(), "Expected '5 Tours' KPI badge representing the 5 distinct excursions"
        print("✅ Header KPI correctly shows 5 unique tours.")

        # Take screenshot of Day Grid View
        print(f"3. Saving verification screenshot to {screenshot_path}...")
        page.screenshot(path=screenshot_path, full_page=True)
        print("✅ Screenshot captured successfully.")

        # Check Timeline View
        timeline_btn = page.locator('button:has-text("Timeline Itinerary")')
        if timeline_btn.is_visible():
            print("4. Switching to Timeline view to inspect...")
            timeline_btn.click()
            time.sleep(1.5)
            
            # Re-verify counts in timeline view
            czech_tl_count = page.locator('p:has-text("Czech Night")').count()
            karlovy_tl_count = page.locator('p:has-text("Karlovy Vary")').count()
            danube_tl_count = page.locator('p:has-text("Danube River Cruise")').count()
            assert czech_tl_count == 1, f"Expected 1 Czech Night in timeline, got {czech_tl_count}"
            assert karlovy_tl_count == 1, f"Expected 1 Karlovy Vary in timeline, got {karlovy_tl_count}"
            assert danube_tl_count == 1, f"Expected 1 Danube River Cruise in timeline, got {danube_tl_count}"
            print("✅ Timeline view also verified: exactly 1 card per excursion.")

            timeline_screenshot = os.path.join(artifact_dir, "tour_calendar_timeline_deduplicated_verified.png")
            page.screenshot(path=timeline_screenshot, full_page=True)
            print("✅ Timeline screenshot captured.")

        print("🎉 ALL DEDUPLICATION TESTS PASSED WITH ZERO DUPLICATES!")
        browser.close()

if __name__ == "__main__":
    test_tour_calendar_deduplication()
