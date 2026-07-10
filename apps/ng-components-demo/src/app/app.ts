import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DEMO_MANIFEST, demosByCategory } from '@angular-software/ng-component-demos/manifest';
import { Badge } from '@angular-software/ng-components/badge';
import { Button } from '@angular-software/ng-components/button';
import { NGC_THEMES, isNgcTheme, ThemeService } from '@angular-software/ng-components/core';

/**
 * Demo app shell: header (logo, search placeholder, theme switcher, GitHub
 * link), manifest-driven sidebar (ngc-badge status markers), content area.
 */
@Component({
  selector: 'app-root',
  imports: [Badge, Button, RouterOutlet, RouterLink, RouterLinkActive],
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
