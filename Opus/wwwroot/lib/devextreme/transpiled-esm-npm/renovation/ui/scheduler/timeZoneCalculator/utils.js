"use strict";

exports.TimeZoneCalculator = void 0;

var _type = require("../../../../core/utils/type");

var _date = _interopRequireDefault(require("../../../../core/utils/date"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TimeZoneCalculator = /*#__PURE__*/function () {
  function TimeZoneCalculator(options) {
    this.options = options;
  }

  var _proto = TimeZoneCalculator.prototype;

  _proto.createDate = function createDate(sourceDate, info) {
    var date = new Date(sourceDate);

    switch (info.path) {
      case _types.PathTimeZoneConversion.fromSourceToAppointment:
        return this.getConvertedDate(date, info.appointmentTimeZone, true, false);

      case _types.PathTimeZoneConversion.fromAppointmentToSource:
        return this.getConvertedDate(date, info.appointmentTimeZone, true, true);

      case _types.PathTimeZoneConversion.fromSourceToGrid:
        return this.getConvertedDate(date, info.appointmentTimeZone, false, false);

      case _types.PathTimeZoneConversion.fromGridToSource:
        return this.getConvertedDate(date, info.appointmentTimeZone, false, true);

      default:
        throw new Error("not specified pathTimeZoneConversion");
    }
  };

  _proto.getOffsets = function getOffsets(date, appointmentTimezone) {
    var clientOffset = -this.getClientOffset(date) / _date.default.dateToMilliseconds("hour");

    var commonOffset = this.getCommonOffset(date);
    var appointmentOffset = this.getAppointmentOffset(date, appointmentTimezone);
    return {
      client: clientOffset,
      common: !(0, _type.isDefined)(commonOffset) ? clientOffset : commonOffset,
      appointment: typeof appointmentOffset !== "number" ? clientOffset : appointmentOffset
    };
  };

  _proto.getConvertedDateByOffsets = function getConvertedDateByOffsets(date, clientOffset, targetOffset, isBack) {
    var direction = isBack ? -1 : 1;

    var utcDate = date.getTime() - direction * clientOffset * _date.default.dateToMilliseconds("hour");

    return new Date(utcDate + direction * targetOffset * _date.default.dateToMilliseconds("hour"));
  };

  _proto.getClientOffset = function getClientOffset(date) {
    return this.options.getClientOffset(date);
  };

  _proto.getCommonOffset = function getCommonOffset(date) {
    return this.options.getCommonOffset(date);
  };

  _proto.getAppointmentOffset = function getAppointmentOffset(date, appointmentTimezone) {
    return this.options.getAppointmentOffset(date, appointmentTimezone);
  };

  _proto.getConvertedDate = function getConvertedDate(date, appointmentTimezone, useAppointmentTimeZone, isBack) {
    var newDate = new Date(date.getTime());
    var offsets = this.getOffsets(newDate, appointmentTimezone);

    if (useAppointmentTimeZone && !!appointmentTimezone) {
      return this.getConvertedDateByOffsets(date, offsets.client, offsets.appointment, isBack);
    }

    return this.getConvertedDateByOffsets(date, offsets.client, offsets.common, isBack);
  };

  return TimeZoneCalculator;
}();

exports.TimeZoneCalculator = TimeZoneCalculator;