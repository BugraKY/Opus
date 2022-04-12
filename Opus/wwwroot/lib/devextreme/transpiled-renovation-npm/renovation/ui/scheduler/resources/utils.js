"use strict";

exports.createGetAppointmentColor = void 0;

var _utils = require("../../../../ui/scheduler/resources/utils");

var createGetAppointmentColor = function createGetAppointmentColor(resourceConfig) {
  return function (appointmentConfig) {
    return (0, _utils.getAppointmentColor)(resourceConfig, appointmentConfig);
  };
};

exports.createGetAppointmentColor = createGetAppointmentColor;