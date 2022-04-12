import { getOuterWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { ensureDefined, deferRenderer, noop } from '../../core/utils/common';
import { findTemplates } from '../../core/utils/template_manager';
import { getPublicElement } from '../../core/element';
import domAdapter from '../../core/dom_adapter';
import { isPlainObject, isFunction, isDefined } from '../../core/utils/type';
import { when } from '../../core/utils/deferred';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import { each } from '../../core/utils/iterator';
import Action from '../../core/action';
import Guid from '../../core/guid';
import Widget from '../widget/ui.widget';
import { addNamespace, isCommandKeyPressed } from '../../events/utils/index';
import pointerEvents from '../../events/pointer';
import DataHelperMixin from '../../data_helper';
import CollectionWidgetItem from './item';
import { focusable } from '../widget/selectors';
import messageLocalization from '../../localization/message';
import holdEvent from '../../events/hold';
import { compileGetter } from '../../core/utils/data';
import { name as clickEventName } from '../../events/click';
import { name as contextMenuEventName } from '../../events/contextmenu';
import { BindableTemplate } from '../../core/templates/bindable_template';
var COLLECTION_CLASS = 'dx-collection';
var ITEM_CLASS = 'dx-item';
var CONTENT_CLASS_POSTFIX = '-content';
var ITEM_CONTENT_PLACEHOLDER_CLASS = 'dx-item-content-placeholder';
var ITEM_DATA_KEY = 'dxItemData';
var ITEM_INDEX_KEY = 'dxItemIndex';
var ITEM_TEMPLATE_ID_PREFIX = 'tmpl-';
var ITEMS_OPTIONS_NAME = 'dxItem';
var SELECTED_ITEM_CLASS = 'dx-item-selected';
var ITEM_RESPONSE_WAIT_CLASS = 'dx-item-response-wait';
var EMPTY_COLLECTION = 'dx-empty-collection';
var TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';
var ITEM_PATH_REGEX = /^([^.]+\[\d+\]\.)+([\w.]+)$/;
var ANONYMOUS_TEMPLATE_NAME = 'item';
var FOCUS_UP = 'up';
var FOCUS_DOWN = 'down';
var FOCUS_LEFT = 'left';
var FOCUS_RIGHT = 'right';
var FOCUS_PAGE_UP = 'pageup';
var FOCUS_PAGE_DOWN = 'pagedown';
var FOCUS_LAST = 'last';
var FOCUS_FIRST = 'first';
var CollectionWidget = Widget.inherit({
  _activeStateUnit: '.' + ITEM_CLASS,
  _supportedKeys: function _supportedKeys() {
    var enter = function enter(e) {
      var $itemElement = $(this.option('focusedElement'));

      if (!$itemElement.length) {
        return;
      }

      this._itemClickHandler(extend({}, e, {
        target: $itemElement.get(0),
        currentTarget: $itemElement.get(0)
      }));
    };

    var space = function space(e) {
      e.preventDefault();
      enter.call(this, e);
    };

    var move = function move(location, e) {
      if (!isCommandKeyPressed(e)) {
        e.preventDefault();
        e.stopPropagation();

        this._moveFocus(location, e);
      }
    };

    return extend(this.callBase(), {
      space: space,
      enter: enter,
      leftArrow: move.bind(this, FOCUS_LEFT),
      rightArrow: move.bind(this, FOCUS_RIGHT),
      upArrow: move.bind(this, FOCUS_UP),
      downArrow: move.bind(this, FOCUS_DOWN),
      pageUp: move.bind(this, FOCUS_UP),
      pageDown: move.bind(this, FOCUS_DOWN),
      home: move.bind(this, FOCUS_FIRST),
      end: move.bind(this, FOCUS_LAST)
    });
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      /**
      * @name CollectionWidgetOptions.selectOnFocus
      * @type boolean
      * @hidden
      */
      selectOnFocus: false,

      /**
      * @name CollectionWidgetOptions.loopItemFocus
      * @type boolean
      * @hidden
      */
      loopItemFocus: true,
      items: [],
      itemTemplate: 'item',
      onItemRendered: null,
      onItemClick: null,
      onItemHold: null,
      itemHoldTimeout: 750,
      onItemContextMenu: null,
      onFocusedItemChanged: null,
      noDataText: messageLocalization.format('dxCollectionWidget-noDataText'),
      dataSource: null,
      _itemAttributes: {},
      itemTemplateProperty: 'template',
      focusOnSelectedItem: true,

      /**
      * @name CollectionWidgetOptions.focusedElement
      * @type DxElement
      * @default null
      * @hidden
      */
      focusedElement: null,
      displayExpr: undefined,
      disabledExpr: function disabledExpr(data) {
        return data ? data.disabled : undefined;
      },
      visibleExpr: function visibleExpr(data) {
        return data ? data.visible : undefined;
      }
    });
  },
  _init: function _init() {
    this._compileDisplayGetter();

    this.callBase();

    this._cleanRenderedItems();

    this._refreshDataSource();
  },
  _compileDisplayGetter: function _compileDisplayGetter() {
    var displayExpr = this.option('displayExpr');
    this._displayGetter = displayExpr ? compileGetter(this.option('displayExpr')) : undefined;
  },
  _initTemplates: function _initTemplates() {
    this._initItemsFromMarkup();

    this._initDefaultItemTemplate();

    this.callBase();
  },
  _getAnonymousTemplateName: function _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },
  _initDefaultItemTemplate: function _initDefaultItemTemplate() {
    var fieldsMap = this._getFieldsMap();

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(function ($container, data) {
        if (isPlainObject(data)) {
          this._prepareDefaultItemTemplate(data, $container);
        } else {
          if (fieldsMap && isFunction(fieldsMap.text)) {
            data = fieldsMap.text(data);
          }

          $container.text(String(ensureDefined(data, '')));
        }
      }.bind(this), this._getBindableFields(), this.option('integrationOptions.watchMethod'), fieldsMap)
    });
  },
  _getBindableFields: function _getBindableFields() {
    return ['text', 'html'];
  },
  _getFieldsMap: function _getFieldsMap() {
    if (this._displayGetter) {
      return {
        text: this._displayGetter
      };
    }
  },
  _prepareDefaultItemTemplate: function _prepareDefaultItemTemplate(data, $container) {
    if (isDefined(data.text)) {
      $container.text(data.text);
    }

    if (isDefined(data.html)) {
      $container.html(data.html);
    }
  },
  _initItemsFromMarkup: function _initItemsFromMarkup() {
    var rawItems = findTemplates(this.$element(), ITEMS_OPTIONS_NAME);

    if (!rawItems.length || this.option('items').length) {
      return;
    }

    var items = rawItems.map(_ref => {
      var {
        element,
        options
      } = _ref;
      var isTemplateRequired = /\S/.test(element.innerHTML) && !options.template;

      if (isTemplateRequired) {
        options.template = this._prepareItemTemplate(element);
      } else {
        $(element).remove();
      }

      return options;
    });
    this.option('items', items);
  },
  _prepareItemTemplate: function _prepareItemTemplate(item) {
    var templateId = ITEM_TEMPLATE_ID_PREFIX + new Guid();
    var $template = $(item).detach().clone().removeAttr('data-options').addClass(TEMPLATE_WRAPPER_CLASS);

    this._saveTemplate(templateId, $template);

    return templateId;
  },
  _dataSourceOptions: function _dataSourceOptions() {
    return {
      paginate: false
    };
  },
  _cleanRenderedItems: function _cleanRenderedItems() {
    this._renderedItemsCount = 0;
  },
  _focusTarget: function _focusTarget() {
    return this.$element();
  },
  _focusInHandler: function _focusInHandler(e) {
    this.callBase.apply(this, arguments);

    if (inArray(e.target, this._focusTarget()) === -1) {
      return;
    }

    var $focusedElement = $(this.option('focusedElement'));

    if ($focusedElement.length) {
      this._setFocusedItem($focusedElement);
    } else {
      var $activeItem = this._getActiveItem();

      if ($activeItem.length) {
        this.option('focusedElement', getPublicElement($activeItem));
      }
    }
  },
  _focusOutHandler: function _focusOutHandler() {
    this.callBase.apply(this, arguments);
    var $target = $(this.option('focusedElement'));

    this._updateFocusedItemState($target, false);
  },
  _getActiveItem: function _getActiveItem(last) {
    var $focusedElement = $(this.option('focusedElement'));

    if ($focusedElement.length) {
      return $focusedElement;
    }

    var index = this.option('focusOnSelectedItem') ? this.option('selectedIndex') : 0;

    var activeElements = this._getActiveElement();

    var lastIndex = activeElements.length - 1;

    if (index < 0) {
      index = last ? lastIndex : 0;
    }

    return activeElements.eq(index);
  },
  _moveFocus: function _moveFocus(location) {
    var $items = this._getAvailableItems();

    var $newTarget;

    switch (location) {
      case FOCUS_PAGE_UP:
      case FOCUS_UP:
        $newTarget = this._prevItem($items);
        break;

      case FOCUS_PAGE_DOWN:
      case FOCUS_DOWN:
        $newTarget = this._nextItem($items);
        break;

      case FOCUS_RIGHT:
        $newTarget = this.option('rtlEnabled') ? this._prevItem($items) : this._nextItem($items);
        break;

      case FOCUS_LEFT:
        $newTarget = this.option('rtlEnabled') ? this._nextItem($items) : this._prevItem($items);
        break;

      case FOCUS_FIRST:
        $newTarget = $items.first();
        break;

      case FOCUS_LAST:
        $newTarget = $items.last();
        break;

      default:
        return false;
    }

    if ($newTarget.length !== 0) {
      this.option('focusedElement', getPublicElement($newTarget));
    }
  },
  _getVisibleItems: function _getVisibleItems($itemElements) {
    $itemElements = $itemElements || this._itemElements();
    return $itemElements.filter(':visible');
  },
  _getAvailableItems: function _getAvailableItems($itemElements) {
    return this._getVisibleItems($itemElements).not('.dx-state-disabled');
  },
  _prevItem: function _prevItem($items) {
    var $target = this._getActiveItem();

    var targetIndex = $items.index($target);
    var $last = $items.last();
    var $item = $($items[targetIndex - 1]);
    var loop = this.option('loopItemFocus');

    if ($item.length === 0 && loop) {
      $item = $last;
    }

    return $item;
  },
  _nextItem: function _nextItem($items) {
    var $target = this._getActiveItem(true);

    var targetIndex = $items.index($target);
    var $first = $items.first();
    var $item = $($items[targetIndex + 1]);
    var loop = this.option('loopItemFocus');

    if ($item.length === 0 && loop) {
      $item = $first;
    }

    return $item;
  },
  _selectFocusedItem: function _selectFocusedItem($target) {
    this.selectItem($target);
  },
  _updateFocusedItemState: function _updateFocusedItemState(target, isFocused, needCleanItemId) {
    var $target = $(target);

    if ($target.length) {
      this._refreshActiveDescendant();

      this._refreshItemId($target, needCleanItemId);

      this._toggleFocusClass(isFocused, $target);
    }

    this._updateParentActiveDescendant();
  },
  _refreshActiveDescendant: function _refreshActiveDescendant($target) {
    this.setAria('activedescendant', isDefined(this.option('focusedElement')) ? this.getFocusedItemId() : null, $target);
  },
  _refreshItemId: function _refreshItemId($target, needCleanItemId) {
    if (!needCleanItemId && this.option('focusedElement')) {
      this.setAria('id', this.getFocusedItemId(), $target);
    } else {
      this.setAria('id', null, $target);
    }
  },
  _setFocusedItem: function _setFocusedItem($target) {
    if (!$target || !$target.length) {
      return;
    }

    this._updateFocusedItemState($target, true);

    this.onFocusedItemChanged(this.getFocusedItemId());

    if (this.option('selectOnFocus')) {
      this._selectFocusedItem($target);
    }
  },
  _findItemElementByItem: function _findItemElementByItem(item) {
    var result = $();
    var that = this;
    this.itemElements().each(function () {
      var $item = $(this);

      if ($item.data(that._itemDataKey()) === item) {
        result = $item;
        return false;
      }
    });
    return result;
  },
  _getIndexByItem: function _getIndexByItem(item) {
    return this.option('items').indexOf(item);
  },
  _itemOptionChanged: function _itemOptionChanged(item, property, value, oldValue) {
    var $item = this._findItemElementByItem(item);

    if (!$item.length) {
      return;
    }

    if (!this.constructor.ItemClass.getInstance($item).setDataField(property, value)) {
      this._refreshItem($item, item);
    }

    var isDisabling = property === 'disabled' && value;

    if (isDisabling) {
      this._resetItemFocus($item);
    }
  },

  _resetItemFocus($item) {
    if ($item.is(this.option('focusedElement'))) {
      this.option('focusedElement', null);
    }
  },

  _refreshItem: function _refreshItem($item) {
    var itemData = this._getItemData($item);

    var index = $item.data(this._itemIndexKey());

    this._renderItem(this._renderedItemsCount + index, itemData, null, $item);
  },
  _updateParentActiveDescendant: noop,
  _optionChanged: function _optionChanged(args) {
    if (args.name === 'items') {
      var matches = args.fullName.match(ITEM_PATH_REGEX);

      if (matches && matches.length) {
        var property = matches[matches.length - 1];
        var itemPath = args.fullName.replace('.' + property, '');
        var item = this.option(itemPath);

        this._itemOptionChanged(item, property, args.value, args.previousValue);

        return;
      }
    }

    switch (args.name) {
      case 'items':
      case '_itemAttributes':
      case 'itemTemplateProperty':
      case 'useItemTextAsTitle':
        this._cleanRenderedItems();

        this._invalidate();

        break;

      case 'dataSource':
        this._refreshDataSource();

        this._renderEmptyMessage();

        break;

      case 'noDataText':
        this._renderEmptyMessage();

        break;

      case 'itemTemplate':
        this._invalidate();

        break;

      case 'onItemRendered':
        this._createItemRenderAction();

        break;

      case 'onItemClick':
        break;

      case 'onItemHold':
      case 'itemHoldTimeout':
        this._attachHoldEvent();

        break;

      case 'onItemContextMenu':
        this._attachContextMenuEvent();

        break;

      case 'onFocusedItemChanged':
        this.onFocusedItemChanged = this._createActionByOption('onFocusedItemChanged');
        break;

      case 'selectOnFocus':
      case 'loopItemFocus':
      case 'focusOnSelectedItem':
        break;

      case 'focusedElement':
        this._updateFocusedItemState(args.previousValue, false, true);

        this._setFocusedItem($(args.value));

        break;

      case 'displayExpr':
        this._compileDisplayGetter();

        this._initDefaultItemTemplate();

        this._invalidate();

        break;

      case 'visibleExpr':
      case 'disabledExpr':
        this._invalidate();

        break;

      default:
        this.callBase(args);
    }
  },
  _invalidate: function _invalidate() {
    this.option('focusedElement', null);
    return this.callBase.apply(this, arguments);
  },
  _loadNextPage: function _loadNextPage() {
    var dataSource = this._dataSource;

    this._expectNextPageLoading();

    dataSource.pageIndex(1 + dataSource.pageIndex());
    return dataSource.load();
  },
  _expectNextPageLoading: function _expectNextPageLoading() {
    this._startIndexForAppendedItems = 0;
  },
  _expectLastItemLoading: function _expectLastItemLoading() {
    this._startIndexForAppendedItems = -1;
  },
  _forgetNextPageLoading: function _forgetNextPageLoading() {
    this._startIndexForAppendedItems = null;
  },
  _dataSourceChangedHandler: function _dataSourceChangedHandler(newItems) {
    var items = this.option('items');

    if (this._initialized && items && this._shouldAppendItems()) {
      this._renderedItemsCount = items.length;

      if (!this._isLastPage() || this._startIndexForAppendedItems !== -1) {
        this.option().items = items.concat(newItems.slice(this._startIndexForAppendedItems));
      }

      this._forgetNextPageLoading();

      this._refreshContent();
    } else {
      this.option('items', newItems.slice());
    }
  },
  _refreshContent: function _refreshContent() {
    this._prepareContent();

    this._renderContent();
  },
  _dataSourceLoadErrorHandler: function _dataSourceLoadErrorHandler() {
    this._forgetNextPageLoading();

    this.option('items', this.option('items'));
  },
  _shouldAppendItems: function _shouldAppendItems() {
    return this._startIndexForAppendedItems != null && this._allowDynamicItemsAppend();
  },
  _allowDynamicItemsAppend: function _allowDynamicItemsAppend() {
    return false;
  },
  _clean: function _clean() {
    this._cleanFocusState();

    this._cleanItemContainer();
  },
  _cleanItemContainer: function _cleanItemContainer() {
    $(this._itemContainer()).empty();
  },
  _dispose: function _dispose() {
    this.callBase();
    clearTimeout(this._itemFocusTimeout);
  },
  _refresh: function _refresh() {
    this._cleanRenderedItems();

    this.callBase.apply(this, arguments);
  },
  _itemContainer: function _itemContainer() {
    return this.$element();
  },
  _itemClass: function _itemClass() {
    return ITEM_CLASS;
  },
  _itemContentClass: function _itemContentClass() {
    return this._itemClass() + CONTENT_CLASS_POSTFIX;
  },
  _selectedItemClass: function _selectedItemClass() {
    return SELECTED_ITEM_CLASS;
  },
  _itemResponseWaitClass: function _itemResponseWaitClass() {
    return ITEM_RESPONSE_WAIT_CLASS;
  },
  _itemSelector: function _itemSelector() {
    return '.' + this._itemClass();
  },
  _itemDataKey: function _itemDataKey() {
    return ITEM_DATA_KEY;
  },
  _itemIndexKey: function _itemIndexKey() {
    return ITEM_INDEX_KEY;
  },
  _itemElements: function _itemElements() {
    return this._itemContainer().find(this._itemSelector());
  },
  _initMarkup: function _initMarkup() {
    this.callBase();
    this.onFocusedItemChanged = this._createActionByOption('onFocusedItemChanged');
    this.$element().addClass(COLLECTION_CLASS);

    this._prepareContent();
  },
  _prepareContent: deferRenderer(function () {
    this._renderContentImpl();
  }),
  _renderContent: function _renderContent() {
    this._fireContentReadyAction();
  },
  _render: function _render() {
    this.callBase();

    this._attachClickEvent();

    this._attachHoldEvent();

    this._attachContextMenuEvent();
  },
  _attachClickEvent: function _attachClickEvent() {
    var itemSelector = this._itemSelector();

    var clickEventNamespace = addNamespace(clickEventName, this.NAME);
    var pointerDownEventNamespace = addNamespace(pointerEvents.down, this.NAME);
    var that = this;
    var pointerDownAction = new Action(function (args) {
      var event = args.event;

      that._itemPointerDownHandler(event);
    });
    eventsEngine.off(this._itemContainer(), clickEventNamespace, itemSelector);
    eventsEngine.off(this._itemContainer(), pointerDownEventNamespace, itemSelector);
    eventsEngine.on(this._itemContainer(), clickEventNamespace, itemSelector, function (e) {
      this._itemClickHandler(e);
    }.bind(this));
    eventsEngine.on(this._itemContainer(), pointerDownEventNamespace, itemSelector, function (e) {
      pointerDownAction.execute({
        element: $(e.target),
        event: e
      });
    });
  },
  _itemClickHandler: function _itemClickHandler(e, args, config) {
    this._itemDXEventHandler(e, 'onItemClick', args, config);
  },
  _itemPointerDownHandler: function _itemPointerDownHandler(e) {
    if (!this.option('focusStateEnabled')) {
      return;
    }

    this._itemFocusHandler = function () {
      clearTimeout(this._itemFocusTimeout);
      this._itemFocusHandler = null;

      if (e.isDefaultPrevented()) {
        return;
      }

      var $target = $(e.target);
      var $closestItem = $target.closest(this._itemElements());

      var $closestFocusable = this._closestFocusable($target);

      if ($closestItem.length && $closestFocusable && inArray($closestFocusable.get(0), this._focusTarget()) !== -1) {
        this.option('focusedElement', getPublicElement($closestItem));
      }
    }.bind(this);

    this._itemFocusTimeout = setTimeout(this._forcePointerDownFocus.bind(this));
  },
  _closestFocusable: function _closestFocusable($target) {
    if ($target.is(focusable)) {
      return $target;
    } else {
      $target = $target.parent();

      while ($target.length && !domAdapter.isDocument($target.get(0))) {
        if ($target.is(focusable)) {
          return $target;
        }

        $target = $target.parent();
      }
    }
  },
  _forcePointerDownFocus: function _forcePointerDownFocus() {
    this._itemFocusHandler && this._itemFocusHandler();
  },
  _updateFocusState: function _updateFocusState() {
    this.callBase.apply(this, arguments);

    this._forcePointerDownFocus();
  },
  _attachHoldEvent: function _attachHoldEvent() {
    var $itemContainer = this._itemContainer();

    var itemSelector = this._itemSelector();

    var eventName = addNamespace(holdEvent.name, this.NAME);
    eventsEngine.off($itemContainer, eventName, itemSelector);
    eventsEngine.on($itemContainer, eventName, itemSelector, {
      timeout: this._getHoldTimeout()
    }, this._itemHoldHandler.bind(this));
  },
  _getHoldTimeout: function _getHoldTimeout() {
    return this.option('itemHoldTimeout');
  },
  _shouldFireHoldEvent: function _shouldFireHoldEvent() {
    return this.hasActionSubscription('onItemHold');
  },
  _itemHoldHandler: function _itemHoldHandler(e) {
    if (this._shouldFireHoldEvent()) {
      this._itemDXEventHandler(e, 'onItemHold');
    } else {
      e.cancel = true;
    }
  },
  _attachContextMenuEvent: function _attachContextMenuEvent() {
    var $itemContainer = this._itemContainer();

    var itemSelector = this._itemSelector();

    var eventName = addNamespace(contextMenuEventName, this.NAME);
    eventsEngine.off($itemContainer, eventName, itemSelector);
    eventsEngine.on($itemContainer, eventName, itemSelector, this._itemContextMenuHandler.bind(this));
  },
  _shouldFireContextMenuEvent: function _shouldFireContextMenuEvent() {
    return this.hasActionSubscription('onItemContextMenu');
  },
  _itemContextMenuHandler: function _itemContextMenuHandler(e) {
    if (this._shouldFireContextMenuEvent()) {
      this._itemDXEventHandler(e, 'onItemContextMenu');
    } else {
      e.cancel = true;
    }
  },
  _renderContentImpl: function _renderContentImpl() {
    var items = this.option('items') || [];

    if (this._renderedItemsCount) {
      this._renderItems(items.slice(this._renderedItemsCount));
    } else {
      this._renderItems(items);
    }
  },
  _renderItems: function _renderItems(items) {
    if (items.length) {
      each(items, function (index, itemData) {
        this._renderItem(this._renderedItemsCount + index, itemData);
      }.bind(this));
    }

    this._renderEmptyMessage();
  },
  _renderItem: function _renderItem(index, itemData, $container, $itemToReplace) {
    var _index$item;

    var itemIndex = (_index$item = index === null || index === void 0 ? void 0 : index.item) !== null && _index$item !== void 0 ? _index$item : index;
    $container = $container || this._itemContainer();

    var $itemFrame = this._renderItemFrame(itemIndex, itemData, $container, $itemToReplace);

    this._setElementData($itemFrame, itemData, itemIndex);

    $itemFrame.attr(this.option('_itemAttributes'));

    this._attachItemClickEvent(itemData, $itemFrame);

    var $itemContent = this._getItemContent($itemFrame);

    var renderContentPromise = this._renderItemContent({
      index: itemIndex,
      itemData: itemData,
      container: getPublicElement($itemContent),
      contentClass: this._itemContentClass(),
      defaultTemplateName: this.option('itemTemplate')
    });

    var that = this;
    when(renderContentPromise).done(function ($itemContent) {
      that._postprocessRenderItem({
        itemElement: $itemFrame,
        itemContent: $itemContent,
        itemData: itemData,
        itemIndex: itemIndex
      });

      that._executeItemRenderAction(index, itemData, getPublicElement($itemFrame));
    });
    return $itemFrame;
  },
  _getItemContent: function _getItemContent($itemFrame) {
    var $itemContent = $itemFrame.find('.' + ITEM_CONTENT_PLACEHOLDER_CLASS);
    $itemContent.removeClass(ITEM_CONTENT_PLACEHOLDER_CLASS);
    return $itemContent;
  },
  _attachItemClickEvent: function _attachItemClickEvent(itemData, $itemElement) {
    if (!itemData || !itemData.onClick) {
      return;
    }

    eventsEngine.on($itemElement, clickEventName, function (e) {
      this._itemEventHandlerByHandler($itemElement, itemData.onClick, {
        event: e
      });
    }.bind(this));
  },
  _renderItemContent: function _renderItemContent(args) {
    var itemTemplateName = this._getItemTemplateName(args);

    var itemTemplate = this._getTemplate(itemTemplateName);

    this._addItemContentClasses(args);

    var $templateResult = $(this._createItemByTemplate(itemTemplate, args));

    if (!$templateResult.hasClass(TEMPLATE_WRAPPER_CLASS)) {
      return args.container;
    }

    return this._renderItemContentByNode(args, $templateResult);
  },
  _renderItemContentByNode: function _renderItemContentByNode(args, $node) {
    $(args.container).replaceWith($node);
    args.container = getPublicElement($node);

    this._addItemContentClasses(args);

    return $node;
  },
  _addItemContentClasses: function _addItemContentClasses(args) {
    var classes = [ITEM_CLASS + CONTENT_CLASS_POSTFIX, args.contentClass];
    $(args.container).addClass(classes.join(' '));
  },
  _appendItemToContainer: function _appendItemToContainer($container, $itemFrame, index) {
    $itemFrame.appendTo($container);
  },
  _renderItemFrame: function _renderItemFrame(index, itemData, $container, $itemToReplace) {
    var $itemFrame = $('<div>');
    new this.constructor.ItemClass($itemFrame, this._itemOptions(), itemData || {});

    if ($itemToReplace && $itemToReplace.length) {
      $itemToReplace.replaceWith($itemFrame);
    } else {
      this._appendItemToContainer.call(this, $container, $itemFrame, index);
    }

    if (this.option('useItemTextAsTitle')) {
      var displayValue = this._displayGetter ? this._displayGetter(itemData) : itemData;
      $itemFrame.attr('title', displayValue);
    }

    return $itemFrame;
  },
  _itemOptions: function _itemOptions() {
    var that = this;
    return {
      watchMethod: function watchMethod() {
        return that.option('integrationOptions.watchMethod');
      },
      owner: that,
      fieldGetter: function fieldGetter(field) {
        var expr = that.option(field + 'Expr');
        var getter = compileGetter(expr);
        return getter;
      }
    };
  },
  _postprocessRenderItem: noop,
  _executeItemRenderAction: function _executeItemRenderAction(index, itemData, itemElement) {
    this._getItemRenderAction()({
      itemElement: itemElement,
      itemIndex: index,
      itemData: itemData
    });
  },
  _setElementData: function _setElementData(element, data, index) {
    element.addClass([ITEM_CLASS, this._itemClass()].join(' ')).data(this._itemDataKey(), data).data(this._itemIndexKey(), index);
  },
  _createItemRenderAction: function _createItemRenderAction() {
    return this._itemRenderAction = this._createActionByOption('onItemRendered', {
      element: this.element(),
      excludeValidators: ['disabled', 'readOnly'],
      category: 'rendering'
    });
  },
  _getItemRenderAction: function _getItemRenderAction() {
    return this._itemRenderAction || this._createItemRenderAction();
  },
  _getItemTemplateName: function _getItemTemplateName(args) {
    var data = args.itemData;
    var templateProperty = args.templateProperty || this.option('itemTemplateProperty');
    var template = data && data[templateProperty];
    return template || args.defaultTemplateName;
  },
  _createItemByTemplate: function _createItemByTemplate(itemTemplate, renderArgs) {
    return itemTemplate.render({
      model: renderArgs.itemData,
      container: renderArgs.container,
      index: renderArgs.index
    });
  },
  _emptyMessageContainer: function _emptyMessageContainer() {
    return this._itemContainer();
  },
  _renderEmptyMessage: function _renderEmptyMessage(items) {
    items = items || this.option('items');
    var noDataText = this.option('noDataText');

    var hideNoData = !noDataText || items && items.length || this._isDataSourceLoading();

    if (hideNoData && this._$noData) {
      this._$noData.remove();

      this._$noData = null;
      this.setAria('label', undefined);
    }

    if (!hideNoData) {
      this._$noData = this._$noData || $('<div>').addClass('dx-empty-message');

      this._$noData.appendTo(this._emptyMessageContainer()).html(noDataText);

      this.setAria('label', noDataText);
    }

    this.$element().toggleClass(EMPTY_COLLECTION, !hideNoData);
  },
  _itemDXEventHandler: function _itemDXEventHandler(dxEvent, handlerOptionName, actionArgs, actionConfig) {
    this._itemEventHandler(dxEvent.target, handlerOptionName, extend(actionArgs, {
      event: dxEvent
    }), actionConfig);
  },
  _itemEventHandler: function _itemEventHandler(initiator, handlerOptionName, actionArgs, actionConfig) {
    var action = this._createActionByOption(handlerOptionName, extend({
      validatingTargetName: 'itemElement'
    }, actionConfig));

    return this._itemEventHandlerImpl(initiator, action, actionArgs);
  },
  _itemEventHandlerByHandler: function _itemEventHandlerByHandler(initiator, handler, actionArgs, actionConfig) {
    var action = this._createAction(handler, extend({
      validatingTargetName: 'itemElement'
    }, actionConfig));

    return this._itemEventHandlerImpl(initiator, action, actionArgs);
  },
  _itemEventHandlerImpl: function _itemEventHandlerImpl(initiator, action, actionArgs) {
    var $itemElement = this._closestItemElement($(initiator));

    var args = extend({}, actionArgs);
    return action(extend(actionArgs, this._extendActionArgs($itemElement), args));
  },
  _extendActionArgs: function _extendActionArgs($itemElement) {
    return {
      itemElement: getPublicElement($itemElement),
      itemIndex: this._itemElements().index($itemElement),
      itemData: this._getItemData($itemElement)
    };
  },
  _closestItemElement: function _closestItemElement($element) {
    return $($element).closest(this._itemSelector());
  },
  _getItemData: function _getItemData(itemElement) {
    return $(itemElement).data(this._itemDataKey());
  },
  _getSummaryItemsWidth: function _getSummaryItemsWidth(items, includeMargin) {
    var result = 0;

    if (items) {
      each(items, function (_, item) {
        result += getOuterWidth(item, includeMargin || false);
      });
    }

    return result;
  },

  /**
  * @name CollectionWidget.getFocusedItemId
  * @publicName getFocusedItemId()
  * @return string
  * @hidden
  */
  getFocusedItemId: function getFocusedItemId() {
    if (!this._focusedItemId) {
      this._focusedItemId = 'dx-' + new Guid();
    }

    return this._focusedItemId;
  },

  /**
  * @name CollectionWidget.itemElements
  * @publicName itemElements()
  * @return Array<Element>
  * @hidden
  */
  itemElements: function itemElements() {
    return this._itemElements();
  },

  /**
  * @name CollectionWidget.itemsContainer
  * @publicName itemsContainer()
  * @return Element
  * @hidden
  */
  itemsContainer: function itemsContainer() {
    return this._itemContainer();
  }
}).include(DataHelperMixin);
CollectionWidget.ItemClass = CollectionWidgetItem;
export default CollectionWidget;