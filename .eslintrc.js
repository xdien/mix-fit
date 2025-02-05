// @ts-check
/// <reference path="./types/eslint-typegen.d.ts" />

/**
 * @type {import('./types/eslint-typegen').RuleOptions}
 */
const rules = {
  'n/no-extraneous-import': 'off',
  'n/no-missing-import': 'off',
  'canonical/filename-match-exported': 'error',
  // 'canonical/no-unused-exports': ['error', {tsConfigPath: './tsconfig.eslint.json'}],
  // 'canonical/id-match': [
  //   'error',
  //   '(^[A-Za-z]+(?:[A-Z][a-z]*)*\\d*$)|(^[A-Z]+(_[A-Z]+)*(_\\d$)*$)|(^(_|\\$)$)',
  //   {
  //     'ignoreDestructuring': true,
  //     'ignoreNamedImports': true,
  //     'onlyDeclarations': true,
  //     'properties': true,
  //   },
  // ],
  'canonical/no-restricted-strings': 'error',
  'canonical/no-use-extend-native': 'error',
  'canonical/prefer-inline-type-import': 'off',
  'unicorn/prevent-abbreviations': 'off',
  'unicorn/no-abusive-eslint-disable': 'off',
  'unicorn/no-null': 'off',
  'unicorn/no-static-only-class': 'off',
  'unicorn/prefer-module': 'off',
  'unicorn/expiring-todo-comments': 'off',
  'sonarjs/no-duplicate-string': 'off',
  'import/no-unresolved': [
    'error',
    { ignore: ['^@hr-drone/*', '^firebase-admin/.+'] },
  ],
  'import/no-duplicates': ['error'],
  'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
  'prettier/prettier': [
    'error',
    {
      singleQuote: true,
      trailingComma: 'all',
      tabWidth: 2,
      bracketSpacing: true,
    },
  ],
  'import/newline-after-import': 'error',
  /**
   * plugin:simple-import-sort
   */
  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',
  /**
   * plugin:typescript-eslint
   */
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  '@typescript-eslint/adjacent-overload-signatures': 'error',
  'max-params': ['error', 7],
  '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
  '@typescript-eslint/ban-types': [
    'error',
    {
      types: {
        Object: {
          message: 'Avoid using the `Object` type. Did you mean `object`?',
        },
        Function: {
          message:
            'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.',
        },
        Boolean: {
          message: 'Avoid using the `Boolean` type. Did you mean `boolean`?',
          fixWith: 'boolean',
        },
        Number: {
          message: 'Avoid using the `Number` type. Did you mean `number`?',
          fixWith: 'number',
        },
        Symbol: {
          message: 'Avoid using the `Symbol` type. Did you mean `symbol`?',
          fixWith: 'symbol',
        },
        String: {
          message: 'Avoid using the `String` type. Did you mean `string`?',
          fixWith: 'string',
        },
        '{}': {
          message: 'Use Record<K, V> instead',
          fixWith: 'Record<K, V>',
        },
        object: {
          message: 'Use Record<K, V> instead',
          fixWith: 'Record<K, V>',
        },
      },
    },
  ],
  '@typescript-eslint/explicit-member-accessibility': [
    'off',
    {
      overrides: {
        constructors: 'off',
      },
    },
  ],
  '@typescript-eslint/member-delimiter-style': [
    'error',
    {
      multiline: {
        delimiter: 'semi',
        requireLast: true,
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false,
      },
    },
  ],
  '@typescript-eslint/member-ordering': 'off',
  '@typescript-eslint/no-extraneous-class': 'off',
  '@typescript-eslint/no-angle-bracket-type-assertion': 'off',
  '@typescript-eslint/no-empty-function': 'error',
  '@typescript-eslint/no-unnecessary-condition': 'error',
  '@typescript-eslint/no-confusing-non-null-assertion': 'warn',
  '@typescript-eslint/no-duplicate-enum-values': 'error',
  '@typescript-eslint/no-empty-interface': 'error',
  '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-inferrable-types': 'error',
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/ban-ts-comment': 'error',
  '@typescript-eslint/ban-tslint-comment': 'error',
  '@typescript-eslint/consistent-indexed-object-style': 'error',
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
  ],
  '@typescript-eslint/no-misused-new': 'error',
  '@typescript-eslint/restrict-template-expressions': 'off',
  '@typescript-eslint/no-require-imports': 'error',
  'keyword-spacing': 'off',
  '@typescript-eslint/keyword-spacing': 'error',
  '@typescript-eslint/no-namespace': 'error',
  '@typescript-eslint/no-this-alias': 'error',
  '@typescript-eslint/no-use-before-define': 'error',
  '@typescript-eslint/no-var-requires': 'error',
  '@typescript-eslint/prefer-for-of': 'error',
  '@typescript-eslint/prefer-function-type': 'error',
  '@typescript-eslint/prefer-namespace-keyword': 'error',
  '@typescript-eslint/quotes': [
    'error',
    'single',
    {
      avoidEscape: true,
      allowTemplateLiterals: true,
    },
  ],
  '@typescript-eslint/semi': ['error', 'always'],
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'default',
      format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
      filter: {
        regex: '^_.*$',
        match: false,
      },
    },
    {
      selector: 'variable',
      format: ['camelCase', 'UPPER_CASE'],
    },
    {
      selector: 'interface',
      format: ['PascalCase'],
      prefix: ['I'],
    },
    {
      selector: 'typeLike',
      format: ['PascalCase'],
    },
    {
      selector: 'memberLike',
      modifiers: ['private'],
      format: ['camelCase'],
      leadingUnderscore: 'forbid',
    },
    {
      selector: 'variable',
      types: ['boolean'],
      format: ['PascalCase'],
      prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
    },
    {
      selector: 'class',
      format: ['PascalCase'],
      suffix: [
        'Dto',
        'Entity',
        'Repository',
        'Service',
        'Controller',
        'Gateway',
        'Module',
        'Handler',
      ],
    },
    {
      selector: 'enum',
      format: ['PascalCase'],
      suffix: ['Enum', 'Type', 'Status'],
    },
  ],
  '@typescript-eslint/type-annotation-spacing': 'error',
  '@typescript-eslint/unified-signatures': 'error',
  '@typescript-eslint/interface-name-prefix': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-unused-expressions': ['error'],
  /**
   * plugin:eslint
   */
  'no-await-in-loop': 'error',
  'padding-line-between-statements': [
    'error',
    { blankLine: 'always', prev: '*', next: 'return' },
    { blankLine: 'always', prev: '*', next: 'try' },
    { blankLine: 'always', prev: 'try', next: '*' },
    { blankLine: 'always', prev: '*', next: 'block-like' },
    { blankLine: 'always', prev: 'block-like', next: '*' },
    { blankLine: 'always', prev: '*', next: 'throw' },
    { blankLine: 'always', prev: 'var', next: '*' },
  ],
  'arrow-body-style': 'error',
  'arrow-parens': ['error', 'always'],
  complexity: 'off',
  'no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: 'rxjs/Rx',
          message: "Please import directly from 'rxjs' instead",
        },
      ],
    },
  ],
  'object-curly-spacing': ['error', 'always'],
  'no-multi-spaces': 'error',
  'no-useless-return': 'error',
  'no-else-return': 'error',
  'no-implicit-coercion': 'error',
  'constructor-super': 'error',
  yoda: 'error',
  strict: ['error', 'never'],
  curly: 'error',
  'dot-notation': 'error',
  'eol-last': 'error',
  eqeqeq: ['error', 'smart'],
  'guard-for-in': 'error',
  'id-match': 'error',
  'max-classes-per-file': 'off',
  'max-len': [
    'error',
    {
      code: 150,
    },
  ],
  'new-parens': 'error',
  'no-caller': 'error',
  'no-cond-assign': 'error',
  'no-constant-condition': 'error',
  'no-dupe-else-if': 'error',
  'lines-between-class-members': ['error', 'always'],
  'no-console': [
    'error',
    {
      allow: [
        'info',
        'dirxml',
        'warn',
        'error',
        'dir',
        'timeLog',
        'assert',
        'clear',
        'count',
        'countReset',
        'group',
        'groupCollapsed',
        'groupEnd',
        'table',
        'Console',
        'markTimeline',
        'profile',
        'profileEnd',
        'timeline',
        'timelineEnd',
        'timeStamp',
        'context',
      ],
    },
  ],
  'no-debugger': 'error',
  'no-duplicate-case': 'error',
  'no-empty': 'error',
  'no-eval': 'error',
  'no-extra-bind': 'error',
  'no-fallthrough': 'error',
  'no-invalid-this': 'error',
  'no-irregular-whitespace': 'error',
  'no-multiple-empty-lines': [
    'error',
    {
      max: 1,
    },
  ],
  'no-new-func': 'error',
  'no-new-wrappers': 'error',
  'no-redeclare': 'error',
  'no-return-await': 'error',
  'no-sequences': 'error',
  'no-sparse-arrays': 'error',
  'no-template-curly-in-string': 'error',
  'no-shadow': 'off',
  'no-throw-literal': 'error',
  'no-trailing-spaces': 'error',
  'no-undef-init': 'error',
  'no-unsafe-finally': 'error',
  'no-unused-labels': 'error',
  'no-var': 'error',
  'object-shorthand': 'error',
  'prefer-const': 'error',
  'prefer-object-spread': 'error',
  'quote-props': ['error', 'consistent-as-needed'],
  radix: 'error',
  'use-isnan': 'error',
  'valid-typeof': 'off',
  'space-before-function-paren': 'off',
};
/**
 * @type {import('eslint').Linter.FlatConfig}
 */
module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    jest: true,
    es6: true,
    node: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  parserOptions: {
    ecmaVersion: 2022,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  extends: [
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:unicorn/recommended',
    'plugin:import/recommended',
    'plugin:sonarjs/recommended',
    'plugin:promise/recommended',
    'plugin:n/recommended',
    'plugin:deprecation/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'prettier',
    'simple-import-sort',
    'import',
    'unicorn',
    'sonarjs',
    'promise',
    'canonical',
    'n',
  ],
  rules,
};
