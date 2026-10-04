import type { Page } from '@playwright/test';

/**
 * Navigate and wait until Angular has rendered on the client. The demo app
 * prerenders its routes with event replay; interacting before hydration
 * completes races against directive initialization (e.g. a reactive form's
 * initial writeValue clearing just-typed text). The app shell sets
 * `data-hydrated` once the first navigation's lazy route has rendered on the
 * client, on every route (home included – review 2026-10-04 D-17); demo pages
 * additionally set their own.
 */
export async function gotoHydrated(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await page.locator('app-root[data-hydrated]').waitFor();
}
