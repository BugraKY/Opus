import _extends from "@babel/runtime/helpers/esm/extends";
import { BaseScrollableProps } from "./base_scrollable_props";
import { isDesktop } from "../utils/get_default_option_value";
export var ScrollableSimulatedProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(BaseScrollableProps), Object.getOwnPropertyDescriptors({
  inertiaEnabled: true,
  useKeyboard: true,

  get showScrollbar() {
    return isDesktop() ? "onHover" : "onScroll";
  },

  get scrollByThumb() {
    return isDesktop();
  },

  refreshStrategy: "simulated"
})));