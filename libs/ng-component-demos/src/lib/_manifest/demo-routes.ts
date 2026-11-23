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
 * manifest in isolation. A manifest entry without a loader is a wiring bug
 * (the sidebar would link to a dead route), so it fails loudly instead of
 * being skipped.
 */
export function demoRoutes(manifest: readonly DemoManifestEntry[], loaders: DemoLoaderMap): Route[] {
  return orderedDemos(manifest).map((demo) => {
    const loadComponent = loaders[demo.id];
    if (loadComponent === undefined) {
      throw new Error(`demoRoutes: manifest entry "${demo.id}" has no loader in DEMO_LOADERS.`);
    }
    return {
      path: demo.route.replace(/^\//, ''),
      loadComponent,
      // Document title per page (spec 003); the app's TitleStrategy appends the
      // site name.
      title: demo.name,
      data: { demo },
    };
  });
}
