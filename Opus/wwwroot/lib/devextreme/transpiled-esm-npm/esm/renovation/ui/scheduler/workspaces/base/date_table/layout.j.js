import registerComponent from "../../../../../../core/component_registrator";
import { DateTable } from "../../../../../component_wrapper/scheduler/date_table";
import { DateTableLayoutBase as DateTableLayoutBaseComponent } from "./layout";
export default class DateTableLayoutBase extends DateTable {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ["cellTemplate", "dataCellTemplate"],
      props: ["cellTemplate", "viewData", "groupOrientation", "leftVirtualCellWidth", "rightVirtualCellWidth", "topVirtualRowHeight", "bottomVirtualRowHeight", "addDateTableClass", "addVerticalSizesClassToRows", "width", "dataCellTemplate"]
    };
  }

  get _viewComponent() {
    return DateTableLayoutBaseComponent;
  }

}
registerComponent("dxDateTableLayoutBase", DateTableLayoutBase);