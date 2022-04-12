import { isWindow } from "../../../core/utils/type";
import { extend } from "../../../core/utils/extend";
import { getOuterWidth, getInnerWidth, getOuterHeight, getInnerHeight, getOffset } from "../../../core/utils/size";
export var borderWidthStyles = {
  left: "borderLeftWidth",
  top: "borderTopWidth",
  right: "borderRightWidth",
  bottom: "borderBottomWidth"
};

function getBorderWidth(el, direction) {
  if (!isWindow(el)) {
    var borderWidth = el.style[borderWidthStyles[direction]];
    return parseInt(borderWidth, 10) || 0;
  }

  return 0;
}

var correctGeometry = function correctGeometry(area, mainEl) {
  var el = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var {
    height,
    offset,
    width
  } = area;
  var {
    left,
    top
  } = offset;
  var areaBorderLeft = el ? getBorderWidth(el, "left") : 0;
  var areaBorderTop = el ? getBorderWidth(el, "top") : 0;
  return {
    width: width - getOuterWidth(mainEl) - getInnerWidth(mainEl),
    height: height - getOuterHeight(mainEl) - getInnerHeight(mainEl),
    offset: {
      left: left + areaBorderLeft + getBorderWidth(mainEl, "left"),
      top: top + areaBorderTop + getBorderWidth(mainEl, "top")
    }
  };
};

export var getAreaFromElement = (el, mainEl) => correctGeometry({
  width: getInnerWidth(el),
  height: getInnerHeight(el),
  offset: extend({
    top: 0,
    left: 0
  }, isWindow(el) ? {} : getOffset(el))
}, mainEl, el);
export var getAreaFromObject = (_ref, mainEl) => {
  var {
    bottom,
    left,
    right,
    top
  } = _ref;
  return correctGeometry({
    width: right - left,
    height: bottom - top,
    offset: {
      left,
      top
    }
  }, mainEl);
};
export var getMovingSides = el => {
  var {
    className
  } = el;
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
export function getDragOffsets(area, handleEl, areaProp) {
  var hWidth = getOuterWidth(handleEl);
  var hHeight = getOuterHeight(handleEl);
  var hOffset = getOffset(handleEl);
  var areaOffset = area.offset;
  var isAreaWindow = isWindow(areaProp);
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
export var filterOffsets = (offset, handleEl) => {
  var sides = getMovingSides(handleEl);
  var offsetX = !sides.left && !sides.right ? 0 : offset.x;
  var offsetY = !sides.top && !sides.bottom ? 0 : offset.y;
  return {
    x: offsetX,
    y: offsetY
  };
};