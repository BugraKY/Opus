import $ from '../core/renderer';
import { data as elementData, removeData } from '../core/element_data';
import { type } from '../core/utils/type';
var TRANSLATOR_DATA_KEY = 'dxTranslator';
var TRANSFORM_MATRIX_REGEX = /matrix(3d)?\((.+?)\)/;
var TRANSLATE_REGEX = /translate(?:3d)?\((.+?)\)/;
export var locate = function locate($element) {
  $element = $($element);
  var translate = getTranslate($element);
  return {
    left: translate.x,
    top: translate.y
  };
};

function isPercentValue(value) {
  return type(value) === 'string' && value[value.length - 1] === '%';
}

function cacheTranslate($element, translate) {
  if ($element.length) {
    elementData($element.get(0), TRANSLATOR_DATA_KEY, translate);
  }
}

export var clearCache = function clearCache($element) {
  if ($element.length) {
    removeData($element.get(0), TRANSLATOR_DATA_KEY);
  }
};
export var getTranslateCss = function getTranslateCss(translate) {
  translate.x = translate.x || 0;
  translate.y = translate.y || 0;
  var xValueString = isPercentValue(translate.x) ? translate.x : translate.x + 'px';
  var yValueString = isPercentValue(translate.y) ? translate.y : translate.y + 'px';
  return 'translate(' + xValueString + ', ' + yValueString + ')';
};
export var getTranslate = function getTranslate($element) {
  var result = $element.length ? elementData($element.get(0), TRANSLATOR_DATA_KEY) : null;

  if (!result) {
    var transformValue = $element.css('transform') || getTranslateCss({
      x: 0,
      y: 0
    });
    var matrix = transformValue.match(TRANSFORM_MATRIX_REGEX);
    var is3D = matrix && matrix[1];

    if (matrix) {
      matrix = matrix[2].split(',');

      if (is3D === '3d') {
        matrix = matrix.slice(12, 15);
      } else {
        matrix.push(0);
        matrix = matrix.slice(4, 7);
      }
    } else {
      matrix = [0, 0, 0];
    }

    result = {
      x: parseFloat(matrix[0]),
      y: parseFloat(matrix[1]),
      z: parseFloat(matrix[2])
    };
    cacheTranslate($element, result);
  }

  return result;
};
export var move = function move($element, position) {
  $element = $($element);
  var left = position.left;
  var top = position.top;
  var translate;

  if (left === undefined) {
    translate = getTranslate($element);
    translate.y = top || 0;
  } else if (top === undefined) {
    translate = getTranslate($element);
    translate.x = left || 0;
  } else {
    translate = {
      x: left || 0,
      y: top || 0,
      z: 0
    };
    cacheTranslate($element, translate);
  }

  $element.css({
    transform: getTranslateCss(translate)
  });

  if (isPercentValue(left) || isPercentValue(top)) {
    clearCache($element);
  }
};
export var resetPosition = function resetPosition($element, finishTransition) {
  $element = $($element);
  var originalTransition;
  var stylesConfig = {
    left: 0,
    top: 0,
    transform: 'none'
  };

  if (finishTransition) {
    originalTransition = $element.css('transition');
    stylesConfig.transition = 'none';
  }

  $element.css(stylesConfig);
  clearCache($element);

  if (finishTransition) {
    $element.get(0).offsetHeight;
    $element.css('transition', originalTransition);
  }
};
export var parseTranslate = function parseTranslate(translateString) {
  var result = translateString.match(TRANSLATE_REGEX);

  if (!result || !result[1]) {
    return;
  }

  result = result[1].split(',');
  result = {
    x: parseFloat(result[0]),
    y: parseFloat(result[1]),
    z: parseFloat(result[2])
  };
  return result;
};