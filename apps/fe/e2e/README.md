# E2E Testing with Playwright

This directory contains end-to-end tests for the frontend application using Playwright.

## Prerequisites

- Playwright and browsers are already installed
- Make sure both backend (port 3000) and frontend (port 3001) are running

## Running Tests

### Run all tests (headless)

```bash
pnpm run test:e2e
```

### Run tests with UI mode (recommended for development)

```bash
pnpm run test:e2e:ui
```

### Run tests in headed mode (see browser)

```bash
pnpm run test:e2e:headed
```

### Debug tests

```bash
pnpm run test:e2e:debug
```

### View test report

```bash
pnpm run test:e2e:report
```

## Test Structure

```
e2e/
├── home.spec.ts      # Home page tests
├── auth.spec.ts      # Authentication tests
├── screenshots/      # Test screenshots (gitignored)
└── README.md         # This file
```

## Writing Tests

Example test:

```typescript
import { test, expect } from '@playwright/test';

test('should load page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/My App/);
});
```

## Configuration

Playwright configuration is in `playwright.config.ts` at the app root.

Key settings:

- Base URL: http://localhost:3001
- Test directory: ./e2e
- Browsers: Chromium
- Auto-start dev server before tests

## CI/CD

Tests are configured to:

- Retry 2 times on CI
- Run sequentially on CI
- Fail build if `test.only` is found
- Generate HTML reports

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
