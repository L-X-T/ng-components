import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgcButton } from '@agentic-software/ng-components/button';

@Component({
  selector: 'ngc-demo-button-sizes-example',
  imports: [NgcButton],
  template: `
    <button ngc-button size="sm" variant="outline">Small</button>
    <button ngc-button variant="outline">Default</button>
    <button ngc-button size="lg" variant="outline">Large</button>
    <button ngc-button size="icon" variant="outline" aria-label="Add">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonSizesExample {}
