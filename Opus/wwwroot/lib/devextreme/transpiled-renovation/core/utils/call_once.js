"use strict";

exports.default = void 0;

var callOnce = function callOnce(handler) {
  var result;

  var _wrappedHandler = function wrappedHandler() {
    result = handler.apply(this, arguments);

    _wrappedHandler = function wrappedHandler() {
      return result;
    };

    return result;
  };

  return function () {
    return _wrappedHandler.apply(this, arguments);
  };
};

var _default = callOnce;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;