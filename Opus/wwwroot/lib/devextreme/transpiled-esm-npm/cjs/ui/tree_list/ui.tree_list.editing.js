"use strict";

require("./ui.tree_list.editor_factory");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _ui = _interopRequireDefault(require("../widget/ui.errors"));

var _type = require("../../core/utils/type");

var _extend = require("../../core/utils/extend");

var _deferred = require("../../core/utils/deferred");

var _message = _interopRequireDefault(require("../../localization/message"));

var _uiTree_list2 = _interopRequireDefault(require("./ui.tree_list.core"));

var _uiGrid_core = _interopRequireDefault(require("../grid_core/ui.grid_core.utils"));

var _uiGrid_core2 = require("../grid_core/ui.grid_core.editing");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TREELIST_EXPAND_ICON_CONTAINER_CLASS = 'dx-treelist-icon-container';
var SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';
var DATA_EDIT_DATA_INSERT_TYPE = 'insert';

var EditingController = _uiGrid_core2.editingModule.controllers.editing.inherit(function () {
  return {
    _generateNewItem: function _generateNewItem(key) {
      var item = this.callBase(key);
      item.data = {
        key: key
      };
      item.children = [];
      item.level = 0;
      item.parentKey = this.option('rootValue');
      return item;
    },
    _isProcessedItem: function _isProcessedItem() {
      return true;
    },
    _setInsertAfterOrBeforeKey: function _setInsertAfterOrBeforeKey(change, parentKey) {
      if (parentKey !== undefined && parentKey !== this.option('rootValue')) {
        change.insertAfterKey = parentKey;
      } else {
        this.callBase.apply(this, arguments);
      }
    },
    _getLoadedRowIndex: function _getLoadedRowIndex(items, change) {
      var dataController = this.getController('data');
      var dataSourceAdapter = dataController.dataSource();
      var parentKey = dataSourceAdapter === null || dataSourceAdapter === void 0 ? void 0 : dataSourceAdapter.parentKeyOf(change.data);

      if (parentKey !== undefined && parentKey !== this.option('rootValue')) {
        var rowIndex = _uiGrid_core.default.getIndexByKey(parentKey, items);

        if (rowIndex >= 0 && this._dataController.isRowExpanded(parentKey)) {
          return rowIndex + 1;
        }

        return -1;
      }

      return this.callBase.apply(this, arguments);
    },
    _isEditColumnVisible: function _isEditColumnVisible() {
      var result = this.callBase.apply(this, arguments);
      var editingOptions = this.option('editing');
      return result || editingOptions.allowAdding;
    },
    _isDefaultButtonVisible: function _isDefaultButtonVisible(button, options) {
      var result = this.callBase.apply(this, arguments);
      var row = options.row;

      if (button.name === 'add') {
        return this.allowAdding(options) && row.rowIndex !== this._getVisibleEditRowIndex() && !(row.removed || row.isNewRow);
      }

      return result;
    },
    _getEditingButtons: function _getEditingButtons(options) {
      var buttons = this.callBase.apply(this, arguments);

      if (!options.column.buttons) {
        buttons.unshift(this._getButtonConfig('add', options));
      }

      return buttons;
    },
    _beforeSaveEditData: function _beforeSaveEditData(change) {
      var dataController = this._dataController;
      var result = this.callBase.apply(this, arguments);

      if (change && change.type !== DATA_EDIT_DATA_INSERT_TYPE) {
        var store = dataController === null || dataController === void 0 ? void 0 : dataController.store();
        var key = store === null || store === void 0 ? void 0 : store.key();

        if (!(0, _type.isDefined)(key)) {
          throw _ui.default.Error('E1045');
        }
      }

      return result;
    },
    addRowByRowIndex: function addRowByRowIndex(rowIndex) {
      var dataController = this.getController('data');
      var row = dataController.getVisibleRows()[rowIndex];
      return this.addRow(row ? row.key : undefined);
    },
    addRow: function addRow(key) {
      if (key === undefined) {
        key = this.option('rootValue');
      }

      return this.callBase.call(this, key);
    },
    _addRowCore: function _addRowCore(data, parentKey, oldEditRowIndex) {
      var _this = this;

      var callBase = this.callBase;
      var rootValue = this.option('rootValue');
      var dataController = this.getController('data');
      var dataSourceAdapter = dataController.dataSource();
      var parentKeyGetter = dataSourceAdapter.createParentIdGetter();
      parentKey = parentKeyGetter(data);

      if (parentKey !== undefined && parentKey !== rootValue && !dataController.isRowExpanded(parentKey)) {
        var deferred = new _deferred.Deferred();
        dataController.expandRow(parentKey).done(function () {
          setTimeout(function () {
            callBase.call(_this, data, parentKey, oldEditRowIndex).done(deferred.resolve).fail(deferred.reject);
          });
        }).fail(deferred.reject);
        return deferred.promise();
      }

      return callBase.call(this, data, parentKey, oldEditRowIndex);
    },
    _initNewRow: function _initNewRow(options, parentKey) {
      var dataController = this.getController('data');
      var dataSourceAdapter = dataController.dataSource();
      var parentIdSetter = dataSourceAdapter.createParentIdSetter();
      parentIdSetter(options.data, parentKey);
      return this.callBase.apply(this, arguments);
    },
    allowAdding: function allowAdding(options) {
      return this._allowEditAction('allowAdding', options);
    },
    _needToCloseEditableCell: function _needToCloseEditableCell($targetElement) {
      return this.callBase.apply(this, arguments) || $targetElement.closest('.' + TREELIST_EXPAND_ICON_CONTAINER_CLASS).length && this.isEditing();
    },
    getButtonLocalizationNames: function getButtonLocalizationNames() {
      var names = this.callBase.apply(this);
      names.add = 'dxTreeList-editingAddRowToNode';
      return names;
    }
  };
}());

