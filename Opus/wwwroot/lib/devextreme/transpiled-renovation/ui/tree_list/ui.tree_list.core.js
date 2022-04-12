"use strict";

exports.default = void 0;

var _extend = require("../../core/utils/extend");

var _uiGrid_core = _interopRequireDefault(require("../grid_core/ui.grid_core.modules"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _extend.extend)({}, _uiGrid_core.default, {
  modules: [],
  foreachNodes: function foreachNodes(nodes, callBack, ignoreHasChildren) {
    for (var i = 0; i < nodes.length; i++) {
      if (callBack(nodes[i]) !== false && (ignoreHasChildren || nodes[i].hasChildren) && nodes[i].children.length) {
        this.foreachNodes(nodes[i].children, callBack, ignoreHasChildren);
      }
    }
  }
});

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;