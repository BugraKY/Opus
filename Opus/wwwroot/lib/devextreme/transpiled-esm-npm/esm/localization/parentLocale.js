/* eslint-disable import/no-commonjs */
var PARENT_LOCALE_SEPARATOR = '-';
export default ((parentLocales, locale) => {
  var parentLocale = parentLocales[locale];

  if (parentLocale) {
    return parentLocale !== 'root' && parentLocale;
  }

  return locale.substr(0, locale.lastIndexOf(PARENT_LOCALE_SEPARATOR));
});