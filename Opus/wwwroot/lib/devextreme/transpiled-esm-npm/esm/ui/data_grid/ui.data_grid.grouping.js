import { getHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import gridCore from './ui.data_grid.core';
import { GroupingHelper as ExpandedGroupingHelper } from './ui.data_grid.grouping.expanded';
import { GroupingHelper as CollapsedGroupingHelper } from './ui.data_grid.grouping.collapsed';
import messageLocalization from '../../localization/message';
import dataSourceAdapter from './ui.data_grid.data_source_adapter';
import { isDefined, isString } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import devices from '../../core/devices';
import { when, Deferred } from '../../core/utils/deferred';
import { registerKeyboardAction } from '../grid_core/ui.grid_core.accessibility';
import { setTabIndex, restoreFocus } from '../shared/accessibility';
var DATAGRID_GROUP_PANEL_CLASS = 'dx-datagrid-group-panel';
var DATAGRID_GROUP_PANEL_MESSAGE_CLASS = 'dx-group-panel-message';
var DATAGRID_GROUP_PANEL_ITEM_CLASS = 'dx-group-panel-item';
var DATAGRID_GROUP_PANEL_LABEL_CLASS = 'dx-toolbar-label';
var DATAGRID_EXPAND_CLASS = 'dx-datagrid-expand';
var DATAGRID_GROUP_ROW_CLASS = 'dx-group-row';
var HEADER_FILTER_CLASS_SELECTOR = '.dx-header-filter';

var GroupingDataSourceAdapterExtender = function () {
  return {
    init: function init() {
      this.callBase.apply(this, arguments);

      this._initGroupingHelper();
    },
    _initGroupingHelper: function _initGroupingHelper(options) {
      var grouping = this._grouping;
      var isAutoExpandAll = this.option('grouping.autoExpandAll');
      var isFocusedRowEnabled = this.option('focusedRowEnabled');
      var remoteOperations = options ? options.remoteOperations : this.remoteOperations();
      var isODataRemoteOperations = remoteOperations.filtering && remoteOperations.sorting && remoteOperations.paging;

      if (isODataRemoteOperations && !remoteOperations.grouping && (isAutoExpandAll || !isFocusedRowEnabled)) {
        if (!grouping || grouping instanceof CollapsedGroupingHelper) {
          this._grouping = new ExpandedGroupingHelper(this);
        }
      } else {
        if (!grouping || grouping instanceof ExpandedGroupingHelper) {
          this._grouping = new CollapsedGroupingHelper(this);
        }
      }
    },
    totalItemsCount: function totalItemsCount() {
      var that = this;
      var totalCount = that.callBase();
      return totalCount > 0 && that._dataSource.group() && that._dataSource.requireTotalCount() ? totalCount + that._grouping.totalCountCorrection() : totalCount;
    },
    itemsCount: function itemsCount() {
      return this._dataSource.group() ? this._grouping.itemsCount() || 0 : this.callBase.apply(this, arguments);
    },
    allowCollapseAll: function allowCollapseAll() {
      return this._grouping.allowCollapseAll();
    },
    isGroupItemCountable: function isGroupItemCountable(item) {
      return this._grouping.isGroupItemCountable(item);
    },
    isRowExpanded: function isRowExpanded(key) {
      var groupInfo = this._grouping.findGroupInfo(key);

      return groupInfo ? groupInfo.isExpanded : !this._grouping.allowCollapseAll();
    },
    collapseAll: function collapseAll(groupIndex) {
      return this._collapseExpandAll(groupIndex, false);
    },
    expandAll: function expandAll(groupIndex) {
      return this._collapseExpandAll(groupIndex, true);
    },
    _collapseExpandAll: function _collapseExpandAll(groupIndex, isExpand) {
      var that = this;
      var dataSource = that._dataSource;
      var group = dataSource.group();
      var groups = gridCore.normalizeSortingInfo(group || []);

      if (groups.length) {
        for (var i = 0; i < groups.length; i++) {
          if (groupIndex === undefined || groupIndex === i) {
            groups[i].isExpanded = isExpand;
          } else if (group && group[i]) {
            groups[i].isExpanded = group[i].isExpanded;
          }
        }

        dataSource.group(groups);

        that._grouping.foreachGroups(function (groupInfo, parents) {
          if (groupIndex === undefined || groupIndex === parents.length - 1) {
            groupInfo.isExpanded = isExpand;
          }
        }, false, true);

        that.resetPagesCache();
      }

      return true;
    },
    refresh: function refresh() {
      this.callBase.apply(this, arguments);
      return this._grouping.refresh.apply(this._grouping, arguments);
    },
    changeRowExpand: function changeRowExpand(path) {
      var that = this;
      var dataSource = that._dataSource;

      if (dataSource.group()) {
        dataSource.beginLoading();

        if (that._lastLoadOptions) {
          that._lastLoadOptions.groupExpand = true;
        }

        return that._changeRowExpandCore(path).always(function () {
          dataSource.endLoading();
        });
      }
    },
    _changeRowExpandCore: function _changeRowExpandCore(path) {
      return this._grouping.changeRowExpand(path);
    },
    _hasGroupLevelsExpandState: function _hasGroupLevelsExpandState(group, isExpanded) {
      if (group && Array.isArray(group)) {
        for (var i = 0; i < group.length; i++) {
          if (group[i].isExpanded === isExpanded) {
            return true;
          }
        }
      }
    },
    _customizeRemoteOperations: function _customizeRemoteOperations(options, operationTypes) {
      var remoteOperations = options.remoteOperations;

      if (options.storeLoadOptions.group) {
        if (remoteOperations.grouping && !options.isCustomLoading) {
          if (!remoteOperations.groupPaging || this._hasGroupLevelsExpandState(options.storeLoadOptions.group, true)) {
            remoteOperations.paging = false;
          }
        }

        if (!remoteOperations.grouping && (!remoteOperations.sorting || !remoteOperations.filtering || options.isCustomLoading || this._hasGroupLevelsExpandState(options.storeLoadOptions.group, false))) {
          remoteOperations.paging = false;
        }
      } else if (!options.isCustomLoading && remoteOperations.paging && operationTypes.grouping) {
        this.resetCache();
      }

      this.callBase.apply(this, arguments);
    },
    _handleDataLoading: function _handleDataLoading(options) {
      this.callBase(options);

      this._initGroupingHelper(options);

      return this._grouping.handleDataLoading(options);
    },
    _handleDataLoaded: function _handleDataLoaded(options) {
      return this._grouping.handleDataLoaded(options, this.callBase.bind(this));
    },
    _handleDataLoadedCore: function _handleDataLoadedCore(options) {
      return this._grouping.handleDataLoadedCore(options, this.callBase.bind(this));
    }
  };
}();

dataSourceAdapter.extend(GroupingDataSourceAdapterExtender);

var GroupingDataControllerExtender = function () {
  return {
    init: function init() {
      var that = this;
      that.callBase();
      that.createAction('onRowExpanding');
      that.createAction('onRowExpanded');
      that.createAction('onRowCollapsing');
      that.createAction('onRowCollapsed');
    },
    _beforeProcessItems: function _beforeProcessItems(items) {
      var groupColumns = this._columnsController.getGroupColumns();

      items = this.callBase(items);

      if (items.length && groupColumns.length) {
        items = this._processGroupItems(items, groupColumns.length);
      }

      return items;
    },
    _processItem: function _processItem(item, options) {
      if (isDefined(item.groupIndex) && isString(item.rowType) && item.rowType.indexOf('group') === 0) {
        item = this._processGroupItem(item, options);
        options.dataIndex = 0;
      } else {
        item = this.callBase.apply(this, arguments);
      }

      return item;
    },
    _processGroupItem: function _processGroupItem(item) {
      return item;
    },
    _processGroupItems: function _processGroupItems(items, groupsCount, options) {
      var that = this;

      var groupedColumns = that._columnsController.getGroupColumns();

      var column = groupedColumns[groupedColumns.length - groupsCount];

      if (!options) {
        var scrollingMode = that.option('scrolling.mode');
        options = {
          collectContinuationItems: scrollingMode !== 'virtual' && scrollingMode !== 'infinite',
          resultItems: [],
          path: [],
          values: []
        };
      }

      var resultItems = options.resultItems;

      if (options.data) {
        if (options.collectContinuationItems || !options.data.isContinuation) {
          resultItems.push({
            rowType: 'group',
            data: options.data,
            groupIndex: options.path.length - 1,
            isExpanded: !!options.data.items,
            key: options.path.slice(0),
            values: options.values.slice(0)
          });
        }
      }

      if (items) {
        if (groupsCount === 0) {
          resultItems.push.apply(resultItems, items);
        } else {
          for (var i = 0; i < items.length; i++) {
            var item = items[i];

            if (item && 'items' in item) {
              options.data = item;
              options.path.push(item.key);
              options.values.push(column && column.deserializeValue && !column.calculateDisplayValue ? column.deserializeValue(item.key) : item.key);

              that._processGroupItems(item.items, groupsCount - 1, options);

              options.data = undefined;
              options.path.pop();
              options.values.pop();
            } else {
              resultItems.push(item);
            }
          }
        }
      }

      return resultItems;
    },
    publicMethods: function publicMethods() {
      return this.callBase().concat(['collapseAll', 'expandAll', 'isRowExpanded', 'expandRow', 'collapseRow']);
    },
    collapseAll: function collapseAll(groupIndex) {
      var dataSource = this._dataSource;

      if (dataSource && dataSource.collapseAll(groupIndex)) {
        dataSource.pageIndex(0);
        dataSource.reload();
      }
    },
    expandAll: function expandAll(groupIndex) {
      var dataSource = this._dataSource;

      if (dataSource && dataSource.expandAll(groupIndex)) {
        dataSource.pageIndex(0);
        dataSource.reload();
      }
    },
    changeRowExpand: function changeRowExpand(key) {
      var that = this;
      var expanded = that.isRowExpanded(key);
      var args = {
        key: key,
        expanded: expanded
      };
      that.executeAction(expanded ? 'onRowCollapsing' : 'onRowExpanding', args);

      if (!args.cancel) {
        return when(that._changeRowExpandCore(key)).done(function () {
          args.expanded = !expanded;
          that.executeAction(expanded ? 'onRowCollapsed' : 'onRowExpanded', args);
        });
      }

      return new Deferred().resolve();
    },
    _changeRowExpandCore: function _changeRowExpandCore(key) {
      var that = this;
      var dataSource = this._dataSource;
      var d = new Deferred();

      if (!dataSource) {
        d.resolve();
      } else {
        when(dataSource.changeRowExpand(key)).done(function () {
          that.load().done(d.resolve).fail(d.reject);
        }).fail(d.reject);
      }

      return d;
    },
    isRowExpanded: function isRowExpanded(key) {
      var dataSource = this._dataSource;
      return dataSource && dataSource.isRowExpanded(key);
    },
    expandRow: function expandRow(key) {
      if (!this.isRowExpanded(key)) {
        return this.changeRowExpand(key);
      }

      return new Deferred().resolve();
    },
    collapseRow: function collapseRow(key) {
      if (this.isRowExpanded(key)) {
        return this.changeRowExpand(key);
      }

      return new Deferred().resolve();
    },
    optionChanged: function optionChanged(args) {
      if (args.name === 'grouping'
      /* autoExpandAll */
      ) {
        args.name = 'dataSource';
      }

      this.callBase(args);
    }
  };
}();

var onGroupingMenuItemClick = function onGroupingMenuItemClick(column, params) {
  var columnsController = this._columnsController;

  switch (params.itemData.value) {
    case 'group':
      {
        var groups = columnsController._dataSource.group() || [];
        columnsController.columnOption(column.dataField, 'groupIndex', groups.length);
        break;
      }

    case 'ungroup':
      columnsController.columnOption(column.dataField, 'groupIndex', -1);
      break;

    case 'ungroupAll':
      this.component.clearGrouping();
      break;
  }
};

export var GroupingHeaderPanelExtender = function () {
  return {
    _getToolbarItems: function _getToolbarItems() {
      var items = this.callBase();
      return this._appendGroupingItem(items);
    },
    _appendGroupingItem: function _appendGroupingItem(items) {
      if (this._isGroupPanelVisible()) {
        var isRendered = false;
        var toolbarItem = {
          template: () => {
            var $groupPanel = $('<div>').addClass(DATAGRID_GROUP_PANEL_CLASS);

            this._updateGroupPanelContent($groupPanel);

            registerKeyboardAction('groupPanel', this, $groupPanel, undefined, this._handleActionKeyDown.bind(this));
            return $groupPanel;
          },
          name: 'groupPanel',
          onItemRendered: () => {
            isRendered && this.renderCompleted.fire();
            isRendered = true;
          },
          location: 'before',
          locateInMenu: 'never',
          sortIndex: 1
        };
        items.push(toolbarItem);
      }

      return items;
    },
    _handleActionKeyDown: function _handleActionKeyDown(args) {
      var event = args.event;
      var $target = $(event.target);
      var groupColumnIndex = $target.closest(".".concat(DATAGRID_GROUP_PANEL_ITEM_CLASS)).index();

      var column = this._columnsController.getGroupColumns()[groupColumnIndex];

      var columnIndex = column && column.index;

      if ($target.is(HEADER_FILTER_CLASS_SELECTOR)) {
        this.getController('headerFilter').showHeaderFilterMenu(columnIndex, true);
      } else {
        this._processGroupItemAction(columnIndex);
      }

      event.preventDefault();
    },
    _isGroupPanelVisible: function _isGroupPanelVisible() {
      var groupPanelOptions = this.option('groupPanel');
      var isVisible;

      if (groupPanelOptions) {
        isVisible = groupPanelOptions.visible;

        if (isVisible === 'auto') {
          isVisible = devices.current().deviceType === 'desktop' ? true : false;
        }
      }

      return isVisible;
    },
    _renderGroupPanelItems: function _renderGroupPanelItems($groupPanel, groupColumns) {
      var that = this;
      $groupPanel.empty();
      each(groupColumns, function (index, groupColumn) {
        that._createGroupPanelItem($groupPanel, groupColumn);
      });
      restoreFocus(this);
    },
    _createGroupPanelItem: function _createGroupPanelItem($rootElement, groupColumn) {
      var $groupPanelItem = $('<div>').addClass(groupColumn.cssClass).addClass(DATAGRID_GROUP_PANEL_ITEM_CLASS).data('columnData', groupColumn).appendTo($rootElement).text(groupColumn.caption);
      setTabIndex(this, $groupPanelItem);
      return $groupPanelItem;
    },
    _columnOptionChanged: function _columnOptionChanged(e) {
      if (!this._requireReady && !gridCore.checkChanges(e.optionNames, ['width', 'visibleWidth'])) {
        var $toolbarElement = this.element();
        var $groupPanel = $toolbarElement && $toolbarElement.find('.' + DATAGRID_GROUP_PANEL_CLASS);

        if ($groupPanel && $groupPanel.length) {
          this._updateGroupPanelContent($groupPanel);

          this.renderCompleted.fire();
        }
      }

      this.callBase();
    },
    _updateGroupPanelContent: function _updateGroupPanelContent($groupPanel) {
      var that = this;
      var groupColumns = that.getController('columns').getGroupColumns();
      var groupPanelOptions = that.option('groupPanel');

      that._renderGroupPanelItems($groupPanel, groupColumns);

      if (groupPanelOptions.allowColumnDragging && !groupColumns.length) {
        $('<div>').addClass(DATAGRID_GROUP_PANEL_MESSAGE_CLASS).text(groupPanelOptions.emptyPanelText).appendTo($groupPanel);
        $groupPanel.closest('.' + DATAGRID_GROUP_PANEL_LABEL_CLASS).css('maxWidth', 'none');
        that.updateToolbarDimensions();
      }
    },
    allowDragging: function allowDragging(column) {
      var groupPanelOptions = this.option('groupPanel');
      return this._isGroupPanelVisible() && groupPanelOptions.allowColumnDragging && column && column.allowGrouping;
    },
    getColumnElements: function getColumnElements() {
      var $element = this.element();
      return $element && $element.find('.' + DATAGRID_GROUP_PANEL_ITEM_CLASS);
    },
    getColumns: function getColumns() {
      return this.getController('columns').getGroupColumns();
    },
    getBoundingRect: function getBoundingRect() {
      var that = this;
      var $element = that.element();

      if ($element && $element.find('.' + DATAGRID_GROUP_PANEL_CLASS).length) {
        var offset = $element.offset();
        return {
          top: offset.top,
          bottom: offset.top + getHeight($element)
        };
      }

      return null;
    },
    getName: function getName() {
      return 'group';
    },
    getContextMenuItems: function getContextMenuItems(options) {
      var that = this;
      var contextMenuEnabled = that.option('grouping.contextMenuEnabled');
      var $groupedColumnElement = $(options.targetElement).closest('.' + DATAGRID_GROUP_PANEL_ITEM_CLASS);
      var items;

      if ($groupedColumnElement.length) {
        options.column = $groupedColumnElement.data('columnData');
      }

      if (contextMenuEnabled && options.column) {
        var column = options.column;
        var isGroupingAllowed = isDefined(column.allowGrouping) ? column.allowGrouping : true;

        if (isGroupingAllowed) {
          var isColumnGrouped = isDefined(column.groupIndex) && column.groupIndex > -1;
          var groupingTexts = that.option('grouping.texts');
          var onItemClick = onGroupingMenuItemClick.bind(that, column);
          items = [{
            text: groupingTexts.ungroup,
            value: 'ungroup',
            disabled: !isColumnGrouped,
            onItemClick: onItemClick
          }, {
            text: groupingTexts.ungroupAll,
            value: 'ungroupAll',
            onItemClick: onItemClick
          }];
        }
      }

      return items;
    },
    isVisible: function isVisible() {
      return this.callBase() || this._isGroupPanelVisible();
    },
    optionChanged: function optionChanged(args) {
      if (args.name === 'groupPanel') {
        this._invalidate();

        args.handled = true;
      } else {
        this.callBase(args);
      }
    }
  };
}();

var GroupingRowsViewExtender = function () {
  return {
    getContextMenuItems: function getContextMenuItems(options) {
      var that = this;
      var contextMenuEnabled = that.option('grouping.contextMenuEnabled');
      var items;

      if (contextMenuEnabled && options.row && options.row.rowType === 'group') {
        var columnsController = that._columnsController;
        var column = columnsController.columnOption('groupIndex:' + options.row.groupIndex);

        if (column && column.allowGrouping) {
          var groupingTexts = that.option('grouping.texts');
          var onItemClick = onGroupingMenuItemClick.bind(that, column);
          items = [];
          items.push({
            text: groupingTexts.ungroup,
            value: 'ungroup',
            onItemClick: onItemClick
          }, {
            text: groupingTexts.ungroupAll,
            value: 'ungroupAll',
            onItemClick: onItemClick
          });
        }
      }

      return items;
    },
    _rowClick: function _rowClick(e) {
      var that = this;
      var expandMode = that.option('grouping.expandMode');
      var scrollingMode = that.option('scrolling.mode');
      var isGroupRowStateChanged = scrollingMode !== 'infinite' && expandMode === 'rowClick' && $(e.event.target).closest('.' + DATAGRID_GROUP_ROW_CLASS).length;
      var isExpandButtonClicked = $(e.event.target).closest('.' + DATAGRID_EXPAND_CLASS).length;

      if (isGroupRowStateChanged || isExpandButtonClicked) {
        that._changeGroupRowState(e);
      }

      that.callBase(e);
    },
    _changeGroupRowState: function _changeGroupRowState(e) {
      var dataController = this.getController('data');
      var row = dataController.items()[e.rowIndex];

      var allowCollapsing = this._columnsController.columnOption('groupIndex:' + row.groupIndex, 'allowCollapsing');

      if (row.rowType === 'data' || row.rowType === 'group' && allowCollapsing !== false) {
        dataController.changeRowExpand(row.key, true);
        e.event.preventDefault();
        e.handled = true;
      }
    }
  };
}();

var columnHeadersViewExtender = function () {
  return {
    getContextMenuItems: function getContextMenuItems(options) {
      var that = this;
      var contextMenuEnabled = that.option('grouping.contextMenuEnabled');
      var items = that.callBase(options);

      if (contextMenuEnabled && options.row && (options.row.rowType === 'header' || options.row.rowType === 'detailAdaptive')) {
        var column = options.column;

        if (!column.command && (!isDefined(column.allowGrouping) || column.allowGrouping)) {
          var groupingTexts = that.option('grouping.texts');
          var isColumnGrouped = isDefined(column.groupIndex) && column.groupIndex > -1;
          var onItemClick = onGroupingMenuItemClick.bind(that, column);
          items = items || [];
          items.push({
            text: groupingTexts.groupByThisColumn,
            value: 'group',
            beginGroup: true,
            disabled: isColumnGrouped,
            onItemClick: onItemClick
          });

          if (column.showWhenGrouped) {
            items.push({
              text: groupingTexts.ungroup,
              value: 'ungroup',
              disabled: !isColumnGrouped,
              onItemClick: onItemClick
            });
          }

          items.push({
            text: groupingTexts.ungroupAll,
            value: 'ungroupAll',
            onItemClick: onItemClick
          });
        }
      }

      return items;
    }
  };
}();

gridCore.registerModule('grouping', {
  defaultOptions: function defaultOptions() {
    return {
      grouping: {
        autoExpandAll: true,
        allowCollapsing: true,
        contextMenuEnabled: false,
        expandMode: 'buttonClick',
        texts: {
          groupContinuesMessage: messageLocalization.format('dxDataGrid-groupContinuesMessage'),
          groupContinuedMessage: messageLocalization.format('dxDataGrid-groupContinuedMessage'),
          groupByThisColumn: messageLocalization.format('dxDataGrid-groupHeaderText'),
          ungroup: messageLocalization.format('dxDataGrid-ungroupHeaderText'),
          ungroupAll: messageLocalization.format('dxDataGrid-ungroupAllText')
        }
      },
      groupPanel: {
        visible: false,
        emptyPanelText: messageLocalization.format('dxDataGrid-groupPanelEmptyText'),
        allowColumnDragging: true
      }
    };
  },
  extenders: {
    controllers: {
      data: GroupingDataControllerExtender,
      columns: {
        _getExpandColumnOptions: function _getExpandColumnOptions() {
          var options = this.callBase.apply(this, arguments);
          options.cellTemplate = gridCore.getExpandCellTemplate();
          return options;
        }
      },
      editing: {
        _isProcessedItem: function _isProcessedItem(item) {
          return isDefined(item.groupIndex) && isString(item.rowType) && item.rowType.indexOf('group') === 0;
        }
      }
    },
    views: {
      headerPanel: GroupingHeaderPanelExtender,
      rowsView: GroupingRowsViewExtender,
      columnHeadersView: columnHeadersViewExtender
    }
  }
});