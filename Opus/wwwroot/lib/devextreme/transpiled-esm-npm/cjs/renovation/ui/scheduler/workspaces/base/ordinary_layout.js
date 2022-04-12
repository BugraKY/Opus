"use strict";

exports.viewFunction = exports.OrdinaryLayout = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _widget = require("../../../common/widget");

var _scrollable = require("../../../scroll_view/scrollable");

var _group_panel = require("./group_panel/group_panel");

var _layout = require("./date_table/all_day_panel/layout");

var _header_panel_empty_cell = require("./header_panel_empty_cell");

var _main_layout_props = require("./main_layout_props");

var _excluded = ["addDateTableClass", "addVerticalSizesClassToRows", "allDayAppointments", "allDayPanelRef", "appointments", "bottomVirtualRowHeight", "className", "dataCellTemplate", "dateCellTemplate", "dateHeaderData", "dateTableRef", "dateTableTemplate", "groupByDate", "groupOrientation", "groupPanelClassName", "groupPanelData", "groupPanelHeight", "groupPanelRef", "groups", "headerEmptyCellWidth", "headerPanelTemplate", "intervalCount", "isAllDayPanelCollapsed", "isAllDayPanelVisible", "isRenderDateHeader", "isRenderGroupPanel", "isRenderHeaderEmptyCell", "isStandaloneAllDayPanel", "isWorkSpaceWithOddCells", "leftVirtualCellWidth", "onScroll", "resourceCellTemplate", "rightVirtualCellWidth", "scrollingDirection", "tablesWidth", "timeCellTemplate", "timePanelData", "timePanelRef", "timePanelTemplate", "topVirtualRowHeight", "viewData", "widgetElementRef", "width"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var viewFunction = function viewFunction(_ref) {
  var dateTableScrollableRef = _ref.dateTableScrollableRef,
      _ref$props = _ref.props,
      allDayAppointments = _ref$props.allDayAppointments,
      allDayPanelRef = _ref$props.allDayPanelRef,
      appointments = _ref$props.appointments,
      className = _ref$props.className,
      dataCellTemplate = _ref$props.dataCellTemplate,
      dateCellTemplate = _ref$props.dateCellTemplate,
      dateHeaderData = _ref$props.dateHeaderData,
      dateTableRef = _ref$props.dateTableRef,
      DateTable = _ref$props.dateTableTemplate,
      groupByDate = _ref$props.groupByDate,
      groupOrientation = _ref$props.groupOrientation,
      groupPanelClassName = _ref$props.groupPanelClassName,
      groupPanelData = _ref$props.groupPanelData,
      groupPanelHeight = _ref$props.groupPanelHeight,
      groupPanelRef = _ref$props.groupPanelRef,
      groups = _ref$props.groups,
      headerEmptyCellWidth = _ref$props.headerEmptyCellWidth,
      HeaderPanel = _ref$props.headerPanelTemplate,
      isRenderDateHeader = _ref$props.isRenderDateHeader,
      isRenderGroupPanel = _ref$props.isRenderGroupPanel,
      isRenderHeaderEmptyCell = _ref$props.isRenderHeaderEmptyCell,
      isStandaloneAllDayPanel = _ref$props.isStandaloneAllDayPanel,
      resourceCellTemplate = _ref$props.resourceCellTemplate,
      scrollingDirection = _ref$props.scrollingDirection,
      timeCellTemplate = _ref$props.timeCellTemplate,
      timePanelData = _ref$props.timePanelData,
      timePanelRef = _ref$props.timePanelRef,
      TimePanel = _ref$props.timePanelTemplate,
      viewData = _ref$props.viewData,
      widgetElementRef = _ref$props.widgetElementRef;
  return (0, _inferno.createComponentVNode)(2, _widget.Widget, {
    "className": className,
    "rootElementRef": widgetElementRef,
    children: [(0, _inferno.createVNode)(1, "div", "dx-scheduler-header-panel-container", [isRenderHeaderEmptyCell && (0, _inferno.createComponentVNode)(2, _header_panel_empty_cell.HeaderPanelEmptyCell, {
      "width": headerEmptyCellWidth,
      "isRenderAllDayTitle": isStandaloneAllDayPanel
    }), (0, _inferno.createVNode)(1, "div", "dx-scheduler-header-tables-container", [(0, _inferno.createVNode)(1, "table", "dx-scheduler-header-panel", HeaderPanel({
      dateHeaderData: dateHeaderData,
      groupPanelData: groupPanelData,
      timeCellTemplate: timeCellTemplate,
      dateCellTemplate: dateCellTemplate,
      isRenderDateHeader: isRenderDateHeader,
      groupOrientation: groupOrientation,
      groupByDate: groupByDate,
      groups: groups,
      resourceCellTemplate: resourceCellTemplate
    }), 0), isStandaloneAllDayPanel && (0, _inferno.createComponentVNode)(2, _layout.AllDayPanelLayout, {
      "viewData": viewData,
      "dataCellTemplate": dataCellTemplate,
      "tableRef": allDayPanelRef,
      "allDayAppointments": allDayAppointments
    })], 0)], 0), (0, _inferno.createComponentVNode)(2, _scrollable.Scrollable, {
      "useKeyboard": false,
      "bounceEnabled": false,
      "direction": scrollingDirection,
      "className": "dx-scheduler-date-table-scrollable",
      children: (0, _inferno.createVNode)(1, "div", "dx-scheduler-date-table-scrollable-content", [isRenderGroupPanel && (0, _inferno.createComponentVNode)(2, _group_panel.GroupPanel, {
        "groupPanelData": groupPanelData,
        "className": groupPanelClassName,
        "groupOrientation": groupOrientation,
        "groupByDate": groupByDate,
        "groups": groups,
        "resourceCellTemplate": resourceCellTemplate,
        "height": groupPanelHeight,
        "elementRef": groupPanelRef
      }), !!TimePanel && TimePanel({
        timePanelData: timePanelData,
        timeCellTemplate: timeCellTemplate,
        groupOrientation: groupOrientation,
        tableRef: timePanelRef
      }), (0, _inferno.createVNode)(1, "div", "dx-scheduler-date-table-container", [DateTable({
        tableRef: dateTableRef,
        viewData: viewData,
        groupOrientation: groupOrientation,
        dataCellTemplate: dataCellTemplate
      }), appointments], 0)], 0)
    }, null, dateTableScrollableRef)]
  });
};

exports.viewFunction = viewFunction;

var getTemplate = function getTemplate(TemplateProp) {
  return TemplateProp && (TemplateProp.defaultProps ? function (props) {
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)));
  } : TemplateProp);
};

