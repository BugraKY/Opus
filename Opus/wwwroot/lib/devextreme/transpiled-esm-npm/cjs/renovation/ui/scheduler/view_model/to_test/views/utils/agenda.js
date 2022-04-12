"use strict";

exports.calculateStartViewDate = void 0;

var _base = require("./base");

var calculateStartViewDate = function calculateStartViewDate(currentDate, startDayHour) {
  var validCurrentDate = new Date(currentDate);
  return (0, _base.setOptionHour)(validCurrentDate, startDayHour);
};

exports.calculateStartViewDate = calculateStartViewDate;