import _extends from "@babel/runtime/helpers/esm/extends";
import { normalizeStartDate, normalizeEndDate } from './utils';

var getAppointmentLeftCell = options => {
  var {
    cellHeight,
    cellWidth,
    viewDataProvider,
    relativeAppointmentRect,
    appointmentSettings,
    rtlEnabled
  } = options;
  var cellRowIndex = Math.floor(relativeAppointmentRect.top / cellHeight);
  var cellColumnIndex = Math.round(relativeAppointmentRect.left / cellWidth);
  var leftCell = viewDataProvider.getCellData(cellRowIndex, cellColumnIndex, appointmentSettings.allDay, rtlEnabled);
  return leftCell;
};

var getDateRangeHorizontal = options => {
  var {
    cellWidth,
    cellCountInRow,
    relativeAppointmentRect,
    viewDataProvider,
    appointmentSettings,
    handles
  } = options;
  var appointmentFirstCell = getAppointmentLeftCell(options);
  var appointmentCellsAmount = Math.round(relativeAppointmentRect.width / cellWidth);
  var appointmentLastCellIndex = appointmentFirstCell.index + (appointmentCellsAmount - 1);
  var {
    allDay,
    sourceAppointment
  } = appointmentSettings.info;

  if (handles.left) {
    var startDate = normalizeStartDate(options, appointmentFirstCell.startDate, sourceAppointment.startDate);
    return {
      startDate,
      endDate: sourceAppointment.endDate
    };
  }

  var appointmentRowIndex = Math.floor(appointmentLastCellIndex / cellCountInRow);
  var appointmentColumnIndex = appointmentLastCellIndex % cellCountInRow;
  var appointmentLastCell = viewDataProvider.getCellData(appointmentRowIndex, appointmentColumnIndex, allDay);
  var endDate = !options.considerTime ? appointmentLastCell.endDate : appointmentLastCell.startDate;
  endDate = normalizeEndDate(options, endDate, sourceAppointment.endDate);
  return {
    startDate: sourceAppointment.startDate,
    endDate
  };
};

var getDateRangeHorizontalRTL = options => {
  var {
    viewDataProvider,
    cellCountInRow,
    appointmentSettings,
    handles,
    cellWidth,
    relativeAppointmentRect
  } = options;
  var appointmentLastCell = getAppointmentLeftCell(options);
  var {
    allDay,
    sourceAppointment
  } = appointmentSettings.info;

  if (handles.right) {
    var appointmentLastCellIndex = appointmentLastCell.index;
    var appointmentCellsAmount = Math.round(relativeAppointmentRect.width / cellWidth);
    var appointmentFirstCellIndex = appointmentLastCellIndex - appointmentCellsAmount + 1;
    var appointmentRowIndex = Math.floor(appointmentLastCellIndex / cellCountInRow);
    var appointmentFirstCell = viewDataProvider.getCellData(appointmentRowIndex, appointmentFirstCellIndex, allDay, true);
    var startDate = normalizeStartDate(options, appointmentFirstCell.startDate, sourceAppointment.endDate);
    return {
      startDate,
      endDate: sourceAppointment.endDate
    };
  }

  var endDate = !options.considerTime ? appointmentLastCell.endDate : appointmentLastCell.startDate;
  endDate = normalizeEndDate(options, endDate, sourceAppointment.endDate);
  return {
    startDate: sourceAppointment.startDate,
    endDate
  };
};

var getRelativeAppointmentRect = (appointmentRect, parentAppointmentRect) => {
  var left = appointmentRect.left - parentAppointmentRect.left;
  var top = appointmentRect.top - parentAppointmentRect.top;
  var width = left < 0 ? appointmentRect.width + left : appointmentRect.width;
  var height = top < 0 ? appointmentRect.height + top : appointmentRect.height;
  return {
    left: Math.max(0, left),
    top: Math.max(0, top),
    width,
    height
  };
};

var getAppointmentCellsInfo = options => {
  var {
    appointmentSettings,
    isVerticalGroupedWorkSpace,
    DOMMetaData
  } = options;
  var DOMMetaTable = appointmentSettings.allDay && !isVerticalGroupedWorkSpace ? [DOMMetaData.allDayPanelCellsMeta] : DOMMetaData.dateTableCellsMeta;
  var {
    positionByMap
  } = appointmentSettings;
  var {
    height: cellHeight,
    width: cellWidth
  } = DOMMetaTable[positionByMap.rowIndex][positionByMap.columnIndex];
  var cellCountInRow = DOMMetaTable[positionByMap.rowIndex].length;
  return {
    cellWidth,
    cellHeight,
    cellCountInRow
  };
};

export var getAppointmentDateRange = options => {
  var {
    appointmentSettings
  } = options;
  var relativeAppointmentRect = getRelativeAppointmentRect(options.appointmentRect, options.parentAppointmentRect);
  var cellInfo = getAppointmentCellsInfo(options);
  var considerTime = !options.isDateAndTimeView || appointmentSettings.allDay;

  var extendedOptions = _extends({}, options, cellInfo, {
    considerTime,
    relativeAppointmentRect
  });

  return !options.rtlEnabled ? getDateRangeHorizontal(extendedOptions) : getDateRangeHorizontalRTL(extendedOptions);
};