"use strict";

exports.ScrollableSimulatedProps = void 0;

var _base_scrollable_props = require("./base_scrollable_props");

var _get_default_option_value = require("../utils/get_default_option_value");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ScrollableSimulatedProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_base_scrollable_props.BaseScrollableProps), Object.getOwnPropertyDescriptors(Object.defineProperties({
  inertiaEnabled: true,
  useKeyboard: true,
  refreshStrategy: "simulated"
}, {
  showScrollbar: {
    get: function get() {
      return (0, _get_default_option_value.isDesktop)() ? "onHover" : "onScroll";
    },
    configurable: true,
    enumerable: true
  },
  scrollByThumb: {
    get: function get() {
      return (0, _get_default_option_value.isDesktop)();
    },
    configurable: true,
    enumerable: true
  }
}))));
exports.ScrollableSimulatedProps = ScrollableSimulatedProps;