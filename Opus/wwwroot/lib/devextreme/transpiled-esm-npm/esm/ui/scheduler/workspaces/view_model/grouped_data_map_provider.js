import dateUtils from '../../../../core/utils/date';
import { isDateAndTimeView } from '../../../../renovation/ui/scheduler/view_model/to_test/views/utils/base';
export class GroupedDataMapProvider {
  constructor(viewDataGenerator, viewDataMap, completeViewDataMap, viewOptions) {
    this.groupedDataMap = viewDataGenerator.generateGroupedDataMap(viewDataMap);
    this.completeViewDataMap = completeViewDataMap;
    this._viewOptions = viewOptions;
  }

  getGroupStartDate(groupIndex) {
    var firstRow = this.getFirstGroupRow(groupIndex);

    if (firstRow) {
      var {
        startDate
      } = firstRow[0].cellData;
      return startDate;
    }
  }

  getGroupEndDate(groupIndex) {
    var lastRow = this.getLastGroupRow(groupIndex);

    if (lastRow) {
      var lastColumnIndex = lastRow.length - 1;
      var {
        cellData
      } = lastRow[lastColumnIndex];
      var {
        endDate
      } = cellData;
      return endDate;
    }
  }

  findGroupCellStartDate(groupIndex, startDate, endDate, isAllDay, isFindByDate) {
    // TODO make separate method for finding cells in all day panel
    if (isAllDay) {
      return this.findAllDayGroupCellStartDate(groupIndex, startDate);
    }

    var groupData = this.getGroupFromDateTableGroupMap(groupIndex);

    var checkCellStartDate = (rowIndex, columnIndex) => {
      var {
        cellData
      } = groupData[rowIndex][columnIndex];
      var {
        startDate: secondMin,
        endDate: secondMax
      } = cellData;

      if (isFindByDate) {
        secondMin = dateUtils.trimTime(secondMin);
        secondMax = dateUtils.setToDayEnd(secondMin);
      }

      if (dateUtils.intervalsOverlap({
        firstMin: startDate,
        firstMax: endDate,
        secondMin,
        secondMax
      })) {
        return secondMin;
      }
    };

    var searchVertical = () => {
      var cellCount = groupData[0].length;

      for (var columnIndex = 0; columnIndex < cellCount; ++columnIndex) {
        for (var rowIndex = 0; rowIndex < groupData.length; ++rowIndex) {
          var result = checkCellStartDate(rowIndex, columnIndex);
          if (result) return result;
        }
      }
    };

    var searchHorizontal = () => {
      for (var rowIndex = 0; rowIndex < groupData.length; ++rowIndex) {
        var row = groupData[rowIndex];

        for (var columnIndex = 0; columnIndex < row.length; ++columnIndex) {
          var result = checkCellStartDate(rowIndex, columnIndex);
          if (result) return result;
        }
      }
    };

    var startDateVerticalSearch = searchVertical();
    var startDateHorizontalSearch = searchHorizontal();
    return startDateVerticalSearch > startDateHorizontalSearch ? startDateHorizontalSearch : startDateVerticalSearch;
  }

  findAllDayGroupCellStartDate(groupIndex, startDate) {
    var groupStartDate = this.getGroupStartDate(groupIndex);
    return groupStartDate > startDate ? groupStartDate : startDate;
  }

  findCellPositionInMap(cellInfo) {
    var {
      groupIndex,
      startDate,
      isAllDay,
      index
    } = cellInfo;
    var startTime = isAllDay ? dateUtils.trimTime(startDate).getTime() : startDate.getTime();

    var isStartDateInCell = cellData => {
      if (!isDateAndTimeView(this._viewOptions.viewType)) {
        return dateUtils.sameDate(startDate, cellData.startDate);
      }

      var cellStartTime = cellData.startDate.getTime();
      var cellEndTime = cellData.endDate.getTime();
      return isAllDay ? cellData.allDay && startTime >= cellStartTime && startTime <= cellEndTime : startTime >= cellStartTime && startTime < cellEndTime;
    };

    var {
      allDayPanelGroupedMap,
      dateTableGroupedMap
    } = this.groupedDataMap;
    var rows = isAllDay && !this._viewOptions.isVerticalGrouping ? [allDayPanelGroupedMap[groupIndex]] || [] : dateTableGroupedMap[groupIndex] || [];

    for (var rowIndex = 0; rowIndex < rows.length; ++rowIndex) {
      var row = rows[rowIndex];

      for (var columnIndex = 0; columnIndex < row.length; ++columnIndex) {
        var cell = row[columnIndex];
        var {
          cellData
        } = cell;

        if (this._isSameGroupIndexAndIndex(cellData, groupIndex, index)) {
          if (isStartDateInCell(cellData)) {
            return cell.position;
          }
        }
      }
    }

    return undefined;
  }

  _isSameGroupIndexAndIndex(cellData, groupIndex, index) {
    return cellData.groupIndex === groupIndex && (index === undefined || cellData.index === index);
  }

  getCellsGroup(groupIndex) {
    var {
      dateTableGroupedMap
    } = this.groupedDataMap;
    var groupData = dateTableGroupedMap[groupIndex];

    if (groupData) {
      var {
        cellData
      } = groupData[0][0];
      return cellData.groups;
    }
  }

  getCompletedGroupsInfo() {
    var {
      dateTableGroupedMap
    } = this.groupedDataMap;
    return dateTableGroupedMap.map(groupData => {
      var firstCell = groupData[0][0];
      var {
        allDay,
        groupIndex
      } = firstCell.cellData;
      return {
        allDay,
        groupIndex,
        startDate: this.getGroupStartDate(groupIndex),
        endDate: this.getGroupEndDate(groupIndex)
      };
    }).filter(_ref => {
      var {
        startDate
      } = _ref;
      return !!startDate;
    });
  }

  getGroupIndices() {
    return this.getCompletedGroupsInfo().map(_ref2 => {
      var {
        groupIndex
      } = _ref2;
      return groupIndex;
    });
  }

  getGroupFromDateTableGroupMap(groupIndex) {
    var {
      dateTableGroupedMap
    } = this.groupedDataMap;
    return dateTableGroupedMap[groupIndex];
  }

  getFirstGroupRow(groupIndex) {
    var groupedData = this.getGroupFromDateTableGroupMap(groupIndex);

    if (groupedData) {
      var {
        cellData
      } = groupedData[0][0];
      return !cellData.allDay ? groupedData[0] : groupedData[1];
    }
  }

  getLastGroupRow(groupIndex) {
    var {
      dateTableGroupedMap
    } = this.groupedDataMap;
    var groupedData = dateTableGroupedMap[groupIndex];

    if (groupedData) {
      var lastRowIndex = groupedData.length - 1;
      return groupedData[lastRowIndex];
    }
  }

  getLastGroupCellPosition(groupIndex) {
    var groupRow = this.getLastGroupRow(groupIndex);
    return groupRow === null || groupRow === void 0 ? void 0 : groupRow[(groupRow === null || groupRow === void 0 ? void 0 : groupRow.length) - 1].position;
  }

  getRowCountInGroup(groupIndex) {
    var groupRow = this.getLastGroupRow(groupIndex);
    var cellAmount = groupRow.length;
    var lastCellData = groupRow[cellAmount - 1].cellData;
    var lastCellIndex = lastCellData.index;
    return (lastCellIndex + 1) / groupRow.length;
  }

}