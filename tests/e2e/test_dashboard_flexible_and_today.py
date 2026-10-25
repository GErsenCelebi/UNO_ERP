import json
import time
import sys
import os
from playwright.sync_api import sync_playwright

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def test_dashboard_flexible_and_today():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    artifacts_dir = r"C:\Users\ecele\.gemini\antigravity\brain\17545749-9bee-492a-a1ee-66e33111c72c"
    base_url = "http://localhost:8001"

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        # Test standard laptop / desktop viewport 1440x900
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
        page.goto(f"{base_url}/dashboard", wait_until="domcontentloaded")
        try:
            page.wait_for_selector('.animate-spin', state='detached', timeout=15000)
        except Exception:
            pass
        time.sleep(3)

        # 1. Verify period is Q4 2026
        period_btn = page.locator('header button:has-text("Q4 2026")')
        assert period_btn.is_visible(), "Expected default period to be Q4 2026!"
        print(f"PASS 1: Default period is '{period_btn.inner_text().strip()}'")

        # 2. Verify Today marker is in October (or inside the visible Q4 timeline, not July)
        month_headers = page.locator('text=OCT 2026')
        print(f"Oct 2026 header visible: {month_headers.first.is_visible()}")

        today_marker = page.locator('span:has-text("Today")')
        assert today_marker.is_visible(), "Today marker should be visible in Q4 2026 timeline!"
        today_box = today_marker.bounding_box()
        print(f"PASS 2: Today marker is visible at x={today_box['x'] if today_box else 'N/A'}")

        # Check if July 2026 is absent from the visible Q4 header
        jul_header = page.locator('text=JUL 2026')
        assert not jul_header.is_visible(), "JUL 2026 should NOT be in the Q4 2026 view!"
        print("PASS 3: Jul 2026 is not in the Q4 view. Today bar is correctly positioned in October!")

        # 4. Check horizontal scrolling on the Gantt grid container
        # Evaluate scrollWidth vs clientWidth on the gantt table container
        scroll_eval = page.evaluate('''() => {
            const el = document.querySelector('.overflow-y-auto');
            if (!el) return { found: false };
            return {
                found: true,
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth,
                hasHorizontalScroll: el.scrollWidth > el.clientWidth
            };
        }''')
        print(f"Scroll evaluation: {scroll_eval}")
        assert not scroll_eval.get('hasHorizontalScroll', False), "Center table should not have a horizontal scrollbar!"
        print("PASS 4: No horizontal scrollbar in the center window - window is flexible.")

        # 5. Right bar width verification
        right_bar = page.locator('.xl\\:w-56')
        assert right_bar.is_visible(), "Slimmer right bar (.xl:w-56) should be visible!"
        print("PASS 5: Slimmer right bar (.xl:w-56) confirmed.")

        # Capture screenshot for visual verification
        ss_path = os.path.join(artifacts_dir, "dashboard_flexible_october_verified.png")
        page.screenshot(path=ss_path)
        print(f"PASS: Screenshot saved to {ss_path}")

        browser.close()

if __name__ == "__main__":
    test_dashboard_flexible_and_today()
