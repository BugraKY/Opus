"use strict";

exports.masterDetailModule = void 0;

var _size = require("../../core/utils/size");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _uiGrid_core = _interopRequireDefault(require("./ui.grid_core.utils"));

var _common = require("../../core/utils/common");

var _iterator = require("../../core/utils/iterator");

var _type = require("../../core/utils/type");

var _deferred = require("../../core/utils/deferred");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
var MASTER_DETAIL_ROW_CLASS = 'dx-master-detail-row';
var CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
var ROW_LINES_CLASS = 'dx-row-lines';
var masterDetailModule = {
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
              cellTemplate: _uiGrid_core.default.getExpandCellTemplate()
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

            var expandIndex = _uiGrid_core.default.getIndexByKey(key, that._expandedItems);

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
              var expandIndex = _uiGrid_core.default.getIndexByKey(key, that._expandedItems);

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
              result = new _deferred.Deferred().resolve();
            }

            return result;
          },
          _processDataItem: function _processDataItem(data, options) {
            var that = this;
            var dataItem = that.callBase.apply(that, arguments);
            dataItem.isExpanded = that.isRowExpanded(dataItem.key);

            if (options.detailColumnIndex === undefined) {
              options.detailColumnIndex = -1;
              (0, _iterator.each)(options.visibleColumns, function (index, column) {
                if (column.command === 'expand' && !(0, _type.isDefined)(column.groupIndex)) {
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
              that._expandedItems = (0, _common.grep)(that._expandedItems, function (item) {
                return item.visible;
              });
            }

            (0, _iterator.each)(items, function (index, item) {
              result.push(item);

              var expandIndex = _uiGrid_core.default.getIndexByKey(item.key, that._expandedItems);

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
          var _this = this;

          var $masterDetailRow = $element.closest('.' + MASTER_DETAIL_ROW_CLASS);

          if ($masterDetailRow.length) {
            (0, _deferred.when)(this._updateMasterDataGrid($masterDetailRow, $element)).done(function () {
              _this._updateParentDataGrids($masterDetailRow.parent());
            });
          }
        },
        _updateMasterDataGrid: function _updateMasterDataGrid($masterDetailRow, $detailElement) {
          var masterRowOptions = (0, _renderer.default)($masterDetailRow).data('options');
          var masterDataGrid = (0, _renderer.default)($masterDetailRow).closest('.' + this.getWidgetContainerClass()).parent().data('dxDataGrid');

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
          var _this2 = this;

          var $rows = (0, _renderer.default)(masterDataGrid.getRowElement(masterRowIndex));
          var $tables = (0, _renderer.default)(masterDataGrid.getView('rowsView').getTableElements());
          var rowsNotEqual = ($rows === null || $rows === void 0 ? void 0 : $rows.length) === 2 && (0, _size.getHeight)($rows.eq(0)) !== (0, _size.getHeight)($rows.eq(1));
          var tablesNotEqual = ($tables === null || $tables === void 0 ? void 0 : $tables.length) === 2 && (0, _size.getHeight)($tables.eq(0)) !== (0, _size.getHeight)($tables.eq(1));

          if (rowsNotEqual || tablesNotEqual) {
            var detailElementWidth = (0, _size.getWidth)($detailElement);
            return masterDataGrid.updateDimensions().done(function () {
              var isDetailHorizontalScrollCanBeShown = _this2.option('columnAutoWidth') && masterDataGrid.option('scrolling.useNative') === true;
              var isDetailGridWidthChanged = isDetailHorizontalScrollCanBeShown && detailElementWidth !== (0, _size.getWidth)($detailElement);

              if (isDetailHorizontalScrollCanBeShown && isDetailGridWidthChanged) {
                _this2.updateDimensions();
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

              if ((0, _type.isDefined)(row.visible)) {
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
exports.masterDetailModule = masterDetailModule;