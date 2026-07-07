import { readJson, readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { ngcComponentGenerator } from './ngc-component';

describe('ngc-component generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('stamps a tagged component library with a path alias', async () => {
    await ngcComponentGenerator(tree, { name: 'badge', skipFormat: true });

    const config = readProjectConfiguration(tree, 'badge');
    expect(config.root).toBe('libs/ng-components/badge');
    expect(config.tags).toContain('type:components');

    const tsconfig = readJson(tree, 'tsconfig.base.json');
    const alias = tsconfig.compilerOptions.paths['@angular-software/ng-components/badge'];
    expect(alias).toHaveLength(1);
    expect(alias[0]).toContain('libs/ng-components/badge/src/index.ts');
  });

  it('generates the component archetype by default', async () => {
    await ngcComponentGenerator(tree, { name: 'card', skipFormat: true });

    const source = tree.read('libs/ng-components/card/src/lib/card/card.ts', 'utf-8');
    expect(source).toContain("selector: 'ngc-card'");
    expect(source).toContain('@Component');
    expect(tree.exists('libs/ng-components/card/src/lib/card/card.html')).toBe(true);
    expect(tree.exists('libs/ng-components/card/src/lib/card/card.scss')).toBe(true);
    expect(tree.exists('libs/ng-components/card/src/lib/card/card.spec.ts')).toBe(true);
    expect(tree.read('libs/ng-components/card/src/index.ts', 'utf-8')).toContain('./lib/card/card');
  });

  it('generates the directive archetype with an attribute selector', async () => {
    await ngcComponentGenerator(tree, { name: 'button', archetype: 'directive', skipFormat: true });

    const source = tree.read('libs/ng-components/button/src/lib/button/button.ts', 'utf-8');
    expect(source).toContain("selector: '[ngc-button]'");
    expect(source).toContain('@Directive');
    expect(tree.exists('libs/ng-components/button/src/lib/button/button.html')).toBe(false);
  });

  it('handles multi-word names in kebab-case', async () => {
    await ngcComponentGenerator(tree, { name: 'radio-group', skipFormat: true });

    const source = tree.read('libs/ng-components/radio-group/src/lib/radio-group/radio-group.ts', 'utf-8');
    expect(source).toContain('export class RadioGroup');
    expect(source).toContain("selector: 'ngc-radio-group'");
  });
});
