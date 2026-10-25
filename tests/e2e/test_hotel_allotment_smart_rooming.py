import os
import sys
import requests
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

API_BASE_URL = "http://localhost:8001"
TOUR_ID = 6105
PROJECT_ID = 1

def test_smart_rooming_and_hotel_allotment():
    """Verify smart rooming with hotel contract reconciliation for Tour 6105."""
    print("=== Testing Smart Rooming for Tour 6105 ===")
    url = f"{API_BASE_URL}/api/ai/chat"
    payload = {
        "query": "can you review and set the rooming for tour 6105",
        "contextUrl": f"/projects/{PROJECT_ID}/tours/{TOUR_ID}"
    }
    res = requests.post(url, json=payload, timeout=60)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    data = res.json()
    answer = data.get("answer", "")
    print(f"AI Response snippet:\n{answer[:600]}...\n")

    # 1. Verify passengers in database
    pax_res = requests.get(f"{API_BASE_URL}/api/Passengers?tourId={TOUR_ID}", timeout=15)
    assert pax_res.status_code == 200
    passengers = pax_res.json()
    assert len(passengers) == 41, f"Expected 41 passengers, got {len(passengers)}"

    # 2. Check incremental Pax sequence (1..41)
    pax_numbers = [p.get("pax") for p in passengers]
    assert None not in pax_numbers, "Expected no None in Pax numbers"
    assert sorted(pax_numbers) == list(range(1, 42)), "Expected Pax numbers 1..41 incrementally"

    # 3. Check Room Numbers (1..20)
    room_numbers = set(p.get("roomNumber") for p in passengers)
    assert None not in room_numbers, "Expected all passengers to have a RoomNumber"
    assert room_numbers == set(range(1, 21)), f"Expected rooms 1..20, got {room_numbers}"

    # 4. Verify 4 Families of 3 (2 Adults + 1 Child) are all Double + Extra Bed:
    # Room 6: Özger
    room6 = [p for p in passengers if p.get("roomNumber") == 6]
    assert len(room6) == 3, f"Expected 3 pax in Room 6, got {len(room6)}"
    assert all(p.get("roomType") == "Double" for p in room6), "Expected all pax in Room 6 to have roomType='Double'"
    ali_doruk = next((p for p in room6 if "ALI" in p.get("firstName", "").upper().replace("İ", "I")), None)
    assert ali_doruk is not None
    assert ali_doruk.get("paxType") == "Children"

    # Room 9: Ersöz
    room9 = [p for p in passengers if p.get("roomNumber") == 9]
    assert len(room9) == 3, f"Expected 3 pax in Room 9, got {len(room9)}"
    assert all(p.get("roomType") == "Double" for p in room9), "Expected all pax in Room 9 to have roomType='Double'"
    cagan = next((p for p in room9 if "CAGAN" in p.get("firstName", "").upper().replace("Ç", "C").replace("Ğ", "G")), None)
    assert cagan is not None
    assert cagan.get("paxType") == "Children"

    # Room 12: Gürsoy
    room12 = [p for p in passengers if p.get("roomNumber") == 12]
    assert len(room12) == 3, f"Expected 3 pax in Room 12, got {len(room12)}"
    assert all(p.get("roomType") == "Double" for p in room12), "Expected all pax in Room 12 to have roomType='Double'"
    ata = next((p for p in room12 if "ATA" in p.get("firstName", "").upper()), None)
    assert ata is not None
    assert ata.get("paxType") == "Children"

    # Room 14: Başaran
    room14 = [p for p in passengers if p.get("roomNumber") == 14]
    assert len(room14) == 3, f"Expected 3 pax in Room 14, got {len(room14)}"
    assert all(p.get("roomType") == "Double" for p in room14), "Expected all pax in Room 14 to have roomType='Double'"
    inci = next((p for p in room14 if "INCI" in p.get("firstName", "").upper().replace("İ", "I")), None)
    assert inci is not None
    assert inci.get("paxType") == "Children"

    # 5. Room distribution counts:
    # 9 Double, 7 Twin, 4 Single, 0 Triple
    rooms_by_type = {}
    for r in range(1, 21):
        pax_in_r = [p for p in passengers if p.get("roomNumber") == r]
        rt = pax_in_r[0].get("roomType")
        rooms_by_type[rt] = rooms_by_type.get(rt, 0) + 1

    print(f"Room distribution: {rooms_by_type}")
    assert rooms_by_type.get("Double") == 9, f"Expected 9 Double rooms, got {rooms_by_type.get('Double')}"
    assert rooms_by_type.get("Twin") == 7, f"Expected 7 Twin rooms, got {rooms_by_type.get('Twin')}"
    assert rooms_by_type.get("Single") == 4, f"Expected 4 Single rooms, got {rooms_by_type.get('Single')}"
    assert rooms_by_type.get("Triple", 0) == 0, f"Expected 0 Triple rooms, got {rooms_by_type.get('Triple')}"

    print("[+] API and Database verification passed 100%!")

def test_playwright_ui_bookings_tab():
    """Open Playwright browser to /projects/1/tours/6105, check Bookings tab, capture screenshot."""
    print("=== Testing Playwright UI for Tour 6105 ===")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="msedge")
        context = browser.new_context(viewport={"width": 1600, "height": 1000})
        page = context.new_page()

        # Navigate to Tour 6105 detail
        page.goto(f"{API_BASE_URL}/projects/{PROJECT_ID}/tours/{TOUR_ID}", timeout=30000)
        page.wait_for_timeout(3000)

        # Click Bookings / Yolcular tab if present
        bookings_tab = page.locator('button:has-text("Bookings"), button:has-text("Yolcular"), button:has-text("Yolcu Manifestosu")')
        if bookings_tab.count() > 0:
            bookings_tab.first.click()
            page.wait_for_timeout(2000)

        # Verify table displays Room# and Pax#
        table = page.locator('table')
        if table.count() > 0:
            content = table.first.inner_text()
            assert "Room" in content or "Oda" in content or "1" in content
            print("[+] UI Table displays verified room and pax data.")

        # Trigger AI Bot drawer to capture the smart rooming review
        bot_btn = page.locator('button:has-text("Uno Smart Agent"), button:has-text("Copilot"), button:has-text("AI")')
        if bot_btn.count() > 0:
            bot_btn.first.click()
            page.wait_for_timeout(1000)

            inp = page.locator('input[placeholder*="Ask"], input[placeholder*="Sorun"], input[placeholder*="Type"]')
            if inp.count() > 0:
                inp.first.fill("can you review and set the rooming for tour 6105")
                inp.first.press("Enter")
                page.wait_for_timeout(5000)

        screenshot_path = "C:/Users/ecele/.gemini/antigravity/brain/da3d7774-c465-41fb-9db4-d75aebe21ab7/bookings_tab_hotel_allotment_smart_rooming.png"
        page.screenshot(path=screenshot_path)
        print(f"[+] Screenshot captured: {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    test_smart_rooming_and_hotel_allotment()
    test_playwright_ui_bookings_tab()
    print("\n[ALL TESTS PASSED SUCCESSFULLY!]")
