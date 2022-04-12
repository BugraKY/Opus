"use strict";

exports.ExportController = exports.DataProvider = void 0;

var _class = _interopRequireDefault(require("../../core/class"));

var _type = require("../../core/utils/type");

var _extend = require("../../core/utils/extend");

var _iterator = require("../../core/utils/iterator");

var _window = require("../../core/utils/window");

var _position = require("../../core/utils/position");

var _format_helper = _interopRequireDefault(require("../../format_helper"));

var _number = _interopRequireDefault(require("../../localization/number"));

var _exporter = require("../../exporter");

var _uiGrid_core = _interopRequireDefault(require("../grid_core/ui.grid_core.export_mixin"));

var _deferred = require("../../core/utils/deferred");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DEFAULT_DATA_TYPE = 'string';
var DEFAUL_COLUMN_WIDTH = 100;
var ExportController = (0, _extend.extend)({}, _uiGrid_core.default, {
  exportToExcel: function exportToExcel() {
    var that = this;
    (0, _exporter.export)(that.getDataProvider(), {
      fileName: that.option('export.fileName'),
      proxyUrl: that.option('export.proxyUrl'),
      format: 'EXCEL',
      rtlEnabled: that.option('rtlEnabled'),
      ignoreErrors: that.option('export.ignoreExcelErrors'),
      exportingAction: that._actions.onExporting,
      exportedAction: that._actions.onExported,
      fileSavingAction: that._actions.onFileSaving
    }, _exporter.excel.getData);
  },
  _getLength: function _getLength(items) {
    var i;
    var itemCount = items[0].length;
    var cellCount = 0;

    for (i = 0; i < itemCount; i++) {
      cellCount += items[0][i].colspan || 1;
    }

    return cellCount;
  },
  _correctCellsInfoItemLengths: function _correctCellsInfoItemLengths(cellsInfo, expectedLength) {
    for (var i = 0; i < cellsInfo.length; i++) {
      while (cellsInfo[i].length < expectedLength) {
        cellsInfo[i].push({});
      }
    }

    return cellsInfo;
  },
  _calculateCellInfoItemLength: function _calculateCellInfoItemLength(columnsRow) {
    var result = 0;

    for (var columnIndex = 0; columnIndex < columnsRow.length; columnIndex++) {
      result += (0, _type.isDefined)(columnsRow[columnIndex].colspan) ? columnsRow[columnIndex].colspan : 1;
    }

    return result;
  },
  _getAllItems: function _getAllItems(columnsInfo, rowsInfoItems, cellsInfo) {
    var cellIndex;
    var rowIndex;
    var correctedCellsInfo = cellsInfo;

    var rowsLength = this._getLength(rowsInfoItems);

    var headerRowsCount = columnsInfo.length;

    if (columnsInfo.length > 0 && columnsInfo[0].length > 0 && cellsInfo.length > 0 && cellsInfo[0].length === 0) {
      var cellInfoItemLength = this._calculateCellInfoItemLength(columnsInfo[0]);

      if (cellInfoItemLength > 0) {
        correctedCellsInfo = this._correctCellsInfoItemLengths(cellsInfo, cellInfoItemLength);
      }
    }

    var sourceItems = columnsInfo.concat(correctedCellsInfo);

    for (rowIndex = 0; rowIndex < rowsInfoItems.length; rowIndex++) {
      for (cellIndex = rowsInfoItems[rowIndex].length - 1; cellIndex >= 0; cellIndex--) {
        if (!(0, _type.isDefined)(sourceItems[rowIndex + headerRowsCount])) {
          sourceItems[rowIndex + headerRowsCount] = [];
        }

        sourceItems[rowIndex + headerRowsCount].splice(0, 0, (0, _extend.extend)({}, rowsInfoItems[rowIndex][cellIndex]));
      }
    }

    sourceItems[0].splice(0, 0, (0, _extend.extend)({}, this._getEmptyCell(), {
      alignment: (0, _position.getDefaultAlignment)(this._options.rtlEnabled),
      colspan: rowsLength,
      rowspan: headerRowsCount
    }));
    return this._prepareItems(sourceItems);
  },
  getDataProvider: function getDataProvider() {
    return new DataProvider(this);
  }
});
exports.ExportController = ExportController;

