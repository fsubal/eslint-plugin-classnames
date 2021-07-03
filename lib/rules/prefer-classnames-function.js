// @ts-check
"use strict";

const { documentUrl, getClasses } = require("../utils");

/**
 * @type {import('eslint').Rule.RuleMetaData}
 */
const meta = {
  type: "suggestion",

  docs: {
    description: "suggest using className() or clsx() in JSX className",
    category: "Stylistic Issues",
    recommended: true,
    url: documentUrl("prefer-classnames-function"),
  },

  fixable: "code",

  messages: {
    useFunction:
      "The className has more than {{ maxSpaceSeparetedClasses }} classes. Use {{ functionName }}() instead.",
    splitArguments:
      "An argument of {{ functionName }}() has more than {{ maxSpaceSeparetedClasses }} classes. Should be written one by one.",
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
};

/**
 * @type {import('eslint').Rule.RuleModule}
 */
const rule = {
  meta,

  // @ts-expect-error
  create(context) {
    const [params = {}] = context.options;
    const { maxSpaceSeparetedClasses = 1, functionName = "classNames" } =
      params;

    return {
      /**
       * @param {import('estree-jsx').JSXAttribute} node
       */
      JSXAttribute(node) {
        if (node.name.name !== "className") {
          return;
        }

        switch (node.value.type) {
          // className="bg-blue-300 block"
          case "Literal": {
            if (typeof node.value.value !== "string") {
              return;
            }

            return reportIfViolated(node, node.value.value);
          }

          // className={...}
          case "JSXExpressionContainer": {
            switch (node.value.expression.type) {
              // className={`bg-blue-300 block`}
              case "TemplateLiteral": {
                const { quasis } = node.value.expression;
                // ignore if template has multiple elements
                // like `bg-blue-300 block ${1} hoge`
                if (quasis.length !== 1) {
                  return;
                }

                return reportIfViolated(node, quasis[0].value.raw);
              }

              // className={classNames("bg-blue-300 block")}
              case "CallExpression": {
                const { expression } = node.value;
                if (expression.callee.type !== "Identifier") {
                  return;
                }

                if (expression.callee.name !== functionName) {
                  return;
                }

                // NOTICE: Not supporting special case like
                // classNames("bg-blue-300 block", "relative", "text-white hover:text-white")
                if (expression.arguments.length !== 1) {
                  return;
                }

                const [arg] = expression.arguments;
                if (arg.type !== "Literal") {
                  return;
                }

                if (typeof arg.value !== "string") {
                  return;
                }

                return reportIfViolated(node, arg.value, "splitArguments");
              }
            }
          }
        }
      },
    };

    /**
     *
     * @param {import('estree-jsx').JSXAttribute} node
     * @param {string} classString
     * @param {string} messageId
     */
    function reportIfViolated(node, classString, messageId = "useFunction") {
      const classes = getClasses(classString);

      if (classes.length <= maxSpaceSeparetedClasses) {
        return;
      }

      context.report({
        // @ts-expect-error
        node,
        messageId,
        data: {
          maxSpaceSeparetedClasses,
          functionName,
        },
        suggest: [
          {
            desc: `Convert to ${functionName}("...", "...", ...) properly`,
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

module.exports = rule;
