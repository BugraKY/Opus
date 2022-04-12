import _extends from "@babel/runtime/helpers/esm/extends";
import eventsEngine from '../../events/core/events_engine';
import modules from './ui.grid_core.modules';
import filterUtils from '../shared/filtering';
import gridCoreUtils from './ui.grid_core.utils';
import { headerFilterMixin, HeaderFilterView, updateHeaderFilterItemSelectionState, allowHeaderFiltering } from './ui.grid_core.header_filter_core';
import messageLocalization from '../../localization/message';
import { name as clickEventName } from '../../events/click';
import { compileGetter } from '../../core/utils/data';
import { each } from '../../core/utils/iterator';
import { isDefined, isObject, isFunction } from '../../core/utils/type';
import { getDefaultAlignment } from '../../core/utils/position';
import { extend } from '../../core/utils/extend';
import { normalizeDataSourceOptions } from '../../data/data_source/utils';
import dateLocalization from '../../localization/date';
import variableWrapper from '../../core/utils/variable_wrapper';
import { Deferred } from '../../core/utils/deferred';
import { restoreFocus } from '../shared/accessibility';
import dataQuery from '../../data/query';
import storeHelper from '../../data/store_helper';
var DATE_INTERVAL_FORMATS = {
  'month': function month(value) {
    return dateLocalization.getMonthNames()[value - 1];
  },
  'quarter': function quarter(value) {
    return dateLocalization.format(new Date(2000, value * 3 - 1), 'quarter');
  }
};

function ungroupUTCDates(items, dateParts, dates) {
  dateParts = dateParts || [];
  dates = dates || [];
  items.forEach(item => {
    if (isDefined(item.key)) {
      var isMonthPart = dateParts.length === 1;
      dateParts.push(isMonthPart ? item.key - 1 : item.key);

      if (item.items) {
        ungroupUTCDates(item.items, dateParts, dates);
      } else {
        var date = new Date(Date.UTC.apply(Date, dateParts));
        dates.push(date);
      }

      dateParts.pop();
    } else {
      dates.push(null);
    }
  });
  return dates;
}

function convertDataFromUTCToLocal(data, column) {
  var dates = ungroupUTCDates(data);
  var query = dataQuery(dates);
  var group = gridCoreUtils.getHeaderFilterGroupParameters(_extends({}, column, {
    calculateCellValue: date => date
  }));
  return storeHelper.queryByOptions(query, {
    group
  }).toArray();
}

function isUTCFormat(format) {
  return (format === null || format === void 0 ? void 0 : format.slice(-1)) === 'Z' || (format === null || format === void 0 ? void 0 : format.slice(-3)) === '\'Z\'';
}

