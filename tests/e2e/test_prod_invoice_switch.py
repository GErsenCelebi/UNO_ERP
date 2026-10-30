import os
import sys
from playwright.sync_api import sync_playwright

def run_prod_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            headless=True
        )
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to production site http://uno-dmc.cz/projects/5063/tours/5051 ...")
        page.goto("http://uno-dmc.cz/projects/5063/tours/5051", timeout=30000)
        page.wait_for_load_state("networkidle")

        # 1. Click on the Invoices tab
        print("Clicking Invoicing/Invoice tab...")
        invoice_tab_btn = page.locator("button:has-text('Invoicing'), button:has-text('Invoice')").first
        invoice_tab_btn.click()
        page.wait_for_timeout(2000)

        # 2. Check that the Accounting Audit Status card is present
        print("Verifying Accounting Audit Status card...")
        card = page.locator("text=Accounting Audit Status").first
        card.wait_for(state="visible", timeout=10000)
        assert card.is_visible(), "Accounting Audit Status card should be visible on Prod"

        # 3. Locate the switch
        switch_btn = page.locator("button[role='switch']").first
        assert switch_btn.is_visible(), "Accounting switch button should be visible on Prod"

        print("Accounting Audit Switch verified visible on Prod!")

        # 4. Capture screenshot
        os.makedirs(r"C:\Ersen\Projects_2025\Uno_ERP\tests\e2e\test_runs", exist_ok=True)
        screenshot_path = r"C:\Ersen\Projects_2025\Uno_ERP\tests\e2e\test_runs\prod_invoice_accounting_switch.png"
        page.screenshot(path=screenshot_path, full_page=False)
        print(f"Saved Prod screenshot to: {screenshot_path}")

        browser.close()
        print("PROD VERIFICATION SUCCESS!")

if __name__ == "__main__":
    run_prod_verification()
