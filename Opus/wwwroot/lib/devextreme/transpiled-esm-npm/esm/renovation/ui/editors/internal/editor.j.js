import registerComponent from "../../../../core/component_registrator";
import EditorWrapperComponent from "../../../component_wrapper/editors/editor";
import { Editor as EditorComponent, defaultOptions } from "./editor";
export default class Editor extends EditorWrapperComponent {
  getProps() {
    var props = super.getProps();
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }

  focus() {
    var _this$viewRef;

    return (_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.focus(...arguments);
  }

  blur() {
    var _this$viewRef2;

    return (_this$viewRef2 = this.viewRef) === null || _this$viewRef2 === void 0 ? void 0 : _this$viewRef2.blur(...arguments);
  }

  _getActionConfigs() {
    return {
      onFocusIn: {},
      onClick: {}
    };
  }

  get _propsInfo() {
    return {
      twoWay: [["value", "defaultValue", "valueChange"]],
      allowNull: ["validationError", "validationErrors"],
      elements: [],
      templates: [],
      props: ["readOnly", "name", "validationError", "validationErrors", "validationMessageMode", "validationStatus", "isValid", "onFocusIn", "defaultValue", "valueChange", "className", "accessKey", "activeStateEnabled", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "onClick", "onKeyDown", "rtlEnabled", "tabIndex", "visible", "width", "aria", "classes", "value"]
    };
  }

  get _viewComponent() {
    return EditorComponent;
  }

}
registerComponent("dxEditor", Editor);
Editor.defaultOptions = defaultOptions;