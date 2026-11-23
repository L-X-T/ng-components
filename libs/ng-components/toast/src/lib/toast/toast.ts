import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  Injectable,
  InjectionToken,
  PLATFORM_ID,
  Provider,
  ViewEncapsulation,
} from '@angular/core';
import { injectToastContext, NgpToast, NgpToastManager } from 'ng-primitives/toast';

export const NGC_TOAST_DISMISS_LABEL = new InjectionToken<string>('NGC_TOAST_DISMISS_LABEL');

/** App-wide accessible label for the toast dismiss button (i18n). */
export function provideNgcToastDismissLabel(label: string): Provider {
  return { provide: NGC_TOAST_DISMISS_LABEL, useValue: label };
}

/** Placements supported by the toast manager. */
export type NgcToastPlacement =
  'top-start' | 'top-end' | 'top-center' | 'bottom-start' | 'bottom-end' | 'bottom-center';

/** Options for {@link NgcToast.show}. */
export type NgcToastOptions = {
  /** Muted second line under the message. */
  description?: string;
  /** Milliseconds before auto-dismiss. @default 3000 */
  duration?: number;
  /** Where the toast stack appears. @default 'top-end' */
  placement?: NgcToastPlacement;
  /** Never auto-dismiss; the user must dismiss explicitly. */
  persistent?: boolean;
  /**
   * Accessible label of the dismiss button for this toast. Overrides the
   * app-wide {@link provideNgcToastDismissLabel}. @default 'Dismiss notification'
   */
  dismissLabel?: string;
};

/** Handle to a shown toast. */
export type NgcToastRef = { dismiss(): Promise<void> };

type ToastContext = { message: string; description?: string; dismissLabel?: string };

/**
 * Imperative toast API (spec 001, the one component whose primary API is a
 * service):
 *
 * ```ts
 * private readonly toast = inject(NgcToast);
 * this.toast.show('Article published', { description: 'Readers were notified.' });
 * ```
 *
 * Rendering, stacking (max 3, newest on top, hover or keyboard focus to
 * expand), swipe dismissal, and timers come from NgpToastManager/NgpToast
 * (internal detail, spec 001 §2). Toasts render into a fixed body-level
 * container per placement – browser only: on the server `show` is a no-op
 * that returns an already-dismissed handle, because the manager appends to
 * `document.body`.
 */
@Injectable({ providedIn: 'root' })
export class NgcToast {
  private readonly manager = inject(NgpToastManager);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Show a toast; returns a handle to dismiss it programmatically. */
  show(message: string, options: NgcToastOptions = {}): NgcToastRef {
    if (!this.isBrowser) {
      return { dismiss: () => Promise.resolve() };
    }
    const { description, dismissLabel, ...toastOptions } = options;
    return this.manager.show(NgcToastItem, {
      ...toastOptions,
      context: { message, description, dismissLabel } satisfies ToastContext,
    });
  }
}

/**
 * The rendered toast (internal – created by {@link NgcToast.show}). Announcement
 * happens through NgpToastManager's live container – the single live region;
 * the toast itself must not repeat role=status/aria-live or screen readers
 * announce every toast twice. Always carries an
 * explicit dismiss button.
 *
 * Keyboard focus inside a toast expands the stack and pauses the auto-dismiss
 * timers, like pointer hover does: the manager
 * listens for `mouseenter`/`mouseleave` on its container and its timer API is
 * private, so focus is translated into those two events. Hover and focus are
 * independent – the stack stays expanded while either is active (the
 * manager's own `mouseleave` collapses it unconditionally, so a guard on the
 * container re-expands it while focus is still inside).
 */
@Component({
  selector: 'ngc-toast',
  hostDirectives: [NgpToast],
  template: `
    <div class="ngc-toast__content">
      <p class="ngc-toast__title">{{ context.message }}</p>
      @if (context.description) {
        <p class="ngc-toast__description">{{ context.description }}</p>
      }
    </div>
    <button class="ngc-toast__close" type="button" [attr.aria-label]="dismissLabel" (click)="onDismiss()">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  `,
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ngc-toast',
    '(focusin)': 'onFocusIn()',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class NgcToastItem {
  private readonly manager = inject(NgpToastManager);
  private readonly toast = inject(NgpToast);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  protected readonly context = injectToastContext<ToastContext>();
  protected readonly dismissLabel =
    this.context.dismissLabel ?? inject(NGC_TOAST_DISMISS_LABEL, { optional: true }) ?? 'Dismiss notification';

  constructor() {
    afterNextRender(() => this.installFocusGuard());
  }

  protected onDismiss(): void {
    void this.dismissFromButton();
  }

  /**
   * A keyboard dismissal removes the focused element, which fires no focusout
   * – without this the stack stayed expanded with every timer paused and
   * focus fell to body. Focus moves on to the next toast's
   * dismiss button; with none left the stack collapses unless hovered.
   */
  private async dismissFromButton(): Promise<void> {
    const container = this.container();
    const hadFocus = this.element.contains(this.document.activeElement);
    await this.manager.dismiss(this.toast);
    if (!container || !hadFocus) {
      return;
    }
    const nextClose = container.querySelector<HTMLElement>('.ngc-toast__close');
    if (nextClose) {
      nextClose.focus();
    } else if (!container.matches(':hover')) {
      container.dispatchEvent(new Event('mouseleave'));
    }
  }

  protected onFocusIn(): void {
    const container = this.container();
    if (container && this.element.dataset['expanded'] !== 'true') {
      container.dispatchEvent(new Event('mouseenter'));
    }
  }

  protected onFocusOut(event: FocusEvent): void {
    const container = this.container();
    const nextFocus = event.relatedTarget as Node | null;
    if (container && !(nextFocus && container.contains(nextFocus)) && !container.matches(':hover')) {
      container.dispatchEvent(new Event('mouseleave'));
    }
  }

  /** Once per container: a pointer leaving while focus is inside must not collapse the stack. */
  private installFocusGuard(): void {
    const container = this.container();
    if (!container || container.hasAttribute('data-ngc-focus-guard')) {
      return;
    }
    container.setAttribute('data-ngc-focus-guard', '');
    // No reference to this toast instance: the listener outlives it.
    container.addEventListener('mouseleave', () => {
      if (container.contains(container.ownerDocument.activeElement)) {
        container.dispatchEvent(new Event('mouseenter'));
      }
    });
  }

  private container(): HTMLElement | null {
    return this.element.closest<HTMLElement>('[data-ngp-toast-container]');
  }
}
