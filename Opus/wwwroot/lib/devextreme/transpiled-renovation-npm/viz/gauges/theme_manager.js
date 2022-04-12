"use strict";

exports.default = void 0;

var _extend2 = require("../../core/utils/extend");

var _base_theme_manager = require("../core/base_theme_manager");

var _extend = _extend2.extend;

var ThemeManager = _base_theme_manager.BaseThemeManager.inherit({
  ctor: function ctor(options) {
    this.callBase.apply(this, arguments);
    this._subTheme = options.subTheme;
  },
  _initializeTheme: function _initializeTheme() {
    var that = this;
    var subTheme;

    if (that._subTheme) {
      subTheme = _extend(true, {}, that._theme[that._subTheme], that._theme);

      _extend(true, that._theme, subTheme);
    }

    that.callBase.apply(that, arguments);
  }
});

var _default = {
  ThemeManager: ThemeManager
};
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;