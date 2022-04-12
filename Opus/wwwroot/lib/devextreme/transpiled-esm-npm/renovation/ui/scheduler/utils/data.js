"use strict";

exports.resolveDataItems = exports.getPreparedDataItems = void 0;

var _utils = require("../../../../ui/scheduler/appointments/dataProvider/utils");

var _appointmentAdapter = require("../../../../ui/scheduler/appointmentAdapter");

var _type = require("../../../../core/utils/type");

var RECURRENCE_FREQ = "freq";

var getPreparedDataItems = function getPreparedDataItems(dataItems, dataAccessors, cellDurationInMinutes, timeZoneCalculator) {
  var result = [];
  dataItems === null || dataItems === void 0 ? void 0 : dataItems.forEach(function (rawAppointment) {
    var _recurrenceRule$match;

    var startDate = new Date(dataAccessors.getter.startDate(rawAppointment));
    var endDate = new Date(dataAccessors.getter.endDate(rawAppointment));
    (0, _utils.replaceWrongEndDate)(rawAppointment, startDate, endDate, cellDurationInMinutes, dataAccessors);
    var adapter = (0, _appointmentAdapter.createAppointmentAdapter)(rawAppointment, dataAccessors, timeZoneCalculator);
    var comparableStartDate = adapter.startDate && adapter.calculateStartDate("toGrid");
    var comparableEndDate = adapter.endDate && adapter.calculateEndDate("toGrid");
    var regex = new RegExp(RECURRENCE_FREQ, "gi");
    var recurrenceRule = adapter.recurrenceRule;
    var hasRecurrenceRule = !!(recurrenceRule !== null && recurrenceRule !== void 0 && (_recurrenceRule$match = recurrenceRule.match(regex)) !== null && _recurrenceRule$match !== void 0 && _recurrenceRule$match.length);
    var visible = (0, _type.isDefined)(rawAppointment.visible) ? !!rawAppointment.visible : true;

    if (comparableStartDate && comparableEndDate) {
      result.push({
        allDay: !!adapter.allDay,
        startDate: comparableStartDate,
        endDate: comparableEndDate,
        recurrenceRule: adapter.recurrenceRule,
        recurrenceException: adapter.recurrenceException,
        hasRecurrenceRule: hasRecurrenceRule,
        visible: visible,
        rawAppointment: rawAppointment
      });
    }
  });
  return result;
};

exports.getPreparedDataItems = getPreparedDataItems;

var resolveDataItems = function resolveDataItems(options) {
  return Array.isArray(options) ? options : options.data;
};

exports.resolveDataItems = resolveDataItems;