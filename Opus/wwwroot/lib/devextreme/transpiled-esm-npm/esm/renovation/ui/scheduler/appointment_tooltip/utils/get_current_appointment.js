export default (appointmentItem => {
  var _ref, _settings$targetedApp;

  var {
    currentData,
    data,
    settings
  } = appointmentItem;
  return (_ref = (_settings$targetedApp = settings === null || settings === void 0 ? void 0 : settings.targetedAppointmentData) !== null && _settings$targetedApp !== void 0 ? _settings$targetedApp : currentData) !== null && _ref !== void 0 ? _ref : data;
});