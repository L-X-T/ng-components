import { Directive } from '@angular/core';

/**
 * Attribute directive for form labels: `<label ngc-label for="…">`. CSS-only
 * (spec 001 §6) – native `<label>` semantics (click-to-focus via `for`) stay
 * untouched. Styles live in core's global stylesheet
 * (`core/src/styles/components/_label.scss`).
 */
@Directive({
  selector: '[ngc-label]',
  host: { class: 'ngc-label' },
})
export class Label {}
