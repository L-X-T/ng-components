import {
  afterRenderEffect,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  HOST_TAG_NAME,
  inject,
  input,
} from '@angular/core';
import { NgpButton } from 'ng-primitives/button';

export type NgcButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
export type NgcButtonSize = 'default' | 'sm' | 'lg' | 'icon';

/**
 * Attribute directive on a native `<button>` (or `<a>`):
 * `<button ngc-button variant="outline" size="sm">`.
 *
 * Behavior comes from NgpButton (an internal detail, spec 001 §2): it emits
 * `data-disabled` and manages the disabled interaction state – its `disabled`
 * input is forwarded. Styles live in core's global stylesheet
 * (`core/src/styles/components/_button.scss`), keyed off the modifier classes
 * and data attributes, tokens only.
 *
 * On `<a>` hosts NgpButton only sets `aria-disabled`; the wrapper makes a
 * hard-disabled link behave disabled too – it leaves the tab order and
 * swallows activation.
 */
@Directive({
  selector: '[ngc-button]',
  hostDirectives: [{ directive: NgpButton, inputs: ['disabled'] }],
  host: {
    '[class]': 'hostClasses()',
  },
})
export class NgcButton {
  private readonly button = inject(NgpButton);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** Visual style of the button. */
  readonly variant = input<NgcButtonVariant>('default');
  /** Size preset; `icon` renders a square icon button. */
  readonly size = input<NgcButtonSize>('default');

  protected readonly hostClasses = computed(
    () => `ngc-button ngc-button--${this.variant()} ngc-button--size-${this.size()}`,
  );

  constructor() {
    if (inject(HOST_TAG_NAME).toLowerCase() === 'a') {
      this.disableAnchorWhenHardDisabled();
    }
  }

  /**
   * `<a>` hosts have no native disabled state. While hard-disabled (`true`,
   * not `'soft'` – NgpButton keeps soft-disabled anchors focusable and lets
   * their events fire by contract) the anchor leaves the tab order and a
   * capture-phase listener swallows activation before Angular's own click
   * listeners run – `stopImmediatePropagation` from a bubbling listener
   * would not stop consumer `(click)` handlers on the same element
   * Only a tabindex the wrapper applied is undone; the consumer's own value
   * is restored when the anchor is enabled again.
   */
  private disableAnchorWhenHardDisabled(): void {
    const hardDisabled = computed(() => this.button.disabled() === true);
    const swallow = (event: Event): void => {
      if (hardDisabled()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    this.element.addEventListener('click', swallow, true);
    inject(DestroyRef).onDestroy(() => this.element.removeEventListener('click', swallow, true));

    let applied = false;
    let consumerTabindex: string | null = null;
    afterRenderEffect(() => {
      if (hardDisabled()) {
        if (!applied) {
          consumerTabindex = this.element.getAttribute('tabindex');
          applied = true;
        }
        this.element.setAttribute('tabindex', '-1');
      } else if (applied) {
        applied = false;
        if (consumerTabindex === null) {
          this.element.removeAttribute('tabindex');
        } else {
          this.element.setAttribute('tabindex', consumerTabindex);
        }
      }
    });
  }
}
