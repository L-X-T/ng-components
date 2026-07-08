import { ChangeDetectionStrategy, Component, forwardRef, inject, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgpCheckbox } from 'ng-primitives/checkbox';

/**
 * Checkbox on a native `<button>` (Radix/shadcn anatomy) so `<label for>`
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
 * standalone usage works via `[(checked)]`.
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
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Checkbox), multi: true }],
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
    '(blur)': 'onBlur()',
  },
})
export class Checkbox implements ControlValueAccessor {
  private readonly checkbox = inject(NgpCheckbox);

  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    this.checkbox.checkedChange.subscribe((value) => this.onChange(value));
  }

  writeValue(value: unknown): void {
    this.checkbox.setChecked(value === true, { emit: false });
  }

  registerOnChange(onChange: (value: boolean) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.checkbox.setDisabled(isDisabled);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
