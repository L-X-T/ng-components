import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { SelectBasicExample } from './examples/select-basic.example';
import { snippet as basicSnippet } from './examples/select-basic.ts.snippet';
import { SelectFormExample } from './examples/select-form.example';
import { snippet as formSnippet } from './examples/select-form.ts.snippet';
import { SelectStatesExample } from './examples/select-states.example';
import { snippet as statesSnippet } from './examples/select-states.ts.snippet';

/** Docs page for ngc-select. */
@Component({
  selector: 'ngc-demo-select',
  imports: [
    DemoApi,
    DemoApiItem,
    DemoExample,
    DemoPage,
    DemoSection,
    SelectBasicExample,
    SelectFormExample,
    SelectStatesExample,
  ],
  template: `
    <ngc-demo-page title="Select" summary="Dropdown for picking one option from a list.">
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="select-basic" [snippet]="basicSnippet">
          <ngc-demo-select-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="States">
        <ngc-demo-example id="select-states" [snippet]="statesSnippet">
          <ngc-demo-select-states-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Reactive forms">
        <ngc-demo-example id="select-form" [snippet]="formSnippet">
          <ngc-demo-select-form-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Keyboard">
        <p>
          With the trigger focused, <kbd>Enter</kbd>, <kbd>Space</kbd>, <kbd>ArrowDown</kbd>, or
          <kbd>ArrowUp</kbd> open the dropdown; <kbd>ArrowDown</kbd>/<kbd>ArrowUp</kbd> move the active
          option, <kbd>Home</kbd>/<kbd>End</kbd> jump to the first/last option, <kbd>Enter</kbd> selects
          the active option, and <kbd>Escape</kbd> or clicking outside closes the dropdown. Focus stays on
          the trigger the whole time (active-descendant pattern).
        </p>
      </ngc-demo-section>

      <ngc-demo-section title="API">
        <ngc-demo-api>
          <ngc-demo-api-item
            name="placeholder"
            kind="input"
            type="string"
            default="''"
            description="Text shown in the trigger while no option is selected."
          />
          <ngc-demo-api-item
            name="value"
            kind="input"
            type="T"
            default="undefined"
            description="Controlled selected value."
          />
          <ngc-demo-api-item
            name="disabled"
            kind="input"
            type="boolean"
            default="false"
            description="Disables the select."
          />
          <ngc-demo-api-item
            name="compareWith"
            kind="input"
            type="(a: T, b: T) => boolean"
            default="==="
            description="Comparator for object values."
          />
          <ngc-demo-api-item
            name="placement"
            kind="input"
            type="Placement"
            default="'bottom'"
            description="Preferred dropdown position; flips when space runs out."
          />
          <ngc-demo-api-item
            name="valueChange"
            kind="output"
            type="T"
            description="Emits the selected value after user interaction."
          />
          <ngc-demo-api-item
            name="openChange"
            kind="output"
            type="boolean"
            description="Emits when the dropdown opens or closes."
          />
          <ngc-demo-api-item
            name="value (option)"
            kind="input"
            type="T"
            description="Required value of an ngc-select-option."
          />
          <ngc-demo-api-item
            name="disabled (option)"
            kind="input"
            type="boolean"
            default="false"
            description="Disables a single option."
          />
        </ngc-demo-api>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Apply <code>ngc-select</code> to a native <code>&lt;button&gt;</code> and project
          <code>ngc-select-option</code> elements; the trigger shows the selected option's text. The
          dropdown renders into <code>body</code>, matches the trigger width, and layers on the core
          <code>--z-overlay</code> token. The trigger implements <code>ControlValueAccessor</code>, so
          <code>[formControl]</code> / <code>formControlName</code> bind directly.
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDemo {
  protected readonly basicSnippet = basicSnippet;
  protected readonly statesSnippet = statesSnippet;
  protected readonly formSnippet = formSnippet;
}