var DataProvider = _class.default.inherit({
  ctor: function ctor(exportController) {
    this._exportController = exportController;
  },
  ready: function ready() {
    this._initOptions();

    var options = this._options;
    return (0, _deferred.when)(options.items).done(function (items) {
      var headerSize = items[0][0].rowspan;
      var columns = items[headerSize - 1];
      (0, _iterator.each)(columns, function (columnIndex, column) {
        column.width = DEFAUL_COLUMN_WIDTH;
      });
      options.columns = columns;
      options.items = items;
    });
  },
  _initOptions: function _initOptions() {
    var exportController = this._exportController;
    var dataController = exportController._dataController;
    var items = new _deferred.Deferred();
    dataController.beginLoading();
    setTimeout(function () {
      var columnsInfo = (0, _extend.extend)(true, [], dataController.getColumnsInfo(true));
      var rowsInfoItems = (0, _extend.extend)(true, [], dataController.getRowsInfo(true));
      var cellsInfo = dataController.getCellsInfo(true);
      items.resolve(exportController._getAllItems(columnsInfo, rowsInfoItems, cellsInfo));
      dataController.endLoading();
    });
    this._options = {
      items: items,
      rtlEnabled: exportController.option('rtlEnabled'),
      dataFields: exportController.getDataSource().getAreaFields('data'),
      customizeExcelCell: exportController.option('export.customizeExcelCell'),
      rowsArea: exportController._rowsArea,
      columnsArea: exportController._columnsArea
    };
  },
  getColumns: function getColumns() {
    return this._options.columns;
  },
  getColumnsWidths: function getColumnsWidths() {
    var colsArea = this._options.columnsArea;
    var rowsArea = this._options.rowsArea;
    var columns = this._options.columns;
    var useDefaultWidth = !(0, _window.hasWindow)() || colsArea.option('scrolling.mode') === 'virtual' || colsArea.element().is(':hidden');
    return useDefaultWidth ? columns.map(function (_) {
      return DEFAUL_COLUMN_WIDTH;
    }) : rowsArea.getColumnsWidth().concat(colsArea.getColumnsWidth());
  },
  getRowsCount: function getRowsCount() {
    return this._options.items.length;
  },
  getGroupLevel: function getGroupLevel() {
    return 0;
  },
  getCellMerging: function getCellMerging(rowIndex, cellIndex) {
    var items = this._options.items;
    var item = items[rowIndex] && items[rowIndex][cellIndex];
    return item ? {
      colspan: item.colspan - 1,
      rowspan: item.rowspan - 1
    } : {
      colspan: 0,
      rowspan: 0
    };
  },
  getFrozenArea: function getFrozenArea() {
    return {
      x: this.getRowAreaColCount(),
      y: this.getColumnAreaRowCount()
    };
  },
  getCellType: function getCellType(rowIndex, cellIndex) {
    var style = this.getStyles()[this.getStyleId(rowIndex, cellIndex)];
    return style && style.dataType || 'string';
  },
  getCellData: function getCellData(rowIndex, cellIndex, isExcelJS) {
    var result = {};
    var items = this._options.items;
    var item = items[rowIndex] && items[rowIndex][cellIndex] || {};

    if (isExcelJS) {
      result.cellSourceData = item;

      var areaName = this._tryGetAreaName(item, rowIndex, cellIndex);

      if (areaName) {
        result.cellSourceData.area = areaName;
      }

      result.cellSourceData.rowIndex = rowIndex;
      result.cellSourceData.columnIndex = cellIndex;
    }

    if (this.getCellType(rowIndex, cellIndex) === 'string') {
      result.value = item.text;
    } else {
      result.value = item.value;
    }

    if (result.cellSourceData && result.cellSourceData.isWhiteSpace) {
      result.value = '';
    }

    return result;
  },
  _tryGetAreaName: function _tryGetAreaName(item, rowIndex, cellIndex) {
    if (this.isColumnAreaCell(rowIndex, cellIndex)) {
      return 'column';
    } else if (this.isRowAreaCell(rowIndex, cellIndex)) {
      return 'row';
    } else if ((0, _type.isDefined)(item.dataIndex)) {
      return 'data';
    }
  },
  isRowAreaCell: function isRowAreaCell(rowIndex, cellIndex) {
    return rowIndex >= this.getColumnAreaRowCount() && cellIndex < this.getRowAreaColCount();
  },
  isColumnAreaCell: function isColumnAreaCell(rowIndex, cellIndex) {
    return cellIndex >= this.getRowAreaColCount() && rowIndex < this.getColumnAreaRowCount();
  },
  getColumnAreaRowCount: function getColumnAreaRowCount() {
    return this._options.items[0][0].rowspan;
  },
  getRowAreaColCount: function getRowAreaColCount() {
    return this._options.items[0][0].colspan;
  },
  getHeaderStyles: function getHeaderStyles() {
    return [{
      alignment: 'center',
      dataType: 'string'
    }, {
      alignment: (0, _position.getDefaultAlignment)(this._options.rtlEnabled),
      dataType: 'string'
    }];
  },
  getDataFieldStyles: function getDataFieldStyles() {
    var _this = this;

    var dataFields = this._options.dataFields;
    var dataItemStyle = {
      alignment: this._options.rtlEnabled ? 'left' : 'right'
    };
    var dataFieldStyles = [];

    if (dataFields.length) {
      dataFields.forEach(function (dataField) {
        dataFieldStyles.push(_extends({}, dataItemStyle, {
          format: dataField.format,
          dataType: _this.getCellDataType(dataField)
        }));
      });
      return dataFieldStyles;
    }

    return [dataItemStyle];
  },
  getStyles: function getStyles() {
    if (this._styles) {
      return this._styles;
    }

    this._styles = [].concat(_toConsumableArray(this.getHeaderStyles()), _toConsumableArray(this.getDataFieldStyles()));
    return this._styles;
  },
  getCellDataType: function getCellDataType(field) {
    if (field && field.customizeText) {
      return 'string';
    }

    if (field.dataType) {
      return field.dataType;
    }

    if (field.format) {
      if (_number.default.parse(_format_helper.default.format(1, field.format)) === 1) {
        return 'number';
      }

      if (_format_helper.default.format(new Date(), field.format)) {
        return 'date';
      }
    }

    return DEFAULT_DATA_TYPE;
  },
  getStyleId: function getStyleId(rowIndex, cellIndex) {
    var items = this._options.items;
    var item = items[rowIndex] && items[rowIndex][cellIndex] || {};

    if (cellIndex === 0 && rowIndex === 0 || this.isColumnAreaCell(rowIndex, cellIndex)) {
      return 0;
    } else if (this.isRowAreaCell(rowIndex, cellIndex)) {
      return 1;
    }

    return this.getHeaderStyles().length + (item.dataIndex || 0);
  },
  hasCustomizeExcelCell: function hasCustomizeExcelCell() {
    return (0, _type.isDefined)(this._options.customizeExcelCell);
  },
  customizeExcelCell: function customizeExcelCell(e) {
    if (this._options.customizeExcelCell) {
      this._options.customizeExcelCell(e);
    }
  }
});

exports.DataProvider = DataProvider;