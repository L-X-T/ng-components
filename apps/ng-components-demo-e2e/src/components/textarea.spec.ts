import { expect, test } from '@playwright/test';
import { gotoHydrated } from '../support/hydration';

test.describe('textarea', () => {
  test('typing multi-line text works', async ({ page }) => {
    await gotoHydrated(page, '/components/textarea');
    const textarea = page.getByRole('textbox', { name: 'Message' });

    await textarea.fill('line one\nline two');
    await expect(textarea).toHaveValue('line one\nline two');
  });
});
