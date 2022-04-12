"use strict";

exports.validateDayHours = exports.setOptionHour = exports.isSupportMultiDayAppointments = exports.isHorizontalView = exports.isDateInRange = exports.isDateAndTimeView = exports.getViewStartByOptions = exports.getVerticalGroupCountClass = exports.getTotalRowCountByCompleteData = exports.getTotalCellCountByCompleteData = exports.getToday = exports.getStartViewDateWithoutDST = exports.getStartViewDateTimeOffset = exports.getHorizontalGroupCount = exports.getHeaderCellText = exports.getDisplayedRowCount = exports.getDisplayedCellCount = exports.getCellDuration = exports.getCalculatedFirstDayOfWeek = exports.formatWeekdayAndDay = exports.formatWeekday = exports.calculateViewStartDate = exports.calculateIsGroupedAllDayPanel = exports.calculateDayDuration = exports.calculateCellIndex = void 0;

var _ui = _interopRequireDefault(require("../../../../../../../ui/widget/ui.errors"));

var _date = _interopRequireDefault(require("../../../../../../../core/utils/date"));

var _type = require("../../../../../../../core/utils/type");

var _date2 = _interopRequireDefault(require("../../../../../../../localization/date"));

var _utils = _interopRequireDefault(require("../../../../../../../ui/scheduler/utils.timeZone"));

var _classes = require("../../../../../../../ui/scheduler/classes");

var _constants = require("../../../../../../../ui/scheduler/constants");

var _utils2 = require("../../../../../../../ui/scheduler/resources/utils");

var _utils3 = require("../../../../workspaces/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isDateInRange = function isDateInRange(date, startDate, endDate, diff) {
  return diff > 0 ? _date.default.dateInRange(date, startDate, new Date(endDate.getTime() - 1)) : _date.default.dateInRange(date, endDate, startDate, "date");
};

exports.isDateInRange = isDateInRange;

var setOptionHour = function setOptionHour(date, optionHour) {
  var nextDate = new Date(date);

  if (!(0, _type.isDefined)(optionHour)) {
    return nextDate;
  }

  nextDate.setHours(optionHour, optionHour % 1 * 60, 0, 0);
  return nextDate;
};

exports.setOptionHour = setOptionHour;

var getViewStartByOptions = function getViewStartByOptions(startDate, currentDate, intervalDuration, startViewDate) {
  if (!startDate) {
    return new Date(currentDate);
  }

  var currentStartDate = _date.default.trimTime(startViewDate);

  var diff = currentStartDate.getTime() <= currentDate.getTime() ? 1 : -1;
  var endDate = new Date(currentStartDate.getTime() + intervalDuration * diff);

  while (!isDateInRange(currentDate, currentStartDate, endDate, diff)) {
    currentStartDate = endDate;
    endDate = new Date(currentStartDate.getTime() + intervalDuration * diff);
  }

  return diff > 0 ? currentStartDate : endDate;
};

exports.getViewStartByOptions = getViewStartByOptions;

var getCalculatedFirstDayOfWeek = function getCalculatedFirstDayOfWeek(firstDayOfWeekOption) {
  return (0, _type.isDefined)(firstDayOfWeekOption) ? firstDayOfWeekOption : _date2.default.firstDayOfWeekIndex();
};

exports.getCalculatedFirstDayOfWeek = getCalculatedFirstDayOfWeek;

var calculateViewStartDate = function calculateViewStartDate(startDateOption) {
  return startDateOption;
};

exports.calculateViewStartDate = calculateViewStartDate;

var calculateCellIndex = function calculateCellIndex(rowIndex, columnIndex, rowCount) {
  return columnIndex * rowCount + rowIndex;
};

exports.calculateCellIndex = calculateCellIndex;

var getStartViewDateWithoutDST = function getStartViewDateWithoutDST(startViewDate, startDayHour) {
  var newStartViewDate = _utils.default.getDateWithoutTimezoneChange(startViewDate);

  newStartViewDate.setHours(startDayHour);
  return newStartViewDate;
};

exports.getStartViewDateWithoutDST = getStartViewDateWithoutDST;

var getHeaderCellText = function getHeaderCellText(headerIndex, date, headerCellTextFormat, getDateForHeaderText, additionalOptions) {
  var validDate = getDateForHeaderText(headerIndex, date, additionalOptions);
  return _date2.default.format(validDate, headerCellTextFormat);
};

exports.getHeaderCellText = getHeaderCellText;

var validateDayHours = function validateDayHours(startDayHour, endDayHour) {
  if (startDayHour >= endDayHour) {
    throw _ui.default.Error("E1058");
  }
};

exports.validateDayHours = validateDayHours;

var getStartViewDateTimeOffset = function getStartViewDateTimeOffset(startViewDate, startDayHour) {
  var validStartDayHour = Math.floor(startDayHour);

  var isDSTChange = _utils.default.isTimezoneChangeInDate(startViewDate);

  if (isDSTChange && validStartDayHour !== startViewDate.getHours()) {
    return _date.default.dateToMilliseconds("hour");
  }

  return 0;
};

