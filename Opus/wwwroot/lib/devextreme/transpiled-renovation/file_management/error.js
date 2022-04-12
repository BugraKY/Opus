"use strict";

exports.default = void 0;

var FileSystemError = function FileSystemError(errorCode, fileSystemItem, errorText) {
  this.errorCode = errorCode;
  this.fileSystemItem = fileSystemItem;
  this.errorText = errorText;
};

var _default = FileSystemError;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;