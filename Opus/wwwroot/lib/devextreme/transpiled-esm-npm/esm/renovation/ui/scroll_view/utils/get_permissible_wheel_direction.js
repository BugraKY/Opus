import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from "../common/consts";
export function permissibleWheelDirection(direction, isShiftKey) {
  switch (direction) {
    case DIRECTION_HORIZONTAL:
      return DIRECTION_HORIZONTAL;

    case DIRECTION_VERTICAL:
      return DIRECTION_VERTICAL;

    default:
      return isShiftKey ? DIRECTION_HORIZONTAL : DIRECTION_VERTICAL;
  }
}