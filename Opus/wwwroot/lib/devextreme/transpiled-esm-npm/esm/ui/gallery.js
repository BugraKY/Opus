import { getOuterWidth, setOuterWidth, getOuterHeight, getWidth } from '../core/utils/size';
import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import registerComponent from '../core/component_registrator';
import { noop } from '../core/utils/common';
import { isDefined, isPlainObject } from '../core/utils/type';
import { hasWindow } from '../core/utils/window';
import { extend } from '../core/utils/extend';
import { getPublicElement } from '../core/element';
import fx from '../animation/fx';
import { name as clickEventName } from '../events/click';
import { move } from '../animation/translator';
import devices from '../core/devices';
import Widget from './widget/ui.widget';
import { addNamespace } from '../events/utils/index';
import CollectionWidget from './collection/ui.collection_widget.edit';
import Swipeable from '../events/gesture/swipeable';
import { BindableTemplate } from '../core/templates/bindable_template';
import { Deferred } from '../core/utils/deferred'; // STYLE gallery

var GALLERY_CLASS = 'dx-gallery';
var GALLERY_WRAPPER_CLASS = GALLERY_CLASS + '-wrapper';
var GALLERY_LOOP_CLASS = 'dx-gallery-loop';
var GALLERY_ITEM_CONTAINER_CLASS = GALLERY_CLASS + '-container';
var GALLERY_ACTIVE_CLASS = GALLERY_CLASS + '-active';
var GALLERY_ITEM_CLASS = GALLERY_CLASS + '-item';
var GALLERY_INVISIBLE_ITEM_CLASS = GALLERY_CLASS + '-item-invisible';
var GALLERY_LOOP_ITEM_CLASS = GALLERY_ITEM_CLASS + '-loop';
var GALLERY_ITEM_SELECTOR = '.' + GALLERY_ITEM_CLASS;
var GALLERY_ITEM_SELECTED_CLASS = GALLERY_ITEM_CLASS + '-selected';
var GALLERY_INDICATOR_CLASS = GALLERY_CLASS + '-indicator';
var GALLERY_INDICATOR_ITEM_CLASS = GALLERY_INDICATOR_CLASS + '-item';
var GALLERY_INDICATOR_ITEM_SELECTOR = '.' + GALLERY_INDICATOR_ITEM_CLASS;
var GALLERY_INDICATOR_ITEM_SELECTED_CLASS = GALLERY_INDICATOR_ITEM_CLASS + '-selected';
var GALLERY_IMAGE_CLASS = 'dx-gallery-item-image';
var GALLERY_ITEM_DATA_KEY = 'dxGalleryItemData';
var MAX_CALC_ERROR = 1;
var GalleryNavButton = Widget.inherit({
  _supportedKeys: function _supportedKeys() {
    return extend(this.callBase(), {
      pageUp: noop,
      pageDown: noop
    });
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      direction: 'next',
      onClick: null,
      hoverStateEnabled: true,
      activeStateEnabled: true
    });
  },
  _render: function _render() {
    this.callBase();
    var that = this;
    var $element = this.$element();
    var eventName = addNamespace(clickEventName, this.NAME);
    $element.addClass(GALLERY_CLASS + '-nav-button-' + this.option('direction'));
    eventsEngine.off($element, eventName);
    eventsEngine.on($element, eventName, function (e) {
      that._createActionByOption('onClick')({
        event: e
      });
    });
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'onClick':
      case 'direction':
        this._invalidate();

        break;

      default:
        this.callBase(args);
    }
  }
});
var Gallery = CollectionWidget.inherit({
  _activeStateUnit: GALLERY_ITEM_SELECTOR,
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      /**
       * @name dxGalleryOptions.activeStateEnabled
       * @type boolean
       * @default false
       * @hidden
      */
      activeStateEnabled: false,
      animationDuration: 400,
      animationEnabled: true,
      loop: false,
      swipeEnabled: true,
      indicatorEnabled: true,
      showIndicator: true,
      selectedIndex: 0,
      slideshowDelay: 0,
      showNavButtons: false,
      wrapAround: false,
      initialItemWidth: undefined,
      stretchImages: false,

      /**
      * @name dxGalleryOptions.selectedItems
      * @hidden
      */

      /**
      * @name dxGalleryOptions.selectedItemKeys
      * @hidden
      */

      /**
      * @name dxGalleryOptions.keyExpr
      * @hidden
      */
      _itemAttributes: {
        role: 'option'
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
        return devices.real().deviceType === 'desktop' && !devices.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }]);
  },
  _init: function _init() {
    this.callBase();
    this.option('loopItemFocus', this.option('loop'));
  },
  _initTemplates: function _initTemplates() {
    this.callBase();
    /**
    * @name dxGalleryItem.visible
    * @hidden
    */

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(function ($container, data) {
        var $img = $('<img>').addClass(GALLERY_IMAGE_CLASS);

        if (isPlainObject(data)) {
          this._prepareDefaultItemTemplate(data, $container);

          $img.attr({
            'src': data.imageSrc,
            'alt': data.imageAlt
          }).appendTo($container);
        } else {
          $img.attr('src', String(data)).appendTo($container);
        }
      }.bind(this), ['imageSrc', 'imageAlt', 'text', 'html'], this.option('integrationOptions.watchMethod'))
    });
  },
  _dataSourceOptions: function _dataSourceOptions() {
    return {
      paginate: false
    };
  },
  _itemContainer: function _itemContainer() {
    return this._$container;
  },
  _itemClass: function _itemClass() {
    return GALLERY_ITEM_CLASS;
  },
  _itemDataKey: function _itemDataKey() {
    return GALLERY_ITEM_DATA_KEY;
  },
  _actualItemWidth: function _actualItemWidth() {
    var isWrapAround = this.option('wrapAround');

    if (this.option('stretchImages')) {
      var itemPerPage = isWrapAround ? this._itemsPerPage() + 1 : this._itemsPerPage();
      return 1 / itemPerPage;
    }

    if (isWrapAround) {
      return this._itemPercentWidth() * this._itemsPerPage() / (this._itemsPerPage() + 1);
    }

    return this._itemPercentWidth();
  },
  _itemPercentWidth: function _itemPercentWidth() {
    var percentWidth;
    var elementWidth = getOuterWidth(this.$element());
    var initialItemWidth = this.option('initialItemWidth');

    if (initialItemWidth && initialItemWidth <= elementWidth) {
      percentWidth = initialItemWidth / elementWidth;
    } else {
      percentWidth = 1;
    }

    return percentWidth;
  },
  _itemsPerPage: function _itemsPerPage() {
    var itemsPerPage = hasWindow() ? Math.floor(1 / this._itemPercentWidth()) : 1;
    return Math.min(itemsPerPage, this._itemsCount());
  },
  _pagesCount: function _pagesCount() {
    return Math.ceil(this._itemsCount() / this._itemsPerPage());
  },
  _itemsCount: function _itemsCount() {
    return (this.option('items') || []).length;
  },
  _offsetDirection: function _offsetDirection() {
    return this.option('rtlEnabled') ? -1 : 1;
  },
  _initMarkup: function _initMarkup() {
    this._renderWrapper();

    this._renderItemsContainer();

    this.$element().addClass(GALLERY_CLASS);
    this.$element().toggleClass(GALLERY_LOOP_CLASS, this.option('loop'));
    this.callBase();
    this.setAria({
      'role': 'listbox',
      'label': 'gallery'
    });
  },
  _render: function _render() {
    this._renderDragHandler();

    this._renderContainerPosition();

    this._renderItemSizes();

    this._renderItemPositions();

    this._renderNavButtons();

    this._renderIndicator();

    this._renderSelectedItem();

    this._renderItemVisibility();

    this._renderUserInteraction();

    this._setupSlideShow();

    this._reviseDimensions();

    this.callBase();
  },
  _dimensionChanged: function _dimensionChanged() {
    var selectedIndex = this.option('selectedIndex') || 0;

    this._stopItemAnimations();

    this._clearCacheWidth();

    this._cloneDuplicateItems();

    this._renderItemSizes();

    this._renderItemPositions();

    this._renderIndicator();

    this._renderContainerPosition(this._calculateIndexOffset(selectedIndex), true);

    this._renderItemVisibility();
  },
  _renderDragHandler: function _renderDragHandler() {
    var eventName = addNamespace('dragstart', this.NAME);
    eventsEngine.off(this.$element(), eventName);
    eventsEngine.on(this.$element(), eventName, 'img', function () {
      return false;
    });
  },
  _renderWrapper: function _renderWrapper() {
    if (this._$wrapper) {
      return;
    }

    this._$wrapper = $('<div>').addClass(GALLERY_WRAPPER_CLASS).appendTo(this.$element());
  },
  _renderItems: function _renderItems(items) {
    if (!hasWindow()) {
      var selectedIndex = this.option('selectedIndex');
      items = items.length > selectedIndex ? items.slice(selectedIndex, selectedIndex + 1) : items.slice(0, 1);
    }

    this.callBase(items);

    this._loadNextPageIfNeeded();
  },
  _renderItemsContainer: function _renderItemsContainer() {
    if (this._$container) {
      return;
    }

    this._$container = $('<div>').addClass(GALLERY_ITEM_CONTAINER_CLASS).appendTo(this._$wrapper);
  },
  _cloneDuplicateItems: function _cloneDuplicateItems() {
    if (!this.option('loop')) {
      return;
    }

    var items = this.option('items') || [];
    var itemsCount = items.length;
    var lastItemIndex = itemsCount - 1;
    var i;
    if (!itemsCount) return;

    this._getLoopedItems().remove();

    var duplicateCount = Math.min(this._itemsPerPage(), itemsCount);

    var $items = this._getRealItems();

    var $container = this._itemContainer();

    for (i = 0; i < duplicateCount; i++) {
      this._cloneItemForDuplicate($items[i], $container);
    }

    for (i = 0; i < duplicateCount; i++) {
      this._cloneItemForDuplicate($items[lastItemIndex - i], $container);
    }
  },
  _cloneItemForDuplicate: function _cloneItemForDuplicate(item, $container) {
    if (item) {
      $(item).clone(true).addClass(GALLERY_LOOP_ITEM_CLASS).css('margin', 0).appendTo($container);
    }
  },
  _getRealItems: function _getRealItems() {
    var selector = '.' + GALLERY_ITEM_CLASS + ':not(.' + GALLERY_LOOP_ITEM_CLASS + ')';
    return this.$element().find(selector);
  },
  _getLoopedItems: function _getLoopedItems() {
    return this.$element().find('.' + GALLERY_LOOP_ITEM_CLASS);
  },
  _emptyMessageContainer: function _emptyMessageContainer() {
    return this._$wrapper;
  },
  _renderItemSizes: function _renderItemSizes(startIndex) {
    var $items = this._itemElements();

    var itemWidth = this._actualItemWidth();

    if (startIndex !== undefined) {
      $items = $items.slice(startIndex);
    }

    $items.each(function (index) {
      setOuterWidth($($items[index]), itemWidth * 100 + '%');
    });
  },
  _renderItemPositions: function _renderItemPositions() {
    var itemWidth = this._actualItemWidth();

    var itemsCount = this._itemsCount();

    var itemsPerPage = this._itemsPerPage();

    var loopItemsCount = this.$element().find('.' + GALLERY_LOOP_ITEM_CLASS).length;
    var lastItemDuplicateIndex = itemsCount + loopItemsCount - 1;
    var offsetRatio = this.option('wrapAround') ? 0.5 : 0;

    var freeSpace = this._itemFreeSpace();

    var isGapBetweenImages = !!freeSpace;
    var rtlEnabled = this.option('rtlEnabled');
    var selectedIndex = this.option('selectedIndex');
    var side = rtlEnabled ? 'Right' : 'Left';

    this._itemElements().each(function (index) {
      var realIndex = index;
      var isLoopItem = $(this).hasClass(GALLERY_LOOP_ITEM_CLASS);

      if (index > itemsCount + itemsPerPage - 1) {
        realIndex = lastItemDuplicateIndex - realIndex - itemsPerPage;
      }

      if (!isLoopItem && realIndex !== 0) {
        if (isGapBetweenImages) {
          $(this).css('margin' + side, freeSpace * 100 + '%');
        }

        return;
      }

      var itemPosition = itemWidth * (realIndex + offsetRatio) + freeSpace * (realIndex + 1 - offsetRatio);
      var property = isLoopItem ? side.toLowerCase() : 'margin' + side;
      $(this).css(property, itemPosition * 100 + '%');
    });

    this._relocateItems(selectedIndex, selectedIndex, true);
  },
  _itemFreeSpace: function _itemFreeSpace() {
    var itemsPerPage = this._itemsPerPage();

    if (this.option('wrapAround')) {
      itemsPerPage = itemsPerPage + 1;
    }

    return (1 - this._actualItemWidth() * itemsPerPage) / (itemsPerPage + 1);
  },
  _renderContainerPosition: function _renderContainerPosition(offset, hideItems, animate) {
    this._releaseInvisibleItems();

    offset = offset || 0;
    var that = this;

    var itemWidth = this._actualItemWidth();

    var targetIndex = offset;

    var targetPosition = this._offsetDirection() * targetIndex * (itemWidth + this._itemFreeSpace());

    var positionReady;

    if (isDefined(this._animationOverride)) {
      animate = this._animationOverride;
      delete this._animationOverride;
    }

    if (animate) {
      that._startSwipe();

      positionReady = that._animate(targetPosition).done(that._endSwipe.bind(that));
    } else {
      move(this._$container, {
        left: targetPosition * this._elementWidth(),
        top: 0
      });
      positionReady = new Deferred().resolveWith(that);
    }

    positionReady.done(function () {
      this._deferredAnimate && that._deferredAnimate.resolveWith(that);
      hideItems && this._renderItemVisibility();
    });
    return positionReady.promise();
  },
  _startSwipe: function _startSwipe() {
    this.$element().addClass(GALLERY_ACTIVE_CLASS);
  },
  _endSwipe: function _endSwipe() {
    this.$element().removeClass(GALLERY_ACTIVE_CLASS);
  },
  _animate: function _animate(targetPosition, extraConfig) {
    var that = this;
    var $container = this._$container;
    var animationComplete = new Deferred();
    fx.animate(this._$container, extend({
      type: 'slide',
      to: {
        left: targetPosition * this._elementWidth()
      },
      duration: that.option('animationDuration'),
      complete: function complete() {
        if (that._needMoveContainerForward()) {
          move($container, {
            left: 0,
            top: 0
          });
        }

        if (that._needMoveContainerBack()) {
          move($container, {
            left: that._maxContainerOffset() * that._elementWidth(),
            top: 0
          });
        }

        animationComplete.resolveWith(that);
      }
    }, extraConfig || {}));
    return animationComplete;
  },
  _needMoveContainerForward: function _needMoveContainerForward() {
    var expectedPosition = this._$container.position().left * this._offsetDirection();

    var actualPosition = -this._maxItemWidth() * this._elementWidth() * this._itemsCount();

    return expectedPosition <= actualPosition + MAX_CALC_ERROR;
  },
  _needMoveContainerBack: function _needMoveContainerBack() {
    var expectedPosition = this._$container.position().left * this._offsetDirection();

    var actualPosition = this._actualItemWidth() * this._elementWidth();

    return expectedPosition >= actualPosition - MAX_CALC_ERROR;
  },
  _maxContainerOffset: function _maxContainerOffset() {
    return -this._maxItemWidth() * (this._itemsCount() - this._itemsPerPage()) * this._offsetDirection();
  },
  _maxItemWidth: function _maxItemWidth() {
    return this._actualItemWidth() + this._itemFreeSpace();
  },
  _reviseDimensions: function _reviseDimensions() {
    var that = this;

    var $firstItem = that._itemElements().first().find('.dx-item-content');

    if (!$firstItem || $firstItem.is(':hidden')) {
      return;
    }

    if (!that.option('height')) {
      that.option('height', getOuterHeight($firstItem));
    }

    if (!that.option('width')) {
      that.option('width', getOuterWidth($firstItem));
    }

    this._dimensionChanged();
  },
  _renderIndicator: function _renderIndicator() {
    this._cleanIndicators();

    if (!this.option('showIndicator')) {
      return;
    }

    var indicator = this._$indicator = $('<div>').addClass(GALLERY_INDICATOR_CLASS).appendTo(this._$wrapper);
    var isIndicatorEnabled = this.option('indicatorEnabled');

    for (var i = 0; i < this._pagesCount(); i++) {
      var $indicatorItem = $('<div>').addClass(GALLERY_INDICATOR_ITEM_CLASS).appendTo(indicator);

      if (isIndicatorEnabled) {
        this._attachIndicatorClickHandler($indicatorItem, i);
      }
    }

    this._renderSelectedPageIndicator();
  },
  _attachIndicatorClickHandler: function _attachIndicatorClickHandler($element, index) {
    eventsEngine.on($element, addNamespace(clickEventName, this.NAME), function (event) {
      this._indicatorSelectHandler(event, index);
    }.bind(this));
  },
  _detachIndicatorClickHandler: function _detachIndicatorClickHandler($element) {
    eventsEngine.off($element, addNamespace(clickEventName, this.NAME));
  },
  _toggleIndicatorInteraction: function _toggleIndicatorInteraction(clickEnabled) {
    var _this$_$indicator;

    var $indicatorItems = ((_this$_$indicator = this._$indicator) === null || _this$_$indicator === void 0 ? void 0 : _this$_$indicator.find(GALLERY_INDICATOR_ITEM_SELECTOR)) || [];

    if ($indicatorItems.length) {
      $indicatorItems.each(function (index, element) {
        clickEnabled ? this._attachIndicatorClickHandler($(element), index) : this._detachIndicatorClickHandler($(element));
      }.bind(this));
    }
  },
  _cleanIndicators: function _cleanIndicators() {
    if (this._$indicator) {
      this._$indicator.remove();
    }
  },
  _renderSelectedItem: function _renderSelectedItem() {
    var selectedIndex = this.option('selectedIndex');

    this._itemElements().removeClass(GALLERY_ITEM_SELECTED_CLASS).eq(selectedIndex).addClass(GALLERY_ITEM_SELECTED_CLASS);
  },
  _renderItemVisibility: function _renderItemVisibility() {
    if (this.option('initialItemWidth') || this.option('wrapAround')) {
      this._releaseInvisibleItems();

      return;
    }

    this._itemElements().each(function (index, item) {
      if (this.option('selectedIndex') === index) {
        $(item).removeClass(GALLERY_INVISIBLE_ITEM_CLASS);
      } else {
        $(item).addClass(GALLERY_INVISIBLE_ITEM_CLASS);
      }
    }.bind(this));

    this._getLoopedItems().addClass(GALLERY_INVISIBLE_ITEM_CLASS);
  },
  _releaseInvisibleItems: function _releaseInvisibleItems() {
    this._itemElements().removeClass(GALLERY_INVISIBLE_ITEM_CLASS);

    this._getLoopedItems().removeClass(GALLERY_INVISIBLE_ITEM_CLASS);
  },
  _renderSelectedPageIndicator: function _renderSelectedPageIndicator() {
    if (!this._$indicator) {
      return;
    }

    var itemIndex = this.option('selectedIndex');
    var lastIndex = this._pagesCount() - 1;
    var pageIndex = Math.ceil(itemIndex / this._itemsPerPage());
    pageIndex = Math.min(lastIndex, pageIndex);

    this._$indicator.find(GALLERY_INDICATOR_ITEM_SELECTOR).removeClass(GALLERY_INDICATOR_ITEM_SELECTED_CLASS).eq(pageIndex).addClass(GALLERY_INDICATOR_ITEM_SELECTED_CLASS);
  },
  _renderUserInteraction: function _renderUserInteraction() {
    var rootElement = this.$element();
    var swipeEnabled = this.option('swipeEnabled') && this._itemsCount() > 1;

    this._createComponent(rootElement, Swipeable, {
      disabled: this.option('disabled') || !swipeEnabled,
      onStart: this._swipeStartHandler.bind(this),
      onUpdated: this._swipeUpdateHandler.bind(this),
      onEnd: this._swipeEndHandler.bind(this),
      itemSizeFunc: this._elementWidth.bind(this)
    });
  },
  _indicatorSelectHandler: function _indicatorSelectHandler(e, indicatorIndex) {
    if (!this.option('indicatorEnabled')) {
      return;
    }

    var itemIndex = this._fitPaginatedIndex(indicatorIndex * this._itemsPerPage());

    this._needLongMove = true;
    this.option('selectedIndex', itemIndex);

    this._loadNextPageIfNeeded(itemIndex);
  },
  _renderNavButtons: function _renderNavButtons() {
    var that = this;

    if (!that.option('showNavButtons')) {
      that._cleanNavButtons();

      return;
    }

    that._prevNavButton = $('<div>').appendTo(this._$wrapper);

    that._createComponent(that._prevNavButton, GalleryNavButton, {
      direction: 'prev',
      onClick: function onClick() {
        that._prevPage();
      }
    });

    that._nextNavButton = $('<div>').appendTo(this._$wrapper);

    that._createComponent(that._nextNavButton, GalleryNavButton, {
      direction: 'next',
      onClick: function onClick() {
        that._nextPage();
      }
    });

    this._renderNavButtonsVisibility();
  },
  _prevPage: function _prevPage() {
    var visiblePageSize = this._itemsPerPage();

    var newSelectedIndex = this.option('selectedIndex') - visiblePageSize;

    if (newSelectedIndex === -visiblePageSize && visiblePageSize === this._itemsCount()) {
      return this._relocateItems(newSelectedIndex, 0);
    } else {
      return this.goToItem(this._fitPaginatedIndex(newSelectedIndex));
    }
  },
  _nextPage: function _nextPage() {
    var visiblePageSize = this._itemsPerPage();

    var newSelectedIndex = this.option('selectedIndex') + visiblePageSize;

    if (newSelectedIndex === visiblePageSize && visiblePageSize === this._itemsCount()) {
      return this._relocateItems(newSelectedIndex, 0);
    } else {
      return this.goToItem(this._fitPaginatedIndex(newSelectedIndex)).done(this._loadNextPageIfNeeded);
    }
  },
  _loadNextPageIfNeeded: function _loadNextPageIfNeeded(selectedIndex) {
    selectedIndex = selectedIndex === undefined ? this.option('selectedIndex') : selectedIndex;

    if (this._dataSource && this._dataSource.paginate() && this._shouldLoadNextPage(selectedIndex) && !this._isDataSourceLoading() && !this._isLastPage()) {
      this._loadNextPage().done(function () {
        this._renderIndicator();

        this._cloneDuplicateItems();

        this._renderItemPositions();

        this._renderNavButtonsVisibility();

        this._renderItemSizes(selectedIndex);
      }.bind(this));
    }
  },
  _shouldLoadNextPage: function _shouldLoadNextPage(selectedIndex) {
    var visiblePageSize = this._itemsPerPage();

    return selectedIndex + 2 * visiblePageSize > this.option('items').length;
  },
  _allowDynamicItemsAppend: function _allowDynamicItemsAppend() {
    return true;
  },
  _fitPaginatedIndex: function _fitPaginatedIndex(itemIndex) {
    var itemsPerPage = this._itemsPerPage();

    var restItemsCount = itemIndex < 0 ? itemsPerPage + itemIndex : this._itemsCount() - itemIndex;

    if (itemIndex > this._itemsCount() - 1) {
      itemIndex = 0;
      this._goToGhostItem = true;
    } else if (restItemsCount < itemsPerPage && restItemsCount > 0) {
      if (itemIndex > 0) {
        itemIndex = itemIndex - (itemsPerPage - restItemsCount);
      } else {
        itemIndex = itemIndex + (itemsPerPage - restItemsCount);
      }
    }

    return itemIndex;
  },
  _cleanNavButtons: function _cleanNavButtons() {
    if (this._prevNavButton) {
      this._prevNavButton.remove();

      delete this._prevNavButton;
    }

    if (this._nextNavButton) {
      this._nextNavButton.remove();

      delete this._nextNavButton;
    }
  },
  _renderNavButtonsVisibility: function _renderNavButtonsVisibility() {
    if (!this.option('showNavButtons') || !this._prevNavButton || !this._nextNavButton) {
      return;
    }

    var selectedIndex = this.option('selectedIndex');
    var loop = this.option('loop');

    var itemsCount = this._itemsCount();

    this._prevNavButton.show();

    this._nextNavButton.show();

    if (itemsCount === 0) {
      this._prevNavButton.hide();

      this._nextNavButton.hide();
    }

    if (loop) {
      return;
    }

    var nextHidden = selectedIndex === itemsCount - this._itemsPerPage();

    var prevHidden = itemsCount < 2 || selectedIndex === 0;

    if (this._dataSource && this._dataSource.paginate()) {
      nextHidden = nextHidden && this._isLastPage();
    } else {
      nextHidden = nextHidden || itemsCount < 2;
    }

    if (prevHidden) {
      this._prevNavButton.hide();
    }

    if (nextHidden) {
      this._nextNavButton.hide();
    }
  },
  _setupSlideShow: function _setupSlideShow() {
    var that = this;
    var slideshowDelay = that.option('slideshowDelay');
    clearTimeout(that._slideshowTimer);

    if (!slideshowDelay) {
      return;
    }

    that._slideshowTimer = setTimeout(function () {
      if (that._userInteraction) {
        that._setupSlideShow();

        return;
      }

      that.nextItem(true).done(that._setupSlideShow);
    }, slideshowDelay);
  },
  _elementWidth: function _elementWidth() {
    if (!this._cacheElementWidth) {
      this._cacheElementWidth = getWidth(this.$element());
    }

    return this._cacheElementWidth;
  },
  _clearCacheWidth: function _clearCacheWidth() {
    delete this._cacheElementWidth;
  },
  _swipeStartHandler: function _swipeStartHandler(e) {
    this._releaseInvisibleItems();

    this._clearCacheWidth();

    this._elementWidth();

    var itemsCount = this._itemsCount();

    if (!itemsCount) {
      e.event.cancel = true;
      return;
    }

    this._stopItemAnimations();

    this._startSwipe();

    this._userInteraction = true;

    if (!this.option('loop')) {
      var selectedIndex = this.option('selectedIndex');

      var startOffset = itemsCount - selectedIndex - this._itemsPerPage();

      var endOffset = selectedIndex;
      var rtlEnabled = this.option('rtlEnabled');
      e.event.maxLeftOffset = rtlEnabled ? endOffset : startOffset;
      e.event.maxRightOffset = rtlEnabled ? startOffset : endOffset;
    }
  },
  _stopItemAnimations: function _stopItemAnimations() {
    fx.stop(this._$container, true);
  },
  _swipeUpdateHandler: function _swipeUpdateHandler(e) {
    var wrapAroundRatio = this.option('wrapAround') ? 1 : 0;
    var offset = this._offsetDirection() * e.event.offset * (this._itemsPerPage() + wrapAroundRatio) - this.option('selectedIndex');

    if (offset < 0) {
      this._loadNextPageIfNeeded(Math.ceil(Math.abs(offset)));
    }

    this._renderContainerPosition(offset);
  },
  _swipeEndHandler: function _swipeEndHandler(e) {
    var targetOffset = e.event.targetOffset * this._offsetDirection() * this._itemsPerPage();

    var selectedIndex = this.option('selectedIndex');

    var newIndex = this._fitIndex(selectedIndex - targetOffset);

    var paginatedIndex = this._fitPaginatedIndex(newIndex);

    if (Math.abs(targetOffset) < this._itemsPerPage()) {
      this._relocateItems(selectedIndex);

      return;
    }

    if (this._itemsPerPage() === this._itemsCount()) {
      if (targetOffset > 0) {
        this._relocateItems(-targetOffset);
      } else {
        this._relocateItems(0);
      }

      return;
    }

    this.option('selectedIndex', paginatedIndex);
  },
  _setFocusOnSelect: function _setFocusOnSelect() {
    this._userInteraction = true;
    var selectedItem = this.itemElements().filter('.' + GALLERY_ITEM_SELECTED_CLASS);
    this.option('focusedElement', getPublicElement(selectedItem));
    this._userInteraction = false;
  },
  _flipIndex: function _flipIndex(index) {
    var itemsCount = this._itemsCount();

    index = index % itemsCount;

    if (index > (itemsCount + 1) / 2) {
      index -= itemsCount;
    }

    if (index < -(itemsCount - 1) / 2) {
      index += itemsCount;
    }

    return index;
  },
  _fitIndex: function _fitIndex(index) {
    if (!this.option('loop')) {
      return index;
    }

    var itemsCount = this._itemsCount();

    if (index >= itemsCount || index < 0) {
      this._goToGhostItem = true;
    }

    if (index >= itemsCount) {
      index = itemsCount - index;
    }

    index = index % itemsCount;

    if (index < 0) {
      index += itemsCount;
    }

    return index;
  },
  _clean: function _clean() {
    this.callBase();

    this._cleanIndicators();

    this._cleanNavButtons();
  },
  _dispose: function _dispose() {
    clearTimeout(this._slideshowTimer);
    this.callBase();
  },
  _updateSelection: function _updateSelection(addedSelection, removedSelection) {
    this._stopItemAnimations();

    this._renderNavButtonsVisibility();

    this._renderSelectedItem();

    this._relocateItems(addedSelection[0], removedSelection[0]);

    this._renderSelectedPageIndicator();
  },
  _relocateItems: function _relocateItems(newIndex, prevIndex, withoutAnimation) {
    if (prevIndex === undefined) {
      prevIndex = newIndex;
    }

    var indexOffset = this._calculateIndexOffset(newIndex, prevIndex);

    this._renderContainerPosition(indexOffset, true, this.option('animationEnabled') && !withoutAnimation).done(function () {
      this._setFocusOnSelect();

      this._userInteraction = false;

      this._setupSlideShow();
    });
  },
  _focusInHandler: function _focusInHandler() {
    if (fx.isAnimating(this._$container) || this._userInteraction) {
      return;
    }

    this.callBase.apply(this, arguments);
  },
  _focusOutHandler: function _focusOutHandler() {
    if (fx.isAnimating(this._$container) || this._userInteraction) {
      return;
    }

    this.callBase.apply(this, arguments);
  },
  _selectFocusedItem: noop,
  _moveFocus: function _moveFocus() {
    this._stopItemAnimations();

    this.callBase.apply(this, arguments);
    var index = this.itemElements().index($(this.option('focusedElement')));
    this.goToItem(index, this.option('animationEnabled'));
  },
  _visibilityChanged: function _visibilityChanged(visible) {
    if (visible) {
      this._reviseDimensions();
    }
  },
  _calculateIndexOffset: function _calculateIndexOffset(newIndex, lastIndex) {
    if (lastIndex === undefined) {
      lastIndex = newIndex;
    }

    var indexOffset = lastIndex - newIndex;

    if (this.option('loop') && !this._needLongMove && this._goToGhostItem) {
      if (this._isItemOnFirstPage(newIndex) && this._isItemOnLastPage(lastIndex)) {
        indexOffset = -this._itemsPerPage();
      } else if (this._isItemOnLastPage(newIndex) && this._isItemOnFirstPage(lastIndex)) {
        indexOffset = this._itemsPerPage();
      }

      this._goToGhostItem = false;
    }

    this._needLongMove = false;
    indexOffset = indexOffset - lastIndex;
    return indexOffset;
  },
  _isItemOnLastPage: function _isItemOnLastPage(itemIndex) {
    return itemIndex >= this._itemsCount() - this._itemsPerPage();
  },
  _isItemOnFirstPage: function _isItemOnFirstPage(itemIndex) {
    return itemIndex <= this._itemsPerPage();
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'width':
      case 'initialItemWidth':
        this.callBase.apply(this, arguments);

        this._dimensionChanged();

        break;

      case 'animationDuration':
        this._renderNavButtonsVisibility();

        break;

      case 'animationEnabled':
        break;

      case 'loop':
        this.$element().toggleClass(GALLERY_LOOP_CLASS, args.value);
        this.option('loopItemFocus', args.value);

        if (hasWindow()) {
          this._cloneDuplicateItems();

          this._renderItemPositions();

          this._renderNavButtonsVisibility();
        }

        break;

      case 'showIndicator':
        this._renderIndicator();

        break;

      case 'showNavButtons':
        this._renderNavButtons();

        break;

      case 'slideshowDelay':
        this._setupSlideShow();

        break;

      case 'wrapAround':
      case 'stretchImages':
        if (hasWindow()) {
          this._renderItemSizes();

          this._renderItemPositions();

          this._renderItemVisibility();
        }

        break;

      case 'swipeEnabled':
        this._renderUserInteraction();

        break;

      case 'indicatorEnabled':
        this._toggleIndicatorInteraction(args.value);

        break;

      default:
        this.callBase(args);
    }
  },
  goToItem: function goToItem(itemIndex, animation) {
    var selectedIndex = this.option('selectedIndex');

    var itemsCount = this._itemsCount();

    if (animation !== undefined) {
      this._animationOverride = animation;
    }

    itemIndex = this._fitIndex(itemIndex);
    this._deferredAnimate = new Deferred();

    if (itemIndex > itemsCount - 1 || itemIndex < 0 || selectedIndex === itemIndex) {
      return this._deferredAnimate.resolveWith(this).promise();
    }

    this.option('selectedIndex', itemIndex);
    return this._deferredAnimate.promise();
  },
  prevItem: function prevItem(animation) {
    return this.goToItem(this.option('selectedIndex') - 1, animation);
  },
  nextItem: function nextItem(animation) {
    return this.goToItem(this.option('selectedIndex') + 1, animation);
  }
});
registerComponent('dxGallery', Gallery);
export default Gallery;
/**
 * @name dxGalleryItem
 * @type object
 * @inherits CollectionWidgetItem
 */