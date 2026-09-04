import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  type Signal,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgcValueAccessor } from '@angular-software/ng-components/core';
import {
  injectSelectState,
  NgpSelect,
  NgpSelectDropdown,
  NgpSelectOption,
  NgpSelectPortal,
} from 'ng-primitives/select';

/**
 * NgcSelect on a native `<button>` trigger (combobox pattern):
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
 * but option components exist eagerly, so the trigger label works while
 * closed. Typeahead exists only while the dropdown is open (ng-primitives
 * does not implement closed-state typeahead). Reactive forms integrate
 * through the ControlValueAccessor.
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
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgcSelect), multi: true }],
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
    '(focusout)': 'markTouchedOnFocusout($event)',
  },
})
export class NgcSelect<T = string> extends NgcValueAccessor<T | undefined> {
  private readonly state = injectSelectState<T>();

  /** Text shown in the trigger while no option is selected. */
  readonly placeholder = input('');

  /** Explicit option labels, registered by NgcSelectOption, keyed by host element. */
  private readonly optionLabels = signal<ReadonlyMap<HTMLElement, Signal<string | undefined>>>(new Map());

  /**
   * Label of the selected option for the trigger: the option's `label` input
   * when set (reactive), otherwise its text content. The text-content
   * fallback is a snapshot – it does not update when the projected text
   * changes later (async/i18n labels); pass `label` in that case (review
   * 2026-07-11 D6).
   */
  protected readonly selectedLabel = computed(() => {
    const state = this.state();
    const selected = state.sortedOptions().find((option) => state.isOptionSelected(option.value() as T));
    if (!selected) {
      return null;
    }
    const explicitLabel = this.optionLabels().get(selected.elementRef.nativeElement)?.();
    return explicitLabel ?? selected.elementRef.nativeElement.textContent?.trim() ?? null;
  });

  registerOptionLabel(element: HTMLElement, label: Signal<string | undefined>): void {
    this.optionLabels.update((labels) => new Map(labels).set(element, label));
  }

  unregisterOptionLabel(element: HTMLElement): void {
    this.optionLabels.update((labels) => {
      const next = new Map(labels);
      next.delete(element);
      return next;
    });
  }

  constructor() {
    super();
    this.state()
      .valueChange.pipe(takeUntilDestroyed())
      .subscribe((value) => this.notifyChange(value));
  }

  writeValue(value: T | undefined): void {
    this.state().setValue(value ?? undefined, { emit: false });
  }

  setDisabledState(isDisabled: boolean): void {
    this.state().setDisabled(isDisabled);
  }
}

/**
 * A single option inside `ngc-select`. The template renders a check indicator
 * (visible while selected) next to the projected label; NgpSelectOption
 * provides role, aria-selected, and the active/selected data attributes.
 * When the projected text can change after creation (async or translated
 * labels), set `label` so the trigger stays in sync (review 2026-07-11 D6).
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
export class NgcSelectOption {
  /** Reactive trigger label; without it the trigger snapshots the text content. */
  readonly label = input<string>();

  constructor() {
    const select = inject(NgcSelect);
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    select.registerOptionLabel(element, this.label);
    inject(DestroyRef).onDestroy(() => select.unregisterOptionLabel(element));
  }
}
