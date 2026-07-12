import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { AccordionBasicExample } from './examples/accordion-basic.example';
import { snippet as basicSnippet } from './examples/accordion-basic.ts.snippet';
import { AccordionMultipleExample } from './examples/accordion-multiple.example';
import { snippet as multipleSnippet } from './examples/accordion-multiple.ts.snippet';

/** Docs page for ngc-accordion. */
@Component({
  selector: 'ngc-demo-accordion',
  imports: [
    DemoApi,
    DemoApiItem,
    DemoExample,
    DemoPage,
    DemoSection,
    AccordionBasicExample,
    AccordionMultipleExample,
  ],
  template: `
    <ngc-demo-page>
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="accordion-basic" [snippet]="basicSnippet">
          <ngc-demo-accordion-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Multiple">
        <ngc-demo-example id="accordion-multiple" [snippet]="multipleSnippet">
          <ngc-demo-accordion-multiple-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Keyboard">
        <p>
          <kbd>Tab</kbd>/<kbd>Shift+Tab</kbd> move between the trigger buttons; <kbd>Enter</kbd> or
          <kbd>Space</kbd> toggles the focused section. In <code>single</code> mode opening a section closes
          the previous one; with <code>collapsible</code> the open section can be closed again. Disabled
          items cannot be toggled.
        </p>
      </ngc-demo-section>

      <ngc-demo-section title="API">
        <ngc-demo-api>
          <ngc-demo-api-item
            name="type"
            kind="input"
            type="'single' | 'multiple'"
            default="'single'"
            description="Whether one or several sections may be open."
          />
          <ngc-demo-api-item
            name="collapsible"
            kind="input"
            type="boolean"
            default="false"
            description="In single mode, allows closing the open section."
          />
          <ngc-demo-api-item
            name="value"
            kind="input"
            type="string | string[]"
            description="Controlled open section value(s)."
          />
          <ngc-demo-api-item
            name="disabled"
            kind="input"
            type="boolean"
            default="false"
            description="Disables the whole accordion (also available per item)."
          />
          <ngc-demo-api-item
            name="valueChange"
            kind="output"
            type="string | string[]"
            description="Emits the open section value(s) after user interaction."
          />
          <ngc-demo-api-item
            name="value (item)"
            kind="input"
            type="string"
            description="Required identifier of an ngc-accordion-item."
          />
        </ngc-demo-api>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Each <code>ngc-accordion-item</code> pairs a <code>button ngc-accordion-trigger</code> (wrap it in
          a heading of the right level) with an <code>ngc-accordion-content</code> region –
          <code>aria-expanded</code>, <code>aria-controls</code>, and <code>aria-labelledby</code> are wired
          automatically, and closed content is <code>hidden</code> from the accessibility tree.
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionDemo {
  protected readonly basicSnippet = basicSnippet;
  protected readonly multipleSnippet = multipleSnippet;
}
