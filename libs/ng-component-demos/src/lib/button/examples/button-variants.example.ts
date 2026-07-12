import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgcButton } from '@angular-software/ng-components/button';

@Component({
  selector: 'ngc-demo-button-variants-example',
  imports: [NgcButton],
  template: `
    <button ngc-button>Default</button>
    <button ngc-button variant="secondary">Secondary</button>
    <button ngc-button variant="destructive">Destructive</button>
    <button ngc-button variant="outline">Outline</button>
    <button ngc-button variant="ghost">Ghost</button>
    <button ngc-button variant="link">Link</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonVariantsExample {}
