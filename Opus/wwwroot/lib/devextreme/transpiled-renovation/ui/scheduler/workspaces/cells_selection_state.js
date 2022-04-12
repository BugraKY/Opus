"use strict";

exports.default = void 0;

var _date = _interopRequireDefault(require("../../../core/utils/date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var CellsSelectionState = /*#__PURE__*/function () {
  function CellsSelectionState(viewDataProvider) {
    this._viewDataProvider = viewDataProvider;
    this._focusedCell = null;
    this._selectedCells = null;
    this._firstSelectedCell = null;
    this._prevFocusedCell = null;
    this._prevSelectedCells = null;
  }

  var _proto = CellsSelectionState.prototype;

  _proto.setFocusedCell = function setFocusedCell(rowIndex, columnIndex, isAllDay) {
    if (rowIndex >= 0) {
      var cell = this._viewDataProvider.getCellData(rowIndex, columnIndex, isAllDay);

      this._focusedCell = cell;
    }
  };

  _proto.setSelectedCells = function setSelectedCells(lastCellCoordinates) {
    var _this = this;

    var firstCellCoordinates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var viewDataProvider = this._viewDataProvider;
    var lastRowIndex = lastCellCoordinates.rowIndex,
        lastColumnIndex = lastCellCoordinates.columnIndex,
        isLastCellAllDay = lastCellCoordinates.allDay;

    if (lastRowIndex < 0) {
      return;
    }

    var firstCell = firstCellCoordinates ? viewDataProvider.getCellData(firstCellCoordinates.rowIndex, firstCellCoordinates.columnIndex, firstCellCoordinates.allDay) : this._firstSelectedCell;
    var lastCell = viewDataProvider.getCellData(lastRowIndex, lastColumnIndex, isLastCellAllDay);
    this._firstSelectedCell = firstCell;

    if (firstCell.startDate.getTime() > lastCell.startDate.getTime()) {
      var _ref = [lastCell, firstCell];
      firstCell = _ref[0];
      lastCell = _ref[1];
    }

    var _firstCell = firstCell,
        firstStartDate = _firstCell.startDate,
        firstGroupIndex = _firstCell.groupIndex,
        firstCellIndex = _firstCell.index;
    var _lastCell = lastCell,
        lastStartDate = _lastCell.startDate,
        lastCellIndex = _lastCell.index;
    var cells = viewDataProvider.getCellsByGroupIndexAndAllDay(firstGroupIndex, isLastCellAllDay);
    var filteredCells = cells.reduce(function (selectedCells, cellsRow) {
      var filterData = {
        firstDate: firstStartDate,
        lastDate: lastStartDate,
        firstIndex: firstCellIndex,
        lastIndex: lastCellIndex
      };

      var filteredRow = _this._filterCellsByDateAndIndex(cellsRow, filterData);

      selectedCells.push.apply(selectedCells, _toConsumableArray(filteredRow));
      return selectedCells;
    }, []);
    this._selectedCells = filteredCells.sort(function (firstCell, secondCell) {
      return firstCell.startDate.getTime() - secondCell.startDate.getTime();
    });
  };

  _proto.setSelectedCellsByData = function setSelectedCellsByData(selectedCellsData) {
    this._selectedCells = selectedCellsData;
  };

  _proto.getSelectedCells = function getSelectedCells() {
    return this._selectedCells;
  };

  _proto.releaseSelectedAndFocusedCells = function releaseSelectedAndFocusedCells() {
    this.releaseSelectedCells();
    this.releaseFocusedCell();
  };

  _proto.releaseSelectedCells = function releaseSelectedCells() {
    this._prevSelectedCells = this._selectedCells;
    this._prevFirstSelectedCell = this._firstSelectedCell;
    this._selectedCells = null;
    this._firstSelectedCell = null;
  };

  _proto.releaseFocusedCell = function releaseFocusedCell() {
    this._prevFocusedCell = this._focusedCell;
    this._focusedCell = null;
  };

  _proto.restoreSelectedAndFocusedCells = function restoreSelectedAndFocusedCells() {
    this._selectedCells = this._selectedCells || this._prevSelectedCells;
    this._focusedCell = this._focusedCell || this._prevFocusedCell;
    this._firstSelectedCell = this._firstSelectedCell || this._prevFirstSelectedCell;
    this._prevSelectedCells = null;
    this._prevFirstSelectedCell = null;
    this._prevFocusedCell = null;
  };

  _proto.clearSelectedAndFocusedCells = function clearSelectedAndFocusedCells() {
    this._prevSelectedCells = null;
    this._selectedCells = null;
    this._prevFocusedCell = null;
    this._focusedCell = null;
  };

  _proto._filterCellsByDateAndIndex = function _filterCellsByDateAndIndex(cellsRow, filterData) {
    var _this2 = this;

    var firstDate = filterData.firstDate,
        lastDate = filterData.lastDate,
        firstIndex = filterData.firstIndex,
        lastIndex = filterData.lastIndex;

    var firstDay = _date.default.trimTime(firstDate).getTime();

    var lastDay = _date.default.trimTime(lastDate).getTime();

    return cellsRow.filter(function (cell) {
      var startDate = cell.startDate,
          index = cell.index;

      var day = _date.default.trimTime(startDate).getTime();

      var daysAndIndexes = {
        day: day,
        index: index,
        firstDay: firstDay,
        firstIndex: firstIndex,
        lastDay: lastDay,
        lastIndex: lastIndex
      };
      return _this2._compareCellsByDateAndIndex(daysAndIndexes);
    });
  };

  _proto._compareCellsByDateAndIndex = function _compareCellsByDateAndIndex(daysAndIndexes) {
    var day = daysAndIndexes.day,
        index = daysAndIndexes.index,
        firstDay = daysAndIndexes.firstDay,
        firstIndex = daysAndIndexes.firstIndex,
        lastDay = daysAndIndexes.lastDay,
        lastIndex = daysAndIndexes.lastIndex;

    if (firstDay === lastDay) {
      var validFirstIndex = firstIndex;
      var validLastIndex = lastIndex;

      if (validFirstIndex > validLastIndex) {
        var _ref2 = [validLastIndex, validFirstIndex];
        validFirstIndex = _ref2[0];
        validLastIndex = _ref2[1];
      }

      return firstDay === day && index >= validFirstIndex && index <= validLastIndex;
    } else {
      return day === firstDay && index >= firstIndex || day === lastDay && index <= lastIndex || firstDay < day && day < lastDay;
    }
  };

  _createClass(CellsSelectionState, [{
    key: "viewDataProvider",
    get: function get() {
      return this._viewDataProvider;
    }
  }, {
    key: "focusedCell",
    get: function get() {
      var focusedCell = this._focusedCell;

      if (!focusedCell) {
        return undefined;
      }

      var groupIndex = focusedCell.groupIndex,
          startDate = focusedCell.startDate,
          allDay = focusedCell.allDay;
      var cellInfo = {
        groupIndex: groupIndex,
        startDate: startDate,
        isAllDay: allDay,
        index: focusedCell.index
      };
      var cellPosition = this.viewDataProvider.findCellPositionInMap(cellInfo);
      return {
        coordinates: cellPosition,
        cellData: focusedCell
      };
    }
  }]);

  return CellsSelectionState;
}();

exports.default = CellsSelectionState;
module.exports = exports.default;
module.exports.default = exports.default;