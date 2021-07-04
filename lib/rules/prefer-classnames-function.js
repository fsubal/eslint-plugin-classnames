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
    avoidFunction:
      "Do not use {{ functionName }}() when you have no greater than {{ maxSpaceSeparetedClasses }} classes.",
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

            return suggestToUseFunctionIfViolated(node, node.value.value);
          }

          // className={...}
          case "JSXExpressionContainer": {
            // className={`bg-blue-300 block`}
            if (node.value.expression.type === "TemplateLiteral") {
              const { quasis } = node.value.expression;
              // ignore if template has multiple elements
              // like `bg-blue-300 block ${1} hoge`
              if (quasis.length !== 1) {
                return;
              }

              return suggestToUseFunctionIfViolated(node, quasis[0].value.raw);
            }

            if (node.value.expression.type === "CallExpression") {
              const args = node.value.expression.arguments;
              if (args.length > maxSpaceSeparetedClasses) {
                return;
              }

              if (
                !args.every(
                  /**
                   * @returns {arg is import("estree").Literal}
                   */
                  (arg) => arg.type === "Literal"
                )
              ) {
                return;
              }

              if (
                !args.every(
                  /**
                   * @returns {arg is import("estree").Literal & { value: string }}
                   */
                  (arg) => typeof arg.value === "string"
                )
              ) {
                return;
              }

              // having multiple class in single string
              if (args.some((arg) => /\s+/g.test(arg.value))) {
                return;
              }

              return suggestToAvoidFunction(
                node,
                args.map(({ value }) => value)
              );
            }
          }
        }
      },
    };

    /**
     * @param {import('estree-jsx').JSXAttribute} node
     * @param {string} classString
     */
    function suggestToUseFunctionIfViolated(node, classString) {
      const classes = getClasses(classString);

      if (classes.length <= maxSpaceSeparetedClasses) {
        return;
      }

      context.report({
        // @ts-expect-error
        node,
        messageId: "useFunction",
        data: {
          maxSpaceSeparetedClasses,
          functionName,
        },
        fix(fixer) {
          return fixer.replaceText(
            // @ts-expect-error
            node,
            `className={${functionName}(${classes
              .map((className) => JSON.stringify(className))
              .join(", ")})}`
          );
        },
      });
    }

    /**
     * @param {import('estree-jsx').JSXAttribute} node
     * @param {string[]} classes
     */
    function suggestToAvoidFunction(node, classes) {
      context.report({
        // @ts-expect-error
        node,
        messageId: "avoidFunction",
        data: {
          maxSpaceSeparetedClasses,
          functionName,
        },
        fix(fixer) {
          return fixer.replaceText(
            // @ts-expect-error
            node,
            `className="${classes.join(" ")}"`
          );
        },
      });
    }
  },
};

module.exports = rule;
