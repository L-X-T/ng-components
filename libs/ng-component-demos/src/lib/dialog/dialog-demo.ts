import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { DialogBasicExample } from './examples/dialog-basic.example';
import { snippet as basicSnippet } from './examples/dialog-basic.ts.snippet';
import { DialogResultExample } from './examples/dialog-result.example';
import { snippet as resultSnippet } from './examples/dialog-result.ts.snippet';

/** Docs page for ngc-dialog. */
@Component({
  selector: 'ngc-demo-dialog',
  imports: [DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection, DialogBasicExample, DialogResultExample],
  template: `
    <ngc-demo-page title="Dialog" summary="Modal window over the page content.">
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="dialog-basic" [snippet]="basicSnippet">
          <ngc-demo-dialog-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Close result">
        <ngc-demo-example id="dialog-result" [snippet]="resultSnippet">
          <ngc-demo-dialog-result-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Keyboard">
        <p>
          Opening the dialog moves focus into it and traps it: <kbd>Tab</kbd>/<kbd>Shift+Tab</kbd> cycle
          through the dialog's focusable elements only. <kbd>Escape</kbd> closes the dialog, as does a click
          on the overlay backdrop. On close, focus returns to the trigger.
        </p>
      </ngc-demo-section>

      <ngc-demo-section title="API">
        <ngc-demo-api>
          <ngc-demo-api-item
            name="ngc-dialog-trigger"
            kind="input"
            type="TemplateRef"
            description="Template to open on click; its context provides close(result?)."
          />
          <ngc-demo-api-item
            name="closeOnEscape"
            kind="input"
            type="boolean | guard"
            default="true"
            description="Whether Escape closes the dialog; a guard function may veto."
          />
          <ngc-demo-api-item
            name="closeOnOutsideClick"
            kind="input"
            type="boolean | guard"
            default="true"
            description="Whether an overlay click closes the dialog."
          />
          <ngc-demo-api-item
            name="closed"
            kind="output"
            type="unknown"
            description="Emits the close(result) value when the dialog closes."
          />
          <ngc-demo-api-item
            name="modal"
            kind="input"
            type="boolean"
            default="true"
            description="Sets aria-modal on the ngc-dialog panel."
          />
        </ngc-demo-api>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Put the dialog anatomy (<code>ngc-dialog-overlay</code> &gt; <code>ngc-dialog</code> with
          <code>ngc-dialog-title</code>, <code>ngc-dialog-description</code>, <code>ngc-dialog-footer</code>)
          inside an <code>ng-template</code> and pass it to <code>[ngc-dialog-trigger]</code>. The title and
          description wire <code>aria-labelledby</code>/<code>aria-describedby</code> automatically; the
          template's <code>close</code> context function accepts an optional result.
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogDemo {
  protected readonly basicSnippet = basicSnippet;
  protected readonly resultSnippet = resultSnippet;
}
