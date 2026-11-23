import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgcInput } from '@agentic-software/ng-components/input';
import { NgcLabel } from '@agentic-software/ng-components/label';

@Component({
  selector: 'ngc-demo-label-basic-example',
  imports: [NgcInput, NgcLabel],
  template: `
    <div style="display: grid; gap: 0.5rem; width: 100%; max-width: 20rem">
      <label ngc-label for="label-demo-email">Email</label>
      <input ngc-input id="label-demo-email" type="email" placeholder="you@example.com" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelBasicExample {}
