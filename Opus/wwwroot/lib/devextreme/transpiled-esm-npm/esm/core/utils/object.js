import { isNumeric, isPlainObject, isObject } from './type';
import variableWrapper from './variable_wrapper';

var clone = function () {
  function Clone() {}

  return function (obj) {
    Clone.prototype = obj;
    return new Clone();
  };
}();

var orderEach = function orderEach(map, func) {
  var keys = [];
  var key;
  var i;

  for (key in map) {
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      keys.push(key);
    }
  }

  keys.sort(function (x, y) {
    var isNumberX = isNumeric(x);
    var isNumberY = isNumeric(y);
    if (isNumberX && isNumberY) return x - y;
    if (isNumberX && !isNumberY) return -1;
    if (!isNumberX && isNumberY) return 1;
    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
  });

  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    func(key, map[key]);
  }
};

var assignValueToProperty = function assignValueToProperty(target, property, value, assignByReference) {
  if (!assignByReference && variableWrapper.isWrapped(target[property])) {
    variableWrapper.assign(target[property], value);
  } else {
    target[property] = value;
  }
}; // B239679, http://bugs.jquery.com/ticket/9477


var deepExtendArraySafe = function deepExtendArraySafe(target, changes, extendComplexObject, assignByReference) {
  var prevValue;
  var newValue;

  for (var name in changes) {
    prevValue = target[name];
    newValue = changes[name];

    if (name === '__proto__' || name === 'constructor' || target === newValue) {
      continue;
    }

    if (isPlainObject(newValue)) {
      var goDeeper = extendComplexObject ? isObject(prevValue) : isPlainObject(prevValue);
      newValue = deepExtendArraySafe(goDeeper ? prevValue : {}, newValue, extendComplexObject, assignByReference);
    }

    if (newValue !== undefined && prevValue !== newValue) {
      assignValueToProperty(target, name, newValue, assignByReference);
    }
  }

  return target;
};

export { clone, orderEach, deepExtendArraySafe };