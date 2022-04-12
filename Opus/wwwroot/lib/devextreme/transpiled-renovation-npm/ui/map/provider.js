"use strict";

exports.default = void 0;

var _promise = _interopRequireDefault(require("../../core/polyfills/promise"));

var _class = _interopRequireDefault(require("../../core/class"));

var _iterator = require("../../core/utils/iterator");

var _type = require("../../core/utils/type");

var _index = require("../../events/utils/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var abstract = _class.default.abstract;

var Provider = _class.default.inherit({
  _defaultRouteWeight: function _defaultRouteWeight() {
    return 5;
  },
  _defaultRouteOpacity: function _defaultRouteOpacity() {
    return 0.5;
  },
  _defaultRouteColor: function _defaultRouteColor() {
    return '#0000FF';
  },
  ctor: function ctor(map, $container) {
    this._mapWidget = map;
    this._$container = $container;
  },
  render: function render(markerOptions, routeOptions) {
    return this._renderImpl().then(function () {
      return _promise.default.all([this._applyFunctionIfNeeded('addMarkers', markerOptions), this._applyFunctionIfNeeded('addRoutes', routeOptions)]).then(function () {
        return true;
      });
    }.bind(this));
  },
  _renderImpl: abstract,
  updateDimensions: abstract,
  updateMapType: abstract,
  updateBounds: abstract,
  updateCenter: abstract,
  updateZoom: abstract,
  updateControls: abstract,
  updateMarkers: function updateMarkers(markerOptionsToRemove, markerOptionsToAdd) {
    return new _promise.default(function (resolve) {
      return this._applyFunctionIfNeeded('removeMarkers', markerOptionsToRemove).then(function (removeValue) {
        this._applyFunctionIfNeeded('addMarkers', markerOptionsToAdd).then(function (addValue) {
          resolve(addValue ? addValue : removeValue);
        });
      }.bind(this));
    }.bind(this));
  },
  addMarkers: abstract,
  removeMarkers: abstract,
  adjustViewport: abstract,
  updateRoutes: function updateRoutes(routeOptionsToRemove, routeOptionsToAdd) {
    return new _promise.default(function (resolve) {
      return this._applyFunctionIfNeeded('removeRoutes', routeOptionsToRemove).then(function (removeValue) {
        this._applyFunctionIfNeeded('addRoutes', routeOptionsToAdd).then(function (addValue) {
          resolve(addValue ? addValue : removeValue);
        });
      }.bind(this));
    }.bind(this));
  },
  addRoutes: abstract,
  removeRoutes: abstract,
  clean: abstract,
  map: function map() {
    return this._map;
  },
  isEventsCanceled: function isEventsCanceled() {
    return false;
  },
  _option: function _option(name, value) {
    if (value === undefined) {
      return this._mapWidget.option(name);
    }

    this._mapWidget.setOptionSilent(name, value);
  },
  _keyOption: function _keyOption(providerName) {
    var key = this._option('apiKey');

    return key[providerName] === undefined ? key : key[providerName];
  },
  _parseTooltipOptions: function _parseTooltipOptions(option) {
    return {
      text: option.text || option,
      visible: option.isShown || false
    };
  },
  _getLatLng: function _getLatLng(location) {
    if (typeof location === 'string') {
      var coords = (0, _iterator.map)(location.split(','), function (item) {
        return item.trim();
      });
      var numericRegex = /^[-+]?[0-9]*\.?[0-9]*$/;

      if (coords.length === 2 && coords[0].match(numericRegex) && coords[1].match(numericRegex)) {
        return {
          lat: parseFloat(coords[0]),
          lng: parseFloat(coords[1])
        };
      }
    } else if (Array.isArray(location) && location.length === 2) {
      return {
        lat: location[0],
        lng: location[1]
      };
    } else if ((0, _type.isPlainObject)(location) && (0, _type.isNumeric)(location.lat) && (0, _type.isNumeric)(location.lng)) {
      return location;
    }

    return null;
  },
  _areBoundsSet: function _areBoundsSet() {
    return this._option('bounds.northEast') && this._option('bounds.southWest');
  },
  _addEventNamespace: function _addEventNamespace(name) {
    return (0, _index.addNamespace)(name, this._mapWidget.NAME);
  },
  _applyFunctionIfNeeded: function _applyFunctionIfNeeded(fnName, array) {
    if (!array.length) {
      return _promise.default.resolve();
    }

    return this[fnName](array);
  },
  _fireAction: function _fireAction(name, actionArguments) {
    this._mapWidget._createActionByOption(name)(actionArguments);
  },
  _fireClickAction: function _fireClickAction(actionArguments) {
    this._fireAction('onClick', actionArguments);
  },
  _fireMarkerAddedAction: function _fireMarkerAddedAction(actionArguments) {
    this._fireAction('onMarkerAdded', actionArguments);
  },
  _fireMarkerRemovedAction: function _fireMarkerRemovedAction(actionArguments) {
    this._fireAction('onMarkerRemoved', actionArguments);
  },
  _fireRouteAddedAction: function _fireRouteAddedAction(actionArguments) {
    this._fireAction('onRouteAdded', actionArguments);
  },
  _fireRouteRemovedAction: function _fireRouteRemovedAction(actionArguments) {
    this._fireAction('onRouteRemoved', actionArguments);
  }
});

var _default = Provider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;