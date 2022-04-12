import _extends from "@babel/runtime/helpers/esm/extends";
import { isObject, isString } from "../../../../core/utils/type";
var VIEW_TYPES = ["day", "week", "workWeek", "month", "timelineDay", "timelineWeek", "timelineWorkWeek", "timelineMonth", "agenda"];
export var getCurrentView = (currentView, views) => {
  var currentViewProps = views.find(view => {
    var names = isObject(view) ? [view.name, view.type] : [view];

    if (names.includes(currentView)) {
      return true;
    }

    return false;
  });

  if (currentViewProps === undefined) {
    if (VIEW_TYPES.includes(currentView)) {
      currentViewProps = currentView;
    } else {
      [currentViewProps] = views;
    }
  }

  return currentViewProps;
};
export var getCurrentViewProps = (currentView, views) => {
  var currentViewProps = getCurrentView(currentView, views);
  return isString(currentViewProps) ? {
    type: currentViewProps
  } : currentViewProps;
};

function getViewConfigProp(schedulerProp, viewProp) {
  return viewProp !== undefined ? viewProp : schedulerProp;
}

export var getCurrentViewConfig = (currentViewProps, schedulerProps) => {
  var {
    scrolling: schedulerScrolling
  } = schedulerProps;
  var {
    cellDuration,
    dataCellTemplate,
    dateCellTemplate,
    endDayHour,
    firstDayOfWeek,
    groupByDate,
    groupOrientation,
    intervalCount,
    resourceCellTemplate,
    scrolling,
    startDate,
    startDayHour,
    timeCellTemplate,
    type
  } = currentViewProps;
  var isVirtualScrolling = schedulerScrolling.mode === "virtual" || (scrolling === null || scrolling === void 0 ? void 0 : scrolling.mode) === "virtual";
  var crossScrollingEnabled = schedulerProps.crossScrollingEnabled || isVirtualScrolling;
  var result = {
    firstDayOfWeek: getViewConfigProp(schedulerProps.firstDayOfWeek, firstDayOfWeek),
    startDayHour: getViewConfigProp(schedulerProps.startDayHour, startDayHour),
    endDayHour: getViewConfigProp(schedulerProps.endDayHour, endDayHour),
    cellDuration: getViewConfigProp(schedulerProps.cellDuration, cellDuration),
    groupByDate: getViewConfigProp(schedulerProps.groupByDate, groupByDate),
    scrolling: getViewConfigProp(schedulerScrolling, scrolling),
    dataCellTemplate: getViewConfigProp(schedulerProps.dataCellTemplate, dataCellTemplate),
    timeCellTemplate: getViewConfigProp(schedulerProps.timeCellTemplate, timeCellTemplate),
    resourceCellTemplate: getViewConfigProp(schedulerProps.resourceCellTemplate, resourceCellTemplate),
    dateCellTemplate: getViewConfigProp(schedulerProps.dateCellTemplate, dateCellTemplate),
    currentDate: schedulerProps.currentDate,
    intervalCount,
    groupOrientation,
    startDate,
    type,
    showAllDayPanel: schedulerProps.showAllDayPanel,
    showCurrentTimeIndicator: schedulerProps.showCurrentTimeIndicator,
    indicatorUpdateInterval: schedulerProps.indicatorUpdateInterval,
    shadeUntilCurrentTime: schedulerProps.shadeUntilCurrentTime,
    crossScrollingEnabled,
    schedulerHeight: schedulerProps.height,
    schedulerWidth: schedulerProps.width,
    tabIndex: schedulerProps.tabIndex,
    accessKey: schedulerProps.accessKey,
    focusStateEnabled: schedulerProps.focusStateEnabled,
    allowMultipleCellSelection: true,
    allDayPanelExpanded: true
  };
  return _extends({}, result, {
    hoursInterval: result.cellDuration / 60
  });
};