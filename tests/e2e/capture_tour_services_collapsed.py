from playwright.sync_api import sync_playwright
import time
import os

artifacts_dir = r"C:\Users\ecele\.gemini\antigravity\brain\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    session = '{"email":"gersencelebi@gmail.com","name":"G. Ersen Çelebi","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'
    page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session}));")
    page.goto("http://localhost:8000/projects/6101/tours/6114", wait_until="networkidle")
    time.sleep(1)
    page.get_by_role("button", name="Services", exact=True).click()
    time.sleep(1)
    audit = page.locator('h3:has-text("Services Audit History")')
    audit.scroll_into_view_if_needed()
    time.sleep(1)
    target = os.path.join(artifacts_dir, "tour_services_collapsed_audit_final.png")
    page.screenshot(path=target)
    print("Saved:", target)
    browser.close()
