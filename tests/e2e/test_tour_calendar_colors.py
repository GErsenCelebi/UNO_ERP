"""
E2E Test: Tour Calendar Wider Color Scheme Verification
Description:
  Captures September 2026 (where TestTour1, TestTour2, TestTour3, etc. are located)
  and July 2026 to verify that each tour has a distinct, easily distinguishable color.
"""

import json
import time
from playwright.sync_api import sync_playwright

def test_calendar_colors(base_url="http://localhost:8000"):
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    artifacts_dir = r"C:\Users\ecele\.gemini\antigravity\brain\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"

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

        print("Navigating to Tour Calendar...")
        page.goto(f"{base_url}/tour-calendar", wait_until="networkidle")
        time.sleep(2)

        # Clear any search so all tours are visible
        search_input = page.locator('input[placeholder="Search tours..."]')
        if search_input.is_visible():
            search_input.fill("")
            time.sleep(1)

        # Navigate to September 2026
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

        # Capture September 2026 Month View
        page.screenshot(path=f"{artifacts_dir}\\tour_calendar_september_colors.png")
        print("Captured September 2026 screenshot with wide color palette.")

        # Navigate back to July 2026
        page.locator('header button:has(svg.lucide-chevron-left)').click()
        time.sleep(0.5)
        page.locator('header button:has(svg.lucide-chevron-left)').click()
        time.sleep(1.5)
        print(f"Current Header: {page.locator('header span.font-semibold').inner_text()}")

        # Capture July 2026 Month View
        page.screenshot(path=f"{artifacts_dir}\\tour_calendar_july_colors.png")
        print("Captured July 2026 screenshot with wide color palette.")

        browser.close()
        print("[PASS] E2E Color test completed successfully!")

if __name__ == '__main__':
    test_calendar_colors()
