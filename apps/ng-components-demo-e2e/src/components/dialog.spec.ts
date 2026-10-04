import { expect, test } from '@playwright/test';
import { gotoHydrated } from '../support/hydration';

test.describe('dialog', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, '/components/dialog');
  });

  test('opens on click, closes via footer action, restores focus', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Publish article' });

    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog.getByText('Publish this article?')).toBeVisible();

    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('traps focus inside the dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Publish article' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Focus starts inside the dialog and stays inside while tabbing through
    // and past all focusable elements (the trap wraps).
    for (let press = 0; press < 4; press++) {
      await page.keyboard.press('Tab');
      const focusInsideDialog = await page.evaluate(() => document.activeElement?.closest('.ngc-dialog') !== null);
      expect(focusInsideDialog).toBe(true);
    }
  });

  test('Escape closes the dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Publish article' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('overlay click closes the dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Publish article' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.locator('.ngc-dialog-overlay').click({ position: { x: 5, y: 5 } });
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('aria-labelledby and aria-describedby point at title and description', async ({ page }) => {
    await page.getByRole('button', { name: 'Publish article' }).click();
    const dialog = page.getByRole('dialog');

    const titleId = await dialog.locator('[ngc-dialog-title]').getAttribute('id');
    const descriptionId = await dialog.locator('[ngc-dialog-description]').getAttribute('id');
    await expect(dialog).toHaveAttribute('aria-labelledby', titleId ?? '');
    await expect(dialog).toHaveAttribute('aria-describedby', descriptionId ?? '');
  });

  test('close result reaches the closed output', async ({ page }) => {
    const example = page.locator('#dialog-result');

    await example.getByRole('button', { name: 'Delete account' }).click();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Delete' }).click();
    await expect(example).toContainText('Last result: deleted');

    await example.getByRole('button', { name: 'Delete account' }).click();
    await page.keyboard.press('Escape');
    await expect(example).toContainText('Last result: dismissed');
  });
});
