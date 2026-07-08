import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  selector: 'ngc-demo-dialog-basic-example',
  imports: [Button, Dialog, DialogDescription, DialogFooter, DialogOverlay, DialogTitle, DialogTrigger],
  template: `
    <button ngc-button variant="outline" [ngc-dialog-trigger]="publishDialog">Publish article</button>

    <ng-template #publishDialog let-close="close">
      <div ngc-dialog-overlay>
        <div ngc-dialog>
          <h2 ngc-dialog-title>Publish this article?</h2>
          <p ngc-dialog-description>
            The article goes live immediately and readers will be notified. This action is irreversible.
          </p>
          <div ngc-dialog-footer>
            <button ngc-button variant="outline" (click)="close()">Cancel</button>
            <button ngc-button (click)="close()">Publish</button>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogBasicExample {}
