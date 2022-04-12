"use strict";

exports.ColumnsController = void 0;

var _type = require("../../core/utils/type");

var _uiTree_list = _interopRequireDefault(require("./ui.tree_list.core"));

var _uiGrid_core = require("../grid_core/ui.grid_core.columns_controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ColumnsController = _uiGrid_core.columnsControllerModule.controllers.columns.inherit(function () {
  return {
    _getFirstItems: function _getFirstItems(dataSourceAdapter) {
      return this.callBase(dataSourceAdapter).map(function (node) {
        return node.data;
      });
    },
    getFirstDataColumnIndex: function getFirstDataColumnIndex() {
      var visibleColumns = this.getVisibleColumns();
      var visibleColumnsLength = visibleColumns.length;
      var firstDataColumnIndex = 0;

      for (var i = 0; i <= visibleColumnsLength - 1; i++) {
        if (!(0, _type.isDefined)(visibleColumns[i].command)) {
          firstDataColumnIndex = visibleColumns[i].index;
          break;
        }
      }

      return firstDataColumnIndex;
    }
  };
}());

exports.ColumnsController = ColumnsController;

_uiTree_list.default.registerModule('columns', {
  defaultOptions: _uiGrid_core.columnsControllerModule.defaultOptions,
  controllers: {
    columns: ColumnsController
  }
});