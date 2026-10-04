import { ChangeDetectionStrategy, Component, forwardRef, inject, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgcValueAccessor } from '@angular-software/ng-components/core';
import { NgpCheckbox } from 'ng-primitives/checkbox';

/**
 * NgcCheckbox on a native `<button>` (Radix/shadcn anatomy) so `<label for>`
 * association works natively:
 *
 * ```html
 * <button ngc-checkbox id="terms"></button>
 * <label ngc-label for="terms">Accept terms</label>
 * ```
 *
 * Behavior comes from NgpCheckbox (internal detail, spec 001 §2): role,
 * aria-checked (`mixed` when indeterminate), tabindex, Space toggling, and the
 * `data-checked` / `data-indeterminate` state attributes the styles target.
 * The template only renders the check/indeterminate indicator icons.
 *
 * Reactive forms integrate through the ControlValueAccessor (`FormControl<boolean>`);
 * standalone usage works via `[(checked)]`. The wrapper adds `aria-required`
 * from the `required` input (review 2026-10-04 L-12); `aria-invalid` for a
 * touched invalid control comes from the primitive's form-control status.
 */
@Component({
  selector: 'button[ngc-checkbox]',
  hostDirectives: [
    {
      directive: NgpCheckbox,
      inputs: [
        'id',
        'ngpCheckboxChecked: checked',
        'ngpCheckboxDefaultChecked: defaultChecked',
        'ngpCheckboxIndeterminate: indeterminate',
        'ngpCheckboxRequired: required',
        'ngpCheckboxDisabled: disabled',
      ],
      outputs: ['ngpCheckboxCheckedChange: checkedChange', 'ngpCheckboxIndeterminateChange: indeterminateChange'],
    },
  ],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgcCheckbox), multi: true }],
  template: `
    <svg
      class="ngc-checkbox__icon ngc-checkbox__icon--check"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
    <svg
      class="ngc-checkbox__icon ngc-checkbox__icon--indeterminate"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
  `,
  styleUrl: './checkbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ngc-checkbox',
    type: 'button',
    '[attr.aria-required]': 'checkbox.required() || null',
    '(focusout)': 'markTouchedOnFocusout($event)',
  },
})
export class NgcCheckbox extends NgcValueAccessor<boolean> {
  protected readonly checkbox = inject(NgpCheckbox);

  constructor() {
    super();
    this.checkbox.checkedChange.subscribe((value) => this.notifyChange(value));
  }

  writeValue(value: unknown): void {
    this.checkbox.setChecked(value === true, { emit: false });
  }

  setDisabledState(isDisabled: boolean): void {
    this.checkbox.setDisabled(isDisabled);
  }
}
