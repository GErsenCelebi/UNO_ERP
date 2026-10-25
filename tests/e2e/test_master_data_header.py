import os
import time
from playwright.sync_api import sync_playwright

session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'
chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=chrome_path if os.path.exists(chrome_path) else None,
        headless=True
    )
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.add_init_script(f'localStorage.setItem("uno_erp_user_session", JSON.stringify({session_json}));')
    
    print("Testing localhost:8000/master-data...")
    page.goto("http://localhost:8000/master-data", wait_until="networkidle")
    page.wait_for_timeout(2000)
    page.screenshot(path="C:/Users/ecele/.gemini/antigravity/brain/17545749-9bee-492a-a1ee-66e33111c72c/master_data_top_menu_fixed.png")
    
    # 1. Verify header title 'Master Data'
    header = page.locator("header")
    assert header.is_visible(), "Header is not visible"
    print("Header text:", header.inner_text().replace('\n', ' | '))
    
    # 2. Verify duplicate user name is NOT in header
    header_user = header.locator('text=Evren')
    assert header_user.count() == 0, "Duplicate user name still found in top header!"
    header_ersen = header.locator('text=Ersen')
    assert header_ersen.count() == 0, "Duplicate user name Ersen still found in top header!"
    print("PASS: No duplicate user name in header.")
    
    # 3. Verify category menu items are inside header
    for cat in ["Project Data", "Tours Data", "AI Knowledge & SOPs", "Reports & KPIs"]:
        btn = header.locator(f'button:has-text("{cat}")')
        assert btn.is_visible(), f"Category button '{cat}' not visible in header!"
    print("PASS: All 4 category menu buttons are inside top bar.")
    
    # 4. Click Tours Data and verify sub-tabs
    print("Testing Tours Data navigation...")
    header.locator('button:has-text("Tours Data")').click()
    page.wait_for_timeout(1000)
    page.screenshot(path="C:/Users/ecele/.gemini/antigravity/brain/17545749-9bee-492a-a1ee-66e33111c72c/master_data_tours_data_fixed.png")
    
    # Verify subtabs for Tours Data
    for sub in ["Hotels", "Guides", "Transport", "Drivers", "Vendors", "Excursions", "Tour Statuses", "Service Categories"]:
        sub_btn = header.locator(f'button:has-text("{sub}")')
        assert sub_btn.is_visible(), f"Sub-tab '{sub}' not visible in header!"
    print("PASS: Tours Data sub-tabs visible in header sub-tier.")

    # 5. Also verify on port 8001 via sidebar navigation
    print("Testing localhost:8001 via sidebar navigation...")
    page.goto("http://localhost:8001/dashboard", wait_until="networkidle")
    page.wait_for_timeout(1000)
    master_data_link = page.locator('a[href="/master-data"]')
    assert master_data_link.is_visible(), "Master Data sidebar link not found"
    master_data_link.click()
    page.wait_for_timeout(2000)
    page.screenshot(path="C:/Users/ecele/.gemini/antigravity/brain/17545749-9bee-492a-a1ee-66e33111c72c/master_data_port_8001_fixed.png")
    header_8001 = page.locator("header")
    assert header_8001.locator('button:has-text("Project Data")').is_visible(), "Project Data not found on port 8001"
    print("PASS: Verified on port 8001.")
    
    browser.close()
print("All Master Data UI tests passed 100%!")
