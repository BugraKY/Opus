import _extends from "@babel/runtime/helpers/esm/extends";
import { isDefined } from './type';
import { each } from './iterator';
import { orderEach } from './object';
import config from '../config';
export var isEmpty = function isEmpty(entity) {
  return Array.isArray(entity) && !entity.length;
};
export var wrapToArray = function wrapToArray(entity) {
  return Array.isArray(entity) ? entity : [entity];
};
export var inArray = function inArray(value, object) {
  if (!object) {
    return -1;
  }

  var array = Array.isArray(object) ? object : object.toArray();
  return array.indexOf(value);
};
export var intersection = function intersection(a, b) {
  if (!Array.isArray(a) || a.length === 0 || !Array.isArray(b) || b.length === 0) {
    return [];
  }

  var result = [];
  each(a, function (_, value) {
    var index = inArray(value, b);

    if (index !== -1) {
      result.push(value);
    }
  });
  return result;
};
export var uniqueValues = function uniqueValues(data) {
  return [...new Set(data)];
};
export var removeDuplicates = function removeDuplicates(from, what) {
  if (!Array.isArray(from) || from.length === 0) {
    return [];
  }

  var result = from.slice();

  if (!Array.isArray(what) || what.length === 0) {
    return result;
  }

  each(what, function (_, value) {
    var index = inArray(value, result);
    result.splice(index, 1);
  });
  return result;
};
export var normalizeIndexes = function normalizeIndexes(items, indexParameterName, currentItem, needIndexCallback) {
  var indexedItems = {};
  var parameterIndex = 0;
  var useLegacyVisibleIndex = config().useLegacyVisibleIndex;
  each(items, function (index, item) {
    index = item[indexParameterName];

    if (index >= 0) {
      indexedItems[index] = indexedItems[index] || [];

      if (item === currentItem) {
        indexedItems[index].unshift(item);
      } else {
        indexedItems[index].push(item);
      }
    } else {
      item[indexParameterName] = undefined;
    }
  });

  if (!useLegacyVisibleIndex) {
    each(items, function () {
      if (!isDefined(this[indexParameterName]) && (!needIndexCallback || needIndexCallback(this))) {
        while (indexedItems[parameterIndex]) {
          parameterIndex++;
        }

        indexedItems[parameterIndex] = [this];
        parameterIndex++;
      }
    });
  }

  parameterIndex = 0;
  orderEach(indexedItems, function (index, items) {
    each(items, function () {
      if (index >= 0) {
        this[indexParameterName] = parameterIndex++;
      }
    });
  });

  if (useLegacyVisibleIndex) {
    each(items, function () {
      if (!isDefined(this[indexParameterName]) && (!needIndexCallback || needIndexCallback(this))) {
        this[indexParameterName] = parameterIndex++;
      }
    });
  }

  return parameterIndex;
};
export var merge = function merge(array1, array2) {
  for (var i = 0; i < array2.length; i++) {
    array1[array1.length] = array2[i];
  }

  return array1;
};
export var find = function find(array, condition) {
  for (var i = 0; i < array.length; i++) {
    if (condition(array[i])) {
      return array[i];
    }
  }
};
export var groupBy = (array, cb) => array.reduce((result, item) => _extends({}, result, {
  [cb(item)]: [...(result[cb(item)] || []), item]
}), {});