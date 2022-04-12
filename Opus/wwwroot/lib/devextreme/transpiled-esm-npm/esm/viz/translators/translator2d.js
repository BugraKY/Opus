import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { Range } from './range';
import categoryTranslator from './category_translator';
import intervalTranslator from './interval_translator';
import datetimeTranslator from './datetime_translator';
import logarithmicTranslator from './logarithmic_translator';
import { getLogExt as getLog, getPower, raiseToExt, getCategoriesInfo } from '../core/utils';
import { isDefined, isDate } from '../../core/utils/type';
import { adjust } from '../../core/utils/math';
import dateUtils from '../../core/utils/date';
var _abs = Math.abs;
var CANVAS_PROP = ['width', 'height', 'left', 'top', 'bottom', 'right'];
var dummyTranslator = {
  to(value) {
    var coord = this._canvasOptions.startPoint + (this._options.conversionValue ? value : Math.round(value));
    return coord > this._canvasOptions.endPoint ? this._canvasOptions.endPoint : coord;
  },

  from(value) {
    return value - this._canvasOptions.startPoint;
  }

};

var validateCanvas = function validateCanvas(canvas) {
  each(CANVAS_PROP, function (_, prop) {
    canvas[prop] = parseInt(canvas[prop]) || 0;
  });
  return canvas;
};

var makeCategoriesToPoints = function makeCategoriesToPoints(categories) {
  var categoriesToPoints = {};
  categories.forEach(function (item, i) {
    categoriesToPoints[item.valueOf()] = i;
  });
  return categoriesToPoints;
};

var validateBusinessRange = function validateBusinessRange(businessRange) {
  if (!(businessRange instanceof Range)) {
    businessRange = new Range(businessRange);
  }

  function validate(valueSelector, baseValueSelector) {
    if (!isDefined(businessRange[valueSelector]) && isDefined(businessRange[baseValueSelector])) {
      businessRange[valueSelector] = businessRange[baseValueSelector];
    }
  }

  validate('minVisible', 'min');
  validate('maxVisible', 'max');
  return businessRange;
};

function prepareBreaks(breaks, range) {
  var transform = range.axisType === 'logarithmic' ? function (value) {
    return getLog(value, range.base);
  } : function (value) {
    return value;
  };
  var array = [];
  var br;
  var transformFrom;
  var transformTo;
  var i;
  var length = breaks.length;
  var sum = 0;

  for (i = 0; i < length; i++) {
    br = breaks[i];
    transformFrom = transform(br.from);
    transformTo = transform(br.to);
    sum += transformTo - transformFrom;
    array.push({
      trFrom: transformFrom,
      trTo: transformTo,
      from: br.from,
      to: br.to,
      length: sum,
      cumulativeWidth: br.cumulativeWidth
    });
  }

  return array;
}

function getCanvasBounds(range) {
  var min = range.min;
  var max = range.max;
  var minVisible = range.minVisible;
  var maxVisible = range.maxVisible;
  var isLogarithmic = range.axisType === 'logarithmic';

  if (isLogarithmic) {
    maxVisible = getLog(maxVisible, range.base, range.allowNegatives, range.linearThreshold);
    minVisible = getLog(minVisible, range.base, range.allowNegatives, range.linearThreshold);
    min = getLog(min, range.base, range.allowNegatives, range.linearThreshold);
    max = getLog(max, range.base, range.allowNegatives, range.linearThreshold);
  }

  return {
    base: range.base,
    rangeMin: min,
    rangeMax: max,
    rangeMinVisible: minVisible,
    rangeMaxVisible: maxVisible
  };
}

