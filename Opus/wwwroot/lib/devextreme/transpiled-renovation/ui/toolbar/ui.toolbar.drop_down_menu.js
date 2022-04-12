"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));

var _uiToolbar = _interopRequireDefault(require("./ui.toolbar.menu"));

var _drop_down_menu = _interopRequireDefault(require("../drop_down_menu"));

var _devices = _interopRequireDefault(require("../../core/devices"));

var _iterator = require("../../core/utils/iterator");

var _data = require("../../core/utils/data");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MENU_INVISIBLE_CLASS = 'dx-state-invisible';
var TOOLBAR_dropDownMenu_CONTAINER_CLASS = 'dx-toolbar-menu-container';
var POPOVER_BOUNDARY_OFFSET = 10;

var ToolbarDropDownMenu = /*#__PURE__*/function () {
  function ToolbarDropDownMenu(toolbar) {
    this._toolbar = toolbar;
  }

  var _proto = ToolbarDropDownMenu.prototype;

  _proto.render = function render() {
    if (!this._hasVisibleMenuItems()) {
      return;
    }

    this._renderMenuButtonContainer();

    var $menu = (0, _renderer.default)('<div>').appendTo(this._dropDownMenuContainer());
    this._dropDownMenu = this._toolbar._createComponent($menu, _drop_down_menu.default, this._dropDownMenuOptions());
    this.renderMenuItems();
  };

  _proto.renderMenuItems = function renderMenuItems() {
    if (!this._dropDownMenu) {
      this.render();
    }

    this._dropDownMenu && this._dropDownMenu.option('items', this._getMenuItems());

    if (this._dropDownMenu && !this._dropDownMenu.option('items').length) {
      this._dropDownMenu.close();
    }
  };

  _proto._renderMenuButtonContainer = function _renderMenuButtonContainer() {
    var $afterSection = this._toolbar._$afterSection;
    this._$menuButtonContainer = (0, _renderer.default)('<div>').appendTo($afterSection).addClass(this._toolbar._buttonClass()).addClass(TOOLBAR_dropDownMenu_CONTAINER_CLASS);
  };

  _proto._getMenuItemTemplate = function _getMenuItemTemplate() {
    return this._toolbar._getTemplateByOption('menuItemTemplate');
  };

  _proto._dropDownMenuOptions = function _dropDownMenuOptions() {
    var _this = this;

    var itemClickAction = this._toolbar._createActionByOption('onItemClick');

    var topAndBottomOffset = 2 * POPOVER_BOUNDARY_OFFSET;
    return {
      disabled: this._toolbar.option('disabled'),
      itemTemplate: this._getMenuItemTemplate.bind(this),
      onItemClick: function (e) {
        itemClickAction(e);
      }.bind(this),
      deferRendering: true,
      container: this._toolbar.option('menuContainer'),
      popupMaxHeight: _devices.default.current().platform === 'android' // T1010948
      ? _dom_adapter.default.getDocumentElement().clientHeight - topAndBottomOffset : undefined,
      menuWidget: _uiToolbar.default,
      onOptionChanged: function onOptionChanged(_ref) {
        var name = _ref.name,
            value = _ref.value;

        if (name === 'opened') {
          _this._toolbar.option('overflowMenuVisible', value);
        }

        if (name === 'items') {
          _this._updateMenuVisibility(value);
        }
      },
      popupPosition: {
        at: 'bottom right',
        my: 'top right'
      }
    };
  };

  _proto._updateMenuVisibility = function _updateMenuVisibility(menuItems) {
    var items = menuItems || this._getMenuItems();

    var isMenuVisible = items.length && this._hasVisibleMenuItems(items);

    this._toggleMenuVisibility(isMenuVisible);
  };

  _proto._getMenuItems = function _getMenuItems() {
    return this._toolbar._getMenuItems();
  };

  _proto._hasVisibleMenuItems = function _hasVisibleMenuItems(items) {
    var menuItems = items || this._toolbar.option('items');

    var result = false;
    var optionGetter = (0, _data.compileGetter)('visible');
    var overflowGetter = (0, _data.compileGetter)('locateInMenu');
    (0, _iterator.each)(menuItems, function (index, item) {
      var itemVisible = optionGetter(item, {
        functionsAsIs: true
      });
      var itemOverflow = overflowGetter(item, {
        functionsAsIs: true
      });

      if (itemVisible !== false && (itemOverflow === 'auto' || itemOverflow === 'always') || item.location === 'menu') {
        result = true;
      }
    });
    return result;
  };

  _proto._toggleMenuVisibility = function _toggleMenuVisibility(value) {
    if (!this._dropDownMenuContainer()) {
      return;
    }

    this._dropDownMenuContainer().toggleClass(MENU_INVISIBLE_CLASS, !value);
  };

  _proto._dropDownMenuContainer = function _dropDownMenuContainer() {
    return this._$menuButtonContainer;
  };

  _proto.widgetOption = function widgetOption(name, value) {
    this._dropDownMenu && this._dropDownMenu.option(name, value);
  };

  _proto.itemOption = function itemOption(item, property, value) {
    if (property === 'disabled' || property === 'options.disabled') {
      var _this$_dropDownMenu;

      (_this$_dropDownMenu = this._dropDownMenu) === null || _this$_dropDownMenu === void 0 ? void 0 : _this$_dropDownMenu._itemOptionChanged(item, property, value);
    } else {
      this.renderMenuItems();
    }
  };

  return ToolbarDropDownMenu;
}();

var _default = ToolbarDropDownMenu;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;