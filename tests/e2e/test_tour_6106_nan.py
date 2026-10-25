import os
import sys
from playwright.sync_api import sync_playwright

def test_tour_6106_no_nan_error():
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    artifact_dir = "C:/Users/ecele/.gemini/antigravity/brain/17545749-9bee-492a-a1ee-66e33111c72c"
    screenshot_path = os.path.join(artifact_dir, "tour_6106_driver_modal_fixed.png")

    session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=chrome_path if os.path.exists(chrome_path) else None,
            headless=True
        )
        context = browser.new_context(viewport={"width": 1400, "height": 1050})
        page = context.new_page()

        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type in ["error"] else None)

        page.add_init_script(f"""
            localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));
        """)

        print("[1] Navigating to http://localhost:8000/projects/5063/tours/6106...")
        page.goto("http://localhost:8000/projects/5063/tours/6106", wait_until="networkidle")
        page.wait_for_timeout(2000)

        # 2. Click Services tab
        print("[2] Clicking Services tab...")
        services_tab = page.locator('button:has-text("Services")')
        if services_tab.count() > 0:
            services_tab.first.click()
            page.wait_for_timeout(1000)

        # 3. Look for Driver service or click Add Service
        print("[3] Testing Add Service / Driver modal...")
        add_svc_btn = page.locator('button:has-text("Add Service")')
        if add_svc_btn.count() > 0:
            add_svc_btn.first.click()
            page.wait_for_timeout(1000)

            # Check if there is a Service Type selector or Driver button
            driver_btn = page.locator('button:has-text("Driver"), select:has-text("Driver")')
            if driver_btn.count() > 0:
                print("    -> Found Driver option, clicking it...")
                driver_btn.first.click()
                page.wait_for_timeout(500)

        # 4. Check for any edit buttons on existing Driver rows
        edit_driver_btn = page.locator('tr:has-text("Driver") button:has-text("Edit")')
        if edit_driver_btn.count() > 0:
            print("    -> Clicking Edit on existing Driver service...")
            edit_driver_btn.first.click()
            page.wait_for_timeout(1000)

        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Saved screenshot to {screenshot_path}")

        nan_errors = [e for e in console_errors if "NaN" in e]
        print(f"Total console errors: {len(console_errors)}")
        print(f"NaN errors found: {len(nan_errors)}")
        if nan_errors:
            for err in nan_errors:
                print(f"  ERR: {err}")
        else:
            print("PASS: Zero NaN errors detected!")

        browser.close()

if __name__ == "__main__":
    test_tour_6106_no_nan_error()
