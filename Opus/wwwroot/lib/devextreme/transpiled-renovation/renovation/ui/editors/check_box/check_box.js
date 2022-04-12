"use strict";

exports.defaultOptionRules = exports.CheckBoxPropsType = exports.CheckBoxProps = exports.CheckBox = void 0;
exports.defaultOptions = defaultOptions;
exports.viewFunction = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _utils = require("../../../../core/options/utils");

var _devices = _interopRequireDefault(require("../../../../core/devices"));

var _editor = require("../internal/editor");

var _combine_classes = require("../../../utils/combine_classes");

var _check_box_icon = require("./check_box_icon");

var _widget = require("../../common/widget");

var _excluded = ["accessKey", "activeStateEnabled", "aria", "className", "defaultValue", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "iconSize", "isValid", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "saveValueChangeEvent", "tabIndex", "text", "validationError", "validationErrors", "validationMessageMode", "validationStatus", "value", "valueChange", "visible", "width"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var getCssClasses = function getCssClasses(model) {
  var text = model.text,
      value = model.value;
  var checked = value;
  var indeterminate = checked === null;
  var classesMap = {
    "dx-checkbox": true,
    "dx-checkbox-checked": checked === true,
    "dx-checkbox-has-text": !!text,
    "dx-checkbox-indeterminate": indeterminate
  };
  return (0, _combine_classes.combineClasses)(classesMap);
};

var viewFunction = function viewFunction(viewModel) {
  var aria = viewModel.aria,
      classes = viewModel.cssClasses,
      editorRef = viewModel.editorRef,
      onKeyDown = viewModel.keyDown,
      onClick = viewModel.onWidgetClick,
      _viewModel$props = viewModel.props,
      accessKey = _viewModel$props.accessKey,
      activeStateEnabled = _viewModel$props.activeStateEnabled,
      className = _viewModel$props.className,
      disabled = _viewModel$props.disabled,
      focusStateEnabled = _viewModel$props.focusStateEnabled,
      height = _viewModel$props.height,
      hint = _viewModel$props.hint,
      hoverStateEnabled = _viewModel$props.hoverStateEnabled,
      iconSize = _viewModel$props.iconSize,
      isValid = _viewModel$props.isValid,
      name = _viewModel$props.name,
      onFocusIn = _viewModel$props.onFocusIn,
      readOnly = _viewModel$props.readOnly,
      rtlEnabled = _viewModel$props.rtlEnabled,
      tabIndex = _viewModel$props.tabIndex,
      text = _viewModel$props.text,
      validationError = _viewModel$props.validationError,
      validationErrors = _viewModel$props.validationErrors,
      validationMessageMode = _viewModel$props.validationMessageMode,
      validationStatus = _viewModel$props.validationStatus,
      value = _viewModel$props.value,
      visible = _viewModel$props.visible,
      width = _viewModel$props.width,
      restAttributes = viewModel.restAttributes;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _editor.Editor, _extends({
    "aria": aria,
    "classes": classes,
    "onClick": onClick,
    "onKeyDown": onKeyDown,
    "accessKey": accessKey,
    "activeStateEnabled": activeStateEnabled,
    "focusStateEnabled": focusStateEnabled,
    "hoverStateEnabled": hoverStateEnabled,
    "className": className,
    "disabled": disabled,
    "readOnly": readOnly,
    "hint": hint,
    "height": height,
    "width": width,
    "rtlEnabled": rtlEnabled,
    "tabIndex": tabIndex,
    "visible": visible,
    "validationError": validationError,
    "validationErrors": validationErrors,
    "validationMessageMode": validationMessageMode,
    "validationStatus": validationStatus,
    "isValid": isValid,
    "onFocusIn": onFocusIn
  }, restAttributes, {
    children: (0, _inferno.createFragment)([(0, _inferno.normalizeProps)((0, _inferno.createVNode)(64, "input", null, null, 1, _extends({
      "type": "hidden",
      "value": "".concat(value)
    }, name && {
      name: name
    }))), (0, _inferno.createVNode)(1, "div", "dx-checkbox-container", [(0, _inferno.createComponentVNode)(2, _check_box_icon.CheckBoxIcon, {
      "size": iconSize,
      "isChecked": value === true
    }), text && (0, _inferno.createVNode)(1, "span", "dx-checkbox-text", text, 0)], 0)], 4)
  }), null, editorRef));
};

