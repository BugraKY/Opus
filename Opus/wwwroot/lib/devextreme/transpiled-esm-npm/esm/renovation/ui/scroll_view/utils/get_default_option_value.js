import devices from "../../../../core/devices";
import { nativeScrolling } from "../../../../core/utils/support";
import browser from "../../../../core/utils/browser";
export function isDesktop() {
  return !devices.isSimulator() && devices.real().deviceType === "desktop" && devices.current().platform === "generic";
}
export function getDefaultUseSimulatedScrollbar() {
  return !!nativeScrolling && devices.real().platform === "android" && !browser.mozilla;
}
export function getDefaultBounceEnabled() {
  return !isDesktop();
}
export function getDefaultUseNative() {
  return !!nativeScrolling;
}
export function getDefaultNativeRefreshStrategy() {
  return devices.real().platform === "android" ? "swipeDown" : "pullDown";
}