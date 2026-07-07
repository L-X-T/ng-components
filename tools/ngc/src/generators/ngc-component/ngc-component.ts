import { libraryGenerator } from '@nx/angular/generators';
import { formatFiles, generateFiles, type GeneratorCallback, joinPathFragments, names, type Tree } from '@nx/devkit';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { NgcComponentGeneratorSchema } from './schema';

const NG_COMPONENTS_DIR = 'libs/ng-components';

/**
 * Stamps a new ng-components component library:
 * `libs/ng-components/<name>` (non-buildable, path alias, `type:components`
 * tag) with the ngc component/directive skeleton, its SCSS, and a Vitest spec.
 *
 * The demo stub (in ng-component-demos) and the e2e stub (in
 * ng-component-demo-e2e) are added once that infrastructure exists (plan 000
 * phase 3, plans 002/004) – this generator gains those steps then.
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
  };
  generateFiles(tree, joinPathFragments(__dirname, 'files', archetype), projectRoot, substitutions);

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

export default ngcComponentGenerator;
