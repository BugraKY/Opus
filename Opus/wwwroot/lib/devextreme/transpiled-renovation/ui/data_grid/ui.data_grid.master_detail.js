"use strict";

var _uiData_grid = _interopRequireDefault(require("./ui.data_grid.core"));

var _uiGrid_core = require("../grid_core/ui.grid_core.master_detail");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_uiData_grid.default.registerModule('masterDetail', _uiGrid_core.masterDetailModule);