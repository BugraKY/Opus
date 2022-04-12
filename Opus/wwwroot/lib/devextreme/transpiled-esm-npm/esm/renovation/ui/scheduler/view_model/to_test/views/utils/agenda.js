import { setOptionHour } from "./base";
export var calculateStartViewDate = (currentDate, startDayHour) => {
  var validCurrentDate = new Date(currentDate);
  return setOptionHour(validCurrentDate, startDayHour);
};