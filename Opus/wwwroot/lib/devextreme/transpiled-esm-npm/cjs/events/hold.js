"use strict";

exports.default = void 0;

var _index = require("./utils/index");

var _emitter = _interopRequireDefault(require("./core/emitter"));

var _emitter_registrator = _interopRequireDefault(require("./core/emitter_registrator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var abs = Math.abs;
var HOLD_EVENT_NAME = 'dxhold';
var HOLD_TIMEOUT = 750;
var TOUCH_BOUNDARY = 5;

var HoldEmitter = _emitter.default.inherit({
  start: function start(e) {
    this._startEventData = (0, _index.eventData)(e);

    this._startTimer(e);
  },
  _startTimer: function _startTimer(e) {
    var holdTimeout = 'timeout' in this ? this.timeout : HOLD_TIMEOUT;
    this._holdTimer = setTimeout(function () {
      this._requestAccept(e);

      this._fireEvent(HOLD_EVENT_NAME, e, {
        target: e.target
      });

      this._forgetAccept();
    }.bind(this), holdTimeout);
  },
  move: function move(e) {
    if (this._touchWasMoved(e)) {
      this._cancel(e);
    }
  },
  _touchWasMoved: function _touchWasMoved(e) {
    var delta = (0, _index.eventDelta)(this._startEventData, (0, _index.eventData)(e));
    return abs(delta.x) > TOUCH_BOUNDARY || abs(delta.y) > TOUCH_BOUNDARY;
  },
  end: function end() {
    this._stopTimer();
  },
  _stopTimer: function _stopTimer() {
    clearTimeout(this._holdTimer);
  },
  cancel: function cancel() {
    this._stopTimer();
  },
  dispose: function dispose() {
    this._stopTimer();
  }
});
/**
  * @name UI Events.dxhold
  * @type eventType
  * @type_function_param1 event:event
  * @module events/hold
*/


(0, _emitter_registrator.default)({
  emitter: HoldEmitter,
  bubble: true,
  events: [HOLD_EVENT_NAME]
});
var _default = {
  name: HOLD_EVENT_NAME
};
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;