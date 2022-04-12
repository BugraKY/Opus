"use strict";

exports.rowsModule = void 0;

var _size = require("../../core/utils/size");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _window = require("../../core/utils/window");

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _common = require("../../core/utils/common");

var _style = require("../../core/utils/style");

var _type = require("../../core/utils/type");

var _iterator = require("../../core/utils/iterator");

var _extend = require("../../core/utils/extend");

var _position = require("../../core/utils/position");

var _string = require("../../core/utils/string");

var _data = require("../../core/utils/data");

var _uiGrid_core = _interopRequireDefault(require("./ui.grid_core.utils"));

var _uiGrid_core2 = require("./ui.grid_core.columns_view");

var _ui = _interopRequireDefault(require("../scroll_view/ui.scrollable"));

var _remove = require("../../events/remove");

var _message = _interopRequireDefault(require("../../localization/message"));

var _browser = _interopRequireDefault(require("../../core/utils/browser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ROWS_VIEW_CLASS = 'rowsview';
var CONTENT_CLASS = 'content';
var NOWRAP_CLASS = 'nowrap';
var GROUP_ROW_CLASS = 'dx-group-row';
var GROUP_CELL_CLASS = 'dx-group-cell';
var DATA_ROW_CLASS = 'dx-data-row';
var FREE_SPACE_CLASS = 'dx-freespace-row';
var ROW_LINES_CLASS = 'dx-row-lines';
var COLUMN_LINES_CLASS = 'dx-column-lines';
var ROW_ALTERNATION_CLASS = 'dx-row-alt';
var LAST_ROW_BORDER = 'dx-last-row-border';
var EMPTY_CLASS = 'dx-empty';
var ROW_INSERTED_ANIMATION_CLASS = 'row-inserted-animation';
var LOADPANEL_HIDE_TIMEOUT = 200;

function getMaxHorizontalScrollOffset(scrollable) {
  return scrollable ? Math.round(scrollable.scrollWidth() - scrollable.clientWidth()) : 0;
}

var rowsModule = {
  defaultOptions: function defaultOptions() {
    return {
      hoverStateEnabled: false,
      scrolling: {
        useNative: 'auto'
      },
      loadPanel: {
        enabled: 'auto',
        text: _message.default.format('Loading'),
        width: 200,
        height: 90,
        showIndicator: true,
        indicatorSrc: '',
        showPane: true
      },
      dataRowTemplate: null,
      columnAutoWidth: false,
      noDataText: _message.default.format('dxDataGrid-noDataText'),
      wordWrapEnabled: false,
      showColumnLines: true,
      showRowLines: false,
      rowAlternationEnabled: false,
      activeStateEnabled: false,
      twoWayBindingEnabled: true
    };
  },
  views: {
    rowsView: _uiGrid_core2.ColumnsView.inherit(function () {
      var defaultCellTemplate = function defaultCellTemplate($container, options) {
        var isDataTextEmpty = (0, _string.isEmpty)(options.text) && options.rowType === 'data';
        var text = options.text;
        var container = $container.get(0);

        if (isDataTextEmpty) {
          _uiGrid_core.default.setEmptyText($container);
        } else if (options.column.encodeHtml) {
          container.textContent = text;
        } else {
          container.innerHTML = text;
        }
      };

      var getScrollableBottomPadding = function getScrollableBottomPadding(that) {
        var scrollable = that.getScrollable();
        return scrollable ? Math.ceil(parseFloat((0, _renderer.default)(scrollable.content()).css('paddingBottom'))) : 0;
      };

      return {
        _getDefaultTemplate: function _getDefaultTemplate(column) {
          switch (column.command) {
            case 'empty':
              return function (container) {
                container.html('&nbsp;');
              };

            default:
              return defaultCellTemplate;
          }
        },
        _getDefaultGroupTemplate: function _getDefaultGroupTemplate(column) {
          var that = this;
          var summaryTexts = that.option('summary.texts');
          return function ($container, options) {
            var data = options.data;
            var text = options.column.caption + ': ' + options.text;
            var container = $container.get(0);

            if (options.summaryItems && options.summaryItems.length) {
              text += ' ' + _uiGrid_core.default.getGroupRowSummaryText(options.summaryItems, summaryTexts);
            }

            if (data) {
              if (options.groupContinuedMessage && options.groupContinuesMessage) {
                text += ' (' + options.groupContinuedMessage + '. ' + options.groupContinuesMessage + ')';
              } else if (options.groupContinuesMessage) {
                text += ' (' + options.groupContinuesMessage + ')';
              } else if (options.groupContinuedMessage) {
                text += ' (' + options.groupContinuedMessage + ')';
              }
            }

            $container.addClass(GROUP_CELL_CLASS);

            if (column.encodeHtml) {
              container.textContent = text;
            } else {
              container.innerHTML = text;
            }
          };
        },
        _update: function _update() {},
        _getCellTemplate: function _getCellTemplate(options) {
          var that = this;
          var column = options.column;
          var template;

          if (options.rowType === 'group' && (0, _type.isDefined)(column.groupIndex) && !column.showWhenGrouped && !column.command) {
            template = column.groupCellTemplate || {
              allowRenderToDetachedContainer: true,
              render: that._getDefaultGroupTemplate(column)
            };
          } else if ((options.rowType === 'data' || column.command) && column.cellTemplate) {
            template = column.cellTemplate;
          } else {
            template = {
              allowRenderToDetachedContainer: true,
              render: that._getDefaultTemplate(column)
            };
          }

          return template;
        },
        _createRow: function _createRow(row) {
          var $row = this.callBase.apply(this, arguments);

          if (row) {
            var isGroup = row.rowType === 'group';
            var isDataRow = row.rowType === 'data';
            isDataRow && $row.addClass(DATA_ROW_CLASS);
            isDataRow && this.option('showRowLines') && $row.addClass(ROW_LINES_CLASS);
            this.option('showColumnLines') && $row.addClass(COLUMN_LINES_CLASS);

            if (row.visible === false) {
              $row.hide();
            }

            if (isGroup) {
              $row.addClass(GROUP_ROW_CLASS);
              var isRowExpanded = row.isExpanded;
              this.setAria('role', 'row', $row);
              this.setAria('expanded', (0, _type.isDefined)(isRowExpanded) && isRowExpanded.toString(), $row);
            }
          }

          return $row;
        },
        _rowPrepared: function _rowPrepared($row, rowOptions, row) {
          var _this = this;

          if (rowOptions.rowType === 'data') {
            if (this.option('rowAlternationEnabled')) {
              this._isAltRow(row) && $row.addClass(ROW_ALTERNATION_CLASS);
              rowOptions.watch && rowOptions.watch(function () {
                return _this._isAltRow(row);
              }, function (value) {
                $row.toggleClass(ROW_ALTERNATION_CLASS, value);
              });
            }

            this._setAriaRowIndex(rowOptions, $row);

            rowOptions.watch && rowOptions.watch(function () {
              return rowOptions.rowIndex;
            }, function () {
              return _this._setAriaRowIndex(rowOptions, $row);
            });
          }

          this.callBase.apply(this, arguments);
        },
        _setAriaRowIndex: function _setAriaRowIndex(row, $row) {
          var component = this.component;
          var isPagerMode = component.option('scrolling.mode') === 'standard' && !_uiGrid_core.default.isVirtualRowRendering(component);
          var rowIndex = row.rowIndex + 1;

          if (isPagerMode) {
            rowIndex = component.pageIndex() * component.pageSize() + rowIndex;
          } else {
            rowIndex += this._dataController.getRowIndexOffset();
          }

          this.setAria('rowindex', rowIndex, $row);
        },
        _afterRowPrepared: function _afterRowPrepared(e) {
          var _this2 = this;

          var arg = e.args[0];
          var dataController = this._dataController;
          var row = dataController.getVisibleRows()[arg.rowIndex];
          var watch = this.option('integrationOptions.watchMethod');
          if (!arg.data || arg.rowType !== 'data' || arg.isNewRow || !this.option('twoWayBindingEnabled') || !watch || !row) return;
          var dispose = watch(function () {
            return dataController.generateDataValues(arg.data, arg.columns);
          }, function () {
            dataController.repaintRows([row.rowIndex], _this2.option('repaintChangesOnly'));
          }, {
            deep: true,
            skipImmediate: true
          });

          _events_engine.default.on(arg.rowElement, _remove.removeEvent, dispose);
        },
        _renderScrollable: function _renderScrollable(force) {
          var that = this;
          var $element = that.element();

          if (!$element.children().length) {
            $element.append('<div>');
          }

          if (force || !that._loadPanel) {
            that._renderLoadPanel($element, $element.parent(), that._dataController.isLocalStore());
          }

          if ((force || !that.getScrollable()) && that._dataController.isLoaded()) {
            var columns = that.getColumns();
            var allColumnsHasWidth = true;

            for (var i = 0; i < columns.length; i++) {
              if (!columns[i].width && !columns[i].minWidth) {
                allColumnsHasWidth = false;
                break;
              }
            }

            if (that.option('columnAutoWidth') || that._hasHeight || allColumnsHasWidth || that._columnsController._isColumnFixing()) {
              that._renderScrollableCore($element);
            }
          }
        },
        _handleScroll: function _handleScroll(e) {
          var that = this;
          var rtlEnabled = that.option('rtlEnabled');
          var isNativeScrolling = e.component.option('useNative');
          that._scrollTop = e.scrollOffset.top;
          that._scrollLeft = e.scrollOffset.left;
          var scrollLeft = e.scrollOffset.left;

          if (rtlEnabled) {
            this._scrollRight = getMaxHorizontalScrollOffset(e.component) - this._scrollLeft;

            if (isNativeScrolling) {
              scrollLeft = -this._scrollRight;
            }

            if (!this.isScrollbarVisible(true)) {
              this._scrollLeft = -1;
            }
          }

          that.scrollChanged.fire(_extends({}, e.scrollOffset, {
            left: scrollLeft
          }), that.name);
        },
        _renderScrollableCore: function _renderScrollableCore($element) {
          var that = this;

          var dxScrollableOptions = that._createScrollableOptions();

          var scrollHandler = that._handleScroll.bind(that);

          dxScrollableOptions.onScroll = scrollHandler;
          that._scrollable = that._createComponent($element, _ui.default, dxScrollableOptions);
          that._scrollableContainer = that._scrollable && (0, _renderer.default)(that._scrollable.container());
        },
        _renderLoadPanel: _uiGrid_core.default.renderLoadPanel,
        _renderContent: function _renderContent(contentElement, tableElement) {
          contentElement.empty().append(tableElement);
          return this._findContentElement();
        },
        _updateContent: function _updateContent(newTableElement, change) {
          var that = this;
          var tableElement = that.getTableElement();

          var contentElement = that._findContentElement();

          var changeType = change && change.changeType;
          var executors = [];
          var highlightChanges = this.option('highlightChanges');
          var rowInsertedClass = this.addWidgetPrefix(ROW_INSERTED_ANIMATION_CLASS);

          switch (changeType) {
            case 'update':
              (0, _iterator.each)(change.rowIndices, function (index, rowIndex) {
                var $newRowElement = that._getRowElements(newTableElement).eq(index);

                var changeType = change.changeTypes && change.changeTypes[index];
                var item = change.items && change.items[index];
                executors.push(function () {
                  var $rowsElement = that._getRowElements();

                  var $rowElement = $rowsElement.eq(rowIndex);

                  switch (changeType) {
                    case 'update':
                      if (item) {
                        var columnIndices = change.columnIndices && change.columnIndices[index];

                        if ((0, _type.isDefined)(item.visible) && item.visible !== $rowElement.is(':visible')) {
                          $rowElement.toggle(item.visible);
                        } else if (columnIndices) {
                          that._updateCells($rowElement, $newRowElement, columnIndices);
                        } else {
                          $rowElement.replaceWith($newRowElement);
                        }
                      }

                      break;

                    case 'insert':
                      if (!$rowsElement.length) {
                        if (tableElement) {
                          var target = $newRowElement.is('tbody') ? tableElement : tableElement.children('tbody');
                          $newRowElement.prependTo(target);
                        }
                      } else if ($rowElement.length) {
                        $newRowElement.insertBefore($rowElement);
                      } else {
                        $newRowElement.insertAfter($rowsElement.last());
                      }

                      if (highlightChanges && change.isLiveUpdate) {
                        $newRowElement.addClass(rowInsertedClass);
                      }

                      break;

                    case 'remove':
                      $rowElement.remove();
                      break;
                  }
                });
              });
              (0, _iterator.each)(executors, function () {
                this();
              });
              newTableElement.remove();
              break;

            default:
              that.setTableElement(newTableElement);
              contentElement.addClass(that.addWidgetPrefix(CONTENT_CLASS));

              that._renderContent(contentElement, newTableElement);

              break;
          }
        },
        _createEmptyRow: function _createEmptyRow(className, isFixed, height) {
          var that = this;
          var $cell;

          var $row = that._createRow();

          var columns = isFixed ? this.getFixedColumns() : this.getColumns();
          $row.addClass(className).toggleClass(COLUMN_LINES_CLASS, that.option('showColumnLines'));

          for (var i = 0; i < columns.length; i++) {
            $cell = that._createCell({
              column: columns[i],
              rowType: 'freeSpace',
              columnIndex: i,
              columns: columns
            });
            (0, _type.isNumeric)(height) && $cell.css('height', height);
            $row.append($cell);
          }

          that.setAria('role', 'presentation', $row);
          return $row;
        },
        _appendEmptyRow: function _appendEmptyRow($table, $emptyRow, location) {
          var $tBodies = this._getBodies($table);

          var isTableContainer = !$tBodies.length || $emptyRow.is('tbody');
          var $container = isTableContainer ? $table : $tBodies;

          if (location === 'top') {
            $container.first().prepend($emptyRow);

            if (isTableContainer) {
              var $colgroup = $container.children('colgroup');
              $container.prepend($colgroup);
            }
          } else {
            $container.last().append($emptyRow);
          }
        },
        _renderFreeSpaceRow: function _renderFreeSpaceRow($tableElement) {
          var $freeSpaceRowElement = this._createEmptyRow(FREE_SPACE_CLASS);

          $freeSpaceRowElement = this._wrapRowIfNeed($tableElement, $freeSpaceRowElement);

          this._appendEmptyRow($tableElement, $freeSpaceRowElement);
        },
        _checkRowKeys: function _checkRowKeys(options) {
          var that = this;

          var rows = that._getRows(options);

          var keyExpr = that._dataController.store() && that._dataController.store().key();

          keyExpr && rows.some(function (row) {
            if (row.rowType === 'data' && row.key === undefined) {
              that._dataController.fireError('E1046', keyExpr);

              return true;
            }
          });
        },
        _needUpdateRowHeight: function _needUpdateRowHeight(itemsCount) {
          return itemsCount > 0 && !this._rowHeight;
        },
        _getRowsHeight: function _getRowsHeight($tableElement) {
          var $rowElements = $tableElement.children('tbody').children().not('.dx-virtual-row').not('.' + FREE_SPACE_CLASS);
          return $rowElements.toArray().reduce(function (sum, row) {
            return sum + (0, _position.getBoundingRect)(row).height;
          }, 0);
        },
        _updateRowHeight: function _updateRowHeight() {
          var that = this;
          var $tableElement = that.getTableElement();

          var itemsCount = that._dataController.items().length;

          if ($tableElement && that._needUpdateRowHeight(itemsCount)) {
            var rowsHeight = that._getRowsHeight($tableElement);

            that._rowHeight = rowsHeight / itemsCount;
          }
        },
        _findContentElement: function _findContentElement() {
          var $content = this.element();
          var scrollable = this.getScrollable();

          if ($content) {
            if (scrollable) {
              $content = (0, _renderer.default)(scrollable.content());
            }

            return $content.children().first();
          }
        },
        _getRowElements: function _getRowElements(tableElement) {
          var $rows = this.callBase(tableElement);
          return $rows && $rows.not('.' + FREE_SPACE_CLASS);
        },
        _getFreeSpaceRowElements: function _getFreeSpaceRowElements($table) {
          var tableElements = $table || this.getTableElements();
          return tableElements && tableElements.children('tbody').children('.' + FREE_SPACE_CLASS);
        },
        _getNoDataText: function _getNoDataText() {
          return this.option('noDataText');
        },
        _rowClick: function _rowClick(e) {
          var item = this._dataController.items()[e.rowIndex] || {};
          this.executeAction('onRowClick', (0, _extend.extend)({
            evaluate: function evaluate(expr) {
              var getter = (0, _data.compileGetter)(expr);
              return getter(item.data);
            }
          }, e, item));
        },
        _rowDblClick: function _rowDblClick(e) {
          var item = this._dataController.items()[e.rowIndex] || {};
          this.executeAction('onRowDblClick', (0, _extend.extend)({}, e, item));
        },
        _getColumnsCountBeforeGroups: function _getColumnsCountBeforeGroups(columns) {
          for (var i = 0; i < columns.length; i++) {
            if (columns[i].type === 'groupExpand') {
              return i;
            }
          }

          return 0;
        },
        _getGroupCellOptions: function _getGroupCellOptions(options) {
          var columnsCountBeforeGroups = this._getColumnsCountBeforeGroups(options.columns);

          var columnIndex = (options.row.groupIndex || 0) + columnsCountBeforeGroups;
          return {
            columnIndex: columnIndex,
            colspan: options.columns.length - columnIndex - 1
          };
        },
        _renderCells: function _renderCells($row, options) {
          if (options.row.rowType === 'group') {
            this._renderGroupedCells($row, options);
          } else if (options.row.values) {
            this.callBase($row, options);
          }
        },
        _renderGroupedCells: function _renderGroupedCells($row, options) {
          var row = options.row;
          var expandColumn;
          var columns = options.columns;
          var rowIndex = row.rowIndex;
          var isExpanded;

          var groupCellOptions = this._getGroupCellOptions(options);

          for (var i = 0; i <= groupCellOptions.columnIndex; i++) {
            if (i === groupCellOptions.columnIndex && columns[i].allowCollapsing && options.scrollingMode !== 'infinite') {
              isExpanded = !!row.isExpanded;
              expandColumn = columns[i];
            } else {
              isExpanded = null;
              expandColumn = {
                command: 'expand',
                cssClass: columns[i].cssClass
              };
            }

            if (this._needRenderCell(i, options.columnIndices)) {
              this._renderCell($row, {
                value: isExpanded,
                row: row,
                rowIndex: rowIndex,
                column: expandColumn,
                columnIndex: i,
                columnIndices: options.columnIndices
              });
            }
          }

          var groupColumnAlignment = (0, _position.getDefaultAlignment)(this.option('rtlEnabled'));
          var groupColumn = (0, _extend.extend)({}, columns[groupCellOptions.columnIndex], {
            command: null,
            type: null,
            cssClass: null,
            width: null,
            showWhenGrouped: false,
            alignment: groupColumnAlignment
          });

          if (groupCellOptions.colspan > 1) {
            groupColumn.colspan = groupCellOptions.colspan;
          }

          if (this._needRenderCell(groupCellOptions.columnIndex + 1, options.columnIndices)) {
            this._renderCell($row, {
              value: row.values[row.groupIndex],
              row: row,
              rowIndex: rowIndex,
              column: groupColumn,
              columnIndex: groupCellOptions.columnIndex + 1,
              columnIndices: options.columnIndices
            });
          }
        },
        _renderRows: function _renderRows($table, options) {
          var that = this;
          var scrollingMode = that.option('scrolling.mode');
          that.callBase($table, (0, _extend.extend)({
            scrollingMode: scrollingMode
          }, options));

          that._checkRowKeys(options.change);

          that._renderFreeSpaceRow($table);

          if (!that._hasHeight) {
            that.updateFreeSpaceRowHeight($table);
          }
        },
        _renderDataRowByTemplate: function _renderDataRowByTemplate($table, options, dataRowTemplate) {
          var row = options.row;
          var rowOptions = (0, _extend.extend)({
            columns: options.columns
          }, row);

          var $tbody = this._createRow(row, 'tbody');

          $tbody.appendTo($table);
          this.renderTemplate($tbody, dataRowTemplate, rowOptions, true, options.change);

          this._rowPrepared($tbody, rowOptions, options.row);
        },
        _renderRow: function _renderRow($table, options) {
          var row = options.row;
          var rowTemplate = this.option().rowTemplate;
          var dataRowTemplate = this.option('dataRowTemplate');

          if (row.rowType === 'data' && dataRowTemplate) {
            this._renderDataRowByTemplate($table, options, dataRowTemplate);
          } else if ((row.rowType === 'data' || row.rowType === 'group') && !(0, _type.isDefined)(row.groupIndex) && rowTemplate) {
            this.renderTemplate($table, rowTemplate, (0, _extend.extend)({
              columns: options.columns
            }, row), true);
          } else {
            this.callBase($table, options);
          }
        },
        _renderTable: function _renderTable(options) {
          var that = this;
          var $table = that.callBase(options);

          var resizeCompletedHandler = function resizeCompletedHandler() {
            var scrollableInstance = that.getScrollable();

            if (scrollableInstance && that.element().closest((0, _window.getWindow)().document).length) {
              that.resizeCompleted.remove(resizeCompletedHandler);

              scrollableInstance._visibilityChanged(true);
            }
          };

          if (!(0, _type.isDefined)(that.getTableElement())) {
            that.setTableElement($table);

            that._renderScrollable(true);

            that.resizeCompleted.add(resizeCompletedHandler);
          } else {
            that._renderScrollable();
          }

          return $table;
        },
        _createTable: function _createTable() {
          var $table = this.callBase.apply(this, arguments);

          if (this.option().rowTemplate || this.option().dataRowTemplate) {
            $table.appendTo(this.component.$element());
          }

          return $table;
        },
        _renderCore: function _renderCore(change) {
          var $element = this.element();
          $element.addClass(this.addWidgetPrefix(ROWS_VIEW_CLASS)).toggleClass(this.addWidgetPrefix(NOWRAP_CLASS), !this.option('wordWrapEnabled'));
          $element.toggleClass(EMPTY_CLASS, this._dataController.isEmpty());
          this.setAria('role', 'presentation', $element);

          var $table = this._renderTable({
            change: change
          });

          this._updateContent($table, change);

          this.callBase(change);
          this._lastColumnWidths = null;
        },
        _getRows: function _getRows(change) {
          return change && change.items || this._dataController.items();
        },
        _getCellOptions: function _getCellOptions(options) {
          var that = this;
          var column = options.column;
          var row = options.row;
          var data = row.data;
          var summaryCells = row && row.summaryCells;
          var value = options.value;

          var displayValue = _uiGrid_core.default.getDisplayValue(column, value, data, row.rowType);

          var parameters = this.callBase(options);
          parameters.value = value;
          parameters.oldValue = options.oldValue;
          parameters.displayValue = displayValue;
          parameters.row = row;
          parameters.key = row.key;
          parameters.data = data;
          parameters.rowType = row.rowType;
          parameters.values = row.values;
          parameters.text = !column.command ? _uiGrid_core.default.formatValue(displayValue, column) : '';
          parameters.rowIndex = row.rowIndex;
          parameters.summaryItems = summaryCells && summaryCells[options.columnIndex];
          parameters.resized = column.resizedCallbacks;

          if ((0, _type.isDefined)(column.groupIndex) && !column.command) {
            var groupingTextsOptions = that.option('grouping.texts');
            var scrollingMode = that.option('scrolling.mode');

            if (scrollingMode !== 'virtual' && scrollingMode !== 'infinite') {
              parameters.groupContinuesMessage = data && data.isContinuationOnNextPage && groupingTextsOptions && groupingTextsOptions.groupContinuesMessage;
              parameters.groupContinuedMessage = data && data.isContinuation && groupingTextsOptions && groupingTextsOptions.groupContinuedMessage;
            }
          }

          return parameters;
        },
        _setRowsOpacityCore: function _setRowsOpacityCore($rows, visibleColumns, columnIndex, value) {
          var columnsController = this._columnsController;
          var columns = columnsController.getColumns();
          var column = columns && columns[columnIndex];
          var columnID = column && column.isBand && column.index;
          (0, _iterator.each)($rows, function (rowIndex, row) {
            if (!(0, _renderer.default)(row).hasClass(GROUP_ROW_CLASS)) {
              for (var i = 0; i < visibleColumns.length; i++) {
                if ((0, _type.isNumeric)(columnID) && columnsController.isParentBandColumn(visibleColumns[i].index, columnID) || visibleColumns[i].index === columnIndex) {
                  $rows.eq(rowIndex).children().eq(i).css({
                    opacity: value
                  });

                  if (!(0, _type.isNumeric)(columnID)) {
                    break;
                  }
                }
              }
            }
          });
        },
        _getDevicePixelRatio: function _getDevicePixelRatio() {
          return (0, _window.getWindow)().devicePixelRatio;
        },
        renderNoDataText: _uiGrid_core.default.renderNoDataText,
        getCellOptions: function getCellOptions(rowIndex, columnIdentifier) {
          var rowOptions = this._dataController.items()[rowIndex];

          var cellOptions;
          var column;

          if (rowOptions) {
            if ((0, _type.isString)(columnIdentifier)) {
              column = this._columnsController.columnOption(columnIdentifier);
            } else {
              column = this._columnsController.getVisibleColumns()[columnIdentifier];
            }

            if (column) {
              cellOptions = this._getCellOptions({
                value: column.calculateCellValue(rowOptions.data),
                rowIndex: rowOptions.rowIndex,
                row: rowOptions,
                column: column
              });
            }
          }

          return cellOptions;
        },
        getRow: function getRow(index) {
          if (index >= 0) {
            var rows = this._getRowElements();

            if (rows.length > index) {
              return (0, _renderer.default)(rows[index]);
            }
          }
        },
        updateFreeSpaceRowHeight: function updateFreeSpaceRowHeight($table) {
          var _this3 = this;

          var dataController = this._dataController;
          var itemCount = dataController.items(true).length;

          var contentElement = this._findContentElement();

          var freeSpaceRowElements = this._getFreeSpaceRowElements($table);

          if (freeSpaceRowElements && contentElement && dataController.totalCount() >= 0) {
            var isFreeSpaceRowVisible = false;

            if (itemCount > 0) {
              if (!this._hasHeight) {
                var freeSpaceRowCount = dataController.pageSize() - itemCount;
                var scrollingMode = this.option('scrolling.mode');

                if (freeSpaceRowCount > 0 && dataController.pageCount() > 1 && scrollingMode !== 'virtual' && scrollingMode !== 'infinite') {
                  (0, _style.setHeight)(freeSpaceRowElements, freeSpaceRowCount * this._rowHeight);
                  isFreeSpaceRowVisible = true;
                }

                if (!isFreeSpaceRowVisible && $table) {
                  (0, _style.setHeight)(freeSpaceRowElements, 0);
                } else {
                  freeSpaceRowElements.toggle(isFreeSpaceRowVisible);
                }

                this._updateLastRowBorder(isFreeSpaceRowVisible);
              } else {
                freeSpaceRowElements.hide();
                (0, _common.deferUpdate)(function () {
                  var scrollbarWidth = _this3.getScrollbarWidth(true);

                  var elementHeightWithoutScrollbar = (0, _size.getHeight)(_this3.element()) - scrollbarWidth;
                  var contentHeight = (0, _size.getOuterHeight)(contentElement);
                  var showFreeSpaceRow = elementHeightWithoutScrollbar - contentHeight > 0;

                  var rowsHeight = _this3._getRowsHeight(contentElement.children().first());

                  var $tableElement = $table || _this3.getTableElements();

                  var borderTopWidth = Math.ceil(parseFloat($tableElement.css('borderTopWidth')));

                  var heightCorrection = _this3._getHeightCorrection();

                  var resultHeight = elementHeightWithoutScrollbar - rowsHeight - borderTopWidth - heightCorrection;

                  if (showFreeSpaceRow) {
                    (0, _common.deferRender)(function () {
                      freeSpaceRowElements.css('height', resultHeight);
                      isFreeSpaceRowVisible = true;
                      freeSpaceRowElements.show();
                    });
                  }

                  (0, _common.deferRender)(function () {
                    return _this3._updateLastRowBorder(isFreeSpaceRowVisible);
                  });
                });
              }
            } else {
              freeSpaceRowElements.css('height', 0);
              freeSpaceRowElements.show();

              this._updateLastRowBorder(true);
            }
          }
        },
        _getHeightCorrection: function _getHeightCorrection() {
          var isZoomedWebkit = _browser.default.webkit && this._getDevicePixelRatio() >= 2; // T606935

          var isChromeLatest = _browser.default.chrome && _browser.default.version >= 91;
          var hasExtraBorderTop = _browser.default.mozilla && _browser.default.version >= 70 && !this.option('showRowLines');
          return isZoomedWebkit || hasExtraBorderTop || isChromeLatest ? 1 : 0;
        },
        _columnOptionChanged: function _columnOptionChanged(e) {
          var optionNames = e.optionNames;
          if (e.changeTypes.grouping) return;

          if (optionNames.width || optionNames.visibleWidth) {
            this.callBase(e);

            this._fireColumnResizedCallbacks();
          }
        },
        getScrollable: function getScrollable() {
          return this._scrollable;
        },
        init: function init() {
          var that = this;
          var dataController = that.getController('data');
          that.callBase();
          that._editorFactoryController = that.getController('editorFactory');
          that._rowHeight = 0;
          that._scrollTop = 0;
          that._scrollLeft = -1;
          that._scrollRight = 0;
          that._hasHeight = false;
          dataController.loadingChanged.add(function (isLoading, messageText) {
            that.setLoading(isLoading, messageText);
          });
          dataController.dataSourceChanged.add(function () {
            if (that._scrollLeft >= 0) {
              that._handleScroll({
                component: that.getScrollable(),
                scrollOffset: {
                  top: that._scrollTop,
                  left: that._scrollLeft
                }
              });
            }
          });
        },
        _handleDataChanged: function _handleDataChanged(change) {
          var that = this;

          switch (change.changeType) {
            case 'refresh':
            case 'prepend':
            case 'append':
            case 'update':
              that.render(null, change);
              break;

            default:
              that._update(change);

              break;
          }
        },
        publicMethods: function publicMethods() {
          return ['isScrollbarVisible', 'getTopVisibleRowData', 'getScrollbarWidth', 'getCellElement', 'getRowElement', 'getScrollable'];
        },
        contentWidth: function contentWidth() {
          return (0, _size.getWidth)(this.element()) - this.getScrollbarWidth();
        },
        getScrollbarWidth: function getScrollbarWidth(isHorizontal) {
          var scrollableContainer = this._scrollableContainer && this._scrollableContainer.get(0);

          var scrollbarWidth = 0;

          if (scrollableContainer) {
            if (!isHorizontal) {
              scrollbarWidth = scrollableContainer.clientWidth ? scrollableContainer.offsetWidth - scrollableContainer.clientWidth : 0;
            } else {
              scrollbarWidth = scrollableContainer.clientHeight ? scrollableContainer.offsetHeight - scrollableContainer.clientHeight : 0;
              scrollbarWidth += getScrollableBottomPadding(this); // T703649, T697699
            }
          }

          return scrollbarWidth > 0 ? scrollbarWidth : 0;
        },
        // TODO remove this call, move _fireColumnResizedCallbacks functionality to columnsController
        _fireColumnResizedCallbacks: function _fireColumnResizedCallbacks() {
          var that = this;
          var lastColumnWidths = that._lastColumnWidths || [];
          var columnWidths = [];
          var columns = that.getColumns();

          for (var i = 0; i < columns.length; i++) {
            columnWidths[i] = columns[i].visibleWidth;

            if (columns[i].resizedCallbacks && !(0, _type.isDefined)(columns[i].groupIndex) && lastColumnWidths[i] !== columnWidths[i]) {
              columns[i].resizedCallbacks.fire(columnWidths[i]);
            }
          }

          that._lastColumnWidths = columnWidths;
        },
        _updateLastRowBorder: function _updateLastRowBorder(isFreeSpaceRowVisible) {
          if (this.option('showBorders') && this.option('showRowLines') && !isFreeSpaceRowVisible) {
            this.element().addClass(LAST_ROW_BORDER);
          } else {
            this.element().removeClass(LAST_ROW_BORDER);
          }
        },
        _updateScrollable: function _updateScrollable() {
          var dxScrollable = _ui.default.getInstance(this.element());

          if (dxScrollable) {
            dxScrollable.update();

            this._updateHorizontalScrollPosition();
          }
        },
        _updateHorizontalScrollPosition: function _updateHorizontalScrollPosition() {
          var scrollable = this.getScrollable();
          var scrollLeft = scrollable && scrollable.scrollOffset().left;
          var rtlEnabled = this.option('rtlEnabled');

          if (rtlEnabled) {
            var maxHorizontalScrollOffset = getMaxHorizontalScrollOffset(scrollable);
            var scrollRight = maxHorizontalScrollOffset - scrollLeft;

            if (scrollRight !== this._scrollRight) {
              this._scrollLeft = maxHorizontalScrollOffset - this._scrollRight;
            }
          }

          if (this._scrollLeft >= 0 && scrollLeft !== this._scrollLeft) {
            scrollable.scrollTo({
              x: this._scrollLeft
            });
          }
        },
        _resizeCore: function _resizeCore() {
          var that = this;

          that._fireColumnResizedCallbacks();

          that._updateRowHeight();

          (0, _common.deferRender)(function () {
            that._renderScrollable();

            that.renderNoDataText();
            that.updateFreeSpaceRowHeight();
            (0, _common.deferUpdate)(function () {
              that._updateScrollable();
            });
          });
        },
        scrollTo: function scrollTo(location) {
          var $element = this.element();

          var dxScrollable = $element && _ui.default.getInstance($element);

          if (dxScrollable) {
            dxScrollable.scrollTo(location);
          }
        },
        height: function height(_height, hasHeight) {
          var that = this;
          var $element = this.element();

          if (arguments.length === 0) {
            return $element ? (0, _size.getOuterHeight)($element, true) : 0;
          }

          that._hasHeight = hasHeight === undefined ? _height !== 'auto' : hasHeight;

          if ((0, _type.isDefined)(_height) && $element) {
            (0, _style.setHeight)($element, _height);
          }
        },
        setLoading: function setLoading(isLoading, messageText) {
          var that = this;
          var loadPanel = that._loadPanel;
          var dataController = that._dataController;
          var loadPanelOptions = that.option('loadPanel') || {};
          var animation = dataController.isLoaded() ? loadPanelOptions.animation : null;
          var $element = that.element();

          if (!(0, _window.hasWindow)()) {
            return;
          }

          if (!loadPanel && messageText !== undefined && dataController.isLocalStore() && loadPanelOptions.enabled === 'auto' && $element) {
            that._renderLoadPanel($element, $element.parent());

            loadPanel = that._loadPanel;
          }

          if (loadPanel) {
            var visibilityOptions = {
              message: messageText || loadPanelOptions.text,
              animation: animation,
              visible: isLoading
            };

            if (isLoading) {
              visibilityOptions.position = _uiGrid_core.default.calculateLoadPanelPosition($element);
            }

            clearTimeout(that._hideLoadingTimeoutID);

            if (loadPanel.option('visible') && !isLoading) {
              that._hideLoadingTimeoutID = setTimeout(function () {
                loadPanel.option(visibilityOptions);
              }, LOADPANEL_HIDE_TIMEOUT);
            } else {
              loadPanel.option(visibilityOptions);
            }
          }
        },
        setRowsOpacity: function setRowsOpacity(columnIndex, value) {
          var $rows = this._getRowElements().not('.' + GROUP_ROW_CLASS) || [];

          this._setRowsOpacityCore($rows, this.getColumns(), columnIndex, value);
        },
        _getCellElementsCore: function _getCellElementsCore(rowIndex) {
          var $cells = this.callBase.apply(this, arguments);

          if ($cells) {
            var groupCellIndex = $cells.filter('.' + GROUP_CELL_CLASS).index();

            if (groupCellIndex >= 0 && $cells.length > groupCellIndex + 1) {
              return $cells.slice(0, groupCellIndex + 1);
            }
          }

          return $cells;
        },
        _getBoundaryVisibleItemIndex: function _getBoundaryVisibleItemIndex(isTop, isFloor) {
          var that = this;
          var itemIndex = 0;
          var prevOffset = 0;
          var offset = 0;
          var viewportBoundary = that._scrollTop;

          var $contentElement = that._findContentElement();

          var contentElementOffsetTop = $contentElement && $contentElement.offset().top;
          var dataController = this.getController('data');
          var items = dataController.items();
          var tableElement = that.getTableElement();

          if (items.length && tableElement) {
            var rowElements = that._getRowElements(tableElement).filter(':visible');

            if (!isTop) {
              var height = this._hasHeight ? (0, _size.getOuterHeight)(this.element()) : (0, _renderer.default)((0, _window.getWindow)()).outerHeight();
              viewportBoundary += height;
            }

            for (itemIndex = 0; itemIndex < items.length; itemIndex++) {
              prevOffset = offset;
              var $rowElement = (0, _renderer.default)(rowElements).eq(itemIndex);

              if ($rowElement.length) {
                offset = $rowElement.offset();
                offset = (isTop ? offset.top : offset.top + (0, _size.getOuterHeight)($rowElement)) - contentElementOffsetTop;

                if (offset > viewportBoundary) {
                  if (itemIndex) {
                    if (isFloor || viewportBoundary * 2 < Math.round(offset + prevOffset)) {
                      itemIndex--;
                    }
                  }

                  break;
                }
              }
            }

            if (itemIndex && itemIndex === items.length) {
              itemIndex--;
            }
          }

          return itemIndex;
        },
        getTopVisibleItemIndex: function getTopVisibleItemIndex(isFloor) {
          return this._getBoundaryVisibleItemIndex(true, isFloor);
        },
        getBottomVisibleItemIndex: function getBottomVisibleItemIndex(isFloor) {
          return this._getBoundaryVisibleItemIndex(false, isFloor);
        },
        getTopVisibleRowData: function getTopVisibleRowData() {
          var itemIndex = this.getTopVisibleItemIndex();

          var items = this._dataController.items();

          if (items[itemIndex]) {
            return items[itemIndex].data;
          }
        },
        _scrollToElement: function _scrollToElement($element, offset) {
          var scrollable = this.getScrollable();
          scrollable && scrollable.scrollToElement($element, offset);
        },
        optionChanged: function optionChanged(args) {
          var that = this;
          that.callBase(args);

          switch (args.name) {
            case 'wordWrapEnabled':
            case 'showColumnLines':
            case 'showRowLines':
            case 'rowAlternationEnabled':
            case 'rowTemplate':
            case 'dataRowTemplate':
            case 'twoWayBindingEnabled':
              that._invalidate(true, true);

              args.handled = true;
              break;

            case 'scrolling':
              that._rowHeight = null;
              that._tableElement = null;
              args.handled = true;
              break;

            case 'rtlEnabled':
              that._rowHeight = null;
              that._tableElement = null;
              break;

            case 'loadPanel':
              that._tableElement = null;

              that._invalidate(true, args.fullName !== 'loadPanel.enabled');

              args.handled = true;
              break;

            case 'noDataText':
              that.renderNoDataText();
              args.handled = true;
              break;
          }
        },
        dispose: function dispose() {
          clearTimeout(this._hideLoadingTimeoutID);
          this._scrollable && this._scrollable.dispose();
        },
        setScrollerSpacing: function setScrollerSpacing() {},
        _restoreErrorRow: function _restoreErrorRow() {}
      };
    }())
  }
};
exports.rowsModule = rowsModule;