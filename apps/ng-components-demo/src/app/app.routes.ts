import { Route } from '@angular/router';
import { DEMO_LOADERS } from '@ngc-internal/demos/loaders';
import { DEMO_MANIFEST, demoRoutes } from '@ngc-internal/demos/manifest';

/**
 * Home + one lazy route per manifest entry – no hand-maintained route table
 * (plan 003). With `outputMode: static` every parameterless route here is
 * prerendered, so the prerender list derives from the manifest too.
 */
export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Angular component library',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  ...demoRoutes(DEMO_MANIFEST, DEMO_LOADERS),
  // Unknown URLs land on home instead of an empty outlet with NG04002.
  { path: '**', redirectTo: '' },
];
