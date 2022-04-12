import { extend } from '../../core/utils/extend';
var _extend = extend;
import { BaseThemeManager } from '../core/base_theme_manager';
var ThemeManager = BaseThemeManager.inherit({
  ctor(options) {
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
export default {
  ThemeManager
};