import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NgcAccordion,
  NgcAccordionContent,
  NgcAccordionItem,
  NgcAccordionTrigger,
} from '@angular-software/ng-components/accordion';

@Component({
  selector: 'ngc-demo-accordion-basic-example',
  imports: [NgcAccordion, NgcAccordionContent, NgcAccordionItem, NgcAccordionTrigger],
  template: `
    <ngc-accordion type="single" [collapsible]="true" style="max-width: 24rem">
      <div ngc-accordion-item value="accessible">
        <h3>
          <button ngc-accordion-trigger>Is it accessible?</button>
        </h3>
        <div ngc-accordion-content>
          <p style="margin: 0 0 1rem">Yes. It follows the WAI-ARIA accordion pattern.</p>
        </div>
      </div>
      <div ngc-accordion-item value="styled">
        <h3>
          <button ngc-accordion-trigger>Is it styled?</button>
        </h3>
        <div ngc-accordion-content>
          <p style="margin: 0 0 1rem">Yes. It ships with default styles on the core tokens.</p>
        </div>
      </div>
      <div ngc-accordion-item value="animated">
        <h3>
          <button ngc-accordion-trigger>Is it animated?</button>
        </h3>
        <div ngc-accordion-content>
          <p style="margin: 0 0 1rem">Yes. Sections slide open and closed by their measured height.</p>
        </div>
      </div>
    </ngc-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionBasicExample {}
