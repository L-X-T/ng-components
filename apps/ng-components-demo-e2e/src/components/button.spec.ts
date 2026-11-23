import { expect, test } from '@playwright/test';
import { gotoHydrated } from '../support/hydration';

/**
 * Functional/keyboard coverage for the ngc-button demo page (variants render,
 * click fires, disabled is inert and announced).
 * The manifest sweep already covers rendering + console errors.
 */
test.describe('button', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, '/components/button');
  });

  test('renders all six variants', async ({ page }) => {
    const variants = page.locator('#button-variants');
    for (const name of ['Default', 'Secondary', 'Destructive', 'Outline', 'Ghost', 'Link']) {
      await expect(variants.getByRole('button', { name })).toBeVisible();
    }
  });

  test('click fires', async ({ page }) => {
    const counter = page.getByRole('button', { name: /Clicked \d+ times/ });

    await expect(counter).toHaveText('Clicked 0 times');
    await counter.click();
    await expect(counter).toHaveText('Clicked 1 times');
  });

  test('keyboard activation works', async ({ page }) => {
    const counter = page.getByRole('button', { name: /Clicked \d+ times/ });

    await counter.focus();
    await page.keyboard.press('Enter');
    await expect(counter).toHaveText('Clicked 1 times');
    await page.keyboard.press('Space');
    await expect(counter).toHaveText('Clicked 2 times');
  });

  test('disabled button is inert and announced', async ({ page }) => {
    const disabled = page.locator('#button-states').getByRole('button', { name: 'Disabled' });

    await expect(disabled).toBeDisabled();
  });

  test('playground knobs restyle the live button', async ({ page }) => {
    const playground = page.locator('#button-playground');
    const button = playground.getByRole('button', { name: 'Button' });

    await expect(button).toHaveClass(/ngc-button--default/);
    await page.getByRole('combobox', { name: 'Variant' }).click();
    await page.getByRole('option', { name: 'destructive' }).click();
    await expect(button).toHaveClass(/ngc-button--destructive/);

    // Icon size: the playground names the button.
    await page.getByRole('combobox', { name: 'Size' }).click();
    await page.getByRole('option', { name: 'icon' }).click();
    await expect(playground.getByRole('button', { name: 'Add' })).toBeVisible();
  });
});
