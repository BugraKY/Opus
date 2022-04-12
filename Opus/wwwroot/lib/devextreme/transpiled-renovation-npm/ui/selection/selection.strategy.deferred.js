"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var _selection = _interopRequireDefault(require("./selection.strategy"));

var _ui = _interopRequireDefault(require("../widget/ui.errors"));

var _query = _interopRequireDefault(require("../../data/query"));

var _deferred = require("../../core/utils/deferred");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _selection.default.inherit({
  getSelectedItems: function getSelectedItems() {
    return this._loadFilteredData(this.options.selectionFilter);
  },
  getSelectedItemKeys: function getSelectedItemKeys() {
    var d = new _deferred.Deferred();
    var that = this;
    var key = this.options.key();
    var select = (0, _type.isString)(key) ? [key] : key;

    this._loadFilteredData(this.options.selectionFilter, null, select).done(function (items) {
      var keys = items.map(function (item) {
        return that.options.keyOf(item);
      });
      d.resolve(keys);
    }).fail(d.reject);

    return d.promise();
  },
  selectedItemKeys: function selectedItemKeys(keys, preserve, isDeselect, isSelectAll) {
    if (isSelectAll) {
      var filter = this.options.filter();
      var needResetSelectionFilter = !filter || JSON.stringify(filter) === JSON.stringify(this.options.selectionFilter) && isDeselect;

      if (needResetSelectionFilter) {
        this._setOption('selectionFilter', isDeselect ? [] : null);
      } else {
        this._addSelectionFilter(isDeselect, filter, isSelectAll);
      }
    } else {
      if (!preserve) {
        this._setOption('selectionFilter', []);
      }

      for (var i = 0; i < keys.length; i++) {
        if (isDeselect) {
          this.removeSelectedItem(keys[i]);
        } else {
          this.addSelectedItem(keys[i]);
        }
      }
    }

    this.onSelectionChanged();
    return new _deferred.Deferred().resolve();
  },
  setSelectedItems: function setSelectedItems(keys) {
    this._setOption('selectionFilter', null);

    for (var i = 0; i < keys.length; i++) {
      this.addSelectedItem(keys[i]);
    }
  },
  isItemDataSelected: function isItemDataSelected(itemData) {
    return this.isItemKeySelected(itemData);
  },
  isItemKeySelected: function isItemKeySelected(itemData) {
    var selectionFilter = this.options.selectionFilter;

    if (!selectionFilter) {
      return true;
    }

    return !!(0, _query.default)([itemData]).filter(selectionFilter).toArray().length;
  },
  _getKeyExpr: function _getKeyExpr() {
    var keyField = this.options.key();

    if (Array.isArray(keyField) && keyField.length === 1) {
      return keyField[0];
    }

    return keyField;
  },
  _normalizeKey: function _normalizeKey(key) {
    var keyExpr = this.options.key();

    if (Array.isArray(keyExpr) && keyExpr.length === 1) {
      return key[keyExpr[0]];
    }

    return key;
  },
  _getFilterByKey: function _getFilterByKey(key) {
    var keyField = this._getKeyExpr();

    var filter = [keyField, '=', this._normalizeKey(key)];

    if (Array.isArray(keyField)) {
      filter = [];

      for (var i = 0; i < keyField.length; i++) {
        filter.push([keyField[i], '=', key[keyField[i]]]);

        if (i !== keyField.length - 1) {
          filter.push('and');
        }
      }
    }

    return filter;
  },
  addSelectedItem: function addSelectedItem(key) {
    var filter = this._getFilterByKey(key);

    this._addSelectionFilter(false, filter);
  },
  removeSelectedItem: function removeSelectedItem(key) {
    var filter = this._getFilterByKey(key);

    this._addSelectionFilter(true, filter);
  },
  validate: function validate() {
    var key = this.options.key;

    if (key && key() === undefined) {
      throw _ui.default.Error('E1042', 'Deferred selection');
    }
  },
  _findSubFilter: function _findSubFilter(selectionFilter, filter) {
    if (!selectionFilter) return -1;
    var filterString = JSON.stringify(filter);

    for (var index = 0; index < selectionFilter.length; index++) {
      var subFilter = selectionFilter[index];

      if (subFilter && JSON.stringify(subFilter) === filterString) {
        return index;
      }
    }

    return -1;
  },
  _isLastSubFilter: function _isLastSubFilter(selectionFilter, filter) {
    if (selectionFilter && filter) {
      return this._findSubFilter(selectionFilter, filter) === selectionFilter.length - 1 || this._findSubFilter([selectionFilter], filter) === 0;
    }

    return false;
  },
  _addFilterOperator: function _addFilterOperator(selectionFilter, filterOperator) {
    if (selectionFilter.length > 1 && (0, _type.isString)(selectionFilter[1]) && selectionFilter[1] !== filterOperator) {
      selectionFilter = [selectionFilter];
    }

    if (selectionFilter.length) {
      selectionFilter.push(filterOperator);
    }

    return selectionFilter;
  },
  _denormalizeFilter: function _denormalizeFilter(filter) {
    if (filter && (0, _type.isString)(filter[0])) {
      filter = [filter];
    }

    return filter;
  },
  _isOnlyNegativeFiltersLeft: function _isOnlyNegativeFiltersLeft(filters) {
    return filters.every(function (filterItem, i) {
      if (i % 2 === 0) {
        return Array.isArray(filterItem) && filterItem[0] === '!';
      } else {
        return filterItem === 'and';
      }
    });
  },
  _addSelectionFilter: function _addSelectionFilter(isDeselect, filter, isSelectAll) {
    var that = this;
    var currentFilter = isDeselect ? ['!', filter] : filter;
    var currentOperation = isDeselect ? 'and' : 'or';
    var needAddFilter = true;
    var selectionFilter = that.options.selectionFilter || [];
    selectionFilter = that._denormalizeFilter(selectionFilter);

    if (selectionFilter && selectionFilter.length) {
      var removedIndex = that._removeSameFilter(selectionFilter, filter, isDeselect, isSelectAll);

      var filterIndex = that._removeSameFilter(selectionFilter, filter, !isDeselect);

      var shouldCleanFilter = isDeselect && (removedIndex !== -1 || filterIndex !== -1) && this._isOnlyNegativeFiltersLeft(selectionFilter);

      if (shouldCleanFilter) {
        selectionFilter = [];
      }

      var isKeyOperatorsAfterRemoved = this._isKeyFilter(filter) && this._hasKeyFiltersOnlyStartingFromIndex(selectionFilter, filterIndex);

      needAddFilter = filter.length && !isKeyOperatorsAfterRemoved;

      if (needAddFilter) {
        selectionFilter = that._addFilterOperator(selectionFilter, currentOperation);
      }
    }

    if (needAddFilter) {
      selectionFilter.push(currentFilter);
    }

    selectionFilter = that._normalizeFilter(selectionFilter);

    that._setOption('selectionFilter', !isDeselect && !selectionFilter.length ? null : selectionFilter);
  },
  _normalizeFilter: function _normalizeFilter(filter) {
    if (filter && filter.length === 1) {
      filter = filter[0];
    }

    return filter;
  },
  _removeFilterByIndex: function _removeFilterByIndex(filter, filterIndex, isSelectAll) {
    var operation = filter[1];

    if (filterIndex > 0) {
      filter.splice(filterIndex - 1, 2);
    } else {
      filter.splice(filterIndex, 2);
    }

    if (isSelectAll && operation === 'and') {
      filter.splice(0, filter.length);
    }
  },
  _isSimpleKeyFilter: function _isSimpleKeyFilter(filter, key) {
    return filter.length === 3 && filter[0] === key && filter[1] === '=';
  },
  _isKeyFilter: function _isKeyFilter(filter) {
    if (filter.length === 2 && filter[0] === '!') {
      return this._isKeyFilter(filter[1]);
    }

    var keyField = this._getKeyExpr();

    if (Array.isArray(keyField)) {
      if (filter.length !== keyField.length * 2 - 1) {
        return false;
      }

      for (var i = 0; i < keyField.length; i++) {
        if (i > 0 && filter[i * 2 - 1] !== 'and') {
          return false;
        }

        if (!this._isSimpleKeyFilter(filter[i * 2], keyField[i])) {
          return false;
        }
      }

      return true;
    }

    return this._isSimpleKeyFilter(filter, keyField);
  },
  _hasKeyFiltersOnlyStartingFromIndex: function _hasKeyFiltersOnlyStartingFromIndex(selectionFilter, filterIndex) {
    if (filterIndex >= 0) {
      for (var i = filterIndex; i < selectionFilter.length; i++) {
        if (typeof selectionFilter[i] !== 'string' && !this._isKeyFilter(selectionFilter[i])) {
          return false;
        }
      }

      return true;
    }

    return false;
  },
  _removeSameFilter: function _removeSameFilter(selectionFilter, filter, inverted, isSelectAll) {
    filter = inverted ? ['!', filter] : filter;

    if (JSON.stringify(filter) === JSON.stringify(selectionFilter)) {
      selectionFilter.splice(0, selectionFilter.length);
      return 0;
    }

    var filterIndex = this._findSubFilter(selectionFilter, filter);

    if (filterIndex >= 0) {
      this._removeFilterByIndex(selectionFilter, filterIndex, isSelectAll);

      return filterIndex;
    } else {
      for (var i = 0; i < selectionFilter.length; i++) {
        if (Array.isArray(selectionFilter[i]) && selectionFilter[i].length > 2) {
          var _filterIndex = this._removeSameFilter(selectionFilter[i], filter, false, isSelectAll);

          if (_filterIndex >= 0) {
            if (!selectionFilter[i].length) {
              this._removeFilterByIndex(selectionFilter, i, isSelectAll);
            } else if (selectionFilter[i].length === 1) {
              selectionFilter[i] = selectionFilter[i][0];
            }

            return _filterIndex;
          }
        }
      }

      return -1;
    }
  },
  getSelectAllState: function getSelectAllState() {
    var filter = this.options.filter();
    var selectionFilter = this.options.selectionFilter;
    if (!selectionFilter) return true;
    if (!selectionFilter.length) return false;
    if (!filter || !filter.length) return undefined;
    selectionFilter = this._denormalizeFilter(selectionFilter);

    if (this._isLastSubFilter(selectionFilter, filter)) {
      return true;
    }

    if (this._isLastSubFilter(selectionFilter, ['!', filter])) {
      return false;
    }

    return undefined;
  }
});

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;