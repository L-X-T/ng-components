import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DEMO_MANIFEST, demosByCategory } from '@angular-software/ng-component-demos/manifest';
import { NGC_THEMES, isNgcTheme, ThemeService } from '@angular-software/ng-components/core';

/**
 * Demo app shell: header (logo, search placeholder, theme switcher, GitHub
 * link), manifest-driven sidebar, content area. Raw tokens for now; re-skinned
 * with ngc-* components as they land (plan 003 M3.2).
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly themeService = inject(ThemeService);
  protected readonly themes = NGC_THEMES;
  protected readonly categories = demosByCategory(DEMO_MANIFEST);
  protected readonly sidebarOpen = signal(false);

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
