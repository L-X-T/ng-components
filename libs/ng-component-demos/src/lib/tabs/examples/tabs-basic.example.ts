import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tab, TabPanel, Tabs, TabsList } from '@angular-software/ng-components/tabs';

@Component({
  selector: 'ngc-demo-tabs-basic-example',
  imports: [Tab, TabPanel, Tabs, TabsList],
  template: `
    <ngc-tabs value="account" style="width: 100%; max-width: 24rem">
      <div ngc-tabs-list aria-label="Account settings">
        <button ngc-tab value="account">Account</button>
        <button ngc-tab value="password">Password</button>
        <button ngc-tab value="team" [disabled]="true">Team (soon)</button>
      </div>
      <div ngc-tab-panel value="account">
        <p style="margin: 0">Change your account details here. Click save when you're done.</p>
      </div>
      <div ngc-tab-panel value="password">
        <p style="margin: 0">Change your password here. You'll be logged out afterwards.</p>
      </div>
      <div ngc-tab-panel value="team">
        <p style="margin: 0">Team management is coming soon.</p>
      </div>
    </ngc-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsBasicExample {}
