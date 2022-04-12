"use strict";

require("./ui.data_grid.editor_factory");

var _uiData_grid2 = _interopRequireDefault(require("./ui.data_grid.core"));

var _uiGrid_core = require("../grid_core/ui.grid_core.editing");

var _extend = require("../../core/utils/extend");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_uiData_grid2.default.registerModule('editing', (0, _extend.extend)(true, {}, _uiGrid_core.editingModule, {
  extenders: {
    controllers: {
      data: {
        _changeRowExpandCore: function _changeRowExpandCore(key) {
          var editingController = this._editingController;

          if (Array.isArray(key)) {
            editingController && editingController.refresh();
          }

          return this.callBase.apply(this, arguments);
        }
      }
    }
  }
}));