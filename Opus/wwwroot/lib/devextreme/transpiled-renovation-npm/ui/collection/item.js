"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _class = _interopRequireDefault(require("../../core/class"));

var _iterator = require("../../core/utils/iterator");

var _public_component = require("../../core/utils/public_component");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INVISIBLE_STATE_CLASS = 'dx-state-invisible';
var DISABLED_STATE_CLASS = 'dx-state-disabled';
var ITEM_CONTENT_PLACEHOLDER_CLASS = 'dx-item-content-placeholder';

var forcibleWatcher = function forcibleWatcher(watchMethod, fn, callback) {
  var filteredCallback = function () {
    var oldValue;
    return function (value) {
      if (oldValue !== value) {
        callback(value, oldValue);
        oldValue = value;
      }
    };
  }();

  return {
    dispose: watchMethod(fn, filteredCallback),
    force: function force() {
      filteredCallback(fn());
    }
  };
};

var CollectionItem = _class.default.inherit({
  ctor: function ctor($element, options, rawData) {
    this._$element = $element;
    this._options = options;
    this._rawData = rawData;
    (0, _public_component.attachInstanceToElement)($element, this, this._dispose);

    this._render();
  },
  _render: function _render() {
    var $placeholder = (0, _renderer.default)('<div>').addClass(ITEM_CONTENT_PLACEHOLDER_CLASS);

    this._$element.append($placeholder);

    this._watchers = [];

    this._renderWatchers();
  },
  _renderWatchers: function _renderWatchers() {
    this._startWatcher('disabled', this._renderDisabled.bind(this));

    this._startWatcher('visible', this._renderVisible.bind(this));
  },
  _startWatcher: function _startWatcher(field, render) {
    var rawData = this._rawData;

    var exprGetter = this._options.fieldGetter(field);

    var watcher = forcibleWatcher(this._options.watchMethod(), function () {
      return exprGetter(rawData);
    }, function (value, oldValue) {
      this._dirty = true;
      render(value, oldValue);
    }.bind(this));

    this._watchers.push(watcher);
  },
  setDataField: function setDataField() {
    this._dirty = false;
    (0, _iterator.each)(this._watchers, function (_, watcher) {
      watcher.force();
    });

    if (this._dirty) {
      return true;
    }
  },
  _renderDisabled: function _renderDisabled(value, oldValue) {
    this._$element.toggleClass(DISABLED_STATE_CLASS, !!value);

    this._updateOwnerFocus(value);
  },
  _updateOwnerFocus: function _updateOwnerFocus(isDisabled) {
    var ownerComponent = this._options.owner;

    if (ownerComponent && isDisabled) {
      ownerComponent._resetItemFocus(this._$element);
    }
  },
  _renderVisible: function _renderVisible(value, oldValue) {
    this._$element.toggleClass(INVISIBLE_STATE_CLASS, value !== undefined && !value);
  },
  _dispose: function _dispose() {
    (0, _iterator.each)(this._watchers, function (_, watcher) {
      watcher.dispose();
    });
  }
});

CollectionItem.getInstance = function ($element) {
  return (0, _public_component.getInstanceByElement)($element, this);
};

var _default = CollectionItem;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;