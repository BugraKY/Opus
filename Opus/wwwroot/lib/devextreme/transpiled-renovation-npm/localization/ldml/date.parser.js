"use strict";

exports.isPossibleForParsingFormat = exports.getRegExpInfo = exports.getPatternSetters = exports.getParser = void 0;

var _common = require("../../core/utils/common");

var _console = require("../../core/utils/console");

var FORMAT_TYPES = {
  '3': 'abbreviated',
  '4': 'wide',
  '5': 'narrow'
};

var monthRegExpGenerator = function monthRegExpGenerator(count, dateParts) {
  if (count > 2) {
    return Object.keys(FORMAT_TYPES).map(function (count) {
      return ['format', 'standalone'].map(function (type) {
        return dateParts.getMonthNames(FORMAT_TYPES[count], type).join('|');
      }).join('|');
    }).join('|');
  }

  return count === 2 ? '1[012]|0?[1-9]' : '0??[1-9]|1[012]';
};

var PATTERN_REGEXPS = {
  ':': function _(count, dateParts) {
    var countSuffix = count > 1 ? "{".concat(count, "}") : '';
    var timeSeparator = (0, _common.escapeRegExp)(dateParts.getTimeSeparator());
    timeSeparator !== ':' && (timeSeparator = "".concat(timeSeparator, "|:"));
    return "".concat(timeSeparator).concat(countSuffix);
  },
  y: function y(count) {
    return count === 2 ? "[0-9]{".concat(count, "}") : '[0-9]+?';
  },
  M: monthRegExpGenerator,
  L: monthRegExpGenerator,
  Q: function Q(count, dateParts) {
    if (count > 2) {
      return dateParts.getQuarterNames(FORMAT_TYPES[count], 'format').join('|');
    }

    return '0?[1-4]';
  },
  E: function E(count, dateParts) {
    return '\\D*';
  },
  a: function a(count, dateParts) {
    return dateParts.getPeriodNames(FORMAT_TYPES[count < 3 ? 3 : count], 'format').join('|');
  },
  d: function d(count) {
    return count === 2 ? '3[01]|[12][0-9]|0?[1-9]' : '0??[1-9]|[12][0-9]|3[01]';
  },
  H: function H(count) {
    return count === 2 ? '2[0-3]|1[0-9]|0?[0-9]' : '0??[0-9]|1[0-9]|2[0-3]';
  },
  h: function h(count) {
    return count === 2 ? '1[012]|0?[1-9]' : '0??[1-9]|1[012]';
  },
  m: function m(count) {
    return count === 2 ? '[1-5][0-9]|0?[0-9]' : '0??[0-9]|[1-5][0-9]';
  },
  s: function s(count) {
    return count === 2 ? '[1-5][0-9]|0?[0-9]' : '0??[0-9]|[1-5][0-9]';
  },
  S: function S(count) {
    return "[0-9]{1,".concat(count, "}");
  },
  w: function w(count) {
    return count === 2 ? '[1-5][0-9]|0?[0-9]' : '0??[0-9]|[1-5][0-9]';
  }
};
var parseNumber = Number;

var caseInsensitiveIndexOf = function caseInsensitiveIndexOf(array, value) {
  return array.map(function (item) {
    return item.toLowerCase();
  }).indexOf(value.toLowerCase());
};

