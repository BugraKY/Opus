"use strict";

exports.viewFunction = exports.AllDayTableProps = exports.AllDayTable = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _table = require("../../table");

var _table_body = require("./table_body");

var _layout_props = require("../../layout_props");

var _const = require("../../../const");

var _excluded = ["addDateTableClass", "addVerticalSizesClassToRows", "bottomVirtualRowHeight", "dataCellTemplate", "groupOrientation", "leftVirtualCellWidth", "rightVirtualCellWidth", "tableRef", "topVirtualRowHeight", "viewData", "width"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var viewFunction = function viewFunction(_ref) {
  var allDayPanelData = _ref.allDayPanelData,
      emptyTableHeight = _ref.emptyTableHeight,
      _ref$props = _ref.props,
      dataCellTemplate = _ref$props.dataCellTemplate,
      tableRef = _ref$props.tableRef,
      viewData = _ref$props.viewData,
      width = _ref$props.width;
  return (0, _inferno.createComponentVNode)(2, _table.Table, {
    "className": "dx-scheduler-all-day-table",
    "height": emptyTableHeight,
    "width": width,
    "tableRef": tableRef,
    children: (0, _inferno.createComponentVNode)(2, _table_body.AllDayPanelTableBody, {
      "viewData": allDayPanelData,
      "leftVirtualCellWidth": viewData.leftVirtualCellWidth,
      "rightVirtualCellWidth": viewData.rightVirtualCellWidth,
      "leftVirtualCellCount": viewData.leftVirtualCellCount,
      "rightVirtualCellCount": viewData.rightVirtualCellCount,
      "dataCellTemplate": dataCellTemplate
    })
  });
};

exports.viewFunction = viewFunction;
var AllDayTableProps = _layout_props.LayoutProps;
exports.AllDayTableProps = AllDayTableProps;

var getTemplate = function getTemplate(TemplateProp) {
  return TemplateProp && (TemplateProp.defaultProps ? function (props) {
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)));
  } : TemplateProp);
};

var AllDayTable = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(AllDayTable, _InfernoWrapperCompon);

  function AllDayTable(props) {
    var _this;

    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    return _this;
  }

  var _proto = AllDayTable.prototype;

  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoWrapperCompon.prototype.componentWillUpdate.call(this);

    if (this.props["viewData"] !== nextProps["viewData"]) {
      this.__getterCache["allDayPanelData"] = undefined;
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        dataCellTemplate: getTemplate(props.dataCellTemplate)
      }),
      allDayPanelData: this.allDayPanelData,
      emptyTableHeight: this.emptyTableHeight,
      restAttributes: this.restAttributes
    });
  };

  _createClass(AllDayTable, [{
    key: "allDayPanelData",
    get: function get() {
      var _this2 = this;

      if (this.__getterCache["allDayPanelData"] !== undefined) {
        return this.__getterCache["allDayPanelData"];
      }

      return this.__getterCache["allDayPanelData"] = function () {
        return _this2.props.viewData.groupedData[0].allDayPanel;
      }();
    }
  }, {
    key: "emptyTableHeight",
    get: function get() {
      return this.allDayPanelData ? undefined : _const.DefaultSizes.allDayPanelHeight;
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          addDateTableClass = _this$props.addDateTableClass,
          addVerticalSizesClassToRows = _this$props.addVerticalSizesClassToRows,
          bottomVirtualRowHeight = _this$props.bottomVirtualRowHeight,
          dataCellTemplate = _this$props.dataCellTemplate,
          groupOrientation = _this$props.groupOrientation,
          leftVirtualCellWidth = _this$props.leftVirtualCellWidth,
          rightVirtualCellWidth = _this$props.rightVirtualCellWidth,
          tableRef = _this$props.tableRef,
          topVirtualRowHeight = _this$props.topVirtualRowHeight,
          viewData = _this$props.viewData,
          width = _this$props.width,
          restProps = _objectWithoutProperties(_this$props, _excluded);

      return restProps;
    }
  }]);

  return AllDayTable;
}(_inferno2.InfernoWrapperComponent);

exports.AllDayTable = AllDayTable;
AllDayTable.defaultProps = AllDayTableProps;