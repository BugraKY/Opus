import resizeObserverSingleton from "../../../../core/resize_observer";
import { hasWindow } from "../../../../core/utils/window";
import { requestAnimationFrame, cancelAnimationFrame } from "../../../../animation/frame";
export function subscribeToResize(element, handler) {
  if (hasWindow() && element) {
    var resizeAnimationFrameID = -1;
    resizeObserverSingleton.observe(element, _ref => {
      var {
        target
      } = _ref;
      resizeAnimationFrameID = requestAnimationFrame(() => {
        handler(target);
      });
    });
    return () => {
      cancelAnimationFrame(resizeAnimationFrameID);
      resizeObserverSingleton.unobserve(element);
    };
  }

  return undefined;
}