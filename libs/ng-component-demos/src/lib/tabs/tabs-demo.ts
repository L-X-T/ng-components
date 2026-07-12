import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { TabsBasicExample } from './examples/tabs-basic.example';
import { snippet as basicSnippet } from './examples/tabs-basic.ts.snippet';

/** Docs page for ngc-tabs. */
@Component({
  selector: 'ngc-demo-tabs',
  imports: [DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection, TabsBasicExample],
  template: `
    <ngc-demo-page>
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="tabs-basic" [snippet]="basicSnippet">
          <ngc-demo-tabs-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Keyboard">
        <p>
          <kbd>Tab</kbd> moves focus into the tab list (to the selected tab) and out to the active panel;
          <kbd>ArrowRight</kbd>/<kbd>ArrowLeft</kbd> (or <kbd>ArrowDown</kbd>/<kbd>ArrowUp</kbd> when
          vertical) move focus between tabs (no wrapping), skipping disabled tabs, and activate the focused
          tab immediately (automatic activation, the default); <kbd>Home</kbd>/<kbd>End</kbd> jump to the
          first/last tab. Set <code>[activateOnFocus]="false"</code> for manual activation via
          <kbd>Enter</kbd> or <kbd>Space</kbd>.
        </p>
      </ngc-demo-section>

      <ngc-demo-section title="API">
        <ngc-demo-api>
          <ngc-demo-api-item
            name="value"
            kind="input"
            type="string"
            default="first tab"
            description="Selected tab value (controlled)."
          />
          <ngc-demo-api-item
            name="orientation"
            kind="input"
            type="'horizontal' | 'vertical'"
            default="'horizontal'"
            description="Arrow-key axis; the layout follows it too."
          />
          <ngc-demo-api-item
            name="activateOnFocus"
            kind="input"
            type="boolean"
            default="true"
            description="Activate tabs automatically while arrowing; set false for Enter/Space activation."
          />
          <ngc-demo-api-item
            name="valueChange"
            kind="output"
            type="string"
            description="Emits the newly selected tab value."
          />
          <ngc-demo-api-item
            name="value (tab, panel)"
            kind="input"
            type="string"
            description="Links an ngc-tab button to its ngc-tab-panel."
          />
          <ngc-demo-api-item
            name="disabled (tab)"
            kind="input"
            type="boolean"
            default="false"
            description="Disables a tab; keyboard navigation skips it."
          />
        </ngc-demo-api>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Put <code>ngc-tab</code> buttons inside a <code>div ngc-tabs-list</code> (give it an
          <code>aria-label</code>) and pair each with an <code>ngc-tab-panel</code> via matching
          <code>value</code>s – roles and aria wiring are automatic. Without a <code>value</code> on
          <code>ngc-tabs</code>, the first tab starts selected.
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsDemo {
  protected readonly basicSnippet = basicSnippet;
}
