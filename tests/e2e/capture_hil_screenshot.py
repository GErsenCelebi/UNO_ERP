import os
import sys
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
session_json = '{"email":"evren@uno-dmc.cz","name":"Evren","role":"Administrator","loginTime":"2026-08-21T00:00:00Z"}'

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=chrome_path if os.path.exists(chrome_path) else None,
        headless=True
    )
    context = browser.new_context(viewport={"width": 1440, "height": 1050})
    page = context.new_page()
    page.add_init_script(f"localStorage.setItem('uno_erp_user_session', JSON.stringify({session_json}));")
    page.goto("http://localhost:8001/tours", wait_until="networkidle")
    page.wait_for_timeout(1000)

    trigger_btn = page.locator('button:has-text("Uno Smart Agent")')
    if trigger_btn.count() > 0:
        trigger_btn.click()
        page.wait_for_timeout(600)

        # Fill prompt
        inp = page.locator('input[placeholder*="Ask"], input[placeholder*="Type"]')
        if inp.count() > 0:
            inp.first.fill("check the total number of rooms match with hotel services entry for tour 6128")
            inp.first.press("Enter")

            # Wait for bot response with HIL alert to finish rendering
            page.wait_for_selector("text=HIL", timeout=25000)
            page.wait_for_timeout(1000)

            # Click drawer expand/maximize button in top right if available
            expand_btn = page.locator('button:has-text("⛶"), button[title*="Expand"], button[title*="Full"], button[title*="Maximize"]')
            if expand_btn.count() == 0:
                # Find the expand icon button near top-right close button in drawer header
                header_btns = page.locator('div[class*="items-center"] button:has(svg)')
                if header_btns.count() >= 2:
                    header_btns.nth(header_btns.count() - 2).click()
            else:
                expand_btn.first.click()
            page.wait_for_timeout(600)

            # Scroll down slightly inside chat container to display HIL table clearly
            page.evaluate("""() => {
                const els = document.querySelectorAll('.overflow-y-auto');
                for (const el of els) {
                    if (el.scrollHeight > el.clientHeight) {
                        el.scrollTop = 350;
                    }
                }
            }""")
            page.wait_for_timeout(600)

            page.screenshot(path="C:/Users/ecele/.gemini/antigravity/brain/da3d7774-c465-41fb-9db4-d75aebe21ab7/ai_bot_rooming_hil_verification.png")
            print("[+] Captured ai_bot_rooming_hil_verification.png")
    browser.close()
