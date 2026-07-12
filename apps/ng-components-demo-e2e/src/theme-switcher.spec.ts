import { DEMO_MANIFEST } from '@angular-software/ng-component-demos/manifest';
import { expect, test } from '@playwright/test';
import { gotoHydrated } from './support/hydration';

test.describe('theme switcher', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, DEMO_MANIFEST[0].route);
  });

  test('offers all four themes and applies the chosen one', async ({ page }) => {
    const trigger = page.getByRole('combobox', { name: 'Theme' });

    await expect(trigger).toContainText('light');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await trigger.click();
    const listbox = page.getByRole('listbox');
    await expect(listbox.getByRole('option')).toHaveText(['light', 'dark', 'angular-light', 'angular-dark']);

    await listbox.getByRole('option', { name: 'dark', exact: true }).click();
    await expect(trigger).toContainText('dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
