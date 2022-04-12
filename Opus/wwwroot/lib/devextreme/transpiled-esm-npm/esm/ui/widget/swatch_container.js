import $ from '../../core/renderer';
import { value } from '../../core/utils/view_port';
var SWATCH_CONTAINER_CLASS_PREFIX = 'dx-swatch-';

var getSwatchContainer = element => {
  var $element = $(element);
  var swatchContainer = $element.closest("[class^=\"".concat(SWATCH_CONTAINER_CLASS_PREFIX, "\"], [class*=\" ").concat(SWATCH_CONTAINER_CLASS_PREFIX, "\"]"));
  var viewport = value();
  if (!swatchContainer.length) return viewport;
  var swatchClassRegex = new RegExp("(\\s|^)(".concat(SWATCH_CONTAINER_CLASS_PREFIX, ".*?)(\\s|$)"));
  var swatchClass = swatchContainer[0].className.match(swatchClassRegex)[2];
  var viewportSwatchContainer = viewport.children('.' + swatchClass);

  if (!viewportSwatchContainer.length) {
    viewportSwatchContainer = $('<div>').addClass(swatchClass).appendTo(viewport);
  }

  return viewportSwatchContainer;
};

export default {
  getSwatchContainer: getSwatchContainer
};