import Callbacks from '../../core/utils/callbacks';
import { when, Deferred } from '../../core/utils/deferred';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import { map, each } from '../../core/utils/iterator';
import Class from '../../core/class';
import { format } from '../../core/utils/string';
import { deferUpdate } from '../../core/utils/common';
import { isDefined, isString } from '../../core/utils/type';
import { VirtualScrollController } from '../grid_core/ui.grid_core.virtual_scrolling_core';
import { foreachColumnInfo, createColumnsInfo } from '../grid_core/ui.grid_core.virtual_columns_core';
import { StateStoringController } from '../grid_core/ui.grid_core.state_storing_core';
import PivotGridDataSource from './data_source';
import { findField, foreachTree, foreachTreeAsync, createPath, formatValue } from './ui.pivot_grid.utils';
var math = Math;
var GRAND_TOTAL_TYPE = 'GT';
var TOTAL_TYPE = 'T';
var DATA_TYPE = 'D';
var NOT_AVAILABLE = '#N/A';
var CHANGING_DURATION_IF_PAGINATE = 300;

var proxyMethod = function proxyMethod(instance, methodName, defaultResult) {
  if (!instance[methodName]) {
    instance[methodName] = function () {
      var dataSource = this._dataSource;
      return dataSource ? dataSource[methodName].apply(dataSource, arguments) : defaultResult;
    };
  }
};

