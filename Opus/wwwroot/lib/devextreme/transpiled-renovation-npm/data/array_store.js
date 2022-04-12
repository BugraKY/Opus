"use strict";

exports.default = void 0;

var _utils = require("./utils");

var _query = _interopRequireDefault(require("./query"));

var _errors = require("./errors");

var _abstract_store = _interopRequireDefault(require("./abstract_store"));

var _array_utils = require("./array_utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ArrayStore = _abstract_store.default.inherit({
  ctor: function ctor(options) {
    if (Array.isArray(options)) {
      options = {
        data: options
      };
    } else {
      options = options || {};
    }

    this.callBase(options);
    var initialArray = options.data;

    if (initialArray && !Array.isArray(initialArray)) {
      throw _errors.errors.Error('E4006');
    }

    this._array = initialArray || [];
  },
  createQuery: function createQuery() {
    return (0, _query.default)(this._array, {
      errorHandler: this._errorHandler
    });
  },
  _byKeyImpl: function _byKeyImpl(key) {
    var index = (0, _array_utils.indexByKey)(this, this._array, key);

    if (index === -1) {
      return (0, _utils.rejectedPromise)(_errors.errors.Error('E4009'));
    }

    return (0, _utils.trivialPromise)(this._array[index]);
  },
  _insertImpl: function _insertImpl(values) {
    return (0, _array_utils.insert)(this, this._array, values);
  },
  _pushImpl: function _pushImpl(changes) {
    (0, _array_utils.applyBatch)({
      keyInfo: this,
      data: this._array,
      changes: changes
    });
  },
  _updateImpl: function _updateImpl(key, values) {
    return (0, _array_utils.update)(this, this._array, key, values);
  },
  _removeImpl: function _removeImpl(key) {
    return (0, _array_utils.remove)(this, this._array, key);
  },
  clear: function clear() {
    this._eventsStrategy.fireEvent('modifying');

    this._array = [];

    this._eventsStrategy.fireEvent('modified');
  }
}, 'array');

var _default = ArrayStore;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;