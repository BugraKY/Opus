"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _extend = require("../../core/utils/extend");

var _deferred = require("../../core/utils/deferred");

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _index = require("../../events/utils/index");

var _contextmenu = require("../../events/contextmenu");

var _uiFile_manager = require("./ui.file_manager.common");

var _message = _interopRequireDefault(require("../../localization/message"));

var _uiFile_managerItems_listThumbnails = _interopRequireDefault(require("./ui.file_manager.items_list.thumbnails.list_box"));

var _uiFile_manager2 = _interopRequireDefault(require("./ui.file_manager.item_list"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FILE_MANAGER_THUMBNAILS_ITEM_LIST_CLASS = 'dx-filemanager-thumbnails';
var FILE_MANAGER_THUMBNAILS_ITEM_CLASS = 'dx-filemanager-thumbnails-item';
var FILE_MANAGER_THUMBNAILS_ITEM_THUMBNAIL_CLASS = 'dx-filemanager-thumbnails-item-thumbnail';
var FILE_MANAGER_THUMBNAILS_EVENT_NAMESPACE = 'dxFileManager_thumbnails';

var FileManagerThumbnailsItemList = /*#__PURE__*/function (_FileManagerItemListB) {
  _inheritsLoose(FileManagerThumbnailsItemList, _FileManagerItemListB);

  function FileManagerThumbnailsItemList() {
    return _FileManagerItemListB.apply(this, arguments) || this;
  }

  var _proto = FileManagerThumbnailsItemList.prototype;

  _proto._initMarkup = function _initMarkup() {
    _FileManagerItemListB.prototype._initMarkup.call(this);

    this.$element().addClass(FILE_MANAGER_THUMBNAILS_ITEM_LIST_CLASS);
    var contextMenuEvent = (0, _index.addNamespace)(_contextmenu.name, FILE_MANAGER_THUMBNAILS_EVENT_NAMESPACE);

    _events_engine.default.on(this.$element(), contextMenuEvent, this._onContextMenu.bind(this));

    this._createItemList();
  };

  _proto._createItemList = function _createItemList() {
    var _this = this;

    var selectionMode = this._isMultipleSelectionMode() ? 'multiple' : 'single';
    var $itemListContainer = (0, _renderer.default)('<div>').appendTo(this.$element());
    this._itemList = this._createComponent($itemListContainer, _uiFile_managerItems_listThumbnails.default, {
      dataSource: this._createDataSource(),
      selectionMode: selectionMode,
      selectedItemKeys: this.option('selectedItemKeys'),
      focusedItemKey: this.option('focusedItemKey'),
      activeStateEnabled: true,
      hoverStateEnabled: true,
      loopItemFocus: false,
      focusStateEnabled: true,
      onItemEnterKeyPressed: this._tryOpen.bind(this),
      itemThumbnailTemplate: this._getItemThumbnailContainer.bind(this),
      getTooltipText: this._getTooltipText.bind(this),
      onSelectionChanged: this._onItemListSelectionChanged.bind(this),
      onFocusedItemChanged: this._onItemListFocusedItemChanged.bind(this),
      onContentReady: function onContentReady() {
        var _this$_refreshDeferre;

        return (_this$_refreshDeferre = _this._refreshDeferred) === null || _this$_refreshDeferre === void 0 ? void 0 : _this$_refreshDeferre.resolve();
      }
    });
  };

  _proto._onContextMenu = function _onContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!this._isDesktop()) {
      return;
    }

    var items = null;
    var targetItemElement = (0, _renderer.default)(e.target).closest(this._getItemSelector());
    var targetItem = null;

    if (targetItemElement.length > 0) {
      targetItem = this._itemList.getItemByItemElement(targetItemElement);

      this._itemList.selectItem(targetItem);

      items = this._getFileItemsForContextMenu(targetItem);
    }

    var target = {
      itemData: targetItem,
      itemElement: targetItemElement.length ? targetItemElement : undefined
    };

    this._showContextMenu(items, e.target, e, target);
  };

  _proto._getItemThumbnailCssClass = function _getItemThumbnailCssClass() {
    return FILE_MANAGER_THUMBNAILS_ITEM_THUMBNAIL_CLASS;
  };

  _proto._getItemSelector = function _getItemSelector() {
    return ".".concat(FILE_MANAGER_THUMBNAILS_ITEM_CLASS);
  };

  _proto._getTooltipText = function _getTooltipText(fileItemInfo) {
    var item = fileItemInfo.fileItem;

    if (item.tooltipText) {
      return item.tooltipText;
    }

    var text = "".concat(item.name, "\r\n");

    if (!item.isDirectory) {
      text += "".concat(_message.default.format('dxFileManager-listThumbnailsTooltipTextSize'), ": ").concat((0, _uiFile_manager.getDisplayFileSize)(item.size), "\r\n");
    }

    text += "".concat(_message.default.format('dxFileManager-listThumbnailsTooltipTextDateModified'), ": ").concat(item.dateModified);
    return text;
  };

  _proto._onItemDblClick = function _onItemDblClick(e) {
    var $item = (0, _renderer.default)(e.currentTarget);

    var item = this._itemList.getItemByItemElement($item);

    this._tryOpen(item);
  };

  _proto._tryOpen = function _tryOpen(item) {
    if (item) {
      this._raiseSelectedItemOpened(item);
    }
  };

  _proto._getItemsInternal = function _getItemsInternal() {
    return _FileManagerItemListB.prototype._getItemsInternal.call(this).then(function (items) {
      var deferred = new _deferred.Deferred();
      setTimeout(function () {
        return deferred.resolve(items);
      });
      return deferred.promise();
    });
  };

  _proto._disableDragging = function _disableDragging() {
    return false;
  };

  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_FileManagerItemListB.prototype._getDefaultOptions.call(this), {
      focusStateEnabled: true
    });
  };

  _proto._onItemListSelectionChanged = function _onItemListSelectionChanged(_ref) {
    var addedItemKeys = _ref.addedItemKeys,
        removedItemKeys = _ref.removedItemKeys;
    var selectedItemInfos = this.getSelectedItems();
    var selectedItems = selectedItemInfos.map(function (itemInfo) {
      return itemInfo.fileItem;
    });
    var selectedItemKeys = selectedItems.map(function (item) {
      return item.key;
    });

    this._tryRaiseSelectionChanged({
      selectedItemInfos: selectedItemInfos,
      selectedItems: selectedItems,
      selectedItemKeys: selectedItemKeys,
      currentSelectedItemKeys: addedItemKeys,
      currentDeselectedItemKeys: removedItemKeys
    });
  };

  _proto._onItemListFocusedItemChanged = function _onItemListFocusedItemChanged(_ref2) {
    var item = _ref2.item,
        itemElement = _ref2.itemElement;

    if (!this._isMultipleSelectionMode()) {
      this._selectItemSingleSelection(item);
    }

    var fileSystemItem = (item === null || item === void 0 ? void 0 : item.fileItem) || null;

    this._onFocusedItemChanged({
      item: fileSystemItem,
      itemKey: fileSystemItem === null || fileSystemItem === void 0 ? void 0 : fileSystemItem.key,
      itemElement: itemElement || undefined
    });
  };

  _proto._setSelectedItemKeys = function _setSelectedItemKeys(itemKeys) {
    this._itemList.option('selectedItemKeys', itemKeys);
  };

  _proto._setFocusedItemKey = function _setFocusedItemKey(itemKey) {
    this._itemList.option('focusedItemKey', itemKey);
  };

  _proto.refresh = function refresh(options) {
    var actualOptions = {
      dataSource: this._createDataSource()
    };

    if (options && Object.prototype.hasOwnProperty.call(options, 'focusedItemKey')) {
      actualOptions.focusedItemKey = options.focusedItemKey;
    }

    if (options && Object.prototype.hasOwnProperty.call(options, 'selectedItemKeys')) {
      actualOptions.selectedItemKeys = options.selectedItemKeys;
    }

    this._itemList.option(actualOptions);

    this._refreshDeferred = new _deferred.Deferred();
    return this._refreshDeferred.promise();
  };

  _proto._deselectItem = function _deselectItem(item) {
    var itemElement = this._itemList.getItemElementByItem(item);

    this._itemList.unselectItem(itemElement);
  };

  _proto._selectItemSingleSelection = function _selectItemSingleSelection(item) {
    if (item) {
      this._itemList.selectItem(item);
    } else {
      this._itemList.clearSelection();
    }
  };

  _proto.clearSelection = function clearSelection() {
    this._itemList.clearSelection();
  };

  _proto.getSelectedItems = function getSelectedItems() {
    return this._itemList.getSelectedItems();
  };

  return FileManagerThumbnailsItemList;
}(_uiFile_manager2.default);

var _default = FileManagerThumbnailsItemList;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;