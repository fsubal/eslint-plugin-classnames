// @ts-check
"use strict";

const { documentUrl, getClasses } = require("../utils");

/**
 * @type {import('eslint').Rule.RuleMetaData}
 */
const meta = {
  type: "suggestion",

  docs: {
    description:
      "suggest not to include multiple classes in an argument of classNames() or clsx()",
    category: "Stylistic Issues",
    recommended: true,
    url: documentUrl("one-by-one-arguments"),
  },

  fixable: "code",

  messages: {
    splitArguments:
      "An argument of {{ functionName }}() has mulitple classes. Should be written one by one.",
  },

  schema: [
    {
      type: "object",
      functionName: false,
      properties: {
        functionName: {
          type: "string",
        },
      },
    },
  ],
};

/**
 * @type {import('eslint').Rule.RuleModule}
 */
const rule = {
  meta,
  create(context) {
    const [params = {}] = context.options;
    const { functionName = "classNames" } = params;

    return {
      CallExpression(node) {
        if (node.callee.type !== "Identifier") {
          return;
        }

        if (node.callee.name !== functionName) {
          return;
        }

        const isViolated = node.arguments.some((arg) => {
          if (arg.type === "Literal") {
            if (typeof arg.value === "string") {
              const classes = getClasses(arg.value);

              return classes.length > 1;
            }
          }

          return false;
        });

        if (isViolated) {
          handleViolated(node);
        }
      },
    };

    /**
     * @param {import('estree').CallExpression} node
     */
    function handleViolated(node) {
      context.report({
        node,
        messageId: "splitArguments",
        data: {
          functionName,
        },
        suggest: [
          {
            desc: `Convert to ${functionName}("...", "...", ...) properly`,

            /**
             * @returns {import("eslint").Rule.Fix[]}
             */
            fix(fixer) {
              return node.arguments.flatMap(function stringToArray(arg) {
                if (arg.type === "ArrayExpression") {
                  return arg.elements.flatMap(stringToArray);
                }

                if (arg.type !== "Literal") {
                  return [];
                }

                if (typeof arg.value !== "string") {
                  return [];
                }

                return fixer.replaceText(
                  arg,
                  getClasses(arg.value)
                    .map((className) => JSON.stringify(className))
                    .join(", ")
                );
              });
            },
          },
        ],
      });
    }
  },
};

module.exports = rule;
