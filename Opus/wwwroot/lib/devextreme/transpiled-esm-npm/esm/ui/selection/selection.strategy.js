import dataQuery from '../../data/query';
import { getKeyHash, noop, equalByValue } from '../../core/utils/common';
import { isPlainObject, isObject } from '../../core/utils/type';
import Class from '../../core/class';
import { Deferred } from '../../core/utils/deferred';
export default Class.inherit({
  ctor: function ctor(options) {
    this.options = options;

    this._setOption('disabledItemKeys', []);

    this._clearItemKeys();
  },
  _clearItemKeys: function _clearItemKeys() {
    this._setOption('addedItemKeys', []);

    this._setOption('removedItemKeys', []);

    this._setOption('removedItems', []);

    this._setOption('addedItems', []);
  },
  validate: noop,
  _setOption: function _setOption(name, value) {
    this.options[name] = value;
  },
  onSelectionChanged: function onSelectionChanged() {
    var addedItemKeys = this.options.addedItemKeys;
    var removedItemKeys = this.options.removedItemKeys;
    var addedItems = this.options.addedItems;
    var removedItems = this.options.removedItems;
    var selectedItems = this.options.selectedItems;
    var selectedItemKeys = this.options.selectedItemKeys;
    var onSelectionChanged = this.options.onSelectionChanged || noop;

    this._clearItemKeys();

    onSelectionChanged({
      selectedItems: selectedItems,
      selectedItemKeys: selectedItemKeys,
      addedItemKeys: addedItemKeys,
      removedItemKeys: removedItemKeys,
      addedItems: addedItems,
      removedItems: removedItems
    });
  },
  equalKeys: function equalKeys(key1, key2) {
    if (this.options.equalByReference) {
      if (isObject(key1) && isObject(key2)) {
        return key1 === key2;
      }
    }

    return equalByValue(key1, key2);
  },
  getSelectableItems: function getSelectableItems(items) {
    return items.filter(function (item) {
      return !(item !== null && item !== void 0 && item.disabled);
    });
  },
  _clearSelection: function _clearSelection(keys, preserve, isDeselect, isSelectAll) {
    keys = keys || [];
    keys = Array.isArray(keys) ? keys : [keys];
    this.validate();
    return this.selectedItemKeys(keys, preserve, isDeselect, isSelectAll);
  },
  _removeTemplateProperty: function _removeTemplateProperty(remoteFilter) {
    if (Array.isArray(remoteFilter)) {
      return remoteFilter.map(f => this._removeTemplateProperty(f));
    }

    if (isObject(remoteFilter)) {
      delete remoteFilter.template;
    }

    return remoteFilter;
  },
  _loadFilteredData: function _loadFilteredData(remoteFilter, localFilter, select, isSelectAll) {
    var filterLength = encodeURI(JSON.stringify(this._removeTemplateProperty(remoteFilter))).length;
    var needLoadAllData = this.options.maxFilterLengthInRequest && filterLength > this.options.maxFilterLengthInRequest;
    var deferred = new Deferred();
    var loadOptions = {
      filter: needLoadAllData ? undefined : remoteFilter,
      select: needLoadAllData ? this.options.dataFields() : select || this.options.dataFields()
    };

    if (remoteFilter && remoteFilter.length === 0) {
      deferred.resolve([]);
    } else {
      this.options.load(loadOptions).done(function (items) {
        var filteredItems = isPlainObject(items) ? items.data : items;

        if (localFilter && !isSelectAll) {
          filteredItems = filteredItems.filter(localFilter);
        } else if (needLoadAllData) {
          filteredItems = dataQuery(filteredItems).filter(remoteFilter).toArray();
        }

        deferred.resolve(filteredItems);
      }).fail(deferred.reject.bind(deferred));
    }

    return deferred;
  },
  updateSelectedItemKeyHash: function updateSelectedItemKeyHash(keys) {
    for (var i = 0; i < keys.length; i++) {
      var keyHash = getKeyHash(keys[i]);

      if (!isObject(keyHash)) {
        this.options.keyHashIndices[keyHash] = this.options.keyHashIndices[keyHash] || [];
        var keyIndices = this.options.keyHashIndices[keyHash];
        keyIndices.push(i);
      }
    }
  },
  _isAnyItemSelected: function _isAnyItemSelected(items) {
    for (var i = 0; i < items.length; i++) {
      if (this.options.isItemSelected(items[i])) {
        return undefined;
      }
    }

    return false;
  },
  _getFullSelectAllState: function _getFullSelectAllState() {
    var items = this.options.plainItems();
    var dataFilter = this.options.filter();
    var selectedItems = this.options.ignoreDisabledItems ? this.options.selectedItems : this.options.selectedItems.filter(item => !(item !== null && item !== void 0 && item.disabled));

    if (dataFilter) {
      selectedItems = dataQuery(selectedItems).filter(dataFilter).toArray();
    }

    var selectedItemsLength = selectedItems.length;
    var disabledItemsLength = items.length - this.getSelectableItems(items).length;

    if (!selectedItemsLength) {
      return this._isAnyItemSelected(items);
    }

    if (selectedItemsLength >= this.options.totalCount() - disabledItemsLength) {
      return true;
    }

    return undefined;
  },
  _getVisibleSelectAllState: function _getVisibleSelectAllState() {
    var items = this.getSelectableItems(this.options.plainItems());
    var hasSelectedItems = false;
    var hasUnselectedItems = false;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var itemData = this.options.getItemData(item);
      var key = this.options.keyOf(itemData);

      if (this.options.isSelectableItem(item)) {
        if (this.isItemKeySelected(key)) {
          hasSelectedItems = true;
        } else {
          hasUnselectedItems = true;
        }
      }
    }

    if (hasSelectedItems) {
      return !hasUnselectedItems ? true : undefined;
    } else {
      return false;
    }
  }
});