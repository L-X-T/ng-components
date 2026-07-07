import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@angular-software/ng-components/badge';

@Component({
  selector: 'ngc-demo-badge-variants-example',
  imports: [Badge],
  template: `
    <span ngc-badge>Default</span>
    <span ngc-badge variant="secondary">Secondary</span>
    <span ngc-badge variant="destructive">Destructive</span>
    <span ngc-badge variant="outline">Outline</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeVariantsExample {}
