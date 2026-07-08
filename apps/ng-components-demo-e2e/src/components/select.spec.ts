import { expect, test } from '@playwright/test';
import { gotoHydrated } from '../support/hydration';

test.describe('select', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, '/components/select');
  });

  test('opens on click and selects an option', async ({ page }) => {
    const trigger = page.getByRole('combobox', { name: 'Fruit' });

    await expect(trigger).toContainText('Pick a fruit');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();
    await expect(listbox.getByRole('option')).toHaveCount(5);

    await listbox.getByRole('option', { name: 'Banana' }).click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toContainText('Banana');
  });

  test('full keyboard interaction: open, navigate, select, escape', async ({ page }) => {
    const trigger = page.getByRole('combobox', { name: 'Fruit' });

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // The first option is active; move down twice and select Cherry.
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toContainText('Cherry');
    await expect(trigger).toBeFocused();

    // Re-open and dismiss with Escape – the value stays.
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toContainText('Cherry');
  });

  test('outside click closes the dropdown', async ({ page }) => {
    const trigger = page.getByRole('combobox', { name: 'Fruit' });

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.getByRole('heading', { level: 1 }).click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('disabled select does not open', async ({ page }) => {
    const trigger = page.getByRole('combobox', { name: 'Disabled select' });

    await trigger.click({ force: true });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveAttribute('data-disabled', '');
  });

  test('disabled option cannot be selected', async ({ page }) => {
    const trigger = page.getByRole('combobox', { name: 'Shipping' });

    await trigger.click();
    const express = page.getByRole('option', { name: 'Express (sold out)' });
    await expect(express).toHaveAttribute('data-disabled', '');

    await express.click({ force: true });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toContainText('Shipping method');
  });

  test('reactive form control follows interaction and programmatic reset', async ({ page }) => {
    const example = page.locator('#select-form');
    const trigger = page.getByRole('combobox', { name: 'Timezone' });

    await expect(trigger).toContainText('Central European Time');
    await expect(example).toContainText('Control value: cet');

    await trigger.click();
    await page.getByRole('option', { name: 'UTC' }).click();
    await expect(example).toContainText('Control value: utc');

    await example.getByRole('button', { name: 'Reset' }).click();
    await expect(trigger).toContainText('Pick a timezone');
  });
});
