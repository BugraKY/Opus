"use strict";

exports.default = getElementComputedStyle;

var _window = require("../../core/utils/window");

var window = (0, _window.getWindow)();

function getElementComputedStyle(el) {
  var _window$getComputedSt;

  return el ? (_window$getComputedSt = window.getComputedStyle) === null || _window$getComputedSt === void 0 ? void 0 : _window$getComputedSt.call(window, el) : null;
}

module.exports = exports.default;
module.exports.default = exports.default;