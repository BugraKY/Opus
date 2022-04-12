"use strict";

exports.getScrollbarWidth = getScrollbarWidth;

function getScrollbarWidth(containerElement) {
  return containerElement.offsetWidth - containerElement.clientWidth;
}