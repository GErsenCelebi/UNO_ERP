import os
import sys
import time

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from playwright.sync_api import sync_playwright

def run_test():
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    artifact_dir = "C:/Users/ecele/.gemini/antigravity/brain/9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"
    ss_default_collapsed = os.path.join(artifact_dir, "tours_lanes_default_collapsed_verified.png")
    ss_extended = os.path.join(artifact_dir, "tours_lanes_extended_ss1_verified.png")

    session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=chrome_path if os.path.exists(chrome_path) else None,
            headless=True
        )
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # 1. Login & dark theme setup without any collapse preference in localStorage
        print("Navigating to /login to establish session with clean collapse state...")
        page.goto("http://localhost:8000/login")
        page.evaluate(f'''() => {{
            localStorage.setItem("user_session", '{session_json}');
            localStorage.setItem("theme", "dark");
            localStorage.removeItem("uno_tours_cards_collapsed");
            document.documentElement.classList.add("dark");
        }}''')

        # 2. Go to /tours (Tours Board)
        print("Navigating to http://localhost:8000/tours...")
        page.goto("http://localhost:8000/tours", wait_until="networkidle")
        time.sleep(2)

        # Ensure cards are present
        page.wait_for_selector("[data-testid^='tour-card-']", timeout=10000)
        card_count = page.locator("[data-testid^='tour-card-']").count()
        print(f"Found {card_count} tour cards on the board.")
        assert card_count > 0, "No tour cards found on the board!"

        # Verify DEFAULT state is COLLAPSED (SS2)
        first_card = page.locator("[data-testid^='tour-card-']").first
        first_card_text = first_card.inner_text()
        print(f"First card text on fresh load (should be collapsed): {first_card_text.strip()}")

        # Verify no "Move to…" or pax in collapsed card
        assert "Move to…" not in first_card_text and "Move to" not in first_card_text, "Default view must be COLLAPSED: 'Move to…' must be hidden"
        assert "pax" not in first_card_text.lower(), "Default view must be COLLAPSED: pax must be hidden"

        # Verify button displays 'Extend All'
        collapse_btn = page.locator("[data-testid='toggle-collapse-all']")
        btn_text = collapse_btn.inner_text()
        print(f"Header button text on fresh load: '{btn_text}'")
        assert "Extend" in btn_text, f"Header button should display 'Extend All' by default, got '{btn_text}'"

        box = first_card.bounding_box()
        print(f"First card height: {box['height']}px (expected < 60px)")
        assert box['height'] < 60, f"Collapsed card height should be < 60px, got {box['height']}px"

        page.screenshot(path=ss_default_collapsed)
        print(f"Captured Default Collapsed screenshot: {ss_default_collapsed}")

        # 3. Click 'Extend All'
        print("Clicking 'Extend All' button...")
        collapse_btn.click()
        time.sleep(1)

        first_card_extended = page.locator("[data-testid^='tour-card-']").first
        ext_text = first_card_extended.inner_text()
        assert "Move to" in ext_text, "Extended card should show 'Move to…'"
        assert "pax" in ext_text.lower(), "Extended card should show pax"
        print("Successfully extended all cards!")

        page.screenshot(path=ss_extended)
        print(f"Captured Extended screenshot: {ss_extended}")

        print("\nAll default collapsed checks passed successfully!")
        browser.close()

if __name__ == '__main__':
    run_test()
