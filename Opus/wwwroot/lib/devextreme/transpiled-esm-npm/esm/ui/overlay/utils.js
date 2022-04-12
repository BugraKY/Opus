import { getInnerHeight, getOuterHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
import { isNumeric } from '../../core/utils/type';
var WINDOW_HEIGHT_PERCENT = 0.9;
export var getElementMaxHeightByWindow = ($element, startLocation) => {
  var $window = $(getWindow());
  var {
    top: elementOffset
  } = $element.offset();
  var actualOffset;

  if (isNumeric(startLocation)) {
    if (startLocation < elementOffset) {
      return elementOffset - startLocation;
    } else {
      actualOffset = getInnerHeight($window) - startLocation + $window.scrollTop();
    }
  } else {
    var offsetTop = elementOffset - $window.scrollTop();
    var offsetBottom = getInnerHeight($window) - offsetTop - getOuterHeight($element);
    actualOffset = Math.max(offsetTop, offsetBottom);
  }

  return actualOffset * WINDOW_HEIGHT_PERCENT;
};