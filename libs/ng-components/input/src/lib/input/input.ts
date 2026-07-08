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
 * styling for validation states.
 */
@Directive({
  selector: 'input[ngc-input]',
  hostDirectives: [{ directive: NgpInput, inputs: ['id', 'disabled'] }],
  host: { class: 'ngc-input' },
})
export class Input {}
