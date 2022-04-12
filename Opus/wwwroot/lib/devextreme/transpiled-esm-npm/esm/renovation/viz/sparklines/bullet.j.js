import registerComponent from "../../../core/component_registrator";
import BaseComponent from "../../component_wrapper/common/component";
import { Bullet as BulletComponent } from "./bullet";
export default class Bullet extends BaseComponent {
  _getActionConfigs() {
    return {
      onTooltipHidden: {},
      onTooltipShown: {}
    };
  }

  get _propsInfo() {
    return {
      twoWay: [["canvas", "defaultCanvas", "canvasChange"]],
      allowNull: [],
      elements: [],
      templates: [],
      props: ["value", "color", "target", "targetColor", "targetWidth", "showTarget", "showZeroLevel", "startScaleValue", "endScaleValue", "tooltip", "onTooltipHidden", "onTooltipShown", "size", "margin", "disabled", "rtlEnabled", "classes", "className", "defaultCanvas", "pointerEvents", "canvasChange", "canvas"]
    };
  }

  get _viewComponent() {
    return BulletComponent;
  }

}
registerComponent("dxBullet", Bullet);