const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const nxEslintPlugin = require('@nx/eslint-plugin');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  { plugins: { '@nx': nxEslintPlugin } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:util',
                'type:api',
                'type:shell',
                'type:data-access',
                'type:shared-data-access',
                'type:shared-util',
                'type:shared-ui',
                'type:shared-type',
              ],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:data-access',
                'type:util',
                'type:api',
                'type:shared-feature',
                'type:shared-data-access',
                'type:shared-util',
                'type:shared-ui',
                'type:shared-type',
              ],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:shared-data-access',
                'type:shared-util',
                'type:shared-type',
              ],
            },
            {
              sourceTag: 'type:shared-data-access',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:shared-util',
                'type:shared-data-access',
                'type:shared-type',
              ],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:data-access',
                'type:shared-data-access',
                'type:shared-ui',
                'type:shared-util',
                'type:shared-type',
              ],
            },
            {
              sourceTag: 'type:shared-ui',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:shared-util',
                'type:data-access',
                'type:shared-data-access',
                'type:shared-type',
              ],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: [
                'type:shared-util',
                'type:shared-type',
              ],
            },
            {
              sourceTag: 'type:shared-type',
              onlyDependOnLibsWithTags: [],
            },
            {
              sourceTag: 'type:shared-util',
              onlyDependOnLibsWithTags: [],
            },
            {
              sourceTag: 'type:shell',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:api',
                'type:shared-feature',
                'type:data-access',
                'type:util',
                'type:shared-data-access',
                'type:shared-util',
              ],
            },
            {
              sourceTag: 'scope:client-web',
              onlyDependOnLibsWithTags: ['scope:client-web', 'scope:shared'],
            },
            {
              sourceTag: 'scope:api',
              onlyDependOnLibsWithTags: ['scope:api'],
            },
            {
              sourceTag: 'type:api',
              onlyDependOnLibsWithTags: [
                'type:data-access',
                'type:util',
                'type:shared-data-access',
                'type:shared-util',
              ],
            },
            {
              sourceTag: 'scope:client-web',
              onlyDependOnLibsWithTags: ['scope:client-web', 'scope:shared'],
            },
            {
              sourceTag: 'scope:admin-dashboard',
              onlyDependOnLibsWithTags: [
                'scope:admin-dashboard',
                'scope:shared',
              ],
            },
          ],
        },
      ],
    },
  },
  ...compat
    .config({
      extends: ['plugin:@nx/typescript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        ...config.rules,
        // '@typescript-eslint/no-empty-function': 'off',
      },
    })),
  ...compat
    .config({
      extends: ['plugin:@nx/javascript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.js', '**/*.jsx'],
      rules: {
        ...config.rules,
      },
    })),
  ...compat
    .config({
      env: {
        jest: true,
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
      rules: {
        ...config.rules,
      },
    })),
];
