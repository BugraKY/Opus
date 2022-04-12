"use strict";

exports.viewFunction = exports.OverflowIndicatorProps = exports.OverflowIndicator = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _combine_classes = require("../../../../utils/combine_classes");

var _button = require("../../../button");

var _utils = require("./utils");

var _message = _interopRequireDefault(require("../../../../../localization/message"));

var _excluded = ["overflowIndicatorTemplate", "viewModel"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var viewFunction = function viewFunction(_ref) {
  var appointmentCount = _ref.appointmentCount,
      classes = _ref.classes,
      isCompact = _ref.isCompact,
      OverflowIndicatorTemplate = _ref.props.overflowIndicatorTemplate,
      styles = _ref.styles,
      text = _ref.text;
  return (0, _inferno.createComponentVNode)(2, _button.Button, {
    "text": text,
    "style": (0, _inferno2.normalizeStyles)(styles),
    "className": classes,
    "type": "default",
    "stylingMode": "contained",
    children: OverflowIndicatorTemplate && OverflowIndicatorTemplate({
      appointmentCount: appointmentCount,
      isCompact: isCompact
    })
  });
};

exports.viewFunction = viewFunction;
var OverflowIndicatorProps = {};
exports.OverflowIndicatorProps = OverflowIndicatorProps;

var getTemplate = function getTemplate(TemplateProp) {
  return TemplateProp && (TemplateProp.defaultProps ? function (props) {
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)));
  } : TemplateProp);
};

var OverflowIndicator = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(OverflowIndicator, _BaseInfernoComponent);

  function OverflowIndicator(props) {
    var _this;

    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }

  var _proto = OverflowIndicator.prototype;

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        overflowIndicatorTemplate: getTemplate(props.overflowIndicatorTemplate)
      }),
      appointmentCount: this.appointmentCount,
      isCompact: this.isCompact,
      text: this.text,
      styles: this.styles,
      classes: this.classes,
      restAttributes: this.restAttributes
    });
  };

  _createClass(OverflowIndicator, [{
    key: "appointmentCount",
    get: function get() {
      return this.props.viewModel.items.settings.length;
    }
  }, {
    key: "isCompact",
    get: function get() {
      return this.props.viewModel.isCompact;
    }
  }, {
    key: "text",
    get: function get() {
      var isCompact = this.props.viewModel.isCompact;

      if (isCompact) {
        return "".concat(this.appointmentCount);
      }

      var formatter = _message.default.getFormatter("dxScheduler-moreAppointments");

      return formatter(this.appointmentCount);
    }
  }, {
    key: "styles",
    get: function get() {
      return (0, _utils.getOverflowIndicatorStyles)(this.props.viewModel);
    }
  }, {
    key: "classes",
    get: function get() {
      return (0, _combine_classes.combineClasses)({
        "dx-scheduler-appointment-collector": true,
        "dx-scheduler-appointment-collector-compact": this.isCompact
      });
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          overflowIndicatorTemplate = _this$props.overflowIndicatorTemplate,
          viewModel = _this$props.viewModel,
          restProps = _objectWithoutProperties(_this$props, _excluded);

      return restProps;
    }
  }]);

  return OverflowIndicator;
}(_inferno2.BaseInfernoComponent);

exports.OverflowIndicator = OverflowIndicator;
OverflowIndicator.defaultProps = OverflowIndicatorProps;