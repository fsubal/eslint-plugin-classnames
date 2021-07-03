// @ts-check
"use strict";

module.exports = {
  rules: {
    "prefer-classnames-function": require("./rules/prefer-classnames-function"),
    "one-by-one-arguments": require("./rules/one-by-one-arguments"),
  },
  configs: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
};
