"use strict";

exports.pathCombine = exports.getPathParts = exports.getParentPath = exports.getName = exports.getFileExtension = exports.getEscapedFileName = exports.PATH_SEPARATOR = void 0;

var _iterator = require("../core/utils/iterator");

var PATH_SEPARATOR = '/';
exports.PATH_SEPARATOR = PATH_SEPARATOR;

var getFileExtension = function getFileExtension(path) {
  var index = path.lastIndexOf('.');
  return index !== -1 ? path.substr(index) : '';
};

exports.getFileExtension = getFileExtension;

var getName = function getName(path) {
  var index = path.lastIndexOf(PATH_SEPARATOR);
  return index !== -1 ? path.substr(index + PATH_SEPARATOR.length) : path;
};

exports.getName = getName;

var getParentPath = function getParentPath(path) {
  var index = path.lastIndexOf(PATH_SEPARATOR);
  return index !== -1 ? path.substr(0, index) : '';
};

exports.getParentPath = getParentPath;

var getPathParts = function getPathParts(path, includeFullPath) {
  if (!path || path === '/') {
    return [];
  }

  var result = [];
  var pathPart = '';

  for (var i = 0; i < path.length; i++) {
    var char = path.charAt(i);

    if (char === PATH_SEPARATOR) {
      var nextChar = path.charAt(i + 1);

      if (nextChar !== PATH_SEPARATOR) {
        if (pathPart) {
          result.push(pathPart);
          pathPart = '';
        }

        char = nextChar;
      }

      i++;
    }

    pathPart += char;
  }

  if (pathPart) {
    result.push(pathPart);
  }

  if (includeFullPath) {
    for (var _i = 0; _i < result.length; _i++) {
      result[_i] = pathCombine(_i === 0 ? '' : result[_i - 1], getEscapedFileName(result[_i]));
    }
  }

  return result;
};

exports.getPathParts = getPathParts;

var getEscapedFileName = function getEscapedFileName(fileName) {
  return fileName.replace(/\//g, '//');
};

exports.getEscapedFileName = getEscapedFileName;

var pathCombine = function pathCombine() {
  var result = '';
  (0, _iterator.each)(arguments, function (_, arg) {
    if (arg) {
      if (result) {
        result += PATH_SEPARATOR;
      }

      result += arg;
    }
  });
  return result;
};

exports.pathCombine = pathCombine;