import _extends from "@babel/runtime/helpers/esm/extends";
import { LayoutProps } from "./layout_props";
export var MainLayoutProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(LayoutProps), Object.getOwnPropertyDescriptors({
  get timePanelData() {
    return {
      groupedData: [],
      leftVirtualCellCount: 0,
      rightVirtualCellCount: 0,
      topVirtualRowCount: 0,
      bottomVirtualRowCount: 0
    };
  },

  get groupPanelData() {
    return {
      groupPanelItems: [],
      baseColSpan: 1
    };
  },

  intervalCount: 1,
  className: "",
  isRenderDateHeader: true,

  get groups() {
    return [];
  },

  groupByDate: false,
  groupPanelClassName: "dx-scheduler-work-space-vertical-group-table",
  isAllDayPanelCollapsed: true,
  isAllDayPanelVisible: false,
  isRenderHeaderEmptyCell: true,
  isRenderGroupPanel: false,
  isStandaloneAllDayPanel: false
})));