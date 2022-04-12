import _extends from "@babel/runtime/helpers/esm/extends";
import { isDateAndTimeView } from '../../../renovation/ui/scheduler/view_model/to_test/views/utils/base';
export class CellsSelectionController {
  handleArrowClick(options) {
    var {
      key,
      focusedCellPosition,
      edgeIndices,
      getCellDataByPosition,
      isAllDayPanelCell
    } = options;
    var nextCellIndices;

    switch (key) {
      case 'down':
        nextCellIndices = this.getCellFromNextRowPosition(focusedCellPosition, 'next', edgeIndices);
        break;

      case 'up':
        nextCellIndices = this.getCellFromNextRowPosition(focusedCellPosition, 'prev', edgeIndices);
        break;

      case 'left':
        nextCellIndices = this.getCellFromNextColumnPosition(_extends({}, options, {
          direction: 'prev'
        }));
        break;

      case 'right':
        nextCellIndices = this.getCellFromNextColumnPosition(_extends({}, options, {
          direction: 'next'
        }));
        break;
    }

    var currentCellData = getCellDataByPosition(nextCellIndices.rowIndex, nextCellIndices.columnIndex, isAllDayPanelCell);
    return this.moveToCell(_extends({}, options, {
      currentCellData
    }));
  }

  getCellFromNextRowPosition(focusedCellPosition, direction, edgeIndices) {
    var {
      columnIndex,
      rowIndex
    } = focusedCellPosition;
    var deltaPosition = direction === 'next' ? 1 : -1;
    var nextRowIndex = rowIndex + deltaPosition;
    var validRowIndex = nextRowIndex >= 0 && nextRowIndex <= edgeIndices.lastRowIndex ? nextRowIndex : rowIndex;
    return {
      columnIndex,
      rowIndex: validRowIndex
    };
  }

  getCellFromNextColumnPosition(options) {
    var {
      focusedCellPosition,
      direction,
      edgeIndices,
      isRTL,
      isGroupedByDate,
      groupCount,
      isMultiSelection,
      viewType
    } = options;
    var {
      columnIndex,
      rowIndex
    } = focusedCellPosition;
    var {
      firstColumnIndex,
      lastColumnIndex,
      firstRowIndex,
      lastRowIndex
    } = edgeIndices;
    var step = isGroupedByDate && isMultiSelection ? groupCount : 1;
    var sign = isRTL ? -1 : 1;
    var deltaColumnIndex = direction === 'next' ? sign * step : -1 * sign * step;
    var nextColumnIndex = columnIndex + deltaColumnIndex;
    var isValidColumnIndex = nextColumnIndex >= firstColumnIndex && nextColumnIndex <= lastColumnIndex;

    if (isValidColumnIndex) {
      return {
        columnIndex: nextColumnIndex,
        rowIndex
      };
    }

    return isDateAndTimeView(viewType) ? focusedCellPosition : this._processEdgeCell({
      nextColumnIndex,
      rowIndex,
      columnIndex,
      firstColumnIndex,
      lastColumnIndex,
      firstRowIndex,
      lastRowIndex,
      step
    });
  }

  _processEdgeCell(options) {
    var {
      nextColumnIndex,
      rowIndex,
      columnIndex,
      firstColumnIndex,
      lastColumnIndex,
      firstRowIndex,
      lastRowIndex,
      step
    } = options;
    var validColumnIndex = nextColumnIndex;
    var validRowIndex = rowIndex;
    var isLeftEdgeCell = nextColumnIndex < firstColumnIndex;
    var isRightEdgeCell = nextColumnIndex > lastColumnIndex;

    if (isLeftEdgeCell) {
      var columnIndexInNextRow = lastColumnIndex - (step - columnIndex % step - 1);
      var nextRowIndex = rowIndex - 1;
      var isValidRowIndex = nextRowIndex >= firstRowIndex;
      validRowIndex = isValidRowIndex ? nextRowIndex : rowIndex;
      validColumnIndex = isValidRowIndex ? columnIndexInNextRow : columnIndex;
    }

    if (isRightEdgeCell) {
      var _columnIndexInNextRow = firstColumnIndex + columnIndex % step;

      var _nextRowIndex = rowIndex + 1;

      var _isValidRowIndex = _nextRowIndex <= lastRowIndex;

      validRowIndex = _isValidRowIndex ? _nextRowIndex : rowIndex;
      validColumnIndex = _isValidRowIndex ? _columnIndexInNextRow : columnIndex;
    }

    return {
      columnIndex: validColumnIndex,
      rowIndex: validRowIndex
    };
  }

  moveToCell(options) {
    var {
      isMultiSelection,
      isMultiSelectionAllowed,
      focusedCellData,
      currentCellData
    } = options;
    var isValidMultiSelection = isMultiSelection && isMultiSelectionAllowed;
    var nextFocusedCellData = isValidMultiSelection ? this._getNextCellData(currentCellData, focusedCellData) : currentCellData;
    return nextFocusedCellData;
  }

  _getNextCellData(nextFocusedCellData, focusedCellData, isVirtualCell) {
    if (isVirtualCell) {
      return focusedCellData;
    }

    var isValidNextFocusedCell = this._isValidNextFocusedCell(nextFocusedCellData, focusedCellData);

    return isValidNextFocusedCell ? nextFocusedCellData : focusedCellData;
  }

  _isValidNextFocusedCell(nextFocusedCellData, focusedCellData) {
    if (!focusedCellData) {
      return true;
    }

    var {
      groupIndex,
      allDay
    } = focusedCellData;
    var {
      groupIndex: nextGroupIndex,
      allDay: nextAllDay
    } = nextFocusedCellData;
    return groupIndex === nextGroupIndex && allDay === nextAllDay;
  }

}