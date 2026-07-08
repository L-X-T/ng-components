import { expect, test } from '@playwright/test';

test.describe('input', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/input');
  });

  test('typing works', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Name' });

    await input.fill('Ada Lovelace');
    await expect(input).toHaveValue('Ada Lovelace');
  });

  test('disabled input is inert', async ({ page }) => {
    await expect(page.getByPlaceholder('Disabled')).toBeDisabled();
  });

  test('invalid input is announced', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: 'Invalid example' })).toHaveAttribute('aria-invalid', 'true');
  });
});
