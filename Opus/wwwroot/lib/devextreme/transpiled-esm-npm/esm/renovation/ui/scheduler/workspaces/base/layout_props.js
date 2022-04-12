export var LayoutProps = {
  get viewData() {
    return {
      groupedData: [],
      leftVirtualCellCount: 0,
      rightVirtualCellCount: 0,
      topVirtualRowCount: 0,
      bottomVirtualRowCount: 0
    };
  },

  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  topVirtualRowHeight: 0,
  bottomVirtualRowHeight: 0,
  addDateTableClass: true,
  addVerticalSizesClassToRows: true
};