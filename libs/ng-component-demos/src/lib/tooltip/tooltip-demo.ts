import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { TooltipBasicExample } from './examples/tooltip-basic.example';
import { snippet as basicSnippet } from './examples/tooltip-basic.ts.snippet';

/** Docs page for ngc-tooltip. */
@Component({
  selector: 'ngc-demo-tooltip',
  imports: [DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection, TooltipBasicExample],
  template: `
    <ngc-demo-page>
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="tooltip-basic" [snippet]="basicSnippet">
          <ngc-demo-tooltip-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Keyboard">
        <p>
          The tooltip shows when the trigger receives keyboard focus (<kbd>Tab</kbd>) and hides on blur or
          <kbd>Escape</kbd> – identical to the hover behavior, so keyboard users get the same context. While the tooltip
          is open it is linked to the trigger via <code>aria-describedby</code>.
        </p>
      </ngc-demo-section>

      <ngc-demo-section title="API">
        <ngc-demo-api>
          <ngc-demo-api-item
            name="ngc-tooltip-trigger"
            kind="input"
            type="TemplateRef"
            description="Tooltip template to show on hover or focus."
          />
          <ngc-demo-api-item
            name="disabled"
            kind="input"
            type="boolean"
            default="false"
            description="Prevents the tooltip from showing."
          />
          <ngc-demo-api-item
            name="placement"
            kind="input"
            type="Placement"
            default="'top'"
            description="Preferred position; flips when space runs out."
          />
          <ngc-demo-api-item
            name="showDelay"
            kind="input"
            type="number"
            default="0"
            description="Milliseconds before the tooltip shows."
          />
          <ngc-demo-api-item
            name="hideDelay"
            kind="input"
            type="number"
            default="500"
            description="Milliseconds before the tooltip hides."
          />
          <ngc-demo-api-item
            name="hoverableContent"
            kind="input"
            type="boolean"
            default="true"
            description="Keeps the tooltip open while the pointer moves onto it (WCAG 1.4.13)."
          />
        </ngc-demo-api>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Pass an <code>ng-template</code> containing a <code>div ngc-tooltip</code> to
          <code>[ngc-tooltip-trigger]</code>. Keep tooltip content short and non-interactive – it supplements the
          trigger's label, it does not replace it.
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDemo {
  protected readonly basicSnippet = basicSnippet;
}
