"use strict";

exports.filterSyncModule = void 0;

var _type = require("../../core/utils/type");

var _uiGrid_core = _interopRequireDefault(require("./ui.grid_core.modules"));

var _utils = require("../filter_builder/utils");

var _ui = _interopRequireDefault(require("../widget/ui.errors"));

var _uiGrid_core2 = _interopRequireDefault(require("./ui.grid_core.utils"));

var _filtering = _interopRequireDefault(require("../shared/filtering"));

var _uiGrid_core3 = require("./ui.grid_core.filter_custom_operations");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FILTER_ROW_OPERATIONS = ['=', '<>', '<', '<=', '>', '>=', 'notcontains', 'contains', 'startswith', 'endswith', 'between'];
var FILTER_TYPES_INCLUDE = 'include';
var FILTER_TYPES_EXCLUDE = 'exclude';

function getColumnIdentifier(column) {
  return column.name || column.dataField;
}

function checkForErrors(columns) {
  columns.forEach(function (column) {
    var identifier = getColumnIdentifier(column);
    if (!(0, _type.isDefined)(identifier) && column.allowFiltering) throw new _ui.default.Error('E1049', column.caption);
  });
}

var FilterSyncController = _uiGrid_core.default.Controller.inherit(function () {
  var getEmptyFilterValues = function getEmptyFilterValues() {
    return {
      filterType: FILTER_TYPES_INCLUDE,
      filterValues: undefined
    };
  };

  var canSyncHeaderFilterWithFilterRow = function canSyncHeaderFilterWithFilterRow(column) {
    var filterValues = column.filterValues || [];
    return !_filtering.default.getGroupInterval(column) && !(column.headerFilter && column.headerFilter.dataSource) || filterValues.length === 1 && filterValues[0] === null;
  };

  var getHeaderFilterFromCondition = function getHeaderFilterFromCondition(headerFilterCondition, column) {
    if (!headerFilterCondition) {
      return getEmptyFilterValues();
    }

    var filterType;
    var selectedFilterOperation = headerFilterCondition[1];
    var value = headerFilterCondition[2];
    var hasArrayValue = Array.isArray(value);

    if (!hasArrayValue) {
      if (!canSyncHeaderFilterWithFilterRow(column)) {
        return getEmptyFilterValues();
      }
    }

    switch (selectedFilterOperation) {
      case 'anyof':
      case '=':
        filterType = FILTER_TYPES_INCLUDE;
        break;

      case 'noneof':
      case '<>':
        filterType = FILTER_TYPES_EXCLUDE;
        break;

      default:
        return getEmptyFilterValues();
    }

    return {
      filterType: filterType,
      filterValues: hasArrayValue ? value : [value]
    };
  };

  var getConditionFromFilterRow = function getConditionFromFilterRow(column) {
    var value = column.filterValue;

    if ((0, _type.isDefined)(value)) {
      var operation = column.selectedFilterOperation || column.defaultFilterOperation || (0, _utils.getDefaultOperation)(column);
      var filter = [getColumnIdentifier(column), operation, column.filterValue];
      return filter;
    } else {
      return null;
    }
  };

  var getConditionFromHeaderFilter = function getConditionFromHeaderFilter(column) {
    var selectedOperation;
    var value;
    var filterValues = column.filterValues;
    if (!filterValues) return null;

    if (filterValues.length === 1 && canSyncHeaderFilterWithFilterRow(column) && !Array.isArray(filterValues[0])) {
      column.filterType === FILTER_TYPES_EXCLUDE ? selectedOperation = '<>' : selectedOperation = '=';
      value = filterValues[0];
    } else {
      column.filterType === FILTER_TYPES_EXCLUDE ? selectedOperation = 'noneof' : selectedOperation = 'anyof';
      value = filterValues;
    }

    return [getColumnIdentifier(column), selectedOperation, value];
  };

  var updateHeaderFilterCondition = function updateHeaderFilterCondition(columnsController, column, headerFilterCondition) {
    var headerFilter = getHeaderFilterFromCondition(headerFilterCondition, column);
    columnsController.columnOption(getColumnIdentifier(column), headerFilter);
  };

  var updateFilterRowCondition = function updateFilterRowCondition(columnsController, column, condition) {
    var filterRowOptions;
    var selectedFilterOperation = condition === null || condition === void 0 ? void 0 : condition[1];
    var filterValue = condition === null || condition === void 0 ? void 0 : condition[2];
    var filterOperations = column.filterOperations || column.defaultFilterOperations;

    if ((!filterOperations || filterOperations.indexOf(selectedFilterOperation) >= 0 || selectedFilterOperation === column.defaultFilterOperation) && FILTER_ROW_OPERATIONS.indexOf(selectedFilterOperation) >= 0 && filterValue !== null) {
      if (selectedFilterOperation === column.defaultFilterOperation && !(0, _type.isDefined)(column.selectedFilterOperation)) {
        selectedFilterOperation = column.selectedFilterOperation;
      }

      filterRowOptions = {
        filterValue: filterValue,
        selectedFilterOperation: selectedFilterOperation
      };
    } else {
      filterRowOptions = {
        filterValue: undefined,
        selectedFilterOperation: undefined
      };
    }

    columnsController.columnOption(getColumnIdentifier(column), filterRowOptions);
  };

  return {
    syncFilterValue: function syncFilterValue() {
      var that = this;
      var columnsController = that.getController('columns');
      var columns = columnsController.getFilteringColumns();
      this._skipSyncColumnOptions = true;
      columns.forEach(function (column) {
        var filterConditions = (0, _utils.getMatchedConditions)(that.option('filterValue'), getColumnIdentifier(column));

        if (filterConditions.length === 1) {
          var filterCondition = filterConditions[0];
          updateHeaderFilterCondition(columnsController, column, filterCondition);
          updateFilterRowCondition(columnsController, column, filterCondition);
        } else {
          (0, _type.isDefined)(column.filterValues) && updateHeaderFilterCondition(columnsController, column);
          (0, _type.isDefined)(column.filterValue) && updateFilterRowCondition(columnsController, column);
        }
      });
      this._skipSyncColumnOptions = false;
    },
    _initSync: function _initSync() {
      var columns = this.getController('columns').getColumns();
      var dataController = this.getController('data');
      var pageIndex = dataController.pageIndex();
      checkForErrors(columns);

      if (!this.option('filterValue')) {
        var filteringColumns = this.getController('columns').getFilteringColumns();
        var filterValue = this.getFilterValueFromColumns(filteringColumns);
        this.option('filterValue', filterValue);
      }

      this.syncFilterValue();
      dataController.pageIndex(pageIndex);
    },
    init: function init() {
      var _this = this;

      var dataController = this.getController('data');

      if (dataController.isFilterSyncActive()) {
        if (this.getController('columns').isAllDataTypesDefined()) {
          this._initSync();
        } else {
          dataController.dataSourceChanged.add(function () {
            return _this._initSync();
          });
        }
      }
    },
    _getSyncFilterRow: function _getSyncFilterRow(filterValue, column) {
      var filter = getConditionFromFilterRow(column);

      if ((0, _type.isDefined)(filter)) {
        return (0, _utils.syncFilters)(filterValue, filter);
      } else {
        return (0, _utils.removeFieldConditionsFromFilter)(filterValue, getColumnIdentifier(column));
      }
    },
    _getSyncHeaderFilter: function _getSyncHeaderFilter(filterValue, column) {
      var filter = getConditionFromHeaderFilter(column);

      if (filter) {
        return (0, _utils.syncFilters)(filterValue, filter);
      } else {
        return (0, _utils.removeFieldConditionsFromFilter)(filterValue, getColumnIdentifier(column));
      }
    },
    getFilterValueFromColumns: function getFilterValueFromColumns(columns) {
      if (!this.getController('data').isFilterSyncActive()) {
        return null;
      }

      var filterValue = ['and'];
      columns && columns.forEach(function (column) {
        var headerFilter = getConditionFromHeaderFilter(column);
        var filterRow = getConditionFromFilterRow(column);
        headerFilter && (0, _utils.addItem)(headerFilter, filterValue);
        filterRow && (0, _utils.addItem)(filterRow, filterValue);
      });
      return (0, _utils.getNormalizedFilter)(filterValue);
    },
    syncFilterRow: function syncFilterRow(column, value) {
      this.option('filterValue', this._getSyncFilterRow(this.option('filterValue'), column));
    },
    syncHeaderFilter: function syncHeaderFilter(column) {
      this.option('filterValue', this._getSyncHeaderFilter(this.option('filterValue'), column));
    },
    getCustomFilterOperations: function getCustomFilterOperations() {
      var filterBuilderCustomOperations = this.option('filterBuilder.customOperations') || [];
      return [(0, _uiGrid_core3.anyOf)(this.component), (0, _uiGrid_core3.noneOf)(this.component)].concat(filterBuilderCustomOperations);
    },
    publicMethods: function publicMethods() {
      return ['getCustomFilterOperations'];
    }
  };
}());

