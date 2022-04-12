"use strict";

exports.GanttTreeList = void 0;

var _size = require("../../core/utils/size");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _tree_list = _interopRequireDefault(require("../tree_list"));

var _position = require("../../core/utils/position");

var _type = require("../../core/utils/type");

var _uiGantt = require("./ui.gantt.helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GANTT_TASKS = 'tasks';
var GANTT_COLLAPSABLE_ROW = 'dx-gantt-collapsable-row';
var GANTT_DEFAULT_ROW_HEIGHT = 34;

var GanttTreeList = /*#__PURE__*/function () {
  function GanttTreeList(gantt) {
    this._gantt = gantt;
    this._$treeList = this._gantt._$treeList;
  }

  var _proto = GanttTreeList.prototype;

  _proto.getTreeList = function getTreeList() {
    var _this = this;

    var _this$_gantt$option = this._gantt.option(GANTT_TASKS),
        keyExpr = _this$_gantt$option.keyExpr,
        parentIdExpr = _this$_gantt$option.parentIdExpr;

    this._treeList = this._gantt._createComponent(this._$treeList, _tree_list.default, {
      dataSource: this._gantt._tasksRaw,
      keyExpr: keyExpr,
      parentIdExpr: parentIdExpr,
      columns: this.getColumns(),
      columnResizingMode: 'nextColumn',
      height: this._getHeight(),
      width: this._gantt.option('taskListWidth'),
      selection: {
        mode: _uiGantt.GanttHelper.getSelectionMode(this._gantt.option('allowSelection'))
      },
      selectedRowKeys: _uiGantt.GanttHelper.getArrayFromOneElement(this._gantt.option('selectedRowKey')),
      sorting: this._gantt.option('sorting'),
      filterRow: this._gantt.option('filterRow'),
      headerFilter: this._gantt.option('headerFilter'),
      scrolling: {
        showScrollbar: 'onHover',
        mode: 'virtual'
      },
      allowColumnResizing: true,
      autoExpandAll: true,
      showRowLines: this._gantt.option('showRowLines'),
      rootValue: this._gantt.option('rootValue'),
      onContentReady: function onContentReady(e) {
        _this._onContentReady(e);
      },
      onSelectionChanged: function onSelectionChanged(e) {
        _this._onSelectionChanged(e);
      },
      onRowCollapsed: function onRowCollapsed(e) {
        _this._onRowCollapsed(e);
      },
      onRowExpanded: function onRowExpanded(e) {
        _this._onRowExpanded(e);
      },
      onRowPrepared: function onRowPrepared(e) {
        _this._onRowPrepared(e);
      },
      onContextMenuPreparing: function onContextMenuPreparing(e) {
        _this._onContextMenuPreparing(e);
      },
      onRowClick: function onRowClick(e) {
        _this.onRowClick(e);
      },
      onRowDblClick: function onRowDblClick(e) {
        _this.onRowDblClick(e);
      }
    });
    return this._treeList;
  };

  _proto.onAfterTreeListCreate = function onAfterTreeListCreate() {
    if (this._postponedGanttInitRequired) {
      this._initGanttOnContentReady({
        component: this._treeList
      });

      delete this._postponedGanttInitRequired;
    }
  };

  _proto._onContentReady = function _onContentReady(e) {
    var hasTreeList = !!this._treeList;

    if (hasTreeList) {
      this._initGanttOnContentReady(e);
    } else {
      this._postponedGanttInitRequired = true;
    }
  };

  _proto._initGanttOnContentReady = function _initGanttOnContentReady(e) {
    if (e.component.getDataSource()) {
      this._gantt._initGanttView();

      this._initScrollSync(e.component);
    }

    this._gantt._sortAndFilter();

    this._gantt._sizeHelper.updateGanttRowHeights();
  };

  _proto._onSelectionChanged = function _onSelectionChanged(e) {
    var selectedRowKey = e.currentSelectedRowKeys[0];

    this._gantt._setGanttViewOption('selectedRowKey', selectedRowKey);

    this._gantt._setOptionWithoutOptionChange('selectedRowKey', selectedRowKey);

    this._gantt._actionsManager.raiseSelectionChangedAction(selectedRowKey);
  };

  _proto._onRowCollapsed = function _onRowCollapsed(e) {
    this._gantt._onTreeListRowExpandChanged(e, false);
  };

  _proto._onRowExpanded = function _onRowExpanded(e) {
    this._gantt._onTreeListRowExpandChanged(e, true);
  };

  _proto._onRowPrepared = function _onRowPrepared(e) {
    if (e.rowType === 'data' && e.node.children.length > 0) {
      (0, _renderer.default)(e.rowElement).addClass(GANTT_COLLAPSABLE_ROW);
    }
  };

  _proto._onContextMenuPreparing = function _onContextMenuPreparing(e) {
    var _e$row, _e$row2;

    if (e.target === 'header') {
      return;
    }

    if (((_e$row = e.row) === null || _e$row === void 0 ? void 0 : _e$row.rowType) === 'data') {
      this.setOption('selectedRowKeys', [e.row.data[this._gantt.option('tasks.keyExpr')]]);
    }

    e.items = [];
    var info = {
      cancel: false,
      event: e.event,
      type: 'task',
      key: (_e$row2 = e.row) === null || _e$row2 === void 0 ? void 0 : _e$row2.key,
      position: {
        x: e.event.pageX,
        y: e.event.pageY
      }
    };

    this._gantt._showPopupMenu(info);
  };

  _proto._getHeight = function _getHeight() {
    if ((0, _size.getHeight)(this._$treeList)) {
      return (0, _size.getHeight)(this._$treeList);
    }

    this._gantt._hasHeight = (0, _type.isDefined)(this._gantt.option('height')) && this._gantt.option('height') !== '';
    return this._gantt._hasHeight ? '100%' : '';
  };

  _proto._initScrollSync = function _initScrollSync(treeList) {
    var _this2 = this;

    var treeListScrollable = treeList.getScrollable();

    if (treeListScrollable) {
      treeListScrollable.off('scroll');
      treeListScrollable.on('scroll', function (e) {
        _this2._onScroll(e);
      });
    }
  };

  _proto._onScroll = function _onScroll(treeListScrollView) {
    var ganttViewTaskAreaContainer = this._gantt._ganttView.getTaskAreaContainer();

    if (ganttViewTaskAreaContainer.scrollTop !== treeListScrollView.component.scrollTop()) {
      ganttViewTaskAreaContainer.scrollTop = treeListScrollView.component.scrollTop();
    }
  };

  _proto._correctRowsViewRowHeight = function _correctRowsViewRowHeight(height) {
    var view = this._treeList._views && this._treeList._views['rowsView'];

    if ((view === null || view === void 0 ? void 0 : view._rowHeight) !== height) {
      view._rowHeight = height;
    }
  };

  _proto._skipUpdateTreeListDataSource = function _skipUpdateTreeListDataSource() {
    return this._gantt.option('validation.autoUpdateParentTasks');
  };

  _proto.selectRows = function selectRows(keys) {
    this.setOption('selectedRowKeys', keys);
  };

  _proto.scrollBy = function scrollBy(scrollTop) {
    var treeListScrollable = this._treeList.getScrollable();

    if (treeListScrollable) {
      var diff = scrollTop - treeListScrollable.scrollTop();

      if (diff !== 0) {
        treeListScrollable.scrollBy({
          left: 0,
          top: diff
        });
      }
    }
  };

  _proto.updateDataSource = function updateDataSource(data) {
    var forceUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var forceCustomData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var expandedRowKeys = this.getOption('expandedRowKeys');

    if (!this._skipUpdateTreeListDataSource() || forceUpdate) {
      this.setOption('dataSource', data);
    } else if (forceCustomData) {
      var _data = this._treeList.option('dataSource');

      this._gantt._onParentTasksRecalculated(_data);
    }

    this.setOption('expandedRowKeys', expandedRowKeys);
  };

  _proto.onRowClick = function onRowClick(e) {
    this._gantt._actionsManager.raiseTaskClickAction(e.key, e.event);
  };

  _proto.onRowDblClick = function onRowDblClick(e) {
    if (this._gantt._actionsManager.raiseTaskDblClickAction(e.key, e.event)) {
      this._gantt._ganttView._ganttViewCore.showTaskEditDialog();
    }
  };

  _proto.getOffsetHeight = function getOffsetHeight() {
    return this._gantt._treeList._$element.get(0).offsetHeight;
  };

  _proto.getRowHeight = function getRowHeight() {
    var $row = this._treeList._$element.find('.dx-data-row');

    var height = $row.length ? (0, _position.getBoundingRect)($row.last().get(0)).height : GANTT_DEFAULT_ROW_HEIGHT;

    if (!height) {
      height = GANTT_DEFAULT_ROW_HEIGHT;
    }

    this._correctRowsViewRowHeight(height);

    return height;
  };

  _proto.getHeaderHeight = function getHeaderHeight() {
    return (0, _position.getBoundingRect)(this._treeList._$element.find('.dx-treelist-headers').get(0)).height;
  };

  _proto.getColumns = function getColumns() {
    var columns = this._gantt.option('columns');

    if (columns) {
      for (var i = 0; i < columns.length; i++) {
        var column = columns[i];

        var isKeyColumn = column.dataField === this._gantt.option("".concat(GANTT_TASKS, ".keyExpr")) || column.dataField === this._gantt.option("".concat(GANTT_TASKS, ".parentIdExpr"));

        if (isKeyColumn && !column.dataType) {
          column.dataType = 'object';
        }
      }
    }

    return columns;
  };

  _proto.getSievedItems = function getSievedItems() {
    var rootNode = this._treeList.getRootNode();

    if (!rootNode) {
      return undefined;
    }

    var resultArray = [];

    _uiGantt.GanttHelper.convertTreeToList(rootNode, resultArray);

    var getters = _uiGantt.GanttHelper.compileGettersByOption(this._gantt.option(GANTT_TASKS));

    var validatedData = this._gantt._validateSourceData(GANTT_TASKS, resultArray);

    var mappedData = validatedData.map(_uiGantt.GanttHelper.prepareMapHandler(getters));
    return mappedData;
  };

  _proto.setOption = function setOption(optionName, value) {
    this._treeList && this._treeList.option(optionName, value);
  };

  _proto.getOption = function getOption(optionName) {
    return this._treeList.option(optionName);
  };

  _proto.onTaskInserted = function onTaskInserted(insertedId, parentId) {
    if ((0, _type.isDefined)(parentId)) {
      var expandedRowKeys = this.getOption('expandedRowKeys');

      if (expandedRowKeys.indexOf(parentId) === -1) {
        expandedRowKeys.push(parentId);
        this.setOption('expandedRowKeys', expandedRowKeys);
      }
    }

    this.selectRows(_uiGantt.GanttHelper.getArrayFromOneElement(insertedId));
    this.setOption('focusedRowKey', insertedId);
  };

  _proto.getDataSource = function getDataSource() {
    var _this$_treeList;

    return (_this$_treeList = this._treeList) === null || _this$_treeList === void 0 ? void 0 : _this$_treeList.getDataSource();
  };

  return GanttTreeList;
}();

exports.GanttTreeList = GanttTreeList;