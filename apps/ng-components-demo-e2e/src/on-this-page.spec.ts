import { DEMO_MANIFEST } from '@angular-software/ng-component-demos/manifest';
import { expect, test } from '@playwright/test';
import { gotoHydrated } from './support/hydration';

// Regression for review 2026-07-11 E1: with <base href="/"> a plain #hash
// link navigates to the home page instead of scrolling to the section.
test.describe('on this page outline', () => {
  test('clicking an outline link scrolls to the section on the same route', async ({ page }) => {
    const demo = DEMO_MANIFEST[0];
    await gotoHydrated(page, demo.route);

    const lastLink = page.locator('.ngc-demo-on-this-page__link').last();
    const fragment = await lastLink.getAttribute('href').then((href) => href?.split('#')[1] ?? '');
    expect(fragment).not.toBe('');

    await lastLink.click();

    // Same demo route (not the home page), fragment in the URL, target scrolled into view.
    await expect(page).toHaveURL(`${demo.route}#${fragment}`);
    const target = page.locator(`#${fragment}`);
    await expect(target).toBeInViewport();
  });
});
