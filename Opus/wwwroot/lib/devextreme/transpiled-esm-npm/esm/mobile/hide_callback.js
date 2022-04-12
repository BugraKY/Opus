import { inArray } from '../core/utils/array';
export var hideCallback = function () {
  var callbacks = [];
  return {
    add: function add(callback) {
      var indexOfCallback = inArray(callback, callbacks);

      if (indexOfCallback === -1) {
        callbacks.push(callback);
      }
    },
    remove: function remove(callback) {
      var indexOfCallback = inArray(callback, callbacks);

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