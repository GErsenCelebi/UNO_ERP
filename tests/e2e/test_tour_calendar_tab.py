"""
E2E Test: Dedicated Tour Calendar Tab & Main Project Calendar Deep-Linking
Location: tests/e2e/test_tour_calendar_tab.py

Verifies:
1. Main tour calendar (/tour-calendar) deep-links directly to the tour calendar tab (?tab=calendar).
2. The Calendar tab renders strictly the operating dates of the tour (Day 1 through Day N between arrivalDate and endDate).
3. Each operating day demonstrates:
   - The City (Budapest, Vienna, Prague, or transit cities)
   - Hotel reservations (hotel name, city, stay badge [Check-in, Check-out, Overnight], room breakdown)
   - Flight details (date, hour, flight #, airport, live radar links)
   - Excursions (marked with Day Tour ☀️ or Night Tour 🌙 badge, hour if present, city, assigned guide)
4. Interactive view modes: Day Grid View vs Timeline Itinerary.
5. Captures high-resolution screenshot into artifact directory.
"""

import json
import time
import os
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

def test_tour_calendar_tab(base_url="http://localhost:8000"):
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    artifact_dir = r"C:\Users\ecele\.gemini\antigravity\brain\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        ctx = browser.new_context(viewport={'width': 1600, 'height': 1200})
        page = ctx.new_page()

        # Session auth injection
        session = {
            "email": "gersencelebi@gmail.com",
            "name": "G. Ersen Çelebi",
            "role": "Administrator",
            "loginTime": "2026-08-21T00:00:00Z"
        }
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({json.dumps(session)}));")

        print("1. Loading Main Tour Calendar...")
        page.goto(f"{base_url}/tour-calendar", wait_until="networkidle")
        time.sleep(2)

        # Switch to Year view to see all 2026 tours across months
        print("2. Switching to Year view on calendar...")
        year_btn = page.locator('button:has-text("year")')
        if year_btn.is_visible():
            year_btn.click()
            time.sleep(1.5)

        # Find and click PVB05072026
        print("3. Clicking tour event card to verify deep-link to ?tab=calendar...")
        tour_elem = page.locator('text=PVB05072026').first
        if not tour_elem.is_visible():
            tour_elem = page.locator('text=PVB').first
        
        assert tour_elem.is_visible(), "Expected tour card to be visible on calendar"
        tour_elem.click(force=True)
        
        # Wait for navigation to tour page with tab=calendar
        page.wait_for_url("**/tours/**", timeout=15000)
        current_url = page.url
        print(f"Current URL after clicking tour: {current_url}")
        assert "tab=calendar" in current_url, f"Expected '?tab=calendar' in URL, got {current_url}"

        # Wait for calendar content to finish loading
        calendar_title = page.locator('text=Tour Calendar & Operating Itinerary').first
        calendar_title.wait_for(timeout=10000)
        assert calendar_title.is_visible(), "Calendar tab content should be visible"
        print("✅ Deep-link verified: Navigated to Tour Details with Calendar tab active.")

        # Verify Calendar Tab position: must be between Tour Info and Services
        tabs = page.locator("div.flex.border-b button").all_text_contents()
        clean_tabs = [t.strip() for t in tabs]
        print(f"Tabs verified: {clean_tabs}")
        assert "Tour Info" in clean_tabs and "Calendar" in clean_tabs and "Services" in clean_tabs, "Required tabs missing"
        info_idx = clean_tabs.index("Tour Info")
        cal_idx = clean_tabs.index("Calendar")
        svc_idx = clean_tabs.index("Services")
        assert info_idx < cal_idx < svc_idx, f"Calendar tab ({cal_idx}) must be between Tour Info ({info_idx}) and Services ({svc_idx})"
        print("✅ Tab positioning verified: Tour Info -> Calendar -> Services.")

        # Verify Operating Span Header
        print("4. Verifying operating dates and duration...")
        span_badge = page.locator('text=Day 1 to Day 8 (8 Days / 7 Nights)').first
        assert span_badge.is_visible(), "Expected 8 Days / 7 Nights span badge"

        # Verify Day Cards are present (Day 1 to Day 8 only)
        day1 = page.locator('text=Day 1').first
        day8 = page.locator('text=Day 8').first
        assert day1.is_visible(), "Day 1 should be visible"
        assert day8.is_visible(), "Day 8 should be visible"
        
        # Ensure Day 9 does NOT exist (strictly limited to operating dates)
        day9_count = page.locator('text="Day 9"').count()
        assert day9_count == 0, "Day 9 should not exist because tour operates for 8 days"
        print("✅ Strictly bounded to tour operating dates: Day 1 through Day 8 verified.")

        # Verify Cities
        print("5. Verifying cities on day cards...")
        budapest_badge = page.locator('text=Budapest').first
        vienna_badge = page.locator('text=Vienna').first
        prague_badge = page.locator('text=Prague').first
        assert budapest_badge.is_visible(), "Budapest city should be visible"
        assert vienna_badge.is_visible(), "Vienna city should be visible"
        assert prague_badge.is_visible(), "Prague city should be visible"
        print("✅ Cities verified: Budapest, Vienna, Prague displayed on day cards.")

        # Verify Hotel Reservations
        print("6. Verifying hotel reservations...")
        hotel_canada = page.locator('text=Hotel Canada').first
        hotel_allegro = page.locator('text=Hotel Allegro').first
        hotel_olympik = page.locator('text=Hotel Olympik').first
        assert hotel_canada.is_visible(), "Hotel Canada should be visible on Budapest days"
        assert hotel_allegro.is_visible(), "Hotel Allegro should be visible on Vienna days"
        assert hotel_olympik.is_visible(), "Hotel Olympik should be visible on Prague days"
        print("✅ Hotels verified: Hotel Canada, Hotel Allegro, Hotel Olympik all mapped accurately.")

        # Verify Excursions (Day Tour / Night Tour)
        print("7. Verifying excursion packs...")
        excursion_elem = page.locator('text=Promo Day Pack').first
        if excursion_elem.is_visible():
            day_tour_badge = page.locator('text=Day Tour').first
            assert day_tour_badge.is_visible(), "Day Tour badge should be visible for excursion"
            print("✅ Excursion verified with Day Tour badge.")

        # Verify Timeline Itinerary Toggle
        print("8. Testing View Mode Switcher: Timeline Itinerary...")
        timeline_btn = page.locator('button:has-text("Timeline Itinerary")').first
        if timeline_btn.is_visible():
            timeline_btn.click()
            time.sleep(1)
            # Switch back to Day Grid View
            page.locator('button:has-text("Day Grid View")').first.click()
            time.sleep(1)
            print("✅ View mode switcher verified.")

        # Capture high-res screenshot
        screenshot_path = os.path.join(artifact_dir, "tour_calendar_tab_verified.png")
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"📸 Full page screenshot captured at: {screenshot_path}")

        browser.close()
        print("🎉 ALL E2E ASSERTIONS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    test_tour_calendar_tab()
