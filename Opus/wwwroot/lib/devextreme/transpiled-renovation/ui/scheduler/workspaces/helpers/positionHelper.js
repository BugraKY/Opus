"use strict";

exports.getMaxAllowedPosition = exports.getGroupWidth = exports.getCellWidth = exports.getCellHeight = exports.getAllDayHeight = exports.PositionHelper = void 0;

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var getCellSize = function getCellSize(DOMMetaData) {
  var dateTableCellsMeta = DOMMetaData.dateTableCellsMeta;
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

var getMaxAllowedHorizontalPosition = function getMaxAllowedHorizontalPosition(groupIndex, viewDataProvider, rtlEnabled, DOMMetaData) {
  var dateTableCellsMeta = DOMMetaData.dateTableCellsMeta;
  var firstRow = dateTableCellsMeta[0];
  if (!firstRow) return 0;

  var _viewDataProvider$get = viewDataProvider.getLastGroupCellPosition(groupIndex),
      columnIndex = _viewDataProvider$get.columnIndex;

  var cellPosition = firstRow[columnIndex];
  if (!cellPosition) return 0;
  return !rtlEnabled ? cellPosition.left + cellPosition.width : cellPosition.left;
};

var getCellHeight = function getCellHeight(DOMMetaData) {
  return getCellSize(DOMMetaData).height;
};

exports.getCellHeight = getCellHeight;

var getCellWidth = function getCellWidth(DOMMetaData) {
  return getCellSize(DOMMetaData).width;
};

exports.getCellWidth = getCellWidth;

var getAllDayHeight = function getAllDayHeight(showAllDayPanel, isVerticalGrouping, DOMMetaData) {
  if (!showAllDayPanel) {
    return 0;
  }

  if (isVerticalGrouping) {
    var dateTableCellsMeta = DOMMetaData.dateTableCellsMeta;
    var length = dateTableCellsMeta === null || dateTableCellsMeta === void 0 ? void 0 : dateTableCellsMeta.length;
    return length ? dateTableCellsMeta[0][0].height : 0;
  }

  var allDayPanelCellsMeta = DOMMetaData.allDayPanelCellsMeta;
  return allDayPanelCellsMeta !== null && allDayPanelCellsMeta !== void 0 && allDayPanelCellsMeta.length ? allDayPanelCellsMeta[0].height : 0;
};

exports.getAllDayHeight = getAllDayHeight;

var getMaxAllowedPosition = function getMaxAllowedPosition(groupIndex, viewDataProvider, rtlEnabled, DOMMetaData) {
  var validGroupIndex = groupIndex || 0;
  return getMaxAllowedHorizontalPosition(validGroupIndex, viewDataProvider, rtlEnabled, DOMMetaData);
};

exports.getMaxAllowedPosition = getMaxAllowedPosition;

var getGroupWidth = function getGroupWidth(groupIndex, viewDataProvider, options) {
  var isVirtualScrolling = options.isVirtualScrolling,
      rtlEnabled = options.rtlEnabled,
      DOMMetaData = options.DOMMetaData;
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

exports.getGroupWidth = getGroupWidth;

var PositionHelper = /*#__PURE__*/function () {
  function PositionHelper(options) {
    this.options = options;
    this.groupStrategy = this.options.isVerticalGrouping ? new GroupStrategyBase(this.options) : new GroupStrategyHorizontal(this.options);
  }

  var _proto = PositionHelper.prototype;

  _proto.getHorizontalMax = function getHorizontalMax(groupIndex) {
    var _this = this;

    var getMaxPosition = function getMaxPosition(groupIndex) {
      return getMaxAllowedPosition(groupIndex, _this.viewDataProvider, _this.rtlEnabled, _this.DOMMetaData);
    };

    if (this.isGroupedByDate) {
      var viewPortGroupCount = this.viewDataProvider.getViewPortGroupCount();
      return Math.max(getMaxPosition(groupIndex), getMaxPosition(viewPortGroupCount - 1));
    }

    return getMaxPosition(groupIndex);
  };

  _proto.getResizableStep = function getResizableStep() {
    var cellWidth = getCellWidth(this.DOMMetaData);

    if (this.isGroupedByDate) {
      return this.groupCount * cellWidth;
    }

    return cellWidth;
  };

  _proto.getVerticalMax = function getVerticalMax(options) {
    return this.groupStrategy.getVerticalMax(options);
  };

  _proto.getOffsetByAllDayPanel = function getOffsetByAllDayPanel(options) {
    return this.groupStrategy.getOffsetByAllDayPanel(options);
  };

  _proto.getGroupTop = function getGroupTop(options) {
    return this.groupStrategy.getGroupTop(options);
  };

  _createClass(PositionHelper, [{
    key: "viewDataProvider",
    get: function get() {
      return this.options.viewDataProvider;
    }
  }, {
    key: "rtlEnabled",
    get: function get() {
      return this.options.rtlEnabled;
    }
  }, {
    key: "isGroupedByDate",
    get: function get() {
      return this.options.isGroupedByDate;
    }
  }, {
    key: "groupCount",
    get: function get() {
      return this.options.groupCount;
    }
  }, {
    key: "DOMMetaData",
    get: function get() {
      return this.options.getDOMMetaDataCallback();
    }
  }]);

  return PositionHelper;
}();

exports.PositionHelper = PositionHelper;

var GroupStrategyBase = /*#__PURE__*/function () {
  function GroupStrategyBase(options) {
    this.options = options;
  }

  var _proto2 = GroupStrategyBase.prototype;

  _proto2.getOffsetByAllDayPanel = function getOffsetByAllDayPanel(_ref) {
    var groupIndex = _ref.groupIndex,
        supportAllDayRow = _ref.supportAllDayRow,
        showAllDayPanel = _ref.showAllDayPanel;
    var result = 0;

    if (supportAllDayRow && showAllDayPanel) {
      var allDayPanelHeight = getAllDayHeight(showAllDayPanel, true, this.DOMMetaData);
      result = allDayPanelHeight * (groupIndex + 1);
    }

    return result;
  };

  _proto2.getVerticalMax = function getVerticalMax(options) {
    var maxAllowedPosition = this._getMaxAllowedVerticalPosition(_extends({}, options, {
      viewDataProvider: this.viewDataProvider,
      rtlEnabled: this.rtlEnabled,
      DOMMetaData: this.DOMMetaData
    }));

    maxAllowedPosition += this.getOffsetByAllDayPanel(options);
    return maxAllowedPosition;
  };

  _proto2.getGroupTop = function getGroupTop(_ref2) {
    var groupIndex = _ref2.groupIndex,
        showAllDayPanel = _ref2.showAllDayPanel,
        isGroupedAllDayPanel = _ref2.isGroupedAllDayPanel;
    var rowCount = this.viewDataProvider.getRowCountInGroup(groupIndex);

    var maxVerticalPosition = this._getMaxAllowedVerticalPosition({
      groupIndex: groupIndex,
      viewDataProvider: this.viewDataProvider,
      showAllDayPanel: showAllDayPanel,
      isGroupedAllDayPanel: isGroupedAllDayPanel,
      isVerticalGrouping: true,
      DOMMetaData: this.DOMMetaData
    });

    return maxVerticalPosition - getCellHeight(this.DOMMetaData) * rowCount;
  };

  _proto2._getAllDayHeight = function _getAllDayHeight(showAllDayPanel) {
    return getAllDayHeight(showAllDayPanel, true, this.DOMMetaData);
  };

  _proto2._getMaxAllowedVerticalPosition = function _getMaxAllowedVerticalPosition(_ref3) {
    var groupIndex = _ref3.groupIndex,
        showAllDayPanel = _ref3.showAllDayPanel,
        isGroupedAllDayPanel = _ref3.isGroupedAllDayPanel;

    var _this$viewDataProvide = this.viewDataProvider.getLastGroupCellPosition(groupIndex),
        rowIndex = _this$viewDataProvide.rowIndex;

    var dateTableCellsMeta = this.DOMMetaData.dateTableCellsMeta;
    var lastGroupRow = dateTableCellsMeta[rowIndex];
    if (!lastGroupRow) return 0;
    var result = lastGroupRow[0].top + lastGroupRow[0].height; // TODO remove while refactoring dual calculcations.
    // Should decrease allDayPanel amount due to the dual calculation corrections.

    if (isGroupedAllDayPanel) {
      result -= (groupIndex + 1) * this._getAllDayHeight(showAllDayPanel);
    }

    return result;
  };

  _createClass(GroupStrategyBase, [{
    key: "viewDataProvider",
    get: function get() {
      return this.options.viewDataProvider;
    }
  }, {
    key: "isGroupedByDate",
    get: function get() {
      return this.options.isGroupedByDate;
    }
  }, {
    key: "rtlEnabled",
    get: function get() {
      return this.options.rtlEnabled;
    }
  }, {
    key: "groupCount",
    get: function get() {
      return this.options.groupCount;
    }
  }, {
    key: "DOMMetaData",
    get: function get() {
      return this.options.getDOMMetaDataCallback();
    }
  }]);

  return GroupStrategyBase;
}();

var GroupStrategyHorizontal = /*#__PURE__*/function (_GroupStrategyBase) {
  _inheritsLoose(GroupStrategyHorizontal, _GroupStrategyBase);

  function GroupStrategyHorizontal() {
    return _GroupStrategyBase.apply(this, arguments) || this;
  }

  var _proto3 = GroupStrategyHorizontal.prototype;

  _proto3.getOffsetByAllDayPanel = function getOffsetByAllDayPanel(options) {
    return 0;
  };

  _proto3.getVerticalMax = function getVerticalMax(options) {
    var isVirtualScrolling = options.isVirtualScrolling,
        groupIndex = options.groupIndex;
    var correctedGroupIndex = isVirtualScrolling ? groupIndex : 0;
    return this._getMaxAllowedVerticalPosition(_extends({}, options, {
      groupIndex: correctedGroupIndex
    }));
  };

  _proto3.getGroupTop = function getGroupTop(options) {
    return 0;
  };

  _proto3._getAllDayHeight = function _getAllDayHeight(showAllDayPanel) {
    return getAllDayHeight(showAllDayPanel, false, this.DOMMetaData);
  };

  return GroupStrategyHorizontal;
}(GroupStrategyBase);