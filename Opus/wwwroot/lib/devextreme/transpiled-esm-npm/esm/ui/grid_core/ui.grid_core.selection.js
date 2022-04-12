import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import gridCore from '../data_grid/ui.data_grid.core';
import gridCoreUtils from './ui.grid_core.utils';
import { isDefined } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { touch } from '../../core/utils/support';
import { name as clickEventName } from '../../events/click';
import messageLocalization from '../../localization/message';
import { addNamespace, isCommandKeyPressed } from '../../events/utils/index';
import holdEvent from '../../events/hold';
import Selection from '../selection/selection';
import { Deferred } from '../../core/utils/deferred';
import errors from '../widget/ui.errors';
var EDITOR_CELL_CLASS = 'dx-editor-cell';
var ROW_CLASS = 'dx-row';
var ROW_SELECTION_CLASS = 'dx-selection';
var SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';
var CHECKBOXES_HIDDEN_CLASS = 'dx-select-checkboxes-hidden';
var COMMAND_SELECT_CLASS = 'dx-command-select';
var SELECTION_DISABLED_CLASS = 'dx-selection-disabled';
var DATA_ROW_CLASS = 'dx-data-row';
var SHOW_CHECKBOXES_MODE = 'selection.showCheckBoxesMode';
var SELECTION_MODE = 'selection.mode';

var processLongTap = function processLongTap(that, dxEvent) {
  var selectionController = that.getController('selection');
  var rowsView = that.getView('rowsView');
  var $row = $(dxEvent.target).closest('.' + DATA_ROW_CLASS);
  var rowIndex = rowsView.getRowIndex($row);
  if (rowIndex < 0) return;

  if (that.option(SHOW_CHECKBOXES_MODE) === 'onLongTap') {
    if (selectionController.isSelectionWithCheckboxes()) {
      selectionController.stopSelectionWithCheckboxes();
    } else {
      selectionController.startSelectionWithCheckboxes();
    }
  } else {
    if (that.option(SHOW_CHECKBOXES_MODE) === 'onClick') {
      selectionController.startSelectionWithCheckboxes();
    }

    if (that.option(SHOW_CHECKBOXES_MODE) !== 'always') {
      selectionController.changeItemSelection(rowIndex, {
        control: true
      });
    }
  }
};

