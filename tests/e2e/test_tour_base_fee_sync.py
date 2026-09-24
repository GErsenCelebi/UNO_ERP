"""
E2E Test: Tour Base Fee & Services Base Services Bi-Directional Synchronization
Description:
  Verifies:
  1. Setting/saving Base Fee on Tour Info updates tour.baseFee and removes the hardcoded €250 badge.
  2. The base fee service is automatically populated under Services -> BASE SERVICES with subtotal €705.00.
  3. Modifying Base Fee updates both the KPI card and the Services table dynamically.
"""

import json
import time
from playwright.sync_api import sync_playwright

def test_tour_base_fee_sync(base_url="http://localhost:8000"):
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        ctx = browser.new_context(viewport={'width': 1400, 'height': 1200})
        page = ctx.new_page()

        # Session injection
        session = json.dumps({
            "email": "gersencelebi@gmail.com", 
            "name": "G. Ersen Çelebi", 
            "role": "Administrator", 
            "loginTime": "2026-08-21T00:00:00Z"
        })
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session}));")

        # Navigate to Tour BVP28082026 (id: 6126)
        page.goto(f"{base_url}/projects/5063/tours/6126", wait_until="networkidle")
        time.sleep(2)

        # 1. Verify Base Fee KPI Card does not show hardcoded 250 if baseFee is 30
        base_fee_card = page.locator('div:has(p:text("Per adult fee"))').first
        assert base_fee_card.is_visible(), "Base Fee KPI card must be visible"
        card_text = base_fee_card.inner_text()
        print("Current Base Fee Card:", card_text.encode('ascii', 'replace').decode('ascii'))
        assert "30" in card_text, f"Expected 30 in Base Fee card, got: {card_text}"
        assert "250" not in card_text, f"Did not expect 250 in Base Fee card, got: {card_text}"

        # 2. Navigate to Services tab and verify BASE SERVICES has the service
        svc_tab = page.locator('button:has-text("Services")').first
        assert svc_tab.is_visible(), "Services tab button must be visible"
        svc_tab.click()
        time.sleep(2)

        # Verify Base Services section exists and shows €705.00
        base_services_heading = page.locator('h3:has-text("Base Services")').first
        assert base_services_heading.is_visible(), "Base Services heading should be visible under Services Revenue"

        base_services_subtotal = page.locator('text=Base Services SubTotal:').first
        assert base_services_subtotal.is_visible(), "Base Services SubTotal must be visible"
        subtotal_text = page.locator('div:has-text("Base Services SubTotal:")').first.inner_text()
        print("Base Services SubTotal Text:", subtotal_text.encode('ascii', 'replace').decode('ascii'))
        assert "705.00" in subtotal_text or "705" in subtotal_text, f"Expected 705 in Base Services SubTotal, got: {subtotal_text}"

        # 3. Test Tour Info update flow: edit to 40 EUR
        info_tab = page.locator('button:has-text("Tour Info")').first
        info_tab.click()
        time.sleep(1.5)

        edit_btn = page.locator('button:has-text("Edit")').first
        assert edit_btn.is_visible(), "Edit button must be visible on Tour Info"
        edit_btn.click()
        time.sleep(1)

        base_fee_input = page.locator('input[type="number"]').nth(3)
        base_fee_input.fill('40')
        time.sleep(0.5)

        # Verify dynamic calculation on screen shows €940
        dynamic_total = page.locator('text=Dynamic Total').first
        assert dynamic_total.is_visible(), "Dynamic Total must be visible when Base Fee > 0"
        dynamic_text = page.locator('div:has-text("Dynamic Total")').first.inner_text()
        print("Dynamic Total calculation:", dynamic_text.encode('ascii', 'replace').decode('ascii'))
        assert "940" in dynamic_text, f"Expected 940 in Dynamic Total, got: {dynamic_text}"

        # Save Tour Info
        save_btn = page.locator('button:has-text("Save Changes")').first
        save_btn.click()
        time.sleep(2.5)

        # Verify Base Fee badge updated to €40
        updated_card_text = page.locator('div:has(p:text("Per adult fee"))').first.inner_text()
        print("Updated Base Fee Card:", updated_card_text.encode('ascii', 'replace').decode('ascii'))
        assert "40" in updated_card_text, f"Expected 40 in Base Fee card, got: {updated_card_text}"

        # Go to Services tab and verify SubTotal is €940.00
        svc_tab.click()
        time.sleep(2)
        subtotal_after_update = page.locator('div:has-text("Base Services SubTotal:")').first.inner_text()
        print("Base Services SubTotal after update:", subtotal_after_update.encode('ascii', 'replace').decode('ascii'))
        assert "940.00" in subtotal_after_update or "940" in subtotal_after_update, f"Expected 940 in Base Services SubTotal, got: {subtotal_after_update}"

        # Revert back to €30 for clean state
        info_tab.click()
        time.sleep(1.5)
        edit_btn.click()
        time.sleep(1)
        base_fee_input.fill('30')
        time.sleep(0.5)
        save_btn.click()
        time.sleep(2.5)

        final_card_text = page.locator('div:has(p:text("Per adult fee"))').first.inner_text()
        print("Final Base Fee Card reverted:", final_card_text.encode('ascii', 'replace').decode('ascii'))
        assert "30" in final_card_text

        browser.close()
        print("E2E Test Passed: Tour Base Fee & Services Base Services bi-directional synchronization fully verified!")

if __name__ == '__main__':
    test_tour_base_fee_sync()
