import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["accessKey", "activeStateEnabled", "aria", "className", "defaultValue", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "iconSize", "isValid", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "saveValueChangeEvent", "tabIndex", "text", "validationError", "validationErrors", "validationMessageMode", "validationStatus", "value", "valueChange", "visible", "width"];
import { createVNode, createFragment, createComponentVNode, normalizeProps } from "inferno";
import { Fragment } from "inferno";
import { InfernoWrapperComponent } from "@devextreme/runtime/inferno";
import { createDefaultOptionRules, convertRulesToOptions } from "../../../../core/options/utils";
import devices from "../../../../core/devices";
import { Editor, EditorProps } from "../internal/editor";
import { combineClasses } from "../../../utils/combine_classes";
import { CheckBoxIcon } from "./check_box_icon";
import { WidgetProps } from "../../common/widget";

var getCssClasses = model => {
  var {
    text,
    value
  } = model;
  var checked = value;
  var indeterminate = checked === null;
  var classesMap = {
    "dx-checkbox": true,
    "dx-checkbox-checked": checked === true,
    "dx-checkbox-has-text": !!text,
    "dx-checkbox-indeterminate": indeterminate
  };
  return combineClasses(classesMap);
};

export var viewFunction = viewModel => {
  var {
    aria,
    cssClasses: classes,
    editorRef,
    keyDown: onKeyDown,
    onWidgetClick: onClick,
    props: {
      accessKey,
      activeStateEnabled,
      className,
      disabled,
      focusStateEnabled,
      height,
      hint,
      hoverStateEnabled,
      iconSize,
      isValid,
      name,
      onFocusIn,
      readOnly,
      rtlEnabled,
      tabIndex,
      text,
      validationError,
      validationErrors,
      validationMessageMode,
      validationStatus,
      value,
      visible,
      width
    },
    restAttributes
  } = viewModel;
  return normalizeProps(createComponentVNode(2, Editor, _extends({
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
    children: createFragment([normalizeProps(createVNode(64, "input", null, null, 1, _extends({
      "type": "hidden",
      "value": "".concat(value)
    }, name && {
      name
    }))), createVNode(1, "div", "dx-checkbox-container", [createComponentVNode(2, CheckBoxIcon, {
      "size": iconSize,
      "isChecked": value === true
    }), text && createVNode(1, "span", "dx-checkbox-text", text, 0)], 0)], 4)
  }), null, editorRef));
};
export var CheckBoxProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(EditorProps), Object.getOwnPropertyDescriptors({
  text: "",
  activeStateEnabled: true,
  hoverStateEnabled: true,
  defaultValue: false,
  valueChange: () => {}
})));
export var CheckBoxPropsType = {
  get text() {
    return CheckBoxProps.text;
  },

  get activeStateEnabled() {
    return CheckBoxProps.activeStateEnabled;
  },

  get hoverStateEnabled() {
    return CheckBoxProps.hoverStateEnabled;
  },

  get defaultValue() {
    return CheckBoxProps.defaultValue;
  },

  get valueChange() {
    return CheckBoxProps.valueChange;
  },

  get readOnly() {
    return CheckBoxProps.readOnly;
  },

  get name() {
    return CheckBoxProps.name;
  },

  get validationError() {
    return CheckBoxProps.validationError;
  },

  get validationErrors() {
    return CheckBoxProps.validationErrors;
  },

  get validationMessageMode() {
    return CheckBoxProps.validationMessageMode;
  },

  get validationStatus() {
    return CheckBoxProps.validationStatus;
  },

  get isValid() {
    return CheckBoxProps.isValid;
  },

  get className() {
    return CheckBoxProps.className;
  },

  get disabled() {
    return CheckBoxProps.disabled;
  },

  get focusStateEnabled() {
    return CheckBoxProps.focusStateEnabled;
  },

  get rtlEnabled() {
    return CheckBoxProps.rtlEnabled;
  },

  get tabIndex() {
    return CheckBoxProps.tabIndex;
  },

  get visible() {
    return CheckBoxProps.visible;
  },

  get aria() {
    return WidgetProps.aria;
  }

};
export var defaultOptionRules = createDefaultOptionRules([{
  device: () => devices.real().deviceType === "desktop" && !devices.isSimulator(),
  options: {
    focusStateEnabled: true
  }
}]);
import { createReRenderEffect } from "@devextreme/runtime/inferno";
import { createRef as infernoCreateRef } from "inferno";
export class CheckBox extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.editorRef = infernoCreateRef();
    this.state = {
      value: this.props.value !== undefined ? this.props.value : this.props.defaultValue
    };
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.onWidgetClick = this.onWidgetClick.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  createEffects() {
    return [createReRenderEffect()];
  }

  onWidgetClick(event) {
    var _ref;

    var {
      readOnly,
      saveValueChangeEvent
    } = this.props;
    var value = (_ref = this.props.value !== undefined ? this.props.value : this.state.value) !== null && _ref !== void 0 ? _ref : false;

    if (!readOnly) {
      saveValueChangeEvent === null || saveValueChangeEvent === void 0 ? void 0 : saveValueChangeEvent(event);
      {
        var __newValue;

        this.setState(__state_argument => {
          __newValue = !value;
          return {
            value: __newValue
          };
        });
        this.props.valueChange(__newValue);
      }
    }
  }

  keyDown(e) {
    var {
      onKeyDown
    } = this.props;
    var {
      keyName,
      originalEvent,
      which
    } = e;
    var result = onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);

    if (result !== null && result !== void 0 && result.cancel) {
      return result;
    }

    if (keyName === "space" || which === "space") {
      originalEvent.preventDefault();
      this.onWidgetClick(originalEvent);
    }

    return undefined;
  }

  get cssClasses() {
    return getCssClasses(_extends({}, this.props, {
      value: this.props.value !== undefined ? this.props.value : this.state.value
    }));
  }

  get aria() {
    var checked = (this.props.value !== undefined ? this.props.value : this.state.value) === true;
    var indeterminate = (this.props.value !== undefined ? this.props.value : this.state.value) === null;
    var result = {
      role: "checkbox",
      checked: indeterminate ? "mixed" : "".concat(checked)
    };
    return _extends({}, result, this.props.aria);
  }

  get restAttributes() {
    var _this$props$value = _extends({}, this.props, {
      value: this.props.value !== undefined ? this.props.value : this.state.value
    }),
        restProps = _objectWithoutPropertiesLoose(_this$props$value, _excluded);

    return restProps;
  }

  focus() {
    this.editorRef.current.focus();
  }

  blur() {
    this.editorRef.current.blur();
  }

  render() {
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
  }

}

function __processTwoWayProps(defaultProps) {
  var twoWayProps = ["value"];
  return Object.keys(defaultProps).reduce((props, propName) => {
    var propValue = defaultProps[propName];
    var defaultPropName = twoWayProps.some(p => p === propName) ? "default" + propName.charAt(0).toUpperCase() + propName.slice(1) : propName;
    props[defaultPropName] = propValue;
    return props;
  }, {});
}

CheckBox.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(CheckBoxPropsType), Object.getOwnPropertyDescriptors(_extends({}, __processTwoWayProps(convertRulesToOptions(defaultOptionRules))))));
var __defaultOptionRules = [];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);

  CheckBox.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(CheckBox.defaultProps), Object.getOwnPropertyDescriptors(__processTwoWayProps(convertRulesToOptions(defaultOptionRules))), Object.getOwnPropertyDescriptors(__processTwoWayProps(convertRulesToOptions(__defaultOptionRules)))));
}