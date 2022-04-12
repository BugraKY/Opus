"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

exports.editingModule = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _guid = _interopRequireDefault(require("../../core/guid"));

var _dom = require("../../core/utils/dom");

var _type = require("../../core/utils/type");

var _iterator = require("../../core/utils/iterator");

var _extend = require("../../core/utils/extend");

var _uiGrid_core = _interopRequireDefault(require("./ui.grid_core.modules"));

var _click = require("../../events/click");

var _pointer = _interopRequireDefault(require("../../events/pointer"));

var _uiGrid_core2 = _interopRequireDefault(require("./ui.grid_core.utils"));

var _array_utils = require("../../data/array_utils");

var _index = require("../../events/utils/index");

var _dialog = require("../dialog");

var _message = _interopRequireDefault(require("../../localization/message"));

var _devices = _interopRequireDefault(require("../../core/devices"));

var _deferred = require("../../core/utils/deferred");

var _common = require("../../core/utils/common");

var iconUtils = _interopRequireWildcard(require("../../core/utils/icon"));

var _uiGrid_core3 = require("./ui.grid_core.editing_constants");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var READONLY_CLASS = 'readonly';
var LINK_CLASS = 'dx-link';
var ROW_SELECTED = 'dx-selection';
var EDIT_BUTTON_CLASS = 'dx-edit-button';
var COMMAND_EDIT_CLASS = 'dx-command-edit';
var COMMAND_EDIT_WITH_ICONS_CLASS = COMMAND_EDIT_CLASS + '-with-icons';
var INSERT_INDEX = '__DX_INSERT_INDEX__';
var ROW_INSERTED = 'dx-row-inserted';
var ROW_MODIFIED = 'dx-row-modified';
var CELL_MODIFIED = 'dx-cell-modified';
var EDITING_NAMESPACE = 'dxDataGridEditing';
var CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
var DATA_EDIT_DATA_UPDATE_TYPE = 'update';
var DEFAULT_START_EDIT_ACTION = 'click';
var EDIT_LINK_CLASS = {
  save: 'dx-link-save',
  cancel: 'dx-link-cancel',
  edit: 'dx-link-edit',
  undelete: 'dx-link-undelete',
  delete: 'dx-link-delete',
  add: 'dx-link-add'
};
var EDIT_ICON_CLASS = {
  save: 'save',
  cancel: 'revert',
  edit: 'edit',
  undelete: 'revert',
  delete: 'trash',
  add: 'add'
};
var METHOD_NAMES = {
  edit: 'editRow',
  delete: 'deleteRow',
  undelete: 'undeleteRow',
  save: 'saveEditData',
  cancel: 'cancelEditData',
  add: 'addRowByRowIndex'
};
var ACTION_OPTION_NAMES = {
  add: 'allowAdding',
  edit: 'allowUpdating',
  delete: 'allowDeleting'
};
var BUTTON_NAMES = ['edit', 'save', 'cancel', 'delete', 'undelete'];
var EDITING_CHANGES_OPTION_NAME = 'editing.changes';

var createFailureHandler = function createFailureHandler(deferred) {
  return function (arg) {
    var error = arg instanceof Error ? arg : new Error(arg && String(arg) || 'Unknown error');
    deferred.reject(error);
  };
};

var isEditingCell = function isEditingCell(isEditRow, cellOptions) {
  return cellOptions.isEditing || isEditRow && cellOptions.column.allowEditing;
};

var isEditingOrShowEditorAlwaysDataCell = function isEditingOrShowEditorAlwaysDataCell(isEditRow, cellOptions) {
  var isCommandCell = !!cellOptions.column.command;
  var isEditing = isEditingCell(isEditRow, cellOptions);
  var isEditorCell = !isCommandCell && (isEditing || cellOptions.column.showEditorAlways);
  return cellOptions.rowType === 'data' && isEditorCell;
};

