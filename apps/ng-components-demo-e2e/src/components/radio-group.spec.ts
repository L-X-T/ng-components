import { expect, test } from '@playwright/test';

test.describe('radio-group', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/radio-group');
  });

  test('click selects exactly one option', async ({ page }) => {
    const comfortable = page.getByRole('radio', { name: 'Comfortable' });
    const compact = page.getByRole('radio', { name: 'Compact' });

    await expect(comfortable).toHaveAttribute('aria-checked', 'true');

    await compact.click();
    await expect(compact).toHaveAttribute('aria-checked', 'true');
    await expect(comfortable).toHaveAttribute('aria-checked', 'false');
  });

  test('label click selects the associated option', async ({ page }) => {
    await page.locator('#radio-group-basic').getByText('Default', { exact: true }).click();

    await expect(page.getByRole('radio', { name: 'Default' })).toHaveAttribute('aria-checked', 'true');
  });

  test('arrow keys move selection and wrap', async ({ page }) => {
    const comfortable = page.getByRole('radio', { name: 'Comfortable' });
    const compact = page.getByRole('radio', { name: 'Compact' });
    const defaultOption = page.getByRole('radio', { name: 'Default' });

    await comfortable.click();
    await page.keyboard.press('ArrowDown');
    await expect(compact).toBeFocused();
    await expect(compact).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('ArrowDown');
    await expect(defaultOption).toBeFocused();
    await expect(defaultOption).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('ArrowUp');
    await expect(compact).toBeFocused();
    await expect(compact).toHaveAttribute('aria-checked', 'true');
  });

  test('keyboard navigation skips disabled items', async ({ page }) => {
    const standard = page.getByRole('radio', { name: 'Standard' });

    await standard.click();
    await page.keyboard.press('ArrowDown');

    // The only other item is disabled, so focus wraps back to Standard.
    await expect(standard).toBeFocused();
  });

  test('disabled item and disabled group are inert', async ({ page }) => {
    const express = page.getByRole('radio', { name: 'Express (sold out)' });
    const optionB = page.getByRole('radio', { name: 'Option B' });

    await express.click({ force: true });
    await expect(express).toHaveAttribute('aria-checked', 'false');

    await optionB.click({ force: true });
    await expect(optionB).toHaveAttribute('aria-checked', 'false');
  });

  test('reactive form control follows interaction and programmatic reset', async ({ page }) => {
    const example = page.locator('#radio-group-form');
    const pro = page.getByRole('radio', { name: 'Pro' });

    await expect(example).toContainText('Control value: starter');
    await pro.click();
    await expect(example).toContainText('Control value: pro');

    await example.getByRole('button', { name: 'Reset' }).click();
    await expect(pro).toHaveAttribute('aria-checked', 'false');
    await expect(page.getByRole('radio', { name: 'Starter' })).toHaveAttribute('aria-checked', 'false');
  });
});
