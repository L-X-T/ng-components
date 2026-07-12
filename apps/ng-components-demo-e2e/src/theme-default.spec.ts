import { expect, test } from '@playwright/test';

// First-visit default (review 2026-07-11 E9): with no persisted choice the
// theme follows the OS preference – dark via the no-flash inline script,
// light via ThemeService after hydration.
test.describe('first visit preferring dark', () => {
  test.use({ colorScheme: 'dark' });

  test('gets the dark theme', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('first visit preferring light', () => {
  test.use({ colorScheme: 'light' });

  test('gets the light theme', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
