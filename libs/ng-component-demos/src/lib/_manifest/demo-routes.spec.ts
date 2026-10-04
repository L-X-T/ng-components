import type { DemoManifestEntry } from './manifest-entry';
import { demoRoutes } from './demo-routes';

function entry(id: string, category: DemoManifestEntry['category']): DemoManifestEntry {
  return {
    id,
    name: id.toUpperCase(),
    category,
    route: `/components/${id}`,
    status: 'stable',
    summary: '',
    examples: [],
  };
}

const manifest = [entry('dialog', 'overlay'), entry('button', 'form')];
const loader = () => Promise.resolve(class {});

describe('demoRoutes', () => {
  it('builds one titled lazy route per manifest entry, in sidebar order', () => {
    const routes = demoRoutes(manifest, { button: loader, dialog: loader });

    expect(routes.map((route) => route.path)).toEqual(['components/button', 'components/dialog']);
    expect(routes.map((route) => route.title)).toEqual(['BUTTON', 'DIALOG']);
    expect(routes[0].data).toEqual({ demo: manifest[1] });
  });

  it('fails loudly for an entry without a loader (review 2026-10-04 D-11)', () => {
    expect(() => demoRoutes(manifest, { button: loader })).toThrow(/"dialog" has no loader/);
  });
});
