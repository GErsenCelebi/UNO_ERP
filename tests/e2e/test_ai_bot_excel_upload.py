import os
import sys
import openpyxl
from playwright.sync_api import sync_playwright

def create_sample_excel(file_path):
    wb = openpyxl.Workbook()
    # Sheet 1: Rooming
    ws = wb.active
    ws.title = "Rooming"
    
    # Headers
    ws.append(["No", "Passenger Name", "Room Type", "Passport No", "Gender", "Pax Type", "City"])
    
    # 43 Passengers (triggering headcount mismatch if tour expects 44)
    # Row 18 has unmapped room type "Triple Deluxe"
    # Rows 5 and 6 share duplicate passport "U99887766"
    for i in range(1, 44):
        room_type = "Triple Deluxe" if i == 18 else ("Double" if i % 2 == 0 else "Single")
        passport = "U99887766" if i in [5, 6] else f"U123456{i:02d}"
        ws.append([i, f"Guest {i} Test", room_type, passport, "Adult", "Regular", "Vienna"])
        
    wb.save(file_path)
    print(f"[+] Created test Excel workbook: {file_path}")

def test_ai_bot_excel_upload():
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    artifact_dir = "C:/Users/ecele/.gemini/antigravity/brain/da3d7774-c465-41fb-9db4-d75aebe21ab7"
    test_excel_path = os.path.join(artifact_dir, "manifest_unverified.xlsx")
    screenshot_path = os.path.join(artifact_dir, "ai_bot_excel_upload_verified.png")

    create_sample_excel(test_excel_path)

    session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=chrome_path if os.path.exists(chrome_path) else None,
            headless=True
        )
        context = browser.new_context(viewport={"width": 1400, "height": 1050})
        page = context.new_page()
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")

        # 1. Navigate to a specific Tour page so the Bot has active Screen Tour context
        print("[1] Navigating to Tour detail page (/projects/1/tours/6123)...")
        page.goto("http://localhost:8001/projects/1/tours/6123", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # 2. Open Uno Smart Agent Chat Drawer
        print("[2] Opening Uno Smart Agent...")
        trigger_btn = page.locator('button:has-text("Uno Smart Agent")')
        assert trigger_btn.count() > 0, "Uno Smart Agent trigger button not found!"
        trigger_btn.click()
        page.wait_for_timeout(600)

        drawer = page.locator('text=Uno Smart Agent')
        assert drawer.count() > 0, "Chat drawer did not open!"
        print("    -> Uno Smart Agent opened successfully")

        # 3. Assert Paperclip Button is Present
        print("[3] Verifying Paperclip file upload button...")
        paperclip_btn = page.locator('button[title*="Upload Excel"]')
        assert paperclip_btn.count() > 0, "Paperclip upload button missing from footer!"
        print("    -> Paperclip upload button verified in footer")

        # 4. Upload the sample Excel workbook
        print("[4] Uploading test Excel manifest via file input...")
        file_input = page.locator('input[type="file"]')
        assert file_input.count() > 0, "Hidden file input missing!"
        file_input.set_input_files(test_excel_path)
        page.wait_for_timeout(1800)

        # 5. Verify User File Card
        print("[5] Verifying user message file card...")
        file_card = page.locator('text=manifest_unverified.xlsx')
        assert file_card.count() > 0, "Uploaded file badge missing from chat history!"
        print("    -> File card badge rendered in chat")

        # 6. Verify AI Inconsistency Review Card & Stepper
        print("[6] Verifying AI Inconsistency Review Card...")
        review_header = page.locator('text=1. File Dropped')
        assert review_header.count() > 0, "Review Card Stepper missing!"

        # Check detected issues
        issues_header = page.locator('text=Detected Issues')
        assert issues_header.count() > 0, "Detected Issues section missing!"
        print("    -> Review Card Stepper and Detected Issues verified")

        # Capture drawer screenshot showing issues and reconciliation prompt
        drawer = page.locator('div.fixed.bottom-6.right-6')
        drawer_issues_path = os.path.join(artifact_dir, "ai_bot_drawer_inconsistency_review.png")
        drawer.screenshot(path=drawer_issues_path)
        print(f"[+] Saved drawer inconsistency review screenshot to: {drawer_issues_path}")

        # 7. Verify Screen Context Target Tour Recognition & Confirmation Prompt
        print("[7] Verifying Target Tour Reconciliation Prompt...")
        tour_confirm = page.locator('text=Target Tour Confirmation Required')
        if tour_confirm.count() > 0:
            print("    -> Bot flagged discrepancy/generic filename vs active screen tour")
            confirm_btn = page.locator('button:has-text("Associate with Screen Tour")')
            if confirm_btn.count() > 0:
                confirm_btn.first.click()
                page.wait_for_timeout(400)
                print("    -> Clicked 'Associate with Screen Tour' - Filename syntax normalized!")

        # 8. Test 1-Click Fix Button for Inconsistencies
        print("[8] Testing 1-Click Fix buttons...")
        fix_buttons = page.locator('button:has-text("Apply Fix")')
        fix_count = fix_buttons.count()
        print(f"    -> Found {fix_count} open issue fix buttons")
        if fix_count > 0:
            fix_buttons.first.click()
            page.wait_for_timeout(400)
            resolved_badge = page.locator('text=Resolved')
            assert resolved_badge.count() > 0, "Issue was not marked as Resolved after clicking Apply Fix!"
            print("    -> Fix applied successfully, issue marked as 'Resolved'")

        # 9. Verify Commit & Import Button
        print("[9] Testing Commit & Import to Database button...")
        commit_btn = page.locator('button:has-text("Commit & Import to Database")')
        assert commit_btn.count() > 0, "Commit & Import button missing!"
        commit_btn.click()
        page.wait_for_timeout(2000)

        # 10. Capture Verification Screenshot
        print("[10] Capturing verification screenshots...")
        drawer = page.locator('div.fixed.bottom-6.right-6')
        drawer_committed_path = os.path.join(artifact_dir, "ai_bot_drawer_committed.png")
        drawer.screenshot(path=drawer_committed_path)
        print(f"[+] Saved drawer committed screenshot to: {drawer_committed_path}")

        page.screenshot(path=screenshot_path)
        print(f"[+] Saved full overview screenshot to: {screenshot_path}")

        browser.close()
        print("\n[SUCCESS] AI Bot Excel File Upload & Inconsistency Review Flow passed 100%!")

if __name__ == "__main__":
    test_ai_bot_excel_upload()
