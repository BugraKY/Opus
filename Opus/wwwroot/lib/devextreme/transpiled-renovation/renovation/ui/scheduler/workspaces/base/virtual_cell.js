"use strict";

exports.viewFunction = exports.VirtualCellProps = exports.VirtualCell = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _utils = require("../utils");

var _header_cell = require("./header_cell");

var _ordinary_cell = require("./ordinary_cell");

var _excluded = ["colSpan", "isHeaderCell", "width"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var viewFunction = function viewFunction(_ref) {
  var Cell = _ref.cellComponent,
      colSpan = _ref.props.colSpan,
      style = _ref.style;
  return (0, _inferno.createComponentVNode)(2, Cell, {
    "className": "dx-scheduler-virtual-cell",
    "styles": style,
    "colSpan": colSpan
  });
};

exports.viewFunction = viewFunction;
var VirtualCellProps = {
  width: 0,
  isHeaderCell: false
};
exports.VirtualCellProps = VirtualCellProps;

var VirtualCell = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(VirtualCell, _BaseInfernoComponent);

  function VirtualCell(props) {
    var _this;

    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }

  var _proto = VirtualCell.prototype;

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      style: this.style,
      cellComponent: this.cellComponent,
      restAttributes: this.restAttributes
    });
  };

  _createClass(VirtualCell, [{
    key: "style",
    get: function get() {
      var width = this.props.width;
      var style = this.restAttributes.style;
      return (0, _utils.addWidthToStyle)(width, style);
    }
  }, {
    key: "cellComponent",
    get: function get() {
      return this.props.isHeaderCell ? _header_cell.HeaderCell : _ordinary_cell.OrdinaryCell;
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          colSpan = _this$props.colSpan,
          isHeaderCell = _this$props.isHeaderCell,
          width = _this$props.width,
          restProps = _objectWithoutProperties(_this$props, _excluded);

      return restProps;
    }
  }]);

  return VirtualCell;
}(_inferno2.BaseInfernoComponent);

exports.VirtualCell = VirtualCell;
VirtualCell.defaultProps = VirtualCellProps;