"use strict";

exports.headerFilterModule = void 0;
exports.invertFilterExpression = invertFilterExpression;

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _uiGrid_core = _interopRequireDefault(require("./ui.grid_core.modules"));

var _filtering = _interopRequireDefault(require("../shared/filtering"));

var _uiGrid_core2 = _interopRequireDefault(require("./ui.grid_core.utils"));

var _uiGrid_core3 = require("./ui.grid_core.header_filter_core");

var _message = _interopRequireDefault(require("../../localization/message"));

var _click = require("../../events/click");

var _data = require("../../core/utils/data");

var _iterator = require("../../core/utils/iterator");

var _type = require("../../core/utils/type");

var _position = require("../../core/utils/position");

var _extend = require("../../core/utils/extend");

var _utils = require("../../data/data_source/utils");

var _date = _interopRequireDefault(require("../../localization/date"));

var _variable_wrapper = _interopRequireDefault(require("../../core/utils/variable_wrapper"));

var _deferred = require("../../core/utils/deferred");

var _accessibility = require("../shared/accessibility");

var _query = _interopRequireDefault(require("../../data/query"));

var _store_helper = _interopRequireDefault(require("../../data/store_helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DATE_INTERVAL_FORMATS = {
  'month': function month(value) {
    return _date.default.getMonthNames()[value - 1];
  },
  'quarter': function quarter(value) {
    return _date.default.format(new Date(2000, value * 3 - 1), 'quarter');
  }
};

function ungroupUTCDates(items, dateParts, dates) {
  dateParts = dateParts || [];
  dates = dates || [];
  items.forEach(function (item) {
    if ((0, _type.isDefined)(item.key)) {
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
  var query = (0, _query.default)(dates);

  var group = _uiGrid_core2.default.getHeaderFilterGroupParameters(_extends({}, column, {
    calculateCellValue: function calculateCellValue(date) {
      return date;
    }
  }));

  return _store_helper.default.queryByOptions(query, {
    group: group
  }).toArray();
}

function isUTCFormat(format) {
  return (format === null || format === void 0 ? void 0 : format.slice(-1)) === 'Z' || (format === null || format === void 0 ? void 0 : format.slice(-3)) === '\'Z\'';
}

var HeaderFilterController = _uiGrid_core.default.ViewController.inherit(function () {
  var getFormatOptions = function getFormatOptions(value, column, currentLevel) {
    var groupInterval = _filtering.default.getGroupInterval(column);

    var result = _uiGrid_core2.default.getFormatOptionsByColumn(column, 'headerFilter');

    if (groupInterval) {
      result.groupInterval = groupInterval[currentLevel];

      if (_uiGrid_core2.default.isDateType(column.dataType)) {
        result.format = DATE_INTERVAL_FORMATS[groupInterval[currentLevel]];
      } else if (column.dataType === 'number') {
        result.getDisplayFormat = function () {
          var formatOptions = {
            format: column.format,
            target: 'headerFilter'
          };

          var firstValueText = _uiGrid_core2.default.formatValue(value, formatOptions);

          var secondValue = value + groupInterval[currentLevel];

          var secondValueText = _uiGrid_core2.default.formatValue(secondValue, formatOptions);

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

        (0, _uiGrid_core3.updateHeaderFilterItemSelectionState)(item, _uiGrid_core2.default.getIndexByKey(items[i].value, column.filterValues, null) > -1, isExclude);
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

      if (!(0, _type.isObject)(item)) {
        item = {};
      } else {
        item = (0, _extend.extend)({}, item);
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
      var text = _uiGrid_core2.default.formatValue(displayValue, getFormatOptions(displayValue, column, currentLevel));

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
        displaySelector = (0, _data.compileGetter)(lookup.displayExpr);
        valueSelector = (0, _data.compileGetter)(lookup.valueExpr);
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
          if (currentLevel === level || !(0, _type.isDefined)(groupItems[i].value)) {
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

      var group = _uiGrid_core2.default.getHeaderFilterGroupParameters(column, remoteGrouping);

      var headerFilterDataSource = (_column$headerFilter = column.headerFilter) === null || _column$headerFilter === void 0 ? void 0 : _column$headerFilter.dataSource;
      var headerFilterOptions = that.option('headerFilter');
      var isLookup = false;
      var options = {
        component: that.component
      };
      if (!dataSource) return;

      if ((0, _type.isDefined)(headerFilterDataSource) && !(0, _type.isFunction)(headerFilterDataSource)) {
        options.dataSource = (0, _utils.normalizeDataSourceOptions)(headerFilterDataSource);
      } else if (column.lookup) {
        isLookup = true;
        var lookupDataSourceOptions;

        if (column.lookup.items) {
          lookupDataSourceOptions = column.lookup.items;
        } else {
          lookupDataSourceOptions = column.lookup.dataSource;

          if ((0, _type.isFunction)(lookupDataSourceOptions) && !_variable_wrapper.default.isWrapped(lookupDataSourceOptions)) {
            lookupDataSourceOptions = lookupDataSourceOptions({});
          }
        }

        options.dataSource = (0, _utils.normalizeDataSourceOptions)(lookupDataSourceOptions);
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
            var d = new _deferred.Deferred(); // TODO remove in 16.1

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

      if ((0, _type.isFunction)(headerFilterDataSource)) {
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
      var column = (0, _extend.extend)(true, {}, this._columnsController.getColumns()[columnIndex]);

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
      var _this = this;

      var that = this;
      var column = options.column;

      if (column) {
        var groupInterval = _filtering.default.getGroupInterval(column);

        var dataSource = that._dataController.dataSource();

        var remoteFiltering = dataSource && dataSource.remoteOperations().filtering;
        (0, _extend.extend)(options, column, {
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
          onHidden: function onHidden() {
            return (0, _accessibility.restoreFocus)(_this);
          }
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

var ColumnHeadersViewHeaderFilterExtender = (0, _extend.extend)({}, _uiGrid_core3.headerFilterMixin, {
  _renderCellContent: function _renderCellContent($cell, options) {
    var that = this;
    var $headerFilterIndicator;
    var column = options.column;

    if (!column.command && (0, _uiGrid_core3.allowHeaderFiltering)(column) && that.option('headerFilter.visible') && options.rowType === 'header') {
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
      _events_engine.default.on($indicator, _click.name, that.createAction(function (e) {
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

    if (_uiGrid_core2.default.checkChanges(optionNames, ['filterValues', 'filterType'])) {
      if (this._needUpdateFilterIndicators()) {
        this._updateHeaderFilterIndicators();
      }

      return;
    }

    this.callBase(e);
  }
});
var HeaderPanelHeaderFilterExtender = (0, _extend.extend)({}, _uiGrid_core3.headerFilterMixin, {
  _createGroupPanelItem: function _createGroupPanelItem($rootElement, groupColumn) {
    var that = this;
    var $item = that.callBase.apply(that, arguments);
    var $headerFilterIndicator;

    if (!groupColumn.command && (0, _uiGrid_core3.allowHeaderFiltering)(groupColumn) && that.option('headerFilter.visible')) {
      $headerFilterIndicator = that._applyColumnState({
        name: 'headerFilter',
        rootElement: $item,
        column: {
          alignment: (0, _position.getDefaultAlignment)(that.option('rtlEnabled')),
          filterValues: groupColumn.filterValues,
          allowHeaderFiltering: true
        },
        showColumnLines: true
      });
      $headerFilterIndicator && _events_engine.default.on($headerFilterIndicator, _click.name, that.createAction(function (e) {
        var event = e.event;
        event.stopPropagation();
        that.getController('headerFilter').showHeaderFilterMenu(groupColumn.index, true);
      }));
    }

    return $item;
  }
});

function invertFilterExpression(filter) {
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
    (0, _iterator.each)(columns, function (_, column) {
      var filter;

      if (currentColumn && currentColumn.index === column.index) {
        return;
      }

      if ((0, _uiGrid_core3.allowHeaderFiltering)(column) && column.calculateFilterExpression && Array.isArray(column.filterValues) && column.filterValues.length) {
        var filterValues = [];
        (0, _iterator.each)(column.filterValues, function (_, filterValue) {
          if (Array.isArray(filterValue)) {
            filter = filterValue;
          } else {
            if (column.deserializeValue && !_uiGrid_core2.default.isDateType(column.dataType) && column.dataType !== 'number') {
              filterValue = column.deserializeValue(filterValue);
            }

            filter = column.createFilterExpression(filterValue, '=', 'headerFilter');
          }

          if (filter) {
            filter.columnIndex = column.index;
          }

          filterValues.push(filter);
        });
        filterValues = _uiGrid_core2.default.combineFilters(filterValues, 'or');
        filters.push(column.filterType === 'exclude' ? ['!', filterValues] : filterValues);
      }
    });
    return _uiGrid_core2.default.combineFilters(filters);
  }
};
var headerFilterModule = {
  defaultOptions: function defaultOptions() {
    return {
      headerFilter: {
        visible: false,
        width: 252,
        height: 325,
        allowSearch: false,
        searchTimeout: 500,
        texts: {
          emptyValue: _message.default.format('dxDataGrid-headerFilterEmptyValue'),
          ok: _message.default.format('dxDataGrid-headerFilterOK'),
          cancel: _message.default.format('dxDataGrid-headerFilterCancel')
        }
      }
    };
  },
  controllers: {
    headerFilter: HeaderFilterController
  },
  views: {
    headerFilterView: _uiGrid_core3.HeaderFilterView
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
exports.headerFilterModule = headerFilterModule;