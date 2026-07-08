import type { DemoLoaderMap } from '@angular-software/ng-component-demos/manifest';

/**
 * Lazy demo-page loaders, keyed by manifest id. The ngc-component generator
 * stamps one entry per component; the static `import()` calls give the
 * bundler one split chunk per demo page.
 */
export const DEMO_LOADERS: DemoLoaderMap = {
  button: () => import('@angular-software/ng-component-demos').then((m) => m.ButtonDemo),
  badge: () => import('@angular-software/ng-component-demos').then((m) => m.BadgeDemo),
  card: () => import('@angular-software/ng-component-demos').then((m) => m.CardDemo),
  label: () => import('@angular-software/ng-component-demos').then((m) => m.LabelDemo),
  input: () => import('@angular-software/ng-component-demos').then((m) => m.InputDemo),
  textarea: () => import('@angular-software/ng-component-demos').then((m) => m.TextareaDemo),
  checkbox: () => import('@angular-software/ng-component-demos').then((m) => m.CheckboxDemo),
  'radio-group': () => import('@angular-software/ng-component-demos').then((m) => m.RadioGroupDemo),
};
