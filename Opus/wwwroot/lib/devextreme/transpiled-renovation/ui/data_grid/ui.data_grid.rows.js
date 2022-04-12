"use strict";

exports.RowsView = void 0;

var _uiData_grid = _interopRequireDefault(require("./ui.data_grid.core"));

var _uiGrid_core = require("../grid_core/ui.grid_core.rows");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RowsView = _uiGrid_core.rowsModule.views.rowsView;
exports.RowsView = RowsView;

_uiData_grid.default.registerModule('rows', _uiGrid_core.rowsModule);