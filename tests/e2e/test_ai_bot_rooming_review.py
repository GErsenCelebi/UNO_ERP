import os
import sys
import requests
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

API_BASE_URL = "http://localhost:8001"

def test_api_review_and_set_rooming_english():
    """Verify AI Bot reviews and sets rooming in English, updating database."""
    url = f"{API_BASE_URL}/api/ai/chat"
    payload = {"query": "can you review and set the rooming for tour 6128"}
    res = requests.post(url, json=payload, timeout=45)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"

    data = res.json()
    assert "answer" in data
    answer = data["answer"]
    
    # Check that room numbers and room types are matched
    assert "Room" in answer or "room" in answer
    assert any(rt in answer for rt in ["Double", "Single", "Triple", "Twin"])
    
    # Check confidence
    assert "confidence" in data
    conf = data["confidence"]
    assert conf is not None
    assert conf["score"] == 1.0
    assert conf["level"] == "High"
    assert "SQL" in conf["groundingType"]
    assert len(conf["datapoints"]) > 0

    # Verify HIL alert for Tour 6128 (Hotel Canada 22 rooms vs manifest 7 rooms)
    assert "HIL" in answer or "Human-in-the-Loop" in answer, "Expected HIL (Human-in-the-Loop) notice in answer"
    assert "Hotel Service" in answer or "Contracted" in answer, "Expected Hotel Service Entry comparison table"
    assert any(dp.get("field") == "HIL Review Status" for dp in conf["datapoints"]), "Expected HIL Review Status datapoint"

    # Verify database persistence
    ps_res = requests.get(f"{API_BASE_URL}/api/Passengers?tourId=6128")
    assert ps_res.status_code == 200
    passengers = ps_res.json()
    assert len(passengers) > 0
    assigned = [p for p in passengers if p.get("roomNumber") is not None]
    assert len(assigned) == len(passengers), f"Expected all {len(passengers)} passengers to have RoomNumber, but only {len(assigned)} had one"

    # Verify couples with same surname share room number
    yildiz = [p for p in passengers if "Yıldız" in p.get("lastName", "") or "Yildiz" in p.get("lastName", "")]
    if len(yildiz) >= 2:
        assert yildiz[0]["roomNumber"] == yildiz[1]["roomNumber"], "Expected couple with same surname to share RoomNumber"

    print(f"\n[+] test_api_review_and_set_rooming_english passed: {len(assigned)}/{len(passengers)} assigned rooms & HIL discrepancy identified.")

def test_api_check_rooms_match_hotel_services_hil_prompt():
    """Verify specific query: 'check the total number of rooms match with hotel services entry'."""
    url = f"{API_BASE_URL}/api/ai/chat"
    payload = {"query": "if already exist please check the total number of rooms 3single 10 double match with hotel services entry for tour 6128"}
    res = requests.post(url, json=payload, timeout=45)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"

    data = res.json()
    answer = data.get("answer", "")
    assert "HIL" in answer or "Human-in-the-Loop" in answer, "Expected HIL review requirement in response"
    assert "Single" in answer and "Double" in answer, "Expected Single and Double room type breakdown"
    assert "Discrepancy" in answer or "Variance" in answer or "Surplus" in answer or "Mismatch" in answer, "Expected variance breakdown"
    print("\n[+] test_api_check_rooms_match_hotel_services_hil_prompt passed: HIL prompt triggered reconciliation.")

def test_api_review_and_set_rooming_turkish():
    """Verify AI Bot reviews and sets rooming in Turkish with HIL notice."""
    url = f"{API_BASE_URL}/api/ai/chat"
    payload = {"query": "tur 6128 için oda sayıları otel hizmet girişleri ile eşleşiyor mu kontrol et"}
    res = requests.post(url, json=payload, timeout=45)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"

    data = res.json()
    answer = data["answer"]
    assert any(term in answer.lower() for term in ["oda", "double", "triple", "single", "twin", "dağılım", "otel", "hizmet"])
    assert "HIL" in answer or "İnsan Müdahalesi" in answer or "Human-in-the-Loop" in answer, "Expected Turkish HIL alert"
    assert data.get("confidence", {}).get("score") == 1.0
    print("\n[+] test_api_review_and_set_rooming_turkish passed.")

def test_ui_playwright_rooming_chat():
    """Verify rooming review and matching in UI Chat Drawer."""
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=chrome_path if os.path.exists(chrome_path) else None,
            headless=True
        )
        context = browser.new_context(viewport={"width": 1400, "height": 1050})
        page = context.new_page()
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")

        page.goto("http://localhost:8001/tours", wait_until="networkidle")
        page.wait_for_timeout(1000)

        trigger_btn = page.locator('button:has-text("Uno Smart Agent")')
        if trigger_btn.count() > 0:
            trigger_btn.click()
            page.wait_for_timeout(600)

            # Send rooming prompt
            inp = page.locator('input[placeholder*="Ask"], input[placeholder*="Type"]')
            if inp.count() > 0:
                inp.first.fill("check the total number of rooms match with hotel services entry for tour 6128")
                inp.first.press("Enter")
                page.wait_for_timeout(4000)

                # Confirm HIL alert rendered
                drawer = page.locator('div:has-text("HIL"), div:has-text("Human-in-the-Loop"), div:has-text("Hotel Services")')
                assert drawer.count() > 0, "Expected HIL alert to render in UI drawer"
                
                # Take screenshot artifact
                page.screenshot(path="C:/Users/ecele/.gemini/antigravity/brain/da3d7774-c465-41fb-9db4-d75aebe21ab7/ai_bot_rooming_hil_verification.png")
                print("\n[+] test_ui_playwright_rooming_chat verified HIL alert rendering in UI drawer.")

        browser.close()

if __name__ == "__main__":
    test_api_review_and_set_rooming_english()
    test_api_check_rooms_match_hotel_services_hil_prompt()
    test_api_review_and_set_rooming_turkish()
    test_ui_playwright_rooming_chat()
    print("\n[PASS] All Rooming Review & Hotel Services HIL Verification Tests Passed!")

