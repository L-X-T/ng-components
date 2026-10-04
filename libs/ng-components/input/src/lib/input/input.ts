import { Directive } from '@angular/core';
import { ngcAriaInvalid } from '@angular-software/ng-components/core';
import { NgpInput } from 'ng-primitives/input';

/**
 * Attribute directive for text inputs on a native `<input>`:
 * `<input ngc-input type="email" />`.
 *
 * Behavior comes from NgpInput (an internal detail, spec 001 §2): it manages
 * the id and disabled state and emits `data-disabled` – its inputs are
 * forwarded. Styles live in core's global stylesheet
 * (`core/src/styles/components/_input.scss`), including `aria-invalid`
 * styling for validation states. Inside `ngc-form-field` the directive sets
 * `aria-invalid` itself once the control is touched and invalid (review
 * 2026-10-04 L-13); a static `aria-invalid` attribute wins.
 */
@Directive({
  selector: 'input[ngc-input]',
  hostDirectives: [{ directive: NgpInput, inputs: ['id', 'disabled'] }],
  host: { class: 'ngc-input', '[attr.aria-invalid]': 'ariaInvalid()' },
})
export class NgcInput {
  protected readonly ariaInvalid = ngcAriaInvalid();
}
