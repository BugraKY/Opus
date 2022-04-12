"use strict";

exports.getClosestNodeWithContext = void 0;

var _knockout = _interopRequireDefault(require("knockout"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-restricted-imports
var getClosestNodeWithContext = function getClosestNodeWithContext(node) {
  var context = _knockout.default.contextFor(node);

  if (!context && node.parentNode) {
    return getClosestNodeWithContext(node.parentNode);
  }

  return node;
};

exports.getClosestNodeWithContext = getClosestNodeWithContext;