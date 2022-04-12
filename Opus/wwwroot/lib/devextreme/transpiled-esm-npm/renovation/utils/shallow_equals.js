"use strict";

exports.shallowEquals = void 0;

var shallowEquals = function shallowEquals(firstObject, secondObject) {
  if (Object.keys(firstObject).length !== Object.keys(secondObject).length) {
    return false;
  }

  return Object.keys(firstObject).every(function (key) {
    return firstObject[key] === secondObject[key];
  });
};

exports.shallowEquals = shallowEquals;