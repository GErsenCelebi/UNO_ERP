import json
import time
from playwright.sync_api import sync_playwright

def run():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        context = browser.new_context(viewport={'width': 1400, 'height': 1200})
        page = context.new_page()

        # Session injection
        session = json.dumps({
            "email": "gersencelebi@gmail.com", 
            "name": "G. Ersen Çelebi", 
            "role": "Administrator",
            "token": "fake-jwt-token"
        })
        page.add_init_script(f"""
            localStorage.setItem('uno_user', '{session}');
            localStorage.setItem('uno_token', 'fake-jwt-token');
        """)

        print("1. Navigating to Tour 6106 (PVB19072026)...")
        page.goto("http://localhost:8000/projects/5063/tours/6106", timeout=30000)
        page.wait_for_selector("text=Tour Information", timeout=15000)

        # 2. Check Arrival Flight link
        print("2. Checking Arrival Flight tracking links...")
        arrival_fa_link = page.locator("a[href*='flightaware.com/live/flight/THY1767']").first
        arrival_fa_link.wait_for(timeout=10000)
        arrival_href = arrival_fa_link.get_attribute("href")
        print(f"  Arrival FlightAware Link: {arrival_href}")
        assert "flightaware.com/live/flight/THY1767" in arrival_href
        assert arrival_fa_link.get_attribute("target") == "_blank"

        arrival_fr24_link = page.locator("a[href*='flightradar24.com/data/flights/tk1767']").first
        arrival_fr24_link.wait_for(timeout=10000)
        fr24_href = arrival_fr24_link.get_attribute("href")
        print(f"  Arrival FlightRadar24 Link: {fr24_href}")
        assert "flightradar24.com/data/flights/tk1767" in fr24_href
        assert arrival_fr24_link.get_attribute("target") == "_blank"

        # 3. Check Departure Flight link
        print("3. Checking Departure Flight tracking links...")
        dep_fa_link = page.locator("a[href*='flightaware.com/live/flight/THY1768']").first
        dep_fa_link.wait_for(timeout=10000)
        dep_href = dep_fa_link.get_attribute("href")
        print(f"  Departure FlightAware Link: {dep_href}")
        assert "flightaware.com/live/flight/THY1768" in dep_href
        assert dep_fa_link.get_attribute("target") == "_blank"

        dep_fr24_link = page.locator("a[href*='flightradar24.com/data/flights/tk1768']").first
        dep_fr24_link.wait_for(timeout=10000)
        dep_fr24_href = dep_fr24_link.get_attribute("href")
        print(f"  Departure FlightRadar24 Link: {dep_fr24_href}")
        assert "flightradar24.com/data/flights/tk1768" in dep_fr24_href
        assert dep_fr24_link.get_attribute("target") == "_blank"

        # 4. Open Edit Modal and verify check status links
        print("4. Opening Edit Modal to verify live status check links...")
        edit_btn = page.locator("button:has-text('Edit')").first
        edit_btn.click()
        page.wait_for_selector("text=Flight Information", timeout=10000)

        modal_check_links = page.locator("a:has-text('Check Live')")
        link_count = modal_check_links.count()
        print(f"  Modal 'Check Live' status links count: {link_count}")
        assert link_count >= 2, f"Expected at least 2 'Check Live' links in edit modal, found {link_count}"
        modal_first_href = modal_check_links.first.get_attribute("href")
        print(f"  Modal first link href: {modal_first_href}")
        assert "flightaware.com/live/flight" in modal_first_href

        browser.close()
        print("\nSUCCESS: All FlightAware tracking link tests passed cleanly!")

if __name__ == "__main__":
    run()
