"use strict";

exports.setWindow = exports.hasWindow = exports.hasProperty = exports.getWindow = exports.getNavigator = exports.getCurrentScreenFactor = exports.defaultScreenFactorFunc = void 0;

var _dom_adapter = _interopRequireDefault(require("../dom_adapter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global window */
var hasWindowValue = typeof window !== 'undefined';

var hasWindow = function hasWindow() {
  return hasWindowValue;
};

exports.hasWindow = hasWindow;
var windowObject = hasWindow() ? window : undefined;

if (!windowObject) {
  windowObject = {};
  windowObject.window = windowObject;
}

var getWindow = function getWindow() {
  return windowObject;
};

exports.getWindow = getWindow;

var setWindow = function setWindow(newWindowObject, hasWindow) {
  if (hasWindow === undefined) {
    hasWindowValue = typeof window !== 'undefined' && window === newWindowObject;
  } else {
    hasWindowValue = hasWindow;
  }

  windowObject = newWindowObject;
};

exports.setWindow = setWindow;

var hasProperty = function hasProperty(prop) {
  return hasWindow() && prop in windowObject;
};

exports.hasProperty = hasProperty;

var defaultScreenFactorFunc = function defaultScreenFactorFunc(width) {
  if (width < 768) {
    return 'xs';
  } else if (width < 992) {
    return 'sm';
  } else if (width < 1200) {
    return 'md';
  } else {
    return 'lg';
  }
};

exports.defaultScreenFactorFunc = defaultScreenFactorFunc;

var getCurrentScreenFactor = function getCurrentScreenFactor(screenFactorCallback) {
  var screenFactorFunc = screenFactorCallback || defaultScreenFactorFunc;

  var windowWidth = _dom_adapter.default.getDocumentElement()['clientWidth'];

  return screenFactorFunc(windowWidth);
};

exports.getCurrentScreenFactor = getCurrentScreenFactor;

var getNavigator = function getNavigator() {
  return hasWindow() ? windowObject.navigator : {
    userAgent: ''
  };
};

exports.getNavigator = getNavigator;