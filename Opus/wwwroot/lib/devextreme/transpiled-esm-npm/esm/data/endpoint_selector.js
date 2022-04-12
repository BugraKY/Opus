/* global Debug*/
import errors from '../core/errors';
import { getWindow } from '../core/utils/window';
var window = getWindow();
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
      throw errors.Error('E0006');
    }

    if (bag.production) {
      if (IS_WINJS_ORIGIN && !Debug.debuggerEnabled || !IS_WINJS_ORIGIN && !IS_LOCAL_ORIGIN) {
        return bag.production;
      }
    }

    return bag.local;
  }
};
export default EndpointSelector;