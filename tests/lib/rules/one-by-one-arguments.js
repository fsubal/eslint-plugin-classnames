// @ts-check
"use strict";

const RuleTester = require("eslint").RuleTester;
const rule = require("../../../lib/rules/one-by-one-arguments");
const { parserOptions } = require("../../utils");

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run("one-by-one-arguments", rule, {
  valid: [
    {
      code: `<button
      className={classNames(
        "bg-blue-300",
        "block",
        "relative",
        "text-white",
        "hover:text-grey-100"
      )}
    >
      Hello
    </button>;
`,
      options: [],
    },
    {
      code: `<button
      className={classNames(["bg-blue-300", "block"], "relative", foo && [
        "text-white",
        "hover:text-grey-100",
      ])}
    >
      Hello
    </button>;
`,
      options: [],
    },
    {
      code: `<button className={classNames("bg-blue-300", "block", style.someClass)}>
      Hello
    </button>;
`,
      options: [],
    },

    {
      code: `
<button
  className={classNames(
    {
      "bg-blue-300 block": true,
    },
    "relative",
    ["text-white", "hover:text-grey-100"]
  )}
>
  Hello
</button>;
`,
      options: [],
    },
  ],

  invalid: [
    {
      code: `
<button
  className={classNames(
    "bg-blue-300 block",
    "relative",
    "text-white hover:text-grey-100"
  )}
>
  Hello
</button>;`,
      options: [],
      errors: [
        {
          message:
            "An argument of classNames() has multiple classes. Should be written one by one.",
          suggestions: [
            {
              desc: 'Convert to classNames("...", "...", ...) properly',
              output: `
<button
  className={classNames(
    "bg-blue-300", "block",
    "relative",
    "text-white", "hover:text-grey-100"
  )}
>
  Hello
</button>;`,
            },
          ],
        },
      ],
    },

    {
      code: `
<button
  className={classNames("bg-blue-300 block", foo && [
    "relative",
    "text-white hover:text-grey-100",
  ])}
>
  Hello
</button>;`,
      options: [],
      errors: [
        {
          message:
            "An argument of classNames() has multiple classes. Should be written one by one.",
          suggestions: [
            {
              desc: 'Convert to classNames("...", "...", ...) properly',
              output: `
<button
  className={classNames("bg-blue-300", "block", foo && [
    "relative",
    "text-white", "hover:text-grey-100",
  ])}
>
  Hello
</button>;`,
            },
          ],
        },
      ],
    },

    {
      code: `
<button className={classNames("bg-blue-300 block", style.someClass)}>
  Hello
</button>;`,
      options: [],
      errors: [
        {
          message:
            "An argument of classNames() has multiple classes. Should be written one by one.",
          suggestions: [
            {
              desc: 'Convert to classNames("...", "...", ...) properly',
              output: `
<button className={classNames("bg-blue-300", "block", style.someClass)}>
  Hello
</button>;`,
            },
          ],
        },
      ],
    },

    {
      code: `
<button
  className={clsx(
    "bg-blue-300 block",
    "relative",
    foo ? "text-white hover:text-grey-100" : "text-black"
  )}
>
  Hello
</button>;`,
      options: [
        {
          functionName: "clsx",
        },
      ],
      errors: [
        {
          message:
            "An argument of clsx() has multiple classes. Should be written one by one.",
          suggestions: [
            {
              desc: 'Convert to clsx("...", "...", ...) properly',
              output: `
<button
  className={clsx(
    "bg-blue-300", "block",
    "relative",
    foo ? ["text-white", "hover:text-grey-100"] : "text-black"
  )}
>
  Hello
</button>;`,
            },
          ],
        },
      ],
    },
  ],
});
