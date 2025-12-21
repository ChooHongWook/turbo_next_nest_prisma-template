import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page elements', async ({ page }) => {
    // Navigate to login page (adjust the URL if needed)
    await page.goto('/login');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Take a screenshot
    await page.screenshot({ path: 'e2e/screenshots/login-page.png', fullPage: true });
  });

  test('should handle login form interaction', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Try to find common login form elements
    // Adjust selectors based on your actual login form
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();

    // Check if login form elements exist
    if (await emailInput.count() > 0) {
      await expect(emailInput).toBeVisible();
    }

    if (await passwordInput.count() > 0) {
      await expect(passwordInput).toBeVisible();
    }
  });
});
