import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, inject, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { injectRadioGroupState, NgpRadioGroup, NgpRadioItem } from 'ng-primitives/radio';

/**
 * Radio group (shadcn anatomy): the `<ngc-radio-group>` container plus
 * `ngc-radio-item` buttons –
 *
 * ```html
 * <ngc-radio-group orientation="vertical" [formControl]="plan">
 *   <button ngc-radio-item value="starter" id="plan-starter"></button>
 *   <label ngc-label for="plan-starter">Starter</label>
 *   …
 * </ngc-radio-group>
 * ```
 *
 * Behavior comes from NgpRadioGroup/NgpRadioItem (internal detail, spec 001
 * §2): roles, aria-checked, roving focus with arrow-key cycling (follow the
 * group's `orientation`), and the `data-checked` / `data-disabled` /
 * `data-orientation` attributes the styles target. Layout follows
 * `data-orientation` too, so the keyboard axis always matches the visual axis.
 *
 * Reactive forms integrate through the ControlValueAccessor on the group;
 * standalone usage works via `[(value)]`.
 */
@Component({
  selector: 'ngc-radio-group',
  hostDirectives: [
    {
      directive: NgpRadioGroup,
      inputs: [
        'id',
        'ngpRadioGroupValue: value',
        'ngpRadioGroupDefaultValue: defaultValue',
        'ngpRadioGroupDisabled: disabled',
        'ngpRadioGroupOrientation: orientation',
        'ngpRadioGroupCompareWith: compareWith',
      ],
      outputs: ['ngpRadioGroupValueChange: valueChange'],
    },
  ],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioGroup), multi: true }],
  template: `<ng-content />`,
  styleUrl: './radio-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ngc-radio-group',
    '(focusout)': 'onFocusout($event)',
  },
})
export class RadioGroup<T = string> implements ControlValueAccessor {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly state = injectRadioGroupState<T>();

  private onChange: (value: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    this.state()
      .valueChange.pipe(takeUntilDestroyed())
      .subscribe((value) => this.onChange(value));
  }

  writeValue(value: T | null): void {
    this.state().setValue(value, { emit: false });
  }

  registerOnChange(onChange: (value: T | null) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.state().setDisabled(isDisabled);
  }

  protected onFocusout(event: FocusEvent): void {
    const nextFocus = event.relatedTarget as Node | null;
    if (!nextFocus || !this.elementRef.nativeElement.contains(nextFocus)) {
      this.onTouched();
    }
  }
}

/**
 * A single option inside `ngc-radio-group`, on a native `<button>` so
 * `<label for>` association works natively. The template only renders the
 * dot indicator; NgpRadioItem provides role, aria-checked, focus-selection,
 * and roving-focus participation.
 *
 * Misuse note (spec 001 §5): outside an `ngc-radio-group`, NgpRadioItem
 * throws `NG0201: No provider found for InjectionToken Primitive:
 * NgpRadioGroup` before this component constructs – a clearer wrapper-level
 * assertion is impossible, so that error IS the outside-a-group signal.
 */
@Component({
  selector: 'button[ngc-radio-item]',
  hostDirectives: [
    {
      directive: NgpRadioItem,
      inputs: ['ngpRadioItemValue: value', 'ngpRadioItemDisabled: disabled'],
    },
  ],
  template: `
    <svg class="ngc-radio-item__indicator" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ngc-radio-item',
    type: 'button',
  },
})
export class RadioItem {}