function getCheckingMethodsAboutBreaks(inverted) {
  return {
    isStartSide: !inverted ? function (pos, breaks, start, end) {
      return pos < breaks[0][start];
    } : function (pos, breaks, start, end) {
      return pos <= breaks[breaks.length - 1][end];
    },
    isEndSide: !inverted ? function (pos, breaks, start, end) {
      return pos >= breaks[breaks.length - 1][end];
    } : function (pos, breaks, start, end) {
      return pos > breaks[0][start];
    },
    isInBreak: !inverted ? function (pos, br, start, end) {
      return pos >= br[start] && pos < br[end];
    } : function (pos, br, start, end) {
      return pos > br[end] && pos <= br[start];
    },
    isBetweenBreaks: !inverted ? function (pos, br, prevBreak, start, end) {
      return pos < br[start] && pos >= prevBreak[end];
    } : function (pos, br, prevBreak, start, end) {
      return pos >= br[end] && pos < prevBreak[start];
    },
    getLength: !inverted ? function (br) {
      return br.length;
    } : function (br, lastBreak) {
      return lastBreak.length - br.length;
    },
    getBreaksSize: !inverted ? function (br) {
      return br.cumulativeWidth;
    } : function (br, lastBreak) {
      return lastBreak.cumulativeWidth - br.cumulativeWidth;
    }
  };
}

var _Translator2d = function _Translator2d(businessRange, canvas, options) {
  this.update(businessRange, canvas, options);
};

