import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';
import { NgpDescription, NgpError, NgpFormField, NgpLabel } from 'ng-primitives/form-field';

/**
 * Form field (the pattern the websites' contact form uses):
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
 * validator fails on a touched control.
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
 */
@Directive({
  selector: '[ngc-field-error]',
  hostDirectives: [{ directive: NgpError, inputs: ['id', 'ngpErrorValidator: validator'] }],
  host: { class: 'ngc-field-error' },
})
export class NgcFormFieldError {}
