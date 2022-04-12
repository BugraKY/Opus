"use strict";

exports.toComparable = exports.getPathParts = exports.compileSetter = exports.compileGetter = void 0;

var _errors = _interopRequireDefault(require("../errors"));

var _class = _interopRequireDefault(require("../class"));

var _object = require("./object");

var _type = require("./type");

var _iterator = require("./iterator");

var _variable_wrapper = _interopRequireDefault(require("./variable_wrapper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var unwrapVariable = _variable_wrapper.default.unwrap;
var isWrapped = _variable_wrapper.default.isWrapped;
var assign = _variable_wrapper.default.assign;

var bracketsToDots = function bracketsToDots(expr) {
  return expr.replace(/\[/g, '.').replace(/\]/g, '');
};

var getPathParts = function getPathParts(name) {
  return bracketsToDots(name).split('.');
};

exports.getPathParts = getPathParts;

var readPropValue = function readPropValue(obj, propName, options) {
  options = options || {};

  if (propName === 'this') {
    return unwrap(obj, options);
  }

  return unwrap(obj[propName], options);
};

var assignPropValue = function assignPropValue(obj, propName, value, options) {
  if (propName === 'this') {
    throw new _errors.default.Error('E4016');
  }

  var propValue = obj[propName];

  if (options.unwrapObservables && isWrapped(propValue)) {
    assign(propValue, value);
  } else {
    obj[propName] = value;
  }
};

var prepareOptions = function prepareOptions(options) {
  options = options || {};
  options.unwrapObservables = options.unwrapObservables !== undefined ? options.unwrapObservables : true;
  return options;
};

function unwrap(value, options) {
  return options.unwrapObservables ? unwrapVariable(value) : value;
}

var compileGetter = function compileGetter(expr) {
  if (arguments.length > 1) {
    expr = [].slice.call(arguments);
  }

  if (!expr || expr === 'this') {
    return function (obj) {
      return obj;
    };
  }

  if (typeof expr === 'string') {
    var path = getPathParts(expr);
    return function (obj, options) {
      options = prepareOptions(options);
      var functionAsIs = options.functionsAsIs;
      var hasDefaultValue = ('defaultValue' in options);
      var current = unwrap(obj, options);

      for (var i = 0; i < path.length; i++) {
        if (!current) {
          if (current == null && hasDefaultValue) {
            return options.defaultValue;
          }

          break;
        }

        var pathPart = path[i];

        if (hasDefaultValue && (0, _type.isObject)(current) && !(pathPart in current)) {
          return options.defaultValue;
        }

        var next = unwrap(current[pathPart], options);

        if (!functionAsIs && (0, _type.isFunction)(next)) {
          next = next.call(current);
        }

        current = next;
      }

      return current;
    };
  }

  if (Array.isArray(expr)) {
    return combineGetters(expr);
  }

  if ((0, _type.isFunction)(expr)) {
    return expr;
  }
};

exports.compileGetter = compileGetter;

function combineGetters(getters) {
  var compiledGetters = {};

  for (var i = 0, l = getters.length; i < l; i++) {
    var getter = getters[i];
    compiledGetters[getter] = compileGetter(getter);
  }

  return function (obj, options) {
    var result;
    (0, _iterator.each)(compiledGetters, function (name) {
      var value = this(obj, options);

      if (value === undefined) {
        return;
      }

      var current = result || (result = {});
      var path = name.split('.');
      var last = path.length - 1;

      for (var _i = 0; _i < last; _i++) {
        var pathItem = path[_i];

        if (!(pathItem in current)) {
          current[pathItem] = {};
        }

        current = current[pathItem];
      }

      current[path[last]] = value;
    });
    return result;
  };
}

var ensurePropValueDefined = function ensurePropValueDefined(obj, propName, value, options) {
  if ((0, _type.isDefined)(value)) {
    return value;
  }

  var newValue = {};
  assignPropValue(obj, propName, newValue, options);
  return newValue;
};

var compileSetter = function compileSetter(expr) {
  expr = getPathParts(expr || 'this');
  var lastLevelIndex = expr.length - 1;
  return function (obj, value, options) {
    options = prepareOptions(options);
    var currentValue = unwrap(obj, options);
    expr.forEach(function (propertyName, levelIndex) {
      var propertyValue = readPropValue(currentValue, propertyName, options);
      var isPropertyFunc = !options.functionsAsIs && (0, _type.isFunction)(propertyValue) && !isWrapped(propertyValue);

      if (levelIndex === lastLevelIndex) {
        if (options.merge && (0, _type.isPlainObject)(value) && (!(0, _type.isDefined)(propertyValue) || (0, _type.isPlainObject)(propertyValue))) {
          propertyValue = ensurePropValueDefined(currentValue, propertyName, propertyValue, options);
          (0, _object.deepExtendArraySafe)(propertyValue, value, false, true);
        } else if (isPropertyFunc) {
          currentValue[propertyName](value);
        } else {
          assignPropValue(currentValue, propertyName, value, options);
        }
      } else {
        propertyValue = ensurePropValueDefined(currentValue, propertyName, propertyValue, options);

        if (isPropertyFunc) {
          propertyValue = propertyValue.call(currentValue);
        }

        currentValue = propertyValue;
      }
    });
  };
};

exports.compileSetter = compileSetter;

var toComparable = function toComparable(value, caseSensitive) {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (value && value instanceof _class.default && value.valueOf) {
    return value.valueOf();
  }

  if (!caseSensitive && typeof value === 'string') {
    return value.toLowerCase();
  }

  return value;
};

exports.toComparable = toComparable;