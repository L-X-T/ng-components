import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgcLabel } from '@agentic-software/ng-components/label';
import { NgcRadioGroup, NgcRadioItem } from '@agentic-software/ng-components/radio-group';

@Component({
  selector: 'ngc-demo-radio-group-states-example',
  imports: [NgcLabel, NgcRadioGroup, NgcRadioItem],
  template: `
    <div style="display: grid; gap: 1.5rem">
      <ngc-radio-group aria-label="Shipping" orientation="vertical" defaultValue="standard">
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <button ngc-radio-item value="standard" id="radio-states-standard"></button>
          <label ngc-label for="radio-states-standard">Standard</label>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <button ngc-radio-item value="express" id="radio-states-express" [disabled]="true"></button>
          <label ngc-label for="radio-states-express">Express (sold out)</label>
        </div>
      </ngc-radio-group>

      <ngc-radio-group aria-label="Disabled group" orientation="vertical" defaultValue="a" [disabled]="true">
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <button ngc-radio-item value="a" id="radio-states-group-a"></button>
          <label ngc-label for="radio-states-group-a">Option A</label>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <button ngc-radio-item value="b" id="radio-states-group-b"></button>
          <label ngc-label for="radio-states-group-b">Option B</label>
        </div>
      </ngc-radio-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupStatesExample {}
