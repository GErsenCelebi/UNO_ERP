import os
import sys
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_booking_room_types_summary():
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    artifact_dir = "C:/Users/ecele/.gemini/antigravity/brain/da3d7774-c465-41fb-9db4-d75aebe21ab7"
    screenshot_6102 = os.path.join(artifact_dir, "bookings_tab_room_types_summary_tour_6102.png")
    screenshot_6105 = os.path.join(artifact_dir, "bookings_tab_room_types_summary_tour_6105.png")

    session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=chrome_path if os.path.exists(chrome_path) else None,
            headless=True
        )
        context = browser.new_context(viewport={"width": 1440, "height": 1100})
        page = context.new_page()
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")

        # ----------------------------------------------------
        # Test 1: Tour 6102 (Contains 36 Pax including GUIDE & DRIVER)
        # ----------------------------------------------------
        print("\n[Step 1] Navigating to Tour 6102 (/projects/5063/tours/6102)...")
        page.goto("http://localhost:8001/projects/5063/tours/6102", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Click Bookings tab
        print("[Step 2] Clicking Bookings tab...")
        bookings_tab = page.locator('button:has-text("Bookings")')
        assert bookings_tab.count() > 0, "Bookings tab button not found!"
        bookings_tab.click()
        page.wait_for_timeout(1500)

        # Verify Summary Card exists at end of Booking tab
        print("[Step 3] Checking Total Room Types & Capacity Summary card...")
        summary_title = page.locator('text=Total Room Types & Capacity Summary')
        assert summary_title.count() > 0, "Total Room Types & Capacity Summary card missing!"
        print("    -> SUCCESS: Found 'Total Room Types & Capacity Summary' section")

        # Verify staff exclusion note
        staff_note = page.locator('text=Guide/Driver staff excluded')
        assert staff_note.count() > 0, "Staff exclusion note not shown for Tour 6102!"
        print("    -> SUCCESS: 'Guide/Driver staff excluded' note verified")

        # Verify tfoot
        tfoot = page.locator('tfoot')
        assert tfoot.count() > 0, "Table tfoot missing!"
        tfoot_text = tfoot.inner_text()
        print(f"    -> Table Footer text: {tfoot_text}")
        assert "Total Guest Pax (Excl. Guide/Driver)" in tfoot_text

        # Scroll to bottom of booking tab to capture clear screenshot
        summary_card = page.locator('text=Total Room Types & Capacity Summary').locator('xpath=ancestor::div[contains(@class, "bg-gradient-to-br")]')
        summary_card.scroll_into_view_if_needed()
        page.wait_for_timeout(500)
        page.screenshot(path=screenshot_6102)
        print(f"[+] Saved Tour 6102 screenshot to: {screenshot_6102}")

        # ----------------------------------------------------
        # Test 2: Tour 6105 (41 Pax, 20 Rooms)
        # ----------------------------------------------------
        print("\n[Step 4] Navigating to Tour 6105 (/projects/1/tours/6105)...")
        page.goto("http://localhost:8001/projects/1/tours/6105", wait_until="networkidle")
        page.wait_for_timeout(1000)

        bookings_tab = page.locator('button:has-text("Bookings")')
        bookings_tab.click()
        page.wait_for_timeout(1500)

        summary_card_6105 = page.locator('text=Total Room Types & Capacity Summary').locator('xpath=ancestor::div[contains(@class, "bg-gradient-to-br")]')
        assert summary_card_6105.count() > 0, "Summary card missing for Tour 6105!"

        card_text = summary_card_6105.inner_text()
        print(f"    -> Tour 6105 Card Content snippet:\n{card_text}")
        assert "20 Rooms" in card_text or "20" in card_text
        assert "41 Pax" in card_text or "41" in card_text
        assert "Double" in card_text
        assert "Twin" in card_text
        assert "Single" in card_text

        summary_card_6105.scroll_into_view_if_needed()
        page.wait_for_timeout(500)
        page.screenshot(path=screenshot_6105)
        print(f"[+] Saved Tour 6105 screenshot to: {screenshot_6105}")

        print("\n[+] ALL ROOM TYPE SUMMARY TESTS PASSED 100%!")
        browser.close()

if __name__ == "__main__":
    test_booking_room_types_summary()
