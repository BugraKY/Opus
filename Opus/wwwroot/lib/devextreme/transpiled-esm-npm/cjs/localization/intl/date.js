"use strict";

exports.default = void 0;

var _extend = require("../../core/utils/extend");

var _core = _interopRequireDefault(require("../core"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var SYMBOLS_TO_REMOVE_REGEX = /[\u200E\u200F]/g;

var getIntlFormatter = function getIntlFormatter(format) {
  return function (date) {
    // NOTE: Intl in some browsers formates dates with timezone offset which was at the moment for this date.
    // But the method "new Date" creates date using current offset. So, we decided to format dates in the UTC timezone.
    if (!format.timeZoneName) {
      var year = date.getFullYear(); // NOTE: new Date(99,0,1) will return 1999 year, but 99 expected

      var recognizableAsTwentyCentury = String(year).length < 3;
      var safeYearShift = 400;
      var temporaryYearValue = recognizableAsTwentyCentury ? year + safeYearShift : year;
      var utcDate = new Date(Date.UTC(temporaryYearValue, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

      if (recognizableAsTwentyCentury) {
        utcDate.setFullYear(year);
      }

      var utcFormat = (0, _extend.extend)({
        timeZone: 'UTC'
      }, format);
      return formatDateTime(utcDate, utcFormat);
    }

    return formatDateTime(date, format);
  };
};

var formattersCache = {};

var getFormatter = function getFormatter(format) {
  var key = _core.default.locale() + '/' + JSON.stringify(format);

  if (!formattersCache[key]) {
    formattersCache[key] = new Intl.DateTimeFormat(_core.default.locale(), format).format;
  }

  return formattersCache[key];
};

function formatDateTime(date, format) {
  return getFormatter(format)(date).replace(SYMBOLS_TO_REMOVE_REGEX, '');
}

var formatNumber = function formatNumber(number) {
  return new Intl.NumberFormat(_core.default.locale()).format(number);
};

var getAlternativeNumeralsMap = function () {
  var numeralsMapCache = {};
  return function (locale) {
    if (!(locale in numeralsMapCache)) {
      if (formatNumber(0) === '0') {
        numeralsMapCache[locale] = false;
        return false;
      }

      numeralsMapCache[locale] = {};

      for (var i = 0; i < 10; ++i) {
        numeralsMapCache[locale][formatNumber(i)] = i;
      }
    }

    return numeralsMapCache[locale];
  };
}();

var normalizeNumerals = function normalizeNumerals(dateString) {
  var alternativeNumeralsMap = getAlternativeNumeralsMap(_core.default.locale());

  if (!alternativeNumeralsMap) {
    return dateString;
  }

  return dateString.split('').map(function (sign) {
    return sign in alternativeNumeralsMap ? String(alternativeNumeralsMap[sign]) : sign;
  }).join('');
};

var removeLeadingZeroes = function removeLeadingZeroes(str) {
  return str.replace(/(\D)0+(\d)/g, '$1$2');
};

var dateStringEquals = function dateStringEquals(actual, expected) {
  return removeLeadingZeroes(actual) === removeLeadingZeroes(expected);
};

var normalizeMonth = function normalizeMonth(text) {
  return text.replace("d\u2019", 'de '); // NOTE: For "ca" locale
};

var intlFormats = {
  'day': {
    day: 'numeric'
  },
  'dayofweek': {
    weekday: 'long'
  },
  'longdate': {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  },
  'longdatelongtime': {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  },
  'longtime': {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  },
  'month': {
    month: 'long'
  },
  'monthandday': {
    month: 'long',
    day: 'numeric'
  },
  'monthandyear': {
    year: 'numeric',
    month: 'long'
  },
  'shortdate': {},
  'shorttime': {
    hour: 'numeric',
    minute: 'numeric'
  },
  'shortyear': {
    year: '2-digit'
  },
  'year': {
    year: 'numeric'
  }
};
Object.defineProperty(intlFormats, 'shortdateshorttime', {
  get: function get() {
    var defaultOptions = Intl.DateTimeFormat(_core.default.locale()).resolvedOptions();
    return {
      year: defaultOptions.year,
      month: defaultOptions.month,
      day: defaultOptions.day,
      hour: 'numeric',
      minute: 'numeric'
    };
  }
});

var getIntlFormat = function getIntlFormat(format) {
  return typeof format === 'string' && intlFormats[format.toLowerCase()];
};

var monthNameStrategies = {
  standalone: function standalone(monthIndex, monthFormat) {
    var date = new Date(1999, monthIndex, 13, 1);
    var dateString = getIntlFormatter({
      month: monthFormat
    })(date);
    return dateString;
  },
  format: function format(monthIndex, monthFormat) {
    var date = new Date(0, monthIndex, 13, 1);
    var dateString = normalizeMonth(getIntlFormatter({
      day: 'numeric',
      month: monthFormat
    })(date));
    var parts = dateString.split(' ').filter(function (part) {
      return part.indexOf('13') < 0;
    });

    if (parts.length === 1) {
      return parts[0];
    } else if (parts.length === 2) {
      return parts[0].length > parts[1].length ? parts[0] : parts[1]; // NOTE: For "lt" locale
    }

    return monthNameStrategies.standalone(monthIndex, monthFormat);
  }
};
var _default = {
  engine: function engine() {
    return 'intl';
  },
  getMonthNames: function getMonthNames(format, type) {
    var intlFormats = {
      wide: 'long',
      abbreviated: 'short',
      narrow: 'narrow'
    };
    var monthFormat = intlFormats[format || 'wide'];
    type = type === 'format' ? type : 'standalone';
    return Array.apply(null, new Array(12)).map(function (_, monthIndex) {
      return monthNameStrategies[type](monthIndex, monthFormat);
    });
  },
  getDayNames: function getDayNames(format) {
    var intlFormats = {
      wide: 'long',
      abbreviated: 'short',
      short: 'narrow',
      narrow: 'narrow'
    };

    var getIntlDayNames = function getIntlDayNames(format) {
      return Array.apply(null, new Array(7)).map(function (_, dayIndex) {
        return getIntlFormatter({
          weekday: format
        })(new Date(0, 0, dayIndex));
      });
    };

    var result = getIntlDayNames(intlFormats[format || 'wide']);
    return result;
  },
  getPeriodNames: function getPeriodNames() {
    var hour12Formatter = getIntlFormatter({
      hour: 'numeric',
      hour12: true
    });
    return [1, 13].map(function (hours) {
      var hourNumberText = formatNumber(1); // NOTE: For "bn" locale

      var timeParts = hour12Formatter(new Date(0, 0, 1, hours)).split(hourNumberText);

      if (timeParts.length !== 2) {
        return '';
      }

      var biggerPart = timeParts[0].length > timeParts[1].length ? timeParts[0] : timeParts[1];
      return biggerPart.trim();
    });
  },
  format: function format(date, _format) {
    if (!date) {
      return;
    }

    if (!_format) {
      return date;
    } // TODO: refactor (extract code form base)


    if (typeof _format !== 'function' && !_format.formatter) {
      _format = _format.type || _format;
    }

    var intlFormat = getIntlFormat(_format);

    if (intlFormat) {
      return getIntlFormatter(intlFormat)(date);
    }

    var formatType = _typeof(_format);

    if (_format.formatter || formatType === 'function' || formatType === 'string') {
      return this.callBase.apply(this, arguments);
    }

    return getIntlFormatter(_format)(date);
  },
  parse: function parse(dateString, format) {
    var _this = this;

    var formatter;

    if (format && !format.parser && typeof dateString === 'string') {
      dateString = normalizeMonth(dateString);

      formatter = function formatter(date) {
        return normalizeMonth(_this.format(date, format));
      };
    }

    return this.callBase(dateString, formatter || format);
  },
  _parseDateBySimpleFormat: function _parseDateBySimpleFormat(dateString, format) {
    var _this2 = this;

    dateString = normalizeNumerals(dateString);
    var formatParts = this.getFormatParts(format);
    var dateParts = dateString.split(/\D+/).filter(function (part) {
      return part.length > 0;
    });

    if (formatParts.length !== dateParts.length) {
      return;
    }

    var dateArgs = this._generateDateArgs(formatParts, dateParts);

    var constructDate = function constructDate(dateArgs, ampmShift) {
      var hoursShift = ampmShift ? 12 : 0;
      return new Date(dateArgs.year, dateArgs.month, dateArgs.day, (dateArgs.hours + hoursShift) % 24, dateArgs.minutes, dateArgs.seconds);
    };

    var constructValidDate = function constructValidDate(ampmShift) {
      var parsedDate = constructDate(dateArgs, ampmShift);

      if (dateStringEquals(normalizeNumerals(_this2.format(parsedDate, format)), dateString)) {
        return parsedDate;
      }
    };

    return constructValidDate(false) || constructValidDate(true);
  },
  _generateDateArgs: function _generateDateArgs(formatParts, dateParts) {
    var currentDate = new Date();
    var dateArgs = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: currentDate.getDate(),
      hours: 0,
      minutes: 0,
      seconds: 0
    };
    formatParts.forEach(function (formatPart, index) {
      var datePart = dateParts[index];
      var parsed = parseInt(datePart, 10);

      if (formatPart === 'month') {
        parsed = parsed - 1;
      }

      dateArgs[formatPart] = parsed;
    });
    return dateArgs;
  },
  formatUsesMonthName: function formatUsesMonthName(format) {
    if (_typeof(format) === 'object' && !(format.type || format.format)) {
      return format.month === 'long';
    }

    return this.callBase.apply(this, arguments);
  },
  formatUsesDayName: function formatUsesDayName(format) {
    if (_typeof(format) === 'object' && !(format.type || format.format)) {
      return format.weekday === 'long';
    }

    return this.callBase.apply(this, arguments);
  },
  getTimeSeparator: function getTimeSeparator() {
    var formatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    };
    return normalizeNumerals(formatDateTime(new Date(2001, 1, 1, 11, 11), formatOptions)).replace(/\d/g, '');
  },
  getFormatParts: function getFormatParts(format) {
    if (typeof format === 'string') {
      return this.callBase(format);
    }

    var intlFormat = (0, _extend.extend)({}, intlFormats[format.toLowerCase()]);
    var date = new Date(2001, 2, 4, 5, 6, 7);
    var formattedDate = getIntlFormatter(intlFormat)(date);
    formattedDate = normalizeNumerals(formattedDate);
    var formatParts = [{
      name: 'year',
      value: 1
    }, {
      name: 'month',
      value: 3
    }, {
      name: 'day',
      value: 4
    }, {
      name: 'hours',
      value: 5
    }, {
      name: 'minutes',
      value: 6
    }, {
      name: 'seconds',
      value: 7
    }];
    return formatParts.map(function (part) {
      return {
        name: part.name,
        index: formattedDate.indexOf(part.value)
      };
    }).filter(function (part) {
      return part.index > -1;
    }).sort(function (a, b) {
      return a.index - b.index;
    }).map(function (part) {
      return part.name;
    });
  }
};
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;