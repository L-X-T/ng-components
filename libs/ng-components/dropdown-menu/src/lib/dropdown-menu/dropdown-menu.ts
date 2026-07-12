import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';
import { NgpMenu, NgpMenuItem, NgpMenuTrigger } from 'ng-primitives/menu';

/**
 * Dropdown menu (shadcn anatomy). The menu lives in an `ng-template` the
 * trigger opens into a body-level, flip-positioned portal:
 *
 * ```html
 * <button ngc-button [ngc-menu-trigger]="menu">Options</button>
 * <ng-template #menu>
 *   <div ngc-menu>
 *     <span ngc-menu-label>My account</span>
 *     <button ngc-menu-item>Profile</button>
 *     <button ngc-menu-item>Billing</button>
 *     <div ngc-menu-separator></div>
 *     <button ngc-menu-item>Log out</button>
 *   </div>
 * </ng-template>
 * ```
 *
 * Behavior comes from NgpMenu/NgpMenuTrigger/NgpMenuItem (internal detail,
 * spec 001 §2): aria-haspopup/expanded on the trigger, role=menu/menuitem,
 * arrow-key navigation with wrapping, typeahead, Escape/outside-click
 * dismissal, and focus restore. Layering uses the core `--z-overlay` token.
 */
@Directive({
  selector: '[ngc-menu-trigger]',
  hostDirectives: [
    {
      directive: NgpMenuTrigger,
      inputs: [
        'ngpMenuTrigger: ngc-menu-trigger',
        'ngpMenuTriggerDisabled: disabled',
        'ngpMenuTriggerPlacement: placement',
      ],
    },
  ],
})
export class NgcMenuTrigger {}

/** The menu panel; items, labels, and separators are projected. */
@Component({
  selector: 'div[ngc-menu]',
  hostDirectives: [{ directive: NgpMenu, inputs: ['ngpMenuWrap: wrap'] }],
  template: `<ng-content />`,
  styleUrl: './dropdown-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-menu' },
})
export class NgcMenu {}

/** One action in the menu; apply to a native `<button>`. */
@Directive({
  selector: 'button[ngc-menu-item]',
  hostDirectives: [
    {
      directive: NgpMenuItem,
      inputs: ['ngpMenuItemDisabled: disabled', 'ngpMenuItemCloseOnSelect: closeOnSelect'],
    },
  ],
  host: { class: 'ngc-menu-item', type: 'button' },
})
export class NgcMenuItem {}

/** Non-interactive heading for a group of items. */
@Directive({
  selector: '[ngc-menu-label]',
  host: { class: 'ngc-menu-label' },
})
export class NgcMenuLabel {}

/** Visual divider between item groups. */
@Directive({
  selector: '[ngc-menu-separator]',
  host: { class: 'ngc-menu-separator', role: 'separator' },
})
export class NgcMenuSeparator {}
