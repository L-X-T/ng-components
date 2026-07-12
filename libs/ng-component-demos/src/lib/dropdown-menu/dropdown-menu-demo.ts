import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { DropdownMenuBasicExample } from './examples/dropdown-menu-basic.example';
import { snippet as basicSnippet } from './examples/dropdown-menu-basic.ts.snippet';

/** Docs page for ngc-dropdown-menu. */
@Component({
  selector: 'ngc-demo-dropdown-menu',
  imports: [DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection, DropdownMenuBasicExample],
  template: `
    <ngc-demo-page>
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="dropdown-menu-basic" [snippet]="basicSnippet">
          <ngc-demo-dropdown-menu-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Keyboard">
        <p>
          With the trigger focused, <kbd>Enter</kbd>, <kbd>Space</kbd>, or <kbd>ArrowDown</kbd> open the menu
          and focus the first item. <kbd>ArrowDown</kbd>/<kbd>ArrowUp</kbd> move focus and wrap at the ends,
          <kbd>Home</kbd>/<kbd>End</kbd> jump to the first/last item, typing performs typeahead,
          <kbd>Enter</kbd> or <kbd>Space</kbd> activates the focused item (closing the menu), and
          <kbd>Escape</kbd> or a click outside closes without activating. Disabled items are skipped.
        </p>
      </ngc-demo-section>

      <ngc-demo-section title="API">
        <ngc-demo-api>
          <ngc-demo-api-item
            name="ngc-menu-trigger"
            kind="input"
            type="TemplateRef"
            description="Menu template to open on click."
          />
          <ngc-demo-api-item
            name="disabled (trigger)"
            kind="input"
            type="boolean"
            default="false"
            description="Prevents the menu from opening."
          />
          <ngc-demo-api-item
            name="placement"
            kind="input"
            type="Placement"
            default="'bottom-start'"
            description="Preferred menu position; flips when space runs out."
          />
          <ngc-demo-api-item
            name="wrap (menu)"
            kind="input"
            type="boolean"
            default="true"
            description="Whether arrow-key focus wraps around the ends."
          />
          <ngc-demo-api-item
            name="disabled (item)"
            kind="input"
            type="boolean"
            default="false"
            description="Disables an item; it is skipped by keyboard navigation."
          />
          <ngc-demo-api-item
            name="closeOnSelect (item)"
            kind="input"
            type="boolean"
            default="true"
            description="Whether activating the item closes the menu."
          />
        </ngc-demo-api>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Put the menu anatomy (<code>ngc-menu</code> with <code>ngc-menu-item</code> buttons, optional
          <code>ngc-menu-label</code> and <code>ngc-menu-separator</code>) inside an
          <code>ng-template</code> and pass it to <code>[ngc-menu-trigger]</code>. Handle item activation with
          a plain <code>(click)</code> – the menu closes itself afterwards.
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuDemo {
  protected readonly basicSnippet = basicSnippet;
}
