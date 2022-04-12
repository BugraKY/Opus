"use strict";

exports.editingFormBasedModule = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _window = require("../../core/utils/window");

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _guid = _interopRequireDefault(require("../../core/guid"));

var _type = require("../../core/utils/type");

var _iterator = require("../../core/utils/iterator");

var _extend = require("../../core/utils/extend");

var _button = _interopRequireDefault(require("../button"));

var _devices = _interopRequireDefault(require("../../core/devices"));

var _form = _interopRequireDefault(require("../form"));

var _deferred = require("../../core/utils/deferred");

var _ui = _interopRequireDefault(require("../scroll_view/ui.scrollable"));

var _popup = _interopRequireDefault(require("../popup"));

var _uiGrid_core = require("./ui.grid_core.editing_constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EDIT_FORM_ITEM_CLASS = 'edit-form-item';
var EDIT_POPUP_CLASS = 'edit-popup';
var SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
var EDIT_POPUP_FORM_CLASS = 'edit-popup-form';
var BUTTON_CLASS = 'dx-button';
var FORM_BUTTONS_CONTAINER_CLASS = 'form-buttons-container';

var getEditorType = function getEditorType(item) {
  var _column$formItem;

  var column = item.column;
  return item.isCustomEditorType ? item.editorType : (_column$formItem = column.formItem) === null || _column$formItem === void 0 ? void 0 : _column$formItem.editorType;
};

var forEachFormItems = function forEachFormItems(items, callBack) {
  items.forEach(function (item) {
    if (item.items || item.tabs) {
      forEachFormItems(item.items || item.tabs, callBack);
    } else {
      callBack(item);
    }
  });
};

var editingFormBasedModule = {
  extenders: {
    controllers: {
      editing: {
        init: function init() {
          this._editForm = null;
          this._updateEditFormDeferred = null;
          this.callBase.apply(this, arguments);
        },
        isFormOrPopupEditMode: function isFormOrPopupEditMode() {
          return this.isPopupEditMode() || this.isFormEditMode();
        },
        isPopupEditMode: function isPopupEditMode() {
          var editMode = this.option('editing.mode');
          return editMode === _uiGrid_core.EDIT_MODE_POPUP;
        },
        isFormEditMode: function isFormEditMode() {
          var editMode = this.option('editing.mode');
          return editMode === _uiGrid_core.EDIT_MODE_FORM;
        },
        getFirstEditableColumnIndex: function getFirstEditableColumnIndex() {
          var firstFormItem = this._firstFormItem;

          if (this.isFormEditMode() && firstFormItem) {
            var editRowKey = this.option(_uiGrid_core.EDITING_EDITROWKEY_OPTION_NAME);

            var editRowIndex = this._dataController.getRowIndexByKey(editRowKey);

            var $editFormElements = this._rowsView.getCellElements(editRowIndex);

            return this._rowsView._getEditFormEditorVisibleIndex($editFormElements, firstFormItem.column);
          }

          return this.callBase.apply(this, arguments);
        },
        getEditFormRowIndex: function getEditFormRowIndex() {
          return this.isFormOrPopupEditMode() ? this._getVisibleEditRowIndex() : this.callBase.apply(this, arguments);
        },
        _isEditColumnVisible: function _isEditColumnVisible() {
          var result = this.callBase.apply(this, arguments);
          var editingOptions = this.option('editing');
          return this.isFormOrPopupEditMode() ? editingOptions.allowUpdating || result : result;
        },
        _handleDataChanged: function _handleDataChanged(args) {
          var editForm = this._editForm;

          if (args.changeType === 'refresh' && this.isPopupEditMode() && editForm !== null && editForm !== void 0 && editForm.option('visible')) {
            this._repaintEditPopup();
          }

          this.callBase.apply(this, arguments);
        },
        getPopupContent: function getPopupContent() {
          var _this$_editPopup;

          var popupVisible = (_this$_editPopup = this._editPopup) === null || _this$_editPopup === void 0 ? void 0 : _this$_editPopup.option('visible');

          if (this.isPopupEditMode() && popupVisible) {
            return this._$popupContent;
          }
        },
        _showAddedRow: function _showAddedRow(rowIndex) {
          if (this.isPopupEditMode()) {
            this._showEditPopup(rowIndex);
          } else {
            this.callBase.apply(this, arguments);
          }
        },
        _cancelEditDataCore: function _cancelEditDataCore() {
          this.callBase.apply(this, arguments);

          if (this.isPopupEditMode()) {
            this._hideEditPopup();
          }
        },
        _updateEditRowCore: function _updateEditRowCore(row, skipCurrentRow, isCustomSetCellValue) {
          var editForm = this._editForm;

          if (this.isPopupEditMode()) {
            if (this.option('repaintChangesOnly')) {
              var _row$update;

              (_row$update = row.update) === null || _row$update === void 0 ? void 0 : _row$update.call(row, row);
            } else if (editForm) {
              this._updateEditFormDeferred = new _deferred.Deferred().done(function () {
                return editForm.repaint();
              });

              if (!this._updateLockCount) {
                this._updateEditFormDeferred.resolve();
              }
            }
          } else {
            this.callBase.apply(this, arguments);
          }
        },
        _showEditPopup: function _showEditPopup(rowIndex, repaintForm) {
          var _this = this;

          var isMobileDevice = _devices.default.current().deviceType !== 'desktop';
          var popupOptions = (0, _extend.extend)({
            showTitle: false,
            fullScreen: isMobileDevice,
            copyRootClassesToWrapper: true,
            _ignoreCopyRootClassesToWrapperDeprecation: true,
            toolbarItems: [{
              toolbar: 'bottom',
              location: 'after',
              widget: 'dxButton',
              options: this._getSaveButtonConfig()
            }, {
              toolbar: 'bottom',
              location: 'after',
              widget: 'dxButton',
              options: this._getCancelButtonConfig()
            }],
            contentTemplate: this._getPopupEditFormTemplate(rowIndex)
          }, this.option(_uiGrid_core.EDITING_POPUP_OPTION_NAME));

          if (!this._editPopup) {
            var $popupContainer = (0, _renderer.default)('<div>').appendTo(this.component.$element()).addClass(this.addWidgetPrefix(EDIT_POPUP_CLASS));
            this._editPopup = this._createComponent($popupContainer, _popup.default, {
              copyRootClassesToWrapper: true,
              _ignoreCopyRootClassesToWrapperDeprecation: true
            });

            this._editPopup.on('hiding', this._getEditPopupHiddenHandler());

            this._editPopup.on('shown', function (e) {
              _events_engine.default.trigger(e.component.$content().find(_uiGrid_core.FOCUSABLE_ELEMENT_SELECTOR).not('.' + SCROLLABLE_CONTAINER_CLASS).first(), 'focus');

              if (repaintForm) {
                var _this$_editForm;

                (_this$_editForm = _this._editForm) === null || _this$_editForm === void 0 ? void 0 : _this$_editForm.repaint();
              }
            });
          }

          this._editPopup.option(popupOptions);

          this._editPopup.show();

          this.callBase.apply(this, arguments);
        },
        _getPopupEditFormTemplate: function _getPopupEditFormTemplate(rowIndex) {
          var _this2 = this;

          var row = this.component.getVisibleRows()[rowIndex];
          var templateOptions = {
            row: row,
            rowType: row.rowType,
            key: row.key,
            rowIndex: rowIndex
          };

          this._rowsView._addWatchMethod(templateOptions, row);

          return function (container) {
            var formTemplate = _this2.getEditFormTemplate();

            var scrollable = _this2._createComponent((0, _renderer.default)('<div>').appendTo(container), _ui.default);

            _this2._$popupContent = scrollable.$content();
            formTemplate(_this2._$popupContent, templateOptions, {
              isPopupForm: true
            });

            _this2._rowsView.renderDelayedTemplates();
          };
        },
        _repaintEditPopup: function _repaintEditPopup() {
          var _this$_editPopup2;

          var rowIndex = this._getVisibleEditRowIndex();

          if ((_this$_editPopup2 = this._editPopup) !== null && _this$_editPopup2 !== void 0 && _this$_editPopup2.option('visible') && rowIndex >= 0) {
            var defaultAnimation = this._editPopup.option('animation');

            this._editPopup.option('animation', null);

            this._showEditPopup(rowIndex, true);

            this._editPopup.option('animation', defaultAnimation);
          }
        },
        _hideEditPopup: function _hideEditPopup() {
          var _this$_editPopup3;

          (_this$_editPopup3 = this._editPopup) === null || _this$_editPopup3 === void 0 ? void 0 : _this$_editPopup3.option('visible', false);
        },
        optionChanged: function optionChanged(args) {
          if (args.name === 'editing' && this.isFormOrPopupEditMode()) {
            var fullName = args.fullName;

            if (fullName.indexOf(_uiGrid_core.EDITING_FORM_OPTION_NAME) === 0) {
              this._handleFormOptionChange(args);

              args.handled = true;
            } else if (fullName.indexOf(_uiGrid_core.EDITING_POPUP_OPTION_NAME) === 0) {
              this._handlePopupOptionChange(args);

              args.handled = true;
            }
          }

          this.callBase.apply(this, arguments);
        },
        _handleFormOptionChange: function _handleFormOptionChange(args) {
          var _this$_editPopup4;

          if (this.isFormEditMode()) {
            var editRowIndex = this._getVisibleEditRowIndex();

            if (editRowIndex >= 0) {
              this._dataController.updateItems({
                changeType: 'update',
                rowIndices: [editRowIndex]
              });
            }
          } else if ((_this$_editPopup4 = this._editPopup) !== null && _this$_editPopup4 !== void 0 && _this$_editPopup4.option('visible') && args.fullName.indexOf(_uiGrid_core.EDITING_FORM_OPTION_NAME) === 0) {
            this._repaintEditPopup();
          }
        },
        _handlePopupOptionChange: function _handlePopupOptionChange(args) {
          var editPopup = this._editPopup;

          if (editPopup) {
            var popupOptionName = args.fullName.slice(_uiGrid_core.EDITING_POPUP_OPTION_NAME.length + 1);

            if (popupOptionName) {
              editPopup.option(popupOptionName, args.value);
            } else {
              editPopup.option(args.value);
            }
          }
        },
        renderFormEditTemplate: function renderFormEditTemplate(detailCellOptions, item, formTemplateOptions, container, isReadOnly) {
          var _this3 = this;

          var that = this;
          var $container = (0, _renderer.default)(container);
          var column = item.column;
          var editorType = getEditorType(item);
          var rowData = detailCellOptions === null || detailCellOptions === void 0 ? void 0 : detailCellOptions.row.data;
          var form = formTemplateOptions.component;

          var _ref = formTemplateOptions.editorOptions || {},
              label = _ref.label,
              labelMark = _ref.labelMark,
              labelMode = _ref.labelMode;

          var cellOptions = (0, _extend.extend)({}, detailCellOptions, {
            data: rowData,
            cellElement: null,
            isOnForm: true,
            item: item,
            id: form.getItemID(item.name || item.dataField),
            column: (0, _extend.extend)({}, column, {
              editorType: editorType,
              editorOptions: (0, _extend.extend)({
                label: label,
                labelMark: labelMark,
                labelMode: labelMode
              }, column.editorOptions, item.editorOptions)
            }),
            columnIndex: column.index,
            setValue: !isReadOnly && column.allowEditing && function (value) {
              that.updateFieldValue(cellOptions, value);
            }
          });
          cellOptions.value = column.calculateCellValue(rowData);

          var template = this._getFormEditItemTemplate.bind(this)(cellOptions, column);

          this._rowsView.renderTemplate($container, template, cellOptions, !!$container.closest((0, _window.getWindow)().document).length).done(function () {
            _this3._rowsView._updateCell($container, cellOptions);
          });

          return cellOptions;
        },
        getFormEditorTemplate: function getFormEditorTemplate(cellOptions, item) {
          var _this4 = this;

          var column = this.component.columnOption(item.dataField);
          return function (options, container) {
            var _cellOptions$row$watc, _cellOptions$row;

            var $container = (0, _renderer.default)(container);
            (_cellOptions$row$watc = (_cellOptions$row = cellOptions.row).watch) === null || _cellOptions$row$watc === void 0 ? void 0 : _cellOptions$row$watc.call(_cellOptions$row, function () {
              return column.selector(cellOptions.row.data);
            }, function () {
              var _validator;

              var $editorElement = $container.find('.dx-widget').first();
              var validator = $editorElement.data('dxValidator');
              var validatorOptions = (_validator = validator) === null || _validator === void 0 ? void 0 : _validator.option();
              $container.contents().remove();
              cellOptions = _this4.renderFormEditTemplate.bind(_this4)(cellOptions, item, options, $container);
              $editorElement = $container.find('.dx-widget').first();
              validator = $editorElement.data('dxValidator');

              if (validatorOptions && !validator) {
                $editorElement.dxValidator({
                  validationRules: validatorOptions.validationRules,
                  validationGroup: validatorOptions.validationGroup,
                  dataGetter: validatorOptions.dataGetter
                });
              }
            });
            cellOptions = _this4.renderFormEditTemplate.bind(_this4)(cellOptions, item, options, $container);
          };
        },
        getEditFormOptions: function getEditFormOptions(detailOptions) {
          var _this$_getValidationG,
              _this5 = this;

          var editFormOptions = (_this$_getValidationG = this._getValidationGroupsInForm) === null || _this$_getValidationG === void 0 ? void 0 : _this$_getValidationG.call(this, detailOptions);
          var userCustomizeItem = this.option('editing.form.customizeItem');
          var editFormItemClass = this.addWidgetPrefix(EDIT_FORM_ITEM_CLASS);
          var items = this.option('editing.form.items');
          var isCustomEditorType = {};

          if (!items) {
            var columns = this.getController('columns').getColumns();
            items = [];
            (0, _iterator.each)(columns, function (_, column) {
              if (!column.isBand && !column.type) {
                items.push({
                  column: column,
                  name: column.name,
                  dataField: column.dataField
                });
              }
            });
          } else {
            forEachFormItems(items, function (item) {
              var itemId = (item === null || item === void 0 ? void 0 : item.name) || (item === null || item === void 0 ? void 0 : item.dataField);

              if (itemId) {
                isCustomEditorType[itemId] = !!item.editorType;
              }
            });
          }

          return (0, _extend.extend)({}, editFormOptions, {
            items: items,
            formID: 'dx-' + new _guid.default(),
            customizeItem: function customizeItem(item) {
              var column;
              var itemId = item.name || item.dataField;

              if (item.column || itemId) {
                column = item.column || _this5._columnsController.columnOption(item.name ? 'name:' + item.name : 'dataField:' + item.dataField);
              }

              if (column) {
                item.label = item.label || {};
                item.label.text = item.label.text || column.caption;

                if (column.dataType === 'boolean' && item.label.visible === undefined) {
                  var labelMode = _this5.option('editing.form.labelMode');

                  if (labelMode === 'floating' || labelMode === 'static') {
                    item.label.visible = true;
                  }
                }

                item.template = item.template || _this5.getFormEditorTemplate(detailOptions, item);
                item.column = column;
                item.isCustomEditorType = isCustomEditorType[itemId];

                if (column.formItem) {
                  (0, _extend.extend)(item, column.formItem);
                }

                if (item.isRequired === undefined && column.validationRules) {
                  item.isRequired = column.validationRules.some(function (rule) {
                    return rule.type === 'required';
                  });
                  item.validationRules = [];
                }

                var itemVisible = (0, _type.isDefined)(item.visible) ? item.visible : true;

                if (!_this5._firstFormItem && itemVisible) {
                  _this5._firstFormItem = item;
                }
              }

              userCustomizeItem === null || userCustomizeItem === void 0 ? void 0 : userCustomizeItem.call(_this5, item);
              item.cssClass = (0, _type.isString)(item.cssClass) ? item.cssClass + ' ' + editFormItemClass : editFormItemClass;
            }
          });
        },
        getEditFormTemplate: function getEditFormTemplate() {
          var _this6 = this;

          return function ($container, detailOptions, options) {
            var editFormOptions = _this6.option(_uiGrid_core.EDITING_FORM_OPTION_NAME);

            var baseEditFormOptions = _this6.getEditFormOptions(detailOptions);

            var $formContainer = (0, _renderer.default)('<div>').appendTo($container);
            var isPopupForm = options === null || options === void 0 ? void 0 : options.isPopupForm;
            _this6._firstFormItem = undefined;

            if (isPopupForm) {
              $formContainer.addClass(_this6.addWidgetPrefix(EDIT_POPUP_FORM_CLASS));
            }

            _this6._editForm = _this6._createComponent($formContainer, _form.default, (0, _extend.extend)({}, editFormOptions, baseEditFormOptions));

            if (!isPopupForm) {
              var $buttonsContainer = (0, _renderer.default)('<div>').addClass(_this6.addWidgetPrefix(FORM_BUTTONS_CONTAINER_CLASS)).appendTo($container);

              _this6._createComponent((0, _renderer.default)('<div>').appendTo($buttonsContainer), _button.default, _this6._getSaveButtonConfig());

              _this6._createComponent((0, _renderer.default)('<div>').appendTo($buttonsContainer), _button.default, _this6._getCancelButtonConfig());
            }

            _this6._editForm.on('contentReady', function () {
              var _this6$_editPopup;

              (_this6$_editPopup = _this6._editPopup) === null || _this6$_editPopup === void 0 ? void 0 : _this6$_editPopup.repaint();
            });
          };
        },
        getEditForm: function getEditForm() {
          return this._editForm;
        },
        _endUpdateCore: function _endUpdateCore() {
          var _this$_updateEditForm;

          (_this$_updateEditForm = this._updateEditFormDeferred) === null || _this$_updateEditForm === void 0 ? void 0 : _this$_updateEditForm.resolve();
        },
        _beforeEndSaving: function _beforeEndSaving() {
          this.callBase.apply(this, arguments);

          if (this.isPopupEditMode()) {
            var _this$_editPopup5;

            (_this$_editPopup5 = this._editPopup) === null || _this$_editPopup5 === void 0 ? void 0 : _this$_editPopup5.hide();
          }
        },
        _processDataItemCore: function _processDataItemCore(item, _ref2) {
          var type = _ref2.type;

          if (this.isPopupEditMode() && type === _uiGrid_core.DATA_EDIT_DATA_INSERT_TYPE) {
            item.visible = false;
          }

          this.callBase.apply(this, arguments);
        },
        _editRowFromOptionChangedCore: function _editRowFromOptionChangedCore(rowIndices, rowIndex, oldRowIndex) {
          if (this.isPopupEditMode()) {
            this._showEditPopup(rowIndex);
          } else {
            this.callBase.apply(this, arguments);
          }
        }
      },
      data: {
        _updateEditItem: function _updateEditItem(item) {
          if (this._editingController.isFormEditMode()) {
            item.rowType = 'detail';
          }
        }
      }
    },
    views: {
      rowsView: {
        _renderCellContent: function _renderCellContent($cell, options) {
          if (options.rowType === 'data' && this._editingController.isPopupEditMode() && options.row.visible === false) {
            return;
          }

          this.callBase.apply(this, arguments);
        },
        getCellElements: function getCellElements(rowIndex) {
          var $cellElements = this.callBase(rowIndex);
          var editingController = this._editingController;
          var editForm = editingController.getEditForm();
          var editFormRowIndex = editingController.getEditFormRowIndex();

          if (editFormRowIndex === rowIndex && $cellElements && editForm) {
            return editForm.$element().find('.' + this.addWidgetPrefix(EDIT_FORM_ITEM_CLASS) + ', .' + BUTTON_CLASS);
          }

          return $cellElements;
        },
        _getVisibleColumnIndex: function _getVisibleColumnIndex($cells, rowIndex, columnIdentifier) {
          var editFormRowIndex = this._editingController.getEditFormRowIndex();

          if (editFormRowIndex === rowIndex && (0, _type.isString)(columnIdentifier)) {
            var column = this._columnsController.columnOption(columnIdentifier);

            return this._getEditFormEditorVisibleIndex($cells, column);
          }

          return this.callBase.apply(this, arguments);
        },
        _getEditFormEditorVisibleIndex: function _getEditFormEditorVisibleIndex($cells, column) {
          var visibleIndex = -1;
          (0, _iterator.each)($cells, function (index, cellElement) {
            var item = (0, _renderer.default)(cellElement).find('.dx-field-item-content').data('dx-form-item');

            if (item !== null && item !== void 0 && item.column && column && item.column.index === column.index) {
              visibleIndex = index;
              return false;
            }
          });
          return visibleIndex;
        },
        _isFormItem: function _isFormItem(parameters) {
          var isDetailRow = parameters.rowType === 'detail' || parameters.rowType === 'detailAdaptive';

          var isPopupEditing = parameters.rowType === 'data' && this._editingController.isPopupEditMode();

          return (isDetailRow || isPopupEditing) && parameters.item;
        },
        _updateCell: function _updateCell($cell, parameters) {
          if (this._isFormItem(parameters)) {
            this._formItemPrepared(parameters, $cell);
          } else {
            this.callBase($cell, parameters);
          }
        }
      }
    }
  }
};
exports.editingFormBasedModule = editingFormBasedModule;