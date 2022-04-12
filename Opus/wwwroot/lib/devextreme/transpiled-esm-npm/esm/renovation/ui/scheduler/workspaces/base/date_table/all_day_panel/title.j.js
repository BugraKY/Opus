import registerComponent from "../../../../../../../core/component_registrator";
import BaseComponent from "../../../../../../component_wrapper/common/component";
import { AllDayPanelTitle as AllDayPanelTitleComponent } from "./title";
export default class AllDayPanelTitle extends BaseComponent {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: []
    };
  }

  get _viewComponent() {
    return AllDayPanelTitleComponent;
  }

}
registerComponent("dxAllDayPanelTitle", AllDayPanelTitle);