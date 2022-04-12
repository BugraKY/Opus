"use strict";

exports.viewFunction = exports.VirtualRowProps = exports.VirtualRow = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _utils = require("../utils");

var _row = require("./row");

var _virtual_cell = require("./virtual_cell");

var _excluded = ["cellsCount", "children", "className", "height", "isHeaderRow", "leftVirtualCellCount", "leftVirtualCellWidth", "rightVirtualCellCount", "rightVirtualCellWidth", "styles"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var viewFunction = function viewFunction(_ref) {
  var classes = _ref.classes,
      _ref$props = _ref.props,
      leftVirtualCellCount = _ref$props.leftVirtualCellCount,
      leftVirtualCellWidth = _ref$props.leftVirtualCellWidth,
      rightVirtualCellCount = _ref$props.rightVirtualCellCount,
      rightVirtualCellWidth = _ref$props.rightVirtualCellWidth,
      style = _ref.style,
      virtualCells = _ref.virtualCells;
  return (0, _inferno.createComponentVNode)(2, _row.Row, {
    "styles": style,
    "className": classes,
    "leftVirtualCellWidth": leftVirtualCellWidth,
    "rightVirtualCellWidth": rightVirtualCellWidth,
    "leftVirtualCellCount": leftVirtualCellCount,
    "rightVirtualCellCount": rightVirtualCellCount,
    children: virtualCells.map(function (_, index) {
      return (0, _inferno.createComponentVNode)(2, _virtual_cell.VirtualCell, null, index.toString());
    })
  });
};

exports.viewFunction = viewFunction;
var VirtualRowProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_row.RowProps), Object.getOwnPropertyDescriptors({
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  cellsCount: 1
})));
exports.VirtualRowProps = VirtualRowProps;

var VirtualRow = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(VirtualRow, _BaseInfernoComponent);

  function VirtualRow(props) {
    var _this;

    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    return _this;
  }

  var _proto = VirtualRow.prototype;

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.props["cellsCount"] !== nextProps["cellsCount"]) {
      this.__getterCache["virtualCells"] = undefined;
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      style: this.style,
      classes: this.classes,
      virtualCells: this.virtualCells,
      restAttributes: this.restAttributes
    });
  };

  _createClass(VirtualRow, [{
    key: "style",
    get: function get() {
      var height = this.props.height;
      var style = this.restAttributes.style;
      return (0, _utils.addHeightToStyle)(height, style);
    }
  }, {
    key: "classes",
    get: function get() {
      var className = this.props.className;
      return "dx-scheduler-virtual-row ".concat(className);
    }
  }, {
    key: "virtualCells",
    get: function get() {
      var _this2 = this;

      if (this.__getterCache["virtualCells"] !== undefined) {
        return this.__getterCache["virtualCells"];
      }

      return this.__getterCache["virtualCells"] = function () {
        var cellsCount = _this2.props.cellsCount;
        return _toConsumableArray(Array(cellsCount));
      }();
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          cellsCount = _this$props.cellsCount,
          children = _this$props.children,
          className = _this$props.className,
          height = _this$props.height,
          isHeaderRow = _this$props.isHeaderRow,
          leftVirtualCellCount = _this$props.leftVirtualCellCount,
          leftVirtualCellWidth = _this$props.leftVirtualCellWidth,
          rightVirtualCellCount = _this$props.rightVirtualCellCount,
          rightVirtualCellWidth = _this$props.rightVirtualCellWidth,
          styles = _this$props.styles,
          restProps = _objectWithoutProperties(_this$props, _excluded);

      return restProps;
    }
  }]);

  return VirtualRow;
}(_inferno2.BaseInfernoComponent);

exports.VirtualRow = VirtualRow;
VirtualRow.defaultProps = VirtualRowProps;