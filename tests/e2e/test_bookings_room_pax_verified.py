import os
import sys
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

with sync_playwright() as p:
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    browser = p.chromium.launch(
        executable_path=chrome_path if os.path.exists(chrome_path) else None,
        headless=True
    )
    page = browser.new_page(viewport={"width": 1440, "height": 1050})
    page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")
    page.goto("http://localhost:8001/projects/5063/tours/6105", wait_until="networkidle")
    page.wait_for_timeout(1000)

    # Click Bookings tab
    bookings_tab = page.locator('button:has-text("Bookings")')
    if bookings_tab.count() > 0:
        bookings_tab.click()
        page.wait_for_timeout(1500)

        # Verify Room cells are populated
        room_cells = page.locator('td.font-extrabold:has-text("Room")')
        count = room_cells.count()
        print(f"[+] Found {count} rendered 'Room #' cells in the Bookings table.")
        assert count > 0, "Expected 'Room #' cells to be rendered with room numbers, not '-'!"

        page.screenshot(path="C:/Users/ecele/.gemini/antigravity/brain/da3d7774-c465-41fb-9db4-d75aebe21ab7/bookings_tab_room_and_pax_verified.png")
        print("[+] Screenshot saved: bookings_tab_room_and_pax_verified.png")

    browser.close()
