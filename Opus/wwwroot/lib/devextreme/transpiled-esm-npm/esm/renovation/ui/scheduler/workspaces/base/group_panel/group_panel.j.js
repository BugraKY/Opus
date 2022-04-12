import registerComponent from "../../../../../../core/component_registrator";
import { GroupPanelWrapper } from "../../../../../component_wrapper/scheduler/group_panel";
import { GroupPanel as GroupPanelComponent } from "./group_panel";
export default class GroupPanel extends GroupPanelWrapper {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ["resourceCellTemplate"],
      props: ["groups", "groupOrientation", "groupPanelData", "groupByDate", "height", "className", "resourceCellTemplate"]
    };
  }

  get _viewComponent() {
    return GroupPanelComponent;
  }

}
registerComponent("dxGroupPanel", GroupPanel);