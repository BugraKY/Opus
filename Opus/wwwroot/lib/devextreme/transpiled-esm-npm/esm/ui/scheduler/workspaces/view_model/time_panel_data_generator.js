import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["allDay", "startDate", "endDate", "groups", "groupIndex", "isFirstGroupCell", "isLastGroupCell", "index"];
import { getDisplayedRowCount } from '../../../../renovation/ui/scheduler/view_model/to_test/views/utils/base';
import { getTimePanelCellText } from '../../../../renovation/ui/scheduler/view_model/to_test/views/utils/week';
export class TimePanelDataGenerator {
  constructor(viewDataGenerator) {
    this._viewDataGenerator = viewDataGenerator;
  }

  getCompleteTimePanelMap(options, completeViewDataMap) {
    var {
      startViewDate,
      cellDuration,
      startDayHour,
      isVerticalGrouping,
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      endDayHour
    } = options;

    var rowCountInGroup = this._viewDataGenerator.getRowCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour
    });

    var cellCountInGroupRow = this._viewDataGenerator.getCellCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour
    });

    var allDayRowsCount = 0;
    return completeViewDataMap.map((row, index) => {
      var _row$ = row[0],
          {
        allDay,
        startDate,
        groups,
        groupIndex,
        isFirstGroupCell,
        isLastGroupCell,
        index: cellIndex
      } = _row$,
          restCellProps = _objectWithoutPropertiesLoose(_row$, _excluded);

      if (allDay) {
        allDayRowsCount += 1;
      }

      var timeIndex = (index - allDayRowsCount) % rowCountInGroup;
      return _extends({}, restCellProps, {
        startDate,
        allDay,
        text: getTimePanelCellText(timeIndex, startDate, startViewDate, cellDuration, startDayHour),
        groups: isVerticalGrouping ? groups : undefined,
        groupIndex: isVerticalGrouping ? groupIndex : undefined,
        isFirstGroupCell: isVerticalGrouping && isFirstGroupCell,
        isLastGroupCell: isVerticalGrouping && isLastGroupCell,
        index: Math.floor(cellIndex / cellCountInGroupRow)
      });
    });
  }

  generateTimePanelData(completeTimePanelMap, options) {
    var {
      startRowIndex,
      rowCount,
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      isGroupedAllDayPanel,
      isVerticalGrouping,
      isAllDayPanelVisible
    } = options;
    var indexDifference = isVerticalGrouping || !isAllDayPanelVisible ? 0 : 1;
    var correctedStartRowIndex = startRowIndex + indexDifference;
    var displayedRowCount = getDisplayedRowCount(rowCount, completeTimePanelMap);
    var timePanelMap = completeTimePanelMap.slice(correctedStartRowIndex, correctedStartRowIndex + displayedRowCount);
    var timePanelData = {
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      isGroupedAllDayPanel
    };

    var {
      previousGroupedData: groupedData
    } = this._generateTimePanelDataFromMap(timePanelMap, isGroupedAllDayPanel);

    timePanelData.groupedData = groupedData;
    return timePanelData;
  }

  _generateTimePanelDataFromMap(timePanelMap, isGroupedAllDayPanel) {
    return timePanelMap.reduce((_ref, cellData) => {
      var {
        previousGroupIndex,
        previousGroupedData
      } = _ref;
      var currentGroupIndex = cellData.groupIndex;

      if (currentGroupIndex !== previousGroupIndex) {
        previousGroupedData.push({
          dateTable: [],
          isGroupedAllDayPanel,
          groupIndex: currentGroupIndex
        });
      }

      if (cellData.allDay) {
        previousGroupedData[previousGroupedData.length - 1].allDayPanel = cellData;
      } else {
        previousGroupedData[previousGroupedData.length - 1].dateTable.push(cellData);
      }

      return {
        previousGroupIndex: currentGroupIndex,
        previousGroupedData
      };
    }, {
      previousGroupIndex: -1,
      previousGroupedData: []
    });
  }

}