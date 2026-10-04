import { DEMO_MANIFEST, demosByCategory, orderedDemos } from '@angular-software/ng-component-demos/manifest';
import { expect, test } from '@playwright/test';
import { gotoHydrated } from './support/hydration';

/**
 * Shell coverage (spec 004 layer 4, added in review 2026-10-04): the sidebar
 * mirrors the manifest, marks the current page, the skip link works, the
 * pager navigates, and the mobile drawer is keyboard-safe and never forces
 * horizontal scrolling.
 */
test.describe('shell', () => {
  test('sidebar mirrors the manifest groups and marks the current page', async ({ page }) => {
    const demo = orderedDemos(DEMO_MANIFEST)[1];
    await gotoHydrated(page, demo.route);
    const sidebar = page.getByRole('navigation', { name: 'Components', exact: true });

    for (const group of demosByCategory(DEMO_MANIFEST)) {
      const list = sidebar.getByRole('list', { name: group.category });
      await expect(list.getByRole('link')).toHaveText(group.demos.map((entry) => new RegExp(`^${entry.name}`)));
    }
    await expect(sidebar.getByRole('link', { name: demo.name, exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(sidebar.locator('[aria-current="page"]')).toHaveCount(1);
  });

  test('skip link is the first tab stop and moves focus to the content', async ({ page }) => {
    await gotoHydrated(page, DEMO_MANIFEST[0].route);

    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    // Static href already points at the current page (works before hydration).
    await expect(skip).toHaveAttribute('href', `${DEMO_MANIFEST[0].route}#main`);

    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
    // No navigation: a #hash href would have resolved against <base href="/"> (verification V-01).
    await expect(page).toHaveURL(new RegExp(`${DEMO_MANIFEST[0].route}(#main)?$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(DEMO_MANIFEST[0].name);
  });

  test('pager navigates to the next component', async ({ page }) => {
    const [first, second] = orderedDemos(DEMO_MANIFEST);
    await gotoHydrated(page, first.route);

    await page.getByRole('link', { name: `${second.name} →` }).click();

    await expect(page).toHaveURL(new RegExp(`${second.route}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(second.name);
    // Focus moves to the content instead of falling to body (verification V-11).
    await expect(page.getByRole('main')).toBeFocused();
  });

  test.describe('phone viewport', () => {
    test.use({ viewport: { width: 320, height: 720 } });

    test('never scrolls horizontally and keeps a visible search button', async ({ page }) => {
      await gotoHydrated(page, DEMO_MANIFEST[0].route);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
      // The word mark is visually hidden here, not removed – the home link keeps its name (V-02).
      await expect(page.getByRole('link', { name: 'ng-components' })).toBeVisible();
    });

    test('closed drawer is out of the tab order; open drawer takes focus and closes on Escape', async ({ page }) => {
      await gotoHydrated(page, DEMO_MANIFEST[0].route);
      const toggle = page.getByRole('button', { name: 'Toggle navigation' });
      const firstLink = page.getByRole('navigation', { name: 'Components', exact: true }).getByRole('link').first();

      await expect(firstLink).toBeHidden();
      // Tab order: skip link, menu, logo, search, theme, GitHub – then into the content, never a sidebar link.
      for (let press = 0; press < 7; press++) {
        await page.keyboard.press('Tab');
        const inSidebar = await page.evaluate(() => document.activeElement?.closest('.shell__sidebar') !== null);
        expect(inSidebar).toBe(false);
      }

      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(firstLink).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Components', exact: true })).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(firstLink).toBeHidden();
      await expect(toggle).toBeFocused();
    });
  });
});
