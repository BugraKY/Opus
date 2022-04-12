import { each } from '../core/utils/iterator';
export var PATH_SEPARATOR = '/';
export var getFileExtension = path => {
  var index = path.lastIndexOf('.');
  return index !== -1 ? path.substr(index) : '';
};
export var getName = path => {
  var index = path.lastIndexOf(PATH_SEPARATOR);
  return index !== -1 ? path.substr(index + PATH_SEPARATOR.length) : path;
};
export var getParentPath = path => {
  var index = path.lastIndexOf(PATH_SEPARATOR);
  return index !== -1 ? path.substr(0, index) : '';
};
export var getPathParts = (path, includeFullPath) => {
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
export var getEscapedFileName = function getEscapedFileName(fileName) {
  return fileName.replace(/\//g, '//');
};
export var pathCombine = function pathCombine() {
  var result = '';
  each(arguments, (_, arg) => {
    if (arg) {
      if (result) {
        result += PATH_SEPARATOR;
      }

      result += arg;
    }
  });
  return result;
};