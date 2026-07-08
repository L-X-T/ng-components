import type { Page } from '@playwright/test';

/**
 * Navigate to a demo page and wait until Angular has rendered on the client.
 * The demo app prerenders its routes with event replay; interacting before
 * hydration completes races against directive initialization (e.g. a reactive
 * form's initial writeValue clearing just-typed text). DemoPage sets
 * `data-hydrated` after its first client render.
 */
export async function gotoHydrated(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await page.locator('ngc-demo-page[data-hydrated]').waitFor();
}
