import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injectable,
  InjectionToken,
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
export type ToastPlacement = 'top-start' | 'top-end' | 'top-center' | 'bottom-start' | 'bottom-end' | 'bottom-center';

/** Options for {@link Toast.show}. */
export type ToastOptions = {
  /** Muted second line under the message. */
  description?: string;
  /** Milliseconds before auto-dismiss. @default 3000 */
  duration?: number;
  /** Where the toast stack appears. @default 'top-end' */
  placement?: ToastPlacement;
  /** Never auto-dismiss; the user must dismiss explicitly. */
  persistent?: boolean;
  /**
   * Accessible label of the dismiss button for this toast. Overrides the
   * app-wide {@link provideNgcToastDismissLabel}. @default 'Dismiss notification'
   */
  dismissLabel?: string;
};

/** Handle to a shown toast. */
export type ToastRef = { dismiss(): Promise<void> };

type ToastContext = { message: string; description?: string; dismissLabel?: string };

/**
 * Imperative toast API (spec 001, the one component whose primary API is a
 * service):
 *
 * ```ts
 * private readonly toast = inject(Toast);
 * this.toast.show('Article published', { description: 'Readers were notified.' });
 * ```
 *
 * Rendering, stacking (max 3, newest on top, hover to expand), swipe
 * dismissal, and timers come from NgpToastManager/NgpToast (internal detail,
 * spec 001 §2). Toasts render into a fixed body-level container per
 * placement.
 */
@Injectable({ providedIn: 'root' })
export class Toast {
  private readonly manager = inject(NgpToastManager);

  /** Show a toast; returns a handle to dismiss it programmatically. */
  show(message: string, options: ToastOptions = {}): ToastRef {
    const { description, dismissLabel, ...toastOptions } = options;
    return this.manager.show(ToastItem, {
      ...toastOptions,
      context: { message, description, dismissLabel } satisfies ToastContext,
    });
  }
}

/**
 * The rendered toast (internal – created by {@link Toast.show}). Announcement
 * happens through NgpToastManager's live container – the single live region;
 * the toast itself must not repeat role=status/aria-live or screen readers
 * announce every toast twice (review 2026-07-11 D1). Always carries an
 * explicit dismiss button.
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
  },
})
export class ToastItem {
  private readonly manager = inject(NgpToastManager);
  private readonly toast = inject(NgpToast);
  protected readonly context = injectToastContext<ToastContext>();
  protected readonly dismissLabel =
    this.context.dismissLabel ?? inject(NGC_TOAST_DISMISS_LABEL, { optional: true }) ?? 'Dismiss notification';

  protected onDismiss(): void {
    void this.manager.dismiss(this.toast);
  }
}
