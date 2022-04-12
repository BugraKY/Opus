import { eventData, eventDelta } from './utils/index';
import Emitter from './core/emitter';
import registerEmitter from './core/emitter_registrator';
var abs = Math.abs;
var HOLD_EVENT_NAME = 'dxhold';
var HOLD_TIMEOUT = 750;
var TOUCH_BOUNDARY = 5;
var HoldEmitter = Emitter.inherit({
  start: function start(e) {
    this._startEventData = eventData(e);

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
    var delta = eventDelta(this._startEventData, eventData(e));
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

registerEmitter({
  emitter: HoldEmitter,
  bubble: true,
  events: [HOLD_EVENT_NAME]
});
export default {
  name: HOLD_EVENT_NAME
};