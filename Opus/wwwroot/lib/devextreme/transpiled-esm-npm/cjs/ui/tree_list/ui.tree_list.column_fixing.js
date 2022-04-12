"use strict";

var _uiTree_list = _interopRequireDefault(require("./ui.tree_list.core"));

var _uiGrid_core = require("../grid_core/ui.grid_core.column_fixing");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_uiTree_list.default.registerModule('columnFixing', _uiGrid_core.columnFixingModule);