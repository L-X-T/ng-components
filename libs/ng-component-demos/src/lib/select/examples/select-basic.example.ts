import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgcSelect, NgcSelectOption } from '@agentic-software/ng-components/select';

@Component({
  selector: 'ngc-demo-select-basic-example',
  imports: [NgcSelect, NgcSelectOption],
  template: `
    <div style="width: 100%; max-width: 16rem">
      <button ngc-select aria-label="Fruit" placeholder="Pick a fruit">
        <ngc-select-option value="apple">Apple</ngc-select-option>
        <ngc-select-option value="banana">Banana</ngc-select-option>
        <ngc-select-option value="cherry">Cherry</ngc-select-option>
        <ngc-select-option value="grape">Grape</ngc-select-option>
        <ngc-select-option value="pineapple">Pineapple</ngc-select-option>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectBasicExample {}
