"use strict";

exports.hideCallback = void 0;

var _array = require("../core/utils/array");

var hideCallback = function () {
  var callbacks = [];
  return {
    add: function add(callback) {
      var indexOfCallback = (0, _array.inArray)(callback, callbacks);

      if (indexOfCallback === -1) {
        callbacks.push(callback);
      }
    },
    remove: function remove(callback) {
      var indexOfCallback = (0, _array.inArray)(callback, callbacks);

      if (indexOfCallback !== -1) {
        callbacks.splice(indexOfCallback, 1);
      }
    },
    fire: function fire() {
      var callback = callbacks.pop();
      var result = !!callback;

      if (result) {
        callback();
      }

      return result;
    },
    hasCallback: function hasCallback() {
      return callbacks.length > 0;
    }
  };
}();

exports.hideCallback = hideCallback;