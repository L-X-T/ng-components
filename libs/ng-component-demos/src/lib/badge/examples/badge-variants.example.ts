import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgcBadge } from '@agentic-software/ng-components/badge';

@Component({
  selector: 'ngc-demo-badge-variants-example',
  imports: [NgcBadge],
  template: `
    <span ngc-badge>Default</span>
    <span ngc-badge variant="secondary">Secondary</span>
    <span ngc-badge variant="destructive">Destructive</span>
    <span ngc-badge variant="outline">Outline</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeVariantsExample {}
