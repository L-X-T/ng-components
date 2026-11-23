import { expect, type Page, test } from '@playwright/test';

// First-visit default: auto mode – no data-theme-mode attribute, CSS follows
// the OS colour scheme through light-dark(). The no-flash inline script is
// unit-tested in theme-init-script.spec.ts; here everything is checked after
// hydration so a hydration-time override cannot slip through (review
// 2026-10-04 D-16).
const bodyBackground = (page: Page): Promise<string> =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

async function backgroundFor(page: Page, colorScheme: 'light' | 'dark'): Promise<string> {
  await page.emulateMedia({ colorScheme });
  await page.goto('/');
  await page.locator('app-root[data-hydrated]').waitFor();
  return bodyBackground(page);
}

test.describe('auto mode', () => {
  test('carries the neutral palette and no mode attribute after hydration', async ({ page }) => {
    await page.goto('/');
    await page.locator('app-root[data-hydrated]').waitFor();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'neutral');
    await expect(page.locator('html')).not.toHaveAttribute('data-theme-mode', /.*/);
    await expect(page.getByRole('combobox', { name: 'Theme mode' })).toContainText('Auto');
  });

  test('follows an OS colour scheme change in both directions without any attribute', async ({ page }) => {
    const light = await backgroundFor(page, 'light');

    await page.emulateMedia({ colorScheme: 'dark' });
    await expect.poll(() => bodyBackground(page)).not.toBe(light);
    const dark = await bodyBackground(page);

    await page.emulateMedia({ colorScheme: 'light' });
    await expect.poll(() => bodyBackground(page)).toBe(light);
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect.poll(() => bodyBackground(page)).toBe(dark);
    await expect(page.locator('html')).not.toHaveAttribute('data-theme-mode', /.*/);
  });
});

test.describe('explicit mode', () => {
  const pickMode = async (page: Page, label: string): Promise<void> => {
    await page.getByRole('combobox', { name: 'Theme mode' }).click();
    await page.getByRole('listbox').getByRole('option', { name: label, exact: true }).click();
  };

  test('light wins over a dark OS', async ({ page }) => {
    const light = await backgroundFor(page, 'light');
    const dark = await backgroundFor(page, 'dark');

    await pickMode(page, 'Light');

    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'light');
    await expect.poll(() => bodyBackground(page)).toBe(light);
    expect(light).not.toBe(dark);
  });

  test('dark wins over a light OS', async ({ page }) => {
    const dark = await backgroundFor(page, 'dark');
    const light = await backgroundFor(page, 'light');

    await pickMode(page, 'Dark');

    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await expect.poll(() => bodyBackground(page)).toBe(dark);
    expect(dark).not.toBe(light);
  });
});
