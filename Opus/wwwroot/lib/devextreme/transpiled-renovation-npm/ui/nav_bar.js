"use strict";

exports.default = void 0;

var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));

var _extend = require("../core/utils/extend");

var _item = _interopRequireDefault(require("./nav_bar/item"));

var _tabs = _interopRequireDefault(require("./tabs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// STYLE navBar
var NAVBAR_CLASS = 'dx-navbar';
var ITEM_CLASS = 'dx-item-content';
var NAVBAR_ITEM_CLASS = 'dx-nav-item';
var NAVBAR_ITEM_CONTENT_CLASS = 'dx-nav-item-content';

var NavBar = _tabs.default.inherit({
  ctor: function ctor(element, options) {
    this.callBase(element, options);

    this._logDeprecatedComponentWarning('20.1', 'dxTabs');
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
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

NavBar.ItemClass = _item.default;
(0, _component_registrator.default)('dxNavBar', NavBar);
var _default = NavBar;
/**
 * @name dxNavBarItem
 * @inherits dxTabsItem
 * @type object
 */

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;