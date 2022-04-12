"use strict";

var _globalize = _interopRequireDefault(require("globalize"));

var _core = _interopRequireDefault(require("../core"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-restricted-imports
if (_globalize.default && _globalize.default.load) {
  var likelySubtags = {
    'supplemental': {
      'version': {
        '_cldrVersion': '28',
        '_unicodeVersion': '8.0.0',
        '_number': '$Revision: 11965 $'
      },
      'likelySubtags': {
        'en': 'en-Latn-US',
        'de': 'de-Latn-DE',
        'ru': 'ru-Cyrl-RU',
        'ja': 'ja-Jpan-JP'
      }
    }
  };

  if (!_globalize.default.locale()) {
    _globalize.default.load(likelySubtags);

    _globalize.default.locale('en');
  }

  _core.default.inject({
    locale: function locale(_locale) {
      if (!_locale) {
        return _globalize.default.locale().locale;
      }

      _globalize.default.locale(_locale);
    }
  });
}