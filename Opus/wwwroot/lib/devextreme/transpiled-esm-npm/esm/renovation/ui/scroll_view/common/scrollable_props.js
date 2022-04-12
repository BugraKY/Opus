import _extends from "@babel/runtime/helpers/esm/extends";
import { ScrollableSimulatedProps } from "./simulated_strategy_props";
import { getDefaultUseNative, getDefaultNativeRefreshStrategy, getDefaultUseSimulatedScrollbar } from "../utils/get_default_option_value";
export var ScrollableProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(ScrollableSimulatedProps), Object.getOwnPropertyDescriptors({
  get useNative() {
    return getDefaultUseNative();
  },

  get useSimulatedScrollbar() {
    return getDefaultUseSimulatedScrollbar();
  },

  get refreshStrategy() {
    return getDefaultNativeRefreshStrategy();
  }

})));