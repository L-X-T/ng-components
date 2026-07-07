import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Props table for a demo page. Wraps projected {@link DemoApiItem} rows in a
 * four-column grid (name, type, default, description). Authored in the demo
 * page – the manifest deliberately does not duplicate API docs (spec 002).
 */
@Component({
  selector: 'ngc-demo-api',
  templateUrl: './demo-api.html',
  styleUrl: './demo-api.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-demo-api', role: 'table' },
})
export class DemoApi {}
