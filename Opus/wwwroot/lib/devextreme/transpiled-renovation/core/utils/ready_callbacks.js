"use strict";

exports.default = void 0;

var _dom_adapter = _interopRequireDefault(require("../dom_adapter"));

var _dependency_injector = _interopRequireDefault(require("./dependency_injector"));

var _window = require("./window");

var _call_once = _interopRequireDefault(require("./call_once"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var callbacks = [];
var subscribeReady = (0, _call_once.default)(function () {
  var removeListener = _dom_adapter.default.listen(_dom_adapter.default.getDocument(), 'DOMContentLoaded', function () {
    readyCallbacks.fire();
    removeListener();
  });
});
var readyCallbacks = {
  add: function add(callback) {
    var windowExists = (0, _window.hasWindow)();

    if (windowExists && _dom_adapter.default.getReadyState() !== 'loading') {
      callback();
    } else {
      callbacks.push(callback);
      windowExists && subscribeReady();
    }
  },
  fire: function fire() {
    callbacks.forEach(function (callback) {
      return callback();
    });
    callbacks = [];
  }
};

var _default = (0, _dependency_injector.default)(readyCallbacks);

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;