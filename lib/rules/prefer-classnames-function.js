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
  hasSuggestions: true,

  messages: {
    useFunction:
      "The className has more than {{ maxSpaceSeparatedClasses }} classes. Use {{ functionName }}() instead.",
    avoidFunction:
      "Do not use {{ functionName }}() when you have no greater than {{ maxSpaceSeparatedClasses }} classes.",
    suggestToUse: 'Convert to {{ functionName }}("...", "...", ...) properly',
    suggestToAvoid: 'Just use className="..."'
  },

  schema: [
    {
      type: "object",
      functionName: false,
      properties: {
        maxSpaceSeparatedClasses: {
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
  create(context) {
    const [params = {}] = context.options;
    const { maxSpaceSeparatedClasses = 1, functionName = "classNames" } =
      params;

    return {
      /**
       * @param {import('estree-jsx').JSXAttribute} node
       */
      JSXAttribute(node) {
        if (node.name.name !== "className") {
          return;
        }

        switch (node.value?.type) {
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

            if (
              node.value.expression.type === "CallExpression" && 
              // @ts-expect-error
              node.value.expression.callee.name === functionName
            ) {
              const args = node.value.expression.arguments;
              if (args.length > maxSpaceSeparatedClasses) {
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

      if (classes.length <= maxSpaceSeparatedClasses) {
        return;
      }

      /**
       * @param {import('eslint').Rule.RuleFixer} fixer
       * @returns {import('eslint').Rule.Fix}
       */
      function fix(fixer) {
        return fixer.replaceText(
          node,
          `className={${functionName}(${classes
            .map((className) => JSON.stringify(className))
            .join(", ")})}`
        );
      }

      context.report({
        node,
        messageId: "useFunction",
        data: {
          maxSpaceSeparatedClasses,
          functionName,
        },
        suggest: [
          { messageId: 'suggestToUse', data: { functionName }, fix }
        ],
        fix,
      });
    }

    /**
     * @param {import('estree-jsx').JSXAttribute} node
     * @param {string[]} classes
     */
    function suggestToAvoidFunction(node, classes) {
      /**
       * @param {import('eslint').Rule.RuleFixer} fixer
       * @returns {import('eslint').Rule.Fix}
       */
      function fix(fixer) {
        return fixer.replaceText(
          node,
          `className="${classes.join(" ")}"`
        );
      }

      context.report({
        node,
        messageId: "avoidFunction",
        data: {
          maxSpaceSeparatedClasses,
          functionName,
        },
        suggest: [
          { messageId: 'suggestToAvoid', data: { functionName }, fix }
        ],
        fix
      });
    }
  },
};

module.exports = rule;
