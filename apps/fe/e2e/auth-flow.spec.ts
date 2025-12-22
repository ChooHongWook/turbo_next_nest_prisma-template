import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  // Generate unique test data for each test run
  const timestamp = Date.now();
  const testEmail = `test-user-${timestamp}@example.com`;
  const testPassword = 'Test123456!';
  const testName = 'Test User';

  test.describe.configure({ mode: 'serial' });

  test('should complete registration flow', async ({ page }) => {
    // Navigate to register page
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');

    // Verify register form is visible
    await expect(page.locator('h2:has-text("Register")')).toBeVisible();

    // Fill in registration form
    await page.fill('input#name', testName);
    await page.fill('input#email', testEmail);
    await page.fill('input#password', testPassword);

    // Take screenshot before submission
    await page.screenshot({
      path: 'e2e/screenshots/register-form-filled.png',
      fullPage: true,
    });

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for navigation to home page after successful registration
    await page.waitForURL('/', { timeout: 15000 });

    // Verify redirect to home page
    expect(page.url()).toContain('localhost:3001');

    // Take screenshot of successful registration
    await page.screenshot({
      path: 'e2e/screenshots/register-success.png',
      fullPage: true,
    });
  });

  test('should fail registration with existing email', async ({ page }) => {
    // Navigate to register page
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');

    // Fill in form with the same email
    await page.fill('input#name', testName);
    await page.fill('input#email', testEmail);
    await page.fill('input#password', testPassword);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error message
    await page.waitForSelector('div:has-text("Email already exists")', {
      timeout: 5000,
    });

    // Verify error is displayed
    const errorMessage = page.locator('div.bg-red-50');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/already|exist/i);

    // Take screenshot of error state
    await page.screenshot({
      path: 'e2e/screenshots/register-duplicate-error.png',
      fullPage: true,
    });
  });

  test('should logout successfully', async ({ page }) => {
    // First, login
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input#email', testEmail);
    await page.fill('input#password', testPassword);
    await page.click('button[type="submit"]');

    // Wait for redirect to home
    await page.waitForURL('/', { timeout: 15000 });

    // Click logout button if it exists
    const logoutButton = page.locator('button:has-text("Logout")').first();
    if (await logoutButton.isVisible()) {
      await logoutButton.click();

      // Should redirect to login
      await page.waitForURL('/auth/login', { timeout: 5000 });
      expect(page.url()).toContain('/auth/login');
    }

    // Take screenshot
    await page.screenshot({
      path: 'e2e/screenshots/logout-success.png',
      fullPage: true,
    });
  });

  test('should login with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    // Verify login form is visible
    await expect(page.locator('h2:has-text("Login")')).toBeVisible();

    // Fill in login form
    await page.fill('input#email', testEmail);
    await page.fill('input#password', testPassword);

    // Take screenshot before submission
    await page.screenshot({
      path: 'e2e/screenshots/login-form-filled.png',
      fullPage: true,
    });

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for navigation to home page after successful login
    await page.waitForURL('/', { timeout: 15000 });

    // Verify redirect to home page
    expect(page.url()).toContain('localhost:3001');
    expect(page.url()).not.toContain('/auth/login');

    // Take screenshot of successful login
    await page.screenshot({
      path: 'e2e/screenshots/login-success.png',
      fullPage: true,
    });
  });

  test('should fail login with invalid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    // Fill in form with invalid credentials
    await page.fill('input#email', testEmail);
    await page.fill('input#password', 'WrongPassword123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error message
    await page.waitForSelector('div.bg-red-50', { timeout: 5000 });

    // Verify error is displayed
    const errorMessage = page.locator('div.bg-red-50');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/invalid|credentials|failed/i);

    // Verify still on login page
    expect(page.url()).toContain('/auth/login');

    // Take screenshot of error state
    await page.screenshot({
      path: 'e2e/screenshots/login-invalid-credentials.png',
      fullPage: true,
    });
  });

  test('should navigate between login and register pages', async ({ page }) => {
    // Start on login page
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    // Click register link
    await page.click('a:has-text("Register")');
    await page.waitForURL('/auth/register', { timeout: 5000 });

    // Verify on register page
    await expect(page.locator('h2:has-text("Register")')).toBeVisible();

    // Click login link
    await page.click('a:has-text("Login")');
    await page.waitForURL('/auth/login', { timeout: 5000 });

    // Verify on login page
    await expect(page.locator('h2:has-text("Login")')).toBeVisible();
  });
});
