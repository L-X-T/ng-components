import { Directive } from '@angular/core';
import { NgpInput } from 'ng-primitives/input';

/**
 * Attribute directive for text inputs on a native `<input>`:
 * `<input ngc-input type="email" />`.
 *
 * Behavior comes from NgpInput (an internal detail, spec 001 §2): it manages
 * the id and disabled state and emits `data-disabled` – its inputs are
 * forwarded. Styles live in core's global stylesheet
 * (`core/src/styles/components/_input.scss`), including `aria-invalid`
 * styling for validation states. `aria-invalid` follows the bound form
 * control: the primitive sets it once the control is touched and invalid
 * (inside or outside `ngc-form-field`) and removes it otherwise, so a static
 * attribute does not survive – an input without a form control never reports
 * invalid (in ng-primitives since 0.128).
 */
@Directive({
  selector: 'input[ngc-input]',
  hostDirectives: [{ directive: NgpInput, inputs: ['id', 'disabled'] }],
  host: { class: 'ngc-input' },
})
export class NgcInput {}
