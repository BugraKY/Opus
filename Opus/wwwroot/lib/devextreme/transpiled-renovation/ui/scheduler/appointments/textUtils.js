"use strict";

exports.getFormatType = exports.formatDates = exports.createFormattedDateText = void 0;

var _date = _interopRequireDefault(require("../../../core/utils/date"));

var _date2 = _interopRequireDefault(require("../../../localization/date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createFormattedDateText = function createFormattedDateText(options) {
  var startDate = options.startDate,
      endDate = options.endDate,
      allDay = options.allDay,
      format = options.format;
  var formatType = format || getFormatType(startDate, endDate, allDay);
  return formatDates(startDate, endDate, formatType);
};

exports.createFormattedDateText = createFormattedDateText;

var getFormatType = function getFormatType(startDate, endDate, isAllDay, isDateAndTimeView) {
  if (isAllDay) {
    return 'DATE';
  }

  if (isDateAndTimeView && _date.default.sameDate(startDate, endDate)) {
    return 'TIME';
  }

  return 'DATETIME';
};

exports.getFormatType = getFormatType;

var formatDates = function formatDates(startDate, endDate, formatType) {
  var dateFormat = 'monthandday';
  var timeFormat = 'shorttime';
  var isSameDate = startDate.getDate() === endDate.getDate();

  switch (formatType) {
    case 'DATETIME':
      return [_date2.default.format(startDate, dateFormat), ' ', _date2.default.format(startDate, timeFormat), ' - ', isSameDate ? '' : _date2.default.format(endDate, dateFormat) + ' ', _date2.default.format(endDate, timeFormat)].join('');

    case 'TIME':
      return "".concat(_date2.default.format(startDate, timeFormat), " - ").concat(_date2.default.format(endDate, timeFormat));

    case 'DATE':
      return "".concat(_date2.default.format(startDate, dateFormat)).concat(isSameDate ? '' : ' - ' + _date2.default.format(endDate, dateFormat));
  }
};

exports.formatDates = formatDates;