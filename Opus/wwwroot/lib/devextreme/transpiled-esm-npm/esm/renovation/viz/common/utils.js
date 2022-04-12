import formatHelper from "../../../format_helper";
import { isDefined } from "../../../core/utils/type";
import getElementComputedStyle from "../../utils/get_computed_style";
import { toNumber } from "../../utils/type_conversion";
export function getElementWidth(element) {
  var style = getElementComputedStyle(element);
  return toNumber(style === null || style === void 0 ? void 0 : style.width) - toNumber(style === null || style === void 0 ? void 0 : style.paddingLeft) - toNumber(style === null || style === void 0 ? void 0 : style.paddingRight);
}
export function getElementHeight(element) {
  var style = getElementComputedStyle(element);
  return toNumber(style === null || style === void 0 ? void 0 : style.height) - toNumber(style === null || style === void 0 ? void 0 : style.paddingTop) - toNumber(style === null || style === void 0 ? void 0 : style.paddingBottom);
}
export var sizeIsValid = value => !!(value && value > 0);
export var pickPositiveValue = values => values.reduce((result, value) => value && value > 0 && !result ? value : result, 0);
export var pointInCanvas = (canvas, x, y) => x >= canvas.left && x <= canvas.right && y >= canvas.top && y <= canvas.bottom;
export function getFormatValue(value, specialFormat, _ref) {
  var {
    argumentFormat,
    format
  } = _ref;
  var option = format;

  if (specialFormat) {
    option = specialFormat === "argument" ? argumentFormat : {
      type: "percent",
      precision: format === null || format === void 0 ? void 0 : format.percentPrecision
    };
  }

  return formatHelper.format(value, option);
}
export function isUpdatedFlatObject(newState, oldState) {
  return (isDefined(newState) || isDefined(oldState)) && (!isDefined(newState) || !isDefined(oldState) || Object.keys(newState).some(key => newState[key] !== oldState[key]));
}