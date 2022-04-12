"use strict";

exports.default = void 0;

var _array = require("../utils/array");

var _window = require("../utils/window");

var weakMap = (0, _window.hasWindow)() ? (0, _window.getWindow)().WeakMap : WeakMap;

if (!weakMap) {
  // NOTE: This is an incomplete WeakMap polyfill but it is enough for creation purposes
  weakMap = function weakMap() {
    var keys = [];
    var values = [];

    this.set = function (key, value) {
      var index = (0, _array.inArray)(key, keys);

      if (index === -1) {
        keys.push(key);
        values.push(value);
      } else {
        values[index] = value;
      }
    };

    this.get = function (key) {
      var index = (0, _array.inArray)(key, keys);

      if (index === -1) {
        return undefined;
      }

      return values[index];
    };

    this.has = function (key) {
      var index = (0, _array.inArray)(key, keys);

      if (index === -1) {
        return false;
      }

      return true;
    };

    this.delete = function (key) {
      var index = (0, _array.inArray)(key, keys);

      if (index === -1) {
        return;
      }

      keys.splice(index, 1);
      values.splice(index, 1);
    };
  };
}

var _default = weakMap;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;