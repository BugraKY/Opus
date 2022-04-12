"use strict";

exports.defaultOptionRules = exports.ButtonProps = exports.Button = void 0;
exports.defaultOptions = defaultOptions;
exports.viewFunction = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _utils = require("../../core/options/utils");

var _devices = _interopRequireDefault(require("../../core/devices"));

var _themes = require("../../ui/themes");

var _short = require("../../events/short");

var _combine_classes = require("../utils/combine_classes");

var _icon = require("../../core/utils/icon");

var _icon2 = require("./common/icon");

var _ink_ripple = require("./common/ink_ripple");

var _widget = require("./common/widget");

var _base_props = require("./common/base_props");

var _excluded = ["accessKey", "activeStateEnabled", "children", "className", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "icon", "iconPosition", "iconTemplate", "onClick", "onKeyDown", "onSubmit", "pressed", "rtlEnabled", "stylingMode", "tabIndex", "template", "templateData", "text", "type", "useInkRipple", "useSubmitBehavior", "visible", "width"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var stylingModes = ["outlined", "text", "contained"];

var getCssClasses = function getCssClasses(model) {
  var _classesMap;

  var icon = model.icon,
      iconPosition = model.iconPosition,
      stylingMode = model.stylingMode,
      text = model.text,
      type = model.type;
  var isValidStylingMode = stylingMode && stylingModes.includes(stylingMode);
  var classesMap = (_classesMap = {
    "dx-button": true
  }, _defineProperty(_classesMap, "dx-button-mode-".concat(isValidStylingMode ? stylingMode : "contained"), true), _defineProperty(_classesMap, "dx-button-".concat(type !== null && type !== void 0 ? type : "normal"), true), _defineProperty(_classesMap, "dx-button-has-text", !!text), _defineProperty(_classesMap, "dx-button-has-icon", !!icon), _defineProperty(_classesMap, "dx-button-icon-right", iconPosition !== "left"), _classesMap);
  return (0, _combine_classes.combineClasses)(classesMap);
};

var viewFunction = function viewFunction(viewModel) {
  var _viewModel$props = viewModel.props,
      children = _viewModel$props.children,
      iconPosition = _viewModel$props.iconPosition,
      IconTemplate = _viewModel$props.iconTemplate,
      ButtonTemplate = _viewModel$props.template,
      text = _viewModel$props.text;
  var renderText = !viewModel.props.template && !children && text !== "";
  var isIconLeft = iconPosition === "left";
  var iconComponent = !viewModel.props.template && !children && (viewModel.iconSource || viewModel.props.iconTemplate) && (0, _inferno.createComponentVNode)(2, _icon2.Icon, {
    "source": viewModel.iconSource,
    "position": iconPosition,
    "iconTemplate": IconTemplate
  });
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
    "accessKey": viewModel.props.accessKey,
    "activeStateEnabled": viewModel.props.activeStateEnabled,
    "aria": viewModel.aria,
    "className": viewModel.props.className,
    "classes": viewModel.cssClasses,
    "disabled": viewModel.props.disabled,
    "focusStateEnabled": viewModel.props.focusStateEnabled,
    "height": viewModel.props.height,
    "hint": viewModel.props.hint,
    "hoverStateEnabled": viewModel.props.hoverStateEnabled,
    "onActive": viewModel.onActive,
    "onClick": viewModel.onWidgetClick,
    "onInactive": viewModel.onInactive,
    "onKeyDown": viewModel.keyDown,
    "rtlEnabled": viewModel.props.rtlEnabled,
    "tabIndex": viewModel.props.tabIndex,
    "visible": viewModel.props.visible,
    "width": viewModel.props.width
  }, viewModel.restAttributes, {
    children: (0, _inferno.createVNode)(1, "div", "dx-button-content", [viewModel.props.template && ButtonTemplate({
      data: viewModel.buttonTemplateData
    }), !viewModel.props.template && children, isIconLeft && iconComponent, renderText && (0, _inferno.createVNode)(1, "span", "dx-button-text", text, 0), !isIconLeft && iconComponent, viewModel.props.useSubmitBehavior && (0, _inferno.createVNode)(64, "input", "dx-button-submit-input", null, 1, {
      "type": "submit",
      "tabIndex": -1
    }, null, viewModel.submitInputRef), viewModel.props.useInkRipple && (0, _inferno.createComponentVNode)(2, _ink_ripple.InkRipple, {
      "config": viewModel.inkRippleConfig
    }, null, viewModel.inkRippleRef)], 0, null, null, viewModel.contentRef)
  }), null, viewModel.widgetRef));
};

