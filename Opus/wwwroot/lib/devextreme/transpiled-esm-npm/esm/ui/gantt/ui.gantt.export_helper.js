import { getWindow } from '../../core/utils/window';
import gridCoreUtils from '../grid_core/ui.grid_core.utils';
import { isDate, isDefined, isNumeric } from '../../core/utils/type';
import dateLocalization from '../../localization/date';
import numberLocalization from '../../localization/number';
var window = getWindow();
var TREELIST_EMPTY_SPACE = 'dx-treelist-empty-space';
var TREELIST_TABLE = 'dx-treelist-table';
export class GanttExportHelper {
  constructor(gantt) {
    this._gantt = gantt;
    this._treeList = gantt._treeList;
    this._cache = {};
  }

  reset() {
    this._cache = {};
  }

  getTreeListTableStyle() {
    var table = this._getTreeListTable();

    var style = window.getComputedStyle(table);
    return {
      color: style.color,
      backgroundColor: style.backgroundColor,
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      textAlign: 'left',
      verticalAlign: 'middle'
    };
  }

  getTreeListColCount() {
    var headerView = this._getHeaderView();

    var widths = headerView.getColumnWidths().filter(w => w > 0);
    return widths.length;
  }

  getTreeListHeaderInfo(colIndex) {
    var element = this._getHeaderElement(colIndex);

    if (!element) return null;
    var style = window.getComputedStyle(element);
    var styleForExport = {
      color: style.color,
      padding: style.padding,
      paddingLeft: style.paddingLeft,
      paddingTop: style.paddingTop,
      paddingRight: style.paddingRight,
      paddingBottom: style.paddingBottom,
      verticalAlign: style.verticalAlign,
      width: this._getColumnWidth(colIndex)
    };
    return {
      content: element.textContent,
      styles: styleForExport
    };
  }

  getTreeListCellInfo(key, colIndex) {
    var _cell$textContent;

    var node = this._treeList.getNodeByKey(key);

    var visibleRowIndex = this._treeList.getRowIndexByKey(key);

    var cell = visibleRowIndex > -1 ? this._getDataCell(visibleRowIndex, colIndex) : null;
    var style = cell ? window.getComputedStyle(cell) : this._getColumnCellStyle(colIndex);
    var styleForExport = {
      color: style.color,
      padding: style.padding,
      paddingLeft: style.paddingLeft,
      paddingTop: style.paddingTop,
      paddingRight: style.paddingRight,
      paddingBottom: style.paddingBottom,
      width: this._getColumnWidth(colIndex)
    };

    if (colIndex === 0) {
      styleForExport.extraLeftPadding = this._getEmptySpaceWidth(node.level);
    }

    return {
      content: (_cell$textContent = cell === null || cell === void 0 ? void 0 : cell.textContent) !== null && _cell$textContent !== void 0 ? _cell$textContent : this._getDisplayText(key, colIndex),
      styles: styleForExport
    };
  }

  _ensureColumnWidthCache(colIndex) {
    var _this$_cache, _columnWidths, _this$_cache$_columnW;

    (_this$_cache$_columnW = (_this$_cache = this._cache)[_columnWidths = 'columnWidths']) !== null && _this$_cache$_columnW !== void 0 ? _this$_cache$_columnW : _this$_cache[_columnWidths] = {};

    if (!this._cache['columnWidths'][colIndex]) {
      var _header$clientWidth;

      var header = this._getHeaderElement(colIndex);

      this._cache['columnWidths'][colIndex] = (_header$clientWidth = header === null || header === void 0 ? void 0 : header.clientWidth) !== null && _header$clientWidth !== void 0 ? _header$clientWidth : 0;
    }
  }

  _getColumnWidth(colIndex) {
    this._ensureColumnWidthCache(colIndex);

    var widths = this._cache['columnWidths'];
    return widths && widths[colIndex];
  }

  _getEmptySpaceWidth(level) {
    if (!this._cache['emptyWidth']) {
      var _this$_cache2, _emptyWidth, _this$_cache2$_emptyW, _element$offsetWidth;

      var element = this._getTreeListElement(TREELIST_EMPTY_SPACE);

      (_this$_cache2$_emptyW = (_this$_cache2 = this._cache)[_emptyWidth = 'emptyWidth']) !== null && _this$_cache2$_emptyW !== void 0 ? _this$_cache2$_emptyW : _this$_cache2[_emptyWidth] = (_element$offsetWidth = element.offsetWidth) !== null && _element$offsetWidth !== void 0 ? _element$offsetWidth : 0;
    }

    return this._cache['emptyWidth'] * (level + 1);
  }

  _getColumnCellStyle(colIndex) {
    this._ensureColumnCellStyleCache(colIndex);

    return this._cache['columnStyles'][colIndex];
  }

  _ensureColumnCellStyleCache(colIndex) {
    var _this$_cache3, _columnStyles, _this$_cache3$_column;

    (_this$_cache3$_column = (_this$_cache3 = this._cache)[_columnStyles = 'columnStyles']) !== null && _this$_cache3$_column !== void 0 ? _this$_cache3$_column : _this$_cache3[_columnStyles] = {};

    if (!this._cache['columnStyles'][colIndex]) {
      var cell = this._getDataCell(0, colIndex);

      this._cache['columnStyles'][colIndex] = window.getComputedStyle(cell);
    }
  }

  _getTask(key) {
    this._ensureTaskCache(key);

    return this._cache['tasks'][key];
  }

  _ensureTaskCache(key) {
    var _this$_cache4, _tasks, _this$_cache4$_tasks, _this$_cache$tasks, _this$_cache$tasks$ke;

    (_this$_cache4$_tasks = (_this$_cache4 = this._cache)[_tasks = 'tasks']) !== null && _this$_cache4$_tasks !== void 0 ? _this$_cache4$_tasks : _this$_cache4[_tasks] = {};
    (_this$_cache$tasks$ke = (_this$_cache$tasks = this._cache['tasks'])[key]) !== null && _this$_cache$tasks$ke !== void 0 ? _this$_cache$tasks$ke : _this$_cache$tasks[key] = this._gantt._findTaskByKey(key);
  }

  _getTreeListTable() {
    return this._getTreeListElement(TREELIST_TABLE);
  }

  _getTreeListElement(className) {
    return this._treeList._$element.find('.' + className).get(0);
  }

  _getDataCell(rowIndex, colIndex) {
    var treeList = this._treeList;
    var cellElement = treeList.getCellElement(rowIndex, colIndex);
    return cellElement && cellElement.length ? cellElement[0] : cellElement;
  }

  _getHeaderElement(index) {
    return this._getHeaderView().getHeaderElement(index).get(0);
  }

  _getHeaderView() {
    return this._treeList._views.columnHeadersView;
  }

  _getDisplayText(key, colIndex) {
    var task = this._getTask(key);

    return task && this._getGridDisplayText(colIndex, task);
  }

  _getGridDisplayText(colIndex, data) {
    var columns = this._treeList.getController('columns').getColumns();

    var column = columns[colIndex];
    var field = column === null || column === void 0 ? void 0 : column.dataField;
    var format = column === null || column === void 0 ? void 0 : column.format;
    var value = gridCoreUtils.getDisplayValue(column, data[field], data, 'data');

    if (isDefined(format)) {
      if (isDate(value)) {
        return dateLocalization.format(value, format);
      }

      if (isNumeric(value)) {
        return numberLocalization.format(value, format);
      }
    }

    return typeof value === 'string' ? value : value === null || value === void 0 ? void 0 : value.toString();
  }

}