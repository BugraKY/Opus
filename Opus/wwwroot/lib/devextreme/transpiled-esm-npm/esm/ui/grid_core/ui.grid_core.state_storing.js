import { getKeyHash, equalByValue } from '../../core/utils/common';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { StateStoringController } from './ui.grid_core.state_storing_core';
import { Deferred } from '../../core/utils/deferred';

var getDataState = that => {
  var pagerView = that.getView('pagerView');
  var dataController = that.getController('data');
  var state = {
    allowedPageSizes: pagerView ? pagerView.getPageSizes() : undefined,
    filterPanel: {
      filterEnabled: that.option('filterPanel.filterEnabled')
    },
    filterValue: that.option('filterValue'),
    focusedRowKey: that.option('focusedRowEnabled') ? that.option('focusedRowKey') : undefined
  };
  return extend(state, dataController.getUserState());
}; // TODO move processLoadState to target modules (data, columns, pagerView)


var processLoadState = that => {
  var columnsController = that.getController('columns');
  var selectionController = that.getController('selection');
  var exportController = that.getController('export');
  var dataController = that.getController('data');

  if (columnsController) {
    columnsController.columnsChanged.add(function () {
      that.updateState({
        columns: columnsController.getUserState()
      });
    });
  }

  if (selectionController) {
    selectionController.selectionChanged.add(function (e) {
      that.updateState({
        selectedRowKeys: e.selectedRowKeys,
        selectionFilter: e.selectionFilter
      });
    });
  }

  if (dataController) {
    that._initialPageSize = that.option('paging.pageSize');
    that._initialFilterValue = that.option('filterValue');
    dataController.changed.add(function () {
      var state = getDataState(that);
      that.updateState(state);
    });
  }

  if (exportController) {
    exportController.selectionOnlyChanged.add(function () {
      that.updateState({
        exportSelectionOnly: exportController.selectionOnly()
      });
    });
  }
};

var DEFAULT_FILTER_VALUE = null;

var getFilterValue = (that, state) => {
  var filterSyncController = that.getController('filterSync');
  var columnsController = that.getController('columns');
  var hasFilterState = state.columns || state.filterValue !== undefined;

  if (filterSyncController) {
    if (hasFilterState) {
      return state.filterValue || filterSyncController.getFilterValueFromColumns(state.columns);
    } else {
      return that._initialFilterValue || filterSyncController.getFilterValueFromColumns(columnsController.getColumns());
    }
  }

  return DEFAULT_FILTER_VALUE;
};

