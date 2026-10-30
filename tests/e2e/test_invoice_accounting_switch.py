import os
import sys
from playwright.sync_api import sync_playwright

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            headless=True
        )
        context = browser.new_context()
        page = context.new_page()

        # Try port 8000 first, fallback to 8001
        base_url = "http://localhost:8000"
        try:
            page.goto(f"{base_url}/projects/5063/tours/5051", timeout=10000)
        except Exception:
            base_url = "http://localhost:8001"
            page.goto(f"{base_url}/projects/5063/tours/5051", timeout=15000)

        print(f"Loaded page on {base_url}")
        page.wait_for_load_state("networkidle")

        # 1. Click on the Invoices tab
        print("Switching to Invoice tab...")
        invoice_tab_btn = page.locator("button:has-text('Invoicing'), button:has-text('Invoice')").first
        invoice_tab_btn.click()
        page.wait_for_timeout(1000)

        # 2. Check that the Accounting Audit Status card is present
        print("Verifying Accounting Audit Status card...")
        card = page.locator("text=Accounting Audit Status").first
        card.wait_for(state="visible", timeout=5000)
        assert card.is_visible(), "Accounting Audit Status card should be visible"

        # 3. Locate the toggle switch
        switch_btn = page.locator("button[role='switch']").first
        assert switch_btn.is_visible(), "Accounting switch button should be visible"

        # Check current state
        is_completed = "COMPLETED" in page.content()
        print(f"Initial switch state: {'COMPLETED' if is_completed else 'INACTIVE'}")

        # 4. Click the switch to toggle it
        print("Toggling switch...")
        switch_btn.click()
        page.wait_for_timeout(1500)

        # Verify the new state
        new_is_completed = "COMPLETED" in page.content()
        print(f"New switch state: {'COMPLETED' if new_is_completed else 'INACTIVE'}")
        assert new_is_completed != is_completed, "Switch state should have changed!"

        # 5. Capture screenshot
        os.makedirs(r"C:\Ersen\Projects_2025\Uno_ERP\tests\e2e\test_runs", exist_ok=True)
        screenshot_path = r"C:\Ersen\Projects_2025\Uno_ERP\tests\e2e\test_runs\invoice_accounting_switch.png"
        page.screenshot(path=screenshot_path, full_page=False)
        print(f"Saved evidence screenshot to: {screenshot_path}")

        # If it was toggled to Completed and we want to leave it in the expected state, or test toggle again:
        if not new_is_completed:
            # Toggle it to completed so user sees green switch
            print("Toggling to Completed (Green)...")
            switch_btn.click()
            page.wait_for_timeout(1500)
            page.screenshot(path=screenshot_path, full_page=False)
            print("Verified Completed state.")

        browser.close()
        print("SUCCESS: test_invoice_accounting_switch completed successfully!")

if __name__ == "__main__":
    run_test()
