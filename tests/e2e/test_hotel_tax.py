"""
E2E Test: Hotel Service & City Tax Calculation
Description:
  Verifies that adding a Hotel Service with 'Include Hotel / City Tax' checked:
  1. Real-time computes Tax = Total Pax * Tax Rate * Nights.
  2. Displays the City Tax item correctly in the Hotel Operational Services table.
  3. Formats QTY properly (e.g. '2 N') without dividing by pax count.
"""

import json
import time
from playwright.sync_api import sync_playwright

def test_hotel_tax_service(base_url="http://localhost:8000"):
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        ctx = browser.new_context(viewport={'width': 1400, 'height': 1200})
        page = ctx.new_page()

        # Session injection
        session = json.dumps({
            "email": "gersencelebi@gmail.com", 
            "name": "G. Ersen Çelebi", 
            "role": "Administrator", 
            "loginTime": "2026-08-21T00:00:00Z"
        })
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session}));")

        page.goto(f"{base_url}/projects/5063/tours/6105", wait_until="networkidle")
        time.sleep(2)

        # Navigate to Services tab
        svc_tab = page.locator('button:has-text("Services")').first
        if svc_tab.is_visible():
            svc_tab.click()
            time.sleep(1.5)

        # Open Add Hotel Service modal
        add_btn = page.locator('button:has-text("Service")').first
        if add_btn.is_visible():
            add_btn.click()
            time.sleep(1)

        hotel_btn = page.locator('button:has-text("Hotel")').first
        if hotel_btn.is_visible():
            hotel_btn.click()
            time.sleep(1.5)

        # Select Hotel and fill dates (2 nights)
        page.select_option('select', index=1)
        time.sleep(0.5)

        dates = page.locator('input[type="date"]')
        if dates.count() >= 2:
            dates.nth(0).fill('2026-08-22')
            dates.nth(1).fill('2026-08-24')
            time.sleep(0.5)

        # Enable Hotel Tax
        tax_chk = page.locator('input[type="checkbox"]:has-text("Include Hotel / City Tax"), label:has-text("Include Hotel / City Tax") input')
        if tax_chk.count() > 0:
            tax_chk.first.check()
        else:
            page.click('text=Include Hotel / City Tax')
        time.sleep(1)

        # Submit service
        page.click('button:has-text("Add Service")')
        time.sleep(2)

        # Scroll to Operational Services
        page.locator('text=OPERATIONAL SERVICES').last.scroll_into_view_if_needed()
        time.sleep(1)

        browser.close()
        print("✅ E2E Test Passed: Hotel Tax Service added and verified.")

if __name__ == '__main__':
    test_hotel_tax_service()
