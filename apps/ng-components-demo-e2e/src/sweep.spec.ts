import { DEMO_MANIFEST, orderedDemos } from '@angular-software/ng-component-demos/manifest';
import { expect, type Page, test } from '@playwright/test';

/**
 * Manifest-driven sweep (spec 004 layer 1): for every manifest entry the
 * route loads, the h1 matches the manifest name, every declared example id is
 * present, and the page logs zero console errors. A new component with a
 * manifest entry but a broken demo fails here automatically.
 */
function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    errors.push(String(error));
  });
  return errors;
}

test.describe('home', () => {
  test('renders without console errors', async ({ page }) => {
    const errors = collectErrors(page);

    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    expect(errors).toEqual([]);
  });
});

// Sidebar order – the pager walks the same sequence the sidebar shows
// (review 2026-07-11 E3), so the sweep must assert against it too.
const SIDEBAR_ORDERED = orderedDemos(DEMO_MANIFEST);

for (const demo of SIDEBAR_ORDERED) {
  test.describe(`${demo.name} demo`, () => {
    test('renders title, all examples, no console errors', async ({ page }) => {
      const errors = collectErrors(page);

      await page.goto(demo.route);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(demo.name);

      for (const exampleId of demo.examples) {
        await expect(page.locator(`#${exampleId}`), `example "${exampleId}" is missing`).toBeVisible();
      }

      // Prev/next pager follows the sidebar order.
      const index = SIDEBAR_ORDERED.indexOf(demo);
      const previous = SIDEBAR_ORDERED[index - 1];
      const next = SIDEBAR_ORDERED[index + 1];
      if (previous) {
        await expect(page.getByRole('link', { name: `← ${previous.name}` })).toBeVisible();
      }
      if (next) {
        await expect(page.getByRole('link', { name: `${next.name} →` })).toBeVisible();
      }

      expect(errors).toEqual([]);
    });
  });
}
