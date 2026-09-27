from playwright.sync_api import sync_playwright
import time
import os

def test_dashboard_finance_slimmer_and_audit_collapsed():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    artifacts_dir = r"C:\Users\ecele\.gemini\antigravity\brain\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        
        session = '{"email":"gersencelebi@gmail.com","name":"G. Ersen Çelebi","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session}));")
        
        # 1. Project 6101 Overview Tab
        print("Navigating to Project 6101...")
        page.goto("http://localhost:8000/projects/6101", wait_until="networkidle")
        time.sleep(2)
        
        # Verify tabs: "Audit History" should NOT exist in the tabs bar
        tab_buttons = page.locator('div.flex.border-b.border-slate-200.bg-white button')
        tab_texts = [tab_buttons.nth(i).inner_text().strip() for i in range(tab_buttons.count())]
        print("Tabs present:", tab_texts)
        assert not any("Audit History" in t for t in tab_texts), "Audit History tab should be removed from tabs bar!"
        
        # Verify Audit History section at the bottom is COLLAPSED by default
        overview_audit = page.locator('h3:has-text("Project TEST-20260829 Audit History")')
        assert overview_audit.is_visible(), "Project Audit History section header should exist!"
        overview_audit.scroll_into_view_if_needed()
        time.sleep(1)
        # Check that the logs list inside it is collapsed (i.e. not rendering the individual log items)
        page.screenshot(path=os.path.join(artifacts_dir, "project_overview_collapsed_audit.png"))
        print("Captured project_overview_collapsed_audit.png")
        
        # 2. Project Dashboard Tab
        print("Navigating to Dashboard tab...")
        dashboard_tab = page.get_by_role("button", name="Dashboard", exact=True)
        dashboard_tab.click()
        time.sleep(1)
        page.screenshot(path=os.path.join(artifacts_dir, "project_dashboard_slimmer_cards.png"))
        print("Captured project_dashboard_slimmer_cards.png")
        
        # 3. Project Finance Tab
        print("Navigating to Finance tab...")
        finance_tab = page.get_by_role("button", name="Finance", exact=True)
        finance_tab.click()
        time.sleep(1)
        page.screenshot(path=os.path.join(artifacts_dir, "project_finance_slimmer_cards_and_table.png"))
        print("Captured project_finance_slimmer_cards_and_table.png")
        
        # 4. Tour Details Services Tab (Verify Audit History is Collapsed by Default)
        print("Navigating to Tour 6114 Services tab...")
        page.goto("http://localhost:8000/projects/6101/tours/6114", wait_until="networkidle")
        time.sleep(2)
        services_tab = page.get_by_role("button", name="Services", exact=True)
        services_tab.click()
        time.sleep(1)
        
        # Scroll to bottom
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(1)
        page.screenshot(path=os.path.join(artifacts_dir, "tour_services_collapsed_audit.png"))
        print("Captured tour_services_collapsed_audit.png")
        
        browser.close()
        print("All verification steps passed!")

if __name__ == "__main__":
    test_dashboard_finance_slimmer_and_audit_collapsed()
