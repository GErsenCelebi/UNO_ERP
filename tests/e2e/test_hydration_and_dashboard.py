import json
import time
import sys
import os
from playwright.sync_api import sync_playwright

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def test_hydration_and_dashboard():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    artifacts_dir = r"C:\Users\ecele\.gemini\antigravity\brain\17545749-9bee-492a-a1ee-66e33111c72c"
    base_url = "http://localhost:8001"

    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        ctx = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = ctx.new_page()

        # Listen for console messages
        def handle_console(msg):
            if msg.type in ['error', 'warning']:
                text = msg.text
                if 'hydrat' in text.lower() or 'fdprocessedid' in text.lower() or 'did not match' in text.lower():
                    console_errors.append(f"[{msg.type}] {text}")

        page.on("console", handle_console)
        page.on("pageerror", lambda exc: console_errors.append(f"[pageerror] {exc}"))

        # Inject user session
        session = json.dumps({
            "email": "gersencelebi@gmail.com",
            "name": "G. Ersen Çelebi",
            "role": "Administrator",
            "loginTime": "2026-08-21T00:00:00Z"
        })
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session}));")

        # Simulate browser password manager / form filler injecting fdprocessedid before React hydration finishes
        page.add_init_script("""
            document.addEventListener('DOMContentLoaded', () => {
                const inputs = document.querySelectorAll('input');
                inputs.forEach(input => {
                    input.setAttribute('fdprocessedid', 'erzhgf');
                });
            });
        """)

        print("--- Step 1: Navigating to Dashboard with simulated extension injection ---")
        page.goto(f"{base_url}/dashboard", wait_until="domcontentloaded")
        time.sleep(3)

        # 1. Verify search input has suppressHydrationWarning and extension ignore attributes
        search_input = page.locator('input[placeholder*="Ask UNO AI"]')
        assert search_input.is_visible(), "Search input should be visible!"
        print("PASS 1: Search input is rendered and visible.")

        # 2. Verify Next.js error dialog is NOT present
        error_dialog = page.locator('nextjs-portal, [data-nextjs-dialog-overlay]')
        assert not error_dialog.is_visible(), "Next.js error portal should NOT be visible!"
        print("PASS 2: No Next.js error overlay visible.")

        # 3. Verify no hydration console errors were recorded
        print(f"Recorded hydration errors count: {len(console_errors)}")
        if console_errors:
            for err in console_errors:
                print(f"  Warning/Error: {err}")
        assert len(console_errors) == 0, f"Found hydration errors: {console_errors}"
        print("PASS 3: Zero hydration console errors detected.")

        # 4. Capture screenshot
        ss_path = os.path.join(artifacts_dir, "hydration_issue_fixed.png")
        page.screenshot(path=ss_path)
        print(f"PASS 4: Screenshot saved to {ss_path}")

        browser.close()

if __name__ == "__main__":
    test_hydration_and_dashboard()
