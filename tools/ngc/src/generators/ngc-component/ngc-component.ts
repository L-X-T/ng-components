import { libraryGenerator } from '@nx/angular/generators';
import { formatFiles, generateFiles, type GeneratorCallback, joinPathFragments, logger, names, type Tree } from '@nx/devkit';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { NgcComponentGeneratorSchema } from './schema';

const NG_COMPONENTS_DIR = 'libs/ng-components';
const DEMOS_LIB_DIR = 'libs/ng-component-demos/src';
const MANIFEST_PATH = `${DEMOS_LIB_DIR}/lib/_manifest/manifest.ts`;
const DEMOS_INDEX_PATH = `${DEMOS_LIB_DIR}/index.ts`;
const DEMO_LOADERS_PATH = `${DEMOS_LIB_DIR}/lib/_loaders/index.ts`;
const E2E_COMPONENTS_DIR = 'apps/ng-components-demo-e2e/src/components';

/**
 * Stamps a new ng-components component in one command (spec 001/002/004):
 * - `libs/ng-components/<name>` lib (non-buildable, path alias,
 *   `type:components` tag) with the component/directive skeleton, SCSS, and a
 *   Vitest spec;
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
    importPath: `@angular-software/ng-components/${fileName}`,
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
    `    summary: '${summary}',`,
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
  // one chunk (review 2026-07-11 E2).
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
