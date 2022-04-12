import Class from '../../core/class';
import { extend } from '../../core/utils/extend';
import errors from '../../ui/widget/ui.errors';
import { each } from '../../core/utils/iterator';
import { isDefined, isPrimitive } from '../../core/utils/type';
var DataConverter = Class.inherit({
  ctor: function ctor() {
    this._dataStructure = [];
    this._itemsCount = 0;
    this._visibleItemsCount = 0;
  },
  _indexByKey: {},
  _convertItemsToNodes: function _convertItemsToNodes(items, parentKey) {
    var that = this;
    each(items, function (_, item) {
      var parentId = isDefined(parentKey) ? parentKey : that._getParentId(item);

      var node = that._convertItemToNode(item, parentId);

      that._dataStructure.push(node);

      that._checkForDuplicateId(node.internalFields.key);

      that._indexByKey[node.internalFields.key] = that._dataStructure.length - 1;

      if (that._itemHasChildren(item)) {
        that._convertItemsToNodes(that._dataAccessors.getters.items(item), node.internalFields.key);
      }
    });
  },
  _checkForDuplicateId: function _checkForDuplicateId(key) {
    if (isDefined(this._indexByKey[key])) {
      throw errors.Error('E1040', key);
    }
  },
  _getParentId: function _getParentId(item) {
    return this._dataType === 'plain' ? this._dataAccessors.getters.parentKey(item) : undefined;
  },
  _itemHasChildren: function _itemHasChildren(item) {
    if (this._dataType === 'plain') {
      return;
    }

    var items = this._dataAccessors.getters.items(item);

    return items && items.length;
  },
  _getUniqueKey: function _getUniqueKey(item) {
    var keyGetter = this._dataAccessors.getters.key;
    var itemKey = keyGetter(item);
    var isCorrectKey = keyGetter && (itemKey || itemKey === 0) && isPrimitive(itemKey);
    return isCorrectKey ? itemKey : this.getItemsCount();
  },
  _convertItemToNode: function _convertItemToNode(item, parentKey) {
    this._itemsCount++;
    item.visible !== false && this._visibleItemsCount++;
    var that = this;
    var node = {
      internalFields: {
        disabled: that._dataAccessors.getters.disabled(item, {
          defaultValue: false
        }),
        expanded: that._dataAccessors.getters.expanded(item, {
          defaultValue: false
        }),
        selected: that._dataAccessors.getters.selected(item, {
          defaultValue: false
        }),
        key: that._getUniqueKey(item),
        parentKey: isDefined(parentKey) ? parentKey : that._rootValue,
        item: that._makeObjectFromPrimitive(item),
        childrenKeys: []
      }
    };
    extend(node, item);
    delete node.items;
    return node;
  },
  setChildrenKeys: function setChildrenKeys() {
    var that = this;
    each(this._dataStructure, function (_, node) {
      if (node.internalFields.parentKey === that._rootValue) return;
      var parent = that.getParentNode(node);
      parent && parent.internalFields.childrenKeys.push(node.internalFields.key);
    });
  },
  _makeObjectFromPrimitive: function _makeObjectFromPrimitive(item) {
    if (isPrimitive(item)) {
      var key = item;
      item = {};

      this._dataAccessors.setters.key(item, key);
    }

    return item;
  },
  _convertToPublicNode: function _convertToPublicNode(node, parent) {
    if (!node) {
      return null;
    }

    var publicNode = {
      text: this._dataAccessors.getters.display(node),
      key: node.internalFields.key,
      selected: node.internalFields.selected,
      expanded: node.internalFields.expanded,
      disabled: node.internalFields.disabled,
      parent: parent || null,
      itemData: node.internalFields.item,
      children: [],
      items: []
    };

    if (publicNode.parent) {
      publicNode.parent.children.push(publicNode);
      publicNode.parent.items.push(publicNode);
    }

    return publicNode;
  },
  convertToPublicNodes: function convertToPublicNodes(data, parent) {
    if (!data.length) return [];
    var that = this;
    var publicNodes = [];
    each(data, function (_, node) {
      node = isPrimitive(node) ? that._getByKey(node) : node;

      var publicNode = that._convertToPublicNode(node, parent);

      publicNode.children = that.convertToPublicNodes(node.internalFields.childrenKeys, publicNode);
      publicNodes.push(publicNode);
      node.internalFields.publicNode = publicNode;
    });
    return publicNodes;
  },
  setDataAccessors: function setDataAccessors(accessors) {
    this._dataAccessors = accessors;
  },
  _getByKey: function _getByKey(key) {
    return this._dataStructure[this.getIndexByKey(key)] || null;
  },
  getParentNode: function getParentNode(node) {
    return this._getByKey(node.internalFields.parentKey);
  },
  getByKey: function getByKey(data, key) {
    if (key === null || key === undefined) {
      return null;
    }

    var result = null;
    var that = this;

    var getByKey = function getByKey(data, key) {
      each(data, function (_, element) {
        var currentElementKey = element.internalFields && element.internalFields.key || that._dataAccessors.getters.key(element);

        if (currentElementKey.toString() === key.toString()) {
          result = element;
          return false;
        }
      });
      return result;
    };

    return getByKey(data, key);
  },
  getItemsCount: function getItemsCount() {
    return this._itemsCount;
  },
  getVisibleItemsCount: function getVisibleItemsCount() {
    return this._visibleItemsCount;
  },
  updateIndexByKey: function updateIndexByKey() {
    var that = this;
    this._indexByKey = {};
    each(this._dataStructure, function (index, node) {
      that._checkForDuplicateId(node.internalFields.key);

      that._indexByKey[node.internalFields.key] = index;
    });
  },
  updateChildrenKeys: function updateChildrenKeys() {
    this._indexByKey = {};
    this.removeChildrenKeys();
    this.updateIndexByKey();
    this.setChildrenKeys();
  },
  removeChildrenKeys: function removeChildrenKeys() {
    this._indexByKey = {};
    each(this._dataStructure, function (index, node) {
      node.internalFields.childrenKeys = [];
    });
  },
  getIndexByKey: function getIndexByKey(key) {
    return this._indexByKey[key];
  },
  createPlainStructure: function createPlainStructure(items, rootValue, dataType) {
    this._itemsCount = 0;
    this._visibleItemsCount = 0;
    this._rootValue = rootValue;
    this._dataType = dataType;
    this._indexByKey = {};

    this._convertItemsToNodes(items);

    this.setChildrenKeys();
    return this._dataStructure;
  }
});
export default DataConverter;