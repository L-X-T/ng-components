import { expect, test } from '@playwright/test';
import { gotoHydrated } from '../support/hydration';

/**
 * ngc-card is CSS-only – the manifest sweep covers rendering + console
 * errors; here we assert the full anatomy renders.
 */
test.describe('card', () => {
  test('renders the full anatomy', async ({ page }) => {
    await gotoHydrated(page, '/components/card');

    const card = page.locator('#card-basic ngc-card');
    await expect(card.getByRole('heading', { name: 'Create project' })).toBeVisible();
    await expect(card.getByText('Deploy your new project in one click.')).toBeVisible();
    await expect(card.getByRole('button', { name: 'Deploy' })).toBeVisible();
    await expect(card.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });
});
