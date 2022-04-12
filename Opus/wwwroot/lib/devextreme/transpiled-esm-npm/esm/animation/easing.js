import { isFunction } from '../core/utils/type';
var CSS_TRANSITION_EASING_REGEX = /cubic-bezier\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)/;
var TransitionTimingFuncMap = {
  'linear': 'cubic-bezier(0, 0, 1, 1)',
  'swing': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
  'ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  'ease-in': 'cubic-bezier(0.42, 0, 1, 1)',
  'ease-out': 'cubic-bezier(0, 0, 0.58, 1)',
  'ease-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)'
};

var polynomBezier = function polynomBezier(x1, y1, x2, y2) {
  var Cx = 3 * x1;
  var Bx = 3 * (x2 - x1) - Cx;
  var Ax = 1 - Cx - Bx;
  var Cy = 3 * y1;
  var By = 3 * (y2 - y1) - Cy;
  var Ay = 1 - Cy - By;

  var bezierX = function bezierX(t) {
    return t * (Cx + t * (Bx + t * Ax));
  };

  var bezierY = function bezierY(t) {
    return t * (Cy + t * (By + t * Ay));
  };

  var derivativeX = function derivativeX(t) {
    return Cx + t * (2 * Bx + t * 3 * Ax);
  };

  var findXFor = function findXFor(t) {
    var x = t;
    var i = 0;
    var z;

    while (i < 14) {
      z = bezierX(x) - t;

      if (Math.abs(z) < 1e-3) {
        break;
      }

      x = x - z / derivativeX(x);
      i++;
    }

    return x;
  };

  return function (t) {
    return bezierY(findXFor(t));
  };
};

var easing = {};
export var convertTransitionTimingFuncToEasing = function convertTransitionTimingFuncToEasing(cssTransitionEasing) {
  cssTransitionEasing = TransitionTimingFuncMap[cssTransitionEasing] || cssTransitionEasing;
  var coeffs = cssTransitionEasing.match(CSS_TRANSITION_EASING_REGEX);
  var forceName;

  if (!coeffs) {
    forceName = 'linear';
    coeffs = TransitionTimingFuncMap[forceName].match(CSS_TRANSITION_EASING_REGEX);
  }

  coeffs = coeffs.slice(1, 5);

  for (var i = 0; i < coeffs.length; i++) {
    coeffs[i] = parseFloat(coeffs[i]);
  }

  var easingName = forceName || 'cubicbezier_' + coeffs.join('_').replace(/\./g, 'p');

  if (!isFunction(easing[easingName])) {
    easing[easingName] = function (x, t, b, c, d) {
      return c * polynomBezier(coeffs[0], coeffs[1], coeffs[2], coeffs[3])(t / d) + b;
    };
  }

  return easingName;
};
export function setEasing(value) {
  easing = value;
}
export function getEasing(name) {
  return easing[name];
}