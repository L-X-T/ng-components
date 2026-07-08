import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { injectSelectState, NgpSelect, NgpSelectDropdown, NgpSelectOption, NgpSelectPortal } from 'ng-primitives/select';

/**
 * Select on a native `<button>` trigger (combobox pattern):
 *
 * ```html
 * <button ngc-select placeholder="Pick a fruit" [formControl]="fruit">
 *   <ngc-select-option value="apple">Apple</ngc-select-option>
 *   <ngc-select-option value="banana">Banana</ngc-select-option>
 * </button>
 * ```
 *
 * Behavior comes from NgpSelect (internal detail, spec 001 §2): combobox
 * role/aria, dropdown overlay positioning (flip + trigger-width matching via
 * `--ngp-select-width`), active-descendant keyboard navigation, and outside
 * click/Escape dismissal. This is the workspace's first overlay component –
 * the dropdown renders into `body` through NgpSelectPortal and layers on the
 * core `--z-overlay` token.
 *
 * Options are projected; the dropdown template only instantiates while open,
 * but option components exist eagerly, so the trigger label and typeahead work
 * while closed. Reactive forms integrate through the ControlValueAccessor.
 */
@Component({
  selector: 'button[ngc-select]',
  hostDirectives: [
    {
      directive: NgpSelect,
      inputs: [
        'id',
        'ngpSelectValue: value',
        'ngpSelectDisabled: disabled',
        'ngpSelectCompareWith: compareWith',
        'ngpSelectDropdownPlacement: placement',
      ],
      outputs: ['ngpSelectValueChange: valueChange', 'ngpSelectOpenChange: openChange'],
    },
  ],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Select), multi: true }],
  imports: [NgpSelectDropdown, NgpSelectPortal],
  template: `
    <span class="ngc-select__value" [class.ngc-select__value--placeholder]="!selectedLabel()">
      {{ selectedLabel() ?? placeholder() }}
    </span>
    <svg
      class="ngc-select__chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>

    <div *ngpSelectPortal ngpSelectDropdown class="ngc-select-dropdown">
      <ng-content />
    </div>
  `,
  styleUrl: './select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ngc-select',
    type: 'button',
    '(blur)': 'onBlur()',
  },
})
export class Select<T = string> implements ControlValueAccessor {
  private readonly state = injectSelectState<T>();

  /** Text shown in the trigger while no option is selected. */
  readonly placeholder = input('');

  /** Label of the selected option (its text content), for the trigger. */
  protected readonly selectedLabel = computed(() => {
    const state = this.state();
    const selected = state.sortedOptions().find((option) => state.isOptionSelected(option.value() as T));
    return selected?.elementRef.nativeElement.textContent?.trim() ?? null;
  });

  private onChange: (value: T | undefined) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    this.state()
      .valueChange.pipe(takeUntilDestroyed())
      .subscribe((value) => this.onChange(value));
  }

  writeValue(value: T | undefined): void {
    this.state().setValue(value ?? undefined, { emit: false });
  }

  registerOnChange(onChange: (value: T | undefined) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.state().setDisabled(isDisabled);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}

/**
 * A single option inside `ngc-select`. The template renders a check indicator
 * (visible while selected) next to the projected label; NgpSelectOption
 * provides role, aria-selected, and the active/selected data attributes.
 */
@Component({
  selector: 'ngc-select-option',
  hostDirectives: [
    {
      directive: NgpSelectOption,
      inputs: ['id', 'ngpSelectOptionValue: value', 'ngpSelectOptionDisabled: disabled'],
    },
  ],
  template: `
    <svg
      class="ngc-select-option__check"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ngc-select-option',
  },
})
export class SelectOption {}
