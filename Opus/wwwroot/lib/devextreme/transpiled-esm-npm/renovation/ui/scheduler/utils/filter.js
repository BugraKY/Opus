"use strict";

exports.getFilterStrategy = void 0;

var _appointmentFilter = require("../../../../ui/scheduler/appointments/dataProvider/appointmentFilter");

var getFilterStrategy = function getFilterStrategy(resources, startDayHour, endDayHour, cellDurationInMinutes, showAllDayPanel, supportAllDayRow, firstDayOfWeek, viewType, dateRange, groupCount, loadedResources, isVirtualScrolling, timeZoneCalculator, dataAccessors, viewDataProvider) {
  var filterOptions = {
    resources: resources,
    startDayHour: startDayHour,
    endDayHour: endDayHour,
    appointmentDuration: cellDurationInMinutes,
    showAllDayPanel: showAllDayPanel,
    supportAllDayRow: supportAllDayRow,
    firstDayOfWeek: firstDayOfWeek,
    viewType: viewType,
    viewDirection: "vertical",
    dateRange: dateRange,
    groupCount: groupCount,
    loadedResources: loadedResources,
    isVirtualScrolling: isVirtualScrolling,
    timeZoneCalculator: timeZoneCalculator,
    dataSource: undefined,
    dataAccessors: dataAccessors,
    viewDataProvider: viewDataProvider
  };
  return isVirtualScrolling ? new _appointmentFilter.AppointmentFilterVirtualStrategy(filterOptions) : new _appointmentFilter.AppointmentFilterBaseStrategy(filterOptions);
};

exports.getFilterStrategy = getFilterStrategy;