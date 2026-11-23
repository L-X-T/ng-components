import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/vite.config.*.timestamp*', '**/vitest.config.*.timestamp*', '**/*.snippet.ts'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      // Dependency directions (specs 001–004):
      //   ng-components/*        → (nothing internal)
      //   ng-component-demos     → ng-components
      //   ng-components-demo app → ng-component-demos, ng-components
      //   e2e                    → ng-component-demos (manifest only)
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [
            '^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$',
            // The manifest secondary entry is a tiny, data-only module meant
            // for static import (nav/routes/e2e matrix) even though the demo
            // pages themselves are lazy-loaded from the same lib.
            '@ngc-internal/demos/manifest',
          ],
          depConstraints: [
            {
              sourceTag: 'type:components',
              onlyDependOnLibsWithTags: ['type:components'],
            },
            {
              sourceTag: 'type:demos',
              onlyDependOnLibsWithTags: ['type:demos', 'type:components'],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:demos', 'type:components'],
            },
            {
              sourceTag: 'type:e2e',
              onlyDependOnLibsWithTags: ['type:demos'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.json'],
    // Override or add rules here
    rules: {},
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
