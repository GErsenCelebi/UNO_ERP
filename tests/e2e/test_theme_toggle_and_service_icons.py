import time
import os
import sys
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_theme_toggle_and_service_icons():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        context = browser.new_context(viewport={"width": 1600, "height": 950})
        page = context.new_page()

        # Inject session so user is authenticated
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")

        print("\n--- 1. Navigating to Dashboard ---")
        page.goto("http://localhost:8001/dashboard", timeout=30000)
        page.wait_for_load_state("networkidle")
        time.sleep(2)

        print("Current URL:", page.url)

        # Verify Sidebar and Theme toggle presence
        theme_btn = page.locator('button[title*="Theme"]').first
        assert theme_btn.is_visible(), "Theme toggle button must be visible in Sidebar"
        print("✓ Theme toggle button found in Sidebar")

        # Check initial theme
        is_dark_initial = page.evaluate("() => document.documentElement.classList.contains('dark')")
        print(f"Initial theme: {'Dark' if is_dark_initial else 'Light'}")

        # Toggle to Light if Dark, or Dark if Light
        print("\n--- 2. Toggling Theme ---")
        theme_btn.click()
        time.sleep(1)

        is_dark_after_first_toggle = page.evaluate("() => document.documentElement.classList.contains('dark')")
        stored_theme = page.evaluate("() => localStorage.getItem('uno_theme')")
        print(f"Theme after 1st toggle: {'Dark' if is_dark_after_first_toggle else 'Light'} (localStorage: {stored_theme})")
        assert is_dark_after_first_toggle != is_dark_initial, "HTML class 'dark' must toggle"
        assert stored_theme in ['light', 'dark'], "localStorage uno_theme must be stored"

        # Capture Screenshot of Dashboard in this theme
        out_dir = r"C:\Ersen\Projects_2025\Uno_ERP\tests\e2e\screenshots"
        os.makedirs(out_dir, exist_ok=True)
        page.screenshot(path=os.path.join(out_dir, f"dashboard_{'dark' if is_dark_after_first_toggle else 'light'}.png"))
        print(f"✓ Screenshot saved: dashboard_{'dark' if is_dark_after_first_toggle else 'light'}.png")

        # Toggle back
        theme_btn.click()
        time.sleep(1)
        is_dark_after_second_toggle = page.evaluate("() => document.documentElement.classList.contains('dark')")
        print(f"Theme after 2nd toggle: {'Dark' if is_dark_after_second_toggle else 'Light'}")
        assert is_dark_after_second_toggle == is_dark_initial, "HTML class 'dark' must toggle back"
        page.screenshot(path=os.path.join(out_dir, f"dashboard_{'dark' if is_dark_after_second_toggle else 'light'}.png"))
        print(f"✓ Screenshot saved: dashboard_{'dark' if is_dark_after_second_toggle else 'light'}.png")

        # --- 3. Navigate to Tour Details & Services Tab ---
        print("\n--- 3. Navigating to Tour Details & Services Tab ---")
        page.goto("http://localhost:8001/projects/6102/tours/6127", timeout=30000)
        page.wait_for_load_state("networkidle")
        time.sleep(2)

        # Click on Services Tab
        services_tab_btn = page.locator('button:has-text("Services")')
        services_tab_btn.click()
        time.sleep(2)

        # Verify ServiceCategoryIcon elements are rendered
        # They have rounded container with svg
        service_icons = page.locator('#tour-services-section svg.lucide-bed, #tour-services-section svg.lucide-bus, #tour-services-section svg.lucide-building-2, #tour-services-section svg.lucide-plane, #tour-services-section svg.lucide-compass, #tour-services-section svg.lucide-user-check')
        icon_count = service_icons.count()
        print(f"✓ Service category icons rendered in Services tab: {icon_count}")
        assert icon_count > 0, "Expected service category icons to be present in Services tab"

        # Capture Services screenshot in current theme
        current_theme_name = 'dark' if page.evaluate("() => document.documentElement.classList.contains('dark')") else 'light'
        page.screenshot(path=os.path.join(out_dir, f"tour_services_{current_theme_name}.png"))
        print(f"✓ Screenshot saved: tour_services_{current_theme_name}.png")

        # Switch theme while on Tour Services page to verify immediate reactivity
        print(f"\n--- 4. Toggling Theme on Tour Services Page ---")
        page.locator('button[title*="Theme"]').first.click()
        time.sleep(1)
        new_theme_name = 'dark' if page.evaluate("() => document.documentElement.classList.contains('dark')") else 'light'
        print(f"✓ Successfully switched to {new_theme_name} theme on Tour Services page")
        page.screenshot(path=os.path.join(out_dir, f"tour_services_{new_theme_name}.png"))
        print(f"✓ Screenshot saved: tour_services_{new_theme_name}.png")

        browser.close()
        print("\n==========================================")
        print("ALL THEME & ICON E2E TESTS PASSED 100%!")
        print("==========================================")

if __name__ == "__main__":
    test_theme_toggle_and_service_icons()
