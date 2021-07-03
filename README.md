# eslint-plugin-classnames

Warn and formats long classNames usage in JSX

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-classnames`:

```
$ npm install eslint-plugin-classnames --save-dev
```

## Usage

Add `classnames` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["classnames"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "classnames/prefer-classnames-function": 2
  }
}
```

## Supported Rules

✔: Enabled in the [`recommended`](#recommended) configuration.\
🔧: Fixable with [`eslint --fix`](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems).

|  ✔  | 🔧  | Rule                                                                              | Description                                                                     |
| :-: | :-: | :-------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
|  ✔  | 🔧  | [classnames/prefer-classnames-function](docs/rules/prefer-classnames-function.md) | suggest using className() or clsx() in JSX className                            |
|  ✔  | 🔧  | [classnames/one-by-one-arguments](docs/rules/one-by-one-arguments.md)             | suggest not to include multiple classes in an argument of className() or clsx() |
