"use strict";

exports.default = _default;
var touchPropsToHook = ['pageX', 'pageY', 'screenX', 'screenY', 'clientX', 'clientY'];

var touchPropHook = function touchPropHook(name, event) {
  if (event[name] && !event.touches || !event.touches) {
    return event[name];
  }

  var touches = event.touches.length ? event.touches : event.changedTouches;

  if (!touches.length) {
    return;
  }

  return touches[0][name];
};

function _default(callback) {
  touchPropsToHook.forEach(function (name) {
    callback(name, function (event) {
      return touchPropHook(name, event);
    });
  }, this);
}

module.exports = exports.default;
module.exports.default = exports.default;