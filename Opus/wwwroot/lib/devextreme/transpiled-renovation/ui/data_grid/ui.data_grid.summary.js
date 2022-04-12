"use strict";

exports.renderSummaryCell = exports.FooterView = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _common = require("../../core/utils/common");

var _type = require("../../core/utils/type");

var _iterator = require("../../core/utils/iterator");

var _extend = require("../../core/utils/extend");

var _data = require("../../core/utils/data");

var _ui = _interopRequireDefault(require("../widget/ui.errors"));

var _uiData_grid = _interopRequireDefault(require("./ui.data_grid.core"));

var _message = _interopRequireDefault(require("../../localization/message"));

var _uiData_grid2 = _interopRequireDefault(require("./ui.data_grid.data_source_adapter"));

var _uiGrid_core = require("../grid_core/ui.grid_core.columns_view");

var _aggregate_calculator = _interopRequireDefault(require("./aggregate_calculator"));

var _query = _interopRequireDefault(require("../../data/query"));

var _store_helper = _interopRequireDefault(require("../../data/store_helper"));

var _utils = require("../../data/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DATAGRID_TOTAL_FOOTER_CLASS = 'dx-datagrid-total-footer';
var DATAGRID_SUMMARY_ITEM_CLASS = 'dx-datagrid-summary-item';
var DATAGRID_TEXT_CONTENT_CLASS = 'dx-datagrid-text-content';
var DATAGRID_GROUP_FOOTER_CLASS = 'dx-datagrid-group-footer';
var DATAGRID_GROUP_TEXT_CONTENT_CLASS = 'dx-datagrid-group-text-content';
var DATAGRID_NOWRAP_CLASS = 'dx-datagrid-nowrap';
var DATAGRID_GROUP_FOOTER_ROW_TYPE = 'groupFooter';

var renderSummaryCell = function renderSummaryCell(cell, options) {
  var $cell = (0, _renderer.default)(cell);
  var column = options.column;
  var summaryItems = options.summaryItems;
  var $summaryItems = [];

  if (!column.command && summaryItems) {
    for (var i = 0; i < summaryItems.length; i++) {
      var summaryItem = summaryItems[i];
      $summaryItems.push((0, _renderer.default)('<div>').css('textAlign', summaryItem.alignment || column.alignment).addClass(DATAGRID_SUMMARY_ITEM_CLASS).addClass(DATAGRID_TEXT_CONTENT_CLASS).addClass(summaryItem.cssClass).toggleClass(DATAGRID_GROUP_TEXT_CONTENT_CLASS, options.rowType === 'group').text(_uiData_grid.default.getSummaryText(summaryItem, options.summaryTexts)));
    }

    $cell.append($summaryItems);
  }
};

exports.renderSummaryCell = renderSummaryCell;

var getSummaryCellOptions = function getSummaryCellOptions(that, options) {
  var summaryTexts = that.option('summary.texts') || {};
  return {
    totalItem: options.row,
    summaryItems: options.row.summaryCells[options.columnIndex],
    summaryTexts: summaryTexts
  };
};

var getGroupAggregates = function getGroupAggregates(data) {
  return data.summary || data.aggregates || [];
};

var recalculateWhileEditing = function recalculateWhileEditing(that) {
  return that.option('summary.recalculateWhileEditing');
};

var FooterView = _uiGrid_core.ColumnsView.inherit(function () {
  return {
    _getRows: function _getRows() {
      return this._dataController.footerItems();
    },
    _getCellOptions: function _getCellOptions(options) {
      return (0, _extend.extend)(this.callBase(options), getSummaryCellOptions(this, options));
    },
    _renderCellContent: function _renderCellContent($cell, options) {
      renderSummaryCell($cell, options);
      this.callBase($cell, options);
    },
    _renderCore: function _renderCore(change) {
      var needUpdateScrollLeft = false;

      var totalItem = this._dataController.footerItems()[0];

      if (!change || !change.columnIndices) {
        this.element().empty().addClass(DATAGRID_TOTAL_FOOTER_CLASS).toggleClass(DATAGRID_NOWRAP_CLASS, !this.option('wordWrapEnabled'));
        needUpdateScrollLeft = true;
      }

      if (totalItem && totalItem.summaryCells && totalItem.summaryCells.length) {
        this._updateContent(this._renderTable({
          change: change
        }), change);

        needUpdateScrollLeft && this._updateScrollLeftPosition();
      }
    },
    _updateContent: function _updateContent($newTable, change) {
      if (change && change.changeType === 'update' && change.columnIndices) {
        var $row = this.getTableElement().find('.dx-row');
        var $newRow = $newTable.find('.dx-row');

        this._updateCells($row, $newRow, change.columnIndices[0]);
      } else {
        return this.callBase.apply(this, arguments);
      }
    },
    _rowClick: function _rowClick(e) {
      var item = this._dataController.footerItems()[e.rowIndex] || {};
      this.executeAction('onRowClick', (0, _extend.extend)({}, e, item));
    },
    _columnOptionChanged: function _columnOptionChanged(e) {
      var optionNames = e.optionNames;
      if (e.changeTypes.grouping) return;

      if (optionNames.width || optionNames.visibleWidth) {
        this.callBase(e);
      }
    },
    _handleDataChanged: function _handleDataChanged(e) {
      var changeType = e.changeType;

      if (e.changeType === 'update' && e.repaintChangesOnly) {
        if (!e.totalColumnIndices) {
          this.render();
        } else if (e.totalColumnIndices.length) {
          this.render(null, {
            changeType: 'update',
            columnIndices: [e.totalColumnIndices]
          });
        }
      } else if (changeType === 'refresh' || changeType === 'append' || changeType === 'prepend') {
        this.render();
      }
    },
    getHeight: function getHeight() {
      return this.getElementHeight();
    },
    isVisible: function isVisible() {
      return !!this._dataController.footerItems().length;
    }
  };
}());

exports.FooterView = FooterView;

var SummaryDataSourceAdapterExtender = function () {
  function forEachGroup(groups, groupCount, callback, path) {
    path = path || [];

    for (var i = 0; i < groups.length; i++) {
      path.push(groups[i].key);

      if (groupCount === 1) {
        callback(path, groups[i].items);
      } else {
        forEachGroup(groups[i].items, groupCount - 1, callback, path);
      }

      path.pop();
    }
  }

  return {
    init: function init() {
      this.callBase.apply(this, arguments);
      this._totalAggregates = [];
      this._summaryGetter = _common.noop;
    },
    summaryGetter: function summaryGetter(_summaryGetter) {
      if (!arguments.length) {
        return this._summaryGetter;
      }

      if ((0, _type.isFunction)(_summaryGetter)) {
        this._summaryGetter = _summaryGetter;
      }
    },
    summary: function summary(_summary) {
      if (!arguments.length) {
        return this._summaryGetter();
      }

      this._summaryGetter = function () {
        return _summary;
      };
    },
    totalAggregates: function totalAggregates() {
      return this._totalAggregates;
    },
    isLastLevelGroupItemsPagingLocal: function isLastLevelGroupItemsPagingLocal() {
      var summary = this.summary();
      var sortByGroupsInfo = summary && summary.sortByGroups();
      return sortByGroupsInfo && sortByGroupsInfo.length;
    },
    sortLastLevelGroupItems: function sortLastLevelGroupItems(items, groups, paths) {
      var groupedItems = _store_helper.default.multiLevelGroup((0, _query.default)(items), groups).toArray();

      var result = [];
      paths.forEach(function (path) {
        forEachGroup(groupedItems, groups.length, function (itemsPath, items) {
          if (path.toString() === itemsPath.toString()) {
            result = result.concat(items);
          }
        });
      });
      return result;
    }
  };
}();

var SummaryDataSourceAdapterClientExtender = function () {
  var applyAddedData = function applyAddedData(data, insertedData, groupLevel) {
    if (groupLevel) {
      return applyAddedData(data, insertedData.map(function (item) {
        return {
          items: [item]
        };
      }, groupLevel - 1));
    }

    return data.concat(insertedData);
  };

  var applyRemovedData = function applyRemovedData(data, removedData, groupLevel) {
    if (groupLevel) {
      return data.map(function (data) {
        var updatedData = {};
        var updatedItems = applyRemovedData(data.items || [], removedData, groupLevel - 1);
        Object.defineProperty(updatedData, 'aggregates', {
          get: function get() {
            return data.aggregates;
          },
          set: function set(value) {
            data.aggregates = value;
          }
        });
        return (0, _extend.extend)(updatedData, data, {
          items: updatedItems
        });
      });
    }

    return data.filter(function (data) {
      return removedData.indexOf(data) < 0;
    });
  };

  var calculateAggregates = function calculateAggregates(that, summary, data, groupLevel) {
    var calculator;

    if (recalculateWhileEditing(that)) {
      var editingController = that.getController('editing');

      if (editingController) {
        var insertedData = editingController.getInsertedData();

        if (insertedData.length) {
          data = applyAddedData(data, insertedData, groupLevel);
        }

        var removedData = editingController.getRemovedData();

        if (removedData.length) {
          data = applyRemovedData(data, removedData, groupLevel);
        }
      }
    }

    if (summary) {
      calculator = new _aggregate_calculator.default({
        totalAggregates: summary.totalAggregates,
        groupAggregates: summary.groupAggregates,
        data: data,
        groupLevel: groupLevel
      });
      calculator.calculate();
    }

    return calculator ? calculator.totalAggregates() : [];
  };

  var sortGroupsBySummaryCore = function sortGroupsBySummaryCore(items, groups, sortByGroups) {
    if (!items || !groups.length) return items;
    var group = groups[0];
    var sorts = sortByGroups[0];
    var query;

    if (group && sorts && sorts.length) {
      query = (0, _query.default)(items);
      (0, _iterator.each)(sorts, function (index) {
        if (index === 0) {
          query = query.sortBy(this.selector, this.desc);
        } else {
          query = query.thenBy(this.selector, this.desc);
        }
      });
      query.enumerate().done(function (sortedItems) {
        items = sortedItems;
      });
    }

    groups = groups.slice(1);
    sortByGroups = sortByGroups.slice(1);

    if (groups.length && sortByGroups.length) {
      (0, _iterator.each)(items, function () {
        this.items = sortGroupsBySummaryCore(this.items, groups, sortByGroups);
      });
    }

    return items;
  };

  var sortGroupsBySummary = function sortGroupsBySummary(data, group, summary) {
    var sortByGroups = summary && summary.sortByGroups && summary.sortByGroups();

    if (sortByGroups && sortByGroups.length) {
      return sortGroupsBySummaryCore(data, group, sortByGroups);
    }

    return data;
  };

  return {
    _customizeRemoteOperations: function _customizeRemoteOperations(options) {
      var summary = this.summary();

      if (summary) {
        if (options.remoteOperations.summary) {
          if (!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
            if (options.storeLoadOptions.group) {
              if (options.remoteOperations.grouping) {
                options.storeLoadOptions.groupSummary = summary.groupAggregates;
              } else if (summary.groupAggregates.length) {
                options.remoteOperations.paging = false;
              }
            }

            options.storeLoadOptions.totalSummary = summary.totalAggregates;
          }
        } else if (summary.totalAggregates.length || summary.groupAggregates.length && options.storeLoadOptions.group) {
          options.remoteOperations.paging = false;
        }
      }

      this.callBase.apply(this, arguments);
      var cachedExtra = options.cachedData.extra;

      if (cachedExtra && cachedExtra.summary && !options.isCustomLoading) {
        options.storeLoadOptions.totalSummary = undefined;
      }
    },
    _handleDataLoadedCore: function _handleDataLoadedCore(options) {
      var that = this;
      var groups = (0, _utils.normalizeSortingInfo)(options.storeLoadOptions.group || options.loadOptions.group || []);
      var remoteOperations = options.remoteOperations || {};
      var summary = that.summaryGetter()(remoteOperations);

      if (!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
        if (remoteOperations.summary) {
          if (!remoteOperations.paging && groups.length && summary) {
            if (!remoteOperations.grouping) {
              calculateAggregates(that, {
                groupAggregates: summary.groupAggregates
              }, options.data, groups.length);
            }

            options.data = sortGroupsBySummary(options.data, groups, summary);
          }
        } else if (!remoteOperations.paging && summary) {
          var _options$cachedData, _options$cachedData$e;

          var operationTypes = options.operationTypes || {};
          var hasOperations = Object.keys(operationTypes).some(function (type) {
            return operationTypes[type];
          });

          if (!hasOperations || !((_options$cachedData = options.cachedData) !== null && _options$cachedData !== void 0 && (_options$cachedData$e = _options$cachedData.extra) !== null && _options$cachedData$e !== void 0 && _options$cachedData$e.summary) || groups.length && summary.groupAggregates.length) {
            var totalAggregates = calculateAggregates(that, summary, options.data, groups.length);
            options.extra = (0, _type.isPlainObject)(options.extra) ? options.extra : {};
            options.extra.summary = totalAggregates;

            if (options.cachedData) {
              options.cachedData.extra = options.extra;
            }
          }

          options.data = sortGroupsBySummary(options.data, groups, summary);
        }
      }

      if (!options.isCustomLoading) {
        that._totalAggregates = options.extra && options.extra.summary || that._totalAggregates;
      }

      that.callBase(options);
    }
  };
}();

_uiData_grid2.default.extend(SummaryDataSourceAdapterExtender);

_uiData_grid2.default.extend(SummaryDataSourceAdapterClientExtender);

_uiData_grid.default.registerModule('summary', {
  defaultOptions: function defaultOptions() {
    return {
      summary: {
        groupItems: undefined,
        totalItems: undefined,
        calculateCustomSummary: undefined,
        skipEmptyValues: true,
        recalculateWhileEditing: false,
        texts: {
          sum: _message.default.format('dxDataGrid-summarySum'),
          sumOtherColumn: _message.default.format('dxDataGrid-summarySumOtherColumn'),
          min: _message.default.format('dxDataGrid-summaryMin'),
          minOtherColumn: _message.default.format('dxDataGrid-summaryMinOtherColumn'),
          max: _message.default.format('dxDataGrid-summaryMax'),
          maxOtherColumn: _message.default.format('dxDataGrid-summaryMaxOtherColumn'),
          avg: _message.default.format('dxDataGrid-summaryAvg'),
          avgOtherColumn: _message.default.format('dxDataGrid-summaryAvgOtherColumn'),
          count: _message.default.format('dxDataGrid-summaryCount')
        }
      },
      sortByGroupSummaryInfo: undefined
    };
  },
  views: {
    footerView: FooterView
  },
  extenders: {
    controllers: {
      data: function () {
        return {
          _isDataColumn: function _isDataColumn(column) {
            return column && (!(0, _type.isDefined)(column.groupIndex) || column.showWhenGrouped);
          },
          _isGroupFooterVisible: function _isGroupFooterVisible() {
            var groupItems = this.option('summary.groupItems') || [];

            for (var i = 0; i < groupItems.length; i++) {
              var groupItem = groupItems[i];

              var column = this._columnsController.columnOption(groupItem.showInColumn || groupItem.column);

              if (groupItem.showInGroupFooter && this._isDataColumn(column)) {
                return true;
              }
            }

            return false;
          },
          _processGroupItems: function _processGroupItems(items, groupCount, options) {
            var data = options && options.data;
            var result = this.callBase.apply(this, arguments);

            if (options) {
              if (options.isGroupFooterVisible === undefined) {
                options.isGroupFooterVisible = this._isGroupFooterVisible();
              }

              if (data && data.items && options.isGroupFooterVisible && (options.collectContinuationItems || !data.isContinuationOnNextPage)) {
                result.push({
                  rowType: DATAGRID_GROUP_FOOTER_ROW_TYPE,
                  key: options.path.slice(),
                  data: data,
                  groupIndex: options.path.length - 1,
                  values: []
                });
              }
            }

            return result;
          },
          _processGroupItem: function _processGroupItem(groupItem, options) {
            var that = this;

            if (!options.summaryGroupItems) {
              options.summaryGroupItems = that.option('summary.groupItems') || [];
            }

            if (groupItem.rowType === 'group') {
              var groupColumnIndex = -1;
              var afterGroupColumnIndex = -1;
              (0, _iterator.each)(options.visibleColumns, function (visibleIndex) {
                var prevColumn = options.visibleColumns[visibleIndex - 1];

                if (groupItem.groupIndex === this.groupIndex) {
                  groupColumnIndex = this.index;
                }

                if (visibleIndex > 0 && prevColumn.command === 'expand' && this.command !== 'expand') {
                  afterGroupColumnIndex = this.index;
                }
              });
              groupItem.summaryCells = this._calculateSummaryCells(options.summaryGroupItems, getGroupAggregates(groupItem.data), options.visibleColumns, function (summaryItem, column) {
                if (summaryItem.showInGroupFooter) {
                  return -1;
                }

                if (summaryItem.alignByColumn && column && !(0, _type.isDefined)(column.groupIndex) && column.index !== afterGroupColumnIndex) {
                  return column.index;
                } else {
                  return groupColumnIndex;
                }
              }, true);
            }

            if (groupItem.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE) {
              groupItem.summaryCells = this._calculateSummaryCells(options.summaryGroupItems, getGroupAggregates(groupItem.data), options.visibleColumns, function (summaryItem, column) {
                return summaryItem.showInGroupFooter && that._isDataColumn(column) ? column.index : -1;
              });
            }

            return groupItem;
          },
          _calculateSummaryCells: function _calculateSummaryCells(summaryItems, aggregates, visibleColumns, calculateTargetColumnIndex, isGroupRow) {
            var that = this;
            var summaryCells = [];
            var summaryCellsByColumns = {};
            (0, _iterator.each)(summaryItems, function (summaryIndex, summaryItem) {
              var column = that._columnsController.columnOption(summaryItem.column);

              var showInColumn = summaryItem.showInColumn && that._columnsController.columnOption(summaryItem.showInColumn) || column;
              var columnIndex = calculateTargetColumnIndex(summaryItem, showInColumn);

              if (columnIndex >= 0) {
                if (!summaryCellsByColumns[columnIndex]) {
                  summaryCellsByColumns[columnIndex] = [];
                }

                var aggregate = aggregates[summaryIndex];

                if (aggregate === aggregate) {
                  var valueFormat;

                  if ((0, _type.isDefined)(summaryItem.valueFormat)) {
                    valueFormat = summaryItem.valueFormat;
                  } else if (summaryItem.summaryType !== 'count') {
                    valueFormat = _uiData_grid.default.getFormatByDataType(column && column.dataType);
                  }

                  summaryCellsByColumns[columnIndex].push((0, _extend.extend)({}, summaryItem, {
                    value: (0, _type.isString)(aggregate) && column && column.deserializeValue ? column.deserializeValue(aggregate) : aggregate,
                    valueFormat: valueFormat,
                    columnCaption: column && column.index !== columnIndex ? column.caption : undefined
                  }));
                }
              }
            });

            if (!(0, _type.isEmptyObject)(summaryCellsByColumns)) {
              visibleColumns.forEach(function (column, visibleIndex) {
                var prevColumn = visibleColumns[visibleIndex - 1];
                var columnIndex = isGroupRow && ((prevColumn === null || prevColumn === void 0 ? void 0 : prevColumn.command) === 'expand' || column.command === 'expand') ? prevColumn === null || prevColumn === void 0 ? void 0 : prevColumn.index : column.index;
                summaryCells.push(summaryCellsByColumns[columnIndex] || []);
              });
            }

            return summaryCells;
          },
          _getSummaryCells: function _getSummaryCells(summaryTotalItems, totalAggregates) {
            var that = this;
            var columnsController = that._columnsController;
            return that._calculateSummaryCells(summaryTotalItems, totalAggregates, columnsController.getVisibleColumns(), function (summaryItem, column) {
              return that._isDataColumn(column) ? column.index : -1;
            });
          },
          _updateItemsCore: function _updateItemsCore(change) {
            var that = this;
            var summaryCells;
            var dataSource = that._dataSource;
            var footerItems = that._footerItems;
            var oldSummaryCells = footerItems && footerItems[0] && footerItems[0].summaryCells;
            var summaryTotalItems = that.option('summary.totalItems');
            that._footerItems = [];

            if (dataSource && summaryTotalItems && summaryTotalItems.length) {
              var totalAggregates = dataSource.totalAggregates();
              summaryCells = that._getSummaryCells(summaryTotalItems, totalAggregates);

              if (change && change.repaintChangesOnly && oldSummaryCells) {
                change.totalColumnIndices = summaryCells.map(function (summaryCell, index) {
                  if (JSON.stringify(summaryCell) !== JSON.stringify(oldSummaryCells[index])) {
                    return index;
                  }

                  return -1;
                }).filter(function (index) {
                  return index >= 0;
                });
              }

              if (summaryCells.length) {
                that._footerItems.push({
                  rowType: 'totalFooter',
                  summaryCells: summaryCells
                });
              }
            }

            that.callBase(change);
          },
          _prepareUnsavedDataSelector: function _prepareUnsavedDataSelector(selector) {
            var that = this;

            if (recalculateWhileEditing(that)) {
              var editingController = that.getController('editing');

              if (editingController) {
                return function (data) {
                  data = editingController.getUpdatedData(data);
                  return selector(data);
                };
              }
            }

            return selector;
          },
          _prepareAggregateSelector: function _prepareAggregateSelector(selector, aggregator) {
            selector = this._prepareUnsavedDataSelector(selector);

            if (aggregator === 'avg' || aggregator === 'sum') {
              return function (data) {
                var value = selector(data);
                return (0, _type.isDefined)(value) ? Number(value) : value;
              };
            }

            return selector;
          },
          _getAggregates: function _getAggregates(summaryItems, remoteOperations) {
            var that = this;
            var columnsController = that.getController('columns');
            var calculateCustomSummary = that.option('summary.calculateCustomSummary');
            var commonSkipEmptyValues = that.option('summary.skipEmptyValues');
            return (0, _iterator.map)(summaryItems || [], function (summaryItem) {
              var column = columnsController.columnOption(summaryItem.column);
              var calculateCellValue = column && column.calculateCellValue ? column.calculateCellValue.bind(column) : (0, _data.compileGetter)(column ? column.dataField : summaryItem.column);
              var aggregator = summaryItem.summaryType || 'count';
              var selector = summaryItem.column;
              var skipEmptyValues = (0, _type.isDefined)(summaryItem.skipEmptyValues) ? summaryItem.skipEmptyValues : commonSkipEmptyValues;

              if (remoteOperations) {
                return {
                  selector: summaryItem.column,
                  summaryType: aggregator
                };
              } else {
                selector = that._prepareAggregateSelector(calculateCellValue, aggregator);

                if (aggregator === 'custom') {
                  if (!calculateCustomSummary) {
                    _ui.default.log('E1026');

                    calculateCustomSummary = function calculateCustomSummary() {};
                  }

                  var options = {
                    component: that.component,
                    name: summaryItem.name
                  };
                  calculateCustomSummary(options);
                  options.summaryProcess = 'calculate';
                  aggregator = {
                    seed: function seed(groupIndex) {
                      options.summaryProcess = 'start';
                      options.totalValue = undefined;
                      options.groupIndex = groupIndex;
                      delete options.value;
                      calculateCustomSummary(options);
                      return options.totalValue;
                    },
                    step: function step(totalValue, value) {
                      options.summaryProcess = 'calculate';
                      options.totalValue = totalValue;
                      options.value = value;
                      calculateCustomSummary(options);
                      return options.totalValue;
                    },
                    finalize: function finalize(totalValue) {
                      options.summaryProcess = 'finalize';
                      options.totalValue = totalValue;
                      delete options.value;
                      calculateCustomSummary(options);
                      return options.totalValue;
                    }
                  };
                }

                return {
                  selector: selector,
                  aggregator: aggregator,
                  skipEmptyValues: skipEmptyValues
                };
              }
            });
          },
          _addSortInfo: function _addSortInfo(sortByGroups, groupColumn, selector, sortOrder) {
            if (groupColumn) {
              var groupIndex = groupColumn.groupIndex;
              sortOrder = sortOrder || groupColumn.sortOrder;

              if ((0, _type.isDefined)(groupIndex)) {
                sortByGroups[groupIndex] = sortByGroups[groupIndex] || [];
                sortByGroups[groupIndex].push({
                  selector: selector,
                  desc: sortOrder === 'desc'
                });
              }
            }
          },
          _findSummaryItem: function _findSummaryItem(summaryItems, name) {
            var summaryItemIndex = -1;

            var getFullName = function getFullName(summaryItem) {
              var summaryType = summaryItem.summaryType;
              var column = summaryItem.column;
              return summaryType && column && summaryType + '_' + column;
            };

            if ((0, _type.isDefined)(name)) {
              (0, _iterator.each)(summaryItems || [], function (index) {
                if (this.name === name || index === name || this.summaryType === name || this.column === name || getFullName(this) === name) {
                  summaryItemIndex = index;
                  return false;
                }
              });
            }

            return summaryItemIndex;
          },
          _getSummarySortByGroups: function _getSummarySortByGroups(sortByGroupSummaryInfo, groupSummaryItems) {
            var that = this;
            var columnsController = that._columnsController;
            var groupColumns = columnsController.getGroupColumns();
            var sortByGroups = [];
            if (!groupSummaryItems || !groupSummaryItems.length) return;
            (0, _iterator.each)(sortByGroupSummaryInfo || [], function () {
              var sortOrder = this.sortOrder;
              var groupColumn = this.groupColumn;

              var summaryItemIndex = that._findSummaryItem(groupSummaryItems, this.summaryItem);

              if (summaryItemIndex < 0) return;

              var selector = function selector(data) {
                return getGroupAggregates(data)[summaryItemIndex];
              };

              if ((0, _type.isDefined)(groupColumn)) {
                groupColumn = columnsController.columnOption(groupColumn);

                that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
              } else {
                (0, _iterator.each)(groupColumns, function (groupIndex, groupColumn) {
                  that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
                });
              }
            });
            return sortByGroups;
          },
          _createDataSourceAdapterCore: function _createDataSourceAdapterCore(dataSource, remoteOperations) {
            var that = this;
            var dataSourceAdapter = this.callBase(dataSource, remoteOperations);
            dataSourceAdapter.summaryGetter(function (currentRemoteOperations) {
              return that._getSummaryOptions(currentRemoteOperations || remoteOperations);
            });
            return dataSourceAdapter;
          },
          _getSummaryOptions: function _getSummaryOptions(remoteOperations) {
            var that = this;
            var groupSummaryItems = that.option('summary.groupItems');
            var totalSummaryItems = that.option('summary.totalItems');
            var sortByGroupSummaryInfo = that.option('sortByGroupSummaryInfo');

            var groupAggregates = that._getAggregates(groupSummaryItems, remoteOperations && remoteOperations.grouping && remoteOperations.summary);

            var totalAggregates = that._getAggregates(totalSummaryItems, remoteOperations && remoteOperations.summary);

            var sortByGroups = function sortByGroups() {
              return that._getSummarySortByGroups(sortByGroupSummaryInfo, groupSummaryItems);
            };

            if (groupAggregates.length || totalAggregates.length) {
              return {
                groupAggregates: groupAggregates,
                totalAggregates: totalAggregates,
                sortByGroups: sortByGroups
              };
            }
          },
          publicMethods: function publicMethods() {
            var methods = this.callBase();
            methods.push('getTotalSummaryValue');
            return methods;
          },
          getTotalSummaryValue: function getTotalSummaryValue(summaryItemName) {
            var summaryItemIndex = this._findSummaryItem(this.option('summary.totalItems'), summaryItemName);

            var aggregates = this._dataSource.totalAggregates();

            if (aggregates.length && summaryItemIndex > -1) {
              return aggregates[summaryItemIndex];
            }
          },
          optionChanged: function optionChanged(args) {
            if (args.name === 'summary' || args.name === 'sortByGroupSummaryInfo') {
              args.name = 'dataSource';
            }

            this.callBase(args);
          },
          init: function init() {
            this._footerItems = [];
            this.callBase();
          },
          footerItems: function footerItems() {
            return this._footerItems;
          }
        };
      }(),
      editing: function () {
        return {
          _refreshSummary: function _refreshSummary() {
            if (recalculateWhileEditing(this) && !this.isSaving()) {
              this._dataController.refresh({
                load: true,
                changesOnly: true
              });
            }
          },
          _addChange: function _addChange(params) {
            var result = this.callBase.apply(this, arguments);

            if (params.type) {
              this._refreshSummary();
            }

            return result;
          },
          _removeChange: function _removeChange() {
            var result = this.callBase.apply(this, arguments);

            this._refreshSummary();

            return result;
          },
          cancelEditData: function cancelEditData() {
            var result = this.callBase.apply(this, arguments);

            this._refreshSummary();

            return result;
          }
        };
      }()
    },
    views: {
      rowsView: function () {
        return {
          _createRow: function _createRow(row) {
            var $row = this.callBase.apply(this, arguments);
            row && $row.addClass(row.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE ? DATAGRID_GROUP_FOOTER_CLASS : '');
            return $row;
          },
          _renderCells: function _renderCells($row, options) {
            this.callBase.apply(this, arguments);

            if (options.row.rowType === 'group' && options.row.summaryCells && options.row.summaryCells.length) {
              this._renderGroupSummaryCells($row, options);
            }
          },
          _hasAlignByColumnSummaryItems: function _hasAlignByColumnSummaryItems(columnIndex, options) {
            return !(0, _type.isDefined)(options.columns[columnIndex].groupIndex) && options.row.summaryCells[columnIndex].length;
          },
          _getAlignByColumnCellCount: function _getAlignByColumnCellCount(groupCellColSpan, options) {
            var alignByColumnCellCount = 0;

            for (var i = 1; i < groupCellColSpan; i++) {
              var columnIndex = options.row.summaryCells.length - i;
              alignByColumnCellCount = this._hasAlignByColumnSummaryItems(columnIndex, options) ? i : alignByColumnCellCount;
            }

            return alignByColumnCellCount;
          },
          _renderGroupSummaryCells: function _renderGroupSummaryCells($row, options) {
            var $groupCell = $row.children().last();
            var groupCellColSpan = Number($groupCell.attr('colSpan')) || 1;

            var alignByColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);

            this._renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount);
          },
          _renderGroupSummaryCellsCore: function _renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
            if (alignByColumnCellCount > 0) {
              $groupCell.attr('colSpan', groupCellColSpan - alignByColumnCellCount);

              for (var i = 0; i < alignByColumnCellCount; i++) {
                var columnIndex = options.columns.length - alignByColumnCellCount + i;

                this._renderCell($groupCell.parent(), (0, _extend.extend)({
                  column: options.columns[columnIndex],
                  columnIndex: this._getSummaryCellIndex(columnIndex, options.columns)
                }, options));
              }
            }
          },
          _getSummaryCellIndex: function _getSummaryCellIndex(columnIndex) {
            return columnIndex;
          },
          _getCellTemplate: function _getCellTemplate(options) {
            if (!options.column.command && !(0, _type.isDefined)(options.column.groupIndex) && options.summaryItems && options.summaryItems.length) {
              return renderSummaryCell;
            } else {
              return this.callBase(options);
            }
          },
          _getCellOptions: function _getCellOptions(options) {
            var that = this;
            var parameters = that.callBase(options);

            if (options.row.summaryCells) {
              return (0, _extend.extend)(parameters, getSummaryCellOptions(that, options));
            } else {
              return parameters;
            }
          }
        };
      }()
    }
  }
});