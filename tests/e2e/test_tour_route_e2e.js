const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Starting E2E verification for Tour 6102 route...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\ecele\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe'
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
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

  // Wait a few seconds for data fetch and UI rendering
  await page.waitForTimeout(3000);

  // Check for 404
  const pageTitle = await page.title();
  const pageText = await page.textContent('body');
  console.log(`Page title: ${pageTitle}`);

  const elements = await page.locator(':text("This page could not be found")').all();
  console.log('Count of text occurrences:', elements.length);
  for (const el of elements) {
    const isVisible = await el.isVisible();
    const html = await el.evaluate(e => e.outerHTML);
    console.log('Is Visible:', isVisible, 'HTML:', html);
  }

  const h1Elements = await page.locator('h1').allTextContents();
  console.log('All H1 texts:', h1Elements);

  const screenshotPath = 'C:\\Users\\ecele\\.gemini\\antigravity\\brain\\17545749-9bee-492a-a1ee-66e33111c72c\\tour_6102_detail_verified.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`📸 Screenshot saved to ${screenshotPath}`);

  // Check if tour code or title is present
  const bodyText = await page.textContent('body');
  const hasTourHeader = bodyText.includes('PVB17052026') || bodyText.includes('Budapest-Vienna-Prague');
  console.log(`Has tour header: ${hasTourHeader}`);

  if (!hasTourHeader) {
    console.error('❌ Tour details did not render!');
    await browser.close();
    process.exit(1);
  }

  console.log('✅ SUCCESS: Tour 6102 page rendered successfully with complete tour data!');

  await browser.close();
  console.log('🎉 E2E test completed successfully.');
})();
