import './core'; // eslint-disable-next-line no-restricted-imports

import Globalize from 'globalize';
import messageLocalization from '../message';
import coreLocalization from '../core'; // eslint-disable-next-line no-restricted-imports

import 'globalize/message';

if (Globalize && Globalize.formatMessage) {
  var DEFAULT_LOCALE = 'en';
  var originalLoadMessages = Globalize.loadMessages;

  Globalize.loadMessages = messages => {
    messageLocalization.load(messages);
  };

  var globalizeMessageLocalization = {
    engine: function engine() {
      return 'globalize';
    },
    ctor: function ctor() {
      this.load(this._dictionary);
    },
    load: function load(messages) {
      this.callBase(messages);
      originalLoadMessages(messages);
    },
    getMessagesByLocales: function getMessagesByLocales() {
      return Globalize.cldr.get('globalize-messages');
    },
    getFormatter: function getFormatter(key, locale) {
      var currentLocale = locale || coreLocalization.locale();

      var formatter = this._getFormatterBase(key, locale);

      if (!formatter) {
        formatter = this._formatterByGlobalize(key, locale);
      }

      if (!formatter && currentLocale !== DEFAULT_LOCALE) {
        formatter = this.getFormatter(key, DEFAULT_LOCALE);
      }

      return formatter;
    },
    _formatterByGlobalize: function _formatterByGlobalize(key, locale) {
      var currentGlobalize = !locale || locale === coreLocalization.locale() ? Globalize : new Globalize(locale);
      var result;

      if (this._messageLoaded(key, locale)) {
        result = currentGlobalize.messageFormatter(key);
      }

      return result;
    },
    _messageLoaded: function _messageLoaded(key, locale) {
      var currentCldr = locale ? new Globalize(locale).cldr : Globalize.locale();
      var value = currentCldr.get(['globalize-messages/{bundle}', key]);
      return !!value;
    },
    _loadSingle: function _loadSingle(key, value, locale) {
      var data = {};
      data[locale] = {};
      data[locale][key] = value;
      this.load(data);
    }
  };
  messageLocalization.inject(globalizeMessageLocalization);
}