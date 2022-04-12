import $ from '../../core/renderer';
import treeListCore from './ui.tree_list.core';
import { noop, equalByValue } from '../../core/utils/common';
import { selectionModule } from '../grid_core/ui.grid_core.selection';
import { extend } from '../../core/utils/extend';
import { isDefined } from '../../core/utils/type';
var TREELIST_SELECT_ALL_CLASS = 'dx-treelist-select-all';
var CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
var SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';
var originalRowClick = selectionModule.extenders.views.rowsView._rowClick;
var originalHandleDataChanged = selectionModule.extenders.controllers.data._handleDataChanged;

var nodeExists = function nodeExists(array, currentKey) {
  return !!array.filter(function (key) {
    return key === currentKey;
  }).length;
};

treeListCore.registerModule('selection', extend(true, {}, selectionModule, {
  defaultOptions: function defaultOptions() {
    return extend(true, selectionModule.defaultOptions(), {
      selection: {
        showCheckBoxesMode: 'always',
        recursive: false
      }
    });
  },
  extenders: {
    controllers: {
      data: {
        _handleDataChanged: function _handleDataChanged(e) {
          var selectionController = this.getController('selection');
          var isRecursiveSelection = selectionController.isRecursiveSelection();

          if (isRecursiveSelection && (!e || e.changeType !== 'updateSelectionState')) {
            selectionController.updateSelectionState({
              selectedItemKeys: this.option('selectedRowKeys')
            });
          }

          originalHandleDataChanged.apply(this, arguments);
        },
        loadDescendants: function loadDescendants() {
          var that = this;
          var d = that.callBase.apply(that, arguments);
          var selectionController = that.getController('selection');
          var isRecursiveSelection = selectionController.isRecursiveSelection();

          if (isRecursiveSelection) {
            d.done(function () {
              selectionController.updateSelectionState({
                selectedItemKeys: that.option('selectedRowKeys')
              });
            });
          }

          return d;
        }
      },
      selection: {
        init: function init() {
          this.callBase.apply(this, arguments);
          this._selectionStateByKey = {};
        },
        _getSelectionConfig: function _getSelectionConfig() {
          var config = this.callBase.apply(this, arguments);
          var plainItems = config.plainItems;

          config.plainItems = all => {
            if (all) {
              return this._dataController.getCachedStoreData() || [];
            }

            return plainItems.apply(this, arguments).map(item => item.data);
          };

          config.isItemSelected = item => {
            var key = this._dataController.keyOf(item);

            return this.isRowSelected(key);
          };

          config.isSelectableItem = () => {
            return true;
          };

          config.getItemData = item => {
            return item;
          };

          config.allowLoadByRange = () => {
            return false;
          };

          return config;
        },
        renderSelectCheckBoxContainer: function renderSelectCheckBoxContainer($container, model) {
          var that = this;
          var rowsView = that.component.getView('rowsView');
          $container.addClass(CELL_FOCUS_DISABLED_CLASS);

          var $checkbox = rowsView._renderSelectCheckBox($container, {
            value: model.row.isSelected,
            row: model.row,
            column: model.column
          });

          rowsView._attachCheckBoxClickEvent($checkbox);
        },
        _updateSelectColumn: noop,
        _getSelectAllNodeKeys: function _getSelectAllNodeKeys() {
          var component = this.component;
          var root = component.getRootNode();
          var cache = {};
          var keys = [];
          var isRecursiveSelection = this.isRecursiveSelection();
          root && treeListCore.foreachNodes(root.children, function (node) {
            if (node.key !== undefined && (node.visible || isRecursiveSelection)) {
              keys.push(node.key);
            }

            if (!node.visible) {
              return true;
            }

            return isRecursiveSelection ? false : component.isRowExpanded(node.key, cache);
          });
          return keys;
        },
        isSelectAll: function isSelectAll() {
          var selectedRowKeys = this.option('selectedRowKeys') || [];
          if (selectedRowKeys.length === 0) return false;
          var component = this.component;

          var visibleKeys = this._getSelectAllNodeKeys();

          var isRecursiveSelection = this.isRecursiveSelection();
          var hasIndeterminateState = false;
          var selectedVisibleKeys = visibleKeys.filter(function (key) {
            var isRowSelected = component.isRowSelected(key, isRecursiveSelection);

            if (isRowSelected === undefined) {
              hasIndeterminateState = true;
            }

            return isRowSelected;
          });

          if (!selectedVisibleKeys.length) {
            return hasIndeterminateState ? undefined : false;
          } else if (selectedVisibleKeys.length === visibleKeys.length) {
            return true;
          }
        },
        selectAll: function selectAll() {
          var visibleKeys = this._getSelectAllNodeKeys().filter(key => {
            return !this.isRowSelected(key);
          });

          this.focusedItemIndex(-1);
          return this.selectRows(visibleKeys, true);
        },
        deselectAll: function deselectAll() {
          var visibleKeys = this._getSelectAllNodeKeys();

          this.focusedItemIndex(-1);
          return this.deselectRows(visibleKeys);
        },
        selectedItemKeys: function selectedItemKeys(value, preserve, isDeselect, isSelectAll) {
          var that = this;
          var selectedRowKeys = that.option('selectedRowKeys');
          var isRecursiveSelection = this.isRecursiveSelection();

          var normalizedArgs = isRecursiveSelection && that._normalizeSelectionArgs({
            keys: isDefined(value) ? value : []
          }, preserve, !isDeselect);

          if (normalizedArgs && !equalByValue(normalizedArgs.selectedRowKeys, selectedRowKeys)) {
            that._isSelectionNormalizing = true;
            return this.callBase(normalizedArgs.selectedRowKeys, false, false, false).always(function () {
              that._isSelectionNormalizing = false;
            }).done(function (items) {
              normalizedArgs.selectedRowsData = items;

              that._fireSelectionChanged(normalizedArgs);
            });
          }

          return this.callBase(value, preserve, isDeselect, isSelectAll);
        },
        changeItemSelection: function changeItemSelection(itemIndex, keyboardKeys) {
          var isRecursiveSelection = this.isRecursiveSelection();

          if (isRecursiveSelection && !keyboardKeys.shift) {
            var key = this._dataController.getKeyByRowIndex(itemIndex);

            return this.selectedItemKeys(key, true, this.isRowSelected(key));
          }

          return this.callBase.apply(this, arguments);
        },
        _updateParentSelectionState: function _updateParentSelectionState(node, isSelected) {
          var that = this;
          var state = isSelected;
          var parentNode = node.parent;

          if (parentNode) {
            if (parentNode.children.length > 1) {
              if (isSelected === false) {
                var hasSelectedState = parentNode.children.some(function (childNode, index, children) {
                  return that._selectionStateByKey[childNode.key];
                });
                state = hasSelectedState ? undefined : false;
              } else if (isSelected === true) {
                var hasNonSelectedState = parentNode.children.some(function (childNode) {
                  return !that._selectionStateByKey[childNode.key];
                });
                state = hasNonSelectedState ? undefined : true;
              }
            }

            this._selectionStateByKey[parentNode.key] = state;

            if (parentNode.parent && parentNode.parent.level >= 0) {
              this._updateParentSelectionState(parentNode, state);
            }
          }
        },
        _updateChildrenSelectionState: function _updateChildrenSelectionState(node, isSelected) {
          var that = this;
          var children = node.children;
          children && children.forEach(function (childNode) {
            that._selectionStateByKey[childNode.key] = isSelected;

            if (childNode.children.length > 0) {
              that._updateChildrenSelectionState(childNode, isSelected);
            }
          });
        },
        _updateSelectionStateCore: function _updateSelectionStateCore(keys, isSelected) {
          var dataController = this._dataController;

          for (var i = 0; i < keys.length; i++) {
            this._selectionStateByKey[keys[i]] = isSelected;
            var node = dataController.getNodeByKey(keys[i]);

            if (node) {
              this._updateParentSelectionState(node, isSelected);

              this._updateChildrenSelectionState(node, isSelected);
            }
          }
        },
        _getSelectedParentKeys: function _getSelectedParentKeys(key, selectedItemKeys, useCash) {
          var selectedParentNode;

          var node = this._dataController.getNodeByKey(key);

          var parentNode = node && node.parent;
          var result = [];

          while (parentNode && parentNode.level >= 0) {
            result.unshift(parentNode.key);
            var isSelected = useCash ? !nodeExists(selectedItemKeys, parentNode.key) && this.isRowSelected(parentNode.key) : selectedItemKeys.indexOf(parentNode.key) >= 0;

            if (isSelected) {
              selectedParentNode = parentNode;
              result = this._getSelectedParentKeys(selectedParentNode.key, selectedItemKeys, useCash).concat(result);
              break;
            } else if (useCash) {
              break;
            }

            parentNode = parentNode.parent;
          }

          return selectedParentNode && result || [];
        },
        _getSelectedChildKeys: function _getSelectedChildKeys(key, keysToIgnore) {
          var childKeys = [];

          var node = this._dataController.getNodeByKey(key);

          node && treeListCore.foreachNodes(node.children, childNode => {
            var ignoreKeyIndex = keysToIgnore.indexOf(childNode.key);

            if (ignoreKeyIndex < 0) {
              childKeys.push(childNode.key);
            }

            return ignoreKeyIndex > 0 || ignoreKeyIndex < 0 && this._selectionStateByKey[childNode.key] === undefined;
          });
          return childKeys;
        },
        _normalizeParentKeys: function _normalizeParentKeys(key, args) {
          var that = this;
          var keysToIgnore = [key];

          var parentNodeKeys = that._getSelectedParentKeys(key, args.selectedRowKeys);

          if (parentNodeKeys.length) {
            keysToIgnore = keysToIgnore.concat(parentNodeKeys);
            keysToIgnore.forEach(function (key) {
              var index = args.selectedRowKeys.indexOf(key);

              if (index >= 0) {
                args.selectedRowKeys.splice(index, 1);
              }
            });

            var childKeys = that._getSelectedChildKeys(parentNodeKeys[0], keysToIgnore);

            args.selectedRowKeys = args.selectedRowKeys.concat(childKeys);
          }
        },
        _normalizeChildrenKeys: function _normalizeChildrenKeys(key, args) {
          var node = this._dataController.getNodeByKey(key);

          node && node.children.forEach(childNode => {
            var index = args.selectedRowKeys.indexOf(childNode.key);

            if (index >= 0) {
              args.selectedRowKeys.splice(index, 1);
            }

            this._normalizeChildrenKeys(childNode.key, args);
          });
        },
        _normalizeSelectedRowKeysCore: function _normalizeSelectedRowKeysCore(keys, args, preserve, isSelect) {
          var that = this;
          keys.forEach(function (key) {
            if (preserve && that.isRowSelected(key) === isSelect) {
              return;
            }

            that._normalizeChildrenKeys(key, args);

            var index = args.selectedRowKeys.indexOf(key);

            if (isSelect) {
              if (index < 0) {
                args.selectedRowKeys.push(key);
              }

              args.currentSelectedRowKeys.push(key);
            } else {
              if (index >= 0) {
                args.selectedRowKeys.splice(index, 1);
              }

              args.currentDeselectedRowKeys.push(key);

              that._normalizeParentKeys(key, args);
            }
          });
        },
        _normalizeSelectionArgs: function _normalizeSelectionArgs(args, preserve, isSelect) {
          var result;
          var keys = Array.isArray(args.keys) ? args.keys : [args.keys];
          var selectedRowKeys = this.option('selectedRowKeys') || [];

          if (keys.length) {
            result = {
              currentSelectedRowKeys: [],
              currentDeselectedRowKeys: [],
              selectedRowKeys: preserve ? selectedRowKeys.slice(0) : []
            };

            this._normalizeSelectedRowKeysCore(keys, result, preserve, isSelect);
          }

          return result;
        },
        _updateSelectedItems: function _updateSelectedItems(args) {
          this.updateSelectionState(args);
          this.callBase(args);
        },
        _fireSelectionChanged: function _fireSelectionChanged() {
          if (!this._isSelectionNormalizing) {
            this.callBase.apply(this, arguments);
          }
        },
        _isModeLeavesOnly: function _isModeLeavesOnly(mode) {
          return mode === 'leavesOnly';
        },
        _removeDuplicatedKeys: function _removeDuplicatedKeys(keys) {
          var result = [];
          var processedKeys = {};
          keys.forEach(key => {
            if (!processedKeys[key]) {
              processedKeys[key] = true;
              result.push(key);
            }
          });
          return result;
        },

        _getAllChildKeys(key) {
          var childKeys = [];

          var node = this._dataController.getNodeByKey(key);

          node && treeListCore.foreachNodes(node.children, function (childNode) {
            childKeys.push(childNode.key);
          }, true);
          return childKeys;
        },

        _getAllSelectedRowKeys: function _getAllSelectedRowKeys(keys) {
          var result = [];
          keys.forEach(key => {
            var parentKeys = this._getSelectedParentKeys(key, [], true);

            var childKeys = this._getAllChildKeys(key);

            result.push.apply(result, parentKeys.concat([key], childKeys));
          });
          result = this._removeDuplicatedKeys(result);
          return result;
        },
        _getParentSelectedRowKeys: function _getParentSelectedRowKeys(keys) {
          var that = this;
          var result = [];
          keys.forEach(key => {
            var parentKeys = that._getSelectedParentKeys(key, keys);

            !parentKeys.length && result.push(key);
          });
          return result;
        },
        _getLeafSelectedRowKeys: function _getLeafSelectedRowKeys(keys) {
          var that = this;
          var result = [];
          var dataController = that._dataController;
          keys.forEach(function (key) {
            var node = dataController.getNodeByKey(key);
            node && !node.hasChildren && result.push(key);
          });
          return result;
        },
        isRecursiveSelection: function isRecursiveSelection() {
          var selectionMode = this.option('selection.mode');
          var isRecursive = this.option('selection.recursive');
          return selectionMode === 'multiple' && isRecursive;
        },
        updateSelectionState: function updateSelectionState(options) {
          var removedItemKeys = options.removedItemKeys || [];
          var selectedItemKeys = options.selectedItemKeys || [];

          if (this.isRecursiveSelection()) {
            this._updateSelectionStateCore(removedItemKeys, false);

            this._updateSelectionStateCore(selectedItemKeys, true);
          }
        },
        isRowSelected: function isRowSelected(key, isRecursiveSelection) {
          var _isRecursiveSelection;

          var result = this.callBase.apply(this, arguments);
          isRecursiveSelection = (_isRecursiveSelection = isRecursiveSelection) !== null && _isRecursiveSelection !== void 0 ? _isRecursiveSelection : this.isRecursiveSelection();

          if (!result && isRecursiveSelection) {
            if (key in this._selectionStateByKey) {
              return this._selectionStateByKey[key];
            }

            return false;
          }

          return result;
        },

        getSelectedRowKeys(mode) {
          var that = this;

          if (!that._dataController) {
            return [];
          }

          var selectedRowKeys = that.callBase.apply(that, arguments);

          if (mode) {
            if (this.isRecursiveSelection()) {
              selectedRowKeys = this._getAllSelectedRowKeys(selectedRowKeys);
            }

            if (mode !== 'all') {
              if (mode === 'excludeRecursive') {
                selectedRowKeys = that._getParentSelectedRowKeys(selectedRowKeys);
              } else if (that._isModeLeavesOnly(mode)) {
                selectedRowKeys = that._getLeafSelectedRowKeys(selectedRowKeys);
              }
            }
          }

          return selectedRowKeys;
        },

        getSelectedRowsData: function getSelectedRowsData(mode) {
          var that = this;
          var dataController = that._dataController;
          var selectedKeys = this.getSelectedRowKeys(mode) || [];
          var selectedRowsData = [];
          selectedKeys.forEach(function (key) {
            var node = dataController.getNodeByKey(key);
            node && selectedRowsData.push(node.data);
          });
          return selectedRowsData;
        },
        refresh: function refresh() {
          this._selectionStateByKey = {};
          return this.callBase.apply(this, arguments);
        }
      }
    },
    views: {
      columnHeadersView: {
        _processTemplate: function _processTemplate(template, options) {
          var that = this;
          var resultTemplate;
          var renderingTemplate = this.callBase(template, options);

          var firstDataColumnIndex = that._columnsController.getFirstDataColumnIndex();

          if (renderingTemplate && options.rowType === 'header' && options.column.index === firstDataColumnIndex) {
            resultTemplate = {
              render: function render(options) {
                if (that.option('selection.mode') === 'multiple') {
                  that.renderSelectAll(options.container, options.model);
                }

                renderingTemplate.render(options);
              }
            };
          } else {
            resultTemplate = renderingTemplate;
          }

          return resultTemplate;
        },
        renderSelectAll: function renderSelectAll($cell, options) {
          $cell.addClass(TREELIST_SELECT_ALL_CLASS);

          this._renderSelectAllCheckBox($cell);
        },
        _isSortableElement: function _isSortableElement($target) {
          return this.callBase($target) && !$target.closest('.' + SELECT_CHECKBOX_CLASS).length;
        }
      },
      rowsView: {
        _renderIcons: function _renderIcons($iconContainer, options) {
          this.callBase.apply(this, arguments);

          if (!options.row.isNewRow && this.option('selection.mode') === 'multiple') {
            this.getController('selection').renderSelectCheckBoxContainer($iconContainer, options);
          }

          return $iconContainer;
        },
        _rowClick: function _rowClick(e) {
          var $targetElement = $(e.event.target);

          if (this.isExpandIcon($targetElement)) {
            this.callBase.apply(this, arguments);
          } else {
            originalRowClick.apply(this, arguments);
          }
        }
      }
    }
  }
}));