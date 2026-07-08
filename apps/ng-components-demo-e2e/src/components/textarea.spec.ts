import { expect, test } from '@playwright/test';

test.describe('textarea', () => {
  test('typing multi-line text works', async ({ page }) => {
    await page.goto('/components/textarea');
    const textarea = page.getByRole('textbox', { name: 'Message' });

    await textarea.fill('line one\nline two');
    await expect(textarea).toHaveValue('line one\nline two');
  });
});
