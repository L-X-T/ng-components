import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Label } from '@angular-software/ng-components/label';
import { RadioGroup, RadioItem } from '@angular-software/ng-components/radio-group';

@Component({
  selector: 'ngc-demo-radio-group-basic-example',
  imports: [Label, RadioGroup, RadioItem],
  template: `
    <ngc-radio-group aria-label="Density" orientation="vertical" defaultValue="comfortable">
      <div style="display: flex; align-items: center; gap: 0.5rem">
        <button ngc-radio-item value="default" id="radio-basic-default"></button>
        <label ngc-label for="radio-basic-default">Default</label>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem">
        <button ngc-radio-item value="comfortable" id="radio-basic-comfortable"></button>
        <label ngc-label for="radio-basic-comfortable">Comfortable</label>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem">
        <button ngc-radio-item value="compact" id="radio-basic-compact"></button>
        <label ngc-label for="radio-basic-compact">Compact</label>
      </div>
    </ngc-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupBasicExample {}
