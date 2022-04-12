import { getHeight, getWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import gridCoreUtils from './ui.grid_core.utils';
import { grep } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import { isDefined } from '../../core/utils/type';
import { when, Deferred } from '../../core/utils/deferred';
var MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
var MASTER_DETAIL_ROW_CLASS = 'dx-master-detail-row';
var CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
var ROW_LINES_CLASS = 'dx-row-lines';
export var masterDetailModule = {
  defaultOptions: function defaultOptions() {
    return {
      masterDetail: {
        enabled: false,
        autoExpandAll: false,
        template: null
      }
    };
  },
  extenders: {
    controllers: {
      columns: {
        _getExpandColumnsCore: function _getExpandColumnsCore() {
          var expandColumns = this.callBase();

          if (this.option('masterDetail.enabled')) {
            expandColumns.push({
              type: 'detailExpand',
              cellTemplate: gridCoreUtils.getExpandCellTemplate()
            });
          }

          return expandColumns;
        }
      },
      data: function () {
        var initMasterDetail = function initMasterDetail(that) {
          that._expandedItems = [];
          that._isExpandAll = that.option('masterDetail.autoExpandAll');
        };

        return {
          init: function init() {
            var that = this;
            initMasterDetail(that);
            that.callBase();
          },
          expandAll: function expandAll(groupIndex) {
            var that = this;

            if (groupIndex < 0) {
              that._isExpandAll = true;
              that._expandedItems = [];
              that.updateItems();
            } else {
              that.callBase.apply(that, arguments);
            }
          },
          collapseAll: function collapseAll(groupIndex) {
            var that = this;

            if (groupIndex < 0) {
              that._isExpandAll = false;
              that._expandedItems = [];
              that.updateItems();
            } else {
              that.callBase.apply(that, arguments);
            }
          },
          isRowExpanded: function isRowExpanded(key) {
            var that = this;
            var expandIndex = gridCoreUtils.getIndexByKey(key, that._expandedItems);

            if (Array.isArray(key)) {
              return that.callBase.apply(that, arguments);
            } else {
              return !!(that._isExpandAll ^ (expandIndex >= 0 && that._expandedItems[expandIndex].visible));
            }
          },
          _getRowIndicesForExpand: function _getRowIndicesForExpand(key) {
            var rowIndex = this.getRowIndexByKey(key);
            return [rowIndex, rowIndex + 1];
          },
          _changeRowExpandCore: function _changeRowExpandCore(key) {
            var that = this;
            var result;

            if (Array.isArray(key)) {
              result = that.callBase.apply(that, arguments);
            } else {
              var expandIndex = gridCoreUtils.getIndexByKey(key, that._expandedItems);

              if (expandIndex >= 0) {
                var visible = that._expandedItems[expandIndex].visible;
                that._expandedItems[expandIndex].visible = !visible;
              } else {
                that._expandedItems.push({
                  key: key,
                  visible: true
                });
              }

              that.updateItems({
                changeType: 'update',
                rowIndices: that._getRowIndicesForExpand(key)
              });
              result = new Deferred().resolve();
            }

            return result;
          },
          _processDataItem: function _processDataItem(data, options) {
            var that = this;
            var dataItem = that.callBase.apply(that, arguments);
            dataItem.isExpanded = that.isRowExpanded(dataItem.key);

            if (options.detailColumnIndex === undefined) {
              options.detailColumnIndex = -1;
              each(options.visibleColumns, function (index, column) {
                if (column.command === 'expand' && !isDefined(column.groupIndex)) {
                  options.detailColumnIndex = index;
                  return false;
                }
              });
            }

            if (options.detailColumnIndex >= 0) {
              dataItem.values[options.detailColumnIndex] = dataItem.isExpanded;
            }

            return dataItem;
          },
          _processItems: function _processItems(items, change) {
            var that = this;
            var changeType = change.changeType;
            var result = [];
            items = that.callBase.apply(that, arguments);

            if (changeType === 'loadingAll') {
              return items;
            }

            if (changeType === 'refresh') {
              that._expandedItems = grep(that._expandedItems, function (item) {
                return item.visible;
              });
            }

            each(items, function (index, item) {
              result.push(item);
              var expandIndex = gridCoreUtils.getIndexByKey(item.key, that._expandedItems);

              if (item.rowType === 'data' && (item.isExpanded || expandIndex >= 0) && !item.isNewRow) {
                result.push({
                  visible: item.isExpanded,
                  rowType: 'detail',
                  key: item.key,
                  data: item.data,
                  values: []
                });
              }
            });
            return result;
          },
          optionChanged: function optionChanged(args) {
            var that = this;
            var isEnabledChanged;
            var isAutoExpandAllChanged;

            if (args.name === 'masterDetail') {
              args.name = 'dataSource';

              switch (args.fullName) {
                case 'masterDetail':
                  {
                    var value = args.value || {};
                    var previousValue = args.previousValue || {};
                    isEnabledChanged = value.enabled !== previousValue.enabled;
                    isAutoExpandAllChanged = value.autoExpandAll !== previousValue.autoExpandAll;
                    break;
                  }

                case 'masterDetail.template':
                  {
                    initMasterDetail(that);
                    break;
                  }

                case 'masterDetail.enabled':
                  isEnabledChanged = true;
                  break;

                case 'masterDetail.autoExpandAll':
                  isAutoExpandAllChanged = true;
                  break;
              }

              if (isEnabledChanged || isAutoExpandAllChanged) {
                initMasterDetail(that);
              }
            }

            that.callBase(args);
          }
        };
      }(),
      resizing: {
        fireContentReadyAction: function fireContentReadyAction() {
          this.callBase.apply(this, arguments);

          this._updateParentDataGrids(this.component.$element());
        },
        _updateParentDataGrids: function _updateParentDataGrids($element) {
          var $masterDetailRow = $element.closest('.' + MASTER_DETAIL_ROW_CLASS);

          if ($masterDetailRow.length) {
            when(this._updateMasterDataGrid($masterDetailRow, $element)).done(() => {
              this._updateParentDataGrids($masterDetailRow.parent());
            });
          }
        },
        _updateMasterDataGrid: function _updateMasterDataGrid($masterDetailRow, $detailElement) {
          var masterRowOptions = $($masterDetailRow).data('options');
          var masterDataGrid = $($masterDetailRow).closest('.' + this.getWidgetContainerClass()).parent().data('dxDataGrid');

          if (masterRowOptions && masterDataGrid) {
            if (masterDataGrid.getView('rowsView').isFixedColumns()) {
              return this._updateFixedMasterDetailGrids(masterDataGrid, masterRowOptions.rowIndex, $detailElement);
            } else {
              if (masterDataGrid.option('scrolling.useNative') === true) {
                return masterDataGrid.updateDimensions();
              }

              var scrollable = masterDataGrid.getScrollable(); // T607490

              return scrollable === null || scrollable === void 0 ? void 0 : scrollable.update();
            }
          }
        },
        _updateFixedMasterDetailGrids: function _updateFixedMasterDetailGrids(masterDataGrid, masterRowIndex, $detailElement) {
          var $rows = $(masterDataGrid.getRowElement(masterRowIndex));
          var $tables = $(masterDataGrid.getView('rowsView').getTableElements());
          var rowsNotEqual = ($rows === null || $rows === void 0 ? void 0 : $rows.length) === 2 && getHeight($rows.eq(0)) !== getHeight($rows.eq(1));
          var tablesNotEqual = ($tables === null || $tables === void 0 ? void 0 : $tables.length) === 2 && getHeight($tables.eq(0)) !== getHeight($tables.eq(1));

          if (rowsNotEqual || tablesNotEqual) {
            var detailElementWidth = getWidth($detailElement);
            return masterDataGrid.updateDimensions().done(() => {
              var isDetailHorizontalScrollCanBeShown = this.option('columnAutoWidth') && masterDataGrid.option('scrolling.useNative') === true;
              var isDetailGridWidthChanged = isDetailHorizontalScrollCanBeShown && detailElementWidth !== getWidth($detailElement);

              if (isDetailHorizontalScrollCanBeShown && isDetailGridWidthChanged) {
                this.updateDimensions();
              }
            });
          }
        },
        _toggleBestFitMode: function _toggleBestFitMode(isBestFit) {
          this.callBase.apply(this, arguments);

          if (this.option('masterDetail.template')) {
            var $rowsTable = this._rowsView.getTableElement();

            if ($rowsTable) {
              $rowsTable.find('.dx-master-detail-cell').css('maxWidth', isBestFit ? 0 : '');
            }
          }
        }
      }
    },
    views: {
      rowsView: function () {
        return {
          _getCellTemplate: function _getCellTemplate(options) {
            var that = this;
            var column = options.column;
            var editingController = that.getController('editing');
            var isEditRow = editingController && editingController.isEditRow(options.rowIndex);
            var template;

            if (column.command === 'detail' && !isEditRow) {
              template = that.option('masterDetail.template') || {
                allowRenderToDetachedContainer: false,
                render: that._getDefaultTemplate(column)
              };
            } else {
              template = that.callBase.apply(that, arguments);
            }

            return template;
          },
          _isDetailRow: function _isDetailRow(row) {
            return row && row.rowType && row.rowType.indexOf('detail') === 0;
          },
          _createRow: function _createRow(row) {
            var $row = this.callBase.apply(this, arguments);

            if (row && this._isDetailRow(row)) {
              this.option('showRowLines') && $row.addClass(ROW_LINES_CLASS);
              $row.addClass(MASTER_DETAIL_ROW_CLASS);

              if (isDefined(row.visible)) {
                $row.toggle(row.visible);
              }
            }

            return $row;
          },
          _renderCells: function _renderCells($row, options) {
            var row = options.row;
            var $detailCell;

            var visibleColumns = this._columnsController.getVisibleColumns();

            if (row.rowType && this._isDetailRow(row)) {
              if (this._needRenderCell(0, options.columnIndices)) {
                $detailCell = this._renderCell($row, {
                  value: null,
                  row: row,
                  rowIndex: row.rowIndex,
                  column: {
                    command: 'detail'
                  },
                  columnIndex: 0
                });
                $detailCell.addClass(CELL_FOCUS_DISABLED_CLASS).addClass(MASTER_DETAIL_CELL_CLASS).attr('colSpan', visibleColumns.length);
              }
            } else {
              this.callBase.apply(this, arguments);
            }
          }
        };
      }()
    }
  }
};