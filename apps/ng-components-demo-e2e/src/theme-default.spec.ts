import { expect, test } from '@playwright/test';

// First-visit default (review 2026-07-11 E9): with no persisted choice the
// theme follows the OS preference. The no-flash inline script is unit-tested
// in theme-init-script.spec.ts; here both cases are checked after hydration so
// a hydration-time override cannot slip through (review 2026-10-04 D-16).
test.describe('first visit preferring dark', () => {
  test.use({ colorScheme: 'dark' });

  test('gets the dark theme after hydration', async ({ page }) => {
    await page.goto('/');
    await page.locator('app-root[data-hydrated]').waitFor();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('first visit preferring light', () => {
  test.use({ colorScheme: 'light' });

  test('gets the light theme after hydration', async ({ page }) => {
    await page.goto('/');
    await page.locator('app-root[data-hydrated]').waitFor();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('follows an OS appearance change until the visitor picks a theme (lib review L-09)', async ({ page }) => {
    await page.goto('/');
    await page.locator('app-root[data-hydrated]').waitFor();

    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.getByRole('combobox', { name: 'Theme' }).click();
    await page.getByRole('listbox').getByRole('option', { name: 'Angular light', exact: true }).click();
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'angular-light');
  });
});
