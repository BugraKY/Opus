"use strict";

exports.PANE_PADDING = void 0;
exports.adjustVisualRange = adjustVisualRange;
exports.convertAngleToRendererSpace = void 0;
exports.convertPolarToXY = convertPolarToXY;
exports.convertVisualRangeObject = convertVisualRangeObject;
exports.enumParser = exports.degreesToRadians = exports.decreaseGaps = exports.convertXYToPolar = void 0;
exports.getAddFunction = getAddFunction;
exports.getLog = exports.getDistance = exports.getDecimalOrder = exports.getCosAndSin = exports.getCategoriesInfo = exports.getAppropriateFormat = exports.getAdjustedLog10 = void 0;
exports.getLogExt = getLogExt;
exports.getVerticallyShiftedAngularCoords = exports.getPower = void 0;
exports.getVizRangeObject = getVizRangeObject;
exports.isRelativeHeightPane = isRelativeHeightPane;
exports.map = map;
exports.mergeMarginOptions = mergeMarginOptions;
exports.normalizeAngle = void 0;
exports.normalizeBBox = normalizeBBox;
exports.normalizeEnum = normalizeEnum;
exports.normalizePanesHeight = normalizePanesHeight;
exports.patchFontOptions = exports.parseScalar = void 0;
exports.pointInCanvas = pointInCanvas;
exports.raiseTo = exports.processSeriesTemplate = void 0;
exports.raiseToExt = raiseToExt;
exports.rangesAreEqual = rangesAreEqual;
exports.rotateBBox = rotateBBox;
exports.roundValue = void 0;
exports.setCanvasValues = setCanvasValues;
exports.unique = void 0;
exports.updatePanesCanvases = updatePanesCanvases;
exports.valueOf = valueOf;

var _common = require("../../core/utils/common");

var _type = require("../../core/utils/type");

var _extend = require("../../core/utils/extend");

var _iterator = require("../../core/utils/iterator");

var _math = require("../../core/utils/math");

var _date = _interopRequireDefault(require("../../core/utils/date"));