exports.viewFunction = viewFunction;
var CheckBoxProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_editor.EditorProps), Object.getOwnPropertyDescriptors({
  text: "",
  activeStateEnabled: true,
  hoverStateEnabled: true,
  defaultValue: false,
  valueChange: function valueChange() {}
})));
exports.CheckBoxProps = CheckBoxProps;
var CheckBoxPropsType = Object.defineProperties({}, {
  text: {
    get: function get() {
      return CheckBoxProps.text;
    },
    configurable: true,
    enumerable: true
  },
  activeStateEnabled: {
    get: function get() {
      return CheckBoxProps.activeStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  hoverStateEnabled: {
    get: function get() {
      return CheckBoxProps.hoverStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  defaultValue: {
    get: function get() {
      return CheckBoxProps.defaultValue;
    },
    configurable: true,
    enumerable: true
  },
  valueChange: {
    get: function get() {
      return CheckBoxProps.valueChange;
    },
    configurable: true,
    enumerable: true
  },
  readOnly: {
    get: function get() {
      return CheckBoxProps.readOnly;
    },
    configurable: true,
    enumerable: true
  },
  name: {
    get: function get() {
      return CheckBoxProps.name;
    },
    configurable: true,
    enumerable: true
  },
  validationError: {
    get: function get() {
      return CheckBoxProps.validationError;
    },
    configurable: true,
    enumerable: true
  },
  validationErrors: {
    get: function get() {
      return CheckBoxProps.validationErrors;
    },
    configurable: true,
    enumerable: true
  },
  validationMessageMode: {
    get: function get() {
      return CheckBoxProps.validationMessageMode;
    },
    configurable: true,
    enumerable: true
  },
  validationStatus: {
    get: function get() {
      return CheckBoxProps.validationStatus;
    },
    configurable: true,
    enumerable: true
  },
  isValid: {
    get: function get() {
      return CheckBoxProps.isValid;
    },
    configurable: true,
    enumerable: true
  },
  className: {
    get: function get() {
      return CheckBoxProps.className;
    },
    configurable: true,
    enumerable: true
  },
  disabled: {
    get: function get() {
      return CheckBoxProps.disabled;
    },
    configurable: true,
    enumerable: true
  },
  focusStateEnabled: {
    get: function get() {
      return CheckBoxProps.focusStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  rtlEnabled: {
    get: function get() {
      return CheckBoxProps.rtlEnabled;
    },
    configurable: true,
    enumerable: true
  },
  tabIndex: {
    get: function get() {
      return CheckBoxProps.tabIndex;
    },
    configurable: true,
    enumerable: true
  },
  visible: {
    get: function get() {
      return CheckBoxProps.visible;
    },
    configurable: true,
    enumerable: true
  },
  aria: {
    get: function get() {
      return _widget.WidgetProps.aria;
    },
    configurable: true,
    enumerable: true
  }
});
exports.CheckBoxPropsType = CheckBoxPropsType;
var defaultOptionRules = (0, _utils.createDefaultOptionRules)([{
  device: function device() {
    return _devices.default.real().deviceType === "desktop" && !_devices.default.isSimulator();
  },
  options: {
    focusStateEnabled: true
  }
}]);
exports.defaultOptionRules = defaultOptionRules;

var CheckBox = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(CheckBox, _InfernoWrapperCompon);

  function CheckBox(props) {
    var _this;

    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.editorRef = (0, _inferno.createRef)();
    _this.state = {
      value: _this.props.value !== undefined ? _this.props.value : _this.props.defaultValue
    };
    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    _this.blur = _this.blur.bind(_assertThisInitialized(_this));
    _this.onWidgetClick = _this.onWidgetClick.bind(_assertThisInitialized(_this));
    _this.keyDown = _this.keyDown.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = CheckBox.prototype;

  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };

  _proto.onWidgetClick = function onWidgetClick(event) {
    var _ref;

    var _this$props = this.props,
        readOnly = _this$props.readOnly,
        saveValueChangeEvent = _this$props.saveValueChangeEvent;
    var value = (_ref = this.props.value !== undefined ? this.props.value : this.state.value) !== null && _ref !== void 0 ? _ref : false;

    if (!readOnly) {
      saveValueChangeEvent === null || saveValueChangeEvent === void 0 ? void 0 : saveValueChangeEvent(event);
      {
        var __newValue;

        this.setState(function (__state_argument) {
          __newValue = !value;
          return {
            value: __newValue
          };
        });
        this.props.valueChange(__newValue);
      }
    }
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

    if (keyName === "space" || which === "space") {
      originalEvent.preventDefault();
      this.onWidgetClick(originalEvent);
    }

    return undefined;
  };

  _proto.focus = function focus() {
    this.editorRef.current.focus();
  };

  _proto.blur = function blur() {
    this.editorRef.current.blur();
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
      editorRef: this.editorRef,
      onWidgetClick: this.onWidgetClick,
      keyDown: this.keyDown,
      cssClasses: this.cssClasses,
      aria: this.aria,
      restAttributes: this.restAttributes
    });
  };

  _createClass(CheckBox, [{
    key: "cssClasses",
    get: function get() {
      return getCssClasses(_extends({}, this.props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }));
    }
  }, {
    key: "aria",
    get: function get() {
      var checked = (this.props.value !== undefined ? this.props.value : this.state.value) === true;
      var indeterminate = (this.props.value !== undefined ? this.props.value : this.state.value) === null;
      var result = {
        role: "checkbox",
        checked: indeterminate ? "mixed" : "".concat(checked)
      };
      return _extends({}, result, this.props.aria);
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props$value = _extends({}, this.props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
          accessKey = _this$props$value.accessKey,
          activeStateEnabled = _this$props$value.activeStateEnabled,
          aria = _this$props$value.aria,
          className = _this$props$value.className,
          defaultValue = _this$props$value.defaultValue,
          disabled = _this$props$value.disabled,
          focusStateEnabled = _this$props$value.focusStateEnabled,
          height = _this$props$value.height,
          hint = _this$props$value.hint,
          hoverStateEnabled = _this$props$value.hoverStateEnabled,
          iconSize = _this$props$value.iconSize,
          isValid = _this$props$value.isValid,
          name = _this$props$value.name,
          onClick = _this$props$value.onClick,
          onFocusIn = _this$props$value.onFocusIn,
          onKeyDown = _this$props$value.onKeyDown,
          readOnly = _this$props$value.readOnly,
          rtlEnabled = _this$props$value.rtlEnabled,
          saveValueChangeEvent = _this$props$value.saveValueChangeEvent,
          tabIndex = _this$props$value.tabIndex,
          text = _this$props$value.text,
          validationError = _this$props$value.validationError,
          validationErrors = _this$props$value.validationErrors,
          validationMessageMode = _this$props$value.validationMessageMode,
          validationStatus = _this$props$value.validationStatus,
          value = _this$props$value.value,
          valueChange = _this$props$value.valueChange,
          visible = _this$props$value.visible,
          width = _this$props$value.width,
          restProps = _objectWithoutProperties(_this$props$value, _excluded);

      return restProps;
    }
  }]);

  return CheckBox;
}(_inferno2.InfernoWrapperComponent);

exports.CheckBox = CheckBox;

function __processTwoWayProps(defaultProps) {
  var twoWayProps = ["value"];
  return Object.keys(defaultProps).reduce(function (props, propName) {
    var propValue = defaultProps[propName];
    var defaultPropName = twoWayProps.some(function (p) {
      return p === propName;
    }) ? "default" + propName.charAt(0).toUpperCase() + propName.slice(1) : propName;
    props[defaultPropName] = propValue;
    return props;
  }, {});
}

CheckBox.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(CheckBoxPropsType), Object.getOwnPropertyDescriptors(_extends({}, __processTwoWayProps((0, _utils.convertRulesToOptions)(defaultOptionRules))))));
var __defaultOptionRules = [];

function defaultOptions(rule) {
  __defaultOptionRules.push(rule);

  CheckBox.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(CheckBox.defaultProps), Object.getOwnPropertyDescriptors(__processTwoWayProps((0, _utils.convertRulesToOptions)(defaultOptionRules))), Object.getOwnPropertyDescriptors(__processTwoWayProps((0, _utils.convertRulesToOptions)(__defaultOptionRules)))));
}