var EditingController = _uiGrid_core.default.ViewController.inherit(function () {
  var getEditingTexts = function getEditingTexts(options) {
    var editingTexts = options.component.option('editing.texts') || {};
    return {
      save: editingTexts.saveRowChanges,
      cancel: editingTexts.cancelRowChanges,
      edit: editingTexts.editRow,
      undelete: editingTexts.undeleteRow,
      delete: editingTexts.deleteRow,
      add: editingTexts.addRowToNode
    };
  };

  var getButtonIndex = function getButtonIndex(buttons, name) {
    var result = -1;
    buttons.some(function (button, index) {
      if (getButtonName(button) === name) {
        result = index;
        return true;
      }
    });
    return result;
  };

  function getButtonName(button) {
    return (0, _type.isObject)(button) ? button.name : button;
  }

  return {
    init: function init() {
      this._columnsController = this.getController('columns');
      this._dataController = this.getController('data');
      this._rowsView = this.getView('rowsView');
      this._lastOperation = null;

      if (this._deferreds) {
        this._deferreds.forEach(function (d) {
          return d.reject('cancel');
        });
      }

      this._deferreds = [];

      if (!this._dataChangedHandler) {
        this._dataChangedHandler = this._handleDataChanged.bind(this);

        this._dataController.changed.add(this._dataChangedHandler);
      }

      if (!this._saveEditorHandler) {
        this.createAction('onInitNewRow', {
          excludeValidators: ['disabled', 'readOnly']
        });
        this.createAction('onRowInserting', {
          excludeValidators: ['disabled', 'readOnly']
        });
        this.createAction('onRowInserted', {
          excludeValidators: ['disabled', 'readOnly']
        });
        this.createAction('onEditingStart', {
          excludeValidators: ['disabled', 'readOnly']
        });
        this.createAction('onRowUpdating', {
          excludeValidators: ['disabled', 'readOnly']
        });
        this.createAction('onRowUpdated', {
          excludeValidators: ['disabled', 'readOnly']
        });
        this.createAction('onRowRemoving', {
          excludeValidators: ['disabled', 'readOnly']
        });
        this.createAction('onRowRemoved', {
          excludeValidators: ['disabled', 'readOnly']
        });
        this.createAction('onSaved', {
          excludeValidators: ['disabled', 'readOnly']
        });
        this.createAction('onSaving', {
          excludeValidators: ['disabled', 'readOnly']
        });
        this.createAction('onEditCanceling', {
          excludeValidators: ['disabled', 'readOnly']
        });
        this.createAction('onEditCanceled', {
          excludeValidators: ['disabled', 'readOnly']
        });
      }

      this._updateEditColumn();

      this._updateEditButtons();

      if (!this._internalState) {
        this._internalState = [];
      }

      this.component._optionsByReference[_uiGrid_core3.EDITING_EDITROWKEY_OPTION_NAME] = true;
      this.component._optionsByReference[EDITING_CHANGES_OPTION_NAME] = true;
    },
    getEditMode: function getEditMode() {
      var editMode = this.option('editing.mode');

      if (_uiGrid_core3.EDIT_MODES.indexOf(editMode) !== -1) {
        return editMode;
      }

      return _uiGrid_core3.EDIT_MODE_ROW;
    },
    _getDefaultEditorTemplate: function _getDefaultEditorTemplate() {
      var _this = this;

      return function (container, options) {
        var $editor = (0, _renderer.default)('<div>').appendTo(container);

        _this.getController('editorFactory').createEditor($editor, (0, _extend.extend)({}, options.column, {
          value: options.value,
          setValue: options.setValue,
          row: options.row,
          parentType: 'dataRow',
          width: null,
          readOnly: !options.setValue,
          isOnForm: options.isOnForm,
          id: options.id
        }));
      };
    },
    _getNewRowPosition: function _getNewRowPosition() {
      var newRowPosition = this.option('editing.newRowPosition');
      var scrollingMode = this.option('scrolling.mode');

      if (scrollingMode === 'virtual') {
        switch (newRowPosition) {
          case _uiGrid_core3.PAGE_TOP_NEW_ROW_POSITION:
            return _uiGrid_core3.VIEWPORT_TOP_NEW_ROW_POSITION;

          case _uiGrid_core3.PAGE_BOTTOM_NEW_ROW_POSITION:
            return _uiGrid_core3.VIEWPORT_BOTTOM_NEW_ROW_POSITION;

          default:
            return newRowPosition;
        }
      }

      return newRowPosition;
    },
    getChanges: function getChanges() {
      return this.option(EDITING_CHANGES_OPTION_NAME);
    },
    getInsertRowCount: function getInsertRowCount() {
      var changes = this.option(EDITING_CHANGES_OPTION_NAME);
      return changes.filter(function (change) {
        return change.type === 'insert';
      }).length;
    },
    resetChanges: function resetChanges() {
      var changes = this.getChanges();
      var needReset = changes === null || changes === void 0 ? void 0 : changes.length;

      if (needReset) {
        this._silentOption(EDITING_CHANGES_OPTION_NAME, []);
      }
    },
    _getInternalData: function _getInternalData(key) {
      return this._internalState.filter(function (item) {
        return (0, _common.equalByValue)(item.key, key);
      })[0];
    },
    _addInternalData: function _addInternalData(params) {
      var internalData = this._getInternalData(params.key);

      if (internalData) {
        return (0, _extend.extend)(internalData, params);
      }

      this._internalState.push(params);

      return params;
    },
    _getOldData: function _getOldData(key) {
      var _this$_getInternalDat;

      return (_this$_getInternalDat = this._getInternalData(key)) === null || _this$_getInternalDat === void 0 ? void 0 : _this$_getInternalDat.oldData;
    },
    getUpdatedData: function getUpdatedData(data) {
      var key = this._dataController.keyOf(data);

      var changes = this.getChanges();

      var editIndex = _uiGrid_core2.default.getIndexByKey(key, changes);

      if (changes[editIndex]) {
        return (0, _array_utils.createObjectWithChanges)(data, changes[editIndex].data);
      }

      return data;
    },
    getInsertedData: function getInsertedData() {
      return this.getChanges().filter(function (change) {
        return change.data && change.type === _uiGrid_core3.DATA_EDIT_DATA_INSERT_TYPE;
      }).map(function (change) {
        return change.data;
      });
    },
    getRemovedData: function getRemovedData() {
      var _this2 = this;

      return this.getChanges().filter(function (change) {
        return _this2._getOldData(change.key) && change.type === _uiGrid_core3.DATA_EDIT_DATA_REMOVE_TYPE;
      }).map(function (change) {
        return _this2._getOldData(change.key);
      });
    },
    _fireDataErrorOccurred: function _fireDataErrorOccurred(arg) {
      if (arg === 'cancel') return;
      var $popupContent = this.getPopupContent();

      this._dataController.dataErrorOccurred.fire(arg, $popupContent);
    },
    _needToCloseEditableCell: _common.noop,
    _closeEditItem: _common.noop,
    _handleDataChanged: _common.noop,
    _isDefaultButtonVisible: function _isDefaultButtonVisible(button, options) {
      var result = true;

      switch (button.name) {
        case 'delete':
          result = this.allowDeleting(options);
          break;

        case 'undelete':
          result = false;
      }

      return result;
    },
    _isButtonVisible: function _isButtonVisible(button, options) {
      var visible = button.visible;

      if (!(0, _type.isDefined)(visible)) {
        return this._isDefaultButtonVisible(button, options);
      }

      return (0, _type.isFunction)(visible) ? visible.call(button, {
        component: options.component,
        row: options.row,
        column: options.column
      }) : visible;
    },
    _isButtonDisabled: function _isButtonDisabled(button, options) {
      var disabled = button.disabled;
      return (0, _type.isFunction)(disabled) ? disabled.call(button, {
        component: options.component,
        row: options.row,
        column: options.column
      }) : !!disabled;
    },
    _getButtonConfig: function _getButtonConfig(button, options) {
      var _this3 = this;

      var config = (0, _type.isObject)(button) ? button : {};
      var buttonName = getButtonName(button);
      var editingTexts = getEditingTexts(options);
      var methodName = METHOD_NAMES[buttonName];
      var editingOptions = this.option('editing');
      var actionName = ACTION_OPTION_NAMES[buttonName];
      var allowAction = actionName ? editingOptions[actionName] : true;
      return (0, _extend.extend)({
        name: buttonName,
        text: editingTexts[buttonName],
        cssClass: EDIT_LINK_CLASS[buttonName]
      }, {
        onClick: methodName && function (e) {
          var event = e.event;
          event.stopPropagation();
          event.preventDefault();
          setTimeout(function () {
            options.row && allowAction && _this3[methodName] && _this3[methodName](options.row.rowIndex);
          });
        }
      }, config);
    },
    _getEditingButtons: function _getEditingButtons(options) {
      var _this4 = this;

      var buttonIndex;
      var haveCustomButtons = !!options.column.buttons;
      var buttons = (options.column.buttons || []).slice();

      if (haveCustomButtons) {
        buttonIndex = getButtonIndex(buttons, 'edit');

        if (buttonIndex >= 0) {
          if (getButtonIndex(buttons, 'save') < 0) {
            buttons.splice(buttonIndex + 1, 0, 'save');
          }

          if (getButtonIndex(buttons, 'cancel') < 0) {
            buttons.splice(getButtonIndex(buttons, 'save') + 1, 0, 'cancel');
          }
        }

        buttonIndex = getButtonIndex(buttons, 'delete');

        if (buttonIndex >= 0 && getButtonIndex(buttons, 'undelete') < 0) {
          buttons.splice(buttonIndex + 1, 0, 'undelete');
        }
      } else {
        buttons = BUTTON_NAMES.slice();
      }

      return buttons.map(function (button) {
        return _this4._getButtonConfig(button, options);
      });
    },
    _renderEditingButtons: function _renderEditingButtons($container, buttons, options, change) {
      var _this5 = this;

      buttons.forEach(function (button) {
        if (_this5._isButtonVisible(button, options)) {
          _this5._createButton($container, button, options, change);
        }
      });
    },
    _getEditCommandCellTemplate: function _getEditCommandCellTemplate() {
      var _this6 = this;

      return function (container, options, change) {
        var $container = (0, _renderer.default)(container);

        if (options.rowType === 'data') {
          var buttons = _this6._getEditingButtons(options);

          _this6._renderEditingButtons($container, buttons, options, change);

          options.watch && options.watch(function () {
            return buttons.map(function (button) {
              return _this6._isButtonVisible(button, options);
            });
          }, function () {
            $container.empty();

            _this6._renderEditingButtons($container, buttons, options);
          });
        } else {
          _uiGrid_core2.default.setEmptyText($container);
        }
      };
    },
    isRowBasedEditMode: function isRowBasedEditMode() {
      var editMode = this.getEditMode();
      return _uiGrid_core3.ROW_BASED_MODES.indexOf(editMode) !== -1;
    },
    getFirstEditableColumnIndex: function getFirstEditableColumnIndex() {
      var columnsController = this.getController('columns');
      var columnIndex;
      var visibleColumns = columnsController.getVisibleColumns();
      (0, _iterator.each)(visibleColumns, function (index, column) {
        if (column.allowEditing) {
          columnIndex = index;
          return false;
        }
      });
      return columnIndex;
    },
    getFirstEditableCellInRow: function getFirstEditableCellInRow(rowIndex) {
      var rowsView = this.getView('rowsView');
      return rowsView && rowsView._getCellElement(rowIndex ? rowIndex : 0, this.getFirstEditableColumnIndex());
    },
    getFocusedCellInRow: function getFocusedCellInRow(rowIndex) {
      return this.getFirstEditableCellInRow(rowIndex);
    },
    getIndexByKey: function getIndexByKey(key, items) {
      return _uiGrid_core2.default.getIndexByKey(key, items);
    },
    hasChanges: function hasChanges(rowIndex) {
      var changes = this.getChanges();
      var result = false;

      for (var i = 0; i < (changes === null || changes === void 0 ? void 0 : changes.length); i++) {
        if (changes[i].type && (!(0, _type.isDefined)(rowIndex) || this._dataController.getRowIndexByKey(changes[i].key) === rowIndex)) {
          result = true;
          break;
        }
      }

      return result;
    },
    dispose: function dispose() {
      this.callBase();
      clearTimeout(this._inputFocusTimeoutID);

      _events_engine.default.off(_dom_adapter.default.getDocument(), _pointer.default.up, this._pointerUpEditorHandler);

      _events_engine.default.off(_dom_adapter.default.getDocument(), _pointer.default.down, this._pointerDownEditorHandler);

      _events_engine.default.off(_dom_adapter.default.getDocument(), _click.name, this._saveEditorHandler);
    },
    optionChanged: function optionChanged(args) {
      if (args.name === 'editing') {
        var fullName = args.fullName;

        if (fullName === _uiGrid_core3.EDITING_EDITROWKEY_OPTION_NAME) {
          this._handleEditRowKeyChange(args);
        } else if (fullName === EDITING_CHANGES_OPTION_NAME) {
          this._handleChangesChange(args);
        } else if (!args.handled) {
          this._columnsController.reinit();

          this.init();
          this.resetChanges();

          this._resetEditColumnName();

          this._resetEditRowKey();
        }

        args.handled = true;
      } else {
        this.callBase(args);
      }
    },
    _handleEditRowKeyChange: function _handleEditRowKeyChange(args) {
      var rowIndex = this._dataController.getRowIndexByKey(args.value);

      var oldRowIndexCorrection = this._getEditRowIndexCorrection();

      var oldRowIndex = this._dataController.getRowIndexByKey(args.previousValue) + oldRowIndexCorrection;

      if ((0, _type.isDefined)(args.value)) {
        if (args.value !== args.previousValue) {
          this._editRowFromOptionChanged(rowIndex, oldRowIndex);
        }
      } else {
        this.cancelEditData();
      }
    },
    _handleChangesChange: function _handleChangesChange(args) {
      var dataController = this._dataController;

      if (!args.value.length && !args.previousValue.length) {
        return;
      }

      this._processInsertChanges(args.value);

      dataController.updateItems({
        repaintChangesOnly: true
      });
    },
    _processInsertChanges: function _processInsertChanges(changes) {
      var _this7 = this;

      changes.forEach(function (change) {
        if (change.type === 'insert') {
          _this7._addInsertInfo(change);
        }
      });
    },
    publicMethods: function publicMethods() {
      return ['addRow', 'deleteRow', 'undeleteRow', 'editRow', 'saveEditData', 'cancelEditData', 'hasEditData'];
    },
    refresh: function refresh(isPageChanged) {
      if (!(0, _type.isDefined)(this._pageIndex)) {
        return;
      }

      this._refreshCore(isPageChanged);
    },
    _refreshCore: _common.noop,
    isEditing: function isEditing() {
      var isEditRowKeyDefined = (0, _type.isDefined)(this.option(_uiGrid_core3.EDITING_EDITROWKEY_OPTION_NAME));
      return isEditRowKeyDefined;
    },
    isEditRow: function isEditRow() {
      return false;
    },
    _setEditRowKey: function _setEditRowKey(value, silent) {
      if (silent) {
        this._silentOption(_uiGrid_core3.EDITING_EDITROWKEY_OPTION_NAME, value);
      } else {
        this.option(_uiGrid_core3.EDITING_EDITROWKEY_OPTION_NAME, value);
      }
    },
    _setEditRowKeyByIndex: function _setEditRowKeyByIndex(rowIndex, silent) {
      var key = this._dataController.getKeyByRowIndex(rowIndex);

      if (key === undefined) {
        this._dataController.fireError('E1043');

        return;
      }

      this._setEditRowKey(key, silent);
    },
    getEditRowIndex: function getEditRowIndex() {
      return this._getVisibleEditRowIndex();
    },
    getEditFormRowIndex: function getEditFormRowIndex() {
      return -1;
    },
    _isEditRowByIndex: function _isEditRowByIndex(rowIndex) {
      var key = this._dataController.getKeyByRowIndex(rowIndex); // Vitik: performance optimization equalByValue take O(1)


      var isKeyEqual = (0, _type.isDefined)(key) && (0, _common.equalByValue)(this.option(_uiGrid_core3.EDITING_EDITROWKEY_OPTION_NAME), key);

      if (isKeyEqual) {
        // Vitik: performance optimization _getVisibleEditRowIndex take O(n)
        return this._getVisibleEditRowIndex() === rowIndex;
      }

      return isKeyEqual;
    },
    isEditCell: function isEditCell(visibleRowIndex, columnIndex) {
      return this._isEditRowByIndex(visibleRowIndex) && this._getVisibleEditColumnIndex() === columnIndex;
    },
    getPopupContent: _common.noop,
    _isProcessedItem: function _isProcessedItem(item) {
      return false;
    },
    _getInsertRowIndex: function _getInsertRowIndex(items, change, isProcessedItems) {
      var _this8 = this;

      var result = -1;
      var dataController = this._dataController;

      var key = this._getInsertAfterOrBeforeKey(change);

      if (!(0, _type.isDefined)(key) && items.length === 0) {
        result = 0;
      } else if ((0, _type.isDefined)(key)) {
        items.some(function (item, index) {
          var isProcessedItem = isProcessedItems || _this8._isProcessedItem(item);

          if ((0, _type.isObject)(item)) {
            if (isProcessedItem || (0, _type.isDefined)(item[INSERT_INDEX])) {
              if ((0, _common.equalByValue)(item.key, key)) {
                result = index;
              }
            } else if ((0, _common.equalByValue)(dataController.keyOf(item), key)) {
              result = index;
            }
          }

          if (result >= 0) {
            var nextItem = items[result + 1];

            if (nextItem && (nextItem.rowType === 'detail' || nextItem.rowType === 'detailAdaptive') && (0, _type.isDefined)(change.insertAfterKey)) {
              return;
            }

            if ((0, _type.isDefined)(change.insertAfterKey)) {
              result += 1;
            }

            return true;
          }
        });
      }

      return result;
    },
    _generateNewItem: function _generateNewItem(key) {
      var _this$_getInternalDat2;

      var item = {
        key: key
      };
      var insertInfo = (_this$_getInternalDat2 = this._getInternalData(key)) === null || _this$_getInternalDat2 === void 0 ? void 0 : _this$_getInternalDat2.insertInfo;

      if (insertInfo !== null && insertInfo !== void 0 && insertInfo[INSERT_INDEX]) {
        item[INSERT_INDEX] = insertInfo[INSERT_INDEX];
      }

      return item;
    },
    _getLoadedRowIndex: function _getLoadedRowIndex(items, change, isProcessedItems) {
      var loadedRowIndex = this._getInsertRowIndex(items, change, isProcessedItems);

      var dataController = this._dataController;

      if (loadedRowIndex < 0) {
        var newRowPosition = this._getNewRowPosition();

        var pageIndex = dataController.pageIndex();

        var insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);

        if (newRowPosition !== _uiGrid_core3.LAST_NEW_ROW_POSITION && pageIndex === 0 && !(0, _type.isDefined)(insertAfterOrBeforeKey)) {
          loadedRowIndex = 0;
        } else if (newRowPosition === _uiGrid_core3.LAST_NEW_ROW_POSITION && dataController.isLastPageLoaded()) {
          loadedRowIndex = items.length;
        }
      }

      return loadedRowIndex;
    },
    processItems: function processItems(items, e) {
      var _this9 = this;

      var changeType = e.changeType;
      this.update(changeType);
      var changes = this.getChanges();
      changes.forEach(function (change) {
        var _this9$_getInternalDa;

        var isInsert = change.type === _uiGrid_core3.DATA_EDIT_DATA_INSERT_TYPE;

        if (!isInsert) {
          return;
        }

        var key = change.key;
        var insertInfo = (_this9$_getInternalDa = _this9._getInternalData(key)) === null || _this9$_getInternalDa === void 0 ? void 0 : _this9$_getInternalDa.insertInfo;

        if (!(0, _type.isDefined)(key) || !(0, _type.isDefined)(insertInfo)) {
          insertInfo = _this9._addInsertInfo(change);
          key = insertInfo.key;
        }

        var loadedRowIndex = _this9._getLoadedRowIndex(items, change);

        var item = _this9._generateNewItem(key);

        if (loadedRowIndex >= 0) {
          items.splice(loadedRowIndex, 0, item);
        }
      });
      return items;
    },
    processDataItem: function processDataItem(item, options, generateDataValues) {
      var columns = options.visibleColumns;
      var key = item.data[INSERT_INDEX] ? item.data.key : item.key;
      var changes = this.getChanges();

      var editIndex = _uiGrid_core2.default.getIndexByKey(key, changes);

      item.isEditing = false;

      if (editIndex >= 0) {
        this._processDataItemCore(item, changes[editIndex], key, columns, generateDataValues);
      }
    },
    _processDataItemCore: function _processDataItemCore(item, change, key, columns, generateDataValues) {
      var data = change.data,
          type = change.type;

      switch (type) {
        case _uiGrid_core3.DATA_EDIT_DATA_INSERT_TYPE:
          item.isNewRow = true;
          item.key = key;
          item.data = data;
          break;

        case DATA_EDIT_DATA_UPDATE_TYPE:
          item.modified = true;
          item.oldData = item.data;
          item.data = (0, _array_utils.createObjectWithChanges)(item.data, data);
          item.modifiedValues = generateDataValues(data, columns, true);
          break;

        case _uiGrid_core3.DATA_EDIT_DATA_REMOVE_TYPE:
          item.removed = true;
          break;
      }
    },
    _initNewRow: function _initNewRow(options) {
      var _this10 = this;

      this.executeAction('onInitNewRow', options);

      if (options.promise) {
        var deferred = new _deferred.Deferred();
        (0, _deferred.when)((0, _deferred.fromPromise)(options.promise)).done(deferred.resolve).fail(createFailureHandler(deferred)).fail(function (arg) {
          return _this10._fireDataErrorOccurred(arg);
        });
        return deferred;
      }
    },
    _createInsertInfo: function _createInsertInfo() {
      var insertInfo = {};
      insertInfo[INSERT_INDEX] = this._getInsertIndex();
      return insertInfo;
    },
    _addInsertInfo: function _addInsertInfo(change, parentKey) {
      var _this$_getInternalDat3;

      var insertInfo;
      var key = change.key;

      if (!(0, _type.isDefined)(key)) {
        key = String(new _guid.default());
        change.key = key;
      }

      insertInfo = (_this$_getInternalDat3 = this._getInternalData(key)) === null || _this$_getInternalDat3 === void 0 ? void 0 : _this$_getInternalDat3.insertInfo;

      if (!(0, _type.isDefined)(insertInfo)) {
        var insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);

        insertInfo = this._createInsertInfo();

        if (!(0, _type.isDefined)(insertAfterOrBeforeKey)) {
          this._setInsertAfterOrBeforeKey(change, parentKey);
        }
      }

      this._addInternalData({
        insertInfo: insertInfo,
        key: key
      });

      return {
        insertInfo: insertInfo,
        key: key
      };
    },
    _setInsertAfterOrBeforeKey: function _setInsertAfterOrBeforeKey(change, parentKey) {
      var dataController = this._dataController;
      var allItems = dataController.items(true);
      var rowsView = this.getView('rowsView');

      var newRowPosition = this._getNewRowPosition();

      switch (newRowPosition) {
        case _uiGrid_core3.FIRST_NEW_ROW_POSITION:
        case _uiGrid_core3.LAST_NEW_ROW_POSITION:
          break;

        case _uiGrid_core3.PAGE_TOP_NEW_ROW_POSITION:
        case _uiGrid_core3.PAGE_BOTTOM_NEW_ROW_POSITION:
          if (allItems.length) {
            var itemIndex = newRowPosition === _uiGrid_core3.PAGE_TOP_NEW_ROW_POSITION ? 0 : allItems.length - 1;
            change[itemIndex === 0 ? 'insertBeforeKey' : 'insertAfterKey'] = allItems[itemIndex].key;
          }

          break;

        default:
          {
            var isViewportBottom = newRowPosition === _uiGrid_core3.VIEWPORT_BOTTOM_NEW_ROW_POSITION;
            var visibleItemIndex = isViewportBottom ? rowsView === null || rowsView === void 0 ? void 0 : rowsView.getBottomVisibleItemIndex() : rowsView === null || rowsView === void 0 ? void 0 : rowsView.getTopVisibleItemIndex();
            var row = dataController.getVisibleRows()[visibleItemIndex];

            if (row && (!row.isEditing && row.rowType === 'detail' || row.rowType === 'detailAdaptive')) {
              visibleItemIndex++;
            }

            var insertKey = dataController.getKeyByRowIndex(visibleItemIndex);

            if ((0, _type.isDefined)(insertKey)) {
              change['insertBeforeKey'] = insertKey;
            }
          }
      }
    },
    _getInsertIndex: function _getInsertIndex() {
      var _this11 = this;

      var maxInsertIndex = 0;
      this.getChanges().forEach(function (editItem) {
        var _this11$_getInternalD;

        var insertInfo = (_this11$_getInternalD = _this11._getInternalData(editItem.key)) === null || _this11$_getInternalD === void 0 ? void 0 : _this11$_getInternalD.insertInfo;

        if ((0, _type.isDefined)(insertInfo) && editItem.type === _uiGrid_core3.DATA_EDIT_DATA_INSERT_TYPE && insertInfo[INSERT_INDEX] > maxInsertIndex) {
          maxInsertIndex = insertInfo[INSERT_INDEX];
        }
      });
      return maxInsertIndex + 1;
    },
    _getInsertAfterOrBeforeKey: function _getInsertAfterOrBeforeKey(insertChange) {
      var _insertChange$insertA;

      return (_insertChange$insertA = insertChange.insertAfterKey) !== null && _insertChange$insertA !== void 0 ? _insertChange$insertA : insertChange.insertBeforeKey;
    },
    _getPageIndexToInsertRow: function _getPageIndexToInsertRow() {
      var newRowPosition = this._getNewRowPosition();

      var dataController = this._dataController;
      var pageIndex = dataController.pageIndex();
      var lastPageIndex = dataController.pageCount() - 1;

      if (newRowPosition === _uiGrid_core3.FIRST_NEW_ROW_POSITION && pageIndex !== 0) {
        return 0;
      } else if (newRowPosition === _uiGrid_core3.LAST_NEW_ROW_POSITION && pageIndex !== lastPageIndex) {
        return lastPageIndex;
      }

      return -1;
    },
    addRow: function addRow(parentKey) {
      var dataController = this._dataController;
      var store = dataController.store();

      if (!store) {
        dataController.fireError('E1052', this.component.NAME);
        return new _deferred.Deferred().reject();
      }

      return this._addRow(parentKey);
    },
    _addRow: function _addRow(parentKey) {
      var _this12 = this;

      var dataController = this._dataController;
      var store = dataController.store();
      var key = store && store.key();
      var param = {
        data: {}
      };

      var oldEditRowIndex = this._getVisibleEditRowIndex();

      var deferred = new _deferred.Deferred();
      this.refresh();

      if (!this._allowRowAdding()) {
        (0, _deferred.when)(this._navigateToNewRow(oldEditRowIndex)).done(deferred.resolve).fail(deferred.reject);
        return deferred.promise();
      }

      if (!key) {
        param.data.__KEY__ = String(new _guid.default());
      }

      (0, _deferred.when)(this._initNewRow(param, parentKey)).done(function () {
        if (_this12._allowRowAdding()) {
          (0, _deferred.when)(_this12._addRowCore(param.data, parentKey, oldEditRowIndex)).done(deferred.resolve).fail(deferred.reject);
        } else {
          deferred.reject('cancel');
        }
      }).fail(deferred.reject);
      return deferred.promise();
    },
    _allowRowAdding: function _allowRowAdding() {
      var insertIndex = this._getInsertIndex();

      if (insertIndex > 1) {
        return false;
      }

      return true;
    },
    _addRowCore: function _addRowCore(data, parentKey, initialOldEditRowIndex) {
      var change = {
        data: data,
        type: _uiGrid_core3.DATA_EDIT_DATA_INSERT_TYPE
      };

      var editRowIndex = this._getVisibleEditRowIndex();

      var insertInfo = this._addInsertInfo(change, parentKey);

      var key = insertInfo.key;

      this._setEditRowKey(key, true);

      this._addChange(change);

      return this._navigateToNewRow(initialOldEditRowIndex, change, editRowIndex);
    },
    _navigateToNewRow: function _navigateToNewRow(oldEditRowIndex, change, editRowIndex) {
      var _editRowIndex,
          _change,
          _this13 = this;

      var d = new _deferred.Deferred();
      var dataController = this._dataController;
      var focusController = this.getController('focus');
      editRowIndex = (_editRowIndex = editRowIndex) !== null && _editRowIndex !== void 0 ? _editRowIndex : -1;
      change = (_change = change) !== null && _change !== void 0 ? _change : this.getChanges().filter(function (c) {
        return c.type === _uiGrid_core3.DATA_EDIT_DATA_INSERT_TYPE;
      })[0];

      if (!change) {
        return d.reject('cancel').promise();
      }

      var pageIndexToInsertRow = this._getPageIndexToInsertRow();

      var rowIndex = this._getLoadedRowIndex(dataController.items(), change, true);

      var navigateToRowByKey = function navigateToRowByKey(key) {
        (0, _deferred.when)(focusController === null || focusController === void 0 ? void 0 : focusController.navigateToRow(key)).done(function () {
          rowIndex = dataController.getRowIndexByKey(change.key);
          d.resolve();
        });
      };

      var insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);

      if (pageIndexToInsertRow >= 0) {
        dataController.pageIndex(pageIndexToInsertRow).done(function () {
          navigateToRowByKey(change.key);
        }).fail(d.reject);
      } else if (rowIndex < 0 && (0, _type.isDefined)(insertAfterOrBeforeKey)) {
        navigateToRowByKey(insertAfterOrBeforeKey);
      } else {
        dataController.updateItems({
          changeType: 'update',
          rowIndices: [oldEditRowIndex, editRowIndex, rowIndex]
        });
        rowIndex = dataController.getRowIndexByKey(change.key);

        if (rowIndex < 0) {
          navigateToRowByKey(change.key);
        } else {
          d.resolve();
        }
      }

      d.done(function () {
        _this13._showAddedRow(rowIndex);

        _this13._afterInsertRow(change.key);
      });
      return d.promise();
    },
    _showAddedRow: function _showAddedRow(rowIndex) {
      this._focusFirstEditableCellInRow(rowIndex);
    },
    _beforeFocusElementInRow: _common.noop,
    _focusFirstEditableCellInRow: function _focusFirstEditableCellInRow(rowIndex) {
      var _this14 = this;

      var dataController = this._dataController;
      var key = dataController.getKeyByRowIndex(rowIndex);
      var $firstCell = this.getFirstEditableCellInRow(rowIndex);
      this._editCellInProgress = true;

      this._delayedInputFocus($firstCell, function () {
        rowIndex = dataController.getRowIndexByKey(key);
        _this14._editCellInProgress = false;

        _this14._beforeFocusElementInRow(rowIndex);
      });
    },
    _isEditingStart: function _isEditingStart(options) {
      this.executeAction('onEditingStart', options);
      return options.cancel;
    },
    _beforeUpdateItems: _common.noop,
    _getVisibleEditColumnIndex: function _getVisibleEditColumnIndex() {
      var editColumnName = this.option(_uiGrid_core3.EDITING_EDITCOLUMNNAME_OPTION_NAME);

      if (!(0, _type.isDefined)(editColumnName)) {
        return -1;
      }

      return this._columnsController.getVisibleColumnIndex(editColumnName);
    },
    _setEditColumnNameByIndex: function _setEditColumnNameByIndex(index, silent) {
      var _visibleColumns$index;

      var visibleColumns = this._columnsController.getVisibleColumns();

      this._setEditColumnName((_visibleColumns$index = visibleColumns[index]) === null || _visibleColumns$index === void 0 ? void 0 : _visibleColumns$index.name, silent);
    },
    _setEditColumnName: function _setEditColumnName(name, silent) {
      if (silent) {
        this._silentOption(_uiGrid_core3.EDITING_EDITCOLUMNNAME_OPTION_NAME, name);
      } else {
        this.option(_uiGrid_core3.EDITING_EDITCOLUMNNAME_OPTION_NAME, name);
      }
    },
    _resetEditColumnName: function _resetEditColumnName() {
      this._setEditColumnName(null, true);
    },
    _getEditColumn: function _getEditColumn() {
      var editColumnName = this.option(_uiGrid_core3.EDITING_EDITCOLUMNNAME_OPTION_NAME);
      return this._getColumnByName(editColumnName);
    },
    _getColumnByName: function _getColumnByName(name) {
      var visibleColumns = this._columnsController.getVisibleColumns();

      var editColumn;
      (0, _type.isDefined)(name) && visibleColumns.some(function (column) {
        if (column.name === name) {
          editColumn = column;
          return true;
        }
      });
      return editColumn;
    },
    _getVisibleEditRowIndex: function _getVisibleEditRowIndex(columnName) {
      var dataController = this._dataController;
      var editRowKey = this.option(_uiGrid_core3.EDITING_EDITROWKEY_OPTION_NAME);
      var rowIndex = dataController.getRowIndexByKey(editRowKey);

      if (rowIndex === -1) {
        return rowIndex;
      }

      return rowIndex + this._getEditRowIndexCorrection(columnName);
    },
    _getEditRowIndexCorrection: function _getEditRowIndexCorrection(columnName) {
      var editColumn = columnName ? this._getColumnByName(columnName) : this._getEditColumn();
      var isColumnHidden = (editColumn === null || editColumn === void 0 ? void 0 : editColumn.visibleWidth) === 'adaptiveHidden';
      return isColumnHidden ? 1 : 0;
    },
    _resetEditRowKey: function _resetEditRowKey() {
      this._setEditRowKey(null, true);
    },
    _resetEditIndices: function _resetEditIndices() {
      this._resetEditColumnName();

      this._resetEditRowKey();
    },
    editRow: function editRow(rowIndex) {
      var _item$oldData;

      var dataController = this._dataController;
      var items = dataController.items();
      var item = items[rowIndex];
      var params = {
        data: item && item.data,
        cancel: false
      };

      var oldRowIndex = this._getVisibleEditRowIndex();

      if (!item) {
        return;
      }

      if (rowIndex === oldRowIndex) {
        return true;
      }

      if (item.key === undefined) {
        this._dataController.fireError('E1043');

        return;
      }

      if (!item.isNewRow) {
        params.key = item.key;
      }

      if (this._isEditingStart(params)) {
        return;
      }

      this.resetChanges();
      this.init();

      this._resetEditColumnName();

      this._pageIndex = dataController.pageIndex();

      this._addInternalData({
        key: item.key,
        oldData: (_item$oldData = item.oldData) !== null && _item$oldData !== void 0 ? _item$oldData : item.data
      });

      this._setEditRowKey(item.key);
    },
    _editRowFromOptionChanged: function _editRowFromOptionChanged(rowIndex, oldRowIndex) {
      var rowIndices = [oldRowIndex, rowIndex];

      this._beforeUpdateItems(rowIndices, rowIndex, oldRowIndex);

      this._editRowFromOptionChangedCore(rowIndices, rowIndex, oldRowIndex);
    },
    _editRowFromOptionChangedCore: function _editRowFromOptionChangedCore(rowIndices, rowIndex, oldRowIndex) {
      this._needFocusEditor = true;

      this._dataController.updateItems({
        changeType: 'update',
        rowIndices: rowIndices
      });
    },
    _focusEditorIfNeed: _common.noop,
    _showEditPopup: _common.noop,
    _repaintEditPopup: _common.noop,
    _getEditPopupHiddenHandler: function _getEditPopupHiddenHandler() {
      var _this15 = this;

      return function (e) {
        if (_this15.isEditing()) {
          _this15.cancelEditData();
        }
      };
    },
    _getPopupEditFormTemplate: _common.noop,
    _getSaveButtonConfig: function _getSaveButtonConfig() {
      return {
        text: this.option('editing.texts.saveRowChanges'),
        onClick: this.saveEditData.bind(this)
      };
    },
    _getCancelButtonConfig: function _getCancelButtonConfig() {
      return {
        text: this.option('editing.texts.cancelRowChanges'),
        onClick: this.cancelEditData.bind(this)
      };
    },
    _removeInternalData: function _removeInternalData(key) {
      var internalData = this._getInternalData(key);

      var index = this._internalState.indexOf(internalData);

      if (index > -1) {
        this._internalState.splice(index, 1);
      }
    },
    _updateInsertAfterOrBeforeKeys: function _updateInsertAfterOrBeforeKeys(changes, index) {
      var _this16 = this;

      var removeChange = changes[index];
      changes.forEach(function (change) {
        var insertAfterOrBeforeKey = _this16._getInsertAfterOrBeforeKey(change);

        if ((0, _common.equalByValue)(insertAfterOrBeforeKey, removeChange.key)) {
          change[(0, _type.isDefined)(change.insertAfterKey) ? 'insertAfterKey' : 'insertBeforeKey'] = _this16._getInsertAfterOrBeforeKey(removeChange);
        }
      });
    },
    _removeChange: function _removeChange(index) {
      if (index >= 0) {
        var changes = _toConsumableArray(this.getChanges());

        var key = changes[index].key;

        this._removeInternalData(key);

        this._updateInsertAfterOrBeforeKeys(changes, index);

        changes.splice(index, 1);

        this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);

        if ((0, _common.equalByValue)(this.option(_uiGrid_core3.EDITING_EDITROWKEY_OPTION_NAME), key)) {
          this._resetEditIndices();
        }
      }
    },
    executeOperation: function executeOperation(deferred, func) {
      var _this17 = this;

      this._lastOperation && this._lastOperation.reject();
      this._lastOperation = deferred;
      this.waitForDeferredOperations().done(function () {
        if (deferred.state() === 'rejected') {
          return;
        }

        func();
        _this17._lastOperation = null;
      }).fail(function () {
        deferred.reject();
        _this17._lastOperation = null;
      });
    },
    waitForDeferredOperations: function waitForDeferredOperations() {
      return _deferred.when.apply(void 0, _toConsumableArray(this._deferreds));
    },
    _processCanceledEditingCell: _common.noop,
    _repaintEditCell: function _repaintEditCell(column, oldColumn, oldEditRowIndex) {
      this._needFocusEditor = true;

      if (!column || !column.showEditorAlways || oldColumn && !oldColumn.showEditorAlways) {
        this._editCellInProgress = true; // T316439

        this.getController('editorFactory').loseFocus();

        this._dataController.updateItems({
          changeType: 'update',
          rowIndices: [oldEditRowIndex, this._getVisibleEditRowIndex()]
        });
      } else if (column !== oldColumn) {
        // TODO check this necessity T816039
        this._dataController.updateItems({
          changeType: 'update',
          rowIndices: []
        });
      }
    },
    _delayedInputFocus: function _delayedInputFocus($cell, beforeFocusCallback, callBeforeFocusCallbackAlways) {
      var _this18 = this;

      var inputFocus = function inputFocus() {
        if (beforeFocusCallback) {
          beforeFocusCallback();
        }

        if ($cell) {
          var $focusableElement = $cell.find(_uiGrid_core3.FOCUSABLE_ELEMENT_SELECTOR).first();

          _uiGrid_core2.default.focusAndSelectElement(_this18, $focusableElement);
        }

        _this18._beforeFocusCallback = null;
      };

      if (_devices.default.real().ios || _devices.default.real().android) {
        inputFocus();
      } else {
        if (this._beforeFocusCallback) this._beforeFocusCallback();
        clearTimeout(this._inputFocusTimeoutID);

        if (callBeforeFocusCallbackAlways) {
          this._beforeFocusCallback = beforeFocusCallback;
        }

        this._inputFocusTimeoutID = setTimeout(inputFocus);
      }
    },
    _focusEditingCell: function _focusEditingCell(beforeFocusCallback, $editCell, callBeforeFocusCallbackAlways) {
      var rowsView = this.getView('rowsView');

      var editColumnIndex = this._getVisibleEditColumnIndex();

      $editCell = $editCell || rowsView && rowsView._getCellElement(this._getVisibleEditRowIndex(), editColumnIndex);

      if ($editCell) {
        this._delayedInputFocus($editCell, beforeFocusCallback, callBeforeFocusCallbackAlways);
      }
    },
    deleteRow: function deleteRow(rowIndex) {
      this._checkAndDeleteRow(rowIndex);
    },
    _checkAndDeleteRow: function _checkAndDeleteRow(rowIndex) {
      var _this19 = this;

      var editingOptions = this.option('editing');
      var editingTexts = editingOptions === null || editingOptions === void 0 ? void 0 : editingOptions.texts;
      var confirmDelete = editingOptions === null || editingOptions === void 0 ? void 0 : editingOptions.confirmDelete;
      var confirmDeleteMessage = editingTexts === null || editingTexts === void 0 ? void 0 : editingTexts.confirmDeleteMessage;

      var item = this._dataController.items()[rowIndex];

      var allowDeleting = !this.isEditing() || item.isNewRow; // T741746

      if (item && allowDeleting) {
        if (!confirmDelete || !confirmDeleteMessage) {
          this._deleteRowCore(rowIndex);
        } else {
          var confirmDeleteTitle = editingTexts && editingTexts.confirmDeleteTitle;
          var showDialogTitle = (0, _type.isDefined)(confirmDeleteTitle) && confirmDeleteTitle.length > 0;
          (0, _dialog.confirm)(confirmDeleteMessage, confirmDeleteTitle, showDialogTitle).done(function (confirmResult) {
            if (confirmResult) {
              _this19._deleteRowCore(rowIndex);
            }
          });
        }
      }
    },
    _deleteRowCore: function _deleteRowCore(rowIndex) {
      var dataController = this._dataController;
      var item = dataController.items()[rowIndex];
      var key = item && item.key;

      var oldEditRowIndex = this._getVisibleEditRowIndex();

      this.refresh();
      var changes = this.getChanges();

      var editIndex = _uiGrid_core2.default.getIndexByKey(key, changes);

      if (editIndex >= 0) {
        if (changes[editIndex].type === _uiGrid_core3.DATA_EDIT_DATA_INSERT_TYPE) {
          this._removeChange(editIndex);
        } else {
          this._addChange({
            key: key,
            type: _uiGrid_core3.DATA_EDIT_DATA_REMOVE_TYPE
          });
        }
      } else {
        this._addChange({
          key: key,
          oldData: item.data,
          type: _uiGrid_core3.DATA_EDIT_DATA_REMOVE_TYPE
        });
      }

      return this._afterDeleteRow(rowIndex, oldEditRowIndex);
    },
    _afterDeleteRow: function _afterDeleteRow(rowIndex, oldEditRowIndex) {
      return this.saveEditData();
    },
    undeleteRow: function undeleteRow(rowIndex) {
      var dataController = this._dataController;
      var item = dataController.items()[rowIndex];

      var oldEditRowIndex = this._getVisibleEditRowIndex();

      var key = item && item.key;
      var changes = this.getChanges();

      if (item) {
        var editIndex = _uiGrid_core2.default.getIndexByKey(key, changes);

        if (editIndex >= 0) {
          var data = changes[editIndex].data;

          if ((0, _type.isEmptyObject)(data)) {
            this._removeChange(editIndex);
          } else {
            this._addChange({
              key: key,
              type: DATA_EDIT_DATA_UPDATE_TYPE
            });
          }

          dataController.updateItems({
            changeType: 'update',
            rowIndices: [oldEditRowIndex, rowIndex]
          });
        }
      }
    },
    _fireOnSaving: function _fireOnSaving() {
      var _this20 = this;

      var onSavingParams = {
        cancel: false,
        promise: null,
        changes: _toConsumableArray(this.getChanges())
      };
      this.executeAction('onSaving', onSavingParams);
      var d = new _deferred.Deferred();
      (0, _deferred.when)((0, _deferred.fromPromise)(onSavingParams.promise)).done(function () {
        d.resolve(onSavingParams);
      }).fail(function (arg) {
        createFailureHandler(d);

        _this20._fireDataErrorOccurred(arg);

        d.resolve({
          cancel: true
        });
      });
      return d;
    },
    _executeEditingAction: function _executeEditingAction(actionName, params, func) {
      if (this.component._disposed) {
        return null;
      }

      var deferred = new _deferred.Deferred();
      this.executeAction(actionName, params);
      (0, _deferred.when)((0, _deferred.fromPromise)(params.cancel)).done(function (cancel) {
        if (cancel) {
          setTimeout(function () {
            deferred.resolve('cancel');
          });
        } else {
          func(params).done(deferred.resolve).fail(createFailureHandler(deferred));
        }
      }).fail(createFailureHandler(deferred));
      return deferred;
    },
    _processChanges: function _processChanges(deferreds, results, dataChanges, changes) {
      var _this21 = this;

      var store = this._dataController.store();

      (0, _iterator.each)(changes, function (index, change) {
        var oldData = _this21._getOldData(change.key);

        var data = change.data,
            type = change.type;

        var changeCopy = _extends({}, change);

        var deferred;
        var params;

        if (_this21._beforeSaveEditData(change, index)) {
          return;
        }

        switch (type) {
          case _uiGrid_core3.DATA_EDIT_DATA_REMOVE_TYPE:
            params = {
              data: oldData,
              key: change.key,
              cancel: false
            };
            deferred = _this21._executeEditingAction('onRowRemoving', params, function () {
              return store.remove(change.key).done(function (key) {
                dataChanges.push({
                  type: 'remove',
                  key: key
                });
              });
            });
            break;

          case _uiGrid_core3.DATA_EDIT_DATA_INSERT_TYPE:
            params = {
              data: data,
              cancel: false
            };
            deferred = _this21._executeEditingAction('onRowInserting', params, function () {
              return store.insert(params.data).done(function (data, key) {
                if ((0, _type.isDefined)(key)) {
                  changeCopy.key = key;
                }

                if (data && (0, _type.isObject)(data) && data !== params.data) {
                  changeCopy.data = data;
                }

                dataChanges.push({
                  type: 'insert',
                  data: data,
                  index: 0
                });
              });
            });
            break;

          case DATA_EDIT_DATA_UPDATE_TYPE:
            params = {
              newData: data,
              oldData: oldData,
              key: change.key,
              cancel: false
            };
            deferred = _this21._executeEditingAction('onRowUpdating', params, function () {
              return store.update(change.key, params.newData).done(function (data, key) {
                if (data && (0, _type.isObject)(data) && data !== params.newData) {
                  changeCopy.data = data;
                }

                dataChanges.push({
                  type: 'update',
                  key: key,
                  data: data
                });
              });
            });
            break;
        }

        changes[index] = changeCopy;

        if (deferred) {
          var doneDeferred = new _deferred.Deferred();
          deferred.always(function (data) {
            results.push({
              key: change.key,
              result: data
            });
          }).always(doneDeferred.resolve);
          deferreds.push(doneDeferred.promise());
        }
      });
    },
    _processRemoveIfError: function _processRemoveIfError(changes, editIndex) {
      var change = changes[editIndex];

      if ((change === null || change === void 0 ? void 0 : change.type) === _uiGrid_core3.DATA_EDIT_DATA_REMOVE_TYPE) {
        if (editIndex >= 0) {
          changes.splice(editIndex, 1);
        }
      }

      return true;
    },
    _processRemove: function _processRemove(changes, editIndex, cancel) {
      var change = changes[editIndex];

      if (!cancel || !change || change.type === _uiGrid_core3.DATA_EDIT_DATA_REMOVE_TYPE) {
        return this._processRemoveCore(changes, editIndex, !cancel || !change);
      }
    },
    _processRemoveCore: function _processRemoveCore(changes, editIndex) {
      if (editIndex >= 0) {
        changes.splice(editIndex, 1);
      }

      return true;
    },
    _processSaveEditDataResult: function _processSaveEditDataResult(results) {
      var hasSavedData = false;

      var changes = _toConsumableArray(this.getChanges());

      var changesLength = changes.length;

      for (var i = 0; i < results.length; i++) {
        var arg = results[i].result;
        var cancel = arg === 'cancel';

        var editIndex = _uiGrid_core2.default.getIndexByKey(results[i].key, changes);

        var change = changes[editIndex];
        var isError = arg && arg instanceof Error;

        if (isError) {
          if (change) {
            this._addInternalData({
              key: change.key,
              error: arg
            });
          }

          this._fireDataErrorOccurred(arg);

          if (this._processRemoveIfError(changes, editIndex)) {
            break;
          }
        } else {
          if (this._processRemove(changes, editIndex, cancel)) {
            hasSavedData = !cancel;
          }
        }
      }

      if (changes.length < changesLength) {
        this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);
      }

      return hasSavedData;
    },
    _fireSaveEditDataEvents: function _fireSaveEditDataEvents(changes) {
      var _this22 = this;

      (0, _iterator.each)(changes, function (_, _ref) {
        var data = _ref.data,
            key = _ref.key,
            type = _ref.type;

        var internalData = _this22._addInternalData({
          key: key
        });

        var params = {
          key: key,
          data: data
        };

        if (internalData.error) {
          params.error = internalData.error;
        }

        switch (type) {
          case _uiGrid_core3.DATA_EDIT_DATA_REMOVE_TYPE:
            _this22.executeAction('onRowRemoved', (0, _extend.extend)({}, params, {
              data: internalData.oldData
            }));

            break;

          case _uiGrid_core3.DATA_EDIT_DATA_INSERT_TYPE:
            _this22.executeAction('onRowInserted', params);

            break;

          case DATA_EDIT_DATA_UPDATE_TYPE:
            _this22.executeAction('onRowUpdated', params);

            break;
        }
      });
      this.executeAction('onSaved', {
        changes: changes
      });
    },
    saveEditData: function saveEditData() {
      var _this23 = this;

      var deferred = new _deferred.Deferred();
      this.waitForDeferredOperations().done(function () {
        if (_this23.isSaving()) {
          _this23._resolveAfterSave(deferred);

          return;
        }

        (0, _deferred.when)(_this23._beforeSaveEditData()).done(function (cancel) {
          if (cancel) {
            _this23._resolveAfterSave(deferred, {
              cancel: cancel
            });

            return;
          }

          _this23._saving = true;
          var options = {};

          _this23._saveEditDataInner(options).always(function () {
            _this23._saving = false;
            options.needFocusEditCell && _this23._focusEditingCell();
          }).done(deferred.resolve).fail(deferred.reject);
        }).fail(deferred.reject);
      }).fail(deferred.reject);
      return deferred.promise();
    },
    _resolveAfterSave: function _resolveAfterSave(deferred) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          cancel = _ref2.cancel,
          error = _ref2.error;

      (0, _deferred.when)(this._afterSaveEditData(cancel)).done(function () {
        deferred.resolve(error);
      }).fail(deferred.reject);
    },
    _saveEditDataInner: function _saveEditDataInner(options) {
      var _this24 = this;

      var results = [];
      var deferreds = [];
      var dataChanges = [];
      var dataController = this._dataController;
      var dataSource = dataController.dataSource();
      var result = new _deferred.Deferred();
      (0, _deferred.when)(this._fireOnSaving()).done(function (_ref3) {
        var cancel = _ref3.cancel,
            changes = _ref3.changes;

        if (cancel) {
          return result.resolve().promise();
        }

        _this24._processChanges(deferreds, results, dataChanges, changes);

        if (deferreds.length) {
          dataSource === null || dataSource === void 0 ? void 0 : dataSource.beginLoading();

          _deferred.when.apply(void 0, deferreds).done(function () {
            if (_this24._processSaveEditDataResult(results)) {
              _this24._endSaving(dataChanges, changes, result);
            } else {
              dataSource === null || dataSource === void 0 ? void 0 : dataSource.endLoading();
              result.resolve();
            }
          }).fail(function (error) {
            dataSource === null || dataSource === void 0 ? void 0 : dataSource.endLoading();
            result.resolve(error);
          });

          return result.always(function () {
            options.needFocusEditCell = true;
          }).promise();
        }

        _this24._cancelSaving(result);
      }).fail(result.reject);
      return result.promise();
    },
    _beforeEndSaving: function _beforeEndSaving(changes) {
      this._resetEditIndices();
    },
    _endSaving: function _endSaving(dataChanges, changes, deferred) {
      var dataSource = this._dataController.dataSource();

      this._beforeEndSaving(changes);

      dataSource === null || dataSource === void 0 ? void 0 : dataSource.endLoading();

      this._refreshDataAfterSave(dataChanges, changes, deferred);
    },
    _cancelSaving: function _cancelSaving(result) {
      this.executeAction('onSaved', {
        changes: []
      });

      this._resolveAfterSave(result);
    },
    _refreshDataAfterSave: function _refreshDataAfterSave(dataChanges, changes, deferred) {
      var _this25 = this;

      var dataController = this._dataController;
      var refreshMode = this.option('editing.refreshMode');
      var isFullRefresh = refreshMode !== 'reshape' && refreshMode !== 'repaint';

      if (!isFullRefresh) {
        dataController.push(dataChanges);
      }

      (0, _deferred.when)(dataController.refresh({
        selection: isFullRefresh,
        reload: isFullRefresh,
        load: refreshMode === 'reshape',
        changesOnly: this.option('repaintChangesOnly')
      })).always(function () {
        _this25._fireSaveEditDataEvents(changes);
      }).done(function () {
        _this25._resolveAfterSave(deferred);
      }).fail(function (error) {
        _this25._resolveAfterSave(deferred, {
          error: error
        });
      });
    },
    isSaving: function isSaving() {
      return this._saving;
    },
    _updateEditColumn: function _updateEditColumn() {
      var isEditColumnVisible = this._isEditColumnVisible();

      var useIcons = this.option('editing.useIcons');
      var cssClass = COMMAND_EDIT_CLASS + (useIcons ? ' ' + COMMAND_EDIT_WITH_ICONS_CLASS : '');

      this._columnsController.addCommandColumn({
        type: 'buttons',
        command: 'edit',
        visible: isEditColumnVisible,
        cssClass: cssClass,
        width: 'auto',
        alignment: 'center',
        cellTemplate: this._getEditCommandCellTemplate(),
        fixedPosition: 'right'
      });

      this._columnsController.columnOption('command:edit', {
        visible: isEditColumnVisible,
        cssClass: cssClass
      });
    },
    _isEditColumnVisible: function _isEditColumnVisible() {
      var editingOptions = this.option('editing');
      return editingOptions.allowDeleting;
    },
    _isEditButtonDisabled: function _isEditButtonDisabled() {
      var hasChanges = this.hasChanges();
      var isEditRowDefined = (0, _type.isDefined)(this.option('editing.editRowKey'));
      return !(isEditRowDefined || hasChanges);
    },
    _updateEditButtons: function _updateEditButtons() {
      var headerPanel = this.getView('headerPanel');

      var isButtonDisabled = this._isEditButtonDisabled();

      if (headerPanel) {
        headerPanel.setToolbarItemDisabled('saveButton', isButtonDisabled);
        headerPanel.setToolbarItemDisabled('revertButton', isButtonDisabled);
      }
    },
    _applyModified: function _applyModified($element) {
      $element && $element.addClass(CELL_MODIFIED);
    },
    _beforeCloseEditCellInBatchMode: _common.noop,
    cancelEditData: function cancelEditData() {
      var changes = this.getChanges();
      var params = {
        cancel: false,
        changes: changes
      };
      this.executeAction('onEditCanceling', params);

      if (!params.cancel) {
        this._cancelEditDataCore();

        this.executeAction('onEditCanceled', {
          changes: changes
        });
      }
    },
    _cancelEditDataCore: function _cancelEditDataCore() {
      var rowIndex = this._getVisibleEditRowIndex();

      this._beforeCancelEditData();

      this.init();
      this.resetChanges();

      this._resetEditColumnName();

      this._resetEditRowKey();

      this._afterCancelEditData(rowIndex);
    },
    _afterCancelEditData: function _afterCancelEditData(rowIndex) {
      var dataController = this._dataController;
      dataController.updateItems({
        repaintChangesOnly: this.option('repaintChangesOnly')
      });
    },
    _hideEditPopup: _common.noop,
    hasEditData: function hasEditData() {
      return this.hasChanges();
    },
    update: function update(changeType) {
      var dataController = this._dataController;

      if (dataController && this._pageIndex !== dataController.pageIndex()) {
        if (changeType === 'refresh') {
          this.refresh(true);
        }

        this._pageIndex = dataController.pageIndex();
      }

      this._updateEditButtons();
    },
    _getRowIndicesForCascadeUpdating: function _getRowIndicesForCascadeUpdating(row, skipCurrentRow) {
      return skipCurrentRow ? [] : [row.rowIndex];
    },
    addDeferred: function addDeferred(deferred) {
      var _this26 = this;

      if (this._deferreds.indexOf(deferred) < 0) {
        this._deferreds.push(deferred);

        deferred.always(function () {
          var index = _this26._deferreds.indexOf(deferred);

          if (index >= 0) {
            _this26._deferreds.splice(index, 1);
          }
        });
      }
    },
    _prepareChange: function _prepareChange(options, value, text) {
      var _options$row,
          _this27 = this;

      var newData = {};
      var oldData = (_options$row = options.row) === null || _options$row === void 0 ? void 0 : _options$row.data;
      var rowKey = options.key;
      var deferred = new _deferred.Deferred();

      if (rowKey !== undefined) {
        options.value = value;
        var setCellValueResult = (0, _deferred.fromPromise)(options.column.setCellValue(newData, value, (0, _extend.extend)(true, {}, oldData), text));
        setCellValueResult.done(function () {
          deferred.resolve({
            data: newData,
            key: rowKey,
            oldData: oldData,
            type: DATA_EDIT_DATA_UPDATE_TYPE
          });
        }).fail(createFailureHandler(deferred)).fail(function (arg) {
          return _this27._fireDataErrorOccurred(arg);
        });

        if ((0, _type.isDefined)(text) && options.column.displayValueMap) {
          options.column.displayValueMap[value] = text;
        }

        this._updateRowValues(options);

        this.addDeferred(deferred);
      }

      return deferred;
    },
    _updateRowValues: function _updateRowValues(options) {
      if (options.values) {
        var dataController = this._dataController;
        var rowIndex = dataController.getRowIndexByKey(options.key);
        var row = dataController.getVisibleRows()[rowIndex];

        if (row) {
          options.values = row.values;
        }

        options.values[options.columnIndex] = options.value;
      }
    },
    updateFieldValue: function updateFieldValue(options, value, text, forceUpdateRow) {
      var _this28 = this;

      var rowKey = options.key;
      var deferred = new _deferred.Deferred();

      if (rowKey === undefined) {
        this._dataController.fireError('E1043');
      }

      if (options.column.setCellValue) {
        this._prepareChange(options, value, text).done(function (params) {
          (0, _deferred.when)(_this28._applyChange(options, params, forceUpdateRow)).always(function () {
            deferred.resolve();
          });
        });
      } else {
        deferred.resolve();
      }

      return deferred.promise();
    },
    _focusPreviousEditingCellIfNeed: function _focusPreviousEditingCellIfNeed(options) {
      if (this.hasEditData() && !this.isEditCell(options.rowIndex, options.columnIndex)) {
        this._focusEditingCell();

        this._updateEditRow(options.row, true);

        return true;
      }
    },
    _needUpdateRow: function _needUpdateRow(column) {
      var visibleColumns = this._columnsController.getVisibleColumns();

      if (!column) {
        column = this._getEditColumn();
      }

      var isCustomSetCellValue = column && column.setCellValue !== column.defaultSetCellValue;
      var isCustomCalculateCellValue = visibleColumns.some(function (visibleColumn) {
        return visibleColumn.calculateCellValue !== visibleColumn.defaultCalculateCellValue;
      });
      return isCustomSetCellValue || isCustomCalculateCellValue;
    },
    _applyChange: function _applyChange(options, params, forceUpdateRow) {
      var changeOptions = _extends({}, options, {
        forceUpdateRow: forceUpdateRow
      });

      this._addChange(params, changeOptions);

      this._updateEditButtons();

      return this._applyChangeCore(options, changeOptions.forceUpdateRow);
    },
    _applyChangeCore: function _applyChangeCore(options, forceUpdateRow) {
      var isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue;
      var row = options.row;

      if (row) {
        if (forceUpdateRow || isCustomSetCellValue) {
          this._updateEditRow(row, forceUpdateRow, isCustomSetCellValue);
        } else if (row.update) {
          row.update();
        }
      }
    },
    _updateEditRowCore: function _updateEditRowCore(row, skipCurrentRow, isCustomSetCellValue) {
      this._dataController.updateItems({
        changeType: 'update',
        rowIndices: this._getRowIndicesForCascadeUpdating(row, skipCurrentRow)
      });
    },
    _updateEditRow: function _updateEditRow(row, forceUpdateRow, isCustomSetCellValue) {
      if (forceUpdateRow) {
        this._updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue);
      } else {
        this._updateRowWithDelay(row, isCustomSetCellValue);
      }
    },
    _updateRowImmediately: function _updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue) {
      this._updateEditRowCore(row, !forceUpdateRow, isCustomSetCellValue);

      this._validateEditFormAfterUpdate(row, isCustomSetCellValue);

      if (!forceUpdateRow) {
        this._focusEditingCell();
      }
    },
    _updateRowWithDelay: function _updateRowWithDelay(row, isCustomSetCellValue) {
      var _this29 = this;

      var deferred = new _deferred.Deferred();
      this.addDeferred(deferred);
      setTimeout(function () {
        var $focusedElement = (0, _renderer.default)(_dom_adapter.default.getActiveElement());

        var columnIndex = _this29._rowsView.getCellIndex($focusedElement, row.rowIndex);

        var focusedElement = $focusedElement.get(0);

        var selectionRange = _uiGrid_core2.default.getSelectionRange(focusedElement);

        _this29._updateEditRowCore(row, false, isCustomSetCellValue);

        _this29._validateEditFormAfterUpdate(row, isCustomSetCellValue);

        if (columnIndex >= 0) {
          var $focusedItem = _this29._rowsView._getCellElement(row.rowIndex, columnIndex);

          _this29._delayedInputFocus($focusedItem, function () {
            setTimeout(function () {
              focusedElement = _dom_adapter.default.getActiveElement();

              if (selectionRange.selectionStart >= 0) {
                _uiGrid_core2.default.setSelectionRange(focusedElement, selectionRange);
              }
            });
          });
        }

        deferred.resolve();
      });
    },
    _validateEditFormAfterUpdate: _common.noop,
    _addChange: function _addChange(changeParams, options) {
      var _this$getChanges;

      var row = options === null || options === void 0 ? void 0 : options.row;

      var changes = _toConsumableArray(this.getChanges());

      var index = _uiGrid_core2.default.getIndexByKey(changeParams.key, changes);

      if (index < 0) {
        index = changes.length;

        this._addInternalData({
          key: changeParams.key,
          oldData: changeParams.oldData
        });

        delete changeParams.oldData;
        changes.push(changeParams);
      }

      var change = _extends({}, changes[index]);

      if (change) {
        if (changeParams.data) {
          change.data = (0, _array_utils.createObjectWithChanges)(change.data, changeParams.data);
        }

        if ((!change.type || !changeParams.data) && changeParams.type) {
          change.type = changeParams.type;
        }

        if (row) {
          row.oldData = this._getOldData(row.key);
          row.data = (0, _array_utils.createObjectWithChanges)(row.data, changeParams.data);
        }
      }

      changes[index] = change;

      this._silentOption(EDITING_CHANGES_OPTION_NAME, changes); // T1043517


      if (options && change !== ((_this$getChanges = this.getChanges()) === null || _this$getChanges === void 0 ? void 0 : _this$getChanges[index])) {
        options.forceUpdateRow = true;
      }

      return change;
    },
    _getFormEditItemTemplate: function _getFormEditItemTemplate(cellOptions, column) {
      return column.editCellTemplate || this._getDefaultEditorTemplate();
    },
    getColumnTemplate: function getColumnTemplate(options) {
      var _this30 = this;

      var column = options.column;
      var rowIndex = options.row && options.row.rowIndex;
      var template;
      var isRowMode = this.isRowBasedEditMode();
      var isRowEditing = this.isEditRow(rowIndex);
      var isCellEditing = this.isEditCell(rowIndex, options.columnIndex);
      var editingStartOptions;

      if ((column.showEditorAlways || column.setCellValue && (isRowEditing && column.allowEditing || isCellEditing)) && (options.rowType === 'data' || options.rowType === 'detailAdaptive') && !column.command) {
        var allowUpdating = this.allowUpdating(options);

        if (((allowUpdating || isRowEditing) && column.allowEditing || isCellEditing) && (isRowEditing || !isRowMode)) {
          if (column.showEditorAlways && !isRowMode) {
            editingStartOptions = {
              cancel: false,
              key: options.row.isNewRow ? undefined : options.row.key,
              data: options.row.data,
              column: column
            };

            this._isEditingStart(editingStartOptions);
          }

          if (!editingStartOptions || !editingStartOptions.cancel) {
            options.setValue = function (value, text) {
              _this30.updateFieldValue(options, value, text);
            };
          }
        }

        template = column.editCellTemplate || this._getDefaultEditorTemplate();
      } else if (column.command === 'detail' && options.rowType === 'detail' && isRowEditing) {
        template = this === null || this === void 0 ? void 0 : this.getEditFormTemplate(options);
      }

      return template;
    },
    _createButton: function _createButton($container, button, options, change) {
      var icon = EDIT_ICON_CLASS[button.name];
      var useIcons = this.option('editing.useIcons');
      var useLegacyColumnButtonTemplate = this.option('useLegacyColumnButtonTemplate');
      var $button = (0, _renderer.default)('<a>').attr('href', '#').addClass(LINK_CLASS).addClass(button.cssClass);

      if (button.template && useLegacyColumnButtonTemplate) {
        this._rowsView.renderTemplate($container, button.template, options, true);
      } else {
        if (button.template) {
          $button = (0, _renderer.default)('<span>').addClass(button.cssClass);
        } else if (useIcons && icon || button.icon) {
          icon = button.icon || icon;
          var iconType = iconUtils.getImageSourceType(icon);

          if (iconType === 'image' || iconType === 'svg') {
            $button = iconUtils.getImageContainer(icon).addClass(button.cssClass);
          } else {
            $button.addClass('dx-icon' + (iconType === 'dxIcon' ? '-' : ' ') + icon).attr('title', button.text);
          }

          $button.addClass('dx-link-icon');
          $container.addClass(COMMAND_EDIT_WITH_ICONS_CLASS);
          var localizationName = this.getButtonLocalizationNames()[button.name];
          localizationName && $button.attr('aria-label', _message.default.format(localizationName));
        } else {
          $button.text(button.text);
        }

        if ((0, _type.isDefined)(button.hint)) {
          $button.attr('title', button.hint);
        }

        if (this._isButtonDisabled(button, options)) {
          $button.addClass('dx-state-disabled');
        } else if (!button.template || button.onClick) {
          _events_engine.default.on($button, (0, _index.addNamespace)('click', EDITING_NAMESPACE), this.createAction(function (e) {
            var _button$onClick;

            (_button$onClick = button.onClick) === null || _button$onClick === void 0 ? void 0 : _button$onClick.call(button, (0, _extend.extend)({}, e, {
              row: options.row,
              column: options.column
            }));
            e.event.preventDefault();
            e.event.stopPropagation();
          }));
        }

        $container.append($button, '&nbsp;');

        if (button.template) {
          this._rowsView.renderTemplate($button, button.template, options, true, change);
        }
      }
    },
    getButtonLocalizationNames: function getButtonLocalizationNames() {
      return {
        edit: 'dxDataGrid-editingEditRow',
        save: 'dxDataGrid-editingSaveRowChanges',
        delete: 'dxDataGrid-editingDeleteRow',
        undelete: 'dxDataGrid-editingUndeleteRow',
        cancel: 'dxDataGrid-editingCancelRowChanges'
      };
    },
    prepareButtonItem: function prepareButtonItem(headerPanel, name, methodName, sortIndex) {
      var _this31 = this;

      var editingTexts = this.option('editing.texts') || {};
      var titleButtonTextByClassNames = {
        'revert': editingTexts.cancelAllChanges,
        'save': editingTexts.saveAllChanges,
        'addRow': editingTexts.addRow
      };
      var classNameButtonByNames = {
        'revert': 'cancel',
        'save': 'save',
        'addRow': 'addrow'
      };
      var className = classNameButtonByNames[name];

      var onInitialized = function onInitialized(e) {
        (0, _renderer.default)(e.element).addClass(headerPanel._getToolbarButtonClass(EDIT_BUTTON_CLASS + ' ' + _this31.addWidgetPrefix(className) + '-button'));
      };

      var hintText = titleButtonTextByClassNames[name];

      var isButtonDisabled = (className === 'save' || className === 'cancel') && this._isEditButtonDisabled();

      return {
        widget: 'dxButton',
        options: {
          onInitialized: onInitialized,
          icon: 'edit-button-' + className,
          disabled: isButtonDisabled,
          onClick: function onClick() {
            setTimeout(function () {
              _this31[methodName]();
            });
          },
          text: hintText,
          hint: hintText
        },
        showText: 'inMenu',
        name: name + 'Button',
        location: 'after',
        locateInMenu: 'auto',
        sortIndex: sortIndex
      };
    },
    prepareEditButtons: function prepareEditButtons(headerPanel) {
      var editingOptions = this.option('editing') || {};
      var buttonItems = [];

      if (editingOptions.allowAdding) {
        buttonItems.push(this.prepareButtonItem(headerPanel, 'addRow', 'addRow', 20));
      }

      return buttonItems;
    },
    highlightDataCell: function highlightDataCell($cell, parameters) {
      var cellModified = this.isCellModified(parameters);
      var shouldHighlight = cellModified && parameters.column.setCellValue && (this.getEditMode() !== _uiGrid_core3.EDIT_MODE_ROW || !parameters.row.isEditing);
      shouldHighlight && $cell.addClass(CELL_MODIFIED);
    },
    _afterInsertRow: _common.noop,
    _beforeSaveEditData: function _beforeSaveEditData(change) {
      if (change && !(0, _type.isDefined)(change.key) && (0, _type.isDefined)(change.type)) {
        return true;
      }
    },
    _afterSaveEditData: _common.noop,
    _beforeCancelEditData: _common.noop,
    _allowEditAction: function _allowEditAction(actionName, options) {
      var allowEditAction = this.option('editing.' + actionName);

      if ((0, _type.isFunction)(allowEditAction)) {
        allowEditAction = allowEditAction({
          component: this.component,
          row: options.row
        });
      }

      return allowEditAction;
    },
    allowUpdating: function allowUpdating(options, eventName) {
      var startEditAction = this.option('editing.startEditAction') || DEFAULT_START_EDIT_ACTION;
      var needCallback = arguments.length > 1 ? startEditAction === eventName || eventName === 'down' : true;
      return needCallback && this._allowEditAction('allowUpdating', options);
    },
    allowDeleting: function allowDeleting(options) {
      return this._allowEditAction('allowDeleting', options);
    },
    isCellModified: function isCellModified(parameters) {
      var columnIndex = parameters.columnIndex;
      var modifiedValues = parameters.row && (parameters.row.isNewRow ? parameters.row.values : parameters.row.modifiedValues);
      return !!modifiedValues && modifiedValues[columnIndex] !== undefined;
    },
    isNewRowInEditMode: function isNewRowInEditMode() {
      var visibleEditRowIndex = this._getVisibleEditRowIndex();

      var rows = this._dataController.items();

      return visibleEditRowIndex >= 0 ? rows[visibleEditRowIndex].isNewRow : false;
    }
  };
}());

