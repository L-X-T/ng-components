import { expect, test } from '@playwright/test';

test.describe('label', () => {
  test('clicking the label focuses the associated input', async ({ page }) => {
    await page.goto('/components/label');

    await page.locator('#label-basic').getByText('Email').click();
    await expect(page.locator('#label-demo-email')).toBeFocused();
  });
});
