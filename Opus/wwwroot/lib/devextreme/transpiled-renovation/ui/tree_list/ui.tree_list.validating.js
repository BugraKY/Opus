"use strict";

var _extend = require("../../core/utils/extend");

var _uiTree_list = _interopRequireDefault(require("./ui.tree_list.core"));

var _uiGrid_core = require("../grid_core/ui.grid_core.validating");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditingControllerExtender = (0, _extend.extend)({}, _uiGrid_core.validatingModule.extenders.controllers.editing);
delete EditingControllerExtender.processItems;
delete EditingControllerExtender.processDataItem;

_uiTree_list.default.registerModule('validating', {
  defaultOptions: _uiGrid_core.validatingModule.defaultOptions,
  controllers: _uiGrid_core.validatingModule.controllers,
  extenders: {
    controllers: {
      editing: EditingControllerExtender,
      editorFactory: _uiGrid_core.validatingModule.extenders.controllers.editorFactory
    },
    views: _uiGrid_core.validatingModule.extenders.views
  }
});