var _color = _interopRequireDefault(require("../../color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PI = Math.PI,
    LN10 = Math.LN10,
    abs = Math.abs,
    log = Math.log,
    floor = Math.floor,
    ceil = Math.ceil,
    pow = Math.pow,
    sqrt = Math.sqrt,
    atan2 = Math.atan2;
var _min = Math.min;
var _max = Math.max;
var _cos = Math.cos;
var _sin = Math.sin;
var _round = Math.round;
var dateToMilliseconds = _date.default.dateToMilliseconds;
var MAX_PIXEL_COUNT = 1E10;
var PI_DIV_180 = PI / 180;
var _isNaN = isNaN;
var _Number = Number;
var _NaN = NaN;
var PANE_PADDING = 10;
exports.PANE_PADDING = PANE_PADDING;

var getLog = function getLog(value, base) {
  if (!value) {
    return _NaN;
  }

  return log(value) / log(base);
};

exports.getLog = getLog;

var getAdjustedLog10 = function getAdjustedLog10(value) {
  return (0, _math.adjust)(getLog(value, 10));
};

exports.getAdjustedLog10 = getAdjustedLog10;

var raiseTo = function raiseTo(power, base) {
  return pow(base, power);
}; //  Translates angle to [0, 360)
//  Expects number, no validation


exports.raiseTo = raiseTo;

var normalizeAngle = function normalizeAngle(angle) {
  return (angle % 360 + 360) % 360;
}; //  Maps angle in trigonometric space to angle in 'renderer' space
//  Expects numbers, no validation


exports.normalizeAngle = normalizeAngle;

var convertAngleToRendererSpace = function convertAngleToRendererSpace(angle) {
  return 90 - angle;
}; //  Maps angle in degrees to angle in radians
//  Expects number, no validation


exports.convertAngleToRendererSpace = convertAngleToRendererSpace;

var degreesToRadians = function degreesToRadians(value) {
  return PI * value / 180;
}; //  Calculates sin and cos for <angle> in degrees
//  Expects number, no validation


exports.degreesToRadians = degreesToRadians;

var getCosAndSin = function getCosAndSin(angle) {
  var angleInRadians = degreesToRadians(angle);
  return {
    cos: _cos(angleInRadians),
    sin: _sin(angleInRadians)
  };
}; //  Because Math.log(1000) / Math.LN10 < 3 though it is exactly 3
//  Same happens for 1E6, 1E9, 1E12, 1E13, 1E15, ...


exports.getCosAndSin = getCosAndSin;
var DECIMAL_ORDER_THRESHOLD = 1E-14; //    ____________________
//   /       2          2
// \/ (y2-y1)  + (x2-x1)

var getDistance = function getDistance(x1, y1, x2, y2) {
  var diffX = x2 - x1;
  var diffY = y2 - y1;
  return sqrt(diffY * diffY + diffX * diffX);
};

exports.getDistance = getDistance;

var getDecimalOrder = function getDecimalOrder(number) {
  var n = abs(number);
  var cn;

  if (!_isNaN(n)) {
    if (n > 0) {
      n = log(n) / LN10;
      cn = ceil(n);
      return cn - n < DECIMAL_ORDER_THRESHOLD ? cn : floor(n);
    }

    return 0;
  }

  return _NaN;
};

exports.getDecimalOrder = getDecimalOrder;

var getAppropriateFormat = function getAppropriateFormat(start, end, count) {
  var order = _max(getDecimalOrder(start), getDecimalOrder(end));

  var precision = -getDecimalOrder(abs(end - start) / count);
  var format;

  if (!_isNaN(order) && !_isNaN(precision)) {
    if (abs(order) <= 4) {
      format = 'fixedPoint';
      precision < 0 && (precision = 0);
      precision > 4 && (precision = 4);
    } else {
      format = 'exponential';
      precision += order - 1;
      precision > 3 && (precision = 3);
    }

    return {
      type: format,
      precision: precision
    };
  }

  return null;
};

exports.getAppropriateFormat = getAppropriateFormat;

var roundValue = function roundValue(value, precision) {
  if (precision > 20) {
    precision = 20;
  }

  if ((0, _type.isNumeric)(value)) {
    if ((0, _type.isExponential)(value)) {
      return _Number(value.toExponential(precision));
    } else {
      return _Number(value.toFixed(precision));
    }
  }
};

exports.roundValue = roundValue;

var getPower = function getPower(value) {
  return value.toExponential().split('e')[1];
};

exports.getPower = getPower;

function map(array, callback) {
  var i = 0;
  var len = array.length;
  var result = [];
  var value;

  while (i < len) {
    value = callback(array[i], i);

    if (value !== null) {
      result.push(value);
    }

    i++;
  }

  return result;
}

function selectByKeys(object, keys) {
  return map(keys, function (key) {
    return object[key] ? object[key] : null;
  });
}

function decreaseFields(object, keys, eachDecrease, decrease) {
  var dec = decrease;
  (0, _iterator.each)(keys, function (_, key) {
    if (object[key]) {
      object[key] -= eachDecrease;
      dec -= eachDecrease;
    }
  });
  return dec;
}

function normalizeEnum(value) {
  return String(value).toLowerCase();
}

function setCanvasValues(canvas) {
  if (canvas) {
    canvas.originalTop = canvas.top;
    canvas.originalBottom = canvas.bottom;
    canvas.originalLeft = canvas.left;
    canvas.originalRight = canvas.right;
  }

  return canvas;
}

function normalizeBBoxField(value) {
  return -MAX_PIXEL_COUNT < value && value < +MAX_PIXEL_COUNT ? value : 0;
}

function normalizeBBox(bBox) {
  var xl = normalizeBBoxField(floor(bBox.x));
  var yt = normalizeBBoxField(floor(bBox.y));
  var xr = normalizeBBoxField(ceil(bBox.width + bBox.x));
  var yb = normalizeBBoxField(ceil(bBox.height + bBox.y));
  var result = {
    x: xl,
    y: yt,
    width: xr - xl,
    height: yb - yt
  };
  result.isEmpty = !result.x && !result.y && !result.width && !result.height;
  return result;
} // Angle is expected to be from right-handed cartesian (not svg) space - positive is counterclockwise


function rotateBBox(bBox, center, angle) {
  var cos = _Number(_cos(angle * PI_DIV_180).toFixed(3));

  var sin = _Number(_sin(angle * PI_DIV_180).toFixed(3));

  var w2 = bBox.width / 2;
  var h2 = bBox.height / 2;
  var centerX = bBox.x + w2;
  var centerY = bBox.y + h2;
  var w2_ = abs(w2 * cos) + abs(h2 * sin);
  var h2_ = abs(w2 * sin) + abs(h2 * cos); // Note that the following slightly differs from theoretical formula:
  // x' = x * cos - y * sin, y' = x * sin + y * cos
  // That is because in svg y goes down (not up) - so sign of sin is reverted
  // x' = x * cos + y * sin, y' = -x * sin + y * cos

  var centerX_ = center[0] + (centerX - center[0]) * cos + (centerY - center[1]) * sin;
  var centerY_ = center[1] - (centerX - center[0]) * sin + (centerY - center[1]) * cos;
  return normalizeBBox({
    x: centerX_ - w2_,
    y: centerY_ - h2_,
    width: 2 * w2_,
    height: 2 * h2_
  });
}

var decreaseGaps = function decreaseGaps(object, keys, decrease) {
  var arrayGaps;

  do {
    arrayGaps = selectByKeys(object, keys);
    arrayGaps.push(ceil(decrease / arrayGaps.length));
    decrease = decreaseFields(object, keys, _min.apply(null, arrayGaps), decrease);
  } while (decrease > 0 && arrayGaps.length > 1);

  return decrease;
};

exports.decreaseGaps = decreaseGaps;

var parseScalar = function parseScalar(value, defaultValue) {
  return value !== undefined ? value : defaultValue;
};

exports.parseScalar = parseScalar;

var enumParser = function enumParser(values) {
  var stored = {};
  var i;
  var ii;

  for (i = 0, ii = values.length; i < ii; ++i) {
    stored[normalizeEnum(values[i])] = 1;
  }

  return function (value, defaultValue) {
    var _value = normalizeEnum(value);

    return stored[_value] ? _value : defaultValue;
  };
};

exports.enumParser = enumParser;

var patchFontOptions = function patchFontOptions(options) {
  var fontOptions = {};
  (0, _iterator.each)(options || {}, function (key, value) {
    if (/^(cursor)$/i.test(key)) {// TODO check other properties, add tests
    } else if (key === 'opacity') {
      value = null;
    } else if (key === 'color') {
      key = 'fill';

      if ('opacity' in options) {
        var color = new _color.default(value);
        value = "rgba(".concat(color.r, ",").concat(color.g, ",").concat(color.b, ",").concat(options.opacity, ")");
      }
    } else {
      key = 'font-' + key;
    }

    fontOptions[key] = value;
  });
  return fontOptions;
};

exports.patchFontOptions = patchFontOptions;

function convertPolarToXY(centerCoords, startAngle, angle, radius) {
  var shiftAngle = 90;
  var normalizedRadius = radius > 0 ? radius : 0;
  angle = (0, _type.isDefined)(angle) ? angle + startAngle - shiftAngle : 0;
  var cosSin = getCosAndSin(angle);
  return {
    x: _round(centerCoords.x + normalizedRadius * cosSin.cos),
    y: _round(centerCoords.y + normalizedRadius * cosSin.sin)
  };
}

var convertXYToPolar = function convertXYToPolar(centerCoords, x, y) {
  var radius = getDistance(centerCoords.x, centerCoords.y, x, y);
  var angle = atan2(y - centerCoords.y, x - centerCoords.x);
  return {
    phi: _round(normalizeAngle(angle * 180 / PI)),
    r: _round(radius)
  };
};

exports.convertXYToPolar = convertXYToPolar;

var processSeriesTemplate = function processSeriesTemplate(seriesTemplate, items) {
  var customizeSeries = (0, _type.isFunction)(seriesTemplate.customizeSeries) ? seriesTemplate.customizeSeries : _common.noop;
  var nameField = seriesTemplate.nameField;
  var generatedSeries = {};
  var seriesOrder = [];
  var series;
  var i = 0;
  var length;
  var data;
  items = items || [];

  for (length = items.length; i < length; i++) {
    data = items[i];

    if (nameField in data) {
      series = generatedSeries[data[nameField]];

      if (!series) {
        series = generatedSeries[data[nameField]] = {
          name: data[nameField],
          nameFieldValue: data[nameField]
        };
        seriesOrder.push(series.name);
      }
    }
  }

  return map(seriesOrder, function (orderedName) {
    var group = generatedSeries[orderedName];
    return (0, _extend.extend)(group, customizeSeries.call(null, group.name));
  });
};

exports.processSeriesTemplate = processSeriesTemplate;

var getCategoriesInfo = function getCategoriesInfo(categories, startValue, endValue) {
  if (categories.length === 0) {
    return {
      categories: []
    };
  }

  startValue = (0, _type.isDefined)(startValue) ? startValue : categories[0];
  endValue = (0, _type.isDefined)(endValue) ? endValue : categories[categories.length - 1];
  var categoriesValue = map(categories, function (category) {
    return category === null || category === void 0 ? void 0 : category.valueOf();
  });
  var indexStartValue = categoriesValue.indexOf(startValue.valueOf());
  var indexEndValue = categoriesValue.indexOf(endValue.valueOf());
  var swapBuf;
  var inverted = false;
  indexStartValue < 0 && (indexStartValue = 0);
  indexEndValue < 0 && (indexEndValue = categories.length - 1);

  if (indexEndValue < indexStartValue) {
    swapBuf = indexEndValue;
    indexEndValue = indexStartValue;
    indexStartValue = swapBuf;
    inverted = true;
  }

  var visibleCategories = categories.slice(indexStartValue, indexEndValue + 1);
  var lastIdx = visibleCategories.length - 1;
  return {
    categories: visibleCategories,
    start: visibleCategories[inverted ? lastIdx : 0],
    end: visibleCategories[inverted ? 0 : lastIdx],
    inverted: inverted
  };
};

exports.getCategoriesInfo = getCategoriesInfo;

function isRelativeHeightPane(pane) {
  return !(pane.unit % 2);
}

function normalizePanesHeight(panes) {
  panes.forEach(function (pane) {
    var height = pane.height;
    var unit = 0;
    var parsedHeight = parseFloat(height) || undefined;

    if ((0, _type.isString)(height) && height.indexOf('px') > -1 || (0, _type.isNumeric)(height) && height > 1) {
      parsedHeight = _round(parsedHeight);
      unit = 1;
    }

    if (!unit && parsedHeight) {
      if ((0, _type.isString)(height) && height.indexOf('%') > -1) {
        parsedHeight = parsedHeight / 100;
        unit = 2;
      } else if (parsedHeight < 0) {
        parsedHeight = parsedHeight < -1 ? 1 : abs(parsedHeight);
      }
    }

    pane.height = parsedHeight;
    pane.unit = unit;
  });
  var relativeHeightPanes = panes.filter(isRelativeHeightPane);
  var weightSum = relativeHeightPanes.reduce(function (prev, next) {
    return prev + (next.height || 0);
  }, 0);
  var weightHeightCount = relativeHeightPanes.length;
  var emptyHeightPanes = relativeHeightPanes.filter(function (pane) {
    return !pane.height;
  });
  var emptyHeightCount = emptyHeightPanes.length;

  if (weightSum < 1 && emptyHeightCount) {
    emptyHeightPanes.forEach(function (pane) {
      return pane.height = (1 - weightSum) / emptyHeightCount;
    });
  } else if (weightSum > 1 || weightSum < 1 && !emptyHeightCount || weightSum === 1 && emptyHeightCount) {
    if (emptyHeightCount) {
      var weightForEmpty = weightSum / weightHeightCount;
      var emptyWeightSum = emptyHeightCount * weightForEmpty;
      relativeHeightPanes.filter(function (pane) {
        return pane.height;
      }).forEach(function (pane) {
        return pane.height *= (weightSum - emptyWeightSum) / weightSum;
      });
      emptyHeightPanes.forEach(function (pane) {
        return pane.height = weightForEmpty;
      });
    }

    relativeHeightPanes.forEach(function (pane) {
      return pane.height *= 1 / weightSum;
    });
  }
}

function updatePanesCanvases(panes, canvas, rotated) {
  var distributedSpace = 0;
  var padding = PANE_PADDING;
  var paneSpace = rotated ? canvas.width - canvas.left - canvas.right : canvas.height - canvas.top - canvas.bottom;
  var totalCustomSpace = panes.reduce(function (prev, cur) {
    return prev + (!isRelativeHeightPane(cur) ? cur.height : 0);
  }, 0);
  var usefulSpace = paneSpace - padding * (panes.length - 1) - totalCustomSpace;
  var startName = rotated ? 'left' : 'top';
  var endName = rotated ? 'right' : 'bottom';
  panes.forEach(function (pane) {
    var calcLength = !isRelativeHeightPane(pane) ? pane.height : _round(pane.height * usefulSpace);
    pane.canvas = pane.canvas || {};
    (0, _extend.extend)(pane.canvas, canvas);
    pane.canvas[startName] = canvas[startName] + distributedSpace;
    pane.canvas[endName] = canvas[endName] + (paneSpace - calcLength - distributedSpace);
    distributedSpace = distributedSpace + calcLength + padding;
    setCanvasValues(pane.canvas);
  });
}

var unique = function unique(array) {
  var values = {};
  return map(array, function (item) {
    var result = !values[item] ? item : null;
    values[item] = true;
    return result;
  });
};

exports.unique = unique;

var getVerticallyShiftedAngularCoords = function getVerticallyShiftedAngularCoords(bBox, dy, center) {
  // TODO: Use center instead of left top corner - that is more correct and allows to get rid of "isPositive"
  //   horizontalOffset1 = bBox.x + bBox.width / 2 - center.x
  //   horizontalOffset2 = bBox.y + bBox.height / 2 - center.y
  //   verticalOffset2 = newCoord.y + bBox.height / 2 - center.y
  var isPositive = bBox.x + bBox.width / 2 >= center.x;
  var horizontalOffset1 = (isPositive ? bBox.x : bBox.x + bBox.width) - center.x;
  var verticalOffset1 = bBox.y - center.y;
  var verticalOffset2 = verticalOffset1 + dy;

  var horizontalOffset2 = _round(sqrt(horizontalOffset1 * horizontalOffset1 + verticalOffset1 * verticalOffset1 - verticalOffset2 * verticalOffset2));

  var dx = (isPositive ? +horizontalOffset2 : -horizontalOffset2) || horizontalOffset1;
  return {
    x: center.x + (isPositive ? dx : dx - bBox.width),
    y: bBox.y + dy
  };
};

exports.getVerticallyShiftedAngularCoords = getVerticallyShiftedAngularCoords;

function mergeMarginOptions(opt1, opt2) {
  return {
    checkInterval: opt1.checkInterval || opt2.checkInterval,
    size: _max(opt1.size || 0, opt2.size || 0),
    percentStick: opt1.percentStick || opt2.percentStick,
    sizePointNormalState: _max(opt1.sizePointNormalState || 0, opt2.sizePointNormalState || 0)
  };
}

function getVizRangeObject(value) {
  if (Array.isArray(value)) {
    return {
      startValue: value[0],
      endValue: value[1]
    };
  } else {
    return value || {};
  }
}

function convertVisualRangeObject(visualRange, convertToVisualRange) {
  if (convertToVisualRange) {
    return visualRange;
  }

  return [visualRange.startValue, visualRange.endValue];
}

function getAddFunction(range, correctZeroLevel) {
  // T170398
  if (range.dataType === 'datetime') {
    return function (rangeValue, marginValue) {
      var sign = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      return new Date(rangeValue.getTime() + sign * marginValue);
    };
  }

  if (range.axisType === 'logarithmic') {
    return function (rangeValue, marginValue) {
      var sign = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var log = getLogExt(rangeValue, range.base) + sign * marginValue;
      return raiseToExt(log, range.base);
    };
  }

  return function (rangeValue, marginValue) {
    var sign = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var newValue = rangeValue + sign * marginValue;
    return correctZeroLevel && newValue * rangeValue <= 0 ? 0 : newValue;
  };
}

function adjustVisualRange(options, visualRange, wholeRange, dataRange) {
  var minDefined = (0, _type.isDefined)(visualRange.startValue);
  var maxDefined = (0, _type.isDefined)(visualRange.endValue);
  var nonDiscrete = options.axisType !== 'discrete';
  dataRange = dataRange || wholeRange;
  var add = getAddFunction(options, false);
  var min = minDefined ? visualRange.startValue : dataRange.min;
  var max = maxDefined ? visualRange.endValue : dataRange.max;
  var rangeLength = visualRange.length;
  var categories = dataRange.categories;

  if (nonDiscrete && !(0, _type.isDefined)(min) && !(0, _type.isDefined)(max)) {
    return {
      startValue: min,
      endValue: max
    };
  }

  if ((0, _type.isDefined)(rangeLength)) {
    if (nonDiscrete) {
      if (options.dataType === 'datetime' && !(0, _type.isNumeric)(rangeLength)) {
        rangeLength = dateToMilliseconds(rangeLength);
      }

      if (maxDefined && !minDefined || !maxDefined && !minDefined) {
        (0, _type.isDefined)(wholeRange.max) && (max = max > wholeRange.max ? wholeRange.max : max);
        min = add(max, rangeLength, -1);
      } else if (minDefined && !maxDefined) {
        (0, _type.isDefined)(wholeRange.min) && (min = min < wholeRange.min ? wholeRange.min : min);
        max = add(min, rangeLength);
      }
    } else {
      rangeLength = parseInt(rangeLength);

      if (!isNaN(rangeLength) && isFinite(rangeLength)) {
        rangeLength--;

        if (!maxDefined && !minDefined) {
          max = categories[categories.length - 1];
          min = categories[categories.length - 1 - rangeLength];
        } else if (minDefined && !maxDefined) {
          var categoriesInfo = getCategoriesInfo(categories, min, undefined);
          max = categoriesInfo.categories[rangeLength];
        } else if (!minDefined && maxDefined) {
          var _categoriesInfo = getCategoriesInfo(categories, undefined, max);

          min = _categoriesInfo.categories[_categoriesInfo.categories.length - 1 - rangeLength];
        }
      }
    }
  }

  if (nonDiscrete) {
    if ((0, _type.isDefined)(wholeRange.max) && max > wholeRange.max) {
      max = wholeRange.max;
    }

    if ((0, _type.isDefined)(wholeRange.min) && min < wholeRange.min) {
      min = wholeRange.min;
    }
  }

  return {
    startValue: min,
    endValue: max
  };
}

function getLogExt(value, base) {
  var allowNegatives = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var linearThreshold = arguments.length > 3 ? arguments[3] : undefined;

  if (!allowNegatives) {
    return getLog(value, base);
  }

  if (value === 0) {
    return 0;
  }

  var transformValue = getLog(abs(value), base) - (linearThreshold - 1);

  if (transformValue < 0) {
    return 0;
  }

  return (0, _math.adjust)((0, _math.sign)(value) * transformValue, Number(pow(base, linearThreshold - 1).toFixed(abs(linearThreshold))));
}

function raiseToExt(value, base) {
  var allowNegatives = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var linearThreshold = arguments.length > 3 ? arguments[3] : undefined;

  if (!allowNegatives) {
    return raiseTo(value, base);
  }

  if (value === 0) {
    return 0;
  }

  var transformValue = raiseTo(abs(value) + (linearThreshold - 1), base);

  if (transformValue < 0) {
    return 0;
  }

  return (0, _math.adjust)((0, _math.sign)(value) * transformValue, Number(pow(base, linearThreshold).toFixed(abs(linearThreshold))));
}

function rangesAreEqual(range, rangeFromOptions) {
  if (Array.isArray(rangeFromOptions)) {
    return range.length === rangeFromOptions.length && range.every(function (item, i) {
      return valueOf(item) === valueOf(rangeFromOptions[i]);
    });
  } else {
    return valueOf(range.startValue) === valueOf(rangeFromOptions.startValue) && valueOf(range.endValue) === valueOf(rangeFromOptions.endValue);
  }
}

function valueOf(value) {
  return value && value.valueOf();
}

function pointInCanvas(canvas, x, y) {
  return x >= canvas.left && x <= canvas.right && y >= canvas.top && y <= canvas.bottom;
}