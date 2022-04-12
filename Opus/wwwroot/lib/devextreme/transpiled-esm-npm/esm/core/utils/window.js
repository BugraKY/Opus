/* global window */
import domAdapter from '../dom_adapter';
var hasWindowValue = typeof window !== 'undefined';

var hasWindow = () => hasWindowValue;

var windowObject = hasWindow() ? window : undefined;

if (!windowObject) {
  windowObject = {};
  windowObject.window = windowObject;
}

var getWindow = () => windowObject;

var setWindow = (newWindowObject, hasWindow) => {
  if (hasWindow === undefined) {
    hasWindowValue = typeof window !== 'undefined' && window === newWindowObject;
  } else {
    hasWindowValue = hasWindow;
  }

  windowObject = newWindowObject;
};

var hasProperty = prop => hasWindow() && prop in windowObject;

var defaultScreenFactorFunc = width => {
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

var getCurrentScreenFactor = screenFactorCallback => {
  var screenFactorFunc = screenFactorCallback || defaultScreenFactorFunc;
  var windowWidth = domAdapter.getDocumentElement()['clientWidth'];
  return screenFactorFunc(windowWidth);
};

var getNavigator = () => hasWindow() ? windowObject.navigator : {
  userAgent: ''
};

export { hasWindow, getWindow, setWindow, hasProperty, defaultScreenFactorFunc, getCurrentScreenFactor, getNavigator };