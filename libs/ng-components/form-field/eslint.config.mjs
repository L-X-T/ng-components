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
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ngc',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      // ngc-field-label associates with its control at runtime (NgpLabel sets
      // `for` automatically) – the static rule cannot see that.
      '@angular-eslint/template/label-has-associated-control': [
        'error',
        { labelComponents: [{ selector: 'label', inputs: ['for', 'ngc-field-label'] }] },
      ],
    },
  },
];
