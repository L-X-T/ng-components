import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { TextareaBasicExample } from './examples/textarea-basic.example';
import { snippet as basicSnippet } from './examples/textarea-basic.ts.snippet';

/** Docs page for ngc-textarea. */
@Component({
  selector: 'ngc-demo-textarea',
  imports: [DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection, TextareaBasicExample],
  template: `
    <ngc-demo-page>
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="textarea-basic" [snippet]="basicSnippet">
          <ngc-demo-textarea-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="API">
        <ngc-demo-api>
          <ngc-demo-api-item
            name="disabled"
            kind="input"
            type="boolean"
            default="false"
            description="Disables the textarea."
          />
          <ngc-demo-api-item
            name="id"
            kind="input"
            type="string"
            default="generated"
            description="Id of the textarea; generated when omitted."
          />
        </ngc-demo-api>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Apply <code>ngc-textarea</code> to a native <code>&lt;textarea&gt;</code>; control the initial
          height with <code>rows</code>. Validation styling via <code>aria-invalid</code>, same as
          <code>ngc-input</code>.
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaDemo {
  protected readonly basicSnippet = basicSnippet;
}