export var stateStoringModule = {
  defaultOptions: function defaultOptions() {
    return {
      stateStoring: {
        enabled: false,
        storageKey: null,
        type: 'localStorage',
        customLoad: null,
        customSave: null,
        savingTimeout: 2000
      }
    };
  },
  controllers: {
    stateStoring: StateStoringController
  },
  extenders: {
    views: {
      rowsView: {
        init: function init() {
          var that = this;
          var dataController = that.getController('data');
          that.callBase();
          dataController.stateLoaded.add(function () {
            if (dataController.isLoaded() && !dataController.getDataSource()) {
              that.setLoading(false);
              that.renderNoDataText();
              var columnHeadersView = that.component.getView('columnHeadersView');
              columnHeadersView && columnHeadersView.render();

              that.component._fireContentReadyAction();
            }
          });
        }
      }
    },
    controllers: {
      stateStoring: {
        init: function init() {
          this.callBase.apply(this, arguments);
          processLoadState(this);
        },
        isLoading: function isLoading() {
          return this.callBase() || this.getController('data').isStateLoading();
        },
        state: function state(_state) {
          var result = this.callBase.apply(this, arguments);

          if (_state !== undefined) {
            this.applyState(extend({}, _state));
          }

          return result;
        },
        updateState: function updateState(state) {
          if (this.isEnabled()) {
            var oldState = this.state();
            var newState = extend({}, oldState, state);
            var oldStateHash = getKeyHash(oldState);
            var newStateHash = getKeyHash(newState);

            if (!equalByValue(oldStateHash, newStateHash)) {
              extend(this._state, state);
              this.save();
            }
          } else {
            extend(this._state, state);
          }
        },
        applyState: function applyState(state) {
          var that = this;
          var allowedPageSizes = state.allowedPageSizes;
          var searchText = state.searchText;
          var selectedRowKeys = state.selectedRowKeys;
          var selectionFilter = state.selectionFilter;
          var exportController = that.getController('export');
          var columnsController = that.getController('columns');
          var dataController = that.getController('data');
          var scrollingMode = that.option('scrolling.mode');
          var isVirtualScrollingMode = scrollingMode === 'virtual' || scrollingMode === 'infinite';
          var showPageSizeSelector = that.option('pager.visible') === true && that.option('pager.showPageSizeSelector');
          that.component.beginUpdate();

          if (columnsController) {
            columnsController.setUserState(state.columns);
          }

          if (exportController) {
            exportController.selectionOnly(state.exportSelectionOnly);
          }

          if (!that.option('selection.deferred')) {
            that.option('selectedRowKeys', selectedRowKeys || []);
          }

          that.option('selectionFilter', selectionFilter);

          if (allowedPageSizes && that.option('pager.allowedPageSizes') === 'auto') {
            that.option('pager').allowedPageSizes = allowedPageSizes;
          }

          if (that.option('focusedRowEnabled')) {
            that.option('focusedRowIndex', -1);
            that.option('focusedRowKey', state.focusedRowKey || null);
          }

          that.component.endUpdate();
          that.option('searchPanel.text', searchText || '');
          that.option('filterValue', getFilterValue(that, state));
          that.option('filterPanel.filterEnabled', state.filterPanel ? state.filterPanel.filterEnabled : true);
          that.option('paging.pageIndex', state.pageIndex || 0);
          that.option('paging.pageSize', (!isVirtualScrollingMode || showPageSizeSelector) && isDefined(state.pageSize) ? state.pageSize : that._initialPageSize);
          dataController && dataController.reset();
        }
      },
      columns: {
        getVisibleColumns: function getVisibleColumns() {
          var visibleColumns = this.callBase.apply(this, arguments);
          var stateStoringController = this.getController('stateStoring');
          return stateStoringController.isEnabled() && !stateStoringController.isLoaded() ? [] : visibleColumns;
        }
      },
      data: {
        callbackNames: function callbackNames() {
          return this.callBase().concat(['stateLoaded']);
        },
        _refreshDataSource: function _refreshDataSource() {
          var callBase = this.callBase;
          var stateStoringController = this.getController('stateStoring');

          if (stateStoringController.isEnabled() && !stateStoringController.isLoaded()) {
            clearTimeout(this._restoreStateTimeoutID);
            var deferred = new Deferred();
            this._restoreStateTimeoutID = setTimeout(() => {
              stateStoringController.load().always(() => {
                this._restoreStateTimeoutID = null;
              }).done(() => {
                callBase.call(this);
                this.stateLoaded.fire();
                deferred.resolve();
              }).fail(error => {
                this.stateLoaded.fire();

                this._handleLoadError(error || 'Unknown error');

                deferred.reject();
              });
            });
            return deferred.promise();
          } else if (!this.isStateLoading()) {
            callBase.call(this);
          }
        },
        isLoading: function isLoading() {
          var that = this;
          var stateStoringController = that.getController('stateStoring');
          return this.callBase() || stateStoringController.isLoading();
        },
        isStateLoading: function isStateLoading() {
          return isDefined(this._restoreStateTimeoutID);
        },
        isLoaded: function isLoaded() {
          return this.callBase() && !this.isStateLoading();
        },
        dispose: function dispose() {
          clearTimeout(this._restoreStateTimeoutID);
          this.callBase();
        }
      },
      selection: {
        _fireSelectionChanged: function _fireSelectionChanged(options) {
          var stateStoringController = this.getController('stateStoring');
          var isDeferredSelection = this.option('selection.deferred');

          if (stateStoringController.isLoading() && isDeferredSelection) {
            return;
          }

          this.callBase.apply(this, arguments);
        }
      }
    }
  }
};