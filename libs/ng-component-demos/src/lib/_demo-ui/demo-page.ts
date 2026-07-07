import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { DemoOnThisPage } from './demo-on-this-page';
import { DemoOutlineService } from './demo-outline.service';

/**
 * Top-level wrapper for a component's docs page: renders the title/summary
 * header and a two-column body (content + on-this-page outline). Provides the
 * per-page {@link DemoOutlineService} that the projected DemoSections register
 * with.
 */
@Component({
  selector: 'ngc-demo-page',
  imports: [DemoOnThisPage],
  templateUrl: './demo-page.html',
  styleUrl: './demo-page.scss',
  providers: [DemoOutlineService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-demo-page' },
})
export class DemoPage {
  readonly title = input.required<string>();
  readonly summary = input<string>();
}
