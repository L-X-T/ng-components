import { expect, test } from '@playwright/test';

test.describe('checkbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/checkbox');
  });

  test('toggles on click', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: 'Accept terms and conditions' });

    await expect(checkbox).toHaveAttribute('aria-checked', 'false');
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  test('label click toggles the associated checkbox', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: 'Accept terms and conditions' });

    await page.getByText('Accept terms and conditions').click();

    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  test('Space toggles, Enter does not', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: 'Accept terms and conditions' });

    await checkbox.focus();
    await page.keyboard.press('Space');
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('Enter');
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  test('indeterminate checkbox is announced as mixed and resolves to checked', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: 'Indeterminate' });

    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  test('disabled checkbox is inert', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: 'Disabled', exact: true });

    await expect(checkbox).toBeDisabled();
    await checkbox.click({ force: true });
    await expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  test('reactive form control follows interaction and disables the checkbox', async ({ page }) => {
    const example = page.locator('#checkbox-form');
    const checkbox = page.getByRole('checkbox', { name: 'Subscribe to the newsletter' });

    await expect(example).toContainText('Control value: true');
    await checkbox.click();
    await expect(example).toContainText('Control value: false');

    await example.getByRole('button', { name: 'Disable control' }).click();
    await expect(checkbox).toBeDisabled();
  });
});
