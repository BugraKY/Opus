"use strict";

exports.default = void 0;

var _data = require("../core/utils/data");

var _common = require("../core/utils/common");

var _date_serialization = _interopRequireDefault(require("../core/utils/date_serialization"));

var _iterator = require("../core/utils/iterator");

var _type = require("../core/utils/type");

var _deferred = require("../core/utils/deferred");

var _file_system_item = _interopRequireDefault(require("./file_system_item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 200000;

var FileSystemProviderBase = /*#__PURE__*/function () {
  function FileSystemProviderBase(options) {
    options = (0, _common.ensureDefined)(options, {});
    this._keyGetter = (0, _data.compileGetter)(this._getKeyExpr(options));
    this._nameGetter = (0, _data.compileGetter)(this._getNameExpr(options));
    this._isDirGetter = (0, _data.compileGetter)(this._getIsDirExpr(options));
    this._sizeGetter = (0, _data.compileGetter)(this._getSizeExpr(options));
    this._dateModifiedGetter = (0, _data.compileGetter)(this._getDateModifiedExpr(options));
    this._thumbnailGetter = (0, _data.compileGetter)(options.thumbnailExpr || 'thumbnail');
  }

  var _proto = FileSystemProviderBase.prototype;

  _proto.getItems = function getItems(parentDirectory) {
    return [];
  };

  _proto.renameItem = function renameItem(item, name) {};

  _proto.createDirectory = function createDirectory(parentDirectory, name) {};

  _proto.deleteItems = function deleteItems(items) {};

  _proto.moveItems = function moveItems(items, destinationDirectory) {};

  _proto.copyItems = function copyItems(items, destinationDirectory) {};

  _proto.uploadFileChunk = function uploadFileChunk(fileData, chunksInfo, destinationDirectory) {};

  _proto.abortFileUpload = function abortFileUpload(fileData, chunksInfo, destinationDirectory) {};

  _proto.downloadItems = function downloadItems(items) {};

  _proto.getItemsContent = function getItemsContent(items) {};

  _proto.getFileUploadChunkSize = function getFileUploadChunkSize() {
    return DEFAULT_FILE_UPLOAD_CHUNK_SIZE;
  };

  _proto._convertDataObjectsToFileItems = function _convertDataObjectsToFileItems(entries, pathInfo) {
    var _this = this;

    var result = [];
    (0, _iterator.each)(entries, function (_, entry) {
      var fileItem = _this._createFileItem(entry, pathInfo);

      result.push(fileItem);
    });
    return result;
  };

  _proto._createFileItem = function _createFileItem(dataObj, pathInfo) {
    var key = this._keyGetter(dataObj);

    var fileItem = new _file_system_item.default(pathInfo, this._nameGetter(dataObj), !!this._isDirGetter(dataObj), key);
    fileItem.size = this._sizeGetter(dataObj);

    if (fileItem.size === undefined) {
      fileItem.size = 0;
    }

    fileItem.dateModified = _date_serialization.default.deserializeDate(this._dateModifiedGetter(dataObj));

    if (fileItem.dateModified === undefined) {
      fileItem.dateModified = new Date();
    }

    if (fileItem.isDirectory) {
      fileItem.hasSubDirectories = this._hasSubDirs(dataObj);
    }

    if (!key) {
      fileItem.key = fileItem.relativeName;
    }

    fileItem.thumbnail = this._thumbnailGetter(dataObj) || '';
    fileItem.dataItem = dataObj;
    return fileItem;
  };

  _proto._hasSubDirs = function _hasSubDirs(dataObj) {
    return true;
  };

  _proto._getKeyExpr = function _getKeyExpr(options) {
    return options.keyExpr || this._defaultKeyExpr;
  };

  _proto._defaultKeyExpr = function _defaultKeyExpr(fileItem) {
    if (arguments.length === 2) {
      fileItem.__KEY__ = arguments[1];
      return;
    }

    return Object.prototype.hasOwnProperty.call(fileItem, '__KEY__') ? fileItem.__KEY__ : null;
  };

  _proto._getNameExpr = function _getNameExpr(options) {
    return options.nameExpr || 'name';
  };

  _proto._getIsDirExpr = function _getIsDirExpr(options) {
    return options.isDirectoryExpr || 'isDirectory';
  };

  _proto._getSizeExpr = function _getSizeExpr(options) {
    return options.sizeExpr || 'size';
  };

  _proto._getDateModifiedExpr = function _getDateModifiedExpr(options) {
    return options.dateModifiedExpr || 'dateModified';
  };

  _proto._executeActionAsDeferred = function _executeActionAsDeferred(action, keepResult) {
    var deferred = new _deferred.Deferred();

    try {
      var result = action();

      if ((0, _type.isPromise)(result)) {
        (0, _deferred.fromPromise)(result).done(function (userResult) {
          return deferred.resolve(keepResult && userResult || undefined);
        }).fail(function (error) {
          return deferred.reject(error);
        });
      } else {
        deferred.resolve(keepResult && result || undefined);
      }
    } catch (error) {
      return deferred.reject(error);
    }

    return deferred.promise();
  };

  return FileSystemProviderBase;
}();

var _default = FileSystemProviderBase;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;