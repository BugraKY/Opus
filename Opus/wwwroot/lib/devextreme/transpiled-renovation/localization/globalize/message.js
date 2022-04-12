"use strict";

require("./core");

var _globalize = _interopRequireDefault(require("globalize"));

var _message = _interopRequireDefault(require("../message"));

var _core2 = _interopRequireDefault(require("../core"));

require("globalize/message");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-restricted-imports
// eslint-disable-next-line no-restricted-imports
if (_globalize.default && _globalize.default.formatMessage) {
  var DEFAULT_LOCALE = 'en';
  var originalLoadMessages = _globalize.default.loadMessages;

  _globalize.default.loadMessages = function (messages) {
    _message.default.load(messages);
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
      return _globalize.default.cldr.get('globalize-messages');
    },
    getFormatter: function getFormatter(key, locale) {
      var currentLocale = locale || _core2.default.locale();

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
      var currentGlobalize = !locale || locale === _core2.default.locale() ? _globalize.default : new _globalize.default(locale);
      var result;

      if (this._messageLoaded(key, locale)) {
        result = currentGlobalize.messageFormatter(key);
      }

      return result;
    },
    _messageLoaded: function _messageLoaded(key, locale) {
      var currentCldr = locale ? new _globalize.default(locale).cldr : _globalize.default.locale();
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

  _message.default.inject(globalizeMessageLocalization);
}