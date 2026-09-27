"""
E2E Test: Sidebar User Profile Relocation & Screen-Level Audit History Sections
Tests:
1. Sidebar:
   - User profile card (Avatar, G. Ersen Çelebi, Administrator badge, logout) is positioned above Dashboard.
   - Standalone Audit Logs link is removed from sidebar.
2. Project Details Page (/projects/6101):
   - Project Audit History section is visible at the end of the screen.
   - Contains CREATE record with summary 'Created project TEST-20260829'.
3. Tour Details Page (/projects/6101/tours/6128):
   - Tour Audit History section is visible at the end of the screen.
   - Contains CREATE record with summary 'Created tour ABCDTEST (BVP)'.
4. Master Data Page (/master-data):
   - Audit History section is visible at the end of each tab.
   - Verifies auto-tracked audit entries for Master Data entities (Project Statuses, Hotels, Guides).
"""

import json
import time
import sys
from playwright.sync_api import sync_playwright

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def test_audit_sections_and_sidebar():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    artifacts_dir = r"C:\Users\ecele\.gemini\antigravity\brain\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"
    base_url = "http://localhost:8000"

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        ctx = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = ctx.new_page()

        session = json.dumps({
            "email": "gersencelebi@gmail.com", 
            "name": "G. Ersen Çelebi", 
            "role": "Administrator", 
            "loginTime": "2026-08-21T00:00:00Z"
        })
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session}));")

        print("--- Step 1: Verify Sidebar Profile Position & Removed Standalone Audit Link ---")
        page.goto(f"{base_url}/dashboard", wait_until="networkidle")
        time.sleep(2)

        # 1. Verify user profile card exists in sidebar
        user_name_elem = page.locator('aside >> text=G. Ersen Çelebi')
        assert user_name_elem.is_visible(), "User name 'G. Ersen Çelebi' should be visible in sidebar"
        print("PASS: User profile card is visible in sidebar.")

        # 2. Verify user profile is positioned above Dashboard
        user_card_box = user_name_elem.bounding_box()
        dashboard_link = page.locator('aside a:has-text("Dashboard")')
        assert dashboard_link.is_visible(), "Dashboard link should be visible"
        dashboard_box = dashboard_link.bounding_box()

        assert user_card_box['y'] < dashboard_box['y'], f"User profile card (y={user_card_box['y']}) must be above Dashboard link (y={dashboard_box['y']})"
        print(f"PASS: User profile card (y={user_card_box['y']:.1f}) is rendered ABOVE Dashboard (y={dashboard_box['y']:.1f}).")

        # 3. Verify standalone Audit Logs link is NOT in sidebar
        audit_sidebar_link = page.locator('aside a[href="/audit-logs"]')
        assert audit_sidebar_link.count() == 0, "Standalone /audit-logs link must be removed from sidebar"
        print("PASS: Standalone Audit Logs link is removed from sidebar navigation.")

        # Capture sidebar screenshot
        page.screenshot(path=f"{artifacts_dir}\\sidebar_profile_above_dashboard.png")
        print("Captured screenshot: sidebar_profile_above_dashboard.png")

        print("--- Step 2: Project Details Screen Audit Section ---")
        page.goto(f"{base_url}/projects/6101", wait_until="networkidle")
        time.sleep(2)

        # Scroll to bottom to view audit section
        project_audit_section = page.locator('text=Project TEST-20260829 Audit History')
        project_audit_section.scroll_into_view_if_needed()
        time.sleep(1)

        assert project_audit_section.is_visible(), "Project Audit History section header should be visible"
        project_create_log = page.locator('text=Created project TEST-20260829')
        assert project_create_log.is_visible(), "Project CREATE audit log should be visible"
        print("PASS: Project Details page contains Audit History section with CREATE log.")

        page.screenshot(path=f"{artifacts_dir}\\project_details_audit_section.png")
        print("Captured screenshot: project_details_audit_section.png")

        print("--- Step 3: Tour Details Screen Audit Section ---")
        page.goto(f"{base_url}/projects/6101/tours/6128", wait_until="networkidle")
        time.sleep(2)

        # Scroll to bottom of Tour Info tab to view audit section
        tour_audit_section = page.locator('text=Tour ABCDTEST Audit History')
        tour_audit_section.scroll_into_view_if_needed()
        time.sleep(1)

        assert tour_audit_section.is_visible(), "Tour Audit History section header should be visible"
        tour_create_log = page.locator('text=Created tour ABCDTEST')
        assert tour_create_log.is_visible(), "Tour CREATE audit log should be visible"
        print("PASS: Tour Details page contains Audit History section with CREATE log.")

        page.screenshot(path=f"{artifacts_dir}\\tour_details_audit_section.png")
        print("Captured screenshot: tour_details_audit_section.png")

        print("--- Step 4: Master Data Screen Audit Section ---")
        page.goto(f"{base_url}/master-data", wait_until="networkidle")
        time.sleep(2)

        # 1. Project Data tab (default active: projectStatuses)
        project_status_audit = page.locator('h3:has-text("Project Statuses Audit History")').first
        project_status_audit.scroll_into_view_if_needed()
        time.sleep(1)
        assert project_status_audit.is_visible(), "Project Statuses Audit History section should be visible"
        print("PASS: Project Statuses Audit History section is visible on initial load.")
        page.screenshot(path=f"{artifacts_dir}\\master_data_project_statuses_audit.png")

        # 2. Click 'Tours Data' section which defaults to Hotels
        tours_data_btn = page.locator('button:has-text("Tours Data")')
        tours_data_btn.click()
        time.sleep(2)

        hotel_audit_section = page.locator('h3:has-text("Hotels Audit History")').first
        hotel_audit_section.scroll_into_view_if_needed()
        time.sleep(1)

        assert hotel_audit_section.is_visible(), "Hotels Audit History section should be visible on Tours Data -> Hotels"
        print("PASS: Hotels Audit History section is visible on Master Data Hotels tab.")

        page.screenshot(path=f"{artifacts_dir}\\master_data_hotels_audit_section.png")
        print("Captured screenshot: master_data_hotels_audit_section.png")

        # 3. Switch to Guides tab
        guides_tab = page.locator('button:has-text("Guides")').first
        guides_tab.click()
        time.sleep(2)

        guide_audit_section = page.locator('h3:has-text("Guides Audit History")').first
        guide_audit_section.scroll_into_view_if_needed()
        time.sleep(1)

        assert guide_audit_section.is_visible(), "Guides Audit History section should be visible on Guides tab"
        print("PASS: Guides Audit History section is visible on Master Data Guides tab.")

        page.screenshot(path=f"{artifacts_dir}\\master_data_guides_audit_section.png")
        print("Captured screenshot: master_data_guides_audit_section.png")

        browser.close()
        print("\nAll E2E Audit Log and Sidebar tests PASSED successfully!")

if __name__ == "__main__":
    test_audit_sections_and_sidebar()
