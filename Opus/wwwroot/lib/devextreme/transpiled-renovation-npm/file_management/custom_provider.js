"use strict";

exports.default = void 0;

var _common = require("../core/utils/common");

var _type = require("../core/utils/type");

var _data = require("../core/utils/data");

var _provider_base = _interopRequireDefault(require("./provider_base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CustomFileSystemProvider = /*#__PURE__*/function (_FileSystemProviderBa) {
  _inheritsLoose(CustomFileSystemProvider, _FileSystemProviderBa);

  function CustomFileSystemProvider(options) {
    var _this;

    options = (0, _common.ensureDefined)(options, {});
    _this = _FileSystemProviderBa.call(this, options) || this;
    _this._hasSubDirsGetter = (0, _data.compileGetter)(options.hasSubDirectoriesExpr || 'hasSubDirectories');
    _this._getItemsFunction = _this._ensureFunction(options.getItems, function () {
      return [];
    });
    _this._renameItemFunction = _this._ensureFunction(options.renameItem);
    _this._createDirectoryFunction = _this._ensureFunction(options.createDirectory);
    _this._deleteItemFunction = _this._ensureFunction(options.deleteItem);
    _this._moveItemFunction = _this._ensureFunction(options.moveItem);
    _this._copyItemFunction = _this._ensureFunction(options.copyItem);
    _this._uploadFileChunkFunction = _this._ensureFunction(options.uploadFileChunk);
    _this._abortFileUploadFunction = _this._ensureFunction(options.abortFileUpload);
    _this._downloadItemsFunction = _this._ensureFunction(options.downloadItems);
    _this._getItemsContentFunction = _this._ensureFunction(options.getItemsContent);
    return _this;
  }

  var _proto = CustomFileSystemProvider.prototype;

  _proto.getItems = function getItems(parentDir) {
    var _this2 = this;

    var pathInfo = parentDir.getFullPathInfo();
    return this._executeActionAsDeferred(function () {
      return _this2._getItemsFunction(parentDir);
    }, true).then(function (dataItems) {
      return _this2._convertDataObjectsToFileItems(dataItems, pathInfo);
    });
  };

  _proto.renameItem = function renameItem(item, name) {
    var _this3 = this;

    return this._executeActionAsDeferred(function () {
      return _this3._renameItemFunction(item, name);
    });
  };

  _proto.createDirectory = function createDirectory(parentDir, name) {
    var _this4 = this;

    return this._executeActionAsDeferred(function () {
      return _this4._createDirectoryFunction(parentDir, name);
    });
  };

  _proto.deleteItems = function deleteItems(items) {
    var _this5 = this;

    return items.map(function (item) {
      return _this5._executeActionAsDeferred(function () {
        return _this5._deleteItemFunction(item);
      });
    });
  };

  _proto.moveItems = function moveItems(items, destinationDirectory) {
    var _this6 = this;

    return items.map(function (item) {
      return _this6._executeActionAsDeferred(function () {
        return _this6._moveItemFunction(item, destinationDirectory);
      });
    });
  };

  _proto.copyItems = function copyItems(items, destinationFolder) {
    var _this7 = this;

    return items.map(function (item) {
      return _this7._executeActionAsDeferred(function () {
        return _this7._copyItemFunction(item, destinationFolder);
      });
    });
  };

  _proto.uploadFileChunk = function uploadFileChunk(fileData, chunksInfo, destinationDirectory) {
    var _this8 = this;

    return this._executeActionAsDeferred(function () {
      return _this8._uploadFileChunkFunction(fileData, chunksInfo, destinationDirectory);
    });
  };

  _proto.abortFileUpload = function abortFileUpload(fileData, chunksInfo, destinationDirectory) {
    var _this9 = this;

    return this._executeActionAsDeferred(function () {
      return _this9._abortFileUploadFunction(fileData, chunksInfo, destinationDirectory);
    });
  };

  _proto.downloadItems = function downloadItems(items) {
    return this._downloadItemsFunction(items);
  };

  _proto.getItemsContent = function getItemsContent(items) {
    var _this10 = this;

    return this._executeActionAsDeferred(function () {
      return _this10._getItemsContentFunction(items);
    });
  };

  _proto._hasSubDirs = function _hasSubDirs(dataObj) {
    var hasSubDirs = this._hasSubDirsGetter(dataObj);

    return typeof hasSubDirs === 'boolean' ? hasSubDirs : true;
  };

  _proto._getKeyExpr = function _getKeyExpr(options) {
    return options.keyExpr || 'key';
  };

  _proto._ensureFunction = function _ensureFunction(functionObject, defaultFunction) {
    defaultFunction = defaultFunction || _common.noop;
    return (0, _type.isFunction)(functionObject) ? functionObject : defaultFunction;
  };

  return CustomFileSystemProvider;
}(_provider_base.default);

var _default = CustomFileSystemProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;