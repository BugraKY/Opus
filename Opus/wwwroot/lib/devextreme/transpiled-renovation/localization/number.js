"use strict";

exports.default = void 0;

var _dependency_injector = _interopRequireDefault(require("../core/utils/dependency_injector"));

var _array = require("../core/utils/array");

var _common = require("../core/utils/common");

var _iterator = require("../core/utils/iterator");

var _type = require("../core/utils/type");

var _number = require("./ldml/number");

var _config = _interopRequireDefault(require("../core/config"));

var _errors = _interopRequireDefault(require("../core/errors"));

var _utils = require("./utils");

var _currency = _interopRequireDefault(require("./currency"));

var _number2 = _interopRequireDefault(require("./intl/number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var hasIntl = typeof Intl !== 'undefined';
var MAX_LARGE_NUMBER_POWER = 4;
var DECIMAL_BASE = 10;
var NUMERIC_FORMATS = ['currency', 'fixedpoint', 'exponential', 'percent', 'decimal'];
var LargeNumberFormatPostfixes = {
  1: 'K',
  // kilo
  2: 'M',
  // mega
  3: 'B',
  // billions
  4: 'T' // tera

};
var LargeNumberFormatPowers = {
  'largenumber': 'auto',
  'thousands': 1,
  'millions': 2,
  'billions': 3,
  'trillions': 4
};
var numberLocalization = (0, _dependency_injector.default)({
  engine: function engine() {
    return 'base';
  },
  numericFormats: NUMERIC_FORMATS,
  defaultLargeNumberFormatPostfixes: LargeNumberFormatPostfixes,
  _parseNumberFormatString: function _parseNumberFormatString(formatType) {
    var formatObject = {};
    if (!formatType || typeof formatType !== 'string') return;
    var formatList = formatType.toLowerCase().split(' ');
    (0, _iterator.each)(formatList, function (index, value) {
      if ((0, _array.inArray)(value, NUMERIC_FORMATS) > -1) {
        formatObject.formatType = value;
      } else if (value in LargeNumberFormatPowers) {
        formatObject.power = LargeNumberFormatPowers[value];
      }
    });

    if (formatObject.power && !formatObject.formatType) {
      formatObject.formatType = 'fixedpoint';
    }

    if (formatObject.formatType) {
      return formatObject;
    }
  },
  _calculateNumberPower: function _calculateNumberPower(value, base, minPower, maxPower) {
    var number = Math.abs(value);
    var power = 0;

    if (number > 1) {
      while (number && number >= base && (maxPower === undefined || power < maxPower)) {
        power++;
        number = number / base;
      }
    } else if (number > 0 && number < 1) {
      while (number < 1 && (minPower === undefined || power > minPower)) {
        power--;
        number = number * base;
      }
    }

    return power;
  },
  _getNumberByPower: function _getNumberByPower(number, power, base) {
    var result = number;

    while (power > 0) {
      result = result / base;
      power--;
    }

    while (power < 0) {
      result = result * base;
      power++;
    }

    return result;
  },
  _formatNumber: function _formatNumber(value, formatObject, formatConfig) {
    if (formatObject.power === 'auto') {
      formatObject.power = this._calculateNumberPower(value, 1000, 0, MAX_LARGE_NUMBER_POWER);
    }

    if (formatObject.power) {
      value = this._getNumberByPower(value, formatObject.power, 1000);
    }

    var powerPostfix = this.defaultLargeNumberFormatPostfixes[formatObject.power] || '';

    var result = this._formatNumberCore(value, formatObject.formatType, formatConfig);

    result = result.replace(/(\d|.$)(\D*)$/, '$1' + powerPostfix + '$2');
    return result;
  },
  _formatNumberExponential: function _formatNumberExponential(value, formatConfig) {
    var power = this._calculateNumberPower(value, DECIMAL_BASE);

    var number = this._getNumberByPower(value, power, DECIMAL_BASE);

    if (formatConfig.precision === undefined) {
      formatConfig.precision = 1;
    }

    if (number.toFixed(formatConfig.precision || 0) >= DECIMAL_BASE) {
      power++;
      number = number / DECIMAL_BASE;
    }

    var powString = (power >= 0 ? '+' : '') + power.toString();
    return this._formatNumberCore(number, 'fixedpoint', formatConfig) + 'E' + powString;
  },
  _addZeroes: function _addZeroes(value, precision) {
    var multiplier = Math.pow(10, precision);
    var sign = value < 0 ? '-' : '';
    value = (Math.abs(value) * multiplier >>> 0) / multiplier;
    var result = value.toString();

    while (result.length < precision) {
      result = '0' + result;
    }

    return sign + result;
  },
  _addGroupSeparators: function _addGroupSeparators(value) {
    var parts = value.toString().split('.');
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, (0, _config.default)().thousandsSeparator) + (parts[1] ? (0, _config.default)().decimalSeparator + parts[1] : '');
  },
  _formatNumberCore: function _formatNumberCore(value, format, formatConfig) {
    if (format === 'exponential') {
      return this._formatNumberExponential(value, formatConfig);
    }

    if (format !== 'decimal' && formatConfig.precision !== null) {
      formatConfig.precision = formatConfig.precision || 0;
    }

    if (format === 'percent') {
      value = value * 100;
    }

    if (formatConfig.precision !== undefined) {
      if (format === 'decimal') {
        value = this._addZeroes(value, formatConfig.precision);
      } else {
        value = formatConfig.precision === null ? value.toPrecision() : (0, _utils.toFixed)(value, formatConfig.precision);
      }
    }

    if (format !== 'decimal') {
      value = this._addGroupSeparators(value);
    } else {
      value = value.toString().replace('.', (0, _config.default)().decimalSeparator);
    }

    if (format === 'percent') {
      value += '%';
    }

    return value;
  },
  _normalizeFormat: function _normalizeFormat(format) {
    if (!format) {
      return {};
    }

    if (typeof format === 'function') {
      return format;
    }

    if (!(0, _type.isPlainObject)(format)) {
      format = {
        type: format
      };
    }

    return format;
  },
  _getSeparators: function _getSeparators() {
    return {
      decimalSeparator: this.getDecimalSeparator(),
      thousandsSeparator: this.getThousandsSeparator()
    };
  },
  getThousandsSeparator: function getThousandsSeparator() {
    return this.format(10000, 'fixedPoint')[2];
  },
  getDecimalSeparator: function getDecimalSeparator() {
    return this.format(1.2, {
      type: 'fixedPoint',
      precision: 1
    })[1];
  },
  convertDigits: function convertDigits(value, toStandard) {
    var digits = this.format(90, 'decimal');

    if (typeof value !== 'string' || digits[1] === '0') {
      return value;
    }

    var fromFirstDigit = toStandard ? digits[1] : '0';
    var toFirstDigit = toStandard ? '0' : digits[1];
    var fromLastDigit = toStandard ? digits[0] : '9';
    var regExp = new RegExp('[' + fromFirstDigit + '-' + fromLastDigit + ']', 'g');
    return value.replace(regExp, function (char) {
      return String.fromCharCode(char.charCodeAt(0) + (toFirstDigit.charCodeAt(0) - fromFirstDigit.charCodeAt(0)));
    });
  },
  getNegativeEtalonRegExp: function getNegativeEtalonRegExp(format) {
    var separators = this._getSeparators();

    var digitalRegExp = new RegExp('[0-9' + (0, _common.escapeRegExp)(separators.decimalSeparator + separators.thousandsSeparator) + ']+', 'g');
    var specialCharacters = ['\\', '(', ')', '[', ']', '*', '+', '$', '^', '?', '|', '{', '}'];
    var negativeEtalon = this.format(-1, format).replace(digitalRegExp, '1');
    specialCharacters.forEach(function (char) {
      negativeEtalon = negativeEtalon.replaceAll(char, "\\".concat(char));
    });
    negativeEtalon = negativeEtalon.replaceAll(' ', '\\s');
    negativeEtalon = negativeEtalon.replaceAll('1', '.+');
    return new RegExp(negativeEtalon, 'g');
  },
  getSign: function getSign(text, format) {
    if (!format) {
      if (text.replace(/[^0-9-]/g, '').charAt(0) === '-') {
        return -1;
      }

      return 1;
    }

    var negativeEtalon = this.getNegativeEtalonRegExp(format);
    return text.match(negativeEtalon) ? -1 : 1;
  },
  format: function format(value, _format) {
    if (typeof value !== 'number') {
      return value;
    }

    if (typeof _format === 'number') {
      return value;
    }

    _format = _format && _format.formatter || _format;

    if (typeof _format === 'function') {
      return _format(value);
    }

    _format = this._normalizeFormat(_format);

    if (!_format.type) {
      _format.type = 'decimal';
    }

    var numberConfig = this._parseNumberFormatString(_format.type);

    if (!numberConfig) {
      var formatterConfig = this._getSeparators();

      formatterConfig.unlimitedIntegerDigits = _format.unlimitedIntegerDigits;
      return this.convertDigits((0, _number.getFormatter)(_format.type, formatterConfig)(value));
    }

    return this._formatNumber(value, numberConfig, _format);
  },
  parse: function parse(text, format) {
    if (!text) {
      return;
    }

    if (format && format.parser) {
      return format.parser(text);
    }

    text = this.convertDigits(text, true);

    if (format && typeof format !== 'string') {
      // Current parser functionality provided as-is and is independent of the most of capabilities of formatter.
      _errors.default.log('W0011');
    }

    var decimalSeparator = this.getDecimalSeparator();
    var regExp = new RegExp('[^0-9' + (0, _common.escapeRegExp)(decimalSeparator) + ']', 'g');
    var cleanedText = text.replace(regExp, '').replace(decimalSeparator, '.').replace(/\.$/g, '');

    if (cleanedText === '.' || cleanedText === '') {
      return null;
    }

    if (this._calcSignificantDigits(cleanedText) > 15) {
      return NaN;
    }

    var parsed = +cleanedText * this.getSign(text, format);
    format = this._normalizeFormat(format);

    var formatConfig = this._parseNumberFormatString(format.type);

    var power = formatConfig === null || formatConfig === void 0 ? void 0 : formatConfig.power;

    if (power) {
      if (power === 'auto') {
        var match = text.match(/\d(K|M|B|T)/);

        if (match) {
          power = (0, _array.find)(Object.keys(LargeNumberFormatPostfixes), function (power) {
            return LargeNumberFormatPostfixes[power] === match[1];
          });
        }
      }

      parsed = parsed * Math.pow(10, 3 * power);
    }

    if ((formatConfig === null || formatConfig === void 0 ? void 0 : formatConfig.formatType) === 'percent') {
      parsed /= 100;
    }

    return parsed;
  },
  _calcSignificantDigits: function _calcSignificantDigits(text) {
    var _text$split = text.split('.'),
        _text$split2 = _slicedToArray(_text$split, 2),
        integer = _text$split2[0],
        fractional = _text$split2[1];

    var calcDigitsAfterLeadingZeros = function calcDigitsAfterLeadingZeros(digits) {
      var index = -1;

      for (var i = 0; i < digits.length; i++) {
        if (digits[i] !== '0') {
          index = i;
          break;
        }
      }

      return index > -1 ? digits.length - index : 0;
    };

    var result = 0;

    if (integer) {
      result += calcDigitsAfterLeadingZeros(integer.split(''));
    }

    if (fractional) {
      result += calcDigitsAfterLeadingZeros(fractional.split('').reverse());
    }

    return result;
  }
});
numberLocalization.inject(_currency.default);

if (hasIntl) {
  numberLocalization.inject(_number2.default);
}

var _default = numberLocalization;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;