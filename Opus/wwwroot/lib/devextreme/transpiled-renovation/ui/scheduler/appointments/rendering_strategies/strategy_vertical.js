"use strict";

exports.default = void 0;

var _strategy = _interopRequireDefault(require("./strategy.base"));

var _extend = require("../../../../core/utils/extend");

var _type = require("../../../../core/utils/type");

var _date = _interopRequireDefault(require("../../../../core/utils/date"));

var _utils = _interopRequireDefault(require("../../utils.timeZone"));

var _expressionUtils = require("../../expressionUtils");

var _appointmentAdapter = require("../../appointmentAdapter");

var _utils2 = require("../dataProvider/utils");

var _getSkippedHoursInRange = _interopRequireDefault(require("../../../../renovation/ui/scheduler/view_model/appointments/utils/getSkippedHoursInRange"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ALLDAY_APPOINTMENT_MIN_VERTICAL_OFFSET = 5;
var ALLDAY_APPOINTMENT_MAX_VERTICAL_OFFSET = 20;
var toMs = _date.default.dateToMilliseconds;

var VerticalRenderingStrategy = /*#__PURE__*/function (_BaseAppointmentsStra) {
  _inheritsLoose(VerticalRenderingStrategy, _BaseAppointmentsStra);

  function VerticalRenderingStrategy() {
    return _BaseAppointmentsStra.apply(this, arguments) || this;
  }

  var _proto = VerticalRenderingStrategy.prototype;

  _proto.getDeltaTime = function getDeltaTime(args, initialSize, appointment) {
    var deltaTime = 0;

    if (this.isAllDay(appointment)) {
      deltaTime = this._getDeltaWidth(args, initialSize) * toMs('day');
    } else {
      var deltaHeight = args.height - initialSize.height;
      deltaTime = toMs('minute') * Math.round(deltaHeight / this.cellHeight * this.cellDurationInMinutes);
    }

    return deltaTime;
  };

  _proto._correctCollectorCoordinatesInAdaptive = function _correctCollectorCoordinatesInAdaptive(coordinates, isAllDay) {
    if (isAllDay) {
      _BaseAppointmentsStra.prototype._correctCollectorCoordinatesInAdaptive.call(this, coordinates, isAllDay);
    } else if (this._getMaxAppointmentCountPerCellByType() === 0) {
      var cellHeight = this.cellHeight;
      var cellWidth = this.cellWidth;
      coordinates.top += (cellHeight - this.getDropDownButtonAdaptiveSize()) / 2;
      coordinates.left += (cellWidth - this.getDropDownButtonAdaptiveSize()) / 2;
    }
  };

  _proto.getAppointmentGeometry = function getAppointmentGeometry(coordinates) {
    var geometry = null;

    if (coordinates.allDay) {
      geometry = this._getAllDayAppointmentGeometry(coordinates);
    } else {
      geometry = this.isAdaptive && coordinates.isCompact ? this._getAdaptiveGeometry(coordinates) : this._getVerticalAppointmentGeometry(coordinates);
    }

    return _BaseAppointmentsStra.prototype.getAppointmentGeometry.call(this, geometry);
  };

  _proto._getAdaptiveGeometry = function _getAdaptiveGeometry(coordinates) {
    var config = this._calculateGeometryConfig(coordinates);

    return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset);
  };

  _proto._getItemPosition = function _getItemPosition(appointment) {
    var adapter = (0, _appointmentAdapter.createAppointmentAdapter)(appointment, this.dataAccessors, this.timeZoneCalculator);
    var allDay = this.isAllDay(appointment);
    var isRecurring = !!adapter.recurrenceRule;
    var appointmentStartDate = adapter.calculateStartDate('toGrid');
    var appointmentEndDate = adapter.calculateEndDate('toGrid');
    var isAppointmentTakesSeveralDays = !_utils.default.isSameAppointmentDates(appointmentStartDate, appointmentEndDate);

    if (allDay) {
      return _BaseAppointmentsStra.prototype._getItemPosition.call(this, appointment);
    }

    var settings = this.generateAppointmentSettings(appointment);
    var result = [];

    for (var j = 0; j < settings.length; j++) {
      var currentSetting = settings[j];
      var height = this.calculateAppointmentHeight(appointment, currentSetting);
      var width = this.calculateAppointmentWidth(appointment, currentSetting);
      var resultHeight = height;
      var appointmentReduced = null;
      var multiDaysAppointmentParts = [];
      var currentMaxAllowedPosition = currentSetting.vMax;

      if (this._isMultiViewAppointment(currentSetting, height) || isAppointmentTakesSeveralDays && !isRecurring) {
        var reduceHead = _date.default.sameDate(appointmentStartDate, currentSetting.info.appointment.startDate) || isRecurring;

        if (reduceHead) {
          resultHeight = this._reduceMultiDayAppointment(height, {
            top: currentSetting.top,
            bottom: currentMaxAllowedPosition
          });
          multiDaysAppointmentParts = this._getAppointmentParts({
            sourceAppointmentHeight: height,
            reducedHeight: resultHeight,
            width: width
          }, currentSetting);
        }

        var isMultiDay = this._isMultiDayAppointment(currentSetting, height);

        if (isMultiDay) {
          appointmentReduced = reduceHead ? 'head' : 'tail';
        }
      }

      (0, _extend.extend)(currentSetting, {
        height: resultHeight,
        width: width,
        allDay: allDay,
        appointmentReduced: appointmentReduced
      });
      result = this._getAppointmentPartsPosition(multiDaysAppointmentParts, currentSetting, result);
    }

    return result;
  };

  _proto._isMultiDayAppointment = function _isMultiDayAppointment(position, height) {
    if (this.isVirtualScrolling) {
      var maxTop = this._getGroupHeight() - this._getGroupTopOffset(position);

      return height > maxTop;
    }

    return false;
  };

  _proto._isMultiViewAppointment = function _isMultiViewAppointment(position, height) {
    return height > position.vMax - position.top;
  };

  _proto._reduceMultiDayAppointment = function _reduceMultiDayAppointment(sourceAppointmentHeight, bound) {
    sourceAppointmentHeight = bound.bottom - Math.floor(bound.top);
    return sourceAppointmentHeight;
  };

  _proto._getGroupHeight = function _getGroupHeight() {
    return this.cellHeight * this.rowCount;
  };

  _proto._getGroupTopOffset = function _getGroupTopOffset(appointmentSettings) {
    var groupIndex = appointmentSettings.groupIndex;
    var groupTop = Math.max(0, this.positionHelper.getGroupTop({
      groupIndex: groupIndex,
      showAllDayPanel: this.showAllDayPanel,
      isGroupedAllDayPanel: this.isGroupedAllDayPanel
    }));
    var allDayPanelOffset = this.positionHelper.getOffsetByAllDayPanel({
      groupIndex: groupIndex,
      supportAllDayRow: this.allDaySupported(),
      showAllDayPanel: this.showAllDayPanel
    });
    var appointmentGroupTopOffset = appointmentSettings.top - groupTop - allDayPanelOffset;
    return appointmentGroupTopOffset;
  };

  _proto._getTailHeight = function _getTailHeight(appointmentGeometry, appointmentSettings) {
    if (!this.isVirtualScrolling) {
      return appointmentGeometry.sourceAppointmentHeight - appointmentGeometry.reducedHeight;
    }

    var appointmentGroupTopOffset = this._getGroupTopOffset(appointmentSettings);

    var sourceAppointmentHeight = appointmentGeometry.sourceAppointmentHeight;

    var groupHeight = this._getGroupHeight();

    var tailHeight = appointmentGroupTopOffset + sourceAppointmentHeight - groupHeight;
    return tailHeight;
  };

  _proto._getAppointmentParts = function _getAppointmentParts(appointmentGeometry, appointmentSettings) {
    var tailHeight = this._getTailHeight(appointmentGeometry, appointmentSettings);

    var width = appointmentGeometry.width;
    var result = [];
    var currentPartTop = Math.max(0, this.positionHelper.getGroupTop({
      groupIndex: appointmentSettings.groupIndex,
      showAllDayPanel: this.showAllDayPanel,
      isGroupedAllDayPanel: this.isGroupedAllDayPanel
    }));
    var cellsDiff = this.isGroupedByDate ? this.groupCount : 1;
    var offset = this.cellWidth * cellsDiff;
    var left = appointmentSettings.left + offset;

    if (tailHeight > 0) {
      var minHeight = this.getAppointmentMinSize();

      if (tailHeight < minHeight) {
        tailHeight = minHeight;
      }

      var allDayPanelOffset = this.positionHelper.getOffsetByAllDayPanel({
        groupIndex: appointmentSettings.groupIndex,
        supportAllDayRow: this.allDaySupported(),
        showAllDayPanel: this.showAllDayPanel
      });
      currentPartTop += allDayPanelOffset;
      result.push((0, _extend.extend)(true, {}, appointmentSettings, {
        top: currentPartTop,
        left: left,
        height: tailHeight,
        width: width,
        appointmentReduced: 'tail',
        rowIndex: 0,
        columnIndex: appointmentSettings.columnIndex + cellsDiff
      }));
    }

    return result;
  };

  _proto._getMinuteHeight = function _getMinuteHeight() {
    return this.cellHeight / this.cellDurationInMinutes;
  };

  _proto._getCompactLeftCoordinate = function _getCompactLeftCoordinate(itemLeft, index) {
    var cellBorderSize = 1;
    var cellWidth = this.cellWidth || this.getAppointmentMinSize();
    return itemLeft + (cellBorderSize + cellWidth) * index;
  };

  _proto._getVerticalAppointmentGeometry = function _getVerticalAppointmentGeometry(coordinates) {
    var config = this._calculateVerticalGeometryConfig(coordinates);

    return this._customizeVerticalCoordinates(coordinates, config.width, config.appointmentCountPerCell, config.offset);
  };

  _proto._customizeVerticalCoordinates = function _customizeVerticalCoordinates(coordinates, width, appointmentCountPerCell, topOffset, isAllDay) {
    var appointmentWidth = Math.max(width / appointmentCountPerCell, width / coordinates.count);
    var height = coordinates.height;
    var appointmentLeft = coordinates.left + coordinates.index * appointmentWidth;
    var top = coordinates.top;

    if (coordinates.isCompact) {
      this._markAppointmentAsVirtual(coordinates, isAllDay);
    }

    return {
      height: height,
      width: appointmentWidth,
      top: top,
      left: appointmentLeft,
      empty: this._isAppointmentEmpty(height, width)
    };
  };

  _proto._calculateVerticalGeometryConfig = function _calculateVerticalGeometryConfig(coordinates) {
    var overlappingMode = this.maxAppointmentsPerCell;

    var offsets = this._getOffsets();

    var appointmentDefaultOffset = this._getAppointmentDefaultOffset();

    var appointmentCountPerCell = this._getAppointmentCount(overlappingMode, coordinates);

    var ratio = this._getDefaultRatio(coordinates, appointmentCountPerCell);

    var maxWidth = this._getMaxWidth();

    if (!appointmentCountPerCell) {
      appointmentCountPerCell = coordinates.count;
      ratio = (maxWidth - offsets.unlimited) / maxWidth;
    }

    var topOffset = (1 - ratio) * maxWidth;

    if (overlappingMode === 'auto' || (0, _type.isNumeric)(overlappingMode)) {
      ratio = 1;
      maxWidth = maxWidth - appointmentDefaultOffset;
      topOffset = 0;
    }

    return {
      width: ratio * maxWidth,
      appointmentCountPerCell: appointmentCountPerCell,
      offset: topOffset
    };
  };

  _proto._getMaxWidth = function _getMaxWidth() {
    return this.cellWidth || this.cellWidth;
  };

  _proto.isAllDay = function isAllDay(appointmentData) {
    var allDay = _expressionUtils.ExpressionUtils.getField(this.dataAccessors, 'allDay', appointmentData);

    if (allDay) {
      return true;
    }

    var adapter = (0, _appointmentAdapter.createAppointmentAdapter)(appointmentData, this.dataAccessors, this.timeZoneCalculator);
    return (0, _utils2.getAppointmentTakesAllDay)(adapter, this.startDayHour, this.endDayHour);
  };

  _proto._getAppointmentMaxWidth = function _getAppointmentMaxWidth() {
    return this.cellWidth - this._getAppointmentDefaultOffset();
  };

  _proto.calculateAppointmentWidth = function calculateAppointmentWidth(appointment, position) {
    if (!this.isAllDay(appointment)) {
      return 0;
    }

    var startDate = _date.default.trimTime(position.info.appointment.startDate);

    var normalizedEndDate = position.info.appointment.normalizedEndDate;
    var cellWidth = this.cellWidth || this.getAppointmentMinSize();
    var durationInHours = (normalizedEndDate.getTime() - startDate.getTime()) / toMs('hour');
    var skippedHours = (0, _getSkippedHoursInRange.default)(position.info.appointment.startDate, position.info.appointment.endDate, this.viewDataProvider);
    var width = Math.ceil((durationInHours - skippedHours) / 24) * cellWidth;
    width = this.cropAppointmentWidth(width, cellWidth);
    return width;
  };

  _proto.calculateAppointmentHeight = function calculateAppointmentHeight(appointment, position) {
    if (this.isAllDay(appointment)) {
      return 0;
    }

    var startDate = position.info.appointment.startDate;
    var normalizedEndDate = position.info.appointment.normalizedEndDate;

    var allDay = _expressionUtils.ExpressionUtils.getField(this.dataAccessors, 'allDay', appointment);

    var duration = this.getAppointmentDurationInMs(startDate, normalizedEndDate, allDay);
    var durationInMinutes = this._adjustDurationByDaylightDiff(duration, startDate, normalizedEndDate) / toMs('minute');

    var height = durationInMinutes * this._getMinuteHeight();

    return height;
  };

  _proto.getDirection = function getDirection() {
    return 'vertical';
  };

  _proto._sortCondition = function _sortCondition(a, b) {
    var allDayCondition = a.allDay - b.allDay;
    var isAllDay = a.allDay && b.allDay;
    var condition = this.groupOrientation === 'vertical' && isAllDay ? this._columnCondition(a, b) : this._rowCondition(a, b);
    return allDayCondition ? allDayCondition : condition;
  };

  _proto.allDaySupported = function allDaySupported() {
    return true;
  };

  _proto._getAllDayAppointmentGeometry = function _getAllDayAppointmentGeometry(coordinates) {
    var config = this._calculateGeometryConfig(coordinates);

    return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset, true);
  };

  _proto._calculateGeometryConfig = function _calculateGeometryConfig(coordinates) {
    if (!this.allowResizing || !this.allowAllDayResizing) {
      coordinates.skipResizing = true;
    }

    var config = _BaseAppointmentsStra.prototype._calculateGeometryConfig.call(this, coordinates);

    if (coordinates.count <= this._getDynamicAppointmentCountPerCell().allDay) {
      config.offset = 0;
    }

    return config;
  };

  _proto._getAppointmentCount = function _getAppointmentCount(overlappingMode, coordinates) {
    return overlappingMode !== 'auto' && coordinates.count === 1 && !(0, _type.isNumeric)(overlappingMode) ? coordinates.count : this._getMaxAppointmentCountPerCellByType(coordinates.allDay);
  };

  _proto._getDefaultRatio = function _getDefaultRatio(coordinates, appointmentCountPerCell) {
    return coordinates.count > this.appointmentCountPerCell ? 0.65 : 1;
  };

  _proto._getOffsets = function _getOffsets() {
    return {
      unlimited: ALLDAY_APPOINTMENT_MIN_VERTICAL_OFFSET,
      auto: ALLDAY_APPOINTMENT_MAX_VERTICAL_OFFSET
    };
  };

  _proto._getMaxHeight = function _getMaxHeight() {
    return this.allDayHeight || this.getAppointmentMinSize();
  };

  _proto._needVerticalGroupBounds = function _needVerticalGroupBounds(allDay) {
    return !allDay;
  };

  _proto._needHorizontalGroupBounds = function _needHorizontalGroupBounds() {
    return false;
  };

  _proto.getPositionShift = function getPositionShift(timeShift, isAllDay) {
    if (!isAllDay && this.isAdaptive && this._getMaxAppointmentCountPerCellByType(isAllDay) === 0) {
      return {
        top: 0,
        left: 0,
        cellPosition: 0
      };
    }

    return _BaseAppointmentsStra.prototype.getPositionShift.call(this, timeShift, isAllDay);
  };

  return VerticalRenderingStrategy;
}(_strategy.default);

var _default = VerticalRenderingStrategy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;