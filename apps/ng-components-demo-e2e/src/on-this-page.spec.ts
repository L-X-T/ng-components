import { DEMO_MANIFEST } from '@ngc-internal/demos/manifest';
import { expect, test } from '@playwright/test';
import { gotoHydrated } from './support/hydration';

// Regression for review 2026-07-11 E1: with <base href="/"> a plain #hash
// link navigates to the home page instead of scrolling to the section.
test.describe('on this page outline', () => {
  test('clicking an outline link scrolls to the section on the same route', async ({ page }) => {
    const demo = DEMO_MANIFEST[0];
    await gotoHydrated(page, demo.route);

    // An intermediate section with enough content below it – the last one
    // would sit at the page bottom with or without the scroll offset.
    const link = page.locator('.ngc-demo-on-this-page__link').nth(1);
    const fragment = await link.getAttribute('href').then((href) => href?.split('#')[1] ?? '');
    expect(fragment).not.toBe('');

    await link.click();

    // Same demo route (not the home page), fragment in the URL, target scrolled into view.
    await expect(page).toHaveURL(`${demo.route}#${fragment}`);
    const target = page.locator(`#${fragment}`);
    await expect(target).toBeInViewport();
    // …and below the sticky header, not behind it (review 2026-10-04 D-09).
    const headerBottom = await page
      .locator('.shell__header')
      .evaluate((header) => header.getBoundingClientRect().bottom);
    const targetTop = await target.evaluate((section) => section.getBoundingClientRect().top);
    expect(targetTop).toBeGreaterThanOrEqual(headerBottom);
    expect(targetTop).toBeLessThanOrEqual(headerBottom + 32);
  });

  test('section heading permalinks stay on the route (review 2026-10-04 D-01)', async ({ page }) => {
    const demo = DEMO_MANIFEST[0];
    await gotoHydrated(page, demo.route);

    const anchor = page.locator('.ngc-demo-section__anchor').last();
    const href = (await anchor.getAttribute('href')) ?? '';
    expect(href.startsWith(`${demo.route}#`)).toBe(true);

    await anchor.click();
    await expect(page).toHaveURL(href);
  });
});
