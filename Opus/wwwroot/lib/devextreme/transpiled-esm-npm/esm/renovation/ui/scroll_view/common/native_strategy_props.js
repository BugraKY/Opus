import _extends from "@babel/runtime/helpers/esm/extends";
import { BaseScrollableProps } from "./base_scrollable_props";
import { getDefaultNativeRefreshStrategy, getDefaultUseSimulatedScrollbar } from "../utils/get_default_option_value";
export var ScrollableNativeProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(BaseScrollableProps), Object.getOwnPropertyDescriptors({
  get useSimulatedScrollbar() {
    return getDefaultUseSimulatedScrollbar();
  },

  showScrollbar: "onScroll",

  get refreshStrategy() {
    return getDefaultNativeRefreshStrategy();
  }

})));