"use strict";

exports.viewFunction = exports.AppointmentContentProps = exports.AppointmentContent = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _excluded = ["dateText", "isRecurrent", "isReduced", "text"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var viewFunction = function viewFunction(_ref) {
  var _ref$props = _ref.props,
      dateText = _ref$props.dateText,
      isRecurrent = _ref$props.isRecurrent,
      isReduced = _ref$props.isReduced,
      text = _ref$props.text;
  return (0, _inferno.createVNode)(1, "div", "dx-scheduler-appointment-content", [(0, _inferno.createVNode)(1, "div", "dx-scheduler-appointment-title", text, 0), (0, _inferno.createVNode)(1, "div", "dx-scheduler-appointment-content-details", (0, _inferno.createVNode)(1, "div", "dx-scheduler-appointment-content-date", dateText, 0), 2), isRecurrent && (0, _inferno.createVNode)(1, "div", "dx-scheduler-appointment-recurrence-icon dx-icon-repeat"), isReduced && (0, _inferno.createVNode)(1, "div", "dx-scheduler-appointment-reduced-icon")], 0);
};

exports.viewFunction = viewFunction;
var AppointmentContentProps = {
  text: "",
  dateText: "",
  isRecurrent: false,
  isReduced: false
};
exports.AppointmentContentProps = AppointmentContentProps;

var AppointmentContent = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(AppointmentContent, _BaseInfernoComponent);

  function AppointmentContent(props) {
    var _this;

    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }

  var _proto = AppointmentContent.prototype;

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      restAttributes: this.restAttributes
    });
  };

  _createClass(AppointmentContent, [{
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          dateText = _this$props.dateText,
          isRecurrent = _this$props.isRecurrent,
          isReduced = _this$props.isReduced,
          text = _this$props.text,
          restProps = _objectWithoutProperties(_this$props, _excluded);

      return restProps;
    }
  }]);

  return AppointmentContent;
}(_inferno2.BaseInfernoComponent);

exports.AppointmentContent = AppointmentContent;
AppointmentContent.defaultProps = AppointmentContentProps;