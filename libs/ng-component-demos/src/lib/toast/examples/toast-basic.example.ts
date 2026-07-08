import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from '@angular-software/ng-components/button';
import { Toast } from '@angular-software/ng-components/toast';

@Component({
  selector: 'ngc-demo-toast-basic-example',
  imports: [Button],
  template: `
    <button ngc-button variant="outline" (click)="onShow()">Publish article</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastBasicExample {
  private readonly toast = inject(Toast);

  protected onShow(): void {
    this.toast.show('Article published', { description: 'Readers were notified.' });
  }
}
