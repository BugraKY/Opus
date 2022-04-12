"use strict";

exports.ColumnHeadersView = void 0;

var _uiData_grid = _interopRequireDefault(require("./ui.data_grid.core"));

var _uiGrid_core = require("../grid_core/ui.grid_core.column_headers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ColumnHeadersView = _uiGrid_core.columnHeadersModule.views.columnHeadersView;
exports.ColumnHeadersView = ColumnHeadersView;

_uiData_grid.default.registerModule('columnHeaders', _uiGrid_core.columnHeadersModule);