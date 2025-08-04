const prettier = require('eslint-plugin-prettier');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: [
      '.eslintrc.js',
      '**/*.spec.ts',
      '**/*.e2e-spec.ts',
      'dist/**',
      'node_modules/**',
      'test/**',
      'scripts/**',
      '.hygen/**',
      '.vuepress/**',
      '**/*.test.js',
      '**/*.test.ts',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      // Only keep prettier formatting
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          tabWidth: 2,
          bracketSpacing: true,
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.cjs'],
    plugins: {
      prettier,
    },
    rules: {
      // Only keep prettier formatting
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          tabWidth: 2,
          bracketSpacing: true,
        },
      ],
    },
  },
];
