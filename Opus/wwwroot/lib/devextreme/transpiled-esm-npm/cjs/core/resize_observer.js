"use strict";

exports.default = void 0;

var _common = require("./utils/common");

var _window = require("./utils/window");

var window = (0, _window.getWindow)();
var ResizeObserverMock = {
  observe: _common.noop,
  unobserve: _common.noop,
  disconnect: _common.noop
};

var ResizeObserverSingleton = /*#__PURE__*/function () {
  function ResizeObserverSingleton() {
    var _this = this;

    if (!(0, _window.hasWindow)() || !window.ResizeObserver) {
      return ResizeObserverMock;
    }

    this._callbacksMap = new Map();
    this._observer = new window.ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        var _this$_callbacksMap$g;

        (_this$_callbacksMap$g = _this._callbacksMap.get(entry.target)) === null || _this$_callbacksMap$g === void 0 ? void 0 : _this$_callbacksMap$g(entry);
      });
    });
  }

  var _proto = ResizeObserverSingleton.prototype;

  _proto.observe = function observe(element, callback) {
    this._callbacksMap.set(element, callback);

    this._observer.observe(element);
  };

  _proto.unobserve = function unobserve(element) {
    this._callbacksMap.delete(element);

    this._observer.unobserve(element);
  };

  _proto.disconnect = function disconnect() {
    this._callbacksMap.clear();

    this._observer.disconnect();
  };

  return ResizeObserverSingleton;
}();

var resizeObserverSingleton = new ResizeObserverSingleton();
var _default = resizeObserverSingleton;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;