"use strict";

exports.getAreaFromObject = exports.getAreaFromElement = exports.filterOffsets = exports.borderWidthStyles = void 0;
exports.getDragOffsets = getDragOffsets;
exports.getMovingSides = void 0;

var _type = require("../../../core/utils/type");

var _extend = require("../../../core/utils/extend");

var _size = require("../../../core/utils/size");

var borderWidthStyles = {
  left: "borderLeftWidth",
  top: "borderTopWidth",
  right: "borderRightWidth",
  bottom: "borderBottomWidth"
};
exports.borderWidthStyles = borderWidthStyles;

function getBorderWidth(el, direction) {
  if (!(0, _type.isWindow)(el)) {
    var borderWidth = el.style[borderWidthStyles[direction]];
    return parseInt(borderWidth, 10) || 0;
  }

  return 0;
}

var correctGeometry = function correctGeometry(area, mainEl) {
  var el = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var height = area.height,
      offset = area.offset,
      width = area.width;
  var left = offset.left,
      top = offset.top;
  var areaBorderLeft = el ? getBorderWidth(el, "left") : 0;
  var areaBorderTop = el ? getBorderWidth(el, "top") : 0;
  return {
    width: width - (0, _size.getOuterWidth)(mainEl) - (0, _size.getInnerWidth)(mainEl),
    height: height - (0, _size.getOuterHeight)(mainEl) - (0, _size.getInnerHeight)(mainEl),
    offset: {
      left: left + areaBorderLeft + getBorderWidth(mainEl, "left"),
      top: top + areaBorderTop + getBorderWidth(mainEl, "top")
    }
  };
};

var getAreaFromElement = function getAreaFromElement(el, mainEl) {
  return correctGeometry({
    width: (0, _size.getInnerWidth)(el),
    height: (0, _size.getInnerHeight)(el),
    offset: (0, _extend.extend)({
      top: 0,
      left: 0
    }, (0, _type.isWindow)(el) ? {} : (0, _size.getOffset)(el))
  }, mainEl, el);
};

exports.getAreaFromElement = getAreaFromElement;

var getAreaFromObject = function getAreaFromObject(_ref, mainEl) {
  var bottom = _ref.bottom,
      left = _ref.left,
      right = _ref.right,
      top = _ref.top;
  return correctGeometry({
    width: right - left,
    height: bottom - top,
    offset: {
      left: left,
      top: top
    }
  }, mainEl);
};

exports.getAreaFromObject = getAreaFromObject;

var getMovingSides = function getMovingSides(el) {
  var className = el.className;
  var hasCornerTopLeftClass = className.includes("dx-resizable-handle-corner-top-left");
  var hasCornerTopRightClass = className.includes("dx-resizable-handle-corner-top-right");
  var hasCornerBottomLeftClass = className.includes("dx-resizable-handle-corner-bottom-left");
  var hasCornerBottomRightClass = className.includes("dx-resizable-handle-corner-bottom-right");
  return {
    top: className.includes("dx-resizable-handle-top") || hasCornerTopLeftClass || hasCornerTopRightClass,
    left: className.includes("dx-resizable-handle-left") || hasCornerTopLeftClass || hasCornerBottomLeftClass,
    bottom: className.includes("dx-resizable-handle-bottom") || hasCornerBottomLeftClass || hasCornerBottomRightClass,
    right: className.includes("dx-resizable-handle-right") || hasCornerTopRightClass || hasCornerBottomRightClass
  };
};

exports.getMovingSides = getMovingSides;

function getDragOffsets(area, handleEl, areaProp) {
  var hWidth = (0, _size.getOuterWidth)(handleEl);
  var hHeight = (0, _size.getOuterHeight)(handleEl);
  var hOffset = (0, _size.getOffset)(handleEl);
  var areaOffset = area.offset;
  var isAreaWindow = (0, _type.isWindow)(areaProp);
  var scrollOffset = {
    scrollX: isAreaWindow ? areaProp.pageXOffset : 0,
    scrollY: isAreaWindow ? areaProp.pageYOffset : 0
  };
  return {
    maxLeftOffset: hOffset.left - areaOffset.left - scrollOffset.scrollX,
    maxRightOffset: areaOffset.left + area.width - hOffset.left - hWidth + scrollOffset.scrollX,
    maxTopOffset: hOffset.top - areaOffset.top - scrollOffset.scrollY,
    maxBottomOffset: areaOffset.top + area.height - hOffset.top - hHeight + scrollOffset.scrollY
  };
}

var filterOffsets = function filterOffsets(offset, handleEl) {
  var sides = getMovingSides(handleEl);
  var offsetX = !sides.left && !sides.right ? 0 : offset.x;
  var offsetY = !sides.top && !sides.bottom ? 0 : offset.y;
  return {
    x: offsetX,
    y: offsetY
  };
};

exports.filterOffsets = filterOffsets;