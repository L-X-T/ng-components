import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { InputBasicExample } from './examples/input-basic.example';
import { snippet as basicSnippet } from './examples/input-basic.ts.snippet';
import { InputStatesExample } from './examples/input-states.example';
import { snippet as statesSnippet } from './examples/input-states.ts.snippet';

/** Docs page for ngc-input. */
@Component({
  selector: 'ngc-demo-input',
  imports: [DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection, InputBasicExample, InputStatesExample],
  template: `
    <ngc-demo-page>
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="input-basic" [snippet]="basicSnippet">
          <ngc-demo-input-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="States">
        <ngc-demo-example id="input-states" [snippet]="statesSnippet">
          <ngc-demo-input-states-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="API">
        <ngc-demo-api>
          <ngc-demo-api-item
            name="disabled"
            kind="input"
            type="boolean"
            default="false"
            description="Disables the input."
          />
          <ngc-demo-api-item
            name="id"
            kind="input"
            type="string"
            default="generated"
            description="Id of the input; generated when omitted."
          />
        </ngc-demo-api>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Apply <code>ngc-input</code> to a native <code>&lt;input&gt;</code> – any <code>type</code> works. Set
          <code>aria-invalid</code> for validation styling (reactive forms integration arrives with
          <code>ngc-form-field</code> in wave 2).
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDemo {
  protected readonly basicSnippet = basicSnippet;
  protected readonly statesSnippet = statesSnippet;
}
