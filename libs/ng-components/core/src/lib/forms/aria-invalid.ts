import { computed, ElementRef, inject, type Signal } from '@angular/core';
import { injectFormFieldState } from 'ng-primitives/form-field';

/**
 * `aria-invalid` for a form control hosted inside `ngc-form-field` (review
 * 2026-10-04 L-13): ng-primitives mirrors the control status only as
 * `data-invalid` / `data-touched`, so a touched invalid control looked invalid
 * without saying so to assistive technology. The value follows the same
 * touched policy as the visual invalid state and the error messages. A
 * *static* `aria-invalid="true|false"` attribute set by the consumer always
 * wins (it is read once at construction); outside a form field the result is
 * `null`, so a consumer who binds the attribute dynamically there has to do
 * so without `ngc-form-field` semantics – the host binding removes a bound
 * value on its first pass. Bind the result to `[attr.aria-invalid]` on the
 * control's host.
 */
export function ngcAriaInvalid(): Signal<'true' | null> {
  const explicit = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.getAttribute('aria-invalid');
  const formField = injectFormFieldState({ optional: true });
  return computed(() => {
    if (explicit === 'true' || explicit === 'false') {
      return explicit === 'true' ? 'true' : null;
    }
    const state = formField();
    return state?.invalid() && state.touched() ? 'true' : null;
  });
}
