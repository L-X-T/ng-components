import { DEMO_MANIFEST } from '@angular-software/ng-component-demos/manifest';
import { expect, test } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Completeness gate (spec 004 layer 3): every manifest entry must have a
 * per-component spec file. The ngc-component generator stamps the skeleton,
 * so this normally never fires – it catches manually added or renamed
 * entries.
 */
test('every manifest entry has a components/<id>.spec.ts', () => {
  const missing = DEMO_MANIFEST.filter((demo) => !existsSync(join(__dirname, 'components', `${demo.id}.spec.ts`))).map(
    (demo) => demo.id,
  );

  expect(missing, `missing per-component spec file(s): ${missing.join(', ')}`).toEqual([]);
});
