// @ts-check

/**
 * @fileoverview Warn and formats long classNames usage in JSX
 * @author fsubal
 */
"use strict";

module.exports = {
  rules: {
    "prefer-classnames-function": require("./rules/prefer-classnames-function"),
  },
  configs: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
};
