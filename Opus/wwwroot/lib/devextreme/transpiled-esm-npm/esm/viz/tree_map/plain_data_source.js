import TreeMapBase from './tree_map.base';
var proto = TreeMapBase.prototype;
proto._optionChangesMap.idField = proto._optionChangesMap.parentField = 'NODES_CREATE';

proto._processDataSourceItems = function (items) {
  var i;
  var struct = {};
  var currentItem;

  var idField = this._getOption('idField', true);

  var parentField = this._getOption('parentField', true);

  var parentId;
  var rootNodes = [];
  var tmpItems;
  var item;

  if (!idField || !parentField || items.length === 0) {
    return {
      items: items,
      isPlain: false
    };
  }

  for (i = 0; i < items.length; i++) {
    currentItem = items[i];
    parentId = currentItem[parentField];

    if (parentId) {
      struct[parentId] = struct[parentId] || {
        items: []
      };
      tmpItems = struct[parentId].items;
    } else {
      tmpItems = rootNodes;
    }

    tmpItems.push(currentItem);
  }

  treeFiller({
    struct: struct,
    idField: idField
  }, rootNodes);

  for (item in struct) {
    struct[item] && rootNodes.push(struct[item]);
  }

  return {
    items: rootNodes,
    isPlain: true
  };
};

function treeFiller(context, items) {
  var currentItem;
  var i;
  var struct = context.struct;
  var id;

  for (i = 0; i < items.length; i++) {
    currentItem = items[i];
    id = currentItem[context.idField];

    if (struct[id]) {
      currentItem.items = struct[id].items;
      struct[id] = null;
      treeFiller(context, currentItem.items);
    }
  }
}