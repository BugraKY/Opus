import gridCore from './ui.tree_list.core';
import dataSourceAdapter from './ui.tree_list.data_source_adapter';
import { virtualScrollingModule } from '../grid_core/ui.grid_core.virtual_scrolling';
import { extend } from '../../core/utils/extend';
var oldDefaultOptions = virtualScrollingModule.defaultOptions;
var originalDataControllerExtender = virtualScrollingModule.extenders.controllers.data;
var originalDataSourceAdapterExtender = virtualScrollingModule.extenders.dataSourceAdapter;
virtualScrollingModule.extenders.controllers.data = extend({}, originalDataControllerExtender, {
  _loadOnOptionChange: function _loadOnOptionChange() {
    var virtualScrollController = this._dataSource && this._dataSource._virtualScrollController;
    virtualScrollController && virtualScrollController.reset();
    this.callBase();
  }
});
virtualScrollingModule.extenders.dataSourceAdapter = extend({}, originalDataSourceAdapterExtender, {
  changeRowExpand: function changeRowExpand() {
    return this.callBase.apply(this, arguments).done(() => {
      var viewportItemIndex = this.getViewportItemIndex();
      viewportItemIndex >= 0 && this.setViewportItemIndex(viewportItemIndex);
    });
  }
});
gridCore.registerModule('virtualScrolling', extend({}, virtualScrollingModule, {
  defaultOptions: function defaultOptions() {
    return extend(true, oldDefaultOptions(), {
      scrolling: {
        mode: 'virtual'
      }
    });
  }
}));
dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);