import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from '@angular-software/ng-components/button';
import { DEMO_MANIFEST } from '../_manifest/manifest';
import type { DemoManifestEntry } from '../_manifest/manifest-entry';
import { demoPrevNext, type DemoPrevNext } from '../_manifest/manifest-helpers';
import { DemoOnThisPage } from './demo-on-this-page';
import { DemoOutlineService } from './demo-outline.service';

/**
 * Top-level wrapper for a component's docs page: renders the title/summary
 * header, a two-column body (content + on-this-page outline), and a prev/next
 * pager in sidebar order (category, then authored). Provides the per-page
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

  /**
   * Optional overrides – the header defaults to the current manifest entry's
   * name/summary, so demo pages need not duplicate them (review 2026-07-11
   * E8).
   */
  readonly title = input<string>();
  readonly summary = input<string>();

  protected readonly hydrated = signal(false);

  // The routed demo component (and with it this page) is recreated on every
  // navigation, so the manifest entry is fixed for the page's lifetime.
  private readonly currentEntry = this.resolveCurrentEntry();

  // demoPrevNext walks sidebar order (category, then authored order) – the
  // pager must match the sequence the sidebar shows (review 2026-07-11 E3).
  private readonly pager: DemoPrevNext = this.currentEntry ? demoPrevNext(DEMO_MANIFEST, this.currentEntry.id) : {};
  protected readonly previous = this.pager.prev;
  protected readonly next = this.pager.next;

  protected readonly resolvedTitle = computed(() => this.title() ?? this.currentEntry?.name ?? '');
  protected readonly resolvedSummary = computed(() => this.summary() ?? this.currentEntry?.summary);

  constructor() {
    afterNextRender(() => this.hydrated.set(true));
  }

  private resolveCurrentEntry(): DemoManifestEntry | undefined {
    const url = this.router.url.split('?')[0].split('#')[0];
    return DEMO_MANIFEST.find((entry) => entry.route === url);
  }
}
