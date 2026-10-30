"""
Playwright E2E Test Suite for Guide User Profile & Access Control
Verifies:
1. Guide login via API (/api/Auth/login) for testGuide GuideErsen and other guides (GuideAnna, GuideJan, GuideLevent, GuideMehmet) with password 'Guide123'
2. Guide role session enforcement in Uno_CRM
3. Guide sees ONLY their assigned tours on the Tours board
4. '+ New Tour' button is hidden for Guides
5. Sidebar restricted to ONLY My Tours (Dashboard, Projects, Master Data, Settings hidden)
6. Route protection: Guides navigating to /dashboard, /projects, /master-data, /settings are redirected to /tours
7. Tour Detail page for assigned tour: Guide can view ALL 6 TABS (Tour Info, Calendar, Services, Bookings, Guide Excursion Sales, Invoice)
8. Unassigned Tour access: Displays Access Denied boundary
9. Back button on tour detail safely routes to /tours
"""

import os
import sys
import time
import json
import urllib.request
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\ecele\.gemini\antigravity\brain\9aa5f044-1f5b-45f5-b2fd-69f94cf2c55a"
BASE_URL = "http://localhost:8000"
API_URL = "http://localhost:8001"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def test_guide_api_authentications():
    print("\n--- [API AUTH CHECK] Verifying Guide accounts with password Guide123 ---")
    test_guides = ["GuideErsen", "GuideAnna", "GuideJan", "GuideLevent", "GuideMehmet"]
    for g in test_guides:
        req = urllib.request.Request(
            f"{API_URL}/api/Auth/login",
            data=json.dumps({"email": g, "password": "Guide123"}).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200, f"Failed to login {g}"
            data = json.loads(resp.read().decode())
            assert data.get("success") is True, f"Login not successful for {g}"
            user = data.get("user")
            assert user.get("role") == "Guide", f"Role is not Guide for {g}"
            assert user.get("guideId") is not None, f"guideId missing for {g}"
            print(f"  -> {g} successfully authenticated (Name: {user.get('name')}, Role: {user.get('role')}, GuideId: {user.get('guideId')})")
    print("  -> PASS: All tested guide accounts verified via /api/Auth/login.")

def run_guide_profile_e2e():
    print("=" * 75)
    print("STARTING E2E AUTOMATION TEST: GUIDE USER PROFILE & ACCESS BOUNDARIES")
    print(f"Target UI: {BASE_URL}")
    print("=" * 75)

    test_guide_api_authentications()

    session_json = json.dumps({
        "email": "guideersen@uno-dmc.cz",
        "name": "Guide Ersen",
        "role": "Guide",
        "guideId": 6022,
        "loginTime": "2026-10-27T16:00:00Z"
    })

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=CHROME_PATH,
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        context = browser.new_context(viewport={"width": 1480, "height": 1050})
        page = context.new_page()

        # Inject auth session before navigation
        page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")

        # Step 1: Navigate to /tours
        print("\n[STEP 1] Navigating to /tours as GuideErsen...")
        page.goto(f"{BASE_URL}/tours", wait_until="networkidle", timeout=30000)
        time.sleep(2)

        # Step 2: Verify Tours Board displays "My Assigned Tours"
        print("\n[STEP 2] Verifying Tours page title and controls for Guide...")
        title_el = page.locator("h1:has-text('My Assigned Tours')").first
        assert title_el.is_visible(), "Header does not display 'My Assigned Tours' for Guide!"
        print("  -> PASS: Header correctly displays 'My Assigned Tours'.")

        # Step 3: Verify "New Tour" button is HIDDEN
        print("\n[STEP 3] Verifying '+ New Tour' button is hidden for Guides...")
        new_tour_btn = page.locator("button:has-text('New Tour')")
        assert not new_tour_btn.is_visible(), "Violation: 'New Tour' button is visible to a Guide!"
        print("  -> PASS: 'New Tour' button is completely hidden.")

        # Step 4: Verify ONLY assigned tour (BVP1907) is visible
        print("\n[STEP 4] Verifying only assigned tours appear on board...")
        page.wait_for_selector("text=BVP1907", timeout=10000)
        bvp_card = page.locator("text=BVP1907").first
        assert bvp_card.is_visible(), "Assigned tour 'BVP1907' not visible on board!"
        print("  -> Found assigned tour: BVP1907 (Budapest-Vienna-Prague)")

        # Verify unassigned tours (e.g. 6128) are NOT on the board
        unassigned = page.locator("text=ABCDTEST")
        assert not unassigned.is_visible(), "Violation: Unassigned tour 'ABCDTEST' is visible to Guide!"
        print("  -> Verified: Unassigned tours are not present.")

        # Capture tours board screenshot
        shot1 = os.path.join(ARTIFACT_DIR, "guide_tours_view.png")
        page.screenshot(path=shot1, full_page=False)
        print(f"  -> Screenshot captured: {shot1}")

        # Step 5: Verify Sidebar restrictions
        print("\n[STEP 5] Verifying Sidebar restrictions for Guide...")
        sidebar_dash = page.locator("aside a[href='/dashboard'], aside button:has-text('Dashboard')")
        assert not sidebar_dash.is_visible(), "Violation: 'Dashboard' is visible in sidebar to a Guide!"

        sidebar_projects = page.locator("aside a[href='/projects'], aside button:has-text('Projection')")
        assert not sidebar_projects.is_visible(), "Violation: 'Projects' is visible in sidebar to a Guide!"

        sidebar_master = page.locator("aside a[href='/master-data']")
        assert not sidebar_master.is_visible(), "Violation: 'Master Data' is visible in sidebar to a Guide!"

        sidebar_settings = page.locator("aside a[href='/settings']")
        assert not sidebar_settings.is_visible(), "Violation: 'User Accounts' is visible in sidebar to a Guide!"

        sidebar_my_tours = page.locator("aside a[href='/tours']")
        assert sidebar_my_tours.is_visible(), "Sidebar 'My Tours' link is missing!"

        guide_badge = page.locator("aside span:has-text('Guide')").first
        assert guide_badge.is_visible(), "Guide role badge missing in user profile section!"
        print("  -> PASS: Sidebar strictly restricted to My Tours; all forbidden menus hidden.")

        # Step 6: Verify Route Protection & Redirection
        print("\n[STEP 6] Testing Route Boundary Protection (Guides must be redirected to /tours)...")
        forbidden_routes = ["/dashboard", "/projects", "/master-data", "/settings", "/finance"]
        for route in forbidden_routes:
            page.goto(f"{BASE_URL}{route}", wait_until="networkidle", timeout=15000)
            time.sleep(1)
            cur_url = page.url
            print(f"  -> Navigated to {route} => Current URL: {cur_url}")
            assert "/tours" in cur_url, f"Route violation! Guide accessed {route} without redirect to /tours!"
        print("  -> PASS: All unauthorized routes successfully redirected to /tours.")

        # Step 7: Access Assigned Tour Detail Page
        print("\n[STEP 7] Navigating to assigned tour /projects/5063/tours/5051...")
        page.goto(f"{BASE_URL}/projects/5063/tours/5051", wait_until="networkidle", timeout=30000)
        time.sleep(2)

        page.wait_for_selector("text=BVP1907", timeout=10000)
        print("  -> Assigned tour detail page loaded.")

        # Step 8: Verify ALL 6 Tabs are present for Assigned Tour
        print("\n[STEP 8] Verifying ALL 6 Tabs on assigned tour...")
        expected_tabs = [
            ("Tour Info", "info"),
            ("Calendar", "calendar"),
            ("Services", "services"),
            ("Bookings", "bookings"),
            ("Guide Excursion Sales", "excursions"),
            ("Invoice", "invoice")
        ]

        for tab_label, tab_key in expected_tabs:
            btn = page.locator(f"div.border-b button:has-text('{tab_label}')").first
            assert btn.is_visible(), f"Tab '{tab_label}' is missing for assigned tour!"
            print(f"  -> Tab verified: {tab_label}")
            # Click tab to verify it renders content
            btn.click()
            time.sleep(1)

        # Capture assigned tour detail screenshot with all tabs
        shot2 = os.path.join(ARTIFACT_DIR, "guide_assigned_tour_tabs.png")
        page.screenshot(path=shot2, full_page=False)
        print(f"  -> Screenshot captured: {shot2}")

        # Step 9: Verify Back Button routes to /tours
        print("\n[STEP 9] Verifying Back button routes to /tours (not /projects/5063)...")
        back_btn = page.locator("header button[title='Back']").first
        back_btn.click()
        time.sleep(2)
        print(f"  -> Clicked Back => Current URL: {page.url}")
        assert "/tours" in page.url, f"Back button did not route Guide to /tours! Current: {page.url}"
        print("  -> PASS: Back button safely routes Guide to /tours.")

        # Step 10: Verify Unassigned Tour Access Boundary
        print("\n[STEP 10] Testing Access Boundary on unassigned tour (/projects/6101/tours/6128)...")
        page.goto(f"{BASE_URL}/projects/6101/tours/6128", wait_until="networkidle", timeout=20000)
        time.sleep(2)

        page.wait_for_selector("text=Access Denied", timeout=10000)
        denied_header = page.locator("h2:has-text('Access Denied')").first
        assert denied_header.is_visible(), "Access Denied screen did not appear for unassigned tour!"
        print("  -> PASS: 'Access Denied' boundary correctly enforced on unassigned tour.")

        shot3 = os.path.join(ARTIFACT_DIR, "guide_access_denied_boundary.png")
        page.screenshot(path=shot3, full_page=False)
        print(f"  -> Screenshot captured: {shot3}")

        print("\n" + "=" * 75)
        print("ALL E2E GUIDE PROFILE & ACCESS BOUNDARY TESTS PASSED SUCCESSFULLY!")
        print("=" * 75)

        context.close()
        browser.close()

if __name__ == "__main__":
    run_guide_profile_e2e()
