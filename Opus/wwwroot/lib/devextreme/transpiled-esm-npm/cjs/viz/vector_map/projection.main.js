"use strict";

exports.projection = exports.Projection = void 0;

var _extend = require("../../core/utils/extend");

var _event_emitter = require("./event_emitter");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _Number = Number;
var _min = Math.min;
var _max = Math.max;
var _abs = Math.abs;
var _round = Math.round;
var _ln = Math.log;
var _pow = Math.pow;
var TWO_TO_LN2 = 2 / Math.LN2; // T224204
// The value is selected so that bounds range of 1 angular second can be defined
// 1 angular second is (1 / 3600) degrees or (1 / 3600 / 180) after projection
// The value 10 times less than projected 1 angular second is chosen

var MIN_BOUNDS_RANGE = 1 / 3600 / 180 / 10;
var DEFAULT_MIN_ZOOM = 1;
var DEFAULT_MAX_ZOOM = 1 << 8;
var DEFAULT_CENTER = [NaN, NaN];
var DEFAULT_ENGINE_NAME = 'mercator';

function floatsEqual(f1, f2) {
  return _abs(f1 - f2) < 1E-8;
}

function arraysEqual(a1, a2) {
  return floatsEqual(a1[0], a2[0]) && floatsEqual(a1[1], a2[1]);
}

function parseAndClamp(value, minValue, maxValue, defaultValue) {
  var val = _Number(value);

  return isFinite(val) ? _min(_max(val, minValue), maxValue) : defaultValue;
}

function parseAndClampArray(value, minValue, maxValue, defaultValue) {
  return [parseAndClamp(value[0], minValue[0], maxValue[0], defaultValue[0]), parseAndClamp(value[1], minValue[1], maxValue[1], defaultValue[1])];
}

function getEngine(engine) {
  return engine instanceof Engine && engine || projection.get(engine) || projection(engine) || projection.get(DEFAULT_ENGINE_NAME);
}

var Projection = function Projection(parameters) {
  var that = this;

  that._initEvents();

  that._params = parameters;
  that._engine = getEngine();
  that._center = that._engine.center();

  that._adjustCenter();
};

