"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _index = require("../../events/utils/index");

var _extend = require("../../core/utils/extend");

var _uiListEditStrategy = _interopRequireDefault(require("./ui.list.edit.strategy.grouped"));

var _message = _interopRequireDefault(require("../../localization/message"));

var _uiListEdit = _interopRequireDefault(require("./ui.list.edit.provider"));

var _uiList = require("./ui.list.base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LIST_ITEM_SELECTED_CLASS = 'dx-list-item-selected';
var LIST_ITEM_RESPONSE_WAIT_CLASS = 'dx-list-item-response-wait';

var ListEdit = _uiList.ListBase.inherit({
  _supportedKeys: function _supportedKeys() {
    var _this = this;

    var that = this;
    var parent = this.callBase();

    var deleteFocusedItem = function deleteFocusedItem(e) {
      if (that.option('allowItemDeleting')) {
        e.preventDefault();
        that.deleteItem(that.option('focusedElement'));
      }
    };

    var moveFocusedItem = function moveFocusedItem(e, moveUp) {
      var editStrategy = _this._editStrategy;

      var focusedElement = _this.option('focusedElement');

      var focusedItemIndex = editStrategy.getNormalizedIndex(focusedElement);

      var isLastIndexFocused = focusedItemIndex === _this._getLastItemIndex();

      if (isLastIndexFocused && _this._isDataSourceLoading()) {
        return;
      }

      if (e.shiftKey && that.option('itemDragging.allowReordering')) {
        var nextItemIndex = focusedItemIndex + (moveUp ? -1 : 1);
        var $nextItem = editStrategy.getItemElement(nextItemIndex);

        _this.reorderItem(focusedElement, $nextItem);

        _this.scrollToItem(focusedElement);

        e.preventDefault();
      } else {
        var editProvider = _this._editProvider;
        var isInternalMoving = editProvider.handleKeyboardEvents(focusedItemIndex, moveUp);

        if (!isInternalMoving) {
          moveUp ? parent.upArrow(e) : parent.downArrow(e);
        }
      }
    };

    var enter = function enter(e) {
      if (!this._editProvider.handleEnterPressing(e)) {
        parent.enter.apply(this, arguments);
      }
    };

    var space = function space(e) {
      if (!this._editProvider.handleEnterPressing(e)) {
        parent.space.apply(this, arguments);
      }
    };

    return (0, _extend.extend)({}, parent, {
      del: deleteFocusedItem,
      upArrow: function upArrow(e) {
        return moveFocusedItem(e, true);
      },
      downArrow: function downArrow(e) {
        return moveFocusedItem(e);
      },
      enter: enter,
      space: space
    });
  },
  _updateSelection: function _updateSelection() {
    this._editProvider.afterItemsRendered();

    this.callBase();
  },
  _getLastItemIndex: function _getLastItemIndex() {
    return this._itemElements().length - 1;
  },
  _refreshItemElements: function _refreshItemElements() {
    this.callBase();

    var excludedSelectors = this._editProvider.getExcludedItemSelectors();

    if (excludedSelectors.length) {
      this._itemElementsCache = this._itemElementsCache.not(excludedSelectors);
    }
  },
  _isItemStrictEquals: function _isItemStrictEquals(item1, item2) {
    var privateKey = item1 && item1.__dx_key__;

    if (privateKey && !this.key() && this._selection.isItemSelected(privateKey)) {
      return false;
    }

    return this.callBase(item1, item2);
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      showSelectionControls: false,
      selectionMode: 'none',
      selectAllMode: 'page',
      onSelectAllValueChanged: null,
      selectAllText: _message.default.format('dxList-selectAll'),
      menuItems: [],
      menuMode: 'context',
      allowItemDeleting: false,
      itemDeleteMode: 'static',
      itemDragging: {}
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: function device(_device) {
        return _device.platform === 'ios';
      },
      options: {
        menuMode: 'slide',
        itemDeleteMode: 'slideItem'
      }
    }, {
      device: {
        platform: 'android'
      },
      options: {
        itemDeleteMode: 'swipe'
      }
    }]);
  },
  _init: function _init() {
    this.callBase();

    this._initEditProvider();
  },
  _initDataSource: function _initDataSource() {
    this.callBase();

    if (!this._isPageSelectAll()) {
      this._dataSource && this._dataSource.requireTotalCount(true);
    }
  },
  _isPageSelectAll: function _isPageSelectAll() {
    return this.option('selectAllMode') === 'page';
  },
  _initEditProvider: function _initEditProvider() {
    this._editProvider = new _uiListEdit.default(this);
  },
  _disposeEditProvider: function _disposeEditProvider() {
    if (this._editProvider) {
      this._editProvider.dispose();
    }
  },
  _refreshEditProvider: function _refreshEditProvider() {
    this._disposeEditProvider();

    this._initEditProvider();
  },
  _initEditStrategy: function _initEditStrategy() {
    if (this.option('grouped')) {
      this._editStrategy = new _uiListEditStrategy.default(this);
    } else {
      this.callBase();
    }
  },
  _initMarkup: function _initMarkup() {
    this._refreshEditProvider();

    this.callBase();
  },
  _renderItems: function _renderItems() {
    this.callBase.apply(this, arguments);

    this._editProvider.afterItemsRendered();
  },
  _selectedItemClass: function _selectedItemClass() {
    return LIST_ITEM_SELECTED_CLASS;
  },
  _itemResponseWaitClass: function _itemResponseWaitClass() {
    return LIST_ITEM_RESPONSE_WAIT_CLASS;
  },
  _itemClickHandler: function _itemClickHandler(e) {
    var $itemElement = (0, _renderer.default)(e.currentTarget);

    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      return;
    }

    var handledByEditProvider = this._editProvider.handleClick($itemElement, e);

    if (handledByEditProvider) {
      return;
    }

    this._saveSelectionChangeEvent(e);

    this.callBase.apply(this, arguments);
  },
  _shouldFireContextMenuEvent: function _shouldFireContextMenuEvent() {
    return this.callBase.apply(this, arguments) || this._editProvider.contextMenuHandlerExists();
  },
  _itemHoldHandler: function _itemHoldHandler(e) {
    var $itemElement = (0, _renderer.default)(e.currentTarget);

    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      return;
    }

    var handledByEditProvider = (0, _index.isTouchEvent)(e) && this._editProvider.handleContextMenu($itemElement, e);

    if (handledByEditProvider) {
      e.handledByEditProvider = true;
      return;
    }

    this.callBase.apply(this, arguments);
  },
  _getItemContainer: function _getItemContainer(changeData) {
    if (this.option('grouped')) {
      var _this$_editStrategy$g;

      var groupIndex = (_this$_editStrategy$g = this._editStrategy.getIndexByItemData(changeData)) === null || _this$_editStrategy$g === void 0 ? void 0 : _this$_editStrategy$g.group;
      return this._getGroupContainerByIndex(groupIndex);
    } else {
      return this.callBase(changeData);
    }
  },
  _itemContextMenuHandler: function _itemContextMenuHandler(e) {
    var $itemElement = (0, _renderer.default)(e.currentTarget);

    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      return;
    }

    var handledByEditProvider = !e.handledByEditProvider && this._editProvider.handleContextMenu($itemElement, e);

    if (handledByEditProvider) {
      e.preventDefault();
      return;
    }

    this.callBase.apply(this, arguments);
  },
  _postprocessRenderItem: function _postprocessRenderItem(args) {
    this.callBase.apply(this, arguments);

    this._editProvider.modifyItemElement(args);
  },
  _clean: function _clean() {
    this._disposeEditProvider();

    this.callBase();
  },
  focusListItem: function focusListItem(index) {
    var $item = this._editStrategy.getItemElement(index);

    this.option('focusedElement', $item);
    this.focus();
    this.scrollToItem(this.option('focusedElement'));
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'selectAllMode':
        this._initDataSource();

        this._dataSource.pageIndex(0);

        this._dataSource.load();

        break;

      case 'grouped':
        this._clearSelectedItems();

        delete this._renderingGroupIndex;

        this._initEditStrategy();

        this.callBase(args);
        break;

      case 'showSelectionControls':
      case 'menuItems':
      case 'menuMode':
      case 'allowItemDeleting':
      case 'itemDeleteMode':
      case 'itemDragging':
      case 'selectAllText':
        this._invalidate();

        break;

      case 'onSelectAllValueChanged':
        break;

      default:
        this.callBase(args);
    }
  },
  selectAll: function selectAll() {
    return this._selection.selectAll(this._isPageSelectAll());
  },
  unselectAll: function unselectAll() {
    return this._selection.deselectAll(this._isPageSelectAll());
  },
  isSelectAll: function isSelectAll() {
    return this._selection.getSelectAllState(this._isPageSelectAll());
  },

  /**
  * @name dxList.getFlatIndexByItemElement
  * @publicName getFlatIndexByItemElement(itemElement)
  * @param1 itemElement:Element
  * @return object
  * @hidden
  */
  getFlatIndexByItemElement: function getFlatIndexByItemElement(itemElement) {
    return this._itemElements().index(itemElement);
  },

  /**
  * @name dxList.getItemElementByFlatIndex
  * @publicName getItemElementByFlatIndex(flatIndex)
  * @param1 flatIndex:Number
  * @return Element
  * @hidden
  */
  getItemElementByFlatIndex: function getItemElementByFlatIndex(flatIndex) {
    var $itemElements = this._itemElements();

    if (flatIndex < 0 || flatIndex >= $itemElements.length) {
      return (0, _renderer.default)();
    }

    return $itemElements.eq(flatIndex);
  },

  /**
  * @name dxList.getItemByIndex
  * @publicName getItemByIndex(index)
  * @param1 index:Number
  * @return object
  * @hidden
  */
  getItemByIndex: function getItemByIndex(index) {
    return this._editStrategy.getItemDataByIndex(index);
  }
});

var _default = ListEdit;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;