import os
import sys
from playwright.sync_api import sync_playwright

def test_executive_no_hydration_error():
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    artifact_dir = "C:/Users/ecele/.gemini/antigravity/brain/17545749-9bee-492a-a1ee-66e33111c72c"
    screenshot_path = os.path.join(artifact_dir, "executive_no_hydration_error.png")

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

        # Also inject fdprocessedid to test extension resilience!
        page.add_init_script(f"""
            localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));
            document.addEventListener('DOMContentLoaded', () => {{
                document.querySelectorAll('button').forEach((b, i) => {{
                    b.setAttribute('fdprocessedid', 'test_' + i);
                }});
            }});
        """)

        print("[1] Navigating to http://localhost:8000/dashboard/executive...")
        page.goto("http://localhost:8000/dashboard/executive", wait_until="networkidle")
        page.wait_for_timeout(3000)

        # Check for error overlay
        error_overlay = page.locator('nextjs-portal, [data-nextjs-dialog]')
        print(f"Error dialog count: {error_overlay.count()}")

        header = page.locator('h1:has-text("Executive KPI Cockpit")')
        print(f"Header visible: {header.is_visible()}")

        # Verify Q3 2026 button
        q3_btn = page.locator('button:has-text("Q3 2026")')
        print(f"Q3 button visible: {q3_btn.is_visible()}")

        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Saved screenshot to {screenshot_path}")

        # Filter console errors for hydration errors
        hydration_errors = [e for e in console_errors if "hydration" in e.lower() or "hydrated" in e.lower() or "fdprocessedid" in e.lower()]
        print(f"Hydration errors found: {len(hydration_errors)}")
        if hydration_errors:
            for err in hydration_errors:
                print(f"  ERR: {err}")
        else:
            print("PASS: Zero hydration errors detected!")

        browser.close()

if __name__ == "__main__":
    test_executive_no_hydration_error()
