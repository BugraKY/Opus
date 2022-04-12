"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

exports.zoomstart = exports.zoomend = exports.zoom = exports.translatestart = exports.translateend = exports.translate = exports.transformstart = exports.transformend = exports.transform = exports.rotatestart = exports.rotateend = exports.rotate = exports.pinchstart = exports.pinchend = exports.pinch = void 0;

var _math = require("../core/utils/math");

var iteratorUtils = _interopRequireWildcard(require("../core/utils/iterator"));

var _index = require("./utils/index");

var _emitter = _interopRequireDefault(require("./core/emitter"));

var _emitter_registrator = _interopRequireDefault(require("./core/emitter_registrator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var DX_PREFIX = 'dx';
var TRANSFORM = 'transform';
var TRANSLATE = 'translate';
var PINCH = 'pinch';
var ROTATE = 'rotate';
var START_POSTFIX = 'start';
var UPDATE_POSTFIX = '';
var END_POSTFIX = 'end';
var eventAliases = [];

var addAlias = function addAlias(eventName, eventArgs) {
  eventAliases.push({
    name: eventName,
    args: eventArgs
  });
};

addAlias(TRANSFORM, {
  scale: true,
  deltaScale: true,
  rotation: true,
  deltaRotation: true,
  translation: true,
  deltaTranslation: true
});
addAlias(TRANSLATE, {
  translation: true,
  deltaTranslation: true
});
addAlias(PINCH, {
  scale: true,
  deltaScale: true
});
addAlias(ROTATE, {
  rotation: true,
  deltaRotation: true
});

var getVector = function getVector(first, second) {
  return {
    x: second.pageX - first.pageX,
    y: -second.pageY + first.pageY,
    centerX: (second.pageX + first.pageX) * 0.5,
    centerY: (second.pageY + first.pageY) * 0.5
  };
};

var getEventVector = function getEventVector(e) {
  var pointers = e.pointers;
  return getVector(pointers[0], pointers[1]);
};

var getDistance = function getDistance(vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
};

var getScale = function getScale(firstVector, secondVector) {
  return getDistance(firstVector) / getDistance(secondVector);
};

var getRotation = function getRotation(firstVector, secondVector) {
  var scalarProduct = firstVector.x * secondVector.x + firstVector.y * secondVector.y;
  var distanceProduct = getDistance(firstVector) * getDistance(secondVector);

  if (distanceProduct === 0) {
    return 0;
  }

  var sign = (0, _math.sign)(firstVector.x * secondVector.y - secondVector.x * firstVector.y);
  var angle = Math.acos((0, _math.fitIntoRange)(scalarProduct / distanceProduct, -1, 1));
  return sign * angle;
};

var getTranslation = function getTranslation(firstVector, secondVector) {
  return {
    x: firstVector.centerX - secondVector.centerX,
    y: firstVector.centerY - secondVector.centerY
  };
};

var TransformEmitter = _emitter.default.inherit({
  validatePointers: function validatePointers(e) {
    return (0, _index.hasTouches)(e) > 1;
  },
  start: function start(e) {
    this._accept(e);

    var startVector = getEventVector(e);
    this._startVector = startVector;
    this._prevVector = startVector;

    this._fireEventAliases(START_POSTFIX, e);
  },
  move: function move(e) {
    var currentVector = getEventVector(e);

    var eventArgs = this._getEventArgs(currentVector);

    this._fireEventAliases(UPDATE_POSTFIX, e, eventArgs);

    this._prevVector = currentVector;
  },
  end: function end(e) {
    var eventArgs = this._getEventArgs(this._prevVector);

    this._fireEventAliases(END_POSTFIX, e, eventArgs);
  },
  _getEventArgs: function _getEventArgs(vector) {
    return {
      scale: getScale(vector, this._startVector),
      deltaScale: getScale(vector, this._prevVector),
      rotation: getRotation(vector, this._startVector),
      deltaRotation: getRotation(vector, this._prevVector),
      translation: getTranslation(vector, this._startVector),
      deltaTranslation: getTranslation(vector, this._prevVector)
    };
  },
  _fireEventAliases: function _fireEventAliases(eventPostfix, originalEvent, eventArgs) {
    eventArgs = eventArgs || {};
    iteratorUtils.each(eventAliases, function (_, eventAlias) {
      var args = {};
      iteratorUtils.each(eventAlias.args, function (name) {
        if (name in eventArgs) {
          args[name] = eventArgs[name];
        }
      });

      this._fireEvent(DX_PREFIX + eventAlias.name + eventPostfix, originalEvent, args);
    }.bind(this));
  }
});
/**
 * @name UI Events.dxtransformstart
 * @type eventType
 * @type_function_param1 event:event
 * @type_function_param1_field1 cancel:boolean
 * @module events/transform
*/

/**
  * @name UI Events.dxtransform
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 scale:number
  * @type_function_param1_field2 deltaScale:number
  * @type_function_param1_field3 rotation:number
  * @type_function_param1_field4 deltaRotation:number
  * @type_function_param1_field5 translation:object
  * @type_function_param1_field6 deltaTranslation:object
  * @type_function_param1_field7 cancel:boolean
  * @module events/transform
*/

/**
  * @name UI Events.dxtransformend
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 scale:number
  * @type_function_param1_field2 deltaScale:number
  * @type_function_param1_field3 rotation:number
  * @type_function_param1_field4 deltaRotation:number
  * @type_function_param1_field5 translation:object
  * @type_function_param1_field6 deltaTranslation:object
  * @type_function_param1_field7 cancel:boolean
  * @module events/transform
*/

/**
 * @name UI Events.dxtranslatestart
 * @type eventType
 * @type_function_param1 event:event
 * @type_function_param1_field1 cancel:boolean
 * @module events/transform
*/

/**
  * @name UI Events.dxtranslate
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 translation:object
  * @type_function_param1_field2 deltaTranslation:object
  * @type_function_param1_field3 cancel:boolean
  * @module events/transform
*/

/**
  * @name UI Events.dxtranslateend
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 translation:object
  * @type_function_param1_field2 deltaTranslation:object
  * @type_function_param1_field3 cancel:boolean
  * @module events/transform
*/

/**
* @name UI Events.dxpinchstart
* @type eventType
* @type_function_param1 event:event
* @type_function_param1_field1 cancel:boolean
* @module events/transform
   */

/**
  * @name UI Events.dxpinch
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 scale:number
  * @type_function_param1_field2 deltaScale:number
  * @type_function_param1_field3 cancel:boolean
  * @module events/transform
*/

/**
  * @name UI Events.dxpinchend
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 scale:number
  * @type_function_param1_field2 deltaScale:number
  * @type_function_param1_field3 cancel:boolean
  * @module events/transform
*/

/**
 * @name UI Events.dxrotatestart
 * @type eventType
 * @type_function_param1 event:event
 * @type_function_param1_field1 cancel:boolean
 * @module events/transform
*/

/**
  * @name UI Events.dxrotate
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 rotation:number
  * @type_function_param1_field2 deltaRotation:number
  * @type_function_param1_field3 cancel:boolean
  * @module events/transform
*/

/**
  * @name UI Events.dxrotateend
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 rotation:number
  * @type_function_param1_field2 deltaRotation:number
  * @type_function_param1_field3 cancel:boolean
  * @module events/transform
*/


var eventNames = eventAliases.reduce(function (result, eventAlias) {
  [START_POSTFIX, UPDATE_POSTFIX, END_POSTFIX].forEach(function (eventPostfix) {
    result.push(DX_PREFIX + eventAlias.name + eventPostfix);
  });
  return result;
}, []);
(0, _emitter_registrator.default)({
  emitter: TransformEmitter,
  events: eventNames
});
var exportNames = {};
iteratorUtils.each(eventNames, function (_, eventName) {
  exportNames[eventName.substring(DX_PREFIX.length)] = eventName;
});
/* eslint-disable spellcheck/spell-checker */

var transformstart = exportNames.transformstart,
    transform = exportNames.transform,
    transformend = exportNames.transformend,
    translatestart = exportNames.translatestart,
    translate = exportNames.translate,
    translateend = exportNames.translateend,
    zoomstart = exportNames.zoomstart,
    zoom = exportNames.zoom,
    zoomend = exportNames.zoomend,
    pinchstart = exportNames.pinchstart,
    pinch = exportNames.pinch,
    pinchend = exportNames.pinchend,
    rotatestart = exportNames.rotatestart,
    rotate = exportNames.rotate,
    rotateend = exportNames.rotateend;
exports.rotateend = rotateend;
exports.rotate = rotate;
exports.rotatestart = rotatestart;
exports.pinchend = pinchend;
exports.pinch = pinch;
exports.pinchstart = pinchstart;
exports.zoomend = zoomend;
exports.zoom = zoom;
exports.zoomstart = zoomstart;
exports.translateend = translateend;
exports.translate = translate;
exports.translatestart = translatestart;
exports.transformend = transformend;
exports.transform = transform;
exports.transformstart = transformstart;