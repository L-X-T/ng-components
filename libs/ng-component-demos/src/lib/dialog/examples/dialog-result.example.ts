import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button } from '@angular-software/ng-components/button';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@angular-software/ng-components/dialog';

@Component({
  selector: 'ngc-demo-dialog-result-example',
  imports: [Button, Dialog, DialogDescription, DialogFooter, DialogOverlay, DialogTitle, DialogTrigger],
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
        <div ngc-dialog>
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