exports.Projection = Projection;
Projection.prototype = {
  constructor: Projection,
  _minZoom: DEFAULT_MIN_ZOOM,
  _maxZoom: DEFAULT_MAX_ZOOM,
  _zoom: DEFAULT_MIN_ZOOM,
  _center: DEFAULT_CENTER,
  _canvas: {},
  _scale: [],
  dispose: function dispose() {
    this._disposeEvents();
  },
  setEngine: function setEngine(value) {
    var that = this;
    var engine = getEngine(value);

    if (that._engine !== engine) {
      that._engine = engine;

      that._fire('engine');

      if (that._changeCenter(engine.center())) {
        that._triggerCenterChanged();
      }

      if (that._changeZoom(that._minZoom)) {
        that._triggerZoomChanged();
      }

      that._adjustCenter();

      that._setupScreen();
    }
  },
  setBounds: function setBounds(bounds) {
    if (bounds !== undefined) {
      this.setEngine(this._engine.original().bounds(bounds));
    }
  },
  _setupScreen: function _setupScreen() {
    var that = this;
    var canvas = that._canvas;
    var width = canvas.width;
    var height = canvas.height;
    var engine = that._engine;
    var aspectRatio = engine.ar();
    that._x0 = canvas.left + width / 2;
    that._y0 = canvas.top + height / 2;
    var min = [that.project([engine.min()[0], 0])[0], that.project([0, engine.min()[1]])[1]];
    var max = [that.project([engine.max()[0], 0])[0], that.project([0, engine.max()[1]])[1]];
    var screenAR = width / height;

    var boundsAR = _abs(max[0] - min[0]) / _abs(max[1] - min[1]);

    var correction;

    if (isNaN(boundsAR) || boundsAR === 0 || _min(screenAR, aspectRatio) <= aspectRatio * boundsAR && aspectRatio * boundsAR <= _max(screenAR, aspectRatio)) {
      correction = 1;
    } else {
      correction = boundsAR > 1 ? boundsAR : 1 / boundsAR;
    }

    if (aspectRatio * boundsAR >= screenAR) {
      that._xRadius = width / 2 / correction;
      that._yRadius = width / 2 / (aspectRatio * correction);
    } else {
      that._xRadius = height / 2 * (aspectRatio / correction);
      that._yRadius = height / 2 / correction;
    }

    that._fire('screen');
  },
  setSize: function setSize(canvas) {
    this._canvas = canvas;

    this._setupScreen();
  },
  getCanvas: function getCanvas() {
    return this._canvas;
  },
  _toScreen: function _toScreen(coordinates) {
    return [this._x0 + this._xRadius * coordinates[0], this._y0 + this._yRadius * coordinates[1]];
  },
  _fromScreen: function _fromScreen(coordinates) {
    return [(coordinates[0] - this._x0) / this._xRadius, (coordinates[1] - this._y0) / this._yRadius];
  },
  _toTransformed: function _toTransformed(coordinates) {
    return [coordinates[0] * this._zoom + this._xCenter, coordinates[1] * this._zoom + this._yCenter];
  },
  _toTransformedFast: function _toTransformedFast(coordinates) {
    return [coordinates[0] * this._zoom, coordinates[1] * this._zoom];
  },
  _fromTransformed: function _fromTransformed(coordinates) {
    return [(coordinates[0] - this._xCenter) / this._zoom, (coordinates[1] - this._yCenter) / this._zoom];
  },
  _adjustCenter: function _adjustCenter() {
    var that = this;

    var center = that._engine.project(that._center);

    that._xCenter = -center[0] * that._zoom || 0;
    that._yCenter = -center[1] * that._zoom || 0;
  },
  project: function project(coordinates) {
    return this._engine.project(coordinates);
  },
  transform: function transform(coordinates) {
    return this._toScreen(this._toTransformedFast(coordinates));
  },
  isInvertible: function isInvertible() {
    return this._engine.isInvertible();
  },
  getSquareSize: function getSquareSize(size) {
    return [size[0] * this._zoom * this._xRadius, size[1] * this._zoom * this._yRadius];
  },
  getZoom: function getZoom() {
    return this._zoom;
  },
  _changeZoom: function _changeZoom(value) {
    var that = this;
    var oldZoom = that._zoom;
    var newZoom = that._zoom = parseAndClamp(value, that._minZoom, that._maxZoom, that._minZoom);
    var isChanged = !floatsEqual(oldZoom, newZoom);

    if (isChanged) {
      that._adjustCenter();

      that._fire('zoom');
    }

    return isChanged;
  },
  setZoom: function setZoom(value) {
    if (this._engine.isInvertible() && this._changeZoom(value)) {
      this._triggerZoomChanged();
    }
  },
  getScaledZoom: function getScaledZoom() {
    return _round((this._scale.length - 1) * _ln(this._zoom) / _ln(this._maxZoom));
  },
  setScaledZoom: function setScaledZoom(scaledZoom) {
    this.setZoom(this._scale[_round(scaledZoom)]);
  },
  changeScaledZoom: function changeScaledZoom(deltaZoom) {
    this.setZoom(this._scale[_max(_min(_round(this.getScaledZoom() + deltaZoom), this._scale.length - 1), 0)]);
  },
  getZoomScalePartition: function getZoomScalePartition() {
    return this._scale.length - 1;
  },
  _setupScaling: function _setupScaling() {
    var that = this;

    var k = _max(_round(TWO_TO_LN2 * _ln(that._maxZoom)), 4);

    var step = _pow(that._maxZoom, 1 / k);

    var zoom = that._minZoom;
    that._scale = [zoom];

    for (var i = 1; i <= k; ++i) {
      that._scale.push(zoom *= step);
    }
  },
  setMaxZoom: function setMaxZoom(maxZoom) {
    var that = this;
    that._minZoom = DEFAULT_MIN_ZOOM;
    that._maxZoom = parseAndClamp(maxZoom, that._minZoom, _Number.MAX_VALUE, DEFAULT_MAX_ZOOM);

    that._setupScaling();

    if (that._zoom > that._maxZoom) {
      that.setZoom(that._maxZoom);
    }

    that._fire('max-zoom');
  },
  getCenter: function getCenter() {
    return this._center.slice();
  },
  setCenter: function setCenter(value) {
    if (this._engine.isInvertible() && this._changeCenter(value || [])) {
      this._triggerCenterChanged();
    }
  },
  _changeCenter: function _changeCenter(value) {
    var that = this;
    var engine = that._engine;
    var oldCenter = that._center;
    var newCenter = that._center = parseAndClampArray(value, engine.min(), engine.max(), engine.center());
    var isChanged = !arraysEqual(oldCenter, newCenter);

    if (isChanged) {
      that._adjustCenter();

      that._fire('center');
    }

    return isChanged;
  },
  _triggerCenterChanged: function _triggerCenterChanged() {
    this._params.centerChanged(this.getCenter());
  },
  _triggerZoomChanged: function _triggerZoomChanged() {
    this._params.zoomChanged(this.getZoom());
  },
  setCenterByPoint: function setCenterByPoint(coordinates, screenPosition) {
    var that = this;

    var p = that._engine.project(coordinates);

    var q = that._fromScreen(screenPosition);

    that.setCenter(that._engine.unproject([-q[0] / that._zoom + p[0], -q[1] / that._zoom + p[1]]));
  },
  beginMoveCenter: function beginMoveCenter() {
    if (this._engine.isInvertible()) {
      this._moveCenter = this._center;
    }
  },
  endMoveCenter: function endMoveCenter() {
    var that = this;

    if (that._moveCenter) {
      if (!arraysEqual(that._moveCenter, that._center)) {
        that._triggerCenterChanged();
      }

      that._moveCenter = null;
    }
  },
  moveCenter: function moveCenter(shift) {
    var that = this;

    if (that._moveCenter) {
      var current = that.toScreenPoint(that._center);

      that._changeCenter(that.fromScreenPoint([current[0] + shift[0], current[1] + shift[1]]));
    }
  },
  getViewport: function getViewport() {
    var that = this;
    var unproject = that._engine.unproject;
    var lt = unproject(that._fromTransformed([-1, -1]));
    var lb = unproject(that._fromTransformed([-1, +1]));
    var rt = unproject(that._fromTransformed([+1, -1]));
    var rb = unproject(that._fromTransformed([+1, +1]));
    var minMax = findMinMax([selectFarthestPoint(lt[0], lb[0], rt[0], rb[0]), selectFarthestPoint(lt[1], rt[1], lb[1], rb[1])], [selectFarthestPoint(rt[0], rb[0], lt[0], lb[0]), selectFarthestPoint(lb[1], rb[1], lt[1], rt[1])]);
    return [].concat(minMax.min, minMax.max);
  },
  // T254127
  // There should be no expectation that if viewport is got with `getViewport` and set with `setViewport`
  // then center and zoom will be retained - in general case they will be not.
  // Such retaining requires invertibility of projection which is generally not available
  // Invertibility means that `project(unproject([x, y])) === [x, y]` and `unproject(project([x, y])) === [x, y]` for any reasonable `(x, y)`
  // For example:
  // the "mercator" is non invertible - longitude is invertible, latitude is not (because of tan and log)
  // the "equirectangular" is invertible (it uses simple linear transformations)
  setViewport: function setViewport(viewport) {
    var engine = this._engine;
    var data = viewport ? getZoomAndCenterFromViewport(engine.project, engine.unproject, viewport) : [this._minZoom, engine.center()];
    this.setZoom(data[0]);
    this.setCenter(data[1]);
  },
  getTransform: function getTransform() {
    return {
      translateX: this._xCenter * this._xRadius,
      translateY: this._yCenter * this._yRadius
    };
  },
  fromScreenPoint: function fromScreenPoint(coordinates) {
    return this._engine.unproject(this._fromTransformed(this._fromScreen(coordinates)));
  },
  toScreenPoint: function toScreenPoint(coordinates) {
    return this._toScreen(this._toTransformed(this._engine.project(coordinates)));
  },
  _eventNames: ['engine', 'screen', 'center', 'zoom', 'max-zoom']
};
(0, _event_emitter.makeEventEmitter)(Projection);

