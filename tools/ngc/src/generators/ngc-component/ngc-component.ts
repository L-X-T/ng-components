import { libraryGenerator } from '@nx/angular/generators';
import {
  formatFiles,
  generateFiles,
  type GeneratorCallback,
  joinPathFragments,
  logger,
  names,
  type Tree,
} from '@nx/devkit';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { NgcComponentGeneratorSchema } from './schema';

const NG_COMPONENTS_DIR = 'libs/ng-components';
const CORE_STYLES_DIR = `${NG_COMPONENTS_DIR}/core/src/styles`;
const CORE_STYLES_INDEX_PATH = `${CORE_STYLES_DIR}/index.scss`;
const DEMOS_LIB_DIR = 'libs/ng-component-demos/src';
const MANIFEST_PATH = `${DEMOS_LIB_DIR}/lib/_manifest/manifest.ts`;
const DEMOS_INDEX_PATH = `${DEMOS_LIB_DIR}/index.ts`;
const DEMO_LOADERS_PATH = `${DEMOS_LIB_DIR}/lib/_loaders/index.ts`;
const E2E_COMPONENTS_DIR = 'apps/ng-components-demo-e2e/src/components';

/**
 * Stamps a new ng-components component in one command (spec 001/002/004):
 * - `libs/ng-components/<name>` lib (non-buildable, path alias,
 *   `type:components` tag) with the component/directive skeleton, SCSS, and a
 *   Vitest spec, registered as a secondary entry point of the published
 *   package (`ng-package.json`, package README) – directive-only components get their SCSS in core's global
 *   stylesheet (`core/src/styles/components/_<name>.scss` + `@use` in
 *   `index.scss`), like every shipped directive (spec 001 §3);
 * - a demo stub in ng-component-demos (page + basic example) plus its
 *   `wip` manifest entry, index export, and app loader entry;
 * - the per-component Playwright spec skeleton in ng-components-demo-e2e.
 */
export async function ngcComponentGenerator(
  tree: Tree,
  options: NgcComponentGeneratorSchema,
): Promise<GeneratorCallback> {
  const { fileName, className, propertyName } = names(options.name);
  const archetype = options.archetype ?? 'component';
  const projectRoot = joinPathFragments(NG_COMPONENTS_DIR, fileName);

  type LibraryOptions = Parameters<typeof libraryGenerator>[1];
  await libraryGenerator(tree, {
    directory: projectRoot,
    name: fileName,
    importPath: `@agentic-software/ng-components/${fileName}`,
    prefix: 'ngc',
    tags: 'type:components',
    style: 'scss',
    // '@nx/angular' still types unitTestRunner without the 'vitest-analog'
    // value its own CLI requires, so assert the runtime-valid value.
    unitTestRunner: 'vitest-analog' as unknown as LibraryOptions['unitTestRunner'],
    standalone: true,
    skipModule: true,
    skipTests: true,
    strict: true,
    changeDetection: 'OnPush',
    viewEncapsulation: 'None',
    skipFormat: true,
  });

  // Drop the placeholder component the library generator emits – we overlay
  // our own archetype skeleton instead.
  tree.delete(joinPathFragments(projectRoot, 'src', 'lib'));

  const substitutions = {
    fileName,
    className,
    propertyName,
    selector: archetype === 'directive' ? `[ngc-${fileName}]` : `ngc-${fileName}`,
    attr: `ngc-${fileName}`,
    archetype,
    summary: options.summary ?? `The ${className} component.`,
  };
  generateFiles(tree, joinPathFragments(__dirname, 'files', archetype), projectRoot, substitutions);
  stampPackageEntryPoint(tree, projectRoot, substitutions);
  if (archetype === 'directive') {
    stampCoreStyles(tree, substitutions);
  }

  stampDemoStub(tree, substitutions, options.category ?? 'form');
  stampE2eStub(tree, substitutions);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  // ngc directives use kebab-case attribute selectors (`<button ngc-button>`,
  // spec 001), but the library generator's eslint config defaults them to
  // camelCase. That config is written to disk outside this generator's Tree
  // view, so we align it in the post-flush callback (runs after Nx writes the
  // files) rather than via the Tree, where the change would be clobbered.
  return () => {
    const eslintConfigPath = join(tree.root, projectRoot, 'eslint.config.mjs');
    const eslintConfig = readFileSync(eslintConfigPath, 'utf-8');
    if (eslintConfig.includes("style: 'camelCase'")) {
      writeFileSync(eslintConfigPath, eslintConfig.replace(/style: 'camelCase'/g, "style: 'kebab-case'"));
    }
  };
}

type Substitutions = {
  fileName: string;
  className: string;
  propertyName: string;
  selector: string;
  attr: string;
  archetype: string;
  summary: string;
};

/**
 * Every component lib is a secondary entry point of the one published package
 * (`@agentic-software/ng-components/<name>`): ng-packagr discovers it through
 * its `ng-package.json`, and the README replaces the Nx boilerplate because
 * it ships inside the package.
 */
