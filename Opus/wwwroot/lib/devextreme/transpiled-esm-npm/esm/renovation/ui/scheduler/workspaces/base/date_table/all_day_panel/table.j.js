import registerComponent from "../../../../../../../core/component_registrator";
import { DateTable } from "../../../../../../component_wrapper/scheduler/date_table";
import { AllDayTable as AllDayTableComponent } from "./table";
export default class AllDayTable extends DateTable {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ["dataCellTemplate"],
      props: ["viewData", "groupOrientation", "leftVirtualCellWidth", "rightVirtualCellWidth", "topVirtualRowHeight", "bottomVirtualRowHeight", "addDateTableClass", "addVerticalSizesClassToRows", "width", "dataCellTemplate"]
    };
  }

  get _viewComponent() {
    return AllDayTableComponent;
  }

}
registerComponent("dxAllDayTable", AllDayTable);