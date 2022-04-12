import $ from '../../core/renderer';
import dateSerialization from '../../core/utils/date_serialization';
import { isDate } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import dateLocalization from '../../localization/date';
var DATE_COMPONENTS = ['year', 'day', 'month', 'day'];
var TIME_COMPONENTS = ['hours', 'minutes', 'seconds', 'milliseconds'];
var ONE_MINUTE = 1000 * 60;
var ONE_DAY = ONE_MINUTE * 60 * 24;
var ONE_YEAR = ONE_DAY * 365;

var getStringFormat = function getStringFormat(format) {
  var formatType = typeof format;

  if (formatType === 'string') {
    return 'format';
  }

  if (formatType === 'object' && format.type !== undefined) {
    return format.type;
  }

  return null;
};

var dateUtils = {
  SUPPORTED_FORMATS: ['date', 'time', 'datetime'],
  ONE_MINUTE,
  ONE_DAY,
  ONE_YEAR,
  MIN_DATEVIEW_DEFAULT_DATE: new Date(1900, 0, 1),
  MAX_DATEVIEW_DEFAULT_DATE: function () {
    var newDate = new Date();
    return new Date(newDate.getFullYear() + 50, newDate.getMonth(), newDate.getDate(), 23, 59, 59);
  }(),
  FORMATS_INFO: {
    'date': {
      getStandardPattern: function getStandardPattern() {
        return 'yyyy-MM-dd';
      },
      components: DATE_COMPONENTS
    },
    'time': {
      getStandardPattern: function getStandardPattern() {
        return 'HH:mm';
      },
      components: TIME_COMPONENTS
    },
    'datetime': {
      getStandardPattern: function getStandardPattern() {
        var standardPattern;

        (function androidFormatDetection() {
          var androidFormatPattern = 'yyyy-MM-ddTHH:mmZ';
          var testDateString = '2000-01-01T01:01Z';
          var $input = $('<input>').attr('type', 'datetime');
          $input.val(testDateString);

          if ($input.val()) {
            standardPattern = androidFormatPattern;
          }
        })();

        if (!standardPattern) {
          standardPattern = 'yyyy-MM-ddTHH:mm:ssZ';
        }

        dateUtils.FORMATS_INFO['datetime'].getStandardPattern = function () {
          return standardPattern;
        };

        return standardPattern;
      },
      components: [...DATE_COMPONENTS, ...TIME_COMPONENTS]
    },
    'datetime-local': {
      getStandardPattern: function getStandardPattern() {
        return 'yyyy-MM-ddTHH:mm:ss';
      },
      components: [...DATE_COMPONENTS, 'hours', 'minutes', 'seconds']
    }
  },
  FORMATS_MAP: {
    'date': 'shortdate',
    'time': 'shorttime',
    'datetime': 'shortdateshorttime'
  },
  SUBMIT_FORMATS_MAP: {
    'date': 'date',
    'time': 'time',
    'datetime': 'datetime-local'
  },
  toStandardDateFormat: function toStandardDateFormat(date, type) {
    var pattern = dateUtils.FORMATS_INFO[type].getStandardPattern();
    return dateSerialization.serializeDate(date, pattern);
  },
  fromStandardDateFormat: function fromStandardDateFormat(text) {
    var date = dateSerialization.dateParser(text);
    return isDate(date) ? date : undefined;
  },
  getMaxMonthDay: function getMaxMonthDay(year, month) {
    return new Date(year, month + 1, 0).getDate();
  },
  mergeDates: function mergeDates(oldValue, newValue, format) {
    if (!newValue) {
      return newValue || null;
    }

    if (!oldValue || isNaN(oldValue.getTime())) {
      var now = new Date(null);
      oldValue = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    var result = new Date(oldValue.valueOf());
    var formatInfo = dateUtils.FORMATS_INFO[format];
    each(formatInfo.components, function () {
      var componentInfo = dateUtils.DATE_COMPONENTS_INFO[this];
      result[componentInfo.setter](newValue[componentInfo.getter]());
    });
    return result;
  },
  getLongestCaptionIndex: function getLongestCaptionIndex(captionArray) {
    var longestIndex = 0;
    var longestCaptionLength = 0;
    var i;

    for (i = 0; i < captionArray.length; ++i) {
      if (captionArray[i].length > longestCaptionLength) {
        longestIndex = i;
        longestCaptionLength = captionArray[i].length;
      }
    }

    return longestIndex;
  },
  formatUsesMonthName: function formatUsesMonthName(format) {
    return dateLocalization.formatUsesMonthName(format);
  },
  formatUsesDayName: function formatUsesDayName(format) {
    return dateLocalization.formatUsesDayName(format);
  },
  getLongestDate: function getLongestDate(format, monthNames, dayNames) {
    var stringFormat = getStringFormat(format);
    var month = 9;

    if (!stringFormat || dateUtils.formatUsesMonthName(stringFormat)) {
      month = dateUtils.getLongestCaptionIndex(monthNames);
    }

    var longestDate = new Date(1888, month, 21, 23, 59, 59, 999);

    if (!stringFormat || dateUtils.formatUsesDayName(stringFormat)) {
      var date = longestDate.getDate() - longestDate.getDay() + dateUtils.getLongestCaptionIndex(dayNames);
      longestDate.setDate(date);
    }

    return longestDate;
  },
  normalizeTime: function normalizeTime(date) {
    date.setSeconds(0);
    date.setMilliseconds(0);
  }
};
dateUtils.DATE_COMPONENTS_INFO = {
  'year': {
    getter: 'getFullYear',
    setter: 'setFullYear',
    formatter: function formatter(value, date) {
      var formatDate = new Date(date.getTime());
      formatDate.setFullYear(value);
      return dateLocalization.format(formatDate, 'yyyy');
    },
    startValue: undefined,
    endValue: undefined
  },
  'day': {
    getter: 'getDate',
    setter: 'setDate',
    formatter: function formatter(value, date) {
      var formatDate = new Date(date.getTime());
      formatDate.setDate(value);
      return dateLocalization.format(formatDate, 'd');
    },
    startValue: 1,
    endValue: undefined
  },
  'month': {
    getter: 'getMonth',
    setter: 'setMonth',
    formatter: function formatter(value) {
      return dateLocalization.getMonthNames()[value];
    },
    startValue: 0,
    endValue: 11
  },
  'hours': {
    getter: 'getHours',
    setter: 'setHours',
    formatter: function formatter(value) {
      return dateLocalization.format(new Date(0, 0, 0, value), 'hour');
    },
    startValue: 0,
    endValue: 23
  },
  'minutes': {
    getter: 'getMinutes',
    setter: 'setMinutes',
    formatter: function formatter(value) {
      return dateLocalization.format(new Date(0, 0, 0, 0, value), 'minute');
    },
    startValue: 0,
    endValue: 59
  },
  'seconds': {
    getter: 'getSeconds',
    setter: 'setSeconds',
    formatter: function formatter(value) {
      return dateLocalization.format(new Date(0, 0, 0, 0, 0, value), 'second');
    },
    startValue: 0,
    endValue: 59
  },
  'milliseconds': {
    getter: 'getMilliseconds',
    setter: 'setMilliseconds',
    formatter: function formatter(value) {
      return dateLocalization.format(new Date(0, 0, 0, 0, 0, 0, value), 'millisecond');
    },
    startValue: 0,
    endValue: 999
  }
};
export default dateUtils;