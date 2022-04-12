import registerComponent from "../../../../../../core/component_registrator";
import { TimePanel } from "../../../../../component_wrapper/scheduler/time_panel";
import { TimePanelTableLayout as TimePanelTableLayoutComponent } from "./layout";
export default class TimePanelTableLayout extends TimePanel {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ["timeCellTemplate"],
      props: ["groupOrientation", "timePanelData", "timeCellTemplate"]
    };
  }

  get _viewComponent() {
    return TimePanelTableLayoutComponent;
  }

}
registerComponent("dxTimePanelTableLayout", TimePanelTableLayout);