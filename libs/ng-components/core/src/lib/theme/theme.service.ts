import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, effect, inject, Injectable, InjectionToken, PLATFORM_ID, Provider, signal } from '@angular/core';

/** All built-in themes, in display order. */
export const NGC_THEMES = ['light', 'dark', 'angular-light', 'angular-dark'] as const;

export type NgcTheme = (typeof NGC_THEMES)[number];

/** localStorage key used for theme persistence (also read by the no-flash inline script). */
export const NGC_THEME_STORAGE_KEY = 'ngc-theme';

/**
 * The light/dark pair an app runs on. Without a persisted choice the service
 * picks `dark` when the OS prefers dark and `light` otherwise (also the
 * server-side default, where no preference is known).
 */
export type NgcThemeScheme = {
  readonly light: NgcTheme;
  readonly dark: NgcTheme;
};

const DEFAULT_SCHEME: NgcThemeScheme = { light: 'light', dark: 'dark' };

/**
 * The app's light/dark pair, e.g. the brand themes for a company site. Only
 * consulted while no theme is persisted – the visitor's own choice always
 * wins. Defaults to the neutral `light`/`dark` pair.
 */
export const NGC_THEME_SCHEME = new InjectionToken<NgcThemeScheme>('NGC_THEME_SCHEME');

export function provideNgcThemeScheme(scheme: NgcThemeScheme): Provider {
  return { provide: NGC_THEME_SCHEME, useValue: scheme };
}

/**
 * Overrides the initial theme, taking precedence over the persisted choice
 * AND the prefers-color-scheme fallback. Meant for SSR hosts that resolve
 * the theme on the server (e.g. from a cookie) – such a host owns keeping its
 * cookie in sync with the client-side localStorage persistence, otherwise the
 * server-rendered theme beats the user's later choice on every load. Static
 * sites that just want brand themes want {@link provideNgcThemeScheme}
 * instead.
 */
export const NGC_INITIAL_THEME = new InjectionToken<NgcTheme>('NGC_INITIAL_THEME');

export function provideNgcInitialTheme(theme: NgcTheme): Provider {
  return { provide: NGC_INITIAL_THEME, useValue: theme };
}

export function isNgcTheme(value: unknown): value is NgcTheme {
  return typeof value === 'string' && (NGC_THEMES as readonly string[]).includes(value);
}

/**
 * Holds the active theme, mirrors it to `data-theme` on the document root
 * element, and persists explicit choices across visits (browser only). The
 * OS-derived first-visit theme is deliberately not persisted, so the app keeps
 * following the OS preference until the visitor picks a theme themselves.
 */
@Injectable({ providedIn: 'root' })
export class NgcThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly initialTheme = inject(NGC_INITIAL_THEME, { optional: true });
  private readonly scheme = inject(NGC_THEME_SCHEME, { optional: true }) ?? DEFAULT_SCHEME;

  /** The active theme. Write via {@link setTheme}. */
  readonly theme = signal<NgcTheme>(this.resolveInitialTheme());

  constructor() {
    effect((): void => this.document.documentElement.setAttribute('data-theme', this.theme()));
  }

  /** Activates a theme and remembers it for the next visit. */
  setTheme(theme: NgcTheme): void {
    this.theme.set(theme);
    if (this.isBrowser) {
      try {
        localStorage.setItem(NGC_THEME_STORAGE_KEY, theme);
      } catch {
        // Storage can be unavailable (private mode, blocked cookies) – the theme still applies.
      }
    }
  }

  private resolveInitialTheme(): NgcTheme {
    if (this.initialTheme !== null) {
      return this.initialTheme;
    }
    if (this.isBrowser) {
      try {
        const stored = localStorage.getItem(NGC_THEME_STORAGE_KEY);
        if (isNgcTheme(stored)) {
          return stored;
        }
      } catch {
        // Fall through to the preference-based default.
      }
      // First visit: follow the OS preference (review 2026-07-11 E9). Must
      // stay in sync with the no-flash inline script of consuming apps.
      if (this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return this.scheme.dark;
      }
    }
    return this.scheme.light;
  }
}
