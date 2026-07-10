import { afterNextRender, ChangeDetectionStrategy, Component, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from '@angular-software/ng-components/button';
import { DEMO_MANIFEST } from '../_manifest/manifest';
import { DemoOnThisPage } from './demo-on-this-page';
import { DemoOutlineService } from './demo-outline.service';

/**
 * Top-level wrapper for a component's docs page: renders the title/summary
 * header, a two-column body (content + on-this-page outline), and a prev/next
 * pager derived from the manifest order. Provides the per-page
 * {@link DemoOutlineService} that the projected DemoSections register with.
 *
 * `data-hydrated` appears after the first client render only (never in the
 * prerendered HTML) – the e2e suite waits for it before interacting, so tests
 * cannot race hydration (e.g. a reactive form's initial writeValue clearing
 * just-typed text).
 */
@Component({
  selector: 'ngc-demo-page',
  imports: [Button, DemoOnThisPage, RouterLink],
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
  private readonly router = inject(Router);

  readonly title = input.required<string>();
  readonly summary = input<string>();

  protected readonly hydrated = signal(false);

  // The routed demo component (and with it this page) is recreated on every
  // navigation, so the manifest neighbors are fixed for the page's lifetime.
  protected readonly previous = this.adjacentEntry(-1);
  protected readonly next = this.adjacentEntry(1);

  constructor() {
    afterNextRender(() => this.hydrated.set(true));
  }

  private adjacentEntry(offset: -1 | 1) {
    const url = this.router.url.split('?')[0].split('#')[0];
    const index = DEMO_MANIFEST.findIndex((entry) => entry.route === url);
    return index === -1 ? undefined : DEMO_MANIFEST[index + offset];
  }
}
