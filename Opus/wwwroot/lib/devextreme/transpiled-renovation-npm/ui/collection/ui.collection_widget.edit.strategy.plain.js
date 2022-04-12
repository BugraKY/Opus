"use strict";

exports.default = void 0;

var _array = require("../../core/utils/array");

var _uiCollection_widgetEdit = _interopRequireDefault(require("./ui.collection_widget.edit.strategy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var PlainEditStrategy = _uiCollection_widgetEdit.default.inherit({
  _getPlainItems: function _getPlainItems() {
    return this._collectionWidget.option('items') || [];
  },
  getIndexByItemData: function getIndexByItemData(itemData) {
    var keyOf = this._collectionWidget.keyOf.bind(this._collectionWidget);

    if (keyOf) {
      return this.getIndexByKey(keyOf(itemData));
    } else {
      return (0, _array.inArray)(itemData, this._getPlainItems());
    }
  },
  getItemDataByIndex: function getItemDataByIndex(index) {
    return this._getPlainItems()[index];
  },
  deleteItemAtIndex: function deleteItemAtIndex(index) {
    this._getPlainItems().splice(index, 1);
  },
  itemsGetter: function itemsGetter() {
    return this._getPlainItems();
  },
  getKeysByItems: function getKeysByItems(items) {
    var keyOf = this._collectionWidget.keyOf.bind(this._collectionWidget);

    var result = items;

    if (keyOf) {
      result = [];

      for (var i = 0; i < items.length; i++) {
        result.push(keyOf(items[i]));
      }
    }

    return result;
  },
  getIndexByKey: function getIndexByKey(key) {
    var cache = this._cache;
    var keys = cache && cache.keys || this.getKeysByItems(this._getPlainItems());

    if (cache && !cache.keys) {
      cache.keys = keys;
    }

    if (_typeof(key) === 'object') {
      for (var i = 0, length = keys.length; i < length; i++) {
        if (this._equalKeys(key, keys[i])) return i;
      }
    } else {
      return keys.indexOf(key);
    }

    return -1;
  },
  getItemsByKeys: function getItemsByKeys(keys, items) {
    return (items || keys).slice();
  },
  moveItemAtIndexToIndex: function moveItemAtIndexToIndex(movingIndex, destinationIndex) {
    var items = this._getPlainItems();

    var movedItemData = items[movingIndex];
    items.splice(movingIndex, 1);
    items.splice(destinationIndex, 0, movedItemData);
  },
  _isItemIndex: function _isItemIndex(index) {
    return typeof index === 'number' && Math.round(index) === index;
  },
  _getNormalizedItemIndex: function _getNormalizedItemIndex(itemElement) {
    return this._collectionWidget._itemElements().index(itemElement);
  },
  _normalizeItemIndex: function _normalizeItemIndex(index) {
    return index;
  },
  _denormalizeItemIndex: function _denormalizeItemIndex(index) {
    return index;
  },
  _getItemByNormalizedIndex: function _getItemByNormalizedIndex(index) {
    return index > -1 ? this._collectionWidget._itemElements().eq(index) : null;
  },
  _itemsFromSameParent: function _itemsFromSameParent() {
    return true;
  }
});

var _default = PlainEditStrategy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;