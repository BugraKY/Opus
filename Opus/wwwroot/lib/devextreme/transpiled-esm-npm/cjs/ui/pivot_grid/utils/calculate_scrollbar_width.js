"use strict";

exports.calculateScrollbarWidth = void 0;

var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));

var _call_once = _interopRequireDefault(require("../../../core/utils/call_once"));

var _get_scrollbar_width = require("./get_scrollbar_width");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var calculateScrollbarWidth = (0, _call_once.default)(function () {
  var document = _dom_adapter.default.getDocument();

  document.body.insertAdjacentHTML('beforeend', '<div style=\'position: absolute; overflow: scroll; width: 100px; height: 100px; top: -9999;\'></div>');
  var scrollbar = document.body.lastElementChild;
  var scrollbarWidth = (0, _get_scrollbar_width.getScrollbarWidth)(scrollbar);
  document.body.removeChild(scrollbar);
  return scrollbarWidth;
});
exports.calculateScrollbarWidth = calculateScrollbarWidth;