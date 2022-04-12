"use strict";

exports.sortAppointmentsByStartDate = exports.replaceWrongEndDate = exports.getTrimDates = exports.getRecurrenceException = exports.getAppointmentTakesSeveralDays = exports.getAppointmentTakesAllDay = exports.compareDateWithStartDayHour = exports.compareDateWithEndDayHour = exports._isEndDateWrong = exports._getAppointmentDurationInHours = exports._convertRecurrenceException = exports._appointmentPartInInterval = exports._appointmentHasShortDayDuration = exports._appointmentHasAllDayDuration = void 0;

var _date = _interopRequireDefault(require("../../../../core/utils/date"));

var _utils = _interopRequireDefault(require("../../utils.timeZone"));

var _date_serialization = _interopRequireDefault(require("../../../../core/utils/date_serialization"));

var _expressionUtils = require("../../expressionUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toMs = _date.default.dateToMilliseconds;
var FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';

var compareDateWithStartDayHour = function compareDateWithStartDayHour(startDate, endDate, startDayHour, allDay, severalDays) {
  var startTime = _date.default.dateTimeFromDecimal(startDayHour);

  var result = startDate.getHours() >= startTime.hours && startDate.getMinutes() >= startTime.minutes || endDate.getHours() === startTime.hours && endDate.getMinutes() > startTime.minutes || endDate.getHours() > startTime.hours || severalDays || allDay;
  return result;
};

exports.compareDateWithStartDayHour = compareDateWithStartDayHour;

var compareDateWithEndDayHour = function compareDateWithEndDayHour(options) {
  var startDate = options.startDate,
      endDate = options.endDate,
      startDayHour = options.startDayHour,
      endDayHour = options.endDayHour,
      viewStartDayHour = options.viewStartDayHour,
      viewEndDayHour = options.viewEndDayHour,
      allDay = options.allDay,
      severalDays = options.severalDays,
      min = options.min,
      max = options.max,
      checkIntersectViewport = options.checkIntersectViewport;
  var hiddenInterval = (24 - viewEndDayHour + viewStartDayHour) * toMs('hour');
  var apptDuration = endDate.getTime() - startDate.getTime();
  var delta = (hiddenInterval - apptDuration) / toMs('hour');
  var apptStartHour = startDate.getHours();
  var apptStartMinutes = startDate.getMinutes();
  var result;

  var endTime = _date.default.dateTimeFromDecimal(endDayHour);

  var startTime = _date.default.dateTimeFromDecimal(startDayHour);

  var apptIntersectViewport = startDate < max && endDate > min;
  result = checkIntersectViewport && apptIntersectViewport || apptStartHour < endTime.hours || apptStartHour === endTime.hours && apptStartMinutes < endTime.minutes || allDay && startDate <= max || severalDays && apptIntersectViewport && (apptStartHour < endTime.hours || endDate.getHours() * 60 + endDate.getMinutes() > startTime.hours * 60);

  if (apptDuration < hiddenInterval) {
    if (apptStartHour > endTime.hours && apptStartMinutes > endTime.minutes && delta <= apptStartHour - endDayHour) {
      result = false;
    }
  }

  return result;
};

exports.compareDateWithEndDayHour = compareDateWithEndDayHour;

var getTrimDates = function getTrimDates(min, max) {
  var newMin = _date.default.trimTime(min);

  var newMax = _date.default.trimTime(max);

  newMax.setDate(newMax.getDate() + 1);
  return [newMin, newMax];
};

exports.getTrimDates = getTrimDates;

var _getAppointmentDurationInHours = function _getAppointmentDurationInHours(startDate, endDate) {
  return (endDate.getTime() - startDate.getTime()) / toMs('hour');
};

exports._getAppointmentDurationInHours = _getAppointmentDurationInHours;

var getAppointmentTakesSeveralDays = function getAppointmentTakesSeveralDays(adapter) {
  return !_date.default.sameDate(adapter.startDate, adapter.endDate);
};

exports.getAppointmentTakesSeveralDays = getAppointmentTakesSeveralDays;

var _appointmentHasShortDayDuration = function _appointmentHasShortDayDuration(startDate, endDate, startDayHour, endDayHour) {
  var appointmentDurationInHours = _getAppointmentDurationInHours(startDate, endDate);

  var shortDayDurationInHours = endDayHour - startDayHour;
  return appointmentDurationInHours >= shortDayDurationInHours && startDate.getHours() === startDayHour && endDate.getHours() === endDayHour;
};

exports._appointmentHasShortDayDuration = _appointmentHasShortDayDuration;

var _isEndDateWrong = function _isEndDateWrong(startDate, endDate) {
  return !endDate || isNaN(endDate.getTime()) || startDate.getTime() > endDate.getTime();
};

exports._isEndDateWrong = _isEndDateWrong;

var _appointmentHasAllDayDuration = function _appointmentHasAllDayDuration(startDate, endDate, startDayHour, endDayHour) {
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  var dayDuration = 24;

  var appointmentDurationInHours = _getAppointmentDurationInHours(startDate, endDate);

  return appointmentDurationInHours >= dayDuration || _appointmentHasShortDayDuration(startDate, endDate, startDayHour, endDayHour);
};

exports._appointmentHasAllDayDuration = _appointmentHasAllDayDuration;

var _appointmentPartInInterval = function _appointmentPartInInterval(startDate, endDate, startDayHour, endDayHour) {
  var apptStartDayHour = startDate.getHours();
  var apptEndDayHour = endDate.getHours();
  return apptStartDayHour <= startDayHour && apptEndDayHour <= endDayHour && apptEndDayHour >= startDayHour || apptEndDayHour >= endDayHour && apptStartDayHour <= endDayHour && apptStartDayHour >= startDayHour;
};

exports._appointmentPartInInterval = _appointmentPartInInterval;

var getRecurrenceException = function getRecurrenceException(appointmentAdapter, timeZoneCalculator, timeZone) {
  var recurrenceException = appointmentAdapter.recurrenceException;

  if (recurrenceException) {
    var exceptions = recurrenceException.split(',');

    for (var i = 0; i < exceptions.length; i++) {
      exceptions[i] = _convertRecurrenceException(exceptions[i], appointmentAdapter.startDate, timeZoneCalculator, timeZone);
    }

    return exceptions.join();
  }

  return recurrenceException;
};

exports.getRecurrenceException = getRecurrenceException;

var _convertRecurrenceException = function _convertRecurrenceException(exceptionString, startDate, timeZoneCalculator, timeZone) {
  exceptionString = exceptionString.replace(/\s/g, '');

  var getConvertedToTimeZone = function getConvertedToTimeZone(date) {
    return timeZoneCalculator.createDate(date, {
      path: 'toGrid'
    });
  };

  var exceptionDate = _date_serialization.default.deserializeDate(exceptionString);

  var convertedStartDate = getConvertedToTimeZone(startDate);
  var convertedExceptionDate = getConvertedToTimeZone(exceptionDate);
  convertedExceptionDate = _utils.default.correctRecurrenceExceptionByTimezone(convertedExceptionDate, convertedStartDate, timeZone);
  exceptionString = _date_serialization.default.serializeDate(convertedExceptionDate, FULL_DATE_FORMAT);
  return exceptionString;
};

exports._convertRecurrenceException = _convertRecurrenceException;

var getAppointmentTakesAllDay = function getAppointmentTakesAllDay(appointment, startDayHour, endDayHour) {
  return appointment.allDay || _appointmentHasAllDayDuration(appointment.startDate, appointment.endDate, startDayHour, endDayHour);
};

exports.getAppointmentTakesAllDay = getAppointmentTakesAllDay;

var replaceWrongEndDate = function replaceWrongEndDate(appointment, startDate, endDate, appointmentDuration, dataAccessors) {
  var calculateAppointmentEndDate = function calculateAppointmentEndDate(isAllDay, startDate) {
    if (isAllDay) {
      return _date.default.setToDayEnd(new Date(startDate));
    }

    return new Date(startDate.getTime() + appointmentDuration * toMs('minute'));
  };

  if (_isEndDateWrong(startDate, endDate)) {
    var calculatedEndDate = calculateAppointmentEndDate(appointment.allDay, startDate);
    dataAccessors.setter.endDate(appointment, calculatedEndDate);
  }
};

exports.replaceWrongEndDate = replaceWrongEndDate;

var sortAppointmentsByStartDate = function sortAppointmentsByStartDate(appointments, dataAccessors) {
  appointments.sort(function (a, b) {
    var firstDate = new Date(_expressionUtils.ExpressionUtils.getField(dataAccessors, 'startDate', a.settings || a));
    var secondDate = new Date(_expressionUtils.ExpressionUtils.getField(dataAccessors, 'startDate', b.settings || b));
    return Math.sign(firstDate.getTime() - secondDate.getTime());
  });
};

exports.sortAppointmentsByStartDate = sortAppointmentsByStartDate;