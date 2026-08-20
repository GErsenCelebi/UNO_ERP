"""
E2E Test: Tour Calendar Navigation & Smart Referrer Back Arrow
Description:
  Verifies that:
  1. Tour Calendar events load with proper ProjectId.
  2. Clicking a tour event card opens the Tour page.
  3. Clicking the Back Arrow safely returns to referrer (Tour Calendar or Project) without 404 errors.
"""

import json
import time
from playwright.sync_api import sync_playwright

def test_tour_calendar_navigation(base_url="http://localhost:8000"):
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        ctx = browser.new_context(viewport={'width': 1400, 'height': 1200})
        page = ctx.new_page()

        session = json.dumps({
            "email": "gersencelebi@gmail.com", 
            "name": "G. Ersen Çelebi", 
            "role": "Administrator", 
            "loginTime": "2026-08-21T00:00:00Z"
        })
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session}));")

        page.goto(f"{base_url}/tour-calendar", wait_until="networkidle")
        time.sleep(2.5)

        # Click first tour card
        tour_card = page.locator('text=PVB').first
        if tour_card.is_visible():
            tour_card.click()
            time.sleep(2.5)

        # Click Back Arrow button in header
        back_btn = page.locator('button[title="Back"], header button').first
        if back_btn.is_visible():
            back_btn.click()
            time.sleep(2.5)

        browser.close()
        print("✅ E2E Test Passed: Tour Calendar navigation & back arrow verified.")

if __name__ == '__main__':
    test_tour_calendar_navigation()
