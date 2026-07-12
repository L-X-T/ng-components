import { Route } from '@angular/router';
import { DEMO_LOADERS } from '@angular-software/ng-component-demos/loaders';
import { DEMO_MANIFEST, demoRoutes } from '@angular-software/ng-component-demos/manifest';

/**
 * Home + one lazy route per manifest entry – no hand-maintained route table
 * (plan 003). With `outputMode: static` every parameterless route here is
 * prerendered, so the prerender list derives from the manifest too.
 */
export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  ...demoRoutes(DEMO_MANIFEST, DEMO_LOADERS),
];
