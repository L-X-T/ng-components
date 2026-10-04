import { expect, test } from '@playwright/test';
import { gotoHydrated } from '../support/hydration';

test.describe('label', () => {
  test('clicking the label focuses the associated input', async ({ page }) => {
    await gotoHydrated(page, '/components/label');

    await page.locator('#label-basic').getByText('Email').click();
    await expect(page.locator('#label-demo-email')).toBeFocused();
  });
});
