"use strict";

exports.rowDraggingModule = void 0;

var _size = require("../../core/utils/size");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _extend = require("../../core/utils/extend");

var _sortable = _interopRequireDefault(require("../sortable"));

var _uiGrid_core = _interopRequireDefault(require("./ui.grid_core.utils"));

var _common = require("../../core/utils/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMMAND_HANDLE_CLASS = 'dx-command-drag';
var CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
var HANDLE_ICON_CLASS = 'drag-icon';
var ROWS_VIEW = 'rowsview';
var SORTABLE_WITHOUT_HANDLE_CLASS = 'dx-sortable-without-handle';
var RowDraggingExtender = {
  init: function init() {
    this.callBase.apply(this, arguments);

    this._updateHandleColumn();
  },
  _allowReordering: function _allowReordering() {
    var rowDragging = this.option('rowDragging');
    return !!(rowDragging && (rowDragging.allowReordering || rowDragging.allowDropInsideItem || rowDragging.group));
  },
  _updateHandleColumn: function _updateHandleColumn() {
    var rowDragging = this.option('rowDragging');

    var allowReordering = this._allowReordering();

    var columnsController = this._columnsController;
    var isHandleColumnVisible = allowReordering && rowDragging.showDragIcons;
    columnsController && columnsController.addCommandColumn({
      type: 'drag',
      command: 'drag',
      visibleIndex: -2,
      alignment: 'center',
      cssClass: COMMAND_HANDLE_CLASS,
      width: 'auto',
      cellTemplate: this._getHandleTemplate(),
      visible: isHandleColumnVisible
    });
    columnsController.columnOption('type:drag', 'visible', isHandleColumnVisible);
  },
  _renderContent: function _renderContent() {
    var _this = this;

    var rowDragging = this.option('rowDragging');

    var allowReordering = this._allowReordering();

    var $content = this.callBase.apply(this, arguments);
    var isFixedTableRendering = this._isFixedTableRendering;
    var sortableName = '_sortable';
    var sortableFixedName = '_sortableFixed';
    var currentSortableName = isFixedTableRendering ? sortableFixedName : sortableName;
    var anotherSortableName = isFixedTableRendering ? sortableName : sortableFixedName;

    var togglePointerEventsStyle = function togglePointerEventsStyle(toggle) {
      var _this$sortableFixedNa;

      // T929503
      (_this$sortableFixedNa = _this[sortableFixedName]) === null || _this$sortableFixedNa === void 0 ? void 0 : _this$sortableFixedNa.$element().css('pointerEvents', toggle ? 'auto' : '');
    };

    var filter = this.option('dataRowTemplate') ? '> table > tbody.dx-row:not(.dx-freespace-row):not(.dx-virtual-row)' : '> table > tbody > .dx-row:not(.dx-freespace-row):not(.dx-virtual-row)';

    if ((allowReordering || this[currentSortableName]) && $content.length) {
      this[currentSortableName] = this._createComponent($content, _sortable.default, (0, _extend.extend)({
        component: this.component,
        contentTemplate: null,
        filter: filter,
        dragTemplate: this._getDraggableRowTemplate(),
        handle: rowDragging.showDragIcons && ".".concat(COMMAND_HANDLE_CLASS),
        dropFeedbackMode: 'indicate'
      }, rowDragging, {
        onDragStart: function onDragStart(e) {
          var _this$getController, _rowDragging$onDragSt;

          (_this$getController = _this.getController('keyboardNavigation')) === null || _this$getController === void 0 ? void 0 : _this$getController._resetFocusedCell();
          var row = e.component.getVisibleRows()[e.fromIndex];
          e.itemData = row && row.data;
          var isDataRow = row && row.rowType === 'data';
          e.cancel = !allowReordering || !isDataRow;
          (_rowDragging$onDragSt = rowDragging.onDragStart) === null || _rowDragging$onDragSt === void 0 ? void 0 : _rowDragging$onDragSt.call(rowDragging, e);
        },
        onDragEnter: function onDragEnter() {
          togglePointerEventsStyle(true);
        },
        onDragLeave: function onDragLeave() {
          togglePointerEventsStyle(false);
        },
        onDragEnd: function onDragEnd(e) {
          var _rowDragging$onDragEn;

          togglePointerEventsStyle(false);
          (_rowDragging$onDragEn = rowDragging.onDragEnd) === null || _rowDragging$onDragEn === void 0 ? void 0 : _rowDragging$onDragEn.call(rowDragging, e);
        },
        onAdd: function onAdd(e) {
          var _rowDragging$onAdd;

          togglePointerEventsStyle(false);
          (_rowDragging$onAdd = rowDragging.onAdd) === null || _rowDragging$onAdd === void 0 ? void 0 : _rowDragging$onAdd.call(rowDragging, e);
        },
        dropFeedbackMode: rowDragging.dropFeedbackMode,
        onOptionChanged: function onOptionChanged(e) {
          var hasFixedSortable = _this[sortableFixedName];

          if (hasFixedSortable) {
            if (e.name === 'fromIndex' || e.name === 'toIndex') {
              _this[anotherSortableName].option(e.name, e.value);
            }
          }
        }
      }));
      $content.toggleClass('dx-scrollable-container', isFixedTableRendering);
      $content.toggleClass(SORTABLE_WITHOUT_HANDLE_CLASS, allowReordering && !rowDragging.showDragIcons);
    }

    return $content;
  },
  _renderCore: function _renderCore(e) {
    var _this2 = this;

    this.callBase.apply(this, arguments);

    if (e && e.changeType === 'update' && e.repaintChangesOnly && _uiGrid_core.default.isVirtualRowRendering(this)) {
      (0, _common.deferUpdate)(function () {
        _this2._updateSortable();
      });
    }
  },
  _updateSortable: function _updateSortable() {
    var offset = this._dataController.getRowIndexOffset();

    [this._sortable, this._sortableFixed].forEach(function (sortable) {
      sortable === null || sortable === void 0 ? void 0 : sortable.option('offset', offset);
      sortable === null || sortable === void 0 ? void 0 : sortable.update();
    });
  },
  _resizeCore: function _resizeCore() {
    this.callBase.apply(this, arguments);

    this._updateSortable();
  },
  _getDraggableGridOptions: function _getDraggableGridOptions(options) {
    var gridOptions = this.option();
    var columns = this.getColumns();
    var $rowElement = (0, _renderer.default)(this.getRowElement(options.rowIndex));
    return {
      dataSource: [{
        id: 1,
        parentId: 0
      }],
      showBorders: true,
      showColumnHeaders: false,
      scrolling: {
        useNative: false,
        showScrollbar: 'never'
      },
      pager: {
        visible: false
      },
      loadingTimeout: null,
      columnFixing: gridOptions.columnFixing,
      columnAutoWidth: gridOptions.columnAutoWidth,
      showColumnLines: gridOptions.showColumnLines,
      columns: columns.map(function (column) {
        return {
          width: column.width || column.visibleWidth,
          fixed: column.fixed,
          fixedPosition: column.fixedPosition
        };
      }),
      onRowPrepared: function onRowPrepared(e) {
        var rowsView = e.component.getView('rowsView');
        (0, _renderer.default)(e.rowElement).replaceWith($rowElement.eq(rowsView._isFixedTableRendering ? 1 : 0).clone());
      }
    };
  },
  _getDraggableRowTemplate: function _getDraggableRowTemplate() {
    var _this3 = this;

    return function (options) {
      var $rootElement = _this3.component.$element();

      var $dataGridContainer = (0, _renderer.default)('<div>');
      (0, _size.setWidth)($dataGridContainer, (0, _size.getWidth)($rootElement));

      var items = _this3._dataController.items();

      var row = items && items[options.fromIndex];

      var gridOptions = _this3._getDraggableGridOptions(row);

      _this3._createComponent($dataGridContainer, _this3.component.NAME, gridOptions);

      $dataGridContainer.find('.dx-gridbase-container').children(":not(.".concat(_this3.addWidgetPrefix(ROWS_VIEW), ")")).hide();
      return $dataGridContainer;
    };
  },
  _getHandleTemplate: function _getHandleTemplate() {
    var _this4 = this;

    return function (container, options) {
      if (options.rowType === 'data') {
        (0, _renderer.default)(container).addClass(CELL_FOCUS_DISABLED_CLASS);
        return (0, _renderer.default)('<span>').addClass(_this4.addWidgetPrefix(HANDLE_ICON_CLASS));
      } else {
        _uiGrid_core.default.setEmptyText((0, _renderer.default)(container));
      }
    };
  },
  optionChanged: function optionChanged(args) {
    if (args.name === 'rowDragging') {
      this._updateHandleColumn();

      this._invalidate(true, true);

      args.handled = true;
    }

    this.callBase.apply(this, arguments);
  }
};
var rowDraggingModule = {
  defaultOptions: function defaultOptions() {
    return {
      rowDragging: {
        showDragIcons: true,
        dropFeedbackMode: 'indicate',
        allowReordering: false,
        allowDropInsideItem: false
      }
    };
  },
  extenders: {
    views: {
      rowsView: RowDraggingExtender
    }
  }
};
exports.rowDraggingModule = rowDraggingModule;