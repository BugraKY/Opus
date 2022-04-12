import { normalizeDataSourceOptions } from '../../data/data_source/utils';
import Store from '../../data/abstract_store';
import { executeAsync } from '../../core/utils/common';
import { isFunction, isNumeric, isDefined, isString, isPlainObject } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { inArray, normalizeIndexes } from '../../core/utils/array';
import { each } from '../../core/utils/iterator';
import { when, Deferred } from '../../core/utils/deferred';
import Class from '../../core/class';
import { EventsStrategy } from '../../core/events_strategy';
import { titleize } from '../../core/utils/inflector';
import { LocalStore } from './local_store';
import RemoteStore from './remote_store';
import { sort } from './data_source.utils';
import { XmlaStore } from './xmla_store/xmla_store';
import { applyDisplaySummaryMode, createMockSummaryCell, applyRunningTotal } from './ui.pivot_grid.summary_display_modes';
import { foreachTree, foreachTreeAsync, findField, formatValue, createPath, setFieldProperty, getFieldsDataType } from './ui.pivot_grid.utils';
var DESCRIPTION_NAME_BY_AREA = {
  row: 'rows',
  column: 'columns',
  data: 'values',
  filter: 'filters'
};
var STATE_PROPERTIES = ['area', 'areaIndex', 'sortOrder', 'filterType', 'filterValues', 'sortBy', 'sortBySummaryField', 'sortBySummaryPath', 'expanded', 'summaryType', 'summaryDisplayMode'];
var CALCULATED_PROPERTIES = ['format', 'selector', 'customizeText', 'caption'];
var ALL_CALCULATED_PROPERTIES = CALCULATED_PROPERTIES.concat(['allowSorting', 'allowSortingBySummary', 'allowFiltering', 'allowExpandAll']);

function createCaption(field) {
  var caption = field.dataField || field.groupName || '';
  var summaryType = (field.summaryType || '').toLowerCase();

  if (isString(field.groupInterval)) {
    caption += '_' + field.groupInterval;
  }

  if (summaryType && summaryType !== 'custom') {
    summaryType = summaryType.replace(/^./, summaryType[0].toUpperCase());

    if (caption.length) {
      summaryType = ' (' + summaryType + ')';
    }
  } else {
    summaryType = '';
  }

  return titleize(caption) + summaryType;
}

function resetFieldState(field, properties) {
  var initialProperties = field._initProperties || {};
  each(properties, function (_, prop) {
    if (Object.prototype.hasOwnProperty.call(initialProperties, prop)) {
      field[prop] = initialProperties[prop];
    }
  });
}

function updateCalculatedFieldProperties(field, calculatedProperties) {
  resetFieldState(field, calculatedProperties);

  if (!isDefined(field.caption)) {
    setFieldProperty(field, 'caption', createCaption(field));
  }
}

function areExpressionsUsed(dataFields) {
  return dataFields.some(function (field) {
    return field.summaryDisplayMode || field.calculateSummaryValue;
  });
}

function isRunningTotalUsed(dataFields) {
  return dataFields.some(function (field) {
    return !!field.runningTotal;
  });
}

function isDataExists(data) {
  return data.rows.length || data.columns.length || data.values.length;
}