var editingModule = {
  defaultOptions: function defaultOptions() {
    return {
      editing: {
        mode: 'row',
        // "batch"
        refreshMode: 'full',
        newRowPosition: _uiGrid_core3.VIEWPORT_TOP_NEW_ROW_POSITION,
        allowAdding: false,
        allowUpdating: false,
        allowDeleting: false,
        useIcons: false,
        selectTextOnEditStart: false,
        confirmDelete: true,
        texts: {
          editRow: _message.default.format('dxDataGrid-editingEditRow'),
          saveAllChanges: _message.default.format('dxDataGrid-editingSaveAllChanges'),
          saveRowChanges: _message.default.format('dxDataGrid-editingSaveRowChanges'),
          cancelAllChanges: _message.default.format('dxDataGrid-editingCancelAllChanges'),
          cancelRowChanges: _message.default.format('dxDataGrid-editingCancelRowChanges'),
          addRow: _message.default.format('dxDataGrid-editingAddRow'),
          deleteRow: _message.default.format('dxDataGrid-editingDeleteRow'),
          undeleteRow: _message.default.format('dxDataGrid-editingUndeleteRow'),
          confirmDeleteMessage: _message.default.format('dxDataGrid-editingConfirmDeleteMessage'),
          confirmDeleteTitle: ''
        },
        form: {
          colCount: 2
        },
        popup: {},
        startEditAction: 'click',
        editRowKey: null,
        editColumnName: null,
        changes: []
      },
      useLegacyColumnButtonTemplate: false
    };
  },
  controllers: {
    editing: EditingController
  },
  extenders: {
    controllers: {
      data: {
        init: function init() {
          this._editingController = this.getController('editing');
          this.callBase();
        },
        reload: function reload(full, repaintChangesOnly) {
          !repaintChangesOnly && this._editingController.refresh();
          return this.callBase.apply(this, arguments);
        },
        repaintRows: function repaintRows() {
          if (this.getController('editing').isSaving()) return;
          return this.callBase.apply(this, arguments);
        },
        _updateEditRow: function _updateEditRow(items) {
          var editRowKey = this.option(_uiGrid_core3.EDITING_EDITROWKEY_OPTION_NAME);

          var editRowIndex = _uiGrid_core2.default.getIndexByKey(editRowKey, items);

          var editItem = items[editRowIndex];

          if (editItem) {
            var _this$_updateEditItem;

            editItem.isEditing = true;
            (_this$_updateEditItem = this._updateEditItem) === null || _this$_updateEditItem === void 0 ? void 0 : _this$_updateEditItem.call(this, editItem);
          }
        },
        _updateItemsCore: function _updateItemsCore(change) {
          this.callBase(change);

          this._updateEditRow(this.items(true));
        },
        _applyChangeUpdate: function _applyChangeUpdate(change) {
          this._updateEditRow(change.items);

          this.callBase(change);
        },
        _applyChangesOnly: function _applyChangesOnly(change) {
          this._updateEditRow(change.items);

          this.callBase(change);
        },
        _processItems: function _processItems(items, change) {
          items = this._editingController.processItems(items, change);
          return this.callBase(items, change);
        },
        _processDataItem: function _processDataItem(dataItem, options) {
          this._editingController.processDataItem(dataItem, options, this.generateDataValues);

          return this.callBase(dataItem, options);
        },
        _processItem: function _processItem(item, options) {
          item = this.callBase(item, options);

          if (item.isNewRow) {
            options.dataIndex--;
            delete item.dataIndex;
          }

          return item;
        },
        _getChangedColumnIndices: function _getChangedColumnIndices(oldItem, newItem, rowIndex, isLiveUpdate) {
          if (oldItem.isNewRow !== newItem.isNewRow || oldItem.removed !== newItem.removed) {
            return;
          }

          return this.callBase.apply(this, arguments);
        },
        _isCellChanged: function _isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate) {
          var editingController = this.getController('editing');
          var cell = oldRow.cells && oldRow.cells[columnIndex];
          var isEditing = editingController && editingController.isEditCell(visibleRowIndex, columnIndex);

          if (isLiveUpdate && isEditing) {
            return false;
          }

          if (cell && cell.column && !cell.column.showEditorAlways && cell.isEditing !== isEditing) {
            return true;
          }

          return this.callBase.apply(this, arguments);
        }
      }
    },
    views: {
      rowsView: {
        init: function init() {
          this.callBase();
          this._editingController = this.getController('editing');
        },
        getCellIndex: function getCellIndex($cell, rowIndex) {
          if (!$cell.is('td') && rowIndex >= 0) {
            var $cellElements = this.getCellElements(rowIndex);
            var cellIndex = -1;
            (0, _iterator.each)($cellElements, function (index, cellElement) {
              if ((0, _renderer.default)(cellElement).find($cell).length) {
                cellIndex = index;
              }
            });
            return cellIndex;
          }

          return this.callBase.apply(this, arguments);
        },
        publicMethods: function publicMethods() {
          return this.callBase().concat(['cellValue']);
        },
        _getCellTemplate: function _getCellTemplate(options) {
          var template = this._editingController.getColumnTemplate(options);

          return template || this.callBase(options);
        },
        _isNativeClick: function _isNativeClick() {
          return (_devices.default.real().ios || _devices.default.real().android) && this.option('editing.allowUpdating');
        },
        _createRow: function _createRow(row) {
          var $row = this.callBase.apply(this, arguments);

          if (row) {
            var isRowRemoved = !!row.removed;
            var isRowInserted = !!row.isNewRow;
            var isRowModified = !!row.modified;
            isRowInserted && $row.addClass(ROW_INSERTED);
            isRowModified && $row.addClass(ROW_MODIFIED);

            if (isRowInserted || isRowRemoved) {
              $row.removeClass(ROW_SELECTED);
            }
          }

          return $row;
        },
        _getColumnIndexByElement: function _getColumnIndexByElement($element) {
          var $tableElement = $element.closest('table');
          var $tableElements = this.getTableElements();

          while ($tableElement.length && !$tableElements.filter($tableElement).length) {
            $element = $tableElement.closest('td');
            $tableElement = $element.closest('table');
          }

          return this._getColumnIndexByElementCore($element);
        },
        _getColumnIndexByElementCore: function _getColumnIndexByElementCore($element) {
          var $targetElement = $element.closest('.' + _uiGrid_core3.ROW_CLASS + '> td:not(.dx-master-detail-cell)');
          return this.getCellIndex($targetElement);
        },
        _editCellByClick: function _editCellByClick(e, eventName) {
          var editingController = this._editingController;
          var $targetElement = (0, _renderer.default)(e.event.target);

          var columnIndex = this._getColumnIndexByElement($targetElement);

          var row = this._dataController.items()[e.rowIndex];

          var allowUpdating = editingController.allowUpdating({
            row: row
          }, eventName) || row && row.isNewRow;

          var column = this._columnsController.getVisibleColumns()[columnIndex];

          var isEditedCell = editingController.isEditCell(e.rowIndex, columnIndex);
          var allowEditing = allowUpdating && column && (column.allowEditing || isEditedCell);
          var startEditAction = this.option('editing.startEditAction') || 'click';

          if (eventName === 'down') {
            if ((_devices.default.real().ios || _devices.default.real().android) && !isEditedCell) {
              (0, _dom.resetActiveElement)();
            }

            return column && column.showEditorAlways && allowEditing && editingController.editCell(e.rowIndex, columnIndex);
          }

          if (eventName === 'click' && startEditAction === 'dblClick' && !isEditedCell) {
            var isError = false;
            var withoutSaveEditData = row === null || row === void 0 ? void 0 : row.isNewRow;
            editingController.closeEditCell(isError, withoutSaveEditData);
          }

          if (allowEditing && eventName === startEditAction) {
            return editingController.editCell(e.rowIndex, columnIndex) || editingController.isEditRow(e.rowIndex);
          }
        },
        _rowPointerDown: function _rowPointerDown(e) {
          var _this32 = this;

          this._pointerDownTimeout = setTimeout(function () {
            _this32._editCellByClick(e, 'down');
          });
        },
        _rowClick: function _rowClick(e) {
          var isEditForm = (0, _renderer.default)(e.rowElement).hasClass(this.addWidgetPrefix(_uiGrid_core3.EDIT_FORM_CLASS));
          e.event[_uiGrid_core3.TARGET_COMPONENT_NAME] = this.component;

          if (!this._editCellByClick(e, 'click') && !isEditForm) {
            this.callBase.apply(this, arguments);
          }
        },
        _rowDblClick: function _rowDblClick(e) {
          if (!this._editCellByClick(e, 'dblClick')) {
            this.callBase.apply(this, arguments);
          }
        },
        _cellPrepared: function _cellPrepared($cell, parameters) {
          var editingController = this._editingController;
          var isCommandCell = !!parameters.column.command;
          var isEditableCell = parameters.setValue;
          var isEditRow = editingController.isEditRow(parameters.rowIndex);
          var isEditing = isEditingCell(isEditRow, parameters);

          if (isEditingOrShowEditorAlwaysDataCell(isEditRow, parameters)) {
            var alignment = parameters.column.alignment;
            $cell.toggleClass(this.addWidgetPrefix(READONLY_CLASS), !isEditableCell).toggleClass(CELL_FOCUS_DISABLED_CLASS, !isEditableCell);

            if (alignment) {
              $cell.find(_uiGrid_core3.EDITORS_INPUT_SELECTOR).first().css('textAlign', alignment);
            }
          }

          if (isEditing) {
            this._editCellPrepared($cell);
          }

          if (parameters.column && !isCommandCell) {
            editingController.highlightDataCell($cell, parameters);
          }

          this.callBase.apply(this, arguments);
        },
        _editCellPrepared: _common.noop,
        _formItemPrepared: _common.noop,
        _getCellOptions: function _getCellOptions(options) {
          var cellOptions = this.callBase(options);
          cellOptions.isEditing = this._editingController.isEditCell(cellOptions.rowIndex, cellOptions.columnIndex);
          return cellOptions;
        },
        _createCell: function _createCell(options) {
          var $cell = this.callBase(options);

          var isEditRow = this._editingController.isEditRow(options.rowIndex);

          isEditingOrShowEditorAlwaysDataCell(isEditRow, options) && $cell.addClass(_uiGrid_core3.EDITOR_CELL_CLASS);
          return $cell;
        },
        cellValue: function cellValue(rowIndex, columnIdentifier, value, text) {
          var cellOptions = this.getCellOptions(rowIndex, columnIdentifier);

          if (cellOptions) {
            if (value === undefined) {
              return cellOptions.value;
            } else {
              this._editingController.updateFieldValue(cellOptions, value, text, true);
            }
          }
        },
        dispose: function dispose() {
          this.callBase.apply(this, arguments);
          clearTimeout(this._pointerDownTimeout);
        },
        _renderCore: function _renderCore() {
          this.callBase.apply(this, arguments);

          this._editingController._focusEditorIfNeed();
        }
      },
      headerPanel: {
        _getToolbarItems: function _getToolbarItems() {
          var items = this.callBase();
          var editButtonItems = this.getController('editing').prepareEditButtons(this);
          return editButtonItems.concat(items);
        },
        optionChanged: function optionChanged(args) {
          var fullName = args.fullName;

          switch (args.name) {
            case 'editing':
              {
                var excludedOptions = [_uiGrid_core3.EDITING_POPUP_OPTION_NAME, EDITING_CHANGES_OPTION_NAME, _uiGrid_core3.EDITING_EDITCOLUMNNAME_OPTION_NAME, _uiGrid_core3.EDITING_EDITROWKEY_OPTION_NAME];
                var shouldInvalidate = fullName && !excludedOptions.some(function (optionName) {
                  return optionName === fullName;
                });
                shouldInvalidate && this._invalidate();
                this.callBase(args);
                break;
              }

            case 'useLegacyColumnButtonTemplate':
              args.handled = true;
              break;

            default:
              this.callBase(args);
          }
        },
        isVisible: function isVisible() {
          var editingOptions = this.getController('editing').option('editing');
          return this.callBase() || (editingOptions === null || editingOptions === void 0 ? void 0 : editingOptions.allowAdding);
        }
      }
    }
  }
};
exports.editingModule = editingModule;