import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import ToolbarMenu from './ui.toolbar.menu';
import DropDownMenu from '../drop_down_menu';
import devices from '../../core/devices';
import { each } from '../../core/utils/iterator';
import { compileGetter } from '../../core/utils/data';
var MENU_INVISIBLE_CLASS = 'dx-state-invisible';
var TOOLBAR_dropDownMenu_CONTAINER_CLASS = 'dx-toolbar-menu-container';
var POPOVER_BOUNDARY_OFFSET = 10;

class ToolbarDropDownMenu {
  constructor(toolbar) {
    this._toolbar = toolbar;
  }

  render() {
    if (!this._hasVisibleMenuItems()) {
      return;
    }

    this._renderMenuButtonContainer();

    var $menu = $('<div>').appendTo(this._dropDownMenuContainer());
    this._dropDownMenu = this._toolbar._createComponent($menu, DropDownMenu, this._dropDownMenuOptions());
    this.renderMenuItems();
  }

  renderMenuItems() {
    if (!this._dropDownMenu) {
      this.render();
    }

    this._dropDownMenu && this._dropDownMenu.option('items', this._getMenuItems());

    if (this._dropDownMenu && !this._dropDownMenu.option('items').length) {
      this._dropDownMenu.close();
    }
  }

  _renderMenuButtonContainer() {
    var $afterSection = this._toolbar._$afterSection;
    this._$menuButtonContainer = $('<div>').appendTo($afterSection).addClass(this._toolbar._buttonClass()).addClass(TOOLBAR_dropDownMenu_CONTAINER_CLASS);
  }

  _getMenuItemTemplate() {
    return this._toolbar._getTemplateByOption('menuItemTemplate');
  }

  _dropDownMenuOptions() {
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
      popupMaxHeight: devices.current().platform === 'android' // T1010948
      ? domAdapter.getDocumentElement().clientHeight - topAndBottomOffset : undefined,
      menuWidget: ToolbarMenu,
      onOptionChanged: _ref => {
        var {
          name,
          value
        } = _ref;

        if (name === 'opened') {
          this._toolbar.option('overflowMenuVisible', value);
        }

        if (name === 'items') {
          this._updateMenuVisibility(value);
        }
      },
      popupPosition: {
        at: 'bottom right',
        my: 'top right'
      }
    };
  }

  _updateMenuVisibility(menuItems) {
    var items = menuItems || this._getMenuItems();

    var isMenuVisible = items.length && this._hasVisibleMenuItems(items);

    this._toggleMenuVisibility(isMenuVisible);
  }

  _getMenuItems() {
    return this._toolbar._getMenuItems();
  }

  _hasVisibleMenuItems(items) {
    var menuItems = items || this._toolbar.option('items');

    var result = false;
    var optionGetter = compileGetter('visible');
    var overflowGetter = compileGetter('locateInMenu');
    each(menuItems, function (index, item) {
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
  }

  _toggleMenuVisibility(value) {
    if (!this._dropDownMenuContainer()) {
      return;
    }

    this._dropDownMenuContainer().toggleClass(MENU_INVISIBLE_CLASS, !value);
  }

  _dropDownMenuContainer() {
    return this._$menuButtonContainer;
  }

  widgetOption(name, value) {
    this._dropDownMenu && this._dropDownMenu.option(name, value);
  }

  itemOption(item, property, value) {
    if (property === 'disabled' || property === 'options.disabled') {
      var _this$_dropDownMenu;

      (_this$_dropDownMenu = this._dropDownMenu) === null || _this$_dropDownMenu === void 0 ? void 0 : _this$_dropDownMenu._itemOptionChanged(item, property, value);
    } else {
      this.renderMenuItems();
    }
  }

}

export default ToolbarDropDownMenu;