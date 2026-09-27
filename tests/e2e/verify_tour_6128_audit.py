from playwright.sync_api import sync_playwright
import time

def verify_tour_6128_audit():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        
        session = '{"email":"gersencelebi@gmail.com","name":"G. Ersen Çelebi","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session}));")
        
        # Open Tour 6128
        page.goto("http://localhost:8000/projects/6101/tours/6128", wait_until="networkidle")
        time.sleep(2)
        
        # Scroll to audit section
        audit_heading = page.locator('h3:has-text("Tour ABCDTEST Audit History")')
        audit_heading.scroll_into_view_if_needed()
        time.sleep(1)
        
        # Check logs
        print("Checking logs on Tour 6128 page:")
        logs = page.locator('.group .bg-slate-50\\/60')
        print(f"Total logs rendered: {logs.count()}")
        for i in range(logs.count()):
            print(f"Log {i+1}: {logs.nth(i).inner_text()}")
            
        artifacts_dir = "C:\\Users\\ecele\\.gemini\\antigravity\\brain\\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"
        page.screenshot(path=f"{artifacts_dir}\\tour_6128_with_former_audit_logs.png")
        print("Screenshot saved to tour_6128_with_former_audit_logs.png")
        
        browser.close()

if __name__ == "__main__":
    verify_tour_6128_audit()
