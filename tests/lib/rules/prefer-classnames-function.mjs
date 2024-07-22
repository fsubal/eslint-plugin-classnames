// @ts-check

import { RuleTester } from "eslint";
import rule from "../../../lib/rules/prefer-classnames-function.js";
import eslintConfig from "../../eslint.config.mjs";

const ruleTester = new RuleTester(eslintConfig[0]);

ruleTester.run("prefer-classnames-function", rule, {
  valid: [
    {
      code: '<button className="bg-blue-300">Hello</button>;',
      options: [
        {
          maxSpaceSeparatedClasses: 1,
        },
      ],
    },
    {
      code: '<button className={classNames("bg-blue-300", "block")}>Hello</button>;',
      options: [
        {
          maxSpaceSeparatedClasses: 1,
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
          maxSpaceSeparatedClasses: 1,
        },
      ],
    },
    {
      code: '<button className={clsx("bg-blue-300", "block")}>Hello</button>;',
      options: [
        {
          maxSpaceSeparatedClasses: 1,
        },
      ],
    },
    {
      code: '<button className="bg-blue-300 block">Hello</button>;',
      options: [
        {
          maxSpaceSeparatedClasses: 2,
        },
      ],
    },
    // Don't avoid function other than functionName
    {
      code: '<button className={otherFunction("bg-blue-300")}>Hello</button>;',
      options: [
        {
          maxSpaceSeparatedClasses: 1,
          functionName: "className",
        },
      ],
    },
  ],
  invalid: [
    {
      code: '<button className="bg-blue-300 block">Hello</button>;',
      options: [
        {
          maxSpaceSeparatedClasses: 1,
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
      output:
        '<button className={className("bg-blue-300", "block")}>Hello</button>;',
    },

    {
      code: '<button className="bg-blue-300 block">Hello</button>;',
      options: [
        {
          maxSpaceSeparatedClasses: 1,
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
      output:
        '<button className={clsx("bg-blue-300", "block")}>Hello</button>;',
    },

    {
      code: '<button className="bg-blue-300 block relative">Hello</button>;',
      options: [
        {
          maxSpaceSeparatedClasses: 2,
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
      output:
        '<button className={classNames("bg-blue-300", "block", "relative")}>Hello</button>;',
    },

    // avoid className
    {
      code: '<button className={classNames("bg-blue-300")}>Hello</button>;',
      options: [],
      errors: [
        {
          message:
            "Do not use classNames() when you have no greater than 1 classes.",
          suggestions: [
            {
              desc: 'Just use className="..."',
              output: '<button className="bg-blue-300">Hello</button>;',
            },
          ],
        },
      ],
      output: '<button className="bg-blue-300">Hello</button>;',
    },

    {
      code: '<button className={clsx("bg-blue-300", "text-white")}>Hello</button>;',
      options: [
        {
          maxSpaceSeparatedClasses: 2,
          functionName: 'clsx'
        },
      ],
      errors: [
        {
          message:
            "Do not use clsx() when you have no greater than 2 classes.",
          suggestions: [
            {
              desc: 'Just use className="..."',
              output:
                '<button className="bg-blue-300 text-white">Hello</button>;',
            },
          ],
        },
      ],
      output: '<button className="bg-blue-300 text-white">Hello</button>;',
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
      output: '<button className={classNames("bg-blue-300", "block")}>Hello</button>;',
    },
  ],
});
