import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { RadioGroupBasicExample } from './examples/radio-group-basic.example';
import { snippet as basicSnippet } from './examples/radio-group-basic.ts.snippet';
import { RadioGroupFormExample } from './examples/radio-group-form.example';
import { snippet as formSnippet } from './examples/radio-group-form.ts.snippet';
import { RadioGroupStatesExample } from './examples/radio-group-states.example';
import { snippet as statesSnippet } from './examples/radio-group-states.ts.snippet';

/** Docs page for ngc-radio-group. */
@Component({
  selector: 'ngc-demo-radio-group',
  imports: [
    DemoApi,
    DemoApiItem,
    DemoExample,
    DemoPage,
    DemoSection,
    RadioGroupBasicExample,
    RadioGroupFormExample,
    RadioGroupStatesExample,
  ],
  template: `
    <ngc-demo-page>
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="radio-group-basic" [snippet]="basicSnippet">
          <ngc-demo-radio-group-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="States">
        <ngc-demo-example id="radio-group-states" [snippet]="statesSnippet">
          <ngc-demo-radio-group-states-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Reactive forms">
        <ngc-demo-example id="radio-group-form" [snippet]="formSnippet">
          <ngc-demo-radio-group-form-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Keyboard">
        <p>
          <kbd>Tab</kbd> moves focus into the group; <kbd>ArrowDown</kbd>/<kbd>ArrowUp</kbd> (vertical) or
          <kbd>ArrowRight</kbd>/<kbd>ArrowLeft</kbd>
          (horizontal) move focus and select the next/previous item, wrapping at the ends;
          <kbd>Space</kbd> selects the focused item. Disabled items are skipped.
        </p>
      </ngc-demo-section>

      <ngc-demo-section title="API">
        <ngc-demo-api>
          <ngc-demo-api-item
            name="value"
            kind="input"
            type="T"
            default="undefined"
            description="Controlled selected value of the group."
          />
          <ngc-demo-api-item
            name="defaultValue"
            kind="input"
            type="T"
            default="null"
            description="Initial value for uncontrolled usage."
          />
          <ngc-demo-api-item
            name="orientation"
            kind="input"
            type="'horizontal' | 'vertical'"
            default="'horizontal'"
            description="Arrow-key axis; the layout follows it too."
          />
          <ngc-demo-api-item
            name="disabled"
            kind="input"
            type="boolean"
            default="false"
            description="Disables the whole group."
          />
          <ngc-demo-api-item
            name="compareWith"
            kind="input"
            type="(a: T, b: T) => boolean"
            default="==="
            description="Comparator for object values."
          />
          <ngc-demo-api-item
            name="valueChange"
            kind="output"
            type="T | null"
            description="Emits the selected value after user interaction."
          />
          <ngc-demo-api-item
            name="value (item)"
            kind="input"
            type="T"
            description="Required value of an ngc-radio-item."
          />
          <ngc-demo-api-item
            name="disabled (item)"
            kind="input"
            type="boolean"
            default="false"
            description="Disables a single item; it is skipped by keyboard navigation."
          />
        </ngc-demo-api>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Put <code>ngc-radio-item</code> buttons inside an <code>&lt;ngc-radio-group&gt;</code> and pair each with
          <code>ngc-label</code> via <code>for</code>/<code>id</code>. The group implements
          <code>ControlValueAccessor</code>, so <code>[formControl]</code> / <code>formControlName</code> bind directly;
          give the group an <code>aria-label</code> or <code>aria-labelledby</code>.
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupDemo {
  protected readonly basicSnippet = basicSnippet;
  protected readonly statesSnippet = statesSnippet;
  protected readonly formSnippet = formSnippet;
}
