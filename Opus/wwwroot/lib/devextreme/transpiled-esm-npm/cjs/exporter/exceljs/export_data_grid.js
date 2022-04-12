"use strict";

exports.exportDataGrid = exportDataGrid;

var _type = require("../../core/utils/type");

var _export = require("./export");

var _errors = _interopRequireDefault(require("../../core/errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpers = {
  _trySetAutoFilter: function _trySetAutoFilter(dataProvider, worksheet, cellRange, autoFilterEnabled) {
    if (autoFilterEnabled) {
      if (!(0, _type.isDefined)(worksheet.autoFilter) && dataProvider.getRowsCount() > 0) {
        var dataRange = {
          from: {
            row: cellRange.from.row + dataProvider.getHeaderRowCount() - 1,
            column: cellRange.from.column
          },
          to: cellRange.to
        };
        worksheet.autoFilter = dataRange;
      }
    }
  },
  _trySetFont: function _trySetFont(excelCell, bold) {
    if ((0, _type.isDefined)(bold)) {
      excelCell.font = excelCell.font || {};
      excelCell.font.bold = bold;
    }
  },
  _getWorksheetFrozenState: function _getWorksheetFrozenState(dataProvider, cellRange) {
    return {
      state: 'frozen',
      ySplit: cellRange.from.row + dataProvider.getFrozenArea().y - 1
    };
  },
  _trySetOutlineLevel: function _trySetOutlineLevel(dataProvider, row, rowIndex) {
    if (rowIndex >= dataProvider.getHeaderRowCount()) {
      row.outlineLevel = dataProvider.getGroupLevel(rowIndex);
    }
  },
  _getCustomizeCellOptions: function _getCustomizeCellOptions(excelCell, gridCell) {
    var options = {
      excelCell: excelCell,
      gridCell: gridCell
    };
    Object.defineProperty(options, 'cell', {
      get: function get() {
        _errors.default.log('W0003', 'CustomizeCell handler argument', 'cell', '20.1', 'Use the \'excelCell\' field instead');

        return excelCell;
      }
    });
    return options;
  },
  _isFrozenZone: function _isFrozenZone(dataProvider) {
    return dataProvider.getHeaderRowCount() > 0;
  },
  _isHeaderCell: function _isHeaderCell(dataProvider, rowIndex) {
    return rowIndex < dataProvider.getHeaderRowCount();
  },
  _allowToMergeRange: function _allowToMergeRange() {
    return true;
  },
  _getLoadPanelTargetElement: function _getLoadPanelTargetElement(component) {
    return component.getView('rowsView').element();
  },
  _getLoadPanelContainer: function _getLoadPanelContainer(component) {
    return component.getView('rowsView').element().parent();
  }
};

function exportDataGrid(options) {
  return _export.Export.export(_getFullOptions(options), helpers);
}

function _getFullOptions(options) {
  if (!((0, _type.isDefined)(options) && (0, _type.isObject)(options))) {
    throw Error('The "exportDataGrid" method requires a configuration object.');
  }

  if (!((0, _type.isDefined)(options.component) && (0, _type.isObject)(options.component) && options.component.NAME === 'dxDataGrid')) {
    throw Error('The "component" field must contain a DataGrid instance.');
  }

  if (!(0, _type.isDefined)(options.selectedRowsOnly)) {
    options.selectedRowsOnly = false;
  }

  if (!(0, _type.isDefined)(options.autoFilterEnabled)) {
    options.autoFilterEnabled = false;
  }

  return _export.Export.getFullOptions(options);
}