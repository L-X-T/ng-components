import { DEMO_MANIFEST } from '@angular-software/ng-component-demos/manifest';
import { expect, test } from '@playwright/test';
import { gotoHydrated } from './support/hydration';

const THEMES = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'angular-light', label: 'Angular light' },
  { id: 'angular-dark', label: 'Angular dark' },
];

test.describe('theme switcher', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, DEMO_MANIFEST[0].route);
  });

  test('offers all four themes and applies each chosen one', async ({ page }) => {
    const trigger = page.getByRole('combobox', { name: 'Theme' });

    await expect(trigger).toContainText('Light');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await trigger.click();
    await expect(page.getByRole('listbox').getByRole('option')).toHaveText(THEMES.map((theme) => theme.label));
    await page.keyboard.press('Escape');

    // Spec 004: every theme applies, not just one (review 2026-10-04 D-16).
    for (const theme of [...THEMES].reverse()) {
      await trigger.click();
      await page.getByRole('listbox').getByRole('option', { name: theme.label, exact: true }).click();
      await expect(trigger).toContainText(theme.label);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme.id);
    }
  });

  test('persists the chosen theme across a reload', async ({ page }) => {
    const trigger = page.getByRole('combobox', { name: 'Theme' });
    await trigger.click();
    await page.getByRole('listbox').getByRole('option', { name: 'Angular dark', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'angular-dark');

    await page.reload();
    // The no-flash script's pre-hydration behaviour is covered by
    // theme-init-script.spec.ts; here: the hydrated ThemeService keeps the choice.
    await page.locator('app-root[data-hydrated]').waitFor();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'angular-dark');
    await expect(trigger).toContainText('Angular dark');
  });
});
