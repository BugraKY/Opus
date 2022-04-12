import dateUtils from "../../../../../core/utils/date";
import { getGroupCount as _getGroupCount } from "../../../../../ui/scheduler/resources/utils";
import { isHorizontalGroupingApplied, isVerticalGroupingApplied } from "../utils";
var DAY_MS = dateUtils.dateToMilliseconds("day");
var HOUR_MS = dateUtils.dateToMilliseconds("hour");
export var DATE_TABLE_MIN_CELL_WIDTH = 75;
export var getTotalRowCount = (rowCount, groupOrientation, groups, isAllDayPanelVisible) => {
  var isVerticalGrouping = isVerticalGroupingApplied(groups, groupOrientation);

  var groupCount = _getGroupCount(groups);

  var totalRowCount = isVerticalGrouping ? rowCount * groupCount : rowCount;
  return isAllDayPanelVisible ? totalRowCount + groupCount : totalRowCount;
};
export var getTotalCellCount = (cellCount, groupOrientation, groups) => {
  var isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation);

  var groupCount = _getGroupCount(groups);

  return isHorizontalGrouping ? cellCount * groupCount : cellCount;
};
export var getRowCountWithAllDayRow = (rowCount, isAllDayPanelVisible) => isAllDayPanelVisible ? rowCount + 1 : rowCount;
export var getHiddenInterval = (hoursInterval, cellCountInDay) => {
  var visibleInterval = hoursInterval * cellCountInDay * HOUR_MS;
  return DAY_MS - visibleInterval;
};
export var createCellElementMetaData = (tableRect, cellRect) => {
  var {
    bottom,
    height,
    left,
    right,
    top,
    width,
    x,
    y
  } = cellRect;
  return {
    right,
    bottom,
    left: left - tableRect.left,
    top: top - tableRect.top,
    width,
    height,
    x,
    y
  };
};
export var getDateForHeaderText = (_, date) => date;
export var getDateTableWidth = (scrollableWidth, dateTable, viewDataProvider, workSpaceConfig) => {
  var dateTableCell = dateTable.querySelector("td:not(.dx-scheduler-virtual-cell)");
  var cellWidth = dateTableCell.getBoundingClientRect().width;

  if (cellWidth < DATE_TABLE_MIN_CELL_WIDTH) {
    cellWidth = DATE_TABLE_MIN_CELL_WIDTH;
  }

  var cellCount = viewDataProvider.getCellCount(workSpaceConfig);
  var totalCellCount = getTotalCellCount(cellCount, workSpaceConfig.groupOrientation, workSpaceConfig.groups);
  var minTablesWidth = totalCellCount * cellWidth;
  return scrollableWidth < minTablesWidth ? minTablesWidth : scrollableWidth;
};
export var createVirtualScrollingOptions = options => ({
  getCellHeight: () => options.cellHeight,
  getCellWidth: () => options.cellWidth,
  getCellMinWidth: () => DATE_TABLE_MIN_CELL_WIDTH,
  isRTL: () => false,
  getSchedulerHeight: () => options.schedulerHeight,
  getSchedulerWidth: () => options.schedulerWidth,
  getViewHeight: () => options.viewHeight,
  getViewWidth: () => options.viewWidth,
  getScrolling: () => options.scrolling,
  getScrollableOuterWidth: () => options.scrollableWidth,
  getGroupCount: () => _getGroupCount(options.groups),
  isVerticalGrouping: () => options.isVerticalGrouping,
  getTotalRowCount: () => options.completeRowCount,
  getTotalCellCount: () => options.completeColumnCount
});