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
    "classnames/rule-name": 2
  }
}
```

## Supported Rules

- Fill in provided rules here
