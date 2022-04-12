"use strict";

exports.WorkSpaceProps = exports.CurrentViewConfigType = void 0;

var _date = _interopRequireDefault(require("../../../../core/utils/date"));

var _base_props = require("../../common/base_props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DEFAULT_GROUPS = [];
var WorkSpaceProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_base_props.BaseWidgetProps), Object.getOwnPropertyDescriptors(Object.defineProperties({
  intervalCount: 1,
  groups: DEFAULT_GROUPS,
  groupByDate: false,
  crossScrollingEnabled: false,
  startDayHour: 0,
  endDayHour: 24,
  firstDayOfWeek: 0,
  hoursInterval: 0.5,
  showAllDayPanel: false,
  allDayPanelExpanded: false,
  allowMultipleCellSelection: true,
  shadeUntilCurrentTime: true,
  cellDuration: 30,
  showCurrentTimeIndicator: true,
  type: "week"
}, {
  indicatorTime: {
    get: function get() {
      return new Date();
    },
    configurable: true,
    enumerable: true
  },
  indicatorUpdateInterval: {
    get: function get() {
      return 5 * _date.default.dateToMilliseconds("minute");
    },
    configurable: true,
    enumerable: true
  },
  selectedCellData: {
    get: function get() {
      return [];
    },
    configurable: true,
    enumerable: true
  },
  scrolling: {
    get: function get() {
      return {
        mode: "standard"
      };
    },
    configurable: true,
    enumerable: true
  }
}))));
exports.WorkSpaceProps = WorkSpaceProps;
var CurrentViewConfigType = Object.defineProperties({}, {
  intervalCount: {
    get: function get() {
      return WorkSpaceProps.intervalCount;
    },
    configurable: true,
    enumerable: true
  },
  groups: {
    get: function get() {
      return WorkSpaceProps.groups;
    },
    configurable: true,
    enumerable: true
  },
  groupByDate: {
    get: function get() {
      return WorkSpaceProps.groupByDate;
    },
    configurable: true,
    enumerable: true
  },
  crossScrollingEnabled: {
    get: function get() {
      return WorkSpaceProps.crossScrollingEnabled;
    },
    configurable: true,
    enumerable: true
  },
  startDayHour: {
    get: function get() {
      return WorkSpaceProps.startDayHour;
    },
    configurable: true,
    enumerable: true
  },
  endDayHour: {
    get: function get() {
      return WorkSpaceProps.endDayHour;
    },
    configurable: true,
    enumerable: true
  },
  firstDayOfWeek: {
    get: function get() {
      return WorkSpaceProps.firstDayOfWeek;
    },
    configurable: true,
    enumerable: true
  },
  hoursInterval: {
    get: function get() {
      return WorkSpaceProps.hoursInterval;
    },
    configurable: true,
    enumerable: true
  },
  showAllDayPanel: {
    get: function get() {
      return WorkSpaceProps.showAllDayPanel;
    },
    configurable: true,
    enumerable: true
  },
  allDayPanelExpanded: {
    get: function get() {
      return WorkSpaceProps.allDayPanelExpanded;
    },
    configurable: true,
    enumerable: true
  },
  allowMultipleCellSelection: {
    get: function get() {
      return WorkSpaceProps.allowMultipleCellSelection;
    },
    configurable: true,
    enumerable: true
  },
  indicatorTime: {
    get: function get() {
      return WorkSpaceProps.indicatorTime;
    },
    configurable: true,
    enumerable: true
  },
  indicatorUpdateInterval: {
    get: function get() {
      return WorkSpaceProps.indicatorUpdateInterval;
    },
    configurable: true,
    enumerable: true
  },
  shadeUntilCurrentTime: {
    get: function get() {
      return WorkSpaceProps.shadeUntilCurrentTime;
    },
    configurable: true,
    enumerable: true
  },
  selectedCellData: {
    get: function get() {
      return WorkSpaceProps.selectedCellData;
    },
    configurable: true,
    enumerable: true
  },
  scrolling: {
    get: function get() {
      return WorkSpaceProps.scrolling;
    },
    configurable: true,
    enumerable: true
  },
  cellDuration: {
    get: function get() {
      return WorkSpaceProps.cellDuration;
    },
    configurable: true,
    enumerable: true
  },
  showCurrentTimeIndicator: {
    get: function get() {
      return WorkSpaceProps.showCurrentTimeIndicator;
    },
    configurable: true,
    enumerable: true
  },
  type: {
    get: function get() {
      return WorkSpaceProps.type;
    },
    configurable: true,
    enumerable: true
  },
  focusStateEnabled: {
    get: function get() {
      return WorkSpaceProps.focusStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  tabIndex: {
    get: function get() {
      return WorkSpaceProps.tabIndex;
    },
    configurable: true,
    enumerable: true
  }
});
exports.CurrentViewConfigType = CurrentViewConfigType;