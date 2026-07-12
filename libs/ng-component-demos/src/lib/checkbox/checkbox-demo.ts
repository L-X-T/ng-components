import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { CheckboxBasicExample } from './examples/checkbox-basic.example';
import { snippet as basicSnippet } from './examples/checkbox-basic.ts.snippet';
import { CheckboxFormExample } from './examples/checkbox-form.example';
import { snippet as formSnippet } from './examples/checkbox-form.ts.snippet';
import { CheckboxStatesExample } from './examples/checkbox-states.example';
import { snippet as statesSnippet } from './examples/checkbox-states.ts.snippet';

/** Docs page for ngc-checkbox. */
@Component({
  selector: 'ngc-demo-checkbox',
  imports: [
    DemoApi,
    DemoApiItem,
    DemoExample,
    DemoPage,
    DemoSection,
    CheckboxBasicExample,
    CheckboxFormExample,
    CheckboxStatesExample,
  ],
  template: `
    <ngc-demo-page>
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="checkbox-basic" [snippet]="basicSnippet">
          <ngc-demo-checkbox-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="States">
        <ngc-demo-example id="checkbox-states" [snippet]="statesSnippet">
          <ngc-demo-checkbox-states-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Reactive forms">
        <ngc-demo-example id="checkbox-form" [snippet]="formSnippet">
          <ngc-demo-checkbox-form-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="API">
        <ngc-demo-api>
          <ngc-demo-api-item
            name="checked"
            kind="input"
            type="boolean"
            default="undefined"
            description="Controlled checked state."
          />
          <ngc-demo-api-item
            name="defaultChecked"
            kind="input"
            type="boolean"
            default="false"
            description="Initial checked state for uncontrolled usage."
          />
          <ngc-demo-api-item
            name="indeterminate"
            kind="input"
            type="boolean"
            default="false"
            description="Renders the mixed state; the next toggle checks the box."
          />
          <ngc-demo-api-item
            name="disabled"
            kind="input"
            type="boolean"
            default="false"
            description="Disables the checkbox."
          />
          <ngc-demo-api-item
            name="required"
            kind="input"
            type="boolean"
            default="false"
            description="Marks the checkbox as required."
          />
          <ngc-demo-api-item
            name="id"
            kind="input"
            type="string"
            default="generated"
            description="Id of the checkbox; generated when omitted."
          />
          <ngc-demo-api-item
            name="checkedChange"
            kind="output"
            type="boolean"
            description="Emits the new checked state after user interaction."
          />
          <ngc-demo-api-item
            name="indeterminateChange"
            kind="output"
            type="boolean"
            description="Emits when the indeterminate state is cleared."
          />
        </ngc-demo-api>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Apply <code>ngc-checkbox</code> to a native <code>&lt;button&gt;</code> and pair it with
          <code>ngc-label</code> via <code>for</code>/<code>id</code> – label clicks toggle the checkbox natively.
          It implements <code>ControlValueAccessor</code>, so <code>[formControl]</code> /
          <code>formControlName</code> bind a <code>FormControl&lt;boolean&gt;</code> directly; Space toggles,
          Enter is ignored per the WAI-ARIA checkbox pattern.
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxDemo {
  protected readonly basicSnippet = basicSnippet;
  protected readonly statesSnippet = statesSnippet;
  protected readonly formSnippet = formSnippet;
}
