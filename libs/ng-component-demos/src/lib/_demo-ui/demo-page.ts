import { afterNextRender, ChangeDetectionStrategy, Component, input, signal, ViewEncapsulation } from '@angular/core';
import { DemoOnThisPage } from './demo-on-this-page';
import { DemoOutlineService } from './demo-outline.service';

/**
 * Top-level wrapper for a component's docs page: renders the title/summary
 * header and a two-column body (content + on-this-page outline). Provides the
 * per-page {@link DemoOutlineService} that the projected DemoSections register
 * with.
 *
 * `data-hydrated` appears after the first client render only (never in the
 * prerendered HTML) – the e2e suite waits for it before interacting, so tests
 * cannot race hydration (e.g. a reactive form's initial writeValue clearing
 * just-typed text).
 */
@Component({
  selector: 'ngc-demo-page',
  imports: [DemoOnThisPage],
  templateUrl: './demo-page.html',
  styleUrl: './demo-page.scss',
  providers: [DemoOutlineService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ngc-demo-page',
    '[attr.data-hydrated]': 'hydrated() ? "" : null',
  },
})
export class DemoPage {
  readonly title = input.required<string>();
  readonly summary = input<string>();

  protected readonly hydrated = signal(false);

  constructor() {
    afterNextRender(() => this.hydrated.set(true));
  }
}
