import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgcButton } from '@agentic-software/ng-components/button';
import {
  NgcCard,
  NgcCardContent,
  NgcCardDescription,
  NgcCardFooter,
  NgcCardHeader,
  NgcCardTitle,
} from '@agentic-software/ng-components/card';

@Component({
  selector: 'ngc-demo-card-basic-example',
  imports: [NgcButton, NgcCard, NgcCardContent, NgcCardDescription, NgcCardFooter, NgcCardHeader, NgcCardTitle],
  template: `
    <ngc-card style="width: min(20rem, 100%)">
      <div ngc-card-header>
        <h3 ngc-card-title>Create project</h3>
        <p ngc-card-description>Deploy your new project in one click.</p>
      </div>
      <div ngc-card-content>
        <p style="margin: 0">Your project will use the latest Angular and our component library.</p>
      </div>
      <div ngc-card-footer>
        <button ngc-button>Deploy</button>
        <button ngc-button variant="outline">Cancel</button>
      </div>
    </ngc-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardBasicExample {}
