"use strict";

exports.default = void 0;

var _default = function _default(appointmentItem) {
  var _ref, _settings$targetedApp;

  var currentData = appointmentItem.currentData,
      data = appointmentItem.data,
      settings = appointmentItem.settings;
  return (_ref = (_settings$targetedApp = settings === null || settings === void 0 ? void 0 : settings.targetedAppointmentData) !== null && _settings$targetedApp !== void 0 ? _settings$targetedApp : currentData) !== null && _ref !== void 0 ? _ref : data;
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;