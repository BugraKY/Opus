import { DIRECTION_BOTH, DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from "../common/consts";
import { ScrollDirection } from "./scroll_direction";
export function allowedDirection(direction, scrollTopMax, scrollLeftMax, bounceEnabled) {
  var {
    isBoth,
    isHorizontal,
    isVertical
  } = new ScrollDirection(direction);
  var vDirectionAllowed = isVertical && (scrollTopMax > 0 || bounceEnabled);
  var hDirectionAllowed = isHorizontal && (scrollLeftMax > 0 || bounceEnabled);

  if (isBoth && vDirectionAllowed && hDirectionAllowed) {
    return DIRECTION_BOTH;
  }

  if (isHorizontal && hDirectionAllowed) {
    return DIRECTION_HORIZONTAL;
  }

  if (isVertical && vDirectionAllowed) {
    return DIRECTION_VERTICAL;
  }

  return undefined;
}