"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));

var _guid = _interopRequireDefault(require("../../core/guid"));

var _common = require("../../core/utils/common");

var _config = _interopRequireDefault(require("../../core/config"));

var _type = require("../../core/utils/type");

var _iterator = require("../../core/utils/iterator");

var _array = require("../../core/utils/array");

var _extend = require("../../core/utils/extend");

var _visibility_change = require("../../events/visibility_change");

var _element = require("../../core/element");

var _message = _interopRequireDefault(require("../../localization/message"));

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _editor = _interopRequireDefault(require("../editor/editor"));

var _window = require("../../core/utils/window");

var _validation_engine = _interopRequireDefault(require("../validation_engine"));

var _uiForm = _interopRequireDefault(require("./ui.form.items_runtime_info"));

var _tab_panel = _interopRequireDefault(require("../tab_panel"));

var _ui2 = _interopRequireDefault(require("../scroll_view/ui.scrollable"));

var _deferred = require("../../core/utils/deferred");

var _themes = require("../themes");

var _uiForm2 = _interopRequireDefault(require("./ui.form.item_options_actions"));

require("./ui.form.layout_manager");

var _uiForm4 = require("./ui.form.utils");

var _uiFormLayout_manager = require("./ui.form.layout_manager.utils");

var _label = require("./components/label");

require("../validation_summary");

require("../validation_group");

var _constants = require("./constants");

