import { expect, test } from '@playwright/test';
import { gotoHydrated } from '../support/hydration';

test.describe('toast', () => {
  test.beforeEach(async ({ page }) => {
    // Fake clock: the auto-dismiss tests fast-forward instead of sleeping.
    await page.clock.install();
    await gotoHydrated(page, '/components/toast');
  });

  test('shows a toast with message and description, then auto-dismisses', async ({ page }) => {
    await page.getByRole('button', { name: 'Publish article' }).click();

    const toast = page.locator('.ngc-toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Article published');
    await expect(toast).toContainText('Readers were notified.');
    // Single live region: the manager container announces; the
    // toast itself must not repeat role/aria-live.
    await expect(page.locator('[aria-live="polite"]').locator('.ngc-toast')).toBeVisible();
    await expect(toast).not.toHaveAttribute('role');
    await expect(toast).not.toHaveAttribute('aria-live');

    // Default duration is 3 s + exit animation.
    await page.clock.fastForward(4000);
    await expect(toast).toBeHidden();
  });

  test('dismiss button closes the toast immediately', async ({ page }) => {
    await page.getByRole('button', { name: 'Persistent toast' }).click();

    const toast = page.locator('.ngc-toast');
    await expect(toast).toBeVisible();

    await toast.getByRole('button', { name: 'Dismiss notification' }).click();
    await expect(toast).toBeHidden();
  });

  test('persistent toast survives the auto-dismiss window and dismisses programmatically', async ({ page }) => {
    await page.getByRole('button', { name: 'Persistent toast' }).click();
    const toast = page.locator('.ngc-toast').filter({ hasText: 'Update available' });
    await expect(toast).toBeVisible();
    // A default toast next to it proves the auto-dismiss window really passed.
    await page.getByRole('button', { name: 'Publish article' }).click();
    const defaultToast = page.locator('.ngc-toast').filter({ hasText: 'Article published' });
    await expect(defaultToast).toBeVisible();

    await page.clock.fastForward(5000);
    await expect(defaultToast).toBeHidden();
    await expect(toast).toBeVisible();
    await expect(toast).not.toHaveAttribute('data-exit');

    await page.getByRole('button', { name: 'Dismiss last' }).click();
    await expect(toast).toBeHidden();
  });

  test('placement option renders into a bottom-center container', async ({ page }) => {
    await page.getByRole('button', { name: 'Bottom-center toast' }).click();

    const container = page.locator('[data-ngp-toast-container="bottom-center"]');
    await expect(container.locator('.ngc-toast')).toBeVisible();
  });

  test('multiple toasts stack', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Persistent toast' });

    await trigger.click();
    await trigger.click();
    await trigger.click();

    await expect(page.locator('.ngc-toast')).toHaveCount(3);
  });
});
