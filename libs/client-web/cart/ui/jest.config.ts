const esModules = [
  '@angular',
  '@ngrx',
  'primeng',
  '@primeuix',
  '@primeuix/styled',
  '@primeuix/utils',
  '@e-commerce/client-web/shared/app-config',
];

/* eslint-disable */
export default {
  displayName: 'ui',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../../../coverage/libs/client-web/cart/ui',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  // transformIgnorePatterns: [
  //   'node_modules/(?!.*\\.mjs$)',
  //   'node_modules/(?!@angular|@ngrx)',
  //   'node_modules/(?!primeng)',
  // ],
  transformIgnorePatterns: [
    `node_modules/(?!.*\\.mjs$|${esModules.join('|')})`,
    // 'node_modules/(?!@angular|@ngrx|primeng|@primeuix)',
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
