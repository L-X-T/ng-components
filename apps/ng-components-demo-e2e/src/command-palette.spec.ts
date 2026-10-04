import { DEMO_MANIFEST, orderedDemos } from '@angular-software/ng-component-demos/manifest';
import { expect, test } from '@playwright/test';
import { gotoHydrated } from './support/hydration';

test.describe('command palette', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, DEMO_MANIFEST[0].route);
  });

  test('search button opens the palette with all entries and a focused input', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();

    const input = page.getByRole('combobox', { name: 'Search components' });
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
    await expect(page.getByRole('option')).toHaveCount(DEMO_MANIFEST.length);
  });

  test('Cmd/Ctrl+K opens, Escape closes and restores focus to the trigger', async ({ page }) => {
    await page.keyboard.press('ControlOrMeta+k');
    await expect(page.getByRole('combobox', { name: 'Search components' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('combobox', { name: 'Search components' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Search' })).toBeFocused();
  });

  test('typing filters and Enter navigates to the match', async ({ page }) => {
    await page.keyboard.press('ControlOrMeta+k');
    const input = page.getByRole('combobox', { name: 'Search components' });

    await input.fill('toast');
    await expect(page.getByRole('option')).toHaveCount(1);

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/components\/toast$/);
    await expect(input).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Toast');
  });

  test('arrow keys move the active option and Enter selects it', async ({ page }) => {
    await page.keyboard.press('ControlOrMeta+k');
    // The ArrowDown must land in the palette input, not on the page behind the
    // still-opening dialog – wait for focus first (flaky before 2026-10-04).
    await expect(page.getByRole('combobox', { name: 'Search components' })).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('option').nth(1)).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('Enter');
    // Second entry in sidebar order – the palette lists like the sidebar does.
    await expect(page).toHaveURL(new RegExp(`${orderedDemos(DEMO_MANIFEST)[1].route}$`));
  });
});
