import _extends from "@babel/runtime/helpers/esm/extends";
import { isNumeric } from "../../../../core/utils/type";
export function getAugmentedLocation(location) {
  if (isNumeric(location)) {
    return {
      left: location,
      top: location
    };
  }

  return _extends({
    top: 0,
    left: 0
  }, location);
}