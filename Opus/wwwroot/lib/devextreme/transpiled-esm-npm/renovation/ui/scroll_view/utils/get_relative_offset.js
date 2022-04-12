"use strict";

exports.getRelativeOffset = getRelativeOffset;

function getRelativeOffset(targetElementClass, sourceElement) {
  var offset = {
    left: 0,
    top: 0
  };
  var element = sourceElement;

  while ((_element = element) !== null && _element !== void 0 && _element.offsetParent && !element.classList.contains(targetElementClass)) {
    var _element;

    var parentElement = element.offsetParent;
    var elementRect = element.getBoundingClientRect();
    var parentElementRect = parentElement.getBoundingClientRect();
    offset.left += elementRect.left - parentElementRect.left;
    offset.top += elementRect.top - parentElementRect.top;
    element = element.offsetParent;
  }

  return offset;
}