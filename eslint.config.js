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
              ],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:domain',
                'type:ui',
                'type:data-access',
                'type:util',
                'type:api',
                'type:shared-data-access',
                'type:shared-util',
                'type:shared-ui',
              ],
            },
            {
              sourceTag: 'type:domain',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:data-access',
                'type:util',
                'type:api',
                'type:shared-data-access',
                'type:shared-util',
                'type:shared-ui',
              ],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:shared-data-access',
                'type:shared-util',
              ],
            },
            {
              sourceTag: 'type:shared-data-access',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:shared-util',
                'type:shared-data-access',
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
              ],
            },
            {
              sourceTag: 'type:shared-ui',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:shared-util',
                'type:data-access',
                'type:shared-data-access',
              ],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:shared-util'],
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
                'type:data-access',
                'type:util',
                'type:shared-data-access',
                'type:shared-util',
              ],
            },
            {
              sourceTag: 'scope:client-web',
              onlyDependOnLibsWithTags: ['scope:client-web'],
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
              sourceTag: 'scope:admin-dashboard',
              onlyDependOnLibsWithTags: [
                'scope:admin-dashboard',
                'scope:client-web',
                'scope:api',
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
