import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgcButton } from '@angular-software/ng-components/button';
import {
  NgcDialog,
  NgcDialogDescription,
  NgcDialogFooter,
  NgcDialogOverlay,
  NgcDialogTitle,
  NgcDialogTrigger,
} from '@angular-software/ng-components/dialog';

@Component({
  selector: 'ngc-demo-dialog-result-example',
  imports: [
    NgcButton,
    NgcDialog,
    NgcDialogDescription,
    NgcDialogFooter,
    NgcDialogOverlay,
    NgcDialogTitle,
    NgcDialogTrigger,
  ],
  template: `
    <div style="display: grid; gap: 0.75rem; justify-items: start">
      <button ngc-button variant="outline" [ngc-dialog-trigger]="deleteDialog" (closed)="onClosed($event)">
        Delete account
      </button>
      <p style="margin: 0">
        Last result: <code>{{ lastResult() }}</code>
      </p>
    </div>

    <ng-template #deleteDialog let-close="close">
      <div ngc-dialog-overlay>
        <!-- A destructive confirmation interrupts the user: alertdialog (review 2026-10-04 D-15). -->
        <div ngc-dialog role="alertdialog">
          <h2 ngc-dialog-title>Delete your account?</h2>
          <p ngc-dialog-description>All data is removed permanently. Escape or a click outside cancels.</p>
          <div ngc-dialog-footer>
            <button ngc-button variant="outline" (click)="close('cancelled')">Keep account</button>
            <button ngc-button variant="destructive" (click)="close('deleted')">Delete</button>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogResultExample {
  protected readonly lastResult = signal('none');

  protected onClosed(result: unknown): void {
    this.lastResult.set(typeof result === 'string' ? result : 'dismissed');
  }
}
