"use strict";

exports.default = void 0;

var _common = require("../../../core/utils/common");

var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));

var _uiSchedulerWork_space = _interopRequireDefault(require("./ui.scheduler.work_space.indicator"));

var _date = _interopRequireDefault(require("../../../core/utils/date"));

var _position = require("../../../core/utils/position");

var _utils = require("../utils");

var _window = require("../../../core/utils/window");

var _layout = _interopRequireDefault(require("../../../renovation/ui/scheduler/workspaces/month/date_table/layout.j"));

var _month = require("../../../renovation/ui/scheduler/view_model/to_test/views/utils/month");

var _base = require("../../../renovation/ui/scheduler/view_model/to_test/views/utils/base");

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MONTH_CLASS = 'dx-scheduler-work-space-month';
var DATE_TABLE_CURRENT_DATE_CLASS = 'dx-scheduler-date-table-current-date';
var DATE_TABLE_CELL_TEXT_CLASS = 'dx-scheduler-date-table-cell-text';
var DATE_TABLE_FIRST_OF_MONTH_CLASS = 'dx-scheduler-date-table-first-of-month';
var DATE_TABLE_OTHER_MONTH_DATE_CLASS = 'dx-scheduler-date-table-other-month';
var toMs = _date.default.dateToMilliseconds;

