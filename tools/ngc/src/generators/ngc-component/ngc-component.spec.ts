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
  tree.write('libs/ng-components/core/src/styles/index.scss', `@use 'tokens';\n@use 'components/button';\n`);
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
    const alias = tsconfig.compilerOptions.paths['@agentic-software/ng-components/badge'];
    expect(alias).toHaveLength(1);
    expect(alias[0]).toContain('libs/ng-components/badge/src/index.ts');
  });

  it('registers the lib as a secondary entry point of the package', async () => {
    await ngcComponentGenerator(tree, { name: 'badge', summary: 'A badge.', skipFormat: true });

    const ngPackage = readJson(tree, 'libs/ng-components/badge/ng-package.json');
    expect(ngPackage.lib.entryFile).toBe('src/index.ts');
    const readme = tree.read('libs/ng-components/badge/README.md', 'utf-8') ?? '';
    expect(readme).toContain('# @agentic-software/ng-components/badge');
    expect(readme).toContain('A badge.');
    expect(readme).not.toContain('generated with [Nx]');
  });

  it('generates the component archetype by default', async () => {
    await ngcComponentGenerator(tree, { name: 'card', skipFormat: true });

    const source = tree.read('libs/ng-components/card/src/lib/card/card.ts', 'utf-8');
    expect(source).toContain("selector: 'ngc-card'");
    expect(source).toContain('@Component');
    // Shipped recipe (review F4): inline ng-content template + hostDirectives
    // skeleton – no external html file.
    expect(source).toContain('template: `<ng-content />`');
    expect(source).toContain('encapsulation: ViewEncapsulation.None');
    expect(source).toContain("host: { class: 'ngc-card' }");
    expect(tree.exists('libs/ng-components/card/src/lib/card/card.html')).toBe(false);
    expect(tree.exists('libs/ng-components/card/src/lib/card/card.scss')).toBe(true);
    expect(tree.exists('libs/ng-components/card/src/lib/card/card.spec.ts')).toBe(true);
    expect(tree.read('libs/ng-components/card/src/index.ts', 'utf-8')).toContain('./lib/card/card');
  });

  it('generates the directive archetype with an attribute selector', async () => {
    await ngcComponentGenerator(tree, { name: 'button', archetype: 'directive', skipFormat: true });

    const source = tree.read('libs/ng-components/button/src/lib/button/button.ts', 'utf-8');
    expect(source).toContain("selector: '[ngc-button]'");
    expect(source).toContain('@Directive');
    expect(source).toContain('export type NgcButtonVariant');
    expect(tree.exists('libs/ng-components/button/src/lib/button/button.html')).toBe(false);
  });

  it('stamps directive styles into core and registers them in the global stylesheet', async () => {
    await ngcComponentGenerator(tree, { name: 'button', archetype: 'directive', skipFormat: true });

    // Directive-only components are styled from core (spec 001 §3) – no stray
    // SCSS file inside the lib that nothing references.
    expect(tree.exists('libs/ng-components/button/src/lib/button/button.scss')).toBe(false);
    const styles = tree.read('libs/ng-components/core/src/styles/components/_button.scss', 'utf-8') ?? '';
    expect(styles).toContain('@layer ngc');
    expect(styles).toContain('.ngc-button');
    expect(tree.read('libs/ng-components/core/src/styles/index.scss', 'utf-8')).toContain("@use 'components/button';");
  });

  it('handles multi-word names in kebab-case', async () => {
    await ngcComponentGenerator(tree, { name: 'radio-group', skipFormat: true });

    const source = tree.read('libs/ng-components/radio-group/src/lib/radio-group/radio-group.ts', 'utf-8');
    expect(source).toContain('export class NgcRadioGroup');
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
    expect(example).toContain("import { NgcButton } from '@agentic-software/ng-components/button'");
    expect(example).toContain('<button ngc-button type="button">');

    const manifest = tree.read('libs/ng-component-demos/src/lib/_manifest/manifest.ts', 'utf-8');
    expect(manifest).toContain("id: 'button'");
    expect(manifest).toContain("category: 'form'");
    expect(manifest).toContain("status: 'wip'");
    expect(manifest).toContain('summary: "Clickable action trigger."');

    expect(tree.read('libs/ng-component-demos/src/index.ts', 'utf-8')).toContain(
      "export * from './lib/button/button-demo';",
    );
    expect(tree.read('libs/ng-component-demos/src/lib/_loaders/index.ts', 'utf-8')).toContain(
      "'button': () => import('../button/button-demo').then((m) => m.ButtonDemo),",
    );
  });

  it('escapes quotes in the stamped summary (review F4)', async () => {
    await ngcComponentGenerator(tree, {
      name: 'tooltip',
      summary: `Shows the user's hint with "context"`,
      skipFormat: true,
    });

    const manifest = tree.read('libs/ng-component-demos/src/lib/_manifest/manifest.ts', 'utf-8') ?? '';
    expect(manifest).toContain('summary: "Shows the user\'s hint with \\"context\\""');
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
    // gotoHydrated, not raw page.goto – the stub must not race hydration
    // (review F4).
    expect(spec).toContain("gotoHydrated(page, '/components/button')");
    expect(spec).toContain("import { gotoHydrated } from '../support/hydration'");
  });
});
