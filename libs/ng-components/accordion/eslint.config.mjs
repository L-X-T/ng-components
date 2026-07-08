import nx from '@nx/eslint-plugin';
import baseConfig from '../../../eslint.config.mjs';

export default [
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'ngc',
          style: 'kebab-case',
        },
      ],
      // ngc-accordion-trigger is a component with an attribute selector on a
      // native <button> (it renders the chevron indicator).
      '@angular-eslint/component-selector': [
        'error',
        {
          type: ['element', 'attribute'],
          prefix: 'ngc',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
