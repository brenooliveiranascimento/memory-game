// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  // Config for src/ directory - use TypeScript resolver
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'import/no-unresolved': 'error',
    },
  },
  // Config for root files - disable import resolution
  {
    files: ['components/**/*', 'hooks/**/*', 'constants/**/*'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },
]);
