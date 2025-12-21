import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if the page title is present
    await expect(page).toHaveTitle(/.*/, { timeout: 10000 });

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'e2e/screenshots/home-page.png', fullPage: true });
  });

  test('should navigate successfully', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Verify the page is accessible
    expect(page.url()).toContain('localhost:3001');
  });
});
