"use strict";

exports.swipe = exports.start = exports.end = void 0;

var _size = require("../core/utils/size");

var _index = require("./utils/index");

var _emitter = _interopRequireDefault(require("./gesture/emitter.gesture"));

var _emitter_registrator = _interopRequireDefault(require("./core/emitter_registrator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SWIPE_START_EVENT = 'dxswipestart';
exports.start = SWIPE_START_EVENT;
var SWIPE_EVENT = 'dxswipe';
exports.swipe = SWIPE_EVENT;
var SWIPE_END_EVENT = 'dxswipeend';
exports.end = SWIPE_END_EVENT;
var HorizontalStrategy = {
  defaultItemSizeFunc: function defaultItemSizeFunc() {
    return (0, _size.getWidth)(this.getElement());
  },
  getBounds: function getBounds() {
    return [this._maxLeftOffset, this._maxRightOffset];
  },
  calcOffsetRatio: function calcOffsetRatio(e) {
    var endEventData = (0, _index.eventData)(e);
    return (endEventData.x - (this._savedEventData && this._savedEventData.x || 0)) / this._itemSizeFunc().call(this, e);
  },
  isFastSwipe: function isFastSwipe(e) {
    var endEventData = (0, _index.eventData)(e);
    return this.FAST_SWIPE_SPEED_LIMIT * Math.abs(endEventData.x - this._tickData.x) >= endEventData.time - this._tickData.time;
  }
};
var VerticalStrategy = {
  defaultItemSizeFunc: function defaultItemSizeFunc() {
    return (0, _size.getHeight)(this.getElement());
  },
  getBounds: function getBounds() {
    return [this._maxTopOffset, this._maxBottomOffset];
  },
  calcOffsetRatio: function calcOffsetRatio(e) {
    var endEventData = (0, _index.eventData)(e);
    return (endEventData.y - (this._savedEventData && this._savedEventData.y || 0)) / this._itemSizeFunc().call(this, e);
  },
  isFastSwipe: function isFastSwipe(e) {
    var endEventData = (0, _index.eventData)(e);
    return this.FAST_SWIPE_SPEED_LIMIT * Math.abs(endEventData.y - this._tickData.y) >= endEventData.time - this._tickData.time;
  }
};
var STRATEGIES = {
  'horizontal': HorizontalStrategy,
  'vertical': VerticalStrategy
};

var SwipeEmitter = _emitter.default.inherit({
  TICK_INTERVAL: 300,
  FAST_SWIPE_SPEED_LIMIT: 10,
  ctor: function ctor(element) {
    this.callBase(element);
    this.direction = 'horizontal';
    this.elastic = true;
  },
  _getStrategy: function _getStrategy() {
    return STRATEGIES[this.direction];
  },
  _defaultItemSizeFunc: function _defaultItemSizeFunc() {
    return this._getStrategy().defaultItemSizeFunc.call(this);
  },
  _itemSizeFunc: function _itemSizeFunc() {
    return this.itemSizeFunc || this._defaultItemSizeFunc;
  },
  _init: function _init(e) {
    this._tickData = (0, _index.eventData)(e);
  },
  _start: function _start(e) {
    this._savedEventData = (0, _index.eventData)(e);
    e = this._fireEvent(SWIPE_START_EVENT, e);

    if (!e.cancel) {
      this._maxLeftOffset = e.maxLeftOffset;
      this._maxRightOffset = e.maxRightOffset;
      this._maxTopOffset = e.maxTopOffset;
      this._maxBottomOffset = e.maxBottomOffset;
    }
  },
  _move: function _move(e) {
    var strategy = this._getStrategy();

    var moveEventData = (0, _index.eventData)(e);
    var offset = strategy.calcOffsetRatio.call(this, e);
    offset = this._fitOffset(offset, this.elastic);

    if (moveEventData.time - this._tickData.time > this.TICK_INTERVAL) {
      this._tickData = moveEventData;
    }

    this._fireEvent(SWIPE_EVENT, e, {
      offset: offset
    });

    e.preventDefault();
  },
  _end: function _end(e) {
    var strategy = this._getStrategy();

    var offsetRatio = strategy.calcOffsetRatio.call(this, e);
    var isFast = strategy.isFastSwipe.call(this, e);
    var startOffset = offsetRatio;

    var targetOffset = this._calcTargetOffset(offsetRatio, isFast);

    startOffset = this._fitOffset(startOffset, this.elastic);
    targetOffset = this._fitOffset(targetOffset, false);

    this._fireEvent(SWIPE_END_EVENT, e, {
      offset: startOffset,
      targetOffset: targetOffset
    });
  },
  _fitOffset: function _fitOffset(offset, elastic) {
    var strategy = this._getStrategy();

    var bounds = strategy.getBounds.call(this);

    if (offset < -bounds[0]) {
      return elastic ? (-2 * bounds[0] + offset) / 3 : -bounds[0];
    }

    if (offset > bounds[1]) {
      return elastic ? (2 * bounds[1] + offset) / 3 : bounds[1];
    }

    return offset;
  },
  _calcTargetOffset: function _calcTargetOffset(offsetRatio, isFast) {
    var result;

    if (isFast) {
      result = Math.ceil(Math.abs(offsetRatio));

      if (offsetRatio < 0) {
        result = -result;
      }
    } else {
      result = Math.round(offsetRatio);
    }

    return result;
  }
});
/**
 * @name UI Events.dxswipestart
 * @type eventType
 * @type_function_param1 event:event
 * @type_function_param1_field1 cancel:boolean
 * @module events/swipe
*/

/**
  * @name UI Events.dxswipe
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 offset:number
  * @type_function_param1_field2 cancel:boolean
  * @module events/swipe
*/

/**
  * @name UI Events.dxswipeend
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 offset:number
  * @type_function_param1_field2 targetOffset:number
  * @module events/swipe
*/


(0, _emitter_registrator.default)({
  emitter: SwipeEmitter,
  events: [SWIPE_START_EVENT, SWIPE_EVENT, SWIPE_END_EVENT]
});