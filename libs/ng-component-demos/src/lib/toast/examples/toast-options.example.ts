import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgcButton } from '@angular-software/ng-components/button';
import { NgcToast, NgcToastRef } from '@angular-software/ng-components/toast';

@Component({
  selector: 'ngc-demo-toast-options-example',
  imports: [NgcButton],
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
      <button ngc-button variant="outline" (click)="onShowPersistent()">Persistent toast</button>
      <button ngc-button variant="outline" (click)="onShowBottom()">Bottom-center toast</button>
      <button ngc-button variant="outline" (click)="onDismissLast()">Dismiss last</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastOptionsExample {
  private readonly toast = inject(NgcToast);
  private lastToast?: NgcToastRef;

  protected onShowPersistent(): void {
    this.lastToast = this.toast.show('Update available', {
      description: 'Stays until dismissed.',
      persistent: true,
    });
  }

  protected onShowBottom(): void {
    this.lastToast = this.toast.show('Saved', { placement: 'bottom-center' });
  }

  protected onDismissLast(): void {
    void this.lastToast?.dismiss();
  }
}
