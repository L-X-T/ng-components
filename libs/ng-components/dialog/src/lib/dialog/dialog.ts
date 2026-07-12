import { afterNextRender, ChangeDetectionStrategy, Component, Directive, ElementRef, inject, ViewEncapsulation } from '@angular/core';
import {
  NgpDialog,
  NgpDialogDescription,
  NgpDialogOverlay,
  NgpDialogTitle,
  NgpDialogTrigger,
} from 'ng-primitives/dialog';

/**
 * Dev-mode misuse check (spec 001 §5): true when the rendered panel carries
 * neither a populated aria-labelledby (fed by `ngc-dialog-title`) nor an
 * aria-label. @internal exported for its unit test only.
 */
export function dialogIsUnlabelled(element: HTMLElement): boolean {
  const labelledBy = element.getAttribute('aria-labelledby')?.trim() ?? '';
  return labelledBy === '' && !element.getAttribute('aria-label');
}

/**
 * Dialog (shadcn anatomy). The content lives in an `ng-template` the trigger
 * launches into a body-level portal:
 *
 * ```html
 * <button ngc-button [ngc-dialog-trigger]="confirm">Open</button>
 * <ng-template #confirm let-close="close">
 *   <div ngc-dialog-overlay>
 *     <div ngc-dialog>
 *       <h2 ngc-dialog-title>Publish this article?</h2>
 *       <p ngc-dialog-description>This action is irreversible.</p>
 *       <div ngc-dialog-footer>
 *         <button ngc-button variant="outline" (click)="close()">Cancel</button>
 *         <button ngc-button (click)="close()">Confirm</button>
 *       </div>
 *     </div>
 *   </div>
 * </ng-template>
 * ```
 *
 * Behavior comes from NgpDialog and friends (internal detail, spec 001 §2):
 * focus trap + focus restore, Escape and overlay-click dismissal,
 * aria-modal/aria-labelledby/aria-describedby wired to the title and
 * description. Layering uses the core `--z-overlay` token.
 */
@Directive({
  selector: '[ngc-dialog-trigger]',
  hostDirectives: [
    {
      directive: NgpDialogTrigger,
      inputs: [
        'ngpDialogTrigger: ngc-dialog-trigger',
        'ngpDialogTriggerCloseOnEscape: closeOnEscape',
        'ngpDialogTriggerCloseOnOutsideClick: closeOnOutsideClick',
      ],
      outputs: ['ngpDialogTriggerClosed: closed'],
    },
  ],
})
export class DialogTrigger {}

/** Backdrop covering the page; clicking it closes the dialog. */
@Component({
  selector: 'div[ngc-dialog-overlay]',
  hostDirectives: [NgpDialogOverlay],
  template: `<ng-content />`,
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-dialog-overlay' },
})
export class DialogOverlay {}

/** The dialog panel itself. */
@Component({
  selector: 'div[ngc-dialog]',
  hostDirectives: [
    {
      directive: NgpDialog,
      inputs: ['ngpDialogRole: role', 'ngpDialogModal: modal'],
    },
  ],
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-dialog' },
})
export class Dialog {
  constructor() {
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
      afterNextRender(() => {
        if (dialogIsUnlabelled(element)) {
          console.warn(
            'ngc-dialog: the panel has neither an ngc-dialog-title nor an aria-label – screen readers announce an unnamed dialog.',
          );
        }
      });
    }
  }
}

/** Dialog heading; feeds the dialog's aria-labelledby. */
@Directive({
  selector: '[ngc-dialog-title]',
  hostDirectives: [NgpDialogTitle],
  host: { class: 'ngc-dialog-title' },
})
export class DialogTitle {}

/** Muted description; feeds the dialog's aria-describedby. */
@Directive({
  selector: '[ngc-dialog-description]',
  hostDirectives: [NgpDialogDescription],
  host: { class: 'ngc-dialog-description' },
})
export class DialogDescription {}

/** Footer row holding the dialog actions. */
@Directive({
  selector: '[ngc-dialog-footer]',
  host: { class: 'ngc-dialog-footer' },
})
export class DialogFooter {}
