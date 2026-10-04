import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

export type DemoApiKind = 'input' | 'output' | 'model' | 'directive' | 'method' | 'option';

/**
 * One row of a {@link DemoApi} table. Uses `display: contents` so its cells
 * flow into the parent grid.
 */
@Component({
  selector: 'ngc-demo-api-item',
  templateUrl: './demo-api-item.html',
  styleUrl: './demo-api-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-demo-api-item', role: 'row' },
})
export class DemoApiItem {
  readonly name = input.required<string>();
  readonly kind = input<DemoApiKind>();
  readonly type = input<string>();
  readonly default = input<string>();
  readonly description = input<string>();
}
