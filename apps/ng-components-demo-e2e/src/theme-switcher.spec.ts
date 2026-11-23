import { DEMO_MANIFEST } from '@ngc-internal/demos/manifest';
import { expect, type Page, test } from '@playwright/test';
import { gotoHydrated } from './support/hydration';

const PALETTES = [
  { id: 'neutral', label: 'Neutral' },
  { id: 'angular', label: 'Angular' },
  { id: 'favorite', label: 'Favorite' },
];
const MODES = [
  { id: null, label: 'Auto' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

const choose = async (page: Page, select: string, label: string): Promise<void> => {
  await page.getByRole('combobox', { name: select }).click();
  await page.getByRole('listbox').getByRole('option', { name: label, exact: true }).click();
};

test.describe('theme switcher', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, DEMO_MANIFEST[0].route);
  });

  test('offers every palette and applies each chosen one', async ({ page }) => {
    const trigger = page.getByRole('combobox', { name: 'Theme palette' });
    await expect(trigger).toContainText('Neutral');

    await trigger.click();
    await expect(page.getByRole('listbox').getByRole('option')).toHaveText(PALETTES.map((palette) => palette.label));
    await page.keyboard.press('Escape');

    // Spec 004: every choice applies, not just one (review 2026-10-04 D-16).
    for (const palette of [...PALETTES].reverse()) {
      await choose(page, 'Theme palette', palette.label);
      await expect(trigger).toContainText(palette.label);
      await expect(page.locator('html')).toHaveAttribute('data-theme', palette.id);
    }
  });

  test('offers auto, light and dark in that order and applies each chosen one', async ({ page }) => {
    const trigger = page.getByRole('combobox', { name: 'Theme mode' });
    await expect(trigger).toContainText('Auto');

    await trigger.click();
    await expect(page.getByRole('listbox').getByRole('option')).toHaveText(MODES.map((mode) => mode.label));
    await page.keyboard.press('Escape');

    for (const mode of [...MODES].reverse()) {
      await choose(page, 'Theme mode', mode.label);
      await expect(trigger).toContainText(mode.label);
      await expect.poll(() => page.locator('html').getAttribute('data-theme-mode')).toBe(mode.id);
    }
  });

  test('persists palette and mode across a reload', async ({ page }) => {
    await choose(page, 'Theme palette', 'Angular');
    await choose(page, 'Theme mode', 'Dark');

    await page.reload();
    // The no-flash script's pre-hydration behaviour is covered by
    // theme-init-script.spec.ts; here: the hydrated service keeps the choice.
    await page.locator('app-root[data-hydrated]').waitFor();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'angular');
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await expect(page.getByRole('combobox', { name: 'Theme palette' })).toContainText('Angular');
    await expect(page.getByRole('combobox', { name: 'Theme mode' })).toContainText('Dark');
  });
});

test('migrates an old stored theme (angular-dark) to the Angular palette in dark mode', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('ngc-theme', 'angular-dark');
      sessionStorage.setItem('seeded', '1');
    }
  });
  await gotoHydrated(page, '/');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'angular');
  await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
  expect(
    await page.evaluate(() => [localStorage.getItem('ngc-theme'), localStorage.getItem('ngc-theme-mode')]),
  ).toEqual(['angular', 'dark']);
});
