"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _common = require("../../core/utils/common");

var _type = require("../../core/utils/type");

var _iterator = require("../../core/utils/iterator");

var _extend = require("../../core/utils/extend");

var _utils = require("../widget/utils.ink_ripple");

var _ui = _interopRequireDefault(require("../hierarchical_collection/ui.hierarchical_collection_widget"));

var _uiMenu_baseEdit = _interopRequireDefault(require("./ui.menu_base.edit.strategy"));

var _devices = _interopRequireDefault(require("../../core/devices"));

var _item = _interopRequireDefault(require("../collection/item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DX_MENU_CLASS = 'dx-menu';
var DX_MENU_NO_ICONS_CLASS = DX_MENU_CLASS + '-no-icons';
var DX_MENU_BASE_CLASS = 'dx-menu-base';
var ITEM_CLASS = DX_MENU_CLASS + '-item';
var DX_ITEM_CONTENT_CLASS = ITEM_CLASS + '-content';
var DX_MENU_SELECTED_ITEM_CLASS = ITEM_CLASS + '-selected';
var DX_MENU_ITEM_WRAPPER_CLASS = ITEM_CLASS + '-wrapper';
var DX_MENU_ITEMS_CONTAINER_CLASS = DX_MENU_CLASS + '-items-container';
var DX_MENU_ITEM_EXPANDED_CLASS = ITEM_CLASS + '-expanded';
var DX_MENU_SEPARATOR_CLASS = DX_MENU_CLASS + '-separator';
var DX_MENU_ITEM_LAST_GROUP_ITEM = DX_MENU_CLASS + '-last-group-item';
var DX_ITEM_HAS_TEXT = ITEM_CLASS + '-has-text';
var DX_ITEM_HAS_ICON = ITEM_CLASS + '-has-icon';
var DX_ITEM_HAS_SUBMENU = ITEM_CLASS + '-has-submenu';
var DX_MENU_ITEM_POPOUT_CLASS = ITEM_CLASS + '-popout';
var DX_MENU_ITEM_POPOUT_CONTAINER_CLASS = DX_MENU_ITEM_POPOUT_CLASS + '-container';
var DX_MENU_ITEM_CAPTION_CLASS = ITEM_CLASS + '-text';
var SINGLE_SELECTION_MODE = 'single';
var DEFAULT_DELAY = {
  'show': 50,
  'hide': 300
};

var MenuBase = /*#__PURE__*/function (_HierarchicalCollecti) {
  _inheritsLoose(MenuBase, _HierarchicalCollecti);

  function MenuBase() {
    return _HierarchicalCollecti.apply(this, arguments) || this;
  }

  var _proto = MenuBase.prototype;

  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_HierarchicalCollecti.prototype._getDefaultOptions.call(this), {
      items: [],
      cssClass: '',
      activeStateEnabled: true,
      showSubmenuMode: {
        name: 'onHover',
        delay: {
          show: 50,
          hide: 300
        }
      },
      animation: {
        show: {
          type: 'fade',
          from: 0,
          to: 1,
          duration: 100
        },
        hide: {
          type: 'fade',
          from: 1,
          to: 0,
          duration: 100
        }
      },
      selectByClick: false,
      focusOnSelectedItem: false,

      /**
      * @name dxMenuBaseOptions.onItemHold
      * @hidden
      * @action
      */

      /**
      * @name dxMenuBaseOptions.itemHoldTimeout
      * @hidden
      */

      /**
      * @name dxMenuBaseOptions.noDataText
      * @hidden
      */

      /**
      * @name dxMenuBaseOptions.selectedIndex
      * @hidden
      */

      /**
      * @name dxMenuBaseOptions.selectedItemKeys
      * @hidden
      */

      /**
      * @name dxMenuBaseOptions.keyExpr
      * @hidden
      */
      keyExpr: null,

      /**
      * @name dxMenuBaseOptions.parentIdExpr
      * @hidden
      */

      /**
      * @name dxMenuBaseOptions.expandedExpr
      * @hidden
      */
      _itemAttributes: {
        role: 'menuitem'
      },
      useInkRipple: false
      /**
       * @name dxMenuBaseItem.html
       * @type String
       * @hidden
      */

    });
  };

  _proto._itemDataKey = function _itemDataKey() {
    return 'dxMenuItemDataKey';
  };

  _proto._itemClass = function _itemClass() {
    return ITEM_CLASS;
  };

  _proto._setAriaSelected = function _setAriaSelected() {};

  _proto._selectedItemClass = function _selectedItemClass() {
    return DX_MENU_SELECTED_ITEM_CLASS;
  };

  _proto._widgetClass = function _widgetClass() {
    return DX_MENU_BASE_CLASS;
  };

  _proto._focusTarget = function _focusTarget() {
    return this._itemContainer();
  };

  _proto._clean = function _clean() {
    this.option('focusedElement', null);

    _HierarchicalCollecti.prototype._clean.call(this);
  };

  _proto._supportedKeys = function _supportedKeys() {
    var _this = this;

    var selectItem = function selectItem() {
      var $item = (0, _renderer.default)(_this.option('focusedElement'));

      if (!$item.length || !_this._isSelectionEnabled()) {
        return;
      }

      _this.selectItem($item[0]);
    };

    return (0, _extend.extend)(_HierarchicalCollecti.prototype._supportedKeys.call(this), {
      space: selectItem,
      pageUp: _common.noop,
      pageDown: _common.noop
    });
  };

  _proto._isSelectionEnabled = function _isSelectionEnabled() {
    return this.option('selectionMode') === SINGLE_SELECTION_MODE;
  };

  _proto._init = function _init() {
    this._activeStateUnit = ".".concat(ITEM_CLASS);

    _HierarchicalCollecti.prototype._init.call(this);

    this._renderSelectedItem();

    this._initActions();
  };

  _proto._getTextContainer = function _getTextContainer(itemData) {
    var itemText = itemData.text;
    var $itemContainer = (0, _renderer.default)('<span>').addClass(DX_MENU_ITEM_CAPTION_CLASS);
    var itemContent = (0, _type.isPlainObject)(itemData) ? itemText : String(itemData);
    return itemText && $itemContainer.text(itemContent);
  };

  _proto._getPopoutContainer = function _getPopoutContainer(itemData) {
    var items = itemData.items;
    var $popOutContainer;

    if (items && items.length) {
      var $popOutImage = (0, _renderer.default)('<div>').addClass(DX_MENU_ITEM_POPOUT_CLASS);
      $popOutContainer = (0, _renderer.default)('<span>').addClass(DX_MENU_ITEM_POPOUT_CONTAINER_CLASS).append($popOutImage);
    }

    return $popOutContainer;
  };

  _proto._getDataAdapterOptions = function _getDataAdapterOptions() {
    return {
      rootValue: 0,
      multipleSelection: false,
      recursiveSelection: false,
      recursiveExpansion: false,
      searchValue: ''
    };
  };

  _proto._selectByItem = function _selectByItem(selectedItem) {
    if (!selectedItem) return;

    var nodeToSelect = this._dataAdapter.getNodeByItem(selectedItem);

    this._dataAdapter.toggleSelection(nodeToSelect.internalFields.key, true);
  };

  _proto._renderSelectedItem = function _renderSelectedItem() {
    var selectedKeys = this._dataAdapter.getSelectedNodesKeys();

    var selectedKey = selectedKeys.length && selectedKeys[0];
    var selectedItem = this.option('selectedItem');

    if (!selectedKey) {
      this._selectByItem(selectedItem);

      return;
    }

    var node = this._dataAdapter.getNodeByKey(selectedKey);

    if (node.selectable === false) return;

    if (!selectedItem) {
      this.option('selectedItem', node.internalFields.item);
      return;
    }

    if (selectedItem !== node.internalFields.item) {
      this._dataAdapter.toggleSelection(selectedKey, false);

      this._selectByItem(selectedItem);
    }
  };

  _proto._initActions = function _initActions() {};

  _proto._initMarkup = function _initMarkup() {
    _HierarchicalCollecti.prototype._initMarkup.call(this);

    this._addCustomCssClass(this.$element());

    this.option('useInkRipple') && this._renderInkRipple();
  };

  _proto._renderInkRipple = function _renderInkRipple() {
    this._inkRipple = (0, _utils.render)();
  };

  _proto._toggleActiveState = function _toggleActiveState($element, value, e) {
    _HierarchicalCollecti.prototype._toggleActiveState.apply(this, arguments);

    if (!this._inkRipple) {
      return;
    }

    var config = {
      element: $element,
      event: e
    };

    if (value) {
      this._inkRipple.showWave(config);
    } else {
      this._inkRipple.hideWave(config);
    }
  };

  _proto._getShowSubmenuMode = function _getShowSubmenuMode() {
    var defaultValue = 'onClick';
    var optionValue = this.option('showSubmenuMode');
    optionValue = (0, _type.isObject)(optionValue) ? optionValue.name : optionValue;
    return this._isDesktopDevice() ? optionValue : defaultValue;
  };

  _proto._initSelectedItems = function _initSelectedItems() {};

  _proto._isDesktopDevice = function _isDesktopDevice() {
    return _devices.default.real().deviceType === 'desktop';
  };

  _proto._initEditStrategy = function _initEditStrategy() {
    var Strategy = _uiMenu_baseEdit.default;
    this._editStrategy = new Strategy(this);
  };

  _proto._addCustomCssClass = function _addCustomCssClass($element) {
    $element.addClass(this.option('cssClass'));
  };

  _proto._itemWrapperSelector = function _itemWrapperSelector() {
    return ".".concat(DX_MENU_ITEM_WRAPPER_CLASS);
  };

  _proto._hoverStartHandler = function _hoverStartHandler(e) {
    var $itemElement = this._getItemElementByEventArgs(e);

    if (!$itemElement || this._isItemDisabled($itemElement)) return;
    e.stopPropagation();

    if (this._getShowSubmenuMode() === 'onHover') {
      clearTimeout(this._showSubmenusTimeout);
      this._showSubmenusTimeout = setTimeout(this._showSubmenu.bind(this, $itemElement), this._getSubmenuDelay('show'));
    }
  };

  _proto._getAvailableItems = function _getAvailableItems($itemElements) {
    return _HierarchicalCollecti.prototype._getAvailableItems.call(this, $itemElements).filter(function () {
      return (0, _renderer.default)(this).css('visibility') !== 'hidden';
    });
  };

  _proto._isItemDisabled = function _isItemDisabled($item) {
    return this._disabledGetter($item.data(this._itemDataKey()));
  };

  _proto._showSubmenu = function _showSubmenu($itemElement) {
    this._addExpandedClass($itemElement);
  };

  _proto._addExpandedClass = function _addExpandedClass(itemElement) {
    (0, _renderer.default)(itemElement).addClass(DX_MENU_ITEM_EXPANDED_CLASS);
  };

  _proto._getSubmenuDelay = function _getSubmenuDelay(action) {
    var _this$option = this.option('showSubmenuMode'),
        delay = _this$option.delay;

    if (!(0, _type.isDefined)(delay)) {
      return DEFAULT_DELAY[action];
    }

    return (0, _type.isObject)(delay) ? delay[action] : delay;
  } // TODO: try to simplify
  ;

  _proto._getItemElementByEventArgs = function _getItemElementByEventArgs(eventArgs) {
    var $target = (0, _renderer.default)(eventArgs.target);

    if ($target.hasClass(this._itemClass()) || $target.get(0) === eventArgs.currentTarget) {
      return $target;
    } // TODO: move it to inheritors, menuBase don't know about dx-submenu


    while (!$target.hasClass(this._itemClass())) {
      $target = $target.parent();

      if ($target.hasClass('dx-submenu')) {
        return null;
      }
    }

    return $target;
  };

  _proto._hoverEndHandler = function _hoverEndHandler() {
    clearTimeout(this._showSubmenusTimeout);
  };

  _proto._hasSubmenu = function _hasSubmenu(node) {
    return node && node.internalFields.childrenKeys.length;
  };

  _proto._renderContentImpl = function _renderContentImpl() {
    this._renderItems(this._dataAdapter.getRootNodes());
  };

  _proto._renderItems = function _renderItems(nodes, submenuContainer) {
    var _this2 = this;

    if (nodes.length) {
      this.hasIcons = false;

      var $nodeContainer = this._renderContainer(this.$element(), submenuContainer);

      var firstVisibleIndex = -1;
      var nextGroupFirstIndex = -1;
      (0, _iterator.each)(nodes, function (index, node) {
        var isVisibleNode = node.visible !== false;

        if (isVisibleNode && firstVisibleIndex < 0) {
          firstVisibleIndex = index;
        }

        var isBeginGroup = firstVisibleIndex < index && (node.beginGroup || index === nextGroupFirstIndex);

        if (isBeginGroup) {
          nextGroupFirstIndex = isVisibleNode ? index : index + 1;
        }

        if (index === nextGroupFirstIndex && firstVisibleIndex < index) {
          _this2._renderSeparator($nodeContainer);
        }

        _this2._renderItem(index, node, $nodeContainer);
      });
      if (!this.hasIcons) $nodeContainer.addClass(DX_MENU_NO_ICONS_CLASS);
    }
  };

  _proto._renderContainer = function _renderContainer($wrapper) {
    var $container = (0, _renderer.default)('<ul>');
    this.setAria('role', 'none', $container);
    return $container.appendTo($wrapper).addClass(DX_MENU_ITEMS_CONTAINER_CLASS);
  };

  _proto._createDOMElement = function _createDOMElement($nodeContainer) {
    var $node = (0, _renderer.default)('<li>');
    this.setAria('role', 'none', $node);
    return $node.appendTo($nodeContainer).addClass(DX_MENU_ITEM_WRAPPER_CLASS);
  };

  _proto._renderItem = function _renderItem(index, node, $nodeContainer, $nodeElement) {
    var items = this.option('items');

    var $node = $nodeElement || this._createDOMElement($nodeContainer);

    if (items[index + 1] && items[index + 1].beginGroup) {
      $node.addClass(DX_MENU_ITEM_LAST_GROUP_ITEM);
    }

    var $itemFrame = _HierarchicalCollecti.prototype._renderItem.call(this, index, node.internalFields.item, $node);

    if (node.internalFields.item === this.option('selectedItem')) {
      $itemFrame.addClass(DX_MENU_SELECTED_ITEM_CLASS);
    }

    $itemFrame.attr('tabIndex', -1);
    if (this._hasSubmenu(node)) this.setAria('haspopup', 'true', $itemFrame);
  };

  _proto._renderItemFrame = function _renderItemFrame(index, itemData, $itemContainer) {
    var $itemFrame = $itemContainer.children(".".concat(ITEM_CLASS));
    return $itemFrame.length ? $itemFrame : _HierarchicalCollecti.prototype._renderItemFrame.apply(this, arguments);
  };

  _proto._refreshItem = function _refreshItem($item, item) {
    var node = this._dataAdapter.getNodeByItem(item);

    var index = $item.data(this._itemIndexKey());
    var $nodeContainer = $item.closest('ul');
    var $nodeElement = $item.closest('li');

    this._renderItem(index, node, $nodeContainer, $nodeElement);
  };

  _proto._addContentClasses = function _addContentClasses(itemData, $itemFrame) {
    var hasText = itemData.text ? !!itemData.text.length : false;
    var hasIcon = !!itemData.icon;
    var hasSubmenu = itemData.items ? !!itemData.items.length : false;
    $itemFrame.toggleClass(DX_ITEM_HAS_TEXT, hasText);
    $itemFrame.toggleClass(DX_ITEM_HAS_ICON, hasIcon);

    if (!this.hasIcons) {
      this.hasIcons = hasIcon;
    }

    $itemFrame.toggleClass(DX_ITEM_HAS_SUBMENU, hasSubmenu);
  };

  _proto._getItemContent = function _getItemContent($itemFrame) {
    var $itemContent = _HierarchicalCollecti.prototype._getItemContent.call(this, $itemFrame);

    if (!$itemContent.length) {
      $itemContent = $itemFrame.children(".".concat(DX_ITEM_CONTENT_CLASS));
    }

    return $itemContent;
  };

  _proto._postprocessRenderItem = function _postprocessRenderItem(args) {
    var $itemElement = (0, _renderer.default)(args.itemElement);

    var selectedIndex = this._dataAdapter.getSelectedNodesKeys();

    if (!selectedIndex.length || !this._selectedGetter(args.itemData) || !this._isItemSelectable(args.itemData)) {
      this._setAriaSelected($itemElement, 'false');

      return;
    }

    var node = this._dataAdapter.getNodeByItem(args.itemData);

    if (node.internalFields.key === selectedIndex[0]) {
      $itemElement.addClass(this._selectedItemClass());

      this._setAriaSelected($itemElement, 'true');
    } else {
      this._setAriaSelected($itemElement, 'false');
    }
  };

  _proto._isItemSelectable = function _isItemSelectable(item) {
    return item.selectable !== false;
  };

  _proto._renderSeparator = function _renderSeparator($itemsContainer) {
    (0, _renderer.default)('<li>').appendTo($itemsContainer).addClass(DX_MENU_SEPARATOR_CLASS);
  };

  _proto._itemClickHandler = function _itemClickHandler(e) {
    if (e._skipHandling) return;

    var itemClickActionHandler = this._createAction(this._updateSubmenuVisibilityOnClick.bind(this));

    this._itemDXEventHandler(e, 'onItemClick', {}, {
      afterExecute: itemClickActionHandler.bind(this)
    });

    e._skipHandling = true;
  };

  _proto._updateSubmenuVisibilityOnClick = function _updateSubmenuVisibilityOnClick(actionArgs) {
    this._updateSelectedItemOnClick(actionArgs);

    if (this._getShowSubmenuMode() === 'onClick') {
      this._addExpandedClass(actionArgs.args[0].itemElement);
    }
  };

  _proto._updateSelectedItemOnClick = function _updateSelectedItemOnClick(actionArgs) {
    var args = actionArgs.args ? actionArgs.args[0] : actionArgs;

    if (!this._isItemSelectionAllowed(args.itemData)) {
      return;
    }

    var selectedItemKey = this._dataAdapter.getSelectedNodesKeys();

    var selectedNode = selectedItemKey.length && this._dataAdapter.getNodeByKey(selectedItemKey[0]);

    if (selectedNode) {
      this._toggleItemSelection(selectedNode, false);
    }

    if (!selectedNode || selectedNode.internalFields.item !== args.itemData) {
      this.selectItem(args.itemData);
    } else {
      this._fireSelectionChangeEvent(null, this.option('selectedItem'));

      this._setOptionWithoutOptionChange('selectedItem', null);
    }
  };

  _proto._isItemSelectionAllowed = function _isItemSelectionAllowed(item) {
    var isSelectionByClickEnabled = this._isSelectionEnabled() && this.option('selectByClick');
    return !this._isContainerEmpty() && isSelectionByClickEnabled && this._isItemSelectable(item) && !this._itemsGetter(item);
  };

  _proto._isContainerEmpty = function _isContainerEmpty() {
    return this._itemContainer().is(':empty');
  };

  _proto._syncSelectionOptions = function _syncSelectionOptions() {
    return (0, _common.asyncNoop)();
  };

  _proto._optionChanged = function _optionChanged(args) {
    switch (args.name) {
      case 'showSubmenuMode':
        break;

      case 'selectedItem':
        {
          var node = this._dataAdapter.getNodeByItem(args.value);

          var selectedKey = this._dataAdapter.getSelectedNodesKeys()[0];

          if (node && node.internalFields.key !== selectedKey) {
            if (node.selectable === false) break;

            if (selectedKey) {
              this._toggleItemSelection(this._dataAdapter.getNodeByKey(selectedKey), false);
            }

            this._toggleItemSelection(node, true);

            this._updateSelectedItems();
          }

          break;
        }

      case 'cssClass':
      case 'position':
      case 'selectByClick':
      case 'animation':
      case 'useInkRipple':
        this._invalidate();

        break;

      default:
        _HierarchicalCollecti.prototype._optionChanged.call(this, args);

    }
  };

  _proto._toggleItemSelection = function _toggleItemSelection(node, value) {
    var itemElement = this._getElementByItem(node.internalFields.item);

    itemElement && (0, _renderer.default)(itemElement).toggleClass(DX_MENU_SELECTED_ITEM_CLASS);

    this._dataAdapter.toggleSelection(node.internalFields.key, value);
  };

  _proto._getElementByItem = function _getElementByItem(itemData) {
    var _this3 = this;

    var result;
    (0, _iterator.each)(this._itemElements(), function (_, itemElement) {
      if ((0, _renderer.default)(itemElement).data(_this3._itemDataKey()) !== itemData) {
        return true;
      }

      result = itemElement;
      return false;
    });
    return result;
  };

  _proto._updateSelectedItems = function _updateSelectedItems(oldSelection, newSelection) {
    if (oldSelection || newSelection) {
      this._fireSelectionChangeEvent(newSelection, oldSelection);
    }
  };

  _proto._fireSelectionChangeEvent = function _fireSelectionChangeEvent(addedSelection, removedSelection) {
    this._createActionByOption('onSelectionChanged', {
      excludeValidators: ['disabled', 'readOnly']
    })({
      addedItems: [addedSelection],
      removedItems: [removedSelection]
    });
  };

  _proto.selectItem = function selectItem(itemElement) {
    var itemData = itemElement.nodeType ? this._getItemData(itemElement) : itemElement;

    var selectedKey = this._dataAdapter.getSelectedNodesKeys()[0];

    var selectedItem = this.option('selectedItem');

    var node = this._dataAdapter.getNodeByItem(itemData);

    if (node.internalFields.key !== selectedKey) {
      if (selectedKey) {
        this._toggleItemSelection(this._dataAdapter.getNodeByKey(selectedKey), false);
      }

      this._toggleItemSelection(node, true);

      this._updateSelectedItems(selectedItem, itemData);

      this._setOptionWithoutOptionChange('selectedItem', itemData);
    }
  };

  _proto.unselectItem = function unselectItem(itemElement) {
    var itemData = itemElement.nodeType ? this._getItemData(itemElement) : itemElement;

    var node = this._dataAdapter.getNodeByItem(itemData);

    var selectedItem = this.option('selectedItem');

    if (node.internalFields.selected) {
      this._toggleItemSelection(node, false);

      this._updateSelectedItems(selectedItem, null);

      this._setOptionWithoutOptionChange('selectedItem', null);
    }
  };

  return MenuBase;
}(_ui.default);

MenuBase.ItemClass = _item.default;
var _default = MenuBase;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;