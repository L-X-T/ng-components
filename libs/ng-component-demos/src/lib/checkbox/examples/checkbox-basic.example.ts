import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Checkbox } from '@angular-software/ng-components/checkbox';
import { Label } from '@angular-software/ng-components/label';

@Component({
  selector: 'ngc-demo-checkbox-basic-example',
  imports: [Checkbox, Label],
  template: `
    <div style="display: flex; align-items: center; gap: 0.5rem">
      <button ngc-checkbox id="checkbox-basic-terms"></button>
      <label ngc-label for="checkbox-basic-terms">Accept terms and conditions</label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxBasicExample {}
