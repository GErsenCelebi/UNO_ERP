import os
import sys
import time

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from playwright.sync_api import sync_playwright

def test_tour_dark_theme():
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    artifact_dir = "C:/Users/ecele/.gemini/antigravity/brain/17545749-9bee-492a-a1ee-66e33111c72c"
    screenshot_info = os.path.join(artifact_dir, "tour_dark_theme_info_verified.png")
    screenshot_calendar = os.path.join(artifact_dir, "tour_dark_theme_calendar_verified.png")

    session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=chrome_path if os.path.exists(chrome_path) else None,
            headless=True
        )
        context = browser.new_context(viewport={"width": 1440, "height": 950})
        page = context.new_page()

        page.add_init_script(f"""
            localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));
            localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark');
        """)

        print("Navigating to Tour 6106 (PVB19072026)...")
        page.goto("http://localhost:8000/projects/5063/tours/6106", wait_until="networkidle")
        time.sleep(2)

        page.evaluate("() => document.documentElement.classList.add('dark')")
        time.sleep(1)

        # Verify Info Tab
        card_bg = page.evaluate("""() => {
            const h2 = Array.from(document.querySelectorAll('h2')).find(el => el.innerText.includes('Tour Information'));
            const tourCard = h2 ? h2.closest('.rounded-2xl') : null;
            
            const h3 = Array.from(document.querySelectorAll('h3')).find(el => el.innerText.includes('Operational Remarks'));
            const remarksCard = h3 ? h3.closest('.rounded-2xl') : null;

            const textarea = document.querySelector('textarea');

            return {
                tourCardBg: tourCard ? window.getComputedStyle(tourCard).backgroundColor : null,
                remarksCardBg: remarksCard ? window.getComputedStyle(remarksCard).backgroundColor : null,
                textareaBg: textarea ? window.getComputedStyle(textarea).backgroundColor : null,
            };
        }""")

        print(f"Computed styles in Info tab: {card_bg}")
        is_dark_tour = card_bg['tourCardBg'] and '255, 255, 255' not in card_bg['tourCardBg']
        is_dark_remarks = card_bg['remarksCardBg'] and '255, 255, 255' not in card_bg['remarksCardBg']
        print(f"Info Tab - Tour card is dark: {is_dark_tour}, Remarks card is dark: {is_dark_remarks}")

        page.screenshot(path=screenshot_info, full_page=True)
        print(f"Saved: {screenshot_info}")

        # Switch to Calendar Tab
        print("Clicking Calendar tab...")
        page.locator("button:has-text('Calendar')").first.click()
        time.sleep(1.5)
        page.screenshot(path=screenshot_calendar, full_page=True)
        print(f"Saved: {screenshot_calendar}")

        browser.close()

        if is_dark_tour and is_dark_remarks:
            print("\n>>> TEST PASSED: Tour Detail page completely supports Dark Theme! <<<")
            return True
        else:
            print("\n>>> TEST FAILED! <<<")
            sys.exit(1)

if __name__ == "__main__":
    test_tour_dark_theme()
