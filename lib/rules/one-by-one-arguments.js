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
      "An argument of {{ functionName }}() has multiple classes. Should be written one by one.",
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

        const isViolated = node.arguments.some(function isViolated(arg) {
          if (arg.type === "ArrayExpression") {
            return arg.elements.some(isViolated);
          }

          if (arg.type === "LogicalExpression") {
            return isViolated(arg.right);
          }

          if (arg.type === "ConditionalExpression") {
            return isViolated(arg.consequent) || isViolated(arg.alternate);
          }

          if (arg.type !== "Literal") {
            return false;
          }

          if (typeof arg.value !== "string") {
            return false;
          }

          const classes = getClasses(arg.value);

          return classes.length > 1;
        });

        if (isViolated) {
          handleViolated(node);
        }
      },
    };

    /**
     * @param {import("estree").Node | import("eslint").AST.Token} node
     */
    function shouldWrapAsArray(node) {
      return node.type !== "ArrayExpression";
    }

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

        /**
         * @returns {import("eslint").Rule.Fix[]}
         */
        fix(fixer) {
          /**
           * @param {import("estree").Node | import("eslint").AST.Token} node
           * @returns {import("eslint").Rule.Fix | import("eslint").Rule.Fix[]}
           */
          function toMultiString(node, wrapAsArray = false) {
            if (node.type === "ArrayExpression") {
              return node.elements.flatMap((e) => toMultiString(e));
            }

            if (node.type === "LogicalExpression") {
              return toMultiString(node.right, shouldWrapAsArray(node.right));
            }

            if (node.type === "ConditionalExpression") {
              return [
                toMultiString(
                  node.consequent,
                  shouldWrapAsArray(node.consequent)
                ),
                toMultiString(
                  node.alternate,
                  shouldWrapAsArray(node.alternate)
                ),
              ].flat();
            }

            if (node.type !== "Literal") {
              return [];
            }

            if (typeof node.value !== "string") {
              return [];
            }

            const classes = getClasses(node.value).map((className) =>
              JSON.stringify(className)
            );

            return fixer.replaceText(
              node,
              wrapAsArray && classes.length > 1
                ? `[${classes.join(", ")}]`
                : classes.join(", ")
            );
          }

          return node.arguments.flatMap((a) => toMultiString(a));
        },
      });
    }
  },
};

module.exports = rule;