var DataControllerFilterSyncExtender = {
  isFilterSyncActive: function isFilterSyncActive() {
    var filterSyncEnabledValue = this.option('filterSyncEnabled');
    return filterSyncEnabledValue === 'auto' ? this.option('filterPanel.visible') : filterSyncEnabledValue;
  },
  skipCalculateColumnFilters: function skipCalculateColumnFilters() {
    return (0, _type.isDefined)(this.option('filterValue')) && this.isFilterSyncActive();
  },
  _calculateAdditionalFilter: function _calculateAdditionalFilter() {
    var that = this;

    if (that.option('filterPanel.filterEnabled') === false) {
      return that.callBase();
    }

    var filters = [that.callBase()];
    var columns = that.getController('columns').getFilteringColumns();
    var filterValue = that.option('filterValue');

    if (that.isFilterSyncActive()) {
      var currentColumn = that.getController('headerFilter').getCurrentColumn();

      if (currentColumn && filterValue) {
        filterValue = (0, _utils.removeFieldConditionsFromFilter)(filterValue, getColumnIdentifier(currentColumn));
      }
    }

    var customOperations = that.getController('filterSync').getCustomFilterOperations();
    var calculatedFilterValue = (0, _utils.getFilterExpression)(filterValue, columns, customOperations, 'filterBuilder');

    if (calculatedFilterValue) {
      filters.push(calculatedFilterValue);
    }

    return _uiGrid_core2.default.combineFilters(filters);
  },
  _parseColumnPropertyName: function _parseColumnPropertyName(fullName) {
    var matched = fullName.match(/.*\.(.*)/);

    if (matched) {
      return matched[1];
    } else {
      return null;
    }
  },
  clearFilter: function clearFilter(filterName) {
    this.component.beginUpdate();

    if (arguments.length > 0) {
      if (filterName === 'filterValue') {
        this.option('filterValue', null);
      }

      this.callBase(filterName);
    } else {
      this.option('filterValue', null);
      this.callBase();
    }

    this.component.endUpdate();
  },
  optionChanged: function optionChanged(args) {
    switch (args.name) {
      case 'filterValue':
        this._applyFilter();

        this.isFilterSyncActive() && this.getController('filterSync').syncFilterValue();
        args.handled = true;
        break;

      case 'filterSyncEnabled':
        args.handled = true;
        break;

      case 'columns':
        if (this.isFilterSyncActive()) {
          var column = this.getController('columns').getColumnByPath(args.fullName);
          var filterSyncController = this.getController('filterSync');

          if (column && !filterSyncController._skipSyncColumnOptions) {
            var propertyName = this._parseColumnPropertyName(args.fullName);

            filterSyncController._skipSyncColumnOptions = true;

            if ('filterType' === propertyName) {
              if (FILTER_TYPES_EXCLUDE === args.value || FILTER_TYPES_EXCLUDE === args.previousValue) {
                filterSyncController.syncHeaderFilter(column);
              }
            } else if ('filterValues' === propertyName) {
              filterSyncController.syncHeaderFilter(column);
            } else if (['filterValue', 'selectedFilterOperation'].indexOf(propertyName) > -1) {
              filterSyncController.syncFilterRow(column, column.filterValue);
            }

            filterSyncController._skipSyncColumnOptions = false;
          }
        }

        this.callBase(args);
        break;

      default:
        this.callBase(args);
    }
  }
};
var ColumnHeadersViewFilterSyncExtender = {
  _isHeaderFilterEmpty: function _isHeaderFilterEmpty(column) {
    if (this.getController('data').isFilterSyncActive()) {
      return !(0, _utils.filterHasField)(this.option('filterValue'), getColumnIdentifier(column));
    }

    return this.callBase(column);
  },
  _needUpdateFilterIndicators: function _needUpdateFilterIndicators() {
    return !this.getController('data').isFilterSyncActive();
  },
  optionChanged: function optionChanged(args) {
    if (args.name === 'filterValue') {
      this._updateHeaderFilterIndicators();
    } else {
      this.callBase(args);
    }
  }
};
var filterSyncModule = {
  defaultOptions: function defaultOptions() {
    return {
      filterValue: null,
      filterSyncEnabled: 'auto'
    };
  },
  controllers: {
    filterSync: FilterSyncController
  },
  extenders: {
    controllers: {
      data: DataControllerFilterSyncExtender
    },
    views: {
      columnHeadersView: ColumnHeadersViewFilterSyncExtender
    }
  }
};
exports.filterSyncModule = filterSyncModule;