/** @type {import("prettier").Config} */
module.exports = {
  printWidth: 140,
  semi: true,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'es5',
  endOfLine: 'auto',

  plugins: ['@trivago/prettier-plugin-sort-imports'],

  importOrder: ['<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: ['decorators-legacy', 'typescript'],
};
