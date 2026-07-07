import type { DemoManifestEntry } from './manifest-entry';
import { demoPrevNext, demosByCategory, findDemo, orderedDemos } from './manifest-helpers';

function entry(id: string, category: DemoManifestEntry['category']): DemoManifestEntry {
  return { id, name: id, category, route: `/components/${id}`, status: 'stable', summary: '', examples: [] };
}

// Deliberately out of category order to prove the helpers re-order.
const manifest: readonly DemoManifestEntry[] = [
  entry('dialog', 'overlay'),
  entry('button', 'form'),
  entry('card', 'layout'),
  entry('select', 'form'),
];

describe('manifest helpers', () => {
  it('orders demos by category then authored order', () => {
    expect(orderedDemos(manifest).map((demo) => demo.id)).toEqual(['button', 'select', 'card', 'dialog']);
  });

  it('groups only non-empty categories, in category order', () => {
    const groups = demosByCategory(manifest);
    expect(groups.map((group) => group.category)).toEqual(['form', 'layout', 'overlay']);
    expect(groups[0].demos.map((demo) => demo.id)).toEqual(['button', 'select']);
  });

  it('finds an entry by id', () => {
    expect(findDemo(manifest, 'card')?.name).toBe('card');
    expect(findDemo(manifest, 'missing')).toBeUndefined();
  });

  it('resolves prev/next in sidebar order', () => {
    expect(demoPrevNext(manifest, 'select')).toEqual({
      prev: findDemo(manifest, 'button'),
      next: findDemo(manifest, 'card'),
    });
    expect(demoPrevNext(manifest, 'button').prev).toBeUndefined();
    expect(demoPrevNext(manifest, 'dialog').next).toBeUndefined();
  });
});
