import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgcButton } from '@angular-software/ng-components/button';
import { NgcToast } from '@angular-software/ng-components/toast';

@Component({
  selector: 'ngc-demo-toast-basic-example',
  imports: [NgcButton],
  template: ` <button ngc-button variant="outline" (click)="onShow()">Publish article</button> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastBasicExample {
  private readonly toast = inject(NgcToast);

  protected onShow(): void {
    this.toast.show('Article published', { description: 'Readers were notified.' });
  }
}
