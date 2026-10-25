import os
import time
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\ecele\.gemini\antigravity\brain\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"
BASE_URL = "http://localhost:8001"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def run_guide_portal_tests():
    session_json = '{"email":"gersencelebi@gmail.com","name":"G. Ersen Çelebi","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME_PATH, headless=True)
        context = browser.new_context(viewport={"width": 1400, "height": 900})
        page = context.new_page()
        page.on("request", lambda req: print(f"REQUEST: {req.method} {req.url}"))
        page.on("response", lambda res: print(f"RESPONSE: {res.status} {res.url}") if res.status >= 400 else None)
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")

        print("[1] Navigating to Tour 6128 (/projects/6101/tours/6128)...")
        page.goto(f"{BASE_URL}/projects/6101/tours/6128", wait_until="networkidle")
        time.sleep(2)

        # 1. Verify 4th tab: Guide Sales
        print("[2] Clicking Guide Sales tab...")
        guide_tab = page.locator('button:has-text("Guide Sales")')
        assert guide_tab.is_visible(), "Guide Sales tab is not visible"
        guide_tab.click()
        time.sleep(2)

        print("[2.1] Body text snippet:", page.locator('body').inner_text()[:600].encode('ascii', errors='replace').decode('ascii'))
        assert page.locator('text=ABCDTEST').first.is_visible(), "Tour title ABCDTEST not visible"
        assert page.locator('text=Mehmet').first.is_visible(), "Guide Mehmet not visible"
        assert page.locator('text=Base Comm: 10.0%').first.is_visible(), "Base commission 10.0% not visible"

        # 3. Verify Excursion Selector and Matrix Table
        print("[3] Verifying Excursions in Scope and multi-selector...")
        assert page.locator('text=Excursions in Scope').is_visible(), "Excursions in Scope section not visible"
        
        # Click Browse Catalog to open multi-select catalog drawer
        browse_btn = page.locator('button:has-text("Browse Catalog")')
        if browse_btn.is_visible():
            browse_btn.click()
            time.sleep(1)
            assert page.locator('input[placeholder*="Search excursions"]').is_visible(), "Catalog search not visible"
            # Close catalog drawer
            browse_btn.click()
            time.sleep(0.5)

        # 3.1 Verify Payment Mode in Action Bar and absence in Table Columns
        print("[3.1] Verifying Payment Mode moved to Action Bar and removed from Table columns...")
        action_bar_payment_label = page.locator('span:has-text("Payment Mode:")')
        assert action_bar_payment_label.is_visible(), "Payment Mode label missing in action bar!"
        payment_select = page.locator('select:has(option:has-text("Cash EUR"))')
        assert payment_select.is_visible(), "Payment Mode select missing in action bar!"
        
        table_payment_th = page.locator('table thead th:has-text("Payment Mode")')
        assert table_payment_th.count() == 0, "Payment Mode column still present in table header!"
        print("PASS: Payment Mode is in Action Bar and removed from Table!")

        # 4. Verify Passenger Matrix Rows
        print("[4] Verifying passenger rows and toggle interaction...")
        assert page.locator('text=Can Demir').first.is_visible(), "Passenger Can Demir not found"
        assert page.locator('text=Elif Demir').first.is_visible(), "Passenger Elif Demir not found"
        assert page.locator('text=CHD').first.is_visible(), "Child badge CHD not found"

        # 5. Test Quick 'All On' button
        print("[5] Testing 'All On' action...")
        all_on_btn = page.locator('button:has-text("All On")')
        all_on_btn.click()
        time.sleep(1)

        # Verify summary counts updated
        tickets_elem = page.locator('text=tickets').first
        assert tickets_elem.is_visible(), "Tickets count not visible"

        # 6. Test passenger search filter
        print("[6] Testing passenger search filter...")
        search_input = page.locator('input[placeholder*="Filter passenger"]')
        search_input.fill("Can Demir")
        time.sleep(1)
        assert page.locator('text=Can Demir').first.is_visible(), "Can Demir should be visible in filtered list"
        assert not page.locator('text=Burak Kaya').is_visible(), "Burak Kaya should be filtered out"
        search_input.fill("")
        time.sleep(1)

        # 7. Submit Guide Settlement
        print("[7] Submitting Guide Settlement...")
        submit_btn = page.locator('button:has-text("Submit Guide Settlement"), button:has-text("Re-Submit")')
        assert submit_btn.is_visible(), "Submit button not visible"
        submit_btn.click()
        time.sleep(3)

        # Verify confirmation toast or settled badge
        assert page.locator('text=Settled').first.is_visible(), "Settled status badge not visible"
        print("[+] Settlement submitted and confirmed successfully!")

        # Capture In-App Tab Screenshot
        tab_screenshot_path = os.path.join(ARTIFACT_DIR, "guide_excursion_sales_portal_inapp.png")
        page.screenshot(path=tab_screenshot_path, full_page=False)
        print(f"[+] Saved tab screenshot to {tab_screenshot_path}")

        # 8. Test Mobile Direct View (/guide/tours/6128)
        print("[8] Testing Mobile Direct Route (/guide/tours/6128)...")
        mobile_context = browser.new_context(viewport={"width": 414, "height": 896})
        mobile_page = mobile_context.new_page()
        mobile_page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")

        mobile_page.goto(f"{BASE_URL}/guide/tours/6128", wait_until="networkidle")
        time.sleep(2)

        assert mobile_page.locator('text=Guide Portal').first.is_visible(), "Mobile Guide Portal header not found"
        assert mobile_page.locator('text=ABCDTEST').first.is_visible(), "Mobile Tour Title not found"

        mobile_screenshot_path = os.path.join(ARTIFACT_DIR, "guide_excursion_sales_portal_mobile.png")
        mobile_page.screenshot(path=mobile_screenshot_path, full_page=False)
        print(f"[+] Saved mobile screenshot to {mobile_screenshot_path}")

        browser.close()
        print("[SUCCESS] All Guide Excursion Sales Portal tests passed!")

if __name__ == "__main__":
    run_guide_portal_tests()
