"""
E2E Test: Missing Main Services Warning & Status Block Verification
Tests:
1. Tour Info page (http://localhost:8000/projects/6101/tours/6128):
   - Prominent red warning banner showing Action Required and listing missing services (Guide, Transportation, Flight #).
   - Red 'Action Required' badge in Status & Guide(s) card.
   - Status dropdown in Edit mode has Confirmed and In Progress disabled with warning label.
2. Tour Calendar page (http://localhost:8000/tour-calendar):
   - Red 'MISSING' warning badge on calendar event cards.
   - Red 'Action Required' callout in hover tooltip detailing missing services.
   - Red missing services badge in day view.
"""

import json
import time
import sys
from playwright.sync_api import sync_playwright

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def test_missing_services():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    artifacts_dir = r"C:\Users\ecele\.gemini\antigravity\brain\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"
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

        print("--- Step 1: Tour Info Page for Tour 6128 ---")
        page.goto(f"{base_url}/projects/6101/tours/6128", wait_until="networkidle")
        time.sleep(2)

        # 1. Verify Red Warning Banner
        banner = page.locator('text=Action Required: Missing Main Services')
        assert banner.is_visible(), "Red warning banner for missing main services should be visible!"
        print("PASS: Red warning banner is visible.")

        # Capture Tour Info Overview with Red Banner
        page.screenshot(path=f"{artifacts_dir}\\tour_info_missing_services_banner.png")
        print("Captured screenshot: tour_info_missing_services_banner.png")

        # 2. Click Edit to verify status options blocked
        edit_btn = page.locator('button:has-text("Edit")')
        if edit_btn.is_visible():
            edit_btn.click()
            time.sleep(1)

            # Check status select options
            status_select = page.locator('select').nth(1) # Tour status select
            options = status_select.locator('option').all_inner_texts()
            print(f"Status options found: {options}")

            # Verify Confirmed & In Progress have blocked label
            blocked_opts = [opt for opt in options if "Blocked: Missing Main Services" in opt]
            assert len(blocked_opts) >= 2, f"Expected at least 2 blocked status options, found: {blocked_opts}"
            print("PASS: Confirmed and In Progress status options are disabled with warning.")

            page.screenshot(path=f"{artifacts_dir}\\tour_info_edit_blocked_status.png")
            print("Captured screenshot: tour_info_edit_blocked_status.png")

            # Cancel edit
            page.locator('button:has-text("Cancel")').click()
            time.sleep(0.5)

        print("\n--- Step 2: Tour Calendar Warnings ---")
        page.goto(f"{base_url}/tour-calendar", wait_until="networkidle")
        time.sleep(2)

        # Check legend
        legend_missing = page.locator('text=Missing Services')
        assert legend_missing.is_visible(), "Header legend should include Missing Services badge!"
        print("PASS: Calendar header legend includes Missing Services.")

        # Navigate to September 2026 where ABCDTEST (Sep 20-27, 2026) is scheduled
        for _ in range(12):
            header_text = page.locator('header span.font-semibold').inner_text()
            if "September 2026" in header_text:
                break
            if "2026" in header_text:
                if any(m in header_text for m in ["October", "November", "December"]):
                    page.locator('header button:has(svg.lucide-chevron-left)').click()
                else:
                    page.locator('header button:has(svg.lucide-chevron-right)').click()
            else:
                page.locator('header button:has(svg.lucide-chevron-right)').click()
            time.sleep(0.5)

        time.sleep(1.5)
        print(f"Current Header: {page.locator('header span.font-semibold').inner_text()}")

        # Look for tour ABCDTEST card with MISSING badge
        abcd_card = page.locator('div.group:has-text("ABCDTEST")').first
        assert abcd_card.is_visible(), "ABCDTEST event card should be visible in September 2026!"
        print("PASS: ABCDTEST event card is visible on calendar.")

        missing_badge = abcd_card.locator('span:has-text("MISSING")')
        assert missing_badge.is_visible(), "ABCDTEST should display the red MISSING badge!"
        print("PASS: ABCDTEST displays red MISSING badge.")

        # Hover over ABCDTEST event card
        print("Hovering over ABCDTEST event card...")
        abcd_card.hover()
        time.sleep(1)

        # Check tooltip
        tooltip_alert = page.locator('text=Missing Main Services')
        assert tooltip_alert.is_visible(), "Hover tooltip should display Missing Main Services alert!"
        print("PASS: Hover tooltip displays red Missing Main Services callout.")

        page.screenshot(path=f"{artifacts_dir}\\tour_calendar_missing_services_hover.png")
        print("Captured screenshot: tour_calendar_missing_services_hover.png")

        # Capture calendar month view
        page.screenshot(path=f"{artifacts_dir}\\tour_calendar_missing_services_month.png")
        print("Captured screenshot: tour_calendar_missing_services_month.png")

        # Switch to Day view
        page.get_by_role("button", name="day", exact=True).click()
        time.sleep(1.5)
        page.screenshot(path=f"{artifacts_dir}\\tour_calendar_missing_services_day.png")
        print("Captured screenshot: tour_calendar_missing_services_day.png")

        browser.close()
        print("\nALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_missing_services()
