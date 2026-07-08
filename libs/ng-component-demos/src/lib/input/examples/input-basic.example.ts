import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Input } from '@angular-software/ng-components/input';
import { Label } from '@angular-software/ng-components/label';

@Component({
  selector: 'ngc-demo-input-basic-example',
  imports: [Input, Label],
  template: `
    <div style="display: grid; gap: 0.5rem; width: 100%; max-width: 20rem">
      <label ngc-label for="input-demo-name">Name</label>
      <input ngc-input id="input-demo-name" placeholder="Ada Lovelace" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputBasicExample {}
