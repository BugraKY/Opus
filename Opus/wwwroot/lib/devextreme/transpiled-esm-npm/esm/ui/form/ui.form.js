import _extends from "@babel/runtime/helpers/esm/extends";
import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import registerComponent from '../../core/component_registrator';
import Guid from '../../core/guid';
import { ensureDefined } from '../../core/utils/common';
import config from '../../core/config';
import { isDefined, isEmptyObject, isObject, isString } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { inArray } from '../../core/utils/array';
import { extend } from '../../core/utils/extend';
import { triggerResizeEvent, triggerShownEvent } from '../../events/visibility_change';
import { getPublicElement } from '../../core/element';
import messageLocalization from '../../localization/message';
import Widget from '../widget/ui.widget';
import Editor from '../editor/editor';
import { defaultScreenFactorFunc, getCurrentScreenFactor, hasWindow } from '../../core/utils/window';
import ValidationEngine from '../validation_engine';
import { default as FormItemsRunTimeInfo } from './ui.form.items_runtime_info';
import TabPanel from '../tab_panel';
import Scrollable from '../scroll_view/ui.scrollable';
import { Deferred } from '../../core/utils/deferred';
import { isMaterial } from '../themes';
import tryCreateItemOptionAction from './ui.form.item_options_actions';
import './ui.form.layout_manager';
import { concatPaths, createItemPathByIndex, getFullOptionName, getOptionNameFromFullName, tryGetTabPath, getTextWithoutSpaces, isEqualToDataFieldOrNameOrTitleOrCaption, isFullPathContainsTabs, getItemPath, convertToLayoutManagerOptions } from './ui.form.utils';
import { convertToLabelMarkOptions } from './ui.form.layout_manager.utils'; // TODO: remove reference to 'ui.form.layout_manager.utils.js'

import { setLabelWidthByMaxLabelWidth } from './components/label';
import '../validation_summary';
import '../validation_group'; // STYLE form

