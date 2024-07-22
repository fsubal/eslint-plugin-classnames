// 本当のeslint.configはesmなのだが、mochaで動くように一旦こうしてみる
module.exports = [{
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: "module",

    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
}];