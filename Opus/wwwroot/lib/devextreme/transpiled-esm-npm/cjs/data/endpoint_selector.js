"use strict";

exports.default = void 0;

var _errors = _interopRequireDefault(require("../core/errors"));

var _window = require("../core/utils/window");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global Debug*/
var window = (0, _window.getWindow)();
var IS_WINJS_ORIGIN;
var IS_LOCAL_ORIGIN;

function isLocalHostName(url) {
  return /^(localhost$|127\.)/i.test(url); // TODO more precise check for 127.x.x.x IP
}
/**
* @name EndpointSelector.ctor
* @publicName ctor(options)
* @param1 options:Object
* @hidden
*/


var EndpointSelector = function EndpointSelector(config) {
  this.config = config;
  IS_WINJS_ORIGIN = window.location.protocol === 'ms-appx:';
  IS_LOCAL_ORIGIN = isLocalHostName(window.location.hostname);
};

EndpointSelector.prototype = {
  urlFor: function urlFor(key) {
    var bag = this.config[key];

    if (!bag) {
      throw _errors.default.Error('E0006');
    }

    if (bag.production) {
      if (IS_WINJS_ORIGIN && !Debug.debuggerEnabled || !IS_WINJS_ORIGIN && !IS_LOCAL_ORIGIN) {
        return bag.production;
      }
    }

    return bag.local;
  }
};
var _default = EndpointSelector;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;