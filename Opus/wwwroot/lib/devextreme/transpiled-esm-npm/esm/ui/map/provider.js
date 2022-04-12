import Promise from '../../core/polyfills/promise';
import Class from '../../core/class';
import { map } from '../../core/utils/iterator';
import { isPlainObject, isNumeric } from '../../core/utils/type';
import { addNamespace } from '../../events/utils/index';
var abstract = Class.abstract;
var Provider = Class.inherit({
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
      return Promise.all([this._applyFunctionIfNeeded('addMarkers', markerOptions), this._applyFunctionIfNeeded('addRoutes', routeOptions)]).then(function () {
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
    return new Promise(function (resolve) {
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
    return new Promise(function (resolve) {
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
      var coords = map(location.split(','), function (item) {
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
    } else if (isPlainObject(location) && isNumeric(location.lat) && isNumeric(location.lng)) {
      return location;
    }

    return null;
  },
  _areBoundsSet: function _areBoundsSet() {
    return this._option('bounds.northEast') && this._option('bounds.southWest');
  },
  _addEventNamespace: function _addEventNamespace(name) {
    return addNamespace(name, this._mapWidget.NAME);
  },
  _applyFunctionIfNeeded: function _applyFunctionIfNeeded(fnName, array) {
    if (!array.length) {
      return Promise.resolve();
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
export default Provider;