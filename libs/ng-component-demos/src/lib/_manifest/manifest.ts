import type { DemoManifestEntry } from './manifest-entry';

/**
 * The component manifest. Entries are added as each component lands (the
 * ngc-component generator stamps a `wip` entry; the wave flips it to
 * `stable`). Order within a category is the authored order here.
 */
export const DEMO_MANIFEST: readonly DemoManifestEntry[] = [];
