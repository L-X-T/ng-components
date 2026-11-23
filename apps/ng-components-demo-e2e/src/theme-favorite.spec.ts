import { expect, type Locator, type Page, test } from '@playwright/test';
import { gotoHydrated } from './support/hydration';

// The favorite palette: the exact orange #d97757 on call-to-action buttons in
// light and dark, always with the dark label (white on it fails AA).
const ORANGE = 'rgb(217, 119, 87)';
const DARK_LABEL = 'oklch(0.145 0 0)';

const choose = async (page: Page, select: string, label: string): Promise<void> => {
  await page.getByRole('combobox', { name: select }).click();
  await page.getByRole('listbox').getByRole('option', { name: label, exact: true }).click();
};

const style = (locator: Locator, property: 'backgroundColor' | 'color'): Promise<string> =>
  locator.evaluate((element, name) => getComputedStyle(element)[name], property);

const defaultButton = (page: Page): Locator =>
  page.locator('#button-variants').getByRole('button', { name: 'Default' });

test.describe('favorite palette', () => {
  test('primary buttons are exactly #d97757 with the dark label in light and dark', async ({ page }) => {
    await gotoHydrated(page, '/components/button');
    await choose(page, 'Theme palette', 'Favorite');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'favorite');

    for (const mode of ['Light', 'Dark']) {
      await choose(page, 'Theme mode', mode);
      await expect.poll(() => style(defaultButton(page), 'backgroundColor')).toBe(ORANGE);
      await expect.poll(() => style(defaultButton(page), 'color')).toBe(DARK_LABEL);
    }
  });

  test('persists across a reload', async ({ page }) => {
    await gotoHydrated(page, '/components/button');
    await choose(page, 'Theme palette', 'Favorite');
    await choose(page, 'Theme mode', 'Dark');

    await page.reload();
    await page.locator('app-root[data-hydrated]').waitFor();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'favorite');
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await expect(page.getByRole('combobox', { name: 'Theme palette' })).toContainText('Favorite');
    await expect.poll(() => style(defaultButton(page), 'backgroundColor')).toBe(ORANGE);
  });

  test('auto mode follows the OS and keeps the orange', async ({ page }) => {
    const bodyBackground = (): Promise<string> => style(page.locator('body'), 'backgroundColor');

    await page.emulateMedia({ colorScheme: 'light' });
    await gotoHydrated(page, '/components/button');
    await choose(page, 'Theme palette', 'Favorite');
    await expect(page.locator('html')).not.toHaveAttribute('data-theme-mode', /.*/);
    const light = await bodyBackground();

    await page.emulateMedia({ colorScheme: 'dark' });
    await expect.poll(bodyBackground).not.toBe(light);
    await expect.poll(() => style(defaultButton(page), 'backgroundColor')).toBe(ORANGE);

    await page.emulateMedia({ colorScheme: 'light' });
    await expect.poll(bodyBackground).toBe(light);
    await expect.poll(() => style(defaultButton(page), 'backgroundColor')).toBe(ORANGE);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'favorite');
    await expect(page.locator('html')).not.toHaveAttribute('data-theme-mode', /.*/);
  });
});
