// @ts-check

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [{
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: "module",

    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
}];
