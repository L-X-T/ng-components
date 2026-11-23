import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  input,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { injectFormFieldState, NgpDescription, NgpFormField, NgpLabel } from 'ng-primitives/form-field';

let nextErrorId = 0;

/**
 * Form field (the pattern a typical contact form uses):
 *
 * ```html
 * <ngc-form-field>
 *   <label ngc-field-label>Email</label>
 *   <input ngc-input type="email" [formControl]="email" />
 *   <p ngc-field-hint>We never share your email.</p>
 *   <p ngc-field-error validator="required">Email is required.</p>
 *   <p ngc-field-error validator="email">Enter a valid email address.</p>
 * </ngc-form-field>
 * ```
 *
 * Wiring comes from NgpFormField and friends (internal detail, spec 001 §2):
 * the label's `for` points at the control automatically, hints and failing
 * errors feed the control's `aria-describedby`, and the field mirrors the
 * control status as `data-invalid` / `data-touched` / … attributes on every
 * part. Errors stay in the DOM and become visible via CSS once their
 * validator fails on a touched control – and only then join the control's
 * `aria-describedby`, so what screen readers hear matches what is shown.
 */
@Component({
  selector: 'ngc-form-field',
  hostDirectives: [NgpFormField],
  template: `<ng-content />`,
  styleUrl: './form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-form-field' },
})
export class NgcFormField {}

/** Label of the field; associates with the control automatically. */
@Directive({
  selector: 'label[ngc-field-label]',
  hostDirectives: [{ directive: NgpLabel, inputs: ['id'] }],
  host: { class: 'ngc-field-label' },
})
export class NgcFormFieldLabel {}

/** Always-visible hint text; feeds the control's aria-describedby. */
@Directive({
  selector: '[ngc-field-hint]',
  hostDirectives: [{ directive: NgpDescription, inputs: ['id'] }],
  host: { class: 'ngc-field-hint' },
})
export class NgcFormFieldHint {}

/**
 * Error message for one validator (or any error when `validator` is omitted).
 * Visible only while its validator fails on a touched control.
 *
 * Implemented without NgpError on purpose: NgpError
 * registers its id in the control's `aria-describedby` as soon as the
 * validator fails – before the control is touched and while the message is
 * still `display: none` – so screen readers announced invisible errors.
 * Here the registration follows the same touched policy as the visibility.
 */
@Directive({
  selector: '[ngc-field-error]',
  host: {
    class: 'ngc-field-error',
    '[attr.id]': 'id()',
    '[attr.data-validator]': 'validatorState()',
    '[attr.data-invalid]': 'formFieldState()?.invalid() ? "" : null',
    '[attr.data-touched]': 'touched() ? "" : null',
  },
})
export class NgcFormFieldError {
  /** Null-safe signal: ng-primitives hands out an empty signal outside a form field. */
  protected readonly formFieldState = injectFormFieldState({ optional: true });

  /** Element id; generated unless provided. */
  readonly id = input(`ngc-field-error-${nextErrorId++}`);
  /** The validator key this message belongs to; omit to show for any error. */
  readonly validator = input<string | null>(null);

  protected readonly hasError = computed(() => {
    const errors = this.formFieldState()?.errors() ?? [];
    const validator = this.validator();
    return validator ? errors.includes(validator) : errors.length > 0;
  });
  protected readonly validatorState = computed(() => (this.hasError() ? 'fail' : 'pass'));
  protected readonly touched = computed(() => this.formFieldState()?.touched() === true);

  constructor() {
    effect((onCleanup) => {
      const formField = this.formFieldState();
      if (!formField || !this.hasError() || !this.touched()) {
        return;
      }
      const id = this.id();
      // untracked: addDescription reads the descriptions signal – tracking it
      // would re-run (and undo) this effect on its own write.
      untracked(() => formField.addDescription(id));
      onCleanup(() => formField.removeDescription(id));
    });
  }
}
