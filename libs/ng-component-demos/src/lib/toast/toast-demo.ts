import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { ToastBasicExample } from './examples/toast-basic.example';
import { snippet as basicSnippet } from './examples/toast-basic.ts.snippet';
import { ToastOptionsExample } from './examples/toast-options.example';
import { snippet as optionsSnippet } from './examples/toast-options.ts.snippet';

/** Docs page for ngc-toast. */
@Component({
  selector: 'ngc-demo-toast',
  imports: [DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection, ToastBasicExample, ToastOptionsExample],
  template: `
    <ngc-demo-page>
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="toast-basic" [snippet]="basicSnippet">
          <ngc-demo-toast-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Options">
        <ngc-demo-example id="toast-options" [snippet]="optionsSnippet">
          <ngc-demo-toast-options-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Service API">
        <p>
          Toast is the one component whose primary API is a service – there is no template anatomy to compose. Inject
          <code>NgcToast</code> and call <code>show(message, options)</code>; it returns a handle with
          <code>dismiss()</code>. Up to three toasts stack per placement (newest in front, hover or keyboard focus
          expands the stack and pauses auto-dismiss); the stack's container is a single polite live region, so every
          toast is announced once, carries an explicit dismiss button, and can be swiped away.
        </p>
      </ngc-demo-section>

      <ngc-demo-section title="API">
        <ngc-demo-api>
          <ngc-demo-api-item
            name="show(message, options?)"
            kind="method"
            type="(string, NgcToastOptions) => NgcToastRef"
            description="Shows a toast; the returned handle dismisses it programmatically."
          />
          <ngc-demo-api-item
            name="description"
            kind="option"
            type="string"
            description="Muted second line under the message."
          />
          <ngc-demo-api-item
            name="duration"
            kind="option"
            type="number"
            default="3000"
            description="Milliseconds before auto-dismiss."
          />
          <ngc-demo-api-item
            name="placement"
            kind="option"
            type="NgcToastPlacement"
            default="'top-end'"
            description="Corner or edge where the toast stack appears."
          />
          <ngc-demo-api-item
            name="persistent"
            kind="option"
            type="boolean"
            default="false"
            description="Never auto-dismiss; requires explicit dismissal."
          />
          <ngc-demo-api-item
            name="dismissLabel"
            kind="option"
            type="string"
            default="'Dismiss notification'"
            description="Accessible label of the dismiss button; provideNgcToastDismissLabel sets the app-wide default."
          />
        </ngc-demo-api>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastDemo {
  protected readonly basicSnippet = basicSnippet;
  protected readonly optionsSnippet = optionsSnippet;
}
