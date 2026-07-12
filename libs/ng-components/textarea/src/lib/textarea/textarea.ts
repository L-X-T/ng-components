import { Directive } from '@angular/core';
import { NgpTextarea } from 'ng-primitives/textarea';

/**
 * Attribute directive for multi-line text inputs on a native `<textarea>`:
 * `<textarea ngc-textarea rows="4"></textarea>`.
 *
 * Behavior comes from NgpTextarea (an internal detail, spec 001 §2): it
 * manages the id and disabled state and emits `data-disabled` – its inputs
 * are forwarded. Styles live in core's global stylesheet
 * (`core/src/styles/components/_textarea.scss`).
 */
@Directive({
  selector: 'textarea[ngc-textarea]',
  hostDirectives: [{ directive: NgpTextarea, inputs: ['id', 'disabled'] }],
  host: { class: 'ngc-textarea' },
})
export class NgcTextarea {}