_Translator2d.prototype = {
  constructor: _Translator2d,
  reinit: function reinit() {
    // TODO: parseInt canvas
    var that = this;
    var options = that._options;
    var range = that._businessRange;
    var categories = range.categories || [];
    var script = {};

    var canvasOptions = that._prepareCanvasOptions();

    var visibleCategories = getCategoriesInfo(categories, range.minVisible, range.maxVisible).categories;
    var categoriesLength = visibleCategories.length;

    if (range.isEmpty()) {
      script = dummyTranslator;
    } else {
      switch (range.axisType) {
        case 'logarithmic':
          script = logarithmicTranslator;
          break;

        case 'semidiscrete':
          script = intervalTranslator;
          canvasOptions.ratioOfCanvasRange = canvasOptions.canvasLength / (dateUtils.addInterval(canvasOptions.rangeMaxVisible, options.interval) - canvasOptions.rangeMinVisible);
          break;

        case 'discrete':
          script = categoryTranslator;
          that._categories = categories;
          canvasOptions.interval = that._getDiscreteInterval(options.addSpiderCategory ? categoriesLength + 1 : categoriesLength, canvasOptions);
          that._categoriesToPoints = makeCategoriesToPoints(categories);

          if (categoriesLength) {
            canvasOptions.startPointIndex = that._categoriesToPoints[visibleCategories[0].valueOf()];
            that.visibleCategories = visibleCategories;
          }

          break;

        default:
          if (range.dataType === 'datetime') {
            script = datetimeTranslator;
          }

      }
    }

    (that._oldMethods || []).forEach(function (methodName) {
      delete that[methodName];
    });
    that._oldMethods = Object.keys(script);
    extend(that, script);
    that._conversionValue = options.conversionValue ? function (value) {
      return value;
    } : function (value) {
      return Math.round(value);
    };
    that.sc = {};
    that._checkingMethodsAboutBreaks = [getCheckingMethodsAboutBreaks(false), getCheckingMethodsAboutBreaks(that.isInverted())];

    that._translateBreaks();

    that._calculateSpecialValues();
  },
  _translateBreaks: function _translateBreaks() {
    var breaks = this._breaks;
    var size = this._options.breaksSize;
    var i;
    var b;
    var end;
    var length;

    if (breaks === undefined) {
      return;
    }

    for (i = 0, length = breaks.length; i < length; i++) {
      b = breaks[i];
      end = this.translate(b.to);
      b.end = end;
      b.start = !b.gapSize ? !this.isInverted() ? end - size : end + size : end;
    }
  },
  _checkValueAboutBreaks: function _checkValueAboutBreaks(breaks, pos, start, end, methods) {
    var i;
    var length;
    var prop = {
      length: 0,
      breaksSize: undefined,
      inBreak: false
    };
    var br;
    var prevBreak;
    var lastBreak = breaks[breaks.length - 1];

    if (methods.isStartSide(pos, breaks, start, end)) {
      return prop;
    } else if (methods.isEndSide(pos, breaks, start, end)) {
      return {
        length: lastBreak.length,
        breaksSize: lastBreak.cumulativeWidth,
        inBreak: false
      };
    }

    for (i = 0, length = breaks.length; i < length; i++) {
      br = breaks[i];
      prevBreak = breaks[i - 1];

      if (methods.isInBreak(pos, br, start, end)) {
        prop.inBreak = true;
        prop.break = br;
        break;
      }

      if (prevBreak && methods.isBetweenBreaks(pos, br, prevBreak, start, end)) {
        prop = {
          length: methods.getLength(prevBreak, lastBreak),
          breaksSize: methods.getBreaksSize(prevBreak, lastBreak),
          inBreak: false
        };
        break;
      }
    }

    return prop;
  },
  isInverted: function isInverted() {
    return !(this._options.isHorizontal ^ this._businessRange.invert);
  },
  _getDiscreteInterval: function _getDiscreteInterval(categoriesLength, canvasOptions) {
    var correctedCategoriesCount = categoriesLength - (this._options.stick ? 1 : 0);
    return correctedCategoriesCount > 0 ? canvasOptions.canvasLength / correctedCategoriesCount : canvasOptions.canvasLength;
  },

  _prepareCanvasOptions() {
    var that = this;
    var businessRange = that._businessRange;
    var canvasOptions = that._canvasOptions = getCanvasBounds(businessRange);
    var canvas = that._canvas;
    var breaks = that._breaks;
    var length;
    canvasOptions.startPadding = canvas.startPadding || 0;
    canvasOptions.endPadding = canvas.endPadding || 0;

    if (that._options.isHorizontal) {
      canvasOptions.startPoint = canvas.left + canvasOptions.startPadding;
      length = canvas.width;
      canvasOptions.endPoint = canvas.width - canvas.right - canvasOptions.endPadding;
      canvasOptions.invert = businessRange.invert;
    } else {
      canvasOptions.startPoint = canvas.top + canvasOptions.startPadding;
      length = canvas.height;
      canvasOptions.endPoint = canvas.height - canvas.bottom - canvasOptions.endPadding;
      canvasOptions.invert = !businessRange.invert; // axis inverted because display drawn to bottom
    }

    that.canvasLength = canvasOptions.canvasLength = canvasOptions.endPoint - canvasOptions.startPoint;
    canvasOptions.rangeDoubleError = Math.pow(10, getPower(canvasOptions.rangeMax - canvasOptions.rangeMin) - getPower(length) - 2); // B253861

    canvasOptions.ratioOfCanvasRange = canvasOptions.canvasLength / (canvasOptions.rangeMaxVisible - canvasOptions.rangeMinVisible);

    if (breaks !== undefined) {
      canvasOptions.ratioOfCanvasRange = (canvasOptions.canvasLength - breaks[breaks.length - 1].cumulativeWidth) / (canvasOptions.rangeMaxVisible - canvasOptions.rangeMinVisible - breaks[breaks.length - 1].length);
    }

    return canvasOptions;
  },

  updateCanvas: function updateCanvas(canvas) {
    this._canvas = validateCanvas(canvas);
    this.reinit();
  },
  updateBusinessRange: function updateBusinessRange(businessRange) {
    var that = this;
    var breaks = businessRange.breaks || [];
    that._userBreaks = businessRange.userBreaks || [];
    that._businessRange = validateBusinessRange(businessRange);
    that._breaks = breaks.length ? prepareBreaks(breaks, that._businessRange) : undefined;
    that.reinit();
  },
  update: function update(businessRange, canvas, options) {
    var that = this;
    that._options = extend(that._options || {}, options);
    that._canvas = validateCanvas(canvas);
    that.updateBusinessRange(businessRange);
  },
  getBusinessRange: function getBusinessRange() {
    return this._businessRange;
  },
  getEventScale: function getEventScale(zoomEvent) {
    return zoomEvent.deltaScale || 1;
  },
  getCanvasVisibleArea: function getCanvasVisibleArea() {
    return {
      min: this._canvasOptions.startPoint,
      max: this._canvasOptions.endPoint
    };
  },
  _calculateSpecialValues: function _calculateSpecialValues() {
    var that = this;
    var canvasOptions = that._canvasOptions;
    var startPoint = canvasOptions.startPoint - canvasOptions.startPadding;
    var endPoint = canvasOptions.endPoint + canvasOptions.endPadding;
    var range = that._businessRange;
    var minVisible = range.minVisible;
    var maxVisible = range.maxVisible;
    var canvas_position_center_middle = startPoint + canvasOptions.canvasLength / 2;
    var canvas_position_default;

    if (minVisible < 0 && maxVisible > 0 && minVisible !== maxVisible) {
      canvas_position_default = that.translate(0, 1);
    }

    if (!isDefined(canvas_position_default)) {
      var invert = range.invert ^ (minVisible < 0 && maxVisible <= 0);

      if (that._options.isHorizontal) {
        canvas_position_default = invert ? endPoint : startPoint;
      } else {
        canvas_position_default = invert ? startPoint : endPoint;
      }
    }

    that.sc = {
      'canvas_position_default': canvas_position_default,
      'canvas_position_left': startPoint,
      'canvas_position_top': startPoint,
      'canvas_position_center': canvas_position_center_middle,
      'canvas_position_middle': canvas_position_center_middle,
      'canvas_position_right': endPoint,
      'canvas_position_bottom': endPoint,
      'canvas_position_start': canvasOptions.invert ? endPoint : startPoint,
      'canvas_position_end': canvasOptions.invert ? startPoint : endPoint
    };
  },

  translateSpecialCase(value) {
    return this.sc[value];
  },

  _calculateProjection: function _calculateProjection(distance) {
    var canvasOptions = this._canvasOptions;
    return canvasOptions.invert ? canvasOptions.endPoint - distance : canvasOptions.startPoint + distance;
  },
  _calculateUnProjection: function _calculateUnProjection(distance) {
    var canvasOptions = this._canvasOptions;
    this._businessRange.dataType === 'datetime' && (distance = Math.round(distance));
    return canvasOptions.invert ? canvasOptions.rangeMaxVisible.valueOf() - distance : canvasOptions.rangeMinVisible.valueOf() + distance;
  },
  getMinBarSize: function getMinBarSize(minBarSize) {
    var visibleArea = this.getCanvasVisibleArea();
    var minValue = this.from(visibleArea.min + minBarSize);
    return _abs(this.from(visibleArea.min) - (!isDefined(minValue) ? this.from(visibleArea.max) : minValue));
  },
  checkMinBarSize: function checkMinBarSize(value, minShownValue, stackValue) {
    return _abs(value) < minShownValue ? value >= 0 ? minShownValue : -minShownValue : value;
  },

  translate(bp, direction) {
    var specialValue = this.translateSpecialCase(bp);

    if (isDefined(specialValue)) {
      return Math.round(specialValue);
    }

    if (isNaN(bp)) {
      return null;
    }

    return this.to(bp, direction);
  },

  getInterval: function getInterval(interval) {
    var _interval;

    var canvasOptions = this._canvasOptions;
    interval = (_interval = interval) !== null && _interval !== void 0 ? _interval : this._businessRange.interval;

    if (interval) {
      return Math.round(canvasOptions.ratioOfCanvasRange * interval);
    }

    return Math.round(canvasOptions.endPoint - canvasOptions.startPoint);
  },

  zoom(translate, scale, wholeRange) {
    var canvasOptions = this._canvasOptions;

    if (canvasOptions.rangeMinVisible.valueOf() === canvasOptions.rangeMaxVisible.valueOf() && translate !== 0) {
      return this.zoomZeroLengthRange(translate, scale);
    }

    var startPoint = canvasOptions.startPoint;
    var endPoint = canvasOptions.endPoint;
    var isInverted = this.isInverted();
    var newStart = (startPoint + translate) / scale;
    var newEnd = (endPoint + translate) / scale;
    wholeRange = wholeRange || {};
    var minPoint = this.to(isInverted ? wholeRange.endValue : wholeRange.startValue);
    var maxPoint = this.to(isInverted ? wholeRange.startValue : wholeRange.endValue);
    var min;
    var max;

    if (minPoint > newStart) {
      newEnd -= newStart - minPoint;
      newStart = minPoint;
      min = isInverted ? wholeRange.endValue : wholeRange.startValue;
    }

    if (maxPoint < newEnd) {
      newStart -= newEnd - maxPoint;
      newEnd = maxPoint;
      max = isInverted ? wholeRange.startValue : wholeRange.endValue;
    }

    if (maxPoint - minPoint < newEnd - newStart) {
      newStart = minPoint;
      newEnd = maxPoint;
    }

    translate = (endPoint - startPoint) * newStart / (newEnd - newStart) - startPoint;
    scale = (startPoint + translate) / newStart || 1;
    min = isDefined(min) ? min : adjust(this.from(newStart, 1));
    max = isDefined(max) ? max : adjust(this.from(newEnd, -1));

    if (scale <= 1) {
      min = this._correctValueAboutBreaks(min, scale === 1 ? translate : -1);
      max = this._correctValueAboutBreaks(max, scale === 1 ? translate : 1);
    }

    if (min > max) {
      min = min > wholeRange.endValue ? wholeRange.endValue : min;
      max = max < wholeRange.startValue ? wholeRange.startValue : max;
    } else {
      min = min < wholeRange.startValue ? wholeRange.startValue : min;
      max = max > wholeRange.endValue ? wholeRange.endValue : max;
    }

    return {
      min,
      max,
      translate: adjust(translate),
      scale: adjust(scale)
    };
  },

  _correctValueAboutBreaks(value, direction) {
    var br = this._userBreaks.filter(br => {
      return value >= br.from && value <= br.to;
    });

    if (br.length) {
      return direction > 0 ? br[0].to : br[0].from;
    } else {
      return value;
    }
  },

  zoomZeroLengthRange(translate, scale) {
    var canvasOptions = this._canvasOptions;
    var min = canvasOptions.rangeMin;
    var max = canvasOptions.rangeMax;
    var correction = (max.valueOf() !== min.valueOf() ? max.valueOf() - min.valueOf() : _abs(canvasOptions.rangeMinVisible.valueOf() - min.valueOf())) / canvasOptions.canvasLength;
    var isDateTime = isDate(max) || isDate(min);
    var isLogarithmic = this._businessRange.axisType === 'logarithmic';
    var newMin = canvasOptions.rangeMinVisible.valueOf() - correction;
    var newMax = canvasOptions.rangeMaxVisible.valueOf() + correction;
    newMin = isLogarithmic ? adjust(raiseToExt(newMin, canvasOptions.base)) : isDateTime ? new Date(newMin) : newMin;
    newMax = isLogarithmic ? adjust(raiseToExt(newMax, canvasOptions.base)) : isDateTime ? new Date(newMax) : newMax;
    return {
      min: newMin,
      max: newMax,
      translate: translate,
      scale: scale
    };
  },

  getMinScale: function getMinScale(zoom) {
    var {
      dataType,
      interval
    } = this._businessRange;

    if (dataType === 'datetime' && interval === 1) {
      return this.getDateTimeMinScale(zoom);
    }

    return zoom ? 1.1 : 0.9;
  },

  getDateTimeMinScale(zoom) {
    var canvasOptions = this._canvasOptions;
    var length = canvasOptions.canvasLength / canvasOptions.ratioOfCanvasRange;
    length += (parseInt(length * 0.1) || 1) * (zoom ? -2 : 2);
    return canvasOptions.canvasLength / (Math.max(length, 1) * canvasOptions.ratioOfCanvasRange);
  },

  getScale: function getScale(val1, val2) {
    var canvasOptions = this._canvasOptions;

    if (canvasOptions.rangeMax === canvasOptions.rangeMin) {
      return 1;
    }

    val1 = isDefined(val1) ? this.fromValue(val1) : canvasOptions.rangeMin;
    val2 = isDefined(val2) ? this.fromValue(val2) : canvasOptions.rangeMax;
    return (canvasOptions.rangeMax - canvasOptions.rangeMin) / Math.abs(val1 - val2);
  },
  // dxRangeSelector
  isValid: function isValid(value) {
    var co = this._canvasOptions;
    value = this.fromValue(value);
    return value !== null && !isNaN(value) && value.valueOf() + co.rangeDoubleError >= co.rangeMin && value.valueOf() - co.rangeDoubleError <= co.rangeMax;
  },
  getCorrectValue: function getCorrectValue(value, direction) {
    var that = this;
    var breaks = that._breaks;
    var prop;
    value = that.fromValue(value);

    if (that._breaks) {
      prop = that._checkValueAboutBreaks(breaks, value, 'trFrom', 'trTo', that._checkingMethodsAboutBreaks[0]);

      if (prop.inBreak === true) {
        return that.toValue(direction > 0 ? prop.break.trTo : prop.break.trFrom);
      }
    }

    return that.toValue(value);
  },
  to: function to(bp, direction) {
    var range = this.getBusinessRange();

    if (isDefined(range.maxVisible) && isDefined(range.minVisible) && range.maxVisible.valueOf() === range.minVisible.valueOf()) {
      if (!isDefined(bp) || range.maxVisible.valueOf() !== bp.valueOf()) {
        return null;
      }

      return this.translateSpecialCase(bp === 0 && this._options.shiftZeroValue ? 'canvas_position_default' : 'canvas_position_middle');
    }

    bp = this.fromValue(bp);
    var that = this;
    var canvasOptions = that._canvasOptions;
    var breaks = that._breaks;
    var prop = {
      length: 0
    };
    var commonBreakSize = 0;

    if (breaks !== undefined) {
      prop = that._checkValueAboutBreaks(breaks, bp, 'trFrom', 'trTo', that._checkingMethodsAboutBreaks[0]);
      commonBreakSize = isDefined(prop.breaksSize) ? prop.breaksSize : 0;
    }

    if (prop.inBreak === true) {
      if (direction > 0) {
        return prop.break.start;
      } else if (direction < 0) {
        return prop.break.end;
      } else {
        return null;
      }
    }

    return that._conversionValue(that._calculateProjection((bp - canvasOptions.rangeMinVisible - prop.length) * canvasOptions.ratioOfCanvasRange + commonBreakSize));
  },
  from: function from(pos, direction) {
    var that = this;
    var breaks = that._breaks;
    var prop = {
      length: 0
    };
    var canvasOptions = that._canvasOptions;
    var startPoint = canvasOptions.startPoint;
    var commonBreakSize = 0;

    if (breaks !== undefined) {
      prop = that._checkValueAboutBreaks(breaks, pos, 'start', 'end', that._checkingMethodsAboutBreaks[1]);
      commonBreakSize = isDefined(prop.breaksSize) ? prop.breaksSize : 0;
    }

    if (prop.inBreak === true) {
      if (direction > 0) {
        return that.toValue(prop.break.trTo);
      } else if (direction < 0) {
        return that.toValue(prop.break.trFrom);
      } else {
        return null;
      }
    }

    return that.toValue(that._calculateUnProjection((pos - startPoint - commonBreakSize) / canvasOptions.ratioOfCanvasRange + prop.length));
  },
  isValueProlonged: false,
  // dxRangeSelector specific
  // TODO: Rename to getValueRange
  getRange: function getRange() {
    return [this.toValue(this._canvasOptions.rangeMin), this.toValue(this._canvasOptions.rangeMax)];
  },
  getScreenRange: function getScreenRange() {
    return [this._canvasOptions.startPoint, this._canvasOptions.endPoint];
  },
  add: function add(value, diff, dir) {
    return this._add(value, diff, (this._businessRange.invert ? -1 : +1) * dir);
  },
  _add: function _add(value, diff, coeff) {
    return this.toValue(this.fromValue(value) + diff * coeff);
  },
  fromValue: function fromValue(value) {
    return value !== null ? Number(value) : null;
  },
  toValue: function toValue(value) {
    return value !== null ? Number(value) : null;
  },

  ratioOfCanvasRange() {
    return this._canvasOptions.ratioOfCanvasRange;
  },

  convert(value) {
    return value;
  },

  getRangeByMinZoomValue(minZoom, visualRange) {
    if (visualRange.minVisible + minZoom <= this._businessRange.max) {
      return [visualRange.minVisible, visualRange.minVisible + minZoom];
    } else {
      return [visualRange.maxVisible - minZoom, visualRange.maxVisible];
    }
  }

};
export { _Translator2d as Translator2D };