exports.viewFunction = viewFunction;
var ButtonProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_base_props.BaseWidgetProps), Object.getOwnPropertyDescriptors(Object.defineProperties({
  activeStateEnabled: true,
  hoverStateEnabled: true,
  icon: "",
  iconPosition: "left",
  stylingMode: "contained",
  text: "",
  type: "normal",
  useInkRipple: false,
  useSubmitBehavior: false
}, {
  templateData: {
    get: function get() {
      return {};
    },
    configurable: true,
    enumerable: true
  }
}))));
exports.ButtonProps = ButtonProps;
var defaultOptionRules = (0, _utils.createDefaultOptionRules)([{
  device: function device() {
    return _devices.default.real().deviceType === "desktop" && !_devices.default.isSimulator();
  },
  options: {
    focusStateEnabled: true
  }
}, {
  device: function device() {
    return (0, _themes.isMaterial)((0, _themes.current)());
  },
  options: {
    useInkRipple: true
  }
}]);
exports.defaultOptionRules = defaultOptionRules;

var getTemplate = function getTemplate(TemplateProp) {
  return TemplateProp && (TemplateProp.defaultProps ? function (props) {
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)));
  } : TemplateProp);
};

var Button = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(Button, _InfernoWrapperCompon);

  function Button(props) {
    var _this;

    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.state = {};
    _this.contentRef = (0, _inferno.createRef)();
    _this.inkRippleRef = (0, _inferno.createRef)();
    _this.submitInputRef = (0, _inferno.createRef)();
    _this.widgetRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    _this.activate = _this.activate.bind(_assertThisInitialized(_this));
    _this.deactivate = _this.deactivate.bind(_assertThisInitialized(_this));
    _this.submitEffect = _this.submitEffect.bind(_assertThisInitialized(_this));
    _this.onActive = _this.onActive.bind(_assertThisInitialized(_this));
    _this.onInactive = _this.onInactive.bind(_assertThisInitialized(_this));
    _this.onWidgetClick = _this.onWidgetClick.bind(_assertThisInitialized(_this));
    _this.keyDown = _this.keyDown.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Button.prototype;

  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.submitEffect, [this.props.onSubmit, this.props.useSubmitBehavior]), (0, _inferno2.createReRenderEffect)()];
  };

  _proto.updateEffects = function updateEffects() {
    var _this$_effects$;

    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.onSubmit, this.props.useSubmitBehavior]);
  };

  _proto.submitEffect = function submitEffect() {
    var _this2 = this;

    var namespace = "UIFeedback";
    var _this$props = this.props,
        onSubmit = _this$props.onSubmit,
        useSubmitBehavior = _this$props.useSubmitBehavior;

    if (useSubmitBehavior && onSubmit) {
      _short.click.on(this.submitInputRef.current, function (event) {
        return onSubmit({
          event: event,
          submitInput: _this2.submitInputRef.current
        });
      }, {
        namespace: namespace
      });

      return function () {
        return _short.click.off(_this2.submitInputRef.current, {
          namespace: namespace
        });
      };
    }

    return undefined;
  };

  _proto.onActive = function onActive(event) {
    var useInkRipple = this.props.useInkRipple;
    useInkRipple && this.inkRippleRef.current.showWave({
      element: this.contentRef.current,
      event: event
    });
  };

  _proto.onInactive = function onInactive(event) {
    var useInkRipple = this.props.useInkRipple;
    useInkRipple && this.inkRippleRef.current.hideWave({
      element: this.contentRef.current,
      event: event
    });
  };

  _proto.onWidgetClick = function onWidgetClick(event) {
    var _this$props2 = this.props,
        onClick = _this$props2.onClick,
        useSubmitBehavior = _this$props2.useSubmitBehavior;
    onClick === null || onClick === void 0 ? void 0 : onClick({
      event: event
    });
    useSubmitBehavior && this.submitInputRef.current.click();
  };

  _proto.keyDown = function keyDown(e) {
    var onKeyDown = this.props.onKeyDown;
    var keyName = e.keyName,
        originalEvent = e.originalEvent,
        which = e.which;
    var result = onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);

    if (result !== null && result !== void 0 && result.cancel) {
      return result;
    }

    if (keyName === "space" || which === "space" || keyName === "enter" || which === "enter") {
      originalEvent.preventDefault();
      this.onWidgetClick(originalEvent);
    }

    return undefined;
  };

  _proto.focus = function focus() {
    this.widgetRef.current.focus();
  };

  _proto.activate = function activate() {
    this.widgetRef.current.activate();
  };

  _proto.deactivate = function deactivate() {
    this.widgetRef.current.deactivate();
  };

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoWrapperCompon.prototype.componentWillUpdate.call(this);

    if (this.props["icon"] !== nextProps["icon"] || this.props["text"] !== nextProps["text"] || this.props["type"] !== nextProps["type"]) {
      this.__getterCache["inkRippleConfig"] = undefined;
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        template: getTemplate(props.template),
        iconTemplate: getTemplate(props.iconTemplate)
      }),
      contentRef: this.contentRef,
      submitInputRef: this.submitInputRef,
      inkRippleRef: this.inkRippleRef,
      widgetRef: this.widgetRef,
      onActive: this.onActive,
      onInactive: this.onInactive,
      onWidgetClick: this.onWidgetClick,
      keyDown: this.keyDown,
      aria: this.aria,
      cssClasses: this.cssClasses,
      iconSource: this.iconSource,
      inkRippleConfig: this.inkRippleConfig,
      buttonTemplateData: this.buttonTemplateData,
      restAttributes: this.restAttributes
    });
  };

  _createClass(Button, [{
    key: "aria",
    get: function get() {
      var _this$props3 = this.props,
          icon = _this$props3.icon,
          text = _this$props3.text;
      var label = (text !== null && text !== void 0 ? text : "") || icon;

      if (!text && icon && (0, _icon.getImageSourceType)(icon) === "image") {
        label = !icon.includes("base64") ? icon.replace(/.+\/([^.]+)\..+$/, "$1") : "Base64";
      }

      return _extends({
        role: "button"
      }, label ? {
        label: label
      } : {});
    }
  }, {
    key: "cssClasses",
    get: function get() {
      return getCssClasses(this.props);
    }
  }, {
    key: "iconSource",
    get: function get() {
      var _this$props4 = this.props,
          icon = _this$props4.icon,
          type = _this$props4.type;

      if (icon || type === "back") {
        return (icon !== null && icon !== void 0 ? icon : "") || "back";
      }

      return "";
    }
  }, {
    key: "inkRippleConfig",
    get: function get() {
      var _this3 = this;

      if (this.__getterCache["inkRippleConfig"] !== undefined) {
        return this.__getterCache["inkRippleConfig"];
      }

      return this.__getterCache["inkRippleConfig"] = function () {
        var _this3$props = _this3.props,
            icon = _this3$props.icon,
            text = _this3$props.text,
            type = _this3$props.type;
        return !text && icon || type === "back" ? {
          isCentered: true,
          useHoldAnimation: false,
          waveSizeCoefficient: 1
        } : {};
      }();
    }
  }, {
    key: "buttonTemplateData",
    get: function get() {
      var _this$props5 = this.props,
          icon = _this$props5.icon,
          templateData = _this$props5.templateData,
          text = _this$props5.text;
      return _extends({
        icon: icon,
        text: text
      }, templateData);
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props6 = this.props,
          accessKey = _this$props6.accessKey,
          activeStateEnabled = _this$props6.activeStateEnabled,
          children = _this$props6.children,
          className = _this$props6.className,
          disabled = _this$props6.disabled,
          focusStateEnabled = _this$props6.focusStateEnabled,
          height = _this$props6.height,
          hint = _this$props6.hint,
          hoverStateEnabled = _this$props6.hoverStateEnabled,
          icon = _this$props6.icon,
          iconPosition = _this$props6.iconPosition,
          iconTemplate = _this$props6.iconTemplate,
          onClick = _this$props6.onClick,
          onKeyDown = _this$props6.onKeyDown,
          onSubmit = _this$props6.onSubmit,
          pressed = _this$props6.pressed,
          rtlEnabled = _this$props6.rtlEnabled,
          stylingMode = _this$props6.stylingMode,
          tabIndex = _this$props6.tabIndex,
          template = _this$props6.template,
          templateData = _this$props6.templateData,
          text = _this$props6.text,
          type = _this$props6.type,
          useInkRipple = _this$props6.useInkRipple,
          useSubmitBehavior = _this$props6.useSubmitBehavior,
          visible = _this$props6.visible,
          width = _this$props6.width,
          restProps = _objectWithoutProperties(_this$props6, _excluded);

      return restProps;
    }
  }]);

  return Button;
}(_inferno2.InfernoWrapperComponent);

exports.Button = Button;
Button.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(ButtonProps), Object.getOwnPropertyDescriptors(_extends({}, (0, _utils.convertRulesToOptions)(defaultOptionRules)))));
var __defaultOptionRules = [];

function defaultOptions(rule) {
  __defaultOptionRules.push(rule);

  Button.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(Button.defaultProps), Object.getOwnPropertyDescriptors((0, _utils.convertRulesToOptions)(defaultOptionRules)), Object.getOwnPropertyDescriptors((0, _utils.convertRulesToOptions)(__defaultOptionRules))));
}