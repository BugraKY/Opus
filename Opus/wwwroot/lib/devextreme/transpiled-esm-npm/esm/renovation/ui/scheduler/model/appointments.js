import _extends from "@babel/runtime/helpers/esm/extends";
import { getCellWidth, getCellHeight, getAllDayHeight, PositionHelper } from "../../../../ui/scheduler/workspaces/helpers/positionHelper";
import { getGroupCount } from "../../../../ui/scheduler/resources/utils";
import { isGroupingByDate } from "../workspaces/utils";
import dateUtils from "../../../../core/utils/date";
import { calculateIsGroupedAllDayPanel, getCellDuration } from "../view_model/to_test/views/utils/base";
import { createGetAppointmentColor } from "../resources/utils";

var toMs = name => dateUtils.dateToMilliseconds(name);

export var getAppointmentRenderingStrategyName = viewType => {
  var appointmentRenderingStrategyMap = {
    day: {
      renderingStrategy: "vertical"
    },
    week: {
      renderingStrategy: "week"
    },
    workWeek: {
      renderingStrategy: "week"
    },
    month: {
      renderingStrategy: "horizontalMonth"
    },
    timelineDay: {
      renderingStrategy: "horizontal"
    },
    timelineWeek: {
      renderingStrategy: "horizontal"
    },
    timelineWorkWeek: {
      renderingStrategy: "horizontal"
    },
    timelineMonth: {
      renderingStrategy: "horizontalMonthLine"
    },
    agenda: {
      renderingStrategy: "agenda"
    }
  };
  var {
    renderingStrategy
  } = appointmentRenderingStrategyMap[viewType];
  return renderingStrategy;
};
export var getAppointmentsConfig = (schedulerConfig, viewConfig, loadedResources, viewDataProvider, isAllDayPanelSupported) => {
  var groupCount = getGroupCount(loadedResources);
  var startViewDate = viewDataProvider.getStartViewDate();
  var dateRange = [startViewDate, viewDataProvider.getLastViewDateByEndDayHour(viewConfig.endDayHour)];
  return {
    adaptivityEnabled: schedulerConfig.adaptivityEnabled,
    rtlEnabled: schedulerConfig.rtlEnabled,
    resources: schedulerConfig.resources,
    maxAppointmentsPerCell: schedulerConfig.maxAppointmentsPerCell,
    timeZone: schedulerConfig.timeZone,
    modelGroups: schedulerConfig.groups,
    startDayHour: viewConfig.startDayHour,
    viewStartDayHour: viewConfig.startDayHour,
    endDayHour: viewConfig.endDayHour,
    viewEndDayHour: viewConfig.endDayHour,
    currentDate: viewConfig.currentDate,
    isVirtualScrolling: viewConfig.scrolling.mode === "virtual",
    intervalCount: viewConfig.intervalCount,
    hoursInterval: viewConfig.hoursInterval,
    showAllDayPanel: viewConfig.showAllDayPanel,
    supportAllDayRow: isAllDayPanelSupported,
    groupOrientation: viewDataProvider.getViewOptions().groupOrientation,
    firstDayOfWeek: viewConfig.firstDayOfWeek,
    viewType: viewConfig.type,
    cellDurationInMinutes: viewConfig.cellDuration,
    isVerticalGroupOrientation: viewDataProvider.getViewOptions().isVerticalGrouping,
    groupByDate: viewDataProvider.getViewOptions().isGroupedByDate,
    startViewDate,
    loadedResources,
    appointmentCountPerCell: 2,
    appointmentOffset: 26,
    allowResizing: false,
    allowAllDayResizing: false,
    dateTableOffset: 0,
    groupCount,
    dateRange
  };
};
export var getAppointmentsModel = (appointmentsConfig, viewDataProvider, timeZoneCalculator, dataAccessors, cellsMetaData) => {
  var groupedByDate = isGroupingByDate(appointmentsConfig.modelGroups, appointmentsConfig.groupOrientation, appointmentsConfig.groupByDate);
  var {
    groupCount,
    isVerticalGroupOrientation
  } = appointmentsConfig;
  var positionHelper = new PositionHelper({
    viewDataProvider,
    groupedByDate,
    rtlEnabled: appointmentsConfig.rtlEnabled,
    groupCount,
    isVerticalGrouping: groupCount && isVerticalGroupOrientation,
    getDOMMetaDataCallback: () => cellsMetaData
  });
  var isGroupedAllDayPanel = calculateIsGroupedAllDayPanel(appointmentsConfig.loadedResources, appointmentsConfig.groupOrientation, appointmentsConfig.showAllDayPanel);
  var rowCount = viewDataProvider.getRowCount({
    intervalCount: appointmentsConfig.intervalCount,
    currentDate: appointmentsConfig.currentDate,
    viewType: appointmentsConfig.viewType,
    hoursInterval: appointmentsConfig.hoursInterval,
    startDayHour: appointmentsConfig.startDayHour,
    endDayHour: appointmentsConfig.endDayHour
  });
  var allDayHeight = getAllDayHeight(appointmentsConfig.showAllDayPanel, appointmentsConfig.isVerticalGroupOrientation, cellsMetaData);
  var endViewDate = viewDataProvider.getLastCellEndDate();
  var visibleDayDuration = viewDataProvider.getVisibleDayDuration(appointmentsConfig.startDayHour, appointmentsConfig.endDayHour, appointmentsConfig.hoursInterval);
  var {
    leftVirtualCellCount,
    topVirtualRowCount
  } = viewDataProvider.viewData;
  var cellDuration = getCellDuration(appointmentsConfig.viewType, appointmentsConfig.startDayHour, appointmentsConfig.endDayHour, appointmentsConfig.hoursInterval);
  var getAppointmentColor = createGetAppointmentColor({
    resources: appointmentsConfig.resources,
    dataAccessors: dataAccessors.resources,
    loadedResources: appointmentsConfig.loadedResources,
    resourceLoaderMap: new Map()
  });
  var appointmentRenderingStrategyName = getAppointmentRenderingStrategyName(appointmentsConfig.viewType);
  return _extends({}, appointmentsConfig, {
    appointmentRenderingStrategyName,
    loadedResources: appointmentsConfig.loadedResources,
    dataAccessors,
    timeZoneCalculator,
    viewDataProvider,
    positionHelper,
    isGroupedAllDayPanel,
    rowCount,
    cellWidth: getCellWidth(cellsMetaData),
    cellHeight: getCellHeight(cellsMetaData),
    allDayHeight,
    isGroupedByDate: groupedByDate,
    endViewDate,
    visibleDayDuration,
    intervalDuration: cellDuration,
    allDayIntervalDuration: toMs("day"),
    leftVirtualCellCount,
    topVirtualCellCount: topVirtualRowCount,
    cellDuration,
    getAppointmentColor,
    resizableStep: positionHelper.getResizableStep(),
    DOMMetaData: cellsMetaData
  });
};