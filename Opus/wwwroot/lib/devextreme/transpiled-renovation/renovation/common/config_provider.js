"use strict";

exports.viewFunction = exports.ConfigProviderProps = exports.ConfigProvider = void 0;

var _inferno = require("@devextreme/runtime/inferno");

var _excluded = ["children", "rtlEnabled"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var viewFunction = function viewFunction(viewModel) {
  return viewModel.props.children;
};

exports.viewFunction = viewFunction;
var ConfigProviderProps = {};
exports.ConfigProviderProps = ConfigProviderProps;

var ConfigProvider = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(ConfigProvider, _BaseInfernoComponent);

  function ConfigProvider(props) {
    var _this;

    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    return _this;
  }

  var _proto = ConfigProvider.prototype;

  _proto.getChildContext = function getChildContext() {
    return _extends({}, this.context, {
      ConfigContext: this.config
    });
  };

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.props["rtlEnabled"] !== nextProps["rtlEnabled"]) {
      this.__getterCache["config"] = undefined;
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      config: this.config,
      restAttributes: this.restAttributes
    });
  };

  _createClass(ConfigProvider, [{
    key: "config",
    get: function get() {
      var _this2 = this;

      if (this.__getterCache["config"] !== undefined) {
        return this.__getterCache["config"];
      }

      return this.__getterCache["config"] = function () {
        return {
          rtlEnabled: _this2.props.rtlEnabled
        };
      }();
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          children = _this$props.children,
          rtlEnabled = _this$props.rtlEnabled,
          restProps = _objectWithoutProperties(_this$props, _excluded);

      return restProps;
    }
  }]);

  return ConfigProvider;
}(_inferno.BaseInfernoComponent);

exports.ConfigProvider = ConfigProvider;
ConfigProvider.defaultProps = ConfigProviderProps;