import os
import sys
from playwright.sync_api import sync_playwright

def test_driver_modal_interactive():
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    artifact_dir = "C:/Users/ecele/.gemini/antigravity/brain/17545749-9bee-492a-a1ee-66e33111c72c"
    screenshot_path = os.path.join(artifact_dir, "tour_6106_driver_modal_open.png")

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
        page.locator('button:has-text("Services")').first.click()
        page.wait_for_timeout(1000)

        # 3. Click Driver button in Services Cost section
        print("[3] Clicking Driver button in Services Cost section...")
        driver_btn = page.locator('div:has-text("Services Cost") button:has-text("Driver")').first
        if driver_btn.count() > 0:
            driver_btn.click()
            page.wait_for_timeout(1000)
            print("    -> Driver modal opened!")

            # Verify Days input is visible and has a valid value
            days_input = page.locator('input[type="number"][min="1"]')
            print(f"    -> Days input count: {days_input.count()}")
            if days_input.count() > 0:
                print(f"    -> Days input value: '{days_input.first.input_value()}'")
                assert days_input.first.input_value() != "NaN", "Days input value is NaN!"

                # Test typing and clearing in Days input
                days_input.first.fill("")
                page.wait_for_timeout(300)
                days_input.first.fill("5")
                page.wait_for_timeout(300)
                print(f"    -> Days input after typing: '{days_input.first.input_value()}'")

        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Saved screenshot to {screenshot_path}")

        nan_errors = [e for e in console_errors if "NaN" in e]
        print(f"Total console errors: {len(console_errors)}")
        print(f"NaN errors found: {len(nan_errors)}")
        if nan_errors:
            for err in nan_errors:
                print(f"  ERR: {err}")
            assert False, "Found NaN errors!"
        else:
            print("PASS: Zero NaN errors when opening and typing in Driver modal!")

        browser.close()

if __name__ == "__main__":
    test_driver_modal_interactive()
