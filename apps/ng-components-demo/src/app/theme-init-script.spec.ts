import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  NGC_PALETTES,
  NGC_THEME_MODE_STORAGE_KEY,
  NGC_THEME_STORAGE_KEY,
  NGC_THEME_MODES,
} from '@agentic-software/ng-components/core';

// Guard for the no-flash inline script in index.html:
// it duplicates the storage keys, the palette and mode lists, and the
// migration of the old flat theme ids of NgcThemeService, and nothing else
// would catch drift.
// The vitest cwd is either the project root or the workspace root, depending
// on how the runner is invoked – pick whichever variant exists.
const indexHtmlPath = [
  join(process.cwd(), 'src/index.html'),
  join(process.cwd(), 'apps/ng-components-demo/src/index.html'),
].filter(existsSync)[0];
const indexHtml = readFileSync(indexHtmlPath, 'utf-8');
const scriptSource = /<script>([\s\S]*?)<\/script>/.exec(indexHtml)?.[1] ?? '';

type RunOptions = { stored?: Record<string, string>; storageThrows?: boolean };
type RunResult = { attributes: Record<string, string>; storage: Record<string, string> };

/** Executes the real inline script against stubbed browser globals. */
function runScript(options: RunOptions = {}): RunResult {
  const storage: Record<string, string> = { ...options.stored };
  const attributes: Record<string, string> = {};
  const guard = (): void => {
    if (options.storageThrows) {
      throw new Error('storage blocked');
    }
  };
  const localStorageStub = {
    getItem: (key: string): string | null => {
      guard();
      return storage[key] ?? null;
    },
    setItem: (key: string, value: string): void => {
      guard();
      storage[key] = value;
    },
  };
  const documentStub = {
    documentElement: { setAttribute: (name: string, value: string) => (attributes[name] = value) },
  };
  new Function('localStorage', 'document', scriptSource)(localStorageStub, documentStub);
  return { attributes, storage };
}

describe('no-flash theme init script', () => {
  it('mirrors the NgcThemeService storage keys, palettes, and modes', () => {
    expect(scriptSource).toContain(`'${NGC_THEME_STORAGE_KEY}'`);
    expect(scriptSource).toContain(`'${NGC_THEME_MODE_STORAGE_KEY}'`);
    for (const palette of NGC_PALETTES) {
      expect(scriptSource).toContain(`'${palette}'`);
    }
    for (const mode of NGC_THEME_MODES.filter((candidate) => candidate !== 'auto')) {
      expect(scriptSource).toContain(`'${mode}'`);
    }
  });

  it('carries the default palette statically on <html> for visitors without JavaScript', () => {
    expect(indexHtml).toContain(`<html lang="en" data-theme="${NGC_PALETTES[0]}">`);
  });

  it('restores a persisted palette and explicit mode', () => {
    const { attributes } = runScript({
      stored: { [NGC_THEME_STORAGE_KEY]: 'angular', [NGC_THEME_MODE_STORAGE_KEY]: 'dark' },
    });

    expect(attributes).toEqual({ 'data-theme': 'angular', 'data-theme-mode': 'dark' });
  });

  it('restores the persisted favorite palette', () => {
    const { attributes } = runScript({ stored: { [NGC_THEME_STORAGE_KEY]: 'favorite' } });

    expect(attributes).toEqual({ 'data-theme': 'favorite' });
  });

  it('leaves auto mode (no attribute) when nothing is stored', () => {
    expect(runScript().attributes).toEqual({});
  });

  it.each([
    ['light', 'neutral', 'light'],
    ['dark', 'neutral', 'dark'],
    ['angular-light', 'angular', 'light'],
    ['angular-dark', 'angular', 'dark'],
  ])('migrates the old stored theme %s to %s + %s', (legacy, palette, mode) => {
    const { attributes, storage } = runScript({ stored: { [NGC_THEME_STORAGE_KEY]: legacy } });

    expect(attributes).toEqual({ 'data-theme': palette, 'data-theme-mode': mode });
    expect(storage).toEqual({ [NGC_THEME_STORAGE_KEY]: palette, [NGC_THEME_MODE_STORAGE_KEY]: mode });
  });

  it('ignores invalid stored values', () => {
    const { attributes } = runScript({
      stored: { [NGC_THEME_STORAGE_KEY]: 'neon', [NGC_THEME_MODE_STORAGE_KEY]: 'auto' },
    });

    expect(attributes).toEqual({});
  });

  it('survives blocked storage', () => {
    expect(runScript({ storageThrows: true }).attributes).toEqual({});
  });
});
