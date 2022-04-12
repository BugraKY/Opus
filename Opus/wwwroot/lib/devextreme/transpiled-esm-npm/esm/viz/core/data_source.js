import { noop } from '../../core/utils/common';
import DataHelperMixin from '../../data_helper';
var postCtor = DataHelperMixin.postCtor;
var name;
var members = {
  _dataSourceLoadErrorHandler: function _dataSourceLoadErrorHandler() {
    this._dataSourceChangedHandler();
  },
  _dataSourceOptions: function _dataSourceOptions() {
    return {
      paginate: false
    };
  },
  _updateDataSource: function _updateDataSource() {
    this._refreshDataSource();

    if (!this.option('dataSource')) {
      this._dataSourceChangedHandler();
    }
  },
  _dataIsLoaded: function _dataIsLoaded() {
    return !this._dataSource || this._dataSource.isLoaded();
  },
  _dataSourceItems: function _dataSourceItems() {
    return this._dataSource && this._dataSource.items();
  }
};

for (name in DataHelperMixin) {
  if (name === 'postCtor') {
    continue;
  }

  members[name] = DataHelperMixin[name];
}

export var plugin = {
  name: 'data_source',
  init: function init() {
    postCtor.call(this);
  },
  dispose: noop,
  members: members
};