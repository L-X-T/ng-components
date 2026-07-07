import type { DemoLoaderMap } from '@angular-software/ng-component-demos/manifest';

/**
 * Lazy demo-page loaders, keyed by manifest id. The ngc-component generator
 * stamps one entry per component; the static `import()` calls give the
 * bundler one split chunk per demo page.
 */
export const DEMO_LOADERS: DemoLoaderMap = {};
