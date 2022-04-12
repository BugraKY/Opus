import { DataSource } from './data/data_source/data_source';
import { extend } from './core/utils/extend';
import { normalizeDataSourceOptions } from './data/data_source/utils';
var DATA_SOURCE_OPTIONS_METHOD = '_dataSourceOptions';
var DATA_SOURCE_CHANGED_METHOD = '_dataSourceChangedHandler';
var DATA_SOURCE_LOAD_ERROR_METHOD = '_dataSourceLoadErrorHandler';
var DATA_SOURCE_LOADING_CHANGED_METHOD = '_dataSourceLoadingChangedHandler';
var DATA_SOURCE_FROM_URL_LOAD_MODE_METHOD = '_dataSourceFromUrlLoadMode';
var SPECIFIC_DATA_SOURCE_OPTION = '_getSpecificDataSourceOption';
var NORMALIZE_DATA_SOURCE = '_normalizeDataSource';
var DataHelperMixin = {
  postCtor: function postCtor() {
    this.on('disposing', function () {
      this._disposeDataSource();
    }.bind(this));
  },
  _refreshDataSource: function _refreshDataSource() {
    this._initDataSource();

    this._loadDataSource();
  },
  _initDataSource: function _initDataSource() {
    var dataSourceOptions = SPECIFIC_DATA_SOURCE_OPTION in this ? this[SPECIFIC_DATA_SOURCE_OPTION]() : this.option('dataSource');
    var widgetDataSourceOptions;
    var dataSourceType;

    this._disposeDataSource();

    if (dataSourceOptions) {
      if (dataSourceOptions instanceof DataSource) {
        this._isSharedDataSource = true;
        this._dataSource = dataSourceOptions;
      } else {
        widgetDataSourceOptions = DATA_SOURCE_OPTIONS_METHOD in this ? this[DATA_SOURCE_OPTIONS_METHOD]() : {};
        dataSourceType = this._dataSourceType ? this._dataSourceType() : DataSource;
        dataSourceOptions = normalizeDataSourceOptions(dataSourceOptions, {
          fromUrlLoadMode: DATA_SOURCE_FROM_URL_LOAD_MODE_METHOD in this && this[DATA_SOURCE_FROM_URL_LOAD_MODE_METHOD]()
        });
        this._dataSource = new dataSourceType(extend(true, {}, widgetDataSourceOptions, dataSourceOptions));
      }

      if (NORMALIZE_DATA_SOURCE in this) {
        this._dataSource = this[NORMALIZE_DATA_SOURCE](this._dataSource);
      }

      this._addDataSourceHandlers();
    }
  },
  _addDataSourceHandlers: function _addDataSourceHandlers() {
    if (DATA_SOURCE_CHANGED_METHOD in this) {
      this._addDataSourceChangeHandler();
    }

    if (DATA_SOURCE_LOAD_ERROR_METHOD in this) {
      this._addDataSourceLoadErrorHandler();
    }

    if (DATA_SOURCE_LOADING_CHANGED_METHOD in this) {
      this._addDataSourceLoadingChangedHandler();
    }

    this._addReadyWatcher();
  },
  _addReadyWatcher: function _addReadyWatcher() {
    this._dataSource.on('loadingChanged', function (isLoading) {
      this._ready && this._ready(!isLoading);
    }.bind(this));
  },
  _addDataSourceChangeHandler: function _addDataSourceChangeHandler() {
    var dataSource = this._dataSource;

    this._proxiedDataSourceChangedHandler = function (e) {
      this[DATA_SOURCE_CHANGED_METHOD](dataSource.items(), e);
    }.bind(this);

    dataSource.on('changed', this._proxiedDataSourceChangedHandler);
  },
  _addDataSourceLoadErrorHandler: function _addDataSourceLoadErrorHandler() {
    this._proxiedDataSourceLoadErrorHandler = this[DATA_SOURCE_LOAD_ERROR_METHOD].bind(this);

    this._dataSource.on('loadError', this._proxiedDataSourceLoadErrorHandler);
  },
  _addDataSourceLoadingChangedHandler: function _addDataSourceLoadingChangedHandler() {
    this._proxiedDataSourceLoadingChangedHandler = this[DATA_SOURCE_LOADING_CHANGED_METHOD].bind(this);

    this._dataSource.on('loadingChanged', this._proxiedDataSourceLoadingChangedHandler);
  },
  _loadDataSource: function _loadDataSource() {
    if (this._dataSource) {
      var dataSource = this._dataSource;

      if (dataSource.isLoaded()) {
        this._proxiedDataSourceChangedHandler && this._proxiedDataSourceChangedHandler();
      } else {
        dataSource.load();
      }
    }
  },
  _loadSingle: function _loadSingle(key, value) {
    key = key === 'this' ? this._dataSource.key() || 'this' : key;
    return this._dataSource.loadSingle(key, value);
  },
  _isLastPage: function _isLastPage() {
    return !this._dataSource || this._dataSource.isLastPage() || !this._dataSource._pageSize;
  },
  _isDataSourceLoading: function _isDataSourceLoading() {
    return this._dataSource && this._dataSource.isLoading();
  },
  _disposeDataSource: function _disposeDataSource() {
    if (this._dataSource) {
      if (this._isSharedDataSource) {
        delete this._isSharedDataSource;
        this._proxiedDataSourceChangedHandler && this._dataSource.off('changed', this._proxiedDataSourceChangedHandler);
        this._proxiedDataSourceLoadErrorHandler && this._dataSource.off('loadError', this._proxiedDataSourceLoadErrorHandler);
        this._proxiedDataSourceLoadingChangedHandler && this._dataSource.off('loadingChanged', this._proxiedDataSourceLoadingChangedHandler);
      } else {
        this._dataSource.dispose();
      }

      delete this._dataSource;
      delete this._proxiedDataSourceChangedHandler;
      delete this._proxiedDataSourceLoadErrorHandler;
      delete this._proxiedDataSourceLoadingChangedHandler;
    }
  },
  getDataSource: function getDataSource() {
    return this._dataSource || null;
  }
};
export default DataHelperMixin;