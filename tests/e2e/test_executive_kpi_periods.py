import os
import sys
import time

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from playwright.sync_api import sync_playwright

def test_executive_kpi_periods():
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    artifact_dir = "C:/Users/ecele/.gemini/antigravity/brain/17545749-9bee-492a-a1ee-66e33111c72c"
    screenshot_q3 = os.path.join(artifact_dir, "executive_kpis_q3_verified.png")
    screenshot_aug = os.path.join(artifact_dir, "executive_kpis_aug_verified.png")

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
        """)

        print("Navigating to Executive KPI Cockpit...")
        page.goto("http://localhost:8000/dashboard/executive", wait_until="networkidle")
        time.sleep(2)

        def read_kpis():
            cards = page.query_selector_all(".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div")
            data = []
            for c in cards:
                h3 = c.query_selector("h3")
                val_el = c.query_selector(".text-xl, .text-2xl")
                badge_el = c.query_selector(".rounded-full.text-\\[10px\\]")
                foot_el = c.query_selector(".border-t span.font-extrabold")
                if h3 and val_el:
                    data.append({
                        "title": h3.inner_text().strip(),
                        "value": val_el.inner_text().strip(),
                        "badge": badge_el.inner_text().strip().encode('ascii', 'ignore').decode('ascii') if badge_el else "",
                        "footnote": foot_el.inner_text().strip().encode('ascii', 'ignore').decode('ascii') if foot_el else ""
                    })
            return data

        periods = ["Q3 2026", "Jul", "Aug", "Sep", "YTD"]
        results = {}

        for period in periods:
            print(f"\nSelecting period pill: [{period}]...")
            btn = page.locator(f"button:has-text('{period}')").first
            btn.click()
            time.sleep(1.5)

            kpis = read_kpis()
            results[period] = kpis
            print(f"Captured {len(kpis)} cards for {period}:")
            for k in kpis:
                print(f"   [{k['title']}]: Value={k['value']} | Badge={k['badge']} | Footnote={k['footnote']}")

        # Verification: compare Jul vs Aug
        jul = results["Jul"]
        aug = results["Aug"]
        print("\n--- COMPARISON JUL vs AUG ---")
        changed_count = 0
        for i in range(min(len(jul), len(aug))):
            j_val = jul[i]["value"]
            a_val = aug[i]["value"]
            diff = j_val != a_val
            if diff:
                changed_count += 1
            print(f"Card {i+1} [{jul[i]['title']}]: Jul='{j_val}' vs Aug='{a_val}' -> {'CHANGED' if diff else 'SAME'}")

        # Capture screenshots
        print("\nTaking screenshot for Aug...")
        page.locator("button:has-text('Aug')").first.click()
        time.sleep(1)
        page.screenshot(path=screenshot_aug, full_page=True)

        print("Taking screenshot for Q3 2026...")
        page.locator("button:has-text('Q3 2026')").first.click()
        time.sleep(1)
        page.screenshot(path=screenshot_q3, full_page=True)

        browser.close()

        if changed_count >= 5:
            print(f"\n>>> TEST PASSED: {changed_count} KPI cards updated dynamically between periods! <<<")
            return True
        else:
            print(f"\n>>> TEST FAILED: Only {changed_count} cards updated! <<<")
            sys.exit(1)

if __name__ == "__main__":
    test_executive_kpi_periods()
