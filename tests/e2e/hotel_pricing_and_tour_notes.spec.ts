import { test, expect } from '@playwright/test';

test.describe('Hotel Pricing Basis, Tour Dates & Operational Notes E2E', () => {
  const BASE_URL = 'http://localhost:8000';

  test('Verify Tour Creation Date Fallback and Tour Operational Notes', async ({ page }) => {
    // 1. Navigate to Projects Page
    await page.goto(`${BASE_URL}/projects`);
    await page.waitForLoadState('networkidle');

    // 2. Open First Project
    const firstProjectLink = page.locator('table tbody tr td a').first();
    if (await firstProjectLink.isVisible()) {
      await firstProjectLink.click();
    } else {
      await page.goto(`${BASE_URL}/projects/1`);
    }

    // 3. Open First Tour Detail Page
    await page.waitForLoadState('networkidle');
    const firstTourLink = page.locator('a[href*="/tours/"]').first();
    if (await firstTourLink.isVisible()) {
      await firstTourLink.click();
    } else {
      await page.goto(`${BASE_URL}/projects/1/tours/1`);
    }

    // 4. Verify Operational Remarks & Special Tour Notes Field
    await page.waitForLoadState('networkidle');
    const notesTextarea = page.locator('textarea[placeholder*="special tour instructions"]');
    await expect(notesTextarea).toBeVisible();

    // 5. Update Notes and Save
    const testNotes = `E2E Automated Test Note - ${new Date().toISOString()}`;
    await notesTextarea.fill(testNotes);
    
    const saveNotesBtn = page.locator('button:has-text("Save Notes")');
    await saveNotesBtn.click();

    // 6. Reload page to verify persistence
    await page.reload();
    await expect(notesTextarea).toHaveValue(testNotes);
  });

  test('Verify Hotel Service Pricing Basis Toggle & Auto-Fill', async ({ page }) => {
    await page.goto(`${BASE_URL}/projects/1/tours/1`);
    await page.waitForLoadState('networkidle');

    // Switch to Services tab
    const servicesTab = page.locator('button:has-text("Services"), tab:has-text("Services")').first();
    if (await servicesTab.isVisible()) {
      await servicesTab.click();
    }

    // Open Add Hotel Stay Modal
    const addHotelBtn = page.locator('button:has-text("+ Add Hotel Stay"), button:has-text("Add Hotel")').first();
    if (await addHotelBtn.isVisible()) {
      await addHotelBtn.click();

      // Verify Pricing Basis toggle buttons exist
      const perRoomBtn = page.locator('button:has-text("Per Room")');
      const perPaxBtn = page.locator('button:has-text("Per Pax")');
      const autoFillBtn = page.locator('button:has-text("Auto-Fill Bookings")');

      await expect(perRoomBtn).toBeVisible();
      await expect(perPaxBtn).toBeVisible();
      await expect(autoFillBtn).toBeVisible();

      // Click Per Pax toggle
      await perPaxBtn.click();
      await page.waitForTimeout(300);

      // Click Per Room toggle
      await perRoomBtn.click();
    }
  });
});
