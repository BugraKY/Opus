"use strict";

exports.extendFromObject = exports.extend = void 0;

var _type = require("./type");

var extendFromObject = function extendFromObject(target, source, overrideExistingValues) {
  target = target || {};

  for (var prop in source) {
    if (Object.prototype.hasOwnProperty.call(source, prop)) {
      var value = source[prop];

      if (!(prop in target) || overrideExistingValues) {
        target[prop] = value;
      }
    }
  }

  return target;
};

exports.extendFromObject = extendFromObject;

var extend = function extend(target) {
  target = target || {};
  var i = 1;
  var deep = false;

  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    i++;
  }

  for (; i < arguments.length; i++) {
    var source = arguments[i];

    if (source == null) {
      continue;
    }

    for (var key in source) {
      var targetValue = target[key];
      var sourceValue = source[key];
      var sourceValueIsArray = false;
      var clone = void 0;

      if (key === '__proto__' || key === 'constructor' || target === sourceValue) {
        continue;
      }

      if (deep && sourceValue && ((0, _type.isPlainObject)(sourceValue) || (sourceValueIsArray = Array.isArray(sourceValue)))) {
        if (sourceValueIsArray) {
          clone = targetValue && Array.isArray(targetValue) ? targetValue : [];
        } else {
          clone = targetValue && (0, _type.isPlainObject)(targetValue) ? targetValue : {};
        }

        target[key] = extend(deep, clone, sourceValue);
      } else if (sourceValue !== undefined) {
        target[key] = sourceValue;
      }
    }
  }

  return target;
};

exports.extend = extend;