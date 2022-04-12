"use strict";

exports.default = void 0;

var _promise = _interopRequireDefault(require("../../core/polyfills/promise"));

var _extend = require("../../core/utils/extend");

var _iterator = require("../../core/utils/iterator");

var _provider = _interopRequireDefault(require("./provider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var abstract = _provider.default.abstract;

var DynamicProvider = _provider.default.inherit({
  _geocodeLocation: function _geocodeLocation(location) {
    return new _promise.default(function (resolve) {
      var cache = this._geocodedLocations;
      var cachedLocation = cache[location];

      if (cachedLocation) {
        resolve(cachedLocation);
      } else {
        this._geocodeLocationImpl(location).then(function (geocodedLocation) {
          cache[location] = geocodedLocation;
          resolve(geocodedLocation);
        });
      }
    }.bind(this));
  },
  _renderImpl: function _renderImpl() {
    return this._load().then(function () {
      return this._init();
    }.bind(this)).then(function () {
      return _promise.default.all([this.updateMapType(), this._areBoundsSet() ? this.updateBounds() : this.updateCenter()]);
    }.bind(this)).then(function () {
      this._attachHandlers(); // NOTE: setTimeout is needed by providers to correctly initialize bounds


      return new _promise.default(function (resolve) {
        var timeout = setTimeout(function () {
          clearTimeout(timeout);
          resolve();
        });
      });
    }.bind(this));
  },
  _load: function _load() {
    if (!this._mapsLoader) {
      this._mapsLoader = this._loadImpl();
    }

    this._markers = [];
    this._routes = [];
    return this._mapsLoader;
  },
  _loadImpl: abstract,
  _init: abstract,
  _attachHandlers: abstract,
  addMarkers: function addMarkers(options) {
    return _promise.default.all((0, _iterator.map)(options, function (options) {
      return this._addMarker(options);
    }.bind(this))).then(function (markerObjects) {
      this._fitBounds();

      return [false, (0, _iterator.map)(markerObjects, function (markerObject) {
        return markerObject.marker;
      })];
    }.bind(this));
  },
  _addMarker: function _addMarker(options) {
    return this._renderMarker(options).then(function (markerObject) {
      this._markers.push((0, _extend.extend)({
        options: options
      }, markerObject));

      this._fireMarkerAddedAction({
        options: options,
        originalMarker: markerObject.marker
      });

      return markerObject;
    }.bind(this));
  },
  _renderMarker: abstract,
  removeMarkers: function removeMarkers(markersOptionsToRemove) {
    var that = this;
    (0, _iterator.each)(markersOptionsToRemove, function (_, markerOptionToRemove) {
      that._removeMarker(markerOptionToRemove);
    });
    return _promise.default.resolve();
  },
  _removeMarker: function _removeMarker(markersOptionToRemove) {
    var that = this;
    (0, _iterator.each)(this._markers, function (markerIndex, markerObject) {
      if (markerObject.options !== markersOptionToRemove) {
        return true;
      }

      that._destroyMarker(markerObject);

      that._markers.splice(markerIndex, 1);

      that._fireMarkerRemovedAction({
        options: markerObject.options
      });

      return false;
    });
  },
  _destroyMarker: abstract,
  _clearMarkers: function _clearMarkers() {
    while (this._markers.length > 0) {
      this._removeMarker(this._markers[0].options);
    }
  },
  addRoutes: function addRoutes(options) {
    return _promise.default.all((0, _iterator.map)(options, function (options) {
      return this._addRoute(options);
    }.bind(this))).then(function (routeObjects) {
      this._fitBounds();

      return [false, (0, _iterator.map)(routeObjects, function (routeObject) {
        return routeObject.instance;
      })];
    }.bind(this));
  },
  _addRoute: function _addRoute(options) {
    return this._renderRoute(options).then(function (routeObject) {
      this._routes.push((0, _extend.extend)({
        options: options
      }, routeObject));

      this._fireRouteAddedAction({
        options: options,
        originalRoute: routeObject.instance
      });

      return routeObject;
    }.bind(this));
  },
  _renderRoute: abstract,
  removeRoutes: function removeRoutes(options) {
    var that = this;
    (0, _iterator.each)(options, function (routeIndex, options) {
      that._removeRoute(options);
    });
    return _promise.default.resolve();
  },
  _removeRoute: function _removeRoute(options) {
    var that = this;
    (0, _iterator.each)(this._routes, function (routeIndex, routeObject) {
      if (routeObject.options !== options) {
        return true;
      }

      that._destroyRoute(routeObject);

      that._routes.splice(routeIndex, 1);

      that._fireRouteRemovedAction({
        options: options
      });

      return false;
    });
  },
  _destroyRoute: abstract,
  _clearRoutes: function _clearRoutes() {
    while (this._routes.length > 0) {
      this._removeRoute(this._routes[0].options);
    }
  },
  adjustViewport: function adjustViewport() {
    return this._fitBounds();
  },
  isEventsCanceled: function isEventsCanceled() {
    return true;
  },
  _fitBounds: abstract,
  _updateBounds: function _updateBounds() {
    var that = this;

    this._clearBounds();

    if (!this._option('autoAdjust')) {
      return;
    }

    (0, _iterator.each)(this._markers, function (_, markerObject) {
      that._extendBounds(markerObject.location);
    });
    (0, _iterator.each)(this._routes, function (_, routeObject) {
      routeObject.northEast && that._extendBounds(routeObject.northEast);
      routeObject.southWest && that._extendBounds(routeObject.southWest);
    });
  },
  _clearBounds: function _clearBounds() {
    this._bounds = null;
  },
  _extendBounds: abstract
});

var _default = DynamicProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;