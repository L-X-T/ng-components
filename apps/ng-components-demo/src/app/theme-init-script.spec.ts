import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NGC_THEME_STORAGE_KEY, NGC_THEMES } from '@angular-software/ng-components/core';

// Guard for the no-flash inline script in index.html (review 2026-07-11 E9):
// it duplicates the storage key, theme list, and prefers-color-scheme
// fallback of ThemeService, and nothing else would catch drift.
// The vitest cwd is either the project root or the workspace root, depending
// on how the runner is invoked – pick whichever variant exists.
const indexHtmlPath = [
  join(process.cwd(), 'src/index.html'),
  join(process.cwd(), 'apps/ng-components-demo/src/index.html'),
].filter(existsSync)[0];
const indexHtml = readFileSync(indexHtmlPath, 'utf-8');
const scriptSource = /<script>([\s\S]*?)<\/script>/.exec(indexHtml)?.[1] ?? '';

type RunOptions = { stored?: string | null; prefersDark?: boolean; storageThrows?: boolean };

/** Executes the real inline script against stubbed browser globals. */
function runScript(options: RunOptions): [string, string][] {
  const setAttributeCalls: [string, string][] = [];
  const localStorageStub = {
    getItem: (): string | null => {
      if (options.storageThrows) {
        throw new Error('storage blocked');
      }
      return options.stored ?? null;
    },
  };
  const windowStub = {
    matchMedia: (query: string) => ({ matches: (options.prefersDark ?? false) && query.includes('dark') }),
  };
  const documentStub = {
    documentElement: {
      setAttribute: (name: string, value: string) => setAttributeCalls.push([name, value]),
    },
  };
  new Function('localStorage', 'window', 'document', scriptSource)(localStorageStub, windowStub, documentStub);
  return setAttributeCalls;
}

describe('no-flash theme init script', () => {
  it('mirrors the ThemeService storage key and theme list', () => {
    expect(scriptSource).toContain(`'${NGC_THEME_STORAGE_KEY}'`);
    for (const theme of NGC_THEMES) {
      expect(scriptSource).toContain(`'${theme}'`);
    }
  });

  it('restores a persisted theme', () => {
    expect(runScript({ stored: 'angular-dark' })).toEqual([['data-theme', 'angular-dark']]);
  });

  it('falls back to dark for first-time visitors preferring dark', () => {
    expect(runScript({ stored: null, prefersDark: true })).toEqual([['data-theme', 'dark']]);
  });

  it('leaves the default theme when nothing is stored and light is preferred', () => {
    expect(runScript({ stored: null, prefersDark: false })).toEqual([]);
  });

  it('ignores an invalid stored value but honors the preference', () => {
    expect(runScript({ stored: 'neon', prefersDark: true })).toEqual([['data-theme', 'dark']]);
  });

  it('survives blocked storage', () => {
    expect(runScript({ storageThrows: true, prefersDark: true })).toEqual([['data-theme', 'dark']]);
  });
});
