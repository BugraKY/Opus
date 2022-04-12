import { ensureDefined } from "../../../../core/utils/common";
export function getOffsetDistance(targetLocation, scrollOffset) {
  return {
    top: ensureDefined(targetLocation.top, scrollOffset.top) - scrollOffset.top,
    left: ensureDefined(targetLocation.left, scrollOffset.left) - scrollOffset.left
  };
}