function selectFarthestPoint(point1, point2, basePoint1, basePoint2) {
  var basePoint = (basePoint1 + basePoint2) / 2;
  return _abs(point1 - basePoint) > _abs(point2 - basePoint) ? point1 : point2;
}

function selectClosestPoint(point1, point2, basePoint1, basePoint2) {
  var basePoint = (basePoint1 + basePoint2) / 2;
  return _abs(point1 - basePoint) < _abs(point2 - basePoint) ? point1 : point2;
}

function getZoomAndCenterFromViewport(project, unproject, viewport) {
  var lt = project([viewport[0], viewport[3]]);
  var lb = project([viewport[0], viewport[1]]);
  var rt = project([viewport[2], viewport[3]]);
  var rb = project([viewport[2], viewport[1]]);
  var l = selectClosestPoint(lt[0], lb[0], rt[0], rb[0]);
  var r = selectClosestPoint(rt[0], rb[0], lt[0], lb[0]);
  var t = selectClosestPoint(lt[1], rt[1], lb[1], rb[1]);
  var b = selectClosestPoint(lb[1], rb[1], lt[1], rt[1]);
  return [2 / _max(_abs(l - r), _abs(t - b)), unproject([(l + r) / 2, (t + b) / 2])];
}

function setMinMax(engine, p1, p2) {
  var _findMinMax = findMinMax(p1, p2),
      min = _findMinMax.min,
      max = _findMinMax.max;

  engine.min = returnArray(min);
  engine.max = returnArray(max);
}

