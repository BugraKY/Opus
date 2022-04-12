"use strict";

exports.exportPivotGrid = exportPivotGrid;

var _type = require("../../core/utils/type");

var _export = require("./export");

var _common = require("../../core/utils/common");

var helpers = {
  _getWorksheetFrozenState: function _getWorksheetFrozenState(dataProvider, cellRange) {
    return {
      state: 'frozen',
      xSplit: cellRange.from.column + dataProvider.getFrozenArea().x - 1,
      ySplit: cellRange.from.row + dataProvider.getFrozenArea().y - 1
    };
  },
  _getCustomizeCellOptions: function _getCustomizeCellOptions(excelCell, pivotCell) {
    return {
      excelCell: excelCell,
      pivotCell: pivotCell
    };
  },
  _isFrozenZone: function _isFrozenZone() {
    return true;
  },
  _isHeaderCell: function _isHeaderCell(dataProvider, rowIndex, cellIndex) {
    return rowIndex < dataProvider.getColumnAreaRowCount() || cellIndex < dataProvider.getRowAreaColCount();
  },
  _allowToMergeRange: function _allowToMergeRange(dataProvider, rowIndex, cellIndex, rowspan, colspan, mergeRowFieldValues, mergeColumnFieldValues) {
    return !(dataProvider.isColumnAreaCell(rowIndex, cellIndex) && !mergeColumnFieldValues && !!colspan || dataProvider.isRowAreaCell(rowIndex, cellIndex) && !mergeRowFieldValues && !!rowspan);
  },
  _getLoadPanelTargetElement: function _getLoadPanelTargetElement(component) {
    return component._dataArea.groupElement();
  },
  _getLoadPanelContainer: function _getLoadPanelContainer(component) {
    return component.$element();
  },
  _trySetAutoFilter: _common.noop,
  _trySetFont: _common.noop,
  _trySetOutlineLevel: _common.noop
};

function exportPivotGrid(options) {
  return _export.Export.export(_getFullOptions(options), helpers);
}

function _getFullOptions(options) {
  if (!((0, _type.isDefined)(options) && (0, _type.isObject)(options))) {
    throw Error('The "exportPivotGrid" method requires a configuration object.');
  }

  if (!((0, _type.isDefined)(options.component) && (0, _type.isObject)(options.component) && options.component.NAME === 'dxPivotGrid')) {
    throw Error('The "component" field must contain a PivotGrid instance.');
  }

  if (!(0, _type.isDefined)(options.mergeRowFieldValues)) {
    options.mergeRowFieldValues = true;
  }

  if (!(0, _type.isDefined)(options.mergeColumnFieldValues)) {
    options.mergeColumnFieldValues = true;
  }

  return _export.Export.getFullOptions(options);
} //#DEBUG


exportPivotGrid.__internals = {
  _getFullOptions: _getFullOptions
}; //#ENDDEBUG