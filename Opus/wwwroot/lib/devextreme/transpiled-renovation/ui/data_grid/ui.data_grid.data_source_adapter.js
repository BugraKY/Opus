"use strict";

exports.default = void 0;

var _uiGrid_core = _interopRequireDefault(require("../grid_core/ui.grid_core.data_source_adapter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataSourceAdapterType = _uiGrid_core.default;
var _default = {
  extend: function extend(extender) {
    dataSourceAdapterType = dataSourceAdapterType.inherit(extender);
  },
  create: function create(component) {
    return new dataSourceAdapterType(component);
  }
};
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;