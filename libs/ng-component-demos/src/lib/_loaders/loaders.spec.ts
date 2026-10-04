import { DEMO_MANIFEST } from '../_manifest/manifest';
import { DEMO_LOADERS } from './index';

// The generator stamps both; a hand edit that drops one side would otherwise
// only surface as a dead sidebar link in the e2e sweep (review 2026-10-04 D-11).
describe('DEMO_LOADERS', () => {
  it('has exactly one loader per manifest entry', () => {
    expect(Object.keys(DEMO_LOADERS).sort()).toEqual(DEMO_MANIFEST.map((demo) => demo.id).sort());
  });
});
