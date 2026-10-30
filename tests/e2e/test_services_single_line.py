import os
import sys
import time

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from playwright.sync_api import sync_playwright

def test_services_single_line():
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    artifact_dir = "C:/Users/ecele/.gemini/antigravity/brain/17545749-9bee-492a-a1ee-66e33111c72c"
    screenshot1 = os.path.join(artifact_dir, "services_single_line_verified.png")
    screenshot2 = os.path.join(artifact_dir, "services_dropdown_open_verified.png")
    screenshot_light = os.path.join(artifact_dir, "services_single_line_light_verified.png")
    screenshot_light_dropdown = os.path.join(artifact_dir, "services_dropdown_open_light_verified.png")

    session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=chrome_path if os.path.exists(chrome_path) else None,
            headless=True
        )
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        # Seed auth in localStorage
        page.goto("http://localhost:8000/login")
        page.evaluate(f'''() => {{
            localStorage.setItem("user_session", '{session_json}');
            localStorage.setItem("theme", "dark");
            document.documentElement.classList.add("dark");
        }}''')

        # Go to tour 6102
        tour_url = "http://localhost:8000/projects/5063/tours/6102"
        print(f"Navigating to {tour_url}...")
        page.goto(tour_url, wait_until="networkidle")
        time.sleep(2)

        # Switch to Services tab
        services_tab = page.locator("button:has-text('Services')")
        if services_tab.count() > 0:
            services_tab.first.click()
            time.sleep(1)

        # Scroll to Services Cost section
        cost_title = page.locator("h2:has-text('Services Cost')")
        cost_title.scroll_into_view_if_needed()
        time.sleep(0.5)

        # Capture dark single-line header verification
        page.screenshot(path=screenshot1)
        print(f"Captured: {screenshot1}")

        # Click on the More button in Services Cost to open dropdown
        more_btn = page.locator("button:has-text('More')").last
        if more_btn.is_visible():
            more_btn.click()
            time.sleep(0.5)
            page.screenshot(path=screenshot2)
            print(f"Captured dropdown open: {screenshot2}")

        # Now test Light Mode
        page.evaluate('''() => {
            localStorage.setItem("theme", "light");
            document.documentElement.classList.remove("dark");
        }''')
        time.sleep(0.5)
        page.screenshot(path=screenshot_light_dropdown)
        print(f"Captured light dropdown: {screenshot_light_dropdown}")

        # Close dropdown by clicking title
        cost_title.click()
        time.sleep(0.5)
        page.screenshot(path=screenshot_light)
        print(f"Captured light single-line: {screenshot_light}")

        browser.close()
        print("All tests completed successfully!")

if __name__ == "__main__":
    test_services_single_line()
