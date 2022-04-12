import { EDIT_MODE_ROW, MODES_WITH_DELAYED_FOCUS, ROW_SELECTED_CLASS, EDIT_FORM_CLASS } from './ui.grid_core.editing_constants';
var EDIT_ROW = 'dx-edit-row';
export var editingRowBasedModule = {
  extenders: {
    controllers: {
      editing: {
        isRowEditMode: function isRowEditMode() {
          return this.getEditMode() === EDIT_MODE_ROW;
        },
        _afterCancelEditData: function _afterCancelEditData(rowIndex) {
          var dataController = this._dataController;

          if (this.isRowBasedEditMode() && rowIndex >= 0) {
            dataController.updateItems({
              changeType: 'update',
              rowIndices: [rowIndex, rowIndex + 1]
            });
          } else {
            this.callBase.apply(this, arguments);
          }
        },
        _isDefaultButtonVisible: function _isDefaultButtonVisible(button, options) {
          var isRowMode = this.isRowBasedEditMode();

          var isEditRow = options.row && options.row.rowIndex === this._getVisibleEditRowIndex();

          if (isRowMode) {
            switch (button.name) {
              case 'edit':
                return !isEditRow && this.allowUpdating(options);

              case 'delete':
                return this.callBase.apply(this, arguments) && !isEditRow;

              case 'save':
              case 'cancel':
                return isEditRow;

              default:
                return this.callBase.apply(this, arguments);
            }
          }

          return this.callBase.apply(this, arguments);
        },
        isEditRow: function isEditRow(rowIndex) {
          return this.isRowBasedEditMode() && this._isEditRowByIndex(rowIndex);
        },
        _cancelSaving: function _cancelSaving() {
          if (this.isRowBasedEditMode()) {
            if (!this.hasChanges()) {
              this._cancelEditDataCore();
            }
          }

          this.callBase.apply(this, arguments);
        },
        _refreshCore: function _refreshCore() {
          if (this.isRowBasedEditMode()) {
            this.init();
          }

          this.callBase.apply(this, arguments);
        },
        _isEditColumnVisible: function _isEditColumnVisible() {
          var result = this.callBase.apply(this, arguments);
          var editingOptions = this.option('editing');
          var isRowEditMode = this.isRowEditMode();
          var isVisibleInRowEditMode = editingOptions.allowUpdating || editingOptions.allowAdding;
          return result || isRowEditMode && isVisibleInRowEditMode;
        },
        _focusEditorIfNeed: function _focusEditorIfNeed() {
          var editMode = this.getEditMode();

          if (this._needFocusEditor) {
            if (MODES_WITH_DELAYED_FOCUS.indexOf(editMode) !== -1) {
              var $editingCell = this.getFocusedCellInRow(this._getVisibleEditRowIndex());

              this._delayedInputFocus($editingCell, () => {
                $editingCell && this.component.focus($editingCell);
              });
            }

            this._needFocusEditor = false;
          }
        }
      },
      data: {
        _getChangedColumnIndices: function _getChangedColumnIndices(oldItem, newItem, rowIndex, isLiveUpdate) {
          var editingController = this.getController('editing');

          if (editingController.isRowBasedEditMode() && oldItem.isEditing !== newItem.isEditing) {
            return;
          }

          return this.callBase.apply(this, arguments);
        }
      }
    },
    views: {
      rowsView: {
        _createRow: function _createRow(row) {
          var $row = this.callBase.apply(this, arguments);

          if (row) {
            var editingController = this._editingController;
            var isEditRow = editingController.isEditRow(row.rowIndex);

            if (isEditRow) {
              $row.addClass(EDIT_ROW);
              $row.removeClass(ROW_SELECTED_CLASS);

              if (row.rowType === 'detail') {
                $row.addClass(this.addWidgetPrefix(EDIT_FORM_CLASS));
              }
            }
          }

          return $row;
        },
        _update: function _update(change) {
          this.callBase(change);

          if (change.changeType === 'updateSelection') {
            this.getTableElements().children('tbody').children('.' + EDIT_ROW).removeClass(ROW_SELECTED_CLASS);
          }
        }
      }
    }
  }
};