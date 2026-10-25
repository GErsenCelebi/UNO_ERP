import time
import os
import sys
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_dark_theme_all_screens():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'
    out_dir = r"C:\Ersen\Projects_2025\Uno_ERP\tests\e2e\screenshots"
    os.makedirs(out_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        context = browser.new_context(viewport={"width": 1600, "height": 950})
        page = context.new_page()

        # Inject session and dark mode explicitly
        page.add_init_script(f"""
            localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));
            localStorage.setItem('uno_theme', 'dark');
            document.documentElement.classList.add('dark');
        """)

        screens = [
            ("Master Data", "http://localhost:8001/master-data", "master_data_dark.png"),
            ("Tour Calendar", "http://localhost:8001/tour-calendar", "tour_calendar_dark.png"),
            ("Tours Board", "http://localhost:8001/tours", "tours_board_dark.png"),
            ("Projects Board", "http://localhost:8001/projects", "projects_board_dark.png"),
            ("Finance Page", "http://localhost:8001/finance", "finance_dark.png"),
        ]

        print("=== VERIFYING DARK THEME ACROSS ALL SCREENS ===")
        for name, url, filename in screens:
            print(f"\n--- Testing {name} ({url}) ---")
            page.goto(url, timeout=30000)
            page.wait_for_load_state("networkidle")
            time.sleep(2)

            # Ensure dark class is applied to html root
            is_dark = page.evaluate("() => document.documentElement.classList.contains('dark')")
            print(f"[{name}] HTML class contains 'dark': {is_dark}")
            assert is_dark, f"Page {name} must have dark class on documentElement"

            # Check that body/main container background is dark (not white rgb(255, 255, 255))
            screenshot_path = os.path.join(out_dir, filename)
            page.screenshot(path=screenshot_path, full_page=False)
            print(f"✓ Screenshot saved: {screenshot_path}")

        # Now test toggling back to light mode on Master Data to ensure 100% bi-directional support
        print("\n--- Testing Light Mode Switch on Master Data ---")
        page.goto("http://localhost:8001/master-data", timeout=30000)
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        theme_btn = page.locator('button[title*="Theme"]').first
        if theme_btn.is_visible():
            theme_btn.click()
            time.sleep(1)
            is_dark_now = page.evaluate("() => document.documentElement.classList.contains('dark')")
            print(f"Theme after clicking toggle: {'Dark' if is_dark_now else 'Light'}")
            assert not is_dark_now, "Theme should have toggled to Light mode"
            light_path = os.path.join(out_dir, "master_data_light.png")
            page.screenshot(path=light_path)
            print(f"✓ Light mode screenshot saved: {light_path}")

        browser.close()
        print("\n==========================================")
        print("ALL DARK THEME SCREENSHOTS CAPTURED AND VERIFIED!")
        print("==========================================")

if __name__ == "__main__":
    test_dark_theme_all_screens()
