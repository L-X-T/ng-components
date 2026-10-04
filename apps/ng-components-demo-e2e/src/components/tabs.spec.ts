import { expect, test } from '@playwright/test';
import { gotoHydrated } from '../support/hydration';

test.describe('tabs', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, '/components/tabs');
  });

  test('click switches tab and panel', async ({ page }) => {
    const account = page.getByRole('tab', { name: 'Account' });
    const password = page.getByRole('tab', { name: 'Password' });

    await expect(account).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByText('Change your account details')).toBeVisible();

    await password.click();
    await expect(password).toHaveAttribute('aria-selected', 'true');
    await expect(account).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByText("Change your password here. You'll be logged out afterwards.")).toBeVisible();
    await expect(page.getByText('Change your account details')).toBeHidden();
  });

  test('arrow keys move focus, activate automatically, skip the disabled tab and wrap', async ({ page }) => {
    const account = page.getByRole('tab', { name: 'Account' });
    const password = page.getByRole('tab', { name: 'Password' });

    await account.click();
    await page.keyboard.press('ArrowRight');
    await expect(password).toBeFocused();
    // Automatic activation: arrowing selects the focused tab.
    await expect(password).toHaveAttribute('aria-selected', 'true');

    // The next tab is disabled and focus wraps by default – past it to the first tab.
    await page.keyboard.press('ArrowRight');
    await expect(account).toBeFocused();
    await expect(account).toHaveAttribute('aria-selected', 'true');

    // And back: the wrap to the end skips the disabled tab too.
    await page.keyboard.press('ArrowLeft');
    await expect(password).toBeFocused();
    await expect(password).toHaveAttribute('aria-selected', 'true');
  });

  test('Home and End jump between first and last enabled tab', async ({ page }) => {
    const account = page.getByRole('tab', { name: 'Account' });
    const password = page.getByRole('tab', { name: 'Password' });

    await password.click();
    await page.keyboard.press('Home');
    await expect(account).toBeFocused();

    await page.keyboard.press('End');
    await expect(password).toBeFocused();
  });

  test('disabled tab is inert', async ({ page }) => {
    const team = page.getByRole('tab', { name: 'Team (soon)' });

    await team.click({ force: true });
    await expect(team).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByText('Team management is coming soon.')).toBeHidden();
  });
});
