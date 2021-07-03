// @ts-check
"use strict";

const RuleTester = require("eslint").RuleTester;
const rule = require("../../../lib/rules/prefer-classnames-function");
const { parserOptions } = require("../../utils");

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run("prefer-classnames-function", rule, {
  valid: [
    {
      code: '<button className="bg-blue-300">Hello</button>;',
      options: [
        {
          maxSpaceSeparetedClasses: 1,
        },
      ],
    },
    {
      code: '<button className={classNames("bg-blue-300", "block")}>Hello</button>;',
      options: [
        {
          maxSpaceSeparetedClasses: 1,
        },
      ],
    },
    {
      code: `
<button
  className={classNames("bg-blue-300", "block", isRelative && "relative")}
>
  Hello
</button>;
      `,
      options: [
        {
          maxSpaceSeparetedClasses: 1,
        },
      ],
    },
    {
      code: '<button className={clsx("bg-blue-300", "block")}>Hello</button>;',
      options: [
        {
          maxSpaceSeparetedClasses: 1,
        },
      ],
    },
    {
      code: '<button className="bg-blue-300 block">Hello</button>;',
      options: [
        {
          maxSpaceSeparetedClasses: 2,
        },
      ],
    },
  ],
  invalid: [
    {
      code: '<button className="bg-blue-300 block">Hello</button>;',
      options: [
        {
          maxSpaceSeparetedClasses: 1,
          functionName: "className",
        },
      ],
      errors: [
        {
          message:
            "The className has more than 1 classes. Use className() instead.",
          suggestions: [
            {
              desc: 'Convert to className("...", "...", ...) properly',
              output:
                '<button className={className("bg-blue-300", "block")}>Hello</button>;',
            },
          ],
        },
      ],
    },

    {
      code: '<button className="bg-blue-300 block">Hello</button>;',
      options: [
        {
          maxSpaceSeparetedClasses: 1,
          functionName: "clsx",
        },
      ],
      errors: [
        {
          message: "The className has more than 1 classes. Use clsx() instead.",
          suggestions: [
            {
              desc: 'Convert to clsx("...", "...", ...) properly',
              output:
                '<button className={clsx("bg-blue-300", "block")}>Hello</button>;',
            },
          ],
        },
      ],
    },

    {
      code: '<button className="bg-blue-300 block relative">Hello</button>;',
      options: [
        {
          maxSpaceSeparetedClasses: 2,
        },
      ],
      errors: [
        {
          message:
            "The className has more than 2 classes. Use classNames() instead.",
          suggestions: [
            {
              desc: 'Convert to classNames("...", "...", ...) properly',
              output:
                '<button className={classNames("bg-blue-300", "block", "relative")}>Hello</button>;',
            },
          ],
        },
      ],
    },

    // using template literal
    {
      code: "<button className={`bg-blue-300 block`}>Hello</button>;",
      options: [],
      errors: [
        {
          message:
            "The className has more than 1 classes. Use classNames() instead.",
          suggestions: [
            {
              desc: 'Convert to classNames("...", "...", ...) properly',
              output:
                '<button className={classNames("bg-blue-300", "block")}>Hello</button>;',
            },
          ],
        },
      ],
    },

    // string separated inside function
    {
      code: '<button className={classNames("bg-blue-300 block")}>Hello</button>;',
      options: [],
      errors: [
        {
          message:
            "An argument of classNames() has more than 1 classes. Should be written one by one.",
          suggestions: [
            {
              desc: 'Convert to classNames("...", "...", ...) properly',
              output:
                '<button className={classNames("bg-blue-300", "block")}>Hello</button>;',
            },
          ],
        },
      ],
    },
  ],
});
