import { DOCUMENT, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { isNgcTheme, NGC_INITIAL_THEME, NGC_THEME_STORAGE_KEY, NgcThemeService } from './theme.service';

describe('NgcThemeService', () => {
  const documentElement = (): HTMLElement => TestBed.inject(DOCUMENT).documentElement;

  const themeService = (): NgcThemeService => {
    const service = TestBed.inject(NgcThemeService);
    TestBed.tick();
    return service;
  };

  const stubPrefersDark = (prefersDark: boolean): void => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string) => ({ matches: prefersDark && query.includes('dark') }) as MediaQueryList,
    });
  };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    stubPrefersDark(false);
  });

  it('defaults to the light theme and applies it to the document root', () => {
    const service = themeService();

    expect(service.theme()).toBe('light');
    expect(documentElement().getAttribute('data-theme')).toBe('light');
  });

  it('applies and persists a theme change', () => {
    const service = themeService();

    service.setTheme('angular-dark');
    TestBed.tick();

    expect(documentElement().getAttribute('data-theme')).toBe('angular-dark');
    expect(localStorage.getItem(NGC_THEME_STORAGE_KEY)).toBe('angular-dark');
  });

  it('restores the persisted theme', () => {
    localStorage.setItem(NGC_THEME_STORAGE_KEY, 'dark');

    expect(themeService().theme()).toBe('dark');
  });

  it('ignores an invalid persisted value', () => {
    localStorage.setItem(NGC_THEME_STORAGE_KEY, 'neon');

    expect(themeService().theme()).toBe('light');
  });

  it('follows the OS dark preference on the first visit (review E9)', () => {
    stubPrefersDark(true);

    expect(themeService().theme()).toBe('dark');
  });

  it('prefers the persisted theme over the OS preference', () => {
    stubPrefersDark(true);
    localStorage.setItem(NGC_THEME_STORAGE_KEY, 'angular-light');

    expect(themeService().theme()).toBe('angular-light');
  });

  it('prefers the provided initial theme over the persisted one', () => {
    localStorage.setItem(NGC_THEME_STORAGE_KEY, 'dark');
    TestBed.configureTestingModule({
      providers: [{ provide: NGC_INITIAL_THEME, useValue: 'angular-light' }],
    });

    expect(themeService().theme()).toBe('angular-light');
  });

  it('does not touch localStorage on the server platform', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    const service = themeService();
    service.setTheme('dark');
    TestBed.tick();

    expect(documentElement().getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(NGC_THEME_STORAGE_KEY)).toBeNull();
  });

  describe('isNgcTheme', () => {
    it('accepts all built-in themes and rejects anything else', () => {
      expect(isNgcTheme('light')).toBe(true);
      expect(isNgcTheme('angular-dark')).toBe(true);
      expect(isNgcTheme('neon')).toBe(false);
      expect(isNgcTheme(undefined)).toBe(false);
    });
  });
});
