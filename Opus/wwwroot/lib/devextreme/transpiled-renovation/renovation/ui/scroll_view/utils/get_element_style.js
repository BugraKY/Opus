"use strict";

exports.getElementMargin = getElementMargin;
exports.getElementOverflowX = getElementOverflowX;
exports.getElementOverflowY = getElementOverflowY;
exports.getElementPadding = getElementPadding;
exports.getElementStyle = getElementStyle;
exports.getElementTransform = getElementTransform;

var _inflector = require("../../../../core/utils/inflector");

var _window = require("../../../../core/utils/window");

var _type_conversion = require("../../../utils/type_conversion");

function getElementStyle(el) {
  var _getWindow$getCompute, _getWindow;

  return el && (0, _window.hasWindow)() ? (_getWindow$getCompute = (_getWindow = (0, _window.getWindow)()).getComputedStyle) === null || _getWindow$getCompute === void 0 ? void 0 : _getWindow$getCompute.call(_getWindow, el) : null;
}

function getElementMargin(element, side) {
  var style = getElementStyle(element);
  return style ? (0, _type_conversion.toNumber)(style["margin".concat((0, _inflector.titleize)(side))]) : 0;
}

function getElementPadding(element, side) {
  var style = getElementStyle(element);
  return style ? (0, _type_conversion.toNumber)(style["padding".concat((0, _inflector.titleize)(side))]) : 0;
}

function getElementOverflowX(element) {
  var style = getElementStyle(element);
  return style ? style.overflowX : "visible";
}

function getElementOverflowY(element) {
  var style = getElementStyle(element);
  return style ? style.overflowY : "visible";
}

function getElementTransform(element) {
  var style = getElementStyle(element);
  return style ? style.transform : "";
}