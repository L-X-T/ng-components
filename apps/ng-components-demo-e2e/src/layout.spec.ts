import { DEMO_MANIFEST, orderedDemos } from '@angular-software/ng-component-demos/manifest';
import { expect, type Locator, type Page, test } from '@playwright/test';
import { gotoHydrated } from './support/hydration';

/**
 * Layout regressions from the 2026-11-23 sweep, measured in the DOM: sibling
 * buttons that touched, API badges spilling into the Type column, and the home
 * page listing only some components in cards of uneven height.
 */
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'phone', width: 375, height: 800 },
] as const;

interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

async function boxes(locator: Locator): Promise<Box[]> {
  return locator.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    }),
  );
}

/** Horizontal gap between two boxes on the same line; null when they wrapped onto different lines. */
function rowGap(first: Box, second: Box): number | null {
  const sameLine = first.top < second.bottom && second.top < first.bottom;
  return sameLine ? second.left - first.right : null;
}

async function expectNoHorizontalScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

for (const viewport of VIEWPORTS) {
  test.describe(`layout at ${viewport.name} width`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('sibling buttons in the button examples keep a gap', async ({ page }) => {
      await gotoHydrated(page, '/components/button');

      for (const exampleId of ['button-variants', 'button-sizes', 'button-states']) {
        const buttonBoxes = await boxes(page.locator(`#${exampleId} .ngc-demo-example__preview [ngc-button]`));
        expect(buttonBoxes.length, `${exampleId} has buttons`).toBeGreaterThan(1);
        for (let index = 1; index < buttonBoxes.length; index++) {
          const gap = rowGap(buttonBoxes[index - 1], buttonBoxes[index]);
          if (gap !== null) {
            expect(gap, `${exampleId}: gap before button ${index + 1}`).toBeGreaterThanOrEqual(8);
          }
        }
      }
      await expectNoHorizontalScroll(page);
    });

    for (const route of ['/components/select', '/components/dialog']) {
      test(`API name cells do not overlap the Type column on ${route}`, async ({ page }) => {
        await gotoHydrated(page, route);

        const nameCells = page.locator('.ngc-demo-api__cell--name');
        const count = await nameCells.count();
        expect(count).toBeGreaterThan(0);
        for (let index = 0; index < count; index++) {
          const nameCell = nameCells.nth(index);
          const typeCellBox = await nameCell.locator('xpath=following-sibling::*[1]').boundingBox();
          const contentBoxes = await boxes(nameCell.locator(':scope > *'));
          if (!typeCellBox) {
            continue;
          }
          for (const box of contentBoxes) {
            expect(box.right, `name cell ${index + 1} spills into the Type column`).toBeLessThanOrEqual(
              typeCellBox.x + 0.5,
            );
          }
        }
      });
    }
  });
}

test.describe('home', () => {
  test('lists every component in cards of equal height per row', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoHydrated(page, '/');

    const demos = orderedDemos(DEMO_MANIFEST);
    const cards = page.locator('.home__link');
    await expect(cards).toHaveCount(demos.length);
    for (const demo of demos) {
      await expect(page.getByRole('main').getByRole('link', { name: new RegExp(`^${demo.name}\\b`) })).toBeVisible();
    }

    const cardBoxes = await boxes(cards);
    const rows = new Map<number, number[]>();
    for (const box of cardBoxes) {
      const top = Math.round(box.top);
      rows.set(top, [...(rows.get(top) ?? []), box.bottom - box.top]);
    }
    for (const heights of rows.values()) {
      expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1);
    }

    // Equal heights must not come from cards spilling into the next row.
    const rowTops = [...rows.keys()].sort((a, b) => a - b);
    for (const box of cardBoxes) {
      const nextTop = rowTops.find((top) => top > Math.round(box.top));
      expect(box.bottom).toBeLessThanOrEqual((nextTop ?? Infinity) + 0.5);
    }
  });
});
