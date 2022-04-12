import _extends from "@babel/runtime/helpers/esm/extends";
import { combineClasses } from "../../../utils/combine_classes";
import { HORIZONTAL_GROUP_ORIENTATION, VERTICAL_GROUP_ORIENTATION } from "../consts";
export var getKeyByDateAndGroup = (date, groupIndex) => {
  var key = date.getTime();

  if (!groupIndex) {
    return key.toString();
  }

  return (key + groupIndex).toString();
};
export var getKeyByGroup = (groupIndex, groupOrientation) => {
  if (groupOrientation === VERTICAL_GROUP_ORIENTATION && !!groupIndex) {
    return groupIndex.toString();
  }

  return "0";
};
export var addToStyles = (options, style) => {
  var nextStyle = style !== null && style !== void 0 ? style : {};

  var result = _extends({}, nextStyle);

  options.forEach(_ref => {
    var {
      attr,
      value
    } = _ref;
    result[attr] = value || nextStyle[attr];
  });
  return result;
};
export var addHeightToStyle = (value, style) => {
  var height = value ? "".concat(value, "px") : "";
  return addToStyles([{
    attr: "height",
    value: height
  }], style);
};
export var addWidthToStyle = (value, style) => {
  var width = value ? "".concat(value, "px") : "";
  return addToStyles([{
    attr: "width",
    value: width
  }], style);
};
export var getGroupCellClasses = function getGroupCellClasses() {
  var isFirstGroupCell = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var isLastGroupCell = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var className = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  return combineClasses({
    "dx-scheduler-first-group-cell": isFirstGroupCell,
    "dx-scheduler-last-group-cell": isLastGroupCell,
    [className]: true
  });
};
export var getIsGroupedAllDayPanel = (viewData, index) => {
  var {
    groupedData
  } = viewData;
  var groupData = groupedData[index];
  var isAllDayPanel = !!(groupData !== null && groupData !== void 0 && groupData.allDayPanel);
  var isGroupedAllDayPanel = !!(groupData !== null && groupData !== void 0 && groupData.isGroupedAllDayPanel);
  return isAllDayPanel && isGroupedAllDayPanel;
};
export var isVerticalGroupingApplied = (groups, groupOrientation) => groupOrientation === VERTICAL_GROUP_ORIENTATION && !!groups.length;
export var isHorizontalGroupingApplied = (groups, groupOrientation) => groupOrientation === HORIZONTAL_GROUP_ORIENTATION && !!groups.length;
export var isGroupingByDate = (groups, groupOrientation, groupByDate) => {
  var isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation);
  return groupByDate && isHorizontalGrouping;
};