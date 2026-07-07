import { computed, Directive, input } from '@angular/core';
import { NgpButton } from 'ng-primitives/button';

export type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

/**
 * Attribute directive on a native `<button>` (or `<a>`):
 * `<button ngc-button variant="outline" size="sm">`.
 *
 * Behavior comes from NgpButton (an internal detail, spec 001 §2): it emits
 * `data-disabled` and manages the disabled interaction state – its `disabled`
 * input is forwarded. Styles live in core's global stylesheet
 * (`core/src/styles/components/_button.scss`), keyed off the modifier classes
 * and data attributes, tokens only.
 */
@Directive({
  selector: '[ngc-button]',
  hostDirectives: [{ directive: NgpButton, inputs: ['disabled'] }],
  host: {
    '[class]': 'hostClasses()',
  },
})
export class Button {
  /** Visual style of the button. */
  readonly variant = input<ButtonVariant>('default');
  /** Size preset; `icon` renders a square icon button. */
  readonly size = input<ButtonSize>('default');

  protected readonly hostClasses = computed(
    () => `ngc-button ngc-button--${this.variant()} ngc-button--size-${this.size()}`,
  );
}
