import type { Route } from '@angular/router';
import type { DemoManifestEntry } from './manifest-entry';
import { orderedDemos } from './manifest-helpers';

/** Lazy loader for a demo page component, keyed by manifest id. */
export type DemoComponentLoader = NonNullable<Route['loadComponent']>;
export type DemoLoaderMap = Readonly<Record<string, DemoComponentLoader>>;

/**
 * Builds the app's lazy routes from the manifest. The app supplies the
 * loaders (static `import()` calls the bundler can split) so this module
 * stays free of demo-page imports and the e2e project can consume the
 * manifest in isolation.
 */
export function demoRoutes(
  manifest: readonly DemoManifestEntry[],
  loaders: DemoLoaderMap,
): Route[] {
  return orderedDemos(manifest)
    .filter((demo) => loaders[demo.id] !== undefined)
    .map((demo) => ({
      path: demo.route.replace(/^\//, ''),
      loadComponent: loaders[demo.id],
      data: { demo },
    }));
}

/** Prerender path list for the app's static build. */
export function demoRoutePaths(manifest: readonly DemoManifestEntry[]): string[] {
  return orderedDemos(manifest).map((demo) => demo.route);
}
