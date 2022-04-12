"use strict";

exports.isInputEventsL2Supported = isInputEventsL2Supported;

var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));

var _devices = _interopRequireDefault(require("../../core/devices"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Must become obsolete after the fix https://bugs.chromium.org/p/chromium/issues/detail?id=947408
function isModernAndroidDevice() {
  var _devices$real = _devices.default.real(),
      android = _devices$real.android,
      version = _devices$real.version;

  return android && version[0] > 4;
}

function isInputEventsL2Supported() {
  return 'onbeforeinput' in _dom_adapter.default.createElement('input') || isModernAndroidDevice();
}