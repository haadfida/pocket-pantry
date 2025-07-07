module.exports = {
  root: true,
  extends: ['universe/native', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['simple-import-sort'],
  parser: '@typescript-eslint/parser',
  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^react$'],
          ['^@?\\w'],
          ['^@/'],
          ['^\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
  },
}; 