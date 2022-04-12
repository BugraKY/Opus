import { each } from "../../../core/utils/iterator";
export var removeDifferentElements = ($children, $newChildren) => {
  each($newChildren, (__, element) => {
    var hasComponent = false;
    each($children, (_, oldElement) => {
      if (element === oldElement) {
        hasComponent = true;
      }
    });

    if (!hasComponent && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
};