import { expect, test } from '@playwright/test';

/**
 * ngc-badge is CSS-only – the manifest sweep covers rendering + console
 * errors; here we assert the variants are all present.
 */
test.describe('badge', () => {
  test('renders all four variants', async ({ page }) => {
    await page.goto('/components/badge');

    const variants = page.locator('#badge-variants');
    for (const name of ['Default', 'Secondary', 'Destructive', 'Outline']) {
      await expect(variants.getByText(name)).toBeVisible();
    }
  });
});
