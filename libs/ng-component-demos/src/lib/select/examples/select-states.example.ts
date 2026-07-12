import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgcSelect, NgcSelectOption } from '@angular-software/ng-components/select';

@Component({
  selector: 'ngc-demo-select-states-example',
  imports: [NgcSelect, NgcSelectOption],
  template: `
    <div style="display: grid; gap: 0.75rem; width: 100%; max-width: 16rem">
      <button ngc-select aria-label="Disabled select" placeholder="Disabled" [disabled]="true">
        <ngc-select-option value="a">Option A</ngc-select-option>
      </button>
      <button ngc-select aria-label="Shipping" placeholder="Shipping method">
        <ngc-select-option value="standard">Standard</ngc-select-option>
        <ngc-select-option value="express" [disabled]="true">Express (sold out)</ngc-select-option>
        <ngc-select-option value="pickup">Pickup</ngc-select-option>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectStatesExample {}
