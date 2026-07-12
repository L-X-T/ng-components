import { readJson, readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { ngcComponentGenerator } from './ngc-component';

/** Seeds the demo-infra files the generator stamps into (matching the real workspace). */
function seedDemoInfra(tree: Tree): void {
  tree.write(
    'libs/ng-component-demos/src/lib/_manifest/manifest.ts',
    `import type { DemoManifestEntry } from './manifest-entry';\n\nexport const DEMO_MANIFEST: readonly DemoManifestEntry[] = [];\n`,
  );
  tree.write('libs/ng-component-demos/src/index.ts', `export * from './lib/_manifest';\n`);
  tree.write(
    'libs/ng-component-demos/src/lib/_loaders/index.ts',
    `import type { DemoLoaderMap } from '../_manifest';\n\nexport const DEMO_LOADERS: DemoLoaderMap = {};\n`,
  );
  tree.write('apps/ng-components-demo-e2e/src/components/.gitkeep', '');
}

describe('ngc-component generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    seedDemoInfra(tree);
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

  it('stamps the demo stub: page, example, manifest entry, index export, loader', async () => {
    await ngcComponentGenerator(tree, {
      name: 'button',
      archetype: 'directive',
      category: 'form',
      summary: 'Clickable action trigger.',
      skipFormat: true,
    });

    const demoPage = tree.read('libs/ng-component-demos/src/lib/button/button-demo.ts', 'utf-8');
    expect(demoPage).toContain('export class ButtonDemo');
    expect(demoPage).toContain('id="button-basic"');

    const example = tree.read('libs/ng-component-demos/src/lib/button/examples/button-basic.example.ts', 'utf-8');
    expect(example).toContain("import { Button } from '@angular-software/ng-components/button'");
    expect(example).toContain('<button ngc-button>');

    const manifest = tree.read('libs/ng-component-demos/src/lib/_manifest/manifest.ts', 'utf-8');
    expect(manifest).toContain("id: 'button'");
    expect(manifest).toContain("category: 'form'");
    expect(manifest).toContain("status: 'wip'");
    expect(manifest).toContain("summary: 'Clickable action trigger.'");

    expect(tree.read('libs/ng-component-demos/src/index.ts', 'utf-8')).toContain(
      "export * from './lib/button/button-demo';",
    );
    expect(tree.read('libs/ng-component-demos/src/lib/_loaders/index.ts', 'utf-8')).toContain(
      "'button': () => import('../button/button-demo').then((m) => m.ButtonDemo),",
    );
  });

  it('appends to an already-populated manifest and loader map', async () => {
    await ngcComponentGenerator(tree, { name: 'button', archetype: 'directive', skipFormat: true });
    await ngcComponentGenerator(tree, { name: 'card', category: 'layout', skipFormat: true });

    const manifest = tree.read('libs/ng-component-demos/src/lib/_manifest/manifest.ts', 'utf-8') ?? '';
    expect(manifest.indexOf("id: 'button'")).toBeGreaterThan(-1);
    expect(manifest.indexOf("id: 'card'")).toBeGreaterThan(manifest.indexOf("id: 'button'"));

    const loaders = tree.read('libs/ng-component-demos/src/lib/_loaders/index.ts', 'utf-8') ?? '';
    expect(loaders).toContain("'button':");
    expect(loaders).toContain("'card':");
  });

  it('stamps the e2e spec skeleton', async () => {
    await ngcComponentGenerator(tree, { name: 'button', archetype: 'directive', skipFormat: true });

    const spec = tree.read('apps/ng-components-demo-e2e/src/components/button.spec.ts', 'utf-8');
    expect(spec).toContain("test.describe('button'");
    expect(spec).toContain("page.goto('/components/button')");
  });
});
