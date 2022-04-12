import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import NavBarItem from './nav_bar/item';
import Tabs from './tabs'; // STYLE navBar

var NAVBAR_CLASS = 'dx-navbar';
var ITEM_CLASS = 'dx-item-content';
var NAVBAR_ITEM_CLASS = 'dx-nav-item';
var NAVBAR_ITEM_CONTENT_CLASS = 'dx-nav-item-content';
var NavBar = Tabs.inherit({
  ctor: function ctor(element, options) {
    this.callBase(element, options);

    this._logDeprecatedComponentWarning('20.1', 'dxTabs');
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      /**
      * @name dxNavBarOptions.scrollingEnabled
      * @type boolean
      * @default false
      * @hidden
      */
      scrollingEnabled: false
      /**
      * @name dxNavBarOptions.showNavButtons
      * @hidden
      */

    });
  },
  _render: function _render() {
    this.callBase();
    this.$element().addClass(NAVBAR_CLASS);
  },
  _postprocessRenderItem: function _postprocessRenderItem(args) {
    this.callBase(args);
    var $itemElement = args.itemElement;
    var itemData = args.itemData;
    $itemElement.addClass(NAVBAR_ITEM_CLASS);
    $itemElement.find('.' + ITEM_CLASS).addClass(NAVBAR_ITEM_CONTENT_CLASS);

    if (!itemData.icon) {
      $itemElement.addClass('dx-navbar-text-item');
    }
  }
});
NavBar.ItemClass = NavBarItem;
registerComponent('dxNavBar', NavBar);
export default NavBar;
/**
 * @name dxNavBarItem
 * @inherits dxTabsItem
 * @type object
 */