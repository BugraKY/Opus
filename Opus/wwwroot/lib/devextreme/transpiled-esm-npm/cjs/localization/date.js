"use strict";

exports.default = void 0;

var _dependency_injector = _interopRequireDefault(require("../core/utils/dependency_injector"));

var _type = require("../core/utils/type");

var _iterator = require("../core/utils/iterator");

var _array = require("../core/utils/array");

var _errors = _interopRequireDefault(require("../core/errors"));

var _date = require("./ldml/date.formatter");

var _date2 = require("./ldml/date.format");

var _date3 = require("./ldml/date.parser");

var _default_date_names = _interopRequireDefault(require("./default_date_names"));

var _first_day_of_week_data = _interopRequireDefault(require("./cldr-data/first_day_of_week_data"));

var _core = _interopRequireDefault(require("./core"));

var _number = _interopRequireDefault(require("./number"));

var _date4 = _interopRequireDefault(require("./intl/date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_DAY_OF_WEEK_INDEX = 0;
var hasIntl = typeof Intl !== 'undefined';
var FORMATS_TO_PATTERN_MAP = {
  'shortdate': 'M/d/y',
  'shorttime': 'h:mm a',
  'longdate': 'EEEE, MMMM d, y',
  'longtime': 'h:mm:ss a',
  'monthandday': 'MMMM d',
  'monthandyear': 'MMMM y',
  'quarterandyear': 'QQQ y',
  'day': 'd',
  'year': 'y',
  'shortdateshorttime': 'M/d/y, h:mm a',
  'longdatelongtime': 'EEEE, MMMM d, y, h:mm:ss a',
  'month': 'LLLL',
  'shortyear': 'yy',
  'dayofweek': 'EEEE',
  'quarter': 'QQQ',
  'hour': 'HH',
  'minute': 'mm',
  'second': 'ss',
  'millisecond': 'SSS',
  'datetime-local': 'yyyy-MM-ddTHH\':\'mm\':\'ss'
};
var possiblePartPatterns = {
  year: ['y', 'yy', 'yyyy'],
  day: ['d', 'dd'],
  month: ['M', 'MM', 'MMM', 'MMMM'],
  hours: ['H', 'HH', 'h', 'hh', 'ah'],
  minutes: ['m', 'mm'],
  seconds: ['s', 'ss'],
  milliseconds: ['S', 'SS', 'SSS']
};
var dateLocalization = (0, _dependency_injector.default)({
  engine: function engine() {
    return 'base';
  },
  _getPatternByFormat: function _getPatternByFormat(format) {
    return FORMATS_TO_PATTERN_MAP[format.toLowerCase()];
  },
  _expandPattern: function _expandPattern(pattern) {
    return this._getPatternByFormat(pattern) || pattern;
  },
  formatUsesMonthName: function formatUsesMonthName(format) {
    return this._expandPattern(format).indexOf('MMMM') !== -1;
  },
  formatUsesDayName: function formatUsesDayName(format) {
    return this._expandPattern(format).indexOf('EEEE') !== -1;
  },
  getFormatParts: function getFormatParts(format) {
    var pattern = this._getPatternByFormat(format) || format;
    var result = [];
    (0, _iterator.each)(pattern.split(/\W+/), function (_, formatPart) {
      (0, _iterator.each)(possiblePartPatterns, function (partName, possiblePatterns) {
        if ((0, _array.inArray)(formatPart, possiblePatterns) > -1) {
          result.push(partName);
        }
      });
    });
    return result;
  },
  getMonthNames: function getMonthNames(format) {
    return _default_date_names.default.getMonthNames(format);
  },
  getDayNames: function getDayNames(format) {
    return _default_date_names.default.getDayNames(format);
  },
  getQuarterNames: function getQuarterNames(format) {
    return _default_date_names.default.getQuarterNames(format);
  },
  getPeriodNames: function getPeriodNames(format) {
    return _default_date_names.default.getPeriodNames(format);
  },
  getTimeSeparator: function getTimeSeparator() {
    return ':';
  },
  is24HourFormat: function is24HourFormat(format) {
    var amTime = new Date(2017, 0, 20, 11, 0, 0, 0);
    var pmTime = new Date(2017, 0, 20, 23, 0, 0, 0);
    var amTimeFormatted = this.format(amTime, format);
    var pmTimeFormatted = this.format(pmTime, format);

    for (var i = 0; i < amTimeFormatted.length; i++) {
      if (amTimeFormatted[i] !== pmTimeFormatted[i]) {
        return !isNaN(parseInt(amTimeFormatted[i]));
      }
    }
  },
  format: function format(date, _format) {
    if (!date) {
      return;
    }

    if (!_format) {
      return date;
    }

    var formatter;

    if (typeof _format === 'function') {
      formatter = _format;
    } else if (_format.formatter) {
      formatter = _format.formatter;
    } else {
      _format = _format.type || _format;

      if ((0, _type.isString)(_format)) {
        _format = FORMATS_TO_PATTERN_MAP[_format.toLowerCase()] || _format;
        return _number.default.convertDigits((0, _date.getFormatter)(_format, this)(date));
      }
    }

    if (!formatter) {
      // TODO: log warning or error
      return;
    }

    return formatter(date);
  },
  parse: function parse(text, format) {
    var that = this;
    var ldmlFormat;
    var formatter;

    if (!text) {
      return;
    }

    if (!format) {
      return this.parse(text, 'shortdate');
    }

    if (format.parser) {
      return format.parser(text);
    }

    if (typeof format === 'string' && !FORMATS_TO_PATTERN_MAP[format.toLowerCase()]) {
      ldmlFormat = format;
    } else {
      formatter = function formatter(value) {
        var text = that.format(value, format);
        return _number.default.convertDigits(text, true);
      };

      try {
        ldmlFormat = (0, _date2.getFormat)(formatter);
      } catch (e) {}
    }

    if (ldmlFormat) {
      text = _number.default.convertDigits(text, true);
      return (0, _date3.getParser)(ldmlFormat, this)(text);
    }

    _errors.default.log('W0012');

    var result = new Date(text);

    if (!result || isNaN(result.getTime())) {
      return;
    }

    return result;
  },
  firstDayOfWeekIndex: function firstDayOfWeekIndex() {
    var index = _core.default.getValueByClosestLocale(function (locale) {
      return _first_day_of_week_data.default[locale];
    });

    return index === undefined ? DEFAULT_DAY_OF_WEEK_INDEX : index;
  }
});

if (hasIntl) {
  dateLocalization.inject(_date4.default);
}

var _default = dateLocalization;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;