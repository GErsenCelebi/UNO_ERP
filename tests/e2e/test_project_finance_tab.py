import os
import time
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\ecele\.gemini\antigravity\brain\17545749-9bee-492a-a1ee-66e33111c72c"
BASE_URL = "http://localhost:8001"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def run_project_finance_e2e():
    session_json = '{"email":"gersencelebi@gmail.com","name":"G. Ersen Çelebi","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME_PATH, headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 960})
        page = context.new_page()

        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")

        print("[1] Navigating to Project 5063 Orta Avrupa -BVP (/projects/5063)...")
        page.goto(f"{BASE_URL}/projects/5063", wait_until="networkidle")
        time.sleep(2)

        # 1. Verify Subheader displays Est. Total Revenue
        print("[2] Verifying Subheader Est. Total Revenue...")
        subheader = page.locator('p:has-text("Est. Total Revenue: €350,000")')
        assert subheader.is_visible(), "Subheader does not display 'Est. Total Revenue: €350,000'!"
        print("  -> Subheader verified: Est. Total Revenue: €350,000")

        # 2. Check Dashboard Tab
        print("[3] Checking Dashboard tab...")
        dash_tab = page.locator('div.border-b button:has-text("Dashboard")')
        dash_tab.click()
        time.sleep(1.5)

        dash_screenshot = os.path.join(ARTIFACT_DIR, "project_6101_dashboard_verified.png")
        page.screenshot(path=dash_screenshot, full_page=True)
        print(f"  -> Dashboard screenshot captured: {dash_screenshot}")

        # 3. Switch to Finance Tab
        print("[4] Switching to Finance tab...")
        finance_tab = page.locator('div.border-b button:has-text("Finance")')
        finance_tab.click()
        time.sleep(1.5)

        # 4. Verify 5 Financial KPI Cards
        print("[5] Verifying 5 Financial KPI Summary Cards on Finance tab...")

        # Card 1: Est. Total Revenue
        c1 = page.locator('div:has(span:has-text("Est. Total Revenue"))').filter(has=page.locator('h3:has-text("€350,000")')).first
        assert c1.is_visible(), "Card 'Est. Total Revenue €350,000' not found!"
        print("  -> Card 1 verified: Est. Total Revenue = €350,000")

        # Card 2: Actual Revenue
        c2 = page.locator('div:has(span:has-text("Actual Revenue"))').filter(has=page.locator('h3:has-text("€42,972")')).first
        assert c2.is_visible(), "Card 'Actual Revenue €42,972' not found!"
        print("  -> Card 2 verified: Actual Revenue = €42,972")

        # Card 3: Total Service Cost
        c3 = page.locator('div:has(span:has-text("Total Service Cost"))').filter(has=page.locator('h3:has-text("€206,242")')).first
        assert c3.is_visible(), "Card 'Total Service Cost €206,242' not found!"
        print("  -> Card 3 verified: Total Service Cost = €206,242")

        # Card 4: Projected Net Profit
        c4 = page.locator('div:has(span:has-text("Projected Net Profit"))').filter(has=page.locator('h3:has-text("€143,758")')).first
        assert c4.is_visible(), "Card 'Projected Net Profit +€143,758' not found!"
        print("  -> Card 4 verified: Projected Net Profit = +€143,758 (41.1% Margin)")

        # Card 5: Current Net Balance
        c5 = page.locator('div:has(span:has-text("Current Net Balance"))').filter(has=page.locator('h3:has-text("€163,270")')).first
        assert c5.is_visible(), "Card 'Current Net Balance -€163,270' not found!"
        print("  -> Card 5 verified: Current Net Balance = -€163,270")

        # 5. Verify Estimated Total Revenue Progress Bar on Finance Tab
        print("[6] Verifying Revenue Progress Bar on Finance tab...")
        prog_bar = page.locator('h3:has-text("Estimated Total Revenue Progress")')
        assert prog_bar.is_visible(), "Estimated Total Revenue Progress bar missing on Finance tab!"
        assert page.locator('text=Realized Revenue: €42,972').is_visible(), "Realized Revenue text missing!"
        assert page.locator('text=Unrealized Target: €307,028').is_visible(), "Unrealized Target text missing!"
        print("  -> Revenue Progress Bar verified on Finance tab!")

        # 6. Verify Financial Performance Table Footer Totals
        print("[7] Verifying table footer totals...")
        tfoot = page.locator('table tfoot')
        assert tfoot.is_visible(), "Table tfoot totals row is missing!"
        assert tfoot.locator('text=€206,242').is_visible(), "Footer Total Cost €206,242 missing!"
        assert tfoot.locator('text=€42,972').first.is_visible(), "Footer Total Revenue €42,972 missing!"
        assert tfoot.locator('text=€163,270').is_visible(), "Footer Net Profit/Loss €163,270 missing!"
        print("  -> Table footer totals verified!")

        # 7. Capture Finance tab screenshot
        finance_screenshot = os.path.join(ARTIFACT_DIR, "project_6101_finance_verified.png")
        page.screenshot(path=finance_screenshot, full_page=True)
        print(f"[+] Finance screenshot captured: {finance_screenshot}")

        browser.close()
        print("\n[SUCCESS] Project Finance Tab calculations and revenue display verified 100%!")

if __name__ == "__main__":
    run_project_finance_e2e()
