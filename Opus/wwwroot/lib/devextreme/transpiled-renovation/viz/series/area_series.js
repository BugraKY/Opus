"use strict";

exports.polar = exports.chart = void 0;

var _object = require("../../core/utils/object");

var _extend2 = require("../../core/utils/extend");

var _scatter_series = require("./scatter_series");

var _line_series = require("./line_series");

var _utils = require("../core/utils");

// there are area, steparea, stackedarea, fullstackedarea, splinearea
var chartLineSeries = _line_series.chart.line;
var polarLineSeries = _line_series.polar.line;
var _extend = _extend2.extend;
var calculateBezierPoints = _line_series.chart['spline']._calculateBezierPoints;
var chart = {};
exports.chart = chart;
var polar = {};
exports.polar = polar;
var baseAreaMethods = {
  _createBorderElement: chartLineSeries._createMainElement,
  _createLegendState: function _createLegendState(styleOptions, defaultColor) {
    return {
      fill: styleOptions.color || defaultColor,
      opacity: styleOptions.opacity,
      hatching: styleOptions.hatching
    };
  },
  getValueRangeInitialValue: function getValueRangeInitialValue() {
    if (this.valueAxisType !== 'logarithmic' && this.valueType !== 'datetime' && this.showZero !== false) {
      return 0;
    } else {
      return _scatter_series.chart.getValueRangeInitialValue.call(this);
    }
  },
  _getDefaultSegment: function _getDefaultSegment(segment) {
    var defaultSegment = chartLineSeries._getDefaultSegment(segment);

    defaultSegment.area = defaultSegment.line.concat(defaultSegment.line.slice().reverse());
    return defaultSegment;
  },
  _updateElement: function _updateElement(element, segment, animate, complete) {
    var lineParams = {
      points: segment.line
    };
    var areaParams = {
      points: segment.area
    };
    var borderElement = element.line;

    if (animate) {
      borderElement && borderElement.animate(lineParams);
      element.area.animate(areaParams, {}, complete);
    } else {
      borderElement && borderElement.attr(lineParams);
      element.area.attr(areaParams);
    }
  },
  _removeElement: function _removeElement(element) {
    element.line && element.line.remove();
    element.area.remove();
  },
  _drawElement: function _drawElement(segment) {
    return {
      line: this._bordersGroup && this._createBorderElement(segment.line, {
        'stroke-width': this._styles.normal.border['stroke-width']
      }).append(this._bordersGroup),
      area: this._createMainElement(segment.area).append(this._elementsGroup)
    };
  },
  _applyStyle: function _applyStyle(style) {
    var that = this;
    that._elementsGroup && that._elementsGroup.smartAttr(style.elements);
    that._bordersGroup && that._bordersGroup.attr(style.border);
    (that._graphics || []).forEach(function (graphic) {
      graphic.line && graphic.line.attr({
        'stroke-width': style.border['stroke-width']
      }).sharp();
    });
  },
  _parseStyle: function _parseStyle(options, defaultColor, defaultBorderColor) {
    var borderOptions = options.border || {};

    var borderStyle = chartLineSeries._parseLineOptions(borderOptions, defaultBorderColor);

    borderStyle.stroke = borderOptions.visible && borderStyle['stroke-width'] ? borderStyle.stroke : 'none';
    borderStyle['stroke-width'] = borderStyle['stroke-width'] || 1;
    return {
      border: borderStyle,
      elements: {
        stroke: 'none',
        fill: options.color || defaultColor,
        hatching: options.hatching,
        opacity: options.opacity
      }
    };
  },
  _areBordersVisible: function _areBordersVisible() {
    var options = this._options;
    return options.border.visible || options.hoverStyle.border.visible || options.selectionStyle.border.visible;
  },
  _createMainElement: function _createMainElement(points, settings) {
    return this._renderer.path(points, 'area').attr(settings);
  },
  _getTrackerSettings: function _getTrackerSettings(segment) {
    return {
      'stroke-width': segment.singlePointSegment ? this._defaultTrackerWidth : 0
    };
  },
  _getMainPointsFromSegment: function _getMainPointsFromSegment(segment) {
    return segment.area;
  }
};

function createAreaPoints(points) {
  return (0, _utils.map)(points, function (pt) {
    return pt.getCoords();
  }).concat((0, _utils.map)(points.slice().reverse(), function (pt) {
    return pt.getCoords(true);
  }));
}

