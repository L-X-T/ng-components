import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgcCheckbox } from '@angular-software/ng-components/checkbox';
import { NgcLabel } from '@angular-software/ng-components/label';

@Component({
  selector: 'ngc-demo-checkbox-states-example',
  imports: [NgcCheckbox, NgcLabel],
  template: `
    <div style="display: grid; gap: 0.75rem">
      <div style="display: flex; align-items: center; gap: 0.5rem">
        <button ngc-checkbox id="checkbox-states-checked" [defaultChecked]="true"></button>
        <label ngc-label for="checkbox-states-checked">Checked by default</label>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem">
        <button ngc-checkbox id="checkbox-states-indeterminate" [indeterminate]="true"></button>
        <label ngc-label for="checkbox-states-indeterminate">Indeterminate</label>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem">
        <button ngc-checkbox id="checkbox-states-disabled" [disabled]="true"></button>
        <label ngc-label for="checkbox-states-disabled">Disabled</label>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem">
        <button ngc-checkbox id="checkbox-states-disabled-checked" [defaultChecked]="true" [disabled]="true"></button>
        <label ngc-label for="checkbox-states-disabled-checked">Disabled and checked</label>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxStatesExample {}
