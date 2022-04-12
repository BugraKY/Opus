import getElementComputedStyle from "../../../utils/get_computed_style";
import { toNumber } from "../../../utils/type_conversion";
export function getElementStyle(name, element) {
  var _getElementComputedSt;

  var computedStyle = (_getElementComputedSt = getElementComputedStyle(element)) !== null && _getElementComputedSt !== void 0 ? _getElementComputedSt : {};
  return toNumber(computedStyle[name]);
}
export function getElementWidth(element) {
  return getElementStyle("width", element);
}
export function getElementMinWidth(element) {
  return getElementStyle("minWidth", element);
}