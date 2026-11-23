import { ViewportScroller } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, skip, take } from 'rxjs';
import { DEMO_MANIFEST, demosByCategory } from '@ngc-internal/demos/manifest';
import { NgcBadge } from '@agentic-software/ng-components/badge';
import { NgcButton } from '@agentic-software/ng-components/button';
import {
  isNgcPalette,
  isNgcThemeMode,
  NGC_PALETTES,
  NGC_THEME_MODES,
  NgcThemeService,
} from '@agentic-software/ng-components/core';
import { NgcDialog, NgcDialogOverlay, NgcDialogTrigger } from '@agentic-software/ng-components/dialog';
import { NgcSelect, NgcSelectOption } from '@agentic-software/ng-components/select';
import { CommandPalette } from './command-palette/command-palette';

/** Breathing room between the sticky header and an anchor target. */
const ANCHOR_SCROLL_GAP_PX = 16;

/** Display label for a palette or mode id: `angular` → `Angular`. */
export function themeOptionLabel(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

/**
 * Demo app shell: header (logo, ⌘K search, palette and mode switchers, GitHub link),
 * manifest-driven sidebar (ngc-badge status markers), content area. The
 * command palette opens via the search button or Cmd/Ctrl+K (plan 003 M3.3).
 * `data-hydrated` appears once the first navigation has resolved its lazy
 * route and rendered on the client, so the e2e suite can wait for client-side
 * initialisation on every route, home included.
 */
@Component({
  selector: 'app-root',
  imports: [
    NgcBadge,
    NgcButton,
    CommandPalette,
    NgcDialog,
    NgcDialogOverlay,
    NgcDialogTrigger,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgcSelect,
    NgcSelectOption,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onGlobalKeydown($event)',
    '[attr.data-hydrated]': 'hydrated() ? "" : null',
  },
})
export class App {
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  protected readonly themeService = inject(NgcThemeService);
  protected readonly paletteOptions = NGC_PALETTES.map((id) => ({ id, label: themeOptionLabel(id) }));
  protected readonly modeOptions = NGC_THEME_MODES.map((id) => ({ id, label: themeOptionLabel(id) }));
  protected readonly hydrated = signal(false);
  /**
   * Skip-link target on the current URL: a bare `#main` resolves against
   * `<base href="/">` and sends keyboard users home before hydration
   * (verification 2026-10-04 V-01); the click handler covers the hydrated case.
   */
  protected readonly skipLinkHref = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => `${event.urlAfterRedirects.split('#')[0]}#main`),
    ),
    { initialValue: `${this.router.url.split('#')[0]}#main` },
  );
  /** ⌘K on Apple platforms, Ctrl K elsewhere – resolved on the client, SSR renders the neutral form. */
  protected readonly shortcutLabel = signal('Ctrl/⌘ K');
  protected readonly categories = demosByCategory(DEMO_MANIFEST);
  protected readonly sidebarOpen = signal(false);
  protected readonly paletteOpen = signal(false);

  private readonly searchTrigger = viewChild.required<ElementRef<HTMLButtonElement>>('searchTrigger');
  private readonly header = viewChild.required<ElementRef<HTMLElement>>('header');
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly sidebar = viewChild.required<ElementRef<HTMLElement>>('sidebar');
  private readonly menuButton = viewChild.required<ElementRef<HTMLButtonElement>>('menuButton');

  constructor() {
    // Anchor scrolling (outline + section permalinks) must land below the
    // sticky header; scroll-margin does not apply to ViewportScroller's
    // window.scrollTo (review 2026-10-04 D-09). Measured, not assumed – the
    // header is 3.5rem and follows the root font size.
    inject(ViewportScroller).setOffset(() => [
      0,
      this.header().nativeElement.getBoundingClientRect().height + ANCHOR_SCROLL_GAP_PX,
    ]);
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => afterNextRender(() => this.hydrated.set(true), { injector: this.injector }));
    // Route changes destroy the focused element (pager, palette, sidebar) –
    // move focus to the content instead of letting it fall to body. Anchor
    // navigations keep the router's own fragment focus.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        skip(1),
      )
      .subscribe((event) => {
        if (!event.urlAfterRedirects.includes('#')) {
          this.content().nativeElement.focus({ preventScroll: true });
        }
      });
    afterNextRender(() => {
      this.shortcutLabel.set(/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K');
    });
  }

  protected onGlobalKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !this.paletteOpen()) {
      event.preventDefault();
      // Focus first so the dialog records the trigger as the previously
      // focused element and restores focus to it on close, then open.
      this.searchTrigger().nativeElement.focus();
      this.searchTrigger().nativeElement.click();
    }
  }

  protected onPaletteChange(value: string): void {
    if (isNgcPalette(value)) {
      this.themeService.setPalette(value);
    }
  }

  protected onModeChange(value: string): void {
    if (isNgcThemeMode(value)) {
      this.themeService.setMode(value);
    }
  }

  /** Opening the drawer moves focus into it; closing it returns focus to the toggle (review 2026-10-04 D-02). */
  protected toggleSidebar(): void {
    const open = !this.sidebarOpen();
    this.sidebarOpen.set(open);
    if (open) {
      afterNextRender(() => this.sidebar().nativeElement.focus(), { injector: this.injector });
    } else {
      this.menuButton().nativeElement.focus();
    }
  }

  protected closeSidebar(): void {
    if (this.sidebarOpen()) {
      this.sidebarOpen.set(false);
      this.menuButton().nativeElement.focus();
    }
  }

  /** Skip link: focus the content without a navigation; focus() scrolls it into view when needed. */
  protected skipToContent(event: Event): void {
    event.preventDefault();
    this.content().nativeElement.focus();
  }

  /** A sidebar link closes the drawer – focus must not stay on the now-hidden link (review 2026-10-04 D-02). */
  protected onSidebarNavigate(): void {
    if (this.sidebarOpen()) {
      this.sidebarOpen.set(false);
      this.content().nativeElement.focus();
    }
  }
}
