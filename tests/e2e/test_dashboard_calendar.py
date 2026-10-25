import os
import time
from playwright.sync_api import sync_playwright

session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'
chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=chrome_path if os.path.exists(chrome_path) else None,
        headless=True
    )
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.add_init_script(f'localStorage.setItem("uno_erp_user_session", JSON.stringify({session_json}));')
    
    print("Testing localhost:8000/dashboard...")
    page.goto("http://localhost:8000/dashboard", wait_until="networkidle")
    page.wait_for_timeout(3000)
    page.screenshot(path="C:/Users/ecele/.gemini/antigravity/brain/17545749-9bee-492a-a1ee-66e33111c72c/project_calendar_fixed.png")
    
    # Check rects/bars in the chart
    bars = page.locator(".recharts-bar-rectangle")
    print("Rendered chart bars count:", bars.count())
    
    # Check ticks
    ticks = page.locator(".recharts-cartesian-axis-tick text")
    tick_texts = ticks.all_inner_texts()
    print("Rendered axis ticks:", tick_texts[:10])
    
    # Also verify on Port 8001 (ASP.NET Core API hosted SPA)
    print("Testing localhost:8001/dashboard...")
    page.goto("http://localhost:8001/dashboard", wait_until="networkidle")
    page.wait_for_timeout(3000)
    page.screenshot(path="C:/Users/ecele/.gemini/antigravity/brain/17545749-9bee-492a-a1ee-66e33111c72c/project_calendar_api_8001.png")
    bars_8001 = page.locator(".recharts-bar-rectangle")
    print("Port 8001 rendered chart bars count:", bars_8001.count())
    assert bars_8001.count() >= 6, "Expected at least 6 bars on Port 8001"
    
    browser.close()
print("All dashboard calendar tests passed!")
