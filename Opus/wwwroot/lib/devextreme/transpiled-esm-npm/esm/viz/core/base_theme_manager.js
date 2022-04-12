import Class from '../../core/class';
import { extend } from '../../core/utils/extend';
import { isString as _isString } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { createPalette as getPalette, getDiscretePalette, getGradientPalette, getAccentColor as accentColor } from '../palette';
import { parseScalar as _parseScalar } from './utils';
import { getTheme, addCacheItem, removeCacheItem } from '../themes';
var _getTheme = getTheme;
var _addCacheItem = addCacheItem;
var _removeCacheItem = removeCacheItem;
var _extend = extend;
var _each = each;

function getThemePart(theme, path) {
  var _theme = theme;
  path && _each(path.split('.'), function (_, pathItem) {
    return _theme = _theme[pathItem];
  });
  return _theme;
}

export var BaseThemeManager = Class.inherit({
  // TODO: test hack
  ctor: function ctor(options) {
    this._themeSection = options.themeSection;
    this._fontFields = options.fontFields || [];

    _addCacheItem(this);
  },
  dispose: function dispose() {
    var that = this;

    _removeCacheItem(that);

    that._callback = that._theme = that._font = null;
    return that;
  },
  // TODO: Move it to constructor when charts theme managers's constructor is removed
  setCallback: function setCallback(callback) {
    this._callback = callback;
    return this;
  },
  setTheme: function setTheme(theme, rtl) {
    this._current = theme;
    this._rtl = rtl;
    return this.refresh();
  },
  // Officially we do not support objects as "theme" option value - we should stop doing it in code
  refresh: function refresh() {
    var that = this;
    var current = that._current || {};

    var theme = _getTheme(current.name || current);

    that._themeName = theme.name;
    that._defaultPalette = theme.defaultPalette;
    that._font = _extend({}, theme.font, current.font);
    that._themeSection && _each(that._themeSection.split('.'), function (_, path) {
      theme = _extend(true, {}, theme[path]);
    });
    that._theme = _extend(true, {}, theme, _isString(current) ? {} : current);

    that._initializeTheme();

    if (_parseScalar(that._rtl, that._theme.rtlEnabled)) {
      _extend(true, that._theme, that._theme._rtl);
    }

    that._callback();

    return that;
  },
  theme: function theme(path) {
    return getThemePart(this._theme, path);
  },
  themeName: function themeName() {
    return this._themeName;
  },
  // TODO: May be we need some single method for all palettes?
  createPalette: function createPalette(palette, options) {
    return getPalette(palette, options, this._defaultPalette);
  },
  createDiscretePalette: function createDiscretePalette(palette, count) {
    return getDiscretePalette(palette, count, this._defaultPalette);
  },
  createGradientPalette: function createGradientPalette(palette) {
    return getGradientPalette(palette, this._defaultPalette);
  },
  getAccentColor: function getAccentColor(palette) {
    return accentColor(palette, this._defaultPalette);
  },
  _initializeTheme: function _initializeTheme() {
    var that = this;

    _each(that._fontFields || [], function (_, path) {
      that._initializeFont(getThemePart(that._theme, path));
    });
  },
  _initializeFont: function _initializeFont(font) {
    _extend(font, this._font, _extend({}, font));
  }
});