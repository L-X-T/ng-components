import { DEMO_MANIFEST } from '@ngc-internal/demos/manifest';
import { expect, test } from '@playwright/test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const componentsDir = join(__dirname, 'components');

/**
 * Completeness gate (spec 004 layer 3): every manifest entry must have a real
 * per-component spec file, and every spec file must belong to a manifest
 * entry. The ngc-component generator stamps the skeleton, so this normally
 * never fires – it catches manually added, renamed, emptied, or skipped
 * entries (review 2026-07-11 E10).
 */
test('every manifest entry has a non-trivial components/<id>.spec.ts', () => {
  const missing = DEMO_MANIFEST.filter((demo) => !existsSync(join(componentsDir, `${demo.id}.spec.ts`))).map(
    (demo) => demo.id,
  );
  expect(missing, `missing per-component spec file(s): ${missing.join(', ')}`).toEqual([]);

  // An empty or skipped file must not satisfy the gate.
  const trivial = DEMO_MANIFEST.filter((demo) => {
    const source = readFileSync(join(componentsDir, `${demo.id}.spec.ts`), 'utf-8');
    return !source.includes('test(') || source.includes('test.skip(') || source.includes('test.describe.skip(');
  }).map((demo) => demo.id);
  expect(trivial, `empty or skipped spec file(s): ${trivial.join(', ')}`).toEqual([]);
});

test('every components/*.spec.ts belongs to a manifest entry', () => {
  const manifestIds = new Set(DEMO_MANIFEST.map((demo) => demo.id));
  const strays = readdirSync(componentsDir)
    .filter((file) => file.endsWith('.spec.ts'))
    .map((file) => file.replace(/\.spec\.ts$/, ''))
    .filter((id) => !manifestIds.has(id));

  expect(strays, `spec file(s) without a manifest entry: ${strays.join(', ')}`).toEqual([]);
});
