import TabsItem from '../tabs/item';
var TABS_ITEM_BADGE_CLASS = 'dx-tabs-item-badge';
var NAVBAR_ITEM_BADGE_CLASS = 'dx-navbar-item-badge';
var NavBarItem = TabsItem.inherit({
  _renderBadge: function _renderBadge(badge) {
    this.callBase(badge);

    this._$element.children('.' + TABS_ITEM_BADGE_CLASS).removeClass(TABS_ITEM_BADGE_CLASS).addClass(NAVBAR_ITEM_BADGE_CLASS);
  }
});
export default NavBarItem;