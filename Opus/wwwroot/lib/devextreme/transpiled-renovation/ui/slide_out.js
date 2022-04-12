"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../core/renderer"));

var _element = require("../core/element");

var _common = require("../core/utils/common");

var _type = require("../core/utils/type");

var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));

var _extend = require("../core/utils/extend");

var _uiCollection_widgetEditStrategy = _interopRequireDefault(require("./collection/ui.collection_widget.edit.strategy.plain"));

var _slide_out_view = _interopRequireDefault(require("./slide_out_view"));

var _uiCollection_widget = _interopRequireDefault(require("./collection/ui.collection_widget.edit"));

var _list_light = _interopRequireDefault(require("./list_light"));

var _child_default_template = require("../core/templates/child_default_template");

var _empty_template = require("../core/templates/empty_template");

var _grouped_data_converter_mixin = _interopRequireDefault(require("./shared/grouped_data_converter_mixin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// STYLE slideOut
var SLIDEOUT_CLASS = 'dx-slideout';
var SLIDEOUT_ITEM_CONTAINER_CLASS = 'dx-slideout-item-container';
var SLIDEOUT_MENU = 'dx-slideout-menu';
var SLIDEOUT_ITEM_CLASS = 'dx-slideout-item';
var SLIDEOUT_ITEM_DATA_KEY = 'dxSlideoutItemData';

var SlideOut = _uiCollection_widget.default.inherit({
  ctor: function ctor(element, options) {
    this.callBase(element, options);

    this._logDeprecatedComponentWarning('20.1', 'dxDrawer');
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      activeStateEnabled: false,
      menuItemTemplate: 'menuItem',
      swipeEnabled: true,
      menuVisible: false,
      menuPosition: 'normal',
      menuGrouped: false,
      menuGroupTemplate: 'menuGroup',
      onMenuItemRendered: null,
      onMenuGroupRendered: null,
      contentTemplate: 'content',
      selectionMode: 'single',
      selectedIndex: 0,
      selectionRequired: true
      /**
      * @name dxSlideOutOptions.selectedItems
      * @hidden
      */

      /**
      * @name dxSlideOutOptions.selectedItemKeys
      * @hidden
      */

      /**
      * @name dxSlideOutOptions.keyExpr
      * @hidden
      */

      /**
      * @name dxSlideOutOptions.focusStateEnabled
      * @hidden
      */

      /**
      * @name dxSlideOutOptions.accessKey
      * @hidden
      */

      /**
      * @name dxSlideOutOptions.tabIndex
      * @hidden
      */

    });
  },
  _itemClass: function _itemClass() {
    return SLIDEOUT_ITEM_CLASS;
  },
  _itemDataKey: function _itemDataKey() {
    return SLIDEOUT_ITEM_DATA_KEY;
  },
  _itemContainer: function _itemContainer() {
    return (0, _renderer.default)(this._slideOutView.content());
  },
  _init: function _init() {
    this._selectedItemContentRendered = false;
    this.callBase();
    this.$element().addClass(SLIDEOUT_CLASS);

    this._initSlideOutView();
  },
  _initTemplates: function _initTemplates() {
    this.callBase();

    this._templateManager.addDefaultTemplates({
      menuItem: new _child_default_template.ChildDefaultTemplate('item'),
      menuGroup: new _child_default_template.ChildDefaultTemplate('group'),
      content: new _empty_template.EmptyTemplate()
    });
  },
  _initEditStrategy: function _initEditStrategy() {
    if (this.option('menuGrouped')) {
      var strategy = _uiCollection_widgetEditStrategy.default.inherit({
        _getPlainItems: function _getPlainItems() {
          return this.callBase().reduce(function (result, group) {
            result.push.apply(result, group.items);
            return result;
          }, []);
        }
      });

      this._editStrategy = new strategy(this);
    } else {
      this.callBase();
    }
  },
  _initSlideOutView: function _initSlideOutView() {
    this._slideOutView = this._createComponent(this.$element(), _slide_out_view.default, {
      integrationOptions: {},
      menuVisible: this.option('menuVisible'),
      swipeEnabled: this.option('swipeEnabled'),
      menuPosition: this.option('menuPosition'),
      onOptionChanged: this._slideOutViewOptionChanged.bind(this)
    });

    this._itemContainer().addClass(SLIDEOUT_ITEM_CONTAINER_CLASS);
  },
  _slideOutViewOptionChanged: function _slideOutViewOptionChanged(args) {
    if (args.name === 'menuVisible') {
      this.option(args.name, args.value);
    }
  },
  _initMarkup: function _initMarkup() {
    this._renderList();

    this._renderContentTemplate();

    this.callBase();
  },
  _render: function _render() {
    // TODO: remove this, needed for memory leak tests
    this._slideOutView._renderShield();

    this.callBase();
  },
  _renderList: function _renderList() {
    var $list = this._list && this._list.$element() || (0, _renderer.default)('<div>').addClass(SLIDEOUT_MENU).appendTo((0, _renderer.default)(this._slideOutView.menuContent()));

    this._renderItemClickAction();

    this._list = this._createComponent($list, _list_light.default, {
      itemTemplateProperty: 'menuTemplate',
      selectionMode: this.option('selectionMode'),
      selectionRequired: this.option('selectionRequired'),
      indicateLoading: false,
      onItemClick: this._listItemClickHandler.bind(this),
      items: this.option('items'),
      dataSource: this._dataSource,
      itemTemplate: this._getTemplateByOption('menuItemTemplate'),
      grouped: this.option('menuGrouped'),
      groupTemplate: this._getTemplateByOption('menuGroupTemplate'),
      onItemRendered: this.option('onMenuItemRendered'),
      onGroupRendered: this.option('onMenuGroupRendered'),
      onContentReady: this._updateSlideOutView.bind(this)
    });

    this._list.option('selectedIndex', this.option('selectedIndex'));
  },
  _getGroupedOption: function _getGroupedOption() {
    return this.option('menuGrouped');
  },
  _updateSlideOutView: function _updateSlideOutView() {
    this._slideOutView._dimensionChanged();
  },
  _renderItemClickAction: function _renderItemClickAction() {
    this._itemClickAction = this._createActionByOption('onItemClick');
  },
  _listItemClickHandler: function _listItemClickHandler(e) {
    var selectedIndex = this._list.$element().find('.dx-list-item').index(e.itemElement);

    this.option('selectedIndex', selectedIndex);

    this._itemClickAction(e);
  },
  _renderContentTemplate: function _renderContentTemplate() {
    if ((0, _type.isDefined)(this._singleContent)) {
      return;
    }

    var itemsLength = this._itemContainer().html().length;

    this._getTemplateByOption('contentTemplate').render({
      container: (0, _element.getPublicElement)(this._itemContainer())
    });

    this._singleContent = this._itemContainer().html().length !== itemsLength;
  },
  _itemClickHandler: _common.noop,
  _renderContentImpl: function _renderContentImpl() {
    if (this._singleContent) {
      return;
    }

    var items = this.option('items');
    var selectedIndex = this.option('selectedIndex');

    if (items.length && selectedIndex > -1) {
      this._selectedItemContentRendered = true;

      var selectedItem = this._list.getItemByIndex(selectedIndex);

      this._renderItems([selectedItem]);
    }
  },
  _renderItem: function _renderItem(index, item) {
    this._itemContainer().find('.' + SLIDEOUT_ITEM_CLASS).remove();

    this.callBase(index, item);
  },
  _selectedItemElement: function _selectedItemElement() {
    return this._itemElements().eq(0);
  },
  _updateSelection: function _updateSelection() {
    this._prepareContent();

    this._renderContent();
  },
  _getListWidth: function _getListWidth() {
    return this._slideOutView._getMenuWidth();
  },
  _changeMenuOption: function _changeMenuOption(name, value) {
    this._list.option(name, value);

    this._updateSlideOutView();
  },
  _cleanItemContainer: function _cleanItemContainer() {
    if (this._singleContent) {
      return;
    }

    this.callBase();
  },
  beginUpdate: function beginUpdate() {
    this.callBase();
    this._list && this._list.beginUpdate();
  },
  endUpdate: function endUpdate() {
    this._list && this._list.endUpdate();
    this.callBase();
  },
  _optionChanged: function _optionChanged(args) {
    var name = args.name;
    var value = args.value;

    switch (name) {
      case 'menuVisible':
      case 'swipeEnabled':
      case 'rtlEnabled':
      case 'menuPosition':
        this._slideOutView.option(name, value);

        break;

      case 'width':
        this.callBase(args);

        this._updateSlideOutView();

        break;

      case 'menuItemTemplate':
        this._changeMenuOption('itemTemplate', this._getTemplate(value));

        break;

      case 'items':
        this._changeMenuOption('items', this.option('items'));

        if (!this._selectedItemContentRendered) {
          this._updateSelection();
        }

        break;

      case 'dataSource':
      case 'selectedIndex':
      case 'selectedItem':
        this._changeMenuOption(name, value);

        this.callBase(args);
        break;

      case 'menuGrouped':
        this._initEditStrategy();

        this._changeMenuOption('grouped', value);

        break;

      case 'menuGroupTemplate':
        this._changeMenuOption('groupTemplate', this._getTemplate(value));

        break;

      case 'onMenuItemRendered':
        this._changeMenuOption('onItemRendered', value);

        break;

      case 'onMenuGroupRendered':
        this._changeMenuOption('onGroupRendered', value);

        break;

      case 'onItemClick':
        this._renderItemClickAction();

        break;

      case 'contentTemplate':
        this._singleContent = null;

        this._invalidate();

        break;

      default:
        this.callBase(args);
    }
  },
  showMenu: function showMenu() {
    return this._slideOutView.toggleMenuVisibility(true);
  },
  hideMenu: function hideMenu() {
    return this._slideOutView.toggleMenuVisibility(false);
  },
  toggleMenuVisibility: function toggleMenuVisibility(showing) {
    return this._slideOutView.toggleMenuVisibility(showing);
  }
  /**
  * @name dxSlideOut.registerKeyHandler
  * @publicName registerKeyHandler(key, handler)
  * @hidden
  */

  /**
  * @name dxSlideOut.focus
  * @publicName focus()
  * @hidden
  */

}).include(_grouped_data_converter_mixin.default);

(0, _component_registrator.default)('dxSlideOut', SlideOut);
var _default = SlideOut;
/**
 * @name dxSlideOutItem
 * @inherits CollectionWidgetItem
 * @type object
 */

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;