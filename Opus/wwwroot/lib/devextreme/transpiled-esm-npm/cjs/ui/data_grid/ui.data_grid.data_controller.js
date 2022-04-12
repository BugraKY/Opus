"use strict";

exports.DataController = void 0;

var _uiData_grid = _interopRequireDefault(require("./ui.data_grid.core"));

var _ui = _interopRequireDefault(require("../widget/ui.errors"));

var _uiData_grid2 = _interopRequireDefault(require("./ui.data_grid.data_source_adapter"));

var _uiGrid_core = require("../grid_core/ui.grid_core.data_controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataController = _uiGrid_core.dataControllerModule.controllers.data.inherit(function () {
  return {
    _getDataSourceAdapter: function _getDataSourceAdapter() {
      return _uiData_grid2.default;
    },
    _getSpecificDataSourceOption: function _getSpecificDataSourceOption() {
      var dataSource = this.option('dataSource');

      if (dataSource && !Array.isArray(dataSource) && this.option('keyExpr')) {
        _ui.default.log('W1011');
      }

      return this.callBase();
    }
  };
}());

exports.DataController = DataController;

_uiData_grid.default.registerModule('data', {
  defaultOptions: _uiGrid_core.dataControllerModule.defaultOptions,
  controllers: {
    data: DataController
  }
});