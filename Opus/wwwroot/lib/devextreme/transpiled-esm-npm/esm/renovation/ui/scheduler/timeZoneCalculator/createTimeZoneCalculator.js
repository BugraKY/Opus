import { TimeZoneCalculator } from "./utils";
import timeZoneUtils from "../../../../ui/scheduler/utils.timeZone";
export var createTimeZoneCalculator = currentTimeZone => new TimeZoneCalculator({
  getClientOffset: date => timeZoneUtils.getClientTimezoneOffset(date),
  getCommonOffset: date => timeZoneUtils.calculateTimezoneByValue(currentTimeZone, date),
  getAppointmentOffset: (date, appointmentTimezone) => timeZoneUtils.calculateTimezoneByValue(appointmentTimezone, date)
});