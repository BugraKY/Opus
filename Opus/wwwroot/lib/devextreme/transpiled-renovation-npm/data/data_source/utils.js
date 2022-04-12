"use strict";

exports.normalizeStoreLoadOptionAccessorArguments = exports.normalizeLoadResult = exports.normalizeDataSourceOptions = exports.mapDataRespectingGrouping = exports.isPending = exports.CANCELED_TOKEN = void 0;

var _ajax = _interopRequireDefault(require("../../core/utils/ajax"));

var _abstract_store = _interopRequireDefault(require("../abstract_store"));

var _array_store = _interopRequireDefault(require("../array_store"));

var _iterator = require("../../core/utils/iterator");

var _custom_store = _interopRequireDefault(require("../custom_store"));

var _extend = require("../../core/utils/extend");

var _type = require("../../core/utils/type");

var _utils = require("../utils");

var _excluded = ["items"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var CANCELED_TOKEN = 'canceled';
exports.CANCELED_TOKEN = CANCELED_TOKEN;

var isPending = function isPending(deferred) {
  return deferred.state() === 'pending';
};

exports.isPending = isPending;

var normalizeStoreLoadOptionAccessorArguments = function normalizeStoreLoadOptionAccessorArguments(originalArguments) {
  switch (originalArguments.length) {
    case 0:
      return undefined;

    case 1:
      return originalArguments[0];
  }

  return [].slice.call(originalArguments);
};

exports.normalizeStoreLoadOptionAccessorArguments = normalizeStoreLoadOptionAccessorArguments;

var mapGroup = function mapGroup(group, level, mapper) {
  return (0, _iterator.map)(group, function (item) {
    var items = item.items,
        restItem = _objectWithoutProperties(item, _excluded);

    return _extends({}, restItem, {
      items: mapRecursive(item.items, level - 1, mapper)
    });
  });
};

var mapRecursive = function mapRecursive(items, level, mapper) {
  if (!Array.isArray(items)) return items;
  return level ? mapGroup(items, level, mapper) : (0, _iterator.map)(items, mapper);
};

var mapDataRespectingGrouping = function mapDataRespectingGrouping(items, mapper, groupInfo) {
  var level = groupInfo ? (0, _utils.normalizeSortingInfo)(groupInfo).length : 0;
  return mapRecursive(items, level, mapper);
};

exports.mapDataRespectingGrouping = mapDataRespectingGrouping;

var normalizeLoadResult = function normalizeLoadResult(data, extra) {
  var _data;

  if ((_data = data) !== null && _data !== void 0 && _data.data) {
    extra = data;
    data = data.data;
  }

  if (!Array.isArray(data)) {
    data = [data];
  }

  return {
    data: data,
    extra: extra
  };
};

exports.normalizeLoadResult = normalizeLoadResult;

var createCustomStoreFromLoadFunc = function createCustomStoreFromLoadFunc(options) {
  var storeConfig = {};
  (0, _iterator.each)(['useDefaultSearch', 'key', 'load', 'loadMode', 'cacheRawData', 'byKey', 'lookup', 'totalCount', 'insert', 'update', 'remove'], function () {
    storeConfig[this] = options[this];
    delete options[this];
  });
  return new _custom_store.default(storeConfig);
};

var createStoreFromConfig = function createStoreFromConfig(storeConfig) {
  var alias = storeConfig.type;
  delete storeConfig.type;
  return _abstract_store.default.create(alias, storeConfig);
};

var createCustomStoreFromUrl = function createCustomStoreFromUrl(url, normalizationOptions) {
  return new _custom_store.default({
    load: function load() {
      return _ajax.default.sendRequest({
        url: url,
        dataType: 'json'
      });
    },
    loadMode: normalizationOptions === null || normalizationOptions === void 0 ? void 0 : normalizationOptions.fromUrlLoadMode
  });
};

var normalizeDataSourceOptions = function normalizeDataSourceOptions(options, normalizationOptions) {
  var store;

  if (typeof options === 'string') {
    options = {
      paginate: false,
      store: createCustomStoreFromUrl(options, normalizationOptions)
    };
  }

  if (options === undefined) {
    options = [];
  }

  if (Array.isArray(options) || options instanceof _abstract_store.default) {
    options = {
      store: options
    };
  } else {
    options = (0, _extend.extend)({}, options);
  }

  if (options.store === undefined) {
    options.store = [];
  }

  store = options.store;

  if ('load' in options) {
    store = createCustomStoreFromLoadFunc(options);
  } else if (Array.isArray(store)) {
    store = new _array_store.default(store);
  } else if ((0, _type.isPlainObject)(store)) {
    store = createStoreFromConfig((0, _extend.extend)({}, store));
  }

  options.store = store;
  return options;
};

exports.normalizeDataSourceOptions = normalizeDataSourceOptions;