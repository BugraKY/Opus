import dateUtils from "../../../../../../../core/utils/date";
import { getViewStartByOptions, setOptionHour } from "./base";
import { getValidStartDate } from "./week";
var SATURDAY_INDEX = 6;
var SUNDAY_INDEX = 0;
var MONDAY_INDEX = 1;
var DAYS_IN_WEEK = 7;
export var isDataOnWeekend = date => {
  var day = date.getDay();
  return day === SATURDAY_INDEX || day === SUNDAY_INDEX;
};
export var getWeekendsCount = days => 2 * Math.floor(days / 7);
export var calculateStartViewDate = (currentDate, startDayHour, startDate, intervalDuration, firstDayOfWeek) => {
  var viewStart = getViewStartByOptions(startDate, currentDate, intervalDuration, getValidStartDate(startDate, firstDayOfWeek));
  var firstViewDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);

  if (isDataOnWeekend(firstViewDate)) {
    var currentDay = firstViewDate.getDay();
    var distance = (MONDAY_INDEX + DAYS_IN_WEEK - currentDay) % 7;
    firstViewDate.setDate(firstViewDate.getDate() + distance);
  }

  return setOptionHour(firstViewDate, startDayHour);
};