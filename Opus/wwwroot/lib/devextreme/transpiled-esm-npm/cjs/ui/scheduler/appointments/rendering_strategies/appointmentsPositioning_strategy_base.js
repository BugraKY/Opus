"use strict";

exports.default = void 0;

var _type = require("../../../../core/utils/type");

var COLLECTOR_DEFAULT_WIDTH = 24;
var COLLECTOR_DEFAULT_OFFSET = 3;
var COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET = 22;
var APPOINTMENT_MIN_COUNT = 1;
var APPOINTMENT_DEFAULT_WIDTH = 40;
var COLLECTOR_WIDTH_IN_PERCENTS = 75;
var APPOINTMENT_INCREASED_WIDTH = 50;

var AppointmentPositioningStrategy = /*#__PURE__*/function () {
  function AppointmentPositioningStrategy(renderingStrategy) {
    this._renderingStrategy = renderingStrategy;
  }

  var _proto = AppointmentPositioningStrategy.prototype;

  _proto.getDropDownAppointmentWidth = function getDropDownAppointmentWidth(intervalCount, isAllDay) {
    if (isAllDay || !(0, _type.isDefined)(isAllDay)) {
      return COLLECTOR_WIDTH_IN_PERCENTS * this._renderingStrategy.cellWidth / 100;
    } else {
      return COLLECTOR_DEFAULT_WIDTH;
    }
  };

  _proto.getCollectorTopOffset = function getCollectorTopOffset() {
    return COLLECTOR_DEFAULT_OFFSET;
  };

  _proto.getCollectorLeftOffset = function getCollectorLeftOffset() {
    return COLLECTOR_DEFAULT_OFFSET;
  };

  _proto.getAppointmentDefaultOffset = function getAppointmentDefaultOffset() {
    if (this._renderingStrategy._isCompactTheme()) {
      return COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET;
    }

    return this._renderingStrategy.appointmentOffset;
  };

  _proto.getDynamicAppointmentCountPerCell = function getDynamicAppointmentCountPerCell() {
    var renderingStrategy = this._renderingStrategy;
    var cellHeight = renderingStrategy.cellHeight;

    var allDayCount = Math.floor((cellHeight - renderingStrategy._getAppointmentDefaultOffset()) / renderingStrategy._getAppointmentDefaultHeight()) || this._getAppointmentMinCount(); // NOTE: Simplify using only object


    if (renderingStrategy.allDaySupported()) {
      return {
        allDay: renderingStrategy.groupOrientation === 'vertical' ? allDayCount : this._renderingStrategy.appointmentCountPerCell,
        simple: this._calculateDynamicAppointmentCountPerCell() || this._getAppointmentMinCount()
      };
    } else {
      return allDayCount;
    }
  };

  _proto.getDropDownAppointmentHeight = function getDropDownAppointmentHeight() {
    return undefined;
  };

  _proto._getAppointmentMinCount = function _getAppointmentMinCount() {
    return APPOINTMENT_MIN_COUNT;
  };

  _proto._calculateDynamicAppointmentCountPerCell = function _calculateDynamicAppointmentCountPerCell() {
    return Math.floor(this._renderingStrategy._getAppointmentMaxWidth() / APPOINTMENT_INCREASED_WIDTH);
  };

  _proto._getAppointmentDefaultWidth = function _getAppointmentDefaultWidth() {
    return APPOINTMENT_DEFAULT_WIDTH;
  };

  return AppointmentPositioningStrategy;
}();

var _default = AppointmentPositioningStrategy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;