import { FORM_CLASS, FIELD_ITEM_CLASS, FORM_GROUP_CLASS, FORM_GROUP_CONTENT_CLASS, FIELD_ITEM_CONTENT_HAS_GROUP_CLASS, FIELD_ITEM_CONTENT_HAS_TABS_CLASS, FORM_GROUP_WITH_CAPTION_CLASS, FORM_GROUP_CAPTION_CLASS, FIELD_ITEM_TAB_CLASS, FORM_FIELD_ITEM_COL_CLASS, GROUP_COL_COUNT_CLASS, GROUP_COL_COUNT_ATTR, FIELD_ITEM_CONTENT_CLASS, FORM_VALIDATION_SUMMARY, ROOT_SIMPLE_ITEM_CLASS, FORM_UNDERLINED_CLASS } from './constants';
import { TOOLBAR_CLASS } from '../toolbar/constants';
var FOCUSED_STATE_CLASS = 'dx-state-focused';
var ITEM_OPTIONS_FOR_VALIDATION_UPDATING = ['items', 'isRequired', 'validationRules', 'visible'];
var Form = Widget.inherit({
  _init: function _init() {
    this.callBase();
    this._cachedColCountOptions = [];
    this._itemsRunTimeInfo = new FormItemsRunTimeInfo();
    this._groupsColCount = [];

    this._attachSyncSubscriptions();
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      formID: 'dx-' + new Guid(),
      formData: {},
      colCount: 1,
      screenByWidth: defaultScreenFactorFunc,
      colCountByScreen: undefined,
      labelLocation: 'left',
      readOnly: false,
      onFieldDataChanged: null,
      customizeItem: null,
      onEditorEnterKey: null,
      minColWidth: 200,
      alignItemLabels: true,
      alignItemLabelsInAllGroups: true,
      alignRootItemLabels: true,
      showColonAfterLabel: true,
      showRequiredMark: true,
      showOptionalMark: false,
      requiredMark: '*',
      optionalMark: messageLocalization.format('dxForm-optionalMark'),
      requiredMessage: messageLocalization.getFormatter('dxForm-requiredMessage'),
      showValidationSummary: false,
      items: undefined,
      scrollingEnabled: false,
      validationGroup: undefined,
      stylingMode: config().editorStylingMode,
      labelMode: 'outside'
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: function device() {
        return isMaterial();
      },
      options: {
        showColonAfterLabel: false,
        labelLocation: 'top'
      }
    }]);
  },
  _setOptionsByReference: function _setOptionsByReference() {
    this.callBase();
    extend(this._optionsByReference, {
      formData: true,
      validationGroup: true
    });
  },
  _getGroupColCount: function _getGroupColCount($element) {
    return parseInt($element.attr(GROUP_COL_COUNT_ATTR));
  },
  _applyLabelsWidthByCol: function _applyLabelsWidthByCol($container, index) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var labelMarkOptions = arguments.length > 3 ? arguments[3] : undefined;
    var fieldItemClass = options.inOneColumn ? FIELD_ITEM_CLASS : FORM_FIELD_ITEM_COL_CLASS + index;
    var cssExcludeTabbedSelector = options.excludeTabbed ? ":not(.".concat(FIELD_ITEM_TAB_CLASS, ")") : '';
    setLabelWidthByMaxLabelWidth($container, ".".concat(fieldItemClass).concat(cssExcludeTabbedSelector), labelMarkOptions);
    return;
  },
  _applyLabelsWidth: function _applyLabelsWidth($container, excludeTabbed, inOneColumn, colCount, labelMarkOptions) {
    colCount = inOneColumn ? 1 : colCount || this._getGroupColCount($container);
    var applyLabelsOptions = {
      excludeTabbed: excludeTabbed,
      inOneColumn: inOneColumn
    };
    var i;

    for (i = 0; i < colCount; i++) {
      this._applyLabelsWidthByCol($container, i, applyLabelsOptions, labelMarkOptions);
    }
  },
  _getGroupElementsInColumn: function _getGroupElementsInColumn($container, columnIndex, colCount) {
    var cssColCountSelector = isDefined(colCount) ? '.' + GROUP_COL_COUNT_CLASS + colCount : '';
    var groupSelector = '.' + FORM_FIELD_ITEM_COL_CLASS + columnIndex + ' > .' + FIELD_ITEM_CONTENT_CLASS + ' > .' + FORM_GROUP_CLASS + cssColCountSelector;
    return $container.find(groupSelector);
  },
  _applyLabelsWidthWithGroups: function _applyLabelsWidthWithGroups($container, colCount, excludeTabbed, labelMarkOptions) {
    if (this.option('alignRootItemLabels') === true) {
      // TODO: private option
      var $rootSimpleItems = $container.find(".".concat(ROOT_SIMPLE_ITEM_CLASS));

      for (var colIndex = 0; colIndex < colCount; colIndex++) {
        // TODO: root items are aligned with root items only
        // this code doesn't align root items with grouped items in the same column
        // (see T942517)
        this._applyLabelsWidthByCol($rootSimpleItems, colIndex, excludeTabbed, labelMarkOptions);
      }
    }

    var alignItemLabelsInAllGroups = this.option('alignItemLabelsInAllGroups');

    if (alignItemLabelsInAllGroups) {
      this._applyLabelsWidthWithNestedGroups($container, colCount, excludeTabbed, labelMarkOptions);
    } else {
      var $groups = this.$element().find('.' + FORM_GROUP_CLASS);
      var i;

      for (i = 0; i < $groups.length; i++) {
        this._applyLabelsWidth($groups.eq(i), excludeTabbed, undefined, undefined, labelMarkOptions);
      }
    }
  },
  _applyLabelsWidthWithNestedGroups: function _applyLabelsWidthWithNestedGroups($container, colCount, excludeTabbed, labelMarkOptions) {
    var applyLabelsOptions = {
      excludeTabbed: excludeTabbed
    };
    var colIndex;
    var groupsColIndex;
    var groupColIndex;
    var $groupsByCol;

    for (colIndex = 0; colIndex < colCount; colIndex++) {
      $groupsByCol = this._getGroupElementsInColumn($container, colIndex);

      this._applyLabelsWidthByCol($groupsByCol, 0, applyLabelsOptions, labelMarkOptions);

      for (groupsColIndex = 0; groupsColIndex < this._groupsColCount.length; groupsColIndex++) {
        $groupsByCol = this._getGroupElementsInColumn($container, colIndex, this._groupsColCount[groupsColIndex]);

        var groupColCount = this._getGroupColCount($groupsByCol);

        for (groupColIndex = 1; groupColIndex < groupColCount; groupColIndex++) {
          this._applyLabelsWidthByCol($groupsByCol, groupColIndex, applyLabelsOptions, labelMarkOptions);
        }
      }
    }
  },
  _labelLocation: function _labelLocation() {
    return this.option('labelLocation');
  },
  _alignLabelsInColumn: function _alignLabelsInColumn(_ref) {
    var {
      layoutManager,
      inOneColumn,
      $container,
      excludeTabbed,
      items
    } = _ref;

    if (!hasWindow() || this._labelLocation() === 'top') {
      // TODO: label location can be changed to 'left/right' for some labels
      // but this condition disables alignment for such items
      return;
    }

    var labelMarkOptions = convertToLabelMarkOptions(layoutManager._getMarkOptions());

    if (inOneColumn) {
      this._applyLabelsWidth($container, excludeTabbed, true, undefined, labelMarkOptions);
    } else {
      if (this._checkGrouping(items)) {
        this._applyLabelsWidthWithGroups($container, layoutManager._getColCount(), excludeTabbed, labelMarkOptions);
      } else {
        this._applyLabelsWidth($container, excludeTabbed, false, layoutManager._getColCount(), labelMarkOptions);
      }
    }
  },
  _prepareFormData: function _prepareFormData() {
    if (!isDefined(this.option('formData'))) {
      this.option('formData', {});
    }
  },
  _setStylingModeClass: function _setStylingModeClass() {
    if (this.option('stylingMode') === 'underlined') {
      this.$element().addClass(FORM_UNDERLINED_CLASS);
    }
  },
  _initMarkup: function _initMarkup() {
    ValidationEngine.addGroup(this._getValidationGroup());

    this._clearCachedInstances();

    this._prepareFormData();

    this.$element().addClass(FORM_CLASS);

    this._setStylingModeClass();

    this.callBase();
    this.setAria('role', 'form', this.$element());

    if (this.option('scrollingEnabled')) {
      this._renderScrollable();
    }

    this._renderLayout();

    this._renderValidationSummary();

    this._lastMarkupScreenFactor = this._targetScreenFactor || this._getCurrentScreenFactor();
  },
  _getCurrentScreenFactor: function _getCurrentScreenFactor() {
    return hasWindow() ? getCurrentScreenFactor(this.option('screenByWidth')) : 'lg';
  },
  _clearCachedInstances: function _clearCachedInstances() {
    this._itemsRunTimeInfo.clear();

    this._cachedLayoutManagers = [];
  },
  _alignLabels: function _alignLabels(layoutManager, inOneColumn) {
    this._alignLabelsInColumn({
      $container: this.$element(),
      layoutManager,
      excludeTabbed: true,
      items: this.option('items'),
      inOneColumn
    });

    triggerResizeEvent(this.$element().find(".".concat(TOOLBAR_CLASS)));
  },
  _clean: function _clean() {
    this._clearValidationSummary();

    this.callBase();
    this._groupsColCount = [];
    this._cachedColCountOptions = [];
    this._lastMarkupScreenFactor = undefined;
  },
  _renderScrollable: function _renderScrollable() {
    var useNativeScrolling = this.option('useNativeScrolling');
    this._scrollable = new Scrollable(this.$element(), {
      useNative: !!useNativeScrolling,
      useSimulatedScrollbar: !useNativeScrolling,
      useKeyboard: false,
      direction: 'both',
      bounceEnabled: false
    });
  },
  _getContent: function _getContent() {
    return this.option('scrollingEnabled') ? $(this._scrollable.content()) : this.$element();
  },
  _clearValidationSummary: function _clearValidationSummary() {
    var _this$_$validationSum;

    (_this$_$validationSum = this._$validationSummary) === null || _this$_$validationSum === void 0 ? void 0 : _this$_$validationSum.remove();
    this._$validationSummary = undefined;
    this._validationSummary = undefined;
  },
  _renderValidationSummary: function _renderValidationSummary() {
    this._clearValidationSummary();

    if (this.option('showValidationSummary')) {
      this._$validationSummary = $('<div>').addClass(FORM_VALIDATION_SUMMARY).appendTo(this._getContent());
      this._validationSummary = this._$validationSummary.dxValidationSummary({
        validationGroup: this._getValidationGroup()
      }).dxValidationSummary('instance');
    }
  },

  _prepareItems(items, parentIsTabbedItem, currentPath, isTabs) {
    if (items) {
      var result = [];

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var path = concatPaths(currentPath, createItemPathByIndex(i, isTabs));
        var itemRunTimeInfo = {
          item,
          itemIndex: i,
          path
        };

        var guid = this._itemsRunTimeInfo.add(itemRunTimeInfo);

        if (isString(item)) {
          item = {
            dataField: item
          };
        }

        if (isObject(item)) {
          var preparedItem = _extends({}, item);

          itemRunTimeInfo.preparedItem = preparedItem;
          preparedItem.guid = guid;

          this._tryPrepareGroupItem(preparedItem);

          this._tryPrepareTabbedItem(preparedItem, path);

          this._tryPrepareItemTemplate(preparedItem);

          if (parentIsTabbedItem) {
            preparedItem.cssItemClass = FIELD_ITEM_TAB_CLASS;
          }

          if (preparedItem.items) {
            preparedItem.items = this._prepareItems(preparedItem.items, parentIsTabbedItem, path);
          }

          result.push(preparedItem);
        } else {
          result.push(item);
        }
      }

      return result;
    }
  },

  _tryPrepareGroupItem: function _tryPrepareGroupItem(item) {
    if (item.itemType === 'group') {
      item.alignItemLabels = ensureDefined(item.alignItemLabels, true);

      item._prepareGroupItemTemplate = itemTemplate => {
        if (item.template) {
          item.groupContentTemplate = this._getTemplate(itemTemplate);
        }

        item.template = this._itemGroupTemplate.bind(this, item);
      };

      item._prepareGroupItemTemplate(item.template);
    }
  },
  _tryPrepareTabbedItem: function _tryPrepareTabbedItem(item, path) {
    if (item.itemType === 'tabbed') {
      item.template = this._itemTabbedTemplate.bind(this, item);
      item.tabs = this._prepareItems(item.tabs, true, path, true);
    }
  },
  _tryPrepareItemTemplate: function _tryPrepareItemTemplate(item) {
    if (item.template) {
      item.template = this._getTemplate(item.template);
    }
  },
  _checkGrouping: function _checkGrouping(items) {
    if (items) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (item.itemType === 'group') {
          return true;
        }
      }
    }
  },
  _renderLayout: function _renderLayout() {
    var that = this;
    var items = that.option('items');

    var $content = that._getContent(); // TODO: Introduce this.preparedItems and use it for partial rerender???
    // Compare new preparedItems with old preparedItems to detect what should be rerendered?


    items = that._prepareItems(items);
    that._rootLayoutManager = that._renderLayoutManager($content, this._createLayoutManagerOptions(items, {
      isRoot: true,
      colCount: that.option('colCount'),
      alignItemLabels: that.option('alignItemLabels'),
      screenByWidth: this.option('screenByWidth'),
      colCountByScreen: this.option('colCountByScreen'),
      onLayoutChanged: function onLayoutChanged(inOneColumn) {
        that._alignLabels.bind(that)(that._rootLayoutManager, inOneColumn);
      },
      onContentReady: function onContentReady(e) {
        that._alignLabels(e.component, e.component.isSingleColumnMode());
      }
    }));
  },
  _tryGetItemsForTemplate: function _tryGetItemsForTemplate(item) {
    return item.items || [];
  },
  _itemTabbedTemplate: function _itemTabbedTemplate(item, e, $container) {
    var $tabPanel = $('<div>').appendTo($container);
    var tabPanelOptions = extend({}, item.tabPanelOptions, {
      dataSource: item.tabs,
      onItemRendered: args => triggerShownEvent(args.itemElement),
      itemTemplate: (itemData, e, container) => {
        var $container = $(container);
        var alignItemLabels = ensureDefined(itemData.alignItemLabels, true);

        var layoutManager = this._renderLayoutManager($container, this._createLayoutManagerOptions(this._tryGetItemsForTemplate(itemData), {
          colCount: itemData.colCount,
          alignItemLabels: alignItemLabels,
          screenByWidth: this.option('screenByWidth'),
          colCountByScreen: itemData.colCountByScreen,
          cssItemClass: itemData.cssItemClass,
          onLayoutChanged: inOneColumn => {
            this._alignLabelsInColumn({
              $container,
              layoutManager,
              items: itemData.items,
              inOneColumn
            });
          }
        }));

        if (this._itemsRunTimeInfo) {
          this._itemsRunTimeInfo.extendRunTimeItemInfoByKey(itemData.guid, {
            layoutManager
          });
        }

        if (alignItemLabels) {
          this._alignLabelsInColumn({
            $container,
            layoutManager,
            items: itemData.items,
            inOneColumn: layoutManager.isSingleColumnMode()
          });
        }
      }
    });

    var tryUpdateTabPanelInstance = (items, instance) => {
      if (Array.isArray(items)) {
        items.forEach(item => this._itemsRunTimeInfo.extendRunTimeItemInfoByKey(item.guid, {
          widgetInstance: instance
        }));
      }
    };

    var tabPanel = this._createComponent($tabPanel, TabPanel, tabPanelOptions);

    $($container).parent().addClass(FIELD_ITEM_CONTENT_HAS_TABS_CLASS);
    tabPanel.on('optionChanged', e => {
      if (e.fullName === 'dataSource') {
        tryUpdateTabPanelInstance(e.value, e.component);
      }
    });
    tryUpdateTabPanelInstance([{
      guid: item.guid
    }, ...item.tabs], tabPanel);
  },
  _itemGroupTemplate: function _itemGroupTemplate(item, e, $container) {
    var $group = $('<div>').toggleClass(FORM_GROUP_WITH_CAPTION_CLASS, isDefined(item.caption) && item.caption.length).addClass(FORM_GROUP_CLASS).appendTo($container);
    $($container).parent().addClass(FIELD_ITEM_CONTENT_HAS_GROUP_CLASS);
    var colCount;
    var layoutManager;

    if (item.caption) {
      $('<span>').addClass(FORM_GROUP_CAPTION_CLASS).text(item.caption).appendTo($group);
    }

    var $groupContent = $('<div>').addClass(FORM_GROUP_CONTENT_CLASS).appendTo($group);

    if (item.groupContentTemplate) {
      item._renderGroupContentTemplate = () => {
        $groupContent.empty();
        var data = {
          formData: this.option('formData'),
          component: this
        };
        item.groupContentTemplate.render({
          model: data,
          container: getPublicElement($groupContent)
        });
      };

      item._renderGroupContentTemplate();
    } else {
      layoutManager = this._renderLayoutManager($groupContent, this._createLayoutManagerOptions(this._tryGetItemsForTemplate(item), {
        colCount: item.colCount,
        colCountByScreen: item.colCountByScreen,
        alignItemLabels: item.alignItemLabels,
        cssItemClass: item.cssItemClass
      }));
      this._itemsRunTimeInfo && this._itemsRunTimeInfo.extendRunTimeItemInfoByKey(item.guid, {
        layoutManager
      });
      colCount = layoutManager._getColCount();

      if (inArray(colCount, this._groupsColCount) === -1) {
        this._groupsColCount.push(colCount);
      }

      $group.addClass(GROUP_COL_COUNT_CLASS + colCount);
      $group.attr(GROUP_COL_COUNT_ATTR, colCount);
    }
  },
  _createLayoutManagerOptions: function _createLayoutManagerOptions(items, extendedLayoutManagerOptions) {
    return convertToLayoutManagerOptions({
      form: this,
      formOptions: this.option(),
      $formElement: this.$element(),
      items,
      validationGroup: this._getValidationGroup(),
      extendedLayoutManagerOptions,
      onFieldDataChanged: args => {
        if (!this._isDataUpdating) {
          this._triggerOnFieldDataChanged(args);
        }
      },
      onContentReady: args => {
        this._itemsRunTimeInfo.addItemsOrExtendFrom(args.component._itemsRunTimeInfo);

        extendedLayoutManagerOptions.onContentReady && extendedLayoutManagerOptions.onContentReady(args);
      },
      onDisposing: _ref2 => {
        var {
          component
        } = _ref2;
        var nestedItemsRunTimeInfo = component.getItemsRunTimeInfo();

        this._itemsRunTimeInfo.removeItemsByItems(nestedItemsRunTimeInfo);
      },
      onFieldItemRendered: () => {
        var _this$_validationSumm;

        (_this$_validationSumm = this._validationSummary) === null || _this$_validationSumm === void 0 ? void 0 : _this$_validationSumm._initGroupRegistration();
      }
    });
  },
  _renderLayoutManager: function _renderLayoutManager($parent, layoutManagerOptions) {
    var baseColCountByScreen = {
      lg: layoutManagerOptions.colCount,
      md: layoutManagerOptions.colCount,
      sm: layoutManagerOptions.colCount,
      xs: 1
    };

    this._cachedColCountOptions.push({
      colCountByScreen: extend(baseColCountByScreen, layoutManagerOptions.colCountByScreen)
    });

    var $element = $('<div>');
    $element.appendTo($parent);

    var instance = this._createComponent($element, 'dxLayoutManager', layoutManagerOptions);

    instance.on('autoColCountChanged', () => {
      this._clearAutoColCountChangedTimeout();

      this.autoColCountChangedTimeoutId = setTimeout(() => !this._disposed && this._refresh(), 0);
    });

    this._cachedLayoutManagers.push(instance);

    return instance;
  },
  _getValidationGroup: function _getValidationGroup() {
    return this.option('validationGroup') || this;
  },
  _createComponent: function _createComponent($element, type, config) {
    var that = this;
    config = config || {};

    that._extendConfig(config, {
      readOnly: that.option('readOnly')
    });

    return that.callBase($element, type, config);
  },
  _attachSyncSubscriptions: function _attachSyncSubscriptions() {
    var that = this;
    that.on('optionChanged', function (args) {
      var optionFullName = args.fullName;

      if (optionFullName === 'formData') {
        if (!isDefined(args.value)) {
          that._options.silent('formData', args.value = {});
        }

        that._triggerOnFieldDataChangedByDataSet(args.value);
      }

      if (that._cachedLayoutManagers.length) {
        each(that._cachedLayoutManagers, function (index, layoutManager) {
          if (optionFullName === 'formData') {
            that._isDataUpdating = true;
            layoutManager.option('layoutData', args.value);
            that._isDataUpdating = false;
          }

          if (args.name === 'readOnly' || args.name === 'disabled') {
            layoutManager.option(optionFullName, args.value);
          }
        });
      }
    });
  },
  _optionChanged: function _optionChanged(args) {
    var splitFullName = args.fullName.split('.'); // search() is used because the string can be ['items', ' items ', ' items .', 'items[0]', 'items[ 10 ] .', ...]

    if (splitFullName.length > 1 && splitFullName[0].search('items') !== -1 && this._itemsOptionChangedHandler(args)) {
      return;
    }

    if (splitFullName.length > 1 && splitFullName[0].search('formData') !== -1 && this._formDataOptionChangedHandler(args)) {
      return;
    }

    this._defaultOptionChangedHandler(args);
  },
  _defaultOptionChangedHandler: function _defaultOptionChangedHandler(args) {
    switch (args.name) {
      case 'formData':
        if (!this.option('items')) {
          this._invalidate();
        } else if (isEmptyObject(args.value)) {
          this._resetValues();
        }

        break;

      case 'onFieldDataChanged':
        break;

      case 'items':
      case 'colCount':
      case 'onEditorEnterKey':
      case 'labelLocation':
      case 'labelMode':
      case 'alignItemLabels':
      case 'showColonAfterLabel':
      case 'customizeItem':
      case 'alignItemLabelsInAllGroups':
      case 'showRequiredMark':
      case 'showOptionalMark':
      case 'requiredMark':
      case 'optionalMark':
      case 'requiredMessage':
      case 'scrollingEnabled':
      case 'formID':
      case 'colCountByScreen':
      case 'screenByWidth':
      case 'stylingMode':
        this._invalidate();

        break;

      case 'showValidationSummary':
        this._renderValidationSummary();

        break;

      case 'minColWidth':
        if (this.option('colCount') === 'auto') {
          this._invalidate();
        }

        break;

      case 'alignRootItemLabels':
      case 'readOnly':
        break;

      case 'width':
        this.callBase(args);

        this._rootLayoutManager.option(args.name, args.value);

        this._alignLabels(this._rootLayoutManager, this._rootLayoutManager.isSingleColumnMode());

        break;

      case 'visible':
        this.callBase(args);

        if (args.value) {
          triggerShownEvent(this.$element());
        }

        break;

      case 'validationGroup':
        ValidationEngine.removeGroup(args.previousValue || this);

        this._invalidate();

        break;

      default:
        this.callBase(args);
    }
  },
  _itemsOptionChangedHandler: function _itemsOptionChangedHandler(args) {
    var nameParts = args.fullName.split('.');
    var value = args.value;

    var itemPath = this._getItemPath(nameParts);

    var item = this.option(itemPath);
    var optionNameWithoutPath = args.fullName.replace(itemPath + '.', '');
    var simpleOptionName = optionNameWithoutPath.split('.')[0].replace(/\[\d+]/, '');

    var itemAction = this._tryCreateItemOptionAction(simpleOptionName, item, item[simpleOptionName], args.previousValue, itemPath);

    var result = this._tryExecuteItemOptionAction(itemAction) || this._tryChangeLayoutManagerItemOption(args.fullName, value);

    if (!result && item) {
      this._changeItemOption(item, optionNameWithoutPath, value);

      var items = this._generateItemsFromData(this.option('items'));

      this.option('items', items);
      result = true;
    }

    return result;
  },
  _formDataOptionChangedHandler: function _formDataOptionChangedHandler(args) {
    var nameParts = args.fullName.split('.');
    var value = args.value;
    var dataField = nameParts.slice(1).join('.');
    var editor = this.getEditor(dataField);

    if (editor) {
      editor.option('value', value);
    } else {
      this._triggerOnFieldDataChanged({
        dataField,
        value
      });
    }

    return true;
  },
  _tryCreateItemOptionAction: function _tryCreateItemOptionAction(optionName, item, value, previousValue, itemPath) {
    if (optionName === 'tabs') {
      this._itemsRunTimeInfo.removeItemsByPathStartWith("".concat(itemPath, ".tabs"));

      value = this._prepareItems(value, true, itemPath, true); // preprocess user value as in _tryPrepareTabbedItem
    }

    return tryCreateItemOptionAction(optionName, {
      item,
      value,
      previousValue,
      itemsRunTimeInfo: this._itemsRunTimeInfo
    });
  },
  _tryExecuteItemOptionAction: function _tryExecuteItemOptionAction(action) {
    return action && action.tryExecute();
  },
  _updateValidationGroupAndSummaryIfNeeded: function _updateValidationGroupAndSummaryIfNeeded(fullName) {
    var optionName = getOptionNameFromFullName(fullName);

    if (ITEM_OPTIONS_FOR_VALIDATION_UPDATING.indexOf(optionName) > -1) {
      ValidationEngine.addGroup(this._getValidationGroup());

      if (this.option('showValidationSummary')) {
        var _this$_validationSumm2;

        (_this$_validationSumm2 = this._validationSummary) === null || _this$_validationSumm2 === void 0 ? void 0 : _this$_validationSumm2._initGroupRegistration();
      }
    }
  },

  _setLayoutManagerItemOption(layoutManager, optionName, value, path) {
    if (this._updateLockCount > 0) {
      !layoutManager._updateLockCount && layoutManager.beginUpdate();

      var key = this._itemsRunTimeInfo.findKeyByPath(path);

      this.postponedOperations.add(key, () => {
        !layoutManager._disposed && layoutManager.endUpdate();
        return new Deferred().resolve();
      });
    }

    var contentReadyHandler = e => {
      e.component.off('contentReady', contentReadyHandler);

      if (isFullPathContainsTabs(path)) {
        var tabPath = tryGetTabPath(path);

        var tabLayoutManager = this._itemsRunTimeInfo.findGroupOrTabLayoutManagerByPath(tabPath);

        if (tabLayoutManager) {
          this._alignLabelsInColumn({
            items: tabLayoutManager.option('items'),
            layoutManager: tabLayoutManager,
            $container: tabLayoutManager.$element(),
            inOneColumn: tabLayoutManager.isSingleColumnMode()
          });
        }
      } else {
        this._alignLabels(this._rootLayoutManager, this._rootLayoutManager.isSingleColumnMode());
      }
    };

    layoutManager.on('contentReady', contentReadyHandler);
    layoutManager.option(optionName, value);

    this._updateValidationGroupAndSummaryIfNeeded(optionName);
  },

  _tryChangeLayoutManagerItemOption(fullName, value) {
    var nameParts = fullName.split('.');
    var optionName = getOptionNameFromFullName(fullName);

    if (optionName === 'items' && nameParts.length > 1) {
      var itemPath = this._getItemPath(nameParts);

      var layoutManager = this._itemsRunTimeInfo.findGroupOrTabLayoutManagerByPath(itemPath);

      if (layoutManager) {
        this._itemsRunTimeInfo.removeItemsByItems(layoutManager.getItemsRunTimeInfo());

        var items = this._prepareItems(value, false, itemPath);

        this._setLayoutManagerItemOption(layoutManager, optionName, items, itemPath);

        return true;
      }
    } else if (nameParts.length > 2) {
      var endPartIndex = nameParts.length - 2;

      var _itemPath = this._getItemPath(nameParts.slice(0, endPartIndex));

      var _layoutManager = this._itemsRunTimeInfo.findGroupOrTabLayoutManagerByPath(_itemPath);

      if (_layoutManager) {
        var fullOptionName = getFullOptionName(nameParts[endPartIndex], optionName);

        if (optionName === 'editorType') {
          // T903774
          if (_layoutManager.option(fullOptionName) !== value) {
            return false;
          }
        }

        if (optionName === 'visible') {
          // T874843
          var formItems = this.option(getFullOptionName(_itemPath, 'items'));

          if (formItems && formItems.length) {
            var layoutManagerItems = _layoutManager.option('items');

            formItems.forEach((item, index) => {
              var layoutItem = layoutManagerItems[index];
              layoutItem.visibleIndex = item.visibleIndex;
            });
          }
        }

        this._setLayoutManagerItemOption(_layoutManager, fullOptionName, value, _itemPath);

        return true;
      }
    }

    return false;
  },

  _tryChangeLayoutManagerItemOptions(itemPath, options) {
    var result;
    this.beginUpdate();
    each(options, (optionName, optionValue) => {
      result = this._tryChangeLayoutManagerItemOption(getFullOptionName(itemPath, optionName), optionValue);

      if (!result) {
        return false;
      }
    });
    this.endUpdate();
    return result;
  },

  _getItemPath: function _getItemPath(nameParts) {
    var itemPath = nameParts[0];
    var i;

    for (i = 1; i < nameParts.length; i++) {
      if (nameParts[i].search(/items\[\d+]|tabs\[\d+]/) !== -1) {
        itemPath += '.' + nameParts[i];
      } else {
        break;
      }
    }

    return itemPath;
  },
  _triggerOnFieldDataChanged: function _triggerOnFieldDataChanged(args) {
    this._createActionByOption('onFieldDataChanged')(args);
  },
  _triggerOnFieldDataChangedByDataSet: function _triggerOnFieldDataChangedByDataSet(data) {
    var that = this;

    if (data && isObject(data)) {
      each(data, function (dataField, value) {
        that._triggerOnFieldDataChanged({
          dataField: dataField,
          value: value
        });
      });
    }
  },
  _updateFieldValue: function _updateFieldValue(dataField, value) {
    if (isDefined(this.option('formData'))) {
      var editor = this.getEditor(dataField);
      this.option('formData.' + dataField, value);

      if (editor) {
        var editorValue = editor.option('value');

        if (editorValue !== value) {
          editor.option('value', value);
        }
      }
    }
  },
  _generateItemsFromData: function _generateItemsFromData(items) {
    var formData = this.option('formData');
    var result = [];

    if (!items && isDefined(formData)) {
      each(formData, function (dataField) {
        result.push({
          dataField: dataField
        });
      });
    }

    if (items) {
      each(items, function (index, item) {
        if (isObject(item)) {
          result.push(item);
        } else {
          result.push({
            dataField: item
          });
        }
      });
    }

    return result;
  },
  _getItemByField: function _getItemByField(field, items) {
    var that = this;
    var fieldParts = isObject(field) ? field : that._getFieldParts(field);
    var fieldName = fieldParts.fieldName;
    var fieldPath = fieldParts.fieldPath;
    var resultItem;

    if (items.length) {
      each(items, function (index, item) {
        var itemType = item.itemType;

        if (fieldPath.length) {
          var path = fieldPath.slice();
          item = that._getItemByFieldPath(path, fieldName, item);
        } else if (itemType === 'group' && !(item.caption || item.name) || itemType === 'tabbed' && !item.name) {
          var subItemsField = that._getSubItemField(itemType);

          item.items = that._generateItemsFromData(item.items);
          item = that._getItemByField({
            fieldName: fieldName,
            fieldPath: fieldPath
          }, item[subItemsField]);
        }

        if (isEqualToDataFieldOrNameOrTitleOrCaption(item, fieldName)) {
          resultItem = item;
          return false;
        }
      });
    }

    return resultItem;
  },
  _getFieldParts: function _getFieldParts(field) {
    var fieldSeparator = '.';
    var fieldName = field;
    var separatorIndex = fieldName.indexOf(fieldSeparator);
    var resultPath = [];

    while (separatorIndex !== -1) {
      resultPath.push(fieldName.substr(0, separatorIndex));
      fieldName = fieldName.substr(separatorIndex + 1);
      separatorIndex = fieldName.indexOf(fieldSeparator);
    }

    return {
      fieldName: fieldName,
      fieldPath: resultPath.reverse()
    };
  },
  _getItemByFieldPath: function _getItemByFieldPath(path, fieldName, item) {
    var that = this;
    var itemType = item.itemType;

    var subItemsField = that._getSubItemField(itemType);

    var isItemWithSubItems = itemType === 'group' || itemType === 'tabbed' || item.title;
    var result;

    do {
      if (isItemWithSubItems) {
        var name = item.name || item.caption || item.title;
        var isGroupWithName = isDefined(name);
        var nameWithoutSpaces = getTextWithoutSpaces(name);
        var pathNode = void 0;
        item[subItemsField] = that._generateItemsFromData(item[subItemsField]);

        if (isGroupWithName) {
          pathNode = path.pop();
        }

        if (!path.length) {
          result = that._getItemByField(fieldName, item[subItemsField]);

          if (result) {
            break;
          }
        }

        if (!isGroupWithName || isGroupWithName && nameWithoutSpaces === pathNode) {
          if (path.length) {
            result = that._searchItemInEverySubItem(path, fieldName, item[subItemsField]);
          }
        }
      } else {
        break;
      }
    } while (path.length && !isDefined(result));

    return result;
  },
  _getSubItemField: function _getSubItemField(itemType) {
    return itemType === 'tabbed' ? 'tabs' : 'items';
  },
  _searchItemInEverySubItem: function _searchItemInEverySubItem(path, fieldName, items) {
    var that = this;
    var result;
    each(items, function (index, groupItem) {
      result = that._getItemByFieldPath(path.slice(), fieldName, groupItem);

      if (result) {
        return false;
      }
    });

    if (!result) {
      result = false;
    }

    return result;
  },
  _changeItemOption: function _changeItemOption(item, option, value) {
    if (isObject(item)) {
      item[option] = value;
    }
  },
  _dimensionChanged: function _dimensionChanged() {
    var currentScreenFactor = this._getCurrentScreenFactor();

    if (this._lastMarkupScreenFactor !== currentScreenFactor) {
      if (this._isColCountChanged(this._lastMarkupScreenFactor, currentScreenFactor)) {
        this._targetScreenFactor = currentScreenFactor;

        this._refresh();

        this._targetScreenFactor = undefined;
      }

      this._lastMarkupScreenFactor = currentScreenFactor;
    }
  },
  _isColCountChanged: function _isColCountChanged(oldScreenSize, newScreenSize) {
    var isChanged = false;
    each(this._cachedColCountOptions, function (index, item) {
      if (item.colCountByScreen[oldScreenSize] !== item.colCountByScreen[newScreenSize]) {
        isChanged = true;
        return false;
      }
    });
    return isChanged;
  },
  _refresh: function _refresh() {
    var editorSelector = '.' + FOCUSED_STATE_CLASS + ' input, .' + FOCUSED_STATE_CLASS + ' textarea';
    eventsEngine.trigger(this.$element().find(editorSelector), 'change');
    this.callBase();
  },
  _resetValues: function _resetValues() {
    this._itemsRunTimeInfo.each(function (_, itemRunTimeInfo) {
      if (isDefined(itemRunTimeInfo.widgetInstance) && Editor.isEditor(itemRunTimeInfo.widgetInstance)) {
        itemRunTimeInfo.widgetInstance.reset();
        itemRunTimeInfo.widgetInstance.option('isValid', true);
      }
    });

    ValidationEngine.resetGroup(this._getValidationGroup());
  },
  _updateData: function _updateData(data, value, isComplexData) {
    var that = this;

    var _data = isComplexData ? value : data;

    if (isObject(_data)) {
      each(_data, function (dataField, fieldValue) {
        that._updateData(isComplexData ? data + '.' + dataField : dataField, fieldValue, isObject(fieldValue));
      });
    } else if (isString(data)) {
      that._updateFieldValue(data, value);
    }
  },
  registerKeyHandler: function registerKeyHandler(key, handler) {
    this.callBase(key, handler);

    this._itemsRunTimeInfo.each(function (_, itemRunTimeInfo) {
      if (isDefined(itemRunTimeInfo.widgetInstance)) {
        itemRunTimeInfo.widgetInstance.registerKeyHandler(key, handler);
      }
    });
  },
  _focusTarget: function _focusTarget() {
    return this.$element().find('.' + FIELD_ITEM_CONTENT_CLASS + ' [tabindex]').first();
  },
  _visibilityChanged: function _visibilityChanged() {},
  _clearAutoColCountChangedTimeout: function _clearAutoColCountChangedTimeout() {
    if (this.autoColCountChangedTimeoutId) {
      clearTimeout(this.autoColCountChangedTimeoutId);
      this.autoColCountChangedTimeoutId = undefined;
    }
  },
  _dispose: function _dispose() {
    this._clearAutoColCountChangedTimeout();

    ValidationEngine.removeGroup(this._getValidationGroup());
    this.callBase();
  },
  resetValues: function resetValues() {
    this._resetValues();
  },
  updateData: function updateData(data, value) {
    this._updateData(data, value);
  },
  getEditor: function getEditor(dataField) {
    return this._itemsRunTimeInfo.findWidgetInstanceByDataField(dataField) || this._itemsRunTimeInfo.findWidgetInstanceByName(dataField);
  },
  getButton: function getButton(name) {
    return this._itemsRunTimeInfo.findWidgetInstanceByName(name);
  },
  updateDimensions: function updateDimensions() {
    var that = this;
    var deferred = new Deferred();

    if (that._scrollable) {
      that._scrollable.update().done(function () {
        deferred.resolveWith(that);
      });
    } else {
      deferred.resolveWith(that);
    }

    return deferred.promise();
  },
  itemOption: function itemOption(id, option, value) {
    var items = this._generateItemsFromData(this.option('items'));

    var item = this._getItemByField(id, items);

    var path = getItemPath(items, item);

    if (!item) {
      return;
    }

    switch (arguments.length) {
      case 1:
        return item;

      case 3:
        {
          var itemAction = this._tryCreateItemOptionAction(option, item, value, item[option], path);

          this._changeItemOption(item, option, value);

          var fullName = getFullOptionName(path, option);

          if (!this._tryExecuteItemOptionAction(itemAction) && !this._tryChangeLayoutManagerItemOption(fullName, value)) {
            this.option('items', items);
          }

          break;
        }

      default:
        {
          if (isObject(option)) {
            if (!this._tryChangeLayoutManagerItemOptions(path, option)) {
              var allowUpdateItems;
              each(option, (optionName, optionValue) => {
                var itemAction = this._tryCreateItemOptionAction(optionName, item, optionValue, item[optionName], path);

                this._changeItemOption(item, optionName, optionValue);

                if (!allowUpdateItems && !this._tryExecuteItemOptionAction(itemAction)) {
                  allowUpdateItems = true;
                }
              });
              allowUpdateItems && this.option('items', items);
            }
          }

          break;
        }
    }
  },
  validate: function validate() {
    return ValidationEngine.validateGroup(this._getValidationGroup());
  },
  getItemID: function getItemID(name) {
    return 'dx_' + this.option('formID') + '_' + (name || new Guid());
  },
  getTargetScreenFactor: function getTargetScreenFactor() {
    return this._targetScreenFactor;
  }
});
registerComponent('dxForm', Form);
export default Form;