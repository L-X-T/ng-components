import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, effect, inject, Injectable, InjectionToken, PLATFORM_ID, Provider, signal } from '@angular/core';

/** All built-in palettes (theme families), in display order. */
export const NGC_PALETTES = ['neutral', 'angular'] as const;

export type NgcPalette = (typeof NGC_PALETTES)[number];

/** All theme modes, in display order. `auto` follows the OS colour scheme. */
export const NGC_THEME_MODES = ['auto', 'light', 'dark'] as const;

export type NgcThemeMode = (typeof NGC_THEME_MODES)[number];

/** localStorage key of the persisted palette (also read by the no-flash inline script). */
export const NGC_THEME_STORAGE_KEY = 'ngc-theme';

/** localStorage key of the persisted explicit mode; absent means auto (also read by the inline script). */
export const NGC_THEME_MODE_STORAGE_KEY = 'ngc-theme-mode';

/** Flat theme ids stored under {@link NGC_THEME_STORAGE_KEY} before the palette/mode split. */
const LEGACY_THEMES: Readonly<Record<string, readonly [NgcPalette, NgcThemeMode]>> = {
  light: ['neutral', 'light'],
  dark: ['neutral', 'dark'],
  'angular-light': ['angular', 'light'],
  'angular-dark': ['angular', 'dark'],
};

/**
 * Pins the app's palette, e.g. the brand palette of a company site that
 * offers no palette picker: a persisted palette is ignored. Without it the
 * palette is `neutral` until the visitor picks another one.
 */
export const NGC_PALETTE = new InjectionToken<NgcPalette>('NGC_PALETTE');

export function provideNgcPalette(palette: NgcPalette): Provider {
  return { provide: NGC_PALETTE, useValue: palette };
}

export function isNgcPalette(value: unknown): value is NgcPalette {
  return typeof value === 'string' && (NGC_PALETTES as readonly string[]).includes(value);
}

export function isNgcThemeMode(value: unknown): value is NgcThemeMode {
  return typeof value === 'string' && (NGC_THEME_MODES as readonly string[]).includes(value);
}

/**
 * Holds the active palette and mode and mirrors them to the document root:
 * `data-theme="<palette>"`, and `data-theme-mode="light|dark"` only for an
 * explicit mode – without it (auto) CSS follows the OS via `color-scheme`.
 * Explicit choices persist across visits (browser only); on the server the
 * app's palette renders in auto mode.
 */
@Injectable({ providedIn: 'root' })
export class NgcThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly pinnedPalette = inject(NGC_PALETTE, { optional: true });

  private readonly paletteState = signal<NgcPalette>(this.pinnedPalette ?? 'neutral');
  private readonly modeState = signal<NgcThemeMode>('auto');

  /** The active palette. Write via {@link setPalette}. */
  readonly palette = this.paletteState.asReadonly();

  /** The active mode. Write via {@link setMode}. */
  readonly mode = this.modeState.asReadonly();

  constructor() {
    if (this.isBrowser) {
      this.restore();
    }
    effect((): void => this.applyToDocument(this.paletteState(), this.modeState()));
  }

  /** Activates a palette and remembers it for the next visit. */
  setPalette(palette: NgcPalette): void {
    this.paletteState.set(palette);
    this.persist(NGC_THEME_STORAGE_KEY, palette);
  }

  /** Activates a mode and remembers it for the next visit (`auto` clears the stored mode). */
  setMode(mode: NgcThemeMode): void {
    this.modeState.set(mode);
    this.persist(NGC_THEME_MODE_STORAGE_KEY, mode === 'auto' ? null : mode);
  }

  private applyToDocument(palette: NgcPalette, mode: NgcThemeMode): void {
    const root = this.document.documentElement;
    root.setAttribute('data-theme', palette);
    if (mode === 'auto') {
      root.removeAttribute('data-theme-mode');
    } else {
      root.setAttribute('data-theme-mode', mode);
    }
  }

  /** Reads the persisted choice; a pre-split flat theme id is rewritten in the new format once. */
  private restore(): void {
    try {
      const legacy = LEGACY_THEMES[localStorage.getItem(NGC_THEME_STORAGE_KEY) ?? ''];
      if (legacy) {
        localStorage.setItem(NGC_THEME_STORAGE_KEY, legacy[0]);
        localStorage.setItem(NGC_THEME_MODE_STORAGE_KEY, legacy[1]);
      }
      const palette = localStorage.getItem(NGC_THEME_STORAGE_KEY);
      const mode = localStorage.getItem(NGC_THEME_MODE_STORAGE_KEY);
      if (this.pinnedPalette === null && isNgcPalette(palette)) {
        this.paletteState.set(palette);
      }
      if (isNgcThemeMode(mode)) {
        this.modeState.set(mode);
      }
    } catch {
      // Storage can be unavailable (private mode, blocked cookies) – keep the defaults.
    }
  }

  private persist(key: string, value: string | null): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch {
      // Storage can be unavailable (private mode, blocked cookies) – the choice still applies.
    }
  }
}
