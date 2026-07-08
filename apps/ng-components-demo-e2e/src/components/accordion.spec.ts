import { expect, test } from '@playwright/test';
import { gotoHydrated } from '../support/hydration';

test.describe('accordion', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, '/components/accordion');
  });

  test('expands and collapses a section on click', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Is it accessible?' });
    const content = page.getByText('It follows the WAI-ARIA accordion pattern.');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(content).toBeHidden();

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(content).toBeVisible();

    // Collapsible single accordion: clicking again closes.
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(content).toBeHidden();
  });

  test('single mode closes the previously open section', async ({ page }) => {
    const accessible = page.getByRole('button', { name: 'Is it accessible?' });
    const styled = page.getByRole('button', { name: 'Is it styled?' });

    await accessible.click();
    await styled.click();

    await expect(styled).toHaveAttribute('aria-expanded', 'true');
    await expect(accessible).toHaveAttribute('aria-expanded', 'false');
  });

  test('keyboard: Tab reaches triggers, Enter and Space toggle', async ({ page }) => {
    const accessible = page.getByRole('button', { name: 'Is it accessible?' });
    const styled = page.getByRole('button', { name: 'Is it styled?' });

    await accessible.focus();
    await page.keyboard.press('Enter');
    await expect(accessible).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Tab');
    await expect(styled).toBeFocused();
    await page.keyboard.press('Space');
    await expect(styled).toHaveAttribute('aria-expanded', 'true');
    await expect(accessible).toHaveAttribute('aria-expanded', 'false');
  });

  test('multiple mode keeps several sections open', async ({ page }) => {
    const shipping = page.getByRole('button', { name: 'Shipping details' });
    const returns = page.getByRole('button', { name: 'Return policy' });

    await shipping.click();
    await returns.click();

    await expect(shipping).toHaveAttribute('aria-expanded', 'true');
    await expect(returns).toHaveAttribute('aria-expanded', 'true');
  });

  test('disabled item cannot be toggled', async ({ page }) => {
    const support = page.getByRole('button', { name: 'Priority support (soon)' });

    await support.click({ force: true });
    await expect(support).toHaveAttribute('aria-expanded', 'false');
  });

  test('content region is labelled by its trigger', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Is it accessible?' });

    await trigger.click();
    const region = page.getByRole('region', { name: 'Is it accessible?' });
    await expect(region).toBeVisible();
  });
});