var SelectionController = gridCore.Controller.inherit(function () {
  var isSeveralRowsSelected = function isSeveralRowsSelected(that, selectionFilter) {
    var keyIndex = 0;

    var store = that._dataController.store();

    var key = store && store.key();
    var isComplexKey = Array.isArray(key);

    if (!selectionFilter.length) {
      return false;
    }

    if (isComplexKey && Array.isArray(selectionFilter[0]) && selectionFilter[1] === 'and') {
      for (var i = 0; i < selectionFilter.length; i++) {
        if (Array.isArray(selectionFilter[i])) {
          if (selectionFilter[i][0] !== key[keyIndex] || selectionFilter[i][1] !== '=') {
            return true;
          }

          keyIndex++;
        }
      }

      return false;
    }

    return key !== selectionFilter[0];
  };

  var selectionCellTemplate = (container, options) => {
    var component = options.component;
    var rowsView = component.getView('rowsView');

    if (component.option('renderAsync') && !component.option('selection.deferred')) {
      options.value = component.isRowSelected(options.row.key);
    }

    rowsView.renderSelectCheckBoxContainer($(container), options);
  };

  var selectionHeaderTemplate = (container, options) => {
    var column = options.column;
    var $cellElement = $(container);
    var columnHeadersView = options.component.getView('columnHeadersView');
    $cellElement.addClass(EDITOR_CELL_CLASS);

    columnHeadersView._renderSelectAllCheckBox($cellElement, column);

    columnHeadersView._attachSelectAllCheckBoxClickEvent($cellElement);
  };

  return {
    init: function init() {
      var {
        deferred,
        selectAllMode,
        mode
      } = this.option('selection') || {};

      if (this.option('scrolling.mode') === 'infinite' && !deferred && mode === 'multiple' && selectAllMode === 'allPages') {
        errors.log('W1018');
      }

      this._dataController = this.getController('data');
      this._selectionMode = mode;
      this._isSelectionWithCheckboxes = false;
      this._selection = this._createSelection();

      this._updateSelectColumn();

      this.createAction('onSelectionChanged', {
        excludeValidators: ['disabled', 'readOnly']
      });
      this._dataController && this._dataController.pushed.add(this._handleDataPushed.bind(this));
    },
    _handleDataPushed: function _handleDataPushed(changes) {
      var removedKeys = changes.filter(change => change.type === 'remove').map(change => change.key);
      removedKeys.length && this.deselectRows(removedKeys);
    },
    _getSelectionConfig: function _getSelectionConfig() {
      var dataController = this._dataController;
      var columnsController = this.getController('columns');
      var selectionOptions = this.option('selection') || {};
      var deferred = selectionOptions.deferred;
      var scrollingMode = this.option('scrolling.mode');
      var virtualPaging = scrollingMode === 'virtual' || scrollingMode === 'infinite';
      var allowSelectAll = this.option('selection.allowSelectAll');
      var legacyScrollingMode = this.option('scrolling.legacyMode');
      return {
        selectedKeys: this.option('selectedRowKeys'),
        mode: this._selectionMode,
        deferred,
        maxFilterLengthInRequest: selectionOptions.maxFilterLengthInRequest,
        selectionFilter: this.option('selectionFilter'),
        ignoreDisabledItems: true,
        allowLoadByRange: function allowLoadByRange() {
          var hasGroupColumns = columnsController.getGroupColumns().length > 0;
          return virtualPaging && !legacyScrollingMode && !hasGroupColumns && allowSelectAll && !deferred;
        },
        key: function key() {
          return dataController === null || dataController === void 0 ? void 0 : dataController.key();
        },
        keyOf: function keyOf(item) {
          return dataController === null || dataController === void 0 ? void 0 : dataController.keyOf(item);
        },
        dataFields: function dataFields() {
          var _dataController$dataS;

          return (_dataController$dataS = dataController.dataSource()) === null || _dataController$dataS === void 0 ? void 0 : _dataController$dataS.select();
        },
        load: function load(options) {
          var _dataController$dataS2;

          return ((_dataController$dataS2 = dataController.dataSource()) === null || _dataController$dataS2 === void 0 ? void 0 : _dataController$dataS2.load(options)) || new Deferred().resolve([]);
        },
        plainItems: function plainItems() {
          return dataController.items(true);
        },
        isItemSelected: function isItemSelected(item) {
          return item.selected;
        },
        isSelectableItem: function isSelectableItem(item) {
          return (item === null || item === void 0 ? void 0 : item.rowType) === 'data' && !item.isNewRow;
        },
        getItemData: function getItemData(item) {
          return (item === null || item === void 0 ? void 0 : item.oldData) || (item === null || item === void 0 ? void 0 : item.data) || item;
        },
        filter: function filter() {
          return dataController.getCombinedFilter(deferred);
        },
        totalCount: () => {
          return dataController.totalCount();
        },
        getLoadOptions: function getLoadOptions(loadItemIndex, focusedItemIndex, shiftItemIndex) {
          var _dataController$dataS3, _dataController$dataS4;

          var {
            sort,
            filter
          } = (_dataController$dataS3 = (_dataController$dataS4 = dataController.dataSource()) === null || _dataController$dataS4 === void 0 ? void 0 : _dataController$dataS4.lastLoadOptions()) !== null && _dataController$dataS3 !== void 0 ? _dataController$dataS3 : {};
          var minIndex = Math.min(loadItemIndex, focusedItemIndex);
          var maxIndex = Math.max(loadItemIndex, focusedItemIndex);

          if (isDefined(shiftItemIndex)) {
            minIndex = Math.min(shiftItemIndex, minIndex);
            maxIndex = Math.max(shiftItemIndex, maxIndex);
          }

          var take = maxIndex - minIndex + 1;
          return {
            skip: minIndex,
            take,
            filter,
            sort
          };
        },
        onSelectionChanged: this._updateSelectedItems.bind(this)
      };
    },
    _updateSelectColumn: function _updateSelectColumn() {
      var columnsController = this.getController('columns');
      var isSelectColumnVisible = this.isSelectColumnVisible();
      columnsController.addCommandColumn({
        type: 'selection',
        command: 'select',
        visible: isSelectColumnVisible,
        visibleIndex: -1,
        dataType: 'boolean',
        alignment: 'center',
        cssClass: COMMAND_SELECT_CLASS,
        width: 'auto',
        cellTemplate: selectionCellTemplate,
        headerCellTemplate: selectionHeaderTemplate
      });
      columnsController.columnOption('command:select', 'visible', isSelectColumnVisible);
    },
    _createSelection: function _createSelection() {
      var options = this._getSelectionConfig();

      return new Selection(options);
    },
    _fireSelectionChanged: function _fireSelectionChanged(options) {
      var argument = this.option('selection.deferred') ? {
        selectionFilter: this.option('selectionFilter')
      } : {
        selectedRowKeys: this.option('selectedRowKeys')
      };
      this.selectionChanged.fire(argument);

      if (options) {
        this.executeAction('onSelectionChanged', options);
      }
    },
    _updateCheckboxesState: function _updateCheckboxesState(options) {
      var isDeferredMode = options.isDeferredMode;
      var selectionFilter = options.selectionFilter;
      var selectedItemKeys = options.selectedItemKeys;
      var removedItemKeys = options.removedItemKeys;

      if (this.option(SHOW_CHECKBOXES_MODE) === 'onClick') {
        if (isDeferredMode ? selectionFilter && isSeveralRowsSelected(this, selectionFilter) : selectedItemKeys.length > 1) {
          this.startSelectionWithCheckboxes();
        } else if (isDeferredMode ? selectionFilter && !selectionFilter.length : selectedItemKeys.length === 0 && removedItemKeys.length) {
          this.stopSelectionWithCheckboxes();
        }
      }
    },
    _updateSelectedItems: function _updateSelectedItems(args) {
      var that = this;
      var selectionChangedOptions;
      var isDeferredMode = that.option('selection.deferred');

      var selectionFilter = that._selection.selectionFilter();

      var dataController = that._dataController;
      var items = dataController.items();

      if (!items) {
        return;
      }

      var isSelectionWithCheckboxes = that.isSelectionWithCheckboxes();
      var changedItemIndexes = that.getChangedItemIndexes(items);

      that._updateCheckboxesState({
        selectedItemKeys: args.selectedItemKeys,
        removedItemKeys: args.removedItemKeys,
        selectionFilter: selectionFilter,
        isDeferredMode: isDeferredMode
      });

      if (changedItemIndexes.length || isSelectionWithCheckboxes !== that.isSelectionWithCheckboxes()) {
        dataController.updateItems({
          changeType: 'updateSelection',
          itemIndexes: changedItemIndexes
        });
      }

      if (isDeferredMode) {
        that.option('selectionFilter', selectionFilter);
        selectionChangedOptions = {};
      } else if (args.addedItemKeys.length || args.removedItemKeys.length) {
        that._selectedItemsInternalChange = true;
        that.option('selectedRowKeys', args.selectedItemKeys.slice(0));
        that._selectedItemsInternalChange = false;
        selectionChangedOptions = {
          selectedRowsData: args.selectedItems.slice(0),
          selectedRowKeys: args.selectedItemKeys.slice(0),
          currentSelectedRowKeys: args.addedItemKeys.slice(0),
          currentDeselectedRowKeys: args.removedItemKeys.slice(0)
        };
      }

      that._fireSelectionChanged(selectionChangedOptions);
    },
    getChangedItemIndexes: function getChangedItemIndexes(items) {
      var that = this;
      var itemIndexes = [];
      var isDeferredSelection = this.option('selection.deferred');

      for (var i = 0, length = items.length; i < length; i++) {
        var row = items[i];
        var isItemSelected = that.isRowSelected(isDeferredSelection ? row.data : row.key);

        if (that._selection.isDataItem(row) && row.isSelected !== isItemSelected) {
          itemIndexes.push(i);
        }
      }

      return itemIndexes;
    },
    callbackNames: function callbackNames() {
      return ['selectionChanged'];
    },
    optionChanged: function optionChanged(args) {
      this.callBase(args);

      switch (args.name) {
        case 'selection':
          {
            var oldSelectionMode = this._selectionMode;
            this.init();

            if (args.fullName !== 'selection.showCheckBoxesMode') {
              var selectionMode = this._selectionMode;
              var selectedRowKeys = this.option('selectedRowKeys');

              if (oldSelectionMode !== selectionMode) {
                if (selectionMode === 'single') {
                  if (selectedRowKeys.length > 1) {
                    selectedRowKeys = [selectedRowKeys[0]];
                  }
                } else if (selectionMode !== 'multiple') {
                  selectedRowKeys = [];
                }
              }

              this.selectRows(selectedRowKeys).always(() => {
                this._fireSelectionChanged();
              });
            }

            this.getController('columns').updateColumns();
            args.handled = true;
            break;
          }

        case 'selectionFilter':
          this._selection.selectionFilter(args.value);

          args.handled = true;
          break;

        case 'selectedRowKeys':
          {
            var value = args.value || [];

            if (Array.isArray(value) && !this._selectedItemsInternalChange && (this.component.getDataSource() || !value.length)) {
              this.selectRows(value);
            }

            args.handled = true;
            break;
          }
      }
    },
    publicMethods: function publicMethods() {
      return ['selectRows', 'deselectRows', 'selectRowsByIndexes', 'getSelectedRowKeys', 'getSelectedRowsData', 'clearSelection', 'selectAll', 'deselectAll', 'startSelectionWithCheckboxes', 'stopSelectionWithCheckboxes', 'isRowSelected'];
    },
    isRowSelected: function isRowSelected(arg) {
      return this._selection.isItemSelected(arg);
    },
    isSelectColumnVisible: function isSelectColumnVisible() {
      return this.option(SELECTION_MODE) === 'multiple' && (this.option(SHOW_CHECKBOXES_MODE) === 'always' || this.option(SHOW_CHECKBOXES_MODE) === 'onClick' || this._isSelectionWithCheckboxes);
    },
    _isOnePageSelectAll: function _isOnePageSelectAll() {
      return this.option('selection.selectAllMode') === 'page';
    },
    isSelectAll: function isSelectAll() {
      return this._selection.getSelectAllState(this._isOnePageSelectAll());
    },
    selectAll: function selectAll() {
      if (this.option(SHOW_CHECKBOXES_MODE) === 'onClick') {
        this.startSelectionWithCheckboxes();
      }

      return this._selection.selectAll(this._isOnePageSelectAll());
    },
    deselectAll: function deselectAll() {
      return this._selection.deselectAll(this._isOnePageSelectAll());
    },
    clearSelection: function clearSelection() {
      return this.selectedItemKeys([]);
    },
    refresh: function refresh() {
      var selectedRowKeys = this.option('selectedRowKeys') || [];

      if (!this.option('selection.deferred') && selectedRowKeys.length) {
        return this.selectedItemKeys(selectedRowKeys);
      }

      return new Deferred().resolve().promise();
    },
    selectedItemKeys: function selectedItemKeys(value, preserve, isDeselect, isSelectAll) {
      return this._selection.selectedItemKeys(value, preserve, isDeselect, isSelectAll);
    },
    getSelectedRowKeys: function getSelectedRowKeys() {
      return this._selection.getSelectedItemKeys();
    },
    selectRows: function selectRows(keys, preserve) {
      return this.selectedItemKeys(keys, preserve);
    },
    deselectRows: function deselectRows(keys) {
      return this.selectedItemKeys(keys, true, true);
    },
    selectRowsByIndexes: function selectRowsByIndexes(indexes) {
      var items = this._dataController.items();

      var keys = [];

      if (!Array.isArray(indexes)) {
        indexes = Array.prototype.slice.call(arguments, 0);
      }

      each(indexes, function () {
        var item = items[this];

        if (item && item.rowType === 'data') {
          keys.push(item.key);
        }
      });
      return this.selectRows(keys);
    },
    getSelectedRowsData: function getSelectedRowsData() {
      return this._selection.getSelectedItems();
    },
    changeItemSelection: function changeItemSelection(visibleItemIndex, keys) {
      keys = keys || {};

      if (this.isSelectionWithCheckboxes()) {
        keys.control = true;
      }

      var loadedItemIndex = visibleItemIndex + this._dataController.getRowIndexOffset() - this._dataController.getRowIndexOffset(true);

      return this._selection.changeItemSelection(loadedItemIndex, keys);
    },
    focusedItemIndex: function focusedItemIndex(itemIndex) {
      var that = this;

      if (isDefined(itemIndex)) {
        that._selection._focusedItemIndex = itemIndex;
      } else {
        return that._selection._focusedItemIndex;
      }
    },
    isSelectionWithCheckboxes: function isSelectionWithCheckboxes() {
      return this.option(SELECTION_MODE) === 'multiple' && (this.option(SHOW_CHECKBOXES_MODE) === 'always' || this._isSelectionWithCheckboxes);
    },

    /**
     * @name GridBase.startSelectionWithCheckboxes
     * @publicName startSelectionWithCheckboxes()
     * @hidden
     * @return boolean
     */
    startSelectionWithCheckboxes: function startSelectionWithCheckboxes() {
      var that = this;

      if (that.option(SELECTION_MODE) === 'multiple' && !that.isSelectionWithCheckboxes()) {
        that._isSelectionWithCheckboxes = true;

        that._updateSelectColumn();

        return true;
      }

      return false;
    },

    /**
     * @name GridBase.stopSelectionWithCheckboxes
     * @publicName stopSelectionWithCheckboxes()
     * @hidden
     * @return boolean
     */
    stopSelectionWithCheckboxes: function stopSelectionWithCheckboxes() {
      var that = this;

      if (that._isSelectionWithCheckboxes) {
        that._isSelectionWithCheckboxes = false;

        that._updateSelectColumn();

        return true;
      }

      return false;
    }
  };
}());
export var selectionModule = {
  defaultOptions: function defaultOptions() {
    return {
      selection: {
        mode: 'none',
        // "single", "multiple"
        showCheckBoxesMode: 'onClick',
        // "onLongTap", "always", "none"
        allowSelectAll: true,
        selectAllMode: 'allPages',

        /**
         * @name dxDataGridOptions.selection.maxFilterLengthInRequest
         * @type number
         * @hidden
         * @default 1500
         */
        maxFilterLengthInRequest: 1500,
        deferred: false
      },
      selectionFilter: [],
      selectedRowKeys: []
    };
  },
  controllers: {
    selection: SelectionController
  },
  extenders: {
    controllers: {
      data: {
        init: function init() {
          var selectionController = this.getController('selection');
          var isDeferredMode = this.option('selection.deferred');
          this.callBase.apply(this, arguments);

          if (isDeferredMode) {
            selectionController._updateCheckboxesState({
              isDeferredMode: true,
              selectionFilter: this.option('selectionFilter')
            });
          }
        },
        _loadDataSource: function _loadDataSource() {
          var that = this;
          return that.callBase().done(function () {
            that.getController('selection').refresh();
          });
        },
        _processDataItem: function _processDataItem(item, options) {
          var that = this;
          var selectionController = that.getController('selection');
          var hasSelectColumn = selectionController.isSelectColumnVisible();
          var isDeferredSelection = options.isDeferredSelection = options.isDeferredSelection === undefined ? this.option('selection.deferred') : options.isDeferredSelection;
          var dataItem = this.callBase.apply(this, arguments);
          dataItem.isSelected = selectionController.isRowSelected(isDeferredSelection ? dataItem.data : dataItem.key);

          if (hasSelectColumn && dataItem.values) {
            for (var i = 0; i < options.visibleColumns.length; i++) {
              if (options.visibleColumns[i].command === 'select') {
                dataItem.values[i] = dataItem.isSelected;
                break;
              }
            }
          }

          return dataItem;
        },
        refresh: function refresh(options) {
          var that = this;
          var d = new Deferred();
          this.callBase.apply(this, arguments).done(function () {
            if (!options || options.selection) {
              that.getController('selection').refresh().done(d.resolve).fail(d.reject);
            } else {
              d.resolve();
            }
          }).fail(d.reject);
          return d.promise();
        },
        _handleDataChanged: function _handleDataChanged(e) {
          this.callBase.apply(this, arguments);

          if ((!e || e.changeType === 'refresh') && !this._repaintChangesOnly) {
            this.getController('selection').focusedItemIndex(-1);
          }
        },
        _applyChange: function _applyChange(change) {
          if (change && change.changeType === 'updateSelection') {
            change.items.forEach((item, index) => {
              var currentItem = this._items[index];

              if (currentItem) {
                currentItem.isSelected = item.isSelected;
                currentItem.values = item.values;
              }
            });
            return;
          }

          return this.callBase.apply(this, arguments);
        },
        _endUpdateCore: function _endUpdateCore() {
          var changes = this._changes;
          var isUpdateSelection = changes.length > 1 && changes.every(change => change.changeType === 'updateSelection');

          if (isUpdateSelection) {
            var itemIndexes = changes.map(change => change.itemIndexes || []).reduce((a, b) => a.concat(b));
            this._changes = [{
              changeType: 'updateSelection',
              itemIndexes
            }];
          }

          this.callBase.apply(this, arguments);
        }
      },
      contextMenu: {
        _contextMenuPrepared: function _contextMenuPrepared(options) {
          var dxEvent = options.event;
          if (dxEvent.originalEvent && dxEvent.originalEvent.type !== 'dxhold' || options.items && options.items.length > 0) return;
          processLongTap(this, dxEvent);
        }
      }
    },
    views: {
      columnHeadersView: {
        init: function init() {
          var that = this;
          that.callBase();
          that.getController('selection').selectionChanged.add(that._updateSelectAllValue.bind(that));
        },
        _updateSelectAllValue: function _updateSelectAllValue() {
          var that = this;
          var $element = that.element();
          var $editor = $element && $element.find('.' + SELECT_CHECKBOX_CLASS);

          if ($element && $editor.length && that.option('selection.mode') === 'multiple') {
            var selectAllValue = that.getController('selection').isSelectAll();
            var hasSelection = selectAllValue !== false;
            var isVisible = that.option('selection.allowSelectAll') ? !that.getController('data').isEmpty() : hasSelection;
            $editor.dxCheckBox('instance').option({
              visible: isVisible,
              value: selectAllValue
            });
          }
        },
        _handleDataChanged: function _handleDataChanged(e) {
          this.callBase(e);

          if (!e || e.changeType === 'refresh') {
            this._updateSelectAllValue();
          }
        },
        _renderSelectAllCheckBox: function _renderSelectAllCheckBox($container, column) {
          var that = this;
          var selectionController = that.getController('selection');
          var isEmptyData = that.getController('data').isEmpty();
          var groupElement = $('<div>').appendTo($container).addClass(SELECT_CHECKBOX_CLASS);
          that.setAria('label', messageLocalization.format('dxDataGrid-ariaSelectAll'), $container);
          that.getController('editorFactory').createEditor(groupElement, extend({}, column, {
            parentType: 'headerRow',
            dataType: 'boolean',
            value: selectionController.isSelectAll(),
            editorOptions: {
              visible: !isEmptyData && (that.option('selection.allowSelectAll') || selectionController.isSelectAll() !== false)
            },
            tabIndex: that.option('useLegacyKeyboardNavigation') ? -1 : that.option('tabIndex') || 0,
            setValue: function setValue(value, e) {
              var allowSelectAll = that.option('selection.allowSelectAll');
              e.component.option('visible', allowSelectAll || e.component.option('value') !== false);

              if (!e.event || selectionController.isSelectAll() === value) {
                return;
              }

              if (e.value && !allowSelectAll) {
                e.component.option('value', false);
              } else {
                e.value ? selectionController.selectAll() : selectionController.deselectAll();
              }

              e.event.preventDefault();
            }
          }));
          return groupElement;
        },
        _attachSelectAllCheckBoxClickEvent: function _attachSelectAllCheckBoxClickEvent($element) {
          eventsEngine.on($element, clickEventName, this.createAction(function (e) {
            var event = e.event;

            if (!$(event.target).closest('.' + SELECT_CHECKBOX_CLASS).length) {
              eventsEngine.trigger($(event.currentTarget).children('.' + SELECT_CHECKBOX_CLASS), clickEventName);
            }

            event.preventDefault();
          }));
        }
      },
      rowsView: {
        renderSelectCheckBoxContainer: function renderSelectCheckBoxContainer($container, options) {
          if (options.rowType === 'data' && !options.row.isNewRow) {
            $container.addClass(EDITOR_CELL_CLASS);

            this._attachCheckBoxClickEvent($container);

            this.setAria('label', messageLocalization.format('dxDataGrid-ariaSelectRow'), $container);

            this._renderSelectCheckBox($container, options);
          } else {
            gridCoreUtils.setEmptyText($container);
          }
        },
        _renderSelectCheckBox: function _renderSelectCheckBox(container, options) {
          var groupElement = $('<div>').addClass(SELECT_CHECKBOX_CLASS).appendTo(container);
          this.getController('editorFactory').createEditor(groupElement, extend({}, options.column, {
            parentType: 'dataRow',
            dataType: 'boolean',
            lookup: null,
            value: options.value,
            setValue: function setValue(value, e) {
              var _e$event;

              if ((e === null || e === void 0 ? void 0 : (_e$event = e.event) === null || _e$event === void 0 ? void 0 : _e$event.type) === 'keydown') {
                eventsEngine.trigger(e.element, clickEventName, e);
              }
            },
            row: options.row
          }));
          return groupElement;
        },
        _attachCheckBoxClickEvent: function _attachCheckBoxClickEvent($element) {
          eventsEngine.on($element, clickEventName, this.createAction(function (e) {
            var selectionController = this.getController('selection');
            var event = e.event;
            var rowIndex = this.getRowIndex($(event.currentTarget).closest('.' + ROW_CLASS));

            if (rowIndex >= 0) {
              selectionController.startSelectionWithCheckboxes();
              selectionController.changeItemSelection(rowIndex, {
                shift: event.shiftKey
              });

              if ($(event.target).closest('.' + SELECT_CHECKBOX_CLASS).length) {
                this.getController('data').updateItems({
                  changeType: 'updateSelection',
                  itemIndexes: [rowIndex]
                });
              }
            }
          }));
        },
        _update: function _update(change) {
          var that = this;
          var tableElements = that.getTableElements();

          if (change.changeType === 'updateSelection') {
            if (tableElements.length > 0) {
              each(tableElements, function (_, tableElement) {
                each(change.itemIndexes || [], function (_, index) {
                  var $row; // T108078

                  if (change.items[index]) {
                    $row = that._getRowElements($(tableElement)).eq(index);

                    if ($row.length) {
                      var isSelected = change.items[index].isSelected;
                      $row.toggleClass(ROW_SELECTION_CLASS, isSelected === undefined ? false : isSelected).find('.' + SELECT_CHECKBOX_CLASS).dxCheckBox('option', 'value', isSelected);
                      that.setAria('selected', isSelected, $row);
                    }
                  }
                });
              });

              that._updateCheckboxesClass();
            }
          } else {
            that.callBase(change);
          }
        },
        _createTable: function _createTable() {
          var that = this;
          var selectionMode = that.option('selection.mode');
          var $table = that.callBase.apply(that, arguments);

          if (selectionMode !== 'none') {
            if (that.option(SHOW_CHECKBOXES_MODE) === 'onLongTap' || !touch) {
              // TODO Not working timeout by hold when it is larger than other timeouts by hold
              eventsEngine.on($table, addNamespace(holdEvent.name, 'dxDataGridRowsView'), '.' + DATA_ROW_CLASS, that.createAction(function (e) {
                processLongTap(that.component, e.event);
                e.event.stopPropagation();
              }));
            }

            eventsEngine.on($table, 'mousedown selectstart', that.createAction(function (e) {
              var event = e.event;

              if (event.shiftKey) {
                event.preventDefault();
              }
            }));
          }

          return $table;
        },
        _createRow: function _createRow(row) {
          var $row = this.callBase.apply(this, arguments);

          if (row) {
            var isSelected = !!row.isSelected;

            if (isSelected) {
              $row.addClass(ROW_SELECTION_CLASS);
            }

            this.setAria('selected', isSelected, $row);
          }

          return $row;
        },
        _rowClick: function _rowClick(e) {
          var that = this;
          var dxEvent = e.event;
          var isSelectionDisabled = $(dxEvent.target).closest('.' + SELECTION_DISABLED_CLASS).length;

          if (!that.isClickableElement($(dxEvent.target))) {
            if (!isSelectionDisabled && (that.option(SELECTION_MODE) !== 'multiple' || that.option(SHOW_CHECKBOXES_MODE) !== 'always')) {
              if (that.getController('selection').changeItemSelection(e.rowIndex, {
                control: isCommandKeyPressed(dxEvent),
                shift: dxEvent.shiftKey
              })) {
                dxEvent.preventDefault();
                e.handled = true;
              }
            }

            that.callBase(e);
          }
        },
        isClickableElement: function isClickableElement($target) {
          var isCommandSelect = $target.closest('.' + COMMAND_SELECT_CLASS).length;
          return !!isCommandSelect;
        },
        _renderCore: function _renderCore(change) {
          this.callBase(change);

          this._updateCheckboxesClass();
        },
        _updateCheckboxesClass: function _updateCheckboxesClass() {
          var tableElements = this.getTableElements();
          var selectionController = this.getController('selection');
          var isCheckBoxesHidden = selectionController.isSelectColumnVisible() && !selectionController.isSelectionWithCheckboxes();
          each(tableElements, function (_, tableElement) {
            $(tableElement).toggleClass(CHECKBOXES_HIDDEN_CLASS, isCheckBoxesHidden);
          });
        }
      }
    }
  }
};