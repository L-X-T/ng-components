import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DEMO_MANIFEST, demosByCategory } from '@angular-software/ng-component-demos/manifest';
import { NgcBadge } from '@angular-software/ng-components/badge';
import { NgcButton } from '@angular-software/ng-components/button';
import { NGC_THEMES, isNgcTheme, NgcThemeService } from '@angular-software/ng-components/core';
import { NgcDialog, NgcDialogOverlay, NgcDialogTrigger } from '@angular-software/ng-components/dialog';
import { NgcSelect, NgcSelectOption } from '@angular-software/ng-components/select';
import { CommandPalette } from './command-palette/command-palette';

/**
 * Demo app shell: header (logo, ⌘K search, theme switcher, GitHub link),
 * manifest-driven sidebar (ngc-badge status markers), content area. The
 * command palette opens via the search button or Cmd/Ctrl+K (plan 003 M3.3).
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
  },
})
export class App {
  protected readonly themeService = inject(NgcThemeService);
  protected readonly themes = NGC_THEMES;
  protected readonly categories = demosByCategory(DEMO_MANIFEST);
  protected readonly sidebarOpen = signal(false);
  protected readonly paletteOpen = signal(false);

  private readonly searchTrigger = viewChild.required<ElementRef<HTMLButtonElement>>('searchTrigger');

  protected onGlobalKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !this.paletteOpen()) {
      event.preventDefault();
      // Focus first so the dialog records the trigger as the previously
      // focused element and restores focus to it on close, then open.
      this.searchTrigger().nativeElement.focus();
      this.searchTrigger().nativeElement.click();
    }
  }

  protected onThemeChange(value: string): void {
    if (isNgcTheme(value)) {
      this.themeService.setTheme(value);
    }
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
