import openXmlCurrencyFormat from '../open_xml_currency_format';
import './core';
import './number';
import '../currency'; // eslint-disable-next-line no-restricted-imports

import 'globalize/currency';
var enCurrencyUSD = {
  'main': {
    'en': {
      'identity': {
        'version': {
          '_cldrVersion': '28',
          '_number': '$Revision: 11972 $'
        },
        'language': 'en'
      },
      'numbers': {
        'currencies': {
          'USD': {
            'displayName': 'US Dollar',
            'displayName-count-one': 'US dollar',
            'displayName-count-other': 'US dollars',
            'symbol': '$',
            'symbol-alt-narrow': '$'
          }
        }
      }
    }
  }
};
var currencyData = {
  'supplemental': {
    'version': {
      '_cldrVersion': '28',
      '_unicodeVersion': '8.0.0',
      '_number': '$Revision: 11969 $'
    },
    'currencyData': {
      'fractions': {
        'DEFAULT': {
          '_rounding': '0',
          '_digits': '2'
        }
      }
    }
  }
}; // eslint-disable-next-line no-restricted-imports

import Globalize from 'globalize';
import config from '../../core/config';
import numberLocalization from '../number';

if (Globalize && Globalize.formatCurrency) {
  if (Globalize.locale().locale === 'en') {
    Globalize.load(enCurrencyUSD, currencyData);
    Globalize.locale('en');
  }

  var formattersCache = {};

  var getFormatter = (currency, format) => {
    var formatter;
    var formatCacheKey;

    if (typeof format === 'object') {
      formatCacheKey = Globalize.locale().locale + ':' + currency + ':' + JSON.stringify(format);
    } else {
      formatCacheKey = Globalize.locale().locale + ':' + currency + ':' + format;
    }

    formatter = formattersCache[formatCacheKey];

    if (!formatter) {
      formatter = formattersCache[formatCacheKey] = Globalize.currencyFormatter(currency, format);
    }

    return formatter;
  };

  var globalizeCurrencyLocalization = {
    _formatNumberCore: function _formatNumberCore(value, format, formatConfig) {
      if (format === 'currency') {
        var currency = formatConfig && formatConfig.currency || config().defaultCurrency;
        return getFormatter(currency, this._normalizeFormatConfig(format, formatConfig, value))(value);
      }

      return this.callBase.apply(this, arguments);
    },
    _normalizeFormatConfig: function _normalizeFormatConfig(format, formatConfig, value) {
      var config = this.callBase(format, formatConfig, value);

      if (format === 'currency') {
        config.style = 'accounting';
      }

      return config;
    },
    format: function format(value, _format) {
      if (typeof value !== 'number') {
        return value;
      }

      _format = this._normalizeFormat(_format);

      if (_format) {
        if (_format.currency === 'default') {
          _format.currency = config().defaultCurrency;
        }

        if (_format.type === 'currency') {
          return this._formatNumber(value, this._parseNumberFormatString('currency'), _format);
        } else if (!_format.type && _format.currency) {
          return getFormatter(_format.currency, _format)(value);
        }
      }

      return this.callBase.apply(this, arguments);
    },
    getCurrencySymbol: function getCurrencySymbol(currency) {
      if (!currency) {
        currency = config().defaultCurrency;
      }

      return Globalize.cldr.main('numbers/currencies/' + currency);
    },
    getOpenXmlCurrencyFormat: function getOpenXmlCurrencyFormat(currency) {
      var currencySymbol = this.getCurrencySymbol(currency).symbol;
      var accountingFormat = Globalize.cldr.main('numbers/currencyFormats-numberSystem-latn').accounting;
      return openXmlCurrencyFormat(currencySymbol, accountingFormat);
    }
  };
  numberLocalization.inject(globalizeCurrencyLocalization);
}