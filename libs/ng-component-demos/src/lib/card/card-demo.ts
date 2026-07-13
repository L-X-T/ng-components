import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { CardBasicExample } from './examples/card-basic.example';
import { snippet as basicSnippet } from './examples/card-basic.ts.snippet';

/** Docs page for ngc-card. */
@Component({
  selector: 'ngc-demo-card',
  imports: [CardBasicExample, DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection],
  template: `
    <ngc-demo-page>
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="card-basic" [snippet]="basicSnippet">
          <ngc-demo-card-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Anatomy">
        <ngc-demo-api>
          <ngc-demo-api-item name="ngc-card" type="element" description="The card container." />
          <ngc-demo-api-item
            name="ngc-card-header"
            type="attribute"
            description="Header row; contains title and description."
          />
          <ngc-demo-api-item
            name="ngc-card-title"
            type="attribute"
            description="Card title – apply to a heading of the right level."
          />
          <ngc-demo-api-item
            name="ngc-card-description"
            type="attribute"
            description="Muted description line under the title."
          />
          <ngc-demo-api-item name="ngc-card-content" type="attribute" description="Main content area." />
          <ngc-demo-api-item
            name="ngc-card-footer"
            type="attribute"
            description="Footer row, usually holding actions."
          />
        </ngc-demo-api>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Compose cards from the sub-part attributes on your own semantic markup – the heading level, for instance,
          stays yours. All parts are optional; a bare <code>ngc-card</code> with content works.
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDemo {
  protected readonly basicSnippet = basicSnippet;
}
