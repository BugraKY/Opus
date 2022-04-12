"use strict";

exports.getElementOffset = getElementOffset;

var _window = require("../../core/utils/window");

var window = (0, _window.getWindow)();
var DEFAULT_OFFSET = {
  top: 0,
  left: 0
};

function getElementOffset(el) {
  if (el && (0, _window.hasWindow)()) {
    var rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    };
  }

  return DEFAULT_OFFSET;
}