export default Class.inherit(function () {
  var findHeaderItem = function findHeaderItem(headerItems, path) {
    if (headerItems._cacheByPath) {
      return headerItems._cacheByPath[path.join('.')] || null;
    }
  };

  var getHeaderItemsLastIndex = function getHeaderItemsLastIndex(headerItems, grandTotalIndex) {
    var i;
    var lastIndex = -1;
    var headerItem;

    if (headerItems) {
      for (i = 0; i < headerItems.length; i++) {
        headerItem = headerItems[i];

        if (headerItem.index !== undefined) {
          lastIndex = Math.max(lastIndex, headerItem.index);
        }

        if (headerItem.children) {
          lastIndex = Math.max(lastIndex, getHeaderItemsLastIndex(headerItem.children));
        } else if (headerItem.collapsedChildren) {
          // B232736
          lastIndex = Math.max(lastIndex, getHeaderItemsLastIndex(headerItem.collapsedChildren));
        }
      }
    }

    if (isDefined(grandTotalIndex)) {
      lastIndex = Math.max(lastIndex, grandTotalIndex);
    }

    return lastIndex;
  };

  var updateHeaderItemChildren = function updateHeaderItemChildren(headerItems, headerItem, children, grandTotalIndex) {
    var applyingHeaderItemsCount = getHeaderItemsLastIndex(children) + 1;
    var emptyIndex = getHeaderItemsLastIndex(headerItems, grandTotalIndex) + 1;
    var index;
    var applyingItemIndexesToCurrent = [];
    var needIndexUpdate = false;
    var d = new Deferred();

    if (headerItem.children && headerItem.children.length === children.length) {
      for (var i = 0; i < children.length; i++) {
        var child = children[i];

        if (child.index !== undefined) {
          if (headerItem.children[i].index === undefined) {
            child.index = applyingItemIndexesToCurrent[child.index] = emptyIndex++;
            headerItem.children[i] = child;
          } else {
            applyingItemIndexesToCurrent[child.index] = headerItem.children[i].index;
          }
        }
      }
    } else {
      needIndexUpdate = true;

      for (index = 0; index < applyingHeaderItemsCount; index++) {
        applyingItemIndexesToCurrent[index] = emptyIndex++;
      }

      headerItem.children = children;
    }

    when(foreachTreeAsync(headerItem.children, function (items) {
      if (needIndexUpdate) {
        items[0].index = applyingItemIndexesToCurrent[items[0].index];
      }
    })).done(function () {
      d.resolve(applyingItemIndexesToCurrent);
    });
    return d;
  };

  var updateHeaderItems = function updateHeaderItems(headerItems, newHeaderItems, grandTotalIndex) {
    var d = new Deferred();
    var emptyIndex = grandTotalIndex >= 0 && getHeaderItemsLastIndex(headerItems, grandTotalIndex) + 1;
    var applyingItemIndexesToCurrent = []; // reset cache

    when(foreachTreeAsync(headerItems, function (items) {
      delete items[0].collapsedChildren;
    })).done(function () {
      when(foreachTreeAsync(newHeaderItems, function (newItems, index) {
        var newItem = newItems[0];

        if (newItem.index >= 0) {
          var headerItem = findHeaderItem(headerItems, createPath(newItems));

          if (headerItem && headerItem.index >= 0) {
            applyingItemIndexesToCurrent[newItem.index] = headerItem.index;
          } else if (emptyIndex) {
            var path = createPath(newItems.slice(1));
            headerItem = findHeaderItem(headerItems, path);
            var parentItems = path.length ? headerItem && headerItem.children : headerItems;

            if (parentItems) {
              parentItems[index] = newItem;
              newItem.index = applyingItemIndexesToCurrent[newItem.index] = emptyIndex++;
            }
          }
        }
      })).done(function () {
        d.resolve(applyingItemIndexesToCurrent);
      });
    });
    return d;
  };

  var updateDataSourceCells = function updateDataSourceCells(dataSource, newDataSourceCells, newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) {
    var newRowIndex;
    var newColumnIndex;
    var newRowCells;
    var newCell;
    var rowIndex;
    var columnIndex;
    var dataSourceCells = dataSource.values;

    if (newDataSourceCells) {
      for (newRowIndex = 0; newRowIndex <= newDataSourceCells.length; newRowIndex++) {
        newRowCells = newDataSourceCells[newRowIndex];
        rowIndex = newRowItemIndexesToCurrent[newRowIndex];

        if (!isDefined(rowIndex)) {
          rowIndex = dataSource.grandTotalRowIndex;
        }

        if (newRowCells && isDefined(rowIndex)) {
          if (!dataSourceCells[rowIndex]) {
            dataSourceCells[rowIndex] = [];
          }

          for (newColumnIndex = 0; newColumnIndex <= newRowCells.length; newColumnIndex++) {
            newCell = newRowCells[newColumnIndex];
            columnIndex = newColumnItemIndexesToCurrent[newColumnIndex];

            if (!isDefined(columnIndex)) {
              columnIndex = dataSource.grandTotalColumnIndex;
            }

            if (isDefined(newCell) && isDefined(columnIndex)) {
              dataSourceCells[rowIndex][columnIndex] = newCell;
            }
          }
        }
      }
    }
  };

  function createLocalOrRemoteStore(dataSourceOptions, notifyProgress) {
    var StoreConstructor = dataSourceOptions.remoteOperations || dataSourceOptions.paginate ? RemoteStore : LocalStore;
    return new StoreConstructor(extend(normalizeDataSourceOptions(dataSourceOptions), {
      onChanged: null,
      onLoadingChanged: null,
      onProgressChanged: notifyProgress
    }));
  }

  function createStore(dataSourceOptions, notifyProgress) {
    var store;
    var storeOptions;

    if (isPlainObject(dataSourceOptions) && dataSourceOptions.load) {
      store = createLocalOrRemoteStore(dataSourceOptions, notifyProgress);
    } else {
      // TODO remove
      if (dataSourceOptions && !dataSourceOptions.store) {
        dataSourceOptions = {
          store: dataSourceOptions
        };
      }

      storeOptions = dataSourceOptions.store;

      if (storeOptions.type === 'xmla') {
        store = new XmlaStore(storeOptions);
      } else if (isPlainObject(storeOptions) && storeOptions.type || storeOptions instanceof Store || Array.isArray(storeOptions)) {
        store = createLocalOrRemoteStore(dataSourceOptions, notifyProgress);
      } else if (storeOptions instanceof Class) {
        store = storeOptions;
      }
    }

    return store;
  }

  function equalFields(fields, prevFields, count) {
    for (var i = 0; i < count; i++) {
      if (!fields[i] || !prevFields[i] || fields[i].index !== prevFields[i].index) {
        return false;
      }
    }

    return true;
  }

  function getExpandedPaths(dataSource, loadOptions, dimensionName, prevLoadOptions) {
    var result = [];
    var fields = loadOptions && loadOptions[dimensionName] || [];
    var prevFields = prevLoadOptions && prevLoadOptions[dimensionName] || [];
    foreachTree(dataSource[dimensionName], function (items) {
      var item = items[0];
      var path = createPath(items);

      if (item.children && fields[path.length - 1] && !fields[path.length - 1].expanded) {
        if (path.length < fields.length && (!prevLoadOptions || equalFields(fields, prevFields, path.length))) {
          result.push(path.slice());
        }
      }
    }, true);
    return result;
  }

  function setFieldProperties(field, srcField, skipInitPropertySave, properties) {
    if (srcField) {
      each(properties, function (_, name) {
        if (skipInitPropertySave) {
          field[name] = srcField[name];
        } else {
          if ((name === 'summaryType' || name === 'summaryDisplayMode') && srcField[name] === undefined) {
            // T399271
            return;
          }

          setFieldProperty(field, name, srcField[name]);
        }
      });
    } else {
      resetFieldState(field, properties);
    }

    return field;
  }

  function getFieldsState(fields, properties) {
    var result = [];
    each(fields, function (_, field) {
      result.push(setFieldProperties({
        dataField: field.dataField,
        name: field.name
      }, field, true, properties));
    });
    return result;
  }

  function getFieldStateId(field) {
    if (field.name) {
      return field.name;
    }

    return field.dataField + '';
  }

  function getFieldsById(fields, id) {
    var result = [];
    each(fields || [], function (_, field) {
      if (getFieldStateId(field) === id) {
        result.push(field);
      }
    });
    return result;
  }

  function setFieldsStateCore(stateFields, fields) {
    stateFields = stateFields || [];
    each(fields, function (index, field) {
      setFieldProperties(field, stateFields[index], false, STATE_PROPERTIES);
      updateCalculatedFieldProperties(field, CALCULATED_PROPERTIES);
    });
    return fields;
  }

  function setFieldsState(stateFields, fields) {
    stateFields = stateFields || [];
    var fieldsById = {};
    var id;
    each(fields, function (_, field) {
      id = getFieldStateId(field);

      if (!fieldsById[id]) {
        fieldsById[id] = getFieldsById(fields, getFieldStateId(field));
      }
    });
    each(fieldsById, function (id, fields) {
      setFieldsStateCore(getFieldsById(stateFields, id), fields);
    });
    return fields;
  }

  function getFieldsByGroup(fields, groupingField) {
    return fields.filter(field => {
      return field.groupName === groupingField.groupName && isNumeric(field.groupIndex) && field.visible !== false;
    }).map(function (field) {
      return extend(field, {
        areaIndex: groupingField.areaIndex,
        area: groupingField.area,
        expanded: isDefined(field.expanded) ? field.expanded : groupingField.expanded,
        dataField: field.dataField || groupingField.dataField,
        dataType: field.dataType || groupingField.dataType,
        sortBy: field.sortBy || groupingField.sortBy,
        sortOrder: field.sortOrder || groupingField.sortOrder,
        sortBySummaryField: field.sortBySummaryField || groupingField.sortBySummaryField,
        sortBySummaryPath: field.sortBySummaryPath || groupingField.sortBySummaryPath,
        visible: field.visible || groupingField.visible,
        showTotals: isDefined(field.showTotals) ? field.showTotals : groupingField.showTotals,
        showGrandTotals: isDefined(field.showGrandTotals) ? field.showGrandTotals : groupingField.showGrandTotals
      });
    }).sort(function (a, b) {
      return a.groupIndex - b.groupIndex;
    });
  }

  function sortFieldsByAreaIndex(fields) {
    fields.sort(function (field1, field2) {
      return field1.areaIndex - field2.areaIndex || field1.groupIndex - field2.groupIndex;
    });
  }

  function isAreaField(field, area) {
    var canAddFieldInArea = area === 'data' || field.visible !== false;
    return field.area === area && !isDefined(field.groupIndex) && canAddFieldInArea;
  }

  function getFieldId(field, retrieveFieldsOptionValue) {
    var groupName = field.groupName || '';
    return (field.dataField || groupName) + (field.groupInterval ? groupName + field.groupInterval : 'NOGROUP') + (retrieveFieldsOptionValue ? '' : groupName);
  }

  function mergeFields(fields, storeFields, retrieveFieldsOptionValue) {
    var result = [];
    var fieldsDictionary = {};
    var removedFields = {};
    var mergedGroups = [];
    var dataTypes = getFieldsDataType(fields);

    if (storeFields) {
      each(storeFields, function (_, field) {
        fieldsDictionary[getFieldId(field, retrieveFieldsOptionValue)] = field;
      });
      each(fields, function (_, field) {
        var fieldKey = getFieldId(field, retrieveFieldsOptionValue);
        var storeField = fieldsDictionary[fieldKey] || removedFields[fieldKey];
        var mergedField;

        if (storeField) {
          if (storeField._initProperties) {
            resetFieldState(storeField, ALL_CALCULATED_PROPERTIES);
          }

          mergedField = extend({}, storeField, field, {
            _initProperties: null
          });
        } else {
          fieldsDictionary[fieldKey] = mergedField = field;
        }

        extend(mergedField, {
          dataType: dataTypes[field.dataField]
        });
        delete fieldsDictionary[fieldKey];
        removedFields[fieldKey] = storeField;
        result.push(mergedField);
      });

      if (retrieveFieldsOptionValue) {
        each(fieldsDictionary, function (_, field) {
          result.push(field);
        });
      }
    } else {
      result = fields;
    }

    result.push.apply(result, mergedGroups);
    assignGroupIndexes(result);
    return result;
  }

  function assignGroupIndexes(fields) {
    fields.forEach(field => {
      if (field.groupName && field.groupInterval && field.groupIndex === undefined) {
        var maxGroupIndex = fields.filter(f => f.groupName === field.groupName && isNumeric(f.groupIndex)).map(f => f.groupIndex).reduce((prev, current) => Math.max(prev, current), -1);
        field.groupIndex = maxGroupIndex + 1;
      }
    });
  }

  function getFields(that) {
    var result = new Deferred();
    var store = that._store;
    var storeFields = store && store.getFields(that._fields);
    var mergedFields;
    when(storeFields).done(function (storeFields) {
      that._storeFields = storeFields;
      mergedFields = mergeFields(that._fields, storeFields, that._retrieveFields);
      result.resolve(mergedFields);
    }).fail(result.reject);
    return result;
  }

  function formatHeaderItems(data, loadOptions, headerName) {
    return foreachTreeAsync(data[headerName], function (items) {
      var item = items[0];
      item.text = item.text || formatValue(item.value, loadOptions[headerName][createPath(items).length - 1]);
    });
  }

  function formatHeaders(loadOptions, data) {
    return when(formatHeaderItems(data, loadOptions, 'columns'), formatHeaderItems(data, loadOptions, 'rows'));
  }

  function updateCache(headerItems) {
    var d = new Deferred();
    var cacheByPath = {};
    when(foreachTreeAsync(headerItems, function (items) {
      var path = createPath(items).join('.');
      cacheByPath[path] = items[0];
    })).done(d.resolve);
    headerItems._cacheByPath = cacheByPath;
    return d;
  }

  function _getAreaFields(fields, area) {
    var areaFields = [];
    each(fields, function () {
      if (isAreaField(this, area)) {
        areaFields.push(this);
      }
    });
    return areaFields;
  }

  return {
    ctor: function ctor(options) {
      options = options || {};
      this._eventsStrategy = new EventsStrategy(this);
      var that = this;
      var store = createStore(options, function (progress) {
        that._eventsStrategy.fireEvent('progressChanged', [progress]);
      });
      that._store = store;
      that._paginate = !!options.paginate;
      that._pageSize = options.pageSize || 40;
      that._data = {
        rows: [],
        columns: [],
        values: []
      };
      that._loadingCount = 0;
      that._isFieldsModified = false;
      each(['changed', 'loadError', 'loadingChanged', 'progressChanged', 'fieldsPrepared', 'expandValueChanging'], function (_, eventName) {
        var optionName = 'on' + eventName[0].toUpperCase() + eventName.slice(1);

        if (Object.prototype.hasOwnProperty.call(options, optionName)) {
          this.on(eventName, options[optionName]);
        }
      }.bind(this));
      that._retrieveFields = isDefined(options.retrieveFields) ? options.retrieveFields : true;
      that._fields = options.fields || [];
      /**
      * @name PivotGridDataSourceOptions.fields.index
      * @type number
      * @default undefined
      * @hidden
      */

      /**
      * @name PivotGridDataSourceOptions.fields.headerFilter.width
      * @type number
      * @default undefined
      */

      /**
      * @name PivotGridDataSourceOptions.fields.headerFilter.height
      * @type number
      * @default undefined
      */

      /**
      * @name PivotGridDataSourceOptions.fields.headerFilter.allowSearch
      * @type boolean
      * @default undefined
      */

      that._descriptions = options.descriptions ? extend(that._createDescriptions(), options.descriptions) : undefined;

      if (!store) {
        // TODO create dashboard store
        extend(true, that._data, options.store || options);
      }
    },
    getData: function getData() {
      return this._data;
    },
    getAreaFields: function getAreaFields(area, collectGroups) {
      var areaFields = [];
      var descriptions;

      if (collectGroups || area === 'data') {
        areaFields = _getAreaFields(this._fields, area);
        sortFieldsByAreaIndex(areaFields);
      } else {
        descriptions = this._descriptions || {};
        areaFields = descriptions[DESCRIPTION_NAME_BY_AREA[area]] || [];
      }

      return areaFields;
    },
    fields: function fields(_fields) {
      var that = this;

      if (_fields) {
        that._fields = mergeFields(_fields, that._storeFields, that._retrieveFields);

        that._fieldsPrepared(that._fields);
      }

      return that._fields;
    },
    field: function field(id, options) {
      var that = this;
      var fields = that._fields;
      var field = fields && fields[isNumeric(id) ? id : findField(fields, id)];
      var levels;

      if (field && options) {
        each(options, function (optionName, optionValue) {
          var isInitialization = inArray(optionName, STATE_PROPERTIES) < 0;
          setFieldProperty(field, optionName, optionValue, isInitialization);

          if (optionName === 'sortOrder') {
            levels = field.levels || [];

            for (var i = 0; i < levels.length; i++) {
              levels[i][optionName] = optionValue;
            }
          }
        });
        updateCalculatedFieldProperties(field, CALCULATED_PROPERTIES);
        that._descriptions = that._createDescriptions(field);
        that._isFieldsModified = true;

        that._eventsStrategy.fireEvent('fieldChanged', [field]);
      }

      return field;
    },
    getFieldValues: function getFieldValues(index, applyFilters, options) {
      var that = this;
      var field = this._fields && this._fields[index];
      var store = this.store();
      var loadFields = [];
      var loadOptions = {
        columns: loadFields,
        rows: [],
        values: this.getAreaFields('data'),
        filters: applyFilters ? this._fields.filter(f => f !== field && f.area && f.filterValues && f.filterValues.length) : [],
        skipValues: true
      };
      var searchValue;
      var d = new Deferred();

      if (options) {
        searchValue = options.searchValue;
        loadOptions.columnSkip = options.skip;
        loadOptions.columnTake = options.take;
      }

      if (field && store) {
        each(field.levels || [field], function () {
          loadFields.push(extend({}, this, {
            expanded: true,
            filterValues: null,
            sortOrder: 'asc',
            sortBySummaryField: null,
            searchValue: searchValue
          }));
        });
        store.load(loadOptions).done(function (data) {
          if (loadOptions.columnSkip) {
            data.columns = data.columns.slice(loadOptions.columnSkip);
          }

          if (loadOptions.columnTake) {
            data.columns = data.columns.slice(0, loadOptions.columnTake);
          }

          formatHeaders(loadOptions, data);

          if (!loadOptions.columnTake) {
            that._sort(loadOptions, data);
          }

          d.resolve(data.columns);
        }).fail(d);
      } else {
        d.reject();
      }

      return d;
    },
    reload: function reload() {
      return this.load({
        reload: true
      });
    },
    filter: function filter() {
      var store = this._store;
      return store.filter.apply(store, arguments);
    },
    load: function load(options) {
      var that = this;
      var d = new Deferred();
      options = options || {};
      that.beginLoading();
      d.fail(function (e) {
        that._eventsStrategy.fireEvent('loadError', [e]);
      }).always(function () {
        that.endLoading();
      });

      function loadTask() {
        that._delayedLoadTask = undefined;

        if (!that._descriptions) {
          when(getFields(that)).done(function (fields) {
            that._fieldsPrepared(fields);

            that._loadCore(options, d);
          }).fail(d.reject).fail(that._loadErrorHandler);
        } else {
          that._loadCore(options, d);
        }
      }

      if (that.store()) {
        that._delayedLoadTask = executeAsync(loadTask);
      } else {
        loadTask();
      }

      return d;
    },
    createDrillDownDataSource: function createDrillDownDataSource(params) {
      return this._store.createDrillDownDataSource(this._descriptions, params);
    },
    _createDescriptions: function _createDescriptions(currentField) {
      var that = this;
      var fields = that.fields();
      var descriptions = {
        rows: [],
        columns: [],
        values: [],
        filters: []
      };
      each(['row', 'column', 'data', 'filter'], function (_, areaName) {
        normalizeIndexes(_getAreaFields(fields, areaName), 'areaIndex', currentField);
      });
      each(fields || [], function (_, field) {
        var descriptionName = DESCRIPTION_NAME_BY_AREA[field.area];
        var dimension = descriptions[descriptionName];
        var groupName = field.groupName;

        if (groupName && !isNumeric(field.groupIndex)) {
          field.levels = getFieldsByGroup(fields, field);
        }

        if (!dimension || groupName && isNumeric(field.groupIndex) || field.visible === false && field.area !== 'data' && field.area !== 'filter') {
          return;
        }

        if (field.levels && dimension !== descriptions.filters && dimension !== descriptions.values) {
          dimension.push.apply(dimension, field.levels);

          if (field.filterValues && field.filterValues.length) {
            descriptions.filters.push(field);
          }
        } else {
          dimension.push(field);
        }
      });
      each(descriptions, function (_, fields) {
        sortFieldsByAreaIndex(fields);
      });
      var indices = {};
      each(descriptions.values, function (_, field) {
        var expression = field.calculateSummaryValue;

        if (isFunction(expression)) {
          var summaryCell = createMockSummaryCell(descriptions, fields, indices);
          expression(summaryCell);
        }
      });
      return descriptions;
    },
    _fieldsPrepared: function _fieldsPrepared(fields) {
      var that = this;
      that._fields = fields;
      each(fields, function (index, field) {
        field.index = index;
        updateCalculatedFieldProperties(field, ALL_CALCULATED_PROPERTIES);
      });
      var currentFieldState = getFieldsState(fields, ['caption']);

      that._eventsStrategy.fireEvent('fieldsPrepared', [fields]);

      for (var i = 0; i < fields.length; i++) {
        if (fields[i].caption !== currentFieldState[i].caption) {
          setFieldProperty(fields[i], 'caption', fields[i].caption, true);
        }
      }

      that._descriptions = that._createDescriptions();
    },
    isLoading: function isLoading() {
      return this._loadingCount > 0;
    },
    state: function state(_state, skipLoading) {
      var that = this;

      if (arguments.length) {
        _state = extend({
          rowExpandedPaths: [],
          columnExpandedPaths: []
        }, _state);

        if (!that._descriptions) {
          that.beginLoading();
          when(getFields(that)).done(function (fields) {
            that._fields = setFieldsState(_state.fields, fields);

            that._fieldsPrepared(fields);

            !skipLoading && that.load(_state);
          }).always(function () {
            that.endLoading();
          });
        } else {
          that._fields = setFieldsState(_state.fields, that._fields);
          that._descriptions = that._createDescriptions();
          !skipLoading && that.load(_state);
        }
      } else {
        return {
          fields: getFieldsState(that._fields, STATE_PROPERTIES),
          columnExpandedPaths: getExpandedPaths(that._data, that._descriptions, 'columns', that._lastLoadOptions),
          rowExpandedPaths: getExpandedPaths(that._data, that._descriptions, 'rows', that._lastLoadOptions)
        };
      }
    },
    beginLoading: function beginLoading() {
      this._changeLoadingCount(1);
    },
    endLoading: function endLoading() {
      this._changeLoadingCount(-1);
    },
    _changeLoadingCount: function _changeLoadingCount(increment) {
      var oldLoading = this.isLoading();
      this._loadingCount += increment;
      var newLoading = this.isLoading();

      if (oldLoading ^ newLoading) {
        this._eventsStrategy.fireEvent('loadingChanged', [newLoading]);
      }
    },
    _hasPagingValues: function _hasPagingValues(options, area, oppositeIndex) {
      var takeField = area + 'Take';
      var skipField = area + 'Skip';
      var values = this._data.values;
      var items = this._data[area + 's'];
      var oppositeArea = area === 'row' ? 'column' : 'row';
      var indices = [];

      if (options.path && options.area === area) {
        var headerItem = findHeaderItem(items, options.path);
        items = headerItem && headerItem.children;

        if (!items) {
          return false;
        }
      }

      if (options.oppositePath && options.area === oppositeArea) {
        var _headerItem = findHeaderItem(items, options.oppositePath);

        items = _headerItem && _headerItem.children;

        if (!items) {
          return false;
        }
      }

      for (var i = options[skipField]; i < options[skipField] + options[takeField]; i++) {
        if (items[i]) {
          indices.push(items[i].index);
        }
      }

      return indices.every(index => {
        if (index !== undefined) {
          if (area === 'row') {
            return (values[index] || [])[oppositeIndex];
          } else {
            return (values[oppositeIndex] || [])[index];
          }
        }
      });
    },
    _processPagingCacheByArea: function _processPagingCacheByArea(options, pageSize, area) {
      var takeField = area + 'Take';
      var skipField = area + 'Skip';
      var items = this._data[area + 's'];
      var oppositeArea = area === 'row' ? 'column' : 'row';
      var item;

      if (options[takeField]) {
        if (options.path && options.area === area) {
          var headerItem = findHeaderItem(items, options.path);
          items = headerItem && headerItem.children || [];
        }

        if (options.oppositePath && options.area === oppositeArea) {
          var _headerItem2 = findHeaderItem(items, options.oppositePath);

          items = _headerItem2 && _headerItem2.children || [];
        }

        do {
          item = items[options[skipField]];

          if (item && item.index !== undefined) {
            if (this._hasPagingValues(options, oppositeArea, item.index)) {
              options[skipField]++;
              options[takeField]--;
            } else {
              break;
            }
          }
        } while (item && item.index !== undefined && options[takeField]);

        if (options[takeField]) {
          var start = Math.floor(options[skipField] / pageSize) * pageSize;
          var end = Math.ceil((options[skipField] + options[takeField]) / pageSize) * pageSize;
          options[skipField] = start;
          options[takeField] = end - start;
        }
      }
    },
    _processPagingCache: function _processPagingCache(storeLoadOptions) {
      var pageSize = this._pageSize;
      if (pageSize < 0) return;

      for (var i = 0; i < storeLoadOptions.length; i++) {
        this._processPagingCacheByArea(storeLoadOptions[i], pageSize, 'row');

        this._processPagingCacheByArea(storeLoadOptions[i], pageSize, 'column');
      }
    },
    _loadCore: function _loadCore(options, deferred) {
      var that = this;
      var store = this._store;
      var descriptions = this._descriptions;

      var reload = options.reload || this.paginate() && that._isFieldsModified;

      var paginate = this.paginate();
      var headerName = DESCRIPTION_NAME_BY_AREA[options.area];
      options = options || {};

      if (store) {
        extend(options, descriptions);
        options.columnExpandedPaths = options.columnExpandedPaths || getExpandedPaths(this._data, options, 'columns', that._lastLoadOptions);
        options.rowExpandedPaths = options.rowExpandedPaths || getExpandedPaths(this._data, options, 'rows', that._lastLoadOptions);

        if (paginate) {
          options.pageSize = this._pageSize;
        }

        if (headerName) {
          options.headerName = headerName;
        }

        that.beginLoading();
        deferred.always(function () {
          that.endLoading();
        });
        var storeLoadOptions = [options];

        that._eventsStrategy.fireEvent('customizeStoreLoadOptions', [storeLoadOptions, reload]);

        if (!reload) {
          that._processPagingCache(storeLoadOptions);
        }

        storeLoadOptions = storeLoadOptions.filter(options => {
          return !(options.rows.length && options.rowTake === 0) && !(options.columns.length && options.columnTake === 0);
        });

        if (!storeLoadOptions.length) {
          that._update(deferred);

          return;
        }

        var results = storeLoadOptions.map(options => store.load(options));
        when.apply(null, results).done(function () {
          var results = arguments;

          for (var i = 0; i < results.length; i++) {
            var _options = storeLoadOptions[i];
            var data = results[i];
            var isLast = i === results.length - 1;

            if (_options.path) {
              that.applyPartialDataSource(_options.area, _options.path, data, isLast ? deferred : false, _options.oppositePath);
            } else if (paginate && !reload && isDataExists(that._data)) {
              that.mergePartialDataSource(data, isLast ? deferred : false);
            } else {
              extend(that._data, data);
              that._lastLoadOptions = _options;

              that._update(isLast ? deferred : false);
            }
          }
        }).fail(deferred.reject);
      } else {
        that._update(deferred);
      }
    },
    _sort: function _sort(descriptions, data, getAscOrder) {
      var store = this._store;

      if (store && !this._paginate) {
        sort(descriptions, data, getAscOrder);
      }
    },
    paginate: function paginate() {
      return this._paginate && this._store && this._store.supportPaging();
    },
    isEmpty: function isEmpty() {
      var dataFields = this.getAreaFields('data').filter(f => f.visible !== false);
      var data = this.getData();
      return !dataFields.length || !data.values.length;
    },
    _update: function _update(deferred) {
      var that = this;
      var descriptions = that._descriptions;
      var loadedData = that._data;
      var dataFields = descriptions.values;
      var expressionsUsed = areExpressionsUsed(dataFields);
      when(formatHeaders(descriptions, loadedData), updateCache(loadedData.rows), updateCache(loadedData.columns)).done(function () {
        if (expressionsUsed) {
          that._sort(descriptions, loadedData, expressionsUsed);

          !that.isEmpty() && applyDisplaySummaryMode(descriptions, loadedData);
        }

        that._sort(descriptions, loadedData);

        !that.isEmpty() && isRunningTotalUsed(dataFields) && applyRunningTotal(descriptions, loadedData);
        that._data = loadedData;
        deferred !== false && when(deferred).done(function () {
          that._isFieldsModified = false;

          that._eventsStrategy.fireEvent('changed');

          if (isDefined(that._data.grandTotalRowIndex)) {
            loadedData.grandTotalRowIndex = that._data.grandTotalRowIndex;
          }

          if (isDefined(that._data.grandTotalColumnIndex)) {
            loadedData.grandTotalColumnIndex = that._data.grandTotalColumnIndex;
          }
        });
        deferred && deferred.resolve(that._data);
      });
      return deferred;
    },
    store: function store() {
      return this._store;
    },
    collapseHeaderItem: function collapseHeaderItem(area, path) {
      var that = this;
      var headerItems = area === 'column' ? that._data.columns : that._data.rows;
      var headerItem = findHeaderItem(headerItems, path);
      var field = that.getAreaFields(area)[path.length - 1];

      if (headerItem && headerItem.children) {
        that._eventsStrategy.fireEvent('expandValueChanging', [{
          area: area,
          path: path,
          expanded: false
        }]);

        if (field) {
          field.expanded = false;
        }

        headerItem.collapsedChildren = headerItem.children;
        delete headerItem.children;

        that._update();

        if (that.paginate()) {
          that.load();
        }

        return true;
      }

      return false;
    },
    collapseAll: function collapseAll(id) {
      var dataChanged = false;
      var field = this.field(id) || {};
      var areaOffsets = [inArray(field, this.getAreaFields(field.area))];
      field.expanded = false;

      if (field && field.levels) {
        areaOffsets = [];
        field.levels.forEach(f => {
          areaOffsets.push(inArray(f, this.getAreaFields(field.area)));
          f.expanded = false;
        });
      }

      foreachTree(this._data[field.area + 's'], function (items) {
        var item = items[0];
        var path = createPath(items);

        if (item && item.children && areaOffsets.indexOf(path.length - 1) !== -1) {
          item.collapsedChildren = item.children;
          delete item.children;
          dataChanged = true;
        }
      }, true);
      dataChanged && this._update();
    },
    expandAll: function expandAll(id) {
      var field = this.field(id);

      if (field && field.area) {
        field.expanded = true;

        if (field && field.levels) {
          field.levels.forEach(f => {
            f.expanded = true;
          });
        }

        this.load();
      }
    },
    expandHeaderItem: function expandHeaderItem(area, path) {
      var that = this;
      var headerItems = area === 'column' ? that._data.columns : that._data.rows;
      var headerItem = findHeaderItem(headerItems, path);

      if (headerItem && !headerItem.children) {
        var hasCache = !!headerItem.collapsedChildren;
        var options = {
          area: area,
          path: path,
          expanded: true,
          needExpandData: !hasCache
        };

        that._eventsStrategy.fireEvent('expandValueChanging', [options]);

        if (hasCache) {
          headerItem.children = headerItem.collapsedChildren;
          delete headerItem.collapsedChildren;

          that._update();
        } else if (this.store()) {
          that.load(options);
        }

        return hasCache;
      }

      return false;
    },
    mergePartialDataSource: function mergePartialDataSource(dataSource, deferred) {
      var that = this;
      var loadedData = that._data;
      var newRowItemIndexesToCurrent;
      var newColumnItemIndexesToCurrent;

      if (dataSource && dataSource.values) {
        dataSource.rows = dataSource.rows || [];
        dataSource.columns = dataSource.columns || [];
        newRowItemIndexesToCurrent = updateHeaderItems(loadedData.rows, dataSource.rows, loadedData.grandTotalColumnIndex);
        newColumnItemIndexesToCurrent = updateHeaderItems(loadedData.columns, dataSource.columns, loadedData.grandTotalColumnIndex);
        when(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent).done(function (newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) {
          if (newRowItemIndexesToCurrent.length || newColumnItemIndexesToCurrent.length) {
            updateDataSourceCells(loadedData, dataSource.values, newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent);
          }

          that._update(deferred);
        });
      }
    },
    applyPartialDataSource: function applyPartialDataSource(area, path, dataSource, deferred, oppositePath) {
      var that = this;
      var loadedData = that._data;
      var headerItems = area === 'column' ? loadedData.columns : loadedData.rows;
      var headerItem;
      var oppositeHeaderItems = area === 'column' ? loadedData.rows : loadedData.columns;
      var oppositeHeaderItem;
      var newRowItemIndexesToCurrent;
      var newColumnItemIndexesToCurrent;

      if (dataSource && dataSource.values) {
        dataSource.rows = dataSource.rows || [];
        dataSource.columns = dataSource.columns || [];
        headerItem = findHeaderItem(headerItems, path);
        oppositeHeaderItem = oppositePath && findHeaderItem(oppositeHeaderItems, oppositePath);

        if (headerItem) {
          if (area === 'column') {
            newColumnItemIndexesToCurrent = updateHeaderItemChildren(headerItems, headerItem, dataSource.columns, loadedData.grandTotalColumnIndex);

            if (oppositeHeaderItem) {
              newRowItemIndexesToCurrent = updateHeaderItemChildren(oppositeHeaderItems, oppositeHeaderItem, dataSource.rows, loadedData.grandTotalRowIndex);
            } else {
              newRowItemIndexesToCurrent = updateHeaderItems(loadedData.rows, dataSource.rows, loadedData.grandTotalRowIndex);
            }
          } else {
            newRowItemIndexesToCurrent = updateHeaderItemChildren(headerItems, headerItem, dataSource.rows, loadedData.grandTotalRowIndex);

            if (oppositeHeaderItem) {
              newColumnItemIndexesToCurrent = updateHeaderItemChildren(oppositeHeaderItems, oppositeHeaderItem, dataSource.columns, loadedData.grandTotalColumnIndex);
            } else {
              newColumnItemIndexesToCurrent = updateHeaderItems(loadedData.columns, dataSource.columns, loadedData.grandTotalColumnIndex);
            }
          }

          when(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent).done(function (newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) {
            if (area === 'row' && newRowItemIndexesToCurrent.length || area === 'column' && newColumnItemIndexesToCurrent.length) {
              updateDataSourceCells(loadedData, dataSource.values, newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent);
            }

            that._update(deferred);
          });
        }
      }
    },

    on(eventName, eventHandler) {
      this._eventsStrategy.on(eventName, eventHandler);

      return this;
    },

    off(eventName, eventHandler) {
      this._eventsStrategy.off(eventName, eventHandler);

      return this;
    },

    dispose: function dispose() {
      var that = this;
      var delayedLoadTask = that._delayedLoadTask;

      this._eventsStrategy.dispose();

      if (delayedLoadTask) {
        delayedLoadTask.abort();
      }

      this._isDisposed = true;
    },
    isDisposed: function isDisposed() {
      return !!this._isDisposed;
    }
  };
}());