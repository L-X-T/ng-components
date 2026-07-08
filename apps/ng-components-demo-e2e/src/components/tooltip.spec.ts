import { expect, test } from '@playwright/test';
import { gotoHydrated } from '../support/hydration';

test.describe('tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, '/components/tooltip');
  });

  test('shows on hover and hides on leave', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Add to library' });

    await trigger.hover();
    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Adds the item to your library.');

    await page.getByRole('heading', { level: 1 }).hover();
    await expect(page.getByRole('tooltip')).toBeHidden();
  });

  test('shows on focus, links via aria-describedby, hides on Escape', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Add to library' });

    await trigger.focus();
    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();

    const tooltipId = await tooltip.getAttribute('id');
    await expect(trigger).toHaveAttribute('aria-describedby', tooltipId ?? '');

    await page.keyboard.press('Escape');
    await expect(page.getByRole('tooltip')).toBeHidden();
  });

  test('hides on blur', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Add to library' });

    await trigger.focus();
    await expect(page.getByRole('tooltip')).toBeVisible();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('tooltip')).toBeHidden();
  });
});
