import { adjust } from '../../core/utils/math';

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

var getNthOccurrence = function getNthOccurrence(str, c, n) {
  var i = -1;

  while (n-- && i++ < str.length) {
    i = str.indexOf(c, i);
  }

  return i;
};

var splitByIndex = function splitByIndex(str, index) {
  if (index === -1) {
    return [str];
  }

  return [str.slice(0, index), str.slice(index + 1)];
};

var adjustPercentValue = function adjustPercentValue(rawValue, precision) {
  return rawValue && adjust(rawValue / 100, precision);
};

export { getRealSeparatorIndex, getNthOccurrence, splitByIndex, adjustPercentValue };