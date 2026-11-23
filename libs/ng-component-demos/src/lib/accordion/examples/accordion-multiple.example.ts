import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NgcAccordion,
  NgcAccordionContent,
  NgcAccordionItem,
  NgcAccordionTrigger,
} from '@agentic-software/ng-components/accordion';

@Component({
  selector: 'ngc-demo-accordion-multiple-example',
  imports: [NgcAccordion, NgcAccordionContent, NgcAccordionItem, NgcAccordionTrigger],
  template: `
    <ngc-accordion type="multiple" style="max-width: 24rem">
      <div ngc-accordion-item value="shipping">
        <h3>
          <button ngc-accordion-trigger>Shipping details</button>
        </h3>
        <div ngc-accordion-content>
          <p style="margin: 0 0 1rem">We ship within 2-3 business days.</p>
        </div>
      </div>
      <div ngc-accordion-item value="returns">
        <h3>
          <button ngc-accordion-trigger>Return policy</button>
        </h3>
        <div ngc-accordion-content>
          <p style="margin: 0 0 1rem">Returns are accepted within 30 days.</p>
        </div>
      </div>
      <div ngc-accordion-item value="support" [disabled]="true">
        <h3>
          <button ngc-accordion-trigger>Priority support (soon)</button>
        </h3>
        <div ngc-accordion-content>
          <p style="margin: 0 0 1rem">Priority support is coming soon.</p>
        </div>
      </div>
    </ngc-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionMultipleExample {}
