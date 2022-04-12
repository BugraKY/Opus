// eslint-disable-next-line no-restricted-imports
import ko from 'knockout';
export var getClosestNodeWithContext = node => {
  var context = ko.contextFor(node);

  if (!context && node.parentNode) {
    return getClosestNodeWithContext(node.parentNode);
  }

  return node;
};