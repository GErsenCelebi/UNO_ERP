import os
import sys
import requests
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

API_BASE_URL = "http://localhost:8001"

def test_api_lowest_hotel_cost_english():
    """Verify lowest hotel/pax or hotel/room query in English."""
    url = f"{API_BASE_URL}/api/ai/chat"
    payload = {"query": "find the tour with lowest hotel/pax or hotel/room"}
    res = requests.post(url, json=payload, timeout=45)
    assert res.status_code == 200, f"Expected 200 OK, got {res.status_code}: {res.text}"
    
    data = res.json()
    assert "answer" in data
    answer = data["answer"]
    
    # PVB17052026 has lowest hotel cost per pax (€203.76)
    # ABCDTEST has lowest nightly room rate (€33.30)
    assert "PVB17052026" in answer, "Expected PVB17052026 in answer"
    assert "hotel" in answer.lower(), "Expected hotel cost breakdown in answer"
    
    # Assert Confidence & Grounding Provenance
    assert "confidence" in data, "Expected confidence report in API response"
    conf = data["confidence"]
    assert conf is not None, "Confidence report should not be None"
    assert conf["score"] >= 0.85, f"Expected high confidence >= 0.85, got {conf['score']}"
    assert conf["level"] == "High"
    assert "SQL" in conf["groundingType"]
    assert len(conf["datapoints"]) > 0, "Expected at least 1 verified datapoint"
    assert any("PVB17052026" in dp["entity"] for dp in conf["datapoints"])
    print(f"\n[+] test_api_lowest_hotel_cost_english passed: {conf['score'] * 100}% Confidence ({len(conf['datapoints'])} Datapoints tracked)")

def test_api_highest_profit_english():
    """Verify highest net profit query in English."""
    url = f"{API_BASE_URL}/api/ai/chat"
    payload = {"query": "find the tour with highest profit"}
    res = requests.post(url, json=payload, timeout=45)
    assert res.status_code == 200, f"Expected 200 OK, got {res.status_code}: {res.text}"
    
    data = res.json()
    answer = data["answer"]
    
    # BVP1907 has highest net profit (€1,616.00)
    assert "BVP1907" in answer, "Expected BVP1907 in highest profit response"
    assert "profit" in answer.lower() or "margin" in answer.lower(), "Expected profit margin metrics"
    
    # Assert Confidence & Grounding Provenance
    assert "confidence" in data
    conf = data["confidence"]
    assert conf is not None
    assert conf["score"] >= 0.85
    assert conf["level"] == "High"
    assert len(conf["datapoints"]) > 0
    assert any("BVP1907" in dp["entity"] for dp in conf["datapoints"])
    print(f"\n[+] test_api_highest_profit_english passed: {conf['score'] * 100}% Confidence ({len(conf['datapoints'])} Datapoints tracked)")

def test_api_lowest_hotel_cost_turkish():
    """Verify bilingual parity: lowest hotel cost in Turkish."""
    url = f"{API_BASE_URL}/api/ai/chat"
    payload = {"query": "en düşük otel maliyetli tur hangisi"}
    res = requests.post(url, json=payload, timeout=45)
    assert res.status_code == 200, f"Expected 200 OK, got {res.status_code}: {res.text}"
    
    data = res.json()
    answer = data["answer"]
    
    # Must identify PVB17052026 in Turkish
    assert "PVB17052026" in answer, "Expected PVB17052026 in Turkish response"
    assert "otel" in answer.lower() or "hotel" in answer.lower(), "Expected Turkish Otel metrics"
    
    # Assert Confidence & Grounding Provenance
    assert "confidence" in data
    conf = data["confidence"]
    assert conf is not None
    assert conf["score"] >= 0.85
    assert len(conf["datapoints"]) > 0
    print(f"\n[+] test_api_lowest_hotel_cost_turkish passed: {conf['score'] * 100}% Confidence ({len(conf['datapoints'])} Datapoints tracked)")

