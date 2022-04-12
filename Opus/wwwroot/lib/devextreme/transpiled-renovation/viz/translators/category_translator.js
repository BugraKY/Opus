"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var _math = require("../../core/utils/math");

var round = Math.round;

function getValue(value) {
  return value;
}

var _default = {
  translate: function translate(category, directionOffset) {
    var that = this;
    var canvasOptions = that._canvasOptions;
    var categoryIndex = that._categoriesToPoints[category === null || category === void 0 ? void 0 : category.valueOf()];
    var specialValue = that.translateSpecialCase(category);
    var startPointIndex = canvasOptions.startPointIndex || 0;
    var stickInterval = that._options.stick ? 0 : 0.5;

    if ((0, _type.isDefined)(specialValue)) {
      return round(specialValue);
    } // Q522516


    if (!categoryIndex && categoryIndex !== 0) {
      return null;
    }

    directionOffset = directionOffset || 0;
    var stickDelta = categoryIndex + stickInterval - startPointIndex + directionOffset * 0.5;
    return round(that._calculateProjection(canvasOptions.interval * stickDelta));
  },
  getInterval: function getInterval() {
    return this._canvasOptions.interval;
  },
  getEventScale: function getEventScale(zoomEvent) {
    var scale = zoomEvent.deltaScale || 1;
    return 1 - (1 - scale) / (0.75 + this.visibleCategories.length / this._categories.length);
  },
  zoom: function zoom(translate, scale) {
    var that = this;
    var categories = that._categories;
    var canvasOptions = that._canvasOptions;
    var stick = that._options.stick;
    var invert = canvasOptions.invert;
    var interval = canvasOptions.interval * scale;
    var translateCategories = translate / interval;
    var visibleCount = (that.visibleCategories || []).length;
    var startCategoryIndex = parseInt((canvasOptions.startPointIndex || 0) + translateCategories + 0.5);
    var categoriesLength = parseInt((0, _math.adjust)(canvasOptions.canvasLength / interval) + (stick ? 1 : 0)) || 1;
    var endCategoryIndex;

    if (invert) {
      startCategoryIndex = parseInt((canvasOptions.startPointIndex || 0) + visibleCount - translateCategories + 0.5) - categoriesLength;
    }

    if (startCategoryIndex < 0) {
      startCategoryIndex = 0;
    }

    endCategoryIndex = startCategoryIndex + categoriesLength;

    if (endCategoryIndex > categories.length) {
      endCategoryIndex = categories.length;
      startCategoryIndex = endCategoryIndex - categoriesLength;

      if (startCategoryIndex < 0) {
        startCategoryIndex = 0;
      }
    }

    var newVisibleCategories = categories.slice(parseInt(startCategoryIndex), parseInt(endCategoryIndex));

    var newInterval = that._getDiscreteInterval(newVisibleCategories.length, canvasOptions);

    scale = newInterval / canvasOptions.interval;
    translate = that.translate(!invert ? newVisibleCategories[0] : newVisibleCategories[newVisibleCategories.length - 1]) * scale - (canvasOptions.startPoint + (stick ? 0 : newInterval / 2));
    return {
      min: newVisibleCategories[0],
      max: newVisibleCategories[newVisibleCategories.length - 1],
      translate: translate,
      scale: scale
    };
  },
  getMinScale: function getMinScale(zoom) {
    var that = this;
    var canvasOptions = that._canvasOptions;
    var categoriesLength = (that.visibleCategories || that._categories).length;
    categoriesLength += (parseInt(categoriesLength * 0.1) || 1) * (zoom ? -2 : 2);
    return canvasOptions.canvasLength / (Math.max(categoriesLength, 1) * canvasOptions.interval);
  },
  getScale: function getScale(min, max) {
    var that = this;
    var canvasOptions = that._canvasOptions;
    var visibleArea = that.getCanvasVisibleArea();
    var stickOffset = !that._options.stick && 1;
    var minPoint = (0, _type.isDefined)(min) ? that.translate(min, -stickOffset) : null;
    var maxPoint = (0, _type.isDefined)(max) ? that.translate(max, +stickOffset) : null;

    if (minPoint === null) {
      minPoint = canvasOptions.invert ? visibleArea.max : visibleArea.min;
    }

    if (maxPoint === null) {
      maxPoint = canvasOptions.invert ? visibleArea.min : visibleArea.max;
    }

    return that.canvasLength / Math.abs(maxPoint - minPoint);
  },
  // dxRangeSelector
  isValid: function isValid(value) {
    return (0, _type.isDefined)(value) ? this._categoriesToPoints[value.valueOf()] >= 0 : false;
  },
  getCorrectValue: getValue,
  to: function to(value, direction) {
    var canvasOptions = this._canvasOptions;
    var categoryIndex = this._categoriesToPoints[value === null || value === void 0 ? void 0 : value.valueOf()];
    var startPointIndex = canvasOptions.startPointIndex || 0;
    var stickDelta = categoryIndex + (this._options.stick ? 0 : 0.5) - startPointIndex + (this._businessRange.invert ? -1 : +1) * direction * 0.5;
    return round(this._calculateProjection(canvasOptions.interval * stickDelta));
  },
  from: function from(position) {
    var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var canvasOptions = this._canvasOptions;
    var startPoint = canvasOptions.startPoint;
    var categories = this.visibleCategories || this._categories;
    var categoriesLength = categories.length;
    var stickInterval = this._options.stick ? 0.5 : 0; // It is strange - while "businessRange.invert" check is required in "to" here it is not.
    // Check that translator.from(translator.to(x, -1), -1) equals x.
    // And check that translator.untranslate(translator.translate(x, -1), -1) does not equal x - is it really supposed to be so?

    var result = round((position - startPoint) / canvasOptions.interval + stickInterval - 0.5 -
    /* (businessRange.invert ? -1 : +1) * */
    direction * 0.5);

    if (result >= categoriesLength) {
      result = categoriesLength - 1;
    }

    if (result < 0) {
      result = 0;
    }

    if (canvasOptions.invert) {
      result = categoriesLength - result - 1;
    }

    return categories[result];
  },
  _add: function _add() {
    return NaN;
  },
  toValue: getValue,
  isValueProlonged: true,
  getRangeByMinZoomValue: function getRangeByMinZoomValue(minZoom, visualRange) {
    var categories = this._categories;
    var minVisibleIndex = categories.indexOf(visualRange.minVisible);
    var maxVisibleIndex = categories.indexOf(visualRange.maxVisible);
    var startIndex = minVisibleIndex + minZoom - 1;
    var endIndex = maxVisibleIndex - minZoom + 1;

    if (categories[startIndex]) {
      return [visualRange.minVisible, categories[startIndex]];
    } else {
      return [categories[endIndex], visualRange.maxVisible];
    }
  }
};
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;