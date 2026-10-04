import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';
import { NgpTabButton, NgpTabList, NgpTabPanel, NgpTabset } from 'ng-primitives/tabs';

/**
 * NgcTabs (shadcn anatomy):
 *
 * ```html
 * <ngc-tabs value="account">
 *   <div ngc-tabs-list aria-label="Account settings">
 *     <button ngc-tab value="account">Account</button>
 *     <button ngc-tab value="password">Password</button>
 *   </div>
 *   <div ngc-tab-panel value="account">…</div>
 *   <div ngc-tab-panel value="password">…</div>
 * </ngc-tabs>
 * ```
 *
 * Behavior comes from NgpTabset and friends (internal detail, spec 001 §2):
 * roles (tablist/tab/tabpanel), aria-selected/aria-controls/aria-labelledby
 * wiring, and roving focus – arrow keys (per `orientation`) move focus,
 * skipping disabled tabs and wrapping at the ends (`wrap`, on by default),
 * Home/End jump, Enter/Space activates. `activateOnFocus` (the default)
 * activates while arrowing. Only the tabset takes an `id`: the
 * primitive derives tab and panel ids (and their aria-controls /
 * aria-labelledby pairing) from it, so custom ids on the parts would break
 * the pairing (review 2026-10-04 L-04).
 */
@Component({
  selector: 'ngc-tabs',
  hostDirectives: [
    {
      directive: NgpTabset,
      inputs: [
        'id',
        'ngpTabsetValue: value',
        'ngpTabsetOrientation: orientation',
        'ngpTabsetActivateOnFocus: activateOnFocus',
        'ngpTabsetWrap: wrap',
      ],
      outputs: ['ngpTabsetValueChange: valueChange'],
    },
  ],
  template: `<ng-content />`,
  styleUrl: './tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-tabs' },
})
export class NgcTabs {}

/** Container for the tab buttons; give it an aria-label. */
@Directive({
  selector: '[ngc-tabs-list]',
  hostDirectives: [NgpTabList],
  host: { class: 'ngc-tabs-list' },
})
export class NgcTabsList {}

/**
 * One tab button; `value` links it to its panel. Misuse note (spec 001 §5):
 * a missing `value` throws NgpTabButton's own clear error
 * ("ngpTabButton: value is required") – no wrapper assertion needed.
 */
@Directive({
  selector: 'button[ngc-tab]',
  hostDirectives: [
    {
      directive: NgpTabButton,
      inputs: ['ngpTabButtonValue: value', 'ngpTabButtonDisabled: disabled'],
    },
  ],
  host: { class: 'ngc-tab', type: 'button' },
})
export class NgcTab {}

/** Content panel shown while its tab is selected. */
@Directive({
  selector: '[ngc-tab-panel]',
  hostDirectives: [
    {
      directive: NgpTabPanel,
      inputs: ['ngpTabPanelValue: value'],
    },
  ],
  host: { class: 'ngc-tab-panel' },
})
export class NgcTabPanel {}
