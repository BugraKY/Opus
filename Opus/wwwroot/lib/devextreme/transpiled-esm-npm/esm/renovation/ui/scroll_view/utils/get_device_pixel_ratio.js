import { getWindow, hasWindow } from "../../../../core/utils/window";
export function getDevicePixelRatio() {
  return hasWindow() ? getWindow().devicePixelRatio : 1;
}