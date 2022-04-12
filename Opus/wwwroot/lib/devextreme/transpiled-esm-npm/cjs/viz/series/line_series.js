"use strict";

exports.polar = exports.chart = void 0;

var _scatter_series = require("./scatter_series");

var _object = require("../../core/utils/object");

var _extend = require("../../core/utils/extend");

var _iterator = require("../../core/utils/iterator");

var _utils = require("../core/utils");

var _math = require("../../core/utils/math");

// there are line, stepline, stackedline, fullstackedline, spline
var DISCRETE = 'discrete';
var round = Math.round,
    sqrt = Math.sqrt,
    pow = Math.pow,
    min = Math.min,
    max = Math.max,
    abs = Math.abs;
var chart = {};
exports.chart = chart;
var polar = {};
exports.polar = polar;

function clonePoint(point, newX, newY, newAngle) {
  var p = (0, _object.clone)(point);
  p.x = newX;
  p.y = newY;
  p.angle = newAngle;
  return p;
}

function getTangentPoint(point, prevPoint, centerPoint, tan, nextStepAngle) {
  var correctAngle = point.angle + nextStepAngle;
  var cosSin = (0, _utils.getCosAndSin)(correctAngle);
  var x = centerPoint.x + (point.radius + tan * nextStepAngle) * cosSin.cos;
  var y = centerPoint.y - (point.radius + tan * nextStepAngle) * cosSin.sin;
  return clonePoint(prevPoint, x, y, correctAngle);
}

function obtainCubicBezierTCoef(p, p0, p1, p2, p3) {
  var d = p0 - p;
  var c = 3 * p1 - 3 * p0;
  var b = 3 * p2 - 6 * p1 + 3 * p0;
  var a = p3 - 3 * p2 + 3 * p1 - p0;
  return (0, _math.solveCubicEquation)(a, b, c, d);
}

