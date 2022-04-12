"use strict";

exports.default = void 0;

var _config = _interopRequireDefault(require("../../core/config"));

var _core = _interopRequireDefault(require("../core"));

var _open_xml_currency_format = _interopRequireDefault(require("../open_xml_currency_format"));

var _accounting_formats = _interopRequireDefault(require("../cldr-data/accounting_formats"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* globals Intl */
var detectCurrencySymbolRegex = /([^\s0]+)?(\s*)0*[.,]*0*(\s*)([^\s0]+)?/;
var formattersCache = {};

var getFormatter = function getFormatter(format) {
  var key = _core.default.locale() + '/' + JSON.stringify(format);

  if (!formattersCache[key]) {
    formattersCache[key] = new Intl.NumberFormat(_core.default.locale(), format).format;
  }

  return formattersCache[key];
};

var getCurrencyFormatter = function getCurrencyFormatter(currency) {
  return new Intl.NumberFormat(_core.default.locale(), {
    style: 'currency',
    currency: currency
  });
};

var _default = {
  engine: function engine() {
    return 'intl';
  },
  _formatNumberCore: function _formatNumberCore(value, format, formatConfig) {
    if (format === 'exponential') {
      return this.callBase.apply(this, arguments);
    }

    return getFormatter(this._normalizeFormatConfig(format, formatConfig, value))(value);
  },
  _normalizeFormatConfig: function _normalizeFormatConfig(format, formatConfig, value) {
    var config;

    if (format === 'decimal') {
      config = {
        minimumIntegerDigits: formatConfig.precision || undefined,
        useGrouping: false,
        maximumFractionDigits: String(value).length,
        round: value < 0 ? 'ceil' : 'floor'
      };
    } else {
      config = this._getPrecisionConfig(formatConfig.precision);
    }

    if (format === 'percent') {
      config.style = 'percent';
    } else if (format === 'currency') {
      config.style = 'currency';
      config.currency = formatConfig.currency || (0, _config.default)().defaultCurrency;
    }

    return config;
  },
  _getPrecisionConfig: function _getPrecisionConfig(precision) {
    var config;

    if (precision === null) {
      config = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 20
      };
    } else {
      config = {
        minimumFractionDigits: precision || 0,
        maximumFractionDigits: precision || 0
      };
    }

    return config;
  },
  format: function format(value, _format) {
    if ('number' !== typeof value) {
      return value;
    }

    _format = this._normalizeFormat(_format);

    if (_format.currency === 'default') {
      _format.currency = (0, _config.default)().defaultCurrency;
    }

    if (!_format || 'function' !== typeof _format && !_format.type && !_format.formatter) {
      return getFormatter(_format)(value);
    }

    return this.callBase.apply(this, arguments);
  },
  _getCurrencySymbolInfo: function _getCurrencySymbolInfo(currency) {
    var formatter = getCurrencyFormatter(currency);
    return this._extractCurrencySymbolInfo(formatter.format(0));
  },
  _extractCurrencySymbolInfo: function _extractCurrencySymbolInfo(currencyValueString) {
    var match = detectCurrencySymbolRegex.exec(currencyValueString) || [];
    var position = match[1] ? 'before' : 'after';
    var symbol = match[1] || match[4] || '';
    var delimiter = match[2] || match[3] || '';
    return {
      position: position,
      symbol: symbol,
      delimiter: delimiter
    };
  },
  getCurrencySymbol: function getCurrencySymbol(currency) {
    if (!currency) {
      currency = (0, _config.default)().defaultCurrency;
    }

    var symbolInfo = this._getCurrencySymbolInfo(currency);

    return {
      'symbol': symbolInfo.symbol
    };
  },
  getOpenXmlCurrencyFormat: function getOpenXmlCurrencyFormat(currency) {
    var targetCurrency = currency || (0, _config.default)().defaultCurrency;

    var currencySymbol = this._getCurrencySymbolInfo(targetCurrency).symbol;

    var closestAccountingFormat = _core.default.getValueByClosestLocale(function (locale) {
      return _accounting_formats.default[locale];
    });

    return (0, _open_xml_currency_format.default)(currencySymbol, closestAccountingFormat);
  }
};
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;