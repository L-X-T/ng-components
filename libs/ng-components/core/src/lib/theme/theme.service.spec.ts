import { DOCUMENT, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  isNgcPalette,
  isNgcThemeMode,
  NGC_THEME_MODE_STORAGE_KEY,
  NGC_THEME_STORAGE_KEY,
  NgcThemeService,
  provideNgcPalette,
} from './theme.service';

describe('NgcThemeService', () => {
  const root = (): HTMLElement => TestBed.inject(DOCUMENT).documentElement;

  const themeService = (): NgcThemeService => {
    const service = TestBed.inject(NgcThemeService);
    TestBed.tick();
    return service;
  };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-mode');
  });

  it('defaults to the neutral palette in auto mode', () => {
    const service = themeService();

    expect(service.palette()).toBe('neutral');
    expect(service.mode()).toBe('auto');
    expect(root().getAttribute('data-theme')).toBe('neutral');
    expect(root().hasAttribute('data-theme-mode')).toBe(false);
  });

  it('applies and persists an explicit mode', () => {
    const service = themeService();

    service.setMode('dark');
    TestBed.tick();

    expect(root().getAttribute('data-theme-mode')).toBe('dark');
    expect(localStorage.getItem(NGC_THEME_MODE_STORAGE_KEY)).toBe('dark');
  });

  it('removes the mode attribute and the stored mode when going back to auto', () => {
    const service = themeService();
    service.setMode('light');
    TestBed.tick();

    service.setMode('auto');
    TestBed.tick();

    expect(root().hasAttribute('data-theme-mode')).toBe(false);
    expect(localStorage.getItem(NGC_THEME_MODE_STORAGE_KEY)).toBeNull();
  });

  it('applies and persists a palette', () => {
    const service = themeService();

    service.setPalette('angular');
    TestBed.tick();

    expect(root().getAttribute('data-theme')).toBe('angular');
    expect(localStorage.getItem(NGC_THEME_STORAGE_KEY)).toBe('angular');
  });

  it('restores a persisted palette and mode', () => {
    localStorage.setItem(NGC_THEME_STORAGE_KEY, 'angular');
    localStorage.setItem(NGC_THEME_MODE_STORAGE_KEY, 'light');

    const service = themeService();

    expect(service.palette()).toBe('angular');
    expect(service.mode()).toBe('light');
    expect(root().getAttribute('data-theme-mode')).toBe('light');
  });

  it('ignores invalid persisted values', () => {
    localStorage.setItem(NGC_THEME_STORAGE_KEY, 'neon');
    localStorage.setItem(NGC_THEME_MODE_STORAGE_KEY, 'dim');

    const service = themeService();

    expect(service.palette()).toBe('neutral');
    expect(service.mode()).toBe('auto');
  });

  it.each([
    ['light', 'neutral', 'light'],
    ['dark', 'neutral', 'dark'],
    ['angular-light', 'angular', 'light'],
    ['angular-dark', 'angular', 'dark'],
  ] as const)('migrates the old stored theme %s to %s + %s and rewrites it', (legacy, palette, mode) => {
    localStorage.setItem(NGC_THEME_STORAGE_KEY, legacy);

    const service = themeService();

    expect(service.palette()).toBe(palette);
    expect(service.mode()).toBe(mode);
    expect(localStorage.getItem(NGC_THEME_STORAGE_KEY)).toBe(palette);
    expect(localStorage.getItem(NGC_THEME_MODE_STORAGE_KEY)).toBe(mode);
  });

  describe('pinned palette', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [provideNgcPalette('angular')] });
    });

    it('runs on the pinned palette', () => {
      expect(themeService().palette()).toBe('angular');
      expect(root().getAttribute('data-theme')).toBe('angular');
    });

    it('ignores a persisted palette but keeps the persisted mode', () => {
      localStorage.setItem(NGC_THEME_STORAGE_KEY, 'dark');

      const service = themeService();

      expect(service.palette()).toBe('angular');
      expect(service.mode()).toBe('dark');
    });
  });

  describe('server platform', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideNgcPalette('angular'), { provide: PLATFORM_ID, useValue: 'server' }],
      });
    });

    it('renders the app palette in auto mode without reading storage', () => {
      localStorage.setItem(NGC_THEME_MODE_STORAGE_KEY, 'dark');

      const service = themeService();

      expect(service.mode()).toBe('auto');
      expect(root().getAttribute('data-theme')).toBe('angular');
      expect(root().hasAttribute('data-theme-mode')).toBe(false);
    });

    it('does not touch localStorage', () => {
      const service = themeService();
      service.setMode('dark');
      TestBed.tick();

      expect(root().getAttribute('data-theme-mode')).toBe('dark');
      expect(localStorage.getItem(NGC_THEME_MODE_STORAGE_KEY)).toBeNull();
    });
  });

  describe('type guards', () => {
    it('accept the built-in palettes and modes and reject anything else', () => {
      expect(isNgcPalette('angular')).toBe(true);
      expect(isNgcPalette('angular-dark')).toBe(false);
      expect(isNgcThemeMode('auto')).toBe(true);
      expect(isNgcThemeMode('neon')).toBe(false);
      expect(isNgcThemeMode(undefined)).toBe(false);
    });
  });
});
