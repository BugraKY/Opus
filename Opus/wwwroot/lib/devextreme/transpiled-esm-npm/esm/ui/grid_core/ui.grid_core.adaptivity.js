import { getWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { addNamespace } from '../../events/utils/index';
import { name as clickEventName } from '../../events/click';
import { isDefined, isString } from '../../core/utils/type';
import Guid from '../../core/guid';
import modules from './ui.grid_core.modules';
import Form from '../form';
import gridCoreUtils from './ui.grid_core.utils';
import { isMaterial } from '../themes';
import { getWindow } from '../../core/utils/window';
import { equalByValue } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { Deferred, when } from '../../core/utils/deferred';
import messageLocalization from '../../localization/message';
var COLUMN_HEADERS_VIEW = 'columnHeadersView';
var ROWS_VIEW = 'rowsView';
var FOOTER_VIEW = 'footerView';
var COLUMN_VIEWS = [COLUMN_HEADERS_VIEW, ROWS_VIEW, FOOTER_VIEW];
var ADAPTIVE_NAMESPACE = 'dxDataGridAdaptivity';
var HIDDEN_COLUMNS_WIDTH = 'adaptiveHidden';
var ADAPTIVE_ROW_TYPE = 'detailAdaptive';
var FORM_ITEM_CONTENT_CLASS = 'dx-field-item-content';
var FORM_ITEM_MODIFIED = 'dx-item-modified';
var HIDDEN_COLUMN_CLASS = 'hidden-column';
var ADAPTIVE_COLUMN_BUTTON_CLASS = 'adaptive-more';
var ADAPTIVE_COLUMN_NAME_CLASS = 'dx-command-adaptive';
var COMMAND_ADAPTIVE_HIDDEN_CLASS = 'dx-command-adaptive-hidden';
var ADAPTIVE_DETAIL_ROW_CLASS = 'dx-adaptive-detail-row';
var ADAPTIVE_ITEM_TEXT_CLASS = 'dx-adaptive-item-text';
var MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
var LAST_DATA_CELL_CLASS = 'dx-last-data-cell';
var ADAPTIVE_COLUMN_NAME = 'adaptive';
var EDIT_MODE_BATCH = 'batch';
var EDIT_MODE_ROW = 'row';
var EDIT_MODE_FORM = 'form';
var EDIT_MODE_POPUP = 'popup';
var REVERT_TOOLTIP_CLASS = 'revert-tooltip';
var GROUP_CELL_CLASS = 'dx-group-cell';
var GROUP_ROW_CLASS = 'dx-group-row';
var EXPAND_ARIA_NAME = 'dxDataGrid-ariaAdaptiveExpand';
var COLLAPSE_ARIA_NAME = 'dxDataGrid-ariaAdaptiveCollapse';
var LEGACY_SCROLLING_MODE = 'scrolling.legacyMode';

function getColumnId(that, column) {
  return that._columnsController.getColumnId(column);
}

function getDataCellElements($row) {
  return $row.find('td:not(.dx-datagrid-hidden-column):not([class*=\'dx-command-\'])');
}

function adaptiveCellTemplate(container, options) {
  var $adaptiveColumnButton;
  var $container = $(container);
  var adaptiveColumnsController = options.component.getController('adaptiveColumns');

  if (options.rowType === 'data') {
    $adaptiveColumnButton = $('<span>').addClass(adaptiveColumnsController.addWidgetPrefix(ADAPTIVE_COLUMN_BUTTON_CLASS));
    eventsEngine.on($adaptiveColumnButton, addNamespace(clickEventName, ADAPTIVE_NAMESPACE), adaptiveColumnsController.createAction(function () {
      adaptiveColumnsController.toggleExpandAdaptiveDetailRow(options.key);
    }));
    $adaptiveColumnButton.appendTo($container);
  } else {
    gridCoreUtils.setEmptyText($container);
  }
}

var AdaptiveColumnsController = modules.ViewController.inherit({
  _isRowEditMode: function _isRowEditMode() {
    var editMode = this._getEditMode();

    return editMode === EDIT_MODE_ROW;
  },
  _isItemModified: function _isItemModified(item, cellOptions) {
    var columnIndex = this._columnsController.getVisibleIndex(item.column.index);

    var rowIndex = this._dataController.getRowIndexByKey(cellOptions.key);

    var row = this._dataController.items()[rowIndex + 1];

    return row && row.modifiedValues && isDefined(row.modifiedValues[columnIndex]);
  },
  _renderFormViewTemplate: function _renderFormViewTemplate(item, cellOptions, $container) {
    var that = this;
    var column = item.column;
    var focusAction = that.createAction(function () {
      eventsEngine.trigger($container, clickEventName);
    });
    var value = column.calculateCellValue(cellOptions.data);
    var displayValue = gridCoreUtils.getDisplayValue(column, value, cellOptions.data, cellOptions.rowType);
    var text = gridCoreUtils.formatValue(displayValue, column);

    var isCellOrBatchEditMode = this._editingController.isCellOrBatchEditMode();

    var rowsView = that._rowsView;

    if (column.allowEditing && that.getController('keyboardNavigation').isKeyboardEnabled()) {
      $container.attr('tabIndex', that.option('tabIndex'));

      if (isCellOrBatchEditMode) {
        eventsEngine.off($container, 'focus', focusAction);
        eventsEngine.on($container, 'focus', focusAction);
      }
    }

    if (column.cellTemplate) {
      var templateOptions = extend({}, cellOptions, {
        value: value,
        displayValue: displayValue,
        text: text,
        column: column
      });
      var isDomElement = !!$container.closest(getWindow().document).length;
      rowsView.renderTemplate($container, column.cellTemplate, templateOptions, isDomElement).done(() => {
        rowsView._cellPrepared($container, cellOptions);
      });
    } else {
      var container = $container.get(0);

      if (column.encodeHtml) {
        container.textContent = text;
      } else {
        container.innerHTML = text;
      }

      $container.addClass(ADAPTIVE_ITEM_TEXT_CLASS);

      if (!isDefined(text) || text === '') {
        $container.html('&nbsp;');
      }

      if (!that._isRowEditMode()) {
        if (that._isItemModified(item, cellOptions)) {
          $container.addClass(FORM_ITEM_MODIFIED);
        }
      }

      rowsView._cellPrepared($container, cellOptions);
    }
  },
  _getTemplate: function _getTemplate(item, cellOptions) {
    var that = this;
    var column = item.column;
    var editingController = this.getController('editing');
    return function (options, container) {
      var $container = $(container);

      var columnIndex = that._columnsController.getVisibleIndex(column.index);

      var templateOptions = extend({}, cellOptions);

      var renderFormTemplate = function renderFormTemplate() {
        var isItemEdited = that._isItemEdited(item);

        templateOptions.value = cellOptions.row.values[columnIndex];

        if (isItemEdited || column.showEditorAlways) {
          editingController.renderFormEditTemplate(templateOptions, item, options, $container, !isItemEdited);
        } else {
          templateOptions.column = column;
          templateOptions.columnIndex = columnIndex;

          that._renderFormViewTemplate(item, templateOptions, $container);
        }
      };

      renderFormTemplate();
      templateOptions.watch && templateOptions.watch(function () {
        return {
          isItemEdited: that._isItemEdited(item),
          value: cellOptions.row.values[columnIndex]
        };
      }, function () {
        $container.contents().remove();
        $container.removeClass(ADAPTIVE_ITEM_TEXT_CLASS);
        renderFormTemplate();
      });
    };
  },
  _isVisibleColumnsValid: function _isVisibleColumnsValid(visibleColumns) {
    var getCommandColumnsCount = function getCommandColumnsCount() {
      var result = 0;

      for (var j = 0; j < visibleColumns.length; j++) {
        var visibleColumn = visibleColumns[j];

        if (visibleColumn.command) {
          result++;
        }
      }

      return result;
    };

    if (visibleColumns < 2) {
      return false;
    }

    if (visibleColumns.length - getCommandColumnsCount() <= 1) {
      return false;
    }

    return true;
  },
  _calculatePercentWidths: function _calculatePercentWidths(widths, visibleColumns) {
    var that = this;
    var percentWidths = 0;
    visibleColumns.forEach(function (item, index) {
      if (widths[index] !== HIDDEN_COLUMNS_WIDTH) {
        percentWidths += that._getItemPercentWidth(item);
      }
    });
    return percentWidths;
  },
  _isPercentWidth: function _isPercentWidth(width) {
    return isString(width) && width.slice(-1) === '%';
  },
  _isColumnHidden: function _isColumnHidden(column) {
    return this._hiddenColumns.filter(function (hiddenColumn) {
      return hiddenColumn.index === column.index;
    }).length > 0;
  },
  _getAverageColumnsWidth: function _getAverageColumnsWidth(containerWidth, columns, columnsCanFit) {
    var that = this;
    var fixedColumnsWidth = 0;
    var columnsWithoutFixedWidthCount = 0;
    columns.forEach(function (column) {
      if (!that._isColumnHidden(column)) {
        var width = column.width;

        if (isDefined(width) && !isNaN(parseFloat(width))) {
          fixedColumnsWidth += that._isPercentWidth(width) ? that._calculatePercentWidth({
            visibleIndex: column.visibleIndex,
            columnsCount: columns.length,
            columnsCanFit: columnsCanFit,
            bestFitWidth: column.bestFitWidth,
            columnWidth: width,
            containerWidth: containerWidth
          }) : parseFloat(width);
        } else {
          columnsWithoutFixedWidthCount++;
        }
      }
    });
    return (containerWidth - fixedColumnsWidth) / columnsWithoutFixedWidthCount;
  },
  _calculateColumnWidth: function _calculateColumnWidth(column, containerWidth, contentColumns, columnsCanFit) {
    var columnId = getColumnId(this, column);

    var widthOption = this._columnsController.columnOption(columnId, 'width');

    var bestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');

    var columnsCount = contentColumns.length;
    var colWidth;

    if (widthOption && widthOption !== 'auto') {
      if (this._isPercentWidth(widthOption)) {
        colWidth = this._calculatePercentWidth({
          visibleIndex: column.visibleIndex,
          columnsCount: columnsCount,
          columnsCanFit: columnsCanFit,
          bestFitWidth: bestFitWidth,
          columnWidth: widthOption,
          containerWidth: containerWidth
        });
      } else {
        return parseFloat(widthOption);
      }
    } else {
      var columnAutoWidth = this.option('columnAutoWidth');
      colWidth = columnAutoWidth || !!column.command ? bestFitWidth : this._getAverageColumnsWidth(containerWidth, contentColumns, columnsCanFit);
    }

    return colWidth;
  },
  _calculatePercentWidth: function _calculatePercentWidth(options) {
    var columnFitted = options.visibleIndex < options.columnsCount - 1 && options.columnsCanFit;
    var partialWidth = options.containerWidth * parseFloat(options.columnWidth) / 100;
    var resultWidth = options.columnsCanFit && partialWidth < options.bestFitWidth ? options.bestFitWidth : partialWidth;
    return columnFitted ? options.containerWidth * parseFloat(options.columnWidth) / 100 : resultWidth;
  },
  _getNotTruncatedColumnWidth: function _getNotTruncatedColumnWidth(column, containerWidth, contentColumns, columnsCanFit) {
    var columnId = getColumnId(this, column);

    var widthOption = this._columnsController.columnOption(columnId, 'width');

    var bestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');

    if (widthOption && widthOption !== 'auto' && !this._isPercentWidth(widthOption)) {
      return parseFloat(widthOption);
    }

    var colWidth = this._calculateColumnWidth(column, containerWidth, contentColumns, columnsCanFit);

    return colWidth < bestFitWidth ? null : colWidth;
  },
  _getItemPercentWidth: function _getItemPercentWidth(item) {
    var result = 0;

    if (item.width && this._isPercentWidth(item.width)) {
      result = parseFloat(item.width);
    }

    return result;
  },
  _getCommandColumnsWidth: function _getCommandColumnsWidth() {
    var that = this;

    var columns = that._columnsController.getVisibleColumns();

    var colWidth = 0;
    each(columns, function (index, column) {
      if (column.index < 0 || column.command) {
        colWidth += that._columnsController.columnOption(getColumnId(that, column), 'bestFitWidth') || 0;
      }
    });
    return colWidth;
  },
  _isItemEdited: function _isItemEdited(item) {
    if (this.isFormOrPopupEditMode()) {
      return false;
    }

    if (this._isRowEditMode()) {
      var editRowKey = this.option('editing.editRowKey');

      if (equalByValue(editRowKey, this._dataController.adaptiveExpandedKey())) {
        return true;
      }
    } else {
      var rowIndex = this._dataController.getRowIndexByKey(this._dataController.adaptiveExpandedKey()) + 1;

      var columnIndex = this._columnsController.getVisibleIndex(item.column.index);

      return this._editingController.isEditCell(rowIndex, columnIndex);
    }
  },
  _getFormItemsByHiddenColumns: function _getFormItemsByHiddenColumns(hiddenColumns) {
    var items = [];
    each(hiddenColumns, function (_, column) {
      items.push({
        column: column,
        name: column.name,
        dataField: column.dataField,
        visibleIndex: column.visibleIndex
      });
    });
    return items;
  },
  _getAdaptiveColumnVisibleIndex: function _getAdaptiveColumnVisibleIndex(visibleColumns) {
    for (var i = 0; i < visibleColumns.length; i++) {
      var column = visibleColumns[i];

      if (column.command === ADAPTIVE_COLUMN_NAME) {
        return i;
      }
    }
  },
  _hideAdaptiveColumn: function _hideAdaptiveColumn(resultWidths, visibleColumns) {
    var visibleIndex = this._getAdaptiveColumnVisibleIndex(visibleColumns);

    if (isDefined(visibleIndex)) {
      resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;

      this._hideVisibleColumn({
        isCommandColumn: true,
        visibleIndex
      });
    }
  },
  _showHiddenCellsInView: function _showHiddenCellsInView(_ref) {
    var {
      $cells,
      isCommandColumn
    } = _ref;
    var cssClassNameToRemove = isCommandColumn ? COMMAND_ADAPTIVE_HIDDEN_CLASS : this.addWidgetPrefix(HIDDEN_COLUMN_CLASS);
    $cells.removeClass(cssClassNameToRemove);
  },
  _showHiddenColumns: function _showHiddenColumns() {
    for (var i = 0; i < COLUMN_VIEWS.length; i++) {
      var view = this.getView(COLUMN_VIEWS[i]);

      if (view && view.isVisible() && view.element()) {
        var viewName = view.name;
        var $hiddenCommandCells = view.element().find('.' + COMMAND_ADAPTIVE_HIDDEN_CLASS);

        this._showHiddenCellsInView({
          viewName,
          $cells: $hiddenCommandCells,
          isCommandColumn: true
        });

        var $hiddenCells = view.element().find('.' + this.addWidgetPrefix(HIDDEN_COLUMN_CLASS));

        this._showHiddenCellsInView({
          viewName,
          $cells: $hiddenCells
        });
      }
    }
  },
  _isCellValid: function _isCellValid($cell) {
    return $cell && $cell.length && !$cell.hasClass(MASTER_DETAIL_CELL_CLASS) && !$cell.hasClass(GROUP_CELL_CLASS);
  },
  _hideVisibleColumn: function _hideVisibleColumn(_ref2) {
    var {
      isCommandColumn,
      visibleIndex
    } = _ref2;
    var that = this;
    COLUMN_VIEWS.forEach(function (viewName) {
      var view = that.getView(viewName);
      view && that._hideVisibleColumnInView({
        view,
        isCommandColumn,
        visibleIndex
      });
    });
  },
  _hideVisibleColumnInView: function _hideVisibleColumnInView(_ref3) {
    var {
      view,
      isCommandColumn,
      visibleIndex
    } = _ref3;
    var viewName = view.name;
    var $cellElement;

    var column = this._columnsController.getVisibleColumns()[visibleIndex];

    var editFormRowIndex = this._editingController && this._editingController.getEditFormRowIndex();

    if (view && view.isVisible() && column) {
      var rowsCount = view.getRowsCount();

      var $rowElements = view._getRowElements();

      for (var rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        var cancelClassAdding = rowIndex === editFormRowIndex && viewName === ROWS_VIEW && this.option('editing.mode') !== 'popup';

        if (!cancelClassAdding) {
          var currentVisibleIndex = viewName === COLUMN_HEADERS_VIEW ? this._columnsController.getVisibleIndex(column.index, rowIndex) : visibleIndex;

          if (currentVisibleIndex >= 0) {
            var $rowElement = $rowElements.eq(rowIndex);
            $cellElement = this._findCellElementInRow($rowElement, currentVisibleIndex);
            this._isCellValid($cellElement) && this._hideVisibleCellInView({
              viewName,
              isCommandColumn,
              $cell: $cellElement
            });
          }
        }
      }
    }
  },

  _findCellElementInRow($rowElement, visibleColumnIndex) {
    var $rowCells = $rowElement.children();
    var visibleIndex = visibleColumnIndex;
    var cellIsInsideGroup = false;

    if ($rowElement.hasClass(GROUP_ROW_CLASS)) {
      var $groupCell = $rowElement.find(".".concat(GROUP_CELL_CLASS));
      var colSpan = $groupCell.attr('colspan');

      if ($groupCell.length && isDefined(colSpan)) {
        var groupCellLength = parseInt(colSpan);
        var endGroupIndex = $groupCell.index() + groupCellLength - 1;

        if (visibleColumnIndex > endGroupIndex) {
          visibleIndex = visibleColumnIndex - groupCellLength + 1;
        } else {
          cellIsInsideGroup = true;
        }
      }
    }

    var $cellElement = !cellIsInsideGroup ? $rowCells.eq(visibleIndex) : undefined;
    return $cellElement;
  },

  _hideVisibleCellInView: function _hideVisibleCellInView(_ref4) {
    var {
      $cell,
      isCommandColumn
    } = _ref4;
    var cssClassNameToAdd = isCommandColumn ? COMMAND_ADAPTIVE_HIDDEN_CLASS : this.addWidgetPrefix(HIDDEN_COLUMN_CLASS);
    $cell.addClass(cssClassNameToAdd);
  },
  _getEditMode: function _getEditMode() {
    return this._editingController.getEditMode();
  },
  isFormOrPopupEditMode: function isFormOrPopupEditMode() {
    var editMode = this._getEditMode();

    return editMode === EDIT_MODE_FORM || editMode === EDIT_MODE_POPUP;
  },
  hideRedundantColumns: function hideRedundantColumns(resultWidths, visibleColumns, hiddenQueue) {
    var that = this;
    this._hiddenColumns = [];

    if (that._isVisibleColumnsValid(visibleColumns) && hiddenQueue.length) {
      var totalWidth = 0;
      var $rootElement = that.component.$element();

      var rootElementWidth = getWidth($rootElement) - that._getCommandColumnsWidth();

      var getVisibleContentColumns = function () {
        return visibleColumns.filter(item => !item.command && this._hiddenColumns.filter(i => i.index === item.index).length === 0);
      }.bind(this);

      var visibleContentColumns = getVisibleContentColumns();
      var contentColumnsCount = visibleContentColumns.length;
      var i;
      var hasHiddenColumns;
      var needHideColumn;

      do {
        needHideColumn = false;
        totalWidth = 0;

        var percentWidths = that._calculatePercentWidths(resultWidths, visibleColumns);

        var columnsCanFit = percentWidths < 100 && percentWidths !== 0;

        for (i = 0; i < visibleColumns.length; i++) {
          var visibleColumn = visibleColumns[i];

          var columnWidth = that._getNotTruncatedColumnWidth(visibleColumn, rootElementWidth, visibleContentColumns, columnsCanFit);

          var columnId = getColumnId(that, visibleColumn);

          var widthOption = that._columnsController.columnOption(columnId, 'width');

          var minWidth = that._columnsController.columnOption(columnId, 'minWidth');

          var columnBestFitWidth = that._columnsController.columnOption(columnId, 'bestFitWidth');

          if (resultWidths[i] === HIDDEN_COLUMNS_WIDTH) {
            hasHiddenColumns = true;
            continue;
          }

          if (!columnWidth && !visibleColumn.command && !visibleColumn.fixed) {
            needHideColumn = true;
            break;
          }

          if (!widthOption || widthOption === 'auto') {
            columnWidth = Math.max(columnBestFitWidth || 0, minWidth || 0);
          }

          if (visibleColumn.command !== ADAPTIVE_COLUMN_NAME || hasHiddenColumns) {
            totalWidth += columnWidth;
          }
        }

        needHideColumn = needHideColumn || totalWidth > getWidth($rootElement);

        if (needHideColumn) {
          var column = hiddenQueue.pop();

          var visibleIndex = that._columnsController.getVisibleIndex(column.index);

          rootElementWidth += that._calculateColumnWidth(column, rootElementWidth, visibleContentColumns, columnsCanFit);

          that._hideVisibleColumn({
            visibleIndex
          });

          resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;

          this._hiddenColumns.push(column);

          visibleContentColumns = getVisibleContentColumns();
        }
      } while (needHideColumn && visibleContentColumns.length > 1 && hiddenQueue.length);

      if (contentColumnsCount === visibleContentColumns.length) {
        that._hideAdaptiveColumn(resultWidths, visibleColumns);
      }
    } else {
      that._hideAdaptiveColumn(resultWidths, visibleColumns);
    }
  },
  getItemContentByColumnIndex: function getItemContentByColumnIndex(visibleColumnIndex) {
    var $itemContent;

    for (var i = 0; i < this._$itemContents.length; i++) {
      $itemContent = this._$itemContents.eq(i);
      var item = $itemContent.data('dx-form-item');

      if (item && item.column && this._columnsController.getVisibleIndex(item.column.index) === visibleColumnIndex) {
        return $itemContent;
      }
    }
  },
  toggleExpandAdaptiveDetailRow: function toggleExpandAdaptiveDetailRow(key, alwaysExpanded) {
    if (!(this.isFormOrPopupEditMode() && this._editingController.isEditing())) {
      this.getController('data').toggleExpandAdaptiveDetailRow(key, alwaysExpanded);
    }
  },
  createFormByHiddenColumns: function createFormByHiddenColumns(container, options) {
    var that = this;
    var $container = $(container);
    var userFormOptions = {
      items: that._getFormItemsByHiddenColumns(that._hiddenColumns),
      formID: 'dx-' + new Guid()
    };
    var defaultFormOptions = isMaterial() ? {
      colCount: 2
    } : {};
    this.executeAction('onAdaptiveDetailRowPreparing', {
      formOptions: userFormOptions
    });
    that._$itemContents = null;
    that._form = that._createComponent($('<div>').appendTo($container), Form, extend(defaultFormOptions, userFormOptions, {
      customizeItem: function customizeItem(item) {
        var column = item.column || that._columnsController.columnOption(item.name || item.dataField);

        if (column) {
          item.label = item.label || {};
          item.label.text = item.label.text || column.caption;
          item.column = column;
          item.template = that._getTemplate(item, options, that.updateForm.bind(that));
        }

        userFormOptions.customizeItem && userFormOptions.customizeItem.call(this, item);
      },
      onContentReady: function onContentReady(e) {
        userFormOptions.onContentReady && userFormOptions.onContentReady.call(this, e);
        that._$itemContents = $container.find('.' + FORM_ITEM_CONTENT_CLASS);
      }
    }));
  },
  hasAdaptiveDetailRowExpanded: function hasAdaptiveDetailRowExpanded() {
    return isDefined(this._dataController.adaptiveExpandedKey());
  },
  updateForm: function updateForm(hiddenColumns) {
    if (this.hasAdaptiveDetailRowExpanded()) {
      if (this._form && isDefined(this._form._contentReadyAction)) {
        if (hiddenColumns && hiddenColumns.length) {
          this._form.option('items', this._getFormItemsByHiddenColumns(hiddenColumns));
        } else {
          this._form.repaint();
        }
      }
    }
  },
  updateHidingQueue: function updateHidingQueue(columns) {
    var that = this;
    var hideableColumns = columns.filter(function (column) {
      return column.visible && !column.type && !column.fixed && !(isDefined(column.groupIndex) && column.groupIndex >= 0);
    });
    var columnsHasHidingPriority;
    var i;
    that._hidingColumnsQueue = [];

    if (that.option('allowColumnResizing') && that.option('columnResizingMode') === 'widget') {
      return that._hidingColumnsQueue;
    }

    for (i = 0; i < hideableColumns.length; i++) {
      if (isDefined(hideableColumns[i].hidingPriority) && hideableColumns[i].hidingPriority >= 0) {
        columnsHasHidingPriority = true;
        that._hidingColumnsQueue[hideableColumns[i].hidingPriority] = hideableColumns[i];
      }
    }

    if (columnsHasHidingPriority) {
      that._hidingColumnsQueue.reverse();
    } else if (that.option('columnHidingEnabled')) {
      for (i = 0; i < hideableColumns.length; i++) {
        var visibleIndex = that._columnsController.getVisibleIndex(hideableColumns[i].index);

        that._hidingColumnsQueue[visibleIndex] = hideableColumns[i];
      }
    }

    that._hidingColumnsQueue = that._hidingColumnsQueue.filter(Object);
    return that._hidingColumnsQueue;
  },
  getHiddenColumns: function getHiddenColumns() {
    return this._hiddenColumns;
  },
  hasHiddenColumns: function hasHiddenColumns() {
    return this._hiddenColumns.length > 0;
  },
  getHidingColumnsQueue: function getHidingColumnsQueue() {
    return this._hidingColumnsQueue;
  },
  init: function init() {
    var that = this;
    that._columnsController = that.getController('columns');
    that._dataController = that.getController('data');
    that._rowsView = that.getView('rowsView');

    that._columnsController.addCommandColumn({
      type: ADAPTIVE_COLUMN_NAME,
      command: ADAPTIVE_COLUMN_NAME,
      visible: true,
      adaptiveHidden: true,
      cssClass: ADAPTIVE_COLUMN_NAME_CLASS,
      alignment: 'center',
      width: 'auto',
      cellTemplate: adaptiveCellTemplate,
      fixedPosition: 'right'
    });

    that._columnsController.columnsChanged.add(function () {
      var isAdaptiveVisible = !!that.updateHidingQueue(that._columnsController.getColumns()).length;

      that._columnsController.columnOption('command:adaptive', 'adaptiveHidden', !isAdaptiveVisible, true);
    });

    that._editingController = that.getController('editing');
    that._hidingColumnsQueue = [];
    that._hiddenColumns = [];
    that.createAction('onAdaptiveDetailRowPreparing');
    that.callBase();
  },
  optionChanged: function optionChanged(args) {
    if (args.name === 'columnHidingEnabled') {
      this._columnsController.columnOption('command:adaptive', 'adaptiveHidden', !args.value);
    }

    this.callBase(args);
  },
  publicMethods: function publicMethods() {
    return ['isAdaptiveDetailRowExpanded', 'expandAdaptiveDetailRow', 'collapseAdaptiveDetailRow'];
  },
  isAdaptiveDetailRowExpanded: function isAdaptiveDetailRowExpanded(key) {
    return this._dataController.adaptiveExpandedKey() && equalByValue(this._dataController.adaptiveExpandedKey(), key);
  },
  expandAdaptiveDetailRow: function expandAdaptiveDetailRow(key) {
    if (!this.hasAdaptiveDetailRowExpanded()) {
      this.toggleExpandAdaptiveDetailRow(key);
    }
  },
  collapseAdaptiveDetailRow: function collapseAdaptiveDetailRow() {
    if (this.hasAdaptiveDetailRowExpanded()) {
      this.toggleExpandAdaptiveDetailRow();
    }
  },
  updateCommandAdaptiveAriaLabel: function updateCommandAdaptiveAriaLabel(key, label) {
    var rowIndex = this._dataController.getRowIndexByKey(key);

    if (rowIndex === -1) {
      return;
    }

    var $row = $(this.component.getRowElement(rowIndex));
    this.setCommandAdaptiveAriaLabel($row, label);
  },
  setCommandAdaptiveAriaLabel: function setCommandAdaptiveAriaLabel($row, labelName) {
    var $adaptiveCommand = $row.find('.dx-command-adaptive');
    $adaptiveCommand.attr('aria-label', messageLocalization.format(labelName));
  }
});
export var adaptivityModule = {
  defaultOptions: function defaultOptions() {
    return {
      columnHidingEnabled: false,
      onAdaptiveDetailRowPreparing: null
    };
  },
  controllers: {
    adaptiveColumns: AdaptiveColumnsController
  },
  extenders: {
    views: {
      rowsView: {
        _getCellTemplate: function _getCellTemplate(options) {
          var that = this;
          var column = options.column;

          if (options.rowType === ADAPTIVE_ROW_TYPE && column.command === 'detail') {
            return function (container, options) {
              that._adaptiveColumnsController.createFormByHiddenColumns($(container), options);
            };
          }

          return that.callBase(options);
        },
        _createRow: function _createRow(row) {
          var $row = this.callBase.apply(this, arguments);

          if (row && row.rowType === ADAPTIVE_ROW_TYPE && row.key === this._dataController.adaptiveExpandedKey()) {
            $row.addClass(ADAPTIVE_DETAIL_ROW_CLASS);
          }

          return $row;
        },
        _renderCells: function _renderCells($row, options) {
          this.callBase($row, options);
          var adaptiveColumnsController = this._adaptiveColumnsController;
          var hidingColumnsQueueLength = adaptiveColumnsController.getHidingColumnsQueue().length;
          var hiddenColumnsLength = adaptiveColumnsController.getHiddenColumns().length;

          if (hidingColumnsQueueLength && !hiddenColumnsLength) {
            getDataCellElements($row).last().addClass(LAST_DATA_CELL_CLASS);
          }

          if (options.row.rowType === 'data') {
            adaptiveColumnsController.setCommandAdaptiveAriaLabel($row, EXPAND_ARIA_NAME);
          }
        },
        _getColumnIndexByElementCore: function _getColumnIndexByElementCore($element) {
          var $itemContent = $element.closest('.' + FORM_ITEM_CONTENT_CLASS);

          if ($itemContent.length && $itemContent.closest(this.component.$element()).length) {
            var formItem = $itemContent.length ? $itemContent.first().data('dx-form-item') : null;
            return formItem && formItem.column && this._columnsController.getVisibleIndex(formItem.column.index);
          } else {
            return this.callBase($element);
          }
        },
        _cellPrepared: function _cellPrepared($cell, options) {
          this.callBase.apply(this, arguments);

          if (options.row.rowType !== ADAPTIVE_ROW_TYPE && options.column.visibleWidth === HIDDEN_COLUMNS_WIDTH) {
            $cell.addClass(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS));
          }
        },
        _getCellElement: function _getCellElement(rowIndex, columnIdentifier) {
          var item = this._dataController.items()[rowIndex];

          if (item && item.rowType === ADAPTIVE_ROW_TYPE) {
            return this._adaptiveColumnsController.getItemContentByColumnIndex(columnIdentifier);
          } else {
            return this.callBase.apply(this, arguments);
          }
        },
        getContextMenuItems: function getContextMenuItems(options) {
          if (options.row && options.row.rowType === 'detailAdaptive') {
            var view = this.component.getView('columnHeadersView');
            var formItem = $(options.targetElement).closest('.dx-field-item-label').next().data('dx-form-item');
            options.column = formItem ? formItem.column : options.column;
            return view.getContextMenuItems && view.getContextMenuItems(options);
          }

          return this.callBase && this.callBase(options);
        },
        isClickableElement: function isClickableElement($target) {
          var isClickable = this.callBase ? this.callBase($target) : false;
          return isClickable || !!$target.closest('.' + ADAPTIVE_COLUMN_NAME_CLASS).length;
        },
        init: function init() {
          this.callBase();
          this._adaptiveColumnsController = this.getController('adaptiveColumns');
        }
      }
    },
    controllers: {
      export: {
        _updateColumnWidth: function _updateColumnWidth(column, width) {
          this.callBase(column, column.visibleWidth === HIDDEN_COLUMNS_WIDTH ? column.bestFitWidth : width);
        }
      },
      columnsResizer: {
        _pointCreated: function _pointCreated(point, cellsLength, columns) {
          var result = this.callBase(point, cellsLength, columns);
          var currentColumn = columns[point.columnIndex] || {};

          var nextColumnIndex = this._getNextColumnIndex(point.columnIndex);

          var nextColumn = columns[nextColumnIndex] || {};
          var hasHiddenColumnsOnly = nextColumnIndex !== point.columnIndex + 1 && nextColumn.command;
          var hasAdaptiveHiddenWidth = currentColumn.visibleWidth === HIDDEN_COLUMNS_WIDTH || hasHiddenColumnsOnly;
          return result || hasAdaptiveHiddenWidth;
        },
        _getNextColumnIndex: function _getNextColumnIndex(currentColumnIndex) {
          var visibleColumns = this._columnsController.getVisibleColumns();

          var index = this.callBase(currentColumnIndex);

          while (visibleColumns[index] && visibleColumns[index].visibleWidth === HIDDEN_COLUMNS_WIDTH) {
            index++;
          }

          return index;
        }
      },
      draggingHeader: {
        _pointCreated: function _pointCreated(point, columns, location, sourceColumn) {
          var result = this.callBase(point, columns, location, sourceColumn);
          var column = columns[point.columnIndex - 1] || {};
          var hasAdaptiveHiddenWidth = column.visibleWidth === HIDDEN_COLUMNS_WIDTH;
          return result || hasAdaptiveHiddenWidth;
        }
      },
      editing: {
        _isRowEditMode: function _isRowEditMode() {
          return this.getEditMode() === EDIT_MODE_ROW;
        },
        _getFormEditItemTemplate: function _getFormEditItemTemplate(cellOptions, column) {
          if (this.getEditMode() !== EDIT_MODE_ROW && cellOptions.rowType === 'detailAdaptive') {
            cellOptions.columnIndex = this._columnsController.getVisibleIndex(column.index);
            return this.getColumnTemplate(cellOptions);
          }

          return this.callBase(cellOptions, column);
        },
        _closeEditItem: function _closeEditItem($targetElement) {
          var $itemContents = $targetElement.closest('.' + FORM_ITEM_CONTENT_CLASS);
          var rowIndex = this._dataController.getRowIndexByKey(this._dataController.adaptiveExpandedKey()) + 1;
          var formItem = $itemContents.length ? $itemContents.first().data('dx-form-item') : null;

          var columnIndex = formItem && formItem.column && this._columnsController.getVisibleIndex(formItem.column.index);

          if (!this.isEditCell(rowIndex, columnIndex)) {
            this.callBase($targetElement);
          }
        },
        _beforeUpdateItems: function _beforeUpdateItems(rowIndices, rowIndex) {
          if (!this._adaptiveController.isFormOrPopupEditMode() && this._adaptiveController.hasHiddenColumns()) {
            var items = this._dataController.items();

            var item = items[rowIndex];
            var oldExpandRowIndex = gridCoreUtils.getIndexByKey(this._dataController.adaptiveExpandedKey(), items);
            this._isForceRowAdaptiveExpand = !this._adaptiveController.hasAdaptiveDetailRowExpanded();

            if (oldExpandRowIndex >= 0) {
              rowIndices.push(oldExpandRowIndex + 1);
            }

            rowIndices.push(rowIndex + 1);

            this._dataController.adaptiveExpandedKey(item.key);
          }
        },
        _afterInsertRow: function _afterInsertRow(key) {
          this.callBase.apply(this, arguments);

          if (this._adaptiveController.hasHiddenColumns()) {
            this._adaptiveController.toggleExpandAdaptiveDetailRow(key, this.isRowEditMode());

            this._isForceRowAdaptiveExpand = true;
          }
        },
        _collapseAdaptiveDetailRow: function _collapseAdaptiveDetailRow() {
          if (this._isRowEditMode() && this._isForceRowAdaptiveExpand) {
            this._adaptiveController.collapseAdaptiveDetailRow();

            this._isForceRowAdaptiveExpand = false;
          }
        },
        _cancelEditAdaptiveDetailRow: function _cancelEditAdaptiveDetailRow() {
          if (this._adaptiveController.hasHiddenColumns()) {
            this._collapseAdaptiveDetailRow();
          }
        },
        _afterSaveEditData: function _afterSaveEditData() {
          this.callBase.apply(this, arguments);
          var deferred = new Deferred();

          if (this._isRowEditMode() && this._adaptiveController.hasHiddenColumns()) {
            when(this.getController('validating').validate(true)).done(isValid => {
              if (isValid) {
                this._cancelEditAdaptiveDetailRow();
              }

              deferred.resolve();
            });
          } else {
            deferred.resolve();
          }

          return deferred.promise();
        },
        _beforeCancelEditData: function _beforeCancelEditData() {
          this.callBase();

          this._cancelEditAdaptiveDetailRow();
        },
        _getRowIndicesForCascadeUpdating: function _getRowIndicesForCascadeUpdating(row) {
          var rowIndices = this.callBase.apply(this, arguments);

          if (this._adaptiveController.isAdaptiveDetailRowExpanded(row.key)) {
            rowIndices.push(row.rowType === ADAPTIVE_ROW_TYPE ? row.rowIndex - 1 : row.rowIndex + 1);
          }

          return rowIndices;
        },
        _beforeCloseEditCellInBatchMode: function _beforeCloseEditCellInBatchMode(rowIndices) {
          var expandedKey = this._dataController._adaptiveExpandedKey;

          if (expandedKey) {
            var rowIndex = gridCoreUtils.getIndexByKey(expandedKey, this._dataController.items());

            if (rowIndex > -1) {
              rowIndices.unshift(rowIndex);
            }
          }
        },
        editRow: function editRow(rowIndex) {
          if (this._adaptiveController.isFormOrPopupEditMode()) {
            this._adaptiveController.collapseAdaptiveDetailRow();
          }

          this.callBase(rowIndex);
        },
        deleteRow: function deleteRow(rowIndex) {
          var rowKey = this._dataController.getKeyByRowIndex(rowIndex);

          if (this.getEditMode() === EDIT_MODE_BATCH && this._adaptiveController.isAdaptiveDetailRowExpanded(rowKey)) {
            this._adaptiveController.collapseAdaptiveDetailRow();
          }

          this.callBase(rowIndex);
        },
        init: function init() {
          this.callBase();
          this._adaptiveController = this.getController('adaptiveColumns');
        }
      },
      resizing: {
        _needBestFit: function _needBestFit() {
          return this.callBase() || !!this._adaptiveColumnsController.getHidingColumnsQueue().length;
        },
        _correctColumnWidths: function _correctColumnWidths(resultWidths, visibleColumns) {
          var adaptiveController = this._adaptiveColumnsController;
          var oldHiddenColumns = adaptiveController.getHiddenColumns();
          var hidingColumnsQueue = adaptiveController.updateHidingQueue(this._columnsController.getColumns());
          adaptiveController.hideRedundantColumns(resultWidths, visibleColumns, hidingColumnsQueue);
          var hiddenColumns = adaptiveController.getHiddenColumns();

          if (adaptiveController.hasAdaptiveDetailRowExpanded()) {
            if (oldHiddenColumns.length !== hiddenColumns.length) {
              adaptiveController.updateForm(hiddenColumns);
            }
          }

          !hiddenColumns.length && adaptiveController.collapseAdaptiveDetailRow();
          return this.callBase.apply(this, arguments);
        },
        _toggleBestFitMode: function _toggleBestFitMode(isBestFit) {
          isBestFit && this._adaptiveColumnsController._showHiddenColumns();
          this.callBase(isBestFit);
        },
        _needStretch: function _needStretch() {
          var adaptiveColumnsController = this._adaptiveColumnsController;
          return this.callBase.apply(this, arguments) || adaptiveColumnsController.getHidingColumnsQueue().length || adaptiveColumnsController.hasHiddenColumns();
        },
        init: function init() {
          this._adaptiveColumnsController = this.getController('adaptiveColumns');
          this.callBase();
        },
        dispose: function dispose() {
          this.callBase.apply(this, arguments);
          clearTimeout(this._updateScrollableTimeoutID);
        }
      },
      data: {
        _processItems: function _processItems(items, change) {
          var changeType = change.changeType;
          items = this.callBase.apply(this, arguments);

          if (changeType === 'loadingAll' || !isDefined(this._adaptiveExpandedKey)) {
            return items;
          }

          var expandRowIndex = gridCoreUtils.getIndexByKey(this._adaptiveExpandedKey, items);
          var newMode = this.option(LEGACY_SCROLLING_MODE) === false;

          if (expandRowIndex >= 0) {
            var item = items[expandRowIndex];
            items.splice(expandRowIndex + 1, 0, {
              visible: true,
              rowType: ADAPTIVE_ROW_TYPE,
              key: item.key,
              data: item.data,
              node: item.node,
              modifiedValues: item.modifiedValues,
              isNewRow: item.isNewRow,
              values: item.values
            });
          } else if (changeType === 'refresh' && !(newMode && change.repaintChangesOnly)) {
            this._adaptiveExpandedKey = undefined;
          }

          return items;
        },
        _getRowIndicesForExpand: function _getRowIndicesForExpand(key) {
          var rowIndices = this.callBase.apply(this, arguments);

          if (this.getController('adaptiveColumns').isAdaptiveDetailRowExpanded(key)) {
            var lastRowIndex = rowIndices[rowIndices.length - 1];
            rowIndices.push(lastRowIndex + 1);
          }

          return rowIndices;
        },
        adaptiveExpandedKey: function adaptiveExpandedKey(value) {
          if (isDefined(value)) {
            this._adaptiveExpandedKey = value;
          } else {
            return this._adaptiveExpandedKey;
          }
        },
        toggleExpandAdaptiveDetailRow: function toggleExpandAdaptiveDetailRow(key, alwaysExpanded) {
          var that = this;
          var oldExpandLoadedRowIndex = gridCoreUtils.getIndexByKey(that._adaptiveExpandedKey, that._items);
          var newExpandLoadedRowIndex = gridCoreUtils.getIndexByKey(key, that._items);

          if (oldExpandLoadedRowIndex >= 0 && oldExpandLoadedRowIndex === newExpandLoadedRowIndex && !alwaysExpanded) {
            key = undefined;
            newExpandLoadedRowIndex = -1;
          }

          var oldKey = that._adaptiveExpandedKey;
          that._adaptiveExpandedKey = key;

          if (oldExpandLoadedRowIndex >= 0) {
            oldExpandLoadedRowIndex++;
          }

          if (newExpandLoadedRowIndex >= 0) {
            newExpandLoadedRowIndex++;
          }

          var rowIndexDelta = that.getRowIndexDelta();
          that.updateItems({
            allowInvisibleRowIndices: true,
            changeType: 'update',
            rowIndices: [oldExpandLoadedRowIndex - rowIndexDelta, newExpandLoadedRowIndex - rowIndexDelta]
          });
          var adaptiveColumnsController = this.getController('adaptiveColumns');
          adaptiveColumnsController.updateCommandAdaptiveAriaLabel(key, COLLAPSE_ARIA_NAME);
          adaptiveColumnsController.updateCommandAdaptiveAriaLabel(oldKey, EXPAND_ARIA_NAME);
        },
        init: function init() {
          this.callBase();
          this._adaptiveExpandedKey = undefined;
        }
      },
      editorFactory: {
        _getFocusCellSelector: function _getFocusCellSelector() {
          return this.callBase() + ', .dx-adaptive-detail-row .dx-field-item > .dx-field-item-content';
        },
        _getTooltipsSelector: function _getTooltipsSelector() {
          return this.callBase() + ', .dx-field-item-content .' + this.addWidgetPrefix(REVERT_TOOLTIP_CLASS);
        }
      },
      columns: {
        _isColumnVisible: function _isColumnVisible(column) {
          return this.callBase(column) && !column.adaptiveHidden;
        }
      },
      keyboardNavigation: {
        _isCellValid: function _isCellValid($cell) {
          return this.callBase.apply(this, arguments) && !$cell.hasClass(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS));
        },
        _processNextCellInMasterDetail: function _processNextCellInMasterDetail($nextCell) {
          this.callBase($nextCell);

          var isCellOrBatchMode = this._editingController.isCellOrBatchEditMode();

          if (!this._isInsideEditForm($nextCell) && $nextCell && isCellOrBatchMode) {
            var focusHandler = function focusHandler() {
              eventsEngine.off($nextCell, 'focus', focusHandler);
              eventsEngine.trigger($nextCell, 'dxclick');
            };

            eventsEngine.on($nextCell, 'focus', focusHandler);
          }
        },
        _handleTabKeyOnMasterDetailCell: function _handleTabKeyOnMasterDetailCell(eventTarget, direction) {
          var result = this.callBase(eventTarget, direction);

          var $currentCell = this._getFocusedCell();

          var $row = $currentCell && $currentCell.parent();

          if (!result && $row && $row.length) {
            var $dataCells = getDataCellElements($row);
            var $targetCell = direction === 'next' ? $dataCells.last() : $dataCells.first();
            var rowIndex = $row.get(0).rowIndex;
            var adaptiveController = this._adaptiveController;

            var key = this._dataController.getKeyByRowIndex(direction === 'next' ? rowIndex : rowIndex - 1);

            var isCellElementsEquals = $currentCell && $targetCell && $currentCell.get(0) === $targetCell.get(0);
            return adaptiveController.isAdaptiveDetailRowExpanded(key) && isCellElementsEquals;
          }

          return result;
        },
        init: function init() {
          this.callBase();
          this._adaptiveController = this.getController('adaptiveColumns');
        }
      }
    }
  }
};