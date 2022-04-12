"use strict";

exports.default = void 0;

var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));

var _uiScheduler = _interopRequireDefault(require("./ui.scheduler.timeline"));

var _date = _interopRequireDefault(require("../../../core/utils/date"));

var _layout = _interopRequireDefault(require("../../../renovation/ui/scheduler/workspaces/base/header_panel/layout.j"));

var _month = require("../../../renovation/ui/scheduler/view_model/to_test/views/utils/month");

var _base = require("../../../renovation/ui/scheduler/view_model/to_test/views/utils/base");

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TIMELINE_CLASS = 'dx-scheduler-timeline-month';

var SchedulerTimelineMonth = /*#__PURE__*/function (_SchedulerTimeline) {
  _inheritsLoose(SchedulerTimelineMonth, _SchedulerTimeline);

  function SchedulerTimelineMonth() {
    return _SchedulerTimeline.apply(this, arguments) || this;
  }

  var _proto = SchedulerTimelineMonth.prototype;

  _proto._renderView = function _renderView() {
    _SchedulerTimeline.prototype._renderView.call(this);

    this._updateScrollable();
  };

  _proto._getElementClass = function _getElementClass() {
    return TIMELINE_CLASS;
  };

  _proto._getDateHeaderTemplate = function _getDateHeaderTemplate() {
    return this.option('dateCellTemplate');
  };

  _proto._calculateDurationInCells = function _calculateDurationInCells(timeDiff) {
    return timeDiff / this.getCellDuration();
  };

  _proto.isIndicatorVisible = function isIndicatorVisible() {
    return true;
  };

  _proto._getFormat = function _getFormat() {
    return _base.formatWeekdayAndDay;
  };

  _proto._getIntervalBetween = function _getIntervalBetween(currentDate) {
    var firstViewDate = this.getStartViewDate();

    var timeZoneOffset = _date.default.getTimezonesDifference(firstViewDate, currentDate);

    return currentDate.getTime() - (firstViewDate.getTime() - this.option('startDayHour') * 3600000) - timeZoneOffset;
  };

  _proto._getViewStartByOptions = function _getViewStartByOptions() {
    return (0, _month.getViewStartByOptions)(this.option('startDate'), this.option('currentDate'), this.option('intervalCount'), _date.default.getFirstMonthDate(this.option('startDate')));
  };

  _proto.generateRenderOptions = function generateRenderOptions() {
    var options = _SchedulerTimeline.prototype.generateRenderOptions.call(this, true);

    return _extends({}, options, {
      getDateForHeaderText: function getDateForHeaderText(_, date) {
        return date;
      }
    });
  };

  _createClass(SchedulerTimelineMonth, [{
    key: "type",
    get: function get() {
      return _constants.VIEWS.TIMELINE_MONTH;
    }
  }, {
    key: "viewDirection",
    get: function get() {
      return 'horizontal';
    }
  }, {
    key: "renovatedHeaderPanelComponent",
    get: function get() {
      return _layout.default;
    }
  }]);

  return SchedulerTimelineMonth;
}(_uiScheduler.default);

(0, _component_registrator.default)('dxSchedulerTimelineMonth', SchedulerTimelineMonth);
var _default = SchedulerTimelineMonth;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;