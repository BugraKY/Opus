"use strict";

exports.ColumnChooserView = exports.ColumnChooserController = void 0;

var _uiData_grid = _interopRequireDefault(require("./ui.data_grid.core"));

var _uiGrid_core = require("../grid_core/ui.grid_core.column_chooser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ColumnChooserController = _uiGrid_core.columnChooserModule.controllers.columnChooser;
exports.ColumnChooserController = ColumnChooserController;
var ColumnChooserView = _uiGrid_core.columnChooserModule.views.columnChooserView;
exports.ColumnChooserView = ColumnChooserView;

_uiData_grid.default.registerModule('columnChooser', _uiGrid_core.columnChooserModule);