var Engine = /*#__PURE__*/function () {
  function Engine(parameters) {
    var that = this;
    var project = createProjectMethod(parameters.to);
    var unproject = parameters.from ? createUnprojectMethod(parameters.from) : returnValue(DEFAULT_CENTER);
    that.project = project;
    that.unproject = unproject;
    that.original = returnValue(that);

    that.source = function () {
      return (0, _extend.extend)({}, parameters);
    };

    that.isInvertible = returnValue(!!parameters.from);
    that.ar = returnValue(parameters.aspectRatio > 0 ? _Number(parameters.aspectRatio) : 1);
    that.center = returnArray(unproject([0, 0]));
    setMinMax(that, [unproject([-1, 0])[0], unproject([0, +1])[1]], [unproject([+1, 0])[0], unproject([0, -1])[1]]);
  }

  var _proto = Engine.prototype;

  _proto.aspectRatio = function aspectRatio(_aspectRatio) {
    var engine = new Engine((0, _extend.extend)(this.source(), {
      aspectRatio: _aspectRatio
    }));
    engine.original = this.original;
    engine.min = this.min;
    engine.max = this.max;
    return engine;
  };

  _proto.bounds = function bounds(_bounds) {
    _bounds = _bounds || [];
    var parameters = this.source();
    var min = this.min();
    var max = this.max();
    var b1 = parseAndClampArray([_bounds[0], _bounds[1]], min, max, min);
    var b2 = parseAndClampArray([_bounds[2], _bounds[3]], min, max, max);
    var p1 = parameters.to(b1);
    var p2 = parameters.to(b2);

    var delta = _min(_abs(p2[0] - p1[0]) > MIN_BOUNDS_RANGE ? _abs(p2[0] - p1[0]) : 2, _abs(p2[1] - p1[1]) > MIN_BOUNDS_RANGE ? _abs(p2[1] - p1[1]) : 2);

    if (delta < 2) {
      (0, _extend.extend)(parameters, createProjectUnprojectMethods(parameters.to, parameters.from, p1, p2, delta));
    }

    var engine = new Engine(parameters);
    engine.original = this.original;
    setMinMax(engine, b1, b2);
    return engine;
  };

  return Engine;
}();

function invertVerticalAxis(pair) {
  return [pair[0], -pair[1]];
}

function createProjectMethod(method) {
  return function (arg) {
    return invertVerticalAxis(method(arg));
  };
}

function createUnprojectMethod(method) {
  return function (arg) {
    return method(invertVerticalAxis(arg));
  };
}

function returnValue(value) {
  return function () {
    return value;
  };
}

function returnArray(value) {
  return function () {
    return value.slice();
  };
}

function findMinMax(p1, p2) {
  return {
    min: [_min(p1[0], p2[0]), _min(p1[1], p2[1])],
    max: [_max(p1[0], p2[0]), _max(p1[1], p2[1])]
  };
}

var projection = function projection(parameters) {
  return parameters && parameters.to ? new Engine(parameters) : null;
};

exports.projection = projection;
var projectionsCache = {};

projection.get = function (name) {
  return projectionsCache[name] || null;
};

projection.add = function (name, engine) {
  engine = engine instanceof Engine && engine || projection(engine);

  if (!projectionsCache[name] && engine) {
    projectionsCache[name] = engine;
  }

  return projection; // For chaining
};

function createProjectUnprojectMethods(project, unproject, p1, p2, delta) {
  var x0 = (p1[0] + p2[0]) / 2 - delta / 2;
  var y0 = (p1[1] + p2[1]) / 2 - delta / 2;
  var k = 2 / delta;
  return {
    to: function to(coordinates) {
      var _project = project(coordinates),
          _project2 = _slicedToArray(_project, 2),
          p0 = _project2[0],
          p1 = _project2[1];

      return [-1 + (p0 - x0) * k, -1 + (p1 - y0) * k];
    },
    from: function from(coordinates) {
      return unproject([x0 + (coordinates[0] + 1) / k, y0 + (coordinates[1] + 1) / k]);
    }
  };
}