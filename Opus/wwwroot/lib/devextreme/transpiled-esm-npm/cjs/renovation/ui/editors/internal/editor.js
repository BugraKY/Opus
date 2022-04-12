"use strict";

exports.EditorPropsType = exports.EditorProps = exports.Editor = void 0;
exports.defaultOptions = defaultOptions;
exports.viewFunction = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _guid = _interopRequireDefault(require("../../../../core/guid"));

var _widget = require("../../common/widget");

var _base_props = require("../../common/base_props");

var _combine_classes = require("../../../utils/combine_classes");

var _validation_message = require("../../overlays/validation_message");

var _utils = require("../../../../core/options/utils");

var _excluded = ["accessKey", "activeStateEnabled", "aria", "children", "className", "classes", "defaultValue", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "isValid", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "tabIndex", "validationError", "validationErrors", "validationMessageMode", "validationStatus", "value", "valueChange", "visible", "width"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getCssClasses = function getCssClasses(model) {
  var classes = model.classes,
      isValid = model.isValid,
      readOnly = model.readOnly;

  var classesMap = _defineProperty({
    "dx-state-readonly": !!readOnly,
    "dx-invalid": !isValid
  }, "".concat(classes), !!classes);

  return (0, _combine_classes.combineClasses)(classesMap);
};

var viewFunction = function viewFunction(viewModel) {
  var aria = viewModel.aria,
      classes = viewModel.cssClasses,
      isValidationMessageVisible = viewModel.isValidationMessageVisible,
      onFocusIn = viewModel.onFocusIn,
      _viewModel$props = viewModel.props,
      accessKey = _viewModel$props.accessKey,
      activeStateEnabled = _viewModel$props.activeStateEnabled,
      children = _viewModel$props.children,
      className = _viewModel$props.className,
      disabled = _viewModel$props.disabled,
      focusStateEnabled = _viewModel$props.focusStateEnabled,
      height = _viewModel$props.height,
      hint = _viewModel$props.hint,
      hoverStateEnabled = _viewModel$props.hoverStateEnabled,
      onClick = _viewModel$props.onClick,
      onKeyDown = _viewModel$props.onKeyDown,
      rtlEnabled = _viewModel$props.rtlEnabled,
      tabIndex = _viewModel$props.tabIndex,
      validationMessageMode = _viewModel$props.validationMessageMode,
      visible = _viewModel$props.visible,
      width = _viewModel$props.width,
      restAttributes = viewModel.restAttributes,
      rootElementRef = viewModel.rootElementRef,
      validationErrors = viewModel.validationErrors,
      validationMessageGuid = viewModel.validationMessageGuid,
      validationMessageTarget = viewModel.validationMessageTarget,
      widgetRef = viewModel.widgetRef;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
    "rootElementRef": rootElementRef,
    "aria": aria,
    "classes": classes,
    "activeStateEnabled": activeStateEnabled,
    "focusStateEnabled": focusStateEnabled,
    "hoverStateEnabled": hoverStateEnabled,
    "accessKey": accessKey,
    "className": className,
    "rtlEnabled": rtlEnabled,
    "hint": hint,
    "disabled": disabled,
    "height": height,
    "width": width,
    "onFocusIn": onFocusIn,
    "onClick": onClick,
    "onKeyDown": onKeyDown,
    "tabIndex": tabIndex,
    "visible": visible
  }, restAttributes, {
    children: (0, _inferno.createFragment)([children, isValidationMessageVisible && (0, _inferno.createComponentVNode)(2, _validation_message.ValidationMessage, {
      "validationErrors": validationErrors,
      "mode": validationMessageMode,
      "positionRequest": "below",
      "rtlEnabled": rtlEnabled,
      "target": validationMessageTarget,
      "boundary": validationMessageTarget,
      "container": validationMessageTarget,
      "contentId": validationMessageGuid
    })], 0)
  }), null, widgetRef));
};

