import _extends from "@babel/runtime/helpers/esm/extends";

var getCellSize = DOMMetaData => {
  var {
    dateTableCellsMeta
  } = DOMMetaData;
  var length = dateTableCellsMeta === null || dateTableCellsMeta === void 0 ? void 0 : dateTableCellsMeta.length;

  if (!length) {
    return {
      width: 0,
      height: 0
    };
  }

  var cellIndex = length > 1 ? 1 : 0;
  var cellSize = dateTableCellsMeta[cellIndex][0];
  return {
    width: cellSize.width,
    height: cellSize.height
  };
};

var getMaxAllowedHorizontalPosition = (groupIndex, viewDataProvider, rtlEnabled, DOMMetaData) => {
  var {
    dateTableCellsMeta
  } = DOMMetaData;
  var firstRow = dateTableCellsMeta[0];
  if (!firstRow) return 0;
  var {
    columnIndex
  } = viewDataProvider.getLastGroupCellPosition(groupIndex);
  var cellPosition = firstRow[columnIndex];
  if (!cellPosition) return 0;
  return !rtlEnabled ? cellPosition.left + cellPosition.width : cellPosition.left;
};

export var getCellHeight = DOMMetaData => {
  return getCellSize(DOMMetaData).height;
};
export var getCellWidth = DOMMetaData => {
  return getCellSize(DOMMetaData).width;
};
export var getAllDayHeight = (showAllDayPanel, isVerticalGrouping, DOMMetaData) => {
  if (!showAllDayPanel) {
    return 0;
  }

  if (isVerticalGrouping) {
    var {
      dateTableCellsMeta
    } = DOMMetaData;
    var length = dateTableCellsMeta === null || dateTableCellsMeta === void 0 ? void 0 : dateTableCellsMeta.length;
    return length ? dateTableCellsMeta[0][0].height : 0;
  }

  var {
    allDayPanelCellsMeta
  } = DOMMetaData;
  return allDayPanelCellsMeta !== null && allDayPanelCellsMeta !== void 0 && allDayPanelCellsMeta.length ? allDayPanelCellsMeta[0].height : 0;
};
export var getMaxAllowedPosition = (groupIndex, viewDataProvider, rtlEnabled, DOMMetaData) => {
  var validGroupIndex = groupIndex || 0;
  return getMaxAllowedHorizontalPosition(validGroupIndex, viewDataProvider, rtlEnabled, DOMMetaData);
};
export var getGroupWidth = (groupIndex, viewDataProvider, options) => {
  var {
    isVirtualScrolling,
    rtlEnabled,
    DOMMetaData
  } = options;
  var cellWidth = getCellWidth(DOMMetaData);
  var result = viewDataProvider.getCellCount(options) * cellWidth; // TODO: refactor after deleting old render

  if (isVirtualScrolling) {
    var groupedData = viewDataProvider.groupedDataMap.dateTableGroupedMap;
    var groupLength = groupedData[groupIndex][0].length;
    result = groupLength * cellWidth;
  }

  var position = getMaxAllowedPosition(groupIndex, viewDataProvider, rtlEnabled, DOMMetaData);
  var currentPosition = position[groupIndex];

  if (currentPosition) {
    if (rtlEnabled) {
      result = currentPosition - position[groupIndex + 1];
    } else {
      if (groupIndex === 0) {
        result = currentPosition;
      } else {
        result = currentPosition - position[groupIndex - 1];
      }
    }
  }

  return result;
};
export class PositionHelper {
  get viewDataProvider() {
    return this.options.viewDataProvider;
  }

  get rtlEnabled() {
    return this.options.rtlEnabled;
  }

  get isGroupedByDate() {
    return this.options.isGroupedByDate;
  }

  get groupCount() {
    return this.options.groupCount;
  }

  get DOMMetaData() {
    return this.options.getDOMMetaDataCallback();
  }

  constructor(options) {
    this.options = options;
    this.groupStrategy = this.options.isVerticalGrouping ? new GroupStrategyBase(this.options) : new GroupStrategyHorizontal(this.options);
  }

  getHorizontalMax(groupIndex) {
    var getMaxPosition = groupIndex => {
      return getMaxAllowedPosition(groupIndex, this.viewDataProvider, this.rtlEnabled, this.DOMMetaData);
    };

    if (this.isGroupedByDate) {
      var viewPortGroupCount = this.viewDataProvider.getViewPortGroupCount();
      return Math.max(getMaxPosition(groupIndex), getMaxPosition(viewPortGroupCount - 1));
    }

    return getMaxPosition(groupIndex);
  }