var SchedulerWorkSpaceMonth = /*#__PURE__*/function (_SchedulerWorkSpace) {
  _inheritsLoose(SchedulerWorkSpaceMonth, _SchedulerWorkSpace);

  function SchedulerWorkSpaceMonth() {
    return _SchedulerWorkSpace.apply(this, arguments) || this;
  }

  var _proto = SchedulerWorkSpaceMonth.prototype;

  _proto._getElementClass = function _getElementClass() {
    return MONTH_CLASS;
  };

  _proto._getFormat = function _getFormat() {
    return _base.formatWeekday;
  };

  _proto._getIntervalBetween = function _getIntervalBetween(currentDate) {
    var firstViewDate = this.getStartViewDate();

    var timeZoneOffset = _date.default.getTimezonesDifference(firstViewDate, currentDate);

    return currentDate.getTime() - (firstViewDate.getTime() - this.option('startDayHour') * 3600000) - timeZoneOffset;
  };

  _proto._getDateGenerationOptions = function _getDateGenerationOptions() {
    return _extends({}, _SchedulerWorkSpace.prototype._getDateGenerationOptions.call(this), {
      cellCountInDay: 1
    });
  } // TODO: temporary fix, in the future, if we replace table layout on div layout, getCellWidth method need remove. Details in T712431
  // TODO: there is a test for this bug, when changing the layout, the test will also be useless
  ;

  _proto.getCellWidth = function getCellWidth() {
    var _this = this;

    return this.cache.get('cellWidth', function () {
      var DAYS_IN_WEEK = 7;
      var averageWidth = 0;

      var cells = _this._getCells().slice(0, DAYS_IN_WEEK);

      cells.each(function (index, element) {
        averageWidth += (0, _window.hasWindow)() ? (0, _position.getBoundingRect)(element).width : 0;
      });
      return cells.length === 0 ? undefined : averageWidth / DAYS_IN_WEEK;
    });
  };

  _proto._insertAllDayRowsIntoDateTable = function _insertAllDayRowsIntoDateTable() {
    return false;
  };

  _proto._getCellCoordinatesByIndex = function _getCellCoordinatesByIndex(index) {
    var rowIndex = Math.floor(index / this._getCellCount());
    var columnIndex = index - this._getCellCount() * rowIndex;
    return {
      rowIndex: rowIndex,
      columnIndex: columnIndex
    };
  };

  _proto._needCreateCrossScrolling = function _needCreateCrossScrolling() {
    return this.option('crossScrollingEnabled') || this._isVerticalGroupedWorkSpace();
  };

  _proto._getViewStartByOptions = function _getViewStartByOptions() {
    return (0, _month.getViewStartByOptions)(this.option('startDate'), this.option('currentDate'), this.option('intervalCount'), _date.default.getFirstMonthDate(this.option('startDate')));
  };

  _proto._updateIndex = function _updateIndex(index) {
    return index;
  };

  _proto.isIndicationAvailable = function isIndicationAvailable() {
    return false;
  };

  _proto.getIntervalDuration = function getIntervalDuration() {
    return toMs('day');
  };

  _proto.getTimePanelWidth = function getTimePanelWidth() {
    return 0;
  };

  _proto.supportAllDayRow = function supportAllDayRow() {
    return false;
  };

  _proto.keepOriginalHours = function keepOriginalHours() {
    return true;
  };

  _proto.getWorkSpaceLeftOffset = function getWorkSpaceLeftOffset() {
    return 0;
  };

  _proto.needApplyCollectorOffset = function needApplyCollectorOffset() {
    return true;
  };

  _proto._getHeaderDate = function _getHeaderDate() {
    return this._getViewStartByOptions();
  };

  _proto.scrollToTime = function scrollToTime() {
    return (0, _common.noop)();
  };

  _proto.renderRAllDayPanel = function renderRAllDayPanel() {};

  _proto.renderRTimeTable = function renderRTimeTable() {};

  _proto.renderRDateTable = function renderRDateTable() {
    _utils.utils.renovation.renderComponent(this, this._$dateTable, _layout.default, 'renovatedDateTable', this._getRDateTableProps());
  } // -------------
  // We need these methods for now but they are useless for renovation
  // -------------
  ;

  _proto._createWorkSpaceElements = function _createWorkSpaceElements() {
    if (this._isVerticalGroupedWorkSpace()) {
      this._createWorkSpaceScrollableElements();
    } else {
      _SchedulerWorkSpace.prototype._createWorkSpaceElements.call(this);
    }
  };

  _proto._toggleAllDayVisibility = function _toggleAllDayVisibility() {
    return (0, _common.noop)();
  };

  _proto._changeAllDayVisibility = function _changeAllDayVisibility() {
    return (0, _common.noop)();
  } // --------------
  // These methods should be deleted when we get rid of old render
  // --------------
  ;

  _proto._renderTimePanel = function _renderTimePanel() {
    return (0, _common.noop)();
  };

  _proto._renderAllDayPanel = function _renderAllDayPanel() {
    return (0, _common.noop)();
  };

  _proto._setMonthClassesToCell = function _setMonthClassesToCell($cell, data) {
    $cell.toggleClass(DATE_TABLE_CURRENT_DATE_CLASS, data.isCurrentDate).toggleClass(DATE_TABLE_FIRST_OF_MONTH_CLASS, data.firstDayOfMonth).toggleClass(DATE_TABLE_OTHER_MONTH_DATE_CLASS, data.otherMonth);
  };

  _proto._createAllDayPanelElements = function _createAllDayPanelElements() {};

  _proto._renderTableBody = function _renderTableBody(options) {
    var _this2 = this;

    options.getCellText = function (rowIndex, columnIndex) {
      var date = _this2.viewDataProvider.completeViewDataMap[rowIndex][columnIndex].startDate;
      return (0, _month.getCellText)(date, _this2.option('intervalCount'));
    };

    options.getCellTextClass = DATE_TABLE_CELL_TEXT_CLASS;
    options.setAdditionalClasses = this._setMonthClassesToCell.bind(this), _SchedulerWorkSpace.prototype._renderTableBody.call(this, options);
  };

  _createClass(SchedulerWorkSpaceMonth, [{
    key: "type",
    get: function get() {
      return _constants.VIEWS.MONTH;
    }
  }]);

  return SchedulerWorkSpaceMonth;
}(_uiSchedulerWork_space.default);

(0, _component_registrator.default)('dxSchedulerWorkSpaceMonth', SchedulerWorkSpaceMonth);
var _default = SchedulerWorkSpaceMonth;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;