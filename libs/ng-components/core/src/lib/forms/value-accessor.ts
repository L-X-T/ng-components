import { ElementRef, inject } from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';

/**
 * Shared ControlValueAccessor plumbing for the form components (review
 * 2026-07-11 D8): onChange/onTouched registration plus the touched semantics
 * radio-group established – a control only becomes touched when focus leaves
 * its whole subtree, so moving between inner parts (radio items, a dropdown
 * trigger) does not touch it prematurely. Bind the host `(focusout)` to
 * {@link markTouchedOnFocusout}. Subclasses own the value plumbing:
 * `writeValue`, `setDisabledState`, and calling {@link notifyChange} on user
 * input. Uses `inject()`, so subclasses must be created in an injection
 * context (components always are).
 */
export abstract class NgcValueAccessor<T> implements ControlValueAccessor {
  private readonly hostElementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private onChange: (value: T) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  abstract writeValue(value: unknown): void;
  abstract setDisabledState(isDisabled: boolean): void;

  registerOnChange(onChange: (value: T) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  /** Forward a user-driven value change into the form control. */
  protected notifyChange(value: T): void {
    this.onChange(value);
  }

  /** Marks the control touched when focus leaves the component subtree. */
  protected markTouchedOnFocusout(event: FocusEvent): void {
    const nextFocus = event.relatedTarget as Node | null;
    if (!nextFocus || !this.hostElementRef.nativeElement.contains(nextFocus)) {
      this.onTouched();
    }
  }
}
