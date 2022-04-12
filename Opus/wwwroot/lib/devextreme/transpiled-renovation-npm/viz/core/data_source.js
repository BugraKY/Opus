"use strict";

exports.plugin = void 0;

var _common = require("../../core/utils/common");

var _data_helper = _interopRequireDefault(require("../../data_helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var postCtor = _data_helper.default.postCtor;
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

for (name in _data_helper.default) {
  if (name === 'postCtor') {
    continue;
  }

  members[name] = _data_helper.default[name];
}

var plugin = {
  name: 'data_source',
  init: function init() {
    postCtor.call(this);
  },
  dispose: _common.noop,
  members: members
};
exports.plugin = plugin;