import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

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
          prefix: 'ngcDemo',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ngc-demo',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {
      // ngc form controls on native <button> render their own indicator
      // content; their accessible name comes from an associated ngc-label.
      '@angular-eslint/template/elements-content': ['error', { allowList: ['ngc-checkbox', 'ngc-radio-item'] }],
      // ngc-field-label associates with its control at runtime (NgpLabel sets
      // `for` automatically) – the static rule cannot see that. Association is
      // covered by form-field unit tests and e2e.
      '@angular-eslint/template/label-has-associated-control': [
        'error',
        { labelComponents: [{ selector: 'label', inputs: ['for', 'ngc-field-label'] }] },
      ],
    },
  },
];
