"use strict";

exports.default = void 0;

var _item = _interopRequireDefault(require("../tabs/item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TABS_ITEM_BADGE_CLASS = 'dx-tabs-item-badge';
var NAVBAR_ITEM_BADGE_CLASS = 'dx-navbar-item-badge';

var NavBarItem = _item.default.inherit({
  _renderBadge: function _renderBadge(badge) {
    this.callBase(badge);

    this._$element.children('.' + TABS_ITEM_BADGE_CLASS).removeClass(TABS_ITEM_BADGE_CLASS).addClass(NAVBAR_ITEM_BADGE_CLASS);
  }
});

var _default = NavBarItem;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;