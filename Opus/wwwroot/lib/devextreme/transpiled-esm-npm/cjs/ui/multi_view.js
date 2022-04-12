"use strict";

exports.default = void 0;

var _size = require("../core/utils/size");

var _renderer = _interopRequireDefault(require("../core/renderer"));

var _translator2 = require("../animation/translator");

var _uiMulti_view = require("./multi_view/ui.multi_view.animation");

var _math = require("../core/utils/math");

var _extend = require("../core/utils/extend");

var _common = require("../core/utils/common");

var _visibility_change = require("../events/visibility_change");

var _element = require("../core/element");

var _type = require("../core/utils/type");

var _devices = _interopRequireDefault(require("../core/devices"));

var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));

var _uiCollection_widget = _interopRequireDefault(require("./collection/ui.collection_widget.live_update"));

var _swipeable = _interopRequireDefault(require("../events/gesture/swipeable"));

var _deferred = require("../core/utils/deferred");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// STYLE multiView
var MULTIVIEW_CLASS = 'dx-multiview';
var MULTIVIEW_WRAPPER_CLASS = 'dx-multiview-wrapper';
var MULTIVIEW_ITEM_CONTAINER_CLASS = 'dx-multiview-item-container';
var MULTIVIEW_ITEM_CLASS = 'dx-multiview-item';
var MULTIVIEW_ITEM_HIDDEN_CLASS = 'dx-multiview-item-hidden';
var MULTIVIEW_ITEM_DATA_KEY = 'dxMultiViewItemData';
var MULTIVIEW_ANIMATION_DURATION = 200;

var toNumber = function toNumber(value) {
  return +value;
};

var position = function position($element) {
  return (0, _translator2.locate)($element).left;
};

