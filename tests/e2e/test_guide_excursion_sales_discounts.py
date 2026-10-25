import os
import time
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\ecele\.gemini\antigravity\brain\17545749-9bee-492a-a1ee-66e33111c72c"
BASE_URL = "http://localhost:8001"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def run_guide_sales_discount_e2e():
    session_json = '{"email":"gersencelebi@gmail.com","name":"G. Ersen Çelebi","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME_PATH, headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 960})
        page = context.new_page()

        page.on("request", lambda req: print(f"REQUEST: {req.method} {req.url}") if "excursion-sales" in req.url else None)
        page.on("response", lambda res: print(f"RESPONSE: {res.status} {res.url}") if "excursion-sales" in res.url else None)
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}") if "error" in msg.text.lower() else None)

        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")

        # -------------------------------------------------------------
        # PART 1: TEST TOUR 6128 (Adult & Child Discount Verification)
        # -------------------------------------------------------------
        print("\n==================================================")
        print("[PART 1] Testing Tour 6128 (Adult & Child -50%)...")
        print("==================================================")
        page.goto(f"{BASE_URL}/projects/6101/tours/6128", wait_until="networkidle")
        time.sleep(2)

        # 1. Switch to Guide Sales tab
        print("[1.1] Opening Guide Sales tab...")
        guide_tab = page.locator('button:has-text("Guide Sales")')
        assert guide_tab.is_visible(), "Guide Sales tab is not visible"
        guide_tab.click()
        time.sleep(2)

        # 2. Verify Pricing Policy Badge
        print("[1.2] Verifying Pricing Policy Badge...")
        policy_badge = page.locator('text=Children: 50% Off • Infants: Free')
        assert policy_badge.is_visible(), "Pricing policy badge 'Children: 50% Off • Infants: Free' is missing!"
        print("  -> Policy badge verified!")

        # 3. Verify Passenger Types and Badges
        print("[1.3] Verifying passenger categories (Adult vs Child CHD -50%)...")
        adult_pax = page.locator('text=Can Demir').first
        assert adult_pax.is_visible(), "Adult passenger 'Can Demir' not found"

        child_pax = page.locator('text=Elif Demir').first
        assert child_pax.is_visible(), "Child passenger 'Elif Demir' not found"

        chd_badge = page.locator('span:has-text("CHD (-50%)")').first
        assert chd_badge.is_visible(), "Child badge 'CHD (-50%)' is missing in table!"
        print("  -> Child badge 'CHD (-50%)' verified next to Elif Demir!")

        # 4. Reset sales to 0 to verify clean calculation
        print("[1.4] Resetting matrix sales...")
        reset_btn = page.locator('button:has-text("Reset")')
        reset_btn.click()
        time.sleep(1)

        # Verify 0 gross revenue initially
        gross_elem = page.locator('text=Gross Revenue').locator('..').locator('div.text-base, div.text-lg').first
        assert "€0.00" in gross_elem.inner_text(), f"Expected €0.00 gross revenue after reset, got: {gross_elem.inner_text()}"

        # Get first excursion base price from header
        first_th = page.locator('table thead th:nth-child(2)')
        th_price_text = first_th.locator('div.text-blue-600, div.text-blue-400').inner_text()
        base_price = float(th_price_text.replace('€', '').strip())
        print(f"  -> First Excursion Column Base Price: €{base_price:.2f}")

        # 5. Toggle 1 Adult excursion (Can Demir)
        print("[1.5] Toggling Adult excursion (Can Demir)...")
        can_row = page.locator('tr:has-text("Can Demir")')
        first_exc_btn_adult = can_row.locator('td button').first
        first_exc_btn_adult.click()
        time.sleep(0.5)

        adult_total_str = can_row.locator('td.text-amber-600, td.font-bold').last.inner_text()
        adult_total = float(adult_total_str.replace('€', '').strip())
        print(f"  -> Adult Can Demir Total: €{adult_total:.2f}")
        assert abs(adult_total - base_price) < 0.01, f"Expected €{base_price:.2f} for adult, got €{adult_total:.2f}"

        # 6. Toggle 1 Child excursion (Elif Demir)
        print("[1.6] Toggling Child excursion (Elif Demir)...")
        elif_row = page.locator('tr:has-text("Elif Demir")')
        first_exc_btn_child = elif_row.locator('td button').first
        first_exc_btn_child.click()
        time.sleep(0.5)

        expected_child_price = round(base_price * 0.5, 2)
        child_total_str = elif_row.locator('td.text-amber-600, td.font-bold').last.inner_text()
        child_total = float(child_total_str.replace('€', '').strip())
        print(f"  -> Child Elif Demir Total (50% discount): €{child_total:.2f}")
        assert abs(child_total - expected_child_price) < 0.01, f"Expected €{expected_child_price:.2f} for child, got €{child_total:.2f}"

        # 7. Check Combined Financial Summary: base_price + expected_child_price
        expected_gross = base_price + expected_child_price
        expected_comm = round(expected_gross * 0.10, 2)
        expected_net = round(expected_gross - expected_comm, 2)

        print("[1.7] Verifying Combined Financial Summary...")
        gross_text = page.locator('text=Gross Revenue').locator('..').locator('div.text-base, div.text-lg').first.inner_text()
        actual_gross = float(gross_text.replace('€', '').replace(',', '').strip())
        print(f"  -> Combined Gross Revenue: €{actual_gross:.2f}")
        assert abs(actual_gross - expected_gross) < 0.01, f"Expected €{expected_gross:.2f} Gross Revenue, got: €{actual_gross:.2f}"

        comm_text = page.locator('text=Guide Commission').locator('..').locator('div.text-base, div.text-lg').first.inner_text()
        actual_comm = float(comm_text.replace('€', '').replace(',', '').strip())
        print(f"  -> Guide Commission (10%): €{actual_comm:.2f}")
        assert abs(actual_comm - expected_comm) < 0.01, f"Expected €{expected_comm:.2f} Guide Commission, got: €{actual_comm:.2f}"

        net_text = page.locator('text=Net Cash to Office').locator('..').locator('div.text-base, div.text-lg').first.inner_text()
        actual_net = float(net_text.replace('€', '').replace(',', '').strip())
        print(f"  -> Net Cash to Office: €{actual_net:.2f}")
        assert abs(actual_net - expected_net) < 0.01, f"Expected €{expected_net:.2f} Net Cash to Office, got: €{actual_net:.2f}"

        # 8. Submit Settlement for Tour 6128
        print("[1.8] Submitting Settlement for Tour 6128...")
        submit_btn = page.locator('button:has-text("Submit Guide Settlement"), button:has-text("Re-Submit")')
        submit_btn.click()
        time.sleep(3)
        assert page.locator('text=Settled').first.is_visible(), "Settlement badge 'Settled' not visible!"
        print("  -> Settlement submitted & verified for Tour 6128!")

        # -------------------------------------------------------------
        # PART 2: TEST TOUR 6114 (Infant Free & Breakdown Verification)
        # -------------------------------------------------------------
        print("\n==================================================")
        print("[PART 2] Testing Tour 6114 (Infants Free - €0.00)...")
        print("==================================================")
        page.goto(f"{BASE_URL}/guide/tours/6114", wait_until="networkidle")
        time.sleep(2)

        # 1. Verify Bebek Polat Infant badge
        print("[2.1] Verifying infant passenger Bebek Polat...")
        infant_pax = page.locator('text=Bebek Polat').first
        assert infant_pax.is_visible(), "Infant passenger 'Bebek Polat' not found in Tour 6114"

        inf_badge = page.locator('span:has-text("INF (FREE)")').first
        assert inf_badge.is_visible(), "Infant badge 'INF (FREE)' is missing in table!"
        print("  -> Infant badge 'INF (FREE)' verified next to Bebek Polat!")

        # 2. Reset sales
        print("[2.2] Resetting matrix sales...")
        page.locator('button:has-text("Reset")').click()
        time.sleep(1)

        # 3. Toggle excursion for Infant (Bebek Polat)
        print("[2.3] Toggling excursion for Infant Bebek Polat...")
        infant_row = page.locator('tr:has-text("Bebek Polat")')
        infant_cell_btn = infant_row.locator('td button').first
        infant_cell_btn.click()
        time.sleep(0.5)

        # Infant row total must remain €0.00
        infant_total = infant_row.locator('td.text-amber-600, td.font-bold').last.inner_text()
        print(f"  -> Infant Bebek Polat Total: {infant_total}")
        assert "0.00" in infant_total, f"Expected €0.00 for Infant, got: {infant_total}"

        # Infant cell displays €0
        assert infant_row.locator('text=€0').first.is_visible(), "Infant cell should display €0"
        print("  -> Infant cell displays €0 correctly!")

        # Gross Revenue must remain €0.00 with only infant selected
        gross_infant = page.locator('text=Gross Revenue').locator('..').locator('div.text-base, div.text-lg').first.inner_text()
        print(f"  -> Gross Revenue for Infant-only sale: {gross_infant}")
        assert "€0.00" in gross_infant, f"Expected €0.00 Gross Revenue for infant, got: {gross_infant}"

        # 4. Test 'All On' button and ticket breakdown (Adults, Children, Infants)
        print("[2.4] Testing 'All On' and ticket breakdown across all categories...")
        page.locator('button:has-text("All On")').click()
        time.sleep(1)

        breakdown_elem = page.locator('text=tickets').locator('..').locator('..').locator('text=Ad •')
        assert breakdown_elem.is_visible(), "Ticket breakdown (Adults • Children • Infants) not visible!"
        print(f"  -> Breakdown text: {breakdown_elem.inner_text()}")
        assert "Inf" in breakdown_elem.inner_text(), "Infant count missing from breakdown!"
        assert "Chd" in breakdown_elem.inner_text(), "Child count missing from breakdown!"
        assert "Ad" in breakdown_elem.inner_text(), "Adult count missing from breakdown!"

        # 5. Submit Settlement for Tour 6114
        print("[2.5] Submitting Settlement for Tour 6114...")
        page.locator('button:has-text("Submit Guide Settlement"), button:has-text("Re-Submit")').click()
        time.sleep(3)
        assert page.locator('text=Settled').first.is_visible(), "Settlement badge 'Settled' not visible!"
        print("  -> Settlement submitted & verified for Tour 6114!")

        # 6. Capture full verification screenshot
        screenshot_path = os.path.join(ARTIFACT_DIR, "guide_sales_discounts_verified.png")
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"[+] Screenshot captured: {screenshot_path}")

        browser.close()
        print("\n[SUCCESS] All Child (50% discount) and Infant (Free) Guide Sales tests passed 100%!")

if __name__ == "__main__":
    run_guide_sales_discount_e2e()
