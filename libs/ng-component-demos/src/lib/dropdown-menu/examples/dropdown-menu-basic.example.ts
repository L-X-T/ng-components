import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgcButton } from '@angular-software/ng-components/button';
import {
  NgcMenu,
  NgcMenuGroup,
  NgcMenuItem,
  NgcMenuLabel,
  NgcMenuSeparator,
  NgcMenuTrigger,
} from '@angular-software/ng-components/dropdown-menu';

@Component({
  selector: 'ngc-demo-dropdown-menu-basic-example',
  imports: [NgcButton, NgcMenu, NgcMenuGroup, NgcMenuItem, NgcMenuLabel, NgcMenuSeparator, NgcMenuTrigger],
  template: `
    <div style="display: grid; gap: 0.75rem; justify-items: start">
      <button ngc-button variant="outline" [ngc-menu-trigger]="accountMenu">Options</button>
      <p style="margin: 0">
        Last action: <code>{{ lastAction() }}</code>
      </p>
    </div>

    <ng-template #accountMenu>
      <div ngc-menu>
        <div ngc-menu-group>
          <span ngc-menu-label>My account</span>
          <button ngc-menu-item (click)="onAction('profile')">Profile</button>
          <button ngc-menu-item (click)="onAction('billing')">Billing</button>
          <button ngc-menu-item [disabled]="true">Team (soon)</button>
        </div>
        <div ngc-menu-separator></div>
        <button ngc-menu-item (click)="onAction('logout')">Log out</button>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuBasicExample {
  protected readonly lastAction = signal('none');

  protected onAction(action: string): void {
    this.lastAction.set(action);
  }
}
