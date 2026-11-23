import type { DemoLoaderMap } from '../_manifest';

/**
 * Lazy demo-page loaders, keyed by manifest id. Lives inside the lib (entry
 * point `@ngc-internal/demos/loaders`) so the dynamic
 * imports can be relative – dynamically importing the public barrel from the
 * app put all demo pages into one shared chunk, while
 * relative imports give the bundler one split chunk per demo page. The
 * ngc-component generator stamps one entry per component.
 */
export const DEMO_LOADERS: DemoLoaderMap = {
  button: () => import('../button/button-demo').then((m) => m.ButtonDemo),
  badge: () => import('../badge/badge-demo').then((m) => m.BadgeDemo),
  card: () => import('../card/card-demo').then((m) => m.CardDemo),
  label: () => import('../label/label-demo').then((m) => m.LabelDemo),
  input: () => import('../input/input-demo').then((m) => m.InputDemo),
  textarea: () => import('../textarea/textarea-demo').then((m) => m.TextareaDemo),
  checkbox: () => import('../checkbox/checkbox-demo').then((m) => m.CheckboxDemo),
  'radio-group': () => import('../radio-group/radio-group-demo').then((m) => m.RadioGroupDemo),
  select: () => import('../select/select-demo').then((m) => m.SelectDemo),
  'form-field': () => import('../form-field/form-field-demo').then((m) => m.FormFieldDemo),
  dialog: () => import('../dialog/dialog-demo').then((m) => m.DialogDemo),
  'dropdown-menu': () => import('../dropdown-menu/dropdown-menu-demo').then((m) => m.DropdownMenuDemo),
  tooltip: () => import('../tooltip/tooltip-demo').then((m) => m.TooltipDemo),
  toast: () => import('../toast/toast-demo').then((m) => m.ToastDemo),
  tabs: () => import('../tabs/tabs-demo').then((m) => m.TabsDemo),
  accordion: () => import('../accordion/accordion-demo').then((m) => m.AccordionDemo),
};