var lineMethods = {
  autoHidePointMarkersEnabled: function autoHidePointMarkersEnabled() {
    return true;
  },
  _applyGroupSettings: function _applyGroupSettings(style, settings, group) {
    var that = this;
    settings = (0, _extend.extend)(settings, style);

    that._applyElementsClipRect(settings);

    group.attr(settings);
  },
  _setGroupsSettings: function _setGroupsSettings(animationEnabled) {
    var that = this;
    var style = that._styles.normal;

    that._applyGroupSettings(style.elements, {
      'class': 'dxc-elements'
    }, that._elementsGroup);

    that._bordersGroup && that._applyGroupSettings(style.border, {
      'class': 'dxc-borders'
    }, that._bordersGroup);

    _scatter_series.chart._setGroupsSettings.call(that, animationEnabled);

    animationEnabled && that._markersGroup && that._markersGroup.attr({
      opacity: 0.001
    });
  },
  _createGroups: function _createGroups() {
    var that = this;

    that._createGroup('_elementsGroup', that, that._group);

    that._areBordersVisible() && that._createGroup('_bordersGroup', that, that._group);

    _scatter_series.chart._createGroups.call(that);
  },
  _areBordersVisible: function _areBordersVisible() {
    return false;
  },
  _getDefaultSegment: function _getDefaultSegment(segment) {
    return {
      line: (0, _utils.map)(segment.line || [], function (pt) {
        return pt.getDefaultCoords();
      })
    };
  },
  _prepareSegment: function _prepareSegment(points) {
    return {
      line: points
    };
  },
  _parseLineOptions: function _parseLineOptions(options, defaultColor) {
    return {
      stroke: options.color || defaultColor,
      'stroke-width': options.width,
      dashStyle: options.dashStyle || 'solid'
    };
  },
  _parseStyle: function _parseStyle(options, defaultColor) {
    return {
      elements: this._parseLineOptions(options, defaultColor)
    };
  },
  _applyStyle: function _applyStyle(style) {
    var that = this;
    that._elementsGroup && that._elementsGroup.attr(style.elements);
    (0, _iterator.each)(that._graphics || [], function (_, graphic) {
      graphic.line && graphic.line.attr({
        'stroke-width': style.elements['stroke-width']
      }).sharp();
    });
  },
  _drawElement: function _drawElement(segment, group) {
    return {
      line: this._createMainElement(segment.line, {
        'stroke-width': this._styles.normal.elements['stroke-width']
      }).append(group)
    };
  },
  _removeElement: function _removeElement(element) {
    element.line.remove();
  },
  _updateElement: function _updateElement(element, segment, animate, animationComplete) {
    var params = {
      points: segment.line
    };
    var lineElement = element.line;
    animate ? lineElement.animate(params, {}, animationComplete) : lineElement.attr(params);
  },
  _animateComplete: function _animateComplete() {
    var that = this;

    _scatter_series.chart._animateComplete.call(that);

    that._markersGroup && that._markersGroup.animate({
      opacity: 1
    }, {
      duration: that._defaultDuration
    });
  },
  _animate: function _animate() {
    var that = this;
    var lastIndex = that._graphics.length - 1;
    (0, _iterator.each)(that._graphics || [], function (i, elem) {
      var complete;

      if (i === lastIndex) {
        complete = function complete() {
          that._animateComplete();
        };
      }

      that._updateElement(elem, that._segments[i], true, complete);
    });
  },
  _drawPoint: function _drawPoint(options) {
    _scatter_series.chart._drawPoint.call(this, {
      point: options.point,
      groups: options.groups
    });
  },
  _createMainElement: function _createMainElement(points, settings) {
    return this._renderer.path(points, 'line').attr(settings);
  },
  _sortPoints: function _sortPoints(points, rotated) {
    return rotated ? points.sort(function (p1, p2) {
      return p2.y - p1.y;
    }) : points.sort(function (p1, p2) {
      return p1.x - p2.x;
    });
  },
  _drawSegment: function _drawSegment(points, animationEnabled, segmentCount, lastSegment) {
    var that = this;
    var rotated = that._options.rotated;

    var segment = that._prepareSegment(points, rotated, lastSegment);

    that._segments.push(segment);

    if (!that._graphics[segmentCount]) {
      that._graphics[segmentCount] = that._drawElement(animationEnabled ? that._getDefaultSegment(segment) : segment, that._elementsGroup);
    } else if (!animationEnabled) {
      that._updateElement(that._graphics[segmentCount], segment);
    }
  },
  _getTrackerSettings: function _getTrackerSettings() {
    var that = this;
    var defaultTrackerWidth = that._defaultTrackerWidth;
    var strokeWidthFromElements = that._styles.normal.elements['stroke-width'];
    return {
      'stroke-width': strokeWidthFromElements > defaultTrackerWidth ? strokeWidthFromElements : defaultTrackerWidth,
      fill: 'none'
    };
  },
  _getMainPointsFromSegment: function _getMainPointsFromSegment(segment) {
    return segment.line;
  },
  _drawTrackerElement: function _drawTrackerElement(segment) {
    return this._createMainElement(this._getMainPointsFromSegment(segment), this._getTrackerSettings(segment));
  },
  _updateTrackerElement: function _updateTrackerElement(segment, element) {
    var settings = this._getTrackerSettings(segment);

    settings.points = this._getMainPointsFromSegment(segment);
    element.attr(settings);
  },
  checkSeriesViewportCoord: function checkSeriesViewportCoord(axis, coord) {
    if (!_scatter_series.chart.checkSeriesViewportCoord.call(this)) {
      return false;
    }

    var range = axis.isArgumentAxis ? this.getArgumentRange() : this.getViewport();
    var min = axis.getTranslator().translate(range.categories ? range.categories[0] : range.min);
    var max = axis.getTranslator().translate(range.categories ? range.categories[range.categories.length - 1] : range.max);
    var rotated = this.getOptions().rotated;
    var inverted = axis.getOptions().inverted;
    return axis.isArgumentAxis && (!rotated && !inverted || rotated && inverted) || !axis.isArgumentAxis && (rotated && !inverted || !rotated && inverted) ? coord >= min && coord <= max : coord >= max && coord <= min;
  }
};
var lineSeries = chart['line'] = (0, _extend.extend)({}, _scatter_series.chart, lineMethods, {
  getPointCenterByArg: function getPointCenterByArg(arg) {
    var value = this.getArgumentAxis().getTranslator().translate(arg);
    return {
      x: value,
      y: value
    };
  },
  getSeriesPairCoord: function getSeriesPairCoord(coord, isArgument) {
    var that = this;
    var oppositeCoord = null;

    var nearestPoints = this._getNearestPointsByCoord(coord, isArgument);

    var needValueCoord = isArgument && !that._options.rotated || !isArgument && that._options.rotated;

    for (var i = 0; i < nearestPoints.length; i++) {
      var p = nearestPoints[i];
      var k = (p[1].vy - p[0].vy) / (p[1].vx - p[0].vx);
      var b = p[0].vy - p[0].vx * k;
      var tmpCoord = void 0;

      if (p[1].vx - p[0].vx === 0) {
        tmpCoord = needValueCoord ? p[0].vy : p[0].vx;
      } else {
        tmpCoord = needValueCoord ? k * coord + b : (coord - b) / k;
      }

      if (this._checkAxisVisibleAreaCoord(!isArgument, tmpCoord)) {
        oppositeCoord = tmpCoord;
        break;
      }
    }

    return oppositeCoord;
  }
});
chart['stepline'] = (0, _extend.extend)({}, lineSeries, {
  _calculateStepLinePoints: function _calculateStepLinePoints(points) {
    var segment = [];
    var coordName = this._options.rotated ? 'x' : 'y';
    (0, _iterator.each)(points, function (i, pt) {
      var point;

      if (!i) {
        segment.push(pt);
        return;
      }

      var step = segment[segment.length - 1][coordName];

      if (step !== pt[coordName]) {
        point = (0, _object.clone)(pt);
        point[coordName] = step;
        segment.push(point);
      }

      segment.push(pt);
    });
    return segment;
  },
  _prepareSegment: function _prepareSegment(points) {
    return lineSeries._prepareSegment(this._calculateStepLinePoints(points));
  },
  getSeriesPairCoord: function getSeriesPairCoord(coord, isArgument) {
    var oppositeCoord;
    var rotated = this._options.rotated;
    var isOpposite = !isArgument && !rotated || isArgument && rotated;
    var coordName = !isOpposite ? 'vx' : 'vy';
    var oppositeCoordName = !isOpposite ? 'vy' : 'vx';

    var nearestPoints = this._getNearestPointsByCoord(coord, isArgument);

    for (var i = 0; i < nearestPoints.length; i++) {
      var p = nearestPoints[i];
      var tmpCoord = void 0;

      if (isArgument) {
        tmpCoord = coord !== p[1][coordName] ? p[0][oppositeCoordName] : p[1][oppositeCoordName];
      } else {
        tmpCoord = coord === p[0][coordName] ? p[0][oppositeCoordName] : p[1][oppositeCoordName];
      }

      if (this._checkAxisVisibleAreaCoord(!isArgument, tmpCoord)) {
        oppositeCoord = tmpCoord;
        break;
      }
    }

    return oppositeCoord;
  }
});
chart['spline'] = (0, _extend.extend)({}, lineSeries, {
  _calculateBezierPoints: function _calculateBezierPoints(src, rotated) {
    var bezierPoints = [];
    var pointsCopy = src;

    var checkExtremum = function checkExtremum(otherPointCoord, pointCoord, controlCoord) {
      return otherPointCoord > pointCoord && controlCoord > otherPointCoord || otherPointCoord < pointCoord && controlCoord < otherPointCoord ? otherPointCoord : controlCoord;
    };

    if (pointsCopy.length !== 1) {
      pointsCopy.forEach(function (curPoint, i) {
        var leftControlX;
        var leftControlY;
        var rightControlX;
        var rightControlY;
        var prevPoint = pointsCopy[i - 1];
        var nextPoint = pointsCopy[i + 1];
        var x1;
        var x2;
        var y1;
        var y2;
        var lambda = 0.5;
        var a;
        var b;
        var c;
        var xc;
        var yc;
        var shift;

        if (!i || i === pointsCopy.length - 1) {
          bezierPoints.push(curPoint, curPoint);
          return;
        }

        var xCur = curPoint.x;
        var yCur = curPoint.y;
        x1 = prevPoint.x;
        x2 = nextPoint.x;
        y1 = prevPoint.y;
        y2 = nextPoint.y; // check for extremum

        var curIsExtremum = !!(!rotated && (yCur <= prevPoint.y && yCur <= nextPoint.y || yCur >= prevPoint.y && yCur >= nextPoint.y) || rotated && (xCur <= prevPoint.x && xCur <= nextPoint.x || xCur >= prevPoint.x && xCur >= nextPoint.x));

        if (curIsExtremum) {
          if (!rotated) {
            rightControlY = leftControlY = yCur;
            rightControlX = (xCur + nextPoint.x) / 2;
            leftControlX = (xCur + prevPoint.x) / 2;
          } else {
            rightControlX = leftControlX = xCur;
            rightControlY = (yCur + nextPoint.y) / 2;
            leftControlY = (yCur + prevPoint.y) / 2;
          }
        } else {
          a = y2 - y1;
          b = x1 - x2;
          c = y1 * x2 - x1 * y2;

          if (!rotated) {
            if (!b) {
              bezierPoints.push(curPoint, curPoint, curPoint);
              return;
            }

            xc = xCur;
            yc = -1 * (a * xc + c) / b;
            shift = yc - yCur;
            y1 -= shift;
            y2 -= shift;
          } else {
            if (!a) {
              bezierPoints.push(curPoint, curPoint, curPoint);
              return;
            }

            yc = yCur;
            xc = -1 * (b * yc + c) / a;
            shift = xc - xCur;
            x1 -= shift;
            x2 -= shift;
          }

          rightControlX = (xCur + lambda * x2) / (1 + lambda);
          rightControlY = (yCur + lambda * y2) / (1 + lambda);
          leftControlX = (xCur + lambda * x1) / (1 + lambda);
          leftControlY = (yCur + lambda * y1) / (1 + lambda);
        } // check control points for extremum


        if (!rotated) {
          leftControlY = checkExtremum(prevPoint.y, yCur, leftControlY);
          rightControlY = checkExtremum(nextPoint.y, yCur, rightControlY);
        } else {
          leftControlX = checkExtremum(prevPoint.x, xCur, leftControlX);
          rightControlX = checkExtremum(nextPoint.x, xCur, rightControlX);
        }

        var leftPoint = clonePoint(curPoint, leftControlX, leftControlY);
        var rightPoint = clonePoint(curPoint, rightControlX, rightControlY);
        bezierPoints.push(leftPoint, curPoint, rightPoint);
      });
    } else {
      bezierPoints.push(pointsCopy[0]);
    }

    return bezierPoints;
  },
  _prepareSegment: function _prepareSegment(points, rotated) {
    return lineSeries._prepareSegment(this._calculateBezierPoints(points, rotated));
  },
  _createMainElement: function _createMainElement(points, settings) {
    return this._renderer.path(points, 'bezier').attr(settings);
  },
  getSeriesPairCoord: function getSeriesPairCoord(coord, isArgument) {
    var that = this;
    var oppositeCoord = null;
    var isOpposite = !isArgument && !this._options.rotated || isArgument && this._options.rotated;
    var coordName = !isOpposite ? 'vx' : 'vy';
    var bezierCoordName = !isOpposite ? 'x' : 'y';
    var oppositeCoordName = !isOpposite ? 'vy' : 'vx';
    var bezierOppositeCoordName = !isOpposite ? 'y' : 'x';
    var axis = !isArgument ? that.getArgumentAxis() : that.getValueAxis();
    var visibleArea = axis.getVisibleArea();

    var nearestPoints = this._getNearestPointsByCoord(coord, isArgument);

    var _loop = function _loop(i) {
      var p = nearestPoints[i];

      if (p.length === 1) {
        visibleArea[0] <= p[0][oppositeCoordName] && visibleArea[1] >= p[0][oppositeCoordName] && (oppositeCoord = p[0][oppositeCoordName]);
      } else {
        var ts = obtainCubicBezierTCoef(coord, p[0][coordName], p[1][bezierCoordName], p[2][bezierCoordName], p[3][coordName]);
        ts.forEach(function (t) {
          if (t >= 0 && t <= 1) {
            var tmpCoord = Math.pow(1 - t, 3) * p[0][oppositeCoordName] + 3 * Math.pow(1 - t, 2) * t * p[1][bezierOppositeCoordName] + 3 * (1 - t) * t * t * p[2][bezierOppositeCoordName] + t * t * t * p[3][oppositeCoordName];

            if (visibleArea[0] <= tmpCoord && visibleArea[1] >= tmpCoord) {
              oppositeCoord = tmpCoord;
            }
          }
        });
      }

      if (oppositeCoord !== null) {
        return "break";
      }
    };

    for (var i = 0; i < nearestPoints.length; i++) {
      var _ret = _loop(i);

      if (_ret === "break") break;
    }

    return oppositeCoord;
  },
  _getNearestPoints: function _getNearestPoints(point, nextPoint, bezierPoints) {
    var index = bezierPoints.indexOf(point);
    return [point, bezierPoints[index + 1], bezierPoints[index + 2], nextPoint];
  },
  _getBezierPoints: function _getBezierPoints() {
    return this._segments.length > 0 ? this._segments.reduce(function (a, seg) {
      return a.concat(seg.line);
    }, []) : [];
  }
});
polar.line = (0, _extend.extend)({}, _scatter_series.polar, lineMethods, {
  _sortPoints: function _sortPoints(points) {
    return points;
  },
  _prepareSegment: function _prepareSegment(points, rotated, lastSegment) {
    var preparedPoints = [];
    var centerPoint = this.getValueAxis().getCenter();
    var i;
    lastSegment && this._closeSegment(points);

    if (this.argumentAxisType !== DISCRETE && this.valueAxisType !== DISCRETE) {
      for (i = 1; i < points.length; i++) {
        preparedPoints = preparedPoints.concat(this._getTangentPoints(points[i], points[i - 1], centerPoint));
      }

      if (!preparedPoints.length) {
        // T174220
        preparedPoints = points;
      }
    } else {
      return lineSeries._prepareSegment.call(this, points);
    }

    return {
      line: preparedPoints
    };
  },
  _getRemainingAngle: function _getRemainingAngle(angle) {
    var normAngle = (0, _utils.normalizeAngle)(angle);
    return angle >= 0 ? 360 - normAngle : -normAngle;
  },
  _closeSegment: function _closeSegment(points) {
    var point;

    if (this._segments.length) {
      point = this._segments[0].line[0];
    } else {
      point = clonePoint(points[0], points[0].x, points[0].y, points[0].angle);
    }

    point = this._modifyReflectedPoint(point, points[points.length - 1]);

    if (point) {
      points.push(point);
    }
  },
  _modifyReflectedPoint: function _modifyReflectedPoint(point, lastPoint) {
    if (lastPoint.angle === point.angle) {
      return undefined;
    }

    if ((0, _utils.normalizeAngle)(round(lastPoint.angle)) === (0, _utils.normalizeAngle)(round(point.angle))) {
      point.angle = lastPoint.angle;
    } else {
      var differenceAngle = lastPoint.angle - point.angle;
      point.angle = lastPoint.angle + this._getRemainingAngle(differenceAngle);
    }

    return point;
  },
  _getTangentPoints: function _getTangentPoints(point, prevPoint, centerPoint) {
    var tangentPoints = [];
    var betweenAngle = Math.round(prevPoint.angle - point.angle);
    var tan = (prevPoint.radius - point.radius) / betweenAngle;
    var i;

    if (betweenAngle === 0) {
      tangentPoints = [prevPoint, point];
    } else if (betweenAngle > 0) {
      for (i = betweenAngle; i >= 0; i--) {
        tangentPoints.push(getTangentPoint(point, prevPoint, centerPoint, tan, i));
      }
    } else {
      for (i = 0; i >= betweenAngle; i--) {
        tangentPoints.push(getTangentPoint(point, prevPoint, centerPoint, tan, betweenAngle - i));
      }
    }

    return tangentPoints;
  },
  getSeriesPairCoord: function getSeriesPairCoord(params, isArgument) {
    var that = this;
    var argAxis = that.getArgumentAxis();
    var paramName = isArgument ? 'angle' : 'radius';
    var coordParam = params[paramName];
    var centerPoint = argAxis.getCenter();

    var getLengthByCoords = function getLengthByCoords(p1, p2) {
      return sqrt(pow(p1.x - p2.x, 2) + pow(p1.y - p2.y, 2));
    };

    var isInsideInterval = function isInsideInterval(prevPoint, point, _ref) {
      var x = _ref.x,
          y = _ref.y;
      return getLengthByCoords({
        x: x,
        y: y
      }, centerPoint) <= argAxis.getRadius() && min(prevPoint.x, point.x) <= x && max(prevPoint.x, point.x) >= x && min(prevPoint.y, point.y) <= y && max(prevPoint.y, point.y) >= y;
    };

    var coords;
    var neighborPoints = that.getNeighborPoints(coordParam, paramName);

    if (neighborPoints.length === 1) {
      coords = neighborPoints[0];
    } else if (neighborPoints.length > 1) {
      var prevPoint = neighborPoints[0];
      var point = neighborPoints[1];

      if (that.argumentAxisType !== DISCRETE && that.valueAxisType !== DISCRETE) {
        var tan;
        var stepAngle;

        if (isArgument) {
          tan = (prevPoint.radius - point.radius) / (prevPoint.angle - point.angle);
          stepAngle = coordParam - point.angle;
        } else {
          tan = (prevPoint.radius - point.radius) / (prevPoint.angle - point.angle);
          stepAngle = (coordParam - point.radius) / tan;
        }

        coords = getTangentPoint(point, prevPoint, centerPoint, tan, stepAngle);
      } else {
        if (isArgument) {
          var cosSin = (0, _utils.getCosAndSin)(-coordParam);
          var k1 = (point.y - prevPoint.y) / (point.x - prevPoint.x);
          var b1 = prevPoint.y - prevPoint.x * k1;
          var k2 = cosSin.sin / cosSin.cos;
          var b2 = centerPoint.y - k2 * centerPoint.x;
          var x = (b2 - b1) / (k1 - k2);
          var y = k1 * x + b1;

          if (isInsideInterval(prevPoint, point, {
            x: x,
            y: y
          })) {
            var quarter = abs((0, _math.trunc)((360 + coordParam) / 90) % 4);

            if (quarter === 0 && x >= centerPoint.x && y <= centerPoint.y || quarter === 1 && x <= centerPoint.x && y <= centerPoint.y || quarter === 2 && x <= centerPoint.x && y >= centerPoint.y || quarter === 3 && x >= centerPoint.x && y >= centerPoint.y) {
              coords = {
                x: x,
                y: y
              };
            }
          }
        } else {
          var k = (point.y - prevPoint.y) / (point.x - prevPoint.x);
          var y0 = prevPoint.y - prevPoint.x * k;
          var a = 1 + k * k;
          var b = -2 * centerPoint.x + 2 * k * y0 - 2 * k * centerPoint.y;
          var c = -pow(coordParam, 2) + pow(y0 - centerPoint.y, 2) + pow(centerPoint.x, 2);
          var d = b * b - 4 * a * c;

          if (d >= 0) {
            var x1 = (-b - sqrt(d)) / (2 * a);
            var x2 = (-b + sqrt(d)) / (2 * a);
            var y1 = k * x1 + y0;
            var y2 = k * x2 + y0;
            coords = isInsideInterval(prevPoint, point, {
              x: x1,
              y: y1
            }) ? {
              x: x1,
              y: y1
            } : isInsideInterval(prevPoint, point, {
              x: x2,
              y: y2
            }) ? {
              x: x2,
              y: y2
            } : undefined;
          }
        }
      }
    }

    return coords;
  },
  getNeighborPoints: function getNeighborPoints(param, paramName) {
    var points = this.getPoints();
    var neighborPoints = [];

    if (this.getOptions().closed) {
      points = (0, _extend.extend)(true, [], points);
      var lastPoint = points[points.length - 1];
      var firstPointCopy = clonePoint(points[0], points[0].x, points[0].y, points[0].angle);
      var lastPointCopy = clonePoint(lastPoint, lastPoint.x, lastPoint.y, lastPoint.angle);

      var rearwardRefPoint = this._modifyReflectedPoint(firstPointCopy, lastPoint);

      var forwardRefPoint = this._modifyReflectedPoint(lastPointCopy, points[0]);

      if (forwardRefPoint) {
        points.unshift(forwardRefPoint);
      }

      if (rearwardRefPoint) {
        points.push(rearwardRefPoint);
      }
    }

    for (var i = 1; i < points.length; i++) {
      if (points[i - 1][paramName] === param) {
        neighborPoints.push(points[i - 1]);
      } else if (points[i][paramName] === param) {
        neighborPoints.push(points[i]);
      } else if (points[i][paramName] > param && points[i - 1][paramName] < param || points[i - 1][paramName] > param && points[i][paramName] < param) {
        neighborPoints.push(points[i - 1]);
        neighborPoints.push(points[i]);
      }

      if (neighborPoints.length > 0) {
        break;
      }
    }

    return neighborPoints;
  }
});