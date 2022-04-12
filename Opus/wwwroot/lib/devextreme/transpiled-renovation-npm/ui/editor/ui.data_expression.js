"use strict";

exports.default = void 0;

var _variable_wrapper = _interopRequireDefault(require("../../core/utils/variable_wrapper"));

var _data = require("../../core/utils/data");

var _common = require("../../core/utils/common");

var _type = require("../../core/utils/type");

var _extend = require("../../core/utils/extend");

var _data_helper = _interopRequireDefault(require("../../data_helper"));

var _data_source = require("../../data/data_source/data_source");

var _array_store = _interopRequireDefault(require("../../data/array_store"));

var _deferred = require("../../core/utils/deferred");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var DataExpressionMixin = (0, _extend.extend)({}, _data_helper.default, {
  _dataExpressionDefaultOptions: function _dataExpressionDefaultOptions() {
    return {
      items: [],
      dataSource: null,
      itemTemplate: 'item',
      value: null,
      valueExpr: 'this',
      displayExpr: undefined
    };
  },
  _initDataExpressions: function _initDataExpressions() {
    this._compileValueGetter();

    this._compileDisplayGetter();

    this._initDynamicTemplates();

    this._initDataSource();

    this._itemsToDataSource();
  },
  _itemsToDataSource: function _itemsToDataSource() {
    if (!this.option('dataSource')) {
      // TODO: try this.option("dataSource", new ...)
      this._dataSource = new _data_source.DataSource({
        store: new _array_store.default(this.option('items')),
        pageSize: 0
      });
    }
  },
  _compileDisplayGetter: function _compileDisplayGetter() {
    this._displayGetter = (0, _data.compileGetter)(this._displayGetterExpr());
  },
  _displayGetterExpr: function _displayGetterExpr() {
    return this.option('displayExpr');
  },
  _compileValueGetter: function _compileValueGetter() {
    this._valueGetter = (0, _data.compileGetter)(this._valueGetterExpr());
  },
  _valueGetterExpr: function _valueGetterExpr() {
    return this.option('valueExpr') || 'this';
  },
  _loadValue: function _loadValue(value) {
    var deferred = new _deferred.Deferred();
    value = this._unwrappedValue(value);

    if (!(0, _type.isDefined)(value)) {
      return deferred.reject().promise();
    }

    this._loadSingle(this._valueGetterExpr(), value).done(function (item) {
      this._isValueEquals(this._valueGetter(item), value) ? deferred.resolve(item) : deferred.reject();
    }.bind(this)).fail(function () {
      deferred.reject();
    });

    this._loadValueDeferred = deferred;
    return deferred.promise();
  },
  _rejectValueLoading: function _rejectValueLoading() {
    var _this$_loadValueDefer;

    (_this$_loadValueDefer = this._loadValueDeferred) === null || _this$_loadValueDefer === void 0 ? void 0 : _this$_loadValueDefer.reject({
      shouldSkipCallback: true
    });
  },
  _getCurrentValue: function _getCurrentValue() {
    return this.option('value');
  },
  _unwrappedValue: function _unwrappedValue(value) {
    var _value;

    value = (_value = value) !== null && _value !== void 0 ? _value : this._getCurrentValue();

    if (value && this._dataSource && this._valueGetterExpr() === 'this') {
      value = this._getItemKey(value);
    }

    return _variable_wrapper.default.unwrap(value);
  },
  _getItemKey: function _getItemKey(value) {
    var key = this._dataSource.key();

    if (Array.isArray(key)) {
      var result = {};

      for (var i = 0, n = key.length; i < n; i++) {
        result[key[i]] = value[key[i]];
      }

      return result;
    }

    if (key && _typeof(value) === 'object') {
      value = value[key];
    }

    return value;
  },
  _isValueEquals: function _isValueEquals(value1, value2) {
    var dataSourceKey = this._dataSource && this._dataSource.key();

    var result = this._compareValues(value1, value2);

    if (!result && dataSourceKey && (0, _type.isDefined)(value1) && (0, _type.isDefined)(value2)) {
      if (Array.isArray(dataSourceKey)) {
        result = this._compareByCompositeKey(value1, value2, dataSourceKey);
      } else {
        result = this._compareByKey(value1, value2, dataSourceKey);
      }
    }

    return result;
  },
  _compareByCompositeKey: function _compareByCompositeKey(value1, value2, key) {
    var isObject = _type.isObject;

    if (!isObject(value1) || !isObject(value2)) {
      return false;
    }

    for (var i = 0, n = key.length; i < n; i++) {
      if (value1[key[i]] !== value2[key[i]]) {
        return false;
      }
    }

    return true;
  },
  _compareByKey: function _compareByKey(value1, value2, key) {
    var unwrapObservable = _variable_wrapper.default.unwrap;
    var valueKey1 = (0, _common.ensureDefined)(unwrapObservable(value1[key]), value1);
    var valueKey2 = (0, _common.ensureDefined)(unwrapObservable(value2[key]), value2);
    return this._compareValues(valueKey1, valueKey2);
  },
  _compareValues: function _compareValues(value1, value2) {
    return (0, _data.toComparable)(value1, true) === (0, _data.toComparable)(value2, true);
  },
  _initDynamicTemplates: _common.noop,
  _setCollectionWidgetItemTemplate: function _setCollectionWidgetItemTemplate() {
    this._initDynamicTemplates();

    this._setCollectionWidgetOption('itemTemplate', this.option('itemTemplate'));
  },
  _getCollectionKeyExpr: function _getCollectionKeyExpr() {
    var valueExpr = this.option('valueExpr');
    var isValueExprField = (0, _type.isString)(valueExpr) && valueExpr !== 'this' || (0, _type.isFunction)(valueExpr);
    return isValueExprField ? valueExpr : null;
  },
  _dataExpressionOptionChanged: function _dataExpressionOptionChanged(args) {
    switch (args.name) {
      case 'items':
        this._itemsToDataSource();

        this._setCollectionWidgetOption('items');

        break;

      case 'dataSource':
        this._initDataSource();

        break;

      case 'itemTemplate':
        this._setCollectionWidgetItemTemplate();

        break;

      case 'valueExpr':
        this._compileValueGetter();

        break;

      case 'displayExpr':
        this._compileDisplayGetter();

        this._initDynamicTemplates();

        this._setCollectionWidgetOption('displayExpr');

        break;
    }
  }
});
var _default = DataExpressionMixin;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;