var MultiView = _uiCollection_widget.default.inherit({
  _activeStateUnit: '.' + MULTIVIEW_ITEM_CLASS,
  _supportedKeys: function _supportedKeys() {
    return (0, _extend.extend)(this.callBase(), {
      pageUp: _common.noop,
      pageDown: _common.noop
    });
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      selectedIndex: 0,
      swipeEnabled: true,
      animationEnabled: true,
      loop: false,
      deferRendering: true,

      /**
      * @name dxMultiViewOptions.selectedItems
      * @hidden
      */

      /**
      * @name dxMultiViewOptions.selectedItemKeys
      * @hidden
      */

      /**
      * @name dxMultiViewOptions.keyExpr
      * @hidden
      */
      _itemAttributes: {
        role: 'tabpanel'
      },
      loopItemFocus: false,
      selectOnFocus: true,
      selectionMode: 'single',
      selectionRequired: true,
      selectionByClick: false
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: function device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }]);
  },
  _itemClass: function _itemClass() {
    return MULTIVIEW_ITEM_CLASS;
  },
  _itemDataKey: function _itemDataKey() {
    return MULTIVIEW_ITEM_DATA_KEY;
  },
  _itemContainer: function _itemContainer() {
    return this._$itemContainer;
  },
  _itemElements: function _itemElements() {
    return this._itemContainer().children(this._itemSelector());
  },
  _itemWidth: function _itemWidth() {
    if (!this._itemWidthValue) {
      this._itemWidthValue = (0, _size.getWidth)(this._$wrapper);
    }

    return this._itemWidthValue;
  },
  _clearItemWidthCache: function _clearItemWidthCache() {
    delete this._itemWidthValue;
  },
  _itemsCount: function _itemsCount() {
    return this.option('items').length;
  },
  _normalizeIndex: function _normalizeIndex(index) {
    var count = this._itemsCount();

    if (index < 0) {
      index = index + count;
    }

    if (index >= count) {
      index = index - count;
    }

    return index;
  },
  _getRTLSignCorrection: function _getRTLSignCorrection() {
    return this.option('rtlEnabled') ? -1 : 1;
  },
  _init: function _init() {
    this.callBase.apply(this, arguments);
    var $element = this.$element();
    $element.addClass(MULTIVIEW_CLASS);
    this._$wrapper = (0, _renderer.default)('<div>').addClass(MULTIVIEW_WRAPPER_CLASS);

    this._$wrapper.appendTo($element);

    this._$itemContainer = (0, _renderer.default)('<div>').addClass(MULTIVIEW_ITEM_CONTAINER_CLASS);

    this._$itemContainer.appendTo(this._$wrapper);

    this.option('loopItemFocus', this.option('loop'));

    this._initSwipeable();
  },
  _initMarkup: function _initMarkup() {
    this._deferredItems = [];
    this.callBase();

    var selectedItemIndices = this._getSelectedItemIndices();

    this._updateItemsVisibility(selectedItemIndices[0]);
  },
  _afterItemElementDeleted: function _afterItemElementDeleted($item, deletedActionArgs) {
    this.callBase($item, deletedActionArgs);

    if (this._deferredItems) {
      this._deferredItems.splice(deletedActionArgs.itemIndex, 1);
    }
  },
  _beforeItemElementInserted: function _beforeItemElementInserted(change) {
    this.callBase.apply(this, arguments);

    if (this._deferredItems) {
      this._deferredItems.splice(change.index, 0, null);
    }
  },
  _executeItemRenderAction: function _executeItemRenderAction(index, itemData, itemElement) {
    index = (this.option('items') || []).indexOf(itemData);
    this.callBase(index, itemData, itemElement);
  },
  _renderItemContent: function _renderItemContent(args) {
    var renderContentDeferred = new _deferred.Deferred();
    var that = this;
    var callBase = this.callBase;
    var deferred = new _deferred.Deferred();
    deferred.done(function () {
      var $itemContent = callBase.call(that, args);
      renderContentDeferred.resolve($itemContent);
    });
    this._deferredItems[args.index] = deferred;
    this.option('deferRendering') || deferred.resolve();
    return renderContentDeferred.promise();
  },
  _render: function _render() {
    var _this = this;

    this.callBase();
    (0, _common.deferRender)(function () {
      var selectedItemIndices = _this._getSelectedItemIndices();

      _this._updateItems(selectedItemIndices[0]);
    });
  },
  _updateItems: function _updateItems(selectedIndex, newIndex) {
    this._updateItemsPosition(selectedIndex, newIndex);

    this._updateItemsVisibility(selectedIndex, newIndex);
  },
  _modifyByChanges: function _modifyByChanges() {
    this.callBase.apply(this, arguments);

    var selectedItemIndices = this._getSelectedItemIndices();

    this._updateItemsVisibility(selectedItemIndices[0]);
  },
  _updateItemsPosition: function _updateItemsPosition(selectedIndex, newIndex) {
    var $itemElements = this._itemElements();

    var positionSign = (0, _type.isDefined)(newIndex) ? -this._animationDirection(newIndex, selectedIndex) : undefined;
    var $selectedItem = $itemElements.eq(selectedIndex);

    _uiMulti_view._translator.move($selectedItem, 0);

    if ((0, _type.isDefined)(newIndex)) {
      _uiMulti_view._translator.move($itemElements.eq(newIndex), positionSign * 100 + '%');
    }
  },
  _updateItemsVisibility: function _updateItemsVisibility(selectedIndex, newIndex) {
    var $itemElements = this._itemElements();

    $itemElements.each(function (itemIndex, item) {
      var $item = (0, _renderer.default)(item);
      var isHidden = itemIndex !== selectedIndex && itemIndex !== newIndex;

      if (!isHidden) {
        this._renderSpecificItem(itemIndex);
      }

      $item.toggleClass(MULTIVIEW_ITEM_HIDDEN_CLASS, isHidden);
      this.setAria('hidden', isHidden || undefined, $item);
    }.bind(this));
  },
  _renderSpecificItem: function _renderSpecificItem(index) {
    var $item = this._itemElements().eq(index);

    var hasItemContent = $item.find(this._itemContentClass()).length > 0;

    if ((0, _type.isDefined)(index) && !hasItemContent) {
      this._deferredItems[index].resolve();

      (0, _visibility_change.triggerResizeEvent)($item);
    }
  },
  _refreshItem: function _refreshItem($item, item) {
    this.callBase($item, item);

    this._updateItemsVisibility(this.option('selectedIndex'));
  },
  _setAriaSelected: _common.noop,
  _updateSelection: function _updateSelection(addedSelection, removedSelection) {
    var newIndex = addedSelection[0];
    var prevIndex = removedSelection[0];

    _uiMulti_view.animation.complete(this._$itemContainer);

    this._updateItems(prevIndex, newIndex);

    var animationDirection = this._animationDirection(newIndex, prevIndex);

    this._animateItemContainer(animationDirection * this._itemWidth(), function () {
      _uiMulti_view._translator.move(this._$itemContainer, 0);

      this._updateItems(newIndex); // NOTE: force layout recalculation on iOS 6 & iOS 7.0 (B254713)


      (0, _size.getWidth)(this._$itemContainer);
    }.bind(this));
  },
  _animateItemContainer: function _animateItemContainer(position, completeCallback) {
    var duration = this.option('animationEnabled') ? MULTIVIEW_ANIMATION_DURATION : 0;

    _uiMulti_view.animation.moveTo(this._$itemContainer, position, duration, completeCallback);
  },
  _animationDirection: function _animationDirection(newIndex, prevIndex) {
    var containerPosition = position(this._$itemContainer);

    var indexDifference = (prevIndex - newIndex) * this._getRTLSignCorrection() * this._getItemFocusLoopSignCorrection();

    var isSwipePresent = containerPosition !== 0;
    var directionSignVariable = isSwipePresent ? containerPosition : indexDifference;
    return (0, _math.sign)(directionSignVariable);
  },
  _getSwipeDisabledState: function _getSwipeDisabledState() {
    return !this.option('swipeEnabled') || this._itemsCount() <= 1;
  },
  _initSwipeable: function _initSwipeable() {
    var _this2 = this;

    this._createComponent(this.$element(), _swipeable.default, {
      disabled: this._getSwipeDisabledState(),
      elastic: false,
      itemSizeFunc: this._itemWidth.bind(this),
      onStart: function onStart(args) {
        return _this2._swipeStartHandler(args.event);
      },
      onUpdated: function onUpdated(args) {
        return _this2._swipeUpdateHandler(args.event);
      },
      onEnd: function onEnd(args) {
        return _this2._swipeEndHandler(args.event);
      }
    });
  },
  _swipeStartHandler: function _swipeStartHandler(e) {
    _uiMulti_view.animation.complete(this._$itemContainer);

    var selectedIndex = this.option('selectedIndex');
    var loop = this.option('loop');
    var lastIndex = this._itemsCount() - 1;
    var rtl = this.option('rtlEnabled');
    e.maxLeftOffset = toNumber(loop || (rtl ? selectedIndex > 0 : selectedIndex < lastIndex));
    e.maxRightOffset = toNumber(loop || (rtl ? selectedIndex < lastIndex : selectedIndex > 0));
    this._swipeDirection = null;
  },
  _swipeUpdateHandler: function _swipeUpdateHandler(e) {
    var offset = e.offset;

    var swipeDirection = (0, _math.sign)(offset) * this._getRTLSignCorrection();

    _uiMulti_view._translator.move(this._$itemContainer, offset * this._itemWidth());

    if (swipeDirection !== this._swipeDirection) {
      this._swipeDirection = swipeDirection;
      var selectedIndex = this.option('selectedIndex');

      var newIndex = this._normalizeIndex(selectedIndex - swipeDirection);

      this._updateItems(selectedIndex, newIndex);
    }
  },
  _swipeEndHandler: function _swipeEndHandler(e) {
    var targetOffset = e.targetOffset * this._getRTLSignCorrection();

    if (targetOffset) {
      this.option('selectedIndex', this._normalizeIndex(this.option('selectedIndex') - targetOffset)); // TODO: change focusedElement on focusedItem

      var $selectedElement = this.itemElements().filter('.dx-item-selected');
      this.option('focusStateEnabled') && this.option('focusedElement', (0, _element.getPublicElement)($selectedElement));
    } else {
      this._animateItemContainer(0, _common.noop);
    }
  },
  _getItemFocusLoopSignCorrection: function _getItemFocusLoopSignCorrection() {
    return this._itemFocusLooped ? -1 : 1;
  },
  _moveFocus: function _moveFocus() {
    this.callBase.apply(this, arguments);
    this._itemFocusLooped = false;
  },
  _prevItem: function _prevItem($items) {
    var $result = this.callBase.apply(this, arguments);
    this._itemFocusLooped = $result.is($items.last());
    return $result;
  },
  _nextItem: function _nextItem($items) {
    var $result = this.callBase.apply(this, arguments);
    this._itemFocusLooped = $result.is($items.first());
    return $result;
  },
  _dimensionChanged: function _dimensionChanged() {
    this._clearItemWidthCache();
  },
  _visibilityChanged: function _visibilityChanged(visible) {
    if (visible) {
      this._dimensionChanged();
    }
  },
  _updateSwipeDisabledState: function _updateSwipeDisabledState() {
    var disabled = this._getSwipeDisabledState();

    _swipeable.default.getInstance(this.$element()).option('disabled', disabled);
  },
  _optionChanged: function _optionChanged(args) {
    var value = args.value;

    switch (args.name) {
      case 'loop':
        this.option('loopItemFocus', value);
        break;

      case 'animationEnabled':
        break;

      case 'swipeEnabled':
        this._updateSwipeDisabledState();

        break;

      case 'deferRendering':
        this._invalidate();

        break;

      case 'items':
        this._updateSwipeDisabledState();

        this.callBase(args);
        break;

      default:
        this.callBase(args);
    }
  }
});
/**
* @name dxMultiViewItem.visible
* @hidden
*/


(0, _component_registrator.default)('dxMultiView', MultiView);
var _default = MultiView;
/**
 * @name dxMultiViewItem
 * @inherits CollectionWidgetItem
 * @type object
 */

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;