export type DemoCategory = 'form' | 'layout' | 'overlay' | 'feedback' | 'navigation';

export type DemoStatus = 'stable' | 'wip' | 'planned';

/**
 * One entry per `ng-components` component. Single source for sidebar nav,
 * the app route table, the prerender list, prev/next order, ⌘K search, and
 * the Playwright test matrix. API docs live in the demo pages, not here
 * (spec 002).
 */
export interface DemoManifestEntry {
  /** kebab-case component id, e.g. `button`. Matches the ng-components lib. */
  readonly id: string;
  /** Display name, e.g. `Button`. */
  readonly name: string;
  readonly category: DemoCategory;
  /** App route, e.g. `/components/button`. */
  readonly route: string;
  readonly status: DemoStatus;
  readonly summary: string;
  /** Example ids present on the page (drives the e2e presence check). */
  readonly examples: readonly string[];
}

/** Sidebar/section order for the categories. */
export const DEMO_CATEGORIES: readonly DemoCategory[] = [
  'form',
  'layout',
  'overlay',
  'feedback',
  'navigation',
];
