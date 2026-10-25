import json
import time
import sys
import os
from playwright.sync_api import sync_playwright

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def test_header_and_account_cleanup():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    artifacts_dir = r"C:\Users\ecele\.gemini\antigravity\brain\17545749-9bee-492a-a1ee-66e33111c72c"
    base_url = "http://localhost:8001"

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        ctx = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = ctx.new_page()

        session = json.dumps({
            "email": "gersencelebi@gmail.com",
            "name": "G. Ersen Çelebi",
            "role": "Administrator",
            "loginTime": "2026-08-21T00:00:00Z"
        })
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session}));")

        print("--- Step 1: Navigating to Dashboard ---")
        page.goto(f"{base_url}/dashboard", wait_until="networkidle")
        time.sleep(2)

        # 1. Verify "ERP" in Sidebar without "UNO" before it
        sidebar_logo_text = page.locator('aside span.font-extrabold:has-text("ERP")')
        assert sidebar_logo_text.is_visible(), "Sidebar should display 'ERP'!"
        text_content = sidebar_logo_text.inner_text().strip()
        print(f"Sidebar text: '{text_content}'")
        assert text_content == "ERP", f"Expected 'ERP' but got '{text_content}'"
        print("PASS 1: 'UNO' before 'ERP' removed in Sidebar - now displays 'ERP'.")

        # 2. Verify "OPERATIONS HUD" and "LIVE" are removed
        hud_text = page.locator('header span:has-text("OPERATIONS HUD")')
        assert not hud_text.is_visible(), "OPERATIONS HUD should NOT be visible in header!"
        print("PASS 2: 'OPERATIONS HUD' completely removed.")

        # 3. Verify top-right user account is removed
        top_user_profile = page.locator('header p:has-text("G. Ersen Çelebi")')
        assert not top_user_profile.is_visible(), "Top right user account section should NOT be visible!"
        print("PASS 3: Duplicate user account section in top-right header removed.")

        # 4. Verify left menu (Sidebar) user account IS preserved
        sidebar_user = page.locator('aside span:has-text("G. Ersen Çelebi")').first
        assert sidebar_user.is_visible(), "Left menu user account section should still be visible!"
        print("PASS 4: Left menu user account section is present and preserved.")

        # Capture screenshot for visual confirmation
        ss_path = os.path.join(artifacts_dir, "header_cleanup_verified.png")
        page.screenshot(path=ss_path)
        print(f"PASS: Screenshot saved to {ss_path}")

        browser.close()

if __name__ == "__main__":
    test_header_and_account_cleanup()
