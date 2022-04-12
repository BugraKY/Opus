import { getOuterHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
var window = getWindow();
import eventsEngine from '../../events/core/events_engine';
import Guid from '../../core/guid';
import registerComponent from '../../core/component_registrator';
import { noop, ensureDefined, grep } from '../../core/utils/common';
import { isWindow, isDefined, isObject } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import DropDownEditor from './ui.drop_down_editor';
import List from '../list_light';
import errors from '../widget/ui.errors';
import { addNamespace } from '../../events/utils/index';
import devices from '../../core/devices';
import dataQuery from '../../data/query';
import { each } from '../../core/utils/iterator';
import DataExpressionMixin from '../editor/ui.data_expression';
import messageLocalization from '../../localization/message';
import { ChildDefaultTemplate } from '../../core/templates/child_default_template';
import { Deferred } from '../../core/utils/deferred';
import DataConverterMixin from '../shared/grouped_data_converter_mixin';
var LIST_ITEM_SELECTOR = '.dx-list-item';
var LIST_ITEM_DATA_KEY = 'dxListItemData';
var DROPDOWNLIST_POPUP_WRAPPER_CLASS = 'dx-dropdownlist-popup-wrapper';
var SKIP_GESTURE_EVENT_CLASS = 'dx-skip-gesture-event';
var SEARCH_EVENT = 'input';
var SEARCH_MODES = ['startswith', 'contains', 'endwith', 'notcontains'];
var useCompositionEvents = devices.real().platform !== 'android';
var DropDownList = DropDownEditor.inherit({
  _supportedKeys: function _supportedKeys() {
    var parent = this.callBase();
    return extend({}, parent, {
      tab: function tab(e) {
        if (this._allowSelectItemByTab()) {
          this._saveValueChangeEvent(e);

          var $focusedItem = $(this._list.option('focusedElement'));
          $focusedItem.length && this._setSelectedElement($focusedItem);
        }

        parent.tab.apply(this, arguments);
      },
      space: noop,
      home: noop,
      end: noop
    });
  },
  _allowSelectItemByTab: function _allowSelectItemByTab() {
    return this.option('opened') && this.option('applyValueMode') === 'instantly';
  },
  _setSelectedElement: function _setSelectedElement($element) {
    var value = this._valueGetter(this._list._getItemData($element));

    this._setValue(value);
  },
  _setValue: function _setValue(value) {
    this.option('value', value);
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), extend(DataExpressionMixin._dataExpressionDefaultOptions(), {
      displayValue: undefined,
      searchEnabled: false,
      searchMode: 'contains',
      searchTimeout: 500,
      minSearchLength: 0,
      searchExpr: null,
      valueChangeEvent: 'input change keyup',
      selectedItem: null,
      noDataText: messageLocalization.format('dxCollectionWidget-noDataText'),
      onSelectionChanged: null,
      onItemClick: noop,
      showDataBeforeSearch: false,
      grouped: false,
      groupTemplate: 'group',
      popupPosition: {
        my: 'left top',
        at: 'left bottom',
        offset: {
          h: 0,
          v: 0
        },
        collision: 'flip'
      },
      wrapItemText: false,
      useItemTextAsTitle: false
      /**
      * @name dxDropDownListOptions.fieldTemplate
      * @hidden
      */

      /**
      * @name dxDropDownListOptions.fieldRender
      * @hidden
      */

      /**
      * @name dxDropDownListOptions.contentRender
      * @hidden
      */

      /**
      * @name dxDropDownListOptions.applyValueMode
      * @hidden
      */

    }));
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: {
        platform: 'ios'
      },
      options: {
        popupPosition: {
          offset: {
            v: -1
          }
        }
      }
    }, {
      device: {
        platform: 'generic'
      },
      options: {
        buttonsLocation: 'bottom center'
      }
    }]);
  },
  _setOptionsByReference: function _setOptionsByReference() {
    this.callBase();
    extend(this._optionsByReference, {
      value: true,
      selectedItem: true,
      displayValue: true
    });
  },
  _init: function _init() {
    this.callBase();

    this._initDataExpressions();

    this._initActions();

    this._setListDataSource();

    this._validateSearchMode();

    this._clearSelectedItem();

    this._initItems();
  },
  _setListFocusedElementOptionChange: function _setListFocusedElementOptionChange() {
    this._list._updateParentActiveDescendant = this._updateActiveDescendant.bind(this);
  },
  _initItems: function _initItems() {
    var items = this.option().items;

    if (items && !items.length && this._dataSource) {
      this.option().items = this._dataSource.items();
    }
  },
  _initActions: function _initActions() {
    this._initContentReadyAction();

    this._initSelectionChangedAction();

    this._initItemClickAction();
  },
  _initContentReadyAction: function _initContentReadyAction() {
    this._contentReadyAction = this._createActionByOption('onContentReady', {
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _initSelectionChangedAction: function _initSelectionChangedAction() {
    this._selectionChangedAction = this._createActionByOption('onSelectionChanged', {
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _initItemClickAction: function _initItemClickAction() {
    this._itemClickAction = this._createActionByOption('onItemClick');
  },
  _initTemplates: function _initTemplates() {
    this.callBase();

    this._templateManager.addDefaultTemplates({
      item: new ChildDefaultTemplate('item')
    });
  },
  _isEditable: function _isEditable() {
    return this.callBase() || this.option('searchEnabled');
  },
  _saveFocusOnWidget: function _saveFocusOnWidget(e) {
    if (this._list && this._list.initialOption('focusStateEnabled')) {
      this._focusInput();
    }
  },
  _fitIntoRange: function _fitIntoRange(value, start, end) {
    if (value > end) {
      return start;
    }

    if (value < start) {
      return end;
    }

    return value;
  },
  _items: function _items() {
    var items = this._getPlainItems(!this._list && this._dataSource.items());

    var availableItems = new dataQuery(items).filter('disabled', '<>', true).toArray();
    return availableItems;
  },
  _calcNextItem: function _calcNextItem(step) {
    var items = this._items();

    var nextIndex = this._fitIntoRange(this._getSelectedIndex() + step, 0, items.length - 1);

    return items[nextIndex];
  },
  _getSelectedIndex: function _getSelectedIndex() {
    var items = this._items();

    var selectedItem = this.option('selectedItem');
    var result = -1;
    each(items, function (index, item) {
      if (this._isValueEquals(item, selectedItem)) {
        result = index;
        return false;
      }
    }.bind(this));
    return result;
  },
  _createPopup: function _createPopup() {
    this.callBase();

    this._updateCustomBoundaryContainer();

    this._popup.$wrapper().addClass(this._popupWrapperClass());

    var $popupContent = this._popup.$content();

    eventsEngine.off($popupContent, 'mouseup');
    eventsEngine.on($popupContent, 'mouseup', this._saveFocusOnWidget.bind(this));
    var that = this;

    this._popup.on({
      'shown': function shown() {
        that.$element().addClass(SKIP_GESTURE_EVENT_CLASS);
      },
      'hidden': function hidden() {
        that.$element().removeClass(SKIP_GESTURE_EVENT_CLASS);
      }
    });
  },
  _updateCustomBoundaryContainer: function _updateCustomBoundaryContainer() {
    var customContainer = this.option('dropDownOptions.container');
    var $container = customContainer && $(customContainer);

    if ($container && $container.length && !isWindow($container.get(0))) {
      var $containerWithParents = [].slice.call($container.parents());
      $containerWithParents.unshift($container.get(0));
      each($containerWithParents, function (i, parent) {
        if (parent === $('body').get(0)) {
          return false;
        } else if (window.getComputedStyle(parent).overflowY === 'hidden') {
          this._$customBoundaryContainer = $(parent);
          return false;
        }
      }.bind(this));
    }
  },
  _popupWrapperClass: function _popupWrapperClass() {
    return DROPDOWNLIST_POPUP_WRAPPER_CLASS;
  },
  _renderInputValue: function _renderInputValue() {
    var value = this._getCurrentValue();

    this._rejectValueLoading();

    return this._loadInputValue(value, this._setSelectedItem.bind(this)).always(this.callBase.bind(this, value));
  },
  _loadInputValue: function _loadInputValue(value, callback) {
    return this._loadItem(value).always(callback);
  },
  _getItemFromPlain: function _getItemFromPlain(value, cache) {
    var plainItems;
    var selectedItem;

    if (cache && typeof value !== 'object') {
      if (!cache.itemByValue) {
        cache.itemByValue = {};
        plainItems = this._getPlainItems();
        plainItems.forEach(function (item) {
          cache.itemByValue[this._valueGetter(item)] = item;
        }, this);
      }

      selectedItem = cache.itemByValue[value];
    }

    if (!selectedItem) {
      plainItems = this._getPlainItems();
      selectedItem = grep(plainItems, function (item) {
        return this._isValueEquals(this._valueGetter(item), value);
      }.bind(this))[0];
    }

    return selectedItem;
  },
  _loadItem: function _loadItem(value, cache) {
    var selectedItem = this._getItemFromPlain(value, cache);

    return selectedItem !== undefined ? new Deferred().resolve(selectedItem).promise() : this._loadValue(value);
  },
  _getPlainItems: function _getPlainItems(items) {
    var plainItems = [];
    items = items || this.option('items') || this._dataSource.items() || [];

    for (var i = 0; i < items.length; i++) {
      if (items[i] && items[i].items) {
        plainItems = plainItems.concat(items[i].items);
      } else {
        plainItems.push(items[i]);
      }
    }

    return plainItems;
  },

  _updateActiveDescendant() {
    var _this$_list;

    var opened = this.option('opened');
    var listFocusedItemId = (_this$_list = this._list) === null || _this$_list === void 0 ? void 0 : _this$_list.getFocusedItemId();
    var isElementOnDom = $("#".concat(listFocusedItemId)).length > 0;
    var activedescendant = opened && isElementOnDom && listFocusedItemId;
    this.setAria({
      'activedescendant': activedescendant || null
    });
  },

  _setSelectedItem: function _setSelectedItem(item) {
    var displayValue = this._displayValue(item);

    this.option('selectedItem', ensureDefined(item, null));
    this.option('displayValue', displayValue);
  },
  _displayValue: function _displayValue(item) {
    return this._displayGetter(item);
  },
  _refreshSelected: function _refreshSelected() {
    var cache = {};

    this._listItemElements().each(function (_, itemElement) {
      var $itemElement = $(itemElement);

      var itemValue = this._valueGetter($itemElement.data(LIST_ITEM_DATA_KEY));

      var isItemSelected = this._isSelectedValue(itemValue, cache);

      if (isItemSelected) {
        this._list.selectItem($itemElement);
      } else {
        this._list.unselectItem($itemElement);
      }
    }.bind(this));
  },
  _popupShownHandler: function _popupShownHandler() {
    this.callBase();

    this._setFocusPolicy();
  },
  _setFocusPolicy: function _setFocusPolicy() {
    if (!this.option('focusStateEnabled') || !this._list) {
      return;
    }

    this._list.option('focusedElement', null);
  },
  _isSelectedValue: function _isSelectedValue(value) {
    return this._isValueEquals(value, this.option('value'));
  },
  _validateSearchMode: function _validateSearchMode() {
    var searchMode = this.option('searchMode');
    var normalizedSearchMode = searchMode.toLowerCase();

    if (inArray(normalizedSearchMode, SEARCH_MODES) < 0) {
      throw errors.Error('E1019', searchMode);
    }
  },
  _clearSelectedItem: function _clearSelectedItem() {
    this.option('selectedItem', null);
  },
  _processDataSourceChanging: function _processDataSourceChanging() {
    this._setListDataSource();

    this._renderInputValue().fail(function () {
      if (this._isCustomValueAllowed()) {
        return;
      }

      this._clearSelectedItem();
    }.bind(this));
  },
  _isCustomValueAllowed: function _isCustomValueAllowed() {
    return this.option('displayCustomValue');
  },
  reset: function reset() {
    this.callBase();

    this._clearFilter();

    this._clearSelectedItem();
  },
  _listItemElements: function _listItemElements() {
    return this._$list ? this._$list.find(LIST_ITEM_SELECTOR) : $();
  },
  _popupConfig: function _popupConfig() {
    return extend(this.callBase(), {
      templatesRenderAsynchronously: false,
      autoResizeEnabled: false,
      maxHeight: this._getMaxHeight.bind(this)
    });
  },
  _renderPopupContent: function _renderPopupContent() {
    this.callBase();

    this._renderList();
  },

  _getKeyboardListeners() {
    var canListHaveFocus = this._canListHaveFocus();

    return this.callBase().concat([!canListHaveFocus && this._list]);
  },

  _setAriaTargetForList: function _setAriaTargetForList() {
    this._list._getAriaTarget = this._getAriaTarget.bind(this);
  },
  _renderList: function _renderList() {
    this._listId = 'dx-' + new Guid()._value;
    var $list = this._$list = $('<div>').attr('id', this._listId).appendTo(this._popup.$content());
    this._list = this._createComponent($list, List, this._listConfig());

    this._refreshList();

    this._setAriaTargetForList();

    this._list.option('_listAttributes', {
      'role': 'combobox'
    });

    this._renderPreventBlurOnListClick();

    this._setListFocusedElementOptionChange();
  },
  _renderPreventBlurOnListClick: function _renderPreventBlurOnListClick() {
    var eventName = addNamespace('mousedown', 'dxDropDownList');
    eventsEngine.off(this._$list, eventName);
    eventsEngine.on(this._$list, eventName, e => e.preventDefault());
  },
  _renderOpenedState: function _renderOpenedState() {
    this.callBase();
    this._list && this._updateActiveDescendant();
    this.setAria({
      'controls': this._list && this._listId,
      'owns': this._popup && this._popupContentId
    });
  },
  _setDefaultAria: function _setDefaultAria() {
    this.setAria({
      'haspopup': 'listbox',
      'autocomplete': 'list'
    });
  },
  _refreshList: function _refreshList() {
    if (this._list && this._shouldRefreshDataSource()) {
      this._setListDataSource();
    }
  },
  _shouldRefreshDataSource: function _shouldRefreshDataSource() {
    var dataSourceProvided = !!this._list.option('dataSource');
    return dataSourceProvided !== this._needPassDataSourceToList();
  },
  _isDesktopDevice: function _isDesktopDevice() {
    return devices.real().deviceType === 'desktop';
  },
  _listConfig: function _listConfig() {
    var options = {
      selectionMode: 'single',
      _templates: this.option('_templates'),
      templateProvider: this.option('templateProvider'),
      noDataText: this.option('noDataText'),
      grouped: this.option('grouped'),
      wrapItemText: this.option('wrapItemText'),
      useItemTextAsTitle: this.option('useItemTextAsTitle'),
      onContentReady: this._listContentReadyHandler.bind(this),
      itemTemplate: this.option('itemTemplate'),
      indicateLoading: false,
      keyExpr: this._getCollectionKeyExpr(),
      displayExpr: this._displayGetterExpr(),
      groupTemplate: this.option('groupTemplate'),
      onItemClick: this._listItemClickAction.bind(this),
      dataSource: this._getDataSource(),
      _revertPageOnEmptyLoad: true,
      hoverStateEnabled: this._isDesktopDevice() ? this.option('hoverStateEnabled') : false,
      focusStateEnabled: this._isDesktopDevice() ? this.option('focusStateEnabled') : false
    };

    if (!this._canListHaveFocus()) {
      options.tabIndex = null;
    }

    return options;
  },
  _canListHaveFocus: () => false,
  _getDataSource: function _getDataSource() {
    return this._needPassDataSourceToList() ? this._dataSource : null;
  },
  _dataSourceOptions: function _dataSourceOptions() {
    return {
      paginate: false
    };
  },
  _getGroupedOption: function _getGroupedOption() {
    return this.option('grouped');
  },
  _dataSourceFromUrlLoadMode: function _dataSourceFromUrlLoadMode() {
    return 'raw';
  },
  _listContentReadyHandler: function _listContentReadyHandler() {
    this._list = this._list || this._$list.dxList('instance');

    if (!this.option('deferRendering')) {
      this._refreshSelected();
    }

    this._dimensionChanged();

    this._contentReadyAction();
  },
  _setListOption: function _setListOption(optionName, value) {
    this._setWidgetOption('_list', arguments);
  },
  _listItemClickAction: function _listItemClickAction(e) {
    this._listItemClickHandler(e);

    this._itemClickAction(e);
  },
  _listItemClickHandler: noop,
  _setListDataSource: function _setListDataSource() {
    if (!this._list) {
      return;
    }

    this._setListOption('dataSource', this._getDataSource());

    if (!this._needPassDataSourceToList()) {
      this._setListOption('items', []);
    }
  },
  _needPassDataSourceToList: function _needPassDataSourceToList() {
    return this.option('showDataBeforeSearch') || this._isMinSearchLengthExceeded();
  },
  _isMinSearchLengthExceeded: function _isMinSearchLengthExceeded() {
    return this._searchValue().toString().length >= this.option('minSearchLength');
  },
  _needClearFilter: function _needClearFilter() {
    return this._canKeepDataSource() ? false : this._needPassDataSourceToList();
  },
  _canKeepDataSource: function _canKeepDataSource() {
    var _this$_dataSource;

    var isMinSearchLengthExceeded = this._isMinSearchLengthExceeded();

    return ((_this$_dataSource = this._dataSource) === null || _this$_dataSource === void 0 ? void 0 : _this$_dataSource.isLoaded()) && this.option('showDataBeforeSearch') && this.option('minSearchLength') && !isMinSearchLengthExceeded && !this._isLastMinSearchLengthExceeded;
  },
  _searchValue: function _searchValue() {
    return this._input().val() || '';
  },
  _getSearchEvent: function _getSearchEvent() {
    return addNamespace(SEARCH_EVENT, this.NAME + 'Search');
  },
  _getCompositionStartEvent: function _getCompositionStartEvent() {
    return addNamespace('compositionstart', this.NAME + 'CompositionStart');
  },
  _getCompositionEndEvent: function _getCompositionEndEvent() {
    return addNamespace('compositionend', this.NAME + 'CompositionEnd');
  },
  _getSetFocusPolicyEvent: function _getSetFocusPolicyEvent() {
    return addNamespace('input', this.NAME + 'FocusPolicy');
  },
  _renderEvents: function _renderEvents() {
    this.callBase();
    eventsEngine.on(this._input(), this._getSetFocusPolicyEvent(), () => {
      this._setFocusPolicy();
    });

    if (this._shouldRenderSearchEvent()) {
      eventsEngine.on(this._input(), this._getSearchEvent(), e => {
        this._searchHandler(e);
      });

      if (useCompositionEvents) {
        eventsEngine.on(this._input(), this._getCompositionStartEvent(), () => {
          this._isTextCompositionInProgress(true);
        });
        eventsEngine.on(this._input(), this._getCompositionEndEvent(), e => {
          this._isTextCompositionInProgress(undefined);

          this._searchHandler(e, this._searchValue());
        });
      }
    }
  },
  _shouldRenderSearchEvent: function _shouldRenderSearchEvent() {
    return this.option('searchEnabled');
  },
  _refreshEvents: function _refreshEvents() {
    eventsEngine.off(this._input(), this._getSearchEvent());
    eventsEngine.off(this._input(), this._getSetFocusPolicyEvent());

    if (useCompositionEvents) {
      eventsEngine.off(this._input(), this._getCompositionStartEvent());
      eventsEngine.off(this._input(), this._getCompositionEndEvent());
    }

    this.callBase();
  },
  _isTextCompositionInProgress: function _isTextCompositionInProgress(value) {
    if (arguments.length) {
      this._isTextComposition = value;
    } else {
      return this._isTextComposition;
    }
  },
  _searchHandler: function _searchHandler(e, searchValue) {
    if (this._isTextCompositionInProgress()) {
      return;
    }

    if (!this._isMinSearchLengthExceeded()) {
      this._searchCanceled();

      return;
    }

    var searchTimeout = this.option('searchTimeout');

    if (searchTimeout) {
      this._clearSearchTimer();

      this._searchTimer = setTimeout(() => {
        this._searchDataSource(searchValue);
      }, searchTimeout);
    } else {
      this._searchDataSource(searchValue);
    }
  },
  _searchCanceled: function _searchCanceled() {
    this._clearSearchTimer();

    if (this._needClearFilter()) {
      this._filterDataSource(null);
    }

    this._refreshList();
  },
  _searchDataSource: function _searchDataSource() {
    var searchValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._searchValue();

    this._filterDataSource(searchValue);
  },
  _filterDataSource: function _filterDataSource(searchValue) {
    this._clearSearchTimer();

    var dataSource = this._dataSource;

    if (dataSource) {
      dataSource.searchExpr(this.option('searchExpr') || this._displayGetterExpr());
      dataSource.searchOperation(this.option('searchMode'));
      dataSource.searchValue(searchValue);
      dataSource.load().done(this._dataSourceFiltered.bind(this, searchValue));
    }
  },
  _clearFilter: function _clearFilter() {
    var dataSource = this._dataSource;
    dataSource && dataSource.searchValue() && dataSource.searchValue(null);
  },
  _dataSourceFiltered: function _dataSourceFiltered() {
    this._isLastMinSearchLengthExceeded = this._isMinSearchLengthExceeded();

    this._refreshList();

    this._refreshPopupVisibility();
  },
  _shouldOpenPopup: function _shouldOpenPopup() {
    return this._hasItemsToShow();
  },
  _refreshPopupVisibility: function _refreshPopupVisibility() {
    if (this.option('readOnly') || !this._searchValue()) {
      return;
    }

    var shouldOpenPopup = this._shouldOpenPopup();

    if (shouldOpenPopup && !this._isFocused()) {
      return;
    }

    this.option('opened', shouldOpenPopup);

    if (shouldOpenPopup) {
      this._dimensionChanged();
    }
  },
  _dataSourceChangedHandler: function _dataSourceChangedHandler(newItems) {
    if (this._dataSource.pageIndex() === 0) {
      this.option().items = newItems;
    } else {
      this.option().items = this.option().items.concat(newItems);
    }
  },
  _hasItemsToShow: function _hasItemsToShow() {
    var resultItems = this._dataSource && this._dataSource.items() || [];
    var resultAmount = resultItems.length;

    var isMinSearchLengthExceeded = this._needPassDataSourceToList();

    return !!(isMinSearchLengthExceeded && resultAmount);
  },
  _clearSearchTimer: function _clearSearchTimer() {
    clearTimeout(this._searchTimer);
    delete this._searchTimer;
  },
  _popupShowingHandler: function _popupShowingHandler() {
    this._dimensionChanged();
  },
  _dimensionChanged: function _dimensionChanged() {
    this.callBase(arguments);
    this._popup && this._updatePopupDimensions();
  },
  _needPopupRepaint: function _needPopupRepaint() {
    if (!this._dataSource) {
      return false;
    }

    var currentPageIndex = this._dataSource.pageIndex();

    var needRepaint = isDefined(this._pageIndex) && currentPageIndex <= this._pageIndex;

    this._pageIndex = currentPageIndex;
    return needRepaint;
  },
  _updatePopupDimensions: function _updatePopupDimensions() {
    if (this._needPopupRepaint()) {
      this._popup.repaint();
    }

    this._list && this._list.updateDimensions();
  },
  _getMaxHeight: function _getMaxHeight() {
    var $element = this.$element();
    var $customBoundaryContainer = this._$customBoundaryContainer;
    var offsetTop = $element.offset().top - ($customBoundaryContainer ? $customBoundaryContainer.offset().top : 0);
    var windowHeight = getOuterHeight(window);
    var containerHeight = $customBoundaryContainer ? Math.min(getOuterHeight($customBoundaryContainer), windowHeight) : windowHeight;
    var maxHeight = Math.max(offsetTop, containerHeight - offsetTop - getOuterHeight($element));
    return Math.min(containerHeight * 0.5, maxHeight);
  },
  _clean: function _clean() {
    if (this._list) {
      delete this._list;
    }

    delete this._isLastMinSearchLengthExceeded;
    this.callBase();
  },
  _dispose: function _dispose() {
    this._clearSearchTimer();

    this.callBase();
  },
  _setCollectionWidgetOption: function _setCollectionWidgetOption() {
    this._setListOption.apply(this, arguments);
  },
  _setSubmitValue: function _setSubmitValue() {
    var value = this.option('value');
    var submitValue = this._shouldUseDisplayValue(value) ? this._displayGetter(value) : value;

    this._getSubmitElement().val(submitValue);
  },
  _shouldUseDisplayValue: function _shouldUseDisplayValue(value) {
    return this.option('valueExpr') === 'this' && isObject(value);
  },
  _optionChanged: function _optionChanged(args) {
    this._dataExpressionOptionChanged(args);

    switch (args.name) {
      case 'hoverStateEnabled':
      case 'focusStateEnabled':
        this._isDesktopDevice() && this._setListOption(args.name, args.value);
        this.callBase(args);
        break;

      case 'items':
        if (!this.option('dataSource')) {
          this._processDataSourceChanging();
        }

        break;

      case 'dataSource':
        this._processDataSourceChanging();

        break;

      case 'valueExpr':
        this._renderValue();

        this._setListOption('keyExpr', this._getCollectionKeyExpr());

        break;

      case 'displayExpr':
        this._renderValue();

        this._setListOption('displayExpr', this._displayGetterExpr());

        break;

      case 'searchMode':
        this._validateSearchMode();

        break;

      case 'minSearchLength':
        this._refreshList();

        break;

      case 'searchEnabled':
      case 'showDataBeforeSearch':
      case 'searchExpr':
        this._invalidate();

        break;

      case 'onContentReady':
        this._initContentReadyAction();

        break;

      case 'onSelectionChanged':
        this._initSelectionChangedAction();

        break;

      case 'onItemClick':
        this._initItemClickAction();

        break;

      case 'grouped':
      case 'groupTemplate':
      case 'wrapItemText':
      case 'noDataText':
      case 'useItemTextAsTitle':
        this._setListOption(args.name);

        break;

      case 'displayValue':
        this.option('text', args.value);
        break;

      case 'itemTemplate':
      case 'searchTimeout':
        break;

      case 'selectedItem':
        if (args.previousValue !== args.value) {
          this._selectionChangedAction({
            selectedItem: args.value
          });
        }

        break;

      default:
        this.callBase(args);
    }
  }
}).include(DataExpressionMixin, DataConverterMixin);
registerComponent('dxDropDownList', DropDownList);
export default DropDownList;