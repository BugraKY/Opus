"use strict";

exports.default = void 0;

var _class = _interopRequireDefault(require("../core/class"));

var _events_strategy = require("../core/events_strategy");

var _iterator = require("../core/utils/iterator");

var _errors = require("./errors");

var _utils = require("./utils");

var _data = require("../core/utils/data");

var _store_helper = _interopRequireDefault(require("./store_helper"));

var _deferred = require("../core/utils/deferred");

var _common = require("../core/utils/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var abstract = _class.default.abstract;
var queryByOptions = _store_helper.default.queryByOptions;
var storeImpl = {};

var Store = _class.default.inherit({
  ctor: function ctor(options) {
    var that = this;
    options = options || {};
    this._eventsStrategy = new _events_strategy.EventsStrategy(this);
    (0, _iterator.each)(['onLoaded', 'onLoading', 'onInserted', 'onInserting', 'onUpdated', 'onUpdating', 'onPush', 'onRemoved', 'onRemoving', 'onModified', 'onModifying'], function (_, optionName) {
      if (optionName in options) {
        that.on(optionName.slice(2).toLowerCase(), options[optionName]);
      }
    });
    this._key = options.key;
    this._errorHandler = options.errorHandler;
    this._useDefaultSearch = true;
  },
  _customLoadOptions: function _customLoadOptions() {
    return null;
  },
  key: function key() {
    return this._key;
  },
  keyOf: function keyOf(obj) {
    if (!this._keyGetter) {
      this._keyGetter = (0, _data.compileGetter)(this.key());
    }

    return this._keyGetter(obj);
  },
  _requireKey: function _requireKey() {
    if (!this.key()) {
      throw _errors.errors.Error('E4005');
    }
  },
  load: function load(options) {
    var that = this;
    options = options || {};

    this._eventsStrategy.fireEvent('loading', [options]);

    return this._withLock(this._loadImpl(options)).done(function (result) {
      that._eventsStrategy.fireEvent('loaded', [result, options]);
    });
  },
  _loadImpl: function _loadImpl(options) {
    return queryByOptions(this.createQuery(options), options).enumerate();
  },
  _withLock: function _withLock(task) {
    var result = new _deferred.Deferred();
    task.done(function () {
      var that = this;
      var args = arguments;

      _utils.processRequestResultLock.promise().done(function () {
        result.resolveWith(that, args);
      });
    }).fail(function () {
      result.rejectWith(this, arguments);
    });
    return result;
  },
  createQuery: abstract,
  totalCount: function totalCount(options) {
    return this._totalCountImpl(options);
  },
  _totalCountImpl: function _totalCountImpl(options) {
    return queryByOptions(this.createQuery(options), options, true).count();
  },
  byKey: function byKey(key, extraOptions) {
    return this._addFailHandlers(this._withLock(this._byKeyImpl(key, extraOptions)));
  },
  _byKeyImpl: abstract,
  insert: function insert(values) {
    var that = this;

    that._eventsStrategy.fireEvent('modifying');

    that._eventsStrategy.fireEvent('inserting', [values]);

    return that._addFailHandlers(that._insertImpl(values).done(function (callbackValues, callbackKey) {
      that._eventsStrategy.fireEvent('inserted', [callbackValues, callbackKey]);

      that._eventsStrategy.fireEvent('modified');
    }));
  },
  _insertImpl: abstract,
  update: function update(key, values) {
    var that = this;

    that._eventsStrategy.fireEvent('modifying');

    that._eventsStrategy.fireEvent('updating', [key, values]);

    return that._addFailHandlers(that._updateImpl(key, values).done(function () {
      that._eventsStrategy.fireEvent('updated', [key, values]);

      that._eventsStrategy.fireEvent('modified');
    }));
  },
  _updateImpl: abstract,
  push: function push(changes) {
    var _this = this;

    var beforePushArgs = {
      changes: changes,
      waitFor: []
    };

    this._eventsStrategy.fireEvent('beforePush', [beforePushArgs]);

    _deferred.when.apply(void 0, _toConsumableArray(beforePushArgs.waitFor)).done(function () {
      _this._pushImpl(changes);

      _this._eventsStrategy.fireEvent('push', [changes]);
    });
  },
  _pushImpl: _common.noop,
  remove: function remove(key) {
    var that = this;

    that._eventsStrategy.fireEvent('modifying');

    that._eventsStrategy.fireEvent('removing', [key]);

    return that._addFailHandlers(that._removeImpl(key).done(function (callbackKey) {
      that._eventsStrategy.fireEvent('removed', [callbackKey]);

      that._eventsStrategy.fireEvent('modified');
    }));
  },
  _removeImpl: abstract,
  _addFailHandlers: function _addFailHandlers(deferred) {
    return deferred.fail(this._errorHandler).fail(_errors.handleError);
  },
  on: function on(eventName, eventHandler) {
    this._eventsStrategy.on(eventName, eventHandler);

    return this;
  },
  off: function off(eventName, eventHandler) {
    this._eventsStrategy.off(eventName, eventHandler);

    return this;
  }
});

Store.create = function (alias, options) {
  if (!(alias in storeImpl)) {
    throw _errors.errors.Error('E4020', alias);
  }

  return new storeImpl[alias](options);
};

Store.registerClass = function (type, alias) {
  if (alias) {
    storeImpl[alias] = type;
  }

  return type;
};

Store.inherit = function (inheritor) {
  return function (members, alias) {
    var type = inheritor.apply(this, [members]);
    Store.registerClass(type, alias);
    return type;
  };
}(Store.inherit);

var _default = Store;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;