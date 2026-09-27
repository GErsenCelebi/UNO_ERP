from playwright.sync_api import sync_playwright
import time
import os

def test_tour_services_and_bookings_audit():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    artifacts_dir = r"C:\Users\ecele\.gemini\antigravity\brain\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        
        session = '{"email":"gersencelebi@gmail.com","name":"G. Ersen Çelebi","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session}));")
        
        print("Navigating to Tour 6114...")
        page.goto("http://localhost:8000/projects/6101/tours/6114", wait_until="networkidle")
        time.sleep(2)
        
        # 1. Test Services Tab
        print("Switching to Services tab...")
        services_tab = page.get_by_role("button", name="Services", exact=True)
        services_tab.click()
        time.sleep(2)
        
        services_audit_heading = page.locator('h3:has-text("Services Audit History")')
        assert services_audit_heading.is_visible(), "Services Audit History heading not visible!"
        services_audit_heading.scroll_into_view_if_needed()
        time.sleep(1)
        
        services_screenshot = os.path.join(artifacts_dir, "tour_services_audit_section.png")
        page.screenshot(path=services_screenshot)
        print(f"Captured Services audit screenshot: {services_screenshot}")
        
        # 2. Test Bookings Tab
        print("Switching to Bookings tab...")
        bookings_tab = page.get_by_role("button", name="Bookings", exact=True)
        bookings_tab.click()
        time.sleep(2)
        
        bookings_audit_heading = page.locator('h3:has-text("Bookings & Passenger Audit History")')
        assert bookings_audit_heading.is_visible(), "Bookings & Passenger Audit History heading not visible!"
        bookings_audit_heading.scroll_into_view_if_needed()
        time.sleep(1)
        
        bookings_screenshot = os.path.join(artifacts_dir, "tour_bookings_audit_section.png")
        page.screenshot(path=bookings_screenshot)
        print(f"Captured Bookings audit screenshot: {bookings_screenshot}")
        
        browser.close()
        print("Test completed successfully!")

if __name__ == "__main__":
    test_tour_services_and_bookings_audit()
