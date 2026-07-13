import { DEMO_CATEGORIES, type DemoCategory, type DemoManifestEntry } from './manifest-entry';

export interface DemoCategoryGroup {
  readonly category: DemoCategory;
  readonly demos: readonly DemoManifestEntry[];
}

/** Flat list in sidebar order: by category (DEMO_CATEGORIES), authored order within. */
export function orderedDemos(manifest: readonly DemoManifestEntry[]): readonly DemoManifestEntry[] {
  return DEMO_CATEGORIES.flatMap((category) => manifest.filter((demo) => demo.category === category));
}

/** Non-empty category groups in sidebar order (drives the sidebar). */
export function demosByCategory(manifest: readonly DemoManifestEntry[]): readonly DemoCategoryGroup[] {
  return DEMO_CATEGORIES.map((category) => ({
    category,
    demos: manifest.filter((demo) => demo.category === category),
  })).filter((group) => group.demos.length > 0);
}

export function findDemo(manifest: readonly DemoManifestEntry[], id: string): DemoManifestEntry | undefined {
  return manifest.find((demo) => demo.id === id);
}

export interface DemoPrevNext {
  readonly prev?: DemoManifestEntry;
  readonly next?: DemoManifestEntry;
}

/** Previous/next entry in sidebar order, for the demo page footer links. */
export function demoPrevNext(manifest: readonly DemoManifestEntry[], id: string): DemoPrevNext {
  const ordered = orderedDemos(manifest);
  const index = ordered.findIndex((demo) => demo.id === id);
  if (index === -1) {
    return {};
  }
  return { prev: ordered[index - 1], next: ordered[index + 1] };
}
