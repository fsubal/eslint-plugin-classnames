// @ts-check

/**
 * @fileoverview Rule to suggest using className() or clsx() in JSX className
 * @author fsubal
 */
"use strict";

/**
 * @type {import('eslint').Rule.RuleModule}
 */
const rule = {
  meta: {
    type: "suggestion",

    docs: {
      description: "suggest using className() or clsx() in JSX className",
      category: "Stylistic Issues",
      recommended: true,
      url: "https://github.com/fsubal/eslint-plugin-classnames/tree/main/docs/rules/prefer-classnames-function.md",
    },

    fixable: "code",

    messages: {
      useFunction:
        "The className has more than {{ maxSpaceSeparetedClasses }} classes. Use {{ functionName }}() instead.",
    },

    schema: [
      {
        type: "object",
        functionName: false,
        properties: {
          maxSpaceSeparetedClasses: {
            type: "number",
          },
          functionName: {
            type: "string",
          },
        },
      },
    ],
  },

  // @ts-expect-error
  create(context) {
    const [{ maxSpaceSeparetedClasses = 1, functionName = "classNames" }] =
      context.options;

    return {
      /**
       * @param {import('estree-jsx').JSXAttribute} node
       */
      JSXAttribute(node) {
        if (node.name.name !== "className") {
          return;
        }

        if (node.value.type !== "Literal") {
          return;
        }

        if (typeof node.value.value !== "string") {
          return;
        }

        const classes = getClasses(node.value.value);

        if (classes.length > maxSpaceSeparetedClasses) {
          context.report({
            // @ts-expect-error
            node,
            messageId: "useFunction",
            data: {
              maxSpaceSeparetedClasses,
              functionName,
            },
            suggest: [
              {
                desc: `Call ${functionName}() instead`,
                fix(fixer) {
                  return fixer.replaceText(
                    // @ts-expect-error
                    node,
                    `className={${functionName}(${classes
                      .map((className) => JSON.stringify(className))
                      .join(", ")})}`
                  );
                },
              },
            ],
          });
        }
      },
    };
  },
};

module.exports = rule;

/**
 * @param {string} value
 */
function getClasses(value) {
  if (!value) {
    return [];
  }

  return value.split(/\s+/);
}