var monthPatternParser = function monthPatternParser(text, count, dateParts) {
  if (count > 2) {
    return ['format', 'standalone'].map(function (type) {
      return Object.keys(FORMAT_TYPES).map(function (count) {
        var monthNames = dateParts.getMonthNames(FORMAT_TYPES[count], type);
        return caseInsensitiveIndexOf(monthNames, text);
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }).filter(function (index) {
      return index >= 0;
    })[0];
  }

  return parseNumber(text) - 1;
};

var PATTERN_PARSERS = {
  y: function y(text, count) {
    var year = parseNumber(text);

    if (count === 2) {
      return year < 30 ? 2000 + year : 1900 + year;
    }

    return year;
  },
  M: monthPatternParser,
  L: monthPatternParser,
  Q: function Q(text, count, dateParts) {
    if (count > 2) {
      return dateParts.getQuarterNames(FORMAT_TYPES[count], 'format').indexOf(text);
    }

    return parseNumber(text) - 1;
  },
  E: function E(text, count, dateParts) {
    var dayNames = dateParts.getDayNames(FORMAT_TYPES[count < 3 ? 3 : count], 'format');
    return caseInsensitiveIndexOf(dayNames, text);
  },
  a: function a(text, count, dateParts) {
    var periodNames = dateParts.getPeriodNames(FORMAT_TYPES[count < 3 ? 3 : count], 'format');
    return caseInsensitiveIndexOf(periodNames, text);
  },
  d: parseNumber,
  H: parseNumber,
  h: parseNumber,
  m: parseNumber,
  s: parseNumber,
  S: function S(text, count) {
    count = Math.max(count, 3);
    text = text.slice(0, 3);

    while (count < 3) {
      text = text + '0';
      count++;
    }

    return parseNumber(text);
  }
};
var ORDERED_PATTERNS = ['y', 'M', 'd', 'h', 'm', 's', 'S'];
var PATTERN_SETTERS = {
  y: 'setFullYear',
  M: 'setMonth',
  L: 'setMonth',
  a: function a(date, value, datePartValues) {
    var hours = date.getHours();
    var hourPartValue = datePartValues['h'];

    if (hourPartValue !== undefined && hourPartValue !== hours) {
      hours--;
    }

    if (!value && hours === 12) {
      hours = 0;
    } else if (value && hours !== 12) {
      hours += 12;
    }

    date.setHours(hours);
  },
  d: 'setDate',
  H: 'setHours',
  h: 'setHours',
  m: 'setMinutes',
  s: 'setSeconds',
  S: 'setMilliseconds'
};

var getSameCharCount = function getSameCharCount(text, index) {
  var char = text[index];

  if (!char) {
    return 0;
  }

  var count = 0;

  do {
    index++;
    count++;
  } while (text[index] === char);

  return count;
};

var createPattern = function createPattern(char, count) {
  var result = '';

  for (var i = 0; i < count; i++) {
    result += char;
  }

  return result;
};

var getRegExpInfo = function getRegExpInfo(format, dateParts) {
  var regexpText = '';
  var stubText = '';
  var isEscaping;
  var patterns = [];

  var addPreviousStub = function addPreviousStub() {
    if (stubText) {
      patterns.push("'".concat(stubText, "'"));
      regexpText += "".concat((0, _common.escapeRegExp)(stubText), ")");
      stubText = '';
    }
  };

  for (var i = 0; i < format.length; i++) {
    var char = format[i];
    var isEscapeChar = char === '\'';
    var regexpPart = PATTERN_REGEXPS[char];

    if (isEscapeChar) {
      isEscaping = !isEscaping;

      if (format[i - 1] !== '\'') {
        continue;
      }
    }

    if (regexpPart && !isEscaping) {
      var count = getSameCharCount(format, i);
      var pattern = createPattern(char, count);
      addPreviousStub();
      patterns.push(pattern);
      regexpText += "(".concat(regexpPart(count, dateParts), ")");
      i += count - 1;
    } else {
      if (!stubText) {
        regexpText += '(';
      }

      stubText += char;
    }
  }

  addPreviousStub();

  if (!isPossibleForParsingFormat(patterns)) {
    _console.logger.warn("The following format may be parsed incorrectly: ".concat(format, "."));
  }

  return {
    patterns: patterns,
    regexp: new RegExp("^".concat(regexpText, "$"), 'i')
  };
};

exports.getRegExpInfo = getRegExpInfo;
var digitFieldSymbols = ['d', 'H', 'h', 'm', 's', 'w', 'M', 'L', 'Q'];

var isPossibleForParsingFormat = function isPossibleForParsingFormat(patterns) {
  var isDigitPattern = function isDigitPattern(pattern) {
    if (!pattern) {
      return false;
    }

    var char = pattern[0];
    return ['y', 'S'].includes(char) || digitFieldSymbols.includes(char) && pattern.length < 3;
  };

  var isAmbiguousDigitPattern = function isAmbiguousDigitPattern(pattern) {
    return pattern[0] !== 'S' && pattern.length !== 2;
  };

  var possibleForParsing = true;
  var ambiguousDigitPatternsCount = 0;
  return patterns.every(function (pattern, index, patterns) {
    if (isDigitPattern(pattern)) {
      if (isAmbiguousDigitPattern(pattern)) {
        possibleForParsing = ++ambiguousDigitPatternsCount < 2;
      }

      if (!isDigitPattern(patterns[index + 1])) {
        ambiguousDigitPatternsCount = 0;
      }
    }

    return possibleForParsing;
  });
};

exports.isPossibleForParsingFormat = isPossibleForParsingFormat;

var getPatternSetters = function getPatternSetters() {
  return PATTERN_SETTERS;
};

exports.getPatternSetters = getPatternSetters;

var setPatternPart = function setPatternPart(date, pattern, text, dateParts, datePartValues) {
  var patternChar = pattern[0];
  var partSetter = PATTERN_SETTERS[patternChar];
  var partParser = PATTERN_PARSERS[patternChar];

  if (partSetter && partParser) {
    var value = partParser(text, pattern.length, dateParts);
    datePartValues[pattern] = value;

    if (date[partSetter]) {
      date[partSetter](value);
    } else {
      partSetter(date, value, datePartValues);
    }
  }
};

var setPatternPartFromNow = function setPatternPartFromNow(date, pattern, now) {
  var setterName = PATTERN_SETTERS[pattern];
  var getterName = 'g' + setterName.substr(1);
  var value = now[getterName]();
  date[setterName](value);
};

var getShortPatterns = function getShortPatterns(fullPatterns) {
  return fullPatterns.map(function (pattern) {
    if (pattern[0] === '\'') {
      return '';
    } else {
      return pattern[0] === 'H' ? 'h' : pattern[0];
    }
  });
};

var getMaxOrderedPatternIndex = function getMaxOrderedPatternIndex(patterns) {
  var indexes = patterns.map(function (pattern) {
    return ORDERED_PATTERNS.indexOf(pattern);
  });
  return Math.max.apply(Math, indexes);
};

var getOrderedFormatPatterns = function getOrderedFormatPatterns(formatPatterns) {
  var otherPatterns = formatPatterns.filter(function (pattern) {
    return ORDERED_PATTERNS.indexOf(pattern) < 0;
  });
  return ORDERED_PATTERNS.concat(otherPatterns);
};

var getParser = function getParser(format, dateParts) {
  var regExpInfo = getRegExpInfo(format, dateParts);
  return function (text) {
    var regExpResult = regExpInfo.regexp.exec(text);

    if (regExpResult) {
      var now = new Date();
      var date = new Date(now.getFullYear(), 0, 1);
      var formatPatterns = getShortPatterns(regExpInfo.patterns);
      var maxPatternIndex = getMaxOrderedPatternIndex(formatPatterns);
      var orderedFormatPatterns = getOrderedFormatPatterns(formatPatterns);
      var datePartValues = {};
      orderedFormatPatterns.forEach(function (pattern, index) {
        if (!pattern || index < ORDERED_PATTERNS.length && index > maxPatternIndex) {
          return;
        }

        var patternIndex = formatPatterns.indexOf(pattern);

        if (patternIndex >= 0) {
          var regExpPattern = regExpInfo.patterns[patternIndex];
          var regExpText = regExpResult[patternIndex + 1];
          setPatternPart(date, regExpPattern, regExpText, dateParts, datePartValues);
        } else {
          setPatternPartFromNow(date, pattern, now);
        }
      });
      return date;
    }

    return null;
  };
};

exports.getParser = getParser;