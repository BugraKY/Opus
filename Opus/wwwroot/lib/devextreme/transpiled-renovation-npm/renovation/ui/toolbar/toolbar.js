"use strict";

exports.viewFunction = exports.Toolbar = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _toolbar = _interopRequireDefault(require("../../../ui/toolbar"));

var _dom_component_wrapper = require("../common/dom_component_wrapper");

var _toolbar_props = require("./toolbar_props");

var _type = require("../../../core/utils/type");

var _config_context = require("../../common/config_context");

var _resolve_rtl = require("../../utils/resolve_rtl");

var _excluded = ["accessKey", "activeStateEnabled", "className", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "items", "onClick", "onKeyDown", "rtlEnabled", "tabIndex", "visible", "width"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var viewFunction = function viewFunction(_ref) {
  var componentProps = _ref.componentProps,
      restAttributes = _ref.restAttributes;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _toolbar.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};

exports.viewFunction = viewFunction;

var Toolbar = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(Toolbar, _BaseInfernoComponent);

  function Toolbar(props) {
    var _this;

    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    return _this;
  }

  var _proto = Toolbar.prototype;

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.props["items"] !== nextProps["items"] || this.props["rtlEnabled"] !== nextProps["rtlEnabled"] || this.context["ConfigContext"] !== context["ConfigContext"] || this.props !== nextProps) {
      this.__getterCache["componentProps"] = undefined;
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      config: this.config,
      componentProps: this.componentProps,
      resolvedRtlEnabled: this.resolvedRtlEnabled,
      restAttributes: this.restAttributes
    });
  };

  _createClass(Toolbar, [{
    key: "config",
    get: function get() {
      if ("ConfigContext" in this.context) {
        return this.context.ConfigContext;
      }

      return _config_context.ConfigContext;
    }
  }, {
    key: "componentProps",
    get: function get() {
      var _this2 = this;

      if (this.__getterCache["componentProps"] !== undefined) {
        return this.__getterCache["componentProps"];
      }

      return this.__getterCache["componentProps"] = function () {
        var items = _this2.props.items;
        var toolbarItems = items === null || items === void 0 ? void 0 : items.map(function (item) {
          var _item$options, _options$rtlEnabled;

          if (!(0, _type.isObject)(item)) {
            return item;
          }

          var options = (_item$options = item.options) !== null && _item$options !== void 0 ? _item$options : {};
          options.rtlEnabled = (_options$rtlEnabled = options.rtlEnabled) !== null && _options$rtlEnabled !== void 0 ? _options$rtlEnabled : _this2.resolvedRtlEnabled;
          return _extends({}, item, {
            options: options
          });
        });
        return _extends({}, _this2.props, {
          items: toolbarItems
        });
      }();
    }
  }, {
    key: "resolvedRtlEnabled",
    get: function get() {
      var rtlEnabled = this.props.rtlEnabled;
      return !!(0, _resolve_rtl.resolveRtlEnabled)(rtlEnabled, this.config);
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          accessKey = _this$props.accessKey,
          activeStateEnabled = _this$props.activeStateEnabled,
          className = _this$props.className,
          disabled = _this$props.disabled,
          focusStateEnabled = _this$props.focusStateEnabled,
          height = _this$props.height,
          hint = _this$props.hint,
          hoverStateEnabled = _this$props.hoverStateEnabled,
          items = _this$props.items,
          onClick = _this$props.onClick,
          onKeyDown = _this$props.onKeyDown,
          rtlEnabled = _this$props.rtlEnabled,
          tabIndex = _this$props.tabIndex,
          visible = _this$props.visible,
          width = _this$props.width,
          restProps = _objectWithoutProperties(_this$props, _excluded);

      return restProps;
    }
  }]);

  return Toolbar;
}(_inferno2.BaseInfernoComponent);

exports.Toolbar = Toolbar;
Toolbar.defaultProps = _toolbar_props.ToolbarProps;