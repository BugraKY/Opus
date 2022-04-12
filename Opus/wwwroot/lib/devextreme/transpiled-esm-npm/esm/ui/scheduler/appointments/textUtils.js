import dateUtils from '../../../core/utils/date';
import dateLocalization from '../../../localization/date';
export var createFormattedDateText = options => {
  var {
    startDate,
    endDate,
    allDay,
    format
  } = options;
  var formatType = format || getFormatType(startDate, endDate, allDay);
  return formatDates(startDate, endDate, formatType);
};
export var getFormatType = (startDate, endDate, isAllDay, isDateAndTimeView) => {
  if (isAllDay) {
    return 'DATE';
  }

  if (isDateAndTimeView && dateUtils.sameDate(startDate, endDate)) {
    return 'TIME';
  }

  return 'DATETIME';
};
export var formatDates = (startDate, endDate, formatType) => {
  var dateFormat = 'monthandday';
  var timeFormat = 'shorttime';
  var isSameDate = startDate.getDate() === endDate.getDate();

  switch (formatType) {
    case 'DATETIME':
      return [dateLocalization.format(startDate, dateFormat), ' ', dateLocalization.format(startDate, timeFormat), ' - ', isSameDate ? '' : dateLocalization.format(endDate, dateFormat) + ' ', dateLocalization.format(endDate, timeFormat)].join('');

    case 'TIME':
      return "".concat(dateLocalization.format(startDate, timeFormat), " - ").concat(dateLocalization.format(endDate, timeFormat));

    case 'DATE':
      return "".concat(dateLocalization.format(startDate, dateFormat)).concat(isSameDate ? '' : ' - ' + dateLocalization.format(endDate, dateFormat));
  }
};