"use strict";

exports.viewFunction = exports.DateTableLayoutProps = exports.DateTableLayoutBase = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _table = require("../table");

var _table_body = require("./table_body");

var _layout_props = require("../layout_props");

var _cell = require("./cell");

var _excluded = ["addDateTableClass", "addVerticalSizesClassToRows", "bottomVirtualRowHeight", "cellTemplate", "dataCellTemplate", "groupOrientation", "leftVirtualCellWidth", "rightVirtualCellWidth", "tableRef", "topVirtualRowHeight", "viewData", "width"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var viewFunction = function viewFunction(_ref) {
  var bottomVirtualRowHeight = _ref.bottomVirtualRowHeight,
      classes = _ref.classes,
      leftVirtualCellWidth = _ref.leftVirtualCellWidth,
      _ref$props = _ref.props,
      addVerticalSizesClassToRows = _ref$props.addVerticalSizesClassToRows,
      cellTemplate = _ref$props.cellTemplate,
      dataCellTemplate = _ref$props.dataCellTemplate,
      groupOrientation = _ref$props.groupOrientation,
      tableRef = _ref$props.tableRef,
      viewData = _ref$props.viewData,
      width = _ref$props.width,
      restAttributes = _ref.restAttributes,
      rightVirtualCellWidth = _ref.rightVirtualCellWidth,
      topVirtualRowHeight = _ref.topVirtualRowHeight,
      virtualCellsCount = _ref.virtualCellsCount;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _table.Table, _extends({}, restAttributes, {
    "tableRef": tableRef,
    "topVirtualRowHeight": topVirtualRowHeight,
    "bottomVirtualRowHeight": bottomVirtualRowHeight,
    "leftVirtualCellWidth": leftVirtualCellWidth,
    "rightVirtualCellWidth": rightVirtualCellWidth,
    "leftVirtualCellCount": viewData.leftVirtualCellCount,
    "rightVirtualCellCount": viewData.rightVirtualCellCount,
    "virtualCellsCount": virtualCellsCount,
    "className": classes,
    "width": width,
    children: (0, _inferno.createComponentVNode)(2, _table_body.DateTableBody, {
      "cellTemplate": cellTemplate,
      "viewData": viewData,
      "dataCellTemplate": dataCellTemplate,
      "leftVirtualCellWidth": leftVirtualCellWidth,
      "rightVirtualCellWidth": rightVirtualCellWidth,
      "groupOrientation": groupOrientation,
      "addVerticalSizesClassToRows": addVerticalSizesClassToRows
    })
  })));
};

exports.viewFunction = viewFunction;
var DateTableLayoutProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_layout_props.LayoutProps), Object.getOwnPropertyDescriptors({
  cellTemplate: _cell.DateTableCellBase
})));
exports.DateTableLayoutProps = DateTableLayoutProps;

var getTemplate = function getTemplate(TemplateProp) {
  return TemplateProp && (TemplateProp.defaultProps ? function (props) {
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)));
  } : TemplateProp);
};

var DateTableLayoutBase = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(DateTableLayoutBase, _InfernoWrapperCompon);

  function DateTableLayoutBase(props) {
    var _this;

    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.state = {};
    return _this;
  }

  var _proto = DateTableLayoutBase.prototype;

  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        cellTemplate: getTemplate(props.cellTemplate),
        dataCellTemplate: getTemplate(props.dataCellTemplate)
      }),
      classes: this.classes,
      topVirtualRowHeight: this.topVirtualRowHeight,
      bottomVirtualRowHeight: this.bottomVirtualRowHeight,
      leftVirtualCellWidth: this.leftVirtualCellWidth,
      rightVirtualCellWidth: this.rightVirtualCellWidth,
      virtualCellsCount: this.virtualCellsCount,
      restAttributes: this.restAttributes
    });
  };

  _createClass(DateTableLayoutBase, [{
    key: "classes",
    get: function get() {
      var addDateTableClass = this.props.addDateTableClass;
      return addDateTableClass ? "dx-scheduler-date-table" : undefined;
    }
  }, {
    key: "topVirtualRowHeight",
    get: function get() {
      var _this$props$viewData$;

      return (_this$props$viewData$ = this.props.viewData.topVirtualRowHeight) !== null && _this$props$viewData$ !== void 0 ? _this$props$viewData$ : 0;
    }
  }, {
    key: "bottomVirtualRowHeight",
    get: function get() {
      var _this$props$viewData$2;

      return (_this$props$viewData$2 = this.props.viewData.bottomVirtualRowHeight) !== null && _this$props$viewData$2 !== void 0 ? _this$props$viewData$2 : 0;
    }
  }, {
    key: "leftVirtualCellWidth",
    get: function get() {
      var _this$props$viewData$3;

      return (_this$props$viewData$3 = this.props.viewData.leftVirtualCellWidth) !== null && _this$props$viewData$3 !== void 0 ? _this$props$viewData$3 : 0;
    }
  }, {
    key: "rightVirtualCellWidth",
    get: function get() {
      var _this$props$viewData$4;

      return (_this$props$viewData$4 = this.props.viewData.rightVirtualCellWidth) !== null && _this$props$viewData$4 !== void 0 ? _this$props$viewData$4 : 0;
    }
  }, {
    key: "virtualCellsCount",
    get: function get() {
      return this.props.viewData.groupedData[0].dateTable[0].length;
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          addDateTableClass = _this$props.addDateTableClass,
          addVerticalSizesClassToRows = _this$props.addVerticalSizesClassToRows,
          bottomVirtualRowHeight = _this$props.bottomVirtualRowHeight,
          cellTemplate = _this$props.cellTemplate,
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

  return DateTableLayoutBase;
}(_inferno2.InfernoWrapperComponent);

exports.DateTableLayoutBase = DateTableLayoutBase;
DateTableLayoutBase.defaultProps = DateTableLayoutProps;