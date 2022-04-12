import dateUtils from "../../../../../../../core/utils/date";
import { setOptionHour } from "./base";
import { getViewStartByOptions } from "./month";
export var calculateStartViewDate = (currentDate, startDayHour, startDate, intervalCount) => {
  var firstViewDate = dateUtils.getFirstMonthDate(getViewStartByOptions(startDate, currentDate, intervalCount, dateUtils.getFirstMonthDate(startDate)));
  return setOptionHour(firstViewDate, startDayHour);
};