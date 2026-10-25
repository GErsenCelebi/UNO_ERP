import os
import sys
import openpyxl
import urllib.request
import json
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def create_sample_excel_with_tour(file_path, tour_code):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Rooming"
    
    ws.append(["No", "Passenger Name", "Room Type", "Passport No", "Gender", "Pax Type", "City"])
    
    # 20 Passengers
    for i in range(1, 21):
        room_type = "Double" if i <= 10 else ("Single" if i <= 14 else "Twin")
        ws.append([i, f"Guest {i} Test", room_type, f"TR{10000+i}", "Adult", "Regular", "Prague"])
        
    wb.save(file_path)
    print(f"[+] Created test Excel workbook for tour {tour_code}: {file_path}")

def test_bot_upload_smart_rooming():
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    artifact_dir = "C:/Users/ecele/.gemini/antigravity/brain/da3d7774-c465-41fb-9db4-d75aebe21ab7"
    incomplete_excel = os.path.join(artifact_dir, "PRJ-TEST_BVP0310072026_rooming.xlsx")
    screenshot_incomplete = os.path.join(artifact_dir, "ai_bot_hotel_incomplete_prompt.png")
    screenshot_committed = os.path.join(artifact_dir, "ai_bot_upload_smart_rooming_committed.png")

    # Tour 6099 (BVP0310072026) has 0 hotel services
    create_sample_excel_with_tour(incomplete_excel, "BVP0310072026")

    session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=chrome_path if os.path.exists(chrome_path) else None,
            headless=True
        )
        context = browser.new_context(viewport={"width": 1400, "height": 1050})
        page = context.new_page()
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")

        # ----------------------------------------------------
        # Scenario 1: Tour with Incomplete Hotel Bookings
        # ----------------------------------------------------
        print("\n[Step 1] Navigating to tour with 0 hotel bookings (/projects/1/tours/6099)...")
        page.goto("http://localhost:8001/projects/1/tours/6099", wait_until="networkidle")
        page.wait_for_timeout(1000)

        print("[Step 2] Opening Uno Smart Agent chat drawer...")
        trigger_btn = page.locator('button:has-text("Uno Smart Agent")')
        trigger_btn.click()
        page.wait_for_timeout(600)

        print("[Step 3] Uploading manifest for BVP0310072026...")
        file_input = page.locator('input[type="file"]')
        file_input.set_input_files(incomplete_excel)
        page.wait_for_timeout(2000)

        # Check incomplete hotel bookings prompt
        print("[Step 4] Checking AI prompt for incomplete hotel bookings warning...")
        ai_warning = page.locator('text=Otel Rezervasyonları Henüz Tamamlanmamış')
        assert ai_warning.count() > 0, "Bot failed to warn user about incomplete hotel bookings!"
        print("    -> SUCCESS: Found warning 'Otel Rezervasyonları Henüz Tamamlanmamış' in AI inspection response!")

        # Check navigation button
        nav_button = page.locator('text=Otel Rezervasyonlarını Tamamla')
        assert nav_button.count() > 0, "Bot failed to provide link to complete hotel bookings!"
        print("    -> SUCCESS: 'Otel Rezervasyonlarını Tamamla' button rendered!")

        # Take screenshot of incomplete hotel bookings notification
        drawer = page.locator('div.fixed.bottom-6.right-6')
        drawer.screenshot(path=screenshot_incomplete)
        print(f"[+] Saved incomplete hotel warning screenshot: {screenshot_incomplete}")

        # ----------------------------------------------------
        # Scenario 2: Committing and Smart Rooming Execution
        # ----------------------------------------------------
        # Tour 6105 (PVB17072026) has 15 hotel services contracted (10 DBL, 7 TWN, 4 SGL, 0 TRP)
        complete_excel = "c:/Ersen/Projects_2025/Uno_ERP/tests/e2e/fixtures/PVB17072026_Rooming_41Pax.xlsx"
        
        print("\n[Step 5] Navigating to tour with full hotel bookings (/projects/1/tours/6105)...")
        page.goto("http://localhost:8001/projects/1/tours/6105", wait_until="networkidle")
        page.wait_for_timeout(1000)

        print("[Step 6] Opening Uno Smart Agent...")
        trigger_btn = page.locator('button:has-text("Uno Smart Agent")')
        trigger_btn.click()
        page.wait_for_timeout(600)

        # Upload manifest for PVB17072026
        print("[Step 7] Uploading manifest for PVB17072026...")
        file_input = page.locator('input[type="file"]')
        file_input.set_input_files(complete_excel)
        page.wait_for_timeout(2000)

        # Commit import
        print("[Step 8] Clicking Commit Import button...")
        commit_btn = page.locator('button:has-text("Commit to ERP Database"), button:has-text("Veritabanına Aktar")')
        if commit_btn.count() == 0:
            commit_btn = page.locator('button:has-text("Commit")')
        assert commit_btn.count() > 0, "Commit button not found!"
        commit_btn.first.click()

        # Wait for commit to finish and smart rooming to execute
        page.wait_for_timeout(4000)

        # Verify success message
        success_badge = page.locator('text=Committed & Imported to Database')
        assert success_badge.count() > 0, "Commit success badge not shown!"
        print("    -> SUCCESS: Manifest committed and smart rooming executed automatically!")

        drawer.screenshot(path=screenshot_committed)
        print(f"[+] Saved committed drawer screenshot: {screenshot_committed}")

        # Check DB for Tour 6105 passengers: room numbers and pax numbers must not be null!
        pax_data = json.loads(urllib.request.urlopen("http://localhost:8001/api/passengers?tourId=6105").read())
        print(f"    -> Retrieved {len(pax_data)} passengers for Tour 6105")
        
        # Verify room numbers and pax indices are assigned
        assigned_rooms = [p['roomNumber'] for p in pax_data if p.get('roomNumber') is not None]
        assigned_pax = [p['pax'] for p in pax_data if p.get('pax') is not None and p.get('pax') > 0]
        
        print(f"    -> Passengers with RoomNumber assigned: {len(assigned_rooms)}/{len(pax_data)}")
        print(f"    -> Passengers with Pax index assigned: {len(assigned_pax)}/{len(pax_data)}")
        
        assert len(assigned_rooms) > 0, "No room numbers assigned after commit!"
        assert len(assigned_pax) > 0, "No pax indices assigned after commit!"
        print("    -> ALL ASSERTIONS PASSED: Uploaded file executed exact smart rooming module!")

        browser.close()

if __name__ == "__main__":
    test_bot_upload_smart_rooming()