var _constants2 = require("../toolbar/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var FOCUSED_STATE_CLASS = 'dx-state-focused';
var ITEM_OPTIONS_FOR_VALIDATION_UPDATING = ['items', 'isRequired', 'validationRules', 'visible'];

var Form = _ui.default.inherit({
  _init: function _init() {
    this.callBase();
    this._cachedColCountOptions = [];
    this._itemsRunTimeInfo = new _uiForm.default();
    this._groupsColCount = [];

    this._attachSyncSubscriptions();
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      formID: 'dx-' + new _guid.default(),
      formData: {},
      colCount: 1,
      screenByWidth: _window.defaultScreenFactorFunc,
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
      optionalMark: _message.default.format('dxForm-optionalMark'),
      requiredMessage: _message.default.getFormatter('dxForm-requiredMessage'),
      showValidationSummary: false,
      items: undefined,
      scrollingEnabled: false,
      validationGroup: undefined,
      stylingMode: (0, _config.default)().editorStylingMode,
      labelMode: 'outside'
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: function device() {
        return (0, _themes.isMaterial)();
      },
      options: {
        showColonAfterLabel: false,
        labelLocation: 'top'
      }
    }]);
  },
  _setOptionsByReference: function _setOptionsByReference() {
    this.callBase();
    (0, _extend.extend)(this._optionsByReference, {
      formData: true,
      validationGroup: true
    });
  },
  _getGroupColCount: function _getGroupColCount($element) {
    return parseInt($element.attr(_constants.GROUP_COL_COUNT_ATTR));
  },
  _applyLabelsWidthByCol: function _applyLabelsWidthByCol($container, index) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var labelMarkOptions = arguments.length > 3 ? arguments[3] : undefined;
    var fieldItemClass = options.inOneColumn ? _constants.FIELD_ITEM_CLASS : _constants.FORM_FIELD_ITEM_COL_CLASS + index;
    var cssExcludeTabbedSelector = options.excludeTabbed ? ":not(.".concat(_constants.FIELD_ITEM_TAB_CLASS, ")") : '';
    (0, _label.setLabelWidthByMaxLabelWidth)($container, ".".concat(fieldItemClass).concat(cssExcludeTabbedSelector), labelMarkOptions);
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
    var cssColCountSelector = (0, _type.isDefined)(colCount) ? '.' + _constants.GROUP_COL_COUNT_CLASS + colCount : '';
    var groupSelector = '.' + _constants.FORM_FIELD_ITEM_COL_CLASS + columnIndex + ' > .' + _constants.FIELD_ITEM_CONTENT_CLASS + ' > .' + _constants.FORM_GROUP_CLASS + cssColCountSelector;
    return $container.find(groupSelector);
  },
  _applyLabelsWidthWithGroups: function _applyLabelsWidthWithGroups($container, colCount, excludeTabbed, labelMarkOptions) {
    if (this.option('alignRootItemLabels') === true) {
      // TODO: private option
      var $rootSimpleItems = $container.find(".".concat(_constants.ROOT_SIMPLE_ITEM_CLASS));

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
      var $groups = this.$element().find('.' + _constants.FORM_GROUP_CLASS);
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
    var layoutManager = _ref.layoutManager,
        inOneColumn = _ref.inOneColumn,
        $container = _ref.$container,
        excludeTabbed = _ref.excludeTabbed,
        items = _ref.items;

    if (!(0, _window.hasWindow)() || this._labelLocation() === 'top') {
      // TODO: label location can be changed to 'left/right' for some labels
      // but this condition disables alignment for such items
      return;
    }

    var labelMarkOptions = (0, _uiFormLayout_manager.convertToLabelMarkOptions)(layoutManager._getMarkOptions());

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
    if (!(0, _type.isDefined)(this.option('formData'))) {
      this.option('formData', {});
    }
  },
  _setStylingModeClass: function _setStylingModeClass() {
    if (this.option('stylingMode') === 'underlined') {
      this.$element().addClass(_constants.FORM_UNDERLINED_CLASS);
    }
  },
  _initMarkup: function _initMarkup() {
    _validation_engine.default.addGroup(this._getValidationGroup());

    this._clearCachedInstances();

    this._prepareFormData();

    this.$element().addClass(_constants.FORM_CLASS);

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
    return (0, _window.hasWindow)() ? (0, _window.getCurrentScreenFactor)(this.option('screenByWidth')) : 'lg';
  },
  _clearCachedInstances: function _clearCachedInstances() {
    this._itemsRunTimeInfo.clear();

    this._cachedLayoutManagers = [];
  },
  _alignLabels: function _alignLabels(layoutManager, inOneColumn) {
    this._alignLabelsInColumn({
      $container: this.$element(),
      layoutManager: layoutManager,
      excludeTabbed: true,
      items: this.option('items'),
      inOneColumn: inOneColumn
    });

    (0, _visibility_change.triggerResizeEvent)(this.$element().find(".".concat(_constants2.TOOLBAR_CLASS)));
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
    this._scrollable = new _ui2.default(this.$element(), {
      useNative: !!useNativeScrolling,
      useSimulatedScrollbar: !useNativeScrolling,
      useKeyboard: false,
      direction: 'both',
      bounceEnabled: false
    });
  },
  _getContent: function _getContent() {
    return this.option('scrollingEnabled') ? (0, _renderer.default)(this._scrollable.content()) : this.$element();
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
      this._$validationSummary = (0, _renderer.default)('<div>').addClass(_constants.FORM_VALIDATION_SUMMARY).appendTo(this._getContent());
      this._validationSummary = this._$validationSummary.dxValidationSummary({
        validationGroup: this._getValidationGroup()
      }).dxValidationSummary('instance');
    }
  },
  _prepareItems: function _prepareItems(items, parentIsTabbedItem, currentPath, isTabs) {
    if (items) {
      var result = [];

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var path = (0, _uiForm4.concatPaths)(currentPath, (0, _uiForm4.createItemPathByIndex)(i, isTabs));
        var itemRunTimeInfo = {
          item: item,
          itemIndex: i,
          path: path
        };

        var guid = this._itemsRunTimeInfo.add(itemRunTimeInfo);

        if ((0, _type.isString)(item)) {
          item = {
            dataField: item
          };
        }

        if ((0, _type.isObject)(item)) {
          var preparedItem = _extends({}, item);

          itemRunTimeInfo.preparedItem = preparedItem;
          preparedItem.guid = guid;

          this._tryPrepareGroupItem(preparedItem);

          this._tryPrepareTabbedItem(preparedItem, path);

          this._tryPrepareItemTemplate(preparedItem);

          if (parentIsTabbedItem) {
            preparedItem.cssItemClass = _constants.FIELD_ITEM_TAB_CLASS;
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
    var _this = this;

    if (item.itemType === 'group') {
      item.alignItemLabels = (0, _common.ensureDefined)(item.alignItemLabels, true);

      item._prepareGroupItemTemplate = function (itemTemplate) {
        if (item.template) {
          item.groupContentTemplate = _this._getTemplate(itemTemplate);
        }

        item.template = _this._itemGroupTemplate.bind(_this, item);
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


    items = that._prepareItems(items); //#DEBUG

    that._testResultItems = items; //#ENDDEBUG

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
    var _this2 = this;

    var $tabPanel = (0, _renderer.default)('<div>').appendTo($container);
    var tabPanelOptions = (0, _extend.extend)({}, item.tabPanelOptions, {
      dataSource: item.tabs,
      onItemRendered: function onItemRendered(args) {
        return (0, _visibility_change.triggerShownEvent)(args.itemElement);
      },
      itemTemplate: function itemTemplate(itemData, e, container) {
        var $container = (0, _renderer.default)(container);
        var alignItemLabels = (0, _common.ensureDefined)(itemData.alignItemLabels, true);

        var layoutManager = _this2._renderLayoutManager($container, _this2._createLayoutManagerOptions(_this2._tryGetItemsForTemplate(itemData), {
          colCount: itemData.colCount,
          alignItemLabels: alignItemLabels,
          screenByWidth: _this2.option('screenByWidth'),
          colCountByScreen: itemData.colCountByScreen,
          cssItemClass: itemData.cssItemClass,
          onLayoutChanged: function onLayoutChanged(inOneColumn) {
            _this2._alignLabelsInColumn({
              $container: $container,
              layoutManager: layoutManager,
              items: itemData.items,
              inOneColumn: inOneColumn
            });
          }
        }));

        if (_this2._itemsRunTimeInfo) {
          _this2._itemsRunTimeInfo.extendRunTimeItemInfoByKey(itemData.guid, {
            layoutManager: layoutManager
          });
        }

        if (alignItemLabels) {
          _this2._alignLabelsInColumn({
            $container: $container,
            layoutManager: layoutManager,
            items: itemData.items,
            inOneColumn: layoutManager.isSingleColumnMode()
          });
        }
      }
    });

    var tryUpdateTabPanelInstance = function tryUpdateTabPanelInstance(items, instance) {
      if (Array.isArray(items)) {
        items.forEach(function (item) {
          return _this2._itemsRunTimeInfo.extendRunTimeItemInfoByKey(item.guid, {
            widgetInstance: instance
          });
        });
      }
    };

    var tabPanel = this._createComponent($tabPanel, _tab_panel.default, tabPanelOptions);

    (0, _renderer.default)($container).parent().addClass(_constants.FIELD_ITEM_CONTENT_HAS_TABS_CLASS);
    tabPanel.on('optionChanged', function (e) {
      if (e.fullName === 'dataSource') {
        tryUpdateTabPanelInstance(e.value, e.component);
      }
    });
    tryUpdateTabPanelInstance([{
      guid: item.guid
    }].concat(_toConsumableArray(item.tabs)), tabPanel);
  },
  _itemGroupTemplate: function _itemGroupTemplate(item, e, $container) {
    var _this3 = this;

    var $group = (0, _renderer.default)('<div>').toggleClass(_constants.FORM_GROUP_WITH_CAPTION_CLASS, (0, _type.isDefined)(item.caption) && item.caption.length).addClass(_constants.FORM_GROUP_CLASS).appendTo($container);
    (0, _renderer.default)($container).parent().addClass(_constants.FIELD_ITEM_CONTENT_HAS_GROUP_CLASS);
    var colCount;
    var layoutManager;

    if (item.caption) {
      (0, _renderer.default)('<span>').addClass(_constants.FORM_GROUP_CAPTION_CLASS).text(item.caption).appendTo($group);
    }

    var $groupContent = (0, _renderer.default)('<div>').addClass(_constants.FORM_GROUP_CONTENT_CLASS).appendTo($group);

    if (item.groupContentTemplate) {
      item._renderGroupContentTemplate = function () {
        $groupContent.empty();
        var data = {
          formData: _this3.option('formData'),
          component: _this3
        };
        item.groupContentTemplate.render({
          model: data,
          container: (0, _element.getPublicElement)($groupContent)
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
        layoutManager: layoutManager
      });
      colCount = layoutManager._getColCount();

      if ((0, _array.inArray)(colCount, this._groupsColCount) === -1) {
        this._groupsColCount.push(colCount);
      }

      $group.addClass(_constants.GROUP_COL_COUNT_CLASS + colCount);
      $group.attr(_constants.GROUP_COL_COUNT_ATTR, colCount);
    }
  },
  _createLayoutManagerOptions: function _createLayoutManagerOptions(items, extendedLayoutManagerOptions) {
    var _this4 = this;

    return (0, _uiForm4.convertToLayoutManagerOptions)({
      form: this,
      formOptions: this.option(),
      $formElement: this.$element(),
      items: items,
      validationGroup: this._getValidationGroup(),
      extendedLayoutManagerOptions: extendedLayoutManagerOptions,
      onFieldDataChanged: function onFieldDataChanged(args) {
        if (!_this4._isDataUpdating) {
          _this4._triggerOnFieldDataChanged(args);
        }
      },
      onContentReady: function onContentReady(args) {
        _this4._itemsRunTimeInfo.addItemsOrExtendFrom(args.component._itemsRunTimeInfo);

        extendedLayoutManagerOptions.onContentReady && extendedLayoutManagerOptions.onContentReady(args);
      },
      onDisposing: function onDisposing(_ref2) {
        var component = _ref2.component;
        var nestedItemsRunTimeInfo = component.getItemsRunTimeInfo();

        _this4._itemsRunTimeInfo.removeItemsByItems(nestedItemsRunTimeInfo);
      },
      onFieldItemRendered: function onFieldItemRendered() {
        var _this4$_validationSum;

        (_this4$_validationSum = _this4._validationSummary) === null || _this4$_validationSum === void 0 ? void 0 : _this4$_validationSum._initGroupRegistration();
      }
    });
  },
  _renderLayoutManager: function _renderLayoutManager($parent, layoutManagerOptions) {
    var _this5 = this;

    var baseColCountByScreen = {
      lg: layoutManagerOptions.colCount,
      md: layoutManagerOptions.colCount,
      sm: layoutManagerOptions.colCount,
      xs: 1
    };

    this._cachedColCountOptions.push({
      colCountByScreen: (0, _extend.extend)(baseColCountByScreen, layoutManagerOptions.colCountByScreen)
    });

    var $element = (0, _renderer.default)('<div>');
    $element.appendTo($parent);

    var instance = this._createComponent($element, 'dxLayoutManager', layoutManagerOptions);

    instance.on('autoColCountChanged', function () {
      _this5._clearAutoColCountChangedTimeout();

      _this5.autoColCountChangedTimeoutId = setTimeout(function () {
        return !_this5._disposed && _this5._refresh();
      }, 0);
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
        if (!(0, _type.isDefined)(args.value)) {
          that._options.silent('formData', args.value = {});
        }

        that._triggerOnFieldDataChangedByDataSet(args.value);
      }

      if (that._cachedLayoutManagers.length) {
        (0, _iterator.each)(that._cachedLayoutManagers, function (index, layoutManager) {
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
        } else if ((0, _type.isEmptyObject)(args.value)) {
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
          (0, _visibility_change.triggerShownEvent)(this.$element());
        }

        break;

      case 'validationGroup':
        _validation_engine.default.removeGroup(args.previousValue || this);

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
        dataField: dataField,
        value: value
      });
    }

    return true;
  },
  _tryCreateItemOptionAction: function _tryCreateItemOptionAction(optionName, item, value, previousValue, itemPath) {
    if (optionName === 'tabs') {
      this._itemsRunTimeInfo.removeItemsByPathStartWith("".concat(itemPath, ".tabs"));

      value = this._prepareItems(value, true, itemPath, true); // preprocess user value as in _tryPrepareTabbedItem
    }

    return (0, _uiForm2.default)(optionName, {
      item: item,
      value: value,
      previousValue: previousValue,
      itemsRunTimeInfo: this._itemsRunTimeInfo
    });
  },
  _tryExecuteItemOptionAction: function _tryExecuteItemOptionAction(action) {
    return action && action.tryExecute();
  },
  _updateValidationGroupAndSummaryIfNeeded: function _updateValidationGroupAndSummaryIfNeeded(fullName) {
    var optionName = (0, _uiForm4.getOptionNameFromFullName)(fullName);

    if (ITEM_OPTIONS_FOR_VALIDATION_UPDATING.indexOf(optionName) > -1) {
      _validation_engine.default.addGroup(this._getValidationGroup());

      if (this.option('showValidationSummary')) {
        var _this$_validationSumm;

        (_this$_validationSumm = this._validationSummary) === null || _this$_validationSumm === void 0 ? void 0 : _this$_validationSumm._initGroupRegistration();
      }
    }
  },
  _setLayoutManagerItemOption: function _setLayoutManagerItemOption(layoutManager, optionName, value, path) {
    var _this6 = this;

    if (this._updateLockCount > 0) {
      !layoutManager._updateLockCount && layoutManager.beginUpdate();

      var key = this._itemsRunTimeInfo.findKeyByPath(path);

      this.postponedOperations.add(key, function () {
        !layoutManager._disposed && layoutManager.endUpdate();
        return new _deferred.Deferred().resolve();
      });
    }

    var contentReadyHandler = function contentReadyHandler(e) {
      e.component.off('contentReady', contentReadyHandler);

      if ((0, _uiForm4.isFullPathContainsTabs)(path)) {
        var tabPath = (0, _uiForm4.tryGetTabPath)(path);

        var tabLayoutManager = _this6._itemsRunTimeInfo.findGroupOrTabLayoutManagerByPath(tabPath);

        if (tabLayoutManager) {
          _this6._alignLabelsInColumn({
            items: tabLayoutManager.option('items'),
            layoutManager: tabLayoutManager,
            $container: tabLayoutManager.$element(),
            inOneColumn: tabLayoutManager.isSingleColumnMode()
          });
        }
      } else {
        _this6._alignLabels(_this6._rootLayoutManager, _this6._rootLayoutManager.isSingleColumnMode());
      }
    };

    layoutManager.on('contentReady', contentReadyHandler);
    layoutManager.option(optionName, value);

    this._updateValidationGroupAndSummaryIfNeeded(optionName);
  },
  _tryChangeLayoutManagerItemOption: function _tryChangeLayoutManagerItemOption(fullName, value) {
    var nameParts = fullName.split('.');
    var optionName = (0, _uiForm4.getOptionNameFromFullName)(fullName);

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
        var fullOptionName = (0, _uiForm4.getFullOptionName)(nameParts[endPartIndex], optionName);

        if (optionName === 'editorType') {
          // T903774
          if (_layoutManager.option(fullOptionName) !== value) {
            return false;
          }
        }

        if (optionName === 'visible') {
          // T874843
          var formItems = this.option((0, _uiForm4.getFullOptionName)(_itemPath, 'items'));

          if (formItems && formItems.length) {
            var layoutManagerItems = _layoutManager.option('items');

            formItems.forEach(function (item, index) {
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
  _tryChangeLayoutManagerItemOptions: function _tryChangeLayoutManagerItemOptions(itemPath, options) {
    var _this7 = this;

    var result;
    this.beginUpdate();
    (0, _iterator.each)(options, function (optionName, optionValue) {
      result = _this7._tryChangeLayoutManagerItemOption((0, _uiForm4.getFullOptionName)(itemPath, optionName), optionValue);

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

    if (data && (0, _type.isObject)(data)) {
      (0, _iterator.each)(data, function (dataField, value) {
        that._triggerOnFieldDataChanged({
          dataField: dataField,
          value: value
        });
      });
    }
  },
  _updateFieldValue: function _updateFieldValue(dataField, value) {
    if ((0, _type.isDefined)(this.option('formData'))) {
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

    if (!items && (0, _type.isDefined)(formData)) {
      (0, _iterator.each)(formData, function (dataField) {
        result.push({
          dataField: dataField
        });
      });
    }

    if (items) {
      (0, _iterator.each)(items, function (index, item) {
        if ((0, _type.isObject)(item)) {
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
    var fieldParts = (0, _type.isObject)(field) ? field : that._getFieldParts(field);
    var fieldName = fieldParts.fieldName;
    var fieldPath = fieldParts.fieldPath;
    var resultItem;

    if (items.length) {
      (0, _iterator.each)(items, function (index, item) {
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

        if ((0, _uiForm4.isEqualToDataFieldOrNameOrTitleOrCaption)(item, fieldName)) {
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
        var isGroupWithName = (0, _type.isDefined)(name);
        var nameWithoutSpaces = (0, _uiForm4.getTextWithoutSpaces)(name);
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
    } while (path.length && !(0, _type.isDefined)(result));

    return result;
  },
  _getSubItemField: function _getSubItemField(itemType) {
    return itemType === 'tabbed' ? 'tabs' : 'items';
  },
  _searchItemInEverySubItem: function _searchItemInEverySubItem(path, fieldName, items) {
    var that = this;
    var result;
    (0, _iterator.each)(items, function (index, groupItem) {
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
    if ((0, _type.isObject)(item)) {
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
    (0, _iterator.each)(this._cachedColCountOptions, function (index, item) {
      if (item.colCountByScreen[oldScreenSize] !== item.colCountByScreen[newScreenSize]) {
        isChanged = true;
        return false;
      }
    });
    return isChanged;
  },
  _refresh: function _refresh() {
    var editorSelector = '.' + FOCUSED_STATE_CLASS + ' input, .' + FOCUSED_STATE_CLASS + ' textarea';

    _events_engine.default.trigger(this.$element().find(editorSelector), 'change');

    this.callBase();
  },
  _resetValues: function _resetValues() {
    this._itemsRunTimeInfo.each(function (_, itemRunTimeInfo) {
      if ((0, _type.isDefined)(itemRunTimeInfo.widgetInstance) && _editor.default.isEditor(itemRunTimeInfo.widgetInstance)) {
        itemRunTimeInfo.widgetInstance.reset();
        itemRunTimeInfo.widgetInstance.option('isValid', true);
      }
    });

    _validation_engine.default.resetGroup(this._getValidationGroup());
  },
  _updateData: function _updateData(data, value, isComplexData) {
    var that = this;

    var _data = isComplexData ? value : data;

    if ((0, _type.isObject)(_data)) {
      (0, _iterator.each)(_data, function (dataField, fieldValue) {
        that._updateData(isComplexData ? data + '.' + dataField : dataField, fieldValue, (0, _type.isObject)(fieldValue));
      });
    } else if ((0, _type.isString)(data)) {
      that._updateFieldValue(data, value);
    }
  },
  registerKeyHandler: function registerKeyHandler(key, handler) {
    this.callBase(key, handler);

    this._itemsRunTimeInfo.each(function (_, itemRunTimeInfo) {
      if ((0, _type.isDefined)(itemRunTimeInfo.widgetInstance)) {
        itemRunTimeInfo.widgetInstance.registerKeyHandler(key, handler);
      }
    });
  },
  _focusTarget: function _focusTarget() {
    return this.$element().find('.' + _constants.FIELD_ITEM_CONTENT_CLASS + ' [tabindex]').first();
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

    _validation_engine.default.removeGroup(this._getValidationGroup());

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
    var deferred = new _deferred.Deferred();

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
    var _this8 = this;

    var items = this._generateItemsFromData(this.option('items'));

    var item = this._getItemByField(id, items);

    var path = (0, _uiForm4.getItemPath)(items, item);

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

          var fullName = (0, _uiForm4.getFullOptionName)(path, option);

          if (!this._tryExecuteItemOptionAction(itemAction) && !this._tryChangeLayoutManagerItemOption(fullName, value)) {
            this.option('items', items);
          }

          break;
        }

      default:
        {
          if ((0, _type.isObject)(option)) {
            if (!this._tryChangeLayoutManagerItemOptions(path, option)) {
              var allowUpdateItems;
              (0, _iterator.each)(option, function (optionName, optionValue) {
                var itemAction = _this8._tryCreateItemOptionAction(optionName, item, optionValue, item[optionName], path);

                _this8._changeItemOption(item, optionName, optionValue);

                if (!allowUpdateItems && !_this8._tryExecuteItemOptionAction(itemAction)) {
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
    return _validation_engine.default.validateGroup(this._getValidationGroup());
  },
  getItemID: function getItemID(name) {
    return 'dx_' + this.option('formID') + '_' + (name || new _guid.default());
  },
  getTargetScreenFactor: function getTargetScreenFactor() {
    return this._targetScreenFactor;
  }
});

(0, _component_registrator.default)('dxForm', Form);
var _default = Form;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;