export var DataController = Class.inherit(function () {
  function getHeaderItemText(item, description, options) {
    var text = item.text;

    if (isDefined(item.displayText)) {
      text = item.displayText;
    } else if (isDefined(item.caption)) {
      text = item.caption;
    } else if (item.type === GRAND_TOTAL_TYPE) {
      text = options.texts.grandTotal;
    }

    if (item.isAdditionalTotal) {
      text = format(options.texts.total || '', text);
    }

    return text;
  }

  function formatCellValue(value, dataField, errorText) {
    return value === NOT_AVAILABLE ? errorText : formatValue(value, dataField);
  }

  var createHeaderInfo = function () {
    var getHeaderItemsDepth = function getHeaderItemsDepth(headerItems) {
      var depth = 0;
      foreachTree(headerItems, function (items) {
        depth = math.max(depth, items.length);
      });
      return depth;
    };

    var createInfoItem = function createInfoItem(headerItem, breadth, isHorizontal, isTree) {
      var infoItem = {
        type: headerItem.type,
        text: headerItem.text
      };

      if (headerItem.path) {
        infoItem.path = headerItem.path;
      }

      if (headerItem.width) {
        infoItem.width = headerItem.width;
      }

      if (isDefined(headerItem.wordWrapEnabled)) {
        infoItem.wordWrapEnabled = headerItem.wordWrapEnabled;
      }

      if (headerItem.isLast) {
        infoItem.isLast = true;
      }

      if (headerItem.sorted) {
        infoItem.sorted = true;
      }

      if (headerItem.isMetric) {
        infoItem.dataIndex = headerItem.dataIndex;
      }

      if (isDefined(headerItem.expanded)) {
        infoItem.expanded = headerItem.expanded;
      }

      if (breadth > 1) {
        infoItem[isHorizontal ? 'colspan' : 'rowspan'] = breadth;
      }

      if (headerItem.depthSize && headerItem.depthSize > 1) {
        infoItem[isHorizontal ? 'rowspan' : 'colspan'] = headerItem.depthSize;
      }

      if (headerItem.index >= 0) {
        infoItem.dataSourceIndex = headerItem.index;
      }

      if (isTree && headerItem.children && headerItem.children.length && !headerItem.children[0].isMetric) {
        infoItem.width = null;
        infoItem.isWhiteSpace = true;
      }

      return infoItem;
    };

    var addInfoItem = function addInfoItem(info, options) {
      var breadth = options.lastIndex - options.index || 1;

      var addInfoItemCore = function addInfoItemCore(info, infoItem, itemIndex, depthIndex, isHorizontal) {
        var index = isHorizontal ? depthIndex : itemIndex;

        while (!info[index]) {
          info.push([]);
        }

        if (isHorizontal) {
          info[index].push(infoItem);
        } else {
          info[index].unshift(infoItem);
        }
      };

      var itemInfo = createInfoItem(options.headerItem, breadth, options.isHorizontal, options.isTree);
      addInfoItemCore(info, itemInfo, options.index, options.depth, options.isHorizontal);

      if (!options.headerItem.children || options.headerItem.children.length === 0) {
        return options.lastIndex + 1;
      }

      return options.lastIndex;
    };

    var isItemSorted = function isItemSorted(items, sortBySummaryPath) {
      var path;
      var item = items[0];
      var stringValuesUsed = isString(sortBySummaryPath[0]);
      var headerItem = item.dataIndex >= 0 ? items[1] : item;

      if (stringValuesUsed && sortBySummaryPath[0].indexOf('&[') !== -1 && headerItem.key || !headerItem.key) {
        path = createPath(items);
      } else {
        path = map(items, function (item) {
          return item.dataIndex >= 0 ? item.value : item.text;
        }).reverse();
      }

      if (item.type === GRAND_TOTAL_TYPE) {
        path = path.slice(1);
      }

      return path.join('/') === sortBySummaryPath.join('/');
    };

    var getViewHeaderItems = function getViewHeaderItems(headerItems, headerDescriptions, cellDescriptions, depthSize, options) {
      var cellDescriptionsCount = cellDescriptions.length;
      var viewHeaderItems = createViewHeaderItems(headerItems, headerDescriptions);
      var dataFields = options.dataFields;
      var d = new Deferred();
      when(viewHeaderItems).done(function (viewHeaderItems) {
        options.notifyProgress(0.5);

        if (options.showGrandTotals) {
          viewHeaderItems[!options.showTotalsPrior ? 'push' : 'unshift']({
            type: GRAND_TOTAL_TYPE,
            isEmpty: options.isEmptyGrandTotal
          });
        }

        var hideTotals = options.showTotals === false || dataFields.length > 0 && dataFields.length === options.hiddenTotals.length;
        var hideData = dataFields.length > 0 && options.hiddenValues.length === dataFields.length;

        if (hideData && hideTotals) {
          depthSize = 1;
        }

        if (!hideTotals || options.layout === 'tree') {
          addAdditionalTotalHeaderItems(viewHeaderItems, headerDescriptions, options.showTotalsPrior, options.layout === 'tree');
        }

        when(foreachTreeAsync(viewHeaderItems, function (items) {
          var item = items[0];

          if (!item.children || item.children.length === 0) {
            item.depthSize = depthSize - items.length + 1;
          }
        })).done(function () {
          if (cellDescriptionsCount > 1) {
            addMetricHeaderItems(viewHeaderItems, cellDescriptions, options);
          }

          !options.showEmpty && removeHiddenItems(viewHeaderItems);
          options.notifyProgress(0.75);
          when(foreachTreeAsync(viewHeaderItems, function (items) {
            var item = items[0];
            var isMetric = item.isMetric;
            var field = headerDescriptions[items.length - 1] || {};

            if (item.type === DATA_TYPE && !isMetric) {
              item.width = field.width;
            }

            if (hideData === true && item.type === DATA_TYPE) {
              var parentChildren = (items[1] ? items[1].children : viewHeaderItems) || [];
              parentChildren.splice(inArray(item, parentChildren), 1);
              return;
            }

            if (isMetric) {
              item.wordWrapEnabled = cellDescriptions[item.dataIndex].wordWrapEnabled;
            } else {
              item.wordWrapEnabled = field.wordWrapEnabled;
            }

            item.isLast = !item.children || !item.children.length;

            if (item.isLast) {
              each(options.sortBySummaryPaths, function (index, sortBySummaryPath) {
                if (!isDefined(item.dataIndex)) {
                  sortBySummaryPath = sortBySummaryPath.slice(0);
                  sortBySummaryPath.pop();
                }

                if (isItemSorted(items, sortBySummaryPath)) {
                  item.sorted = true;
                  return false;
                }
              });
            }

            item.text = getHeaderItemText(item, field, options);
          })).done(function () {
            if (!viewHeaderItems.length) {
              viewHeaderItems.push({});
            }

            options.notifyProgress(1);
            d.resolve(viewHeaderItems);
          });
        });
      });
      return d;
    };

    function createHeaderItem(childrenStack, depth, index) {
      var parent = childrenStack[depth] = childrenStack[depth] || [];
      var node = parent[index] = {};

      if (childrenStack[depth + 1]) {
        node.children = childrenStack[depth + 1]; // T541266

        for (var i = depth + 1; i < childrenStack.length; i++) {
          childrenStack[i] = undefined;
        }

        childrenStack.length = depth + 1;
      }

      return node;
    }

    function createViewHeaderItems(headerItems, headerDescriptions) {
      var headerDescriptionsCount = headerDescriptions && headerDescriptions.length || 0;
      var childrenStack = [];
      var d = new Deferred();
      var headerItem;
      when(foreachTreeAsync(headerItems, function (items, index) {
        var item = items[0];
        var path = createPath(items);
        headerItem = createHeaderItem(childrenStack, path.length, index);
        headerItem.type = DATA_TYPE;
        headerItem.value = item.value;
        headerItem.path = path;
        headerItem.text = item.text;
        headerItem.index = item.index;
        headerItem.displayText = item.displayText;
        headerItem.key = item.key;
        headerItem.isEmpty = item.isEmpty;

        if (path.length < headerDescriptionsCount && (!item.children || item.children.length !== 0)) {
          headerItem.expanded = !!item.children;
        }
      })).done(function () {
        d.resolve(createHeaderItem(childrenStack, 0, 0).children || []);
      });
      return d;
    }

    function addMetricHeaderItems(headerItems, cellDescriptions, options) {
      foreachTree(headerItems, function (items) {
        var item = items[0];
        var i;

        if (!item.children || item.children.length === 0) {
          item.children = [];

          for (i = 0; i < cellDescriptions.length; i++) {
            var isGrandTotal = item.type === GRAND_TOTAL_TYPE;
            var isTotal = item.type === TOTAL_TYPE;
            var isValue = item.type === DATA_TYPE;
            var columnIsHidden = cellDescriptions[i].visible === false || isGrandTotal && inArray(i, options.hiddenGrandTotals) !== -1 || isTotal && inArray(i, options.hiddenTotals) !== -1 || isValue && inArray(i, options.hiddenValues) !== -1;

            if (columnIsHidden) {
              continue;
            }

            item.children.push({
              caption: cellDescriptions[i].caption,
              path: item.path,
              type: item.type,
              value: i,
              index: item.index,
              dataIndex: i,
              isMetric: true,
              isEmpty: item.isEmpty && item.isEmpty[i]
            });
          }
        }
      });
    }

    function addAdditionalTotalHeaderItems(headerItems, headerDescriptions, showTotalsPrior, isTree) {
      showTotalsPrior = showTotalsPrior || isTree;
      foreachTree(headerItems, function (items, index) {
        var item = items[0];
        var parentChildren = (items[1] ? items[1].children : headerItems) || [];
        var dataField = headerDescriptions[items.length - 1];

        if (item.type === DATA_TYPE && item.expanded && (dataField.showTotals !== false || isTree)) {
          index !== -1 && parentChildren.splice(showTotalsPrior ? index : index + 1, 0, extend({}, item, {
            children: null,
            type: TOTAL_TYPE,
            expanded: showTotalsPrior ? true : null,
            isAdditionalTotal: true
          }));

          if (showTotalsPrior) {
            item.expanded = null;
          }
        }
      });
    }

    var removeEmptyParent = function removeEmptyParent(items, index) {
      var parent = items[index + 1];

      if (!items[index].children.length && parent && parent.children) {
        parent.children.splice(inArray(items[index], parent.children), 1);
        removeEmptyParent(items, index + 1);
      }
    };

    function removeHiddenItems(headerItems) {
      foreachTree([{
        children: headerItems
      }], function (items, index) {
        var item = items[0];
        var parentChildren = (items[1] ? items[1].children : headerItems) || [];
        var isEmpty = item.isEmpty;

        if (isEmpty && isEmpty.length) {
          isEmpty = item.isEmpty.filter(function (isEmpty) {
            return isEmpty;
          }).length === isEmpty.length;
        }

        if (item && !item.children && isEmpty) {
          parentChildren.splice(index, 1);
          removeEmptyParent(items, 1);
        }
      });
    }

    var fillHeaderInfo = function fillHeaderInfo(info, viewHeaderItems, depthSize, isHorizontal, isTree) {
      var lastIndex = 0;
      var index;
      var depth;
      var indexesByDepth = [0];
      foreachTree(viewHeaderItems, function (items) {
        var headerItem = items[0];
        depth = headerItem.isMetric ? depthSize : items.length - 1;

        while (indexesByDepth.length - 1 < depth) {
          indexesByDepth.push(indexesByDepth[indexesByDepth.length - 1]);
        }

        index = indexesByDepth[depth] || 0;
        lastIndex = addInfoItem(info, {
          headerItem: headerItem,
          index: index,
          lastIndex: lastIndex,
          depth: depth,
          isHorizontal: isHorizontal,
          isTree: isTree
        });
        indexesByDepth.length = depth;
        indexesByDepth.push(lastIndex);
      });
    };

    return function (headerItems, headerDescriptions, cellDescriptions, isHorizontal, options) {
      var info = [];
      var depthSize = getHeaderItemsDepth(headerItems) || 1;
      var d = new Deferred();
      getViewHeaderItems(headerItems, headerDescriptions, cellDescriptions, depthSize, options).done(function (viewHeaderItems) {
        fillHeaderInfo(info, viewHeaderItems, depthSize, isHorizontal, options.layout === 'tree');
        options.notifyProgress(1);
        d.resolve(info);
      });
      return d;
    };
  }();

  function createSortPaths(headerFields, dataFields) {
    var sortBySummaryPaths = [];
    each(headerFields, function (index, headerField) {
      var fieldIndex = findField(dataFields, headerField.sortBySummaryField);

      if (fieldIndex >= 0) {
        sortBySummaryPaths.push((headerField.sortBySummaryPath || []).concat([fieldIndex]));
      }
    });
    return sortBySummaryPaths;
  }

  function foreachRowInfo(rowsInfo, callback) {
    var columnOffset = 0;
    var columnOffsetResetIndexes = [];

    for (var i = 0; i < rowsInfo.length; i++) {
      for (var j = 0; j < rowsInfo[i].length; j++) {
        var rowSpanOffset = (rowsInfo[i][j].rowspan || 1) - 1;
        var visibleIndex = i + rowSpanOffset;

        if (columnOffsetResetIndexes[i]) {
          columnOffset -= columnOffsetResetIndexes[i];
          columnOffsetResetIndexes[i] = 0;
        }

        if (callback(rowsInfo[i][j], visibleIndex, i, j, columnOffset) === false) {
          break;
        }

        columnOffsetResetIndexes[i + (rowsInfo[i][j].rowspan || 1)] = (columnOffsetResetIndexes[i + (rowsInfo[i][j].rowspan || 1)] || 0) + 1;
        columnOffset++;
      }
    }
  }

  function createCellsInfo(rowsInfo, columnsInfo, data, dataFields, dataFieldArea, errorText) {
    var info = [];
    var dataFieldAreaInRows = dataFieldArea === 'row';
    var dataSourceCells = data.values;
    dataSourceCells.length && foreachRowInfo(rowsInfo, function (rowInfo, rowIndex) {
      var row = info[rowIndex] = [];
      var dataRow = dataSourceCells[rowInfo.dataSourceIndex >= 0 ? rowInfo.dataSourceIndex : data.grandTotalRowIndex] || [];
      rowInfo.isLast && foreachColumnInfo(columnsInfo, function (columnInfo, columnIndex) {
        var dataIndex = (dataFieldAreaInRows ? rowInfo.dataIndex : columnInfo.dataIndex) || 0;
        var dataField = dataFields[dataIndex];

        if (columnInfo.isLast && dataField && dataField.visible !== false) {
          var cell = dataRow[columnInfo.dataSourceIndex >= 0 ? columnInfo.dataSourceIndex : data.grandTotalColumnIndex];

          if (!Array.isArray(cell)) {
            cell = [cell];
          }

          var cellValue = cell[dataIndex];
          row[columnIndex] = {
            text: formatCellValue(cellValue, dataField, errorText),
            value: cellValue,
            format: dataField.format,
            dataType: dataField.dataType,
            columnType: columnInfo.type,
            rowType: rowInfo.type,
            rowPath: rowInfo.path || [],
            columnPath: columnInfo.path || [],
            dataIndex: dataIndex
          };

          if (dataField.width) {
            row[columnIndex].width = dataField.width;
          }
        }
      });
    });
    return info;
  }

  function getHeaderIndexedItems(headerItems, options) {
    var visibleIndex = 0;
    var indexedItems = [];
    foreachTree(headerItems, function (items) {
      var headerItem = items[0];
      var path = createPath(items);
      if (headerItem.children && options.showTotals === false) return;
      var indexedItem = extend(true, {}, headerItem, {
        visibleIndex: visibleIndex++,
        path: path
      });

      if (isDefined(indexedItem.index)) {
        indexedItems[indexedItem.index] = indexedItem;
      } else {
        indexedItems.push(indexedItem);
      }
    });
    return indexedItems;
  }

  function createScrollController(dataController, component, dataAdapter) {
    return new VirtualScrollController(component, extend({
      hasKnownLastPage: function hasKnownLastPage() {
        return true;
      },
      pageCount: function pageCount() {
        return math.ceil(this.totalItemsCount() / this.pageSize());
      },
      updateLoading: function updateLoading() {},
      itemsCount: function itemsCount() {
        if (this.pageIndex() < this.pageCount() - 1) {
          return this.pageSize();
        } else {
          return this.totalItemsCount() % this.pageSize();
        }
      },
      items: function items() {
        return [];
      },
      viewportItems: function viewportItems() {
        return [];
      },
      onChanged: function onChanged() {},
      isLoading: function isLoading() {
        return dataController.isLoading();
      },
      changingDuration: function changingDuration() {
        var dataSource = dataController._dataSource;

        if (dataSource.paginate()) {
          return CHANGING_DURATION_IF_PAGINATE;
        }

        return dataController._changingDuration || 0;
      }
    }, dataAdapter));
  }

  function getHiddenTotals(dataFields) {
    var result = [];
    each(dataFields, function (index, field) {
      if (field.showTotals === false) {
        result.push(index);
      }
    });
    return result;
  }

  function getHiddenValues(dataFields) {
    var result = [];
    dataFields.forEach(function (field, index) {
      if (field.showValues === undefined && field.showTotals === false || field.showValues === false) {
        result.push(index);
      }
    });
    return result;
  }

  function getHiddenGrandTotalsTotals(dataFields, columnFields) {
    var result = [];
    each(dataFields, function (index, field) {
      if (field.showGrandTotals === false) {
        result.push(index);
      }
    });

    if (columnFields.length === 0 && result.length === dataFields.length) {
      result = [];
    }

    return result;
  }

  var members = {
    ctor: function ctor(options) {
      var that = this;

      var virtualScrollControllerChanged = that._fireChanged.bind(that);

      options = that._options = options || {};
      that.dataSourceChanged = Callbacks();
      that._dataSource = that._createDataSource(options);

      if (options.component && options.component.option('scrolling.mode') === 'virtual') {
        that._rowsScrollController = createScrollController(that, options.component, {
          totalItemsCount: function totalItemsCount() {
            return that.totalRowCount();
          },
          pageIndex: function pageIndex(index) {
            return that.rowPageIndex(index);
          },
          pageSize: function pageSize() {
            return that.rowPageSize();
          },
          load: function load() {
            if (that._rowsScrollController.pageIndex() >= this.pageCount()) {
              that._rowsScrollController.pageIndex(this.pageCount() - 1);
            }

            return that._rowsScrollController.handleDataChanged(function () {
              if (that._dataSource.paginate()) {
                that._dataSource.load();
              } else {
                virtualScrollControllerChanged.apply(this, arguments);
              }
            });
          }
        });
        that._columnsScrollController = createScrollController(that, options.component, {
          totalItemsCount: function totalItemsCount() {
            return that.totalColumnCount();
          },
          pageIndex: function pageIndex(index) {
            return that.columnPageIndex(index);
          },
          pageSize: function pageSize() {
            return that.columnPageSize();
          },
          load: function load() {
            if (that._columnsScrollController.pageIndex() >= this.pageCount()) {
              that._columnsScrollController.pageIndex(this.pageCount() - 1);
            }

            return that._columnsScrollController.handleDataChanged(function () {
              if (that._dataSource.paginate()) {
                that._dataSource.load();
              } else {
                virtualScrollControllerChanged.apply(this, arguments);
              }
            });
          }
        });
      }

      that._stateStoringController = new StateStoringController(options.component).init();
      that._columnsInfo = [];
      that._rowsInfo = [];
      that._cellsInfo = [];
      that.expandValueChanging = Callbacks();
      that.loadingChanged = Callbacks();
      that.progressChanged = Callbacks();
      that.scrollChanged = Callbacks();
      that.load();

      that._update();

      that.changed = Callbacks();
    },
    _fireChanged: function _fireChanged() {
      var that = this;
      var startChanging = new Date();
      that.changed && !that._lockChanged && that.changed.fire();
      that._changingDuration = new Date() - startChanging;
    },
    _correctSkipsTakes: function _correctSkipsTakes(rowIndex, rowSkip, rowSpan, levels, skips, takes) {
      var endIndex = rowSpan ? rowIndex + rowSpan - 1 : rowIndex;
      skips[levels.length] = skips[levels.length] || 0;
      takes[levels.length] = takes[levels.length] || 0;

      if (endIndex < rowSkip) {
        skips[levels.length]++;
      } else {
        takes[levels.length]++;
      }
    },
    _calculatePagingForRowExpandedPaths: function _calculatePagingForRowExpandedPaths(options, skips, takes, rowExpandedSkips, rowExpandedTakes) {
      var rows = this._rowsInfo;
      var rowCount = Math.min(options.rowSkip + options.rowTake, rows.length);
      var rowExpandedPaths = options.rowExpandedPaths;
      var levels = [];
      var expandedPathIndexes = {};
      var i;
      var j;
      var path;
      rowExpandedPaths.forEach((path, index) => {
        expandedPathIndexes[path] = index;
      });

      for (i = 0; i < rowCount; i++) {
        takes.length = skips.length = levels.length + 1;

        for (j = 0; j < rows[i].length; j++) {
          var cell = rows[i][j];

          if (cell.type === 'D') {
            this._correctSkipsTakes(i, options.rowSkip, cell.rowspan, levels, skips, takes);

            path = cell.path || path;
            var expandIndex = path && path.length > 1 ? expandedPathIndexes[path.slice(0, -1)] : -1;

            if (expandIndex >= 0) {
              rowExpandedSkips[expandIndex] = skips[levels.length] || 0;
              rowExpandedTakes[expandIndex] = takes[levels.length] || 0;
            }

            if (cell.rowspan) {
              levels.push(cell.rowspan);
            }
          }
        }

        levels = levels.map(level => level - 1).filter(level => level > 0);
      }
    },
    _calculatePagingForColumnExpandedPaths: function _calculatePagingForColumnExpandedPaths(options, skips, takes, expandedSkips, expandedTakes) {
      var skipByPath = {};
      var takeByPath = {};
      foreachColumnInfo(this._columnsInfo, function (columnInfo, columnIndex) {
        if (columnInfo.type === 'D' && columnInfo.path && columnInfo.dataIndex === undefined) {
          var colspan = columnInfo.colspan || 1;
          var path = columnInfo.path.slice(0, -1).toString();
          skipByPath[path] = skipByPath[path] || 0;
          takeByPath[path] = takeByPath[path] || 0;

          if (columnIndex + colspan <= options.columnSkip) {
            skipByPath[path]++;
          } else if (columnIndex < options.columnSkip + options.columnTake) {
            takeByPath[path]++;
          }
        }
      });
      skips[0] = skipByPath[[]];
      takes[0] = takeByPath[[]];
      options.columnExpandedPaths.forEach(function (path, index) {
        var skip = skipByPath[path];
        var take = takeByPath[path];

        if (skip !== undefined) {
          expandedSkips[index] = skip;
        }

        if (take !== undefined) {
          expandedTakes[index] = take;
        }
      });
    },
    _processPagingForExpandedPaths: function _processPagingForExpandedPaths(options, area, storeLoadOptions, reload) {
      var expandedPaths = options[area + 'ExpandedPaths'];
      var expandedSkips = expandedPaths.map(() => 0);
      var expandedTakes = expandedPaths.map(() => reload ? options.pageSize : 0);
      var skips = [];
      var takes = [];

      if (!reload) {
        if (area === 'row') {
          this._calculatePagingForRowExpandedPaths(options, skips, takes, expandedSkips, expandedTakes);
        } else {
          this._calculatePagingForColumnExpandedPaths(options, skips, takes, expandedSkips, expandedTakes);
        }
      }

      this._savePagingForExpandedPaths(options, area, storeLoadOptions, skips[0], takes[0], expandedSkips, expandedTakes);
    },
    _savePagingForExpandedPaths: function _savePagingForExpandedPaths(options, area, storeLoadOptions, skip, take, expandedSkips, expandedTakes) {
      var expandedPaths = options[area + 'ExpandedPaths'];
      options[area + 'ExpandedPaths'] = [];
      options[area + 'Skip'] = skip !== undefined ? skip : options[area + 'Skip'];
      options[area + 'Take'] = take !== undefined ? take : options[area + 'Take'];

      for (var i = 0; i < expandedPaths.length; i++) {
        if (expandedTakes[i]) {
          var isOppositeArea = options.area && options.area !== area;
          storeLoadOptions.push(extend({
            area: area,
            headerName: area + 's'
          }, options, {
            [area + 'Skip']: expandedSkips[i],
            [area + 'Take']: expandedTakes[i],
            [isOppositeArea ? 'oppositePath' : 'path']: expandedPaths[i]
          }));
        }
      }
    },
    _handleCustomizeStoreLoadOptions: function _handleCustomizeStoreLoadOptions(storeLoadOptions, reload) {
      var options = storeLoadOptions[0];
      var rowsScrollController = this._rowsScrollController;

      if (this._dataSource.paginate() && rowsScrollController) {
        var rowPageSize = rowsScrollController.pageSize();

        if (options.headerName === 'rows') {
          options.rowSkip = 0;
          options.rowTake = rowPageSize;
          options.rowExpandedPaths = [];
        } else {
          options.rowSkip = rowsScrollController.beginPageIndex() * rowPageSize;
          options.rowTake = (rowsScrollController.endPageIndex() - rowsScrollController.beginPageIndex() + 1) * rowPageSize;

          this._processPagingForExpandedPaths(options, 'row', storeLoadOptions, reload);
        }
      }

      var columnsScrollController = this._columnsScrollController;

      if (this._dataSource.paginate() && columnsScrollController) {
        var columnPageSize = columnsScrollController.pageSize();
        storeLoadOptions.forEach((options, index) => {
          if (options.headerName === 'columns') {
            options.columnSkip = 0;
            options.columnTake = columnPageSize;
            options.columnExpandedPaths = [];
          } else {
            options.columnSkip = columnsScrollController.beginPageIndex() * columnPageSize;
            options.columnTake = (columnsScrollController.endPageIndex() - columnsScrollController.beginPageIndex() + 1) * columnPageSize;

            this._processPagingForExpandedPaths(options, 'column', storeLoadOptions, reload);
          }
        });
      }
    },
    load: function load() {
      var that = this;
      var stateStoringController = this._stateStoringController;

      if (stateStoringController.isEnabled() && !stateStoringController.isLoaded()) {
        stateStoringController.load().always(function (state) {
          if (state) {
            that._dataSource.state(state);
          } else {
            that._dataSource.load();
          }
        });
      } else {
        that._dataSource.load();
      }
    },
    calculateVirtualContentParams: function calculateVirtualContentParams(contentParams) {
      var that = this;
      var rowsScrollController = that._rowsScrollController;
      var columnsScrollController = that._columnsScrollController;

      if (rowsScrollController && columnsScrollController) {
        rowsScrollController.viewportItemSize(contentParams.virtualRowHeight);
        rowsScrollController.viewportSize(contentParams.viewportHeight / rowsScrollController.viewportItemSize());
        rowsScrollController.setContentItemSizes(contentParams.itemHeights);
        columnsScrollController.viewportItemSize(contentParams.virtualColumnWidth);
        columnsScrollController.viewportSize(contentParams.viewportWidth / columnsScrollController.viewportItemSize());
        columnsScrollController.setContentItemSizes(contentParams.itemWidths);
        deferUpdate(function () {
          columnsScrollController.loadIfNeed();
          rowsScrollController.loadIfNeed();
        });
        that.scrollChanged.fire({
          left: columnsScrollController.getViewportPosition(),
          top: rowsScrollController.getViewportPosition()
        });
        return {
          contentTop: rowsScrollController.getContentOffset(),
          contentLeft: columnsScrollController.getContentOffset(),
          width: columnsScrollController.getVirtualContentSize(),
          height: rowsScrollController.getVirtualContentSize()
        };
      }
    },
    setViewportPosition: function setViewportPosition(left, top) {
      this._rowsScrollController.setViewportPosition(top || 0);

      this._columnsScrollController.setViewportPosition(left || 0);
    },
    subscribeToWindowScrollEvents: function subscribeToWindowScrollEvents($element) {
      this._rowsScrollController && this._rowsScrollController.subscribeToWindowScrollEvents($element);
    },
    updateWindowScrollPosition: function updateWindowScrollPosition(position) {
      this._rowsScrollController && this._rowsScrollController.scrollTo(position);
    },
    updateViewOptions: function updateViewOptions(options) {
      extend(this._options, options);

      this._update();
    },
    _handleExpandValueChanging: function _handleExpandValueChanging(e) {
      this.expandValueChanging.fire(e);
    },
    _handleLoadingChanged: function _handleLoadingChanged(isLoading) {
      this.loadingChanged.fire(isLoading);
    },
    _handleProgressChanged: function _handleProgressChanged(progress) {
      this.progressChanged.fire(progress);
    },
    _handleFieldsPrepared: function _handleFieldsPrepared(e) {
      this._options.onFieldsPrepared && this._options.onFieldsPrepared(e);
    },
    _createDataSource: function _createDataSource(options) {
      var that = this;
      var dataSourceOptions = options.dataSource;
      var dataSource;
      that._isSharedDataSource = dataSourceOptions instanceof PivotGridDataSource;

      if (that._isSharedDataSource) {
        dataSource = dataSourceOptions;
      } else {
        dataSource = new PivotGridDataSource(dataSourceOptions);
      }

      that._expandValueChangingHandler = that._handleExpandValueChanging.bind(that);
      that._loadingChangedHandler = that._handleLoadingChanged.bind(that);
      that._fieldsPreparedHandler = that._handleFieldsPrepared.bind(that);
      that._customizeStoreLoadOptionsHandler = that._handleCustomizeStoreLoadOptions.bind(that);

      that._changedHandler = function () {
        that._update();

        that.dataSourceChanged.fire();
      };

      that._progressChangedHandler = function (progress) {
        that._handleProgressChanged(progress * 0.8);
      };

      dataSource.on('changed', that._changedHandler);
      dataSource.on('expandValueChanging', that._expandValueChangingHandler);
      dataSource.on('loadingChanged', that._loadingChangedHandler);
      dataSource.on('progressChanged', that._progressChangedHandler);
      dataSource.on('fieldsPrepared', that._fieldsPreparedHandler);
      dataSource.on('customizeStoreLoadOptions', that._customizeStoreLoadOptionsHandler);
      return dataSource;
    },
    getDataSource: function getDataSource() {
      return this._dataSource;
    },
    isLoading: function isLoading() {
      return this._dataSource.isLoading();
    },
    beginLoading: function beginLoading() {
      this._dataSource.beginLoading();
    },
    endLoading: function endLoading() {
      this._dataSource.endLoading();
    },
    _update: function _update() {
      var that = this;
      var dataSource = that._dataSource;
      var options = that._options;
      var columnFields = dataSource.getAreaFields('column');
      var rowFields = dataSource.getAreaFields('row');
      var dataFields = dataSource.getAreaFields('data');
      var dataFieldsForRows = options.dataFieldArea === 'row' ? dataFields : [];
      var dataFieldsForColumns = options.dataFieldArea !== 'row' ? dataFields : [];
      var data = dataSource.getData();
      var hiddenTotals = getHiddenTotals(dataFields);
      var hiddenValues = getHiddenValues(dataFields);
      var hiddenGrandTotals = getHiddenGrandTotalsTotals(dataFields, columnFields);
      var grandTotalsAreHiddenForNotAllDataFields = dataFields.length > 0 ? hiddenGrandTotals.length !== dataFields.length : true;
      var rowOptions = {
        isEmptyGrandTotal: data.isEmptyGrandTotalRow,
        texts: options.texts || {},
        hiddenTotals: hiddenTotals,
        hiddenValues: hiddenValues,
        hiddenGrandTotals: [],
        showTotals: options.showRowTotals,
        showGrandTotals: options.showRowGrandTotals !== false && grandTotalsAreHiddenForNotAllDataFields,
        sortBySummaryPaths: createSortPaths(columnFields, dataFields),
        showTotalsPrior: options.showTotalsPrior === 'rows' || options.showTotalsPrior === 'both',
        showEmpty: !options.hideEmptySummaryCells,
        layout: options.rowHeaderLayout,
        fields: rowFields,
        dataFields: dataFields,
        progress: 0
      };
      var columnOptions = {
        isEmptyGrandTotal: data.isEmptyGrandTotalColumn,
        texts: options.texts || {},
        hiddenTotals: hiddenTotals,
        hiddenValues: hiddenValues,
        hiddenGrandTotals: hiddenGrandTotals,
        showTotals: options.showColumnTotals,
        showTotalsPrior: options.showTotalsPrior === 'columns' || options.showTotalsPrior === 'both',
        showGrandTotals: options.showColumnGrandTotals !== false && grandTotalsAreHiddenForNotAllDataFields,
        sortBySummaryPaths: createSortPaths(rowFields, dataFields),
        showEmpty: !options.hideEmptySummaryCells,
        fields: columnFields,
        dataFields: dataFields,
        progress: 0
      };

      var notifyProgress = function notifyProgress(progress) {
        this.progress = progress;

        that._handleProgressChanged(0.8 + 0.1 * rowOptions.progress + 0.1 * columnOptions.progress);
      };

      rowOptions.notifyProgress = notifyProgress;
      columnOptions.notifyProgress = notifyProgress;

      if (!isDefined(data.grandTotalRowIndex)) {
        data.grandTotalRowIndex = getHeaderIndexedItems(data.rows, rowOptions).length;
      }

      if (!isDefined(data.grandTotalColumnIndex)) {
        data.grandTotalColumnIndex = getHeaderIndexedItems(data.columns, columnOptions).length;
      }

      dataSource._changeLoadingCount(1);

      when(createHeaderInfo(data.columns, columnFields, dataFieldsForColumns, true, columnOptions), createHeaderInfo(data.rows, rowFields, dataFieldsForRows, false, rowOptions)).always(function () {
        dataSource._changeLoadingCount(-1);
      }).done(function (columnsInfo, rowsInfo) {
        that._columnsInfo = columnsInfo;
        that._rowsInfo = rowsInfo;

        if (that._rowsScrollController && that._columnsScrollController && that.changed && !that._dataSource.paginate()) {
          that._rowsScrollController.reset(true);

          that._columnsScrollController.reset(true);

          that._lockChanged = true;

          that._rowsScrollController.load();

          that._columnsScrollController.load();

          that._lockChanged = false;
        }
      }).done(function () {
        that._fireChanged();

        if (that._stateStoringController.isEnabled() && !that._dataSource.isLoading()) {
          that._stateStoringController.state(that._dataSource.state());

          that._stateStoringController.save();
        }
      });
    },
    getRowsInfo: function getRowsInfo(getAllData) {
      var that = this;
      var rowsInfo = that._rowsInfo;
      var scrollController = that._rowsScrollController;
      var rowspan;
      var i;

      if (scrollController && !getAllData) {
        var startIndex = scrollController.beginPageIndex() * that.rowPageSize();
        var endIndex = scrollController.endPageIndex() * that.rowPageSize() + that.rowPageSize();
        var newRowsInfo = [];
        var maxDepth = 1;
        foreachRowInfo(rowsInfo, function (rowInfo, visibleIndex, rowIndex, _, columnIndex) {
          var isVisible = visibleIndex >= startIndex && rowIndex < endIndex;
          var index = rowIndex < startIndex ? 0 : rowIndex - startIndex;
          var cell = rowInfo;

          if (isVisible) {
            newRowsInfo[index] = newRowsInfo[index] || [];
            rowspan = rowIndex < startIndex ? rowInfo.rowspan - (startIndex - rowIndex) || 1 : rowInfo.rowspan;

            if (startIndex + index + rowspan > endIndex) {
              rowspan = endIndex - (index + startIndex) || 1;
            }

            if (rowspan !== rowInfo.rowspan) {
              cell = extend({}, cell, {
                rowspan: rowspan
              });
            }

            newRowsInfo[index].push(cell);
            maxDepth = math.max(maxDepth, columnIndex + 1);
          } else if (i > endIndex) {
            return false;
          }
        });
        foreachRowInfo(newRowsInfo, function (rowInfo, visibleIndex, rowIndex, columnIndex, realColumnIndex) {
          var colspan = rowInfo.colspan || 1;

          if (realColumnIndex + colspan > maxDepth) {
            newRowsInfo[rowIndex][columnIndex] = extend({}, rowInfo, {
              colspan: maxDepth - realColumnIndex || 1
            });
          }
        });
        return newRowsInfo;
      }

      return rowsInfo;
    },
    getColumnsInfo: function getColumnsInfo(getAllData) {
      var that = this;
      var info = that._columnsInfo;
      var scrollController = that._columnsScrollController;

      if (scrollController && !getAllData) {
        var startIndex = scrollController.beginPageIndex() * that.columnPageSize();
        var endIndex = scrollController.endPageIndex() * that.columnPageSize() + that.columnPageSize();
        info = createColumnsInfo(info, startIndex, endIndex);
      }

      return info;
    },
    totalRowCount: function totalRowCount() {
      return this._rowsInfo.length;
    },
    rowPageIndex: function rowPageIndex(index) {
      if (index !== undefined) {
        this._rowPageIndex = index;
      }

      return this._rowPageIndex || 0;
    },
    totalColumnCount: function totalColumnCount() {
      var count = 0;

      if (this._columnsInfo && this._columnsInfo.length) {
        for (var i = 0; i < this._columnsInfo[0].length; i++) {
          count += this._columnsInfo[0][i].colspan || 1;
        }
      }

      return count;
    },
    rowPageSize: function rowPageSize(size) {
      if (size !== undefined) {
        this._rowPageSize = size;
      }

      return this._rowPageSize || 20;
    },
    columnPageSize: function columnPageSize(size) {
      if (size !== undefined) {
        this._columnPageSize = size;
      }

      return this._columnPageSize || 20;
    },
    columnPageIndex: function columnPageIndex(index) {
      if (index !== undefined) {
        this._columnPageIndex = index;
      }

      return this._columnPageIndex || 0;
    },
    getCellsInfo: function getCellsInfo(getAllData) {
      var rowsInfo = this.getRowsInfo(getAllData);
      var columnsInfo = this.getColumnsInfo(getAllData);

      var data = this._dataSource.getData();

      var texts = this._options.texts || {};
      return createCellsInfo(rowsInfo, columnsInfo, data, this._dataSource.getAreaFields('data'), this._options.dataFieldArea, texts.dataNotAvailable);
    },
    dispose: function dispose() {
      var that = this;

      if (that._isSharedDataSource) {
        that._dataSource.off('changed', that._changedHandler);

        that._dataSource.off('expandValueChanging', that._expandValueChangingHandler);

        that._dataSource.off('loadingChanged', that._loadingChangedHandler);

        that._dataSource.off('progressChanged', that._progressChangedHandler);

        that._dataSource.off('fieldsPrepared', that._fieldsPreparedHandler);

        that._dataSource.off('customizeStoreLoadOptions', that._customizeStoreLoadOptionsHandler);
      } else {
        that._dataSource.dispose();
      }

      that._columnsScrollController && that._columnsScrollController.dispose();
      that._rowsScrollController && that._rowsScrollController.dispose();

      that._stateStoringController.dispose();

      that.expandValueChanging.empty();
      that.changed.empty();
      that.loadingChanged.empty();
      that.progressChanged.empty();
      that.scrollChanged.empty();
      that.dataSourceChanged.empty();
    }
  };
  proxyMethod(members, 'applyPartialDataSource');
  proxyMethod(members, 'collapseHeaderItem');
  proxyMethod(members, 'expandHeaderItem');
  proxyMethod(members, 'getData');
  proxyMethod(members, 'isEmpty');
  return members;
}());