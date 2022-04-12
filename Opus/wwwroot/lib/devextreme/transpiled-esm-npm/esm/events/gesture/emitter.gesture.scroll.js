import eventsEngine from '../../events/core/events_engine';
import Class from '../../core/class';
var abstract = Class.abstract;
import { addNamespace, isDxMouseWheelEvent, isMouseEvent, eventData, eventDelta } from '../../events/utils/index';
import GestureEmitter from '../../events/gesture/emitter.gesture';
import registerEmitter from '../../events/core/emitter_registrator';
import { requestAnimationFrame, cancelAnimationFrame } from '../../animation/frame';
import devices from '../../core/devices';
import { compare as compareVersions } from '../../core/utils/version';
var realDevice = devices.real();
var SCROLL_EVENT = 'scroll';
var SCROLL_INIT_EVENT = 'dxscrollinit';
var SCROLL_START_EVENT = 'dxscrollstart';
var SCROLL_MOVE_EVENT = 'dxscroll';
var SCROLL_END_EVENT = 'dxscrollend';
var SCROLL_STOP_EVENT = 'dxscrollstop';
var SCROLL_CANCEL_EVENT = 'dxscrollcancel';
var Locker = Class.inherit(function () {
  var NAMESPACED_SCROLL_EVENT = addNamespace(SCROLL_EVENT, 'dxScrollEmitter');
  return {
    ctor: function ctor(element) {
      this._element = element;
      this._locked = false;

      this._proxiedScroll = e => {
        if (!this._disposed) {
          this._scroll(e);
        }
      };

      eventsEngine.on(this._element, NAMESPACED_SCROLL_EVENT, this._proxiedScroll);
    },
    _scroll: abstract,
    check: function check(e, callback) {
      if (this._locked) {
        callback();
      }
    },
    dispose: function dispose() {
      this._disposed = true;
      eventsEngine.off(this._element, NAMESPACED_SCROLL_EVENT, this._proxiedScroll);
    }
  };
}());
var TimeoutLocker = Locker.inherit(function () {
  return {
    ctor: function ctor(element, timeout) {
      this.callBase(element);
      this._timeout = timeout;
    },
    _scroll: function _scroll() {
      this._prepare();

      this._forget();
    },
    _prepare: function _prepare() {
      if (this._timer) {
        this._clearTimer();
      }

      this._locked = true;
    },
    _clearTimer: function _clearTimer() {
      clearTimeout(this._timer);
      this._locked = false;
      this._timer = null;
    },
    _forget: function _forget() {
      var that = this;
      this._timer = setTimeout(function () {
        that._clearTimer();
      }, this._timeout);
    },
    dispose: function dispose() {
      this.callBase();

      this._clearTimer();
    }
  };
}());
var WheelLocker = TimeoutLocker.inherit(function () {
  var WHEEL_UNLOCK_TIMEOUT = 400;
  return {
    ctor: function ctor(element) {
      this.callBase(element, WHEEL_UNLOCK_TIMEOUT);
      this._lastWheelDirection = null;
    },
    check: function check(e, callback) {
      this._checkDirectionChanged(e);

      this.callBase(e, callback);
    },
    _checkDirectionChanged: function _checkDirectionChanged(e) {
      if (!isDxMouseWheelEvent(e)) {
        this._lastWheelDirection = null;
        return;
      }

      var direction = e.shiftKey || false;
      var directionChange = this._lastWheelDirection !== null && direction !== this._lastWheelDirection;
      this._lastWheelDirection = direction;
      this._locked = this._locked && !directionChange;
    }
  };
}());
var PointerLocker = TimeoutLocker.inherit(function () {
  var POINTER_UNLOCK_TIMEOUT = 400;
  return {
    ctor: function ctor(element) {
      this.callBase(element, POINTER_UNLOCK_TIMEOUT);
    }
  };
}());

(function () {
  var ios8_greater = realDevice.ios && compareVersions(realDevice.version, [8]) >= 0;
  var android5_greater = realDevice.android && compareVersions(realDevice.version, [5]) >= 0;

  if (!(ios8_greater || android5_greater)) {
    return;
  }

  PointerLocker = Locker.inherit(function () {
    return {
      _scroll: function _scroll() {
        this._locked = true;
        var that = this;
        cancelAnimationFrame(this._scrollFrame);
        this._scrollFrame = requestAnimationFrame(function () {
          that._locked = false;
        });
      },
      check: function check(e, callback) {
        cancelAnimationFrame(this._scrollFrame);
        cancelAnimationFrame(this._checkFrame);
        var that = this;
        var callBase = this.callBase;
        this._checkFrame = requestAnimationFrame(function () {
          callBase.call(that, e, callback);
          that._locked = false;
        });
      },
      dispose: function dispose() {
        this.callBase();
        cancelAnimationFrame(this._scrollFrame);
        cancelAnimationFrame(this._checkFrame);
      }
    };
  }());
})();

