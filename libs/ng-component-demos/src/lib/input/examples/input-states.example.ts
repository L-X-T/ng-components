import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgcInput } from '@angular-software/ng-components/input';

@Component({
  selector: 'ngc-demo-input-states-example',
  imports: [NgcInput],
  template: `
    <div style="display: grid; gap: 0.75rem; width: 100%; max-width: 20rem">
      <input ngc-input placeholder="Disabled" [disabled]="true" />
      <input ngc-input placeholder="Invalid" aria-invalid="true" aria-label="Invalid example" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputStatesExample {}