var OrdinaryLayout = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(OrdinaryLayout, _BaseInfernoComponent);

  function OrdinaryLayout(props) {
    var _this;

    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.dateTableScrollableRef = (0, _inferno.createRef)();
    _this.getScrollableWidth = _this.getScrollableWidth.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = OrdinaryLayout.prototype;

  _proto.getScrollableWidth = function getScrollableWidth() {
    return this.dateTableScrollableRef.current.container().getBoundingClientRect().width;
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        headerPanelTemplate: getTemplate(props.headerPanelTemplate),
        dateTableTemplate: getTemplate(props.dateTableTemplate),
        timePanelTemplate: getTemplate(props.timePanelTemplate),
        resourceCellTemplate: getTemplate(props.resourceCellTemplate),
        timeCellTemplate: getTemplate(props.timeCellTemplate),
        dateCellTemplate: getTemplate(props.dateCellTemplate),
        dataCellTemplate: getTemplate(props.dataCellTemplate)
      }),
      dateTableScrollableRef: this.dateTableScrollableRef,
      restAttributes: this.restAttributes
    });
  };

  _createClass(OrdinaryLayout, [{
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          addDateTableClass = _this$props.addDateTableClass,
          addVerticalSizesClassToRows = _this$props.addVerticalSizesClassToRows,
          allDayAppointments = _this$props.allDayAppointments,
          allDayPanelRef = _this$props.allDayPanelRef,
          appointments = _this$props.appointments,
          bottomVirtualRowHeight = _this$props.bottomVirtualRowHeight,
          className = _this$props.className,
          dataCellTemplate = _this$props.dataCellTemplate,
          dateCellTemplate = _this$props.dateCellTemplate,
          dateHeaderData = _this$props.dateHeaderData,
          dateTableRef = _this$props.dateTableRef,
          dateTableTemplate = _this$props.dateTableTemplate,
          groupByDate = _this$props.groupByDate,
          groupOrientation = _this$props.groupOrientation,
          groupPanelClassName = _this$props.groupPanelClassName,
          groupPanelData = _this$props.groupPanelData,
          groupPanelHeight = _this$props.groupPanelHeight,
          groupPanelRef = _this$props.groupPanelRef,
          groups = _this$props.groups,
          headerEmptyCellWidth = _this$props.headerEmptyCellWidth,
          headerPanelTemplate = _this$props.headerPanelTemplate,
          intervalCount = _this$props.intervalCount,
          isAllDayPanelCollapsed = _this$props.isAllDayPanelCollapsed,
          isAllDayPanelVisible = _this$props.isAllDayPanelVisible,
          isRenderDateHeader = _this$props.isRenderDateHeader,
          isRenderGroupPanel = _this$props.isRenderGroupPanel,
          isRenderHeaderEmptyCell = _this$props.isRenderHeaderEmptyCell,
          isStandaloneAllDayPanel = _this$props.isStandaloneAllDayPanel,
          isWorkSpaceWithOddCells = _this$props.isWorkSpaceWithOddCells,
          leftVirtualCellWidth = _this$props.leftVirtualCellWidth,
          onScroll = _this$props.onScroll,
          resourceCellTemplate = _this$props.resourceCellTemplate,
          rightVirtualCellWidth = _this$props.rightVirtualCellWidth,
          scrollingDirection = _this$props.scrollingDirection,
          tablesWidth = _this$props.tablesWidth,
          timeCellTemplate = _this$props.timeCellTemplate,
          timePanelData = _this$props.timePanelData,
          timePanelRef = _this$props.timePanelRef,
          timePanelTemplate = _this$props.timePanelTemplate,
          topVirtualRowHeight = _this$props.topVirtualRowHeight,
          viewData = _this$props.viewData,
          widgetElementRef = _this$props.widgetElementRef,
          width = _this$props.width,
          restProps = _objectWithoutProperties(_this$props, _excluded);

      return restProps;
    }
  }]);

  return OrdinaryLayout;
}(_inferno2.BaseInfernoComponent);

exports.OrdinaryLayout = OrdinaryLayout;
OrdinaryLayout.defaultProps = _main_layout_props.MainLayoutProps;