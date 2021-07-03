/**
 * @param {string} ruleName
 */
exports.documentUrl = (ruleName) => {
  return `https://github.com/fsubal/eslint-plugin-classnames/tree/main/docs/rules/${ruleName}.md`;
};

/**
 * @param {string} value
 */
exports.getClasses = (value) => {
  if (!value) {
    return [];
  }

  return value.split(/\s+/);
};
