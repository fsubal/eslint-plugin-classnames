# Rule to suggest using className() or clsx() in JSX className (classnames/prefer-classnames-function)

When your className= attribute has too many space-separated classes, this rule enforces you to use `classNames()` or `clsx()` function instead.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<button className="bg-blue-300 block">Hello</button>;
<button className={`bg-blue-300 block`}>Hello</button>;
<button className={classNames("bg-blue-300")}>Hello</button>;
```

Examples of **correct** code for this rule:

```jsx
<button className="bg-blue-300">Hello</button>;
<button className={classNames("bg-blue-300", "block")}>Hello</button>;
<button
  className={classNames("bg-blue-300", "block", isRelative && "relative")}
>
  Hello
</button>;
<button className={clsx("bg-blue-300", "block")}>Hello</button>;
<button className={clsx("bg-blue-300", "block", isRelative && "relative")}>
  Hello
</button>;
```

## Rule Options

```js
...
"classnames/prefer-classnames-function": [<enabled>, {
  "maxSpaceSeparatedClasses": <number>,
  "functionName": <string>
}]
...
```

You can set `maxSpaceSeparatedClasses` so that you can allow space-separated classes to be written more than once. It defaults to `1`.

You can set `functionName` to `classNames` or `clsx`.

## When Not To Use It

If you want to allow space-separated classes, you can disable this rule.
