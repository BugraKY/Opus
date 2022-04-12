"use strict";

exports.splitByIndex = exports.getRealSeparatorIndex = exports.getNthOccurrence = exports.adjustPercentValue = void 0;

var _math = require("../../core/utils/math");

var getRealSeparatorIndex = function getRealSeparatorIndex(str) {
  var quoteBalance = 0;
  var separatorCount = 0;

  for (var i = 0; i < str.length; ++i) {
    if (str[i] === '\'') {
      quoteBalance++;
    }

    if (str[i] === '.') {
      ++separatorCount;

      if (quoteBalance % 2 === 0) {
        return {
          occurrence: separatorCount,
          index: i
        };
      }
    }
  }

  return {
    occurrence: 1,
    index: -1
  };
};

exports.getRealSeparatorIndex = getRealSeparatorIndex;

var getNthOccurrence = function getNthOccurrence(str, c, n) {
  var i = -1;

  while (n-- && i++ < str.length) {
    i = str.indexOf(c, i);
  }

  return i;
};

exports.getNthOccurrence = getNthOccurrence;

var splitByIndex = function splitByIndex(str, index) {
  if (index === -1) {
    return [str];
  }

  return [str.slice(0, index), str.slice(index + 1)];
};

exports.splitByIndex = splitByIndex;

var adjustPercentValue = function adjustPercentValue(rawValue, precision) {
  return rawValue && (0, _math.adjust)(rawValue / 100, precision);
};

exports.adjustPercentValue = adjustPercentValue;