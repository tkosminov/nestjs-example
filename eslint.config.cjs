const prettier_plugin = require('eslint-plugin-prettier/recommended');
const path = require('node:path');
const typescript_eslint = require('typescript-eslint');

const default_ignores_pool = ['**/.git/**/*', '**/dist/**/*', '**/node_modules/**/*', '**/uploads/**/*'];

const root_path = path.dirname(__filename);
const tsconfig_path = path.resolve(root_path, 'tsconfig.json');

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  ...[typescript_eslint.configs.recommendedTypeChecked[1], typescript_eslint.configs.recommendedTypeChecked[2]].map((config) => ({
    ...config,
    languageOptions: {
      parser: typescript_eslint.parser,
      parserOptions: {
        sourceType: 'module',
        tsconfigRootDir: root_path,
        project: tsconfig_path,
      },
    },
    plugins: {
      '@typescript-eslint': typescript_eslint.plugin,
    },
    rules: {
      'no-unused-vars': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['src/*'],
              message: 'No import from src!',
            },
          ],
        },
      ],
    },
    files: ['**/*.{ts,mts}'],
    ignores: [...default_ignores_pool],
  })),
  {
    ...typescript_eslint.configs.stylisticTypeChecked[2],
    languageOptions: {
      parser: typescript_eslint.parser,
      parserOptions: {
        sourceType: 'module',
        tsconfigRootDir: root_path,
        project: tsconfig_path,
        projectService: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescript_eslint.plugin,
    },
    files: ['**/*.{ts,mts}'],
    ignores: [...default_ignores_pool],
  },
  {
    ...prettier_plugin,
    name: 'prettier/recommended',
    ignores: [...default_ignores_pool],
  },
];