function stampPackageEntryPoint(tree: Tree, projectRoot: string, { fileName, summary }: Substitutions): void {
  tree.write(
    joinPathFragments(projectRoot, 'ng-package.json'),
    `${JSON.stringify(
      {
        $schema: '../../../node_modules/ng-packagr/ng-package.schema.json',
        lib: { entryFile: 'src/index.ts' },
      },
      null,
      2,
    )}\n`,
  );
  tree.write(
    joinPathFragments(projectRoot, 'README.md'),
    [
      `# @agentic-software/ng-components/${fileName}`,
      '',
      summary,
      '',
      `Examples and the API table: [designsystem.angular.st/components/${fileName}](https://designsystem.angular.st/components/${fileName}).`,
      '',
    ].join('\n'),
  );
}

/**
 * Directive-only components are styled from core's global stylesheet (spec
 * 001 §3): stamp `components/_<name>.scss` and register it in `index.scss`.
 */
function stampCoreStyles(tree: Tree, { fileName, className }: Substitutions): void {
  if (!tree.exists(CORE_STYLES_INDEX_PATH)) {
    logger.warn(`ngc-component: ${CORE_STYLES_INDEX_PATH} not found – skipping the core stylesheet.`);
    return;
  }
  tree.write(
    joinPathFragments(CORE_STYLES_DIR, 'components', `_${fileName}.scss`),
    [
      `// ngc-${fileName} (directive on a native element – styles live here in core,`,
      '// spec 001 §3). Every visual value comes from a core token (var(--…)).',
      '',
      '@layer ngc {',
      `  .ngc-${fileName} {`,
      '    display: inline-flex;',
      '  }',
      '}',
      '',
    ].join('\n'),
  );
  updateFile(tree, CORE_STYLES_INDEX_PATH, (content) => `${content}@use 'components/${fileName}';\n`);
  logger.info(`ngc-component: ${className} styles stamped into ${CORE_STYLES_DIR}/components/_${fileName}.scss`);
}

/** Demo page + example, manifest entry (`wip`), index export, app loader entry. */
function stampDemoStub(tree: Tree, substitutions: Substitutions, category: string): void {
  const { fileName, className, summary } = substitutions;
  if (!tree.exists(MANIFEST_PATH)) {
    logger.warn(`ngc-component: ${MANIFEST_PATH} not found – skipping the demo stub.`);
    return;
  }

  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files', 'demo'),
    joinPathFragments(DEMOS_LIB_DIR, 'lib', fileName),
    substitutions,
  );

  const manifestEntry = [
    '  {',
    `    id: '${fileName}',`,
    `    name: '${className}',`,
    `    category: '${category}',`,
    `    route: '/components/${fileName}',`,
    `    status: 'wip',`,
    // JSON.stringify escapes quotes/backslashes – a summary like "User's
    // profile" must not break the stamped TS literal.
    `    summary: ${JSON.stringify(summary)},`,
    `    examples: ['${fileName}-basic'],`,
    '  },',
  ].join('\n');
  updateFile(tree, MANIFEST_PATH, (content) =>
    content.includes('= [];')
      ? content.replace('= [];', `= [\n${manifestEntry}\n];`)
      : content.replace(/\n\];/, `\n${manifestEntry}\n];`),
  );

  updateFile(tree, DEMOS_INDEX_PATH, (content) => `${content}export * from './lib/${fileName}/${fileName}-demo';\n`);

  // Relative import on purpose – the barrel would merge all demo pages into
  // one chunk.
  const loaderEntry = `  '${fileName}': () => import('../${fileName}/${fileName}-demo').then((m) => m.${className}Demo),`;
  if (tree.exists(DEMO_LOADERS_PATH)) {
    updateFile(tree, DEMO_LOADERS_PATH, (content) =>
      content.includes('= {};')
        ? content.replace('= {};', `= {\n${loaderEntry}\n};`)
        : content.replace(/\n\};/, `\n${loaderEntry}\n};`),
    );
  } else {
    logger.warn(`ngc-component: ${DEMO_LOADERS_PATH} not found – skipping the loader entry.`);
  }
}

/** Per-component Playwright spec skeleton (the e2e completeness gate expects it). */
function stampE2eStub(tree: Tree, substitutions: Substitutions): void {
  if (!tree.exists(E2E_COMPONENTS_DIR)) {
    logger.warn(`ngc-component: ${E2E_COMPONENTS_DIR}/ not found – skipping the e2e stub.`);
    return;
  }
  generateFiles(tree, joinPathFragments(__dirname, 'files', 'e2e'), E2E_COMPONENTS_DIR, substitutions);
}

function updateFile(tree: Tree, path: string, update: (content: string) => string): void {
  const content = tree.read(path, 'utf-8');
  if (content !== null) {
    tree.write(path, update(content));
  }
}

export default ngcComponentGenerator;
