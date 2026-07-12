import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { LabelBasicExample } from './examples/label-basic.example';
import { snippet as basicSnippet } from './examples/label-basic.ts.snippet';

/** Docs page for ngc-label. */
@Component({
  selector: 'ngc-demo-label',
  imports: [DemoExample, DemoPage, DemoSection, LabelBasicExample],
  template: `
    <ngc-demo-page>
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="label-basic" [snippet]="basicSnippet">
          <ngc-demo-label-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Apply <code>ngc-label</code> to a native <code>&lt;label&gt;</code> and associate it via
          <code>for</code> (or by wrapping the control) – clicking the label focuses the control. A label
          wrapping a disabled control dims automatically.
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelDemo {
  protected readonly basicSnippet = basicSnippet;
}
