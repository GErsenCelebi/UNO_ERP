const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting E2E verification for Guide Excursion Sales tab in Tour View...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\ecele\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe'
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 }
  });

  const page = await context.newPage();

  // Pre-seed local storage session
  await page.addInitScript(() => {
    localStorage.setItem('uno_erp_user_session', JSON.stringify({
      email: 'gersencelebi@gmail.com',
      name: 'G. Ersen Çelebi',
      role: 'Administrator',
      loginTime: new Date().toISOString()
    }));
  });

  await context.addCookies([
    {
      name: 'uno_session',
      value: '1',
      domain: 'localhost',
      path: '/'
    }
  ]);

  const targetUrl = 'http://localhost:8000/projects/5063/tours/6102';
  console.log(`Navigating to ${targetUrl}...`);
  const response = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`Response status: ${response.status()}`);

  await page.waitForTimeout(2000);

  // 1. Verify "Guide Excursion Sales" tab button is present
  const tabButton = page.locator('button:has-text("Guide Excursion Sales")');
  const tabExists = await tabButton.count() > 0;
  console.log(`Tab button 'Guide Excursion Sales' found: ${tabExists}`);

  if (!tabExists) {
    console.error('❌ FAILED: "Guide Excursion Sales" tab button is not visible!');
    await browser.close();
    process.exit(1);
  }

  // 2. Click the tab
  console.log('Clicking "Guide Excursion Sales" tab...');
  await tabButton.click();
  await page.waitForTimeout(2500);

  // 3. Verify Guide Excursion Sales portal content
  const pageContent = await page.textContent('body');
  const hasPortalContent = pageContent.includes('Excursions in Scope') && 
                           (pageContent.includes('ACTIVE TOUR') || pageContent.includes('SETTLED TOUR')) &&
                           pageContent.includes('Browse Catalog');
  
  console.log(`Portal content found: ${hasPortalContent}`);

  if (!hasPortalContent) {
    console.error('❌ FAILED: Guide Excursion Sales portal content not displayed!');
    await browser.close();
    process.exit(1);
  }

  // Take screenshot of the tab
  const screenshotPath = 'C:\\Users\\ecele\\.gemini\\antigravity\\brain\\17545749-9bee-492a-a1ee-66e33111c72c\\guide_excursion_sales_tab_verified.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`📸 Screenshot saved to ${screenshotPath}`);

  console.log('✅ SUCCESS: Guide Excursion Sales tab fully enabled and verified!');
  await browser.close();
})();