var areaSeries = chart['area'] = _extend({}, chartLineSeries, baseAreaMethods, {
  _prepareSegment: function _prepareSegment(points, rotated) {
    var that = this;

    var processedPoints = that._processSinglePointsAreaSegment(points, rotated);

    var areaPoints = createAreaPoints(processedPoints);
    var argAxis = that.getArgumentAxis();

    if (argAxis.getAxisPosition) {
      var argAxisPosition = argAxis.getAxisPosition();
      var axisOptions = argAxis.getOptions();
      var edgeOffset = (!rotated ? -1 : 1) * Math.round(axisOptions.width / 2);

      if (axisOptions.visible) {
        areaPoints.forEach(function (p, i) {
          if (p) {
            var index = points.length === 1 ? 0 : i < points.length ? i : areaPoints.length - 1 - i;
            rotated && p.x === points[index].defaultX && p.x === argAxisPosition - argAxis.getAxisShift() && (p.x += edgeOffset);
            !rotated && p.y === points[index].defaultY && p.y === argAxisPosition - argAxis.getAxisShift() && (p.y += edgeOffset);
          }
        });
      }
    }

    return {
      line: processedPoints,
      area: areaPoints,
      singlePointSegment: processedPoints !== points
    };
  },
  _processSinglePointsAreaSegment: function _processSinglePointsAreaSegment(points, rotated) {
    if (points && points.length === 1) {
      var p = points[0];
      var p1 = (0, _object.clone)(p);
      p1[rotated ? 'y' : 'x'] += 1;
      p1.argument = null;
      return [p, p1];
    }

    return points;
  }
});

polar['area'] = _extend({}, polarLineSeries, baseAreaMethods, {
  _prepareSegment: function _prepareSegment(points, rotated, lastSegment) {
    lastSegment && polarLineSeries._closeSegment.call(this, points);
    return areaSeries._prepareSegment.call(this, points);
  },
  _processSinglePointsAreaSegment: function _processSinglePointsAreaSegment(points) {
    return _line_series.polar.line._prepareSegment.call(this, points).line;
  }
});
chart['steparea'] = _extend({}, areaSeries, {
  _prepareSegment: function _prepareSegment(points, rotated) {
    var stepLineSeries = _line_series.chart['stepline'];
    points = areaSeries._processSinglePointsAreaSegment(points, rotated);
    return areaSeries._prepareSegment.call(this, stepLineSeries._calculateStepLinePoints.call(this, points), rotated);
  },
  getSeriesPairCoord: _line_series.chart['stepline'].getSeriesPairCoord
});
chart['splinearea'] = _extend({}, areaSeries, {
  _areaPointsToSplineAreaPoints: function _areaPointsToSplineAreaPoints(areaPoints) {
    var previousMiddlePoint = areaPoints[areaPoints.length / 2 - 1];
    var middlePoint = areaPoints[areaPoints.length / 2];
    areaPoints.splice(areaPoints.length / 2, 0, {
      x: previousMiddlePoint.x,
      y: previousMiddlePoint.y
    }, {
      x: middlePoint.x,
      y: middlePoint.y
    }); ///#DEBUG

    if (previousMiddlePoint.defaultCoords) {
      areaPoints[areaPoints.length / 2].defaultCoords = true;
    }

    if (middlePoint.defaultCoords) {
      areaPoints[areaPoints.length / 2 - 1].defaultCoords = true;
    } ///#ENDDEBUG

  },
  _prepareSegment: function _prepareSegment(points, rotated) {
    var processedPoints = areaSeries._processSinglePointsAreaSegment(points, rotated);

    var areaSegment = areaSeries._prepareSegment.call(this, calculateBezierPoints(processedPoints, rotated));

    this._areaPointsToSplineAreaPoints(areaSegment.area);

    areaSegment.singlePointSegment = processedPoints !== points;
    return areaSegment;
  },
  _getDefaultSegment: function _getDefaultSegment(segment) {
    var areaDefaultSegment = areaSeries._getDefaultSegment(segment);

    this._areaPointsToSplineAreaPoints(areaDefaultSegment.area);

    return areaDefaultSegment;
  },
  _createMainElement: function _createMainElement(points, settings) {
    return this._renderer.path(points, 'bezierarea').attr(settings);
  },
  _createBorderElement: _line_series.chart['spline']._createMainElement,
  getSeriesPairCoord: _line_series.chart['spline'].getSeriesPairCoord,
  _getNearestPoints: _line_series.chart['spline']._getNearestPoints,
  _getBezierPoints: _line_series.chart['spline']._getBezierPoints,
  obtainCubicBezierTCoef: _line_series.chart['spline'].obtainCubicBezierTCoef
});