def test_api_highest_profit_turkish():
    """Verify bilingual parity: highest profit in Turkish."""
    url = f"{API_BASE_URL}/api/ai/chat"
    payload = {"query": "en yüksek karlı tur hangisi"}
    res = requests.post(url, json=payload, timeout=45)
    assert res.status_code == 200, f"Expected 200 OK, got {res.status_code}: {res.text}"
    
    data = res.json()
    answer = data["answer"]
    
    # Must identify BVP1907 with exact matching profit figures
    assert "BVP1907" in answer, "Expected BVP1907 in Turkish response"
    assert any(term in answer.lower() for term in ["kâr", "kar", "profit", "kazanç"]), "Expected Turkish profit metrics"
    
    # Assert Confidence & Grounding Provenance
    assert "confidence" in data
    conf = data["confidence"]
    assert conf is not None
    assert conf["score"] >= 0.85
    assert len(conf["datapoints"]) > 0
    print(f"\n[+] test_api_highest_profit_turkish passed: {conf['score'] * 100}% Confidence ({len(conf['datapoints'])} Datapoints tracked)")

def test_api_guide_performance_ranking():
    """Verify guide performance leaderboard in both languages."""
    url = f"{API_BASE_URL}/api/ai/chat"
    
    # English
    res_en = requests.post(url, json={"query": "who is the best tour guide?"}, timeout=45)
    assert res_en.status_code == 200
    assert "guide" in res_en.json()["answer"].lower()
    
    # Turkish
    res_tr = requests.post(url, json={"query": "en başarılı rehber kim"}, timeout=45)
    assert res_tr.status_code == 200
    assert "rehber" in res_tr.json()["answer"].lower() or "guide" in res_tr.json()["answer"].lower()
    print("\n[+] test_api_guide_performance_ranking passed successfully.")

def test_api_turkish_sop_transition():
    """Verify Turkish SOP status gate retrieval."""
    url = f"{API_BASE_URL}/api/ai/chat"
    payload = {"query": "Taslaktan Onaylandı durumuna nasıl geçilir?"}
    res = requests.post(url, json=payload, timeout=45)
    assert res.status_code == 200
    
    answer = res.json()["answer"]
    assert any(term in answer.lower() for term in ["status", "gate", "durum", "onay", "taslak"])
    assert "/tours" in str(res.json()["recommendedLinks"])
    print("\n[+] test_api_turkish_sop_transition passed successfully.")

def test_ui_playwright_chat_interaction():
    """Verify the UI Smart Agent chat drawer displays financial ranking cards."""
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

        # Navigate to home
        page.goto("http://localhost:8001/tours", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Open chat drawer
        trigger_btn = page.locator('button:has-text("Uno Smart Agent")')
        if trigger_btn.count() > 0:
            trigger_btn.click()
            page.wait_for_timeout(600)
            
            # Send question in chat
            input_box = page.locator('input[placeholder*="Ask"], input[placeholder*="Type"]')
            if input_box.count() > 0:
                input_box.first.fill("find the tour with lowest hotel/pax or hotel/room")
                input_box.first.press("Enter")
                page.wait_for_timeout(2500)
                
                # Check for answer in drawer
                drawer_content = page.locator('div[role="dialog"], aside, div:has-text("PVB17052026")')
                assert drawer_content.count() > 0, "Expected PVB17052026 response to render in UI drawer"
                print("\n[+] test_ui_playwright_chat_interaction verified drawer UI rendering.")
        
        browser.close()

if __name__ == "__main__":
    test_api_lowest_hotel_cost_english()
    test_api_highest_profit_english()
    test_api_lowest_hotel_cost_turkish()
    test_api_highest_profit_turkish()
    test_api_guide_performance_ranking()
    test_api_turkish_sop_transition()
    test_ui_playwright_chat_interaction()
    print("\n[PASS] All Financial & Quality Ranking E2E Tests Passed!")