  getResizableStep() {
    var cellWidth = getCellWidth(this.DOMMetaData);

    if (this.isGroupedByDate) {
      return this.groupCount * cellWidth;
    }

    return cellWidth;
  }

  getVerticalMax(options) {
    return this.groupStrategy.getVerticalMax(options);
  }

  getOffsetByAllDayPanel(options) {
    return this.groupStrategy.getOffsetByAllDayPanel(options);
  }

  getGroupTop(options) {
    return this.groupStrategy.getGroupTop(options);
  }

}

class GroupStrategyBase {
  constructor(options) {
    this.options = options;
  }

  get viewDataProvider() {
    return this.options.viewDataProvider;
  }

  get isGroupedByDate() {
    return this.options.isGroupedByDate;
  }

  get rtlEnabled() {
    return this.options.rtlEnabled;
  }

  get groupCount() {
    return this.options.groupCount;
  }

  get DOMMetaData() {
    return this.options.getDOMMetaDataCallback();
  }

  getOffsetByAllDayPanel(_ref) {
    var {
      groupIndex,
      supportAllDayRow,
      showAllDayPanel
    } = _ref;
    var result = 0;

    if (supportAllDayRow && showAllDayPanel) {
      var allDayPanelHeight = getAllDayHeight(showAllDayPanel, true, this.DOMMetaData);
      result = allDayPanelHeight * (groupIndex + 1);
    }

    return result;
  }

  getVerticalMax(options) {
    var maxAllowedPosition = this._getMaxAllowedVerticalPosition(_extends({}, options, {
      viewDataProvider: this.viewDataProvider,
      rtlEnabled: this.rtlEnabled,
      DOMMetaData: this.DOMMetaData
    }));

    maxAllowedPosition += this.getOffsetByAllDayPanel(options);
    return maxAllowedPosition;
  }

  getGroupTop(_ref2) {
    var {
      groupIndex,
      showAllDayPanel,
      isGroupedAllDayPanel
    } = _ref2;
    var rowCount = this.viewDataProvider.getRowCountInGroup(groupIndex);

    var maxVerticalPosition = this._getMaxAllowedVerticalPosition({
      groupIndex,
      viewDataProvider: this.viewDataProvider,
      showAllDayPanel,
      isGroupedAllDayPanel,
      isVerticalGrouping: true,
      DOMMetaData: this.DOMMetaData
    });

    return maxVerticalPosition - getCellHeight(this.DOMMetaData) * rowCount;
  }

  _getAllDayHeight(showAllDayPanel) {
    return getAllDayHeight(showAllDayPanel, true, this.DOMMetaData);
  }

  _getMaxAllowedVerticalPosition(_ref3) {
    var {
      groupIndex,
      showAllDayPanel,
      isGroupedAllDayPanel
    } = _ref3;
    var {
      rowIndex
    } = this.viewDataProvider.getLastGroupCellPosition(groupIndex);
    var {
      dateTableCellsMeta
    } = this.DOMMetaData;
    var lastGroupRow = dateTableCellsMeta[rowIndex];
    if (!lastGroupRow) return 0;
    var result = lastGroupRow[0].top + lastGroupRow[0].height; // TODO remove while refactoring dual calculcations.
    // Should decrease allDayPanel amount due to the dual calculation corrections.

    if (isGroupedAllDayPanel) {
      result -= (groupIndex + 1) * this._getAllDayHeight(showAllDayPanel);
    }

    return result;
  }

}

class GroupStrategyHorizontal extends GroupStrategyBase {
  getOffsetByAllDayPanel(options) {
    return 0;
  }

  getVerticalMax(options) {
    var {
      isVirtualScrolling,
      groupIndex
    } = options;
    var correctedGroupIndex = isVirtualScrolling ? groupIndex : 0;
    return this._getMaxAllowedVerticalPosition(_extends({}, options, {
      groupIndex: correctedGroupIndex
    }));
  }

  getGroupTop(options) {
    return 0;
  }

  _getAllDayHeight(showAllDayPanel) {
    return getAllDayHeight(showAllDayPanel, false, this.DOMMetaData);
  }

}