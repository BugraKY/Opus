import { getWindow, hasWindow } from "../../core/utils/window";
var window = getWindow();
var DEFAULT_OFFSET = {
  top: 0,
  left: 0
};
export function getElementOffset(el) {
  if (el && hasWindow()) {
    var rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    };
  }

  return DEFAULT_OFFSET;
}