exports.getStartViewDateTimeOffset = getStartViewDateTimeOffset;

var formatWeekday = function formatWeekday(date) {
  return _date2.default.getDayNames("abbreviated")[date.getDay()];
};

exports.formatWeekday = formatWeekday;

var formatWeekdayAndDay = function formatWeekdayAndDay(date) {
  return "".concat(formatWeekday(date), " ").concat(_date2.default.format(date, "day"));
};

exports.formatWeekdayAndDay = formatWeekdayAndDay;

var getToday = function getToday(indicatorTime, timeZoneCalculator) {
  var todayDate = indicatorTime !== null && indicatorTime !== void 0 ? indicatorTime : new Date();
  return (timeZoneCalculator === null || timeZoneCalculator === void 0 ? void 0 : timeZoneCalculator.createDate(todayDate, {
    path: "toGrid"
  })) || todayDate;
};

exports.getToday = getToday;

var getVerticalGroupCountClass = function getVerticalGroupCountClass(groups) {
  switch (groups === null || groups === void 0 ? void 0 : groups.length) {
    case 1:
      return _classes.VERTICAL_GROUP_COUNT_CLASSES[0];

    case 2:
      return _classes.VERTICAL_GROUP_COUNT_CLASSES[1];

    case 3:
      return _classes.VERTICAL_GROUP_COUNT_CLASSES[2];

    default:
      return undefined;
  }
};

exports.getVerticalGroupCountClass = getVerticalGroupCountClass;

var isDateAndTimeView = function isDateAndTimeView(viewType) {
  return viewType !== _constants.VIEWS.TIMELINE_MONTH && viewType !== _constants.VIEWS.MONTH;
};

exports.isDateAndTimeView = isDateAndTimeView;

var isSupportMultiDayAppointments = function isSupportMultiDayAppointments(viewType) {
  return [_constants.VIEWS.TIMELINE_DAY, _constants.VIEWS.TIMELINE_WEEK, _constants.VIEWS.TIMELINE_WORK_WEEK, _constants.VIEWS.TIMELINE_MONTH].includes(viewType);
};

exports.isSupportMultiDayAppointments = isSupportMultiDayAppointments;

var getHorizontalGroupCount = function getHorizontalGroupCount(groups, groupOrientation) {
  var groupCount = (0, _utils2.getGroupCount)(groups) || 1;
  var isVerticalGrouping = (0, _utils3.isVerticalGroupingApplied)(groups, groupOrientation);
  return isVerticalGrouping ? 1 : groupCount;
};

exports.getHorizontalGroupCount = getHorizontalGroupCount;

var calculateIsGroupedAllDayPanel = function calculateIsGroupedAllDayPanel(groups, groupOrientation, isAllDayPanelVisible) {
  return (0, _utils3.isVerticalGroupingApplied)(groups, groupOrientation) && isAllDayPanelVisible;
};

exports.calculateIsGroupedAllDayPanel = calculateIsGroupedAllDayPanel;

var calculateDayDuration = function calculateDayDuration(startDayHour, endDayHour) {
  return endDayHour - startDayHour;
};

exports.calculateDayDuration = calculateDayDuration;

var isHorizontalView = function isHorizontalView(viewType) {
  switch (viewType) {
    case _constants.VIEWS.TIMELINE_DAY:
    case _constants.VIEWS.TIMELINE_WEEK:
    case _constants.VIEWS.TIMELINE_WORK_WEEK:
    case _constants.VIEWS.TIMELINE_MONTH:
    case _constants.VIEWS.MONTH:
      return true;

    default:
      return false;
  }
};

exports.isHorizontalView = isHorizontalView;

var getTotalCellCountByCompleteData = function getTotalCellCountByCompleteData(completeData) {
  return completeData[completeData.length - 1].length;
};

exports.getTotalCellCountByCompleteData = getTotalCellCountByCompleteData;

var getTotalRowCountByCompleteData = function getTotalRowCountByCompleteData(completeData) {
  return completeData.length;
};

exports.getTotalRowCountByCompleteData = getTotalRowCountByCompleteData;

var getDisplayedCellCount = function getDisplayedCellCount(displayedCellCount, completeData) {
  return displayedCellCount !== null && displayedCellCount !== void 0 ? displayedCellCount : getTotalCellCountByCompleteData(completeData);
};

exports.getDisplayedCellCount = getDisplayedCellCount;

var getDisplayedRowCount = function getDisplayedRowCount(displayedRowCount, completeData) {
  return displayedRowCount !== null && displayedRowCount !== void 0 ? displayedRowCount : getTotalRowCountByCompleteData(completeData);
};

exports.getDisplayedRowCount = getDisplayedRowCount;

var getCellDuration = function getCellDuration(viewType, startDayHour, endDayHour, hoursInterval) {
  switch (viewType) {
    case "month":
      return calculateDayDuration(startDayHour, endDayHour) * 3600000;

    case "timelineMonth":
      return _date.default.dateToMilliseconds("day");

    default:
      return 3600000 * hoursInterval;
  }
};

exports.getCellDuration = getCellDuration;