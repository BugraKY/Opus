import { camelize } from './inflector';
import callOnce from './call_once';
import { isNumeric, isString } from './type';
import domAdapter from '../dom_adapter';
var jsPrefixes = ['', 'Webkit', 'Moz', 'O', 'Ms'];
var cssPrefixes = {
  '': '',
  'Webkit': '-webkit-',
  'Moz': '-moz-',
  'O': '-o-',
  'ms': '-ms-'
};
var getStyles = callOnce(function () {
  return domAdapter.createElement('dx').style;
});

var forEachPrefixes = function forEachPrefixes(prop, callBack) {
  prop = camelize(prop, true);
  var result;

  for (var i = 0, cssPrefixesCount = jsPrefixes.length; i < cssPrefixesCount; i++) {
    var jsPrefix = jsPrefixes[i];
    var prefixedProp = jsPrefix + prop;
    var lowerPrefixedProp = camelize(prefixedProp);
    result = callBack(lowerPrefixedProp, jsPrefix);

    if (result === undefined) {
      result = callBack(prefixedProp, jsPrefix);
    }

    if (result !== undefined) {
      break;
    }
  }

  return result || '';
};

var styleProp = function styleProp(name) {
  if (name in getStyles()) {
    return name;
  }

  var originalName = name;
  name = name.charAt(0).toUpperCase() + name.substr(1);

  for (var i = 1; i < jsPrefixes.length; i++) {
    var prefixedProp = jsPrefixes[i].toLowerCase() + name;

    if (prefixedProp in getStyles()) {
      return prefixedProp;
    }
  }

  return originalName;
};

var stylePropPrefix = function stylePropPrefix(prop) {
  return forEachPrefixes(prop, function (specific, jsPrefix) {
    if (specific in getStyles()) {
      return cssPrefixes[jsPrefix];
    }
  });
};

var pxExceptions = ['fillOpacity', 'columnCount', 'flexGrow', 'flexShrink', 'fontWeight', 'lineHeight', 'opacity', 'zIndex', 'zoom'];

var parsePixelValue = function parsePixelValue(value) {
  if (isNumeric(value)) {
    return value;
  } else if (isString(value)) {
    return Number(value.replace('px', ''));
  }

  return NaN;
};

var normalizeStyleProp = function normalizeStyleProp(prop, value) {
  if (isNumeric(value) && pxExceptions.indexOf(prop) === -1) {
    value += 'px';
  }

  return value;
};

var setDimensionProperty = function setDimensionProperty(elements, propertyName, value) {
  if (elements) {
    value = isNumeric(value) ? value += 'px' : value;

    for (var i = 0; i < elements.length; ++i) {
      elements[i].style[propertyName] = value;
    }
  }
};

var setWidth = function setWidth(elements, value) {
  setDimensionProperty(elements, 'width', value);
};

var setHeight = function setHeight(elements, value) {
  setDimensionProperty(elements, 'height', value);
};

export { styleProp, stylePropPrefix, normalizeStyleProp, parsePixelValue, setWidth, setHeight };