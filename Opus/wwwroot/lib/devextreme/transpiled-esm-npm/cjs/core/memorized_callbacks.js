"use strict";

exports.default = void 0;

var _iterator = require("../core/utils/iterator");

var _callbacks = _interopRequireDefault(require("./utils/callbacks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MemorizedCallbacks = /*#__PURE__*/function () {
  function MemorizedCallbacks() {
    this.memory = [];
    this.callbacks = (0, _callbacks.default)();
  }

  var _proto = MemorizedCallbacks.prototype;

  _proto.add = function add(fn) {
    (0, _iterator.each)(this.memory, function (_, item) {
      return fn.apply(fn, item);
    });
    this.callbacks.add(fn);
  };

  _proto.remove = function remove(fn) {
    this.callbacks.remove(fn);
  };

  _proto.fire = function fire() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.memory.push(args);
    this.callbacks.fire.apply(this.callbacks, args);
  };

  return MemorizedCallbacks;
}();

exports.default = MemorizedCallbacks;
module.exports = exports.default;
module.exports.default = exports.default;