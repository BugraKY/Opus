"use strict";

exports.reverseEach = exports.map = exports.each = void 0;

var map = function map(values, callback) {
  if (Array.isArray(values)) {
    return values.map(callback);
  }

  var result = [];

  for (var key in values) {
    result.push(callback(values[key], key));
  }

  return result;
};

exports.map = map;

var each = function each(values, callback) {
  if (!values) return;

  if ('length' in values) {
    for (var i = 0; i < values.length; i++) {
      if (callback.call(values[i], i, values[i]) === false) {
        break;
      }
    }
  } else {
    for (var key in values) {
      if (callback.call(values[key], key, values[key]) === false) {
        break;
      }
    }
  }

  return values;
};

exports.each = each;

var reverseEach = function reverseEach(array, callback) {
  if (!array || !('length' in array) || array.length === 0) return;

  for (var i = array.length - 1; i >= 0; i--) {
    if (callback.call(array[i], i, array[i]) === false) {
      break;
    }
  }
};

exports.reverseEach = reverseEach;