exports.viewFunction = viewFunction;
var EditorProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_base_props.BaseWidgetProps), Object.getOwnPropertyDescriptors({
  readOnly: false,
  name: "",
  validationError: null,
  validationErrors: null,
  validationMessageMode: "auto",
  validationStatus: "valid",
  isValid: true,
  defaultValue: null,
  valueChange: function valueChange() {}
})));
exports.EditorProps = EditorProps;
var EditorPropsType = Object.defineProperties({}, {
  readOnly: {
    get: function get() {
      return EditorProps.readOnly;
    },
    configurable: true,
    enumerable: true
  },
  name: {
    get: function get() {
      return EditorProps.name;
    },
    configurable: true,
    enumerable: true
  },
  validationError: {
    get: function get() {
      return EditorProps.validationError;
    },
    configurable: true,
    enumerable: true
  },
  validationErrors: {
    get: function get() {
      return EditorProps.validationErrors;
    },
    configurable: true,
    enumerable: true
  },
  validationMessageMode: {
    get: function get() {
      return EditorProps.validationMessageMode;
    },
    configurable: true,
    enumerable: true
  },
  validationStatus: {
    get: function get() {
      return EditorProps.validationStatus;
    },
    configurable: true,
    enumerable: true
  },
  isValid: {
    get: function get() {
      return EditorProps.isValid;
    },
    configurable: true,
    enumerable: true
  },
  defaultValue: {
    get: function get() {
      return EditorProps.defaultValue;
    },
    configurable: true,
    enumerable: true
  },
  valueChange: {
    get: function get() {
      return EditorProps.valueChange;
    },
    configurable: true,
    enumerable: true
  },
  className: {
    get: function get() {
      return EditorProps.className;
    },
    configurable: true,
    enumerable: true
  },
  activeStateEnabled: {
    get: function get() {
      return EditorProps.activeStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  disabled: {
    get: function get() {
      return EditorProps.disabled;
    },
    configurable: true,
    enumerable: true
  },
  focusStateEnabled: {
    get: function get() {
      return EditorProps.focusStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  hoverStateEnabled: {
    get: function get() {
      return EditorProps.hoverStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  rtlEnabled: {
    get: function get() {
      return EditorProps.rtlEnabled;
    },
    configurable: true,
    enumerable: true
  },
  tabIndex: {
    get: function get() {
      return EditorProps.tabIndex;
    },
    configurable: true,
    enumerable: true
  },
  visible: {
    get: function get() {
      return EditorProps.visible;
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
  },
  classes: {
    get: function get() {
      return _widget.WidgetProps.classes;
    },
    configurable: true,
    enumerable: true
  }
});
exports.EditorPropsType = EditorPropsType;

var Editor = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(Editor, _InfernoWrapperCompon);

  function Editor(props) {
    var _this;

    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.widgetRef = (0, _inferno.createRef)();
    _this.rootElementRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.state = {
      validationMessageGuid: "dx-".concat(new _guid.default()),
      isValidationMessageVisible: false,
      value: _this.props.value !== undefined ? _this.props.value : _this.props.defaultValue
    };
    _this.updateValidationMessageVisibility = _this.updateValidationMessageVisibility.bind(_assertThisInitialized(_this));
    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    _this.blur = _this.blur.bind(_assertThisInitialized(_this));
    _this.onFocusIn = _this.onFocusIn.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Editor.prototype;

  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.updateValidationMessageVisibility, [this.props.isValid, this.props.validationStatus, this.props.validationError, this.props.validationErrors]), (0, _inferno2.createReRenderEffect)()];
  };

  _proto.updateEffects = function updateEffects() {
    var _this$_effects$;

    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.isValid, this.props.validationStatus, this.props.validationError, this.props.validationErrors]);
  };

  _proto.updateValidationMessageVisibility = function updateValidationMessageVisibility() {
    var _this2 = this;

    this.setState(function (__state_argument) {
      return {
        isValidationMessageVisible: _this2.shouldShowValidationMessage
      };
    });
  };

  _proto.onFocusIn = function onFocusIn(event) {
    var onFocusIn = this.props.onFocusIn;
    onFocusIn === null || onFocusIn === void 0 ? void 0 : onFocusIn(event);
  };

  _proto.focus = function focus() {
    this.widgetRef.current.focus();
  };

  _proto.blur = function blur() {
    this.widgetRef.current.blur();
  };

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoWrapperCompon.prototype.componentWillUpdate.call(this);

    if (this.props["validationError"] !== nextProps["validationError"] || this.props["validationErrors"] !== nextProps["validationErrors"]) {
      this.__getterCache["validationErrors"] = undefined;
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
      validationMessageGuid: this.state.validationMessageGuid,
      isValidationMessageVisible: this.state.isValidationMessageVisible,
      rootElementRef: this.rootElementRef,
      widgetRef: this.widgetRef,
      onFocusIn: this.onFocusIn,
      cssClasses: this.cssClasses,
      shouldShowValidationMessage: this.shouldShowValidationMessage,
      aria: this.aria,
      validationErrors: this.validationErrors,
      validationMessageTarget: this.validationMessageTarget,
      restAttributes: this.restAttributes
    });
  };

  _createClass(Editor, [{
    key: "cssClasses",
    get: function get() {
      return "".concat(getCssClasses(_extends({}, this.props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      })));
    }
  }, {
    key: "shouldShowValidationMessage",
    get: function get() {
      var _this$validationError;

      var _this$props = this.props,
          isValid = _this$props.isValid,
          validationStatus = _this$props.validationStatus;
      var validationErrors = (_this$validationError = this.validationErrors) !== null && _this$validationError !== void 0 ? _this$validationError : [];
      var isEditorValid = isValid && validationStatus !== "invalid";
      return !isEditorValid && validationErrors.length > 0;
    }
  }, {
    key: "aria",
    get: function get() {
      var _this$props2 = this.props,
          isValid = _this$props2.isValid,
          readOnly = _this$props2.readOnly;
      var result = {
        readonly: readOnly ? "true" : "false",
        invalid: !isValid ? "true" : "false"
      };

      if (this.shouldShowValidationMessage) {
        result.describedBy = this.state.validationMessageGuid;
      }

      return _extends({}, result, this.props.aria);
    }
  }, {
    key: "validationErrors",
    get: function get() {
      var _this3 = this;

      if (this.__getterCache["validationErrors"] !== undefined) {
        return this.__getterCache["validationErrors"];
      }

      return this.__getterCache["validationErrors"] = function () {
        var _this3$props = _this3.props,
            validationError = _this3$props.validationError,
            validationErrors = _this3$props.validationErrors;

        var allValidationErrors = validationErrors && _toConsumableArray(validationErrors);

        if (!allValidationErrors && validationError) {
          allValidationErrors = [_extends({}, validationError)];
        }

        return allValidationErrors;
      }();
    }
  }, {
    key: "validationMessageTarget",
    get: function get() {
      var _this$rootElementRef;

      return (_this$rootElementRef = this.rootElementRef) === null || _this$rootElementRef === void 0 ? void 0 : _this$rootElementRef.current;
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
          children = _this$props$value.children,
          className = _this$props$value.className,
          classes = _this$props$value.classes,
          defaultValue = _this$props$value.defaultValue,
          disabled = _this$props$value.disabled,
          focusStateEnabled = _this$props$value.focusStateEnabled,
          height = _this$props$value.height,
          hint = _this$props$value.hint,
          hoverStateEnabled = _this$props$value.hoverStateEnabled,
          isValid = _this$props$value.isValid,
          name = _this$props$value.name,
          onClick = _this$props$value.onClick,
          onFocusIn = _this$props$value.onFocusIn,
          onKeyDown = _this$props$value.onKeyDown,
          readOnly = _this$props$value.readOnly,
          rtlEnabled = _this$props$value.rtlEnabled,
          tabIndex = _this$props$value.tabIndex,
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

  return Editor;
}(_inferno2.InfernoWrapperComponent);

exports.Editor = Editor;

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

Editor.defaultProps = EditorPropsType;
var __defaultOptionRules = [];

function defaultOptions(rule) {
  __defaultOptionRules.push(rule);

  Editor.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(Editor.defaultProps), Object.getOwnPropertyDescriptors(__processTwoWayProps((0, _utils.convertRulesToOptions)(__defaultOptionRules)))));
}