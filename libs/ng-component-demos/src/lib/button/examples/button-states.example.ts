import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgcButton } from '@agentic-software/ng-components/button';

@Component({
  selector: 'ngc-demo-button-states-example',
  imports: [NgcButton],
  template: `
    <button ngc-button variant="outline" (click)="clicks.set(clicks() + 1)">Clicked {{ clicks() }} times</button>
    <button ngc-button [disabled]="true">Disabled</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonStatesExample {
  protected readonly clicks = signal(0);
}
