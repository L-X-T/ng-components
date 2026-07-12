import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { BadgeVariantsExample } from './examples/badge-variants.example';
import { snippet as variantsSnippet } from './examples/badge-variants.ts.snippet';

/** Docs page for ngc-badge. */
@Component({
  selector: 'ngc-demo-badge',
  imports: [BadgeVariantsExample, DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection],
  template: `
    <ngc-demo-page>
      <ngc-demo-section title="Variants">
        <ngc-demo-example id="badge-variants" [snippet]="variantsSnippet">
          <ngc-demo-badge-variants-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="API">
        <ngc-demo-api>
          <ngc-demo-api-item
            name="variant"
            kind="input"
            type="'default' | 'secondary' | 'destructive' | 'outline'"
            default="'default'"
            description="Visual style of the badge."
          />
        </ngc-demo-api>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Apply <code>ngc-badge</code> to a <code>&lt;span&gt;</code> – or to an <code>&lt;a&gt;</code> for a
          linked badge. Badges label status or counts; they are not interactive controls, so prefer
          <code>ngc-button</code> when a click has an effect.
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeDemo {
  protected readonly variantsSnippet = variantsSnippet;
}