var ScrollEmitter = GestureEmitter.inherit(function () {
  var INERTIA_TIMEOUT = 100;
  var VELOCITY_CALC_TIMEOUT = 200;
  var FRAME_DURATION = Math.round(1000 / 60);
  return {
    ctor: function ctor(element) {
      this.callBase.apply(this, arguments);
      this.direction = 'both';
      this._pointerLocker = new PointerLocker(element);
      this._wheelLocker = new WheelLocker(element);
    },
    validate: function validate() {
      return true;
    },
    configure: function configure(data) {
      if (data.scrollTarget) {
        this._pointerLocker.dispose();

        this._wheelLocker.dispose();

        this._pointerLocker = new PointerLocker(data.scrollTarget);
        this._wheelLocker = new WheelLocker(data.scrollTarget);
      }

      this.callBase(data);
    },
    _init: function _init(e) {
      this._wheelLocker.check(e, function () {
        if (isDxMouseWheelEvent(e)) {
          this._accept(e);
        }
      }.bind(this));

      this._pointerLocker.check(e, function () {
        var skipCheck = this.isNative && isMouseEvent(e);

        if (!isDxMouseWheelEvent(e) && !skipCheck) {
          this._accept(e);
        }
      }.bind(this));

      this._fireEvent(SCROLL_INIT_EVENT, e);

      this._prevEventData = eventData(e);
    },
    move: function move(e) {
      this.callBase.apply(this, arguments);
      e.isScrollingEvent = this.isNative || e.isScrollingEvent;
    },
    _start: function _start(e) {
      this._savedEventData = eventData(e);

      this._fireEvent(SCROLL_START_EVENT, e);

      this._prevEventData = eventData(e);
    },
    _move: function _move(e) {
      var currentEventData = eventData(e);

      this._fireEvent(SCROLL_MOVE_EVENT, e, {
        delta: eventDelta(this._prevEventData, currentEventData)
      });

      var delta = eventDelta(this._savedEventData, currentEventData);

      if (delta.time > VELOCITY_CALC_TIMEOUT) {
        this._savedEventData = this._prevEventData;
      }

      this._prevEventData = eventData(e);
    },
    _end: function _end(e) {
      var endEventDelta = eventDelta(this._prevEventData, eventData(e));
      var velocity = {
        x: 0,
        y: 0
      };

      if (!isDxMouseWheelEvent(e) && endEventDelta.time < INERTIA_TIMEOUT) {
        var delta = eventDelta(this._savedEventData, this._prevEventData);
        var velocityMultiplier = FRAME_DURATION / delta.time;
        velocity = {
          x: delta.x * velocityMultiplier,
          y: delta.y * velocityMultiplier
        };
      }

      this._fireEvent(SCROLL_END_EVENT, e, {
        velocity: velocity
      });
    },
    _stop: function _stop(e) {
      this._fireEvent(SCROLL_STOP_EVENT, e);
    },
    cancel: function cancel(e) {
      this.callBase.apply(this, arguments);

      this._fireEvent(SCROLL_CANCEL_EVENT, e);
    },
    dispose: function dispose() {
      this.callBase.apply(this, arguments);

      this._pointerLocker.dispose();

      this._wheelLocker.dispose();
    },
    _clearSelection: function _clearSelection() {
      if (this.isNative) {
        return;
      }

      return this.callBase.apply(this, arguments);
    },
    _toggleGestureCover: function _toggleGestureCover() {
      if (this.isNative) {
        return;
      }

      return this.callBase.apply(this, arguments);
    }
  };
}());
registerEmitter({
  emitter: ScrollEmitter,
  events: [SCROLL_INIT_EVENT, SCROLL_START_EVENT, SCROLL_MOVE_EVENT, SCROLL_END_EVENT, SCROLL_STOP_EVENT, SCROLL_CANCEL_EVENT]
});
export default {
  init: SCROLL_INIT_EVENT,
  start: SCROLL_START_EVENT,
  move: SCROLL_MOVE_EVENT,
  end: SCROLL_END_EVENT,
  stop: SCROLL_STOP_EVENT,
  cancel: SCROLL_CANCEL_EVENT,
  scroll: SCROLL_EVENT
};