var originalRowClick = _uiGrid_core2.editingModule.extenders.views.rowsView._rowClick;
var originalRowDblClick = _uiGrid_core2.editingModule.extenders.views.rowsView._rowDblClick;

var validateClick = function validateClick(e) {
  var $targetElement = (0, _renderer.default)(e.event.target);
  var originalClickHandler = e.event.type === 'dxdblclick' ? originalRowDblClick : originalRowClick;

  if ($targetElement.closest('.' + SELECT_CHECKBOX_CLASS).length) {
    return false;
  }

  return !needToCallOriginalClickHandler.call(this, e, originalClickHandler);
};

function needToCallOriginalClickHandler(e, originalClickHandler) {
  var $targetElement = (0, _renderer.default)(e.event.target);

  if (!$targetElement.closest('.' + TREELIST_EXPAND_ICON_CONTAINER_CLASS).length) {
    originalClickHandler.call(this, e);
    return true;
  }

  return false;
}

var RowsViewExtender = (0, _extend.extend)({}, _uiGrid_core2.editingModule.extenders.views.rowsView, {
  _renderCellCommandContent: function _renderCellCommandContent($container, options) {
    var editingController = this._editingController;
    var isEditRow = options.row && editingController.isEditRow(options.row.rowIndex);
    var isEditing = options.isEditing || isEditRow;

    if (!isEditing) {
      return this.callBase.apply(this, arguments);
    }

    return false;
  },
  _rowClick: function _rowClick(e) {
    if (validateClick.call(this, e)) {
      this.callBase.apply(this, arguments);
    }
  },
  _rowDblClick: function _rowDblClick(e) {
    if (validateClick.call(this, e)) {
      this.callBase.apply(this, arguments);
    }
  }
});

_uiTree_list2.default.registerModule('editing', {
  defaultOptions: function defaultOptions() {
    return (0, _extend.extend)(true, _uiGrid_core2.editingModule.defaultOptions(), {
      editing: {
        texts: {
          addRowToNode: _message.default.format('dxTreeList-editingAddRowToNode')
        }
      }
    });
  },
  controllers: {
    editing: EditingController
  },
  extenders: {
    controllers: (0, _extend.extend)(true, {}, _uiGrid_core2.editingModule.extenders.controllers, {
      data: {
        changeRowExpand: function changeRowExpand() {
          this._editingController.refresh();

          return this.callBase.apply(this, arguments);
        }
      }
    }),
    views: {
      rowsView: RowsViewExtender,
      headerPanel: _uiGrid_core2.editingModule.extenders.views.headerPanel
    }
  }
});