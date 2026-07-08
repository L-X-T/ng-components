import { expect, test } from '@playwright/test';
import { gotoHydrated } from '../support/hydration';

test.describe('form-field', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, '/components/form-field');
  });

  test('label association gives the control its accessible name', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Display name' });

    await input.fill('Ada');
    await expect(input).toHaveValue('Ada');
  });

  test('errors appear on blur and switch with the failing validator', async ({ page }) => {
    const example = page.locator('#form-field-validation');
    const email = page.getByRole('textbox', { name: 'Email' }).first();

    await expect(example.getByText('Email is required.')).toBeHidden();

    await email.click();
    await email.blur();
    await expect(example.getByText('Email is required.')).toBeVisible();
    await expect(example.getByText('Enter a valid email address.')).toBeHidden();

    await email.fill('not-an-email');
    await email.blur();
    await expect(example.getByText('Email is required.')).toBeHidden();
    await expect(example.getByText('Enter a valid email address.')).toBeVisible();

    await email.fill('ada@example.com');
    await email.blur();
    await expect(example.getByText('Email is required.')).toBeHidden();
    await expect(example.getByText('Enter a valid email address.')).toBeHidden();
  });

  test('failing error is announced via aria-describedby', async ({ page }) => {
    const example = page.locator('#form-field-validation');
    const email = page.getByRole('textbox', { name: 'Email' }).first();

    await email.click();
    await email.blur();

    const errorId = await example.getByText('Email is required.').getAttribute('id');
    await expect(email).toHaveAttribute('aria-describedby', new RegExp(errorId ?? ''));
  });

  test('invalid submit surfaces all errors, valid submit succeeds', async ({ page }) => {
    const example = page.locator('#form-field-contact');

    await example.getByRole('button', { name: 'Send message' }).click();
    await expect(example.getByText('Name is required.')).toBeVisible();
    await expect(example.getByText('Pick a topic.')).toBeVisible();
    await expect(example.getByText('Please accept the privacy policy.')).toBeVisible();

    await example.getByRole('textbox', { name: 'Name' }).fill('Ada Lovelace');
    await example.getByRole('textbox', { name: 'Email' }).fill('ada@example.com');
    await example.getByRole('combobox', { name: 'Topic' }).click();
    await page.getByRole('option', { name: 'Consulting' }).click();
    await example.getByRole('textbox', { name: 'Message' }).fill('Hello there.');
    await example.getByRole('checkbox', { name: 'I accept the privacy policy' }).click();

    await example.getByRole('button', { name: 'Send message' }).click();
    await expect(example.getByText('Sent!')).toBeVisible();
    await expect(example.getByText('Name is required.')).toBeHidden();
  });
});
