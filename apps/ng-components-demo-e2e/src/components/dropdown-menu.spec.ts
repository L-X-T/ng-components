import { expect, test } from '@playwright/test';
import { gotoHydrated } from '../support/hydration';

test.describe('dropdown-menu', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, '/components/dropdown-menu');
  });

  test('opens on click and activates an item', async ({ page }) => {
    const example = page.locator('#dropdown-menu-basic');
    const trigger = example.getByRole('button', { name: 'Options' });

    await expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem')).toHaveCount(4);

    await menu.getByRole('menuitem', { name: 'Billing' }).click();
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(example).toContainText('Last action: billing');
  });

  test('arrow keys navigate with wrapping, Enter activates', async ({ page }) => {
    const example = page.locator('#dropdown-menu-basic');
    const trigger = example.getByRole('button', { name: 'Options' });

    await trigger.click();
    const profile = page.getByRole('menuitem', { name: 'Profile' });
    const billing = page.getByRole('menuitem', { name: 'Billing' });
    const logout = page.getByRole('menuitem', { name: 'Log out' });

    await expect(profile).toBeFocused();

    // Down skips the disabled item and wraps past the end.
    await page.keyboard.press('ArrowDown');
    await expect(billing).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(logout).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(profile).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(logout).toBeFocused();

    await page.keyboard.press('End');
    await expect(logout).toBeFocused();
    await page.keyboard.press('Home');
    await expect(profile).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(example).toContainText('Last action: profile');
  });

  test('Escape closes without activating and restores focus', async ({ page }) => {
    const example = page.locator('#dropdown-menu-basic');
    const trigger = example.getByRole('button', { name: 'Options' });

    await trigger.click();
    await expect(page.getByRole('menu')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(example).toContainText('Last action: none');
  });

  test('outside click closes the menu', async ({ page }) => {
    await page.locator('#dropdown-menu-basic').getByRole('button', { name: 'Options' }).click();
    await expect(page.getByRole('menu')).toBeVisible();

    await page.getByRole('heading', { level: 1 }).click();
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('disabled item is inert', async ({ page }) => {
    const example = page.locator('#dropdown-menu-basic');

    await example.getByRole('button', { name: 'Options' }).click();
    const disabledItem = page.getByRole('menuitem', { name: 'Team (soon)' });

    await expect(disabledItem).toHaveAttribute('data-disabled', '');
    await disabledItem.click({ force: true });
    await expect(page.getByRole('menu')).toBeVisible();
    await expect(example).toContainText('Last action: none');
  });
});