var HeaderFilterController = modules.ViewController.inherit(function () {
  var getFormatOptions = function getFormatOptions(value, column, currentLevel) {
    var groupInterval = filterUtils.getGroupInterval(column);
    var result = gridCoreUtils.getFormatOptionsByColumn(column, 'headerFilter');

    if (groupInterval) {
      result.groupInterval = groupInterval[currentLevel];

      if (gridCoreUtils.isDateType(column.dataType)) {
        result.format = DATE_INTERVAL_FORMATS[groupInterval[currentLevel]];
      } else if (column.dataType === 'number') {
        result.getDisplayFormat = function () {
          var formatOptions = {
            format: column.format,
            target: 'headerFilter'
          };
          var firstValueText = gridCoreUtils.formatValue(value, formatOptions);
          var secondValue = value + groupInterval[currentLevel];
          var secondValueText = gridCoreUtils.formatValue(secondValue, formatOptions);
          return firstValueText && secondValueText ? firstValueText + ' - ' + secondValueText : '';
        };
      }
    }

    return result;
  };

  return {
    init: function init() {
      this._columnsController = this.getController('columns');
      this._dataController = this.getController('data');
      this._headerFilterView = this.getView('headerFilterView');
    },
    _updateSelectedState: function _updateSelectedState(items, column) {
      var i = items.length;
      var isExclude = column.filterType === 'exclude';

      while (i--) {
        var item = items[i];

        if ('items' in items[i]) {
          this._updateSelectedState(items[i].items, column);
        }

        updateHeaderFilterItemSelectionState(item, gridCoreUtils.getIndexByKey(items[i].value, column.filterValues, null) > -1, isExclude);
      }
    },
    _normalizeGroupItem: function _normalizeGroupItem(item, currentLevel, options) {
      var value;
      var displayValue;
      var path = options.path;
      var valueSelector = options.valueSelector;
      var displaySelector = options.displaySelector;
      var column = options.column;

      if (valueSelector && displaySelector) {
        value = valueSelector(item);
        displayValue = displaySelector(item);
      } else {
        value = item.key;
        displayValue = value;
      }

      if (!isObject(item)) {
        item = {};
      } else {
        item = extend({}, item);
      }

      path.push(value);

      if (path.length === 1) {
        item.value = path[0];
      } else {
        item.value = path.join('/');
      }

      item.text = this.getHeaderItemText(displayValue, column, currentLevel, options.headerFilterOptions);
      return item;
    },
    getHeaderItemText: function getHeaderItemText(displayValue, column, currentLevel, headerFilterOptions) {
      var text = gridCoreUtils.formatValue(displayValue, getFormatOptions(displayValue, column, currentLevel));

      if (!text) {
        text = headerFilterOptions.texts.emptyValue;
      }

      return text;
    },
    _processGroupItems: function _processGroupItems(groupItems, currentLevel, path, options) {
      var that = this;
      var displaySelector;
      var valueSelector;
      var column = options.column;
      var lookup = column.lookup;
      var level = options.level;
      path = path || [];
      currentLevel = currentLevel || 0;

      if (lookup) {
        displaySelector = compileGetter(lookup.displayExpr);
        valueSelector = compileGetter(lookup.valueExpr);
      }

      for (var i = 0; i < groupItems.length; i++) {
        groupItems[i] = that._normalizeGroupItem(groupItems[i], currentLevel, {
          column: options.column,
          headerFilterOptions: options.headerFilterOptions,
          displaySelector: displaySelector,
          valueSelector: valueSelector,
          path: path
        });

        if ('items' in groupItems[i]) {
          if (currentLevel === level || !isDefined(groupItems[i].value)) {
            delete groupItems[i].items;
          } else {
            that._processGroupItems(groupItems[i].items, currentLevel + 1, path, options);
          }
        }

        path.pop();
      }
    },
    getDataSource: function getDataSource(column) {
      var _column$headerFilter;

      var that = this;

      var dataSource = that._dataController.dataSource();

      var remoteGrouping = dataSource === null || dataSource === void 0 ? void 0 : dataSource.remoteOperations().grouping;
      var group = gridCoreUtils.getHeaderFilterGroupParameters(column, remoteGrouping);
      var headerFilterDataSource = (_column$headerFilter = column.headerFilter) === null || _column$headerFilter === void 0 ? void 0 : _column$headerFilter.dataSource;
      var headerFilterOptions = that.option('headerFilter');
      var isLookup = false;
      var options = {
        component: that.component
      };
      if (!dataSource) return;

      if (isDefined(headerFilterDataSource) && !isFunction(headerFilterDataSource)) {
        options.dataSource = normalizeDataSourceOptions(headerFilterDataSource);
      } else if (column.lookup) {
        isLookup = true;
        var lookupDataSourceOptions;

        if (column.lookup.items) {
          lookupDataSourceOptions = column.lookup.items;
        } else {
          lookupDataSourceOptions = column.lookup.dataSource;

          if (isFunction(lookupDataSourceOptions) && !variableWrapper.isWrapped(lookupDataSourceOptions)) {
            lookupDataSourceOptions = lookupDataSourceOptions({});
          }
        }

        options.dataSource = normalizeDataSourceOptions(lookupDataSourceOptions);
      } else {
        var cutoffLevel = Array.isArray(group) ? group.length - 1 : 0;
        that._currentColumn = column;

        var filter = that._dataController.getCombinedFilter();

        that._currentColumn = null;
        options.dataSource = {
          filter: filter,
          group: group,
          useDefaultSearch: true,
          load: function load(options) {
            var d = new Deferred(); // TODO remove in 16.1

            options.dataField = column.dataField || column.name;
            dataSource.load(options).done(function (data) {
              var convertUTCDates = remoteGrouping && isUTCFormat(column.serializationFormat) && cutoffLevel > 3;

              if (convertUTCDates) {
                data = convertDataFromUTCToLocal(data, column);
              }

              that._processGroupItems(data, null, null, {
                level: cutoffLevel,
                column: column,
                headerFilterOptions: headerFilterOptions
              });

              d.resolve(data);
            }).fail(d.reject);
            return d;
          }
        };
      }

      if (isFunction(headerFilterDataSource)) {
        headerFilterDataSource.call(column, options);
      }

      var origPostProcess = options.dataSource.postProcess;

      options.dataSource.postProcess = function (data) {
        var items = data;

        if (isLookup) {
          if (this.pageIndex() === 0 && !this.searchValue()) {
            items = items.slice(0);
            items.unshift(null);
          }

          that._processGroupItems(items, null, null, {
            level: 0,
            column: column,
            headerFilterOptions: headerFilterOptions
          });
        }

        items = origPostProcess && origPostProcess.call(this, items) || items;

        that._updateSelectedState(items, column);

        return items;
      };

      return options.dataSource;
    },
    getCurrentColumn: function getCurrentColumn() {
      return this._currentColumn;
    },
    showHeaderFilterMenu: function showHeaderFilterMenu(columnIndex, isGroupPanel) {
      var columnsController = this._columnsController;
      var column = extend(true, {}, this._columnsController.getColumns()[columnIndex]);

      if (column) {
        var visibleIndex = columnsController.getVisibleIndex(columnIndex);
        var view = isGroupPanel ? this.getView('headerPanel') : this.getView('columnHeadersView');
        var $columnElement = $columnElement || view.getColumnElements().eq(isGroupPanel ? column.groupIndex : visibleIndex);
        this.showHeaderFilterMenuBase({
          columnElement: $columnElement,
          column: column,
          applyFilter: true,
          apply: function apply() {
            columnsController.columnOption(columnIndex, {
              filterValues: this.filterValues,
              filterType: this.filterType
            });
          }
        });
      }
    },
    showHeaderFilterMenuBase: function showHeaderFilterMenuBase(options) {
      var that = this;
      var column = options.column;

      if (column) {
        var groupInterval = filterUtils.getGroupInterval(column);

        var dataSource = that._dataController.dataSource();

        var remoteFiltering = dataSource && dataSource.remoteOperations().filtering;
        extend(options, column, {
          type: groupInterval && groupInterval.length > 1 ? 'tree' : 'list',
          remoteFiltering: remoteFiltering,
          onShowing: function onShowing(e) {
            var dxResizableInstance = e.component.$overlayContent().dxResizable('instance');
            dxResizableInstance && dxResizableInstance.option('onResizeEnd', function (e) {
              var columnsController = that.getController('columns');
              var headerFilterByColumn = columnsController.columnOption(options.dataField, 'headerFilter');
              headerFilterByColumn = headerFilterByColumn || {};
              headerFilterByColumn.width = e.width;
              headerFilterByColumn.height = e.height;
              columnsController.columnOption(options.dataField, 'headerFilter', headerFilterByColumn, true);
            });
          },
          onHidden: () => restoreFocus(this)
        });
        options.dataSource = that.getDataSource(options);

        if (options.isFilterBuilder) {
          options.dataSource.filter = null;
          options.alignment = 'right';
        }

        that._headerFilterView.showHeaderFilterMenu(options.columnElement, options);
      }
    },
    hideHeaderFilterMenu: function hideHeaderFilterMenu() {
      this._headerFilterView.hideHeaderFilterMenu();
    }
  };
}());
var ColumnHeadersViewHeaderFilterExtender = extend({}, headerFilterMixin, {
  _renderCellContent: function _renderCellContent($cell, options) {
    var that = this;
    var $headerFilterIndicator;
    var column = options.column;

    if (!column.command && allowHeaderFiltering(column) && that.option('headerFilter.visible') && options.rowType === 'header') {
      $headerFilterIndicator = that._applyColumnState({
        name: 'headerFilter',
        rootElement: $cell,
        column: column,
        showColumnLines: that.option('showColumnLines')
      });
      $headerFilterIndicator && that._subscribeToIndicatorEvent($headerFilterIndicator, column, 'headerFilter');
    }

    that.callBase($cell, options);
  },
  _subscribeToIndicatorEvent: function _subscribeToIndicatorEvent($indicator, column, indicatorName) {
    var that = this;

    if (indicatorName === 'headerFilter') {
      eventsEngine.on($indicator, clickEventName, that.createAction(function (e) {
        e.event.stopPropagation();
        that.getController('headerFilter').showHeaderFilterMenu(column.index, false);
      }));
    }
  },
  _updateIndicator: function _updateIndicator($cell, column, indicatorName) {
    var $indicator = this.callBase($cell, column, indicatorName);
    $indicator && this._subscribeToIndicatorEvent($indicator, column, indicatorName);
  },
  _updateHeaderFilterIndicators: function _updateHeaderFilterIndicators() {
    if (this.option('headerFilter.visible')) {
      this._updateIndicators('headerFilter');
    }
  },
  _needUpdateFilterIndicators: function _needUpdateFilterIndicators() {
    return true;
  },
  _columnOptionChanged: function _columnOptionChanged(e) {
    var optionNames = e.optionNames;

    if (gridCoreUtils.checkChanges(optionNames, ['filterValues', 'filterType'])) {
      if (this._needUpdateFilterIndicators()) {
        this._updateHeaderFilterIndicators();
      }

      return;
    }

    this.callBase(e);
  }
});
var HeaderPanelHeaderFilterExtender = extend({}, headerFilterMixin, {
  _createGroupPanelItem: function _createGroupPanelItem($rootElement, groupColumn) {
    var that = this;
    var $item = that.callBase.apply(that, arguments);
    var $headerFilterIndicator;

    if (!groupColumn.command && allowHeaderFiltering(groupColumn) && that.option('headerFilter.visible')) {
      $headerFilterIndicator = that._applyColumnState({
        name: 'headerFilter',
        rootElement: $item,
        column: {
          alignment: getDefaultAlignment(that.option('rtlEnabled')),
          filterValues: groupColumn.filterValues,
          allowHeaderFiltering: true
        },
        showColumnLines: true
      });
      $headerFilterIndicator && eventsEngine.on($headerFilterIndicator, clickEventName, that.createAction(function (e) {
        var event = e.event;
        event.stopPropagation();
        that.getController('headerFilter').showHeaderFilterMenu(groupColumn.index, true);
      }));
    }

    return $item;
  }
});
export function invertFilterExpression(filter) {
  return ['!', filter];
}
var DataControllerFilterRowExtender = {
  skipCalculateColumnFilters: function skipCalculateColumnFilters() {
    return false;
  },
  _calculateAdditionalFilter: function _calculateAdditionalFilter() {
    if (this.skipCalculateColumnFilters()) {
      return this.callBase();
    }

    var that = this;
    var filters = [that.callBase()];

    var columns = that._columnsController.getVisibleColumns(null, true);

    var headerFilterController = that.getController('headerFilter');
    var currentColumn = headerFilterController.getCurrentColumn();
    each(columns, function (_, column) {
      var filter;

      if (currentColumn && currentColumn.index === column.index) {
        return;
      }

      if (allowHeaderFiltering(column) && column.calculateFilterExpression && Array.isArray(column.filterValues) && column.filterValues.length) {
        var filterValues = [];
        each(column.filterValues, function (_, filterValue) {
          if (Array.isArray(filterValue)) {
            filter = filterValue;
          } else {
            if (column.deserializeValue && !gridCoreUtils.isDateType(column.dataType) && column.dataType !== 'number') {
              filterValue = column.deserializeValue(filterValue);
            }

            filter = column.createFilterExpression(filterValue, '=', 'headerFilter');
          }

          if (filter) {
            filter.columnIndex = column.index;
          }

          filterValues.push(filter);
        });
        filterValues = gridCoreUtils.combineFilters(filterValues, 'or');
        filters.push(column.filterType === 'exclude' ? ['!', filterValues] : filterValues);
      }
    });
    return gridCoreUtils.combineFilters(filters);
  }
};
export var headerFilterModule = {
  defaultOptions: function defaultOptions() {
    return {
      headerFilter: {
        visible: false,
        width: 252,
        height: 325,
        allowSearch: false,
        searchTimeout: 500,
        texts: {
          emptyValue: messageLocalization.format('dxDataGrid-headerFilterEmptyValue'),
          ok: messageLocalization.format('dxDataGrid-headerFilterOK'),
          cancel: messageLocalization.format('dxDataGrid-headerFilterCancel')
        }
      }
    };
  },
  controllers: {
    headerFilter: HeaderFilterController
  },
  views: {
    headerFilterView: HeaderFilterView
  },
  extenders: {
    controllers: {
      data: DataControllerFilterRowExtender
    },
    views: {
      columnHeadersView: ColumnHeadersViewHeaderFilterExtender,
      headerPanel: HeaderPanelHeaderFilterExtender
    }
  }
};