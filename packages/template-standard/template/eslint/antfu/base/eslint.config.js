import antfu from '@antfu/eslint-config';

export default antfu({
  type: '<%= appType %>',
  ignores: [],
  rules: {
    'style/semi': ['error', 'always'],
    'style/quotes': ['error', 'single', {
      avoidEscape: true,
      allowTemplateLiterals: true,
    }],
    'style/quote-props': ['error', 'as-needed'],
    'style/member-delimiter-style': [
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
    'style/arrow-parens': ['error', 'as-needed'],
    'style/brace-style': 'off',
    'no-console': 'off',
    'node/prefer-global/process': 'off',
    'ts/explicit-function-return-type': 'off',
    'antfu/top-level-function': 'off',
    'antfu/if-newline': 'off',
    'perfectionist/sort-imports': 'off',
    'no-template-curly-in-string': 'off',
  },
});
