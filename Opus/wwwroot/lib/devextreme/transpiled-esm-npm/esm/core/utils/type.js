var types = {
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object Object]': 'object',
  '[object String]': 'string',
  '[object Null]': 'null'
};

var type = function type(object) {
  var typeOfObject = Object.prototype.toString.call(object);
  return typeof object === 'object' ? types[typeOfObject] || 'object' : typeof object;
};

var isBoolean = function isBoolean(object) {
  return typeof object === 'boolean';
};

var isExponential = function isExponential(value) {
  return isNumeric(value) && value.toString().indexOf('e') !== -1;
};

var isDate = function isDate(object) {
  return type(object) === 'date';
};

var isDefined = function isDefined(object) {
  return object !== null && object !== undefined;
};

var isFunction = function isFunction(object) {
  return typeof object === 'function';
};

var isString = function isString(object) {
  return typeof object === 'string';
};

var isNumeric = function isNumeric(object) {
  return typeof object === 'number' && isFinite(object) || !isNaN(object - parseFloat(object));
};

var isObject = function isObject(object) {
  return type(object) === 'object';
};

var isEmptyObject = function isEmptyObject(object) {
  var property;

  for (property in object) {
    return false;
  }

  return true;
};

var isPlainObject = function isPlainObject(object) {
  if (!object || Object.prototype.toString.call(object) !== '[object Object]') {
    return false;
  }

  var proto = Object.getPrototypeOf(object);
  var ctor = Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof ctor === 'function' && Object.toString.call(ctor) === Object.toString.call(Object);
};

var isPrimitive = function isPrimitive(value) {
  return ['object', 'array', 'function'].indexOf(type(value)) === -1;
};

var isWindow = function isWindow(object) {
  return object != null && object === object.window;
};

var isRenderer = function isRenderer(object) {
  return !!object && !!(object.jquery || object.dxRenderer);
};

var isPromise = function isPromise(object) {
  return !!object && isFunction(object.then);
};

var isDeferred = function isDeferred(object) {
  return !!object && isFunction(object.done) && isFunction(object.fail);
};

var isEvent = function isEvent(object) {
  return !!(object && object.preventDefault);
};

export { isBoolean, isExponential, isDate, isDefined, isFunction, isString, isNumeric, isObject, isEmptyObject, isPlainObject, isPrimitive, isWindow, isRenderer, isPromise, isDeferred, type, isEvent };