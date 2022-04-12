import dependencyInjector from '../core/utils/dependency_injector';
import { isString } from '../core/utils/type';
import { each } from '../core/utils/iterator';
import { inArray } from '../core/utils/array';
import errors from '../core/errors';
import { getFormatter as getLDMLDateFormatter } from './ldml/date.formatter';
import { getFormat as getLDMLDateFormat } from './ldml/date.format';
import { getParser as getLDMLDateParser } from './ldml/date.parser';
import defaultDateNames from './default_date_names';
import firstDayOfWeekData from './cldr-data/first_day_of_week_data';
import localizationCore from './core';
import numberLocalization from './number';
import intlDateLocalization from './intl/date';
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
var dateLocalization = dependencyInjector({
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
    each(pattern.split(/\W+/), (_, formatPart) => {
      each(possiblePartPatterns, (partName, possiblePatterns) => {
        if (inArray(formatPart, possiblePatterns) > -1) {
          result.push(partName);
        }
      });
    });
    return result;
  },
  getMonthNames: function getMonthNames(format) {
    return defaultDateNames.getMonthNames(format);
  },
  getDayNames: function getDayNames(format) {
    return defaultDateNames.getDayNames(format);
  },
  getQuarterNames: function getQuarterNames(format) {
    return defaultDateNames.getQuarterNames(format);
  },
  getPeriodNames: function getPeriodNames(format) {
    return defaultDateNames.getPeriodNames(format);
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

      if (isString(_format)) {
        _format = FORMATS_TO_PATTERN_MAP[_format.toLowerCase()] || _format;
        return numberLocalization.convertDigits(getLDMLDateFormatter(_format, this)(date));
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
      formatter = value => {
        var text = that.format(value, format);
        return numberLocalization.convertDigits(text, true);
      };

      try {
        ldmlFormat = getLDMLDateFormat(formatter);
      } catch (e) {}
    }

    if (ldmlFormat) {
      text = numberLocalization.convertDigits(text, true);
      return getLDMLDateParser(ldmlFormat, this)(text);
    }

    errors.log('W0012');
    var result = new Date(text);

    if (!result || isNaN(result.getTime())) {
      return;
    }

    return result;
  },
  firstDayOfWeekIndex: function firstDayOfWeekIndex() {
    var index = localizationCore.getValueByClosestLocale(locale => firstDayOfWeekData[locale]);
    return index === undefined ? DEFAULT_DAY_OF_WEEK_INDEX : index;
  }
});

if (hasIntl) {
  dateLocalization.inject(intlDateLocalization);
}

export default dateLocalization;