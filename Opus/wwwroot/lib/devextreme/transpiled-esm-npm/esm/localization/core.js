import dependencyInjector from '../core/utils/dependency_injector';
import parentLocales from './cldr-data/parent_locales';
import getParentLocale from './parentLocale';
var DEFAULT_LOCALE = 'en';
export default dependencyInjector({
  locale: (() => {
    var currentLocale = DEFAULT_LOCALE;
    return locale => {
      if (!locale) {
        return currentLocale;
      }

      currentLocale = locale;
    };
  })(),
  getValueByClosestLocale: function getValueByClosestLocale(getter) {
    var locale = this.locale();
    var value = getter(locale);
    var isRootLocale;

    while (!value && !isRootLocale) {
      locale = getParentLocale(parentLocales, locale);

      if (locale) {
        value = getter(locale);
      } else {
        isRootLocale = true;
      }
    }

    if (value === undefined && locale !== DEFAULT_LOCALE) {
      return getter(DEFAULT_LOCALE);
    }

    return value;
  }
});